import { ReactNode } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

const DEFAULT_OG_IMAGE = '/assets/images/open-graph/general.png' as const;

/**
 * Base layout props shared by all layout components
 */
export interface PageMetadataProps {
    /** Page title (used for both <title> tag and meta-tags) */
    title: string;

    /** Page description for meta tags */
    description?: string;

    /** Open Graph image URL or imported image */
    ogImage?: ImgSrc | string;

    /** Child components to render within the layout */
    children: ReactNode;
}

/**
 * PageMetadata component
 *
 * This component serves as the foundation for all layouts in the Kotlin website.
 * It handles common functionality that every page needs:
 * - Managing document head metadata (title, description)
 * - Setting up SEO tags (Open Graph, Twitter)
 * - Providing theme context
 * - Basic page structure
 */
export function PageMetadata({ title, description, ogImage, children }: PageMetadataProps) {
    const router = useRouter();
    const ogImagePath = ogImage.toString() || DEFAULT_OG_IMAGE;

    return <>
        <Head>
            <title>{title}</title>
            {description && <meta name="description" content={description} />}

            <link rel="preconnect" href="https://fonts.googleapis.com" />

            <meta property="og:site_name" content="Kotlin" />
            <meta property="og:title" content={title} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={router.asPath} />
            <meta property="og:image" content={ogImagePath} />
            {description && <meta property="og:description" content={description} />}

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@kotlin" />
            <meta name="twitter:title" content={title} />
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image:src" content={ogImagePath} />

            <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" rel="stylesheet" />
        </Head>
        {children}
    </>;
}
