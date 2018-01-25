---
type: doc
layout: reference
title: "Using Gradle"
---

# Using Gradle

In order to build Kotlin with Gradle you should [set up the *kotlin-gradle* plugin](#plugin-and-versions), [apply it](#targeting-the-jvm) to your project and [add *kotlin-stdlib* dependencies](#configuring-dependencies). Those actions may also be performed automatically in IntelliJ IDEA by invoking the Tools \| Kotlin \| Configure Kotlin in Project action.

## Plugin and Versions

The `kotlin-gradle-plugin` compiles Kotlin sources and modules.

The version of Kotlin to use is usually defined as the `kotlin_version` property:

``` groovy
buildscript {
    ext.kotlin_version = '{{ site.data.releases.latest.version }}'

    repositories {
        mavenCentral()
    }

    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}
```

This is not required when using Kotlin Gradle plugin 1.1.1 and above with the [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block).

## Targeting the JVM

To target the JVM, the Kotlin plugin needs to be applied:

``` groovy
apply plugin: "kotlin"
```

Or, starting with Kotlin 1.1.1, the plugin can be applied using the [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block):

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "{{ site.data.releases.latest.version }}"
}
```
The `version` should be literal in this block, and it cannot be applied from another build script.

Kotlin sources can be mixed with Java sources in the same folder, or in different folders. The default convention is using different folders:

``` groovy
project
    - src
        - main (root)
            - kotlin
            - java
```

The corresponding *sourceSets* property should be updated if not using the default convention:

``` groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

## Targeting JavaScript

When targeting JavaScript, a different plugin should be applied:

``` groovy
apply plugin: "kotlin2js"
```

