import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'https://kotlinlang.org';
const DOCS_DIR = 'dist/docs';


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

function readIntroFile(fileName, fallbackText) {
    const introPath = path.join(path.dirname(new URL(import.meta.url).pathname), fileName);
    try {
        return fs.readFileSync(introPath, 'utf-8').trim();
    } catch (error) {
        console.warn(`Warning: Could not read ${fileName}: ${error.message}`);
        return fallbackText;
    }
}

/**
 * Recursively find all _llms folders in the docs directory
 */
function findLlmsFolders(dir) {
    const results = [];
    const fullPath = path.join(process.cwd(), dir);

    if (!fs.existsSync(fullPath)) {
        console.log(`  Directory does not exist: ${dir} - skipping`);
        return results;
    }

    try {
        const entries = fs.readdirSync(fullPath, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isDirectory()) {
                const relativePath = path.join(dir, entry.name);

                if (entry.name === '_llms') {
                    results.push(relativePath);
                } else {
                    // Recursively search subdirectories
                    results.push(...findLlmsFolders(relativePath));
                }
            }
        }
    } catch (error) {
        console.warn(`  Warning: Could not read directory ${dir}:`, error.message);
    }

    return results;
}

/**
 * Recursively find all llms.txt files in the docs directory
 */
function findLlmsTxtFiles(dir) {
    const results = [];
    const fullPath = path.join(process.cwd(), dir);

    if (!fs.existsSync(fullPath)) {
        console.log(`  Directory does not exist: ${dir} - skipping`);
        return results;
    }

    try {
        const entries = fs.readdirSync(fullPath, { withFileTypes: true });

        for (const entry of entries) {
            const entryPath = path.join(fullPath, entry.name);
            const relativePath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                // Skip _llms directories as they contain individual files, not combined llms.txt
                if (entry.name !== '_llms') {
                    results.push(...findLlmsTxtFiles(relativePath));
                }
            } else if (entry.isFile() && entry.name === 'llms.txt') {
                results.push(relativePath);
            }
        }
    } catch (error) {
        console.warn(`  Warning: Could not read directory ${dir}:`, error.message);
    }

    return results;
}

/**
 * Generate llms-full.txt with combined content from all llms.txt files
 */
function generateLlmsFull() {
    console.log('\nGenerating llms-full.txt...');

    const llmsTxtFiles = findLlmsTxtFiles(DOCS_DIR);

    if (llmsTxtFiles.length === 0) {
        console.log('  No llms.txt files found. Skipping llms-full.txt generation.');
        return;
    }

    let fullContent = readIntroFile('llms-full-intro.txt', 'Kotlin documentation - Full content') + '\n\n---\n\n';

    for (const llmsFile of llmsTxtFiles) {
        const fullPath = path.join(process.cwd(), llmsFile);

        try {
            const content = fs.readFileSync(fullPath, 'utf-8').trim();
            fullContent += content + '\n\n---\n\n';
        } catch (error) {
            console.warn(`  Warning: Could not read ${llmsFile}:`, error.message);
        }
    }

    const outputPath = path.join(process.cwd(), 'dist', 'llms-full.txt');

    try {
        fs.writeFileSync(outputPath, fullContent, 'utf-8');
        console.log(`  Created llms-full.txt (${llmsTxtFiles.length} file(s) combined)`);
    } catch (error) {
        console.error('Error writing llms-full.txt:', error);
        process.exit(1);
    }
}

function generateLlmsIndex() {
    console.log('Starting llms.txt index generation...');

    const llmsFolders = findLlmsFolders(DOCS_DIR);

    if (llmsFolders.length === 0) {
        console.log('  No _llms folders found. Skipping llms.txt generation.');
        return;
    }

    let content = readIntroFile('llms-intro.txt', 'Kotlin documentation');
    let totalFiles = 0;

    for (const folderPath of llmsFolders) {
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
        console.log('  No .txt files found in any _llms folders. Skipping llms.txt generation.');
        return;
    }

    const outputPath = path.join(process.cwd(), 'dist', 'llms.txt');
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
        console.log('  Output folder (dist/) does not exist. Please run the build first.');
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
    generateLlmsFull();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\nComplete in ${duration}s`);
} catch (error) {
    console.error('\nError during llms.txt generation:', error);
    process.exit(1);
}
