import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://kotlinlang.org';
const LLMS_FOLDERS = [
    'dist/docs/_llms',
    'dist/docs/multiplatform/_llms'
];


function extractTitle(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const firstLine = content.split('\n')[0].trim();

        if (firstLine.startsWith('#')) {
            return firstLine.replace(/^#+\s*/, '').trim();
        }

        // Fallback: use filename if no # found
        return path.basename(filePath, '.txt')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    } catch (error) {
        console.warn(`  Warning: Could not read title from ${filePath}:`, error.message);
        return path.basename(filePath, '.txt');
    }
}

/**
 * Return list of .txt files with their titles
 */
function scanLlmsFolder(folderPath) {
    const fullPath = path.join(process.cwd(), folderPath);

    if (!fs.existsSync(fullPath)) {
        console.log(`  Folder does not exist: ${folderPath} - skipping`);
        return [];
    }

    try {
        const files = fs.readdirSync(fullPath)
            .filter(file => file.endsWith('.txt'))
            .sort();

        console.log(`  Found ${files.length} files in ${folderPath}`);

        return files.map(file => ({
            fileName: file,
            title: extractTitle(path.join(fullPath, file))
        }));
    } catch (error) {
        console.warn(`  Warning: Could not read folder ${folderPath}:`, error.message);
        return [];
    }
}

function readIntro() {
    const introPath = path.join(path.dirname(new URL(import.meta.url).pathname), 'llms-intro.txt');
    try {
        return fs.readFileSync(introPath, 'utf-8').trim();
    } catch (error) {
        console.warn(`Warning: Could not read intro file: ${error.message}`);
        return 'Kotlin documentation';
    }
}

function generateLlmsIndex() {
    console.log('Starting llms.txt index generation...');

    let content = readIntro();

    let totalFiles = 0;

    for (const folderPath of LLMS_FOLDERS) {
        const folderName = folderPath.replace('dist/', '').replace('/_llms', '');
        console.log(`\nScanning ${folderName}...`);

        const files = scanLlmsFolder(folderPath);

        if (files.length === 0) continue;

        // Add file links
        for (const { fileName, title } of files) {
            const absoluteUrl = `${BASE_URL}/${folderName}/_llms/${fileName}`;
            content += `- [${title}](${absoluteUrl})\n`;
        }

        totalFiles += files.length;
    }

    if (totalFiles === 0) {
        console.log('\n No .txt files found in any _llms folders. Skipping llms.txt generation.');
        return;
    }

    const outputPath = path.join(process.cwd(), 'dist', 'llms.txt');
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
        console.log('\n Output folder (dist/) does not exist. Please run the build first.');
        process.exit(1);
    }

    try {
        fs.writeFileSync(outputPath, content, 'utf-8');
        console.log(`\nCreated: llms.txt (${totalFiles} files indexed)`);
    } catch (error) {
        console.error('Error writing llms.txt:', error);
        process.exit(1);
    }
}

const startTime = Date.now();
try {
    generateLlmsIndex();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Complete in ${duration}s`);
} catch (error) {
    console.error('\nError during llms.txt generation:', error);
    process.exit(1);
}
