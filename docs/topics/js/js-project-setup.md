[//]: # (title: Set up a Kotlin/JS project)

Kotlin/JS projects use Gradle as a build system. To let developers easily manage their Kotlin/JS projects, we offer
the `kotlin.js` Gradle plugin that provides project configuration tools together with helper tasks for automating routines
typical for JavaScript development. For example, the plugin downloads the [Yarn](https://yarnpkg.com/) package manager
for managing [npm](https://www.npmjs.com/) dependencies in background and can build a JavaScript bundle from a Kotlin project
using [webpack](https://webpack.js.org/). Dependency management and configuration adjustments can be done to a large part
directly from the Gradle build file, with the option to override automatically generated configurations for full control.

To create a Kotlin/JS project in IntelliJ IDEA, go to **File | New | Project**. Then select **Kotlin** and choose a 
Kotlin/JS target that suits you best. Don't forget to choose the language for the build script: Groovy or Kotlin.

![New project wizard](js-project-wizard.png){width=700}

Alternatively, you can apply the `org.jetbrains.kotlin.js` plugin to a Gradle project manually in the Gradle build file
(`build.gradle` or `build.gradle.kts`).

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
     kotlin("js") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.js' version '%kotlinVersion%'
}
```

</tab>
</tabs>

The Kotlin/JS Gradle plugin lets you manage aspects of your project in the `kotlin` section of the build script.

```groovy
kotlin {
    //...
}
```

Inside the `kotlin` section, you can manage the following aspects:

* [Target execution environment](#execution-environments): browser or Node.js 
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

To define the target execution environment for a Kotlin/JS project, add the `js` section with `browser {}` or `nodejs {}`
inside.

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
This is the default behavior when using the current Kotlin/JS compiler, but the instruction is explicitly required if you
are working with the [Kotlin/JS IR compiler](js-ir-compiler.md), or have set `kotlin.js.generate.executable.default=false`
in your `gradle.properties`. In those cases, omitting `binaries.executable()` will cause the compiler to only generate 
Kotlin-internal library files, which can be used from other projects, but not run on their own. (This is typically faster
than creating executable files, and can be a possible optimization when dealing with non-leaf modules of your project.)

The Kotlin/JS plugin automatically configures its tasks for working with the selected environment.
This includes downloading and installing the required environment and dependencies for running and testing the application.
This allows developers to build, run, and test simple projects without additional configuration. For projects targeting
Node.js, there are also an option to use an existing Node.js installation. Learn how to [use pre-installed Node.js](#use-pre-installed-node-js).



## Dependencies

Like any other Gradle projects, Kotlin/JS projects support traditional Gradle [dependency declarations](https://docs.gradle.org/current/userguide/declaring_dependencies.html)
in the `dependencies` section of the build script.

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

The Kotlin/JS Gradle plugin also supports dependency declarations for particular source sets in the `kotlin` section 
of the build script.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
  sourceSets["main"].dependencies {
    implementation("org.example.myproject", "1.1.0")
  }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

Please note that not all libraries available for the Kotlin programming language are available when targeting JavaScript:
Only libraries that include artifacts for Kotlin/JS can be used.

If the library you are adding has dependencies on [packages from npm](#npm-dependencies), Gradle will automatically resolve
these transitive dependencies as well.

### Kotlin standard libraries

The dependency on the Kotlin/JS [standard library](https://kotlinlang.org/api/latest/jvm/stdlib/index.html) is mandatory
for all Kotlin/JS projects, and as such is implicit – no artifacts need to be added.

If your project contains tests written in Kotlin, you should add a dependency on the
[kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/index.html) library:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    testImplementation(kotlin("test-js"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    testImplementation 'org.jetbrains.kotlin:kotlin-test-js'
}
```

</tab>
</tabs>

### npm dependencies

In the JavaScript world, the most common way to manage dependencies is [npm](https://www.npmjs.com/).
It offers the biggest public repository of JavaScript modules.

The Kotlin/JS Gradle plugin lets you declare npm dependencies in the Gradle build script, analogous to how you would
declare any other dependencies.

To declare an npm dependency, pass its name and version to the `npm()` function inside a dependency declaration.
You can also specify one or multiple version range based on [npm's semver syntax](https://docs.npmjs.com/misc/semver#versions).

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

The plugin uses the [Yarn](https://yarnpkg.com/lang/en/) package manager to download and install NPM dependencies.
It works out of the box without additional configuration, but you can tune it to specific needs.
Learn how to [configure Yarn in Kotlin/JS Gradle plugin](#yarn).

Besides regular dependencies, there are three more types of dependencies that can be used from the Gradle DSL.
To learn more about when each type of dependency can best be used, have a look at the official documentation linked from npm:

- [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies), via `devNpm(...)`,
- [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies) via `optionalNpm(...)`, and
- [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies) via `peerNpm(...)`.

Once an npm dependency is installed, you can use its API in your code as described in [Calling JS from Kotlin](js-interop.md).

## run task

The Kotlin/JS plugin provides a `run` task that lets you run pure Kotlin/JS projects without additional configuration.

For running Kotlin/JS projects in the browser, this task is an alias for the `browserDevelopmentRun` task (which is also
available in Kotlin multiplatform projects). It uses the [webpack-dev-server](https://webpack.js.org/configuration/dev-server/)
to serve your JavaScript artifacts.
If you want to customize the configuration used by `webpack-dev-server`, for example adjust the port the server runs on,
use the [webpack configuration file](#webpack-bundling).

For running Kotlin/JS projects targeting Node.js, the `run` task is an alias for the `nodeRun` task (which is also
available in Kotlin multiplatform projects). 

To run a project, execute the standard lifecycle `run` task, or the alias to which it corresponds:

```bash
./gradlew run
```

To automatically trigger a re-build of your application after making changes to the source files, use the Gradle
[continuous build](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build) feature:

```bash
./gradlew run --continuous
```

or 

```bash
./gradlew run -t
```

Once the build of your project has succeeded, the `webpack-dev-server` will automatically refresh the browser page.

## test task

The Kotlin/JS Gradle plugin automatically sets up a test infrastructure for projects. For browser projects, it downloads
and installs the [Karma](https://karma-runner.github.io/) test runner with other required dependencies;
for Node.js projects, the [Mocha](https://mochajs.org/) test framework is used. 

The plugin also provides useful testing features, for example:

* Source maps generation
* Test reports generation
* Test run results in the console

For running browser tests, the plugin uses [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)
by default. You can also choose other browser to run tests in, by adding the corresponding entries inside the `useKarma`
section of the build script:

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

Please note that the Kotlin/JS Gradle plugin does not automatically install these browsers for you, but only uses those
that are available in its execution environment. If you are executing Kotlin/JS tests on a continuous integration server,
for example, make sure that the browsers you want to test against are installed.

If you want to skip tests, add the line `enabled = false` to the `testTask`.

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

To run tests, execute the standard lifecycle `check` task:

```bash
./gradlew check
```

### Karma configuration

The Kotlin/JS Gradle plugin automatically generates a Karma configuration file at build time which includes your settings
from the [`kotlin.js.browser.testTask.useKarma` block](#test-task) in your `build.gradle(.kts)`. You can find
the file at `build/js/packages/projectName-test/karma.conf.js`. 
To make adjustments to the configuration used by Karma, place your additional configuration files inside a directory
called `karma.config.d` in the root of your project. All `.js` configuration files in this directory will be picked up
and are automatically merged into the generated `karma.conf.js` at build time.

All karma configuration abilities are well described in Karma's [documentation](https://karma-runner.github.io/5.0/config/configuration-file.html).

## webpack bundling

For browser targets, the Kotlin/JS plugin uses the widely known [webpack](https://webpack.js.org/) module bundler.

### webpack version 

The Kotlin/JS plugin uses webpack %webpackMajorVersion%.

If you have projects created with plugin versions earlier than 1.5.0,
you can temporarily switch back to webpack %webpackPreviousMajorVersion% used in these versions by adding the following line
to the project's `gradle.properties`:

```properties
kotlin.js.webpack.major.version=4
```

### webpack task

The most common webpack adjustments can be made directly via the
`kotlin.js.browser.webpackTask` configuration block in the Gradle build file:
- `outputFileName` - the name of the webpacked output file. It will be generated in `<projectDir>/build/distibution/` after
  an execution of a webpack task. The default value is the project name.
- `output.libraryTarget` - the module system for the webpacked output. Learn more about [available module systems for
  Kotlin/JS projects](js-modules.md). The default value is `umd`.
  
```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

You can also configure common webpack settings to use in bundling, running, and testing tasks in the `commonWebpackConfig`
block.

### webpack configuration file 

The Kotlin/JS Gradle plugin automatically generates a standard webpack configuration file
at the build time. It is located in `build/js/packages/projectName/webpack.config.js`.

If you want to make further adjustments to the webpack configuration, place your additional configuration files inside
a directory called `webpack.config.d` in the root of your project. When building your project, all `.js` configuration
files will automatically be merged into the `build/js/packages/projectName/webpack.config.js` file.
To add a new [webpack loader](https://webpack.js.org/loaders/), for example, add the following to
a `.js` file inside the `webpack.config.d`:

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

All webpack configuration
capabilities are well described in its [documentation](https://webpack.js.org/concepts/configuration/).

### Building executables

For building executable JavaScript artifacts through webpack, the Kotlin/JS plugin contains the `browserDevelopmentWebpack`
and `browserProductionWebpack` Gradle tasks.

* `browserDevelopmentWebpack` creates development artifacts, which are larger in size, but take little time to create.
As such, use the `browserDevelopmentWebpack` tasks during active development.

* `browserProductionWebpack` applies [dead code elimination](javascript-dce.md) to the generated artifacts and minifies
the resulting JavaScript file, which takes more time, but generates executables that are smaller in size. As such, use
the `browserProductionWebpack` task when preparing your project for production use.
 
 Execute either of these tasks to obtain the respective artifacts for development or production. The generated files will
 be available in `build/distributions` unless [specified otherwise](#distribution-target-directory).

```bash
./gradlew browserProductionWebpack
```

Note that these tasks will only be available if your target is configured to generate executable files (via `binaries.executable()`).

## CSS

The Kotlin/JS Gradle plugin also provides support for webpack's [CSS](https://webpack.js.org/loaders/css-loader/) and
[style](https://webpack.js.org/loaders/style-loader/) loaders. While all options can be changed by directly modifying
the [webpack configuration files](#webpack-bundling) that are used to build your project, the most commonly
used settings are available directly from the `build.gradle(.kts)` file.

To turn on CSS support in your project, set the `cssSupport.enabled` option in the Gradle build file in the `commonWbpackConfig`
block. This configuration is also enabled by default when creating a new project using the wizard.

```groovy
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
    binaries.executable()
}
```

Alternatively, you can add CSS support independently for `webpackTask`, `runTask`, and `testTask`.

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

Activating CSS support in your project helps prevent common errors that occur when trying to use style sheets from
an unconfigured project, such as `Module parse failed: Unexpected character '@' (14:0)`.

You can use `cssSupport.mode` to specify how encountered CSS should be handled. The following values are available:

- `"inline"` (default): styles are added to the global `<style>` tag.
- `"extract"`: styles are extracted into a separate file. They can then be included from an HTML page.
- `"import"`: styles are processed as strings. This can be useful if you need access to the CSS from your code (such as
`val styles = require("main.css")`).

To use different modes for the same project, use `cssSupport.rules`. Here, you can specify a list of `KotlinWebpackCssRules`,
each of which define a mode, as well as [include](https://webpack.js.org/configuration/module/#ruleinclude) and
[exclude](https://webpack.js.org/configuration/module/#ruleexclude) patterns.

## Node.js

For Kotlin/JS projects targeting Node.js, the plugin automatically downloads and installs the Node.js environment on the
host. You can also use an existing Node.js instance if you have it.

### Use pre-installed Node.js

If Node.js is already installed on the host where you build Kotlin/JS projects, you can configure the Kotlin/JS Gradle
plugin to use it instead of installing its own Node.js instance.

To use the pre-installed Node.js instance, add the following lines to your `build.gradle(.kts)`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin::class.java> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false
    // or true for default behavior
}
 
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension).download = false
}
```

</tab>
</tabs>


## Yarn

To download and install your declared dependencies at build time, the plugin manages its own instance of the
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

To learn more about `.yarnrc`, please visit the [official Yarn documentation](https://classic.yarnpkg.com/en/docs/yarnrc/).

### Use pre-installed Yarn

If Yarn is already installed on the host where you build Kotlin/JS projects, you can configure the Kotlin/JS Gradle
plugin to use it instead of installing its own Yarn instance.

To use the pre-installed Yarn instance, add the following lines to your `build.gradle(.kts)`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false
    // or true for default behavior
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


## Distribution target directory

By default, the results of a Kotlin/JS project build reside in the `/build/distribution` directory within the project root.

To set another location for project distribution files, add the `distribution` block inside `browser` in the build script and 
assign a value to the `directory` property.
Once you run a project build task, Gradle will save the output bundle in this location together with project resources.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

Note that this does not affect the webpacked output in `build/distributions`.

## package.json customization

The `package.json` file holds the metadata of a JavaScript package. Popular package registries such as npm require all 
published packages to have such a file. They use it to track and manage package publications.  

The Kotlin/JS Gradle plugin automatically generates `package.json` for Kotlin/JS projects during build time. By default, 
the file contains essential data: name, version, license, and dependencies, and some other package attributes.

Aside from basic package attributes, `package.json` can define how a JavaScript project should behave, for example,
identifying scripts that are available to run.

You can add custom entries to the project's `package.json` via the Gradle DSL. To add custom fields to your `package.json`,
use the `customField` function in the compilations `packageJson` block:

```kotlin
kotlin {
    js {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

When you build the project, this code will add the following block to the `package.json` file:

```
"hello": {
  "one": 1,
  "two": 2
}
```

Learn more about writing `package.json` files for npm registry in the [npm docs](https://docs.npmjs.com/cli/v6/configuring-npm/package-json).

## Troubleshooting

When building a Kotlin/JS project using Kotlin 1.3.xx, you may encounter a Gradle error if one of your dependencies (or
any transitive dependency) was built using Kotlin 1.4 or higher:
`Could not determine the dependencies of task ':client:jsTestPackageJson'.` / `Cannot choose between the following variants`.
This is a known problem, a workaround is provided [here](https://youtrack.jetbrains.com/issue/KT-40226).
