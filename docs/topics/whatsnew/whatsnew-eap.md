[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release,
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{style="note"}

The Kotlin %kotlinEapVersion% release is out!
Here are some details of this EAP release:

* Kotlin Multiplatform: [Swift export available by default](#swift-export-available-by-default), [shared source set for `js` and `wasmJs` targets](#shared-source-set-for-js-and-wasmjs-targets), [stable cross-platform compilation for Kotlin libraries](#stable-cross-platform-compilation-for-kotlin-libraries), and a [new approach for declaring common dependencies](#new-approach-for-declaring-common-dependencies).
* Language: [improved overload resolution when passing lambdas to overloads with suspend function types](#improved-overload-resolution-for-lambdas-with-suspend-function-types).
* Kotlin/Native: [support for stack canaries in binaries](#support-for-stack-canaries-in-binaries) and [smaller binary size for iOS targets](#smaller-binary-size-for-ios-targets).
* Kotlin/Wasm: [improved exception handling in Kotlin/Wasm and JavaScript interop](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop).
* Kotlin/JS: [`Long` values compiled into JavaScript `BigInt`](#usage-of-bigint-type-to-represent-kotlin-s-long-type).

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest versions of IntelliJ IDEA and Android Studio.
You don't need to update the Kotlin plugin in your IDE.
All you need to do is [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.

## Language

In Kotlin %kotlinEapVersion%, you can try out upcoming language features planned for Kotlin 2.3.0, including 
[improved overload resolution when passing lambdas to overloads with suspend function types](#improved-overload-resolution-for-lambdas-with-suspend-function-types)
and [support for return statements in expression bodies with explicit return types](#support-for-return-statements-in-expression-bodies-with-explicit-return-types).

### Improved overload resolution for lambdas with suspend function types

Previously, overloading a function with both a regular function type and a `suspend` function type caused an ambiguity 
error when passing a lambda. You could work around this error with an explicit type cast, but the compiler incorrectly
reported a `No cast needed` warning:

```kotlin
// Defines two overloads
fun transform(block: () -> Int) {}
fun transform(block: suspend () -> Int) {}

fun test() {
    // Fails with overload resolution ambiguity
    transform({ 42 })

    // Uses an explicit cast, but compiler incorrectly reports a "No cast needed" warning
    transform({ 42 } as () -> Int)
}
```

With this change, when you define both a regular and a `suspend` function type overload, a lambda without a cast resolves
to the regular overload. Use the `suspend` keyword to resolve to the suspend overload explicitly:

```kotlin
// Resolves to transform(() -> Int)
transform({ 42 })

// Resolves to transform(suspend () -> Int)
transform(suspend { 42 })
```

This behavior will be enabled by default in Kotlin 2.3.0. To test it now, set your language version to `2.3` using the 
following compiler option:

```kotlin
-language-version 2.3
```

Or configure it in your `build.gradle(.kts)` file:

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

We would appreciate your feedback in our issue tracker, [YouTrack](https://youtrack.jetbrains.com/issue/KT-23610).

### Support for return statements in expression bodies with explicit return types

Previously, using `return` in an expression body caused a compiler error because it could cause the function's return type
to be inferred as `Nothing`.

```kotlin
fun example() = return 42
// Error: Returns are prohibited for functions with an expression body
```

With this change, you can now use `return` in expression bodies as long as the return type is written explicitly:

```kotlin
// Specifies the return type explicitly
fun getDisplayNameOrDefault(userId: String?): String = getDisplayName(userId ?: return "default")

// Fails because it doesn't specify the return type explicitly
fun getDisplayNameOrDefault(userId: String?) = getDisplayName(userId ?: return "default")
```

Similarly, `return` statements inside lambdas and nested expressions in functions with expression bodies used to compile 
unintentionally. Kotlin now supports these cases as long as the return type is specified explicitly. Cases without an explicit 
return type will be deprecated in Kotlin 2.3.0:

```kotlin
// Return type isn't explicitly specified, and the return statement is inside a lambda
// which will be deprecated
fun returnInsideLambda() = run { return 42 }

// Return type isn't explicitly specified, and the return statement is inside the initializer
// of a local variable, which will be deprecated
fun returnInsideIf() = when {
    else -> {
        val result = if (someCondition()) return "" else "value"
        result
    }
}
```

This behavior will be enabled by default in Kotlin 2.3.0. To test it now, set your language version to `2.3` using 
the following compiler option:

```kotlin
-language-version 2.3
```

Or configure it in your `build.gradle(.kts)` file:

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

We would appreciate your feedback in our issue tracker, [YouTrack](https://youtrack.jetbrains.com/issue/KT-76926).

## Kotlin/JVM: support invokedynamic with when expressions
<primary-label ref="experimental-opt-in"/> 

In Kotlin %kotlinEapVersion%, you can now compile `when` expressions with `invokedynamic`.
Previously, `when` expressions with multiple type checks compiled to a long chain of `instanceof` checks in the bytecode.

Now you can use `invokedynamic` with `when` expressions to generate smaller bytecode, similar to the bytecode produced by
Java `switch` statements, when the following conditions are met:

* All conditions except for `else` are `is` or `null` checks.
* The expression doesn't contain [guard conditions (`if`)](control-flow.md#guard-conditions-in-when-expressions).
* The conditions don't include types that can't be type-checked directly, such as mutable Kotlin collections (`MutableList`) or function types (`kotlin.Function1`, `kotlin.Function2`, and so on).
* There are at least two conditions besides `else`.
* All branches check the same subject of the `when` expression.

For example:

```kotlin
open class Example

class A : Example()
class B : Example()
class C : Example()

fun test(e: Example) = when (e) {
    // Uses invokedynamic with SwitchBootstraps.typeSwitch
    is A -> 1
    is B -> 2
    is C -> 3
    else -> 0
}
```

With the new feature enabled, the `when` expression in this example compiles to a single `invokedynamic` type switch
instead of multiple `instanceof` checks.

To enable this feature, compile your Kotlin code with JVM target 21 or above and add the following compiler option:

```bash
-Xwhen-expressions=indy
```

Or add it to the `compilerOptions {}` block of your `build.gradle(.kts)` file:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-expressions=indy")
    }
}
```

This feature is [Experimental](components-stability.md#stability-levels-explained). If you have any feedback or questions, share them in [YouTrack](https://youtrack.jetbrains.com/issue/KT-65688).

## Kotlin Multiplatform

Kotlin %kotlinEapVersion% introduces significant changes for Kotlin Multiplatform: Swift export is available by default,
there's a new shared source set, and you can try a new approach to managing common dependencies.

### Swift export available by default
<primary-label ref="experimental-general"/> 

Kotlin %kotlinEapVersion% introduces experimental support for Swift export. It allows you to export Kotlin sources directly
and call Kotlin code from Swift idiomatically, eliminating the need for Objective-C headers.

This should significantly improve multiplatform development for Apple targets. For example, if you have a Kotlin module
with top-level functions, Swift export enables clean, module-specific imports, removing the confusing Objective-C underscores
and mangled names.

The key features are:

* **Multi-module support**. Each Kotlin module is exported as a separate Swift module, simplifying function calls.
* **Package support**. Kotlin packages are explicitly preserved during export, avoiding naming conflicts in the generated Swift code.
* **Type aliases**. Kotlin type aliases are exported and preserved in Swift, improving readability.
* **Enhanced nullability for primitives**. Unlike Objective-C interop, which required boxing types like 
`Int?` into wrapper classes like `KotlinInt` to preserve nullability, Swift export converts nullability information directly.
* **Overloads**. You can call Kotlin's overloaded functions in Swift without ambiguity.
* **Flattened package structure**. You can translate Kotlin packages into Swift enums, removing the package prefix from generated Swift code.
* **Module name customization**. You can customize the resulting Swift module names in the Gradle configuration of your Kotlin project.

#### How to enable Swift export

The feature is currently [Experimental](components-stability.md#stability-levels-explained) and works only in 
projects that use [direct integration](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html)
to connect the iOS framework to the Xcode project. This is a standard configuration for Kotlin Multiplatform projects 
created with Kotlin Multiplatform plugin in IntelliJ IDEA or through the [web wizard](https://kmp.jetbrains.com/).

To try out Swift export, configure your Xcode project:

1. In Xcode, open the project settings.
2. On the **Build Phases** tab, locate the **Run Script** phase with the `embedAndSignAppleFrameworkForXcode` task.
3. Adjust the script to feature the `embedSwiftExportForXcode` task instead in the run script phase:

  ```bash
  ./gradlew :<Shared module name>:embedSwiftExportForXcode
  ```

  ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

4. Build the project. Swift modules are generated in the build output directory.

The feature is available by default. If you have already enabled it in previous releases, you can now remove `kotlin.experimental.swift-export.enabled`
from your `gradle.properties` file.

> To save time, clone our [public sample](https://github.com/Kotlin/swift-export-sample) with Swift export already set up.
>
{style="tip"}

For more information about Swift export, see its [README](https://github.com/JetBrains/kotlin/tree/master/docs/swift-export#readme).

#### Leave feedback

We're planning to expand and gradually stabilize Swift export support in future Kotlin releases. After
Kotlin 2.2.20 we'll focus on improving interoperability between Kotlin and Swift, particularly around coroutines and flows.

Support for Swift export is a significant change for Kotlin Multiplatform. We would appreciate your feedback:

* Contact the development team directly in Kotlin Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) and join the [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) channel.
* Report any problems you face with Swift export in [YouTrack](https://kotl.in/issue).

### Shared source set for js and wasmJs targets

Previously, Kotlin Multiplatform didn't include a shared source set for JavaScript (`js`) and WebAssembly (`wasmJs`) web targets by default.
To share code between `js` and `wasmJs`, you had to manually configure a custom source set or write code in two places,
one version for `js` and another for `wasmJs`. For example:

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// jsMain
external interface Navigator { val clipboard: Clipboard }
// Different interop in JS and Wasm
external interface Clipboard { fun readText(): Promise<String> } 
external val navigator: Navigator

suspend fun readCopiedText(): String {
  // Different interop in JS and Wasm
    return navigator.clipboard.readText().await() 
}

// wasmJsMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString() 
}
```

Starting with this release, the Kotlin Gradle plugin adds a new shared source set for web (comprising `webMain` and `webTest`)
when using the default hierarchy template.

With this change, the `web` source set becomes a parent of both `js` and `wasmJs` source sets. The updated source set 
hierarchy looks like this:

![An example of using the default hierarchy template with web](default-hierarchy-example-with-web.svg)

The new source set allows you to write one piece of code for both the `js` and `wasmJs` targets.
You can put your shared code in `webMain` and it automatically works for both targets:

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// webMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

This update simplifies code sharing between the `js` and `wasmJs` targets. It is particularly useful in two cases:

* For library authors who want to add support for both `js` and `wasmJs` targets, without duplicating code.
* For developers building Compose Multiplatform applications that target the Web, enabling cross-compilation to both `js` and `wasmJs` targets
  for wider browser compatibility. Given this fallback mode, when you create
  a website, it will work on all browsers out of the box: modern browsers use `wasmJs`, and older browsers use `js`.

To try this feature, use the [default hierarchy template](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)
in the `kotlin {}` block of your `build.gradle(.kts)` file.

Before using the default hierarchy, consider carefully any potential conflicts if you have projects with a custom shared
source set or if you renamed the `js("web")` target. To resolve these conflicts, rename the conflicting source set or target, or 
don't use the default hierarchy.


### Stable cross-platform compilation for Kotlin libraries

Kotlin %kotlinEapVersion% completes an important [roadmap item](https://youtrack.jetbrains.com/issue/KT-71290), stabilizing
cross-platform compilation for Kotlin libraries.

You can now use any host to produce `.klib` artifacts for publishing Kotlin libraries. This significantly streamlines the
publishing process, particularly for Apple targets that previously required a Mac machine.

The feature is available by default. If you have already enabled cross-compilation with `kotlin.native.enableKlibsCrossCompilation=true`,
you can now remove it from your `gradle.properties` file.

Unfortunately, a few limitations are still present. You still need to use a Mac machine if:

* Your library has a [cinterop dependency](native-c-interop.md).
* You have a [CocoaPods integration](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) set up in your project.
* You need to build or test [final binaries](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html) for Apple targets.

For more information about the publication of multiplatform libraries, see our [documentation](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html).

### New approach for declaring common dependencies
<primary-label ref="experimental-opt-in"/>

To simplify setting up multiplatform projects with Gradle, Kotlin %kotlinEapVersion% now lets you declare common dependencies
in the `kotlin {}` block by using a top-level `dependencies {}` block. These dependencies behave as if they were declared
in the `commonMain` source set. This feature works similarly to the dependencies block that you use for Kotlin/JVM and 
Android-only projects, and it's now [Experimental](components-stability.md#stability-levels-explained) in Kotlin Multiplatform.
Declaring common dependencies at the project level reduces repetitive configuration across source sets and helps streamline
your build setup. You can still add platform-specific dependencies in each source set as needed.

To try this feature, opt in by adding the `@OptIn(ExperimentalKotlinGradlePluginApi::class)` annotation before the top-level
`dependencies {}` block. For example:

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

We would appreciate your feedback on this feature in [YouTrack](https://youtrack.jetbrains.com/issue/KT-76446).

## Kotlin/Native

Kotlin %kotlinEapVersion% brings improvements for Kotlin/Native binaries and debugging.

### Support for stack canaries in binaries

Starting with %kotlinEapVersion%, Kotlin adds support for stack canaries in the resulting Kotlin/Native binaries. As part of
stack protection, this security feature protects against stack smashing, mitigating some common application vulnerabilities.
Already available in Swift and Objective-C, it's now supported in Kotlin as well.

#### How to enable stack canaries

The implementation of stack protection in Kotlin/Native follows the behavior of the stack protector in [Clang](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fstack-protector).

To enable stack canaries, add the following property to your `gradle.properties` file:

```none
kotlin.native.binary.stackProtector=yes
```

The property enables the feature for all the Kotlin functions that are vulnerable to stack smashing. Alternative modes are:

* `kotlin.native.binary.stackProtector=strong`, which uses a stronger heuristic for the functions vulnerable to stack smashing.
* `kotlin.native.binary.stackProtector=all`, which enables stack protectors for all functions.

Note that in some cases, stack protection might come with a performance cost.

### Smaller binary size for iOS targets
<primary-label ref="experimental-general"/> 

Kotlin %kotlinEapVersion% introduces the `smallBinary` option that can help you decrease the binary size for iOS targets.
The new option effectively sets `-Oz` as the default optimization argument for the compiler during the LLVM compilation phase.

With the `smallBinary` option enabled, you can make release binaries smaller and improve build time. However, it might
affect runtime performance in some cases.

#### How to enable smaller binary size

The new feature is currently [Experimental](components-stability.md#stability-levels-explained). To try it out in your
project, use the `-Xbinary=smallBinary=true` compiler option or update your `gradle.properties` file with:

```none
kotlin.native.binary.smallBinary=true
```

For a specific binary, set the `binaryOption("smallBinary", "true")` in your `build.gradle(.kts)` file. For example:

```kotlin
kotlin {
    listOf(
        iosX64(),
        iosArm64(),
        iosSimulatorArm64(),
    ).forEach {
        it.binaries.framework {
            binaryOption("smallBinary", "true")
        }
    }
}
```

The Kotlin team is grateful to [Troels Lund](https://github.com/troelsbjerre) for his help in implementing this feature.

### Improved debugger object summaries

Kotlin/Native now generates clearer object summaries for debugger tools like LLDB and GDB. This improves the
readability of the produced debug information and streamlines your debugging experience.

Previously, if you inspected an object such as:

```kotlin
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
```

You'd see limited information, including a pointer to the memory address:

```none
(lldb) v point
(ObjHeader *) point = [x: ..., y: ...]
(lldb) v point->x
(int32_t *) x = 0x0000000100274048
```

With Kotlin %kotlinEapVersion%, the debugger shows richer details, including the actual values:

```none
(lldb) v point
(ObjHeader *) point = Point(x=1, y=2)
(lldb) v point->x
(int32_t) point->x = 1
```

The Kotlin team is grateful to [Nikita Nazarov](https://github.com/nikita-nazarov) for his help in implementing this feature.

For more information on debugging in Kotlin/Native, see the [documentation](native-debugging.md).

## Kotlin/Wasm

Kotlin/Wasm receives some quality of life improvements, including separated npm dependencies and improved exception 
handling for JavaScript interop.

### Separated npm dependencies

Previously, in your Kotlin/Wasm projects, all [npm](https://www.npmjs.com/) dependencies were installed together in your
project folder. It included both your own dependencies and Kotlin tooling dependencies. These dependencies were also recorded
together in your project's lock files (`package-lock.json` or `yarn.lock`).

As a result, whenever Kotlin tooling dependencies were updated, you had to update your lock files even if you didn't add
or change anything.

Starting from Kotlin %kotlinEapVersion%, the Kotlin tooling npm dependencies are installed outside your project. Now, the
tooling and the user dependencies have separate directories:

* **Tooling dependencies' directory:**

  `<kotlin-user-home>/kotlin-npm-tooling/<yarn|npm>/hash/node_modules`

* **User dependencies' directory:**

  `build/wasm/node_modules`

Also, the lock files inside the project directory contain only user-defined dependencies.

This improvement keeps your lock files focused only on your own dependencies, helps maintain a cleaner project, and
reduces unnecessary changes to your files.

This change is enabled by default for the `wasm-js` target. The change is not yet implemented for the `js` target. While
there are plans to implement it in future releases, the behavior of the npm dependencies remains the same for the `js`
target in Kotlin %kotlinEapVersion%.

### Improved exception handling in Kotlin/Wasm and JavaScript interop

Previously, Kotlin had difficulty understanding exceptions (errors) thrown in JavaScript (JS) and crossing over to Kotlin/Wasm code.

In some cases, the issue also occurred in the reverse direction, when an exception was thrown or passed through the Wasm
code to JS and wrapped into `WebAssembly.Exception` without any details. These Kotlin exception handling issues made 
debugging difficult.

Starting from Kotlin %kotlinEapVersion%, the developer experience with exceptions improves in both directions:

* When exceptions are thrown from JavaScript: you can see more information on Kotlin's side.
  When such an exception propagates through Kotlin back to JS, it's no longer wrapped into WebAssembly.
* When exceptions are thrown from Kotlin: they can now be caught on JavaScript's side as JS errors.

The new exception handling works automatically in modern browsers that support the [`WebAssembly.JSTag`](https://webassembly.github.io/exception-handling/js-api/#dom-webassembly-jstag)
feature:

* Chrome 115+
* Firefox 129+
* Safari 18.4+

In older browsers, the exception handling behavior remains unchanged.

## Kotlin/JS

Kotlin %kotlinEapVersion% supports using the `BigInt` type to represent Kotlin's `Long` type, enabling `Long` in exported
declarations. Additionally, this release adds a DSL function to clean up Node.js arguments.

### Usage of BigInt type to represent Kotlin's Long type
<primary-label ref="experimental-opt-in"/>

Before the ES2020 standard, JavaScript (JS) did not support a primitive type for precise integers 
larger than 53 bits.

For this reason, Kotlin/JS used to represent `Long` values (which are 64-bit wide) as JavaScript objects containing two
`number` properties. This custom implementation made interoperability between Kotlin and JavaScript more complex.

Starting with Kotlin %kotlinEapVersion%, Kotlin/JS now uses JavaScript's built-in `BigInt` type to represent Kotlin's `Long` values 
when compiling to modern JavaScript (ES2020).

This change enables [exporting the `Long` type to JavaScript](#usage-of-long-in-exported-declarations), a feature also
introduced in %kotlinEapVersion%. As a result, this change simplifies the interoperability between Kotlin and JavaScript.

To enable it, add the following compiler option to your `build.gradle(.kts)` file:

```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

This feature is still [Experimental](components-stability.md#stability-levels-explained). Please
report any problems in our issue tracker, [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128).

#### Usage of Long in exported declarations

Because Kotlin/JS used a custom `Long` representation, it was difficult to provide a straightforward way to interact with
Kotlin's `Long` from JavaScript. As a result, you couldn't export Kotlin code that used the `Long` type to JavaScript.
This issue affected any code using `Long`, such as function parameters, class properties, or constructors.

Now that Kotlin's `Long` type can be compiled to JavaScript's `BigInt` type, Kotlin/JS supports exporting `Long` values to JavaScript,
simplifying the interoperability between Kotlin and JavaScript code.

To enable this feature:

1. Allow exporting `Long` in Kotlin/JS. Add the following compiler argument to the `freeCompilerArgs` attribute
   in your `build.gradle(.kts)` file:

    ```kotlin
    // build.gradle.kts
    kotlin {
        js {
            ...
            compilerOptions {                   
                freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
            }
        }
    }
    ```

2. Enable the `BigInt` type. See how to enable it in [Usage of `BigInt` type to represent Kotlin's `Long` type](#usage-of-bigint-type-to-represent-kotlin-s-long-type).

### New DSL function for cleaner arguments

When running a Kotlin/JS application with Node.js, the arguments passed to your program (`args`) used to include:

* The path to the executable `Node`.
* The path to your script.
* The actual command-line arguments you provided.

However, the expected behavior for `args` was to include only the command-line arguments. To achieve this, you had to
manually skip the first two arguments using the `drop()` function inside your `build.gradle(.kts)` file or in your Kotlin code:

```kotlin
fun main(args: Array<String>) {
    println(args.drop(2).joinToString(", "))
}
```

This workaround was repetitive, error-prone, and didn't work well when sharing code between platforms.

To fix this issue, Kotlin %kotlinEapVersion% introduces a new DSL function called `passCliArgumentsToMainFunction()`.

With this function, the arguments only include the command-line arguments and exclude the `Node` and script paths:

```kotlin
fun main(args: Array<String>) {
    // No need for drop() and only your custom arguments are included 
    println(args.joinToString(", "))
}
```

This change reduces boilerplate code, avoids mistakes caused by manually dropping arguments, and improves cross-platform compatibility.

To enable this feature, add the following DSL function inside your `build.gradle(.kts)` file:

```kotlin
kotlin {
    js {
        nodejs {
            passCliArgumentsToMainFunction()
        }
    }
}
```

## Gradle: new compiler performance metrics in build reports for Kotlin/Native tasks

In Kotlin 1.7.0, we introduced [build reports](gradle-compilation-and-caches.md#build-reports) to help track compiler 
performance. Since then, we've added more metrics to make these reports even more detailed and useful for investigating
performance issues.

In Kotlin %kotlinEapVersion%, build reports now include compiler performance metrics for Kotlin/Native tasks.

To learn more about build reports and how to configure them, see [Enabling build reports](gradle-compilation-and-caches.md#enabling-build-reports).

## Maven: support for the Kotlin daemon in the kotlin-maven-plugin

With the introduction of the [build tools API in Kotlin 2.2.0](
whatsnew22.md#new-experimental-build-tools-api), Kotlin %kotlinEapVersion% goes one step further by adding support for
the Kotlin daemon in the `kotlin-maven-plugin`. When using the Kotlin daemon, the Kotlin compiler runs in a separate isolated
process, which prevents other Maven plugins from overriding system properties. You can see an example in this [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-43894/Maven-Windows-error-RuntimeException-Could-not-find-installation-home-path).

Starting with Kotlin %kotlinEapVersion%, the Kotlin daemon is used by default. This gives you the added benefit of [incremental compilation](maven.md#enable-incremental-compilation),
which can help speed up your build times. If you want to revert to the previous behavior, opt out by setting the following
property in your `pom.xml` file to `false`:

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

Kotlin %kotlinEapVersion% also introduces a new `jvmArgs` property, which you can use to customize the default JVM arguments
for the Kotlin daemon. For example, to override the `-Xmx` and `-Xms` options, add the following to your `pom.xml` file:

```xml
<properties>
    <kotlin.compiler.daemon.jvmArgs>Xmx1500m,Xms500m</kotlin.compiler.daemon.jvmArgs>
</properties>
```

## Standard library: support for identifying interface types through reflection in Kotlin/JS
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% adds the experimental `KClass.isInterface` property to the Kotlin/JS standard library.

With this property, you can now check whether a class reference represents a Kotlin interface. This brings Kotlin/JS closer
to parity with Kotlin/JVM, where you can use `KClass.java.isInterface` to check if a class represents an interface.

To opt in, use the `@OptIn(ExperimentalStdlibApi::class)` annotation:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun inspect(klass: KClass<*>) {
    // Prints true for interfaces
    println(klass.isInterface)
}
```

We would appreciate your feedback in our issue tracker, [YouTrack](https://youtrack.jetbrains.com/issue/KT-78581).