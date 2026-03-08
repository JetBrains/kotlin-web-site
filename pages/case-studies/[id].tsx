import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';
import { SERVER_SIDE_TITLE, SERVER_SIDE_URL } from '@jetbrains/kotlin-web-site-ui/out/components/header';

import { LandingLayout, LandingLayoutProps } from '../../components/landing-layout/landing-layout';
import { CaseStudyPageContent } from '../../blocks/case-studies/page-content/case-study-page-content';
import { CaseStudyCtaBlock } from '../../blocks/case-studies/cta-block/case-study-cta-block';
import { CaseStudyPageHero } from '../../blocks/case-studies/page-hero/case-study-page-hero';
import {  CaseType } from '../../blocks/case-studies/case-studies';

import '@jetbrains/kotlin-web-site-ui/out/components/layout-v2';
import '../server-side/styles.css';
import { GetStartedServerSide } from '../../blocks/server-side/get-started/get-started';

const MULTIPLATFORM_TITLE = 'Kotlin Multiplatform';
const MULTIPLATFORM_URL = '/multiplatform/';

const MULTIPLATFORM_TOP_MENU_ITEMS: LandingLayoutProps['topMenuItems'] = [
    {
        title: 'Compose Multiplatform',
        url: '/compose-multiplatform/'
    },
    {
        title: 'Success stories',
        url: '/case-studies/?type=multiplatform'
    },
    {
        title: 'Libraries',
        url: 'https://klibs.io/'
    }
];

const SERVER_SIDE_TOP_MENU_ITEMS: LandingLayoutProps['topMenuItems'] = [
    {
        url: '/case-studies/?type=server-side',
        title: 'Success stories'
    }
];

const MULTIPLATFORM_GET_STARTED_URL = '/docs/multiplatform/get-started.html';

interface CaseStudyProps {
    content: string;
    caseType: CaseType;
    frontmatter: {
        title: string;
        id: string;
        slug: string;
        [key: string]: any;
    };
}

export default function CaseStudy({ content, caseType, frontmatter }: CaseStudyProps) {
    if (caseType === 'multiplatform') {
        return (
            <LandingLayout
                dataTestId={'multiplatform-case-study'}
                title={`${frontmatter.title} Case Study | Kotlin Multiplatform`}
                ogImageName={'multiplatform.png'}
                description={'Kotlin for multiplatform development'}
                currentTitle={MULTIPLATFORM_TITLE}
                currentUrl={MULTIPLATFORM_URL}
                topMenuTitle={MULTIPLATFORM_TITLE}
                topMenuHomeUrl={MULTIPLATFORM_URL}
                topMenuItems={MULTIPLATFORM_TOP_MENU_ITEMS}
                topMenuButton={<Button href={MULTIPLATFORM_GET_STARTED_URL}>Get started</Button>}
                canonical={`https://kotlinlang.org/case-studies/${frontmatter.slug}`}
                theme="light"
                forceDarkTopMenu={true}
            >
                <ThemeProvider theme="light">
                    <CaseStudyPageHero frontmatter={frontmatter} />
                    <CaseStudyPageContent content={content} />
                    <CaseStudyCtaBlock url={MULTIPLATFORM_GET_STARTED_URL} />
                </ThemeProvider>
            </LandingLayout>
        );
    }

    return (
        <LandingLayout
            title={`${frontmatter.title} Case Study | Kotlin for server-side`}
            ogImageName={'case-studies.png'}
            description={'Kotlin for server-side development'}
            currentTitle={SERVER_SIDE_TITLE}
            currentUrl={SERVER_SIDE_URL}
            topMenuTitle={SERVER_SIDE_TITLE}
            topMenuHomeUrl={SERVER_SIDE_URL}
            topMenuItems={SERVER_SIDE_TOP_MENU_ITEMS}
            topMenuButton={<Button href={'#get-started'}>Get started</Button>}
            canonical={`https://kotlinlang.org/case-studies/${frontmatter.slug}`}
            dataTestId={'server-side-case-study-page'}
            theme="light"
            forceDarkTopMenu={true}
        >
            <ThemeProvider theme="light">
                <CaseStudyPageHero frontmatter={frontmatter} />
                <CaseStudyPageContent content={content} />
                <GetStartedServerSide theme="light" />
            </ThemeProvider>
        </LandingLayout>
    );
}

function findCaseStudyFile(slug: string): { filePath: string; caseType: CaseType } | null {
    const caseTypes: CaseType[] = ['multiplatform', 'server-side'];

    for (const caseType of caseTypes) {
        const contentDir = path.join(process.cwd(), `data/case-studies/${caseType}`);
        if (!fs.existsSync(contentDir)) continue;

        const files = fs.readdirSync(contentDir);
        const filename = files.find(file => {
            if (!file.endsWith('.md')) return false;
            const filePath = path.join(contentDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data } = matter(fileContent);
            return data.slug === slug;
        });

        if (filename) {
            return {
                filePath: path.join(contentDir, filename),
                caseType
            };
        }
    }

    return null;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const caseTypes: CaseType[] = ['multiplatform', 'server-side'];
    const paths: { params: { id: string } }[] = [];

    for (const caseType of caseTypes) {
        const contentDir = path.join(process.cwd(), `data/case-studies/${caseType}`);
        if (!fs.existsSync(contentDir)) continue;

        const files = fs.readdirSync(contentDir);
        for (const filename of files) {
            if (!filename.endsWith('.md')) continue;
            const filePath = path.join(contentDir, filename);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data } = matter(fileContent);
            paths.push({ params: { id: data.slug } });
        }
    }

    return {
        paths,
        fallback: false
    };
};

export const getStaticProps: GetStaticProps<CaseStudyProps> = async ({ params }) => {
    const slug = params?.id as string;
    const result = findCaseStudyFile(slug);

    if (!result) {
        return { notFound: true };
    }

    const fileContent = fs.readFileSync(result.filePath, 'utf-8');
    const { content, data } = matter(fileContent);

    return {
        props: {
            content,
            caseType: result.caseType,
            frontmatter: data as CaseStudyProps['frontmatter']
        }
    };
};
