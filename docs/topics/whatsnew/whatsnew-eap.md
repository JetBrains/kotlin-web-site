[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

<primary-label ref="eap"/>

<show-structure depth="1"/>

<web-summary>Read the Kotlin Early Access Preview release notes and try the latest experimental Kotlin features before they are officially released.</web-summary>

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release,
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{style="note"}

The Kotlin %kotlinEapVersion% release is out! Here are some details of this EAP release:

* **Language**: [Stable name-based destructuring in `only-syntax` mode](#stable-language-features) and [new experimental companion extensions and blocks](#companion-extensions-and-blocks)
* **Standard library**: [New experimental functions for simplifying common patterns with `if` expressions](#standard-library-new-functions-for-simplifying-common-patterns-with-if-expressions)
* **Kotlin/JS**: [Support for the `es2020` target](#kotlin-js-support-for-the-es2020-target)
* **Kotlin compiler**: [More consistent inline function behavior during `.klib` compilation](#consistent-cross-module-function-inlining-during-klib-compilation)<!--and a [new experimental compilation scheme for Kotlin Multiplatform]().-->

> For information about the Kotlin release cycle, see [Kotlin release process](releases.md).
>
{style="tip"}

## Update to Kotlin %kotlinEapVersion%

The latest version of Kotlin is included in the latest versions of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
and [Android Studio](https://developer.android.com/studio).

To update to the new Kotlin version, make sure your IDE is updated to the latest version and [change the Kotlin version](releases.md#update-to-a-new-kotlin-version)
to %kotlinEapVersion% in your build scripts.

## Language

Kotlin %kotlinEapVersion% stabilizes two language features introduced in earlier releases. It also introduces experimental
companion extensions and companion blocks.

### Stable language features

<secondary-label ref="language"/>

Kotlin 2.3.20 and 2.4.0 introduced a few language features as [Experimental](components-stability.md#stability-levels-explained).
We're happy to announce that the following language features are now [Stable](components-stability.md#stability-levels-explained) in this release:

* [Name-based destructuring](destructuring-declarations.md#name-based-destructuring) in `only-syntax` mode.

  In this mode, the "old" destructuring syntax `val (x, y)` keeps its position-based behavior, while the "new" syntax `(val x, val y)` performs name-based destructuring.

* [Improved compile-time constants](whatsnew24.md#improved-compile-time-constants).

### Companion extensions and blocks

<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% introduces companion extensions and companion blocks.

Previously, to declare extensions, functions, and properties that you could access through a type's name, the type needed
to have a companion object. Companion extensions and blocks remove this requirement and let you:

* Declare a companion extension by adding the `companion` modifier to a top-level extension, even if the type it extends has no companion object.
* Declare functions and properties in a `companion {}` block inside a class or interface without creating an object instance. On platforms that support static members, the compiler generates these declarations as static members. As a result, you don't need to annotate them with `@JvmStatic` on the JVM.

Here's an example that declares `UnitX` as a companion extension and `Zero` in a companion block:

```kotlin
// Declares UnitX as a companion extension
companion val Vector.UnitX get() = Vector(1.0, 0.0)

data class Vector(val x: Double, val y: Double) {
    companion {
        // Declares Zero in a companion block
        val Zero: Vector get() = Vector(0.0, 0.0)
    }
}

fun main() {
    println(Vector.UnitX)
    // Vector(x=1.0, y=0.0)
    
    println(Vector.Zero)
    // Vector(x=0.0, y=0.0)
}
```

For more information about the design, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0449-companions-block-extension.md).

Companion extensions and blocks are [Experimental](components-stability.md#stability-levels-explained). To opt in, add
the following compiler option to your build file:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcompanion-blocks-and-extensions")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xcompanion-blocks-and-extensions</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-11968).

## Standard library: New functions for simplifying common patterns with `if` expressions

<primary-label ref="experimental-opt-in"/>
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% introduces new standard library functions that let you inspect a `Boolean` value before returning
it or return a nullable result depending on that value.

Previously, these patterns required explicit `if` expressions with `else` branches. You can now simplify them with the
following functions:

* `onTrue()` runs a specified code block when a `Boolean` value is `true` and returns the original Boolean value.
* `onFalse()` runs a specified code block when a `Boolean` value is `false` and returns the original Boolean value.
* `ifOrNull()` runs a specified code block and returns its result if the `Boolean` value is `true`. If the value is `false`, the function returns `null` without running the block.

These functions are [Experimental](components-stability.md#stability-levels-explained) and require opt-in with the 
`@OptIn(ExperimentalStdlibApi::class)` annotation or the `-opt-in=kotlin.ExperimentalStdlibApi` compiler option.

Here's an example:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val tags = mutableSetOf("kotlin", "jvm")

    // Uses the onTrue() function to print a message when add() returns true
    val added = tags.add("wasm").onTrue {
        println("Tag added")
    }
    println(added)
    // Tag added
    // true

    // Uses the onFalse() function to print a message when remove() returns false
    val removed = tags.remove("native").onFalse {
        println("Tag not found")
    }
    println(removed)
    // Tag not found
    // false

    // Uses the ifOrNull() function to return a message when "wasm" is in tags
    val message = ifOrNull("wasm" in tags) {
        "Wasm tag is available"
    }
    println(message)
    // Wasm tag is available
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.5.0-Beta1" validate="false"}

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-6938).

## Kotlin/JS: Support for the `es2020` target
<secondary-label ref="js"/>

Kotlin %kotlinEapVersion% adds the `es2020` target to the Kotlin/JS compiler and Gradle plugin. Previously, only the `es5` and
`es2015` targets were available, and support for newer JavaScript features, such as `BigInt`, had to be enabled separately
targeting ES2015. By targeting ES2020, you can use all supported JavaScript features up to ECMAScript 2020, including `BigInt`,
without additional configuration.

To enable the new target, set `target` to `es2020` in the `compilerOptions` block:

```kotlin
kotlin { 
    js { 
        compilerOptions { 
            target.set("es2020") 
        }
    }
}
```

## Kotlin compiler

Kotlin %kotlinEapVersion% brings more improvements to function inlining during `.klib` compilation and experimental features
such as improved type inference performance<!-- and a new compilation scheme for Kotlin Multiplatform -->.

### Consistent cross-module function inlining during klib compilation

<secondary-label ref="compiler"/>

Kotlin 2.4.0 enabled [consistent intra-module function inlining on Kotlin/Native, Kotlin/JS, and
Kotlin/Wasm](whatsnew24.md#consistent-intra-module-function-inlining-during-klib-compilation) during `.klib` compilation.
The consistency of function inlining across different Kotlin platforms makes it easier to provide compatibility guarantees.

Kotlin 2.4.0 also introduced the possibility to enable **cross-module** inlining during `.klib` compilation, ensuring that
all inline functions in a project are consistently inlined. Kotlin %kotlinEapVersion% enables cross-module inlining by default.

If you face unexpected problems with this feature, you can disable it with the following command-line compiler option:

```bash
-Xklib-ir-inliner=disabled
```

Please share your feedback and report any problems in [YouTrack](https://kotl.in/issue).

### Improved type inference performance

<primary-label ref="experimental-opt-in"/>

<secondary-label ref="compiler"/>

Kotlin %kotlinEapVersion% improves compiler performance by reducing the number of constraints generated during type inference.
Previously, complex generic code could generate excessive constraints, causing compilation or IDE analysis to hang. This
change may affect type inference in certain edge cases, particularly those involving builder inference or complex platform
types with unusual bounds. As a result, the compiler may infer different types, select different overloads, or report
different diagnostics. These differences can be an expected result of the improvement.

The functionality is enabled by default. To restore the previous type inference behavior, use the
`-XXLanguage:-EliminateSecondKindIncorporation` option.

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-85879).

<!--
### New experimental compilation scheme for Kotlin Multiplatform

<primary-label ref="experimental-opt-in"/>

<secondary-label ref="compiler"/>

Kotlin %kotlinEapVersion% introduces a new experimental compilation scheme for Kotlin Multiplatform (KMP) that makes the
compiler handle common source sets more consistently with the IDE. This change prevents common code from accidentally
resolving to platform-specific declarations, improves consistency in overload resolution and type inference, and enables
incremental compilation for common source sets. Learn more about KMP separate compilation and how to try it in our [blog post](TBD).
-->

## Breaking changes and deprecations

Kotlin %kotlinEapVersion% introduces a warning as the first step to raising the minimum JDK version required to run the
Kotlin compiler from JDK 8 to JDK 17. We're raising the minimum required JDK to speed up development and give the compiler
access to new libraries that require newer Java versions. JDK 17 has a long support window and helps us maintain compatibility
with newer versions of Gradle and Maven. Opt out of the warning with the `-Xallow-pre-17-runtime-jdk` compiler option. 
This option will be removed in Kotlin 2.5.20 or 2.6.0 when JDK 17 becomes mandatory.

If you have difficulty upgrading your project, share your experience on [YouTrack](https://kotl.in/issue) or reach out 
directly to developers on Kotlin Slack. [Get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
and join the [#compiler](https://kotlinlang.slack.com/archives/C7L3JB43G) channel.