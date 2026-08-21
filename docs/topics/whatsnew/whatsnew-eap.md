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

* **Standard library:** [Support for coroutine stack trace recovery and new features for checking equality and uniqueness of collection elements](#standard-library)
* **Kotlin/Native:** [Incremental compilation of `klib` artifacts enabled by default, new Swift export features, and the first Kotlin compiler native image](#kotlin-native)
* **Kotlin/Wasm:** [Changes to top-level `require()` calls in `@JsFun` declarations, improved companion object initialization order, and support for Wasmtime in the Kotlin Gradle plugin](#kotlin-wasm)
* **Kotlin/JS:** [New DSL for browser-testing and support for exporting suspend lambdas as async functions](#kotlin-js)
* **Build tools API:** [Support for new targets: Kotlin/JS, Kotlin/Wasm, and Kotlin metadata](#build-tools-api)

> For information about the Kotlin release cycle, see [Kotlin release process](releases.md).
>
{style="tip"}

## Update to Kotlin %kotlinEapVersion%

The latest version of Kotlin is included in the latest versions of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
and [Android Studio](https://developer.android.com/studio).

To update to the new Kotlin version, make sure your IDE is updated to the latest version and [change the Kotlin version](releases.md#update-to-a-new-kotlin-version)
to %kotlinEapVersion% in your build scripts.

## New features {id=new-experimental-features}
<primary-label ref="experimental-exp"/>

The following pre-stable features are available in this release.
This includes features with [Beta](components-stability.md#stability-levels-explained), [Alpha](components-stability.md#stability-levels-explained), and [Experimental](components-stability.md#stability-levels-explained) status:

* [Standard library: Support for coroutine stack trace recovery](#support-for-coroutine-stack-trace-recovery)
* [Standard library: New functions to check collection elements for equality and uniqueness](#new-functions-to-check-collection-elements-for-equality-and-uniqueness)
* [Kotlin/Native: separate Kotlin compiler image](#kotlin-compiler-native-image)
* [Kotlin/JS: New DSL for browser-testing](#new-dsl-for-browser-testing)
* [Build tools API: Support for Kotlin/JS, Kotlin/Wasm, and Kotlin metadata](#build-tools-api)

## Standard library

Kotlin %kotlinEapVersion% adds support for coroutine stack trace recovery and introduces new functions to check
collection elements for equality and uniqueness.

### Support for coroutine stack trace recovery
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% adds the `StackTraceRecoverable` interface to the standard library.
This improves integration with the `kotlinx.coroutines` library because it lets you define how to create new exception
instances for stack trace recovery without adding a dependency on `kotlinx.coroutines`.

Stack trace recovery helps with debugging when one coroutine throws an exception, and another rethrows it.
It lets you see where the exception originates and where another coroutine rethrows it.

The `kotlinx.coroutines` library performs stack trace recovery by creating a new exception instance with additional
coroutine stack trace information. This happens automatically for exceptions with constructors that take only an
exception message, a cause, both, or no arguments.

If an exception constructor has additional required arguments, such as a line number or an error code, implement the
`StackTraceRecoverable` interface to define how the `kotlinx.coroutines` library creates a new instance of that exception.

To implement the interface, override the `copyForStackTraceRecovery()` function. This function returns a new exception
instance for stack trace recovery, or `null` if you don't want the `kotlinx.coroutines` library to copy the exception.

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
import kotlin.coroutines.StackTraceRecoverable

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

@OptIn(ExperimentalStdlibCoroutineSupportApi::class) 
fun main() {
    val original = FileEditException(15, "Unexpected token")
    val copy = original.copyForStackTraceRecovery()

    println(copy.message)
    // When editing line 15: Unexpected token

    println(copy.cause == original)
    // true
}
```

For more information, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/stdlib/KEEP-0461-stacktrace-recoverable.md).
We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-86595).

### New functions to check collection elements for equality and uniqueness
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="standard-library"/>

Before Kotlin %kotlinEapVersion%, if you wanted to check whether collection elements were all distinct or all equal,
you had to use inefficient code patterns.

Kotlin %kotlinEapVersion% introduces experimental functions to fill this gap:

| Function           | Checks                                                     |
|--------------------|------------------------------------------------------------|
| `.allDistinct()`   | Every value in the collection is unique.                   |
| `.allDistinctBy()` | Every object has a unique value for the selected property. |
| `.allEqual()`      | Every value in the collection is the same.                 |
| `.allEqualBy()`    | Every object has the same value for the selected property. |

You can use these functions on collections, sequences, and arrays. They compare elements using structural equality
just like other collection operations.

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

We would appreciate hearing your feedback on your experience with these functions in [YouTrack](https://youtrack.jetbrains.com/issue/KT-30270).

## Kotlin/Native

Kotlin %kotlinEapVersion% enables incremental compilation of `klib` artifacts by default, brings new Swift export
features, including support for sealed classes and cross-language inheritance, and introduces the first release of the
Kotlin compiler native image.

### Incremental compilation enabled by default
<secondary-label ref="native"/>

Starting with %kotlinEapVersion%, incremental compilation of `klib` artifacts is enabled by default.

With incremental compilation, if only a part of the `klib` artifact produced by the project module changes, only the affected part
of the `klib` is further recompiled into a binary.

This optimization was first introduced in [Kotlin 1.9.20](whatsnew1920.md#incremental-compilation-of-klib-artifacts)
and has proven to drastically reduce compilation time for debug builds.

Note that in some cases, this optimization may come with a performance cost for clean builds.

If you face unexpected problems with this feature, you can disable it manually. To do that, set the following option
in your `gradle.properties` file:

```none
kotlin.incremental.native=false
```

Please report any problems to our issue tracker [YouTrack](https://kotl.in/issue). For more tips on improving compilation
time, see our [documentation](native-improving-compilation-time.md).

### New Swift export features
<secondary-label ref="native"/>

#### Sealed classes

Kotlin %kotlinEapVersion% adds support for sealed classes and interfaces to Swift export.

Previously, you had to write a `default` case for every `switch` statement
over a sealed type. Now, sealed hierarchies defined in Kotlin are mapped to Swift enums, enabling exhaustive `switch`
statements with full autocompletion in Xcode.

Swift export generates a `.sealedType()` method on each sealed type. This method returns a Swift enum whose cases match
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

Kotlin %kotlinEapVersion% introduces cross-language inheritance support to Swift export.

A common use case for this feature is the [reverse import](native-lib-import-stability.md#swift-library-import) pattern,
where you define a contract in Kotlin and provide platform-specific implementations on the Swift side.

For example, you can declare a Kotlin interface, implement it in Swift, and then pass the Swift object to Kotlin functions
that accept that interface. This is especially useful when you need to use pure Swift libraries that can't be directly
imported into Kotlin.

For example, declare a Kotlin interface and a function that accepts it:

```kotlin
// Kotlin
interface CryptoProvider {
   fun hashMD5(input: String): String
}

fun processHash(provider: CryptoProvider, input: String): String = provider.hashMD5(input)
```

On the Swift side, implement this interface using a pure Swift library and pass it back to Kotlin:

```swift
// Swift
import CryptoKit

class IosCryptoProvider: KotlinBase & CryptoProvider {
   func hashMD5(input: String) -> String {
       guard let data = input.data(using: .utf8) else { return "failed" }
       return Insecure.MD5.hash(data: data).description
   }
}

let provider = IosCryptoProvider()

// The call is dispatched to the Swift implementation
print(processHash(provider: provider, input: "Hello, world!"))
```

When Kotlin receives a Swift object, it treats it like an implementation of a regular interface, executing Swift code.

For more details on Swift export, see our [documentation](native-swift-export.md).

### Generated `Package.swift` for SwiftPM dependencies
<secondary-label ref="native"/>

When exporting an XCFramework that depends on SwiftPM packages, you must publish the resulting SwiftPM package for it to
resolve correctly. To help with this, the `assembleSharedXCFramework` Gradle task now generates a `Package.swift` file
to be distributed along with the XCFramework.

For details, see the [SwiftPM export page](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-export.html).

### Kotlin compiler native image
<primary-label ref="experimental-general"/>
<secondary-label ref="native"/>

Kotlin %kotlinEapVersion% features the first [Experimental](components-stability.md#stability-levels-explained) release of
the Kotlin compiler native image. The native image provides a drop-in replacement for the standard `kotlinc` command-line tool,
while offering faster startup time and higher performance.

To try out the native image, download the build from [GitHub Releases](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).

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

## Kotlin/Wasm

Kotlin %kotlinEapVersion% changes how Kotlin/Wasm handles top-level `require()` calls in `@JsFun` declarations,
aligns companion object initialization order with JVM behavior, and adds support for Wasmtime as a runtime for the
`wasmWasi` target in the Kotlin Gradle plugin.

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

If your project relies on dependencies that require a top-level `require()` function, add it as a property of
`globalThis` as a workaround:

```kotlin
@JsFun("""
    ((module) => {
        globalThis.require = module.default.createRequire(import.meta.url)
        return () => {}
    })(await import("node:module"))
""")
external fun defineRequire()
```

If you run into any issues, share your feedback in our [issue tracker](https://youtrack.jetbrains.com/projects/KT/issues/KT-86192).

### Improved companion object initialization order
<secondary-label ref="wasm"/>

Kotlin/Wasm now initializes superclass companion objects before subclass companion objects, matching the JVM behavior.
Previously, the initialization could be reversed, leading to inconsistent behavior across platforms.

The update improves cross-platform consistency and reduces platform-specific differences in class initialization behavior.
It also enables correct handling of companion object initialization in deeper inheritance hierarchies, including cases
where intermediate classes don't declare companion objects.

### Support for Wasmtime in the Kotlin Gradle plugin
<secondary-label ref="wasm"/>

Kotlin %kotlinEapVersion% introduces support for [Wasmtime](https://docs.wasmtime.dev/) as a runtime for the `wasmWasi`
target in the Kotlin Gradle plugin.

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

## Kotlin/JS

Kotlin %kotlinEapVersion% introduces a new experimental DSL for browser testing and adds support for exporting suspend
lambdas as JavaScript async functions.

### New DSL for browser-testing
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="js"/>

Kotlin %kotlinEapVersion% introduces a new experimental DSL for running Kotlin/JS tests in a browser environment.

Currently, the Kotlin Gradle plugin uses [Karma](https://github.com/karma-runner/karma) as a browser launcher to run
JavaScript tests across different browsers. The Karma project has been deprecated for 2 years now, which made us explore
alternative ways to support browser testing.

The new DSL is intended to replace Karma as a manager of different tools under the hood and includes:

* [Mocha](https://mochajs.org/) as a test runner.
* [Webpack](https://webpack.js.org/) as a bundler (will be replaced with [Vite](https://vite.dev/)
  in [future releases](https://youtrack.jetbrains.com/issue/KT-48308/)).
* [Playwright](https://playwright.dev/) as a browser driver and a distribution manager that supports Chromium, Firefox,
  and WebKit (Safari) browser engines.

To try out the new testing DSL, add the opt-in `test{}` block inside `browser{}` for your Kotlin/JS target:

```kotlin
kotlin {
    js {
        browser {
            @OptIn(ExperimentalJsTestDsl::class)
            // Add and configure the new test{} block
            test {
                // Set up options common for all browsers
                browserDefaults {
                    timeout = Duration.ofSeconds(2)
                    headless = true
                }
                // Enable Chromium test runner
                chromium {
                    // Override the common timeout option
                    timeout = Duration.ofSeconds(5)
                    launchArgs.add("--no-sandbox")
                }
                // Enable Firefox test runner
                firefox()
                // Enable WebKit test runner
                webkit { }
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

The new DSL is in active development. We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-66897).

### Support for exporting suspend lambdas as async functions
<secondary-label ref="js"/>

With Kotlin %kotlinEapVersion%, you can now export suspend lambdas as JavaScript async functions.

Previously, there was no way to export declarations containing suspend lambdas from Kotlin/JS libraries. Now the Kotlin
compiler automatically handles the bridging between Kotlin's suspend functions and native JavaScript's [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
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

From the TypeScript side, the suspend lambda appears as a regular async function:

```typescript
// TypeScript
import { TaskRunner } from "..."

const runner = new TaskRunner();
const result = await runner.runTask(async () => "done");
console.log(result); // "done"
```

For more information on the `@JsExport` annotation, see [our documentation](js-to-kotlin-interop.md#jsexport-annotation).

## Build tools API

### Support for Kotlin/JS, Kotlin/Wasm, and Kotlin metadata
<primary-label ref="experimental-general"/>
<secondary-label ref="bta"/>

In [Kotlin 2.2.0](whatsnew22.md#new-experimental-build-tools-api), the build tools API (BTA) became available for
Kotlin/JVM. Kotlin %kotlinEapVersion% takes the next step toward BTA stabilization by adding support for new targets:
Kotlin/JS, Kotlin/Wasm, and Kotlin metadata.

This makes the Kotlin Gradle plugin interact with the compiler more consistently. In some cases, you can also benefit
from faster, more stable compilation.

The BTA is a universal API that acts as an abstraction layer between build systems and the Kotlin compiler ecosystem.
It helps support Kotlin features and compatibility with the Kotlin compiler in available build tools.

We plan to roll out the BTA support for the new targets in the Kotlin Gradle plugin gradually:

* In Kotlin 2.4.20-Beta1, BTA is enabled in Kotlin/JS, Kotlin/Wasm, and Kotlin metadata by default to gather feedback.
  No additional changes in projects are required.
* Between Kotlin 2.4.20-Beta2 and the final Kotlin 2.4.20 release, BTA in the new targets is available as an opt-in.
  To try it out, add the corresponding properties to your `gradle.properties` file:

  ```kotlin
  kotlin.wasm.runViaBuildToolsApi = true
  kotlin.js.runViaBuildToolsApi = true
  kotlin.metadata.runViaBuildToolsApi = true
  ```

* Starting with Kotlin 2.5.0, BTA will be enabled in Kotlin/JS, Kotlin/Wasm, and Kotlin metadata by default again.

If you're curious about the BTA proposal or want to share your feedback, see this [KEEP](https://github.com/Kotlin/KEEP/blob/build-tools-api/proposals/extensions/build-tools-api.md).
