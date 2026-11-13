export type ThemeName =
    | 'default'
    | 'red'
    | 'orange'
    | 'gray'
    | 'purple'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'pink'
    | 'fallback';

export type Theme = {
    theme: ThemeName;
    scheme: 'light' | 'dark';
    warning?: string;
};

const themes: Record<string, Omit<Theme, 'warning'>> = {
    default: { theme: 'default', scheme: 'light' },
    // Pair 1 — hero sections: dark copy over the page's banner images (or the default hero banner)
    // under a light readability shade.
    red: { theme: 'red', scheme: 'light' },
    orange: { theme: 'orange', scheme: 'light' },
    // Pair 2 — common core sections: dark copy on a plain light background.
    gray: { theme: 'gray', scheme: 'light' },
    purple: { theme: 'purple', scheme: 'light' },
    // Pair 3 — in-page highlight sections: banner images or the default highlight colour.
    yellow: { theme: 'yellow', scheme: 'light' },
    green: { theme: 'green', scheme: 'light' },
    // Notion stores the color its UI shows as "green" as "teal".
    teal: { theme: 'green', scheme: 'light' },
    // Pair 4 — custom sections: styled by the web team per request; light defaults until then.
    blue: { theme: 'blue', scheme: 'light' },
    pink: { theme: 'pink', scheme: 'light' },
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
