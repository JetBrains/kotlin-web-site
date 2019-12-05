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
for managing NPM dependencies in background and builds a JavaScript bundle from a Kotlin project using [Webpack](https://webpack.js.org/).

To create a Kotlin/JS project in IntelliJ IDEA, go to **File | New | Project** and select **Gradle | Kotlin/JS for browser**
 or **Kotlin/JS for Node.js**. Be sure to clear the **Java** checkbox.
 
![New project wizard]({{ url_for('asset', path='images/reference/js-project-setup/wizard.png') }})


Alternatively, you can apply the `org.jetbrains.kotlin.js` plugin to a Gradle project manually in the `build.gradle` file.
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
* [Project dependencies](#managing-dependencies): Maven and NPM
* [Run configuration](#configuring-run-task)
* [Test configuration](#configuring-test-task)
* [Bundling](#configuring-webpack-bundling) for browser projects.

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
    testImplementation("org.jetbrains.kotlin:kotlin-test-js")
}
```

</div>
</div>

### NPM dependencies

In the JavaScript world, the common way to manage dependencies is [NPM](https://www.npmjs.com/).
It offers the biggest public [repository](https://www.npmjs.com/)of JavaScript modules and a tool for downloading them.
The Kotlin/JS plugin lets you declare NPM dependencies in the Gradle build script among other dependencies and
does everything else automatically. Particularly, it installs the [Yarn](https://yarnpkg.com/lang/en/) package manager
and uses it to download the dependencies from the NPM repository to the `node_modules` directory of your project -
the common location for NPM dependencies of a JavaScript project. 

To declare an NPM dependency, use the `npm()` function inside the `dependencies` section of a source set.

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
    implementation(npm("react", "16.8.3"))
  }
}
```

</div>
</div>

Once an NPM dependency is installed, you can use its API in your code as described in 
[Calling JS from Kotlin](js-interop.html).

## Configuring run task

The Kotlin/JS plugin provides a run task that lets you run projects without additional configuration.
For running Kotlin/JS projects, it uses [Webpack DevServer](https://webpack.js.org/configuration/dev-server/).
If you want to customize the DevServer configuration, for example, change its port, use the Webpack configuration file.

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
kotlin {
    target {
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
    }
}
```

</div>

If you want to skip tests, add the line `enabled = false` to the `testTask`.

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin {
    target {
        browser {
            testTask {
                enabled = false
            }
        }
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

## Configuring Webpack bundling

For building executable JavaScript artifacts, the Kotlin/JS plugins contains the `webpackTask`.

To build a project artifact using Webpack, execute the `build` Gradle task:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./gradlew build
```

</div>