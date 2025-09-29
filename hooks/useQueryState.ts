import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';

/* Two-way synchronization between React state and URL query parameter.
 * @param key - Query parameter name
 * @param parser - Parse from URL string to type T
 * @param serializer - Serialize from type T to URL string
*/
export function useQueryState<T>(
    key: string,
    parse: (value: unknown) => T,
    serialize: (value: T) => string | undefined
) {
    const router = useRouter();
    const [state, setState] = useState<T>(() => parse(router.query[key]));

    useEffect(() => {
        setState(parse(router.query[key]));
    }, [router.query[key], parse]);

    const updateState = useCallback((value: T, onComplete?: () => void) => {
        const currentParams = new URLSearchParams(window.location.search);
        const query: Record<string, string> = {};
        currentParams.forEach((value, key) => {
            query[key] = value;
        });

        const serializedValue = serialize(value);
        if (serializedValue === undefined) {
            delete query[key];
        } else {
            query[key] = serializedValue;
        }

        router.replace({ pathname: router.pathname, query }, undefined, { shallow: true }).then(onComplete);
    }, [router, key, serialize]);

    return [state, updateState] as const;
}