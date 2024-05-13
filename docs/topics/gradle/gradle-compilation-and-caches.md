[//]: # (title: Compilation and caches in the Kotlin Gradle plugin)

On this page, you can learn about the following topics:
* [Incremental compilation](#incremental-compilation)
* [Gradle build cache support](#gradle-build-cache-support)
* [Gradle configuration cache support](#gradle-configuration-cache-support)
* [The Kotlin daemon and how to use it with Gradle](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [Defining Kotlin compiler execution strategy](#defining-kotlin-compiler-execution-strategy)
* [Kotlin compiler fallback strategy](#kotlin-compiler-fallback-strategy)
* [Build reports](#build-reports)

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

The new approach to incremental compilation is available since Kotlin 1.7.0 for the JVM backend in the Gradle build system only. 
Starting from Kotlin 1.8.20, this is enabled by default. This approach supports changes made inside dependent non-Kotlin modules, 
includes an improved compilation avoidance, and is compatible with the [Gradle build cache](#gradle-build-cache-support).

All of these enhancements decrease the number of non-incremental builds, making the overall compilation time faster. 
You will receive the most benefit if you use the build cache, or, frequently make changes in non-Kotlin
Gradle modules.

To opt out from this new approach, set the following option in your `gradle.properties`:

```none
kotlin.incremental.useClasspathSnapshot=false
```

We would appreciate your feedback on this feature in [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682).

Learn how the new approach to incremental compilation is implemented under the hood in
[this blog post](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/).

### Precise backup of compilation tasks' outputs

> Precise backup of compilation tasks' outputs is [Experimental](components-stability.md#stability-levels-explained).
> We would appreciate your feedback on it in [YouTrack](https://kotl.in/issue/experimental-ic-optimizations).
>
{type="warning"}

Starting with Kotlin 1.8.20, you can enable precise backup, whereby only those classes that Kotlin recompiles in 
the incremental compilation are backed up. Both full and precise backups help to run builds incrementally again 
after compilation errors. A precise backup takes less build time compared to a full backup. 
A full backup may take **noticeably** more build time in large projects or if many tasks are creating backups, 
especially if a project is located on a slow HDD.

Enable this optimization by adding the `kotlin.compiler.preciseCompilationResultsBackup` Gradle property to 
the `gradle.properties` file:

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### Example of using precise backup at JetBrains {initial-collapse-state="collapsed"}

In the following charts, you can see examples of using precise backup compared to full backup:

<img src="comparison-of-full-and-precise-backups.png" alt="Comparison of full and precise backups" width="700"/>

The first and second charts show how using precise backup in a Kotlin project affects building the Kotlin Gradle plugin:

1. After making a small [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) change: adding a new public method to a module that lots of modules depend on.
2. After making a small non-ABI change: adding a private function to a module that no other modules depend on.
   
The third chart shows how precise backup in the [Space](https://www.jetbrains.com/space/) project affects building a web 
frontend after a small non-ABI change: adding a private function to a Kotlin/JS module that lots of modules depend on.

These measurements were performed on a computer with an Apple M1 Max CPU; different computers will yield slightly 
different results. The factors affecting performance include but are not limited to:

* How warm the [Kotlin daemon](#the-kotlin-daemon-and-how-to-use-it-with-gradle) 
  and the [Gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html) are.
* How fast or slow the disk is.
* The CPU model and how busy it is.
* Which modules are affected by the changes and how big these modules are.
* Whether the changes are ABI or non-ABI.

#### Evaluating optimizations with build reports {initial-collapse-state="collapsed"}

To estimate the impact of the optimization on your computer for your project and your scenarios, you can use 
[Kotlin build reports](#build-reports). Enable reports in text file format by adding the following property 
to your `gradle.properties` file:

```
kotlin.build.report.output=file
```

Here is an example of a relevant part of the report **before** enabling precise backup:

```
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.59 s
<...>
Time metrics:
 Total Gradle task time: 0.59 s
 Task action before worker execution: 0.24 s
  Backup output: 0.22 s // Pay attention to this number 
<...>
```

And here is an example of a relevant part of the report **after** enabling precise backup:

```
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.46 s
<...>
Time metrics:
 Total Gradle task time: 0.46 s
 Task action before worker execution: 0.07 s
  Backup output: 0.05 s // The time has reduced
 Run compilation in Gradle worker: 0.32 s
  Clear jar cache: 0.00 s
  Precise backup output: 0.00 s // Related to precise backup
  Cleaning up the backup stash: 0.00 s // Related to precise backup
<...>
```

## Gradle build cache support

The Kotlin plugin uses the [Gradle build cache](https://docs.gradle.org/current/userguide/build_cache.html), which stores
the build outputs for reuse in future builds.

To disable caching for all Kotlin tasks, set the system property `kotlin.caching.enabled` to `false`
(run the build with the argument `-Dkotlin.caching.enabled=false`).

## Gradle configuration cache support

The Kotlin plugin uses the [Gradle configuration cache](https://docs.gradle.org/current/userguide/configuration_cache.html),
which speeds up the build process by reusing the results of the configuration phase for subsequent builds.

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

```none
org.gradle.jvmargs=-Xmx1500m -Xms=500m
```

#### kotlin.daemon.jvm.options system property

If the Gradle daemon's JVM arguments have the `kotlin.daemon.jvm.options` system property – use it in the `gradle.properties` file:

```none
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

```none
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

## The new Kotlin compiler

The new Kotlin K2 compiler is in [Beta](components-stability.md#stability-levels-explained).
It has basic support for Kotlin JVM, Native, Wasm, and JS projects.

The new compiler aims to speed up the development of new language features, unify all of the platforms Kotlin supports,
bring performance improvements, and provide an API for compiler extensions.

The K2 compiler will become the default starting with Kotlin 2.0. To try it in your projects now and check the performance,
use the `kotlin.experimental.tryK2=true` Gradle property or run the following command:

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

This Gradle property automatically sets the default language version to 2.0 and updates the [build report](#build-reports)
with the number of Kotlin tasks compiled using the K2 compiler compared to the current compiler.

Learn more about the stabilization of the K2 compiler in our [Kotlin blog](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/)

## Defining Kotlin compiler execution strategy

_Kotlin compiler execution strategy_ defines where the Kotlin compiler is executed and if incremental compilation is supported in each case.

There are three compiler execution strategies:

| Strategy       | Where Kotlin compiler is executed          | Incremental compilation | Other characteristics and notes                                                                                                                                                                                                                                                |
|----------------|--------------------------------------------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Daemon         | Inside its own daemon process              | Yes                     | _The default and fastest strategy_. Can be shared between different Gradle daemons and multiple parallel compilations.                                                                                                                                                         |
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

```none
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
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
} 
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType(CompileUsingKotlinDaemon)
    .configureEach {
        compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
    }
```

</tab>
</tabs>

## Kotlin compiler fallback strategy

The Kotlin compiler's fallback strategy is to run a compilation outside a Kotlin daemon if the daemon somehow fails. 
If the Gradle daemon is on, the compiler uses the ["In process" strategy](#defining-kotlin-compiler-execution-strategy). 
If the Gradle daemon is off, the compiler uses the "Out of process" strategy.

When this fallback happens, you have the following warning lines in your Gradle's build output:

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

However, a silent fallback to another strategy can consume a lot of system resources or lead to non-deterministic builds. 
Read more about this in this [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy).
To avoid this, there is a Gradle property `kotlin.daemon.useFallbackStrategy`, whose default value is `true`. 
When the value is `false`, builds fail on problems with the daemon's startup or communication. Declare this property in
`gradle.properties`:

```none
kotlin.daemon.useFallbackStrategy=false
```

There is also a `useDaemonFallbackStrategy` property in Kotlin compile tasks, which takes priority over the Gradle property if you use both. 

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks {
    compileKotlin {
        useDaemonFallbackStrategy.set(false)
    }   
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlin").configure {
    useDaemonFallbackStrategy = false
}
```
</tab>
</tabs>

If there is insufficient memory to run the compilation, you can see a message about it in the logs.

## Build reports

Build reports contain the durations of different compilation phases and any reasons why compilation couldn't be incremental.
Use build reports to investigate performance issues when the compilation time is too long or when it differs for the same
project.

Kotlin build reports help you to investigate problems with build performance more efficiently than with [Gradle build scans](https://scans.gradle.com/)
that have a single Gradle task as the unit of granularity.

There are two common cases that analyzing build reports for long-running compilations can help you resolve:
* The build wasn't incremental. Analyze the reasons and fix underlying problems.
* The build was incremental but took too much time. Try reorganizing source files — split big files,
  save separate classes in different files, refactor large classes, declare top-level functions in different files, and so on.

Build reports also show the Kotlin version used in the project. In addition, starting with Kotlin 1.9.0,
you can see whether the current or the [K2 compiler](#the-new-kotlin-compiler) was used to compile the code in your [Gradle build scans](https://scans.gradle.com/).

Learn [how to read build reports](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_to_read_build_reports) 
and about [how JetBrains uses build reports](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_we_use_build_reports_in_jetbrains).

### Enabling build reports

To enable build reports, declare where to save the build report output in `gradle.properties`:

```none
kotlin.build.report.output=file
```

The following values and their combinations are available for the output:

| Option        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `file`        | Saves build reports in a human-readable format to a local file. By default, it's `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt`                                                                                                                                                                                                                                                                                                                                           |
| `single_file` | Saves build reports in a format of an object to a specified local file                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `build_scan`  | Saves build reports in the `custom values` section of the [build scan](https://scans.gradle.com/). Note that the Gradle Enterprise plugin limits the number of custom values and their length. In big projects, some values could be lost                                                                                                                                                                                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                               |
| `http`        | Posts build reports using HTTP(S). The POST method sends metrics in JSON format. You can see the current version of the sent data in the [Kotlin repository](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt). You can find samples of HTTP endpoints in [this blog post](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#enable_build_reports) |
| `json` | Saves build reports in JSON format to a local file. By default, it's `${project_name}-date-time-<sequence_number>.json`                                                                                                                                                                                                                                                                                                                                                       |

Here's a list of available options for `kotlin.build.report`:

```none
# Required outputs. Any combination is allowed
kotlin.build.report.output=file,single_file,http,build_scan,json

# Mandatory if single_file output is used. Where to put reports 
# Use instead of the deprecated `kotlin.internal.single.build.metrics.file` property
kotlin.build.report.single_file="my/directory/path"

# Mandatory if json output is used. Where to put reports 
kotlin.build.report.json.directory="my/directory/path"

# Optional. Output directory for file-based reports. Default: build/reports/kotlin-build/
kotlin.build.report.file.output_dir=kotlin-reports

# Optional. Label for marking your build report (for example, debug parameters)
kotlin.build.report.label=some_label
```

Options, applicable only to HTTP:

```none
# Mandatory. Where to post HTTP(S)-based reports
kotlin.build.report.http.url=http://127.0.0.1:8080

# Optional. User and password if the HTTP endpoint requires authentication
kotlin.build.report.http.user=someUser
kotlin.build.report.http.password=somePassword

# Optional. Add a Git branch name of a build to a build report
kotlin.build.report.http.include_git_branch.name=true|false

# Optional. Add compiler arguments to a build report
# If a project contains many modules, its compiler arguments in the report can be very heavy and not that helpful
kotlin.build.report.include_compiler_arguments=true|false
```

### Limit of custom values

To collect build scans' statistics, Kotlin build reports use [Gradle's custom values](https://docs.gradle.com/enterprise/tutorials/extending-build-scans/). 
Both you and different Gradle plugins can write data to custom values. The number of custom values has a limit.
See the current maximum custom value count in the [Build scan plugin docs](https://docs.gradle.com/enterprise/gradle-plugin/#adding_custom_values).

If you have a big project, a number of such custom values may be quite big. If this number exceeds the limit, 
you can see the following message in the logs:

```text
Maximum number of custom values (1,000) exceeded
```

To reduce the number of custom values the Kotlin plugin produces, you can use the following property in `gradle.properties`:

```none
kotlin.build.report.build_scan.custom_values_limit=500
```

### Switching off collecting project and system properties

HTTP build statistic logs can contain some project and system properties. These properties can change builds' behavior, 
so it's useful to log them in build statistics. 
These properties can store sensitive data, for example, passwords or a project's full path.

You can disable collection of these statistics by adding the `kotlin.build.report.http.verbose_environment` property to
your `gradle.properties`.

> JetBrains doesn't collect these statistics. You choose a place [where to store your reports](#enabling-build-reports).
> 
{type="note"}

## What's next?

Learn more about:
* [Gradle basics and specifics](https://docs.gradle.org/current/userguide/userguide.html).
* [Support for Gradle plugin variants](gradle-plugin-variants.md).