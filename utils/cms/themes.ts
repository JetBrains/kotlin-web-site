export type ThemeName = 'default' | 'gray' | 'purple' | 'red' | 'pink' | 'fallback';

export type Theme = {
    theme: ThemeName;
    scheme: 'light' | 'dark';
    warning?: string;
};

const themes: Record<string, Omit<Theme, 'warning'>> = {
    default: { theme: 'default', scheme: 'light' },
    gray: { theme: 'gray', scheme: 'light' },
    purple: { theme: 'purple', scheme: 'dark' },
    red: { theme: 'red', scheme: 'dark' },
    pink: { theme: 'pink', scheme: 'dark' },
};

export function themeFor(blockColor?: string | null): Theme {
    const color = blockColor?.replace(/_background$/, '') ?? 'default';
    const theme = themes[color];

    if (theme) return theme;

    return {
        theme: 'fallback',
        scheme: 'light',
        warning: `Unknown block color "${blockColor}"; using the fallback light theme.`,
    };
}
