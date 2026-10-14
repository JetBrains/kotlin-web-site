import React from 'react';
import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';
import { GetStaticProps } from 'next';
import { Button } from '@rescui/button';
import { GitHubIcon } from '@rescui/icons';

import { LandingLayout } from '@/components/landing-layout/landing-layout';

import { BenchArchive } from '@/blocks/benchmark/archive';
import { BenchEdition, toEdition } from '@/blocks/benchmark/leaderboard/leaderboard-data';
import {
    ARCHIVE_URL,
    BENCHMARK_TOP_MENU_ITEMS,
    KOTLIN_BENCHMARK_TITLE,
    KOTLIN_BENCHMARK_URL,
} from '@/blocks/benchmark/constants';
import { GITHUB_URL } from '@/pages/benchmark';

import styles from './index.module.css';

/*
 * NOTE (KTL-4939): this page is deliberately left indexable for now.
 * The site crawls the build output into sitemap.xml and the Algolia index
 * (scripts/dist/analyzer/reports/write.ts), so superseded leaderboards are
 * published like any other page. Elsewhere the convention is the opposite —
 * older API references and deprecated docs get "noindex, nofollow". Revisit
 * once more than one edition exists, or if archived numbers start ranking
 * above /benchmark/.
 */

const ARCHIVE_DIR = 'data/benchmark/archive';

interface ArchivePageProps {
    editions: BenchEdition[];
}

function readEditions(): BenchEdition[] {
    const dir = path.join(process.cwd(), ARCHIVE_DIR);

    if (!fs.existsSync(dir)) {
        throw new Error(
            `Benchmark archive directory not found: "${dir}". ` +
                `Archived leaderboards live in ${ARCHIVE_DIR}/<YYYY-MM-DD>.yml — ` +
                `create the folder, or update ARCHIVE_DIR in pages/benchmark/archive/index.tsx.`
        );
    }

    const files = fs
        .readdirSync(dir)
        .filter((filename) => filename.endsWith('.yml') || filename.endsWith('.yaml'))
        .map((filename) => ({
            filename,
            edition: toEdition(parseYaml(fs.readFileSync(path.join(dir, filename), 'utf-8'))),
        }));

    assertDistinctEditions(files);

    return files.map(({ edition }) => edition).sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * The selector and the ?date= URL identify an edition by its date, so two files with the same
 * date would silently render as one. Naming each file after its date keeps that visible when
 * copying an edition as a template.
 */
function assertDistinctEditions(files: { filename: string; edition: BenchEdition }[]) {
    const problems: string[] = [];
    const seen = new Map<string, string>();

    for (const { filename, edition } of files) {
        const expected = `${edition.date}${path.extname(filename)}`;
        if (filename !== expected) {
            problems.push(`${filename} has date "${edition.date}": rename it to ${expected}, or fix its date.`);
        }

        const duplicate = seen.get(edition.date);
        if (duplicate) {
            problems.push(`${filename} and ${duplicate} both have date "${edition.date}".`);
        }
        seen.set(edition.date, filename);
    }

    if (problems.length > 0) {
        throw new Error(
            `Invalid benchmark archive in ${ARCHIVE_DIR}. Each edition is one <YYYY-MM-DD>.yml named after its ` +
                `publication date:\n  - ${problems.join('\n  - ')}`
        );
    }
}

export default function KotlinBenchmarkArchive({ editions }: ArchivePageProps) {
    return (
        <LandingLayout
            dataTestId={'benchmark-archive'}
            title={'The Kotlin Benchmark Archive'}
            description={
                'Archived Kotlin Benchmark leaderboards. Browse historical results for AI coding agents on real Kotlin software engineering tasks.'
            }
            ogImageName={'benchmark.jpg'}
            currentTitle={KOTLIN_BENCHMARK_TITLE}
            currentUrl={ARCHIVE_URL}
            topMenuTitle={KOTLIN_BENCHMARK_TITLE}
            topMenuHomeUrl={KOTLIN_BENCHMARK_URL}
            topMenuItems={BENCHMARK_TOP_MENU_ITEMS}
            topMenuButton={
                <Button icon={<GitHubIcon />} href={GITHUB_URL} target="_blank" rel="noopener">
                    GitHub repo
                </Button>
            }
        >
            <div className={styles.wrapper}>
                <BenchArchive editions={editions} />
            </div>
        </LandingLayout>
    );
}

export const getStaticProps: GetStaticProps<ArchivePageProps> = async () => ({
    props: { editions: readEditions() },
});
