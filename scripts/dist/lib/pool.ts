import { availableParallelism as cpuSize, cpus } from 'node:os';
import { stderr, stdout } from 'node:process';
import { ChildProcess, fork, Serializable } from 'node:child_process';

import { createResolve } from './promise.js';

type OnResult<T> = (result: T) => Promise<void>;

type ForkStatus = 'init' | 'busy' | 'idle' | 'shutdown';
type Fork = ChildProcess & { status: ForkStatus };

function createFork(scriptFilename: string) {
    const instance = fork(scriptFilename, { stdio: 'pipe' }) as Fork;
    instance.status = 'init';
    return instance;
}

type Message<T> = { event: 'inited' } |
    { event: 'log', type: string, data?: T[] } |
    { event: 'result', data: T };

export class FixedThreadPool<MSG extends Serializable, RESULT> {
    forks: Fork[] = [];
    messages: MSG[] = [];

    constructor(
        scriptFilename: string,
        onResult: OnResult<RESULT>,
        poolSize: number = (cpuSize && cpuSize()) || cpus().length
    ) {
        this.forks = [...new Array(poolSize)].map((_, i) => {
                const forked: Fork = createFork(scriptFilename);

                forked.stdout?.pipe(stdout);
                forked.stderr?.pipe(stderr);

                forked
                    .on('exit', function forkExit(code) {
                        code && process.exit(code);
                    })
                    .on('error', function forkError(err) {
                        console.error(err);
                        process.exit(1);
                    })
                    .on('message', async (msg: Message<RESULT>) => {
                        switch (msg?.event) {
                            case 'inited':
                                forked.status = 'idle';
                                // console.log('init #' + i)
                                this.update();
                                break;

                            case 'result':
                                forked.status = 'idle';
                                // console.log('result #' + i)
                                this.update();
                                await onResult(msg.data);
                                break;

                            default:
                                console.warn('warn: unexpected message: ', JSON.stringify(msg));
                        }
                    });

                return forked;
            }
        );
    }

    _idleThread() {
        return this.forks.find(forked => forked.status === 'idle');
    }

    push(msg: MSG) {
        this.messages.push(msg);
        this.update();
        return this;
    }

    pushAll(list: MSG[]) {
        this.messages = [...this.messages, ...list];
        this.update();
        return this;
    }

    isIdle() {
        return Boolean(!this.messages.length && this.forks.every(forked => (
            forked.status !== 'busy'
        )));
    }

    shutdown() {
        this.forks.forEach(forked => {
            forked.status = 'shutdown';
            forked.kill();
        });
        this.forks = [];
        return this;
    }

    update() {
        const thread = this._idleThread();
        if (thread) {
            const next = this.messages.pop();
            if (next) {
                thread.status = 'busy';
                thread.send(next);
            }
        }

        return this;
    }
}

type NewTaskExecutorResult<M extends Serializable, R> = [FixedThreadPool<M, R>, Promise<void>, () => boolean]

export function newTaskExecutor<M extends Serializable, R>(
    scriptFilename: string,
    onReady: (data: R) => Promise<void>,
    isFinished: () => boolean = () => true
): NewTaskExecutorResult<M, R> {
    const [resolve, promise] = createResolve();

    const pool = new FixedThreadPool<M, R>(scriptFilename, async function onTaskReady(data: R) {
        await onReady(data);
        updateProgressState();
    });

    function updateProgressState() {
        const isFinish = pool.isIdle() && isFinished();

        if (isFinish) {
            pool.shutdown();
            resolve();
        }

        return isFinish;
    }

    return [pool, promise, updateProgressState];
}
