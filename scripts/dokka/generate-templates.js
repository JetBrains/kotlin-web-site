const {join} = require('path');
const {execFileSync, execSync, spawnSync} = require('child_process');
const {readdirSync, readFileSync, writeFileSync} = require('fs');
const KeyValueParser = require('key-value-parser');

console.info(`Start generating Dokka's templates`);

walkTroughTemplates('dokka-templates');

function isFreemakerTemplate(item) {
    return item.isFile() && item.name.endsWith('.ftl');
}

function replaceEnv(value) {
    let matched;

    while (matched = value.match(/\$\{process\.env\.([^}]+)}/)) {
        const { 0: token, 1: variable, index } = matched;
        const envValue = process.env[variable] || '';
        value = value.substring(0, index) + envValue + value.substring(index + token.length);
    }

    return value;
}

function parsePropsString([definition, _, componentName, propsString]) {
    return new Promise((resolve, reject) => {
        new KeyValueParser(propsString || '', { async: true, quoted: '\"' })
            .on('end', props => resolve([definition, componentName, props]))
            .on('error', err => reject(err));
    });
}

function parseFreemakerContent(originalContent) {
    /* parse to [ fullEntry, componentName, propsString ] */
    const parseRegex = /(\{%\s*ktl_component\s+"(\w+)"\s*(\s[^%]+)?%})/g;
    const content = replaceEnv(originalContent);
    return Promise.all([...content.matchAll(parseRegex)].map(parsePropsString))
        .then(entries => entries
            .reduce((text, [definition, componentName, props]) => {
                const rendered = compileComponent(componentName, props);
                return text.replace(definition, rendered);
            }, content)
        )
}

/**
 * Use the next example to define ktl component in ftl templates: {% ktl_component "COMPONENT_NAME" [PROPS] %}
 */
function walkTroughTemplates(filePath) {
    readdirSync(filePath, {withFileTypes: true}).forEach(item => {
        const currentPath = join(filePath, item.name);

        if (item.isDirectory()) walkTroughTemplates(currentPath);
        else if (isFreemakerTemplate(item)) {
            const originalContent = readFileSync(currentPath).toString('UTF-8');

            parseFreemakerContent(originalContent).then(newContent => {
                if (newContent !== originalContent) {
                    console.info(`Updating ${currentPath} file`);
                    writeFileSync(currentPath, newContent);
                    console.info(`${currentPath} file is updated`);
                }
            });
        }
    });
}

function compileComponent(name, props) {
    const propsString = JSON.stringify(props);
    const stdout = execFileSync('node', ['scripts/react-renderer/compile.js', name, propsString, 'dokka'], {encoding: 'utf-8'});

    return `<!-- ktl_component: {"name": "${name}", "props": ${propsString} } --> ${stdout}`;
}
