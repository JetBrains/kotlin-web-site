[//]: # (title: Compilation and caches in the Kotlin Gradle plugin)

On this page, you can learn about the following topics:
* [Incremental compilation](#incremental-compilation)
* [Gradle build cache support](#gradle-build-cache-support)
* [Gradle configuration cache support](#gradle-configuration-cache-support)
* [Build reports](#build-reports)
* [The Kotlin daemon and how to use it with Gradle](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [Defining Kotlin compiler execution strategy](#defining-kotlin-compiler-execution-strategy)

## Incremental compilation

The Kotlin Gradle plugin supports incremental compilation. Incremental compilation tracks changes to source files between
builds so that only the files affected by these changes are compiled.

Incremental compilation is supported for Kotlin/JVM and Kotlin/JS projects, and is enabled by default.

There are several ways to disable incremental compilation:

* Set `kotlin.incremental=false` for Kotlin/JVM.
* Set `kotlin.incremental.js=false` for Kotlin/JS projects.
* Use `-Pkotlin.incremental=false` or `-Pkotlin.incremental.js=false` as a command line parameter.

  The parameter should be added to each subsequent build.

Note: Any build with incremental compilation disabled invalidates incremental caches. The first build is never incremental.

> Sometimes problems with incremental compilation become visible several rounds after the failure occurs. Use [build reports](#build-reports)
> to track the history of changes and compilations. This can help you to provide reproducible bug reports.
>
{type="tip"}

### A new approach to incremental compilation

> The new approach to incremental compilation is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see the details below). We encourage you to use it only for evaluation purposes, and we would
> appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issues/KT).
>
{type="warning"}

The new approach to incremental compilation is available since Kotlin 1.7.0 for the JVM backend in the Gradle build system only. 
This approach supports changes made inside dependent non-Kotlin modules, includes an improved
compilation avoidance, and is compatible with the [Gradle build cache](#gradle-build-cache-support).

All of these enhancements decrease the number of non-incremental builds, making the overall compilation time faster. 
You will receive the most benefit if you use the build cache, or, frequently make changes in non-Kotlin
Gradle modules.

To enable this new approach, set the following option in your `gradle.properties`:

```properties
kotlin.incremental.useClasspathSnapshot=true
```

Learn how the new approach to incremental compilation is implemented under the hood in
[this blog post](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/).

## Gradle build cache support

The Kotlin plugin uses the [Gradle build cache](https://docs.gradle.org/current/userguide/build_cache.html), which stores
the build outputs for reuse in future builds.

To disable caching for all Kotlin tasks, set the system property flag `kotlin.caching.enabled` to `false`
(run the build with the argument `-Dkotlin.caching.enabled=false`).

If you use [kapt](kapt.md), note that kapt annotation processing tasks are not cached by default. However, you can
[enable caching for them manually](kapt.md#gradle-build-cache-support).

## Gradle configuration cache support

> Gradle configuration cache support has some constraints:
> * The configuration cache is available in Gradle 6.5 and later as an experimental feature.  
    >   You can check the [Gradle releases page](https://gradle.org/releases/) to see whether it has been promoted to stable.
> * The feature is supported only by the following Gradle plugins:
    >   * `org.jetbrains.kotlin.jvm`
>   * `org.jetbrains.kotlin.js`
>   * `org.jetbrains.kotlin.android`
>
{type="note"}

The Kotlin plugin uses the [Gradle configuration cache](https://docs.gradle.org/current/userguide/configuration_cache.html),
which speeds up the build process by reusing the results of the configuration phase.

See the [Gradle documentation](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)
to learn how to enable the configuration cache. After you enable this feature, the Kotlin Gradle plugin automatically
starts using it.

## The Kotlin daemon and how to use it with Gradle

The Kotlin daemon:
* Runs with the Gradle daemon to compile the project.
* Runs separately from the Gradle daemon when you compile the project with an IntelliJ IDEA built-in build system.

The Kotlin daemon starts at the Gradle [execution stage](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases)
when one of the Kotlin compile tasks starts to compile sources.
The Kotlin daemon stops either with the Gradle daemon or after two idle hours with no Kotlin compilation.

The Kotlin daemon uses the same JDK that the Gradle daemon does.

### Setting Kotlin daemon's JVM arguments

Each of the following ways to set arguments overrides the ones that came before it:
* [Gradle daemon arguments inheritance](#gradle-daemon-arguments-inheritance)
* [`kotlin.daemon.jvm.options` system property](#kotlin-daemon-jvm-options-system-property)
* [`kotlin.daemon.jvmargs` property](#kotlin-daemon-jvmargs-property)
* [`kotlin` extension](#kotlin-extension)
* [Specific task definition](#specific-task-definition)

#### Gradle daemon arguments inheritance

If nothing is specified, the Kotlin daemon inherits arguments from the Gradle daemon. For example, in the `gradle.properties` file:

```properties
org.gradle.jvmargs=-Xmx1500m -Xms=500m
```

#### kotlin.daemon.jvm.options system property

If the Gradle daemon's JVM arguments have the `kotlin.daemon.jvm.options` system property – use it in the `gradle.properties` file:

```properties
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m,Xms=500m
```

When passing arguments, follow these rules:
* Use the minus sign `-` **only** before the arguments `Xmx`, `XX:MaxMetaspaceSize`, and `XX:ReservedCodeCacheSize`.
* Separate arguments with commas (`,`) _without_ spaces. Arguments that come after a space will be used for the Gradle daemon, not for the Kotlin daemon.

> Gradle ignores these properties if all the following conditions are satisfied:
> * Gradle is using JDK 1.9 or higher.
> * The version of Gradle is between 7.0 and 7.1.1 inclusively.
> * Gradle is compiling Kotlin DSL scripts.
> * The Kotlin daemon isn't running.
>
> To overcome this, upgrade Gradle to the version 7.2 (or higher) or use the `kotlin.daemon.jvmargs` property – see the following section.
>
{type="warning"}

#### kotlin.daemon.jvmargs property

You can add the `kotlin.daemon.jvmargs` property in the `gradle.properties` file:

```properties
kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
```

#### kotlin extension

You can specify arguments in the `kotlin` extension:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
}
```

</tab>
</tabs>

#### Specific task definition

You can specify arguments for a specific task:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(CompileUsingKotlinDaemon::class).configureEach { task ->
    task.kotlinDaemonJvmArguments.set(["-Xmx1g", "-Xms512m"])
}
```

</tab>
</tabs>

> In this case a new Kotlin daemon instance can start on task execution. Learn more about [Kotlin daemon's behavior with JVM arguments](#kotlin-daemon-s-behavior-with-jvm-arguments).
>
{type="note"}

### Kotlin daemon's behavior with JVM arguments

When configuring the Kotlin daemon's JVM arguments, note that:

* It is expected to have multiple instances of the Kotlin daemon running at the same time when different subprojects or tasks have different sets of JVM arguments.
* A new Kotlin daemon instance starts only when Gradle runs a related compilation task and existing Kotlin daemons do not have the same set of JVM arguments.
  Imagine that your project has a lot of subprojects. Most of them require some heap memory for a Kotlin daemon, but one module requires a lot (though it is rarely compiled).
  In this case, you should provide a different set of JVM arguments for such a module, so a Kotlin daemon with a larger heap size would start only for developers who touch this specific module.
  > If you are already running a Kotlin daemon that has enough heap size to handle the compilation request,
  > even if other requested JVM arguments are different, this daemon will be reused instead of starting a new one.
  >
  {type="note"}
* If the `Xmx` argument is not specified, the Kotlin daemon will inherit it from the Gradle daemon.

## Defining Kotlin compiler execution strategy

_Kotlin compiler execution strategy_ defines where the Kotlin compiler is executed and if incremental compilation is supported in each case.

There are three compiler execution strategies:

| Strategy       | Where Kotlin compiler is executed          | Incremental compilation | Other characteristics and notes                                                                                                                                                                                                                                                |
|----------------|--------------------------------------------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Daemon         | Inside its own daemon process              | Yes                     | *The default and fastest strategy*. Can be shared between different Gradle daemons and multiple parallel compilations.                                                                                                                                                     |
| In process     | Inside the Gradle daemon process           | No                      | May share the heap with the Gradle daemon. The "In process" execution strategy is _slower_ than the "Daemon" execution strategy. Each [worker](https://docs.gradle.org/current/userguide/worker_api.html) creates a separate Kotlin compiler classloader for each compilation. |
| Out of process | In a separate process for each compilation | No                      | The slowest execution strategy. Similar to the "In process", but additionally creates a separate Java process within a Gradle worker for each compilation.                                                                                                                     |

To define a Kotlin compiler execution strategy, you can use one of the following properties:
* The `kotlin.compiler.execution.strategy` Gradle property.
* The `compilerExecutionStrategy` compile task property.

The task property `compilerExecutionStrategy` takes priority over the Gradle property `kotlin.compiler.execution.strategy`.

The available values for the `kotlin.compiler.execution.strategy` property are:
1. `daemon` (default)
2. `in-process`
3. `out-of-process`

Use the Gradle property `kotlin.compiler.execution.strategy` in `gradle.properties`:

```properties
kotlin.compiler.execution.strategy=out-of-process
```

The available values for the `compilerExecutionStrategy` task property are:
1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (default)
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

Use the task property `compilerExecutionStrategy` in your build scripts:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<KotlinCompile>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
} 
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType(KotlinCompile)
    .configureEach {
        compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
    }
```

</tab>
</tabs>

## Build reports

> Build reports are [Experimental](components-stability.md). They may be dropped or changed at any time.
> Opt-in is required (see details below). Use them only for evaluation purposes. We appreciate your feedback on them
> in [YouTrack](https://youtrack.jetbrains.com/issues/KT).
>
{type="warning"}

Build reports for tracking compiler performance are available for Kotlin 1.7.0. Reports contain the durations of different
compilation phases and reasons why compilation couldn't be incremental.

Use build reports to investigate performance issues, when the compilation time is too long or when it differs for the same
project.

To enable build reports, declare where to save the build report output in `gradle.properties`:

```properties
kotlin.build.report.output=file
```

The following values and their combinations are available for the output:

| Option       | Description                                                                                                                                                                                                                                                                                                                                     |
|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `file`       | Saves build reports in a local file.                                                                                                                                                                                                                                                                                                             |
| `build_scan` | Saves build reports in the `custom values` section of the [build scan](https://scans.gradle.com/). Note that the Gradle Enterprise plugin limits the number of custom values and their length. In big projects, some values could be lost.                                                                                                       |                                                                                                                                                                                                                                                                                                                                                                                               |
| `http`       | Posts build reports using HTTP(S). The POST method sends metrics in the JSON format. You can see the current version of the sent data in the [Kotlin repository](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/statistics/CompileStatisticsData.kt). |

Here's the full list of available options for `kotlin.build.report`:

```properties
# Required outputs. Any combination is allowed.
kotlin.build.report.output=file,http,build_scan

# Optional. Output directory for file-based reports. Default: build/reports/kotlin-build/
kotlin.build.report.file.output_dir=kotlin-reports

# Mandatory if HTTP output is used. Where to post HTTP(S)-based reports
kotlin.build.report.http.url=http://127.0.0.1:8080

# Optional. User and password if the HTTP endpoint requires authentication
kotlin.build.report.http.user=someUser
kotlin.build.report.http.password=somePassword

# Optional. Label for marking your build report (e.g. debug parameters)
kotlin.build.report.label=some_label
```

## What's next?

Learn more about [Gradle basics and specifics](https://docs.gradle.org/current/userguide/getting_started.html).