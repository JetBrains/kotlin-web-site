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

<div class="sample" markdown="1" theme="idea" data-highlight-only>
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
</div>

This is not required when using Kotlin Gradle plugin 1.1.1 and above with the [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block), and with [Gradle Kotlin DSL](https://github.com/gradle/kotlin-dsl).

## Targeting the JVM

To target the JVM, the Kotlin plugin needs to be applied:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
apply plugin: "kotlin"
```
</div>

Or, starting with Kotlin 1.1.1, the plugin can be applied using the [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block):

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "{{ site.data.releases.latest.version }}"
}
```
</div>

The `version` should be literal in this block, and it cannot be applied from another build script.

With Gradle Kotlin DSL, apply the plugin as follows:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
plugins {
    kotlin("jvm") version "{{ site.data.releases.latest.version }}"
}
```
</div>

Kotlin sources can be mixed with Java sources in the same folder, or in different folders. The default convention is using different folders:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">
```groovy
project
    - src
        - main (root)
            - kotlin
            - java
```
</div>

The corresponding *sourceSets* property should be updated if not using the default convention:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```
</div>

With Gradle Kotlin DSL, configure source sets with `java.sourceSets { ... }` instead.

## Targeting JavaScript

When targeting JavaScript, a different plugin should be applied:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
apply plugin: "kotlin2js"
```
</div>

This plugin only works for Kotlin files so it is recommended to keep Kotlin and Java files separate (if it's the case that the same project contains Java files). As with
targeting the JVM, if not using the default convention, we need to specify the source folder using *sourceSets*:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
}
```
</div>

In addition to the output JavaScript file, the plugin by default creates an additional JS file with binary descriptors.
This file is required if you're building a re-usable library that other Kotlin modules can depend on, and should be distributed together with the result of translation.
The generation is controlled by the  `kotlinOptions.metaInfo` option:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
compileKotlin2Js {
    kotlinOptions.metaInfo = true
}
```
</div>

## Targeting Android

Android's Gradle model is a little different from ordinary Gradle, so if we want to build an Android project written in Kotlin, we need
*kotlin-android* plugin instead of *kotlin*:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
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
</div>

Don't forget to configure the [standard library dependency](#configuring-dependencies).

### Android Studio

If using Android Studio, the following needs to be added under android:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
android {
  ...

  sourceSets {
    main.java.srcDirs += 'src/main/kotlin'
  }
}
```
</div>

This lets Android Studio know that the kotlin directory is a source root, so when the project model is loaded into the IDE it will be properly recognized. Alternatively, you can put Kotlin classes in the Java source directory, typically located in `src/main/java`.


## Configuring Dependencies

In addition to the `kotlin-gradle-plugin` dependency shown above, you need to add a dependency on the Kotlin standard library:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
repositories {
    mavenCentral()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib"
}
```
</div>

If you target JavaScript, use `compile "org.jetbrains.kotlin:kotlin-stdlib-js"` instead.

If you're targeting JDK 7 or JDK 8, you can use extended versions of the Kotlin standard library which contain
additional extension functions for APIs added in new JDK versions. Instead of `kotlin-stdlib`, use one of the
following dependencies:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
compile "org.jetbrains.kotlin:kotlin-stdlib-jdk7"
compile "org.jetbrains.kotlin:kotlin-stdlib-jdk8"
```
</div>

With Gradle Kotlin DSL, the following notation for the dependencies is equivalent:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
dependencies {
    compile(kotlin("stdlib"))
    // or one of:
    compile(kotlin("stdlib-jdk7"))
    compile(kotlin("stdlib-jdk8"))
}
```
</div>

In Kotlin 1.1.x, use `kotlin-stdlib-jre7` and `kotlin-stdlib-jre8` instead.

If your project uses [Kotlin reflection](/api/latest/jvm/stdlib/kotlin.reflect.full/index.html) or testing facilities, you need to add the corresponding dependencies as well:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```groovy
compile "org.jetbrains.kotlin:kotlin-reflect"
testCompile "org.jetbrains.kotlin:kotlin-test"
testCompile "org.jetbrains.kotlin:kotlin-test-junit"
```
</div>

Or, with Gradle Kotlin DSL:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```groovy
compile(kotlin("reflect"))
testCompile(kotlin("test"))
testCompile(kotlin("test-junit"))
```
</div>

Starting with Kotlin 1.1.2, the dependencies with group `org.jetbrains.kotlin` are by default resolved with the version
taken from the applied plugin. You can provide the version manually using the full dependency notation like
`compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"`, or `kotlin("stdlib", kotlinVersion)` in Gradle Kotlin DSL.

## Annotation processing

See the description of [Kotlin annotation processing tool](kapt.html) (`kapt`).

## Incremental compilation

Kotlin supports optional incremental compilation in Gradle.
Incremental compilation tracks changes of source files between builds so only files affected by these changes would be compiled.

Starting with Kotlin 1.1.1, incremental compilation is enabled by default.

There are several ways to override the default setting:

  1. add `kotlin.incremental=true` or `kotlin.incremental=false` line either to a `gradle.properties` or to a `local.properties` file;

  2. add `-Pkotlin.incremental=true` or `-Pkotlin.incremental=false` to Gradle command line parameters. Note that in this case the parameter should be added to each subsequent build, and any build with disabled incremental compilation invalidates incremental caches.

Note, that the first build won't be incremental.


## Gradle Build Cache support (since 1.2.20)

The Kotlin plugin supports [Gradle Build Cache](https://guides.gradle.org/using-build-cache/) (Gradle version 4.3 and above is required; caching is disabled with lower versions).

The kapt annotation processing tasks are not cached by default since annotation processors run arbitrary code that may not necessarily transform the task inputs into the outputs, might access and modify the files that are not tracked by Gradle etc. To enable caching for kapt anyway, add the following lines to the build script:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
kapt {
    useBuildCache = true
}
```
</div>

To disable the caching for all Kotlin tasks, set the system property flag `kotlin.caching.enabled` to `false` (run the build with the argument `-Dkotlin.caching.enabled=false`).

## Compiler Options

To specify additional compilation options, use the `kotlinOptions` property of a Kotlin compilation task.

When targeting the JVM, the tasks are called `compileKotlin` for production code and `compileTestKotlin`
for test code. The tasks for custom source sets are called accordingly to the `compile<Name>Kotlin` pattern. 

The names of the tasks in Android Projects contain the [build variant](https://developer.android.com/studio/build/build-variants.html) names and follow the pattern `compile<BuildVariant>Kotlin`, for example, `compileDebugKotlin`, `compileReleaseUnitTestKotlin`.

When targeting JavaScript, the tasks are called `compileKotlin2Js` and `compileTestKotlin2Js` respectively, and `compile<Name>Kotlin2Js` for custom source sets.

To configure a single task, use its name. Examples:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
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
</div>

With Gradle Kotlin DSL, get the task from the project's `tasks` first:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
// ...

val kotlinCompile: KotlinCompile by tasks

kotlinCompile.kotlinOptions.suppressWarnings = true
```
</div>

Use the types `Kotlin2JsCompile` and `KotlinCompileCommon` for the JS and Common targets, accordingly.

It is also possible to configure all Kotlin compilation tasks in the project:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile::class.java).all {
    kotlinOptions { ... }
}
```
</div>

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

## Using Gradle Kotlin DSL

When using [Gradle Kotlin DSL](https://github.com/gradle/kotlin-dsl), apply the Kotlin plugins using the `plugins { ... }` block. If you apply them with `apply { plugin(...) }` instead, you may encounter unresolved references to the extensions generated by Gradle Kotlin DSL. To resolve that, you can comment out the erroneous usages, run the Gradle task `kotlinDslAccessorsSnapshot`, then uncomment the usages back and rerun the build or reimport the project into the IDE.

## Examples

The following examples show different possibilities of configuring the Gradle plugin:

* [Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/hello-world)
* [Mixed Java and Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/mixed-java-kotlin-hello-world)
* [Android](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-mixed-java-kotlin-project)
* [JavaScript](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/kotlin2JsProject)
