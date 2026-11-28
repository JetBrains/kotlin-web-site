import React from 'react';
import { BenchPageHeader } from '../page-header';

interface BenchHeroProps {
    /** The meta line under the intro. */
    children?: React.ReactNode;
}

export function BenchHero({ children }: BenchHeroProps) {
    return (
        <BenchPageHeader
            title="The Kotlin Benchmark"
            intro={
                <>
                    The Kotlin Benchmark is&nbsp;built to&nbsp;evaluate models on&nbsp;realistic, idiomatic Kotlin
                    engineering tasks across multiple&nbsp;dimensions.
                </>
            }
            testId="bench-hero"
            titleTestId="bench-hero-title"
            introTestId="bench-hero-intro"
        >
            {children}
        </BenchPageHeader>
    );
}
