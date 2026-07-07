import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Markdown } from '../../../utils/mdToHtml';
import { Layout } from '../../../components/layout/layout';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';
import { LOCALES, DEFAULT_LOCALE, Locale } from '../../../i18n/config';

interface DocPageProps {
    title: string;
    description: string;
    content: string;
    locale: Locale;
    slug: string;
}

const I18N_ROOT = path.join(process.cwd(), 'i18n');

function translatedDocPath(locale: Locale, slug: string): string {
    return path.join(I18N_ROOT, locale, 'docs', 'topics', `${slug}.md`);
}

function listTranslatedSlugs(locale: Locale): string[] {
    const dir = path.join(I18N_ROOT, locale, 'docs', 'topics');
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace(/\.md$/, ''));
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths: { params: { locale: string; slug: string } }[] = [];

    for (const locale of LOCALES) {
        if (locale === DEFAULT_LOCALE) continue;
        for (const slug of listTranslatedSlugs(locale)) {
            paths.push({ params: { locale, slug } });
        }
    }

    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<DocPageProps> = async ({ params }) => {
    const locale = params?.locale as Locale;
    const slug = params?.slug as string;

    const filePath = translatedDocPath(locale, slug);
    if (!fs.existsSync(filePath)) return { notFound: true };

    const raw = fs.readFileSync(filePath, 'utf-8');
    const { content, data } = matter(raw);

    return {
        props: {
            title: (data.title as string) ?? slug,
            description: (data.description as string) ?? '',
            content,
            locale,
            slug,
        },
    };
};

export default function LocaleDocPage({ title, description, content, slug }: DocPageProps) {
    return (
        <Layout title={title} description={description}>
            <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
                <LanguageSwitcher slug={slug} />
                <Markdown>{content}</Markdown>
            </main>
        </Layout>
    );
}
