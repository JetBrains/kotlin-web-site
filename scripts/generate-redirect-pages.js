#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

/**
 * HTML for redirect page with a triple redirect mechanism (noscript + JavaScript + meta refresh)
 */
function createRedirectHtml(targetUrl) {
    return `<noscript><meta http-equiv="refresh" content="0; url=${targetUrl}"/></noscript>
<script>window.location = '${targetUrl}' + window.location.hash;</script>
<meta http-equiv="refresh" content="1; url=${targetUrl}"/>
`;
}

/**
 * Convert a redirect URL to its corresponding file system path
 */
function urlToFilePath(url, outDir) {
    const urlPath = url.startsWith('/') ? url.slice(1) : url;
    return urlPath.endsWith('.html')
        ? path.join(outDir, urlPath)
        : path.join(outDir, urlPath, 'index.html');
}

function processRedirectEntry(entry, fileName) {
    const redirects = [];
    const fromUrls = Array.isArray(entry.from) ? entry.from : [entry.from];
    for (const fromUrl of fromUrls) {
        redirects.push({
            from: fromUrl,
            to: entry.to,
            fileName
        });
    }
    return redirects;
}

function parseYamlFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = yaml.parse(fileContent);
        if (!Array.isArray(data)) {
            console.error(`Error: ${filePath} does not contain an array of redirects`);
            return [];
        }
        return data;
    } catch (error) {
        console.error(`Error parsing YAML file ${filePath}:`, error);
        return [];
    }
}

function generateRedirectPages() {
    const rootFolder = path.join(__dirname, '..');
    const redirectsFolder = path.join(rootFolder, 'redirects');
    const outFolder = path.join(rootFolder, 'out');

    if (!fs.existsSync(redirectsFolder)) {
        console.error(`Redirects folder does not exist: ${redirectsFolder}`);
        process.exit(1);
    }

    if (!fs.existsSync(outFolder)) {
        console.error(`Output folder does not exist: ${outFolder}`);
        console.log('Please run "yarn next-build-static" first');
        process.exit(1);
    }

    const yamlFiles = fs.readdirSync(redirectsFolder)
        .filter((file) => file.endsWith('.yml'));
    console.log(`Found ${yamlFiles.length} redirect files`);

    let totalRedirects = 0;
    let skippedRedirects = 0;
    let createdRedirects = 0;

    for (const yamlFile of yamlFiles) {
        const filePath = path.join(redirectsFolder, yamlFile);
        console.log(`\nProcessing ${yamlFile}...`);
        const redirectEntries = parseYamlFile(filePath);
        const processedRedirects = redirectEntries.flatMap(entry => processRedirectEntry(entry, yamlFile));
        for (const redirect of processedRedirects) {
            totalRedirects++;
            const targetFilePath = urlToFilePath(redirect.from, outFolder);

            if (fs.existsSync(targetFilePath)) {
                console.log(`  Skipping ${redirect.from} - file already exists`);
                skippedRedirects++;
                continue;
            }

            try {
                fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
                const htmlContent = createRedirectHtml(redirect.to);
                fs.writeFileSync(targetFilePath, htmlContent, 'utf-8');
                createdRedirects++;
                console.log(`  Created redirect: ${redirect.from} -> ${redirect.to}`);
            } catch (error) {
                console.error(`  Error creating redirect for ${redirect.from}:`, error);
            }
        }
    }

    console.log('\n=== Summary ===');
    console.log(`Total redirects processed: ${totalRedirects}`);
    console.log(`Redirects created: ${createdRedirects}`);
    console.log(`Redirects skipped (existing files): ${skippedRedirects}`);
}

if (require.main === module) {
    console.log('Starting redirect generation...');
    const startTime = Date.now();
    generateRedirectPages();
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`\nRedirect generation complete!`);
    console.log(`Done in ${duration}s`);
}
module.exports = { generateRedirectPages };
