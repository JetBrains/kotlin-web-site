import cn from 'classnames';

import { ArrowRightIcon } from '@rescui/icons';
import { ThemeProvider } from '@rescui/ui-contexts';
import { useTextStyles } from '@rescui/typography';

import styles from './links.module.css';

// TODO(marketing): replace placeholder URLs before the release (KTL-5273).
const LINKS = [
    { id: 'terms', title: 'Terms and Conditions', href: '#' },
    { id: 'conduct', title: 'Code of Conduct', href: '#' },
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
