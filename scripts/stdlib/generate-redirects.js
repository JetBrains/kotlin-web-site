const fs = require('fs');
const path = require('path');
const RedirectCollector = require("./redirect-collector");

/**
 * In general the mapping is next:
 * stdlib /api/latest/jvm/stdlib/  - new /kotlin-stdlib/index.html
 *                                   new /kotlin-reflect/index.html
 * test  /api/latest/kotlin.test/  - new /kotlin-test/index.html
 */

const CURRENT_ROOT_PATH = 'api/latest';
const TARGET_ROOT_PATH = 'api/core';

const STDLIB_MODULE_DIR_NAME = 'jvm/stdlib';
const STDLIB_MODULE_TARGET_PATH = TARGET_ROOT_PATH + '/kotlin-stdlib';
const KOTLIN_REFLECT_TARGET_PATH = TARGET_ROOT_PATH + '/kotlin-reflect';
const KOTLIN_TEST_TARGET_PATH = TARGET_ROOT_PATH + '/kotlin-test';

const redirectCollector = new RedirectCollector();

makeStdlibRedirects();
makeKotlinTestRedirects();

redirectCollector.writeRedirects();
redirectCollector.writeUnmatched();

function makeStdlibRedirects() {
    readFiles(CURRENT_ROOT_PATH, `/${STDLIB_MODULE_DIR_NAME}`, STDLIB_MODULE_TARGET_PATH, false);
}

function makeKotlinTestRedirects() {
    readFiles(CURRENT_ROOT_PATH, `/kotlin.test`, KOTLIN_TEST_TARGET_PATH, false);
}

function readFiles(basePath, currentPath, targetPath, pathChanged = false) {
    fs.readdirSync(`${basePath}${currentPath}`, { withFileTypes: true }).forEach((item) => {
        if (item.isDirectory()) {
            matchDirectory(currentPath, item, targetPath, basePath);
        } else if (item.isFile() && item.name.endsWith('.html')) {
            matchFile(currentPath, item, targetPath, pathChanged, basePath);
        } else {
            console.log(`The file ${item.name} has no redirect.`);
        }
    });
}

function matchDirectory(currentPath, item, targetPath, basePath) {
    const currentDirectoryPath = path.join(currentPath, item.name);
    const targetDirectoryPath = path.join(targetPath, item.name);

    if (fs.existsSync(targetDirectoryPath)) {
        return readFiles(basePath, `/${currentDirectoryPath}`, targetDirectoryPath);
    } else {
        const manuallyMatched = getManuallyMatched(currentDirectoryPath);

        if (manuallyMatched) {
            return manuallyMatched.forEach(({ from, to }) => redirectCollector.add(from, to));
        }

        if (isReflectModules(item.name)) {
            return readFiles(
                basePath,
                `/${currentDirectoryPath}`,
                `${KOTLIN_REFLECT_TARGET_PATH}/${item.name}`,
                true
            );
        }

        const withoutPrefix = fixNoKotlinNameOnTheFolder(item.name);

        if (withoutPrefix) {
            const currentPath = path.join(targetPath, withoutPrefix);

            if (fs.existsSync(currentPath)) {
                return readFiles(basePath, `/${currentDirectoryPath}`, currentPath, true);
            }
        }

        if (isExternalTypesExtensionDirectory(item.name)) {
            return readFiles(basePath, `/${currentDirectoryPath}`, targetPath, true);
        }

        redirectCollector.addUnmatchedDirectory(currentDirectoryPath);
    }
}

function matchFile(currentPath, item, targetPath, pathChanged, basePath) {
    const oldPath = path.join('/', basePath, currentPath, item.name);
    const currentFilePath = path.join(targetPath, item.name);

    if (fs.existsSync(currentFilePath)) {
        if (pathChanged) redirectCollector.add(oldPath, `/${currentFilePath}`);
    } else {
        if (isInitFile(item.name)) {
            const constructorName = currentPath.split('/').pop();
            const hasConstructorPage = fs.existsSync(`${targetPath}/${constructorName}.html`);

            if (hasConstructorPage) {
                return redirectCollector.add(oldPath, `/${targetPath}/${constructorName}.html`);
            }

            const hasIndexPage = fs.existsSync(`${targetPath}/index.html`);

            if (hasIndexPage) {
                return redirectCollector.add(oldPath, `/${targetPath}/index.html`);
            }
        }

        const companionPath = `${targetPath}/-companion/${item.name}`;
        const hasCompanion = fs.existsSync(companionPath);

        if (hasCompanion) {
            return redirectCollector.add(oldPath, `/${companionPath}`);
        }

        const directoryName = `${targetPath}/${item.name.replace('.html', '')}/index.html`;
        const hasDirectoryInsteadFile = fs.existsSync(directoryName);

        if (hasDirectoryInsteadFile) {
            return redirectCollector.add(oldPath, `/${directoryName}`);
        }

        const typeAliasFile = `${targetPath}/${directoryName}-of/index.html`;
        const hasTypeForTypeAlias = fs.existsSync(typeAliasFile);

        if (hasTypeForTypeAlias) {
            console.log('hasTypeForTypeAlias');
            return redirectCollector.add(oldPath, `/${typeAliasFile}`);
        }

        redirectCollector.addUnmatchedFile(oldPath);
    }
}

/**
 * With the old dokka, there was a group with extensions for external types,
 * now these extensions are all smeared among other package functions
 */
function isExternalTypesExtensionDirectory(name) {
    return name.startsWith('java.') || name.startsWith('kotlin.sequences.');
}

/**
 * Init file was removed
 */
function isInitFile(name) {
    return name === '-init-.html';
}

/**
 * There is a folder that has lost its prefix
 */
function fixNoKotlinNameOnTheFolder(name) {
    const prefix = '-kotlin';

    if (name.startsWith('-kotlin')) {
        return name.slice(prefix.length);
    }

    return null;
}

/**
 * kotlin.reflect now is a separated module
 */
function isReflectModules(name) {
    return ['kotlin.reflect.full', 'kotlin.reflect.jvm'].includes(name);
}

/**
 * Some pages were matched manually
 */
function getManuallyMatched(path) {
    const javaUtilOptional = `/${STDLIB_MODULE_DIR_NAME}/kotlin.jvm.optionals/java.util.-optional`;
    const javaUtilOptionalTo = `${STDLIB_MODULE_TARGET_PATH}/kotlin.jvm.optionals/get-or-default.html`;

    const manuallyMatched = {
        [javaUtilOptional]: [
            {
                from: javaUtilOptional,
                to: javaUtilOptionalTo,
            },
            {
                from: `${javaUtilOptional}/-any.html`,
                to: javaUtilOptionalTo,
            },
        ],
    };

    return manuallyMatched[path];
}
