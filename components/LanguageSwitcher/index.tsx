import React, { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LOCALES, LOCALE_NAMES, LOCALE_DOC_BASE, DEFAULT_LOCALE, Locale } from '../../i18n/config';
import styles from './LanguageSwitcher.module.css';

interface LanguageSwitcherProps {
    slug: string;
}

function localeDocPath(locale: Locale, slug: string): string {
    return `${LOCALE_DOC_BASE[locale]}/${slug}`;
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ slug }) => {
    const router = useRouter();
    // infer current locale from path segment
    const pathParts = router.asPath.split('/').filter(Boolean);
    const localeInPath = LOCALES.find(l => l !== DEFAULT_LOCALE && pathParts.includes(l));
    const current: Locale = localeInPath ?? DEFAULT_LOCALE;

    return (
        <div className={styles.switcher} aria-label="Language switcher">
            {LOCALES.map(locale => (
                <Link
                    key={locale}
                    href={localeDocPath(locale, slug)}
                    className={locale === current ? styles.active : styles.option}
                    aria-current={locale === current ? 'page' : undefined}
                >
                    {LOCALE_NAMES[locale]}
                </Link>
            ))}
        </div>
    );
};
