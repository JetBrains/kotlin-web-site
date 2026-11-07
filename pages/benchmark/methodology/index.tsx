import React from 'react';

import { MethodologyPage } from '@/blocks/benchmark/methodology/page';
import { latestMethodology } from '@/blocks/benchmark/methodology/versions';

export default function KotlinBenchmarkMethodology() {
    return <MethodologyPage version={latestMethodology.version} />;
}
