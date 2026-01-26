import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Button } from '@rescui/button';
import { SERVER_SIDE_TITLE, SERVER_SIDE_URL } from '@jetbrains/kotlin-web-site-ui/out/components/header';
import { LandingLayout } from '../../../components/landing-layout/landing-layout';
import { CaseStudyContent } from '../../../blocks/case-studies/content/case-study-content';
import { ThemeProvider } from '@rescui/ui-contexts';

import '../styles.css';

const TOP_MENU_ITEMS = [
    {
        url: '/case-studies/?type=server-side',
        title: 'Success stories'
    }
];

interface CaseStudyProps {
    content: string;
    frontmatter: {
        title: string;
        id: string;
        slug: string;
        [key: string]: any;
    };
}

export default function ServerSideCaseStudy({ content, frontmatter }: CaseStudyProps) {
    return (
        <LandingLayout
            title={`${frontmatter.title} Case Study | Kotlin for server-side`}
            ogImageName={'server-side.png'}
            description={''}
            currentTitle={SERVER_SIDE_TITLE}
            currentUrl={SERVER_SIDE_URL}
            topMenuTitle={SERVER_SIDE_TITLE}
            topMenuHomeUrl={SERVER_SIDE_URL}
            topMenuItems={TOP_MENU_ITEMS}
            topMenuButton={<Button href={'#get-started'}>Get started</Button>}
            canonical={`https://kotlinlang.org/server-side/case-studies/${frontmatter.slug}`}
            dataTestId={'server-side-case-study-page'}
        >
            <div className="ktl-layout-to-2">
                <ThemeProvider theme={'dark'}>
                    <CaseStudyContent content={content} frontmatter={frontmatter} />
                </ThemeProvider>
            </div>
        </LandingLayout>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const contentDir = path.join(process.cwd(), 'data/case-studies/content');
    if (!fs.existsSync(contentDir)) return { paths: [], fallback: false };

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
