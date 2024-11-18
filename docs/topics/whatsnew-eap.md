[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release, 
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{style="note"}

The Kotlin %kotlinEapVersion% release is out!
This document contains some details about this EAP release.

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest IntelliJ IDEA and Android Studio. 
You don't need to update the Kotlin plugin in your IDE. 
All you need to do is to [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.

## Language

After the Kotlin 2.0.0 release with the K2 compiler, 
the Kotlin team at JetBrains is focusing on improving the language with new features. 
In this release, we are excited to announce several new language design features.

These features are available in preview, and we encourage you to try them and share your feedback:
* Guard conditions in `when` with a subject. [Read the KEEP document for details](https://github.com/Kotlin/KEEP/blob/master/proposals/guards.md)
* [Non-local `break` and `continue`](#non-local-break-and-continue)
* Multidollar interpolation: improved handling of `$` in string literals. 
  [Read the KEEP document for details](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)

> All the features have IDE support in the latest EAP version of IntelliJ IDEA with the K2 mode enabled.
> 
> Learn more in the [IntelliJ IDEA 2024.3 EAP blog post](https://blog.jetbrains.com/idea/2024/09/intellij-idea-2024-3-eap/#k2-mode-enabled-by-default).
> 
{style="tip"}

[See the full list of Kotlin language design features and proposals](kotlin-language-features-and-proposals.md).

### Non-local break and continue

Kotlin %kotlinEapVersion% introduces a preview of a new feature, an ability to use non-local `break` and
`continue`. It reduces boilerplate code and adds more flexibility when working with inline functions.

Previously, you could only use non-local returns in your project. Now, Kotlin also supports `break` and `continue` [jump expressions](returns.md)
non-locally. That means that you can apply them within lambdas passed as arguments to an inline function that encloses
the loop:

<compare>
    <code-block lang="kotlin">
        fun processList(elements: List&lt;Int&gt;): Boolean {
            for (element in elements) {
                val variable = element.nullableMethod()
                if (variable == null) {
                    log.warning("Element is null or invalid, continuing...")
                    continue
                }
                if (variable == 0) return true
            }
            return false
        }
    </code-block>
    <code-block lang="kotlin">
        fun processList(elements: List&lt;Int&gt;): Boolean {
            for (element in elements) {
                val variable = element.nullableMethod() ?: run {
                    log.warning("Element is null or invalid, continuing...")
                    continue
                }
                if (variable == 0) return true
            }
            return false
        }
    </code-block>
</compare>

The feature is currently [Experimental](components-stability.md#stability-levels-explained). To try it out in your project,
use the `-Xnon-local-break-continue` compiler option in the command line:

```bash
kotlinc -Xnon-local-break-continue main.kt
```

Or set it in the `compilerOptions {}` block of your Gradle build file:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnon-local-break-continue")
    }
}
```

We're planning to make this feature stable in future Kotlin releases. If you encounter any issues when using non-local
`break` and `continue`, please report them to our [issue tracker](http://kotl.in/issue).

### Support for requiring opt-in to extend APIs

Kotlin %kotlinEapVersion% introduces the [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) annotation.
This annotation allows library authors
to require explicit opt-in before users can implement experimental interfaces or extend experimental classes.

This feature can be useful when a library API is stable enough to use but might evolve with new abstract functions,
making it unstable for inheritance.

To add the opt-in requirement to an API element,
use the `@SubclassOptInRequired` annotation with a reference to the annotation class:

```kotlin
@RequiresOptIn(
    level = RequiresOptIn.Level.WARNING,
    message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

In this example, the `CoreLibraryApi` interface requires users to opt in before they can implement it.
A user can opt in like this:

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation : CoreLibraryApi
```

> When you use the `@SubclassOptInRequired` annotation to require opt-in,
> the requirement is not propagated to any [inner or nested classes](nested-classes.md).
>
{style="note"}

For a real-world example of how to use the `@SubclassOptInRequired` annotation in your API,
check out the [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)
interface in the `kotlinx.coroutines` library.

### Improved overload resolution for functions with generic types

Previously, if you had a number of overloads for a function where some have value parameters of generic type
and others had function types at the same position, the resolution behavior was inconsistent in some cases.

This led to different behavior depending on whether your overloads were member functions or extension functions.
For example:

```kotlin
class KeyValueStore<K, V> {
    fun store(key: K, value: V) {} // 1
    fun store(key: K, lazyValue: () -> V) {} // 2
}

fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, value: V) {} // 1 
fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, lazyValue: () -> V) {} // 2

fun test(kvs: KeyValueStore<String, Int>) {
    // Member functions
    kvs.store("", 1)    // Resolves to 1
    kvs.store("") { 1 } // Resolves to 2

    // Extension functions
    kvs.storeExtension("", 1)    // Resolves to 1
    kvs.storeExtension("") { 1 } // Doesn't resolve
}
```

In the example, the `KeyValueStore` class has two overloads for the `store()` function,
where one overload has function parameters with generic types `K`, `V`,
and another has a lambda function that returns a generic type `V`.
Similarly, there are two overloads for the extension function: `storeExtension()`.

When you called the `store()` function with and without a lambda function,
the compiler successfully resolved the correct overloads.
However, when you called the extension function `storeExtension()` with a lambda function,
the compiler didn't resolve the correct overload because it incorrectly considered both overloads as applicable.

To fix this problem, we've introduced a new heuristic
so that the compiler can discard a possible overload
when a function parameter with generic type can't accept a lambda function based on information from a different argument.
This change makes the behavior of member functions and extension functions consistent,
and is enabled by default in Kotlin %kotlinEapVersion%.

### Improved exhaustiveness checks for when expressions with sealed classes

In previous versions of Kotlin, 
the compiler required an `else` branch in `when` expressions for type parameters with sealed upper bounds, 
even when all cases in the `sealed class` hierarchy were covered. 
This behavior is addressed and improved in Kotlin %kotlinEapVersion%, 
making exhaustiveness checks more powerful and allowing you to remove redundant `else` branches. 
This keeps `when` expressions cleaner and more intuitive.

Here's an example demonstrating the change:

```kotlin
sealed class Result
object Error : Result()
class Success(val value: String) : Result()

fun <T : Result> render(result: T) = when (result) {
    Error -> "Error!"
    is Success -> result.value
    // Requires no else branch
}
```

## Kotlin K2 compiler

With Kotlin %kotlinEapVersion%, the K2 compiler now provides more flexibility when working with compiler checks and
warnings, as well as improved support for the kapt plugin.

### Extra compiler checks

With Kotlin %kotlinEapVersion%, you can now enable additional checks in the K2 compiler.
These are extra declaration, expression, and type checks that are usually not crucial for compilation,
but can still be useful if you want to validate the following cases:

| Check type                                            | Comment                                                                                  |
|-------------------------------------------------------|------------------------------------------------------------------------------------------|
| `REDUNDANT_NULLABLE`                                  | `Boolean??` is used instead of `Boolean?`                                                |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN`                     | `java.lang.String` is used instead of `kotlin.String`                                    |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS` | `arrayOf("") == arrayOf("")` is used instead of `arrayOf("").contentEquals(arrayOf(""))` |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD`                 | `42.toInt()` is used instead of `42`                                                     |
| `USELESS_CALL_ON_NOT_NULL`                            | `"".orEmpty()` is used instead of `""`                                                   |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE`         | `"$string"` is used instead of `string`                                                  |
| `UNUSED_ANONYMOUS_PARAMETER`                          | A parameter is passed in the lambda expression but never used                            |
| `REDUNDANT_VISIBILITY_MODIFIER`                       | `public class Klass` is used instead of `class Klass`                                    |
| `REDUNDANT_MODALITY_MODIFIER`                         | `final class Klass` is used instead of `class Klass`                                     |
| `REDUNDANT_SETTER_PARAMETER_TYPE`                     | `set(value: Int)` is used instead of `set(value)`                                        |
| `CAN_BE_VAL`                                          | `var local = 0` is defined, but never reassigned, can be `val local = 42` instead        |
| `ASSIGNED_VALUE_IS_NEVER_READ`                        | `val local = 42` is defined, but never used afterward in the code                        |
| `UNUSED_VARIABLE`                                     | `val local = 0` is defined, but never used in the code                                   |
| `REDUNDANT_RETURN_UNIT_TYPE`                          | `fun foo(): Unit {}` is used instead of `fun foo() {}`                                   |
| `UNREACHABLE_CODE`                                    | Code statement is present, but can never been executed                                   |

If the check is true, you'll receive a compiler warning with a suggestion on how to fix the problem.

Extra checks are disabled by default.
To enable them, use the `-Wextra` compiler option in the command line or specify `extraWarnings`
in the `compilerOptions {}` block of your Gradle build file:

```kotlin
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

For more information on how to define and use options,
see [Compiler options in the Kotlin Gradle plugin](gradle-compiler-options.md).

### Global warning suppression

In %kotlinEapVersion%, the Kotlin compiler has received a highly requested feature, the ability to suppress warnings globally.

Now you can suppress specific warnings in the whole project. To do that, use the `-Xsuppress-warning=WARNING_NAME` syntax
in the command line or the `freeCompilerArgs` attribute in the `compilerOptions {}` block of your build file.

For example, if you have [extra compiler checks](#extra-compiler-checks) enabled in your project, but want to suppress
one of them, use:

```kotlin
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

To get the warning name, select the problematic element and click the light bulb icon
(or use <shortcut>Cmd + Enter</shortcut>/<shortcut>Alt + Enter</shortcut>):

![Warning name intention](warning-name-intention.png){width="500"}

The new compiler option is currently [Experimental](components-stability.md#stability-levels-explained).
Mind the following nuances:

* Error suppression is not allowed.
* If you pass an unknown warning name, the compilation will result in an error.
* You can also specify several warnings at once:

<tabs>
<tab title="Command line">

```bash
kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
```

</tab>
<tab title="Build file">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.addAll(
            listOf(
                "-Xsuppress-warning=NOTHING_TO_INLINE",
                "-Xsuppress-warning=NO_TAIL_CALLS_FOUND"
            )
        )
    }
}
```

</tab>
</tabs>

### Improved K2 kapt implementation

> The kapt plugin for the K2 compiler (K2 kapt) is in [Alpha](components-stability.md#stability-levels-explained).
> It may be changed at any time. We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback).
>
{style="warning"}

Currently, projects using the [kapt](kapt.md) plugin work with the K1 compiler by default,
supporting Kotlin versions up to 1.9.

In Kotlin 1.9.20, we launched an experimental implementation of the kapt plugin with the K2 compiler (K2 kapt).
Now, we improve K2 kapt's internal implementation to mitigate technical and performance issues.

While the new K2 kapt implementation doesn't introduce new features,
its performance has significantly improved compared to the previous K2 kapt implementation.
Additionally, the K2 kapt plugin's behavior is now much closer to K1 kapt.

To use the new K2 kapt plugin implementation, enable it the same way as the previous K2 kapt plugin.
Add the following flag to the `gradle.properties` file of your project:

```text
kapt.use.k2=true
```

In upcoming releases, the K2 kapt implementation will be enabled by default instead of K1 kapt,
so you won't longer need to enable it manually.

When using the K2 kapt plugin, you may encounter a compilation error during the `kaptGenerateStubs*` tasks,
even though the actual error details are missing from the Gradle log.
This is a [known issue](https://youtrack.jetbrains.com/issue/KT-71431) that occurs when kapt is enabled in a module,
but no annotation processors are present. The workaround is to disable the kapt plugin in the module.

We highly appreciate your [feedback](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)
before the new implementation is stabilized.

## Kotlin Multiplatform

Kotlin %kotlinEapVersion% focuses on the improvements around Gradle: stabilizes new DSL for configuring compiler options
in multiplatform projects and introduces a preview of Isolated Projects feature.

### New Gradle DSL for compiler options in multiplatform projects is stable

In Kotlin 2.0.0, [we introduced a new Experimental Gradle DSL](whatsnew20.md#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
to simplify the configuration of compiler options across your multiplatform projects.
In Kotlin %kotlinEapVersion%, this DSL has been promoted to Stable.

With this new DSL, you can configure compiler options at the extension level for all targets and shared source sets
like `commonMain`, as well as at the target level for specific targets:

```kotlin
kotlin {
    compilerOptions {
        // Extension-level common compiler options that are used as defaults
        // for all targets and shared source sets
        allWarningsAsErrors.set(true)
    }
    jvm {
        compilerOptions {
            // Target-level JVM compiler options that are used as defaults
            // for all compilations in this target
            noJdk.set(true)
        }
    }
}
```

The overall project configuration now has three layers.
The highest is the extension level, then the target level,
and the lowest is the compilation unit (which is usually a compilation task):

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

The settings at a higher level are used as a convention (default) for a lower level:

* The values of extension compiler options are the default for target compiler options, including shared source sets,
  like `commonMain`, `nativeMain`, and `commonTest`.
* The values of target compiler options are used as the default for compilation unit (task) compiler options, for
  example, `compileKotlinJvm` and `compileTestKotlinJvm` tasks.

In turn, configurations made at a lower level override related settings at a higher level:

* Task-level compiler options override related configurations at the target or the extension level.
* Target-level compiler options override related configurations at the extension level.

When configuring your project, keep in mind that some old ways
of setting up compiler options have been [deprecated](whatsnew20.md#deprecated-old-ways-of-defining-compiler-options).

### Preview Gradle's Isolated Projects in Kotlin Multiplatform

> This feature is [Experimental](components-stability.md#stability-levels-explained) and is currently in a pre-alpha state with Gradle.
> Use it only with Gradle version 8.10 and solely for evaluation purposes. The feature may be dropped or changed at any time.
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform). Opt-in is required (see details below).
>
{style="warning"}

In Kotlin %kotlinEapVersion%, you can preview Gradle's [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html)
feature in your multiplatform projects.

The Isolated Projects feature in Gradle improves build performance by "isolating" individual Gradle projects from each
other. Each project's build logic is restricted from directly accessing the mutable state of other projects, allowing them
to safely run in parallel. To support this feature, we made some changes to the Kotlin Gradle plugin's model, and we are
interested in hearing about your experiences during this preview phase.

There are two ways to enable the Kotlin Gradle plugin's new model:

* Option 1: **Testing compatibility without enabling Isolated Projects**: To check compatibility with the Kotlin Gradle
  plugin's new model without enabling the Isolated Projects feature, add the following Gradle property in the
  `gradle.properties` file of your project:

  ```none
  kotlin.kmp.isolated-projects.support=enable
  ```

* Option 2: **Testing with Isolated Projects enabled**: Enabling the Isolated Projects feature in Gradle automatically
  configures the Kotlin Gradle plugin to use the new model. To enable the Isolated Projects feature, [set the system property](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it).
  In this case, you don't need to add the Gradle property for the Kotlin Gradle plugin to your project.

## Kotlin/Native

Kotlin %kotlinEapVersion% includes an upgrade for the `iosArm64` target support, improved cinterop caching process, and other updates.

### iosArm64 is promoted to Tier 1

The `iosArm64` target, which is crucial for [Kotlin Multiplatform](multiplatform-intro.md) development, has been promoted
to Tier 1. It's the highest level of support in the Kotlin/Native compiler.

This means the target is regularly tested on CI to ensure that it's able to compile and run. We also provide source and
binary compatibility between compiler releases for it.

For more information on target tiers, see [Kotlin/Native target support](native-target-support.md).

### LLVM update from 11.1.0 to 16.0.0

In Kotlin %kotlinEapVersion%, we updated LLVM from version 11.1.0 to 16.0.0. The new version includes LLVM bug fixes and
security updates. In certain cases, it also brings compiler optimizations and faster compilation.

If you have Linux targets in your project, mind that the Kotlin/Native compiler now uses the `lld` linker by default for
all Linux targets.

This update shouldn't affect your code, but if you encounter any issues, please report them to our [issue tracker](http://kotl.in/issue).

### Changes to caching in cinterop

In Kotlin %kotlinEapVersion%, we're making changes to the cinterop caching process. It no longer has the
[`CacheableTask`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/CacheableTask.html) annotation type.
The recommended approach now is to use the [`cacheIf`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.tasks/-task-outputs/cache-if.html)
output type to cache the results of the task.

This should fix the issue when changes to header files specified in the [definition file](native-definition-file.md) were
not recognized by UP-TO-DATE checks, so the build system failed to recompile the code.

## Kotlin/Wasm

### Support for incremental compilation

Previously, when you changed something to your Kotlin code, 
the Kotlin/Wasm toolchain had to recompile the entire codebase.

Starting from %kotlinEapVersion%, incremental compilation is supported for the Wasm targets.
In development tasks, the compiler now recompiles only files relevant to changes from the last compilation,
which noticeably reduces the compilation time.

This change doubles the development speed for now, with plans to improve it further in future releases.

In the current setup, incremental compilation for the Wasm targets is disabled by default.
To enable incremental compilation, add the following line to your project's `local.properties` or `gradle.properties` file:

```text
kotlin.incremental.wasm=true
```

Try out the Kotlin/Wasm incremental compilation 
and [share your feedback](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback)!
Your insights will help make this feature stable and default sooner.

### Browser APIs moved to the kotlinx-browser stand-alone library

Before, the declarations for Web APIs and related target utilities were part of the Kotlin/Wasm standard library.

In this release, the `org.w3c.*`
declarations have been moved from the Kotlin/Wasm standard library to the new [kotlinx-browser library](https://github.com/kotlin/kotlinx-browser).
This library also includes other web-related packages, such as `org.khronos.webgl`, `kotlin.dom`, and `kotlin.browser`.

This separation provides modularity, 
enabling independent updates for web-related APIs outside of Kotlin's release cycle. 
Additionally, the Kotlin/Wasm standard library now contains only declarations available in any JavaScript environments.

To use the declarations from the moved packages, you need to add the `kotlinx-browser` 
dependency in your project's build configuration file:

```kotlin
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.2")
    }
}
```

### Improved debugging experience for Kotlin/Wasm

Previously, when debugging Kotlin/Wasm code in web browsers, you might encounter
a low-level representation of variable values in the debugging interface. 
This often made it challenging to track the current state of the application.

![Kotlin/Wasm old debugger](wasm-old-debugger.png){width=700}

To improve this experience, custom formatters have been added in the variable view.
The implementation uses the [custom formatters API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html),
which is supported across major browsers like Firefox and Chromium-based.

With this change, you can now display and locate variable values in a more user-friendly and comprehensible manner.

![Kotlin/Wasm improved debugger](wasm-debugger-improved.png){width=700}

To try the new debugging experience:

1. Add the following compiler argument to the `wasmJs` compiler options:

   ```kotlin
   kotlin {
       wasmJs {
           …
           compilerOptions {
               freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
           }
       }
   }
   ```

2. Enable the **Custom formatters** feature in your browser.

   In the Chrome DevTools, it's placed in **Settings | Preferences | Console**:

   ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=700}

   In the Firefox Developer Tools, it's placed in **Settings | Advanced settings**:

   ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=700}

### Reduced size of Kotlin/Wasm binaries

The size of your Wasm binaries produced by production builds will be reduced by up to 30%,
and you may see some performance improvements.
This is due to the fact that Binaryen options 
`--closed-world`, `--type-ssa`, and `--type-merging` are now considered safe to use for 
all Kotlin/Wasm projects and are enabled by default.

### Improved JavaScript array interoperability in Kotlin/Wasm

While Kotlin/Wasm's standard library provides the `JsArray<T>` type for JavaScript arrays,
there was no direct method to transform `JsArray<T>` into Kotlin's native `Array` or `List` types.

This gap required creating custom functions for array transformations, complicating interoperability between 
Kotlin and JavaScript code.

This release introduces an adapter function that automatically converts `JsArray<T>` to `Array<T>` and vice versa,
simplifying array operations.

Here's an example of conversion between generic types: Kotlin `List<T> `and `Array<T>` to JavaScript `JsArray<T>.`

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// Uses .toJsArray() to convert List or Array to JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// Uses .toArray() and .toList() to convert it back to Kotlin types 
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

Similar methods are available for converting typed arrays to their Kotlin equivalents
(for example, `IntArray` and `Int32Array`). For detailed information and implementation,
see the [`kotlinx-browser` repository]( https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt).

Here's an example of conversion between typed arrays: Kotlin `IntArray` to JavaScript `Int32Array`.

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // Uses .toInt32Array() to convert Kotlin IntArray to JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // Uses toIntArray() to convert JavaScript Int32Array back to Kotlin IntArray
    val kotlnIntArray: IntArray = jsInt32Array.toIntArray()
```

### Support for accessing JavaScript exception details in Kotlin/Wasm

Previously, when a JavaScript exception occurred in Kotlin/Wasm, 
the `JsException` type provided only a generic message without details from the original JavaScript error.

Starting from Kotlin %kotlinEapVersion%, 
you can now configure `JsException` to include the original error message and stack trace by enabling a specific compiler flag,
providing more context to help diagnose issues originating from JavaScript.

This behavior depends on the `WebAssembly.JSTag` API, which is available only in certain browsers:

* **Chrome**: Supported from version 115
* **Firefox**: Supported from version 129
* **Safari**: Not yet supported

This feature is disabled by default. To enable this feature, add the following compiler flag to your `build.gradle.kts` file:

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

Here’s an example demonstrating the new behavior:

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // SyntaxError: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Message: ${e.message}")
        // Message: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Stacktrace:")
        // Stacktrace:

        // Prints the full JavaScript stack trace 
        e.printStackTrace()
    }
}
```

With the `-Xwasm-attach-js-exception` flag enabled, `JsException` provides specific details from the JavaScript error.
Without the flag, `JsException` includes only a generic message stating that an exception was thrown while running JavaScript code.

### Deprecation of default exports

As part of the migration towards named exports, 
an error was previously printed to the console when using a default import for Kotlin/Wasm exports in JavaScript.

In %kotlinEapVersion%, default imports are completely removed in order to fully support named exports.

When coding in JavaScript for the Kotlin/Wasm target,
you now need to use the corresponding named imports instead of default imports.

This change marks the last phase of a deprecation cycle to migrate towards named exports:

**In version 2.0.0:** A warning message was printed to the console, 
explaining that exporting entities via default exports is deprecated.

**In version 2.0.20:** An error occurred, requesting the use of the corresponding named import.

**In version 2.1.0:** The use of default imports is completely removed.

## Support for non-identifier characters in Kotlin/JS properties

Kotlin/JS previously did not allow
using [names for test methods](coding-conventions.md#names-for-test-methods) with spaces
enclosed in backticks.

Similarly, it was not possible to access JavaScript object properties
that contained characters not permitted in Kotlin identifiers, such as hyphens or spaces:

```kotlin
external interface Headers {
    var accept: String?

    // Invalid Kotlin identifier due to hyphen
    var `content-length`: String?
}

val headers: Headers = TODO("value provided by a JS library")
val accept = headers.accept
// Causes error due to the hyphen in property name
val length = headers.`content-length`
```

This behavior differed from JavaScript and TypeScript,
which allow such properties to be accessed using non-identifier characters.

Starting from Kotlin %kotlinEapVersion%, this feature is enabled by default.
Kotlin/JS now allows you to use the backquote syntax and the `@JsName` annotation
to interact with JavaScript properties that contain non-identifier characters and to use names for test methods.

Now, you can enclose property names in backticks (``) to reference non-identifier characters. Additionally,
you can use the `@JsName` and `@JsQualifier` annotations to map Kotlin property names to JavaScript equivalents:

```kotlin
object Bar {
    val `property example`: String = "bar"
}

@JsQualifier("fooNamespace")
external object Foo {
    val `property example`: String
}

@JsExport
object Baz {
    val `property example`: String = "bar"
}

fun main() {
    // In JS, this is compiled into Bar.property_example_HASH
    println(Bar.`property example`)
    // In JS, this is compiled into fooNamespace["property example"]
    println(Foo.`property example`)
    // In JS, this is compiled into Baz["property example"]
    println(Baz.`property example`)
}
```

## Gradle improvements

Kotlin %kotlinEapVersion% is fully compatible with Gradle 7.6.3 through 8.6. 
Gradle versions 8.7 to 8.10 are also supported, with only one exception: 
If you use the Kotlin Multiplatform Gradle plugin, 
you may see deprecation warnings in your multiplatform projects calling the [`withJava()` function in the JVM target](multiplatform-dsl-reference.md#jvm-targets).
We plan to fix this issue as soon as possible.

For more information, 
see the issue in [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning).

You can also use Gradle versions up to the latest Gradle release, 
but if you do, keep in mind that you may encounter deprecation warnings or some new Gradle features might not work.

### Bumped the minimum supported AGP version to 7.3.1

Starting with Kotlin %kotlinEapVersion%, the minimum supported Android Gradle plugin version is 7.3.1.

### Bumped the minimum supported Gradle version to 7.6.3

Starting with Kotlin %kotlinEapVersion%, the minimum supported Gradle version is 7.6.3.

## Compose compiler updates

### Support for multiple stability configuration files

Compose compiler is able to interpret multiple stability configuration files,
but the `stabilityConfigurationFile` option of the Compose Compiler Gradle plugin is only allowed for a single file to be specified.

In Kotlin %kotlinEapVersion%, this functionality was reworked to allow you to use several stability configuration files 
for a single module:

* The `stabilityConfigurationFile` option is deprecated.
* There is a new option, `stabilityConfigurationFiles` with the type `ListProperty<RegularFile>`.

Here's how you can pass several files to the Compose compiler using the new option:

```kotlin
composeCompiler {
    stabilityConfigurationFiles.addAll(
        project.layout.projectDirectory.file("configuration-file1.conf"),
        project.layout.projectDirectory.file("configuration-file2.conf"),
    )
}
```

## How to update to Kotlin %kotlinEapVersion%

Starting from IntelliJ IDEA 2023.3 and Android Studio Iguana (2023.2.1) Canary 15, the Kotlin plugin is distributed as a 
bundled plugin included in your IDE. This means that you can't install the plugin from JetBrains Marketplace anymore. 
The bundled plugin supports upcoming Kotlin EAP releases.

To update to the new Kotlin EAP version, [change the Kotlin version](configure-build-for-eap.md#adjust-the-kotlin-version) 
to %kotlinEapVersion% in your build scripts.