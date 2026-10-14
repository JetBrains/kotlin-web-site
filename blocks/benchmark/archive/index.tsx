import React, { useCallback, useMemo } from 'react';
import cn from 'classnames';
import { Select } from '@rescui/select';
import { useTextStyles } from '@rescui/typography';
import { ArrowLeftIcon } from '@rescui/icons';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import { useQueryState } from '@/hooks';
import { parseEnum } from '@/utils/queryParser';

import styles from './archive.module.css';
import { Leaderboard } from '../leaderboard';
import { BenchEdition, formatBenchDate } from '../leaderboard/leaderboard-data';
import { findMethodology, methodologyTitle, methodologyUrl } from '../methodology/versions';
import { KOTLIN_BENCHMARK_URL } from '../constants';

function MethodologyLink({ version }: { version: number }) {
    const textCn = useTextStyles();
    const methodology = findMethodology(version);

    // An edition can only point at a methodology page that has been published.
    if (!methodology) return <>Methodology v{version}</>;

    return (
        <a href={methodologyUrl(version)} className={textCn('rs-link', { external: false })}>
            {methodologyTitle(methodology)}
        </a>
    );
}

interface BenchArchiveProps {
    /** Published editions, newest first. */
    editions: BenchEdition[];
}

export function BenchArchive({ editions }: BenchArchiveProps) {
    const textCn = useTextStyles();
    const size = useMS() ? 'm' : 'l';

    const dates = useMemo(() => editions.map((edition) => edition.date), [editions]);
    const defaultDate = dates[0] ?? '';

    // parse/serialize are passed to useQueryState's effect deps, so they must stay stable.
    const parse = useCallback((value: unknown) => parseEnum(value, dates, defaultDate), [dates, defaultDate]);
    const serialize = useCallback(
        (value: string) => (value === defaultDate ? undefined : value),
        [defaultDate]
    );

    const [selectedDate, setSelectedDate] = useQueryState<string>('date', parse, serialize);

    const options = useMemo(
        () => editions.map((edition) => ({ label: formatBenchDate(edition.date), value: edition.date })),
        [editions]
    );
    const selectedOption = options.find((option) => option.value === selectedDate) ?? options[0] ?? null;

    // A single edition needs no selector; its date becomes the page subtitle instead.
    const hasSelector = editions.length > 1;

    if (editions.length === 0) {
        return (
            <section className={cn(styles.archive, 'ktl-layout', 'ktl-layout--center')} data-testid="bench-archive">
                <h1 className={cn(styles.title, textCn('rs-h1'))} data-testid="bench-archive-title">
                    The Kotlin Benchmark Archive
                </h1>
                <p className={cn(styles.subtitle, textCn('rs-text-1', { hardness: 'hard' }))}>
                    No archived leaderboards have been published yet.
                </p>
            </section>
        );
    }

    return (
        <>
            <section className={cn(styles.archive, 'ktl-layout', 'ktl-layout--center')} data-testid="bench-archive">
                <a
                    href={KOTLIN_BENCHMARK_URL}
                    className={cn(styles.back, textCn('rs-text-2', { hardness: 'hard' }))}
                    data-testid="bench-archive-back"
                >
                    <ArrowLeftIcon size="s" className={styles.backIcon} />
                    Current leaderboard
                </a>
                <h1 className={cn(styles.title, textCn('rs-h1'))} data-testid="bench-archive-title">
                    The Kotlin Benchmark Archive
                </h1>
                {hasSelector && (
                    <p
                        className={cn(styles.subtitle, textCn('rs-text-1', { hardness: 'hard' }))}
                        data-testid="bench-archive-subtitle"
                    >
                        To view historical performance data for previous models, select a version below.
                    </p>
                )}

                {hasSelector && (
                    <div className={styles.controls}>
                        <div className={styles.select} data-testid="bench-archive-select">
                            <Select
                                theme="dark"
                                size={size}
                                label="Select archive leaderboard"
                                options={options}
                                value={selectedOption}
                                onChange={(option) => option?.value && setSelectedDate(String(option.value))}
                            />
                        </div>
                    </div>
                )}
            </section>

            {/* Every edition is rendered so the archive stays complete in the static HTML;
                the selector only controls which one is on screen. */}
            {editions.map((edition) => (
                <section
                    key={edition.date}
                    hidden={edition.date !== selectedOption?.value}
                    data-testid="bench-archive-edition"
                    data-date={edition.date}
                >
                    {/* What the edition is: when it went live and which methodology produced it. */}
                    <p
                        className={cn(
                            styles.meta,
                            'ktl-layout',
                            'ktl-layout--center',
                            textCn('rs-text-1', { hardness: 'hard' })
                        )}
                        data-testid="bench-archive-edition-meta"
                    >
                        <span data-testid="bench-archive-edition-date">Published {formatBenchDate(edition.date)}</span>
                        <span className={styles.metaSeparator} aria-hidden="true">
                            ·
                        </span>
                        <span data-testid="bench-archive-methodology">
                            <MethodologyLink version={edition.methodology} />
                        </span>
                    </p>
                    <Leaderboard rows={edition.rows} />
                </section>
            ))}
        </>
    );
}
