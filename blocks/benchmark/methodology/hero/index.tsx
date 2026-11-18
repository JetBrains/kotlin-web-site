import React from 'react';
import { MethodologyVersion } from '../versions';
import { MethodologyVersionSwitcher } from '../version-switcher';
import { BenchPageHeader } from '../../page-header';

interface MethodologyHeroProps {
    methodology: MethodologyVersion;
}

export function MethodologyHero({ methodology }: MethodologyHeroProps) {
    return (
        <BenchPageHeader
            title={<>The Kotlin Benchmark&nbsp;— Methodology &&nbsp;Outlook</>}
            intro={methodology.summary}
            testId="methodology-hero"
            titleTestId="methodology-title"
        >
            <MethodologyVersionSwitcher version={methodology.version} />
        </BenchPageHeader>
    );
}
