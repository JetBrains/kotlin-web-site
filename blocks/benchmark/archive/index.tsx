import React, { useCallback, useMemo } from 'react';
import cn from 'classnames';
import { Button } from '@rescui/button';
import { Select } from '@rescui/select';
import { useTextStyles } from '@rescui/typography';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import { useQueryState } from '@/hooks';
import { parseEnum } from '@/utils/queryParser';

import styles from './archive.module.css';
import { Leaderboard } from '../leaderboard';
import { BenchEdition, formatDate } from '../leaderboard/leaderboard-data';
import { KOTLIN_BENCHMARK_URL } from '../constants';

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
        () => editions.map((edition) => ({ label: formatDate(edition.date), value: edition.date })),
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
                <h1 className={cn(styles.title, textCn('rs-h1'))} data-testid="bench-archive-title">
                    The Kotlin Benchmark Archive
                </h1>
                <p
                    className={cn(styles.subtitle, textCn('rs-text-1', { hardness: 'hard' }))}
                    data-testid="bench-archive-subtitle"
                >
                    {hasSelector
                        ? 'To view historical performance data for previous models, select a version below.'
                        : formatDate(defaultDate)}
                </p>

                <div className={styles.controls}>
                    {hasSelector && (
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
                    )}
                    <Button
                        mode="outline"
                        size={size}
                        href={KOTLIN_BENCHMARK_URL}
                        data-testid="bench-archive-back"
                    >
                        Back to current leaderboard
                    </Button>
                </div>
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
                    {hasSelector && (
                        <h2
                            className={cn(styles.editionTitle, 'ktl-layout', 'ktl-layout--center', textCn('rs-h2'))}
                            data-testid="bench-archive-edition-title"
                        >
                            Kotlin Benchmark&nbsp;— {formatDate(edition.date)}
                        </h2>
                    )}
                    <Leaderboard rows={edition.rows} />
                </section>
            ))}
        </>
    );
}
