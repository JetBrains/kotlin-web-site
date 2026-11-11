import React from 'react';
import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';

import { LandingLayout } from '../../components/landing-layout/landing-layout';
import { Blocks } from '../../components/cms/blocks';
import { DevProvider } from '../../components/cms/dev-context';
import type { NormalizedPage } from '../../utils/cms/content';
import { stylesheetFor } from '../../utils/cms/custom-css';
import { mockDataSource } from '../../utils/cms/data-source';
import { buildPage, buildSiteIndex, findPageId, summarizeWarnings } from '../../utils/cms/page-data';
import { getCanonicalUrl } from '../../utils/site-config';

import '../../components/cms/styles/page.css';
import '../../components/cms/styles/grid.css';
import '../../components/cms/styles/themes.css';
import '../../components/cms/styles/gallery.css';

// Pages are generated from mock data in `data/pages/` until a real CMS source replaces `mockDataSource`.
const dataSource = mockDataSource;

interface CmsPageProps {
    page: NormalizedPage;
    css: string;
    isDev: boolean;
}

type CmsPageParams = { slug: string };

export const getStaticPaths: GetStaticPaths<CmsPageParams> = async () => {
    const site = await buildSiteIndex(dataSource);
    for (const warning of site.warnings) console.warn(`[cms] ${warning.message} (${warning.notionUrl})`);

    return {
        paths: Object.values(site.pages).map(({ slug }) => ({ params: { slug } })),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<CmsPageProps, CmsPageParams> = async ({ params }) => {
    const site = await buildSiteIndex(dataSource);
    const pageId = params && findPageId(site, params.slug);
    if (!pageId) return { notFound: true };

    const page = await buildPage(dataSource, site, pageId);

    const summary = summarizeWarnings(page.path, page.warnings);
    if (summary) console.warn(`[cms] ${summary}`);

    return {
        props: {
            page,
            css: stylesheetFor(page.customCss),
            isDev: process.env.NODE_ENV !== 'production',
        },
    };
};

export default function CmsPage({ page, css, isDev }: CmsPageProps) {
    return (
        <LandingLayout
            title={page.title}
            description={page.description}
            canonical={getCanonicalUrl(page.path)}
            currentUrl={page.path}
            theme="light"
            hideTopMenu
            dataTestId="cms-page"
        >
            <Head>
                {/* Mock content: keep CMS pages out of search engines and the site search index. */}
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <DevProvider isDev={isDev}>
                <div className="nw-page">
                    <Blocks nodes={page.nodes} />
                </div>
            </DevProvider>
            {css && <style id="nw-custom-css-page" dangerouslySetInnerHTML={{ __html: css }} />}
        </LandingLayout>
    );
}
