[//]: # (title: Gradle)

In order to build a Kotlin project with Gradle, you should [apply the Kotlin Gradle plugin to your project](#plugin-and-versions)
 and [configure dependencies](#configuring-dependencies).

## Plugin and versions

Apply the Kotlin Gradle plugin by using [the Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block).

The Kotlin Gradle plugin and `kotlin-multiplatform` plugin %kotlinVersion% require Gradle %minGradleVersion% or later.

<tabs>

```groovy
plugins {
    id 'org.jetbrains.kotlin.<...>' version '%kotlinVersion%'
}
```

```kotlin
plugins {
    kotlin("<...>") version "%kotlinVersion%"
}
```

</tabs>

The placeholder `<...>` should be replaced with one of the plugin names that can be found in further sections.

## Targeting multiple platforms

Projects targeting [multiple platforms](mpp-supported-platforms.md), called [multiplatform projects](mpp-intro.md), 
require the `kotlin-multiplatform` plugin. [Learn more about the plugin](mpp-discover-project.md#multiplatform-plugin).

>The `kotlin-multiplatform` plugin works with Gradle %minGradleVersion% or later. 
>
{type="note"}

<tabs>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tabs>

## Targeting the JVM

To target the JVM, apply the Kotlin JVM plugin. 

<tabs>

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "%kotlinVersion%"
}
```

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}
```

</tabs>

The `version` should be literal in this block, and it cannot be applied from another build script.

Alternatively, you can use the older `apply plugin` approach:

```groovy
apply plugin: 'kotlin'
```

It's not recommended that you apply Kotlin plugins with `apply` in Gradle Kotlin DSL – [see why](#using-gradle-kotlin-dsl).

### Kotlin and Java sources

Kotlin sources can be stored with Java sources in the same folder, or placed to different folders. The default convention is using different folders:

```groovy
project
    - src
        - main (root)
            - kotlin
            - java
```

The corresponding `sourceSets` property should be updated if not using the default convention:

<tabs>

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

```kotlin
sourceSets.main {
    java.srcDirs("src/main/myJava", "src/main/myKotlin")
}
```

</tabs>

## Targeting JavaScript

When targeting only JavaScript, use the `kotlin-js` plugin. [Learn more](js-project-setup.md)

<tabs>

``` groovy
plugins {
    id 'org.jetbrains.kotlin.js' version '%kotlinVersion%'
}
```

```kotlin
plugins {
    kotlin("js") version "%kotlinVersion%"
}
```

</tabs>

### Kotlin and Java sources for JavaScript

This plugin only works for Kotlin files so it is recommended that you keep Kotlin and Java files separately (in case the 
project contains Java files). If you don't store them separately, specify the source folder in the `sourceSets` block:

<tabs>

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'src/main/myKotlin'
    }
}
```

```kotlin
kotlin {
    sourceSets["main"].apply {    
        kotlin.srcDir("src/main/myKotlin") 
    }
}
```

</tabs>

## Targeting Android

It's recommended that you use Android Studio for creating Android applications. [Learn how to use Android Gradle plugin](https://developer.android.com/studio/releases/gradle-plugin).

## Configuring dependencies

To add a dependency on a library, set the dependency of the required [type](#dependency-types) (for example, `implementation`) in the 
`dependencies` block of the source sets DSL.

<tabs>

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

</tabs>

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
plugin won't override it or add a second standard library. 

If you do not need a standard library at all, you can add the opt-out option to the `gradle.properties`:

```kotlin
kotlin.stdlib.default.dependency=false
```

### Set dependencies on test libraries

The [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API is available to test Kotlin projects on 
all supported platforms.
Add the dependency `kotlin-test` to the `commonTest` source set, and the Gradle plugin will infer the corresponding 
test dependencies for each test source set:
* `kotlin-test-common` and `kotlin-test-annotations-common` for common source sets
* `kotlin-test-junit` for JVM source sets
* `kotlin-test-js` for Kotlin/JS source sets

Kotlin/Native targets do not require additional test dependencies, and the `kotlin.test` API implementations are built-in.

<tabs>

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
The following example is for an MPP project:

<tabs>

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

</tabs>

The following example is for a JVM project:

<tabs>

```groovy
dependencies {
    testImplementation 'org.jetbrains.kotlin:kotlin-test'
}

test {
    useTestNG()
}
```

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

</tabs>

[Learn how to test code using JUnit on the JVM](jvm-test-using-junit.md).

If you need to use a different JVM test framework, disable automatic testing framework selection by
adding the line `kotlin.test.infer.jvm.variant=false` to the project's `gradle.properties`. 
Once you do this, add the framework as a Gradle dependency.

If you had used a variant of `kotlin("test")` in your build script explicitly and project build stopped working with
a conflict on capability, 
see [this issue in the Compatibility Guide](compatibility-guide-15.md#do-not-mix-several-jvm-variants-of-kotlin-test-in-a-single-project).

### Set a dependency on a kotlinx library

If you use a kotlinx library and need a platform-specific dependency, you can use platform-specific variants 
of libraries with suffixes such as `-jvm` or `-js`, for example, `kotlinx-coroutines-core-jvm`. You can also use the library 
base artifact name instead – `kotlinx-coroutines-core`.

<tabs>

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

</tabs>

If you use a multiplatform library and need to depend on the shared code, set the dependency only once in the shared 
source set. Use the library base artifact name, such as `kotlinx-coroutines-core` or `ktor-client-core`. 

<tabs>

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

</tabs> 

### Set dependencies at the top level

Alternatively, you can specify the dependencies at the top level with the configuration names following the pattern 
`<sourceSetName><DependencyType>`. This is helpful for some Gradle built-in dependencies, like `gradleApi()`, `localGroovy()`, 
or `gradleTestKit()`, which are not available in the source sets dependency DSL.

<tabs>

```groovy
dependencies {
    commonMainImplementation 'com.example:my-library:1.0'
}
```

```kotlin
dependencies {
    "commonMainImplementation"("com.example:my-library:1.0")
}
```

</tabs>

## Annotation processing

Kotlin supports annotation processing via the Kotlin annotation processing tool [`kapt`](kapt.md).

## Incremental compilation

The Kotlin Gradle plugin supports incremental compilation. Incremental compilation tracks changes of source files between 
builds so only files affected by these changes would be compiled.

Incremental compilation is supported for Kotlin/JVM and Kotlin/JS projects and is enabled by default.

There are several ways to switch off incremental compilation:

* `kotlin.incremental=false` for Kotlin/JVM.
* `kotlin.incremental.js=false` for Kotlin/JS projects.
* As the command line parameter, use `-Pkotlin.incremental=false` or `-Pkotlin.incremental.js=false` for Kotlin/JVM and Kotlin/JS projects respectively.

    Note that in this case the parameter should be added to each subsequent build, and any build with disabled incremental 
    compilation invalidates incremental caches.

Note that the first build isn't incremental in any case.

## Gradle build cache support 

The Kotlin plugin supports [Gradle build cache](https://docs.gradle.org/current/userguide/build_cache.html) that stores
the build outputs for reuse in future builds.

To disable the caching for all Kotlin tasks, set the system property flag `kotlin.caching.enabled` to `false` 
(run the build with the argument `-Dkotlin.caching.enabled=false`).

If you use [kapt](kapt.md), note that the kapt annotation processing tasks are not cached by default. However, you can
 [enable caching for them manually](kapt.md#gradle-build-cache-support). 

## Gradle configuration cache support

> The configuration cache is available in Gradle 6.5 and later as an experimental feature.
> You can check the [Gradle releases page](https://gradle.org/releases/) to see whether it has been promoted to stable.
>
{type="note"}

The Kotlin plugin supports [Gradle configuration cache](https://docs.gradle.org/current/userguide/configuration_cache.html),
which speeds up the build process by reusing the results of the configuration phase.

See the [Gradle documentation](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)
to learn how to enable the configuration cache. Once you enable the configuration cache feature, the Kotlin Gradle plugin will
start using it.

## Compiler options

To specify additional compilation options, use the `kotlinOptions` property of a Kotlin compilation task.

When targeting the JVM, the tasks are called `compileKotlin` for production code and `compileTestKotlin`
for test code. The tasks for custom source sets are called accordingly to the `compile<Name>Kotlin` pattern. 

The names of the tasks in Android Projects contain the [build variant](https://developer.android.com/studio/build/build-variants.html) names and follow the pattern `compile<BuildVariant>Kotlin`, for example, `compileDebugKotlin`, `compileReleaseUnitTestKotlin`.

When targeting JavaScript, the tasks are called `compileKotlinJs` and `compileTestKotlinJs` respectively, and `compile<Name>KotlinJs` for custom source sets.

To configure a single task, use its name. Examples:

<tabs>

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

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
// ...

val compileKotlin: KotlinCompile by tasks

compileKotlin.kotlinOptions.suppressWarnings = true
```

</tabs>

Note that with Gradle Kotlin DSL, you should get the task from the project's `tasks` first.

Use the types `Kotlin2JsCompile` and `KotlinCompileCommon` for the JS and Common targets, accordingly.

It is also possible to configure all Kotlin compilation tasks in the project:

<tabs>

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
    kotlinOptions { /*...*/ }
}
```

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    kotlinOptions { /*...*/ }
}
```

