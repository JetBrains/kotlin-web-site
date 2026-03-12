import React, { FC, useMemo } from 'react';
import Head from 'next/head';

import { useRouter } from 'next/router';

import styles from './layout.module.css';
import { getCanonicalUrl, getSiteUrl } from '../../utils/site-config';

interface CommunityLayoutProps {
    title: string;
    description?: string;
    ogImageName?: string;
    darkTheme?: boolean;
    children: React.ReactNode;
    canonical?: string;
}

export const Layout: FC<CommunityLayoutProps> = ({ title, ogImageName, description, children, darkTheme, canonical }) => {
    const router = useRouter();

    const siteUrl = getSiteUrl();

    const ogImagePath = useMemo(
        () => `${siteUrl}/assets/images/open-graph/${ogImageName ? ogImageName : 'general.png'}`,
        [ogImageName, siteUrl]
    );

    const ogImageTwitterPath = useMemo(
        () => (ogImageName ? ogImagePath : `${siteUrl}/assets/images/twitter/general.png`),
        [ogImageName, ogImagePath, siteUrl]
    );

    const canonicalUrl = useMemo(() => {
        if (canonical) {
            return canonical;
        }
        return getCanonicalUrl(router.pathname);
    }, [canonical, router.pathname]);

    return (
        <>
            <Head>
                <title>{title}</title>

                <meta property="og:title" content={title} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={siteUrl + router.pathname} />

                <meta property="og:image" content={ogImagePath} />

                {description && <meta property="og:description" content={description} />}
                {description && <meta name="description" content={description} />}
                <meta property="og:site_name" content="Kotlin" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@kotlin" />
                <meta name="twitter:title" content={title} />
                {description && <meta name="twitter:description" content={description} />}
                <link rel="canonical" href={canonicalUrl} />
                <meta name="twitter:image:src" content={ogImageTwitterPath} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" rel="stylesheet" />
            </Head>

            <div className={styles.wrapper}>{children}</div>
        </>
    );
};
