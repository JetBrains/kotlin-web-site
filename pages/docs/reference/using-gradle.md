---
type: doc
layout: reference
title: "Using Gradle"
---

# Using Gradle

In order to build a Kotlin project with Gradle, you should [apply the Kotlin Gradle plugin to your project](#plugin-and-versions)
 and [configure dependencies](#configuring-dependencies).

## Plugin and versions

Apply the Kotlin Gradle plugin by using [the Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block).

The Kotlin Gradle plugin {{ site.data.releases.latest.version }} works with Gradle 5.4 and later. The `kotlin-multiplatform` plugin
requires Gradle 6.0 or later.

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

## Targeting multiple platforms

Projects targeting [multiple platforms](mpp-supported-platforms.html), called [multiplatform projects](mpp-intro.html), 
require the `kotlin-multiplatform` plugin. [Learn more about the plugin](mpp-discover-project.html#multiplatform-plugin).

>The `kotlin-multiplatform` plugin works with Gradle 6.0 or later. 
{:.note}

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>


## Targeting the JVM

To target the JVM, apply the Kotlin JVM plugin. 

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

It's not recommended that you apply Kotlin plugins with `apply` in Gradle Kotlin DSL – [see why](#using-gradle-kotlin-dsl).

### Kotlin and Java sources

Kotlin sources can be stored with Java sources in the same folder, or placed to different folders. The default convention is using different folders:

<div class="sample" markdown="1" mode="groovy" theme="idea" auto-indent="false">

```groovy
project
    - src
        - main (root)
            - kotlin
            - java
```

</div>

The corresponding `sourceSets` property should be updated if not using the default convention:

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

When targeting only JavaScript, use the `kotlin-js` plugin. [Learn more](js-project-setup.html)

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

### Kotlin and Java sources 

This plugin only works for Kotlin files so it is recommended that you keep Kotlin and Java files separately (in case the 
project contains Java files). If you don't store them separately , specify the source folder in the `sourceSets` block:

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

It's recommended that you use Android Studio for creating Android applications. [Learn how to use Android Gradle plugin](https://developer.android.com/studio/releases/gradle-plugin).

## Configuring dependencies

To add a dependency on a library, set the dependency of the required [type](#dependency-types) (for example, `implementation`) in the 
`dependencies` block of the source sets DSL.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</div>
</div>
 
<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("com.example:my-library:1.0")
            }
        }
    }
}
```

</div>
</div>

Alternatively, you can [set dependencies at the top level](#set-dependencies-at-the-top-level).

### Dependency types

Choose the dependency type based on your requirements.

<table>
    <tr>
        <th>Type</th>
        <th>Description</th>
        <th>When to use</th>
    </tr>
    <tr>
        <td><code>api</code></td>
        <td>Used both during compilation and at runtime and is exported to library consumers.</td>
        <td>If any type from a dependency is used in the public API of the current module, use an <code>api</code> dependency.
        </td>
    </tr>
    <tr>
        <td><code>implementation</code></td>
        <td>Used during compilation and at runtime for the current module, but is not exposed for compilation of other modules
            depending on the one with the `implementation` dependency.</td>
        <td>
            <p>Use for dependencies needed for the internal logic of a module.</p>
            <p>If a module is an endpoint application which is not published, use <code>implementation</code> dependencies instead
                of <code>api</code> dependencies.</p>
        </td>
    </tr>
    <tr>
        <td><code>compileOnly</code></td>
        <td>Used for compilation of the current module and is not available at runtime nor during compilation of other modules.</td>
        <td>Use for APIs which have a third-party implementation available at runtime.</td>
    </tr>
    <tr>
        <td><code>runtimeOnly</code></td>
        <td>Available at runtime but is not visible during compilation of any module.</td>
        <td></td>
    </tr>
</table>

### Dependency on the standard library

A dependency on a standard library (`stdlib`) in each source set is added automatically. The version 
of the standard library is the same as the version of the Kotlin Gradle plugin.

For platform-specific source sets, the corresponding platform-specific variant of the library is used, while a common standard 
library is added to the rest. The Kotlin Gradle plugin will select the appropriate JVM standard library depending on 
the `kotlinOptions.jvmTarget` [compiler option](#compiler-options) of your Gradle build script.

If you declare a standard library dependency explicitly (for example, if you need a different version), the Kotlin Gradle 
plugin won’t override it or add a second standard library. 

If you do not need a standard library at all, you can add the opt-out flag to the `gradle.properties`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
kotlin.stdlib.default.dependency=false
```

