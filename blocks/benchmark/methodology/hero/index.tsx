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
            intro={
                <>
                    See how the Kotlin Benchmark is&nbsp;built: {methodology.totalTasks}&nbsp;tasks from{' '}
                    {methodology.repositoryCountWord} open-source Kotlin repositories, SWE-bench-based methodology,
                    and&nbsp;future plans.
                </>
            }
            testId="methodology-hero"
            titleTestId="methodology-title"
        >
            <MethodologyVersionSwitcher version={methodology.version} />
        </BenchPageHeader>
    );
}
