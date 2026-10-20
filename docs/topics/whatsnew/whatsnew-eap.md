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

* **Language**: [Stable name-based destructuring in `only-syntax` mode, unused return value checker, and improved compile-time constants](#stable-language-features).
* **Standard library**: [New experimental functions for simplifying common patterns with `if` expressions](#new-functions-for-simplifying-common-patterns-with-if-expressions) and [experimental support for Unicode code points](#support-for-unicode-code-points).
* **Kotlin/JVM**: [Support for Java 28](#kotlin-jvm).
* **Kotlin/Native**: [Incremental compilation enabled by default on Apple targets](#incremental-compilation-enabled-by-default-on-apple-targets) and [Swift export in Beta with a new DSL](#swift-export-goes-beta-with-a-new-gradle-dsl).
* **Kotlin Multiplatform**: [New experimental compilation scheme for Kotlin Multiplatform](#new-experimental-compilation-scheme-for-kotlin-multiplatform) and [new publication format for multiplatform libraries](#new-publication-format-for-kotlin-multiplatform-libraries).
* **Kotlin/JS**: [Support for the `es2020` target](#kotlin-js).
* **Kotlin compiler**: [More consistent inline function behavior during `klib` compilation](#consistent-cross-module-function-inlining-during-klib-compilation).

> For information about the Kotlin release cycle, see [Kotlin release process](releases.md).
>
{style="tip"}

## Update to Kotlin %kotlinEapVersion%

The latest version of Kotlin is included in the latest versions of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
and [Android Studio](https://developer.android.com/studio).

To update to the new Kotlin version, make sure your IDE is updated to the latest version and [change the Kotlin version](releases.md#update-to-a-new-kotlin-version)
to %kotlinEapVersion% in your build scripts.

## Language

Kotlin %kotlinEapVersion% stabilizes multiple language features introduced in earlier releases. It also introduces experimental
companion extensions and blocks, and full value classes.

### Stable language features

<secondary-label ref="language"/>

Kotlin 2.3.20 and 2.4.0 introduced a few language features as [Experimental](components-stability.md#stability-levels-explained).
We're happy to announce that the following language features are now [Stable](components-stability.md#stability-levels-explained) in this release:

* [Improved compile-time constants](whatsnew24.md#improved-compile-time-constants).

* [The `@IntroducedAt` annotation](whatsnew24.md#new-introducedat-annotation-to-generate-version-based-overloads-for-optional-parameters) to generate version-based overloads for optional parameters.

* [The unused return value checker](whatsnew23.md#unused-return-value-checker), which is now enabled by default.

* [Name-based destructuring](destructuring-declarations.md#name-based-destructuring) in `only-syntax` mode, which is now the default.

  In this mode, the "old" destructuring syntax `val (x, y)` keeps its position-based behavior, while the "new" syntax `(val x, val y)` performs name-based destructuring. You can find an overview of the feature in this video:

  <video src="https://www.youtube.com/v/He8J34KHEY4" title="Kotlin's Name-Based Destructuring"/>

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

For more information about the design, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0449-companions-block-extension.md). You can also read about the feature in our [blog post](https://blog.jetbrains.com/kotlin/2026/09/the-companions-to-come/).

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

### Full value classes

<primary-label ref="experimental-opt-in"/>
<secondary-label ref="language"/>

Before Kotlin %kotlinEapVersion%, [inline value classes](inline-classes.md) let you create a custom wrapper type around
a single value. If your type needed multiple properties, you had to use a regular class or data class. But for these classes,
two instances that contain the same data can still be distinguished by their references, even when that distinction has no
meaning for the type. This can limit runtime optimizations and allow code to depend unnecessarily on whether the same object
reference is preserved.

Kotlin %kotlinEapVersion% introduces experimental full value classes that let you define types where the properties together
make up the value and the identity of individual instances doesn't matter. For example, you can declare a full value class
`Complex` to represent a complex number with real and imaginary properties:

```kotlin
value class Complex(val real: Double, val imaginary: Double)
```

The compiler automatically generates `equals()`, `hashCode()`, and `toString()` functions for full value classes, similar
to data classes. However, there:

* are no `componentN()` functions. Instead, you can use [name-based destructuring](destructuring-declarations.md#name-based-destructuring). You don't need to opt in.
* is no `copy()` function. In the future, you can use `copy vars` instead. For more information, see [KT-44653](https://youtrack.jetbrains.com/issue/KT-44653).

For more information about the differences compared to data classes, see the KEEP's section about [inheritance](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0454-better-immutability-value-classes-MFVC.md#mfvc-and-inheritance).

#### Abstract value classes

Full value classes can be abstract. Unlike [interfaces](interfaces.md), they can define initialization logic that every subclass runs during construction.

For example, the `OrderedInterval` value class accepts `start` and `end` as constructor parameters. The `IntInterval` 
value class stores the values in its `start` and `end` properties.

```kotlin
sealed value class OrderedInterval<T : Comparable<T>> protected constructor(
    start: T,
    end: T,
) {
    init {
        require(start <= end)
    }
}

value class IntInterval(
    val start: Int,
    val end: Int
) : OrderedInterval<Int>(start, end)
```

For more information, see the KEEP's section about [inheritance](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0454-better-immutability-value-classes-MFVC.md#mfvc-and-inheritance).

#### Value objects

Full value classes can have no properties. These are called _value objects_ and are useful for representing types with only
one possible value without an identity, such as states or tokens. For example:

```kotlin
sealed interface UserResponse

value class UserFound(val user: User) : UserResponse
value object UserUnknown : UserResponse
```

For more information, see the KEEP's section about [value objects](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0454-better-immutability-value-classes-MFVC.md#value-objects).

#### How to enable

This feature is [Experimental](components-stability.md#stability-levels-explained). To opt in, add the following compiler
option to your build file:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xfull-value-classes")
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
                    <arg>-Xfull-value-classes</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

#### Changes to inline value class declarations

With these new value classes, `value class` no longer necessarily means inline. Inline value classes have an externally
observable inline representation, while other value classes don't expose their runtime representation in the same way.
This distinction matters for Spring and serialization libraries, which handle inline value classes differently.

To make the distinction explicit, in the future, the compiler will require inline value classes to be declared behavior
explicitly through the `inline` modifier and `@JvmInline value class` declarations. A plain `value class` declaration 
will no longer be treated as inline.

We plan a staged migration to change this behavior:

* Kotlin 2.5.20 will report a warning for unmarked single-field value classes.
* Kotlin 2.6.0 or 2.7.0 will raise this warning to an error.

You can use the `-Xinline-value-class-migration=warning` and `-Xinline-value-class-migration=strict` compiler options to prepare your code for this change.

For more information, see the [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0468-inline-value-classes.md#migration).

##### Prepare your library's classes for migration to value classes

As a library author, you can use the `@WillBecomeValue` annotation to prepare your library's regular classes for a future migration to 
full value classes. The compiler warns users when their code relies on object identity, for example through reference 
equality (`===`), synchronization, or identity hash codes. These warnings give users time to update their code before you
migrate the classes. 

The annotation is [Experimental](components-stability.md#stability-levels-explained) and requires 
you to opt in with `@OptIn(ExperimentalValueClassApi::class)`. Your library's users don't need this opt-in to use the annotated classes.

For more information, see the [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0470-will-become-value.md).

### Improved checks for equality comparisons on structural classes

<primary-label ref="experimental-opt-in"/>
<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% introduces additional analysis of equality comparisons involving data classes, data objects, 
final value classes, and enum classes, collectively referred to as _structural classes_.

The compiler uses strict equality checks for these classes to report comparisons that always return `false` with `==` or
`true` with `!=`, based on the known types of the operands. These checks help catch mistakes such as comparing a vector 
with a point, even when both classes have the same properties:

```kotlin
data class Point(val x: Double, val y: Double) {
    companion object {
        val ZERO: Point = Point(0.0, 0.0)
    }
}

data class Vector(val x: Double, val y: Double)

fun normalize(v: Vector) {
    if (v == Point.ZERO) {
        // Diagnostic: this comparison is always false.
        // A Vector is being compared with a Point.
    }
    // ...
}
```

The compiler can also use equality checks to smart-cast the right-hand operand.

To enable this feature, add the following compiler option to your build file:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xstrict-equality-for-structural-classes")
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
                    <arg>-Xstrict-equality-for-structural-classes</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

For more information, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0456-equals.md).

## Standard library

In this release, the Kotlin standard library has new experimental functions to simplify your `if` expressions and experimental
support for Unicode code points.

### New functions for simplifying common patterns with `if` expressions

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

### Support for Unicode code points

<primary-label ref="experimental-opt-in"/>
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% introduces the `CodePoint` inline value class and the related APIs in the `kotlin.text.unicode`
package. This allows you to work with Unicode code points across platforms.

A `Char` represents one UTF-16 code unit. However, some Unicode code points require two `Char` values, known as a surrogate pair.
When a program iterates over a string as `Char` values, it processes each half of a surrogate pair as a separate element.

The `CodePoint` value class represents a Unicode code point and uses `Int` as its underlying type to store its integer value.
It provides access to properties such as the number of UTF-16 code units needed to represent it, its Unicode category,
and whether it is a letter, digit, or whitespace.

The new APIs let you count and iterate over code points, convert their case, and append, insert, replace, or delete them in text.
You can also compare code points, perform arithmetic, create ranges, and traverse text in both directions. The text APIs
continue to use UTF-16 code-unit offsets for positions.

These APIs are [Experimental](components-stability.md#stability-levels-explained) and require opt-in with the `@OptIn(ExperimentalUnicodeApi::class)`
annotation or the `-opt-in=kotlin.text.unicode.ExperimentalUnicodeApi` compiler option.

For more information, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/stdlib/KEEP-0400-unicode-codepoints.md).

## Kotlin/JVM
<secondary-label ref="jvm"/>

Starting with Kotlin %kotlinEapVersion%, the compiler can generate classes containing Java 28 bytecode.

## Kotlin/Native

Kotlin %kotlinEapVersion% enables incremental compilation by default on Apple targets and promotes Swift export to Beta with a new Gradle DSL.

### Incremental compilation enabled by default on Apple targets

<secondary-label ref="native"/>

Starting with %kotlinEapVersion%, incremental compilation of `klib` artifacts is enabled by default on Apple targets.

With incremental compilation, if only a part of the `klib` artifact produced by the project module changes, only the 
affected part of the `klib` is further recompiled into a binary.

This optimization was first introduced in [Kotlin 1.9.20](whatsnew1920.md#incremental-compilation-of-klib-artifacts)
and has proven to drastically reduce compilation time for debug builds in certain cases.

The new default is only relevant to Apple targets. Incremental compilation is not supported on Windows ([MinGW toolchain](https://www.mingw-w64.org/)).
And for Linux, it's still required to opt in with:

```properties
kotlin.incremental.native=true
```

Note that in some cases, this optimization may come with a performance cost for clean builds.
To work around that, you can try the new [binary option](native-binary-options.md#how-to-enable) designed to run a 
special compilation mode on clean builds. The option is [Experimental](components-stability.md#stability-levels-explained),
opt in with:

```properties
kotlin.native.binary.batchedCacheBuild=true
```

If you face unexpected problems with incremental compilation, you can disable it manually by setting the following option
in your `gradle.properties` file:

```properties
kotlin.incremental.native=false
```

Please report any problems in [YouTrack](https://kotl.in/issue).

For more tips on improving compilation time, see our [documentation](native-improving-compilation-time.md).

### Swift export goes Beta with a new Gradle DSL

<primary-label ref="beta"/>
<secondary-label ref="native"/>

In Kotlin %kotlinEapVersion%, Swift export graduates to [Beta](components-stability.md#stability-levels-explained) and 
receives a more ergonomic Gradle DSL. The new DSL reduces duplication and increases configuration reuse, making it easier
to expose your Kotlin code to Swift.

The main changes are:

| Feature                         | Before                                                          | After                                                 |
|---------------------------------|-----------------------------------------------------------------|-------------------------------------------------------|
| Entry point                     | `swiftExport {}`                                                | `export { swift {} }`                                 |
| Collapse rule property          | `flattenPackage = "com.example.sandbox"`                        | `rootPackage = "com.example.sandbox"`                 |
| Exporting declared dependencies | `export(project(":subproject")) {}`                             | Exported automatically; no explicit `export()` needed |
| Overriding dependency configuration  | `export(libs.utils) {}`                                         | `xcodeIntegration { configure(libs.utils) {} }`                            |
| Compiler arguments              | `configure { freeCompilerArgs.add("-Xexpect-actual-classes") }` | Removed                                               |

Here's a complete build configuration that uses the new Swift export DSL:

```kotlin
// subproject/build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    // This configuration is used when exporting ":subproject"
    // as a dependency of ":shared"
    export {
        swift {
            // Set the root module name
            moduleName = "Subproject"

            // Set the collapse rule
            // Removes package prefix from generated Swift code
            rootPackage = "com.subproject.library"
        }
    }
}

// shared/build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    export {
        swift {
            // Sets the root module name
            moduleName = "Shared"

            // Sets the collapse rule
            // Removes package prefix from generated Swift code
            rootPackage = "com.example.sandbox"

            // Enables Xcode integration for this module
            xcodeIntegration {
                // Configures external module export
                configure(libs.utils) {
                    // Optional: overrides the exported module name
                    moduleName = "Utils"
                    // Optional: overrides the collapse rule of the exported dependency
                    rootPackage = "com.example.utils"
                }
            }
        }
    }

    sourceSets {
        commonMain {
            dependencies {
                // These dependencies are automatically
                // included in Swift export
                api(project(":subproject"))
                api(libs.utils)
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Full DSL example"}

In addition, Swift export configuration is now publishable: if a library author provides option overrides,
Gradle automatically consumes and applies them during Swift export.

If you run into any issues, report them in [YouTrack](https://kotl.in/issue) or [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
and join the [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) Slack channel.

## Kotlin Multiplatform

Kotlin %kotlinEapVersion% introduces a new experimental compilation scheme for Kotlin Multiplatform and a new publication
format that significantly decreases the size of published multiplatform libraries.

### New experimental compilation scheme for Kotlin Multiplatform

<primary-label ref="experimental-opt-in"/>
<secondary-label ref="multiplatform"/>

Kotlin %kotlinEapVersion% introduces a new experimental compilation scheme for Kotlin Multiplatform (KMP) that makes the
compiler handle common source sets more consistently with the IDE. This change prevents common code from accidentally 
resolving to platform-specific declarations, improves consistency in overload resolution and type inference, and enables
us to implement incremental compilation for common source sets. Learn more about KMP separate compilation and how to try
it in our [blog post](https://blog.jetbrains.com/kotlin/2026/09/a-more-reliable-compilation-scheme-for-kotlin-multiplatform-modules/).

### New publication format for Kotlin Multiplatform libraries

<primary-label ref="experimental-opt-in"/>
<secondary-label ref="multiplatform"/>

Kotlin %kotlinEapVersion% introduces a new publication format for Kotlin Multiplatform libraries that significantly decreases
the size of a published library. The new format publishes platform artifacts (except for JVM and Android) as a single `.kar`
archive, which is a ZIP archive additionally compressed with XZ.

This change addresses the [publication size limits](https://central.sonatype.org/publish/maven-central-publishing-limits/)
recently introduced to Maven Central. With the new format, adding a new target no longer creates new files, so the publication
size doesn't increase that much. In some cases, the total publication is even smaller than a single-target one before. 
For example, for the [cryptography-kotlin](https://github.com/whyoleg/cryptography-kotlin) library, the published artifact
set went from 7539 files and 91 MB to 1036 files and 23 MB for the whole multi-module project.

To enable the new format for a specific module, configure it in the module's build script:

```kotlin
kotlin {
    publishing {
        publicationFormat.set(KotlinPublicationFormat.KOTLIN_ARCHIVE)
    }
}
```

Alternatively, to enable it for all modules in your project, add the following property to your `gradle.properties` file:

```properties
kotlin.publicationFormat=KOTLIN_ARCHIVE
```

While publishing in the new format is still [Experimental](components-stability.md#stability-levels-explained), consumption
of such artifacts is already available for all projects. This change is relevant to library authors only and doesn't affect
developers of final applications.

Please share your feedback and report any problems in [YouTrack](https://kotl.in/issue).

## Kotlin/JS
<secondary-label ref="js"/>

Kotlin %kotlinEapVersion% adds the `es2020` target to the Kotlin/JS compiler and Gradle plugin. Previously, only the `es5` and
`es2015` targets were available, and support for newer JavaScript features, such as `BigInt`, had to be enabled separately
targeting ES2015. By targeting ES2020, you can use all supported JavaScript features up to ECMAScript 2020, including `BigInt`,
without additional configuration.

To enable the new target, set `target` to `es2020` in the `compilerOptions {}` block:

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

Kotlin %kotlinEapVersion% brings more improvements to function inlining during `klib` compilation and improves type inference
performance.

### Consistent cross-module function inlining during klib compilation

<secondary-label ref="compiler"/>

Kotlin 2.4.0 enabled [consistent intra-module function inlining on Kotlin/Native, Kotlin/JS, and
Kotlin/Wasm](whatsnew24.md#consistent-intra-module-function-inlining-during-klib-compilation) during `klib` compilation.
The consistency of function inlining across different Kotlin platforms makes it easier to provide compatibility guarantees.

Kotlin 2.4.0 also introduced the possibility to enable **cross-module** inlining during `klib` compilation, ensuring that
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

## Breaking changes and deprecations

Kotlin %kotlinEapVersion% introduces an error as the next step to raising the minimum JDK version required to run the
Kotlin compiler from JDK 8 to JDK 17. We're raising the minimum required JDK to speed up development and give the compiler
access to new libraries that require newer Java versions. JDK 17 has a long support window and helps us maintain compatibility
with newer versions of Gradle and Maven. Opt out of the error with the `-Xallow-pre-17-runtime-jdk` compiler option. 
This option will be removed in Kotlin 2.5.20 or 2.6.0 when JDK 17 becomes mandatory.

If you have difficulty upgrading your project, share your experience on [YouTrack](https://kotl.in/issue) or reach out 
directly to developers on Kotlin Slack. [Get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
and join the [#compiler](https://kotlinlang.slack.com/archives/C7L3JB43G) channel.