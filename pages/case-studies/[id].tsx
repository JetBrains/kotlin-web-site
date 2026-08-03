import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';
import { BACKEND_TITLE, BACKEND_URL } from '@jetbrains/kotlin-web-site-ui/out/components/header';

import { LandingLayout, LandingLayoutProps } from '../../components/landing-layout/landing-layout';
import { CaseStudyPageContent } from '../../blocks/case-studies/page-content/case-study-page-content';
import { CaseStudyCtaBlock } from '../../blocks/case-studies/cta-block/case-study-cta-block';
import { CaseStudyPageHero } from '../../blocks/case-studies/page-hero/case-study-page-hero';
import {  CaseType } from '../../blocks/case-studies/case-studies';

import '@jetbrains/kotlin-web-site-ui/out/components/layout-v2';
import '../backend/styles.css';
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
        url: '/case-studies/?type=backend',
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
                title={`${frontmatter.title} Case Study | Kotlin Multiplatform`}
                ogImageName={'case-studies.png'}
                description={'Kotlin for multiplatform development'}
                currentTitle={MULTIPLATFORM_TITLE}
                currentUrl={MULTIPLATFORM_URL}
                topMenuTitle={MULTIPLATFORM_TITLE}
                topMenuHomeUrl={MULTIPLATFORM_URL}
                topMenuItems={MULTIPLATFORM_TOP_MENU_ITEMS}
                topMenuButton={<Button href={MULTIPLATFORM_GET_STARTED_URL}>Get started</Button>}
                canonical={`https://kotlinlang.org/case-studies/${frontmatter.slug}/`}
                theme="light"
                forceDarkTopMenu={true}
                dataTestId={'multiplatform-case-study'}
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
            title={`${frontmatter.title} Case Study | Kotlin for Backend`}
            ogImageName={'case-studies.png'}
            description={'Kotlin for Backend development'}
            currentTitle={BACKEND_TITLE}
            currentUrl={BACKEND_URL}
            topMenuTitle={BACKEND_TITLE}
            topMenuHomeUrl={BACKEND_URL}
            topMenuItems={SERVER_SIDE_TOP_MENU_ITEMS}
            topMenuButton={<Button href={'#get-started'}>Get started</Button>}
            canonical={`https://kotlinlang.org/case-studies/${frontmatter.slug}/`}
            theme="light"
            forceDarkTopMenu={true}
            dataTestId={'server-side-case-study-page'}
        >
            <ThemeProvider theme="light">
                <CaseStudyPageHero frontmatter={frontmatter} />
                <CaseStudyPageContent content={content} />
                <GetStartedServerSide theme="light" />
            </ThemeProvider>
        </LandingLayout>
    );
}

const CASE_STUDY_TYPES: CaseType[] = ['multiplatform', 'backend'];

interface CaseStudyFile {
    slug: string;
    filePath: string;
    caseType: CaseType;
}

function getAllCaseStudyFiles(): CaseStudyFile[] {
    const files: CaseStudyFile[] = [];

    for (const caseType of CASE_STUDY_TYPES) {
        const contentDir = path.join(process.cwd(), `data/case-studies/${caseType}`);
        if (!fs.existsSync(contentDir)) {
            throw new Error(
                `Case study content directory not found: "${contentDir}". ` +
                `If "${caseType}" was renamed, update CASE_STUDY_TYPES in pages/case-studies/[id].tsx ` +
                `and move the matching folder under data/case-studies/.`
            );
        }

        for (const filename of fs.readdirSync(contentDir)) {
            if (!filename.endsWith('.md')) continue;
            const filePath = path.join(contentDir, filename);
            const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
            files.push({ slug: data.slug, filePath, caseType });
        }
    }

    return files;
}

function findCaseStudyFile(slug: string): { filePath: string; caseType: CaseType } | null {
    const file = getAllCaseStudyFiles().find(f => f.slug === slug);
    return file ? { filePath: file.filePath, caseType: file.caseType } : null;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllCaseStudyFiles().map(file => ({ params: { id: file.slug } }));

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
