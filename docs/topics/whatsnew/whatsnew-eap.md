[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release,
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{style="note"}

The Kotlin %kotlinEapVersion% release is out! Here are some details of this EAP release:

* [Feature stabilization: nested type aliases, exhaustive `when`, new time tracking functionality](#stable-features)
* [Language: changes to context-sensitive resolution and a preview of the unused return value checker](#language)
* [Type checks and the cast optimization pass enabled by default for Kotlin/Native](#kotlin-native-type-checks-and-casts-optimization-pass-in-debug-mode)

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest versions of IntelliJ IDEA and Android Studio.
You don't need to update the Kotlin plugin in your IDE.
All you need to do is [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.

## Stable features

In previous Kotlin releases, several new language and standard library features were introduced in preview.
We're happy to announce that in this release, the following features become [Stable](components-stability.md#stability-levels-explained):

* [Support for nested type aliases](whatsnew22.md#support-for-nested-type-aliases)
* [Data-flow-based exhaustiveness checks for `when` expressions](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)
* [New time tracking functionality: `kotlin.time.Clock` and `kotlin.time.Instant` ](whatsnew2120.md#new-time-tracking-functionality)

[See the full list of Kotlin language design features and proposals](kotlin-language-features-and-proposals.md).

## Language

Kotlin %kotlinEapVersion% introduces a new check mechanism for unused return values and focuses on improving
context-sensitive resolution.

### Unused return value checker
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% introduces a preview of a new feature, the unused return value checker.
This feature warns you when an expression returns a value other than `Unit` or `Nothing` and isn't passed to a function,
checked in a condition, or used otherwise.

You can use it to catch bugs where a function call produces a meaningful result, but the result is silently dropped,
which can lead to unexpected behavior or hard-to-trace issues.

> The checker ignores values returned from increment operations such as `++` and `--`.
>
{style="note"}

Consider the following example:

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // The checker raises a warning that this result is ignored
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

In this example, a string is created but never used, so the checker reports it as an ignored result.

This feature is [Experimental](components-stability.md#stability-levels-explained).
To opt in, add the following compiler option to your `build.gradle.kts` file:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```

With this option, the checker only reports ignored results from expressions that are marked, like most functions in the
Kotlin standard library.

To mark your functions, use the `@MustUseReturnValues` annotation to mark the scope on which you want the checker to
report ignored return values.

For example, you can mark an entire file:

```kotlin
// Marks all functions and classes in this file so the checker reports unused return values
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

Or a specific class:

```kotlin
// Marks all functions in this class so the checker reports unused return values
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```

You can also mark your entire project using the `full` mode.
To do so, add the following compiler option to your `build.gradle.kts` file:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=full")
    }
}
```

In this mode, Kotlin automatically treats your compiled files as if they are annotated with `@MustUseReturnValues`,
so the checker applies to all return values from your project's functions

You can suppress warnings on specific functions by marking them with the `@IgnorableReturnValue` annotation.
Annotate functions where ignoring the result is common and expected, such as `MutableList.add`:

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```
You can suppress a warning without marking the function itself as ignorable.
To do this, assign the result to a special unnamed variable with an underscore syntax (`_`):

```kotlin
// Non-ignorable function
fun computeValue(): Int = 42

fun main() {

    // Raises a warning: result is ignored
    computeValue()

    // Suppresses the warning only at this call site with a special unused variable
    val _ = computeValue()
}
```

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719). For more information,
see the feature's [KEEP]( https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)

### Changes to context-sensitive resolution
<primary-label ref="experimental-general"/>

> Support for code analysis, code completion, and highlighting of this feature in IntelliJ IDEA is currently available
> only in [2025.3 EAP builds](https://www.jetbrains.com/idea/nextversion/).
>
{style = "note"}

Context-sensitive resolution is still in preview, but we continue improving the feature based on user feedback:

* The sealed and enclosing supertypes of the current type are now considered as part of the contextual scope of the search.
  No other supertype scopes are considered.
* In cases with type operators and equalities, the compiler now raises a warning if using context-sensitive resolution
  makes the resolution ambiguous. This can happen, for example, when a clashing declaration of a class is imported.

For details, see the [full text of the current proposal](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md).

## Kotlin/Native: Type checks and casts optimization pass in debug mode

Starting with Kotlin %kotlinEapVersion%, type checks and the cast optimization pass are enabled by default in debug mode,
helping you find errors related to unchecked casts earlier. This change improves safety and makes debugging of invalid
generic casts more predictable across platforms.

Previously, unchecked casts that led to heap pollution and violation of memory safety could go unnoticed in Kotlin/Native.
Now such cases consistently fail with a runtime cast error, similar to Kotlin/JVM or Kotlin/JS. For example:

```kotlin
class Box<T>(var value: T)

fun main() {
    val d = Box(1)
    if (d as? Box<String> != null) {
        d.value = "0123456789"
    }
    println(d.value + 2) // now throws ClassCastException error
}
```

This code used to print `12`; now it throws a `ClassCastException` error in debug mode, as expected.

For more information, see [Type checks and casts](typecasts.md).
