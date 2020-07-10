---
type: doc
layout: reference
title: "Building Multiplatform Projects with Gradle"
---

# Building Multiplatform Projects with Gradle

> Multiplatform projects are an experimental feature in Kotlin 1.2 and 1.3. All of the language
and tooling features described in this document are subject to change in future Kotlin versions.
{:.note}

This document explains the structure of [Kotlin multiplatform projects](multiplatform.html) and describes how 
those are configured and built using Gradle.

## Table of Contents

* [Project Structure](#project-structure)
* [Setting up a Multiplatform Project](#setting-up-a-multiplatform-project)
* [Gradle Plugin](#gradle-plugin)
* [Setting up Targets](#setting-up-targets)
    * [Supported platforms](#supported-platforms)
    * [Configuring compilations](#configuring-compilations)
* [Configuring Source Sets](#configuring-source-sets)
    * [Connecting source sets](#connecting-source-sets)
    * [Adding dependencies](#adding-dependencies)
    * [Language settings](#language-settings)
* [Default Project Layout](#default-project-layout)
* [Running Tests](#running-tests)
* [Publishing a Multiplatform Library](#publishing-a-multiplatform-library)
    * [Metadata publishing](#metadata-publishing)
    * [Disambiguating targets](#disambiguating-targets)
* [Java Support in JVM Targets](#java-support-in-jvm-targets)
* [Android Support](#android-support)
    * [Publishing Android libraries](#publishing-android-libraries)
* [Using Kotlin/Native Targets](#using-kotlinnative-targets)
    * [Target shortcuts](#target-shortcuts)
    * [Building final native binaries](#building-final-native-binaries)

## Project Structure

The layout of a Kotlin multiplatform project is constructed out of the following building blocks:

* A [target](#setting-up-targets) is a part of the build that is responsible for building, testing, 
and packaging a complete piece of software for one of the platforms. Therefore, a multiplatform project usually contains 
multiple targets. 

* Building each target involves compiling Kotlin sources once or multiple times. In other words, a target may have one or 
more [compilations](#configuring-compilations). For example, one compilation for production sources, the other for tests.

* The Kotlin sources are arranged into [source sets](#configuring-source-sets). In addition to Kotlin source files and 
resources, each source set may have its own dependencies. Source sets form a hierarchy that is built with 
the *"depends on"* relation. A source set by itself is platform agnostic, but it may contain platform-specific code and 
dependencies if it's only compiled for a single platform.

Each compilation has a default source set, which is the place for sources and dependencies that are specific to that 
compilation. The default source set is also used for directing other source sets to the compilation by the means of the 
"depends on" relation.

Here's an illustration of what a project targeting the JVM and JS looks like:

![Project structure]({{ url_for('asset', path='images/reference/building-mpp-with-gradle/mpp-structure-default-jvm-js.png') }})

Here, the two targets, `jvm` and `js`, each compile the production and test sources, and some of the sources are shared.
This layout is achieved by just creating the two targets, with no additional configuration for the compilations and 
source sets: those are [created by default](#default-project-layout) for these targets.

In the example above, the production sources for the JVM target are compiled by its `main` compilation and therefore 
include the sources and dependencies from the source sets `jvmMain` and `commonMain` (due to the *depends on* relation):

![Source sets and compilation]({{ url_for('asset', path='images/reference/building-mpp-with-gradle/mpp-one-compilation.png') }})

Here, the `jvmMain` source set provides [plaform-specific implementations](platform-specific-declarations.html) for the 
expected API in the shared `commonMain` sources. This is how the code is shared between the platforms in a flexible way
with platform-specific implementations where needed.

In further sections, these concepts are described in more detail along with the DSL to configure them in a project.

## Setting up a Multiplatform Project

You can create a new multiplatform project in the IDE by selecting one of the multiplatform project templates in the 
New Project dialog under the "Kotlin" section.

For example, if you choose "Kotlin (Multiplatform Library)", a library project is created that has three 
[targets](#setting-up-targets), one for the JVM, one for JS, and one for the Native platform that you are using. 
These are configured in the `build.gradle`
script in the following way:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}

repositories {
    mavenCentral()
}

kotlin {
    jvm() // Creates a JVM target with the default name 'jvm'
    js()  // JS target named 'js'
    mingwX64("mingw") // Windows (MinGW X64) target named 'mingw'
    
    sourceSets { /* ... */ }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}

repositories {
    mavenCentral()
}

kotlin {
    jvm() // Creates a JVM target with the default name 'jvm'
    js()  // JS target named 'js'
    mingwX64("mingw") // Windows (MinGW X64) target named 'mingw'
    
    sourceSets { /* ... */ }
}
```

</div>
</div>

The three targets are created with the preset functions `jvm()`, `js()`, and `mingwX64()` that provide some 
[default configuration](#default-project-layout). There are presets for each of the [supported platforms](#supported-platforms).

The [source sets](#configuring-source-sets) and their [dependencies](#adding-dependencies) are then configured as follows:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins { /* ... */ }

kotlin {
    /* Targets declarations omitted */

    sourceSets {
        commonMain {
            dependencies {
                implementation kotlin('stdlib-common')
            }
        }
        commonTest {
            dependencies {
                implementation kotlin('test-common')
                implementation kotlin('test-annotations-common')
            }
        }
        
        // Default source set for JVM-specific sources and dependencies.
        // Alternatively, jvmMain { ... } would work as well:
        jvm().compilations.main.defaultSourceSet {
            dependencies {
                implementation kotlin('stdlib-jdk8')
            }
        }
        // JVM-specific tests and their dependencies:
        jvm().compilations.test.defaultSourceSet {
            dependencies {
                implementation kotlin('test-junit')
            }
        }
        
        js().compilations.main.defaultSourceSet  { /* ... */ }
        js().compilations.test.defaultSourceSet { /* ... */ }
        
        mingwX64('mingw').compilations.main.defaultSourceSet { /* ... */ }
        mingwX64('mingw').compilations.test.defaultSourceSet { /* ... */ }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins { /* ... */ }

kotlin {
    /* Targets declarations omitted */

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(kotlin("stdlib-common"))
            }
        }
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test-common"))
                implementation(kotlin("test-annotations-common"))
            }
        }
        
        // Default source set for JVM-specific sources and dependencies:
        jvm().compilations["main"].defaultSourceSet {
            dependencies {
                implementation(kotlin("stdlib-jdk8"))
            }
        }
        // JVM-specific tests and their dependencies:
        jvm().compilations["test"].defaultSourceSet {
            dependencies {
                implementation(kotlin("test-junit"))
            }
        }
        
        js().compilations["main"].defaultSourceSet  { /* ... */ }
        js().compilations["test"].defaultSourceSet { /* ... */ }
        
        mingwX64("mingw").compilations["main"].defaultSourceSet { /* ... */ }
        mingwX64("mingw").compilations["test"].defaultSourceSet { /* ... */ }
    }
}
```

</div>
</div>

These are the [default source set names](#default-project-layout) for the production and test sources for the targets 
configured above. The source sets `commonMain` and `commonTest` are included into production and test compilations, respectively, of all targets. 
Note that the dependencies for common source sets `commonMain` and `commonTest` are the common artifacts, and the 
platform libraries go to the source sets of the specific targets.

## Gradle Plugin

Kotlin Multiplatform projects require Gradle version 4.7 and above, older Gradle versions are not supported.

To setup a multiplatform project from scratch in a Gradle project, first apply the 
`kotlin-multiplatform` plugin to the project by adding the following to the
beginning of the `build.gradle` file:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

This creates the `kotlin` extension at the top level. You can then access it in the build script for:

* [setting up the targets](#setting-up-targets) for multiple platforms (no targets are created by default);
* [configuring the source sets](#configuring-source-sets) and their [dependencies](#adding-dependencies);

## Setting up Targets

A target is a part of the build responsible for compiling, testing, and packaging a piece of software aimed for
one of the [supported platforms](#supported-platforms).

All of the targets may share some of the sources and may have platform-specific sources as well.

As the platforms are different, targets are built in different ways as well and have various platform-specific 
settings. The Gradle plugin bundles a number of presets for the supported platforms. 

To create a target, use one of the preset functions, which are named according to the target platforms and optionally 
accept the target name and a configuring code block:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

``` groovy
kotlin {
    jvm() // Create a JVM target with the default name 'jvm'
    js("nodeJs") // Create a JS target with a custom name 'nodeJs'
        
    linuxX64("linux") {
        /* Specify additional settings for the 'linux' target here */
    }
}
``` 
</div>

The preset functions return an existing target if there is one. This can be used to configure an existing target:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    /* ... */
    
    // Configure the attributes of the 'jvm6' target:
    jvm("jvm6").attributes { /* ... */ }
}
```

</div>

Note that both the target platform and the name matter: if a target was created as `jvm('jvm6')`, using `jvm()` will
create a separate target (with the default name `jvm`). If the preset function used to create the target under that name
was different, an error is reported.

The targets created from presets are added to the `kotlin.targets` domain object collection, which can be used to 
access them by their names or configure all targets:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm()
    js("nodeJs")
    
    println(targets.names) // Prints: [jvm, metadata, nodeJs]
    
    // Configure all targets, including those which will be added later:
    targets.all {
        compilations["main"].defaultSourceSet { /* ... */ }
    }
}
```

</div>

To create or access several targets from multiple presets dynamically, you can use the `targetFromPreset` function which
accepts a preset (those are contained in the `kotlin.presets` domain object collection) and, optionally, a target name 
and a configuration code block.

For example, to create a target for each of the Kotlin/Native supported platforms (see below), use this code:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    presets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTargetPreset).each {
        targetFromPreset(it) { 
            /* Configure each of the created targets */
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTargetPreset

/* ... */

kotlin {
    presets.withType<KotlinNativeTargetPreset>().forEach {
        targetFromPreset(it) { 
            /* Configure each of the created targets */
        }
    }
}
```

</div>
</div>


### Supported platforms

There are target presets that one can apply using the preset functions, as shown above, for the
following target platforms:

* `jvm` for Kotlin/JVM;
* `js` for Kotlin/JS;
* `android` for Android applications and libraries. Note that one of the Android Gradle 
   plugins should be applied before the target is created;
  
*  Kotlin/Native target presets (see the [notes](#using-kotlinnative-targets) below):
  
    * `androidNativeArm32` and `androidNativeArm64` for Android NDK;
    * `iosArm32`, `iosArm64`, `iosX64` for iOS;
    * `watchosArm32`, `watchosArm64`, `watchosX86` for watchOS;
    * `tvosArm64`, `tvosX64` for tvOS;
    * `linuxArm64`, `linuxArm32Hfp`, `linuxMips32`, `linuxMipsel32`, `linuxX64` for Linux;
    * `macosX64` for MacOS;
    * `mingwX64` and `mingwX86` for Windows;
    * `wasm32` for WebAssembly.
    
    Note that some of the Kotlin/Native targets require an [appropriate host machine](#using-kotlinnative-targets) to build on.
    
Some targets may require additional configuration. For Android and iOS examples, see 
the [Multiplatform Project: iOS and Android](/docs/tutorials/native/mpp-ios-android.html) tutorial.

### Configuring compilations

Building a target requires compiling Kotlin once or multiple times. Each Kotlin compilation of a target may serve a 
different purpose (e.g. production code, tests) and incorporate different [source sets](#configuring-source-sets). 
The compilations of a target may be accessed in the DSL, for example, to get the tasks, configure 
[the Kotlin compiler options](using-gradle.html#compiler-options) or get the dependency files and compilation outputs:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm {
        compilations.main.kotlinOptions { 
            // Setup the Kotlin compiler options for the 'main' compilation:
            jvmTarget = "1.8"
        }
        
        compilations.main.compileKotlinTask // get the Kotlin task 'compileKotlinJvm' 
        compilations.main.output // get the main compilation output
        compilations.test.runtimeDependencyFiles // get the test runtime classpath
    }
    
    // Configure all compilations of all targets:
    targets.all {
        compilations.all {
            kotlinOptions {
                allWarningsAsErrors = true
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            kotlinOptions { 
                // Setup the Kotlin compiler options for the 'main' compilation:
                jvmTarget = "1.8"
            }
        
            compileKotlinTask // get the Kotlin task 'compileKotlinJvm' 
            output // get the main compilation output
        }
        
        compilations["test"].runtimeDependencyFiles // get the test runtime classpath
    }
    
    // Configure all compilations of all targets:
    targets.all {
        compilations.all {
            kotlinOptions {
                allWarningsAsErrors = true
            }
        }
    }
}
```

</div>
</div>

Each compilation is accompanied by a default [source set](#configuring-source-sets) that stores sources and dependencies 
specific to that compilation. The default source set for a compilation `foo` of a target `bar` has the name `barFoo`.
It can also be accessed from a compilation using `defaultSourceSet`:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm() // Create a JVM target with the default name 'jvm'
    
    sourceSets {
        // The default source set for the 'main` compilation of the 'jvm' target:
        jvmMain {
            /* ... */
        }
    }
    
    // Alternatively, access it from the target's compilation:
    jvm().compilations.main.defaultSourceSet { 
        /* ... */
    }
}
```

</div> 
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm() // Create a JVM target with the default name 'jvm'
    
    sourceSets {
        // The default source set for the 'main` compilation of the 'jvm' target:
        val jvmMain by getting {
            /* ... */
        }
    }
    
    // Alternatively, access it from the target's compilation:
    jvm().compilations["main"].defaultSourceSet { 
        /* ... */
    }
}
```

</div>
</div> 

To collect all source sets participating in a compilation, including those added via the depends-on relation, one can
use the property `allKotlinSourceSets`. 

For some specific use cases, creating a custom compilation may be required. This can be done within the target's `compilations` 
domain object collection. Note that the dependencies need to be set up manually for all custom compilations, and the 
usage of a custom compilation's outputs is up to the build author. For example, consider a custom compilation for integration tests
of a `jvm()` target:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm() {
        compilations.create('integrationTest') {
            defaultSourceSet {
                dependencies {
                    def main = compilations.main
                    // Compile against the main compilation's compile classpath and outputs:
                    implementation(main.compileDependencyFiles + main.output.classesDirs)
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // Create a test task to run the tests produced by this compilation:
            tasks.create('jvmIntegrationTest', Test) {
                // Run the tests with the classpath containing the compile dependencies (including 'main'),
                // runtime dependencies, and the outputs of this compilation:
                classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs

                // Run only the tests from this compilation's outputs:
                testClassesDirs = output.classesDirs
            }
        }
    }
}
```

</div> 
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm() {
        compilations {
            val main by getting

            val integrationTest by compilations.creating {
                defaultSourceSet {
                    dependencies {
                        // Compile against the main compilation's compile classpath and outputs:
                        implementation(main.compileDependencyFiles + main.output.classesDirs)
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }

                // Create a test task to run the tests produced by this compilation:
                tasks.create<Test>("integrationTest") {
                    // Run the tests with the classpath containing the compile dependencies (including 'main'),
                    // runtime dependencies, and the outputs of this compilation:
                    classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs

                    // Run only the tests from this compilation's outputs:
                    testClassesDirs = output.classesDirs
                }
            }
        }
    }
}
```

</div>
</div>

Also note that the default source set of a custom compilation depends on neither `commonMain` nor `commonTest` by 
default.

## Configuring Source Sets

A Kotlin source set is a collection of Kotlin sources, along with their resources, dependencies, and language settings, 
which may take part in Kotlin compilations of one or more [targets](#setting-up-targets).

A source set is not bound to be platform-specific or "shared"; what it's allowed to contain depends on its usage: 
a source set added to multiple compilations is limited to the common language features and dependencies, while a source 
set that is only used by a single target can have platform-specific dependencies, and its code may use language 
features specific to that target's platform.

Some source sets are created and configured by default: `commonMain`, `commonTest`, and the default source sets for the
 compilations. See [Default Project Layout](#default-project-layout).

The source sets are configured within a `sourceSets { ... }` block of the `kotlin { ... }` extension:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin { 
    sourceSets { 
        foo { /* ... */ } // create or configure a source set by the name 'foo' 
        bar { /* ... */ }
    }
}
``` 

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin { 
    sourceSets { 
        val foo by creating { /* ... */ } // create a new source set by the name 'foo'
        val bar by getting { /* ... */ } // configure an existing source set by the name 'bar' 
    }
}
```

</div>
</div>

> Note: creating a source set does not link it to any target. Some source sets are [predefined](#default-project-layout) 
and thus compiled by default. However, custom source sets always need to be explicitly directed to the compilations. 
See: [Connecting source sets](#connecting-source-sets). 
{:.note}

The source set names are case-sensitive. When referring to a default source set by its name, make sure the name prefix 
matches a target's name, for example, a source set `iosX64Main` for a target `iosX64`. 

A source set by itself is platform-agnostic, but
it can be considered platform-specific if it is only compiled for a single platform. A source set can, therefore, contain either
common code shared between the platforms or platform-specific code.

Each source set has a default source directory for Kotlin sources: `src/<source set name>/kotlin`. To add Kotlin source 
directories and resources to a source set, use its `kotlin` and `resources` `SourceDirectorySet`s:

By default, the files of a source set are stored in the following directories:

* source files: `src/<source set name>/kotlin`
* resources files: `src/<source set name>/resources`

You should create these directories manually. 

To add custom Kotlin source directories and resources to a source set, use its `kotlin` and `resources` `SourceDirectorySet`s:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin { 
    sourceSets { 
        commonMain {
            kotlin.srcDir('src')
            resources.srcDir('res')
        } 
    }
}
``` 

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin { 
    sourceSets { 
        val commonMain by getting {
            kotlin.srcDir("src")
            resources.srcDir("res")
        } 
    }
}
```

</div>
</div>

### Connecting source sets

Kotlin source sets may be connected with the *'depends on'* relation, so that if a source set `foo`  depends on a 
source set `bar` then:

* whenever `foo` is compiled for a certain target, `bar` takes part in that compilation as well and is also compiled 
into the same target binary form, such as JVM class files or JS code;

* sources of `foo` 'see' the declarations of `bar`, including the `internal` ones, and the [dependencies](#adding-dependencies) of `bar`, even those
 specified as `implementation` dependencies;
 
* `foo` may contain [platform-specific implementations](platform-specific-declarations.html) for the expected declarations of `bar`;

* the resources of `bar` are always processed and copied along with the resources of `foo`;

* the [language settings](#language-settings) of `foo` and `bar` should be consistent;

Circular source set dependencies are prohibited.

The source sets DSL can be used to define these connections between the source sets:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin { 
    sourceSets { 
        commonMain { /* ... */ }
        allJvm {
            dependsOn commonMain
            /* ... */
        } 
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin { 
    sourceSets { 
        val commonMain by getting { /* ... */ }
        val allJvm by creating {
            dependsOn(commonMain)
            /* ... */
        } 
    }
}
```

</div>
</div>

Custom source sets created in addition to the [default ones](#default-project-layout) should be explicitly included into
 the dependencies hierarchy to be able to use declarations from other source sets and, most importantly, to take part 
 in compilations. 
Most often, they need a `dependsOn(commonMain)` or `dependsOn(commonTest)` statement, and some of the default platform-specific
 source sets should depend on the custom ones, 
 directly or indirectly:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin { 
    mingwX64()
    linuxX64()
    
    sourceSets {
        // custom source set with tests for the two targets
        desktopTest { 
            dependsOn commonTest
            /* ... */
        }
        // Make the 'windows' default test source set for depend on 'desktopTest'
        mingwX64().compilations.test.defaultSourceSet { 
            dependsOn desktopTest
            /* ... */
        }
        // And do the same for the other target:
        linuxX64().compilations.test.defaultSourceSet {
            dependsOn desktopTest
            /* ... */
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin { 
    mingwX64()
    linuxX64()
    
    sourceSets {
        // custom source set with tests for the two targets
        val desktopTest by creating { 
            dependsOn(getByName("commonTest"))
            /* ... */
        }
        // Make the 'windows' default test source set for depend on 'desktopTest'
        mingwX64().compilations["test"].defaultSourceSet { 
            dependsOn(desktopTest)
            /* ... */
        }
        // And do the same for the other target:
        linuxX64().compilations["test"].defaultSourceSet {
            dependsOn(desktopTest)
            /* ... */
        }
    }
}
```

</div>
</div>

### Adding Dependencies

To add a dependency to a source set, use a `dependencies { ... }` block of the source sets DSL. Four kinds of dependencies
are supported:

* `api` dependencies are used both during compilation and at runtime and are exported to library consumers. If any types 
  from a dependency are used in the public API of the current module, then it should be an `api` dependency;
  
* `implementation` dependencies are used during compilation and at runtime for the current module, but are not exposed for compilation 
  of other modules depending on the one with the `implementation` dependency. The`implementation` dependency kind should be used for 
  dependencies needed for the internal logic of a module. If a module is an endpoint application which is not published, it may
  use `implementation` dependencies instead of `api` ones.

* `compileOnly` dependencies are only used for compilation of the current module and are available neither at runtime nor during compilation
  of other modules. These dependencies should be used for APIs which have a third-party implementation available at runtime.
  
* `runtimeOnly` dependencies are available at runtime but are not visible during compilation of any module.

Dependencies are specified per source set as follows: 

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                api 'com.example:foo-metadata:1.0'
            }
        }
        jvm6Main {
            dependencies {
                api 'com.example:foo-jvm6:1.0'
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```groovy
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                api("com.example:foo-metadata:1.0")
            }
        }
        val jvm6Main by getting {
            dependencies {
                api("com.example:foo-jvm6:1.0")
            }
        }
    }
}
```

</div>
</div>

Note that for the IDE to correctly analyze the dependencies of the common sources, the common source sets need to have 
corresponding dependencies on the Kotlin metadata packages in addition to the platform-specific artifact dependencies 
of the platform-specific source sets. Usually, an artifact with a suffix 
`-common` (as in `kotlin-stdlib-common`) or `-metadata` is required when using a published library (unless it is 
published with Gradle metadata, as described below).

However, a `project('...')` dependency on another multiplatform project is resolved to an appropriate target
automatically. It is enough to specify a single `project('...')` dependency in a source set's dependencies, 
and the compilations that include the source set will receive a corresponding platform-specific artifact of 
that project, given that it has a compatible target:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                // All of the compilations that include source set 'commonMain'
                // will get this dependency resolved to a compatible target, if any:
                api project(':foo-lib')
            }
        }
    }
}
```

</div>  
</div>  

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                // All of the compilations that include source set 'commonMain'
                // will get this dependency resolved to a compatible target, if any:
                api(project(":foo-lib"))
            }
        }
    }
}
```

</div>
</div>

Likewise, if a multiplatform library is [published with Gradle metadata](#metadata-publishing), it is enough to specify a dependency only once, for the common source set. 
Otherwise, each platform-specific source set should be 
provided with a corresponding platform module of the library, in addition to the common module, as shown above.

An alternative way to specify the dependencies is to use the Gradle built-in DSL at the top level with the configuration names following the 
pattern `<sourceSetName><DependencyKind>`:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
dependencies {
    commonMainApi 'com.example:foo-common:1.0'
    jvm6MainApi 'com.example:foo-jvm6:1.0'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
dependencies {
    "commonMainApi"("com.example:foo-common:1.0")
    "jvm6MainApi"("com.example:foo-jvm6:1.0")
}
```

</div>
</div>

Some of the Gradle built-in dependencies, like `gradleApi()`, `localGroovy()`, or `gradleTestKit()` are not available
in the source sets dependency DSL. You can, however, add them within the top-level dependency block, as shown above.

A dependency on a Kotlin module like `kotlin-stdlib` or `kotlin-reflect` may be added with the notation `kotlin("stdlib")`,
which is a shorthand for `"org.jetbrains.kotlin:kotlin-stdlib"`.

### Language settings

The language settings for a source set can be specified as follows:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    sourceSets {
        commonMain {
            languageSettings {
                languageVersion = '1.3' // possible values: '1.0', '1.1', '1.2', '1.3'
                apiVersion = '1.3' // possible values: '1.0', '1.1', '1.2', '1.3'
                enableLanguageFeature('InlineClasses') // language feature name
                useExperimentalAnnotation('kotlin.ExperimentalUnsignedTypes') // annotation FQ-name
                progressiveMode = true // false by default
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            languageSettings.apply {
                languageVersion = "1.3" // possible values: '1.0', '1.1', '1.2', '1.3'
                apiVersion = "1.3" // possible values: '1.0', '1.1', '1.2', '1.3'
                enableLanguageFeature("InlineClasses") // language feature name
                useExperimentalAnnotation("kotlin.ExperimentalUnsignedTypes") // annotation FQ-name
                progressiveMode = true // false by default
            }
        }
    }
}
```

</div>
</div>


It is possible to configure the language settings of all source sets at once:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin.sourceSets.all {
    languageSettings.progressiveMode = true
}
```

</div>


Language settings of a source set affect how the sources are analyzed in the IDE. Due to the current limitations, in a 
Gradle build, only the language settings of the compilation's default source set are used and are applied to all of the
sources participating in the compilation.

The language settings are checked for consistency between source sets depending on each other. Namely, if `foo` depends on `bar`:

* `foo` should set `languageVersion` that is greater than or equal to that of `bar`;
* `foo` should enable all unstable language features that `bar` enables (there's no such requirement for bugfix features);
* `foo` should use all experimental annotations that `bar` uses;
* `apiVersion`, bugfix language features, and `progressiveMode` can be set arbitrarily; 

## Default Project Layout

By default, each project contains two source sets, `commonMain` and `commonTest`, where one can place all the code that should be 
shared between all of the target platforms. These source sets are added to each production and test compilation, respectively.

Then, once a target is added, default compilations are created for it:

* `main` and `test` compilations for JVM, JS, and Native targets;
* a compilation per [Android build variant](https://developer.android.com/studio/build/build-variants), for Android targets;

For each compilation, there is a default source set under the name composed as `<targetName><CompilationName>`. This default source
set participates in the compilation, and thus it should be used for the platform-specific code and dependencies, and for adding other source
 sets to the compilation by the means of 'depends on'. For example, a project with
targets `jvm6` (JVM) and `nodeJs` (JS) will have source sets: `commonMain`, `commonTest`, `jvm6Main`, `jvm6Test`, `nodeJsMain`, `nodeJsTest`.

Numerous use cases are covered by just the default source sets and don't require custom source sets.
 
Each source set by default has its Kotlin sources under `src/<sourceSetName>/kotlin` directory and the resources under `src/<sourceSetName>/resources`.

In Android projects, additional Kotlin source sets are created for each [Android source set](https://developer.android.com/studio/build/#sourcesets). 
If the Android target has a name `foo`, the Android source set `bar` gets a Kotlin source set counterpart `fooBar`. 
The Kotlin compilations, however, are able to consume Kotlin sources from all of the directories `src/bar/java`, 
`src/bar/kotlin`, and `src/fooBar/kotlin`. Java sources are only read from the first of these directories.

## Running Tests

Running tests in a Gradle build is currently supported by default for JVM, Android, Linux, Windows and macOS; 
JS and other Kotlin/Native targets
need to be manually configured to run the tests with an appropriate environment, an emulator or a test framework.  

A test task is created under the name `<targetName>Test` for each target that is suitable for testing. Run the `check` task to run 
the tests for all targets. 

As the `commonTest` [default source set](#default-project-layout) is added to all test compilations, tests and test tools that are needed
on all target platforms may be placed there.

The [`kotlin.test` API](https://kotlinlang.org/api/latest/kotlin.test/index.html) is available for multiplatform tests. 
Add the `kotlin-test-common` and `kotlin-test-annotations-common` dependencies to `commonTest` to use the assertion 
functions like `kotlin.test.assertTrue(...)`  
and `@Test`/`@Ignore`/`@BeforeTest`/`@AfterTest` annotations in the common tests.

For JVM targets, use `kotlin-test-junit` or `kotlin-test-testng` for the corresponding asserter implementation and
annotations mapping.

For Kotlin/JS targets, add `kotlin-test-js` as a test dependency. At this point, test tasks for Kotlin/JS are created 
but do not run tests by default; they should be manually configured to run the tests with a JavaScript test framework. 

Kotlin/Native targets do not require additional test dependencies, and the `kotlin.test` API implementations are built-in.

## Publishing a Multiplatform Library

> The set of target platforms is defined by a multiplatform library author, and they should provide all of the platform-specific implementations for the library. 
> Adding new targets for a multiplatform library at the consumer's side is not supported. 
{:.note} 

A library built from a multiplatform project may be published to a Maven repository with the 
[`maven-publish` Gradle plugin](https://docs.gradle.org/current/userguide/publishing_maven.html), which can be applied as 
follows:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    /* ... */
    id("maven-publish")
}
```

</div>

A library also needs `group` and `version` to be set in the project:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins { /* ... */ }

group = "com.example.my.library"
version = "0.0.1"
 ```
 
</div>

Compared to publishing a plain Kotlin/JVM or Java project, there is no need to create publications manually 
via the `publishing { ... }` DSL. The publications are automatically created for each of the targets that can be 
built on the current host, except for the Android target, which needs an additional step to configure 
publishing, see [Publishing Android libraries](#publishing-android-libraries).

The repositories where the library will be published are added via the `repositories` block in the `publishing { ... }` 
DSL, as explained in [Maven Publish Plugin. Repositories](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories).
 
The default artifact IDs follow the pattern `<projectName>-<targetNameToLowerCase>`, for example `sample-lib-nodejs` 
for a target named `nodeJs` in a project `sample-lib`. 

By default, a sources JAR is added to each publication in addition to its main artifact. The sources JAR contains the 
sources used by the `main` compilation of the target. If you also need to publish a documentation artifact (like a 
Javadoc JAR), you need to configure its build manually and add it as an artifact to the relevant publications, as shown
below.

Also, an additional publication under the name `metadata` is added by default which contains serialized Kotlin 
declarations and is used by the IDE to analyze multiplatform libraries. 
The default artifact ID of this publication is formed as `<projectName>-metadata`.

The Maven coordinates can be altered and additional artifact files may be added to the publications within the 
`targets { ... }` block or the `publishing { ... }` DSL:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm('jvm6') {
        mavenPublication { // Setup the publication for the target 'jvm6'
            // The default artifactId was 'foo-jvm6', change it:  
            artifactId = 'foo-jvm'
            // Add a docs JAR artifact (it should be a custom task): 
            artifact(jvmDocsJar)
        }
    }
}

// Alternatively, configure the publications with the `publishing { ... }` DSL:
publishing {
    publications {
        jvm6 { /* Setup the publication for target 'jvm6' */ }
        metadata { /* Setup the publication for Kotlin metadata */ }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm("jvm6") {
        mavenPublication { // Setup the publication for the target 'jvm6'
            // The default artifactId was 'foo-jvm6', change it:  
            artifactId = "foo-jvm"
            // Add a docs JAR artifact (it should be a custom task): 
            artifact(jvmDocsJar)
        }
    }
}

// Alternatively, configure the publications with the `publishing { ... }` DSL:
publishing {
    publications.withType<MavenPublication>().apply {
        val jvm6 by getting { /* Setup the publication for target 'jvm6' */ }
        val metadata by getting { /* Setup the publication for Kotlin metadata */ }
    }
}
```

</div>
</div>

As assembling Kotlin/Native artifacts requires several builds to run on different host platforms, publishing a 
multiplatform library that includes Kotlin/Native targets needs to be done with that same set of host machines. To avoid
duplicate publications of modules that can be built on more than one of the platforms 
(like JVM, JS, Kotlin metadata, WebAssembly), the publishing tasks for these modules may be configured to run 
conditionally.

This simplified example ensures that the JVM, JS, and Kotlin metadata publications are only uploaded when 
`-PisLinux=true` is passed to the build in the command line:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm()
    js()
    mingwX64()
    linuxX64()
    
    // Note that the Kotlin metadata is here, too. 
    // The mingwx64() target is automatically skipped as incompatible in Linux builds.
    configure([targets["metadata"], jvm(), js()]) {
        mavenPublication { targetPublication ->
            tasks.withType(AbstractPublishToMaven)
                .matching { it.publication == targetPublication }
                .all { onlyIf { findProperty("isLinux") == "true" } }            
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm()
    js()
    mingwX64()
    linuxX64()
       
    // Note that the Kotlin metadata is here, too. 
    // The mingwx64() target is automatically skipped as incompatible in Linux builds.
    configure(listOf(metadata(), jvm(), js())) {
        mavenPublication { 
            val targetPublication = this@mavenPublication
            tasks.withType<AbstractPublishToMaven>()
                .matching { it.publication == targetPublication }
                .all { onlyIf { findProperty("isLinux") == "true" } }            
        }
    }
}
```

</div>
</div>

<a name="experimental-metadata-publishing-mode">

### Metadata publishing

Gradle module metadata provides rich publishing and dependency resolution features that are used in Kotlin 
multiplatform projects to simplify dependencies configuration for build authors. In particular, the publications of a 
multiplatform library include a special 'root' module that stands for the whole library and is automatically 
resolved to the appropriate platform-specific artifacts when added as a dependency, as described below.

In Gradle 6.0 and above, the module metadata is always used during dependency resolution and included in publications.

In earlier Gradle versions starting from 5.3, the module metadata is used during dependency resolution, but publications don't 
include any module metadata by default. To enable module metadata publishing, add 
`enableFeaturePreview("GRADLE_METADATA")` to the root project's `settings.gradle` file. 

When publications include module metadata, an additional 'root' publication named `kotlinMultiplatform` is added to the project's 
publications. The default artifact ID of this publication matches the project name without any additional suffix. 
To configure this publication, access it via the `publishing { ... }` DSL of the `maven-publish` plugin:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin { /* ... */ }

publishing {
    publications {
        kotlinMultiplatform {
            artifactId = "foo"        
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin { /* ... */ }

publishing {
    publications {
        val kotlinMultiplatform by getting {
            artifactId = "foo"        
        }
    }
}
```

</div>
</div>

This publication does not include any artifacts and only references the other publications as its variants. However, it
may need the sources and documentation artifacts if that is required by the repository. In that case, add those artifacts
by using [`artifact(...)`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)
in the publication's scope, which is accessed as shown above.
 
If a library has a 'root' publication, the consumer may specify a single dependency on the library as a whole in a 
 common source set, and a corresponding platform-specific variant will be chosen, if available, for each of the 
 compilations that include this dependency. Consider a `sample-lib` library built for the JVM and JS and published with 
 a 'root' publication:
 
<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm('jvm6')
    js('nodeJs')
        
    sourceSets {
        commonMain {
            dependencies {
                // This single dependency is resolved to the appropriate target modules, 
                // for example, `sample-lib-jvm6` for JVM, `sample-lib-js` for JS:
                api 'com.example:sample-lib:1.0' 
            }
        }
    }
}
```

</div>    
</div>    

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm("jvm6")
    js("nodeJs")
        
    sourceSets {
        val commonMain by getting {
            dependencies {
                // This single dependency is resolved to the appropriate target modules, 
                // for example, `sample-lib-jvm6` for JVM, `sample-lib-js` for JS:
                api("com.example:sample-lib:1.0") 
            }
        }
    }
}
```

</div>
</div>

### Disambiguating targets

It is possible to have more than one target for a single platform in a multiplatform library. For example, these targets
may provide the same API and differ in the libraries they cooperate with at runtime, like testing frameworks or logging solutions. 

However, dependencies on such a multiplatform library may be ambiguous and may thus fail to resolve because there is not
enough information to decide which of the targets to choose.

The solution is to mark the targets with a custom attribute, which is taken into account by Gradle during dependency 
resolution. This, however, must be done on both the library author and the consumer sides, 
and it's the library author's responsibility to communicate the attribute and its possible values to the consumers.
 
Adding attributes is done symmetrically, to both the library and the consumer projects. For example, consider a testing
library that supports both JUnit and TestNG in the two targets. The library author needs to add an attribute to both 
targets as follows:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>
 
```groovy
def testFrameworkAttribute = Attribute.of('com.example.testFramework', String)
  
kotlin {
    jvm('junit') {
        attributes.attribute(testFrameworkAttribute, 'junit')
    }
    jvm('testng') {
        attributes.attribute(testFrameworkAttribute, 'testng')
    }
}
```
 
</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
val testFrameworkAttribute = Attribute.of("com.example.testFramework", String::class.java)
  
kotlin {
    jvm("junit") {
        attributes.attribute(testFrameworkAttribute, "junit")
    }
    jvm("testng") {
        attributes.attribute(testFrameworkAttribute, "testng")
    }
}
```

</div>
</div>
 
The consumer may only need to add the attribute to a single target where the ambiguity arises.
 
If the same kind of ambiguity arises when a dependency is added to a custom configuration rather than one of the 
configurations created by the plugin, you can add the attributes to the configuration in the same way:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
def testFrameworkAttribute = Attribute.of('com.example.testFramework', String)

configurations {
    myConfiguration {
        attributes.attribute(testFrameworkAttribute, 'junit')
    }
}  
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
val testFrameworkAttribute = Attribute.of("com.example.testFramework", String::class.java)

configurations {
    val myConfiguration by creating {
        attributes.attribute(testFrameworkAttribute, "junit")
    }
}  
```

</div>
</div>

## Java Support in JVM Targets

This feature is available since Kotlin 1.3.40.

By default, a JVM target ignores Java sources and only compiles Kotlin source files.  
To include Java sources in the compilations of a JVM target, or to apply a Gradle plugin that requires the 
`java` plugin to work, you need to explicitly enable Java support for the target:

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm {
        withJava()
    } 
}
```

</div>

This will apply the Gradle `java` plugin and configure the target to cooperate with it. 
Note that just applying the Java plugin without specifying `withJava()` in a JVM 
target will have no effect on the target.
 
The file system locations for the Java sources are different from  the `java` plugin's defaults. 
The Java source files need to be placed in the sibling directories of the Kotlin source 
roots. For example, if the JVM target has the default name `jvm`, the paths are:

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```
src
├── jvmMain
│   ├── java // production Java sources
│   ├── kotlin
│   └── resources
├── jvmTest
│   ├── java // test Java sources
│   ├── kotlin
…   └── resources
```

</div>

The common source sets cannot include Java sources.

Due to the current limitations, some tasks configured by the Java plugin are disabled, and the corresponding tasks added
by the Kotlin plugin are used instead:

* `jar` is disabled in favor of the target's JAR task (e.g. `jvmJar`)
* `test` is disabled, and the target's test task is used (e.g. `jvmTest`)
* `*ProcessResources` tasks are disabled, and the resources are processed by the equivalent tasks of the compilations

The publication of this target is handled by the Kotlin plugin and doesn't require the steps that are specific to the 
Java plugin, such as manually creating a publication and configuring it as `from(components.java)`. 

## Android Support

Kotlin Multiplatform projects support the Android platform by providing the `android` preset. 
Creating an Android target requires that one of the Android Gradle plugins, like `com.android.application` or 
`com.android.library` is manually applied to the project. Only one Android target may be created per Gradle subproject:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.multiplatform").version("{{ site.data.releases.latest.version }}")
}

android { /* ... */ }

kotlin {
    android { // Create the Android target
        // Provide additional configuration if necessary
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
    id("com.android.library")
    kotlin("multiplatform").version("{{ site.data.releases.latest.version }}")
}

android { /* ... */ }

kotlin {
    android { // Create the Android target
        // Provide additional configuration if necessary
    }
} 
```

</div>
</div>

An Android target's compilations created by default are tied to [Android build variants](https://developer.android.com/studio/build/build-variants): 
for each build variant, a Kotlin compilation is created under the same name.

Then, for each [Android source set](https://developer.android.com/studio/build/build-variants#sourcesets) compiled by 
the variants, a Kotlin source set is created under that source set name 
prepended by the target name, like Kotlin source set `androidDebug` for an Android source set `debug` and the Kotlin target 
named `android`. These Kotlin source sets are added to the variants compilations accordingly. 

The default source set `commonMain` is added to each production (application or library) variant's compilation. The 
`commonTest` source set is, similarly, added to the compilations of unit test and instrumented test variants.

Annotation processing with [kapt](/docs/reference/kapt.html) is also supported but, due to the current limitations, 
it requires that the Android target is created before the `kapt` dependencies are configured, which needs 
to be done in a top-level `dependencies { ... }` block rather than within Kotlin source sets dependencies.

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
// ...

kotlin {
    android { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

</div>

### Publishing Android libraries

To publish an Android library as a part of a multiplatform library, one needs to 
[setup publishing for the library](#publishing-a-multiplatform-library) and provide additional configuration for the
Android library target.

By default, no artifacts of an Android library are published. To publish artifacts produced by a set of 
[Android variants](https://developer.android.com/studio/build/build-variants), specify the variant names in the Android 
target block as follows:

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    android {
        publishLibraryVariants("release", "debug")
    }
}
```

</div>

The example above will work for Android libraries with no product flavors. For a library with product flavors, the 
variant names also contain the flavors, like `fooBarDebug` or `fooBazRelease`.

Note that if a library consumer defines variants that are missing in the library, they need to provide 
[matching fallbacks](https://developer.android.com/studio/build/dependencies#resolve_matching_errors). For example, if 
a library does not have or does not publish a `staging` build type, it will be necessary to provide a fallback for the
consumers who have such a build type, specifying at least one of the build types that the library publishes:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
android {
    buildTypes {
        staging {
            // ...
            matchingFallbacks = ['release', 'debug'] 
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
android {
    buildTypes {
        val staging by creating {
            // ...
            matchingFallbacks = listOf("release", "debug") 
        }
    }
}
```

</div>
</div>

Similarly, a library consumer may need to provide matching fallbacks for custom product flavors if some are missing in
the library publications.

There is an option to publish variants grouped by the product flavor, so that the outputs of the different build
types are placed in a single module, with the build type becoming a classifier for the artifacts (the release build
type is still published with no classifier). This mode is disabled by default and can be enabled as follows:

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```groovy
kotlin {
    android {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

</div>

It is not recommended to publish variants grouped by the product flavor in case they have different dependencies, as 
those will be merged into one dependencies list.

## Using Kotlin/Native Targets

It is important to note that some of the [Kotlin/Native targets](#supported-platforms) may only be built with an appropriate host machine:

* Linux MIPS targets (`linuxMips32` and `linuxMipsel32`) require a Linux host. Other Linux targets can be built on any supported host;
* Windows targets require a Windows host;
* macOS and iOS targets can only be built on a macOS host;
* The 64-bit Android Native target require a Linux or macOS host. The 32-bit Android Native target can be built on any supported host.

A target that is not supported by the current host is ignored during build and therefore not published. A library author may want to set up
builds and publishing from different hosts as required by the library target platforms.

### Target shortcuts

Some native targets are often created together and use the same sources. For example, building for an iOS device and a simulator
is represented by different targets (`iosArm64` and `iosX64` respectively) but their source codes are usually the same.
A canonical way to express such shared code in the multiplatform project model is creating an intermediate
source set (`iosMain`) and configuring links between it and the platform source sets:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
sourceSets{
    iosMain {
        dependsOn(commonMain)
        iosDeviceMain.dependsOn(it)
        iosSimulatorMain.dependsOn(it)
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
val commonMain by sourceSets.getting
val iosDeviceMain by sourceSets.getting
val iosSimulatorMain by sourceSets.getting

val iosMain by sourceSets.creating {
    dependsOn(commonMain)
    iosDeviceMain.dependsOn(this)
    iosSimulatorMain.dependsOn(this)
}
```

</div>
</div>

Since 1.3.60, the `kotlin-multiplaform` plugin provides shortcuts that automate such a configuration: they let users
create a group of targets along with a common source set for them with a single DSL method.

The following shortcuts are available:

 * `ios` creates targets for `iosArm64` and `iosX64`.
 * `watchos` creates targets for  `watchosArm32`, `watchosArm64`, and `watchosX86`.
 * `tvos` creates targets for  `tvosArm64` and `tvosX64`. 

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
// Create two targets for iOS.
// Create common source sets: iosMain and iosTest.
ios {
    // Configure targets.
    // Note: this lambda will be called for each target.
}

// You can also specify a name prefix for created targets.
// Common source sets will also have this prefix:
// anotherIosMain and anotherIosTest.
ios("anotherIos")
```

</div>

### Building final native binaries

By default, a Kotlin/Native target is compiled down to a `*.klib` library artifact, which can be consumed by Kotlin/Native itself as a
dependency but cannot be executed or used as a native library. To declare final native binaries like executables or shared libraries a `binaries`
property of a native target is used. This property represents a collection of native binaries built for this target in addition to the
default `*.klib` artifact and provides a set of methods for declaring and configuring them.

Note that the `kotlin-multiplaform` plugin doesn't create any production binaries by default. The only binary available by default
is a debug executable allowing one to run tests from the `test` compilation.

#### Declaring binaries

A set of factory methods is used for declaring elements of the `binaries` collection. These methods allow one to specify what kinds of binaries are to be created and configure them. The following binary kinds are supported (note that not all the kinds are available for
all native platforms):

|**Factory method**|**Binary kind**|**Available for**|
| --- | --- | --- |
|`executable` |a product executable    |all native targets|
|`test`       |a test executable       |all native targets| 
|`sharedLib`  |a shared native library |all native targets except `wasm32`|
|`staticLib`  |a static native library  |all native targets except `wasm32`|
|`framework`  |an Objective-C framework |macOS, iOS, watchOS, and tvOS targets only|

Each factory method exists in several versions. Consider them by example of the `executable` method. All the same versions are available
for all other factory methods. 

The simplest version doesn't require any additional parameters and creates one binary for each build type.
Currently there a two build types available: `DEBUG` (produces a not optimized binary with a debug information) and `RELEASE` (produces
an optimized binary without debug information). Consequently the following snippet creates two executable binaries: debug and release.

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    linuxX64 { // Use your target instead.
        binaries {
            executable {
                // Binary configuration.
            }
        }
    }
}
```

</div>

A lambda expression accepted by the `executable` method in the example above is applied to each binary created and allows one to configure the binary
(see the [corresponding section](#configuring-binaries)). Note that this lambda can be dropped if there is no need for additional configuration:

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
binaries {
    executable()
}
```

</div>

It is possible to specify which build types will be used to create binaries and which won't. In the following example only debug executable is created.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
binaries {
    executable([DEBUG]) {
        // Binary configuration.
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // Binary configuration.
    }
}
```

</div>
</div>

Finally the last factory method version allows customizing the binary name.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // Binary configuration.
    }

    // It's possible to drop the list of build types (all the available build types will be used in this case).
    executable('bar') {
        // Binary configuration.
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // Binary configuration.
    }

    // It's possible to drop the list of build types (all the available build types will be used in this case).
    executable("bar") {
        // Binary configuration.
    }
}
```

</div>
</div>

The first argument in this example allows one to set a name prefix for the created binaries which is used to access them in the buildscript (see the ["Accessing binaries"](#accessing-binaries) section).
Also this prefix is used as a default name for the binary file. For example on Windows the sample above produces files `foo.exe` and `bar.exe`.

#### Accessing binaries

The binaries DSL allows not only creating binaries but also accessing already created ones to configure them or get their properties
(e.g. path to an output file). The `binaries` collection implements the
[`DomainObjectSet`](https://docs.gradle.org/current/javadoc/org/gradle/api/DomainObjectSet.html) interface and provides methods like
`all` or `matching` allowing configuring groups of elements.

Also it's possible to get a certain element of the collection. There are two ways to do this. First, each binary has a unique 
name. This name is based on the name prefix (if it's specified), build type and binary kind according to the following pattern:
`<optional-name-prefix><build-type><binary-kind>`, e.g. `releaseFramework` or `testDebugExecutable`.

> Note: static and shared libraries has suffixes `static` and `shared` respectively, e.g. `fooDebugStatic` or `barReleaseShared`

This name can be used to access the binary:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
// Fails if there is no such a binary.
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

 // Returns null if there is no such a binary.
binaries.findByName('fooDebugExecutable')
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
// Fails if there is no such a binary.
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

 // Returns null if there is no such a binary.
binaries.findByName("fooDebugExecutable")
```

</div>
</div>

The second way is using typed getters. These getters allow one to access a binary of a certain type by its name prefix and build type.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
// Fails if there is no such a binary.
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // Skip the first argument if the name prefix isn't set.
binaries.getExecutable('bar', 'DEBUG') // You also can use a string for build type.

// Similar getters are available for other binary kinds:
// getFramework, getStaticLib and getSharedLib.

// Returns null if there is no such a binary.
binaries.findExecutable('foo', DEBUG)

// Similar getters are available for other binary kinds:
// findFramework, findStaticLib and findSharedLib.
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
// Fails if there is no such a binary.
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // Skip the first argument if the name prefix isn't set.
binaries.getExecutable("bar", "DEBUG") // You also can use a string for build type.

// Similar getters are available for other binary kinds:
// getFramework, getStaticLib and getSharedLib.

// Returns null if there is no such a binary.
binaries.findExecutable("foo", DEBUG)

// Similar getters are available for other binary kinds:
// findFramework, findStaticLib and findSharedLib.
```

</div>
</div>

> Before 1.3.40, both test and product executables were represented by the same binary type. Thus to access the default test binary created by the plugin, the following line was used:
> ```
> binaries.getExecutable("test", "DEBUG")
> ``` 
> Since 1.3.40, test executables are represented by a separate binary type and have their own getter. To access the default test binary, use:
> ```
> binaries.getTest("DEBUG")
> ```
{:.note}
 

#### Configuring binaries

Binaries have a set of properties allowing one to configure them. The following options are available:

 - **Compilation.** Each binary is built on basis of some compilation available in the same target. The default value of this parameter depends
 on the binary type: `Test` binaries are based on the `test` compilation while other binaries - on the `main` compilation.
 - **Linker options.** Options passed to a system linker during binary building. One can use this setting for linking against some native library.
 - **Output file name.** By default the output file name is based on binary name prefix or, if the name prefix isn't specified, on a project name.
 But it's possible to configure the output file name independently using the `baseName` property. Note that final file name will be formed
 by adding system-dependent prefix and postfix to this base name. E.g. a `libfoo.so` is produced for a Linux shared library with the base name `foo`.
 - **Entry point** (for executable binaries only). By default the entry point for Kotlin/Native programs is a `main` function located in the root
 package. This setting allows one to change this default and use a custom function as an entry point. For example it can be used to move the `main`
 function from the root package.
 - **Access to the output file.**
 - **Access to a link task.** 
 - **Access to a run task** (for executable binaries only). The `kotlin-multiplatform` plugin creates run tasks for all executable binaries of host
 platforms (Windows, Linux and macOS). Names of such tasks are based on binary names, e.g. `runReleaseExecutable<target-name>`
 or `runFooDebugExecutable<target-name>`. A run task can be accessed using the `runTask` property of an executable binary.
 - **Framework type** (only for Objective-C frameworks). By default a framework built by Kotlin/Native contains a dynamic library. But it's possible
 to replace it with a static library.
 
The following example shows how to use these settings.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // Build a binary on the basis of the test compilation.
        compilation = compilations.test

        // Custom command line options for the linker.
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // Base name for the output file.
        baseName = 'foo'

        // Custom entry point function.
        entryPoint = 'org.example.main'

        // Accessing the output file.
        println("Executable path: ${outputFile.absolutePath}")

        // Accessing the link task.
        linkTask.dependsOn(additionalPreprocessingTask)

        // Accessing the run task.
        // Note that the runTask is null for non-host platforms.
        runTask?.dependsOn(prepareForRun)
    }

    framework('my_framework' [RELEASE]) {
        // Include a static library instead of a dynamic one into the framework.
        isStatic = true
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // Build a binary on the basis of the test compilation.
        compilation = compilations["test"]

        // Custom command line options for the linker.
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // Base name for the output file.
        baseName = "foo"

        // Custom entry point function.
        entryPoint = "org.example.main"

        // Accessing the output file.
        println("Executable path: ${outputFile.absolutePath}")

        // Accessing the link task.
        linkTask.dependsOn(additionalPreprocessingTask)

        // Accessing the run task.
        // Note that the runTask is null for non-host platforms.
        runTask?.dependsOn(prepareForRun)
    }

    framework("my_framework" listOf(RELEASE)) {
        // Include a static library instead of a dynamic one into the framework.
        isStatic = true
    }
}
```

</div>
</div>

#### Exporting dependencies to binaries

When building an Objective-C framework or a native library (shared or static), it is often necessary to pack not just the
classes of the current project, but also the classes of some of its dependencies. The Binaries DSL allows one to specify
which dependencies will be exported to a binary using the `export` method. Note that only API dependencies of a corresponding source set can be exported.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    sourceSets {
        macosMain.dependencies {
            // Will be exported.
            api project(':dependency')
            api 'org.example:exported-library:1.0'

            // Will not be exported.
            api 'org.example:not-exported-library:1.0'
        }
    }

    macosX64("macos").binaries {
        framework {
            export project(':dependency')
            export 'org.example:exported-library:1.0'
        }

        sharedLib {
            // It's possible to export different sets of dependencies to different binaries.
            export project(':dependency')
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        macosMain.dependencies {
            // Will be exported.
            api(project(":dependency"))
            api("org.example:exported-library:1.0")

            // Will not be exported.
            api("org.example:not-exported-library:1.0")
        }
    }

    macosX64("macos").binaries {
        framework {
            export(project(":dependency"))
            export("org.example:exported-library:1.0")
        }

        sharedLib {
            // It's possible to export different sets of dependencies to different binaries.
            export(project(':dependency'))
        }
    }
}
```

</div>
</div>

> As shown in this example, maven dependency also can be exported. But due to current limitations of Gradle metadata such a dependency
should be either a platform one (e.g. `kotlinx-coroutines-core-native_debug_macos_x64` instead of `kotlinx-coroutines-core-native`)
or be exported transitively (see below).

By default, export works non-transitively. If a library `foo` depending on library `bar` is exported, only methods of `foo` will
be added in the output framework. This behaviour can be changed by the `transitiveExport` flag.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
binaries {
    framework {
        export project(':dependency')
        // Export transitively.
        transitiveExport = true
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // Export transitively.
        transitiveExport = true
    }
}
```

</div>
</div>

#### Building universal frameworks

By default, an Objective-C framework produced by Kotlin/Native supports only one platform. However, such frameworks can be merged
into a single universal (fat) binary using the `lipo` utility. Particularly, such an operation makes sense for 32-bit and 64-bit iOS
frameworks. In this case the resulting universal framework can be used on both 32-bit and 64-bit devices.

The Gradle plugin provides a separate task that creates a universal framework for iOS targets from several regular ones.
The example below shows how to use this task. Note that the fat framework must have the same base name as the initial frameworks.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // Create and configure the targets.
    targets {
        iosArm32("ios32")
        iosArm64("ios64")

        configure([ios32, ios64]) {
            binaries.framework {
                baseName = "my_framework"
            }
        }
    }

    // Create a task building a fat framework.
    task debugFatFramework(type: FatFrameworkTask) {
        // The fat framework must have the same base name as the initial frameworks.
        baseName = "my_framework"

        // The default destination directory is '<build directory>/fat-framework'.
        destinationDir = file("$buildDir/fat-framework/debug")

        // Specify the frameworks to be merged.
        from(
            targets.ios32.binaries.getFramework("DEBUG"),
            targets.ios64.binaries.getFramework("DEBUG")
        )
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // Create and configure the targets.
    val ios32 = iosArm32("ios32")
    val ios64 = iosArm64("ios64")

    configure(listOf(ios32, ios64)) {
        binaries.framework {
            baseName = "my_framework"
        }
    }

    // Create a task building a fat framework.
    tasks.create("debugFatFramework", FatFrameworkTask::class) {
        // The fat framework must have the same base name as the initial frameworks.
        baseName = "my_framework"

        // The default destination directory is '<build directory>/fat-framework'.
        destinationDir = buildDir.resolve("fat-framework/debug")

        // Specify the frameworks to be merged.
        from(
            ios32.binaries.getFramework("DEBUG"),
            ios64.binaries.getFramework("DEBUG")
        )
    }
}
```

</div>
</div>

### CInterop support

Since Kotlin/Native provides [interoperability with native languages](/docs/reference/native/c_interop.html),
there is a DSL allowing one to configure this feature for a specific compilation.

A compilation can interact with several native libraries. Interoperability with each of them can be configured in
the `cinterops` block of the compilation:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.main {
            cinterops {
                myInterop {
                    // Def-file describing the native API.
                    // The default path is src/nativeInterop/cinterop/<interop-name>.def
                    defFile project.file("def-file.def")

                    // Package to place the Kotlin API generated.
                    packageName 'org.sample'

                    // Options to be passed to compiler by cinterop tool.
                    compilerOpts '-Ipath/to/headers'

                    // Directories for header search (an analogue of the -I<path> compiler option).
                    includeDirs.allHeaders("path1", "path2")

                    // Additional directories to search headers listed in the 'headerFilter' def-file option.
                    // -headerFilterAdditionalSearchPrefix command line option analogue.
                    includeDirs.headerFilterOnly("path1", "path2")

                    // A shortcut for includeDirs.allHeaders.
                    includeDirs("include/directory", "another/directory")
                }

                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    linuxX64 {  // Replace with a target you need.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // Def-file describing the native API.
                // The default path is src/nativeInterop/cinterop/<interop-name>.def
                defFile(project.file("def-file.def"))

                // Package to place the Kotlin API generated.
                packageName("org.sample")

                // Options to be passed to compiler by cinterop tool.
                compilerOpts("-Ipath/to/headers")

                // Directories to look for headers.
                includeDirs.apply {
                    // Directories for header search (an analogue of the -I<path> compiler option).
                    allHeaders("path1", "path2")

                    // Additional directories to search headers listed in the 'headerFilter' def-file option.
                    // -headerFilterAdditionalSearchPrefix command line option analogue.
                    headerFilterOnly("path1", "path2")
                }
                // A shortcut for includeDirs.allHeaders.
                includeDirs("include/directory", "another/directory")
            }

            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}

```

</div>
</div>

Often it's necessary to specify target-specific linker options for a binary which uses a native library. It can by done
using the `linkerOpts` property of the binary. See the [Configuring binaries](#configuring-binaries) section for details.
