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

* **Language:** [Stable context parameters, explicit backing fields, and multiple features for annotation use-site targets](#stable-features)
* **Standard library:** [Stable UUIDs](#stable-uuids-in-the-common-kotlin-standard-library) and [support for checking sorted order](#support-for-checking-sorted-order)
* **Kotlin/JVM:** [Support for Java 26](#support-for-java-26) and [annotations in metadata enabled by default](#annotations-in-metadata-enabled-by-default)
* **Kotlin/Native:** [Support for Swift packages as dependencies, updates on Swift export, and default CMS GC](#kotlin-native)
* **Kotlin/Wasm:** [Incremental compilation enabled by default and support for WebAssembly Component Model](#kotlin-wasm)
* **Kotlin/JS**: [Support for value class export and ES2015 features in JS code inlining](#kotlin-js)
* **Gradle:** [Compatibility with Gradle 9.4.1](#gradle)
* **Maven:** [Automatic alignment between Java and JVM target versions](#maven)
* **Kotlin compiler:** [More consistent inline function behavior during `.klib` compilation](#consistent-intra-module-function-inlining-during-klib-compilation)

> For information about the Kotlin release cycle, see [Kotlin release process](releases.md).
>
{style="tip"}

## Update to Kotlin %kotlinEapVersion%

The latest version of Kotlin is included in the latest versions of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
and [Android Studio](https://developer.android.com/studio).

To update to the new Kotlin version, make sure your IDE is updated to the latest version and [change the Kotlin version](releases.md#update-to-a-new-kotlin-version)
to %kotlinEapVersion% in your build scripts.

## New features {id=new-stable-features}
<primary-label ref="stable"/>

In previous Kotlin releases, several new features were introduced as Experimental.
The following features have now graduated to [Stable](components-stability.md#stability-levels-explained) in Kotlin %kotlinEapVersion%, so you no longer need to opt in to use them:

* [Context parameters](whatsnew22.md#preview-of-context-parameters), except for [context arguments](#explicit-context-arguments-for-context-parameters) and [callable references](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references)
* [`@all` meta-target for properties](whatsnew22.md#all-meta-target-for-properties)
* [New defaulting rules for use-site annotation targets](whatsnew22.md#new-defaulting-rules-for-use-site-annotation-targets)
* [Explicit backing fields](whatsnew23.md#explicit-backing-fields)
* [Stable UUIDs in the common Kotlin standard library](#stable-uuids-in-the-common-kotlin-standard-library)
* [Support for checking sorted order](#support-for-checking-sorted-order)
* [New API for converting unsigned integers to `BigInteger` on the JVM](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm)
* [Support for value class export to JavaScript/TypeScript](#support-for-value-class-export-to-javascript-typescript)
* [Support for ES2015 features when inlining JS code](#support-for-es2015-features-when-inlining-js-code)
* [Maven: Automatic alignment between Java and JVM target versions](#automatic-alignment-between-java-and-jvm-target-versions)

## New features {id=new-experimental-features}
<primary-label ref="experimental-exp"/>

* [Explicit context arguments for context parameters](#explicit-context-arguments-for-context-parameters)
* [Support for collection literals](#support-for-collection-literals)
* [Improved compile-time constants](#improved-compile-time-constants)
* [Swift package import](#swift-package-import)
* [Swift export: Support for exporting coroutine flows](#swift-export-support-for-exporting-coroutine-flows)
* [Support for the WebAssembly Component Model](#support-for-the-webassembly-component-model)

## Language

Kotlin %kotlinEapVersion% promotes context parameters, explicit backing fields, and annotation use-site targets features to [Stable](components-stability.md#stability-levels-explained).
This release also introduces [explicit context arguments for context parameters](#explicit-context-arguments-for-context-parameters).

### Stable features
<secondary-label ref="language"/>

Kotlin 2.2.0 introduced a few language features as [Experimental](components-stability.md#stability-levels-explained). We're happy to announce that the following language features are now [Stable](components-stability.md#stability-levels-explained) in this release:

* [Context parameters](whatsnew22.md#preview-of-context-parameters), except for [context arguments](#explicit-context-arguments-for-context-parameters) and [callable references](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references)
* [`@all` meta-target for properties](whatsnew22.md#all-meta-target-for-properties)
* [New defaulting rules for use-site annotation targets](whatsnew22.md#new-defaulting-rules-for-use-site-annotation-targets)
* [Explicit backing fields](whatsnew23.md#explicit-backing-fields)

[See the full list of Kotlin language design features and proposals](kotlin-language-features-and-proposals.md).

### Explicit context arguments for context parameters
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% introduces explicit context arguments for [context parameters](context-parameters.md).

Kotlin 2.3.20 [changed the overload resolution for context parameters](whatsnew2320.md#changes-to-overload-resolution-for-context-parameters).
As a result, calls to overloads that differ only by context parameters can become ambiguous.

You can now resolve this ambiguity by passing an explicit context argument at the call site.

Here's an example:

```kotlin
class EmailSender
class SmsSender

context(emailSender: EmailSender)
fun sendNotification() {
    println("Sent email notification")
}

context(smsSender: SmsSender)
fun sendNotification() {
    println("Sent SMS notification")
}

context(defaultEmailSender: EmailSender, defaultSmsSender: SmsSender)
fun notifyUser() {
    
    // Selects the overload with the EmailSender context parameter
    sendNotification(emailSender = defaultEmailSender)

    // Selects the overload with the SmsSender context parameter
    sendNotification(smsSender = defaultSmsSender)
}
```

You can also use explicit context arguments instead of the `context()` function to reduce nesting and make some calls easier to read.
If you need to use the same context arguments in multiple calls, use the `context()` function instead.

This feature is [Experimental](components-stability.md#stability-levels-explained). To opt in, add the following compiler
option to your build file:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-context-arguments")
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
                    <arg>-Xexplicit-context-arguments</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

For more information, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0448-explicit-context-arguments.md).

### Support for collection literals
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% introduces experimental support for collection literals. You can now create collections in a 
simpler and more concise way using brackets `[]`.

For example:

```kotlin
fun main() {
    // Mutable list with explicit type declaration
    // val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")

    // Mutable list with brackets syntax
    val shapes: MutableList<String> = ["triangle", "square", "circle"]
    println(shapes)
    // [triangle, square, circle]
}
```
{validate="false"}

> Currently, collection literals can't be used to construct collections defined in Java. For more information, see [KT-80494](https://youtrack.jetbrains.com/issue/KT-80494).
>
{style="note"}

If the compiler doesn't have enough information to infer the collection type, it defaults to the `List` type:

```kotlin
fun main() {
    val fruit = ["apple", "banana", "cherry"]
    
    println(fruit)
    // [apple, banana, cherry]
}
```
{validate="false"}

You can also declare custom `operator fun of` functions to use bracket syntax with your own types. For example, if you 
have the following `DoubleMatrix` class:

```kotlin
class DoubleMatrix(vararg val rows: Row) {
    companion object {
        operator fun of(vararg rows: Row) = DoubleMatrix(*rows)
    }
    class Row(vararg val elements: Double) {
        companion object {
            operator fun of(vararg elements: Double) = Row(*elements)
        }
    }
}
```
{validate="false"}

You can create an `identityMatrix` class instance like this:

```kotlin
fun main() {
    val identityMatrix: DoubleMatrix = [
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
    ]
}
```
{validate="false"}

In this example, the compiler translates the nested collection literals into calls to the corresponding `operator fun of`
functions. The compiler resolves these calls recursively and uses the expected types to choose the correct overloads.

This feature is [Experimental](components-stability.md#stability-levels-explained). To opt in, add the following compiler
option to your build file:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcollection-literals")
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
                    <arg>-Xcollection-literals</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

For more information, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0416-collection-literals.md).

### Improved compile-time constants
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin %kotlinEapVersion% brings experimental improvements to [compile-time constants](properties.md#compile-time-constants),
making support for numeric and string types more consistent and easier to use. These improvements include support for:

* Unsigned type operations.
* Standard library functions for strings, like `.lowercase()`, `.uppercase()`, and `.trim()` functions.
* Evaluation of the `.name` property of [enum constants](enum-classes.md#working-with-enum-constants) and the [`KCallable` interface](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-callable/).

To make it clear which functions are evaluated at compile time, Kotlin %kotlinEapVersion% introduces the `IntrinsicConstEvaluation` annotation.
Some functions are evaluated at compile-time but don't have the annotation yet. Later releases will add the annotation
to the remaining functions. For a list of supported functions, see the KEEP [appendix](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md#appendix).

This feature is [Experimental](components-stability.md#stability-levels-explained). To opt in, add the following compiler option to your build file:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-XXLanguage:+IntrinsicConstEvaluation")
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
                    <arg>-XXLanguage:+IntrinsicConstEvaluation</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

For more information, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md).

## Standard library

Kotlin %kotlinEapVersion% stabilizes support for UUIDs in the common Kotlin standard library. It also adds new extension
functions for converting unsigned integers to `BigInteger` on the JVM and support for checking sorted order.

### Stable UUIDs in the common Kotlin standard library
<secondary-label ref="standard-library"/>

Kotlin 2.0.20 introduced a [class for generating UUIDs](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library)
(universally unique identifiers) and added support for converting between Kotlin and Java UUIDs. Later releases gradually
improved this experimental feature by adding support for:

* [Comparing UUIDs with `<` and `>` operators](whatsnew2120.md#changes-in-uuid-parsing-formatting-and-comparability)
* [Parsing UUIDs from hex-and-dash and plain text formats](whatsnew2120.md#changes-in-uuid-parsing-formatting-and-comparability)
* [Returning `null` when parsing invalid UUIDs](whatsnew23.md#support-for-returning-null-when-parsing-invalid-uuids).

In Kotlin %kotlinEapVersion%, [the `kotlin.uuid.Uuid` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/) becomes [Stable](components-stability.md#stability-levels-explained).
The only exceptions are [the functions for generating V4 and V7 UUIDs](whatsnew23.md#support-for-generating-v7-uuids-for-specific-timestamps), which remain [Experimental](components-stability.md#stability-levels-explained) and still require opt-in.

### Support for checking sorted order
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% adds new extension functions for checking sorted order in iterables, arrays, and sequences.

This includes the following extension functions:

* `.isSorted()`
* `.isSortedDescending()`
* `.isSortedWith(comparator)`
* `.isSortedBy(selector)`
* `.isSortedByDescending(selector)`

You can use these extension functions to check whether elements are already sorted without sorting them again or creating your own helper functions.
They return `true` if the elements are in the specified order, or if there are fewer than two elements, and `false` otherwise.
These functions stop as soon as they encounter an out-of-order pair, which makes them efficient for large inputs.

Here's an example of checking sorted order with `.isSorted()` and `.isSortedBy()` functions:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.isSorted())
    // true

    val users = listOf(
        User("Alice", 24),
        User("Bob", 31),
        User("Charlie", 29),
    )
    println(users.isSortedBy(User::age))
    // false
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.0-Beta2" id="kotlin-2-4-0-check-sorted-order"}

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-78499).

### New API for converting unsigned integers to `BigInteger` on the JVM
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% introduces the `UInt.toBigInteger()` and `ULong.toBigInteger()` extension functions on the JVM.

Previously, converting `UInt` and `ULong` values to `BigInteger` required string-based workarounds or custom conversion logic.
Starting with Kotlin %kotlinEapVersion%, you can now use `.toBigInteger()` to convert unsigned integer values directly to `BigInteger`.

Here's an example:

```kotlin
fun main() {
    //sampleStart
    val unsignedLong = Long.MAX_VALUE.toULong() + 1uL
    val unsignedInt = UInt.MAX_VALUE

    println(unsignedLong.toBigInteger())
    // 9223372036854775808

    println(unsignedInt.toBigInteger())
    // 4294967295
   //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.0-Beta2" id="kotlin-2-4-0-convert-unsigned-int"}

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-73111).

## Kotlin/JVM

Kotlin %kotlinEapVersion% supports a new Java version and enables annotations in metadata by default.

### Support for Java 26
<secondary-label ref="jvm"/>

Starting with Kotlin %kotlinEapVersion%, the compiler can generate classes containing Java 26 bytecode.

### Annotations in metadata enabled by default
<secondary-label ref="jvm"/>

The Kotlin Metadata JVM library in Kotlin 2.2.0 [introduced support for reading annotations stored in Kotlin metadata](whatsnew22.md#support-for-reading-and-writing-annotations-in-kotlin-metadata). With this support, the Kotlin compiler writes annotations into metadata alongside the JVM bytecode, making them accessible to the Kotlin Metadata JVM library. As a result, annotation processors and other tools can understand and manipulate these annotations at the metadata level without using reflection or modifying source code.

In Kotlin %kotlinEapVersion%, this support is enabled by default.

## Kotlin/Native

Kotlin %kotlinEapVersion% brings support for Swift package import, improved interoperability through Swift export, and
default concurrent marking in the garbage collector.

### Swift package import
<primary-label ref="experimental-general"/>

<secondary-label ref="native"/>

Kotlin Multiplatform projects now can declare [Swift packages](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/) as dependencies for an iOS app in their Gradle configuration:

```kotlin
// build.gradle.kts
kotlin {

    swiftPMDependencies {
        swiftPackage(
            url = url("https://github.com/firebase/firebase-ios-sdk.git"),
            version = from("12.11.0"),
            products = listOf(
                product("FirebaseAI"),
                product("FirebaseAnalytics"),
                ...
}
```
{validate="false"}

For working samples and more detailed information, see [SwiftPM import](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-import.html).

If your project relies on CocoaPods dependencies, you can migrate the current setup to use Swift packages. The KMP tooling
accounts for this use case and helps you reconfigure the project automatically. For details, see our [CocoaPods migration guide](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration.html).

### Swift export: Support for exporting coroutine flows
<primary-label ref="experimental-general"/>

<secondary-label ref="native"/>

Kotlin %kotlinEapVersion% further improves Kotlin's interoperability with Swift through Swift export by adding support for
exporting `kotlinx.coroutines` flows to Swift.

Flows in `kotlinx.coroutines` represent an asynchronous stream of data that can be emitted and consumed concurrently. 
They are commonly used for reactive programming patterns, such as listening for database updates, network requests, or UI events.

Previously, the only way to expose the `Flow` interface from [`kotlinx.coroutines.flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/)
to Swift was through third-party solutions. Now you can export flows out of the box into Swift's idiomatic counterpart:
[`AsyncSequence`](https://developer.apple.com/documentation/Swift/AsyncSequence).

The feature is enabled by default. You can export any public API with the `Flow` type to Swift while preserving type information.
For example:

```kotlin
// Kotlin
// Type String is preserved when exporting Flow
fun flowOfStrings(): Flow<String> = flowOf("hello", "any", "world")
```

```Swift
// Swift
var actual: [String] = []
// Type String is correctly inferred from Kotlin
for try await element in flowOfStrings().asAsyncSequence() {
    actual.append(element)
}
```

For more information about Swift export, see our [documentation](native-swift-export.md).

### Default concurrent marking in garbage collector
<secondary-label ref="native"/>

In Kotlin 2.0.20, the Kotlin team [introduced experimental support](whatsnew2020.md#concurrent-marking-in-garbage-collector)
for the concurrent mark and sweep garbage collector (CMS GC). After processing user feedback and fixing regressions,
we are now ready to enable CMS by default, starting with Kotlin %kotlinEapVersion%.

The previous default parallel mark concurrent sweep (PMCS) setup in the garbage collector had to pause application
threads while the GC marked objects in the heap. In contrast, CMS allows the marking phase to run concurrently with application threads.

This significantly improves GC pause duration and app responsiveness, which is important for the performance of 
latency-critical applications. CMS has already demonstrated its effectiveness in benchmarks for UI applications built with [Compose Multiplatform](https://blog.jetbrains.com/kotlin/2024/10/compose-multiplatform-1-7-0-released/#performance-improvements-on-ios).

If you face problems, you can switch back to PMCS. To do that, set the following [binary option](native-binary-options.md)
in your `gradle.properties` file:

```none
kotlin.native.binary.gc=pmcs
```

For more information on the Kotlin/Native garbage collector, see our [documentation](native-memory-manager.md#garbage-collector).

## Kotlin/Wasm

Kotlin %kotlinEapVersion% enables incremental compilation for Kotlin/Wasm by default and introduces support for the WebAssembly Component Model.

### Incremental compilation enabled by default

<secondary-label ref="wasm"/>

Kotlin/Wasm introduced incremental compilation in 2.1.0. Starting with Kotlin %kotlinEapVersion%, it is [Stable](components-stability.md#stability-levels-explained) and enabled by default.
With this feature, the compiler rebuilds only the files affected by recent changes, which significantly reduces build time.

To disable incremental compilation, add the following line to your project's `local.properties` or `gradle.properties` file:

```none
# gradle.properties
kotlin.incremental.wasm=false
```

If you run into any issues, report them in our [YouTrack](https://kotl.in/issue)

### Support for the WebAssembly Component Model
<primary-label ref="experimental-general"/>

<secondary-label ref="wasm"/>

Kotlin/Wasm goes a step further in Kotlin %kotlinEapVersion% by introducing experimental support for the [WebAssembly Component Model](https://component-model.bytecodealliance.org/).
The proposal defines a way to build components from Wasm modules through standardized interfaces and types. This approach helps Wasm evolve from a low-level binary instruction format into a system for composing reusable, language-agnostic components. It enables Kotlin/Wasm to go beyond the browser. For example, Kotlin and WebAssembly are well suited for Function-as-a-Service, also known as FaaS or serverless, applications.

To try this feature, check out [a simple server built with `wasi:http`](https://github.com/Kotlin/sample-wasi-http-kotlin/).

<img src="kotlin-wasm-wasi-http.gif" alt="Kotlin/Wasm with WebAssembly Component Model" width="600"/>

Share your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-64569/Kotlin-Wasm-Support-Component-Model).

## Kotlin/JS

Kotlin %kotlinEapVersion% adds support for value class export to JavaScript/TypeScript and ES2015 features when inlining JS code.

### Support for value class export to JavaScript/TypeScript
<secondary-label ref="js"/>

Previously, only regular Kotlin classes could be exported to JavaScript/TypeScript.
Kotlin %kotlinEapVersion% lifts that limitation. You can now export Kotlin's [inline value classes](inline-classes.md) as regular TypeScript classes.

To export a value class, mark it with the `@JsExport` annotation on the Kotlin side:

```Kotlin
// Kotlin
@JsExport
@JvmInline
value class Email(val address: String) {
    init { require(address.contains("@")) { "Invalid email" } }
}

@JsExport
class AuthService {
    suspend fun login(email: Email): String = ...
}
```

From the TypeScript side, it looks like a regular class:

```TypeScript
// TypeScript
import { AuthService, Email } from "..."
const auth = new AuthService();

console.log(await auth.login(new Email("jane@example.com"))); 
// "Welcome, jane@example.com!"
console.log(await auth.login(new Email("not-an-email"))); 
// "Invalid email"
```

For more information, see [`@JsExport` annotation](js-to-kotlin-interop.md#jsexport-annotation).

### Support for ES2015 features when inlining JS code
<secondary-label ref="js"/>

Starting with Kotlin %kotlinEapVersion%, JavaScript code inlining has full support for [ES2015 features](js-project-setup.md#support-for-es2015-features).

It's useful for interoperability with third-party libraries, as well as for direct control over automatic application code generation.

Now you can use modern JS features inside [`js()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.js/js.html) calls, including:

* Lambdas ([arrow functions](whatsnew21.md#support-for-generating-es2015-arrow-functions))
* ES classes
* Template strings
* Spread operators
* `const` and `let` variable declarations
* Generators

Remember that the parameter of the `js()` function should be a string constant because it's parsed at compile time and translated to JavaScript code "as-is".
For example, for the spread operator, use:

```kotlin
fun spreadExample(): dynamic = js("""
    const add = (a, b, c) => a + b + c;

    const nums = [1, 2, 3];
    const sum = add(...nums);

    const a = [1, 2, 3];
    const b = [...a, 4, 5, 6];

    return { sum, b: b };
""")
```

For more information on inlining inline JavaScript code, see [our documentation](js-interop.md#inline-javascript).

## Gradle

Kotlin %kotlinEapVersion% is fully compatible with Gradle 7.6.3 through 9.4.1. You can also use Gradle versions up to 
the latest Gradle release. However, be aware that doing so may result in deprecation warnings, and some new Gradle features might not work.

## Maven

Kotlin %kotlinEapVersion% makes project configuration even easier with automatic alignment between Java and JVM target versions.

### Automatic alignment between Java and JVM target versions
<secondary-label ref="maven"/>

To simplify project configuration and prevent compatibility issues, the Kotlin Maven plugin now automatically aligns the
JVM target version with the Java compiler version configured in the project.

This ensures that the Kotlin and Maven compilers target the same bytecode version, avoiding issues where Kotlin-generated
bytecode is incompatible with the rest of the project or the intended deployment environment.

With the `<extensions>` option enabled, you don't need the `kotlin.compiler.jvmTarget` property. If it's not already defined,
the Kotlin Maven plugin automatically resolves the JVM target version in the following order:

1. As the `maven.compiler.release` version defined either as a project property or within the `maven-compiler-plugin` configuration.

    In this case, both `jvmTarget` and `jdkRelease` compiler options are set for the Kotlin compiler, limiting the API to a specific JDK version.

2. As the `maven.compiler.target` version in case the Maven release version is not set. The compiler target can be defined either as a project property or within the `maven-compiler-plugin` configuration.

    In this case, only Kotlin's `jvmTarget` is set and the API is not limited to a specific JDK version.

This greatly simplifies your Kotlin project configuration, so your `pom.xml` file can look like this:

```xml
<properties>
    <maven.compiler.release>17</maven.compiler.release>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>

<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
        </plugin>
    </plugins>
</build>
```

During the build, the plugin outputs a similar message:

```none
[INFO] Using jvmTarget=17 (derived from maven.compiler.release=17)
```

> The `<extensions>` option only checks project-level properties and the global `maven-compiler-plugin` configuration.
> It doesn't check the configurations defined in the plugin's `<executions>` section.
>
{style="note"}

For more information about automatic project configuration, see [our documentation](maven-configure-project.md#automatic-configuration).

## Kotlin compiler

Kotlin %kotlinEapVersion% includes more consistent behavior for inline functions declared in the same module during `.klib` compilation.

### Consistent intra-module function inlining during klib compilation
<secondary-label ref="compiler"/>

Previously, [function inlining](inline-functions.md) behaved inconsistently on different Kotlin platforms. The JetBrains
team is working to unify it across all supported platforms to ensure the same compatibility guarantees.

On the Kotlin/JVM, function inlining happens at compile time. So, when Kotlin sources are compiled with the Kotlin/JVM
compiler, the resulting class files have no inline function calls in the bytecode because the bodies of inline functions
are inlined into their call sites, so their behavior is fixed during compilation.

On the contrary, on Kotlin/Native, Kotlin/JS, and Kotlin/Wasm, function inlining did not happen during source-to-klib 
compilation, only during binary generation. As a result, the behavior of inline functions wasn't fixed during `.klib` compilation,
and `.klib` libraries didn't provide the same compatibility guarantees for inline functions as Kotlin/JVM does.

Kotlin %kotlinEapVersion% takes the first step in unifying the behavior of inline functions by enabling intra-module 
inlining when generating `.klib` artifacts:

```kotlin
// Existing logging.klib library
inline fun logDebug(message: String) {
    println("[DEBUG] $message")
}
```

```kotlin
// Currently compiled App module
inline fun greetUser(name: String) {
    println("Hello, $name!")
}

fun main() {
    logDebug("App started") // Not inlined: declared in another module
    greetUser("Alice")      // Inlined: declared in the same module
}
```

When compiled to a `.klib`, the code looks something like:

```kotlin
// Pseudocode
fun main() {
    logDebug("App started")  // Not inlined, declared in another module
    val tmp0 = "Alice"
    println("Hello, $tmp0!") // Inlined from greetUser()
}
```

This means only inline functions declared in the same module are inlined during `.klib` compilation. Other functions,
in this case, are inlined during the generation of platform-specific binaries.

#### How to enable

Starting with %kotlinEapVersion%, the intra-module inlining is enabled by default for Kotlin/Native, Kotlin/JS, and 
Kotlin/Wasm.

If you face unexpected problems with this feature, you can disable it using the following compiler option in the command
line:

```bash
-Xklib-ir-inliner=disabled
```

The next step is to enable cross-module inlining to ensure all inline functions in the project are consistently inlined.
This change is planned for future Kotlin releases, but you can already try it out using the following compiler option
in the command line:

```bash
-Xklib-ir-inliner=full
```

Please share your feedback and report any problems in [YouTrack](https://kotl.in/issue).