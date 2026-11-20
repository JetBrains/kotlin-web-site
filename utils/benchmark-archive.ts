import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';

import { BenchEdition, toEdition } from './benchmark-leaderboard';

export const ARCHIVE_DIR = 'data/benchmark/archive';

/** Every archived edition, newest first */
export function readEditions(): BenchEdition[] {
    const dir = path.join(process.cwd(), ARCHIVE_DIR);

    if (!fs.existsSync(dir)) {
        throw new Error(
            `Benchmark archive directory not found: "${dir}". ` +
                `Archived leaderboards live in ${ARCHIVE_DIR}/<YYYY-MM-DD>.yml — ` +
                `create the folder, or update ARCHIVE_DIR in utils/benchmark-archive.ts.`
        );
    }

    const files = fs
        .readdirSync(dir)
        .filter((filename) => filename.endsWith('.yml') || filename.endsWith('.yaml'))
        .map((filename) => ({
            filename,
            edition: toEdition(parseYaml(fs.readFileSync(path.join(dir, filename), 'utf-8'))),
        }));

    return files.map(({ edition }) => edition).sort((a, b) => b.date.localeCompare(a.date));
}
