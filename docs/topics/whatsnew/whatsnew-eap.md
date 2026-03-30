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

* **Language:** [Stable context parameters and multiple features for annotation use-site targets](#stable-features-context-parameters-and-features-for-annotation-use-site-targets)
* **Standard library:** [New API for converting unsigned integers to `BigInteger`](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm) and [support for checking sorted order](#support-for-checking-sorted-order).
* **Kotlin/JVM:** [Support for Java 26](#support-for-java-26) and [annotations in metadata enabled by default](#annotations-in-metadata-enabled-by-default).
* **Kotlin/Native:** [Support for Swift packages as dependencies](#swift-package-import)
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
* [Features for annotation use-site targets](whatsnew22.md#preview-of-features-for-annotation-use-site-targets)
* [New API for converting unsigned integers to `BigInteger` on the JVM](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm)
* [Support for checking sorted order](#support-for-checking-sorted-order)

## New features {id=new-experimental-features}
<primary-label ref="experimental-exp"/>

* [Explicit context arguments for context parameters](#explicit-context-arguments-for-context-parameters)
* [Swift package import](#swift-package-import)

## Language

Kotlin %kotlinEapVersion% promotes context parameters and annotation use-site targets features to [Stable](components-stability.md#stability-levels-explained). This release also introduces [explicit context arguments for context parameters](#explicit-context-arguments-for-context-parameters).

### Stable features: Context parameters and features for annotation use-site targets
<secondary-label ref="language"/>

Kotlin 2.2.0 introduced a few language features as [Experimental](components-stability.md#stability-levels-explained). We’re happy to announce that the following language features are now [Stable](components-stability.md#stability-levels-explained) in this release:

* [Context parameters](whatsnew22.md#preview-of-context-parameters), except for [context arguments](#explicit-context-arguments-for-context-parameters) and [callable references](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references).
* [Features for annotation use-site targets](whatsnew22.md#preview-of-features-for-annotation-use-site-targets)

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

## Standard library

Kotlin %kotlinEapVersion% adds new extension functions for converting unsigned integers to `BigInteger` on the JVM. It 
also adds support for checking sorted order in iterables, arrays, and sequences.

### New API for converting unsigned integers to `BigInteger` on the JVM
<secondary-label ref="standard-library"/>

Kotlin %kotlinEapVersion% introduces the `UInt.toBigInteger()` and `ULong.toBigInteger()` extension functions on the JVM.

Previously, converting `UInt` and `ULong` values to `BigInteger` required string-based workarounds or custom conversion logic.
Starting with Kotlin %kotlinEapVersion%, you can now use `.toBigInteger()` to convert unsigned integer values directly to `BigInteger`.

Here's an example:

```kotlin
fun main() {
    val unsignedLong = Long.MAX_VALUE.toULong() + 1uL
    val unsignedInt = UInt.MAX_VALUE

    println(unsignedLong.toBigInteger())
    // 9223372036854775808

    println(unsignedInt.toBigInteger())
    // 4294967295
}
```

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-73111).

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

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-78499).

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

Kotlin %kotlinEapVersion% brings support for Swift package import.

### Swift package import
<secondary-label ref="native"/>

<primary-label ref="experimental-general"/>

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
compilation, only during binary generation. As a result, the behavior of inline functions wasn’t fixed during `.klib` compilation,
and `.klib` libraries didn’t provide the same compatibility guarantees for inline functions as Kotlin/JVM does.

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