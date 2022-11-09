[//]: # (title: Configure your existing project)

To build a Kotlin project with [Gradle](https://docs.gradle.org/current/userguide/getting_started.html), 
you need to add the [Kotlin Gradle plugin](#apply-the-plugin) to your build script file `build.gradle(.kts)` 
and [configure dependencies](#configure-dependencies) there.

> To learn more about the contents of a build script,
> visit the [Explore the build script](gradle-backend-tutorial.md#explore-the-build-script) section.
>
{type="note"}

## Apply the plugin

To apply the Kotlin Gradle plugin, use the [`plugins` block](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)
from the Gradle plugins DSL:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// replace `<...>` with the plugin name 
plugins {
    kotlin("<...>") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// replace `<...>` with the plugin name
plugins {
    id 'org.jetbrains.kotlin.<...>' version '%kotlinVersion%'
}
```

</tab>
</tabs>

When configuring your project, check the Kotlin Gradle plugin compatibility with available Gradle versions:

|                       | Minimum supported version | Maximum fully supported version |
|-----------------------|---------------------------|---------------------------------|
| Gradle                | %minGradleVersion%        | %maxGradleVersion%              |   
| Android Gradle plugin | %minAndroidGradleVersion% | %maxAndroidGradleVersion%       |

For example, the Kotlin Gradle plugin and the `kotlin-multiplatform` plugin %kotlinVersion% require the minimum Gradle
version of %minGradleVersion% for your project to compile.

Similarly, the maximum fully supported version is %maxGradleVersion%. It doesn't have deprecated Gradle
methods and properties, and supports all the current Gradle features.

## Targeting the JVM

To target the JVM, apply the Kotlin JVM plugin.

<tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "%kotlinVersion%"
}
```

</tab>
</tabs>

The `version` should be literal in this block, and it cannot be applied from another build script.

Alternatively, you can use the older `apply plugin` approach:

```groovy
apply plugin: 'kotlin'
```

Applying Kotlin plugins with `apply` in the Kotlin Gradle DSL is not recommended – [see why](gradle-kotlin-dsl.md#using-the-gradle-kotlin-dsl).

### Kotlin and Java sources

Kotlin sources and Java sources can be stored in the same folder, or they can be placed in different folders. The default convention is to use different folders:

```groovy
project
    - src
        - main (root)
            - kotlin
            - java
```

The corresponding `sourceSets` property should be updated if you are not using the default convention:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
sourceSets.main {
    java.srcDirs("src/main/myJava", "src/main/myKotlin")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

</tab>
</tabs>

### Check for JVM target compatibility of related compile tasks

In the build module, you may have related compile tasks, for example:
* `compileKotlin` and `compileJava`
* `compileTestKotlin` and `compileTestJava`

> `main` and `test` source set compile tasks are not related.
>
{type="note"}

For related tasks like these, the Kotlin Gradle plugin checks for JVM target compatibility. Different values of `jvmTarget` in
the `kotlin` extension and [`targetCompatibility`](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)
in the `java` extension cause incompatibility. For example:
the `compileKotlin` task has `jvmTarget=1.8`, and
the `compileJava` task has (or [inherits](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)) `targetCompatibility=15`.

Configure the behavior of this check by setting the `kotlin.jvm.target.validation.mode` property in the `build.gradle`
file to:

* `warning` – the default value; the Kotlin Gradle plugin will print a warning message.
* `error` – the plugin will fail the build.
* `ignore` – the plugin will skip the check and won't produce any messages.

### Set custom JDK home

By default, Kotlin compile tasks use the current Gradle JDK.
If you need to change the JDK for some reason, you can set the JDK home with [Java toolchains](#gradle-java-toolchains-support)
or the [Task DSL](#setting-jdk-version-with-the-task-dsl) to set a local JDK.

> The `jdkHome` compiler option is deprecated since Kotlin 1.5.30.
>
{type="warning"}

When you use a custom JDK, note that [kapt task workers](kapt.md#running-kapt-tasks-in-parallel)
use [process isolation mode](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode) only,
and ignore the `kapt.workers.isolation` property.

### Gradle Java toolchains support

Gradle 6.7 introduced [Java toolchains support](https://docs.gradle.org/current/userguide/toolchains.html).
Using this feature, you can:
* Use a JDK and a JRE that are different from the Gradle ones to run compilations, tests, and executables.
* Compile and test code with a not-yet-released language version.

With toolchains support, Gradle can autodetect local JDKs and install missing JDKs that Gradle requires for the build.
Now Gradle itself can run on any JDK and still reuse the [remote build cache feature](gradle-compilation-and-caches.md#gradle-build-cache-support)
for tasks that depend on a major JDK version.

The Kotlin Gradle plugin supports Java toolchains for Kotlin/JVM compilation tasks. JS and Native tasks don't use toolchains.
The Kotlin compiler always runs on the JDK the Gradle daemon is running on.
A Java toolchain:
* Sets the [`jdkHome` option](gradle-compiler-options.md#attributes-specific-to-jvm) available for JVM targets.
* Sets the [`kotlinOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm) to the toolchain's JDK version
  if the user doesn't set the `jvmTarget` option explicitly.
  If the user doesn't configure the toolchain, the `jvmTarget` field uses the default value.
  Learn more about [JVM target compatibility](#check-for-jvm-target-compatibility-of-related-compile-tasks).
* Sets the toolchain to be used by any Java compile, test and javadoc tasks.
* Affects which JDK [`kapt` workers](kapt.md#running-kapt-tasks-in-parallel) are running on.

Use the following code to set a toolchain. Replace the placeholder `<MAJOR_JDK_VERSION>` with the JDK version you would like to use:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8" 
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</tab>
</tabs>

Note that setting a toolchain via the `kotlin` extension updates the toolchain for Java compile tasks as well.

> To understand which toolchain Gradle uses, run your Gradle build with the [log level `--info`](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)
> and find a string in the output starting with `[KOTLIN] Kotlin compilation 'jdkHome' argument:`.
> The part after the colon will be the JDK version from the toolchain.
>
{type="note"}

To set any JDK (even local) for the specific task, use the Task DSL.

### Setting JDK version with the Task DSL

The Task DSL allows setting any JDK version for any task implementing the `UsesKotlinJavaToolchain` interface.
At the moment, these tasks are `KotlinCompile` and `KaptTask`.
If you want Gradle to search for the major JDK version, replace the `<MAJOR_JDK_VERSION>` placeholder in your build script:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val service = project.extensions.getByType<JavaToolchainService>()
val customLauncher = service.launcherFor {
    it.languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
}
project.tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
JavaToolchainService service = project.getExtensions().getByType(JavaToolchainService.class)
Provider<JavaLauncher> customLauncher = service.launcherFor {
    it.languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
}
tasks.withType(UsesKotlinJavaToolchain::class).configureEach { task ->
    task.kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</tab>
</tabs>

Or you can specify the path to your local JDK and replace the placeholder `<LOCAL_JDK_VERSION>` with this JDK version:

```kotlin
tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.jdk.use(
        "/path/to/local/jdk", // Put a path to your JDK
        JavaVersion.<LOCAL_JDK_VERSION> // For example, JavaVersion.17
    )
}
```

### Associate compiler tasks

You can _associate_ compilations by setting up such a relationship between them that one compilation uses the compiled
outputs of the other. Associating compilations establishes `internal` visibility between them.

The Kotlin compiler associates some compilations by default, such as the `test` and `main` compilations of each target.
If you need to express that one of your custom compilations is connected to another, create your own associated
compilation.

To make the IDE support associated compilations for inferring visibility between source sets, add the following code to
your `build.gradle(.kts)`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val integrationTestCompilation = kotlin.target.compilations.create("integrationTest") {
    associateWith(kotlin.target.compilations.getByName("main"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
integrationTestCompilation {
    kotlin.target.compilations.create("integrationTest") {
        associateWith(kotlin.target.compilations.getByName("main"))
    }
}
```

</tab>
</tabs>

Here, the `integrationTest` compilation is associated with the `main` compilation that gives access to `internal`
objects from functional tests.

## Targeting multiple platforms

Projects targeting [multiple platforms](multiplatform-dsl-reference.md#targets), called [multiplatform projects](multiplatform-get-started.md),
require the `kotlin-multiplatform` plugin. [Learn more about the plugin](multiplatform-discover-project.md#multiplatform-plugin).

>The `kotlin-multiplatform` plugin works with Gradle %minGradleVersion% or later.
>
{type="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
  kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
  id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

## Targeting Android

It's recommended to use Android Studio for creating Android applications. [Learn how to use Android Gradle plugin](https://developer.android.com/studio/releases/gradle-plugin).

## Targeting JavaScript

When targeting only JavaScript, use the `kotlin-js` plugin. [Learn more](js-project-setup.md)

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

### Kotlin and Java sources for JavaScript

This plugin only works for Kotlin files, so it is recommended that you keep Kotlin and Java files separate (if the
project contains Java files). If you don't store them separately, specify the source folder in the `sourceSets` block:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets["main"].apply {    
        kotlin.srcDir("src/main/myKotlin") 
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'src/main/myKotlin'
    }
}
```

</tab>
</tabs>

## Configure dependencies

To add a dependency on a library, set the dependency of the required [type](#dependency-types) (for example, `implementation`) in the
`dependencies` block of the source sets DSL.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

Alternatively, you can [set dependencies at top level](#set-dependencies-at-top-level).

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

A dependency on the standard library (`stdlib`) is added automatically to each source set. The version
of the standard library used is the same as the version of the Kotlin Gradle plugin.

For platform-specific source sets, the corresponding platform-specific variant of the library is used, while a common standard
library is added to the rest. The Kotlin Gradle plugin selects the appropriate JVM standard library depending on
the `kotlinOptions.jvmTarget` [compiler option](gradle-compiler-options.md) of your Gradle build script.

If you declare a standard library dependency explicitly (for example, if you need a different version), the Kotlin Gradle
plugin won't override it or add a second standard library.

If you do not need a standard library at all, you can add the opt-out option to the `gradle.properties`:

```kotlin
kotlin.stdlib.default.dependency=false
```

### Set dependencies on test libraries

The [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API is available for testing Kotlin projects on
all supported platforms.
Add the dependency `kotlin-test` to the `commonTest` source set, and the Gradle plugin will infer the corresponding
test dependencies for each test source set:
* `kotlin-test-common` and `kotlin-test-annotations-common` for common source sets
* `kotlin-test-junit` for JVM source sets
* `kotlin-test-js` for Kotlin/JS source sets

Kotlin/Native targets do not require additional test dependencies, and the `kotlin.test` API implementations are built-in.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test")) // This brings all the platform dependencies automatically
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // This brings all the platform dependencies automatically
            }
        }
    }
}
```

</tab>
</tabs>

> You can use shorthand for a dependency on a Kotlin module, for example, kotlin("test") for "org.jetbrains.kotlin:kotlin-test".
>
{type="note"}

You can use the `kotlin-test` dependency in any shared or platform-specific source set as well.

For Kotlin/JVM, Gradle uses JUnit 4 by default. Therefore, the `kotlin("test")` dependency resolves to the variant for
JUnit 4, namely `kotlin-test-junit`.

You can choose JUnit 5 or TestNG by calling
[`useJUnitPlatform()`]( https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)
or [`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG) in the
test task of your build script.
The following example is for a Kotlin Multiplatform project:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        testRuns["test"].executionTask.configure {
            useJUnitPlatform()
        }
    }
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        testRuns["test"].executionTask.configure {
            useJUnitPlatform()
        }
    }
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test")
            }
        }
    }
}
```

</tab>
</tabs>

The following example is for a JVM project:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    testImplementation(kotlin("test"))
}

tasks {
    test {
        useTestNG()
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    testImplementation 'org.jetbrains.kotlin:kotlin-test'
}

test {
    useTestNG()
}
```

</tab>
</tabs>

[Learn how to test code using JUnit on the JVM](jvm-test-using-junit.md).

If you need to use a different JVM test framework, disable automatic testing framework selection by
adding the line `kotlin.test.infer.jvm.variant=false` to the project's `gradle.properties` file.
After doing this, add the framework as a Gradle dependency.

If you have used a variant of `kotlin("test")` in your build script explicitly and your project build stopped working with
a compatibility conflict,
see [this issue in the Compatibility Guide](compatibility-guide-15.md#do-not-mix-several-jvm-variants-of-kotlin-test-in-a-single-project).

### Set a dependency on a kotlinx library

If you use a kotlinx library and need a platform-specific dependency, you can use platform-specific variants
of libraries with suffixes such as `-jvm` or `-js`, for example, `kotlinx-coroutines-core-jvm`. You can also use the library's
base artifact name instead – `kotlinx-coroutines-core`.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:%coroutinesVersion%")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

If you use a multiplatform library and need to depend on the shared code, set the dependency only once, in the shared
source set. Use the library's base artifact name, such as `kotlinx-coroutines-core` or `ktor-client-core`.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

### Set dependencies at top level

Alternatively, you can specify the dependencies at top level, using the following pattern for the configuration names:
`<sourceSetName><DependencyType>`. This can be helpful for some Gradle built-in dependencies, like `gradleApi()`, `localGroovy()`,
or `gradleTestKit()`, which are not available in the source sets' dependency DSL.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    "commonMainImplementation"("com.example:my-library:1.0")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    commonMainImplementation 'com.example:my-library:1.0'
}
```

</tab>
</tabs>

## What's next?

Learn more about:
* [Compiler options and how to pass them](gradle-compiler-options.md)
* [Incremental compilation, caches support, build reports, and the Kotlin daemon](gradle-compilation-and-caches.md)
* [Kotlin DSL](gradle-kotlin-dsl.md)
* [Gradle basics and specifics](https://docs.gradle.org/current/userguide/getting_started.html)