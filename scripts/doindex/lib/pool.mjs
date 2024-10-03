import { availableParallelism as cpuSize, cpus } from 'node:os';
import { stderr, stdout } from 'node:process';
import { fork } from 'node:child_process';
import { createResolve } from './index.mjs';

/**
 * @typedef {ChildProcess} Fork
 * @property {boolean} [waits]
 */

/**
 * @template Message
 */
export class FixedThreadPool {
    /** @type {Fork[]} */
    forks = [];
    /** @type {Message[]} */
    messages = [];

    /**
     * @param {string} script
     * @param {(result: *) => void} onResult
     * @param {number} [poolSize]
     */
    constructor(script, onResult, poolSize = (cpuSize && cpuSize()) || cpus().length) {
        this.forks = [...new Array(poolSize)].map(
            /** @returns {Fork} */
            () => {
                /** @type Fork */
                const forked = fork(script, { stdio: 'pipe' });

                forked.stdout.pipe(stdout);
                forked.stderr.pipe(stderr);

                forked.waits = false;

                forked
                    .on('exit', function forkExit(code) {
                        code && process.exit(code);
                    })
                    .on('error', function forkError(err) {
                        console.error(err);
                        process.exit(1);
                    })
                    .on('message',
                        /** @param {
                         *    {event: 'inited'} |
                         *    {event: 'log', type: string, data?: *[]} |
                         *    {event: 'result', data?: *}
                         * } [msg] */
                        msg => {
                            switch (msg?.event) {
                                case 'inited':
                                    forked.waits = true;
                                    this.update();
                                    break;

                                case 'result':
                                    forked.waits = true;
                                    onResult(msg.data);
                                    this.update();
                                    break;

                                default:
                                    console.warn('warn: unexpected message: ', JSON.stringify(msg));
                            }
                        }
                    );

                return forked;
            }
        );
    }

    /**
     * @private
     * @returns {Fork|void}
     */
    _idleThread() {
        return this.forks.find(forked => forked.waits);
    }

    /** @param {Message} msg */
    push(msg) {
        this.messages.push(msg);
        this.update();
        return this;
    }

    /** @param {Message[]} list */
    pushAll(list) {
        this.messages = [...this.messages, ...list];
        this.update();
        return this;
    }

    isIdle() {
        return Boolean(!this.messages.length && this.forks.every(forked => forked.waits));
    }

    shutdown() {
        this.forks.forEach(forked => {
            forked.kill();
            forked.waits = false;
        });
        this.forks = [];
        return this;
    }

    update() {
        const thread = this._idleThread();

        if (thread && this.messages.length) {
            const next = this.messages.pop();
            thread.waits = false;
            thread.send(next);
        }

        return this;
    }
}

function retTrue() {
    return true;
}

export function newTaskExecutor(scriptPath, onReady, isFinished = retTrue) {
    const [resolve, promise] = createResolve();

    const pool = new FixedThreadPool(scriptPath, function onTaskReady(data) {
        onReady(data);
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
