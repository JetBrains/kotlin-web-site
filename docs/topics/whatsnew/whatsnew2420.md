[//]: # (title: What's new in Kotlin 2.4.20)

<show-structure depth="1"/>

<web-summary>Read the Kotlin 2.4.20 release notes covering new experimental features and updates to the standard library,
Native, Wasm, JS, Gradle, BTA, and the Kotlin compiler</web-summary>

_[Released: September 7, 2026](releases.md#release-history)_

Kotlin 2.4.20 is out! Here are the release highlights:

* **Standard library:** [Support for coroutine stack trace recovery, new functions for checking the equality and uniqueness of collection elements, and new overloads for `kotlin.test` assertion functions](#standard-library)
* **Kotlin/Native:** [New Swift export features, improved incremental compilation, and automatically generated `Package.swift` files for SwiftPM dependencies](#kotlin-native)
* **Kotlin/Wasm:** [Changes to top-level `require()` calls in `@JsFun` declarations, improved initialization order of companion objects, support for Wasmtime in the Kotlin Gradle plugin, new compilation modes, and reduced binary size for functional interfaces](#kotlin-wasm)
* **Kotlin/JS:** [A new DSL for browser testing, support for exporting suspending lambdas as async functions, improved exportability of data classes](#kotlin-js)
* **Gradle:** [Support for Gradle 9.7.0 and improved reporting in the Problems API](#gradle)
* **Build tools API:** [Support for new targets: Kotlin/JS, Kotlin/Wasm, and Kotlin metadata](#build-tools-api)
* **Kotlin compiler:** [`kotlinr` runner command and a separate native image](#kotlin-compiler)

> For information about the Kotlin release cycle, see [Kotlin release process](releases.md).
>
{style="tip"}

## Update to Kotlin 2.4.20

The latest version of Kotlin is included in the latest versions of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
and [Android Studio](https://developer.android.com/studio).

To update to the new Kotlin version, make sure your IDE is updated to the latest version and [change the Kotlin version](releases.md#update-to-a-new-kotlin-version)
to 2.4.20 in your build scripts.

## New features {id=new-stable-features}
<primary-label ref="stable"/>

Kotlin 2.2.20 introduced experimental support for compiling `when` expressions with `invokedynamic` on JVM 21 and later.

In Kotlin 2.4.20, the feature has now graduated to [Stable](components-stability.md#stability-levels-explained) and is
enabled by default.

For more information, see the [documentation](control-flow.md#bytecode-generation-on-the-jvm).

## New features {id=new-experimental-features}
<primary-label ref="experimental-exp"/>

The following pre-stable features are available in this release,
including those with [Beta](components-stability.md#stability-levels-explained), [Alpha](components-stability.md#stability-levels-explained), and [Experimental](components-stability.md#stability-levels-explained) status:

* [Standard library: Support for coroutine stack trace recovery](#support-for-coroutine-stack-trace-recovery)
* [Standard library: New functions to check collection elements for equality and uniqueness](#new-functions-to-check-collection-elements-for-equality-and-uniqueness)
* [Standard library: New overloads for `kotlin.test` assertion functions](#new-overloads-for-kotlin-test-assertion-functions)
* [Kotlin/Native: New Swift export features](#new-swift-export-features)
* [Kotlin/Native: Improved incremental compilation of `klib` artifacts](#improved-incremental-compilation-of-klib-artifacts)
* [Kotlin/JS: A new DSL for browser testing](#a-new-dsl-for-browser-testing)
* [Kotlin/JS: Support for exporting suspending lambdas as async functions](#support-for-exporting-suspending-lambdas-as-async-functions)
* [Build tools API: Support for Kotlin/JS, Kotlin/Wasm, and Kotlin metadata](#support-for-kotlin-js-kotlin-wasm-and-kotlin-metadata)
* [Kotlin compiler: Separate native image](#native-image)

## Standard library

Kotlin 2.4.20 adds support for coroutine stack trace recovery and introduces new functions to check collection elements
for equality and uniqueness, as well as new overloads for `kotlin.test` assertion functions.

### Support for coroutine stack trace recovery
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="standard-library"/>

Kotlin 2.4.20 adds the [`StackTraceRecoverable`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines.debug/-stack-trace-recoverable/)
interface to the standard library. This improves integration with the `kotlinx.coroutines` library because it lets you
define how to create new exception instances for stack trace recovery without adding a dependency on `kotlinx.coroutines`.

Stack trace recovery helps with debugging when one coroutine throws an exception and another rethrows it.
It lets you see where the exception originates and where another coroutine rethrows it.

The `kotlinx.coroutines` library performs stack trace recovery by creating a new exception instance with additional
coroutine stack trace information. This happens automatically for exceptions with constructors that take only an exception
message, a cause, both, or no arguments.

If an exception constructor has additional required arguments, such as a line number or an error code, implement the
`StackTraceRecoverable` interface to define how the `kotlinx.coroutines` library creates a new instance of that exception.

To implement the interface, override the [`copyForStackTraceRecovery()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines.debug/-stack-trace-recoverable/copy-for-stack-trace-recovery.html)
function. In the override, return a new exception instance for stack trace recovery, or `null` if you don't want the
`kotlinx.coroutines` library to copy the exception.

> The `StackTraceRecoverable` interface is available on all targets, but the `kotlinx.coroutines`
> library uses it for stack trace recovery only on the JVM.
>
{style="note"}

These APIs are [Experimental](components-stability.md#stability-levels-explained) and require opt-in with the
`@OptIn(ExperimentalStdlibCoroutineSupportApi::class)` annotation.

Here's an example of a custom exception that preserves a `line` property when it creates a new instance for stack trace
recovery:

```kotlin
import kotlin.coroutines.ExperimentalStdlibCoroutineSupportApi
import kotlin.coroutines.debug.StackTraceRecoverable

@OptIn(ExperimentalStdlibCoroutineSupportApi::class)
class FileEditException
// The implementation requires a private constructor
// to pass the cause to the IllegalStateException constructor
private constructor(
    val line: Int,
    private val detail: String,
    cause: Throwable?,
) : IllegalStateException("When editing line $line: $detail", cause),
    // Implements StackTraceRecoverable for stack trace recovery
    StackTraceRecoverable<FileEditException> {

    constructor(line: Int, detail: String) : this(line, detail, null)

    // Copies the line number and message details
    override fun copyForStackTraceRecovery(): FileEditException =
        FileEditException(line, detail, this)
    }

fun main() {
    val original = FileEditException(15, "Unexpected token")

    // Normally, you don't need to call this function directly unless you're testing its behavior
    // The kotlinx.coroutines library invokes it automatically during stack trace recovery
    val copy = original.copyForStackTraceRecovery()

    println(copy.message)
    // When editing line 15: Unexpected token

    println(copy.cause == original)
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.20"}

For more information, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/stdlib/KEEP-0461-stacktrace-recoverable.md).

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-86595).

### New functions to check collection elements for equality and uniqueness
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="standard-library"/>

Before Kotlin 2.4.20, if you wanted to check whether collection elements were all distinct or all equal, you had to use
inefficient code patterns.

Kotlin 2.4.20 introduces experimental functions to fill this gap:

| Function          | Checks                                                     |
|-------------------|------------------------------------------------------------|
| `allDistinct()`   | Every value in the collection is unique.                   |
| `allDistinctBy()` | Every object has a unique value for the selected property. |
| `allEqual()`      | Every value in the collection is the same.                 |
| `allEqualBy()`    | Every object has the same value for the selected property. |

You can use these functions on collections, sequences, and arrays. They compare elements using structural equality just
like other collection operations.

These functions are [Experimental](components-stability.md#stability-levels-explained) and require opt-in with the
`@OptIn(ExperimentalStdlibApi::class)` annotation or the `-opt-in=kotlin.ExperimentalStdlibApi` compiler option:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    data class Response(
        val participantId: String,
        val answer: String,
        val responseDate: String
    )

    val responses = listOf(
        Response("P001", "Yes", "2026-07-21"),
        Response("P002", "Maybe", "2026-07-21"),
        Response("P003", "No", "2026-07-21")
    )

    // Checks if all participants gave the same answer
    println(responses.allEqualBy { it.answer })
    // false

    // Checks for duplicate participants
    println(responses.allDistinctBy { it.participantId })
    // true

    // Checks if all responses were submitted on the same date
    println(responses.allEqualBy { it.responseDate })
    // true

    val answers = responses.map { it.answer }

    // Checks if answers are identical
    println(answers.allEqual())
    // false

    // Checks if answers are distinct
    println(answers.allDistinct())
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.20"}

We would appreciate your feedback in the [KEEP](https://github.com/Kotlin/KEEP/discussions/495).

### New overloads for `kotlin.test` assertion functions
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="standard-library"/>

Kotlin 2.4.20 adds new overloads for `kotlin.test` assertion functions. They accept a lambda that generates error messages
lazily, only when the assertion fails.

Previously, `kotlin.test` assertion functions like `assertTrue()` or `assertEquals()` accepted only pre-formatted error
messages built on every assertion, even when the assertion succeeded, and the message was never actually used.

The new overloads align the `kotlin.test` API with JUnit 5 and accept a message supplier through a lambda, instead of a
plain string. This improves performance, especially for the [Power-assert compiler plugin](power-assert.md), which
generates detailed error messages for assertions.

The new overloads are available for the following assertion functions:

| Function                               | Description                                                                                                                    |
|----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| `assertTrue()` / `assertFalse()`       | Checks whether the value is `true` or `false`.                                                                                 |
| `assertEquals()` / `assertNotEquals()` | Checks whether the values are equal or not.                                                                                    |
| `assertSame()` / `assertNotSame()`     | Checks whether the values refer to the same instance.                                                                          |
| `assertIs()` / `assertIsNot()`         | Checks whether the value is of the specified type. For `assertIs()`, the function smart-casts it to that type.                 |
| `assertNull()`                         | Checks whether the value is `null`.                                                                                            |
| `assertContains()`                     | Checks whether the element (key, character, substring, or regex) is present in the collection, array, sequence, range, or map. |
| `assertContentEquals()`                | Checks whether the collections, sequences, or arrays contain equal elements in the same order.                                 |

To use the new API, explicitly opt in with the `@OptIn(ExperimentalKotlinTestApi::class)` annotation:

```kotlin
import kotlin.test.ExperimentalKotlinTestApi
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@OptIn(ExperimentalKotlinTestApi::class)
fun testValues(actual: Int, expected: Int, items: List<String>) {
    // The message is built only if the assertion fails
    assertTrue(actual > 0) { "Expected a positive value but got $actual" }

    // Avoids formatting the list unless the assertion fails
    assertEquals(expected, actual) { "Unexpected value for items: ${items.joinToString()}" }
}
```

For more information, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/stdlib/KEEP-0465-kotlin.test-lazy-assertion-messages.md).

## Kotlin/Native

Kotlin 2.4.20 brings automatic generation of `Package.swift` files for SwiftPM dependencies in Kotlin Multiplatform projects,
new Swift export features, including support for sealed classes and cross-language inheritance, and improved incremental
compilation.

### Generated `Package.swift` for SwiftPM dependencies
<secondary-label ref="native"/>

When exporting an XCFramework that depends on SwiftPM packages, you must publish the resulting SwiftPM package for it to
resolve correctly. To help with this, the `assembleSharedXCFramework` Gradle task now generates a `Package.swift` file to
be distributed along with the XCFramework.

For details, see the [SwiftPM export page](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-export.html).

### New Swift export features
<primary-label ref="alpha"/>
<secondary-label ref="native"/>

#### Sealed classes

Kotlin 2.4.20 adds support for sealed classes and interfaces to Swift export.

Previously, you had to write a `default` case for every `switch` statement
over a sealed type. Now, sealed hierarchies defined in Kotlin are mapped to Swift enums, enabling exhaustive `switch`
statements with full autocompletion in Xcode.

Swift export generates a `sealedType()` method on each sealed type. This method returns a Swift enum whose cases match
the direct subclasses of the sealed hierarchy. You can nest these calls to match deeper levels of the hierarchy.

For example, declare a sealed interface with a class hierarchy in Kotlin:

```kotlin
// Kotlin
sealed interface Shape

class Circle : Shape {
    override fun toString(): String = "Circle"
}

class Rectangle : Shape {
    override fun toString(): String = "Rectangle"
}

fun createCircle(): Shape = Circle()
```

On the Swift side, you can use an exhaustive `switch` without a `default` case:

```swift
// Swift
let shape = createCircle()

let name = switch shape.sealedType() {
    case let .circle(type): "It's a \(type.value)"
    case let .rectangle(type): "It's a \(type.value)"
}
// name == "It's a Circle"
```

Because the `switch` is exhaustive, the compiler warns you if a new subclass is added to the sealed hierarchy, so you can
handle it immediately instead of relying on a `default` case.

#### Cross-language inheritance in Swift export

Kotlin 2.4.20 introduces cross-language inheritance support in Swift export.

A common use case for this feature is the [reverse import](native-lib-import-stability.md#swift-library-import) pattern,
where you define a contract in Kotlin and provide platform-specific implementations on the Swift side. This is especially
useful when you need to use pure Swift libraries that can't be directly imported into Kotlin.

To implement the pattern, declare a Kotlin superclass for the Swift implementation to inherit from and a Kotlin interface.
Then implement this interface in Swift and pass the Swift object to Kotlin functions that accept that interface.
For example, for the CryptoKit library:

1. On the Kotlin side, declare an interface, a function that accepts it, and an `open` base class:

   ```kotlin
   // Kotlin
   interface CryptoProvider {
       fun hashMD5(input: String): String
   }

   fun processHash(provider: CryptoProvider, input: String): String = provider.hashMD5(input)

   open class SwiftBase
   ```

2. On the Swift side, inherit from the exported `SwiftBase` class, implement the interface using a pure Swift library,
   and pass the object back to Kotlin:

   ```swift
   // Swift
   import CryptoKit

   final class IosCryptoProvider: SwiftBase, CryptoProvider {
       func hashMD5(input: String) -> String {
           guard let data = input.data(using: .utf8) else { return "failed" }
           return Insecure.MD5.hash(data: data).description
       }
   }

   let provider = IosCryptoProvider()

   // Calls the Kotlin function, which calls hashMD5() back in Swift
   print(processHash(provider: provider, input: "Hello, world!"))
   ```

When Kotlin receives a Swift object, it treats it like an implementation of a regular interface, calling the Swift code directly.

For more details on Swift export, see our [documentation](native-swift-export.md).

### Improved incremental compilation of `klib` artifacts
<primary-label ref="beta"/>
<secondary-label ref="native"/>

Kotlin 2.4.20 brings stabilization improvements to incremental compilation of `klib` artifacts, which is now [in Beta](components-stability.md#kotlin-native).

This optimization was first introduced in [Kotlin 1.9.20](whatsnew1920.md#incremental-compilation-of-klib-artifacts) and
proved to drastically reduce compilation time for debug builds. Since then, we've fixed a number of bugs and improved performance.

To try out incremental compilation, add the following option to your `gradle.properties` file:

```properties
kotlin.incremental.native=true
```

We're actively collecting feedback and planning to enable incremental compilation by default for all projects in the next
Kotlin releases. If you encounter any issues, please report them to our [issue tracker](https://kotl.in/issue).

## Kotlin/Wasm

Kotlin 2.4.20 changes how Kotlin/Wasm handles top-level `require()` calls in `@JsFun` declarations, aligns companion
object initialization order with JVM behavior, reduces binary size for functional interfaces, introduces new compilation
modes, and adds support for Wasmtime as a runtime for the `wasmWasi` target in the Kotlin Gradle plugin.

### Changes to top-level `require()` calls in `@JsFun` declarations
<secondary-label ref="wasm"/>

Kotlin/Wasm now reports an error when a `@JsFun` declaration uses the top-level `require()` function.

Previously, the compiler generated a `require` variable in the `import-object.mjs` file, allowing `@JsFun` declarations
to call `require()`.

This behavior unintentionally exposed a compiler implementation detail. To support migration away from it, Kotlin/Wasm
removes this generated `require` declaration, and the compiler now reports errors for such calls. For example:

```kotlin
// Reports an error
@JsFun("(mod) => require(mod)")
external fun loadModule(mod: String): JsAny
```

To prepare for this change, replace top-level `require()` calls in `@JsFun` declarations with the `@JsModule` annotation:

```kotlin
@JsModule("module")
external val module: Module

external interface Module {
    // Defines the expected module members
}
```

For dynamic module loading, use the `import()` expression instead.
Add the `/* webpackIgnore: true */` magic comment to prevent webpack from parsing the dynamic import:

```kotlin
@JsFun("""
    ((module) => () => module)(
        await import(/* webpackIgnore: true */ "module")
    )
""")
private external fun loadModuleDynamically(): JsAny?
```

You can also use the `import()` expression conditionally. For example, you can load a module only when running in Node.js:

```kotlin
@JsFun("""
    ((module) => () => module)(
        ((typeof process !== "undefined") && (process.release.name === "node"))
            ? await import(/* webpackIgnore: true */ "module")
            : null
    )
""")
private external fun loadNodeModule(): JsAny?
```

If your project relies on dependencies that require a top-level `require()` function, add it as a property of `globalThis` as a workaround:

```kotlin
@JsFun("""
    ((module) => {
        globalThis.require = module.default.createRequire(import.meta.url)
        return () => {}
    })(await import("node:module"))
""")
external fun defineRequire()
```

If you run into any issues, share your feedback in our [issue tracker](https://youtrack.jetbrains.com/issue/KT-86192).

### Improved companion object initialization order
<secondary-label ref="wasm"/>

Kotlin/Wasm now initializes superclass companion objects before subclass companion objects, matching the JVM behavior.
Previously, the initialization could be reversed, leading to inconsistent behavior across platforms.

The update improves cross-platform consistency and reduces platform-specific differences in class initialization behavior.
It also enables correct handling of companion object initialization in deeper inheritance hierarchies, including cases
where intermediate classes don't declare companion objects.

### Support for Wasmtime in the Kotlin Gradle plugin
<secondary-label ref="wasm"/>

Kotlin 2.4.20 introduces support for [Wasmtime](https://docs.wasmtime.dev/) as a runtime for the `wasmWasi` target in
the Kotlin Gradle plugin.

Previously, the `wasmWasi` target supported only the Node.js runtime, which required a JavaScript bootstrap to run WASI
applications. With Wasmtime support, you can now run Kotlin/Wasm applications on a standalone WebAssembly runtime.

To use Wasmtime as the runtime for the `wasmWasi` target, add `wasmtime()` to your Gradle build file:

```kotlin
kotlin {
    wasmWasi {
        wasmtime()
    }
}
```

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-86633).

### New compilation modes
<secondary-label ref="wasm"/>

Kotlin 2.4.20 adds support for selecting a Kotlin/Wasm compilation mode, including new multi-module modes. Previously,
the compiler used the monolith compilation mode, which compiles the project and its dependencies together and generates
a single binary. This lets the compiler perform dead code elimination and produce the smallest output.

You can now select one of the following compilation modes:

| Compilation mode           | Compilation                                                                      | Output                                         | Optimization behavior                                                                                      |
|----------------------------|----------------------------------------------------------------------------------|------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| `monolith` (default)       | Compiles the project and its dependencies together.                              | A single binary                                | Removes unreachable declarations and applies optimizations for the entire program, including dependencies. |
| `multimodule-open-world`   | Compiles each module independently and recompiles only modules that change.      | A separate, independent binary for each module | Doesn't apply cross-module optimizations, which results in larger binaries.                                |
| `multimodule-closed-world` | Processes all modules in one invocation and recompiles only modules that change. | Separate binaries that depend on each other    | Removes unreachable declarations but optimizes each Wasm binary independently.                             |

To select a compilation mode, add the `kotlin.wasm.compilationMode` property to your `gradle.properties` file:

```properties
kotlin.wasm.compilationMode=multimodule-open-world
```

You can also configure Kotlin/Wasm to use closed-world multi-module compilation for development builds and monolith
compilation for production builds. This reduces recompilation time during development and produces the smallest output
for production builds.

To use this configuration, add the following property to your `gradle.properties` file:

```properties
kotlin.wasm.compilationMode=multimodule-closed-world-only-in-dev
```

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-86919).

### Reduced binary size for lambdas and functional interfaces
<secondary-label ref="wasm"/>

Kotlin 2.4.20 changes how Kotlin/Wasm compiles lambdas and functional interfaces.
Instead of generating separate anonymous classes, the compiler now generates functions and uses shared base classes.

Tests with the [KotlinConf application](https://github.com/JetBrains/kotlinconf-app) show that this change reduces Wasm
binary size by approximately 5–10%.

Because the change introduces more dynamic calls, it may affect runtime performance.
If you experience any issues, report them in our [issue tracker](https://youtrack.jetbrains.com/issue/KT-83159).

## Kotlin/JS

Kotlin 2.4.20 improves exportability of data classes, introduces a new experimental DSL for browser testing, and adds
support for exporting suspending lambdas as JavaScript async functions.

### Consistent exportability of synthetic functions on exported data classes
<secondary-label ref="js"/>

Kotlin 2.4.20 fixes an issue which prevented the `@JsExport.Ignore` annotation from being properly applied to data class
properties.

Previously, when you marked a data class with the `@JsExport` annotation, the compiler still reported warnings about the
data class exportability because of the automatically generated `copy()` and `componentN()` functions. This happened even
if the constructor and the properties were explicitly marked as ignored with `@JsExport.Ignore`.

For example, consider a `Session` data class exported to JavaScript that also has a reference to an internal `DatabaseConnection`
type that isn't meant to be exported:

```kotlin
// Kotlin
// An internal type that isn't exported to JavaScript
class DatabaseConnection

@JsExport
data class Session @JsExport.Ignore constructor(
    val userId: String,
    @JsExport.Ignore val connection: DatabaseConnection,
)
```

Now that the issue is fixed, the compiler accounts for `@JsExport.Ignore` annotations, so `Session`'s synthetic `copy()`
and `componentN()` functions no longer trigger warnings about the non-exported type `DatabaseConnection`. This aligns
with the visibility rules introduced by the [`@ConsistentCopyVisibility` and `@ExposedCopyVisibility` annotations](whatsnew2020.md#data-class-copy-function-to-have-the-same-visibility-as-constructor).

### A new DSL for browser testing
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="js"/>

Kotlin 2.4.20 introduces a new experimental DSL for running Kotlin/JS tests in a browser environment.

Currently, the Kotlin Gradle plugin uses [Karma](https://github.com/karma-runner/karma) as a browser launcher to run
JavaScript tests across different browsers. The Karma project has been deprecated for two years now, which has led us to
explore alternative ways to support browser testing.

The new DSL is intended to replace Karma as a manager of different tools under the hood and includes:

* [Playwright](https://playwright.dev/) as a browser driver and a distribution manager that supports the Chromium, Firefox,
  and WebKit (Safari) browser engines.
* [Mocha](https://mochajs.org/) as a test runner.
* [webpack](https://webpack.js.org/) as a bundler (will be replaced with [Vite](https://vite.dev/) in [future releases](https://youtrack.jetbrains.com/issue/KT-48308/)).

To try out the new DSL for browser testing, add the opt-in `test {}` block inside `browser {}` for your Kotlin/JS target:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalJsTestDsl
import kotlin.time.Duration.Companion.seconds

kotlin {
    js {
        browser {
            // Add and configure the new test {} block
            @OptIn(ExperimentalJsTestDsl::class)
            test {
                // Configure default timeout for all runners
                timeout = 2.seconds
                // Configure headless mode using Gradle providers
                headless = providers
                    .environmentVariable("IS_IN_CI")
                    .map { it.toBoolean() }
                    .orElse(false)
                // Enable and configure Chromium test runner
                chromium {
                    // Override the common timeout option
                    timeout = 5.seconds
                    // Add extra launch arguments
                    launchArgs.add("--no-sandbox")
                }
                // Enable Firefox test runner
                firefox()
                // Enable WebKit test runner
                webkit()
                // Enable and configure an additional WebKit test runner
                webkit("noheadless") {
                    // Set up custom options
                    headless = false
                }
            }
        }
    }
}
```

The new DSL for browser testing is in active development. We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-66897).

For more information, see [Run tests in Kotlin/JS](js-running-tests.md).

### Support for exporting suspending lambdas as async functions
<primary-label ref="experimental-general"/>
<secondary-label ref="js"/>

With Kotlin 2.4.20, you can now export suspending [lambda expressions](lambdas.md#lambda-expressions-and-anonymous-functions)
as JavaScript `async` functions.

Previously, there was no way to export declarations containing suspending lambdas from Kotlin/JS libraries. Now the Kotlin
compiler automatically handles the bridging between Kotlin's `suspend` functions and JavaScript's native [`async`/`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
model, which is useful for mixed Kotlin/TypeScript codebases.

To enable this feature, add the following compiler option to your `build.gradle.kts` file:

```kotlin
kotlin {
    js {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions {
                    freeCompilerArgs.add("-Xsuspend-lambda-exporting")
                }
            }
        }
    }
}
```

Then, mark the relevant declarations with `@JsExport`:

```kotlin
// Kotlin
@JsExport
class TaskRunner {
    suspend fun runTask(task: suspend () -> String): String {
        return task()
    }
}
```

From the TypeScript side, the suspending lambda appears as a regular `async` function:

```typescript
// TypeScript
import { TaskRunner } from "..."

const runner = new TaskRunner();
const result = await runner.runTask(async () => "done");
console.log(result); // "done"
```

For more information on the `@JsExport` annotation, see [our documentation](js-to-kotlin-interop.md#jsexport-annotation).

## Gradle

Kotlin 2.4.20 is fully compatible with Gradle 7.6.3 through 9.7.0. You can also use Gradle versions up to the latest Gradle
release. However, be aware that doing so may result in deprecation warnings, and some new Gradle features might not work.

Kotlin 2.4.20 also comes with an improved integration with the Problems API.

### Improved reporting in Problems API
<secondary-label ref="gradle"/>

Kotlin 2.2.0 was the first release in which the [Kotlin Gradle Plugin (KGP) integrated with Gradle's Problems API](whatsnew22.md#integration-of-problems-api-within-kgp-diagnostics).
Kotlin 2.4.0 added support for [writing compiler messages to the Problems API for Kotlin/JVM](whatsnew24.md#compiler-messages-written-to-problems-api-for-kotlin-jvm).

Kotlin 2.4.20 adds compiler diagnostic IDs to the information that the compiler passes to the [Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html).
It also groups diagnostics by these IDs, making it easier to identify the source of compilation problems.

Starting with Gradle 8.6, the KGP enables this integration by default. As the API is still evolving, use the most recent
Gradle version to benefit from the latest improvements.

## Build tools API

Kotlin 2.4.20 adds experimental support for Kotlin/JS, Kotlin/Wasm, and Kotlin metadata to the build tools API.

### Support for Kotlin/JS, Kotlin/Wasm, and Kotlin metadata
<primary-label ref="experimental-general"/>
<secondary-label ref="bta"/>

In [Kotlin 2.2.0](whatsnew22.md#new-experimental-build-tools-api), the build tools API (BTA) became available for
Kotlin/JVM. Kotlin 2.4.20 takes the next step toward BTA stabilization by adding support for new targets: Kotlin/JS,
Kotlin/Wasm, and Kotlin metadata.

This makes the Kotlin Gradle plugin interact with the compiler more consistently. In some cases, you can also benefit
from faster, more stable compilation.

The BTA is a universal API that acts as an abstraction layer between build systems and the Kotlin compiler ecosystem.
It helps support Kotlin features and compatibility with the Kotlin compiler in available build tools.

In Kotlin 2.4.20, BTA is available as an opt-in for the new targets. To try it out, add the corresponding properties to
your `gradle.properties` file:

```properties
kotlin.wasm.runViaBuildToolsApi=true
kotlin.js.runViaBuildToolsApi=true
kotlin.metadata.runViaBuildToolsApi=true
```

Starting with Kotlin 2.5.0, we plan to enable BTA in Kotlin/JS, Kotlin/Wasm, and Kotlin metadata by default.

If you're curious about the BTA proposal or want to share your feedback, see this [KEEP](https://github.com/Kotlin/KEEP/blob/build-tools-api/proposals/extensions/build-tools-api.md).

## Kotlin compiler

Kotlin 2.4.20 includes an update about the changed Kotlin runner command, `kotlinr`, and introduces an experimental
Kotlin compiler native image.

### Changed the Kotlin runner command from `kotlin` to `kotlinr`
<secondary-label ref="compiler"/>

The `kotlinr` command replaces `kotlin` as the Kotlin runner command to avoid a naming conflict with the `kotlin` command
in the [Kotlin Toolchain](https://kotlin-toolchain.org/latest/). The Kotlin runner also warns you when you use the `kotlin`
command and recommends `kotlinr` instead.

### Native image
<primary-label ref="experimental-general"/>
<secondary-label ref="compiler"/>

Kotlin 2.4.20 features the first [Experimental](components-stability.md#stability-levels-explained) release of the Kotlin
compiler native image. The native image provides a drop-in replacement for the standard `kotlinc` command-line tool,
while offering faster startup time and higher performance.

To try out the native image, download the build from [GitHub Releases](https://github.com/JetBrains/kotlin/releases/tag/v2.4.20).

The native image also bundles the following compiler plugins you can use with the `-Xplugin` or `-Xcompiler-plugin` CLI options:

* [Serialization](serialization.md)
* [Compose compiler](compose-compiler-options.md)
* [All-open](all-open-plugin.md)
* [`no-arg`](no-arg-plugin.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Assignment](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.assignment)
* [Lombok](lombok.md)
* [Power-assert](power-assert.md)

For more information on the Kotlin compiler native image, see its [README](https://github.com/JetBrains/kotlin/blob/master/prepare/compiler-native-image/README.md).

## Breaking changes and deprecations

This section highlights important breaking changes and deprecations. For a complete overview, see our [Compatibility guide](compatibility-guide-24.md).

* Since Apple is dropping support for its 32-bit watchOS targets, the `watchosArm32` [Kotlin/Native](native-target-support.md)
  target is now deprecated. It's planned for removal in Kotlin 2.5.0 to ensure compatibility with Xcode 27.
* Starting with Kotlin 2.4.20, the Kotlin/Native compiler prohibits AtomicFU atomic operations inside a `public` inline
  function or inside an `internal` inline function called from another file.
* Kotlin 2.4.20 updates the npm dependency for webpack to 5.108.1. This can affect your project in two ways:
  * webpack has moved its built-in minimizer dependency from `terser-webpack-plugin` to the broader [`minimizer-webpack-plugin`](https://www.npmjs.com/package/minimizer-webpack-plugin).
    Terser remains the default JavaScript minimizer, but if your project configures or depends on `terser-webpack-plugin`
    directly, you may need to update its configuration.
  * webpack no longer ignores `import.meta` when determining a JavaScript file's module type. If `import.meta` is present,
    webpack treats the file as an ES module, which can break files that also use CommonJS constructs. For Kotlin/JS, you
    can [configure the target to use ES modules with the `useEsModules()` Gradle DSL](js-modules.md#choose-the-target-module-system).
    Kotlin/Wasm should work in most cases without additional configuration. If you encounter an `import.meta` error with
    Kotlin/Wasm, check whether your project's sources or a direct or transitive dependency uses `import.meta`. Update
    your own code as needed. If a dependency causes the issue, update it to a compatible version if one is available,
    or report the issue to the library maintainers.
* Starting with Kotlin 2.4.20, Kotlin/Wasm deprecates the generated JavaScript `wasmExports` API. The compiler prohibits
  access to all exports except `wasmExports.memory`, which remains temporarily available with a warning. Use the
  `kotlin.wasm.unsafe.wasmMemory` property to access the module's `WebAssembly.Memory` object.

## Documentation updates

Since the last release, we've created new pages and tutorials for the Kotlin ecosystem documentation and revamped existing ones:

* [Configure an iOS delivery pipeline](https://kotlinlang.org/docs/multiplatform/ios-ci-cd-teamcity.html) – Set up
  continuous delivery for a Kotlin Multiplatform iOS app with TeamCity.
* Compose Multiplatform updates:
  * [Popups](https://kotlinlang.org/docs/multiplatform/compose-popups.html) – Learn how to create and configure popups in
    Compose Multiplatform.
  * [Window and dialog API v2](https://kotlinlang.org/docs/multiplatform/compose-desktop-top-level-windows-management.html#window-and-dialog-api-v2)
    – Explore the new API for managing desktop windows and dialogs in Compose Multiplatform.
  * [Tray and notifications](https://kotlinlang.org/docs/multiplatform/compose-desktop-tray.html) – Learn how to add an
    application icon to the system tray and send system notifications in Compose Multiplatform for desktop.
  * [Menu bar](https://kotlinlang.org/docs/multiplatform/compose-desktop-menu-bar.html) – Learn how to create a menu bar
    for a specific window in Compose Multiplatform for desktop.
  * [Drag and drop](https://kotlinlang.org/docs/multiplatform/compose-drag-drop.html#platform-specific-data-handling)
    – Handle platform-specific data when implementing drag and drop in Compose Multiplatform.
  * [UIKit alternative for Liquid Glass](https://kotlinlang.org/docs/multiplatform/ios-liquid-glass.html#alternative-skip-swiftui-and-drive-uikit-from-kotlin)
    – Explore an alternative approach to Liquid Glass that uses UIKit navigation instead of SwiftUI.
  * [MCP server for AI agents](https://kotlinlang.org/docs/multiplatform/compose-hot-reload.html#mcp-server-for-ai-agents)
    – Learn how to use the MCP server in Compose Hot Reload to connect AI agents to your development workflow.
* [Caching with Spring](https://spring.io/guides/gs/caching) – Learn how to add caching to a Spring application with new
  Kotlin examples.
* [Exposed IntelliJ IDEA plugin](https://www.jetbrains.com/help/idea/exposed.html) – Learn how to work with Exposed in
  IntelliJ IDEA using code completion, database-aware inspections, and live templates.
* [Kotlin serialization](serialization.md) – Learn how to serialize Kotlin data, customize JSON structure and type
  representation, and work with more advanced serialization scenarios.
* [Flow](coroutines-flow.md) and [Flow operators](coroutines-flow-operators.md) – Learn how to create and collect cold
  and hot flows, handle exceptions, and use a wide range of flow operators.
<!-- * [Debug coroutines](coroutines-debugging.md) – Learn how to debug coroutines on the JVM using debug mode, stack trace
  recovery, and the debug agent. -->
* Lincheck – Learn how [model checking](lincheck-model-checking.md) works in Lincheck, how to use [operation execution options](lincheck-operation-execution-options.md),
  and how to [verify](lincheck-results-validation.md) the test results.
* [kapt compiler plugin](kapt.md) – Learn how to configure the kapt compiler plugin in Gradle, Maven, and the command-line
  compiler.
* [Code quality tools in Kotlin projects](jvm-code-analysis.md) – Explore tools for analyzing JVM bytecode and Kotlin code.
* [Power-assert plugin with Maven](jvm-test-maven.md#get-detailed-failure-messages) – Learn how to use the Power-assert
  plugin to get more detailed test failure messages.
* [Multiple-round processing with KSP](ksp-multi-round.md) – Explore how KSP works across multiple processing rounds,
  including generated files, deferred symbols, and validation.
* Non-denotable types – Learn about [platform types](java-interop.md#null-safety-and-platform-types), [captured types](generics.md#captured-types),
  and [intersection types](typecasts.md#intersection-types) in Kotlin.
* [Type aliases](type-aliases.md) – Learn about type alias scope and visibility.
* [This expressions](this-expressions.md) – Learn how implicit `this` is resolved and when to use `this` explicitly to
  refer to a receiver.
* [Strings](strings.md) – Learn about string templates, common string operations, building strings, and type conversion.
* [Packages and imports](packages.md) – Learn how to organize Kotlin code using packages and imports.
