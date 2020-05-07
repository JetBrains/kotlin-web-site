---
type: doc
layout: reference
title: "Using Gradle"
---

# Using Gradle

In order to build a Kotlin project with Gradle, you should [set up the *kotlin-gradle* plugin](#plugin-and-versions), [apply it](#targeting-the-jvm) to your project and [add *kotlin-stdlib* dependencies](#configuring-dependencies).
Those actions may also be performed automatically in IntelliJ IDEA by invoking __Tools \| Kotlin \| Configure Kotlin__ in __Project__ action.

## Plugin and Versions

Apply the Kotlin Gradle plugin by using [the Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block).
The Kotlin Gradle plugin {{ site.data.releases.latest.version }} works with Gradle 4.9 and later.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.<...>' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
    kotlin("<...>") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

The placeholder `<...>` should be replaced with one of the plugin names that can be found in further sections.

Alternatively, apply plugin by adding the `kotlin-gradle-plugin` dependency to the build script classpath:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea">

``` groovy
buildscript {
    repositories {
        mavenCentral()
    }

    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:{{ site.data.releases.latest.version }}"
    }
}

plugins {
    id "org.jetbrains.kotlin.<...>" version "{{ site.data.releases.latest.version }}"
}
```
</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>


```kotlin
buildscript {
    repositories {
        mavenCentral()
    }
        
    dependencies {
        classpath(kotlin("gradle-plugin", version = "{{ site.data.releases.latest.version }}"))
    }
}
plugins {
    kotlin("<...>")
}
```
</div>
</div>

This is not required when using Kotlin Gradle plugin 1.1.1 and above with the [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block), and with [Gradle Kotlin DSL](https://github.com/gradle/kotlin-dsl).

## Building Kotlin Multiplatform Projects

Using the `kotlin-multiplatform` plugin for building [multiplatform projects](multiplatform.html) is described in 
[Building Multiplatform Projects with Gradle](building-mpp-with-gradle.html).

## Targeting the JVM

To target the JVM, apply the Kotlin JVM plugin. Starting with Kotlin 1.1.1, the plugin can be applied using the [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block):


<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only>

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("jvm") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

The `version` should be literal in this block, and it cannot be applied from another build script.

Alternatively, you can use the older `apply plugin` approach:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
apply plugin: 'kotlin'
```

</div>

It's not recommended to apply Kotlin plugins with `apply` in Gradle Kotlin DSL. The details are provided [below](#using-gradle-kotlin-dsl).

Kotlin sources can be mixed with Java sources in the same folder, or in different folders. The default convention is using different folders:

<div class="sample" markdown="1" mode="groovy" theme="idea" auto-indent="false">

```groovy
project
    - src
        - main (root)
            - kotlin
            - java
```

</div>

The corresponding *sourceSets* property should be updated if not using the default convention:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
sourceSets.main {
    java.srcDirs("src/main/myJava", "src/main/myKotlin")
}
```

</div>
</div>

## Targeting JavaScript

When targeting JavaScript, a different plugin should be applied:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only>

``` groovy
plugins {
    id 'org.jetbrains.kotlin.js' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("js") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

This plugin only works for Kotlin files so it is recommended to keep Kotlin and Java files separate (in case if the same project contains Java files). As with
targeting the JVM, if not using the default convention, you should specify the source folder using *sourceSets*:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'src/main/myKotlin'
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets["main"].apply {    
        kotlin.srcDir("src/main/myKotlin") 
    }
}
```

</div>
</div>


## Targeting Android

Android's Gradle model is a little different from ordinary Gradle, so if we want to build an Android project written in Kotlin, we need
*kotlin-android* plugin instead of *kotlin*:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
buildscript {
    ext.kotlin_version = '{{ site.data.releases.latest.version }}'

    ...

    dependencies {
        classpath 'com.android.tools.build:gradle:3.2.1'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

plugins {
    id 'com.android.application'
    id 'kotlin-android'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
buildscript {
    dependencies {
        classpath("com.android.tools.build:gradle:3.2.1")
        classpath(kotlin("gradle-plugin", version = "{{ site.data.releases.latest.version }}"))
    }
}
plugins {
    id("com.android.application")
    kotlin("android")
}
```

</div>
</div>

Kotlin Gradle plugin {{ site.data.releases.latest.version }} works with Android Gradle Plugin 3.0 and later.

Don't forget to configure the [standard library dependency](#configuring-dependencies).

### Android Studio

If using Android Studio, the following needs to be added under android:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
android {
  ...

  sourceSets {
    main.java.srcDirs += 'src/main/kotlin'
  }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
android {
  ...
  
    sourceSets["main"].java.srcDir("src/main/kotlin")
}
```

</div>
</div>

This lets Android Studio know that the kotlin directory is a source root, so when the project model is loaded into the IDE it will be properly recognized. Alternatively, you can put Kotlin classes in the Java source directory, typically located in `src/main/java`.


## Configuring Dependencies

In addition to the `kotlin-gradle-plugin` dependency shown above, you need to add a dependency on the Kotlin standard library:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
}
```

</div>
</div>
 
The Kotlin standard library `kotlin-stdlib` targets Java 6 and above. There are extended versions of the standard library that add support for some of the features of JDK 7 and JDK 8. To use these versions, add one of the
following dependencies instead of `kotlin-stdlib`:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7"
implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk8"
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
implementation(kotlin("stdlib-jdk7"))
implementation(kotlin("stdlib-jdk8"))
```

</div>
</div>

In Kotlin 1.1.x, use `kotlin-stdlib-jre7` and `kotlin-stdlib-jre8` instead.

If you target JavaScript, use the `stdlib-js` dependency.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
implementation "org.jetbrains.kotlin:kotlin-stdlib-js"
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
implementation(kotlin("stdlib-js"))
```

</div>
</div>

If your project uses [Kotlin reflection](/api/latest/jvm/stdlib/kotlin.reflect.full/index.html) or testing facilities, you need to add the corresponding dependencies as well:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
implementation "org.jetbrains.kotlin:kotlin-reflect"
testImplementation "org.jetbrains.kotlin:kotlin-test"
testImplementation "org.jetbrains.kotlin:kotlin-test-junit"
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
implementation(kotlin("reflect"))
testImplementation(kotlin("test"))
testImplementation(kotlin("test-junit"))
```

</div>
</div>

Starting with Kotlin 1.1.2, the dependencies with group `org.jetbrains.kotlin` are by default resolved with the version
taken from the applied plugin. You can provide the version manually using the full dependency notation:
 
<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">
 
 ```groovy
implementation "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
 ```
 
</div>
</div>
 
<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>
 
 ```kotlin
 implementation(kotlin("stdlib", kotlinVersion))
 ```
 
</div>
</div>

## Annotation Processing

Kotlin supports annonation processing via the _Kotlin annotation processing tool_(`kapt`). Usage of kapt with Gradle is described on the [kapt page](kapt.html).

## Incremental Compilation

The Kotlin Gradle plugin supports incremental compilation. Incremental compilation tracks changes of source files between builds so only files affected by these changes would be compiled.

Incremental compilation is supported for Kotlin/JVM and Kotlin/JS projects. It's enabled by default since Kotlin 1.1.1 for Kotlin/JVM and 1.3.20 for Kotlin/JS. 

There are several ways to override the default setting:

* In Gradle configuration files: add the line `kotlin.incremental=<value>` for Kotlin/JVM or `kotlin.incremental.js=<value>` for Kotlin/JS projects either to `gradle.properties` or to `local.properties` file. `<value>` is a boolean value reflecting the usage of incremental compilation. 

* In Gradle command line parameters: add the parameter `-Pkotlin.incremental` or `-Pkotlin.incremental.js` with the boolean value reflecting the usage of incremental compilation. Note that in this case the parameter should be added to each subsequent build, and any build with disabled incremental compilation invalidates incremental caches.

Note that the first build isn't incremental in any case.


## Gradle Build Cache Support (since 1.2.20)

The Kotlin plugin supports [Gradle Build Cache](https://guides.gradle.org/using-build-cache/) (Gradle version 4.3 and above is required; caching is disabled with lower versions).

To disable the caching for all Kotlin tasks, set the system property flag `kotlin.caching.enabled` to `false` (run the build with the argument `-Dkotlin.caching.enabled=false`).

If you use [kapt](kapt.html), note that the kapt annotation processing tasks are not cached by default. However, you can enable caching for them manually. See the [kapt page](kapt.html#gradle-build-cache-support-since-1220) for details. 

## Compiler Options

To specify additional compilation options, use the `kotlinOptions` property of a Kotlin compilation task.

When targeting the JVM, the tasks are called `compileKotlin` for production code and `compileTestKotlin`
for test code. The tasks for custom source sets are called accordingly to the `compile<Name>Kotlin` pattern. 

The names of the tasks in Android Projects contain the [build variant](https://developer.android.com/studio/build/build-variants.html) names and follow the pattern `compile<BuildVariant>Kotlin`, for example, `compileDebugKotlin`, `compileReleaseUnitTestKotlin`.

When targeting JavaScript, the tasks are called `compileKotlin2Js` and `compileTestKotlin2Js` respectively, and `compile<Name>Kotlin2Js` for custom source sets.

To configure a single task, use its name. Examples:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
compileKotlin {
    kotlinOptions.suppressWarnings = true
}

//or

compileKotlin {
    kotlinOptions {
        suppressWarnings = true
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
// ...

val compileKotlin: KotlinCompile by tasks

compileKotlin.kotlinOptions.suppressWarnings = true
```

</div>
</div>

Note that with Gradle Kotlin DSL, you should get the task from the project's `tasks` first.

Use the types `Kotlin2JsCompile` and `KotlinCompileCommon` for the JS and Common targets, accordingly.

It is also possible to configure all Kotlin compilation tasks in the project:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
    kotlinOptions { ... }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

tasks.withType<KotlinCompile>().configureEach {
    kotlinOptions.suppressWarnings = true
}
```

</div>
</div>

The complete list of options for the Gradle tasks is the following:
### Attributes Common for JVM, JS, and JS DCE

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `allWarningsAsErrors` | Report an error if there are any warnings |  | false |
| `suppressWarnings` | Generate no warnings |  | false |
| `verbose` | Enable verbose logging output |  | false |
| `freeCompilerArgs` | A list of additional compiler arguments |  | [] |

### Attributes Common for JVM and JS

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `apiVersion` | Allow using declarations only from the specified version of bundled libraries | "1.0", "1.1", "1.2", "1.3", "1.4 (EXPERIMENTAL)" |  |
| `languageVersion` | Provide source compatibility with the specified version of Kotlin | "1.0", "1.1", "1.2", "1.3", "1.4 (EXPERIMENTAL)" |  |

### Attributes Specific for JVM

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `javaParameters` | Generate metadata for Java 1.8 reflection on method parameters |  | false |
| `jdkHome` | Include a custom JDK from the specified location into the classpath instead of the default JAVA_HOME |  |  |
| `jvmTarget` | Target version of the generated JVM bytecode (1.6, 1.8, 9, 10, 11, 12 or 13), default is 1.6 | "1.6", "1.8", "9", "10", "11", "12", "13"| "1.6" |
| `noJdk` | Don't automatically include the Java runtime into the classpath |  | false |
| `noReflect` | Don't automatically include Kotlin reflection into the classpath |  | true |
| `noStdlib` | Don't automatically include the Kotlin/JVM stdlib and Kotlin reflection into the classpath |  | true |

### Attributes Specific for JS

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `friendModulesDisabled` | Disable internal declaration export |  | false |
| `main` | Define whether the `main` function should be called upon execution | "call", "noCall" | "call" |
| `metaInfo` | Generate .meta.js and .kjsm files with metadata. Use to create a library |  | true |
| `moduleKind` | The kind of JS module generated by the compiler | "plain", "amd", "commonjs", "umd" | "plain" |
| `noStdlib` | Don't automatically include the default Kotlin/JS stdlib into compilation dependencies |  | true |
| `outputFile` | Destination *.js file for the compilation result |  |  |
| `sourceMap` | Generate source map |  | false |
| `sourceMapEmbedSources` | Embed source files into source map | "never", "always", "inlining" |  |
| `sourceMapPrefix` | Add the specified prefix to paths in the source map |  |  |
| `target` | Generate JS files for specific ECMA version | "v5" | "v5" |
| `typedArrays` | Translate primitive arrays to JS typed arrays |  | true |

## Generating Documentation

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
