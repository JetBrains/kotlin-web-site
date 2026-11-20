import React from 'react';
import { GetStaticProps } from 'next';

import { BenchmarkLayout } from '@/blocks/benchmark/layout';
import { BenchArchive } from '@/blocks/benchmark/archive';
import { BenchEdition } from '@/utils/benchmark-leaderboard';
import { readEditions } from '@/utils/benchmark-archive';
import { ARCHIVE_URL } from '@/blocks/benchmark/constants';

import styles from './index.module.css';

interface ArchivePageProps {
    editions: BenchEdition[];
}

export default function KotlinBenchmarkArchive({ editions }: ArchivePageProps) {
    return (
        <BenchmarkLayout
            dataTestId={'benchmark-archive'}
            title={'The Kotlin Benchmark Archive'}
            description={
                'Archived Kotlin Benchmark leaderboards. Browse historical results for AI coding agents on real Kotlin software engineering tasks.'
            }
            currentUrl={ARCHIVE_URL}
            className={styles.wrapper}
        >
            <BenchArchive editions={editions} />
        </BenchmarkLayout>
    );
}

export const getStaticProps: GetStaticProps<ArchivePageProps> = async () => ({
    props: { editions: readEditions() },
});