</tabs>

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
| `apiVersion` | Allow using declarations only from the specified version of bundled libraries | "1.3" (DEPRECATED), "1.4", "1.5", "1.6" (EXPERIMENTAL) |  |
| `languageVersion` | Provide source compatibility with the specified version of Kotlin | "1.3" (DEPRECATED), "1.4", "1.5", "1.6" (EXPERIMENTAL) |  |

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

### Attributes specific for JVM

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `javaParameters` | Generate metadata for Java 1.8 reflection on method parameters |  | false |
| `jdkHome` | Include a custom JDK from the specified location into the classpath instead of the default JAVA_HOME. Direct setting is deprecated sinсe 1.5.30, use [other ways to set this option](#setting-custom-jdk-home).  |  |  |
| `jvmTarget` | Target version of the generated JVM bytecode | "1.6" (DEPRECATED), "1.8", "9", "10", "11", "12", "13", "14", "15", "16" | "%defaultJvmTargetVersion%" |
| `noJdk` | Don't automatically include the Java runtime into the classpath |  | false |
| `useOldBackend` | Use the [old JVM backend](whatsnew15.md#stable-jvm-ir-backend) |  | false |

#### Check for JVM target compatibility

In the build module, you may have related compile tasks, for example:
* `compileKotlin` and `compileJava`
* `compileTestKotlin` and `compileTestJava`

> `main` and `test` source set compile tasks are not related.
>
{type="note"}

For such related tasks, the Kotlin Gradle plugin checks for JVM target compatibility. Different values of `jvmTarget` in the `kotlin` extension
and [`targetCompatibility`](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)
in the `java` extension cause incompatibility. For example:
the `compileKotlin` task has `jvmTarget=1.8`, and
the `compileJava` task has (or [inherits](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)) `targetCompatibility=15`.

Control the behavior of this check by setting the `kotlin.jvm.target.validation.mode` property in the `build.gradle` file equal to:
* `warning` – the default value; the Kotlin Gradle plugin will print a warning message.
* `error` – the plugin will fail the build.
* `ignore` – the plugin will skip the check and won't produce any messages.

#### Setting custom JDK home

> [Setting `jdkHome` option directly is deprecated](https://youtrack.jetbrains.com/issue/KT-46541).
>
{type="warning"}

You can set the JDK home in the following ways:
* For Gradle from 6.1 to 6.6 with the [`UsesKotlinJavaToolchain` interface and the Task DSL](#setting-jdk-version-with-the-task-dsl).
* For Gradle 6.7 and later with [Java toolchains](#gradle-java-toolchains-support) or [the Task DSL](#setting-jdk-version-with-the-task-dsl) to set a local JDK.

When you use a custom JDK, note that [kapt task workers](kapt.md#running-kapt-tasks-in-parallel)
use [process isolation mode](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode) only,
and ignore the `kapt.workers.isolation` property.

As before, if you don't set the toolchain or the `jdkHome` option, the Kotlin/JVM compilation uses the current user's JDK.

> By default, Kotlin compile tasks use the current Gradle JDK.
>
{type="note"}

#### Gradle Java toolchains support

Gradle 6.7 introduced ["Java toolchains support"](https://docs.gradle.org/current/userguide/toolchains.html).
Using this feature, you can:
* Use a JDK and a JRE that are different from the Gradle ones to run compilations, tests, and executables.
* Compile and test code with a not-yet-released language version.

With toolchains support, Gradle can autodetect local JDKs and install missing JDKs that Gradle requires for the build.
Now Gradle itself can run on any JDK and still reuse the [remote build cache feature](#gradle-build-cache-support)
for tasks that depend on a major JDK version.

The Kotlin Gradle plugin supports Java toolchains for Kotlin/JVM compilation tasks. JS and Native tasks don't use toolchains.
The Kotlin compiler always uses the JDK the Gradle daemon is running on.
A Java toolchain:
* Sets the [`jdkHome` option](#attributes-specific-for-jvm) available for JVM targets.
* Sets the [`kotlinOptions.jvmTarget`](#attributes-specific-for-jvm) to the toolchain's JDK version
  if the user doesn't set the `jvmTarget` option explicitly.
  If the user doesn't configure the toolchain, the `jvmTarget` field will use the default value.
  Learn more about [JVM target compatibility](#check-for-jvm-target-compatibility).
* Affects which JDK [`kapt` workers](kapt.md#running-kapt-tasks-in-parallel) are running on.

Use the following code to set a toolchain. Replace the placeholder `<MAJOR_JDK_VERSION>` with the JDK version you would like to use:

<tabs>

```groovy
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

```kotlin
kotlin { 
    toolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8" 
    }
}
```

</tabs>

Note that setting a toolchain via the `kotlin` extension will update the toolchain for Java compile tasks as well.

You can set a toolchain via the `java` extension, and Kotlin compilation tasks will use it:

<tabs>

```groovy
java {
    toolchain {
      languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

```kotlin
java {
    toolchain {
      languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8" 
    }
}
```

</tabs>

To set any JDK (even local) for the specific task, use the Task DSL.

#### Setting JDK version with the Task DSL

The Task DSL allows setting any JDK version for any task implementing the `UsesKotlinJavaToolchain` interface.
At the moment, these tasks are `KotlinCompile` and `KaptTask`.
If you want Gradle to search for the major JDK version, replace the <MAJOR_JDK_VERSION> placeholder in your build script:

<tabs>

```groovy
JavaToolchainService service = project.getExtensions().getByType(JavaToolchainService.class)
Provider<JavaLauncher> customLauncher = service.launcherFor {
    it.languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
}
project.tasks
    .matching { it instanceof UsesKotlinJavaToolchain && it.name == 'compileKotlin' }
    .configureEach {
        it.kotlinJavaToolchain.toolchain.use(customLauncher)
    }
```

```kotlin
val service = project.extensions.getByType<JavaToolchainService>()
val customLauncher = service.launcherFor {
    it.languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
}
project.tasks
    .matching { it is UsesKotlinJavaToolchain && it.name == "compileKotlin" }
    .configureEach {
        it.kotlinJavaToolchain.toolchain.use(customLauncher)
    }
```

</tabs>

Or you can specify the path to your local JDK and replace the placeholder `<LOCAL_JDK_VERSION>` with this JDK version:

<tabs>

```groovy
project.tasks
    .matching { it is UsesKotlinJavaToolchain && it.name == "compileKotlin" }
    .configureEach {
        it.kotlinJavaToolchain.jdk.use(
            '/path/to/your/jdk', // Put a path to your JDK
            JavaVersion.<JDK_VERSION> // For example, JavaVersion.17
        )
    }
```

```kotlin
project.tasks
    .matching { it is UsesKotlinJavaToolchain && it.name == "compileKotlin" }
    .configureEach {
        it.kotlinJavaToolchain.jdk.use(
            "/path/to/local/jdk", // Put a path to your JDK
            JavaVersion.<LOCAL_JDK_VERSION> // For example, JavaVersion.17
        )
    }
```

</tabs>

## Generating documentation

To generate documentation for Kotlin projects, use [Dokka](https://github.com/Kotlin/dokka);
please refer to the [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin)
for configuration instructions. Dokka supports mixed-language projects and can generate output in multiple
formats, including standard JavaDoc.

## OSGi

For OSGi support see the [Kotlin OSGi page](kotlin-osgi.md).

## Using Gradle Kotlin DSL

When using [Gradle Kotlin DSL](https://github.com/gradle/kotlin-dsl), apply the Kotlin plugins using the `plugins { ... }` block. 
If you apply them with `apply { plugin(...) }` instead, you may encounter unresolved references to the extensions generated 
by Gradle Kotlin DSL. To resolve that, you can comment out the erroneous usages, run the Gradle task `kotlinDslAccessorsSnapshot`, 
then uncomment the usages back and rerun the build or reimport the project into the IDE.

## Kotlin daemon and using it with Gradle

The Kotlin daemon:
* Runs along with the Gradle daemon to compile the project.
* Runs separately when you compile the project with an IntelliJ IDEA built-in build system.

The Kotlin daemon starts at the Gradle [execution stage](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases)
when one of Kotlin compile tasks starts compiling the sources.
The Kotlin daemon stops along with the Gradle daemon or after two idle hours with no Kotlin compilation.

The Kotlin daemon uses the same JDK that the Gradle daemon does.

### Setting Kotlin daemon's JVM arguments

Each of the options in the following list overrides the ones that came before it:
* If nothing is specified, the Kotlin daemon inherits arguments from the Gradle daemon.
  For example, in the `gradle.properties` file:

 ```properties
  org.gradle.jvmargs=-Xmx1500m -Xms=500m
  ```

* If the Gradle daemon's JVM arguments have the `kotlin.daemon.jvm.options` system property – use it in the `gradle.properties` file:

 ```properties
  org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
  ```

* You can add the`kotlin.daemon.jvmargs` property in the `gradle.properties` file:

 ```properties
  kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
  ```

* You can specify arguments in the `kotlin` extension:

  <tabs>

  ```groovy
  kotlin {
      kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseG1GC"]
  }
  ```

  ```kotlin
  kotlin {
      kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseG1GC")
  }
  ```

  </tabs>

* You can specify arguments for a specific task:
  
  <tabs>

  ```groovy
  tasks
      .matching { it.name == "compileKotlin" && it instanceof CompileUsingKotlinDaemon }
      .configureEach {
          kotlinDaemonJvmArguments.set(["-Xmx1g", "-Xms512m"])
      }
  ```

  ```kotlin
  tasks
      .matching { it.name == "compileKotlin" && it is CompileUsingKotlinDaemon }
      .configureEach { 
          (this as CompileUsingKotlinDaemon).kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseG1GC"))
      }
  ```

  </tabs>

  > In this case a new Kotlin daemon instance can start on task execution. Learn more about [Kotlin daemon's behavior with JVM arguments](#kotlin-daemon-s-behavior-with-jvm-arguments).
  >
  {type="note"}

#### Kotlin daemon's behavior with JVM arguments

When configuring the Kotlin daemon's JVM arguments, note that:

* It is expected to have multiple instances of the Kotlin daemon running at the same time when different subprojects or tasks have different sets of JVM arguments.
* A new Kotlin daemon instance starts only when Gradle runs a related compilation task and existing Kotlin daemons do not have the same set of JVM arguments.
  Imagine that your project has a lot of subprojects. Most of them require some heap memory for a Kotlin daemon, but one module requires a lot (though it is rarely compiled).
  In this case, you should provide a different set of JVM arguments for such a module, so a Kotlin daemon with a larger heap size would start only for developers who touch this specific module.
  > If you are already running a Kotlin daemon that has enough heap size to handle the compilation request,
  > even if other requested JVM arguments are different, this daemon will be reused instead of starting a new one.
  >
  {type="note"}
* If the `Xmx` is not specified, the Kotlin daemon will inherit it from the Gradle daemon.
