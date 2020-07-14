---
type: doc
layout: reference
category: "JavaScript"
title: "Setting Up Kotlin/JS Project"
---

# Setting up a Kotlin/JS project

Kotlin/JS projects use Gradle as a build system. To let developers easily manage their Kotlin/JS projects, we offer
the `kotlin.js` Gradle plugin that provides project configuration tools together with helper tasks for automating routines
typical for JavaScript development. For example, the plugin downloads the [Yarn](https://yarnpkg.com/) package manager
for managing [npm](https://www.npmjs.com/) dependencies in background and can build a JavaScript bundle from a Kotlin project
using [webpack](https://webpack.js.org/). Dependency management and configuration adjustments can be done to a large part directly from the Gradle build file, with the option to override automatically generated configurations for full control.

To create a Kotlin/JS project in IntelliJ IDEA, go to **File | New | Project** and select **Gradle | Kotlin/JS for browser**
 or **Kotlin/JS for Node.js**. Be sure to clear the **Java** checkbox. If you want to use the Kotlin DSL for Gradle, make sure to check the **Kotlin DSL build script** option.

![New project wizard]({{ url_for('asset', path='images/reference/js-project-setup/wizard.png') }})


Alternatively, you can apply the `org.jetbrains.kotlin.js` plugin to a Gradle project manually in the Gradle build file (`build.gradle` or `build.gradle.kts`).

<!--suppress ALL -->
<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.js' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
     kotlin("js") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

The Kotlin/JS Gradle plugin lets you manage aspects of your project in the `kotlin` section of the build script.

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin {
    //...
}
```

</div>

Inside the `kotlin` section, you can manage the following aspects:

* [Target execution environment](#choosing-execution-environment): browser or Node.js 
* [Project dependencies](#managing-dependencies): Maven and npm
* [Run configuration](#configuring-run-task)
* [Test configuration](#configuring-test-task)
* [Bundling](#configuring-webpack-bundling) for browser projects
* [Target directory](#distribution-target-directory)

## Choosing execution environment

Kotlin/JS projects can target two different execution environments: 

* Browser for client-side scripting in browsers
* [Node.js](https://nodejs.org/) for running JavaScript code outside of a browser, for example, for server-side scripting.

To define the target execution environment for a Kotlin/JS project, add the `js` section with `browser {}` or `nodejs {}` inside.

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()       
    }
}    
```

</div>

To instruct the Kotlin compiler to emit executable `.js` files, the instruction `binaries.executable()` must be present. If this option is omitted, only Kotlin-internal library files are generated, which can be used from other projects, but not run on their own.

The Kotlin/JS plugin automatically configures its tasks for working with the selected environment.
This includes downloading and installing the required environment and dependencies for running and testing the application. This allows developers to build, run and test simple projects without additional configuration.

## Managing dependencies

Like any other Gradle projects, Kotlin/JS projects support traditional Gradle [dependency declarations](https://docs.gradle.org/current/userguide/declaring_dependencies.html)
in the `dependencies` section of the build script.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    implementation 'org.example.myproject:1.1.0'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    implementation("org.example.myproject", "1.1.0")
}
```

</div>
</div>

The Kotlin/JS Gradle plugin also supports dependency declarations for particular source sets in the `kotlin` section 
of the build script.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    sourceSets {
        main {
            dependencies {
                implementation 'org.example.myproject:1.1.0'
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
  sourceSets["main"].dependencies {
    implementation("org.example.myproject", "1.1.0")
  }
}
```

</div>
</div>

Please note that not all libraries available for the Kotlin programming language are available when targeting JavaScript: Only libraries that include artifacts for Kotlin/JS can be used.

If the library you are adding has dependencies on [packages from npm](#npm-dependencies), Gradle will automatically resolve these transitive dependencies as well.

### Kotlin standard libraries

The dependency on the Kotlin/JS [standard library](https://kotlinlang.org/api/latest/jvm/stdlib/index.html) is mandatory
for all Kotlin/JS projects. If your project contains tests written in Kotlin, you should also add the dependency on the
[kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/index.html) library.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib-js'
    testImplementation 'org.jetbrains.kotlin:kotlin-test-js'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    implementation(kotlin("stdlib-js"))
    testImplementation(kotlin("test-js"))
}
```

</div>
</div>

### npm dependencies

In the JavaScript world, the most common way to manage dependencies is [npm](https://www.npmjs.com/).
It offers the biggest public [repository](https://www.npmjs.com/) of JavaScript modules.

The Kotlin/JS Gradle plugin lets you declare npm dependencies in the Gradle build script, analogous to how you would declare any other dependencies.

To declare an npm dependency, pass its name and version to the `npm()` function inside a dependency declaration.  You can also specify one or multiple version range based on [npm's semver syntax](https://docs.npmjs.com/misc/semver#versions).

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    implementation npm('react', '> 14.0.0 <=16.9.0')
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    implementation(npm("react", "> 14.0.0 <=16.9.0"))
}
```

</div>
</div>

To download and install your declared dependencies during build time, the plugin manages its own installation of the [Yarn](https://yarnpkg.com/lang/en/) package manager. 

Besides regular dependencies, there are three more types of dependencies that can be used from the Gradle DSL. To learn more about when each type of dependency is best used, please consult the official npm documentation linked for each type:
- [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies), via `devNpm(...)`,
- [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies) via `optionalNpm(...)`, and
- [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies) via `peerNpm(...)`.

Once an npm dependency is installed, you can use its API in your code as described in 
[Calling JS from Kotlin](js-interop.html).

## Configuring run task

The Kotlin/JS plugin provides a `run` task that lets you run projects without additional configuration.
For running Kotlin/JS projects, it uses the [webpack-dev-server](https://webpack.js.org/configuration/dev-server/).
If you want to customize the configuration used by `webpack-dev-server`, for example adjust the port the server runs on, use the webpack configuration file.

To run the project, execute the standard lifecycle `run` task:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./gradlew run
```

</div>

To automatically trigger a re-build of your application after making changes to the source files, use 
the Gradle [continuous build](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build) feature:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./gradlew run --continuous
```

</div>

or 

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./gradlew run -t
```

</div>

Once the build of your project has succeeded, the `webpack-dev-server` will automatically refresh the browser page.

## Configuring test task

The Kotlin/JS Gradle plugin automatically sets up a test infrastructure for projects. For browser projects, it downloads
and installs the [Karma](https://karma-runner.github.io/) test runner with other required dependencies;
for Node.js projects, the [Mocha](https://mochajs.org/) test framework is used. 

The plugin also provides useful testing features, for example:

* Source maps generation
* Test reports generation
* Test run results in the console

For running browser tests, the plugin uses [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md) by default. You can also choose other browser to run tests in, by adding the corresponding entries inside the `useKarma` section of the build script:

<div class="sample" markdown="1" mode="groovy" theme="idea">

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
        // . . .
    }
}
```

</div>

Please note that the Kotlin/JS Gradle plugin does not automatically install these browsers for you, but only use those that are available in its execution environment. If you are executing Kotlin/JS tests on a continuous integration server, for example, make sure that the browsers you want to test against are installed.

If you want to skip tests, add the line `enabled = false` to the `testTask`.

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin {
    js {
        browser {
            testTask {
                enabled = false
            }
        }
        binaries.executable()
        // . . .
    }
}
```

</div>

To run tests, execute the standard lifecycle `check` task:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./gradlew check
```

</div>

## Configuring Karma
The Kotlin/JS Gradle plugin automatically generates a Karma configuration file at build time which includes your settings from the `kotlin.js.browser.testTask.useKarma` block in your `build.gradle(.kts)`. You can find the file at `build/js/packages/projectName-test/karma.conf.js`. 
To make adjustments to the configuration used by Karma, place your additional configuration files inside a directory called `karma.config.d` in the root of your project. All JS configuration files in this directory will be picked up, and are automatically merged into the generated `karma.conf.js` at build time.

All karma configuration abilities are well described in Karma's [documentation](http://karma-runner.github.io/5.0/config/configuration-file.html).

## Configuring webpack bundling

For browser targets, the Kotlin/JS plugin uses the widely known [webpack](https://webpack.js.org/) module bundler.

The Kotlin/JS Gradle plugin automatically generates a standard webpack configuration file 
at build time which you can find the at `build/js/packages/projectName/webpack.config.js`.

The most common webpack adjustments can be made directly via the
`kotlin.js.browser.webpackTask` configuration block in the Gradle build file.

If you want to make further adjustments to the webpack configuration, place your additional configuration files inside a directory
called `webpack.config.d` in the root of your project. When building your project, all JS configuration files will automatically
be merged into the `build/js/packages/projectName/webpack.config.js` file.
To add a new [webpack loader](https://webpack.js.org/loaders/), for example, add the following to
a `.js` file inside the `webpack.config.d`:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

</div>

All webpack configuration
capabilities are well described in its [documentation](https://webpack.js.org/concepts/configuration/).

For building executable JavaScript artifacts though webpack, the Kotlin/JS plugin contains the `browserDevelopmentWebpack` and `browserProductionWebpack` Gradle tasks. Execute them to obtain artifacts for development or production respectively:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./gradlew browserProductionWebpack
```

</div>

Note that these tasks will only be available if your target is configured to generate executable files (via `binaries.executable()`).

## Configuring CSS
The Kotlin/JS Gradle plugin also provides support for webpack's [CSS](https://webpack.js.org/loaders/css-loader/) and [style](https://webpack.js.org/loaders/style-loader/) loaders. While all options can be changed by directly modifying the [webpack configuration files](#configuring-webpack-bundling) that are used to build your project, the most commonly used settings are available directly from the `build.gradle(.kts)` file.

To turn on CSS support in your project, set the `cssSupport.enabled` flag in the Gradle build file for `webpackTask`, `runTask`, and `testTask` respectively. This configuration is also present by default when creating a new project using the wizard.

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
webpackTask {
   cssSupport.enabled = true
}
runTask {
   cssSupport.enabled = true
}
testTask {
   useKarma {
      // . . .
      webpackConfig.cssSupport.enabled = true
   }
}
```
</div>
Activating CSS support in your project helps prevent common errors that occur when trying to use style sheets from an unconfigured project, such as `Module parse failed: Unexpected character '@' (14:0)`.

You can use `cssSupport.mode` to specify how encountered CSS should be handled. The following values are available:
- `"inline"` (default): styles are added to the global `<style>` tag.
- `"extract"`: styles are extracted into a separate file. They can then be included from an HTML page.
- `"import"`: styles are processed as strings. This can be useful if you need access to the CSS from your code (e.g. `val styles = require("main.css")`).

To use different modes for the same project, use `cssSupport.rules`. Here, you can specify a list of `KotlinWebpackCssRules`, each of which defines a mode, as well as [include](https://webpack.js.org/configuration/module/#ruleinclude) and [exclude](https://webpack.js.org/configuration/module/#ruleexclude) patterns.

## Configuring Yarn

To configure additional Yarn features, place a `.yarnrc` file in the root of your project.
At build time, it gets picked up automatically.

For example, to use a custom registry for npm packages, add the following line to a file called
`.yarnrc` in the project root:

<div class="sample" markdown="1" mode="shell" theme="idea">

```
registry "http://my.registry/api/npm/"
```

</div>

To learn more about `.yarnrc`, please visit the [official Yarn documentation](https://classic.yarnpkg.com/en/docs/yarnrc/).

## Distribution target directory

By default, the results of a Kotlin/JS project build reside in the `/build/distribution` directory within the project root.

To set another location for project distribution files, add the `distribution` block inside `browser` in the build script and 
assign a value to the `directory` property.
Once you run a project build task, Gradle will save the output bundle in this location together
with project resources.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    js {
        browser {
            distribution {
                directory = file("$projectDir/output/")
            }
        }
        binaries.executable()
        // . . .
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    js {
        browser {
            distribution {
                directory = File("$projectDir/output/")
            }
        }
        binaries.executable()
        // . . .
    }
}
```

</div>
</div>

## Adjusting the module name
To adjust the name for the JavaScript _module_ (which is generated in `build/js/packages/myModuleName`), including the corresponding `.js` and `.d.ts` files, use the `moduleName` option:

<div class="sample" markdown="1" mode="groovy" theme="idea">
```groovy
js {
   moduleName = "myModuleName"
}
```
</div>

Note that this does not affect the webpacked output in `build/distributions`.
