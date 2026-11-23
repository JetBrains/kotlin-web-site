import cn from 'classnames';

import { ArrowRightIcon } from '@rescui/icons';
import { ThemeProvider } from '@rescui/ui-contexts';
import { useTextStyles } from '@rescui/typography';

import styles from './links.module.css';

// The Code of Conduct URL comes from the program doc; the terms and Brand Assets URLs are still pending (KTL-5273).
const LINKS = [
    // TODO(marketing): replace with the real Terms & Conditions URL before the release (KTL-5273).
    { id: 'terms', title: 'Terms and Conditions', href: '#' },
    { id: 'conduct', title: 'Code of Conduct', href: 'https://github.com/jetbrains#code-of-conduct' },
    // TODO(marketing): replace with the real Brand Assets URL before the release (KTL-5273).
    { id: 'assets', title: 'Brand Assets', href: '#' }
] as const;

function LinksList() {
    const textCn = useTextStyles();

    return (
        <div className={cn('ktl-layout-v2', 'ktl-layout--center', textCn('rs-text-1'), styles.content)}>
            {LINKS.map((link) => (
                <a
                    key={link.id}
                    className={cn(textCn('rs-link', { hardness: 'hard', mode: 'clear' }), styles.link)}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="kotlin-ambassador-link"
                >
                    {link.title}
                    <ArrowRightIcon className={styles.linkIcon} aria-hidden="true" />
                </a>
            ))}
        </div>
    );
}

export function Links() {
    return (
        <section className={styles.links} data-testid="kotlin-ambassador-links">
            <ThemeProvider theme="dark">
                <LinksList />
            </ThemeProvider>
        </section>
    );
}
