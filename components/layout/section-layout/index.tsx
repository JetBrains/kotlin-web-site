import { useCallback, useMemo } from 'react';

import { useRouter } from 'next/router';

import TopMenu from '@jetbrains/kotlin-web-site-ui/out/components/top-menu';

import { PageLayout, PageLayoutProps } from '../page-layout';

/**
 * Adds a trailing slash to a URL path if it doesn't already have one
 * @param path The URL path to process
 * @returns The URL path with a trailing slash
 */
export function addTrailingSlash(path: string): string {
    return path.endsWith('/') ? path : `${path}/`;
}

export type NavigationItem = {
    url: string;
    title: string;
}

export type SectionLayoutProps = Omit<PageLayoutProps, 'sticky'> & {
    items: NavigationItem[],
};

export function SectionLayout({ children, items, ...pageProps }: SectionLayoutProps) {
    const { pathname: url, push } = useRouter();
    const pathname = addTrailingSlash(url);

    // Find the active navigation item index
    const activeIndex = useMemo(
        () => items.map((item) => item.url).indexOf(pathname),
        [pathname, items]
    );

    // Handle navigation link clicks
    const linkHandler = useCallback(
        (event) => {
            event.preventDefault();
            push(event.target.getAttribute('href')).catch(() => false);
        },
        [push]
    );

    return (
        <PageLayout pathname={pathname} {...pageProps}>
            <TopMenu
                className={styles.topMenu}
                homeUrl={homeUrl}
                title={HomeTitle}
                activeIndex={activeIndex}
                items={items}
                linkHandler={linkHandler}
                mobileOverview={false}
            >
            </TopMenu>

            {children}
        </PageLayout>
    );
}
