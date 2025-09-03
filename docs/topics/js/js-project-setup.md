[//]: # (title: Set up a Kotlin/JS project)

Kotlin/JS projects use Gradle as a build system. To let developers easily manage their Kotlin/JS projects, we offer
the `kotlin.multiplatform` Gradle plugin that provides project configuration tools together with helper tasks for automating routines
typical for JavaScript development.

The plugin downloads npm dependencies in the background using the [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
package managers and builds a JavaScript bundle from a Kotlin project using [webpack](https://webpack.js.org/).
Dependency management and configuration adjustments can be done to a large part directly from the Gradle build file,
with the option to override automatically generated configurations for full control.

You can apply the `org.jetbrains.kotlin.multiplatform` plugin to a Gradle project manually in the `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

The Kotlin Multiplatform Gradle plugin lets you manage aspects of your project in the `kotlin {}` block of the build script:

```groovy
kotlin {
    // ...
}
```

Inside the `kotlin {}` block, you can manage the following aspects:

* [Target execution environment](#execution-environments): browser or Node.js 
* [Support for ES2015 features](#support-for-es2015-features): classes, modules, and generators
* [Project dependencies](#dependencies): Maven and npm
* [Run configuration](#run-task)
* [Test configuration](#test-task)
* [Bundling](#webpack-bundling) and [CSS support](#css) for browser projects
* [Target directory](#distribution-target-directory) and [module name](#module-name)
* [Project's `package.json` file](#package-json-customization)

## Execution environments

Kotlin/JS projects can target two different execution environments: 

* Browser for client-side scripting in browsers
* [Node.js](https://nodejs.org/) for running JavaScript code outside of a browser, for example, for server-side scripting.

To define the target execution environment for a Kotlin/JS project, add the `js {}` block with `browser {}` or `nodejs {}`
inside:

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()
    }
}
```

The instruction `binaries.executable()` explicitly instructs the Kotlin compiler to emit executable `.js` files.
Omitting `binaries.executable()` will cause the compiler to only generate 
Kotlin-internal library files, which can be used from other projects, but not run on their own.

> This is typically faster than creating executable files,
> and can be a possible optimization when dealing with non-leaf modules of your project.
>
{style="tip"}

The Kotlin Multiplatform plugin automatically configures its tasks for working with the selected environment.
This includes downloading and installing the required environment and dependencies for running and testing the application.
This allows developers to build, run, and test simple projects without additional configuration. For projects targeting
Node.js, there is also an option to use an existing Node.js installation. Learn how to [use pre-installed Node.js](#use-pre-installed-node-js).

## Support for ES2015 features

Kotlin provides an [Experimental](components-stability.md#stability-levels-explained) support for the following ES2015
features:

* Modules that simplify your codebase and improve maintainability.
* Classes that allow incorporating OOP principles, resulting in cleaner and more intuitive code.
* Generators for compiling [suspend functions](composing-suspending-functions.md) that improve the final bundle size
  and help with debugging.

You can enable all the supported ES2015 features at once by adding the `es2015` compilation target to your
`build.gradle(.kts)` file:

```kotlin
tasks.withType<KotlinJsCompile>().configureEach {
    compilerOptions {
        target = "es2015"
    }
}
```

[Learn more about ES2015 (ECMAScript 2015, ES6) in the official documentation](https://262.ecma-international.org/6.0/).

## Dependencies

Like any other Gradle projects, Kotlin/JS projects support traditional Gradle [dependency declarations](https://docs.gradle.org/current/userguide/declaring_dependencies.html)
in the `dependencies {}` block of the build script:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation("org.example.myproject", "1.1.0")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation 'org.example.myproject:1.1.0'
}
```

</tab>
</tabs>

The Kotlin Multiplatform Gradle plugin also supports dependency declarations for particular source sets in the `kotlin {}` block 
of the build script:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val jsMain by getting {
            dependencies {
                implementation("org.example.myproject:1.1.0")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        jsMain {
            dependencies {
                implementation 'org.example.myproject:1.1.0'
            }
        }
    }
}
```

</tab>
</tabs>

> Not all libraries available for the Kotlin programming language are available when targeting JavaScript:
> only libraries that include artifacts for Kotlin/JS can be used.
>
{style="note"}

If the library you are adding has dependencies on [packages from npm](#npm-dependencies), Gradle will automatically resolve
these transitive dependencies as well.

### Kotlin standard libraries

The dependencies on the [standard library](https://kotlinlang.org/api/latest/jvm/stdlib/index.html)
are added automatically. The version of the standard library is the same as the version of the Kotlin Multiplatform plugin.

For multiplatform tests, the [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API is available. When you
create a multiplatform project, you can add test dependencies to all the source sets by using a single dependency in `commonTest`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // Brings all the platform dependencies automatically
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // Brings all the platform dependencies automatically
            }
        }
    }
}
```

</tab>
</tabs>

### npm dependencies

In the JavaScript world, the most common way to manage dependencies is [npm](https://www.npmjs.com/).
It offers the biggest public repository of JavaScript modules.

The Kotlin Multiplatform Gradle plugin lets you declare npm dependencies in the Gradle build script, just how you
declare any other dependencies.

To declare an npm dependency, pass its name and version to the `npm()` function inside a dependency declaration.
You can also specify one or multiple version ranges based on [npm's semver syntax](https://docs.npmjs.com/about-semantic-versioning).

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(npm("react", "> 14.0.0 <=16.9.0"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation npm('react', '> 14.0.0 <=16.9.0')
}
```

</tab>
</tabs>

By default, the plugin uses a separate instance of the [Yarn](https://yarnpkg.com/lang/en/) package manager to download
and install npm dependencies. It works out of the box without additional configuration, but you can [tune it to specific needs](#yarn).

You can also work with npm dependencies directly using the [npm](https://www.npmjs.com/) package manager instead.
To use npm as your package manager, in your `gradle.properties` file, set the following property:

```none
kotlin.js.yarn=false
```

Besides regular dependencies, there are three more types of dependencies that can be used from the Gradle DSL.
To learn more about when each type of dependency can best be used, have a look at the official documentation linked from npm:

* [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies), via `devNpm(...)`,
* [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies) via `optionalNpm(...)`, and
* [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies) via `peerNpm(...)`.

Once an npm dependency is installed, you can use its API in your code as described in [Calling JS from Kotlin](js-interop.md).

## run task

The Kotlin Multiplatform Gradle plugin provides a `jsBrowserDevelopmentRun` task that lets you run pure Kotlin/JS projects without additional configuration.

For running Kotlin/JS projects in the browser, this task is an alias for the `browserDevelopmentRun` task (which is also
available in Kotlin multiplatform projects). It uses the [webpack-dev-server](https://webpack.js.org/configuration/dev-server/)
to serve your JavaScript artifacts.
If you want to customize the configuration used by `webpack-dev-server`, for example, adjust the port the server runs on,
use the [webpack configuration file](#webpack-bundling).

For running Kotlin/JS projects targeting Node.js, use the `jsNodeDevelopmentRun` task that is an alias for the `nodeRun` task.

To run a project, execute the standard lifecycle `jsBrowserDevelopmentRun` task, or the alias to which it corresponds:

```bash
./gradlew jsBrowserDevelopmentRun
```

To automatically trigger a re-build of your application after making changes to the source files, use the Gradle
[continuous build](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build) feature:

```bash
./gradlew jsBrowserDevelopmentRun --continuous
```

or 

```bash
./gradlew jsBrowserDevelopmentRun -t
```

Once the build of your project has succeeded, the `webpack-dev-server` will automatically refresh the browser page.

## test task

The Kotlin Multiplatform Gradle plugin automatically sets up a test infrastructure for projects. For browser projects, it downloads
and installs the [Karma](https://karma-runner.github.io/) test runner with other required dependencies;
for Node.js projects, the [Mocha](https://mochajs.org/) test framework is used. 

The plugin also provides useful testing features, for example:

* Source maps generation
* Test reports generation
* Test run results in the console

For running browser tests, the plugin uses [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)
by default. You can also choose another browser to run tests in, by adding the corresponding entries inside the `useKarma {}`
block of the build script:

```groovy
kotlin {
    js {
        browser {
            testTask {
                useKarma {
                    useIe()
                    useSafari()
                    useFirefox()
                    useChrome()
                    useChromeCanary()
                    useChromeHeadless()
                    usePhantomJS()
                    useOpera()
                }
            }
        }
        binaries.executable()
        // ...
    }
}
```

Alternatively, you can add test targets for browsers in the `gradle.properties` file:

```text
kotlin.js.browser.karma.browsers=firefox,safari
```

This approach allows you to define a list of browsers for all modules, and then add specific browsers in the build scripts of particular modules. 

Please note that the Kotlin Multiplatform Gradle plugin does not automatically install these browsers for you, but only uses those
that are available in its execution environment. If you are executing Kotlin/JS tests on a continuous integration server,
for example, make sure that the browsers you want to test against are installed.

If you want to skip tests, add the line `enabled = false` to the `testTask {}`:

```groovy
kotlin {
    js {
        browser {
            testTask {
                enabled = false
            }
        }
        binaries.executable()
        // ...
    }
}
```

To run tests, execute the standard lifecycle `check` task:

```bash
./gradlew check
```

To specify environment variables used by your Node.js test runners (for example, to pass external information to your tests, or to fine-tune package resolution), use the `environment()` function with a key-value pair inside the `testTask {}` block in your build script:

```groovy
kotlin {
    js {
        nodejs {
            testTask {
                environment("key", "value")
            }
        }
    }
}
```

### Karma configuration

The Kotlin Multiplatform Gradle plugin automatically generates a Karma configuration file at build time which includes your settings
from the [`kotlin.js.browser.testTask.useKarma {}` block](#test-task) in your `build.gradle(.kts)`. You can find
the file at `build/js/packages/projectName-test/karma.conf.js`. 
To make adjustments to the configuration used by Karma, place your additional configuration files inside a directory
called `karma.config.d` in the root of your project. All `.js` configuration files in this directory will be picked up
and are automatically merged into the generated `karma.conf.js` at build time.

All Karma configuration abilities are well described in Karma's [documentation](https://karma-runner.github.io/5.0/config/configuration-file.html).

## webpack bundling

For browser targets, the Kotlin Multiplatform Gradle plugin uses the widely known [webpack](https://webpack.js.org/) module bundler.

### webpack version 

The Kotlin Multiplatform plugin uses webpack %webpackMajorVersion%.

If you have projects created with plugin versions earlier than 1.5.0,
you can temporarily switch back to webpack %webpackPreviousMajorVersion% used in these versions by adding the following line
to the project's `gradle.properties`:

```none
kotlin.js.webpack.major.version=4
```

### webpack task

The most common webpack adjustments can be made directly via the
`kotlin.js.browser.webpackTask {}` configuration block in the Gradle build file:
* `outputFileName` - the name of the webpacked output file. It will be generated in `<projectDir>/build/dist/<targetName>` after
  an execution of a webpack task. The default value is the project name.
* `output.libraryTarget` - the module system for the webpacked output. Learn more about [available module systems for
  Kotlin/JS projects](js-modules.md). The default value is `umd`.
  
```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

You can also configure common webpack settings to use in bundling, running, and testing tasks in the `commonWebpackConfig {}`
block.

### webpack configuration file 

The Kotlin Multiplatform Gradle plugin automatically generates a standard webpack configuration file
at the build time. It is located in `build/js/packages/projectName/webpack.config.js`.

If you want to make further adjustments to the webpack configuration, place your additional configuration files inside
a directory called `webpack.config.d` in the root of your project. When building your project, all `.js` configuration
files will automatically be merged into the `build/js/packages/projectName/webpack.config.js` file.
For example, To add a new [webpack loader](https://webpack.js.org/loaders/), add the following to
a `.js` file inside the `webpack.config.d` directory:

> In this case, the configuration object is the `config` global object. You need to modify it in your script.
>
{style="note"}

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

All webpack configuration
capabilities are well described in its [documentation](https://webpack.js.org/concepts/configuration/).

### Building executables

For building executable JavaScript artifacts through webpack, the Kotlin Multiplatform Gradle plugin contains the `browserDevelopmentWebpack`
and `browserProductionWebpack` Gradle tasks.

* `browserDevelopmentWebpack` creates development artifacts, which are larger in size, but take little time to create.
As such, use the `browserDevelopmentWebpack` tasks during active development.

* `browserProductionWebpack` applies dead code elimination to the generated artifacts and minifies
the resulting JavaScript file, which takes more time, but generates executables that are smaller in size. As such, use
the `browserProductionWebpack` task when preparing your project for production use.
 
 Execute either of these tasks to obtain the respective artifacts for development or production. The generated files will
 be available in `build/dist` unless [specified otherwise](#distribution-target-directory).

```bash
./gradlew browserProductionWebpack
```

Note that these tasks will only be available if your target is configured to generate executable files (via `binaries.executable()`).

## CSS

The Kotlin Multiplatform Gradle plugin also provides support for webpack's [CSS](https://webpack.js.org/loaders/css-loader/) and
[style](https://webpack.js.org/loaders/style-loader/) loaders. While all options can be changed by directly modifying
the [webpack configuration files](#webpack-bundling) that are used to build your project, the most commonly
used settings are available directly from the `build.gradle(.kts)` file.

To turn on CSS support in your project, set the `cssSupport.enabled` option in the Gradle build file in the `commonWebpackConfig {}`
block. This configuration is also enabled by default when creating a new project using the wizard.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
browser {
    commonWebpackConfig {
        cssSupport {
            it.enabled = true
        }
    }
}
```

</tab>
</tabs>

Alternatively, you can add CSS support independently for `webpackTask {}`, `runTask {}`, and `testTask {}`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
browser {
    webpackTask {
        cssSupport {
            enabled.set(true)
        }
    }
    runTask {
        cssSupport {
            enabled.set(true)
        }
    }
    testTask {
        useKarma {
            // ...
            webpackConfig.cssSupport {
                enabled.set(true)
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
browser {
    webpackTask {
        cssSupport {
            it.enabled = true
        }
    }
    runTask {
        cssSupport {
            it.enabled = true
        }
    }
    testTask {
        useKarma {
            // ...
            webpackConfig.cssSupport {
                it.enabled = true
            }
        }
    }
}
```

</tab>
</tabs>

Activating CSS support in your project helps prevent common errors that occur when trying to use style sheets from
an unconfigured project, such as `Module parse failed: Unexpected character '@' (14:0)`.

You can use `cssSupport.mode` to specify how encountered CSS should be handled. The following values are available:

* `"inline"` (default): styles are added to the global `<style>` tag.
* `"extract"`: styles are extracted into a separate file. They can then be included from an HTML page.
* `"import"`: styles are processed as strings. This can be useful if you need access to the CSS from your code (such as
`val styles = require("main.css")`).

To use different modes for the same project, use `cssSupport.rules`. Here, you can specify a list of `KotlinWebpackCssRules`,
each of which defines a mode, as well as [include](https://webpack.js.org/configuration/module/#ruleinclude) and
[exclude](https://webpack.js.org/configuration/module/#ruleexclude) patterns.

## Node.js

For Kotlin/JS projects targeting Node.js, the plugin automatically downloads and installs the Node.js environment on the
host.
You can also use an existing Node.js instance if you have it.

### Configuring Node.js settings

You can configure Node.js settings for each subproject, or set them for the project as a whole.

For example, to set the Node.js version for a specific subproject, add the following lines to its Gradle block
in your `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</tab>
</tabs>

To set a version for the entire project, including all subprojects, apply the same code to the `allProjects {}` block:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "your Node.js version"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
allprojects {
    project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
        project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).version = "your Node.js version"
}
```

</tab>
</tabs>

> Using the `NodeJsRootPlugin` class to configure Node.js setting for the entire project is deprecated and will eventually
> stop being supported.
> 
{style="note"}

### Use pre-installed Node.js

If Node.js is already installed on the host where you build Kotlin/JS projects, you can configure the Kotlin Multiplatform Gradle
plugin to use it instead of installing its own Node.js instance.

To use a pre-installed Node.js instance, add the following lines to your `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    // Set to `true` for default behavior
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().download = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin) {
    // Set to `true` for default behavior
    project.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec).download = false
}
```

</tab>
</tabs>

## Yarn

By default, to download and install your declared dependencies at build time, the plugin manages its own instance of the
[Yarn](https://yarnpkg.com/lang/en/) package manager. It works out of the box without additional configuration, but you
can tune it or use Yarn already installed on your host.

### Additional Yarn features: .yarnrc

To configure additional Yarn features, place a `.yarnrc` file in the root of your project.
At build time, it gets picked up automatically.

For example, to use a custom registry for npm packages, add the following line to a file called
`.yarnrc` in the project root:

```text
registry "http://my.registry/api/npm/"
```

To learn more about `.yarnrc`, visit the [official Yarn documentation](https://classic.yarnpkg.com/en/docs/yarnrc/).

### Use pre-installed Yarn

If Yarn is already installed on the host where you build Kotlin/JS projects, you can configure the Kotlin Multiplatform Gradle
plugin to use it instead of installing its own Yarn instance.

To use the pre-installed Yarn instance, add the following lines to `build.gradle(.kts)`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false
    // "true" for default behavior
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
}
 
```

</tab>
</tabs>

### Version locking via kotlin-js-store

> Version locking via `kotlin-js-store` is available since Kotlin 1.6.10.
>
{style="note"}

The `kotlin-js-store` directory in the project root is automatically generated by the Kotlin Multiplatform Gradle plugin to hold 
the `yarn.lock` file, which is necessary for version locking. The lockfile is entirely managed by the Yarn plugin 
and gets updated during the execution of the `kotlinNpmInstall` Gradle task.

To follow a [recommended practice](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/),
commit `kotlin-js-store` and its contents to your version control system. It ensures that your application is being
built with the exact same dependency tree on all machines.

If needed, you can change both directory and lockfile names in `build.gradle(.kts)`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileDirectory =
        project.rootDir.resolve("my-kotlin-js-store")
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileName = "my-yarn.lock"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileDirectory =
        file("my-kotlin-js-store")
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileName = 'my-yarn.lock'
}
```

</tab>
</tabs>

> Changing the name of the lockfile may cause dependency inspection tools to no longer pick up the file.
> 
{style="warning"}

To learn more about `yarn.lock`, visit the [official Yarn documentation](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/).

### Reporting that yarn.lock has been updated

Kotlin/JS provides Gradle settings that could notify you if the `yarn.lock` file has been updated.
You can use these settings when you want to be notified if `yarn.lock` has been changed silently
during the CI build process:

* `YarnLockMismatchReport`, which specifies how changes to the `yarn.lock` file are reported. You can use one of the
  following values:
    * `FAIL` fails the corresponding Gradle task. This is the default.
    * `WARNING` writes the information about changes in the warning log.
    * `NONE` disables reporting.
* `reportNewYarnLock`, which reports about the recently created `yarn.lock` file explicitly. By default, this option is
  disabled: it's a common practice to generate a new `yarn.lock` file at the first start. You can use this option to
  ensure that the file has been committed to your repository.
* `yarnLockAutoReplace`, which replaces `yarn.lock` automatically every time the Gradle task is run.

To use these options, update `build.gradle(.kts)` as follows:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).reportNewYarnLock = false // true
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockAutoReplace = false // true
}
```

</tab>
</tabs>

### Installing npm dependencies with --ignore-scripts by default

> Installing npm dependencies with `--ignore-scripts` by default is available since Kotlin 1.6.10.
>
{style="note"}

To reduce the likelihood of executing malicious code from compromised npm packages, the Kotlin Multiplatform Gradle plugin prevents 
the execution of [lifecycle scripts](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)
during the installation of npm dependencies by default.

You can explicitly enable lifecycle scripts execution by adding the following lines to `build.gradle(.kts)`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> { 
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().ignoreScripts = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).ignoreScripts = false
}
```

</tab>
</tabs>

## Distribution target directory

By default, the results of a Kotlin/JS project build reside in the `/build/dist/<targetName>/<binaryName>` directory within the project root.

> Prior to Kotlin 1.9.0, the default distribution target directory was `/build/distributions`.
>
{style="note" }

To set another location for project distribution files, in your build script inside the `browser {}` block, add a `distribution {}` block and assign a value to the `outputDirectory` property by using the `set()` method.
Once you run a project build task, Gradle will save the output bundle in this location together with project resources.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    js {
        browser {
            distribution {
                outputDirectory.set(projectDir.resolve("output"))
            }
        }
        binaries.executable()
        // ...
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    js {
        browser {
            distribution {
                outputDirectory = file("$projectDir/output")
            }
        }
        binaries.executable()
        // ...
    }
}
```

</tab>
</tabs>

## Module name

To adjust the name for the JavaScript _module_ (which is generated in `build/js/packages/myModuleName`), including
the corresponding `.js` and `.d.ts` files, use the `moduleName` option:

```groovy
js {
    moduleName = "myModuleName"
}
```

Note that this does not affect the webpacked output in `build/dist`.

## package.json customization

The `package.json` file holds the metadata of a JavaScript package. Popular package registries such as npm require all 
published packages to have such a file. They use it to track and manage package publications.  

The Kotlin Multiplatform Gradle plugin automatically generates `package.json` for Kotlin/JS projects during build time. By default, 
the file contains essential data: name, version, license, dependencies, and some other package attributes.

Aside from basic package attributes, `package.json` can define how a JavaScript project should behave, for example,
identifying scripts that are available to run.

You can add custom entries to the project's `package.json` via the Gradle DSL. To add custom fields to your `package.json`,
use the `customField()` function in the compilations `packageJson` block:

```kotlin
kotlin {
    js {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

When you build the project, this code adds the following block to the `package.json` file:

```json
"hello": {
    "one": 1,
    "two": 2
}
```

Learn more about writing `package.json` files for npm registry in the [npm docs](https://docs.npmjs.com/cli/v6/configuring-npm/package-json).
