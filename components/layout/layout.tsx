import React, { FC, useMemo } from 'react';
import Head from 'next/head';

import { useRouter } from 'next/router';

import cn from 'classnames';

import styles from './layout.module.css';

interface CommunityLayoutProps {
    title: string;
    description?: string;
    ogImageName?: string;
    darkTheme?: boolean;
    children: React.ReactNode;
}

export const Layout: FC<CommunityLayoutProps> = ({ title, ogImageName, description, children, darkTheme }) => {
    const router = useRouter();

    const ogImagePath = useMemo(
        () => `https://kotlinlang.org/assets/images/open-graph/${ogImageName ? ogImageName : 'general.png'}`,
        [ogImageName]
    );

    const ogImageTwitterPath = useMemo(
        () => (ogImageName ? ogImagePath : 'https://kotlinlang.org/assets/images/twitter/general.png'),
        [ogImageName, ogImagePath]
    );

    return (
        <>
            <Head>
                <title>{title}</title>

                <meta property="og:title" content={title} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={'https://kotlinlang.org' + router.pathname} />

                <meta property="og:image" content={ogImagePath} />

                {description && <meta property="og:description" content={description} />}
                <meta property="og:site_name" content="Kotlin" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@kotlin" />
                <meta name="twitter:title" content={title} />
                {description && <meta name="twitter:description" content={description} />}
                <meta name="twitter:image:src" content={ogImageTwitterPath} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" rel="stylesheet" />

            </Head>

            {children}
        </>
    );
};

function addTrailingSlash(path: string): string {
    return path.endsWith('/') ? path : `${path}/`;
}
