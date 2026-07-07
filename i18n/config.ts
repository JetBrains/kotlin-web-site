export const LOCALES = ['en', 'zh-CN'] as const;
export type Locale = typeof LOCALES[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_NAMES: Record<Locale, string> = {
    'en': 'English',
    'zh-CN': '中文（简体）',
};

// en docs live at the canonical URL (served by existing infra)
export const LOCALE_DOC_BASE: Record<Locale, string> = {
    'en': '/docs',
    'zh-CN': '/docs/zh-CN',
};
