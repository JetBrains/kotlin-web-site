[//]: # (title: What's new in Kotlin 2.2.20)

_[Released: September 10, 2025](releases.md#release-details)_

> Share your thoughts on Kotlin!
> 
> [Take our Kotlin Developer Survey](https://surveys.jetbrains.com/s3/7e238a7b85e5). It only takes about 10 minutes. 
> Your feedback helps us improve the language, tools, and ecosystem.
> 
{style="note"}

The Kotlin 2.2.20 release is out, delivering important changes for web development. [Kotlin/Wasm is now Beta](#kotlin-wasm),
with improvements to [exception handling in JavaScript interop](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop),
[npm dependency management](#separated-npm-dependencies), [built-in browser debugging support](#support-for-debugging-in-browsers-without-configuration),
and a new [shared source set for `js` and `wasmJs` targets](#shared-source-set-for-js-and-wasmjs-targets).

Additionally, here are some main highlights:

* **Kotlin Multiplatform**: [Swift export available by default](#swift-export-available-by-default), [stable cross-platform compilation for Kotlin libraries](#stable-cross-platform-compilation-for-kotlin-libraries), and a [new approach for declaring common dependencies](#new-approach-for-declaring-common-dependencies).
* **Language**: [Improved overload resolution when passing lambdas to overloads with suspend function types](#improved-overload-resolution-for-lambdas-with-suspend-function-types).
* **Kotlin/Native**: [Support for stack canaries in binaries](#support-for-stack-canaries-in-binaries) and [smaller binary size for release binaries](#smaller-binary-size-for-release-binaries).
* **Kotlin/JS**: [`Long` values compiled into JavaScript `BigInt`](#usage-of-the-bigint-type-to-represent-kotlin-s-long-type).

> Compose Multiplatform for web goes Beta. Learn more in our [blog post](https://blog.jetbrains.com/kotlin/2025/09/compose-multiplatform-1-9-0-compose-for-web-beta/).
>
{style="note"}

## IDE support

The Kotlin plugin that supports Kotlin 2.2.20 is bundled in the latest versions of IntelliJ IDEA and Android Studio. 
To update, all you need to do is change the Kotlin version to 2.2.20 in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.

## Language

In Kotlin 2.2.20, you can try out upcoming language features planned for Kotlin 2.3.0, including
[improved overload resolution when passing lambdas to overloads with `suspend` function types](#improved-overload-resolution-for-lambdas-with-suspend-function-types)
and [support for `return` statements in expression bodies with explicit return types](#support-for-return-statements-in-expression-bodies-with-explicit-return-types). This release also includes
improvements to [exhaustiveness checks for `when` expressions](#data-flow-based-exhaustiveness-checks-for-when-expressions),
[reified `Throwable` catches](#support-for-reified-types-in-catch-clauses), and [Kotlin contracts](#improved-kotlin-contracts).

### Improved overload resolution for lambdas with `suspend` function types

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

    // Uses an explicit cast, but the compiler incorrectly reports 
    // a "No cast needed" warning
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

### Support for `return` statements in expression bodies with explicit return types

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

### Data-flow-based exhaustiveness checks for `when` expressions
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 introduces **data-flow-based** exhaustiveness checks for `when` expressions.
Previously, the compiler's checks were limited to the `when` expression itself,
often forcing you to add a redundant `else` branch.
With this update, the compiler now tracks prior condition checks and early returns,
so you can remove redundant `else` branches.

For example, the compiler now recognizes that the function returns when the `if` condition is met,
so the `when` expression only needs to handle the remaining cases:

```kotlin
enum class UserRole { ADMIN, MEMBER, GUEST }

fun getPermissionLevel(role: UserRole): Int {
    // Covers the Admin case outside of the when expression
    if (role == UserRole.ADMIN) return 99

    return when (role) {
        UserRole.MEMBER -> 10
        UserRole.GUEST -> 1
        // You no longer have to include this else branch 
        // else -> throw IllegalStateException()
    }
}
```

This feature is [Experimental](components-stability.md#stability-levels-explained).
To enable it, add the following compiler option to your `build.gradle(.kts)` file:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xdata-flow-based-exhaustiveness")
    }
}
```

### Support for reified types in `catch` clauses
<primary-label ref="experimental-opt-in"/>

In Kotlin 2.2.20, the compiler now allows using [reified generic type parameters](inline-functions.md#reified-type-parameters) in `catch` clauses of `inline` functions.

Here's an example:

```kotlin
inline fun <reified ExceptionType : Throwable> handleException(block: () -> Unit) {
    try {
        block()
        // This is now allowed after the change
    } catch (e: ExceptionType) {
        println("Caught specific exception: ${e::class.simpleName}")
    }
}

fun main() {
    // Tries to perform an action that might throw an IOException
    handleException<java.io.IOException> {
        throw java.io.IOException("File not found")
    }
    // Caught specific exception: IOException
}
```

Previously, attempting to catch a reified `Throwable` type in an `inline` function would result in an error.

This behavior will be enabled by default in Kotlin 2.4.0.
To use it now, add the following compiler option to your `build.gradle(.kts)` file:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-reified-type-in-catch")
    }
}
```

The Kotlin team is grateful to external contributor [Iven Krall](https://github.com/kralliv) for their contribution.

### Improved Kotlin contracts
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 introduces several improvements to [Kotlin contracts](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/contract.html), including:

* [Support for generics in contract type assertions](#support-for-generics-in-contract-type-assertions).
* [Support for contracts inside property accessors and specific operator functions](#support-for-contracts-inside-property-accessors-and-specific-operator-functions).
* [Support for the `returnsNotNull()` function in contracts](#support-for-the-returnsnotnull-function-in-contracts) as a way to ensure a non-null return value when a condition is met.
* [New `holdsIn` keyword](#new-holdsin-keyword), allowing you to assume conditions are true when passed inside lambdas.

These improvements are [Experimental](components-stability.md#stability-levels-explained). To opt in, you still need to 
use the `@OptIn(ExperimentalContracts::class)` annotation when declaring contracts. The `holdsIn` keyword and the `returnsNotNull()`
function also need the `@OptIn(ExperimentalExtendedContracts::class)` annotation.

To use these improvements, you also need to add the compiler options described in each section below.

We would appreciate your feedback in our [issue tracker](https://kotl.in/issue).

#### Support for generics in contract type assertions

You can now write contracts that perform type assertions on generic types:

```kotlin
import kotlin.contracts.*

sealed class Failure {
    class HttpError(val code: Int) : Failure()
    // Insert other failure types here
}

sealed class Result<out T, out F : Failure> {
    class Success<T>(val data: T) : Result<T, Nothing>()
    class Failed<F : Failure>(val failure: F) : Result<Nothing, F>()
}

@OptIn(ExperimentalContracts::class)
// Uses a contract to assert a generic type
fun <T, F : Failure> Result<T, F>.isHttpError(): Boolean {
    contract {
        returns(true) implies (this@isHttpError is Result.Failed<Failure.HttpError>)
    }
    return this is Result.Failed && this.failure is Failure.HttpError
}
```

In this example, the contract performs a type assertion on the `Result` object, allowing the compiler to safely [smart cast](typecasts.md#smart-casts) it
to the asserted generic type.

This feature is [Experimental](components-stability.md#stability-levels-explained). To opt in, add the following compiler
option to your `build.gradle(.kts)` file:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-contracts-on-more-functions")
    }
}
```

#### Support for contracts inside property accessors and specific operator functions

You can now define contracts inside property accessors and specific operator functions.
This lets you use contracts on more types of declarations, making them more flexible.

For example, you can use a contract inside a getter to enable smart casting for a receiver object:

```kotlin
import kotlin.contracts.*

val Any.isHelloString: Boolean
    get() {
        @OptIn(ExperimentalContracts::class)
        // Enables smart casting the receiver to String when the getter returns true
        contract { returns(true) implies (this@isHelloString is String) }
        return "hello" == this
    }

fun printIfHelloString(x: Any) {
    if (x.isHelloString) {
        // Prints the length after the smart cast of the receiver to String
        println(x.length)
        // 5
    }
}
```

Additionally, you can use contracts in the following operator functions:

* `invoke`
* `contains`
* `rangeTo`, `rangeUntil`
* `componentN`
* `iterator`
* `unaryPlus`, `unaryMinus`, `not`
* `inc`, `dec`

Here's an example of using a contract in an operator function to ensure the initialization of a variable inside a lambda:

```kotlin
import kotlin.contracts.*

class Runner {
    @OptIn(ExperimentalContracts::class)
    // Enables initialization of variables assigned inside the lambda
    operator fun invoke(block: () -> Unit) {
        contract {
            callsInPlace(block, InvocationKind.EXACTLY_ONCE)
        }
        block()
    }
}

fun testOperator(runner: Runner) {
    val number: Int
    runner {
        number = 1
    }
    // Prints the value after definite initialization guaranteed by the contract
    println(number)
    // 1
}
```

This feature is [Experimental](components-stability.md#stability-levels-explained). To opt in, add the following compiler
option to your `build.gradle(.kts)` file:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-contracts-on-more-functions")
    }
}
```

#### Support for the `returnsNotNull()` function in contracts

Kotlin 2.2.20 introduces the [`returnsNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/-contract-builder/returns-not-null.html) function for contracts.
You can use this function to ensure that a function returns a non-null value when a specific condition is met.
This simplifies your code by replacing separate nullable and non-nullable function overloads with a single, concise function:

```kotlin
import kotlin.contracts.*

@OptIn(ExperimentalContracts::class, ExperimentalExtendedContracts::class)
fun decode(encoded: String?): String? {
    contract {
        // Guarantees a non-null return value when the input is non-null
        (encoded != null) implies (returnsNotNull())
    }
    if (encoded == null) return null
    return java.net.URLDecoder.decode(encoded, "UTF-8")
}

fun useDecodedValue(s: String?) {
    // Uses a safe call since the return value may be null
    decode(s)?.length
    if (s != null) {
        // Treats the return value as non-null after the smart cast
        decode(s).length
    }
}
```

In this example, the contract in the `decode()` function allows the compiler to smart-cast its return value when the input
is non-null, removing the need for extra null checks or multiple overloads.

This feature is [Experimental](components-stability.md#stability-levels-explained). To opt in, add the following compiler
option to your `build.gradle(.kts)` file:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-condition-implies-returns-contracts")
    }
}
```

#### New `holdsIn` keyword

Kotlin 2.2.20 introduces the new [`holdsIn`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/-contract-builder/holds-in.html) keyword for contracts.
You can use it to ensure that a boolean condition is assumed to be `true` inside a specific lambda. This lets you build
DSLs with conditional smart casts using contracts.

Here's an example:

```kotlin
import kotlin.contracts.*

@OptIn(ExperimentalContracts::class, ExperimentalExtendedContracts::class)
fun <T> T.alsoIf(condition: Boolean, block: (T) -> Unit): T {
    contract {
        // Declares that the lambda runs at most once
        callsInPlace(block, InvocationKind.AT_MOST_ONCE)
        // Declares that the condition is assumed to be true inside the lambda
        condition holdsIn block
    }
    if (condition) block(this)
    return this
}

fun useApplyIf(input: Any) {
    val result = listOf(1, 2, 3)
        .first()
        .alsoIf(input is Int) {
            // The input parameter is smart cast to Int inside the lambda
            // Prints the sum of input and first list element
            println(input + it)
            // 2
        }
        .toString()
}
```

This feature is [Experimental](components-stability.md#stability-levels-explained). To opt in, add the following compiler
option to your `build.gradle(.kts)` file:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-holdsin-contract")
    }
}
```

## Kotlin/JVM: Support `invokedynamic` with `when` expressions
<primary-label ref="experimental-opt-in"/> 

In Kotlin 2.2.20, you can now compile `when` expressions with `invokedynamic`. Previously, `when` expressions with multiple
type checks compiled to a long chain of `instanceof` checks in the bytecode.

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

This feature is [Experimental](components-stability.md#stability-levels-explained). We would appreciate your feedback in our issue tracker, [YouTrack](https://youtrack.jetbrains.com/issue/KT-65688).

## Kotlin Multiplatform

Kotlin 2.2.20 introduces significant changes for Kotlin Multiplatform: Swift export is available by default,
there's a new shared source set, and you can try a new approach to managing common dependencies.

### Swift export available by default
<primary-label ref="experimental-general"/> 

Kotlin 2.2.20 introduces experimental support for Swift export. It allows you to export Kotlin sources directly
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

The feature is currently [Experimental](components-stability.md#stability-levels-explained) and works only in projects that use [direct integration](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html)
to connect the iOS framework to the Xcode project. This is a standard configuration for multiplatform projects
created with the Kotlin Multiplatform plugin in IntelliJ IDEA or through the [web wizard](https://kmp.jetbrains.com/).

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

For more information about Swift export, see our [documentation](native-swift-export.md).

#### Leave feedback

We're planning to expand and gradually stabilize Swift export support in future Kotlin releases. After
Kotlin 2.2.20, we'll focus on improving interoperability between Kotlin and Swift, particularly around coroutines and flows.

Support for Swift export is a significant change for Kotlin Multiplatform. We would appreciate your feedback:

* Contact the development team directly in Kotlin Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) and join the [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) channel.
* Report any problems you face with Swift export in [YouTrack](https://kotl.in/issue).

### Shared source set for `js` and `wasmJs` targets

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
when you use the [default hierarchy template](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template).

With this change, the `web` source set becomes a parent of both `js` and `wasmJs` source sets. The updated source set
hierarchy looks like this:

![An example of using the default hierarchy template with web](default-hierarchy-example-with-web.svg)

The new source set allows you to write one piece of code for both the `js` and `wasmJs` targets.
You can put your shared code in `webMain` and have it automatically work for both:

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// webMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

actual suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

This update simplifies code sharing between the `js` and `wasmJs` targets. It is particularly useful in two cases:

* If you're a library author, and you want to add support for both the `js` and `wasmJs` targets, without duplicating code.
* If you're developing Compose Multiplatform applications that target the web, enabling cross-compilation for both the `js` and `wasmJs` targets
  for wider browser compatibility. Given this fallback mode, when you create a website, it works on all browsers out
  of the box, as modern browsers use `wasmJs` and older ones use `js`.

To try this feature, use the [default hierarchy template](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template) in the `kotlin {}` block of your `build.gradle(.kts)` file:

```kotlin
kotlin {
    js()
    wasmJs()

    // Enables the default source set hierarchy, including webMain and webTest
    applyDefaultHierarchyTemplate()
}
```

Before using the default hierarchy, consider carefully any potential conflicts if you have projects with a custom shared
source set or if you've renamed the `js("web")` target. To resolve these conflicts, rename the conflicting source set or target, or
don't use the default hierarchy.

### Stable cross-platform compilation for Kotlin libraries

Kotlin 2.2.20 completes an important [roadmap item](https://youtrack.jetbrains.com/issue/KT-71290), stabilizing
cross-platform compilation for Kotlin libraries.

You can now use any host to produce `.klib` artifacts for publishing Kotlin libraries. This significantly streamlines the
publishing process, particularly for Apple targets that previously required a Mac machine.

The feature is available by default. If you have already enabled cross-compilation with `kotlin.native.enableKlibsCrossCompilation=true`,
you can now remove it from your `gradle.properties` file.

Unfortunately, a few limitations are still present. You still need to use a Mac machine if:

* Your library or any dependent modules have [cinterop dependencies](native-c-interop.md).
* You have the [CocoaPods integration](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) set up in your project.
* You need to build or test [final binaries](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html) for Apple targets.

For more information about the publication of multiplatform libraries, see our [documentation](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html).

### New approach for declaring common dependencies
<primary-label ref="experimental-opt-in"/>

To simplify setting up multiplatform projects with Gradle, Kotlin 2.2.20 now lets you declare common dependencies
in the `kotlin {}` block by using a top-level `dependencies {}` block when your project uses Gradle 8.8 or higher. 
These dependencies behave as if they were declared in the `commonMain` source set. This feature works similarly to the 
dependencies block that you use for Kotlin/JVM and Android-only projects, and it's now [Experimental](components-stability.md#stability-levels-explained) in Kotlin 
Multiplatform.

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

### New diagnostic for target support in dependencies

Before Kotlin 2.2.20, if a dependency in your build script didn't support all the targets required by the source set,
the error messages produced by Gradle made it hard to understand the problem.

Kotlin 2.2.20 introduces a new diagnostic that clearly shows which targets each dependency supports and which it doesn't.

This diagnostic is enabled by default. If, for some reason, you need to disable it, let us know in a comment in this [YouTrack issue](https://kotl.in/kmp-dependencies-diagnostic-issue).
You can use the following Gradle properties to disable the diagnostic in your `gradle.properties` file:

| Property                                                 | Description                                                    |
|----------------------------------------------------------|----------------------------------------------------------------|
| `kotlin.kmp.eagerUnresolvedDependenciesDiagnostic=false` | Runs the diagnostic only for metadata compilations and imports |
| `kotlin.kmp.unresolvedDependenciesDiagnostic=false`      | Disables the diagnostic completely                             |

## Kotlin/Native

Kotlin 2.2.20 brings improvements to interoperability with Objective-C/Swift, debugging, and new binary options.

### Support for stack canaries in binaries

Starting with Kotlin 2.2.20, Kotlin adds support for stack canaries in the resulting Kotlin/Native binaries. As part of
stack protection, this security feature protects against stack smashing, mitigating some common application vulnerabilities.
Already available in Swift and Objective-C, it's now supported in Kotlin as well.

The implementation of stack protection in Kotlin/Native follows the behavior of the stack protector in [Clang](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fstack-protector).

To enable stack canaries, add the following [binary option](native-binary-options.md) to your `gradle.properties` file:

```none
kotlin.native.binary.stackProtector=yes
```

The property enables the feature for all the Kotlin functions that are vulnerable to stack smashing. Alternative modes are:

* `kotlin.native.binary.stackProtector=strong`, which uses a stronger heuristic for the functions vulnerable to stack smashing.
* `kotlin.native.binary.stackProtector=all`, which enables stack protectors for all functions.

Note that in some cases, stack protection might come with a performance cost.

### Smaller binary size for release binaries
<primary-label ref="experimental-opt-in"/> 

Kotlin 2.2.20 introduces the `smallBinary` option that can help you decrease the binary size for release binaries.
The new option effectively sets `-Oz` as the default optimization argument for the compiler during the LLVM compilation phase.

With the `smallBinary` option enabled, you can make release binaries smaller and improve build time. However, it might
affect runtime performance in some cases.

The new feature is currently [Experimental](components-stability.md#stability-levels-explained). To try it out in your
project, add the following [binary option](native-binary-options.md) to your `gradle.properties` file:

```none
kotlin.native.binary.smallBinary=true
```

The Kotlin team is grateful to [Troels Lund](https://github.com/troelsbjerre) for his help in implementing this feature.

### Improved debugger object summaries

Kotlin/Native now generates clearer object summaries for debugger tools like LLDB and GDB. This improves the
readability of the produced debug information and streamlines your debugging experience.

Consider the following object, for example:

```kotlin
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
```

Previously, the inspection would show you only limited information, including a pointer to the object's memory address:

```none
(lldb) v point
(ObjHeader *) point = [x: ..., y: ...]
(lldb) v point->x
(int32_t *) x = 0x0000000100274048
```

With Kotlin 2.2.20, the debugger now shows richer details, including the actual values:

```none
(lldb) v point
(ObjHeader *) point = Point(x=1, y=2)
(lldb) v point->x
(int32_t) point->x = 1
```

The Kotlin team is grateful to [Nikita Nazarov](https://github.com/nikita-nazarov) for his help in implementing this feature.

For more information on debugging in Kotlin/Native, see the [documentation](native-debugging.md).

### Explicit names in block types for Objective-C headers

Kotlin 2.2.20 introduces an option to add explicit parameter names to Kotlin's function types for Objective-C headers 
exported from Kotlin/Native projects. Parameter names improve autocomplete suggestions in Xcode and help avoid Clang warnings.

Previously, parameter names in block types were omitted in the generated Objective-C headers. In such cases, Xcode's autocompletion
would suggest calling such functions without parameter names in the Objective-C block. The generated block would trigger Clang warnings.

For example, for the following Kotlin code:

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

The generated Objective-C header had no parameter name:

```objc
// Objective-C:
+ (void)greetUserBlock:(void (^)(NSString *))block __attribute__((swift_name("greetUser(block:)")));
```

So when calling the `greetUserBlock()` function from Objective-C in Xcode, the IDE suggested:

```objc
// Objective-C:
greetUserBlock:^(NSString *) {
    // ...
};
```

The missing parameter name `(NSString *)` in the suggestion caused Clang warnings.

With the new option, Kotlin forwards the parameter names from Kotlin function types to Objective-C block types, so Xcode
uses them in suggestions:

```objc
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

To enable explicit parameter names, add the following [binary option](native-binary-options.md) to your `gradle.properties` file:

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=true
```

The Kotlin team is grateful to [Yijie Jiang](https://github.com/edisongz) for implementing this feature.

### Reduced size of Kotlin/Native distribution

The Kotlin/Native distribution used to contain two JAR files with compiler code:

* `konan/lib/kotlin-native.jar`
* `konan/lib/kotlin-native-compiler-embeddable.jar`.

Starting with Kotlin 2.2.20, `kotlin-native.jar` is no longer published.

The removed JAR file is the legacy version of the embeddable compiler, which is no longer needed. This change significantly
reduces the size of the distribution.

As a consequence, the following options are now deprecated and removed:

* The `kotlin.native.useEmbeddableCompilerJar=false` Gradle property. Instead, the embeddable compiler JAR file is always
  used for Kotlin/Native projects.
* The `KotlinCompilerPluginSupportPlugin.getPluginArtifactForNative()` function. Instead, the [`getPluginArtifact()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compiler-plugin-support-plugin/get-plugin-artifact.html)
  function is always used.

For more information, see the [YouTrack issue](https://kotl.in/KT-51301).

### Exporting KDocs to Objective-C headers by default

[KDoc](kotlin-doc.md) comments are now exported by default when generating Objective-C headers during compilation of Kotlin/Native final binaries.

Previously, you needed to add the `-Xexport-kdoc` option manually to your build file. Now, it's automatically passed to compilation tasks.

This option embeds KDoc comments into klibs and extracts comments from klibs when producing Apple frameworks. As a result,
comments on classes and methods appear during autocompletion, for example, in Xcode.

You can disable the export of KDoc comments from klibs to the produced Apple frameworks in the `binaries {}` block of 
your `build.gradle(.kts)` file:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

kotlin {
    iosArm64 {
        binaries {
            framework { 
                baseName = "sdk"
                @OptIn(ExperimentalKotlinGradlePluginApi::class)
                exportKdoc.set(false)
            }
        }
    }
}
```

For more information, see [our documentation](native-objc-interop.md#provide-documentation-with-kdoc-comments).

### Deprecation of `x86_64` Apple targets

Apple stopped producing devices with Intel chips a couple of years ago and [recently announced](https://www.youtube.com/live/51iONeETSng?t=3288s) 
that macOS Tahoe 26 will be the last OS version to support Intel-based architecture.

This makes it increasingly difficult for us to properly test these targets on our build agents, especially in future Kotlin
releases where we'll update the supported Xcode version that comes with macOS 26.

Starting with Kotlin 2.2.20, the `macosX64` and `iosX64` targets are demoted to support tier 2. This means the target is
regularly tested on CI to ensure it compiles, but it might not be automatically tested to ensure it runs.

We plan to gradually deprecate all `x86_64` Apple targets and eventually remove support for them during the Kotlin 2.2.20−2.4.0
release cycle. This includes the following targets:

* `macosX64`
* `iosX64`
* `tvosX64`
* `watchosX64`

For more information on support tiers, see [Kotlin/Native target support](native-target-support.md).

## Kotlin/Wasm

Kotlin/Wasm is now Beta, offering greater stability along with improvements such as separated npm dependencies, 
[refined exception handling for JavaScript interop](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop),
[built-in browser debugging support](#support-for-debugging-in-browsers-without-configuration), and more.

### Separated npm dependencies

Previously, in your Kotlin/Wasm projects, all [npm](https://www.npmjs.com/) dependencies were installed together in your project folder,
including both Kotlin tooling dependencies and your own. They were also recorded together in your project's lock files
(`package-lock.json` or `yarn.lock`).

As a result, whenever Kotlin tooling dependencies were updated, you had to update your lock files even if you didn't add
or change anything.

Starting from Kotlin 2.2.20, the Kotlin tooling npm dependencies are installed outside your project. Now, the
tooling and your (user) dependencies have separate directories:

* **Tooling dependencies' directory:**

  `<kotlin-user-home>/kotlin-npm-tooling/<yarn|npm>/hash/node_modules`

* **User dependencies' directory:**

  `build/wasm/node_modules`

In addition, the lock files inside the project directory contain only user-defined dependencies.

This improvement keeps your lock files focused only on your own dependencies, helps maintain a cleaner project, and
reduces unnecessary changes to your files.

This change is enabled by default for the `wasm-js` target. The change is not yet implemented for the `js` target. While
there are plans to implement it in future releases, the behavior of the npm dependencies remains the same as before for
the `js` target in Kotlin 2.2.20.

### Improved exception handling in Kotlin/Wasm and JavaScript interop

Previously, Kotlin had difficulty understanding exceptions (errors) thrown in JavaScript (JS) and crossing over to Kotlin/Wasm code.

In some cases, the issue also occurred in the reverse direction, when an exception was thrown or passed through the Wasm
code to JS and wrapped into `WebAssembly.Exception` without any details. These Kotlin exception handling issues made
debugging difficult.

Starting from Kotlin 2.2.20, the developer experience with exceptions improves in both directions:

* When exceptions are thrown from JS, you can see more information on Kotlin's side.
  When such an exception propagates through Kotlin back to JS, it's no longer wrapped into WebAssembly.
* When exceptions are thrown from Kotlin, they can now be caught on the JS side as JS errors.

The new exception handling works automatically in modern browsers that support the [`WebAssembly.JSTag`](https://webassembly.github.io/exception-handling/js-api/#dom-webassembly-jstag)
feature:

* Chrome 115+
* Firefox 129+
* Safari 18.4+

In older browsers, the exception handling behavior remains unchanged.

### Support for debugging in browsers without configuration

Previously, browsers couldn't automatically access the Kotlin/Wasm project sources required for debugging.
To debug Kotlin/Wasm applications in the browser, you had to manually configure your build to serve these sources
by adding the following snippet to your `build.gradle(.kts)` file:

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        add(project.rootDir.path)
    }
}
```

Starting with Kotlin 2.2.20, debugging your applications in [modern browsers](wasm-configuration.md#browser-versions) works out of the box.
When you run Gradle development tasks (`*DevRun`), Kotlin automatically serves the source files to the browser, allowing you to
set breakpoints, inspect variables, and step through Kotlin code without extra setup.

This change simplifies debugging by removing the need for manual configuration. The required configuration is now included
in the Kotlin Gradle plugin. If you previously added this configuration to your `build.gradle(.kts)` file, you should remove it to avoid conflicts.

Debugging in browsers is enabled by default for all Gradle `*DevRun` tasks. These tasks serve not only the application 
but also its source files, so use them only for local development and avoid running them in cloud or production environments
where the sources would be publicly exposed.

#### Handle repeated reloads during debugging

Serving sources by default may cause [repeated reloads of the application in the browser before Kotlin compilation and bundling are complete](https://youtrack.jetbrains.com/issue/KT-80582/Multiple-reloads-when-using-webpack-dev-server-after-2.2.20-Beta2#focus=Comments-27-12596427.0-0).
As a workaround, adjust your webpack configuration to ignore Kotlin source files and disable watching for served static files.
Add a `.js` file with the following content into the `webpack.config.d` directory at the root of your project:

```kotlin
config.watchOptions = config.watchOptions || {
    ignored: ["**/*.kt", "**/node_modules"]
}

if (config.devServer) {
    config.devServer.static = config.devServer.static.map(file => {
        if (typeof file === "string") {
        return { directory: file,
                 watch: false,
        }
    } else {
        return file
    }
    })
}
```

### Elimination of empty `yarn.lock` files

Previously, the Kotlin Gradle plugin (KGP) automatically generated a `yarn.lock` file that included information about 
npm packages required by the Kotlin toolchain, along with any existing [npm](https://www.npmjs.com/) dependencies from the project or used libraries.

Now, the KGP manages toolchain dependencies separately, and a project-level `yarn.lock` file is no longer generated unless
the project has npm dependencies.

The KGP automatically creates a `yarn.lock` file when npm dependencies are added, and it deletes the `yarn.lock` file 
when npm dependencies are removed.

This change cleans up project structures and makes it easier to track when actual npm dependencies are introduced.

No additional steps are required to configure this behavior. It's applied by default in Kotlin/Wasm projects starting from Kotlin 2.2.20.

### New compiler error in fully qualified class names

On Kotlin/Wasm, the compiler doesn't store fully qualified names (FQNs) of classes in the generated binary by default.
This approach avoids increasing the application size.

As a result, in previous Kotlin releases, calling the `KClass::qualifiedName` property returned an empty string instead
of the class's qualified name.

Starting with Kotlin 2.2.20, the compiler reports an error when you use the `KClass::qualifiedName` property in Kotlin/Wasm projects,
unless you explicitly enable the qualified names feature.

This change prevents unexpected empty strings when calling the `qualifiedName` property and improves developer experience by catching
issues at compile time.

The diagnostic is enabled by default, and errors are reported automatically. To disable the diagnostics and allow storing FQNs in
Kotlin/Wasm, instruct the compiler to store fully qualified names for all classes by adding the following option to your
`build.gradle(.kts)` file:

```kotlin
kotlin {
    wasmJs {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-kclass-fqn")
        }
    }
}
```

> Keep in mind that enabling this option increases the application size.
>
{style="note"}

## Kotlin/JS

Kotlin 2.2.20 supports using the `BigInt` type to represent Kotlin's `Long` type, enabling `Long` in exported
declarations. Additionally, this release adds a DSL function to clean up Node.js arguments.

### Usage of the `BigInt` type to represent Kotlin's `Long` type
<primary-label ref="experimental-opt-in"/>

Before the ES2020 standard, JavaScript (JS) did not support a primitive type for precise integers
larger than 53 bits.

For this reason, Kotlin/JS used to represent `Long` values (which are 64-bit wide) as JavaScript objects containing two
`number` properties. This custom implementation made interoperability between Kotlin and JavaScript more complex.

Starting with Kotlin 2.2.20, Kotlin/JS now uses JavaScript's built-in `BigInt` type to represent Kotlin's `Long` values
when compiling to modern JavaScript (ES2020).

This change enables [exporting the `Long` type to JavaScript](#usage-of-long-in-exported-declarations), a feature also
introduced in Kotlin 2.2.20. As a result, this change simplifies the interoperability between Kotlin and JavaScript.

To enable it, you need to add the following compiler option to your `build.gradle(.kts)` file:

```kotlin
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

This feature is [Experimental](components-stability.md#stability-levels-explained). We would appreciate your feedback in our issue tracker, [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128).

#### Usage of `Long` in exported declarations

Because Kotlin/JS used a custom `Long` representation, it was difficult to provide a straightforward way to interact with
Kotlin's `Long` from JavaScript. As a result, you couldn't export Kotlin code that used the `Long` type to JavaScript.
This issue affected any code using `Long`, such as function parameters, class properties, or constructors.

Now that Kotlin's `Long` type can be compiled to JavaScript's `BigInt` type, Kotlin/JS supports exporting `Long` values to JavaScript,
simplifying the interoperability between Kotlin and JavaScript code.

To enable this feature:

1. Allow exporting `Long` in Kotlin/JS by adding the following compiler option to the `freeCompilerArgs` attribute
   in your `build.gradle(.kts)` file:

    ```kotlin
    kotlin {
        js {
            ...
            compilerOptions {                   
                freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
            }
        }
    }
    ```

2. Enable the `BigInt` type. See how to enable it in [Usage of the `BigInt` type to represent Kotlin's `Long` type](#usage-of-the-bigint-type-to-represent-kotlin-s-long-type).

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

To fix this issue, Kotlin 2.2.20 introduces a new DSL function called `passCliArgumentsToMainFunction()`.

With this function, only the command-line arguments are included, while the `Node` and script paths are excluded:

```kotlin
fun main(args: Array<String>) {
    // No need for drop() and only your custom arguments are included 
    println(args.joinToString(", "))
}
```

This change reduces boilerplate code, prevents mistakes caused by manually dropping arguments, and improves cross-platform compatibility.

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

## Gradle

Kotlin 2.2.20 adds new compiler performance metrics for Kotlin/Native tasks in Gradle build reports and makes quality-of-life
improvements in incremental compilation.

### New compiler performance metrics in build reports for Kotlin/Native tasks

In Kotlin 1.7.0, we introduced [build reports](gradle-compilation-and-caches.md#build-reports) to help track compiler
performance. Since then, we've added more metrics to make these reports even more detailed and useful for investigating
performance issues.

In Kotlin 2.2.20, build reports now include compiler performance metrics for Kotlin/Native tasks.

To learn more about build reports and how to configure them, see [Enabling build reports](gradle-compilation-and-caches.md#enabling-build-reports).

### Preview improved incremental compilation for Kotlin/JVM
<primary-label ref="experimental-general"/>

Kotlin 2.0.0 introduced the new K2 compiler with an optimized frontend. Kotlin 2.2.20 builds on this by using the new
frontend to improve performance in certain complex incremental compilation scenarios for Kotlin/JVM.

These improvements are disabled by default while we work on stabilizing the behavior. To enable them, add the following
property in your `gradle.properties` file:

```none
kotlin.incremental.jvm.fir=true
```

Currently, the [`kapt` compiler plugin](kapt.md) isn't compatible with this new behavior. We're working on adding support
in a future Kotlin release.

We'd appreciate your feedback on this feature in [YouTrack](https://youtrack.jetbrains.com/issue/KT-72822).

### Incremental compilation detects changes in lambdas of inline functions

Before Kotlin 2.2.20, if you enabled incremental compilation and changed the logic inside a lambda in an inline function,
the compiler didn't recompile the call sites of that inline function in other modules. As a result, those call sites used
the previous version of the lambda, which could cause unexpected behavior.

In Kotlin 2.2.20, the compiler now detects changes in lambdas of inline functions and automatically recompiles their call sites.

## Maven: Support for the Kotlin daemon in the `kotlin-maven-plugin`

Kotlin 2.2.20 takes the [build tools API introduced in Kotlin 2.2.0](whatsnew22.md#new-experimental-build-tools-api) one
step further by adding support for the [Kotlin daemon](kotlin-daemon.md) in the `kotlin-maven-plugin`. When using the Kotlin daemon, the Kotlin
compiler runs in a separate isolated process, which prevents other Maven plugins from overriding system properties. You 
can see an example in this [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-43894/Maven-Windows-error-RuntimeException-Could-not-find-installation-home-path).

Starting with Kotlin 2.2.20, the Kotlin daemon is used by default. If you want to revert to the previous behavior, opt
out by setting the following property in your `pom.xml` file to `false`:

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

Kotlin 2.2.20 also introduces a new `jvmArgs` property, which you can use to customize the default JVM arguments
for the Kotlin daemon. For example, to override the `-Xmx` and `-Xms` options, add the following to your `pom.xml` file:

```xml
<properties>
    <kotlin.compiler.daemon.jvmArgs>Xmx1500m,Xms500m</kotlin.compiler.daemon.jvmArgs>
</properties>
```

## New common schema for Kotlin compiler options

Kotlin 2.2.20 introduces a common schema for all compiler options published under [`org.jetbrains.kotlin:kotlin-compiler-arguments-description`](https://central.sonatype.com/artifact/org.jetbrains.kotlin/kotlin-compiler-arguments-description).
This artifact includes both a code representation and a JSON equivalent (for non-JVM consumers) of all compiler options,
their descriptions, and metadata such as the version in which each option was introduced or stabilized. You can use this
schema to generate a custom view of the options or analyze them as needed.

## Kotlin standard library

This release introduces new experimental features in the standard library: reflection support for identifying interface
types in Kotlin/JS, update functions for common atomic types, and `copyOf()` overloads for array resizing.

### Support for identifying interface types through reflection in Kotlin/JS
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 adds the [Experimental](components-stability.md#stability-levels-explained) [`KClass.isInterface`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/is-interface.html) property
to the Kotlin/JS standard library.

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

### New update functions for common atomic types
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 introduces new experimental functions for updating common atomic types and elements of their array counterparts.
Each function atomically computes a new value using one of these update functions and replaces the current value, with the return value depending on which function you use:

* [`update()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update.html) and [`updateAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-at.html) set a new value without returning a result.
* [`fetchAndUpdate()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/fetch-and-update.html) and [`fetchAndUpdateAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/fetch-and-update-at.html) set a new value and return the previous value before the change.
* [`updateAndFetch()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-and-fetch.html) and [`updateAndFetchAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-and-fetch-at.html) set a new value and return the updated value after the change.

You can use these functions to implement atomic transformations that aren't supported out of the box, such as multiplication or bitwise operations.
Before this change, incrementing a common atomic type and reading the previous value required a loop with the [`compareAndSet()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent/-atomic-int/compare-and-set.html) function.

Like all APIs for common atomic types, these functions are [Experimental](components-stability.md#stability-levels-explained).
To opt in, use the `@OptIn(ExperimentalAtomicApi::class)` annotation.

Here's an example of code that performs different kinds of updates and returns either the previous or updated value:

```kotlin
import kotlin.concurrent.atomics.*
import kotlin.random.Random

@OptIn(ExperimentalAtomicApi::class)
fun main() {
    val counter = AtomicLong(Random.nextLong())
    val minSetBitsThreshold = 20

    // Sets a new value without using the result
    counter.update { if (it < 0xDECAF) 0xCACA0 else 0xC0FFEE }

    // Retrieves the current value, then updates it
    val previousValue = counter.fetchAndUpdate { 0x1CEDL.shl(Long.SIZE_BITS - it.countLeadingZeroBits()) or it }

    // Updates the value, then retrieves the result
    val current = counter.updateAndFetch {
        if (it.countOneBits() < minSetBitsThreshold) it.shl(20) or 0x15BADL else it
    }

    val hexFormat = HexFormat {
        upperCase = true
        number {
            removeLeadingZeros = true
        }
    }
    println("Previous value: ${previousValue.toHexString(hexFormat)}")
    println("Current value: ${current.toHexString(hexFormat)}")
    println("Expected status flag set: ${current and 0xBAD != 0xBADL}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.2.20"}

We would appreciate your feedback in our issue tracker, [YouTrack](https://youtrack.jetbrains.com/issue/KT-76389).

### Support for `copyOf()` overloads for arrays
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 introduces an experimental overload for the [`copyOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/copy-of.html) function.
It's available for arrays of generic type `Array<T>` and all primitive array types.

You can use this function to make an array larger and populate the new elements using values from an initializer lambda.
This can help you reduce custom boilerplate code and fixes the common pain point where resizing a generic `Array<T>` produced a nullable result (`Array<T?>`).

Here's an example:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val row1: Array<String> = arrayOf("one", "two")
    // Resizes the array and populates the new elements using the lambda
    val row2: Array<String> = row1.copyOf(4) { "default" }
    println(row2.contentToString())
    // [one, two, default, default]
}
```

This API is [Experimental](components-stability.md#stability-levels-explained). To opt in, use the `@OptIn(ExperimentalStdlibApi::class)` annotation.

We would appreciate your feedback in our [issue tracker](https://youtrack.jetbrains.com/issue/KT-70984).

## Compose compiler

In this release, the Compose compiler brings quality-of-life improvements by adding new warnings and improving the output of build metrics to make them easier to read.

### Language version restrictions for default parameters

With this release, the Compose compiler reports an error if the language version specified for compilation is lower than
what's required to support default parameters in abstract or open composable functions.

Default parameters are supported in the Compose compiler, starting with Kotlin 2.1.0 for abstract functions and Kotlin 2.2.0
for open functions. When using a newer version of the Compose compiler while targeting older Kotlin language versions,
library developers should be aware that default parameters in abstract or open functions may still appear in the public API,
even if the language version doesn't support them.

### Composable target warnings for the K2 compiler

This release adds warnings about [`@ComposableTarget`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/ComposableTarget)
mismatches when using the K2 compiler.

For example:

```text
@Composable fun App() {
  Box { // <-- `Box` is a `@UiComposable`
    Path(...) // <-- `Path` is a `@VectorComposable`
    ^^^^^^^^^
    warning: Calling a Vector composable function where a UI composable was expected
  }
}
```
### Fully qualified names in build metrics

Class and function names reported in build metrics are now fully qualified, making it easier to distinguish between 
declarations with the same name in different packages.

In addition, build metrics no longer include a dump of complex expressions from default parameters, making them easier to read.

## Breaking changes and deprecations

This section highlights important breaking changes and deprecations worth noting:

* The [kapt](kapt.md) compiler plugin now uses the K2 compiler by default. As a result, the `kapt.use.k2` property, which
  controls whether the plugin uses the K2 compiler, is deprecated. If you set this property to `false` to opt out of using
  the K2 compiler, Gradle shows a warning.

## Documentation updates

The Kotlin documentation has received some notable changes:

* [Kotlin roadmap](roadmap.md) – See the updated list of Kotlin's priorities on language and ecosystem evolution.
* [Properties](properties.md) – Learn about the many ways that you can use properties in Kotlin.
* [Conditions and loops](control-flow.md) – Learn how conditions and loops work in Kotlin.
* [Kotlin/JavaScript](js-overview.md) – Explore the use cases for Kotlin/JS.
* [Targeting the web](gradle-configure-project.md#targeting-the-web) – Learn about the different targets that Gradle offers for web development.
* [Kotlin daemon](kotlin-daemon.md) – Learn about the Kotlin daemon and how it works with build systems and the Kotlin compiler.
* [Coroutines overview page](coroutines-overview.md) – Learn about coroutine concepts and get started on your learning journey.
* [Kotlin/Native binary options](native-binary-options.md) – Learn about the binary options for Kotlin/Native and how to configure them.
* [Debugging Kotlin/Native](native-debugging.md) – Explore the different ways that you can debug with Kotlin/Native.
* [Tips for customizing LLVM backend](native-llvm-passes.md) – Learn how Kotlin/Native uses LLVM and adjust optimization passes.
* [Get started with Exposed's DAO API](https://www.jetbrains.com/help/exposed/get-started-with-exposed-dao.html) – Learn how to use Exposed's Data Access Object (DAO) API to store and retrieve data in a relational database.
* New pages in Exposed documentation about R2DBC:
  * [Working with databases](https://www.jetbrains.com/help/exposed/working-with-database.html)
  * [Working with ConnectionFactory](https://www.jetbrains.com/help/exposed/working-with-connectionfactory.html)
  * [Custom type mapping](https://www.jetbrains.com/help/exposed/custom-type-mapping.html)
* [HTMX integration](https://ktor.io/docs/htmx-integration.html) – Learn how Ktor provides experimental, first-class support for HTMX.

## How to update to Kotlin 2.2.20

The Kotlin plugin is distributed as a bundled plugin in IntelliJ IDEA and Android Studio.

To update to the new Kotlin version, [change the Kotlin version](releases.md#update-to-a-new-kotlin-version) to 2.2.20 in your build scripts.