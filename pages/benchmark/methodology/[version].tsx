import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

import { MethodologyPage } from '@/blocks/benchmark/methodology/page';
import { latestMethodology, methodologyVersions } from '@/blocks/benchmark/methodology/versions';

interface VersionedMethodologyProps {
    version: number;
}

export default function KotlinBenchmarkVersionedMethodology({ version }: VersionedMethodologyProps) {
    return <MethodologyPage version={version} />;
}

/** Only superseded versions get a numbered URL; the latest is served at /benchmark/methodology/. */
export const getStaticPaths: GetStaticPaths = async () => ({
    paths: methodologyVersions
        .filter((methodology) => methodology.version !== latestMethodology.version)
        .map((methodology) => ({ params: { version: String(methodology.version) } })),
    fallback: false,
});

export const getStaticProps: GetStaticProps<VersionedMethodologyProps> = async ({ params }) => ({
    props: { version: Number(params?.version) },
});
