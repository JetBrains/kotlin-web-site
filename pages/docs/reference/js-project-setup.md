---
type: doc
layout: reference
category: "JavaScript"
title: "Setting Up Kotlin/JS Project"
---

# Setting up a Kotlin/JS project

Kotlin/JS projects use Gradle as a build system. To let developers easily manage their Kotlin/JS projects, we offer
the Kotlin/JS Gradle plugin that provides project configuration tools together with helper tasks for automating routines
typical for JavaScript development. For example, the plugin downloads the [Yarn](https://yarnpkg.com/) package manager
for managing [npm](https://www.npmjs.com/) dependencies in background and builds a JavaScript bundle from a Kotlin project
using [webpack](https://webpack.js.org/).

To create a Kotlin/JS project in IntelliJ IDEA, go to **File | New | Project** and select **Gradle | Kotlin/JS for browser**
 or **Kotlin/JS for Node.js**. Be sure to clear the **Java** checkbox.

![New project wizard]({{ url_for('asset', path='images/reference/js-project-setup/wizard.png') }})


Alternatively, you can apply the `org.jetbrains.kotlin.js` plugin to a Gradle project manually in the Gradle build file (`build.gradle` or `build.gradle.kts`).
If you use the Gradle Kotlin DSL, you can apply the plugin with `kotlin(“js”)`.

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

The Kotlin/JS plugin lets you manage aspects of your project in the `kotlin` section of the build script.

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

To define the target execution environment for a Kotlin/JS project, add the `target` section with `browser {}` or `nodejs {}` inside.

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin {
    target {
        browser {
        }       
    }
}    
```

</div>

Or just

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin.target.browser {     
}    
```

</div>

The Kotlin/JS plugin automatically configures its tasks for working with the selected environment.
This includes downloading and installing dependencies required for running and testing the application, and therefore
lets developers  build, run, and test simple projects without additional configuration. 

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

In the JavaScript world, the common way to manage dependencies is [npm](https://www.npmjs.com/).
It offers the biggest public [repository](https://www.npmjs.com/) of JavaScript modules and a tool for downloading them.

The Kotlin/JS plugin lets you declare npm dependencies in the Gradle build script among other dependencies and
does everything else automatically. It installs the [Yarn](https://yarnpkg.com/lang/en/) package manager
and uses it to download the dependencies from the npm repository to the `node_modules` directory of your project -
the common location for npm dependencies of a JavaScript project. 

To declare an npm dependency, pass its name and version to the `npm()` function inside a dependency declaration.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    implementation npm('react', '16.12.0')
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    implementation(npm("react", "16.12.0"))
}
```

</div>
</div>

Once an npm dependency is installed, you can use its API in your code as described in 
[Calling JS from Kotlin](js-interop.html).

## Configuring run task

The Kotlin/JS plugin provides a run task that lets you run projects without additional configuration.
For running Kotlin/JS projects, it uses [webpack DevServer](https://webpack.js.org/configuration/dev-server/).
If you want to customize the DevServer configuration, for example, change its port, use the webpack configuration file.

To run the project, execute the standard lifecycle `run` task:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./gradlew run
```

</div>

To see the source file changes in browser without restarting the DevServer, use 
the Gradle [continuous build](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build):

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

## Configuring test task

The Kotin/JS Gradle plugin automatically sets up a test infrastructure for projects. For browser projects, it downloads
and installs the [Karma](https://karma-runner.github.io/) test runner with other required dependencies;
for NodeJS projects, the [Mocha](https://mochajs.org/) test framework is used. 

The plugin also provides useful testing features, for example:

* Source maps generation
* Test reports generation
* Test run results in the console

By default, the plugin uses [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)
for running browser tests. You can also run them in other browsers by adding the corresponding entries inside the
`useKarma` section of the build script:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin.target.browser {
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
```

</div>

If you want to skip tests, add the line `enabled = false` to the `testTask`.

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin.target.browser {
    testTask {
        enabled = false
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

## Configuring webpack bundling

For browser targets, the Kotlin/JS plugin uses the widely known [webpack](https://webpack.js.org/) module bundler.

The Kotlin/JS Gradle plugin automatically generates a standard webpack configuration file 
at build time which you can find the at `build/js/packages/projectName/webpack.config.js`.

The most common webpack adjustments can be made directly via the
`kotlin.target.browser.webpackTask` configuration block in the Gradle build file.

If you want to make further adjustments to the webpack configuration, place your additional configuration files inside a directory
called `webpack.config.d` in the root of your project. When building your project, all JS configuration files will automatically
be merged into the `build/js/packages/projectName/webpack.config.js` file.
To add a new [webpack loader](https://webpack.js.org/loaders/), for example, add the following to
a `.js` file inside the `webpack.config.d`:

<div class="sample" markdown="1" mode="javascript" theme="idea">

```javascript
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

</div>

All webpack configuration
capabilities are well described in its [documentation](https://webpack.js.org/concepts/configuration/).

For building executable JavaScript artifacts though webpack, the Kotlin/JS plugin contains the `browserDevelopmentWebpack`
`browserProductionWebpack` Gradle tasks. Execute them to obtain artifacts for development or production respectively:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./gradlew browserProductionWebpack
```

</div>

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
kotlin.target.browser {
    distribution {
        directory = file("$projectDir/output/")
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin.target.browser {
    distribution {
        directory = File("$projectDir/output/")
    }
}
```

</div>
</div>
