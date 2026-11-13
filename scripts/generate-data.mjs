import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';

const DATA_DIR = path.join(process.cwd(), 'data');
const OUTPUT_DIR = path.join(process.cwd(), 'public/data');

// Downloaded Notion images of the synced CMS sites: `data/cms/<root id>/public/…` → `public/cms/<root id>/…`.
// Must match `CMS_ASSETS_PATH` in `utils/cms/constants.ts`.
const CMS_DATA_DIR = path.join(DATA_DIR, 'cms');
const CMS_ASSETS_DIR = path.join(process.cwd(), 'public/cms');
const CMS_SITE_ID = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/;

const FILES_TO_TRANSFORM = [
    'universities.yml',
];

function transformFile(filename) {
    const yamlFilePath = path.join(DATA_DIR, filename);
    const jsonFileName = filename.replace(/\.yml$/, '.json');
    const jsonOutputPath = path.join(OUTPUT_DIR, jsonFileName);

    try {
        console.log(`Converting ${filename} to JSON...`);

        if (!fs.existsSync(yamlFilePath)) {
            console.warn(`Warning: ${yamlFilePath} does not exist. Skipping.`);
            return;
        }

        const fileContent = fs.readFileSync(yamlFilePath, 'utf8');
        const data = parse(fileContent);

        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        fs.writeFileSync(jsonOutputPath, JSON.stringify(data, null, 2));

        console.log(`Data written to: ${path.relative(process.cwd(), jsonOutputPath)}`);
    } catch (error) {
        console.error(`Error generating data for ${filename}:`, error);
        process.exit(1);
    }
}

function copyCmsAssets() {
    fs.rmSync(CMS_ASSETS_DIR, { recursive: true, force: true });
    if (!fs.existsSync(CMS_DATA_DIR)) return;

    for (const entry of fs.readdirSync(CMS_DATA_DIR, { withFileTypes: true })) {
        const source = path.join(CMS_DATA_DIR, entry.name, 'public');
        if (!entry.isDirectory() || !CMS_SITE_ID.test(entry.name) || !fs.existsSync(source)) continue;

        const target = path.join(CMS_ASSETS_DIR, entry.name);
        fs.cpSync(source, target, { recursive: true });
        console.log(`CMS assets copied to: ${path.relative(process.cwd(), target)}`);
    }
}

function main() {
    FILES_TO_TRANSFORM.forEach(transformFile);
    copyCmsAssets();
}

main();