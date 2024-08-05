[//]: # (title: Configure a Gradle project)

To build a Kotlin project with [Gradle](https://docs.gradle.org/current/userguide/userguide.html), 
you need to [add the Kotlin Gradle plugin](#apply-the-plugin) to your build script file `build.gradle(.kts)` 
and [configure the project's dependencies](#configure-dependencies) there.

> To learn more about the contents of a build script,
> visit the [Explore the build script](get-started-with-jvm-gradle-project.md#explore-the-build-script) section.
>
{type="note"}

## Apply the plugin

To apply the Kotlin Gradle plugin, use the [`plugins{}` block](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)
from the Gradle plugins DSL:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    kotlin("<...>") version "%kotlinVersion%"
    // For example, if your target environment is JVM:
    // kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    id 'org.jetbrains.kotlin.<...>' version '%kotlinVersion%'
    // For example, if your target environment is JVM: 
    // id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}
```

</tab>
</tabs>

> The Kotlin Gradle plugin (KGP) and Kotlin share the same version numbering.
>
{type="note"}

When configuring your project, check the Kotlin Gradle plugin (KGP) compatibility with available Gradle versions. 
In the following table, there are the minimum and maximum **fully supported** versions of Gradle and Android Gradle plugin (AGP):

| KGP version   | Gradle min and max versions           | AGP min and max versions                            |
|---------------|---------------------------------------|-----------------------------------------------------|
| 2.0.20        | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% |
| 2.0.0         | 6.8.3–8.5                             | 7.1.3–8.3.1                                         |
| 1.9.20–1.9.25 | 6.8.3–8.1.1                           | 4.2.2–8.1.0                                         |
| 1.9.0–1.9.10  | 6.8.3–7.6.0                           | 4.2.2–7.4.0                                         |
| 1.8.20–1.8.22 | 6.8.3–7.6.0                           | 4.1.3–7.4.0                                         |      
| 1.8.0–1.8.11  | 6.8.3–7.3.3                           | 4.1.3–7.2.1                                         |   
| 1.7.20–1.7.22 | 6.7.1–7.1.1                           | 3.6.4–7.0.4                                         |
| 1.7.0–1.7.10  | 6.7.1–7.0.2                           | 3.4.3–7.0.2                                         |
| 1.6.20–1.6.21 | 6.1.1–7.0.2                           | 3.4.3–7.0.2                                         |

> You can also use Gradle and AGP versions up to the latest releases, but if you do, keep in mind that you might encounter 
> deprecation warnings or some new features might not work.
>
{type="note"}

For example, the Kotlin Gradle plugin and the `kotlin-multiplatform` plugin %kotlinVersion% require the minimum Gradle
version of %minGradleVersion% for your project to compile.

Similarly, the maximum fully supported version is %maxGradleVersion%. It doesn't have deprecated Gradle
methods and properties, and supports all the current Gradle features.

### Kotlin Gradle plugin data in a project

By default, the Kotlin Gradle plugin stores persistent project-specific data at the root of the project,
in the `.kotlin` directory.

> You may want to add the `.kotlin` directory to your project's `.gitignore` file.
>
{type="warning"}

There are properties you can add to the `gradle.properties` file of your project to configure this behavior:

| Gradle property                                     | Description                                                                                                                                       |
|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | Configures the location where your project-level data is stored. Default: `<project-root-directory>/.kotlin`                                      |
| `kotlin.project.persistent.dir.gradle.disableWrite` | Controls whether writing Kotlin data to the `.gradle` directory is disabled (for backward compatibility with older IDEA versions). Default: false |

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

### Kotlin and Java sources

Kotlin sources and Java sources can be stored in the same directory, or they can be placed in different directories.

The default convention is to use different directories:

```text
project
    - src
        - main (root)
            - kotlin
            - java
```

> Do not store Java `.java` files in the `src/*/kotlin` directory, as the `.java` files will not be compiled.
> 
> Instead, you can use `src/main/java`.
>
{type="warning"} 

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

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### Check for JVM target compatibility of related compile tasks

In the build module, you may have related compile tasks, for example:
* `compileKotlin` and `compileJava`
* `compileTestKotlin` and `compileTestJava`

> `main` and `test` source set compile tasks are not related.
>
{type="note"}

For related tasks like these, the Kotlin Gradle plugin checks for JVM target compatibility. Different values of 
the [`jvmTarget` attribute](gradle-compiler-options.md#attributes-specific-to-jvm) in the `kotlin` extension or task 
and [`targetCompatibility`](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)
in the `java` extension or task cause JVM target incompatibility. For example:
the `compileKotlin` task has `jvmTarget=1.8`, and
the `compileJava` task has (or [inherits](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)) `targetCompatibility=15`.

Configure the behavior of this check for the whole project by setting the `kotlin.jvm.target.validation.mode` property in the `build.gradle(.kts)`
file to:

* `error` – the plugin fails the build; the default value for projects on Gradle 8.0+.
* `warning` – the plugin prints a warning message; the default value for projects on Gradle less than 8.0.
* `ignore` – the plugin skips the check and doesn't produce any messages.

You can also configure it at task level in your `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>().configureEach {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile.class).configureEach {
    jvmTargetValidationMode = org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING
}
```

</tab>
</tabs>

To avoid JVM target incompatibility, [configure a toolchain](#gradle-java-toolchains-support) or align JVM versions manually.

#### What can go wrong if targets are incompatible {initial-collapse-state="collapsed"}

There are two ways of manually setting JVM targets for Kotlin and Java source sets:
* The implicit way via [setting up a Java toolchain](#gradle-java-toolchains-support).
* The explicit way via setting the `jvmTarget` attribute in the `kotlin` extension or task and `targetCompatibility` 
  in the `java` extension or task.

JVM target incompatibility occurs if you:
* Explicitly set different values of `jvmTarget` and `targetCompatibility`.
* Have a default configuration, and your JDK is not equal to `1.8`.

Let's consider a default configuration of JVM targets when you have only the Kotlin JVM plugin in your build script and 
no additional settings for JVM targets:

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

When there is no explicit information about the `jvmTarget` value in the build script, its default value is `null`, 
and the compiler translates it to the default value `1.8`. The `targetCompatibility` equals 
the current Gradle's JDK version, which is equal to your JDK version (unless you use 
a [Java toolchain approach](gradle-configure-project.md#gradle-java-toolchains-support)). Assuming that your JDK version is 
`%jvmLTSVersionSupportedByKotlin%`, your published library artifact will [declare itself compatible](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html) 
with JDK %jvmLTSVersionSupportedByKotlin%+: `org.gradle.jvm.version=%jvmLTSVersionSupportedByKotlin%`, which is wrong. 
In this case, you have to use Java %jvmLTSVersionSupportedByKotlin% in your main project to add this library, even though the bytecode's 
version is `1.8`. [Configure a toolchain](gradle-configure-project.md#gradle-java-toolchains-support) 
to solve this issue.

### Gradle Java toolchains support

> A warning for Android users. To use Gradle toolchain support, use the Android Gradle plugin (AGP) version 8.1.0-alpha09 or higher. 
> 
> Gradle Java toolchain support [is available](https://issuetracker.google.com/issues/194113162) only from AGP 7.4.0.
> Nevertheless, because of [this issue](https://issuetracker.google.com/issues/260059413), AGP did not set `targetCompatibility` 
> to be equal to the toolchain's JDK until the version 8.1.0-alpha09.
> If you use versions less than 8.1.0-alpha09, you need to configure `targetCompatibility` manually via `compileOptions`. 
> Replace the placeholder `<MAJOR_JDK_VERSION>` with the JDK version you would like to use:
>
> ```kotlin
> android {
>     compileOptions {
>         sourceCompatibility = <MAJOR_JDK_VERSION>
>         targetCompatibility = <MAJOR_JDK_VERSION>
>     }
> }
> ```
>
{type="warning"} 

Gradle 6.7 introduced [Java toolchains support](https://docs.gradle.org/current/userguide/toolchains.html).
Using this feature, you can:
* Use a JDK and a JRE that are different from the ones in Gradle to run compilations, tests, and executables.
* Compile and test code with a not-yet-released language version.

With toolchains support, Gradle can autodetect local JDKs and install missing JDKs that Gradle requires for the build.
Now Gradle itself can run on any JDK and still reuse the [remote build cache feature](gradle-compilation-and-caches.md#gradle-build-cache-support)
for tasks that depend on a major JDK version.

The Kotlin Gradle plugin supports Java toolchains for Kotlin/JVM compilation tasks. JS and Native tasks don't use toolchains.
The Kotlin compiler always runs on the JDK the Gradle daemon is running on.
A Java toolchain:
* Sets the [`-jdk-home` option](compiler-reference.md#jdk-home-path) available for JVM targets.
* Sets the [`compilerOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm) to the toolchain's JDK version
  if the user doesn't set the `jvmTarget` option explicitly.
  If the user doesn't configure the toolchain, the `jvmTarget` field uses the default value.
  Learn more about [JVM target compatibility](#check-for-jvm-target-compatibility-of-related-compile-tasks).
* Sets the toolchain to be used by any Java compile, test and javadoc tasks.
* Affects which JDK [`kapt` workers](kapt.md#run-kapt-tasks-in-parallel) are running on.

Use the following code to set a toolchain. Replace the placeholder `<MAJOR_JDK_VERSION>` with the JDK version you would like to use:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
    }
    // Or shorter:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // For example:
    jvmToolchain(%jvmLTSVersionSupportedByKotlin%)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvmToolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
    // Or shorter:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // For example:
    jvmToolchain(%jvmLTSVersionSupportedByKotlin%)
}
```

</tab>
</tabs>

Note that setting a toolchain via the `kotlin` extension updates the toolchain for Java compile tasks as well.

You can set a toolchain via the `java` extension, and Kotlin compilation tasks will use it:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) 
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

</tab>
</tabs>

If you use Gradle 8.0.2 or higher, you also need to add a [toolchain resolver plugin](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories). 
This type of plugin manages which repositories to download a toolchain from. As an example, add to your `settings.gradle(.kts)` the following plugin:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version("%foojayResolver%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.gradle.toolchains.foojay-resolver-convention' version '%foojayResolver%'
}
```

</tab>
</tabs>

Check that the version of `foojay-resolver-convention` corresponds to your Gradle version on the [Gradle site](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories).

> To understand which toolchain Gradle uses, run your Gradle build with the [log level `--info`](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)
> and find a string in the output starting with `[KOTLIN] Kotlin compilation 'jdkHome' argument:`.
> The part after the colon will be the JDK version from the toolchain.
>
{type="note"}

To set any JDK (even local) for a specific task, use the [Task DSL](#set-jdk-version-with-the-task-dsl).

Learn more about [Gradle JVM toolchain support in the Kotlin plugin](https://blog.jetbrains.com/kotlin/2021/11/gradle-jvm-toolchain-support-in-the-kotlin-plugin/).

### Set JDK version with the Task DSL

The Task DSL allows setting any JDK version for any task implementing the `UsesKotlinJavaToolchain` interface.
At the moment, these tasks are `KotlinCompile` and `KaptTask`.
If you want Gradle to search for the major JDK version, replace the `<MAJOR_JDK_VERSION>` placeholder in your build script:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val service = project.extensions.getByType<JavaToolchainService>()
val customLauncher = service.launcherFor {
    languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
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
    it.languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
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

### Configure with Java Modules (JPMS) enabled

To make the Kotlin Gradle plugin work with [Java Modules](https://www.oracle.com/corporate/features/understanding-java-9-modules.html), 
add the following lines to your build script and replace `YOUR_MODULE_NAME` with a reference to your JPMS module, for example, 
`org.company.module`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">
        
```kotlin
// Add the following three lines if you use a Gradle version less than 7.0
java {
    modularity.inferModulePath.set(true)
}

tasks.named("compileJava", JavaCompile::class.java) {
    options.compilerArgumentProviders.add(CommandLineArgumentProvider {
        // Provide compiled Kotlin classes to javac – needed for Java/Kotlin mixed sources to work
        listOf("--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}")
    })
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// Add the following three lines if you use a Gradle version less than 7.0
java {
    modularity.inferModulePath = true
}

tasks.named("compileJava", JavaCompile.class) {
    options.compilerArgumentProviders.add(new CommandLineArgumentProvider() {
        @Override
        Iterable<String> asArguments() {
            // Provide compiled Kotlin classes to javac – needed for Java/Kotlin mixed sources to work
            return ["--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}"]
        }
    })
}
```

</tab>
</tabs>

> Put `module-info.java` into the `src/main/java` directory as usual.
> 
> For a module, a package name in Kotlin files should be equal to the package name from `module-info.java` to avoid a 
> "package is empty or does not exist" build failure. 
>
{type="note"}

Learn more about:
* [Building modules for the Java Module System](https://docs.gradle.org/current/userguide/java_library_plugin.html#sec:java_library_modular)
* [Building applications using the Java Module System](https://docs.gradle.org/current/userguide/application_plugin.html#sec:application_modular)
* [What "module" means in Kotlin](visibility-modifiers.md#modules)

### Other details

Learn more about [Kotlin/JVM](jvm-get-started.md).

#### Lazy Kotlin/JVM task creation

Starting from Kotlin 1.8.20, the Kotlin Gradle plugin registers all tasks and doesn't configure them on a dry run.

#### Non-default location of compile tasks' destinationDirectory

If you override the Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` task's `destinationDirectory` location, 
update your build script. You need to explicitly add `sourceSets.main.kotlin.classesDirectories` to `sourceSets.main.outputs` 
in your JAR file:

```kotlin
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

## Targeting multiple platforms

Projects targeting [multiple platforms](multiplatform-dsl-reference.md#targets), called [multiplatform projects](multiplatform-get-started.md),
require the `kotlin-multiplatform` plugin.

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

Learn more about [Kotlin Multiplatform for different platforms](multiplatform-get-started.md) and 
[Kotlin Multiplatform for iOS and Android](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html).

## Targeting Android

It's recommended to use Android Studio for creating Android applications. [Learn how to use the Android Gradle plugin](https://developer.android.com/studio/releases/gradle-plugin).

## Targeting JavaScript

When targeting JavaScript, use the `kotlin-multiplatform` plugin as well. [Learn more about setting up a Kotlin/JS project](js-project-setup.md)

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

### Kotlin and Java sources for JavaScript

This plugin only works for Kotlin files, so it is recommended that you keep Kotlin and Java files separate (if the
project contains Java files). If you don't store them separately, specify the source folder in the `sourceSets{}` block:

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

## Triggering configuration actions with the KotlinBasePlugin interface

To trigger some configuration action whenever any Kotlin Gradle plugin (JVM, JS, Multiplatform, Native, and others) is applied,
use the `KotlinBasePlugin` interface that all Kotlin plugins inherit from:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType<KotlinBasePlugin>() {
    // Configure your action here
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType(KotlinBasePlugin.class) {
    // Configure your action here
}
```

</tab>
</tabs>

## Configure dependencies

To add a dependency on a library, set the dependency of the required [type](#dependency-types) (for example, `implementation`) in the
`dependencies{}` block of the source sets DSL.

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
the `compilerOptions.jvmTarget` [compiler option](gradle-compiler-options.md) of your Gradle build script.

If you declare a standard library dependency explicitly (for example, if you need a different version), the Kotlin Gradle
plugin won't override it or add a second standard library.

If you don't need a standard library at all, you can add the following Gradle property to your `gradle.properties` file:

```none
kotlin.stdlib.default.dependency=false
```

#### Versions alignment of transitive dependencies

From Kotlin standard library version 1.9.20, Gradle uses metadata included in the standard library to automatically
align transitive `kotlin-stdlib-jdk7` and `kotlin-stdlib-jdk8` dependencies.

If you add a dependency for any Kotlin standard library version between 1.8.0 – 1.9.10, for example: 
`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`, then the Kotlin Gradle Plugin uses this Kotlin version 
for transitive `kotlin-stdlib-jdk7` and `kotlin-stdlib-jdk8` dependencies. This avoids class duplication from 
different standard library versions. [Learn more about merging `kotlin-stdlib-jdk7` and `kotlin-stdlib-jdk8` into `kotlin-stdlib`](whatsnew18.md#updated-jvm-compilation-target). 
You can disable this behavior with the `kotlin.stdlib.jdk.variants.version.alignment` Gradle property in your `gradle.properties`
file:

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

##### Other ways to align versions {initial-collapse-state="collapsed"}

* If you have issues with version alignment, you can align all versions via the Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import). 
  Declare a platform dependency on `kotlin-bom` in your build script:

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  implementation(platform("org.jetbrains.kotlin:kotlin-bom:%kotlinVersion%"))
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  implementation platform('org.jetbrains.kotlin:kotlin-bom:%kotlinVersion%')
  ```

  </tab>
  </tabs>

* If you don't add a dependency for a standard library version, but you have two different dependencies that transitively
  bring different old versions of the Kotlin standard library, then you can explicitly require `%kotlinVersion%`
  versions of these transitive libraries:

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  dependencies {
      constraints {
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk7") {
              version {
                  require("%kotlinVersion%")
              }
          }
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk8") {
              version {
                  require("%kotlinVersion%")
              }
          }
      }
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  dependencies {
      constraints {
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk7") {
              version {
                  require("%kotlinVersion%")
              }
          }
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk8") {
              version {
                  require("%kotlinVersion%")
              }
          }
      }
  }
  ```

  </tab>
  </tabs>
  
* If you add a dependency for Kotlin standard library version `%kotlinVersion%`: `implementation("org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%")`,
  and an old version (earlier than `1.8.0`) of the Kotlin Gradle plugin, update the Kotlin Gradle plugin to match the standard
  library version:

  
  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  plugins {
      // replace `<...>` with the plugin name
      kotlin("<...>") version "%kotlinVersion%"
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  plugins {
      // replace `<...>` with the plugin name
      id "org.jetbrains.kotlin.<...>" version "%kotlinVersion%"
  }
  ```

  </tab>
  </tabs>

* If you use versions prior to `1.8.0` of `kotlin-stdlib-jdk7`/`kotlin-stdlib-jdk8`, for example, 
  `implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk7:SOME_OLD_KOTLIN_VERSION")`, and a dependency that 
  transitively brings `kotlin-stdlib:1.8+`, [replace your `kotlin-stdlib-jdk<7/8>:SOME_OLD_KOTLIN_VERSION` with 
  `kotlin-stdlib-jdk*:%kotlinVersion%`](whatsnew18.md#updated-jvm-compilation-target) or [exclude](https://docs.gradle.org/current/userguide/dependency_downgrade_and_exclude.html#sec:excluding-transitive-deps) 
  the transitive `kotlin-stdlib:1.8+` from the library that brings it:

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  dependencies {
      implementation("com.example:lib:1.0") {
          exclude(group = "org.jetbrains.kotlin", module = "kotlin-stdlib")
      }
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  dependencies {
      implementation("com.example:lib:1.0") {
          exclude group: "org.jetbrains.kotlin", module: "kotlin-stdlib"
      }
  }
  ```

  </tab>
  </tabs>

### Set dependencies on test libraries

The [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API is available for testing Kotlin projects on
all supported platforms.
Add the `kotlin-test` dependency to the `commonTest` source set, so that the Gradle plugin can infer the corresponding
test dependencies for each test source set.

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

#### JVM variants of kotlin-test

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

Automatic JVM variant resolution can sometimes cause problems for your configuration. In that case, you can specify
the necessary framework explicitly and disable the automatic resolution by adding this line to the project `gradle.properties` file:

```text
kotlin.test.infer.jvm.variant=false
```

If you have used a variant of `kotlin("test")` in your build script explicitly and your project build stopped working with
a compatibility conflict,
see [this issue in the Compatibility Guide](compatibility-guide-15.md#do-not-mix-several-jvm-variants-of-kotlin-test-in-a-single-project).

### Set a dependency on a kotlinx library

If you use a [`kotlinx` library](https://github.com/Kotlin/kotlinx.coroutines) and need a platform-specific dependency, 
you can use platform-specific variants of libraries with suffixes such as `-jvm` or `-js`, for example, 
`kotlinx-coroutines-core-jvm`. You can also use the library's base artifact name instead – `kotlinx-coroutines-core`.

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

## Declare repositories

You can declare a publicly-available repository to use its open source dependencies. In the `repositories{}` block, set 
the name of the repository:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}
```
</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}
```
</tab>
</tabs>

Popular repositories are [Maven Central](https://central.sonatype.com/) and [Google's Maven repository](https://maven.google.com/web/index.html).

> If you also work with Maven projects, we recommend avoiding adding `mavenLocal()` as a repository because you
> may experience problems when switching between Gradle and Maven projects. If you must add the `mavenLocal()` repository,
> add it as the last repository in your `repositories{}` block. For more information, see
> [The case for mavenLocal()](https://docs.gradle.org/current/userguide/declaring_repositories.html#sec:case-for-maven-local).
> 
{type="warning"}

If you need to declare the same repositories in more than one subproject, declare the repositories centrally in the
`dependencyResolutionManagement{}` block in your `settings.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
}
```
</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
}
```
</tab>
</tabs>

Any declared repositories in subprojects override repositories declared centrally. For more information on how to control
this behavior and what options are available, see [Gradle's documentation](https://docs.gradle.org/current/userguide/declaring_repositories.html#sub:centralized-repository-declaration).

## What's next?

Learn more about:
* [Compiler options and how to pass them](gradle-compiler-options.md).
* [Incremental compilation, caches support, build reports, and the Kotlin daemon](gradle-compilation-and-caches.md).
* [Gradle basics and specifics](https://docs.gradle.org/current/userguide/userguide.html).
* [Support for Gradle plugin variants](gradle-plugin-variants.md).
