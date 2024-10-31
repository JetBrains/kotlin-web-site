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

## Support for requiring opt-in to extend APIs

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

## Preview of the new language features

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

## New Gradle DSL for compiler options in multiplatform projects is stable

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

## Improved overload resolution for functions with generic types

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

## Improved K2 kapt implementation

> The kapt plugin for the K2 compiler (K2 kapt) is in [Alpha](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained).
> It may be changed at any time. We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback).
>
{style="warning"}

Currently, projects using the [kapt](https://kotlinlang.org/docs/kapt.html) plugin work with the K1 compiler by default, 
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

## Update LLVM version to 16.0.0 for Kotlin/Native

In Kotlin %kotlinEapVersion%, we updated LLVM from version 11.1.0 to 16.0.0. 
In certain cases, the new version offers compiler optimizations and faster compilation. 
It includes LLVM bug fixes and security updates as well.  
This update shouldn't affect your code, but if you run into any issues, 
please create [an issue in our tracker](https://kotl.in/issue).

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
using [names for test methods](https://kotlinlang.org/docs/coding-conventions.html#names-for-test-methods) with spaces
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
| `USELESS_CALL_ON_NOT_NULL`                            | ` "".orEmpty()` is used instead of `""`                                                  |
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