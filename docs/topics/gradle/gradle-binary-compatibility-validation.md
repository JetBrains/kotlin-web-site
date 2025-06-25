[//]: # (title: Binary compatibility validation in the Kotlin Gradle plugin)

<primary-label ref="experimental-general"/>

Binary compatibility validation helps library authors ensure that users don't break their code when upgrading to newer 
versions. It's important not only for delivering a smooth upgrade experience, but also for building long-term trust with
users and encouraging continued adoption of the library.

> Binary compatibility means that the compiled bytecode of two versions of a library can run interchangeably without 
> needing recompilation.
> 
{style="tip"}

Starting with version 2.2.0, the Kotlin Gradle plugin supports binary compatibility validation. When enabled, it generates
Application Binary Interface (ABI) dumps from the current code and compares them with previous dumps to highlight differences.
You can review these changes to find any potentially binary-incompatible modifications and take action to address them.

## How to enable

To enable binary compatibility validation, add the following to the `kotlin{}` block in your `build.gradle.kts` file:


<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // Use the set() function to ensure compatibility with older Gradle versions
        enabled.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlin {
    abiValidation {
        enabled = true
    }
}
```

</tab>
</tabs>



If your project has multiple modules where you want to check for binary compatibility, configure each module separately.

## Check for binary compatibility issues

To check for potentially binary incompatible issues after making changes to your code, run the `checkLegacyAbi` Gradle task
in IntelliJ IDEA or use the following command in your project directory:

```kotlin
./gradlew checkLegacyAbi
```

The task compares ABI dumps and prints any detected differences as errors. Check the output carefully to see if you need to
make changes to your code to preserve binary compatibility.

## Update reference ABI dump

To update the reference ABI dump that Gradle uses to check your latest changes, run the `updateLegacyAbi` task in IntelliJ 
IDEA or use the following command in your project directory:

```kotlin
./gradlew updateLegacyAbi
```

Only update the reference dump when you're confident your changes maintain binary compatibility with the previous version.

## Configure filters

You can define filters to control which classes, properties, and functions the ABI dump includes. Use the `filters {}`
block to add exclusion and inclusion rules with `excluded {}` and `included {}` blocks respectively.

Gradle includes a declaration in the ABI dump only if it doesn't match any exclusion rule. When inclusion rules are defined,
the declaration must either match one of them or have at least one member that does.

A rule can be based on:

* The fully qualified name of a class, property, or function (`byNames`).
* The name of an annotation that has BINARY or RUNTIME [retention](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.annotation/-retention/) (`annotatedWith`).

> You can use wildcards `**`, `*`, and `?` in your rules for names:
> * `**` matches zero or more characters, including periods.
> * `*` matches zero or more characters excluding periods. Use this to specify a single class name.
> * `?` matches exactly one character.
> 
{style = "tip"}

For example:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters {
            excluded {
                byNames.add("**.InternalUtils")
                annotatedWith.add("com.example.annotations.InternalApi")
            }

            included {
                byNames.add("com.example.api.**")
                annotatedWith.add("com.example.annotations.PublicApi")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlin {
    abiValidation {
        filters {
            excluded {
                byNames.add("**.InternalUtils")
                annotatedWith.add("com.example.annotations.InternalApi")
            }

            included {
                byNames.add("com.example.api.**")
                annotatedWith.add("com.example.annotations.PublicApi")
            }
        }
    }
}
```

</tab>
</tabs>

This example:

* Excludes:
  * The `InternalUtils` class.
  * Declarations annotated with `@InternalApi`.
* Includes:
  * Everything in the `com.example.api` package.
  * Declarations annotated with `@PublicApi`.

To learn more about filtering, see the [Kotlin Gradle plugin API reference](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/-abi-filters-spec/).

## Prevent inferred changes for unsupported targets

In multiplatform projects, if your host system can't compile all targets, the Kotlin Gradle plugin tries to infer ABI changes
from the available targets. This helps avoid false failures when you later switch to a host that supports more targets.

To disable this behavior, add the following to your `build.gradle.kts` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets.set(false)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlin {
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

</tab>
</tabs>

If a target is unsupported and inference is disabled, the `checkLegacyAbi` task fails because it can't generate a complete
ABI dump. This behavior may be useful if you'd prefer the task to fail rather than risk missing a binary-incompatible change.