This plugin only works for Kotlin files so it is recommended to keep Kotlin and Java files separate (if it's the case that the same project contains Java files). As with
targeting the JVM, if not using the default convention, we need to specify the source folder using *sourceSets*:

``` groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
}
```

In addition to the output JavaScript file, the plugin by default creates an additional JS file with binary descriptors.
This file is required if you're building a re-usable library that other Kotlin modules can depend on, and should be distributed together with the result of translation.
The generation is controlled by the  `kotlinOptions.metaInfo` option:

``` groovy
compileKotlin2Js {
	kotlinOptions.metaInfo = true
}
```

## Targeting Android

Android's Gradle model is a little different from ordinary Gradle, so if we want to build an Android project written in Kotlin, we need
*kotlin-android* plugin instead of *kotlin*:

``` groovy
buildscript {
    ext.kotlin_version = '{{ site.data.releases.latest.version }}'

    ...

    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
```

Don't forget to configure the [standard library dependency](#configuring-dependencies).

### Android Studio

If using Android Studio, the following needs to be added under android:

``` groovy
android {
  ...

  sourceSets {
    main.java.srcDirs += 'src/main/kotlin'
  }
}
```

This lets Android Studio know that the kotlin directory is a source root, so when the project model is loaded into the IDE it will be properly recognized. Alternatively, you can put Kotlin classes in the Java source directory, typically located in `src/main/java`.


## Configuring Dependencies

In addition to the `kotlin-gradle-plugin` dependency shown above, you need to add a dependency on the Kotlin standard library:

``` groovy
repositories {
    mavenCentral()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib"
}
```

If you target JavaScript, use `compile "org.jetbrains.kotlin:kotlin-stdlib-js"` instead.

If you're targeting JDK 7 or JDK 8, you can use extended versions of the Kotlin standard library which contain
additional extension functions for APIs added in new JDK versions. Instead of `kotlin-stdlib`, use one of the
following dependencies:

``` groovy
compile "org.jetbrains.kotlin:kotlin-stdlib-jdk7"
compile "org.jetbrains.kotlin:kotlin-stdlib-jdk8"
```

In Kotlin 1.1.x, use `kotlin-stdlib-jre7` and `kotlin-stdlib-jre8` instead.

If your project uses [Kotlin reflection](/api/latest/jvm/stdlib/kotlin.reflect.full/index.html) or testing facilities, you need to add the corresponding dependencies as well:

``` groovy
compile "org.jetbrains.kotlin:kotlin-reflect"
testCompile "org.jetbrains.kotlin:kotlin-test"
testCompile "org.jetbrains.kotlin:kotlin-test-junit"
```

Starting with Kotlin 1.1.2, the dependencies with group `org.jetbrains.kotlin` are by default resolved with the version
taken from the applied plugin. You can provide the version manually using the full dependency notation like
`compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"`.

## Annotation processing

See the description of [Kotlin annotation processing tool](kapt.html) (`kapt`).

## Incremental compilation

Kotlin supports optional incremental compilation in Gradle.
Incremental compilation tracks changes of source files between builds so only files affected by these changes would be compiled.

Starting with Kotlin 1.1.1, incremental compilation is enabled by default.

There are several ways to override the default setting:

  1. add `kotlin.incremental=true` or `kotlin.incremental=false` line either to a `gradle.properties` or a `local.properties` file;

  2. add `-Pkotlin.incremental=true` or `-Pkotlin.incremental=false` to gradle command line parameters. Note that in this case the parameter should be added to each subsequent build, and any build with disabled incremental compilation invalidates incremental caches.

When incremental compilation is enabled, you should see the following warning message in your build log:
```
Using kotlin incremental compilation
```

Note, that the first build won't be incremental.

## Coroutines support

[Coroutines](coroutines.html) support is an experimental feature in Kotlin 1.2, so the Kotlin compiler reports a warning when you use coroutines in your project.
To turn off the warning, add the following block to your `build.gradle` file:

``` groovy
kotlin {
    experimental {
        coroutines 'enable'
    }
}
```

## Module names

The Kotlin modules that the build produces are named accordingly to the `archivesBaseName` property of the project. If a project has a broad name like `lib` or `jvm`, which is common for subprojects, the Kotlin output files related to the module (`*.kotlin_module`) might clash with those from third-party modules with the same name. This causes problems when a project is packaged into a single archive (e.g. APK).

To avoid this, consider setting a unique `archivesBaseName` manually:

``` groovy
archivesBaseName = 'myExampleProject_lib'
```

## Gradle Build Cache support (since 1.2.20)

The Kotlin plugin supports [Gradle Build Cache](https://guides.gradle.org/using-build-cache/) (Gradle version 4.3 and above is required; caching is disabled with lower versions).

The kapt annotation processing tasks are not cached by default since annotation processors run arbitrary code that may not necessarily transform the task inputs into the outputs, might access and modify the files that are not tracked by Gradle etc. To enable caching for kapt anyway, add the following lines to the build script:

``` groovy
kapt {
    useBuildCache = true
}
```

To disable the caching for all Kotlin tasks, set the system property flag `kotlin.caching.enabled` to `false` (run the build with the argument `-Dkotlin.caching.enabled=false`).

## Compiler Options

To specify additional compilation options, use the `kotlinOptions` property of a Kotlin compilation task.

When targeting the JVM, the tasks are called `compileKotlin` for production code and `compileTestKotlin`
for test code. The tasks for custom source sets of are called accordingly to the `compile<Name>Kotlin` pattern. 

The names of the tasks in Android Projects contain the [build variant](https://developer.android.com/studio/build/build-variants.html) names and follow the pattern `compile<BuildVariant>Kotlin`, for example, `compileDebugKotlin`, `compileReleaseUnitTestKotlin`.

When targeting JavaScript, the tasks are called `compileKotlin2Js` and `compileTestKotlin2Js` respectively, and `compile<Name>Kotlin2Js` for custom source sets.

To configure a single task, use its name. Examples:

``` groovy
compileKotlin {
    kotlinOptions.suppressWarnings = true
}

compileKotlin {
    kotlinOptions {
        suppressWarnings = true
    }
}
```

It is also possible to configure all Kotlin compilation tasks in the project:

``` groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).all {
    kotlinOptions {
        // ...
    }
}
```

A complete list of options for the Gradle tasks follows:

### Attributes common for JVM, JS, and JS DCE

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `allWarningsAsErrors` | Report an error if there are any warnings |  | false |
| `suppressWarnings` | Generate no warnings |  | false |
| `verbose` | Enable verbose logging output |  | false |
| `freeCompilerArgs` | A list of additional compiler arguments |  | [] |

### Attributes common for JVM and JS

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `apiVersion` | Allow to use declarations only from the specified version of bundled libraries | "1.0", "1.1", "1.2", "1.3 (EXPERIMENTAL)" |  |
| `languageVersion` | Provide source compatibility with specified language version | "1.0", "1.1", "1.2", "1.3 (EXPERIMENTAL)" |  |

### Attributes specific for JVM

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `javaParameters` | Generate metadata for Java 1.8 reflection on method parameters |  | false |
| `jdkHome` | Path to JDK home directory to include into classpath, if differs from default JAVA_HOME |  |  |
| `jvmTarget` | Target version of the generated JVM bytecode (1.6 or 1.8), default is 1.6 | "1.6", "1.8" | "1.6" |
| `noJdk` | Don't include Java runtime into classpath |  | false |
| `noReflect` | Don't include Kotlin reflection implementation into classpath |  | true |
| `noStdlib` | Don't include Kotlin runtime into classpath |  | true |

### Attributes specific for JS

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `friendModulesDisabled` | Disable internal declaration export |  | false |
| `main` | Whether a main function should be called | "call", "noCall" | "call" |
| `metaInfo` | Generate .meta.js and .kjsm files with metadata. Use to create a library |  | true |
| `moduleKind` | Kind of a module generated by compiler | "plain", "amd", "commonjs", "umd" | "plain" |
| `noStdlib` | Don't use bundled Kotlin stdlib |  | true |
| `outputFile` | Output file path |  |  |
| `sourceMap` | Generate source map |  | false |
| `sourceMapEmbedSources` | Embed source files into source map | "never", "always", "inlining" |  |
| `sourceMapPrefix` | Prefix for paths in a source map |  |  |
| `target` | Generate JS files for specific ECMA version | "v5" | "v5" |
| `typedArrays` | Translate primitive arrays to JS typed arrays |  | true |


## Generating documentation

To generate documentation for Kotlin projects, use [Dokka](https://github.com/Kotlin/dokka);
please refer to the [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin)
for configuration instructions. Dokka supports mixed-language projects and can generate output in multiple
formats, including standard JavaDoc.

## OSGi

For OSGi support see the [Kotlin OSGi page](kotlin-osgi.html).

## Examples

The following examples show different possibilities of configuring the Gradle plugin:

* [Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/hello-world)
* [Mixed Java and Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/mixed-java-kotlin-hello-world)
* [Android](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-mixed-java-kotlin-project)
* [JavaScript](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/kotlin2JsProject)
