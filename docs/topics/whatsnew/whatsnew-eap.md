[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

<primary-label ref="eap"/>

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release,
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{style="note"}

The Kotlin %kotlinEapVersion% release is out! Here are some details of this EAP release:

* **Language**: [more stable and default features, a new checker for unused return values, and changes to context-sensitive resolution](#language).
* **Kotlin/JVM**: [support for Java 25](#kotlin-jvm-support-for-java-25).
* **Kotlin/Native**: [improved interop through Swift export](#kotlin-native-improved-interop-through-swift-export).
* **Kotlin/Wasm**: [fully qualified names and new exception handling proposal enabled by default](#kotlin-wasm).
* **Kotlin/JS**: [new experimental suspend function export and `LongArray` representation](#kotlin-js).
* **Gradle**: [compatibility with Gradle 9.0 and a new API for registering generated sources](#gradle).
* **Standard library**: [stable time tracking functionality](#standard-library).

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest versions of IntelliJ IDEA and Android Studio.
You don't need to update the Kotlin plugin in your IDE.
All you need to do is [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.

## Language

Kotlin %kotlinEapVersion% focuses on feature stabilization, introduces a new check mechanism for unused return values,
and improves context-sensitive resolution.

### Stable features

In previous Kotlin releases, several new language features were introduced as Experimental and Beta.
We're happy to announce that in this release, the following features become [Stable](components-stability.md#stability-levels-explained):

* [Support for nested type aliases](whatsnew22.md#support-for-nested-type-aliases)
* [Data-flow-based exhaustiveness checks for `when` expressions](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)

### Features enabled by default

Starting with Kotlin %kotlinEapVersion%, support for [`return` statements in expression bodies with explicit return types](whatsnew2220.md#support-for-return-statements-in-expression-bodies-with-explicit-return-types)
is now enabled by default.

> In Kotlin %kotlinEapVersion%, [improved overload resolution for lambdas with `suspend` function types](whatsnew2220.md#improved-overload-resolution-for-lambdas-with-suspend-function-types)
> is **disabled**.
> 
> The feature was initially planned to be enabled by default in Kotlin 2.3.0, but after discovering some issues,
> we decided to postpone its implementation. It will be available again with an improved design in future releases.
>
{style="note"}

[See the full list of Kotlin language design features and proposals](kotlin-language-features-and-proposals.md).

### Unused return value checker
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% introduces a new feature, the unused return value checker.
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
        // The checker reports a warning that this result is ignored
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
{validate="false"}

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
so the checker applies to all return values from your project's functions.

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

    // Reports a warning: result is ignored
    computeValue()

    // Suppresses the warning only at this call site with a special unused variable
    val _ = computeValue()
}
```

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719). For more information,
see the feature's [KEEP]( https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md).

### Changes to context-sensitive resolution
<primary-label ref="experimental-general"/>

> Support for code analysis, code completion, and highlighting of this feature in IntelliJ IDEA is currently available
> only in [2025.3 EAP builds](https://www.jetbrains.com/idea/nextversion/).
>
{style = "note"}

Context-sensitive resolution is still [Experimental](components-stability.md#stability-levels-explained),
but we continue improving the feature based on user feedback:

* The sealed and enclosing supertypes of the current type are now considered as part of the contextual scope of the search.
  No other supertype scopes are considered.
* In cases with type operators and equalities, the compiler now reports a warning if using context-sensitive resolution
  makes the resolution ambiguous. This can happen, for example, when a clashing declaration of a class is imported.

For details, see the full text of the current proposal in [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md).

## Kotlin/JVM: support for Java 25

Starting with Kotlin %kotlinEapVersion%, the compiler can generate classes containing Java 25 bytecode.

## Kotlin/Native: improved interop through Swift export
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% further improves Kotlin interoperability with Swift through Swift export, adding support for
native enum classes and variadic function parameters.

Previously, Kotlin enums were exported as ordinary Swift classes. Now the mapping is direct, and you can use regular
native Swift enums. For example:

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```Swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    var rgb: Int { get } 
}
```

Kotlin's [`vararg`](functions.md#variable-number-of-arguments-varargs) functions are now directly mapped to Swift's
variadic function parameters too.

Such functions let you pass a variable number of arguments. This is useful when you don't know the number of arguments
in advance or want to create or pass a collection without specifying its type. For example:

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```Swift
// Swift
public func log(messages: Swift.String...)
```

> Generic types in variadic function parameters are not supported yet.
>
{style="note"}

## Kotlin/Wasm

### Fully qualified names enabled by default

On Kotlin/Wasm targets, fully qualified names (FQNs) were not enabled by default at runtime.
You had to manually enable support for the `KClass.qualifiedName` property.

Previously, only the class name (without the package) was accessible, which caused issues for code ported from JVM to
Wasm targets or for libraries that expected fully qualified names at runtime.

In Kotlin %kotlinEapVersion%, the `KClass.qualifiedName` property is enabled by default on Kotlin/Wasm targets.
This means that FQNs are available at runtime without any additional configuration.

Enabling FQNs by default improves code portability and makes runtime errors more informative by displaying the fully
qualified name.

This change does not increase the size of the compiled Wasm binary, thanks to compiler optimizations that reduce
metadata by using compact storage for Latin-1 string literals.

### New exception handling proposal enabled by default for `wasmWasi`

Previously, Kotlin/Wasm used the [legacy exception handling proposal](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)
for all targets, including [`wasmWasi`](wasm-overview.md#kotlin-wasm-and-wasi). However, most standalone WebAssembly
virtual machines (VMs) are aligning with the [new version of the exception handling proposal](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md).

Starting with Kotlin %kotlinEapVersion%, the new WebAssembly exception handling proposal is enabled by default for the
`wasmWasi` target, ensuring better compatibility with modern WebAssembly runtimes.

For the `wasmWasi` target, the change is safe to introduce early because applications targeting it usually run in a less
diverse runtime environment (often running on a single specific VM) and it is typically controlled by the user, reducing
the risk of compatibility issues.

The new exception handling proposal remains off by default for the [`wasmJs` target](wasm-overview.md#kotlin-wasm-and-compose-multiplatform).
You can manually enable it using the `-Xwasm-use-new-exception-proposal` compiler option.

## Kotlin/JS

### New export of suspend function with `JsExport`
<primary-label ref="experimental-opt-in"/>

Previously, the `@JsExport` annotation did not allow exporting suspend functions (or classes and interfaces containing
such functions) to JavaScript. You had to manually wrap each suspend function, which was cumbersome and error-prone.

Starting with Kotlin %kotlinEapVersion%, suspend functions can be exported directly to JavaScript using the `@JsExport`
annotation.

Enabling suspend function exports removes the need for boilerplate and improves interoperability between Kotlin/JS and
JavaScript/TypeScript (JS/TS). Kotlin's async functions can now be called directly from JS/TS without extra code.

To enable this feature, add the following compiler option to your `build.gradle.kts` file:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xenable-suspend-function-exporting")
    }
}
```

Once enabled, classes and functions marked with the `@JsExport` annotation can include suspend functions without
additional wrappers.

They could be consumed as regular JavaScript async functions and could be overridden as an async function as well:

```kotlin
@JsExport
open class Foo {
    suspend fun foo() = "Foo"
}
```

```typescript
class Bar extends Foo {
    override async foo(): Promise<string> {
        return "Bar"
    }
}
```

This feature is [Experimental](components-stability.md#stability-levels-explained). We would appreciate your feedback in
our issue tracker, [YouTrack](https://youtrack.jetbrains.com/issue/KT-56281/KJS-Cant-export-suspend-functions).

### Usage of the `BigInt64Array` type to represent Kotlin's `LongArray` type
<primary-label ref="experimental-opt-in"/>

Previously, Kotlin/JS represented `LongArray` as a JavaScript `Array<bigint>`. This approach worked but was not ideal
for interoperability with JavaScript APIs that expect typed arrays.

Starting with this release, Kotlin/JS now uses JavaScript's built-in `BigInt64Array` type to represent Kotlin's
`LongArray` values when compiling to JavaScript.

Using `BigInt64Array` simplifies interop with JavaScript APIs that use typed arrays. It also allows APIs that accept
or return `LongArray` to be exported more naturally from Kotlin to JavaScript.

To enable this feature, add the following compiler option to your `build.gradle.kts` file:

```kotlin
kotlin {
    js {
        // ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

This feature is [Experimental](components-stability.md#stability-levels-explained). We would appreciate your feedback in
our issue tracker, [YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray).

## Gradle

Kotlin %kotlinEapVersion% is fully compatible with Gradle 7.6.3 through 9.0.0. You can also use Gradle versions up to
the latest Gradle release. However, be aware that doing so may result in deprecation warnings, and some new Gradle
features might not work.

In addition, the minimum supported Android Gradle plugin version is now 8.2.2 and the maximum supported version is
8.13.0.

### New API for registering generated sources in Gradle projects
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% introduces a new [experimental](components-stability.md#stability-levels-explained) API in
the [`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/)
interface that you can use to register generated sources in your Gradle projects.

This new API is a quality-of-life improvement that helps IDEs distinguish between generated code and regular source files.
The API allows IDEs to highlight the generated code differently in the UI and trigger generation tasks when the project
is imported. We are currently working on adding this support in IntelliJ IDEA. The API is also especially useful for
third-party plugins or tools that generate code, such as [KSP](ksp-overview.md) (Kotlin Symbol Processing).

To register a directory that contains Kotlin or Java files, use the `generatedKotlin` property with the [`SourceDirectorySet`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.file/-source-directory-set/index.html)
type in your `build.gradle(.kts)` file. For example:

```kotlin
val generatorTask = project.tasks.register("generator") {
    val outputDirectory = project.layout.projectDirectory.dir("src/main/kotlinGen")
    outputs.dir(outputDirectory)
    doLast {
        outputDirectory.file("generated.kt").asFile.writeText(
            // language=kotlin
            """
            fun printHello() {
                println("hello")
            }
            """.trimIndent()
        )
    }
}

kotlin.sourceSets.getByName("main").generatedKotlin.srcDir(generatorTask)
```

This example creates a new task `"generator"` with an output directory of `"src/main/kotlinGen"`. When the task runs,
the `doLast {}` block creates a `generated.kt` file in the output directory. Finally, the example registers the task's
output as a generated source.

As part of the new API, the `allKotlinSources` property provides access to all sources registered in the
`KotlinSourceSet.kotlin` and `KotlinSourceSet.generatedKotlin` properties.

## Standard library

In Kotlin %kotlinEapVersion%, the new time tracking functionality, [`kotlin.time.Clock` and `kotlin.time.Instant`](whatsnew2120.md#new-time-tracking-functionality)
becomes [Stable](components-stability.md#stability-levels-explained).

## Compose compiler: stack traces for minified Android applications

Starting from Kotlin 2.3.0, the compiler outputs ProGuard mappings for Compose stack traces when applications are minified by R8.
This expands the experimental stack traces feature that was previously only available in debuggable variants.

The release variant of stack traces contains group keys that can be used to identify composable functions in minified
applications without the overhead of recording source information at runtime. The group key stack traces require your
application to be built with Compose runtime 1.10 or newer.

To enable group key stack traces, add the following line before initializing any `@Composable` content:

```kotlin
Composer.setDiagnosticStackTraceMode(ComposeStackTraceMode.GroupKeys)
```

With these stack traces enabled, Compose runtime will append its own stack trace after a crash is captured during
composition, measure, or draw passes, even when the app is minified:

```text
java.lang.IllegalStateException: <message>
          at <original trace>
Suppressed: androidx.compose.runtime.DiagnosticComposeException: Composition stack when thrown:
         at $$compose.m$123(SourceFile:1)
         at $$compose.m$234(SourceFile:1)
          ...
```

Stack traces produced by Jetpack Compose 1.10 in this mode only contain group keys that still have to be deobfuscated.
This is addressed in the Kotlin 2.3.0 release, with the Compose compiler Gradle plugin that now appends group key
entries to the ProGuard mapping files produced by R8. If you see new warnings in cases when the compiler fails to create
mappings for some functions, please report them to the [Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126).

> The Compose compiler Gradle plugin only creates deobfuscation mappings for the group key stack traces
> when R8 is enabled for the build due to dependencies on R8 mapping files.
>
{style="note"}

By default, the mapping file Gradle tasks run regardless of whether you enable the traces. If they cause problems in your
build, you can disable the feature entirely. Add the following property in the `composeCompiler {}` block of your Gradle configuration:

```kotlin
composeCompiler {
    includeComposeMappingFile.set(false)
}
```

Please report any problems encountered to the [Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126).
