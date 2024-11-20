const {
    STDLIB_MODULE_DIR,
    TEST_MODULE_DIR,
    TARGET_REFLECT_MODULE_DIR,
    TARGET_STDLIB_MODULE_DIR,
    TARGET_TEST_MODULE_DIR
} = require('./utils');

class LinksProcessor {
    constructor(folder, name) {
        this.folder = folder + '/';
        this.name = name;
        this.value = this.folder + this.name;
    }

    dropPackageByRe(re, to = '/') {
        this.value = this.value.replace(new RegExp(`\/${re}\/`, 'g'), to);
        return this;
    }

    replaceAtStart(prefix, newPrefix, cb) {
        const exists = this.value.startsWith(prefix);

        if (exists) {
            const value = newPrefix + this.value.slice(prefix.length);
            this.value = cb ? cb(value) : value;
        }

        return this;
    }

    replaceAllTypes() {
        this.value = this.value.replace(/\/alltypes\/index\.html/g, '/all-types.html');
        return this;
    }

    replaceKotlinJvmOptionals() {
        return this.replaceAtStart(
            STDLIB_MODULE_DIR + '/kotlin.jvm.optionals/java.util.-optional/',
            `${TARGET_STDLIB_MODULE_DIR}/kotlin.jvm.optionals/`,
            val => {
                if (this.name === '-any.html')
                    return val.substring(0, val.length - '-any.html'.length);

                return val;
            }
        );
    }

    /**
     * kotlin.reflect now is a separated module
     */
    replaceKotlinReflect() {
        return this
            .replaceAtStart(STDLIB_MODULE_DIR + '/kotlin.reflect.full/', TARGET_REFLECT_MODULE_DIR + '/kotlin.reflect.full/')
            .replaceAtStart(STDLIB_MODULE_DIR + '/kotlin.reflect.jvm/', TARGET_REFLECT_MODULE_DIR + '/kotlin.reflect.jvm/');
    }

    replaceRootPrefixes() {
        return this
            .replaceAtStart(TEST_MODULE_DIR + '/', TARGET_TEST_MODULE_DIR + '/')
            .replaceAtStart(STDLIB_MODULE_DIR + '/', TARGET_STDLIB_MODULE_DIR + '/');
    }

    /**
     * There is a folder that has lost its prefix
     */
    dropSomeKotlinPrefixes() {
        // If you need more, just use it like that: -kotlin((add_your_module)|(-null-pointer-exception))
        return this.dropPackageByRe('-kotlin((-null-pointer-exception))', '/$1/');
    }

    /**
     * With the old dokka, there was a group with extensions for external types,
     * now these extensions are all smeared among other package functions
     */
    dropEmptyPackages() {
        return this
            .dropPackageByRe('java\\.[^/]+')
            .dropPackageByRe('kotlin\\.sequences\\.[^/]+')
            .dropPackageByRe('-kotlin-reflection-not-supported-error');
    }
}

module.exports = LinksProcessor;
