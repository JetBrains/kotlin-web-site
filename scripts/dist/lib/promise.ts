export function createResolve(): [() => void, Promise<void>] {
    let resolve = () => {
    };

    const promise = new Promise<void>(r => {
        resolve = () => {
            r(undefined);
        };
    });

    return [resolve, promise];
}
