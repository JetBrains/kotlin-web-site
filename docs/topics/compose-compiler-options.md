[//]: # (title: Compose compiler options DSL)

The Compose compiler Gradle plugin offers a DSL for various compiler options.
You can use it to configure the compiler in the `composeCompiler {}` block of the `build.gradle.kts` file for the module
you're applying the plugin to.

There are two kinds of options you can specify:

* General compiler settings, which can be disabled or enabled as needed in any given project.
* Feature flags that enable or disable new and experimental features, which should eventually become part of the baseline.

You can find the [list of available general settings](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)
and the [list of supported feature flags](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)
in the Compose compiler Gradle plugin API reference.

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

> The Gradle plugin provides defaults for several Compose compiler options that were only specified manually before Kotlin 2.0.
> If you have any of them set up with `freeCompilerArgs`, for example, Gradle reports a duplicate options error.
>
{style="warning"}

## Purpose and use of feature flags

Feature flags are organized into a separate set of options to minimize changes to top-level properties as new flags
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

See the [list of supported feature flags](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/)
in the Compose compiler Gradle plugin API reference.