</div>

### Set dependencies on test libraries

The [`kotlin.test` API](../../api/latest/kotlin.test/index.html) is available for testing different Kotlin projects. 

Add the corresponding dependencies on test libraries:

* For `commonTest`, add the `kotlin-test-common` and `kotlin-test-annotations-common` dependencies.
* For JVM targets, use `kotlin-test-junit` or `kotlin-test-testng` for the corresponding asserter implementation and annotations mapping.
* For Kotlin/JS targets, add `kotlin-test-js` as a test dependency. 

Kotlin/Native targets do not require additional test dependencies, and the `kotlin.test` API implementations are built-in.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin{
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin('test-common')
                implementation kotlin('test-annotations-common')
            }
        }
        jvmTest {
            dependencies {
                implementation kotlin('test-junit')
            }
        }
        jsTest {
            dependencies {
                implementation kotlin('test-js')
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin{
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test-common"))
                implementation(kotlin("test-annotations-common"))
            }
        }
        val jvmTest by getting {
            dependencies {
                implementation(kotlin("test-junit"))
            }
        }
        val jsTest by getting {
            dependencies {
                implementation(kotlin("test-js"))
            }
        }
    }
}
```

</div>
</div>

> You can use shorthand for a dependency on a Kotlin module, for example, kotlin("test") for "org.jetbrains.kotlin:kotlin-test".
{:.note}

## Set a dependency on a kotlinx library

If you use a kotlinx library and need a platform-specific dependency, you can use platform-specific variants 
of libraries with suffixes such as `-jvm` or `-js`, for example, `kotlinx-coroutines-core-jvm`. You can also use the library 
base artifact name instead – `kotlinx-coroutines-core`.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:{{ site.data.releases.latest.coroutines.version }}'
            }
        }
    }
}
```

</div>
</div>
 
<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:{{ site.data.releases.latest.coroutines.version }}")
            }
        }
    }
}

```

</div>
</div>

If you use a multiplatform library and need to depend on the shared code, set the dependency only once in the shared 
source set. Use the library base artifact name, such as `kotlinx-coroutines-core` or `ktor-client-core`. 

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}'
            }
        }
    }
}
```

</div>
</div>
 
<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}")
            }
        }
    }
}

```

</div>
</div>
 
### Set dependencies at the top level

Alternatively, you can specify the dependencies at the top level with the configuration names following the pattern 
`<sourceSetName><DependencyType>`. This is helpful for some Gradle built-in dependencies, like `gradleApi()`, `localGroovy()`, 
or `gradleTestKit()`, which are not available in the source sets dependency DSL.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
dependencies {
    commonMainImplementation 'com.example:my-library:1.0'
}

```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
dependencies {
    "commonMainImplementation"("com.example:my-library:1.0")
}

