export const KOTLIN_BENCHMARK_TITLE = 'Kotlin Benchmark' as const;
export const KOTLIN_BENCHMARK_URL = '/benchmark/' as const;
export const METHODOLOGY_URL = '/benchmark/methodology/' as const;
export const ARCHIVE_TITLE = 'Archive' as const;
export const ARCHIVE_URL = '/benchmark/archive/' as const;
export const LEADERBOARD_TITLE = 'Leaderboard' as const;
export const METHODOLOGY_TITLE = 'Methodology' as const;

/** Secondary navigation shared by the benchmark subpages; the landing page hides it. */
export const BENCHMARK_TOP_MENU_ITEMS = [
    { url: KOTLIN_BENCHMARK_URL, title: LEADERBOARD_TITLE },
    { url: METHODOLOGY_URL, title: METHODOLOGY_TITLE },
    { url: ARCHIVE_URL, title: ARCHIVE_TITLE },
];
