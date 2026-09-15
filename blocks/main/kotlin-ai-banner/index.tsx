import React from 'react';

import cn from 'classnames';

import { Button } from '@rescui/button';
import { ArrowTopRightOutlineIcon } from '@rescui/icons';
import { ThemeProvider } from '@rescui/ui-contexts';
import { useTextStyles } from '@rescui/typography';
import { useML } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import { KOTLIN_BENCHMARK_URL } from '../../benchmark/constants';

import styles from './kotlin-ai-banner.module.css';

function KotlinAiBannerContent() {
    const textCn = useTextStyles();
    const isCompact = useML();
    const size = isCompact ? 'm' : 'l';

    return (
        <section className={styles.banner} data-testid={'kotlin-ai-banner-block'}>
            <h2 className={cn(textCn('rs-h2'), styles.title)}>
                Kotlin,
                <br className={styles.titleBreak} /> Built for the AI Era
            </h2>
            <p className={cn(textCn('rs-text-1', { hardness: 'hard' }), styles.text)}>
                Null safety and concise syntax already make Kotlin a language AI gets right.
                <br className={styles.sentenceBreak} /> We&rsquo;re making it even better with open benchmarks and
                agent-ready tooling.
            </p>
            <div className={styles.buttons}>
                <Button
                    mode="rock"
                    size={size}
                    href={KOTLIN_BENCHMARK_URL}
                    icon={<ArrowTopRightOutlineIcon size={size} />}
                    iconPosition="right"
                    allowMultiline={isCompact}
                >
                    Explore the Kotlin Benchmark
                </Button>
                <Button
                    mode="outline"
                    size={size}
                    href="/docs/kotlin-ai-apps-development-overview.html"
                    icon={<ArrowTopRightOutlineIcon size={size} />}
                    iconPosition="right"
                    allowMultiline={isCompact}
                >
                    Build AI apps with Kotlin
                </Button>
            </div>
        </section>
    );
}

export function KotlinAiBanner() {
    return (
        <ThemeProvider theme="dark">
            <KotlinAiBannerContent />
        </ThemeProvider>
    );
}
