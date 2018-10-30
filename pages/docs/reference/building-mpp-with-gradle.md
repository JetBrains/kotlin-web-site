---
type: doc
layout: reference
title: "Building Multiplatform Projects with Gradle"
---

# Building Multiplatform Projects with Gradle

> Multiplatform projects are an experimental feature in Kotlin 1.2 and 1.3. All of the language
and tooling features described in this document are subject to change in future Kotlin versions.
{:.note}

This document describes how [Kotlin multiplatform projects](multiplatform.html) are configured and built using 
Gradle. Only Gradle versions 4.7 and above can be used, older Gradle versions are not supported.

Gradle Kotlin DSL support has not been implemented yet for multiplatform projects, it will be added in the future 
updates. Please use the Groovy DSL in the build scripts.

## Setting up a Multiplatform Project

You can create a new multiplatform project in the IDE by selecting one of the multiplatform project templates in the 
New Project dialog under the "Kotlin" section. 

For example, if you choose "Kotlin (Multiplatform Library)", a library project is created that has three [targets](#setting-up-targets), one 
for the JVM, one for JS, and one for the Native platform that you are using. These are configured in the `build.gradle`
script in the following way:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}

repositories {
    mavenCentral()
}

kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm')
        fromPreset(presets.js, 'js')
        fromPreset(presets.mingwX64, 'mingw')
    }
    
    sourceSets { /* ... */ }
}
```

</div>

The three targets are created from the presets that provide some [default configuration](#default-project-layout). 
There are presets for each of the [supported platforms](#supported-platforms).

The [source sets](#configuring-source-sets) and their [dependencies](#adding-dependencies) are then configured as follows:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins { /* ... */ }

kotlin {
    targets { /* ... */ }

    sourceSets { 
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-stdlib-common'
            }
        }
        commonTest {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-test-common'
                implementation 'org.jetbrains.kotlin:kotlin-test-annotations-common'
            }
        }
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-stdlib-jdk8'
            }
        }
        jvmTest {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-test'
                implementation 'org.jetbrains.kotlin:kotlin-test-junit'
            }
        }
        jsMain { /* ... */ }
        jsTest { /* ... */ }
        mingwMain { /* ... */ }
        mingwTest { /* ... */ }
    }
}
```

</div>

These are the [default source set names](#default-project-layout) for the production and test sources for the targets configured above. The source 
sets `commonMain` and `commonTest` are included into production and test compilations, respectively, of all targets. 
Note that the dependencies for common source sets `commonMain` and `commonTest` are the common artifacts, and the 
platform libraries go to the source sets of the specific targets.

The details on project structure and the DSL can be found in the following sections.

## Gradle Plugin

To setup a multiplatform project from scratch, first, apply the `kotlin-multiplatform` plugin to the project by adding the following to the
`build.gradle` file:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}
```

</div>

This creates the `kotlin` extension at the top level. You can then access it in the build script for:

* [setting up the targets](#setting-up-targets) for multiple platforms (no targets are created by default);
* [configuring the source sets](#configuring-source-sets) and their [dependencies](#adding-dependencies);

## Setting up Targets

A target is a part of the build responsible for compiling, testing, and packaging a piece of software aimed for
one of the [supported platforms](#supported-platforms).

As the platforms are different, targets are built in different ways as well and have various platform-specific 
settings. The Gradle plugin bundles a number of presets for the supported platforms. A preset can be used to 
create a target by just providing a name as follows:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

``` groovy
kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm6') // Create a JVM target by the name 'jvm6'
        
        fromPreset(presets.linuxX64, 'linux') { 
            /* You can specify additional settings for the 'linux' target here */
        } 
    }
}
``` 
</div>

Building a target requires compiling Kotlin once or multiple times. Each Kotlin compilation of a target may serve a 
different purpose (e.g. production code, tests) and incorporate different [source sets](#configuring-source-sets). The compilations
of a target may be accessed in the DSL, for example, to get the task names, dependency files and compilation outputs:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm6') { 
            def mainKotlinTaskName = compilations.main.compileKotlinTaskName
            def mainOutputs = compilations.main.output
            def testRuntimeClasspath = compilations.test.runtimeDependencyFiles            
        }
    }
}
```

