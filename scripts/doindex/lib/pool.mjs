import { availableParallelism as cpuSize, cpus } from 'os';
import { fork } from 'child_process';
import { createResolve } from './index.mjs';

/**
 * @typedef {ChildProcess} Fork
 * @property {number} [id]
 * @property {boolean} [waits]
 */

export class FixedThreadPool {
    /** @type {Fork[]} */
    forks = [];
    /** @type {T[]} */
    messages = [];

    /**
     * @callback resultCallback
     * @param {T} result
     * @returns {void}
     */

    /**
     * @param {string} script
     * @param {resultCallback} onResult
     * @param {number} [poolSize]
     */
    constructor(script, onResult, poolSize = (cpuSize && cpuSize()) || cpus().length - 2) {
        this.forks = [...new Array(poolSize)].map(
            /**
             * @param {void} _
             * @param {number} i
             * @returns {Fork}
             */
            (_, i) => {
                /** @type Fork */
                const forked = fork(script);

                forked.id = i;
                forked.waits = false;

                forked.on('message', msg => {
                    switch (msg?.event) {
                        case 'inited':
                            forked.waits = true;
                            this.update();
                            break;

                        case 'log':
                            console[msg.type || 'log'](...(msg.data || []));
                            break;

                        case 'result':
                            forked.waits = true;
                            onResult(msg?.data);
                            this.update();
                            break;

                        default:
                            console.warn('warn: unexpected message: ', JSON.stringify(msg));
                    }
                });

                forked.on('exit', (code) => {
                    code && process.exit(code);
                });

                forked.on('error', err => {
                    console.error(err);
                    process.exit(1);
                });

                return forked;
            }
        );
    }

    _thread() {
        return this.forks.find(forked => forked.waits);
    }

    push(msg) {
        this.messages.push(msg);
        this.update();
        return this;
    }

    pushAll(list) {
        this.messages = [...this.messages, ...list];
        this.update();
        return this;
    }

    isIdle() {
        return !this.messages.length && this.forks.every(forked => forked.waits);
    }

    shutdown() {
        this.forks.forEach(forked => forked.kill());
    }

    update() {
        const thread = this._thread();

        if (thread && this.messages.length) {
            const next = this.messages.pop();
            thread.waits = false;
            thread.send(next);
        }
    }
}

export function newTaskExecutor(scriptPath, onReady, isFinished = () => true) {
    const [resolve, promise] = createResolve();

    const pool = new FixedThreadPool(scriptPath, function onTaskReady(data) {
        onReady(data);
        updateProgressState();
    });

    function updateProgressState() {
        const isFinish = isFinished() && pool.isIdle();

        if (isFinish) {
            pool.shutdown();
            resolve();
        }

        return isFinish;
    }

    return [pool, promise, updateProgressState];
}