```

</div>
</div> 
 

## Annotation processing

Kotlin supports annonation processing via the Kotlin annotation processing tool [`kapt`](kapt.html).

## Incremental compilation

The Kotlin Gradle plugin supports incremental compilation. Incremental compilation tracks changes of source files between 
builds so only files affected by these changes would be compiled.

Incremental compilation is supported for Kotlin/JVM and Kotlin/JS projects and is enabled by default since Kotlin 1.1.1.

There are several ways to disable the setting:

* Add the following line to the `gradle.properties` or `local.properties` file: 
    * `kotlin.incremental=false` for Kotlin/JVM 
    * `kotlin.incremental.js=false` for Kotlin/JS projects
    
* As the command line parameter, use `-Pkotlin.incremental=false` or `-Pkotlin.incremental.js=false`.

    Note that in this case the parameter should be added to each subsequent build, and any build with disabled incremental 
    compilation invalidates incremental caches.

Note that the first build isn't incremental in any case.

## Gradle build cache support 

The Kotlin plugin supports [Gradle Build Cache](https://guides.gradle.org/using-build-cache/).

To disable the caching for all Kotlin tasks, set the system property flag `kotlin.caching.enabled` to `false` 
(run the build with the argument `-Dkotlin.caching.enabled=false`).

If you use [kapt](kapt.html), note that the kapt annotation processing tasks are not cached by default. However, you can
 [enable caching for them manually](kapt.html#gradle-build-cache-support-since-1220). 
 
## Compiler options

To specify additional compilation options, use the `kotlinOptions` property of a Kotlin compilation task.

When targeting the JVM, the tasks are called `compileKotlin` for production code and `compileTestKotlin`
for test code. The tasks for custom source sets are called accordingly to the `compile<Name>Kotlin` pattern. 

The names of the tasks in Android Projects contain the [build variant](https://developer.android.com/studio/build/build-variants.html) names and follow the pattern `compile<BuildVariant>Kotlin`, for example, `compileDebugKotlin`, `compileReleaseUnitTestKotlin`.

When targeting JavaScript, the tasks are called `compileKotlinJs` and `compileTestKotlinJs` respectively, and `compile<Name>KotlinJs` for custom source sets.

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
    kotlinOptions { /*...*/ }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    kotlinOptions { /*...*/ }
}
```

</div>
</div>

The complete list of options for the Gradle tasks is the following:

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
| `apiVersion` | Allow using declarations only from the specified version of bundled libraries | "1.2" (DEPRECATED), "1.3", "1.4", "1.5" (EXPERIMENTAL) |  |
| `languageVersion` | Provide source compatibility with the specified version of Kotlin | "1.2" (DEPRECATED), "1.3", "1.4", "1.5" (EXPERIMENTAL) |  |

### Attributes specific for JVM

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `javaParameters` | Generate metadata for Java 1.8 reflection on method parameters |  | false |
| `jdkHome` | Include a custom JDK from the specified location into the classpath instead of the default JAVA_HOME |  |  |
| `jvmTarget` | Target version of the generated JVM bytecode | "1.6", "1.8", "9", "10", "11", "12", "13", "14", "15" | "1.6" |
| `noJdk` | Don't automatically include the Java runtime into the classpath |  | false |
| `noReflect` | Don't automatically include Kotlin reflection into the classpath |  | true |
| `noStdlib` | Don't automatically include the Kotlin/JVM stdlib and Kotlin reflection into the classpath |  | true |
| `useIR` | Use the IR backend |  | false |

### Attributes specific for JS

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `friendModulesDisabled` | Disable internal declaration export |  | false |
| `main` | Define whether the `main` function should be called upon execution | "call", "noCall" | "call" |
| `metaInfo` | Generate .meta.js and .kjsm files with metadata. Use to create a library |  | true |
| `moduleKind` | The kind of JS module generated by the compiler | "umd", "commonjs", "amd", "plain"  | "umd" |
| `noStdlib` | Don't automatically include the default Kotlin/JS stdlib into compilation dependencies |  | true |
| `outputFile` | Destination *.js file for the compilation result |  | "\<buildDir>/js/packages/\<project.name>/kotlin/\<project.name>.js" |
| `sourceMap` | Generate source map |  | true |
| `sourceMapEmbedSources` | Embed source files into source map | "never", "always", "inlining" |  |
| `sourceMapPrefix` | Add the specified prefix to paths in the source map |  |  |
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

When using [Gradle Kotlin DSL](https://github.com/gradle/kotlin-dsl), apply the Kotlin plugins using the `plugins { ... }` block. 
If you apply them with `apply { plugin(...) }` instead, you may encounter unresolved references to the extensions generated 
by Gradle Kotlin DSL. To resolve that, you can comment out the erroneous usages, run the Gradle task `kotlinDslAccessorsSnapshot`, 
then uncomment the usages back and rerun the build or reimport the project into the IDE.

