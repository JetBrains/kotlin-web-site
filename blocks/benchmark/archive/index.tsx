import React, { useCallback, useMemo } from 'react';
import cn from 'classnames';
import { Select } from '@rescui/select';
import { useTextStyles } from '@rescui/typography';

import { useQueryState } from '@/hooks';
import { parseEnum } from '@/utils/queryParser';

import styles from './archive.module.css';
import { Leaderboard } from '../leaderboard';
import { BenchPageHeader } from '../page-header';
import { BenchEdition, formatBenchDate } from '../leaderboard/leaderboard-data';
import { findMethodology, methodologyTitle, methodologyUrl } from '../methodology/versions';

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

function Separator() {
    return (
        <span className={styles.separator} aria-hidden="true">
            ·
        </span>
    );
}

interface BenchArchiveProps {
    /** Published editions, newest first. */
    editions: BenchEdition[];
}

export function BenchArchive({ editions }: BenchArchiveProps) {
    const textCn = useTextStyles();

    const dates = useMemo(() => editions.map((edition) => edition.date), [editions]);
    const defaultDate = dates[0] ?? '';

    // parse/serialize are passed to useQueryState's effect deps, so they must stay stable.
    const parse = useCallback((value: unknown) => parseEnum(value, dates, defaultDate), [dates, defaultDate]);
    const serialize = useCallback((value: string) => (value === defaultDate ? undefined : value), [defaultDate]);

    const [selectedDate, setSelectedDate] = useQueryState<string>('date', parse, serialize);

    const options = useMemo(
        () => editions.map((edition) => ({ label: formatBenchDate(edition.date), value: edition.date })),
        [editions]
    );
    const selectedOption = options.find((option) => option.value === selectedDate) ?? options[0] ?? null;
    const selectedEdition = editions.find((edition) => edition.date === selectedOption?.value);

    return (
        <>
            <BenchPageHeader
                title="The Kotlin Benchmark Archive"
                intro={
                    selectedEdition
                        ? 'Earlier leaderboards, kept exactly as they were published.'
                        : 'No archived leaderboards have been published yet.'
                }
                testId="bench-archive"
                titleTestId="bench-archive-title"
            >
                {/* The same "date · links" line as on the current leaderboard. The date is either plain
                    text or, once there is a choice, the edition selector itself — never both. */}
                {selectedEdition && (
                    <div
                        className={cn(styles.meta, textCn('rs-text-1', { hardness: 'hard' }))}
                        data-testid="bench-archive-meta"
                    >
                        {editions.length > 1 ? (
                            <span className={styles.published}>
                                Published
                                <span className={styles.select} data-testid="bench-archive-select">
                                    <Select
                                        theme="dark"
                                        size="m"
                                        aria-label="Archived edition"
                                        options={options}
                                        value={selectedOption}
                                        onChange={(option) => option?.value && setSelectedDate(String(option.value))}
                                    />
                                </span>
                            </span>
                        ) : (
                            <span data-testid="bench-archive-edition-date">
                                Published {formatBenchDate(selectedEdition.date)}
                            </span>
                        )}
                        <Separator />
                        <span data-testid="bench-archive-methodology">
                            <MethodologyLink version={selectedEdition.methodology} />
                        </span>
                    </div>
                )}
            </BenchPageHeader>

            {/* Every edition is rendered so the archive stays complete in the static HTML;
                the selector only controls which one is on screen. */}
            {editions.map((edition) => (
                <section
                    key={edition.date}
                    hidden={edition !== selectedEdition}
                    data-testid="bench-archive-edition"
                    data-date={edition.date}
                >
                    <Leaderboard rows={edition.rows} />
                </section>
            ))}
        </>
    );
}
