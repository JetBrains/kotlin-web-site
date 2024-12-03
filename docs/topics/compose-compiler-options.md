[//]: # (title: Compose compiler options DSL)

The Compose compiler Gradle plugin offers a DSL for various compiler options.
You can use it to configure the compiler in the `composeCompiler {}` block of the `build.gradle.kts` file for the module
you're applying the plugin to.

There are two kinds of options you can specify:

* General compiler settings.
* Feature flags that enable or disable new and experimental features, which should eventually become part of the baseline.

Here's an example configuration:

```kotlin
composeCompiler {
   includeSourceInformation = true

   featureFlags = setOf(
           ComposeFeatureFlag.StrongSkipping.disabled(),
           ComposeFeatureFlag.OptimizeNonSkippingGroups
   )
}
```

> The Gradle plugin provides defaults for several Compose compiler options that were only specified manually before.
> If you have any of them set up with `freeCompilerArgs`, for example, Gradle will report a duplicate options error.
>
{style="warning"}

## General settings

### generateFunctionKeyMetaClasses

**Type**: `Property<Boolean>`

**Default**: `false`

If `true`, generate function key meta classes with annotations indicating the functions and their group keys.

### includeSourceInformation

**Type**: `Property<Boolean>`

**Default**: `false` (`true` for Android)

If `true`, include source information in generated code.

Records source information that can be used for tooling to determine the source location of the corresponding composable function.
This option does not affect the presence of symbols or line information normally added by the Kotlin compiler;
it only controls source information added by the Compose compiler.

### metricsDestination

**Type**: `DirectoryProperty`

When a directory is specified, the Compose compiler will use the directory to dump [compiler metrics](https://github.com/JetBrains/kotlin/blob/master/plugins/compose/design/compiler-metrics.md#reports-breakdown).
They can be useful for debugging and optimizing your application's runtime performance:
the metrics show which composable functions are skippable, restartable, read-only, and so on.

The [reportsDestination](#reportsdestination) option allows dumping descriptive reports as well.

For a deep dive into the compiler metrics, see this [Composable metrics blog post](https://chrisbanes.me/posts/composable-metrics/).

### reportsDestination

**Type**: `DirectoryProperty`

When a directory is specified, the Compose compiler will use the directory to dump [compiler metrics reports](https://github.com/JetBrains/kotlin/blob/master/plugins/compose/design/compiler-metrics.md#reports-breakdown).
They can be useful for optimizing your application's runtime performance:
the reports show which composable functions are skippable, restartable, read-only, and so on.

The [metricsDestination](#metricsdestination) option allows dumping raw metrics.

For a deep dive into the compiler metrics, see this [Composable metrics blog post](https://chrisbanes.me/posts/composable-metrics/).

### stabilityConfigurationFile

> _Deprecated_ in Kotlin 2.1.0-Beta1 in favor of [stabilityConfigurationFiles](#stabilityconfigurationfiles),
> which allows using more than one stability configuration file.
>
{style="warning"}

**Type**: `RegularFileProperty`

A stability configuration file contains a list of classes, which should be considered stable.
For details, see [Stability configuration file](https://developer.android.com/develop/ui/compose/performance/stability/fix#configuration-file)
in the Jetpack Compose documentation.

### stabilityConfigurationFiles

**Type**: `ListProperty<RegularFile>`

Stability configuration files to be used for the current module.

Stability configuration files contain a list of classes that should be considered stable by the compiler.
For details, see [Stability configuration file](https://developer.android.com/develop/ui/compose/performance/stability/fix#configuration-file)
in the Jetpack Compose documentation.

Here's an example of specifying paths to several files:

```kotlin
composeCompiler {
    stabilityConfigurationFiles.addAll(
        project.layout.projectDirectory.file("configuration-file1.conf"),
        project.layout.projectDirectory.file("configuration-file2.conf"),
    )
}
```

### includeTraceMarkers

**Type**: `Property<Boolean>`

**Default**: `true`

If `true`, include composition trace markers in the generated code.

The Compose compiler can inject additional tracing information into the bytecode, which allows it to show composable functions
in the Android Studio system trace profiler.

For details, see this [Android Developers blog post](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535).

### targetKotlinPlatforms

**Type**: `SetProperty<KotlinPlatformType>`

Indicates Kotlin platforms to which the Compose compiler Gradle plugin should be applied.
By default, the plugin is applied to all Kotlin platforms.

To enable only one specific Kotlin platform, for example, Kotlin/JVM:

```kotlin
composeCompiler {
   targetKotlinPlatforms.set(setOf(KotlinPlatformType.jvm))
}
```

To disable the Gradle plugin for one or more Kotlin platforms, for example, Kotlin/Native and Kotlin/JS:

```kotlin
composeCompiler {
    targetKotlinPlatforms.set(
       KotlinPlatformType.values()
           .filterNot { it == KotlinPlatformType.native || it == KotlinPlatformType.js }
           .asIterable()
    )
}
```

## Feature flags

Feature flags are organized into a separate set to minimize changes to top-level properties as new flags
are continuously rolled out and deprecated.

To enable a feature flag that is disabled by default, specify it in the set, for example:

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

To disable a feature flag that is enabled by default, call the `disabled()` function on it, for example:

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

If you are configuring the Compose compiler directly, use the following syntax to pass feature flags to it:

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

### IntrinsicRemember

**Default**: enabled

If enabled, turns on intrinsic remember performance optimization.

Intrinsic remember is an optimization mode that inlines `remember` invocations and, where possible, replaces `.equals()` comparisons for keys with comparisons of the `$changed` meta parameter.
This results in fewer slots being used and fewer comparisons being made at runtime.

### OptimizeNonSkippingGroups

<primary-label ref="experimental-general"/>

**Default**: disabled

If enabled, remove groups around non-skipping composable functions.

This optimization improves the runtime performance of your application by skipping
unnecessary groups around composables which do not skip (and thus do not require a group).
This optimization will remove the groups, for example, around functions explicitly marked as `@NonSkippableComposable`
and functions that are implicitly not skippable (inline functions and functions that return a non-`Unit` value such as `remember`).

### PausableComposition

<primary-label ref="experimental-general"/>

**Default**: disabled

If enabled, changes the code generation of composable functions to allow pausing when part of a pausable composition.
This lets Compose runtime suspend composition at skipping points,
splitting long-running compositions across multiple frames.

Lazy lists and other performance intensive components use pausable composition to prefetch content
that might cause visual jank when executed in a blocking manner.

> The feature flag affects behavior only with a version of Compose runtime that supports pausable composition,
> starting with `androidx.compose.runtime` 1.8.0-alpha02.
> Older versions ignore the feature flag.
>
{style="note"}

### StrongSkipping

**Default**: enabled

If enabled, turns on strong skipping mode.

Strong skipping mode improves the runtime performance of your application by applying optimizations previously reserved only for stable values of composable functions whose parameters haven't changed.
For example, composables with unstable parameters become skippable, and lambdas with unstable captures are memoized.

For details, see the [description of strong skipping mode](https://github.com/JetBrains/kotlin/blob/master/plugins/compose/design/strong-skipping.md)
in the Kotlin GitHub repository.
