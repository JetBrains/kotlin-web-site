export function parseEnum<T extends string>(
    value: unknown,
    allowedValues: readonly T[],
    defaultValue: T
): T {
    const str = String(value || defaultValue);
    return allowedValues.includes(str as T) ? (str as T) : defaultValue;
}

export function parseStringArray<T extends string>(
    value: unknown,
    allowedValues: readonly T[],
    defaultValue: T[]
): T[] {
    if (!value) {
        return defaultValue;
    }

    const list = String(value).split(',').map((x) => x.trim()).filter(Boolean);
    const set = new Set<T>();

    for (const item of list) {
        if (allowedValues.includes(item as T)) {
            set.add(item as T);
        }
    }

    return set.size === 0 ? defaultValue : Array.from(set);
}

export function parseBoolean(value: unknown, defaultValue: boolean = true): boolean {
    if (value === true || value === false) {
        return value;
    }
    const s = String(value || String(defaultValue)).toLowerCase();
    return s === 'true' || s === '1' || s === 'yes';
}