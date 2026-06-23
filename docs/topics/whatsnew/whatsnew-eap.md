[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

<primary-label ref="eap"/>

<web-summary>Read the Kotlin Early Access Preview release notes and try the latest experimental Kotlin features before they are officially released.</web-summary>

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release,
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{style="note"}

The Kotlin %kotlinEapVersion% release is out! Here are some details of this EAP release:

* **Standard library:** [`StackTraceRecoverable` interface for integration with `kotlinx.coroutines`](#standard-library-new-stacktracerecoverable-interface)
* **Kotlin/Wasm:** [Improved top-level `require()` calls and companion object initialization order](#kotlin-wasm)
* **Kotlin/JS:** [New DSL for browser-testing](#kotlin-js-new-dsl-for-browser-testing)
* **Build tools API:** [Support for new targets: Kotlin/JS, Kotlin/Wasm, and Kotlin metadata](#build-tools-api-support-for-kotlin-js-kotlin-wasm-and-kotlin-metadata)

> For information about the Kotlin release cycle, see [Kotlin release process](releases.md).
>
{style="tip"}

## Update to Kotlin %kotlinEapVersion%

The latest version of Kotlin is included in the latest versions of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
and [Android Studio](https://developer.android.com/studio).

To update to the new Kotlin version, make sure your IDE is updated to the latest version and [change the Kotlin version](releases.md#update-to-a-new-kotlin-version)
to %kotlinEapVersion% in your build scripts.

## Standard library: new `StackTraceRecoverable` interface
<primary-label ref="experimental-opt-in"/>

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

To do so, override the `copyForStackTraceRecovery()` function. This function returns a new exception instance for stack
trace recovery, or `null` if you don't want the `kotlinx.coroutines` library to copy the exception.

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

## Kotlin/Wasm

Kotlin %kotlinEapVersion% changes how Kotlin/Wasm handles top-level `require()` calls in `@JsFun` declarations and
aligns companion object initialization order with JVM behavior.

### Changes to top-level `require()` calls in `@JsFun` declarations

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
@JsFun(
    """
    ((module) => () => module)(
        await import(/* webpackIgnore: true */ "module")
    )
"""
)
private external fun loadModuleDynamically(): JsAny?
```

You can also use the `import()` expression conditionally. For example, you can load a module only when running in Node.js:

```kotlin
@JsFun(
    """
    ((module) => () => module)(
        ((typeof process !== "undefined") && (process.release.name === "node"))
            ? await import(/* webpackIgnore: true */ "module")
            : null
    )
"""
)
private external fun loadNodeModule(): JsAny?
```

If your project relies on dependencies that require a top-level `require()` function, add it as a property of
`globalThis` as a workaround:

```kotlin
@JsFun(
    """
    ((module) => {
        globalThis.require = module.default.createRequire(import.meta.url)
        return () => {}
    })(await import("node:module"))
"""
)
external fun defineRequire()
```

If you run into any issues, share your feedback in our [issue tracker](https://youtrack.jetbrains.com/projects/KT/issues/KT-86192).

### Improved companion object initialization order

Kotlin/Wasm now initializes superclass companion objects before subclass companion objects, matching the JVM behavior.
Previously, the initialization could be reversed, leading to inconsistent behavior across platforms.

The update improves cross-platform consistency and reduces platform-specific differences in class initialization behavior.
It also enables correct handling of companion object initialization in deeper inheritance hierarchies, including cases
where intermediate classes don’t declare companion objects.

## Kotlin/JS: new DSL for browser-testing
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion` introduces a new experimental DSL for running Kotlin/JS tests in a browser environment.

Currently, the Kotlin Gradle plugin uses [Karma](https://github.com/karma-runner/karma) as a browser launcher to run
JavaScript tests across different browsers. The Karma project has been deprecated for 2 years now, which made us explore
alternative ways to support browser testing.

The new DSL is intended to replace Karma as a manager of different tools under the hood and includes:

* [Mocha](https://mochajs.org/) as a test runner.
* [Webpack](https://webpack.js.org/) as a bundler (will be replaced with [Vite](https://vite.dev/)
  in [future releases](https://youtrack.jetbrains.com/issue/KT-48308/)).
* [Playwright](https://playwright.dev/) as a browser driver and a distribution manager that supports Chromium, Firefox,
  and WebKit (Safari) browser engines.

To try out the new testing DSL, and the opt-in `test{}` block inside `browser{}` for your Kotlin/JS target:

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
                // Enable and configure additional WebKit test runner
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

## Build tools API: Support for Kotlin/JS, Kotlin/Wasm, and Kotlin metadata
<primary-label ref="experimental-general"/>

In [Kotlin 2.2.20](whatsnew22.md#new-experimental-build-tools-api), the build tools API (BTA) became available for
Kotlin/JVM. Kotlin 2.4.20-Beta1 takes the next step toward BTA stabilization by adding support for new targets:
Kotlin/JS, Kotlin/Wasm, and Kotlin metadata.

This makes the Kotlin Gradle plugin interact with the compiler more consistently. In some cases, you can also benefit
from faster, more stable compilation.

The BTA is a universal API that acts as an abstraction layer between build systems and the Kotlin compiler ecosystem.
It helps support Kotlin features and compatibility with the Kotlin compiler in available build tools.

We plan to roll out the BTA support for the new targets in the Kotlin Gradle plugin gradually:

* In Kotlin 2.4.20-Beta1, BTA is enabled in Kotlin/JS, Kotlin/Wasm, and Kotlin metadata by default to gather feedback.
  No additional changes in projects are required.
* In Kotlin 2.4.20-Beta2−2.4.20, BTA in the new targets will be available as an opt-in. To try it out, add the
  corresponding properties to your `gradle.properties` file:

  ```kotlin
  kotlin.wasm.runViaBuildToolsApi = true
  kotlin.js.runViaBuildToolsApi = true
  kotlin.metadata.runViaBuildToolsApi = true
  ```

* Starting with Kotlin 2.5.0, BTA will be enabled in Kotlin/JS, Kotlin/Wasm, and Kotlin metadata by default again.

If you're curious about the BTA proposal or want to share your feedback, see this [KEEP](https://github.com/Kotlin/KEEP/blob/build-tools-api/proposals/extensions/build-tools-api.md).
