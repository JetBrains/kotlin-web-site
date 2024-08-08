/**  @returns {[resolve: () => void, promise: Promise<void>]} */
export function createResolve() {
    /** @type {function():void} */
    let resolve;

    /** @type {Promise<void>} */
    const promise = new Promise(r => {
        resolve = () => {
            r();
        };
    });

    return [resolve, promise];
}