</div>

To modify [the Kotlin compiler options](using-gradle.html#compiler-options) of a compilation, use the compilation's task which
can be found by its name:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm8') {
            // Configure a single target's compilations (main and test)
            compilations.all {
                tasks[compileKotlinTaskName].kotlinOptions { 
                    jvmTarget = '1.8'
                }
            }
        }
        
        /* ... */
        
        // Configure all compilations of all targets:
        all { 
            compilations.all {
                tasks[compileKotlinTaskName].kotlinOptions {
                    allWarningsAsErrors = true
                }
            }
        }
    }
}
```

</div>

All of the targets may share some of the sources and may have platform-specific sources in their compilations as well. 
See [Configuring source sets](#configuring-source-sets) for details.

Some targets may require additional configuration. For Android and iOS examples, see the [Multiplatform Project: iOS and Android](/docs/tutorials/native/mpp-ios-android.html) tutorial.

### Supported platforms

There are target presets that one can apply using `fromPreset(presets.<presetName>, '<targetName>')`, as described above, for the
following target platforms:

* `jvm` for Kotlin/JVM. Note: `jvm` targets do not compile Java;
* `js` for Kotlin/JS;
* `android` for Android applications and libraries. Note that one of the Android Gradle 
   plugins should be applied as well;
  
*  Kotlin/Native target presets (see the [notes](#using-kotlinnative-targets) below):
  
    * `androidNativeArm32` and `androidNativeArm64` for Android NDK;
    * `iosArm32`, `iosArm64`, `iosX64` for iOS;
    * `linuxArm32Hfp`, `linuxMips32`, `linuxMipsel32`, `linuxX64` for Linux;
    * `macosX64` for MacOS;
    * `mingwX64` for Windows;
    * `wasm32` for WebAssembly.
    
    Note that some of the Kotlin/Native targets require an [appropriate host machine](#using-kotlinnative-targets) to build on.
    
## Configuring source sets

A Kotlin source set is a collection of Kotlin sources, along with their resources, dependencies, and language settings, 
which may take part in Kotlin compilations of one or more [targets](#setting-up-targets).

If you apply a target preset, some source sets are created and configured by default. See [Default Project Layout](#default-project-layout).

The source sets are configured within a `sourceSets { ... }` block of the `kotlin { ... }` extension:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin { 
    targets { /* ... */ }
    
    sourceSets { 
        foo { /* ... */ } // create or configure a source set by the name 'foo' 
        bar { /* ... */ }
    }
}
``` 
</div>

