import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';

const DATA_DIR = path.join(process.cwd(), 'data');
const OUTPUT_DIR = path.join(process.cwd(), 'public/data');

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

function main() {
    FILES_TO_TRANSFORM.forEach(transformFile);
}

main();