import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Button } from '@rescui/button';
import { ThemeProvider } from '@rescui/ui-contexts';

import { LandingLayout, LandingLayoutProps } from '../../../components/landing-layout/landing-layout';
import { CaseStudyPageContent } from '../../../blocks/case-studies/page-content/case-study-page-content';

import '@jetbrains/kotlin-web-site-ui/out/components/layout-v2';
import { CaseStudyPageHero } from '../../../blocks/case-studies/page-hero/case-study-page-hero';

const MULTIPLATFORM_MOBILE_TITLE = 'Kotlin Multiplatform' as const;
const MULTIPLATFORM_MOBILE_URL = '/multiplatform/' as const;

const TOP_MENU_ITEMS: LandingLayoutProps['topMenuItems'] = [
    {
        title: 'Compose Multiplatform',
        url: '/compose-multiplatform/'
    },
    {
        title: 'Success stories',
        url: '/case-studies/?type=multiplatform'
    }
];

const GET_STARTED_URL = '/docs/multiplatform/get-started.html' as const;

interface CaseStudyProps {
    content: string;
    frontmatter: {
        title: string;
        id: string;
        slug: string;
        [key: string]: any;
    };
}

export default function MultiplatformCaseStudy({ content, frontmatter }: CaseStudyProps) {
    return (
        <LandingLayout
            dataTestId={'multiplatform-case-study'}
            title={`${frontmatter.title} Case Study | Kotlin Multiplatform`}
            ogImageName={'multiplatform.png'}
            description={''}
            currentTitle={MULTIPLATFORM_MOBILE_TITLE}
            currentUrl={MULTIPLATFORM_MOBILE_URL}
            topMenuTitle={MULTIPLATFORM_MOBILE_TITLE}
            topMenuHomeUrl={MULTIPLATFORM_MOBILE_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href={GET_STARTED_URL}>Get started</Button>}
            canonical={`https://kotlinlang.org/multiplatform/case-studies/${frontmatter.slug}`}
            theme="light"
            forceDarkTopMenu={true}
        >
            <div className="ktl-layout-to-2">
                <ThemeProvider theme='light'>
                    <CaseStudyPageHero frontmatter={frontmatter} />
                    <CaseStudyPageContent content={content} />
                </ThemeProvider>
            </div>
        </LandingLayout>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const contentDir = path.join(process.cwd(), 'data/case-studies/content');
    const files = fs.readdirSync(contentDir);

    const paths = files
        .filter(filename => filename.endsWith('.md'))
        .map(filename => {
            const filePath = path.join(contentDir, filename);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data } = matter(fileContent);
            return {
                params: { id: data.slug }
            };
        });

    return {
        paths,
        fallback: false
    };
};

export const getStaticProps: GetStaticProps<CaseStudyProps> = async ({ params }) => {
    const id = params?.id as string;
    const contentDir = path.join(process.cwd(), 'data/case-studies/content');
    const files = fs.readdirSync(contentDir);

    const filename = files.find(file => {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);
        return data.slug === id;
    });

    if (!filename) {
        return { notFound: true };
    }

    const filePath = path.join(contentDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { content, data } = matter(fileContent);

    return {
        props: {
            content,
            frontmatter: data as CaseStudyProps['frontmatter']
        }
    };
};
