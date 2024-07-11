import { cpus } from 'os';
import { fork } from 'child_process';

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
    constructor(script, onResult, poolSize = cpus().length - 2) {
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
                    forked.waits = true;
                    if (msg?.event === 'result') onResult(msg?.data);
                    this.update();
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