> Note: creating a source set does not link it to any target. Some source sets are [predefined](#default-project-layout) 
and thus compiled by default. However, custom source sets always need to be explicitly directed to the compilations. 
See: [Connecting source sets](#connecting-source-sets). 
{:.note}

The source set names are case-sensitive. When referring to a default source set, make sure the name prefix matches a target's 
name, for example, a source set `iosX64Main` for a target `iosX64`. 

A source set by itself is platform-agnostic, but
it can be considered platform-specific if it is only compiled for a single platform. A source set can, therefore, contain either
common code shared between the platforms or platform-specific code.

To add Kotlin source directories and resources to a source set, use its `kotlin` and `resources` `SourceDirectorySet`s:

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

### Connecting source sets

Kotlin source sets may be connected with the 'depends on' relation, so that if a source set `foo`  depends on a source set `bar` then:

* whenever `foo` is compiled for a certain target, `bar` takes part in that compilation as well and is also compiled 
into the same target binary form, such as JVM class files or JS code;

* the resources of `bar` are always processed and copied along with the resources of `foo`;

* sources of `foo` 'see' the declarations of `bar`, including the `internal` ones, and the [dependencies](#adding-dependencies) of `bar`, even those
 specified as `implementation` dependencies;
  
* `foo` may contain [platform-specific implementations](platform-specific-declarations.html) for the expected declarations of `bar`;

* the [language settings](#language-settings) of `foo` and `bar` should be consistent;

Circular source set dependencies are prohibited.

The source sets DSL can be used to define these connections between the source sets:

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

Custom source sets created in addition to the [default ones](#default-project-layout) should be explicitly included into
 the dependencies hierarchy to be able to use declarations from other source sets and, most importantly, to take part 
 in compilations. 
Most often, they need a `dependsOn commonMain` or `dependsOn commonTest` statement, and some of the default platform-specific
 source sets should depend on the custom ones, 
 directly or indirectly:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin { 
    targets {
        fromPreset(presets.mingwX64, 'windows')
        fromPreset(presets.linuxX64, 'linux')
        /* ... */
    }
    sourceSets {
        desktopTest { // custom source set with tests for the two targets
            dependsOn commonTest
            /* ... */
        }
        windowsTest { // default test source set for target 'windows'
            dependsOn desktopTest
            /* ... */
        }
        linuxTest { // default test source set for target 'linux'
            dependsOn desktopTest
        }
        /* ... */
    }
}
```

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

Note that for the IDE to correctly analyze the dependencies of the common sources, the common source sets need to have 
corresponding dependencies on the Kotlin metadata packages in addition to the platform-specific artifact dependencies 
of the platform-specific source sets. Usually, an artifact with a suffix 
`-common` (as in `kotlin-stdlib-common`) or `-metadata` is required when using a published library (unless it is 
published with Gradle metadata, as described below).

However, a `project('...')` dependency on another multiplatform project is resolved to an appropriate target
automatically. It is enough to specify a single `project('...')` dependency in a source set's dependencies, 
and the compilations that include the source set will receive a corresponding platform-specific artifact of 
that project, given that it has a compatible target.

Likewise, if a multiplatform library is published in the experimental [Gradle metadata publishing mode](#experimental-metadata-publishing-mode) and the project 
is set up to consume the metadata as well, then it is enough to specify a dependency only once, for the common source set. 
Otherwise, each platform-specific source set should be 
provided with a corresponding platform module of the library, in addition to the common module, as shown above.

An alternative way to specify the dependencies is to use the Gradle built-in DSL at the top level with the configuration names following the 
pattern `<sourceSetName><DependencyKind>`:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
dependencies {
    commonMainApi 'com.example:foo-common:1.0'
    jvm6MainApi 'com.example:foo-jvm6:1.0'
}
```

</div>

### Language settings

The language settings for a source set can be specified as follows:

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

It is possible to configure the language settings of all source sets at once:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin.sourceSets.all {
    languageSettings {
        progressiveMode = true
    }
}
```

</div>


Language settings of a source set affect how the sources are analyzed in the IDE. Due to the current limitations, in a Gradle build, only the language settings 
of the compilation's default source set are used.

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
* a compilation per Android variant, for Android targets;

For each compilation, there is a default source set under the name composed as `<targetName><CompilationName>`. This default source
set participates in the compilation, and thus it should be used for the platform-specific code and dependencies, and for adding other source
 sets to the compilation by the means of 'depends on'. For example, a project with
targets `jvm6` (JVM) and `nodeJs` (JS) will have source sets: `commonMain`, `commonTest`, `jvm6Main`, `jvm6Test`, `nodeJsMain`, `nodeJsTest`.

Numerous use cases are covered by just the default source sets and don't require custom source sets.
 
Each source set by default has its Kotlin sources under `src/<sourceSetName>/kotlin` directory and the resources under `src/<sourceSetName>/resources`.

In Android projects, additional Kotlin source sets are created for each Android source set. If the Android target has a name `foo`, the Android source set `bar` gets a Kotlin source set counterpart `fooBar`. The Kotlin compilations, however, are able to consume Kotlin sources from all of the directories `src/bar/java`, `src/bar/kotlin`, and `src/fooBar/kotlin`. Java sources are only read from the first of these directories.

## Running Tests

Running tests in a Gradle build is currently supported by default for JVM, Android, Linux, Windows and macOS; 
JS and other Kotlin/Native targets
need to be manually configured to run the tests with an appropriate environment, an emulator or a test framework.  

A test task is created under the name `<targetName>Test` for each target that is suitable for testing. Run the `check` task to run 
the tests for all targets. 

As the `commonTest` [default source set](#default-project-layout) is added to all test compilations, tests and test tools that are needed
on all target platforms may be placed there.

The [`kotlin.test` API](https://kotlinlang.org/api/latest/kotlin.test/index.html) is availble for multiplatform tests. Add the `kotlin-test-common` and `kotlin-test-annotations-common`
dependencies to `commonTest` to use `DefaultAsserter` and `@Test`/`@Ignore`/`@BeforeTest`/`@AfterTest` annotations in the common tests.

For JVM targets, use `kotlin-test-junit` or `kotlin-test-testng` for the corresponding asserter implementation and
annotations mapping.

For Kotlin/JS targets, add `kotlin-test-js` as a test dependency. At this point, test tasks for Kotlin/JS are created 
but do not run tests by default; they should be manually configured to run the tests with a JavaScript test framework. 

Kotlin/Native targets do not require additional test dependencies, and the `kotlin.test` API implementations are built-in.

## Publishing a Multiplatform Library

> The set of target platforms is defined by a multiplatform library author, and they should provide all of the platform-specific implementations for the library. 
> Adding new targets for a multiplatform library at the consumer's side is not supported. 
{:.note} 

A library built from a multiplatform project may be published to a Maven repository with the Gradle `maven-publish` plugin, which can be applied as follows:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    /* ... */
    id 'maven-publish'
}
```

</div>

Once this plugin is applied, default publications are created for each of the targets that can be built on the current host. This requires `group` and 
`version` to be set in the project. The default artifact IDs follow the pattern `<projectName>-<targetNameToLowerCase>`, for example `sample-lib-nodejs` for a target named `nodeJs` in a project 
`sample-lib`. 

Also, an additional publication is added by default which contains serialized Kotlin declarations and is used by the IDE to analyze multiplatform libraries.

By default, a sources JAR is added to each publication in addition to its main artifact. The sources JAR contains the sources used by the `main` compilation
of the target.

The Maven coordinates can be altered and additional artifact files may be added to the publication within the `targets { ... }` block:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm6') {
            /* ... */
            mavenPublication { 
                artifactId = 'sample-lib-jvm'
                artifact(jvmJavadocJar)
            }
        }
    }
}
```

</div>

### Experimental metadata publishing mode

An experimental publishing and dependency consumption mode can be enabled by adding 
`enableFeaturePreview('GRADLE_METADATA')` to the root project's `settings.gradle` file. With Gradle metadata enabled,
 an additional publication is added which references the target publications as its variants. The artifact ID of this publication
 matches the project name.
 
> Gradle metadata publishing is an experimental Gradle feature which is not guaranteed to be backward-compatible. 
Future Gradle versions may fail to resolve a dependency to a library published with current versions of Gradle metadata.
Library authors are recommended to use it to publish experimental versions of the library alongside with the stable publishing mechanism
until the feature is considered stable. 
{:.note}
 
If a library is published with Gradle metadata enabled and a consumer enables the metadata as well, the consumer may specify a
 single dependency on the library in a common source set, and a corresponding platform-specific variant will be chosen, if available, 
 for each of the compilations. Consider a `sample-lib` library built for the JVM and JS and published with experimental Gradle metadata.
 Then it is enough for the consumers to add `enableFeaturePreview('GRADLE_METADATA)` and specify a single dependency:
 
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm6')
        fromPreset(presets.js, 'nodeJs')
    }
    sourceSets {
        commonMain {
            dependencies {
                api 'com.example:sample-lib:1.0' 
                // is resolved to `sample-lib-jvm` for JVM, `sample-lib-js` for JS 
            }
        }
    }
}
```

</div>    

### Disambiguating Targets

It is possible to have more than one target for a single platform in a multiplatform library. For example, these targets
may provide the same API and differ in the libraries they cooperate with at runtime, like testing frameworks or logging solutions. 

However, dependencies on such a multiplatform library may be ambiguous and may thus fail to resolve under certain conditions:

* A `project('...')` dependency on a multiplatform library is used. Replace it with a `project(path: '...', configuration: '...')` dependency. 
  Use the appropriate target's runtime elements configuration, such as `jvm6RuntimeElements`. Due to the current limitations, this dependency should
  be placed in a top-level `dependencies { ... }` block rather than in a source set's dependencies.
  
* A published library dependency is used. If a library is published with experimental Gradle metadata, one can still replace the single dependency with
  unambiguous dependencies on its separate target modules, as if it had no experimental Gradle metadata.   
  
* In both of the cases above, another solution is to mark the targets with a custom attribute. This, however, must be done on both the library author
 and the consumer sides, and it's the library author's responsibility to communicate the attribute and its values to the consumers;
 
     Add the following symmetrically, to both the library and the consumer projects. The consumer may only need to mark 
     a single target with the attribute:
     
     <div class="sample" markdown="1" theme="idea" mode='groovy'>
     
     ```groovy
     def testFrameworkAttribute = Attribute.of('com.example.testFramework', String)
      
     kotlin {
         targets {
             fromPreset(presets.jvm, 'junit') {
                 attributes.attribute(testingFrameworkAttribute, 'junit')
             }
             fromPreset(presets.jvm, 'testng') {
                 attributes.attribute(testingFrameworkAttribute, 'testng')
             }
         }
     }
     ```
     
     </div>

## Using Kotlin/Native Targets

It is important to note that some of the [Kotlin/Native targets](#supported-platforms) may only be built with an appropriate host machine:

* Linux targets may only be built on a Linux host;
* Windows targets require a Windows host;
* macOS and iOS targets can only be built on a macOS host;
* Android Native targets require a Linux or macOS host; 

A target that is not supported by the current host is ignored during build and therefore not published. A library author may want to set up
builds and publishing from different hosts as required by the library target platforms.

### Kotlin/Native output kinds

By default, a Kotlin/Native target is compiled down to a `*.klib` library artifact, which can be consumed by Kotlin/Native itself as a dependency but
cannot be run or used as a native library.

To link a binary in addition to the Kotlin/Native library, add one or more of the `outputKinds`, which can be:

* `executable` for an executable program;
* `dynamic` for a dynamic library;
* `static` for a static library;
* `framework` for an Objective-C framework (only supported for macOS and iOS targets)

This can be done as follows:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    targets {
        fromPreset(presets.linuxX64, 'linux') {
            compilations.main.outputKinds 'executable' // could be 'static', 'dynamic'
        }
    }
}
```

</div>

This creates additional link tasks for the debug and release binaries. The tasks can be accessed after project evaluation from the compilation as, for example, 
`getLinkTask('executable', 'release')` or `getLinkTaskName('static', 'debug')`. To get the binary file, use `getBinary`, for example, 
 as `getBinary('executable', 'release')` or `getBinary('static', 'debug')`.

### CInterop support

Since Kotlin/Native provides [interoperability with native languages](/docs/reference/native/c_interop.html),
there is a DSL allowing one to configure this feature for a specific compilation.

A compilation can interact with several native libraries. Interoperability with each of them can be configured in
the `cinterops` block of the compilation:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
// In the scope of a Kotlin/Native target's compilation:
cinterops {
    myInterop {
        // Def-file describing the native API.
        // The default path is src/nativeInterop/cinterop/<interop-name>.def
        defFile project.file("def-file.def")

        // Package to place the Kotlin API generated.
        packageName 'org.sample'

        // Options to be passed to compiler by cinterop tool.
        compilerOpts '-Ipath/to/headers'

        // Directories to look for headers.
        includeDirs {
            // Directories for header search (an analogue of the -I<path> compiler option).
            allHeaders 'path1', 'path2'

            // Additional directories to search headers listed in the 'headerFilter' def-file option.
            // -headerFilterAdditionalSearchPrefix command line option analogue.
            headerFilterOnly 'path1', 'path2'
        }
        // A shortcut for includeDirs.allHeaders.
        includeDirs "include/directory", "another/directory"
    }

    anotherInterop { /* ... */ }
}
```
</div>

Often it's necessary to specify target-specific linker options for a binary which uses a native library. It can be
done using the `linkerOpts` DSL method of a Kotlin/Native compilation:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
compilations.main {
    linkerOpts '-L/lib/search/path -L/another/search/path -lmylib'
}
```
</div>
