[//]: # (title: What's new in Kotlin 2.2.0)

_[Released: June 23, 2025](releases.md#release-details)_

The Kotlin 2.2.0 release is here! Here are the main highlights:

* **Language**: new language features in preview, including [context parameters](#preview-of-context-parameters). 
  Several
  [previously experimental features are now Stable](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation),
  such as guard conditions, non-local break and continue, and multi-dollar interpolation.
* **Kotlin compiler**: [unified management of compiler warnings](#kotlin-compiler-unified-management-of-compiler-warnings).
* **Kotlin/JVM**: [changes to default method generation for interface functions](#changes-to-default-method-generation-for-interface-functions).
* **Kotlin/Native**: [LLVM 19 and new features for tracking and adjusting memory consumption](#kotlin-native).
* **Kotlin/Wasm**: [separated Wasm target](#build-infrastructure-for-wasm-target-separated-from-javascript-target) and the ability to configure [Binaryen per project](#per-project-binaryen-configuration).
* **Kotlin/JS**: [fix for the `copy()` method generated for `@JsPlainObject` interfaces](#fix-for-copy-in-jsplainobject-interfaces).
* **Gradle**: [binary compatibility validation in the Kotlin Gradle plugin](#binary-compatibility-validation-included-in-kotlin-gradle-plugin).
* **Standard library**: [stable Base64 and HexFormat APIs](#stable-base64-encoding-and-decoding).
* **Documentation**: our [documentation survey is open](https://surveys.jetbrains.com/s3/Kotlin-Docs-2025), and [notable improvements have been made to the Kotlin documentation](#documentation-updates).

## IDE support

The Kotlin plugins that support 2.2.0 are bundled in the latest versions of IntelliJ IDEA and Android Studio.
You don't need to update the Kotlin plugin in your IDE.
All you need to do is
to [change the Kotlin version](configure-build-for-eap.md#adjust-the-kotlin-version) to 2.2.0 in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.

## Language

This release [promotes](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation) guard conditions,
non-local `break` and `continue`,
and multi-dollar interpolation to [Stable](components-stability.md#stability-levels-explained).
Additionally, several features,
such as [context parameters](#preview-of-context-parameters) and [context-sensitive resolution](#preview-of-context-sensitive-resolution),
are introduced in preview.

### Preview of context parameters
<primary-label ref="experimental-general"/> 

Context parameters allow functions and properties to declare dependencies that are implicitly available in the
surrounding context.

With context parameters, you don't need to manually pass around values, such as services or dependencies, that are 
shared and rarely change across sets of function calls.

Context parameters replace an older experimental feature called context receivers. To migrate from context receivers to context
parameters, you can use assisted support in IntelliJ IDEA, as described in
the [blog post](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/).

The main difference is that context parameters are not introduced as receivers in the body of a function. As a result, 
you need to use the name of the context parameters to access their members, unlike with context receivers, where the 
context is implicitly available.

Context parameters in Kotlin represent a significant improvement in managing dependencies through simplified dependency injection,
improved DSL design, and scoped operations. For more information, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md).

#### How to declare context parameters

You can declare context parameters for properties and functions using the `context` keyword
followed by a list of parameters, each of the form `name: Type`. Here is an example with a dependency on the `UserService` interface:

```kotlin
// UserService defines the dependency required in the context 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// Declares a function with a context parameter
context(users: UserService)
fun outputMessage(message: String) {
    // Uses log from the context
    users.log("Log: $message")
}

// Declares a property with a context parameter
context(users: UserService)
val firstUser: String
    // Uses findUserById from the context    
    get() = users.findUserById(1)
```

You can use `_` as a context parameter name. In this case, the parameter's value is available for resolution but is not 
accessible by name inside the block:

```kotlin
// Uses "_" as context parameter name
context(_: UserService)
fun logWelcome() {
    // Finds the appropriate log function from UserService
    outputMessage("Welcome!")
}
```

#### How to enable context parameters

To enable context parameters in your project, use the following compiler option in the command line:

```Bash
-Xcontext-parameters
```

Or add it to the `compilerOptions {}` block of your Gradle build file:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-parameters")
    }
}
```

> Specifying both `-Xcontext-receivers` and `-Xcontext-parameters` compiler options simultaneously leads to an error.
>
{style="warning"}

#### Leave your feedback

This feature is planned to be stabilized and improved in future Kotlin releases.
We would appreciate your feedback on our issue tracker, [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes).

### Preview of context-sensitive resolution
<primary-label ref="experimental-general"/> 

Kotlin 2.2.0 introduces an implementation of context-sensitive resolution in preview.

Previously, you had to write the full name of enum entries or sealed class members, even when the type could be inferred from the context.
For example:

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

fun message(problem: Problem): String = when (problem) {
    Problem.CONNECTION -> "connection"
    Problem.AUTHENTICATION -> "authentication"
    Problem.DATABASE -> "database"
    Problem.UNKNOWN -> "unknown"
}
```

Now, with context-sensitive resolution, you can omit the type name in contexts where the expected type is known:

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

// Resolves enum entries based on the known type of problem
fun message(problem: Problem): String = when (problem) {
    CONNECTION -> "connection"
    AUTHENTICATION -> "authentication"
    DATABASE -> "database"
    UNKNOWN -> "unknown"
}
```

The compiler uses this contextual type information to resolve the correct member. This information includes, among other things:

* The subject of a `when` expression
* An explicit return type
* A declared variable type
* Type checks (`is`) and casts (`as`)
* The known type of a sealed class hierarchy
* The declared type of a parameter

> Context-sensitive resolution doesn't apply to functions, properties with parameters, or extension properties with receivers.
>
{style="note"}

To try out context-sensitive resolution in your project, use the following compiler option in the command line:

```bash
-Xcontext-sensitive-resolution
```

Or add it to the `compilerOptions {}` block of your Gradle build file:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-sensitive-resolution")
    }
}
```

We plan to stabilize and improve this feature in future Kotlin releases and would appreciate your feedback on our 
issue tracker [YouTrack](https://youtrack.jetbrains.com/issue/KT-16768/Context-sensitive-resolution).

### Preview of features for annotation use-site targets
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 introduces a couple of features that make working with annotation use-site targets more convenient.

#### `@all` meta-target for properties
<primary-label ref="experimental-general"/>

Kotlin allows you to attach annotations to specific parts of a declaration, known as [use-site targets](annotations.md#annotation-use-site-targets).
However, annotating each target individually was complex and error-prone:

```kotlin
data class User(
    val username: String,

    @param:Email      // Constructor parameter
    @field:Email      // Backing field
    @get:Email        // Getter method
    @property:Email   // Kotlin property reference
    val email: String,
) {
    @field:Email
    @get:Email
    @property:Email
    val secondaryEmail: String? = null
}
```

To simplify this, Kotlin introduces the new `@all` meta-target for properties.
This feature tells the compiler to apply the annotation to all relevant parts of the property. When you use it,
`@all` attempts to apply the annotation to:

* **`param`**: the constructor parameter, if declared in the primary constructor.

* **`property`**: the Kotlin property itself.

* **`field`**: the backing field, if it exists.

* **`get`**: the getter method.

* **`set_param`**: the parameter of the setter method, if the property is defined as `var`.

* **`RECORD_COMPONENT`**: if the class is a `@JvmRecord`, the annotation applies to the [Java record component](#improved-support-for-annotating-jvm-records). This behavior mimics the way Java handles annotations on record components.

The compiler only applies the annotation to the targets for the given property.

In the example below, the `@Email` annotation is applied to all relevant targets of each property:

```kotlin
data class User(
    val username: String,

    // Applies @Email to param, property, field,
    // get, and set_param (if var)
    @all:Email val email: String,
) {
    // Applies @Email to property, field, and getter 
    // (no param since it's not in the constructor)
    @all:Email val secondaryEmail: String? = null
}
```

You can use the `@all` meta-target with any property, both inside and outside the primary constructor. However, 
you can't use the `@all` meta-target with [multiple annotations](https://kotlinlang.org/spec/syntax-and-grammar.html#grammar-rule-annotation).

This new feature simplifies the syntax, ensures consistency, and improves interoperability with Java records.

To enable the `@all` meta-target in your project, use the following compiler option in the command line:

```Bash
-Xannotation-target-all
```

Or add it to the `compilerOptions {}` block of your Gradle build file:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

This feature is in preview. Please report any problems to our issue tracker, [YouTrack](https://kotl.in/issue).
For more information about the `@all` meta-target, read this [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) proposal.

#### New defaulting rules for use-site annotation targets
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 introduces new defaulting rules for propagating annotations to parameters, fields, and properties. 
Where previously an annotation was applied by default only to one of `param`, `property`, or `field`, defaults 
are now more in line with what is expected of an annotation.

If there are multiple applicable targets, one or more is chosen as follows:

* If the constructor parameter target (`param`) is applicable, it is used.
* If the property target (`property`) is applicable, it is used.
* If the field target (`field`) is applicable while `property` isn't, `field` is used.

If there are multiple targets, and none of `param`, `property`, or `field` are applicable, the annotation results in an error.

To enable this feature, add it to the `compilerOptions {}` block of your Gradle build file:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

Or use the command-line argument for the compiler:

```Bash
-Xannotation-default-target=param-property
```

Whenever you'd like to use the old behavior, you can:

* In a specific case, define the necessary target explicitly, for example, using `@param:Annotation` instead of `@Annotation`.
* For a whole project, use this flag in your Gradle build file:

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

This feature is in preview. Please report any problems to our issue tracker, [YouTrack](https://kotl.in/issue).
For more information about the new defaulting rules for annotation use-site targets, read this [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) proposal.

### Support for nested type aliases
<primary-label ref="beta"/>

Previously, you could only declare [type aliases](type-aliases.md) at the top level of a Kotlin file. This meant 
that even internal or domain-specific type
aliases had to live outside the class where they were used.

Starting from 2.2.0, you can define type aliases inside other declarations, as long as they
don't capture type parameters from their outer class:

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

Nested type aliases have a few additional constraints, like not being able to mention type parameters. Check the [documentation](type-aliases.md#nested-type-aliases) for the entire set of rules.

Nested type aliases allow for cleaner, more maintainable code by improving encapsulation, reducing package-level clutter,
and simplifying internal implementations.

#### How to enable nested type aliases

To enable nested type aliases in your project, use the following compiler option in the command line:

```bash
-Xnested-type-aliases
```

Or add it to the `compilerOptions {}` block of your Gradle build file:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnested-type-aliases")
    }
}
```

#### Share your feedback

Nested type aliases are currently in [Beta](components-stability.md#stability-levels-explained). Please report 
any problems to our issue tracker, [YouTrack](https://kotl.in/issue). For more information about this feature, 
read this [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md) proposal.

### Stable features: guard conditions, non-local `break` and `continue`, and multi-dollar interpolation

In Kotlin 2.1.0, several new language features were introduced in preview.
We're happy to announce that the following language features are now
[Stable](components-stability.md#stability-levels-explained) in this release:

* [Guard conditions in `when` with a subject](whatsnew21.md#guard-conditions-in-when-with-a-subject)
* [Non-local `break` and `continue`](whatsnew21.md#non-local-break-and-continue)
* [Multi-dollar interpolation: improved handling of `$` in string literals](whatsnew21.md#multi-dollar-string-interpolation)

[See the full list of Kotlin language design features and proposals](kotlin-language-features-and-proposals.md).

## Kotlin compiler: unified management of compiler warnings
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 introduces a new compiler option, `-Xwarning-level`. It's designed to provide a unified way of managing 
compiler warnings in Kotlin projects.

Previously, you could only apply general module-wide rules, like disabling all warnings with
`-nowarn`, turning all warnings to compilation errors with `-Werror`, or enabling additional compiler checks with `-Wextra`. 
The only option to adjust them for specific warnings was the `-Xsuppress-warning` option.

With the new solution, you can override general rules and exclude specific diagnostics in a consistent way.

### How to apply

The new compiler option has the following syntax:

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`: raises the specified warning to an error.
* `warning`: emits a warning and is enabled by default.
* `disabled`: completely suppresses the specified warning module-wide.

Keep in mind that you can only configure the severity level of _warnings_ with the new compiler option.

### Use cases

With the new solution, you can better fine-tune warning reporting in your project by combining general rules with specific ones.
Choose your use case:

#### Suppress warnings

| Command                                           | Description                                            |
|---------------------------------------------------|--------------------------------------------------------|
| [`-nowarn`](compiler-reference.md#nowarn)         | Suppresses all warnings during compilation.            |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled`        | Suppresses only specified warnings.                    |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | Suppresses all warnings except for the specified ones. |

#### Raise warnings to errors

| Command                                           | Description                                                  |
|---------------------------------------------------|--------------------------------------------------------------|
| [`-Werror`](compiler-reference.md#werror)         | Raises all warnings to compilation errors.                   |
| `-Xwarning-level=DIAGNOSTIC_NAME:error`           | Raises only specified warnings to errors.                    |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | Raises all warnings to errors except for the specified ones. |

#### Enable additional compiler warnings

| Command                                            | Description                                                                                          |
|----------------------------------------------------|------------------------------------------------------------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra)          | Enables all additional declaration, expression, and type compiler checks that emit warnings if true. |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning`          | Enables only specified additional compiler checks.                                                   |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | Enables all additional checks except for the specified ones.                                         |

#### Warning lists

In case you have many warnings you want to exclude from general rules, you can list them in a separate file through [`@argfile`](compiler-reference.md#argfile).

### Leave feedback

The new compiler option is still [Experimental](components-stability.md#stability-levels-explained). Please 
report any problems to our issue tracker, [YouTrack](https://kotl.in/issue).

## Kotlin/JVM

Kotlin 2.2.0 brings many updates to the JVM. The compiler now supports Java 24 bytecode and introduces changes to 
default method generation for interface functions. The release also simplifies working with annotations in Kotlin metadata, 
improves Java interop with inline value classes, and includes better support for annotating JVM records.

### Changes to default method generation for interface functions

Starting from Kotlin 2.2.0, functions declared in interfaces are compiled to JVM default methods unless configured otherwise.
This change affects how Kotlin's interface functions with implementations are compiled to bytecode.

This behavior is controlled by the new stable compiler option `-jvm-default`, replacing the deprecated `-Xjvm-default` option.

You can control the behavior of the `-jvm-default` option using the following values:

* `enable` (default): generates default implementations in interfaces and includes bridge functions in subclasses 
   and `DefaultImpls` classes. Use this mode to maintain binary compatibility with older Kotlin versions.
* `no-compatibility`: generates only default implementations in interfaces. This mode skips compatibility bridges 
   and `DefaultImpls` classes, making it suitable for new code.
* `disable`: disables default implementations in interfaces. Only bridge functions and `DefaultImpls` classes 
   are generated, matching the behavior before Kotlin 2.2.0.

To configure the `-jvm-default` compiler option, set the `jvmDefault` property in your Gradle Kotlin DSL:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
```

### Support for reading and writing annotations in Kotlin metadata
<primary-label ref="experimental-general"/>

Previously, you had to read annotations from compiled JVM class files using reflection or bytecode analysis and manually 
match them to metadata entries based on signatures.
This process was error-prone, especially for overloaded functions.

Now, in Kotlin 2.2.0, the [](metadata-jvm.md) introduces support for reading annotations stored in Kotlin metadata.

To make annotations available in the metadata for your compiled files, add the following compiler option:

```kotlin
-Xannotations-in-metadata
```

Alternatively, add it to the `compilerOptions {}` block of your Gradle build file:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

With this option enabled, the Kotlin compiler writes annotations into metadata alongside the JVM bytecode, 
making them accessible to the `kotlin-metadata-jvm` library.

The library provides the following APIs for accessing annotations:

* `KmClass.annotations`
* `KmFunction.annotations`
* `KmProperty.annotations`
* `KmConstructor.annotations`
* `KmPropertyAccessorAttributes.annotations`
* `KmValueParameter.annotations`
* `KmFunction.extensionReceiverAnnotations`
* `KmProperty.extensionReceiverAnnotations`
* `KmProperty.backingFieldAnnotations`
* `KmProperty.delegateFieldAnnotations`
* `KmEnumEntry.annotations`

These APIs are [Experimental](components-stability.md#stability-levels-explained).
To opt in, use the `@OptIn(ExperimentalAnnotationsInMetadata::class)` annotation.

Here's an example of reading annotations from Kotlin metadata:

```kotlin
@file:OptIn(ExperimentalAnnotationsInMetadata::class)

import kotlin.metadata.ExperimentalAnnotationsInMetadata
import kotlin.metadata.jvm.KotlinClassMetadata

annotation class Label(val value: String)

@Label("Message class")
class Message

fun main() {
    val metadata = Message::class.java.getAnnotation(Metadata::class.java)
    val kmClass = (KotlinClassMetadata.readStrict(metadata) as KotlinClassMetadata.Class).kmClass
    println(kmClass.annotations)
    // [@Label(value = StringValue("Message class"))]
}
```

> If you use the `kotlin-metadata-jvm` library in your projects, we recommend testing and updating your code to support annotations.
> Otherwise, when annotations in metadata become [enabled by default](https://youtrack.jetbrains.com/issue/KT-75736) in a future Kotlin version, your projects may 
> produce invalid or incomplete metadata.
>
> If you experience any problems, please report them in our [issue tracker](https://youtrack.jetbrains.com/issue/KT-31857).
>
{style="warning"}

### Improved Java interop with inline value classes
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 introduces a new experimental annotation: `@JvmExposeBoxed`. This annotation makes it easier to consume [inline value classes](inline-classes.md) from Java.

By default, Kotlin compiles inline value classes to use **unboxed representations**, which are more performant but often 
hard or even impossible to use from Java. For example:

```kotlin
@JvmInline value class PositiveInt(val number: Int) {
    init { require(number >= 0) }
}
```

In this case, because the class is unboxed, there is no constructor available for Java to call. There's also no way for 
Java to trigger the `init` block to ensure that `number` is positive. 

When you annotate the class with `@JvmExposeBoxed`, Kotlin generates a public constructor that Java can call directly, 
ensuring that the `init` block also runs.

You can apply the `@JvmExposeBoxed` annotation at the class, constructor, or function level to gain fine-grained 
control over what's exposed to Java.

For example, in the following code, the extension function `.timesTwoBoxed()` is **not** accessible from Java:

```kotlin
@JvmInline
value class MyInt(val value: Int)

fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

To make it possible to create an instance of the `MyInt` class and call the `.timesTwoBoxed()` function from Java code, 
add the `@JvmExposeBoxed` annotation to both the class and the function:

```kotlin
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

With these annotations, the Kotlin compiler generates a Java-accessible constructor for the `MyInt` class. It also generates 
an overload for the extension function that uses the boxed form of the value class. As a result, the following Java code runs successfully:

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

If you don't want to annotate every part of the inline value classes that you want to expose, you can effectively apply 
the annotation to a whole module. To apply this behavior to a module, compile it with the `-Xjvm-expose-boxed` option. 
Compiling with this option has the same effect as if every declaration in the module had the `@JvmExposeBoxed` annotation.

This new annotation does not change how Kotlin compiles or uses value classes internally, and all existing compiled code 
remains valid. It simply adds new capabilities to improve Java interoperability. The performance of Kotlin code using value classes is not impacted.

The `@JvmExposeBoxed` annotation is useful for library authors who want to expose boxed variants of member functions 
and receive boxed return types. It eliminates the need to choose between an inline value class (efficient but Kotlin-only) 
and a data class (Java-compatible but always boxed).

For a more detailed explanation of how the `@JvmExposedBoxed` annotation works and the problems it solves, 
see this [KEEP](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md) proposal.

### Improved support for annotating JVM records

Kotlin has supported [JVM records](jvm-records.md) since Kotlin 1.5.0. Now, Kotlin 2.2.0 improves how Kotlin handles 
annotations on record components, particularly in relation to Java's [`RECORD_COMPONENT`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html#RECORD_COMPONENT) target.

Firstly, if you want to use a `RECORD_COMPONENT` as an annotation target, you need to manually add annotations for 
Kotlin (`@Target`) and Java. This is because Kotlin's `@Target` annotation doesn't support `RECORD_COMPONENT`. For example:

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

Maintaining both lists manually can be error-prone, so Kotlin 2.2.0 introduces a compiler warning if the Kotlin and 
Java targets don't match. For instance, if you omit `ElementType.CLASS` in the Java target list, the compiler reports:

```
Incompatible annotation targets: Java target 'CLASS' missing, corresponding to Kotlin targets 'CLASS'.
```

Secondly, Kotlin's behavior differs from Java when it comes to propagating annotations in records. In Java, 
annotations on a record component automatically apply to the backing field, getter, and constructor parameter. 
Kotlin doesn't do this by default, but you can now replicate the behavior using the [`@all:` use-site target](#all-meta-target-for-properties).

For example:

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

When you use `@JvmRecord` with `@all:`, Kotlin now:

* Propagates the annotation to the property, backing field, constructor parameter, and getter.
* Applies the annotation to the record component, as well, if the annotation supports Java's `RECORD_COMPONENT`.

## Kotlin/Native

Starting with 2.2.0, Kotlin/Native uses LLVM 19. This release also brings several experimental features designed to 
track and adjust memory consumption.

### Per-object memory allocation
<primary-label ref="experimental-opt-in"/>

Kotlin/Native's [memory allocator](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md) 
can now reserve memory on a per-object basis. In some cases, it may help you satisfy strict memory limitations or reduce 
memory consumption on the application's startup.

The new feature is designed to replace the `-Xallocator=std` compiler option, which enabled the system memory allocator 
instead of the default one. Now, you can disable buffering (paging of allocations) without switching memory allocators.

The feature is currently [Experimental](components-stability.md#stability-levels-explained).
To enable it, set the following option in your `gradle.properties` file:

```none
kotlin.native.binary.pagedAllocator=false
```

Please report any problems to our issue tracker, [YouTrack](https://kotl.in/issue).

### Support for Latin-1 encoded strings at runtime
<primary-label ref="experimental-opt-in"/>

Kotlin now supports Latin-1-encoded strings, similarly to the [JVM](https://openjdk.org/jeps/254). This should help 
reduce the application's binary size and adjust memory consumption.

By default, strings in Kotlin are stored using UTF-16 encoding, where each character is represented by two bytes. 
In some cases, this leads to strings taking up twice as much space in the binary compared to the source code, and 
reading data from a simple ASCII file can take up twice as much memory as storing the file on disk.

In turn, [Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) encoding represents each of the first 
256 Unicode characters with just one byte. With Latin-1 support enabled, strings are stored in Latin-1 encoding as 
long as all the characters fall within its range. Otherwise, the default UTF-16 encoding is used.

#### How to enable Latin-1 support

The feature is currently [Experimental](components-stability.md#stability-levels-explained).
To enable it, set the following option in your `gradle.properties` file:

```none
kotlin.native.binary.latin1Strings=true
```
#### Known issues

As long as the feature is Experimental, the cinterop extension functions [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html), [`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html), and [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) become less efficient. Each call to them may trigger automatic string conversion to UTF-16.

The Kotlin team is very grateful to our colleagues at Google and [Sonya Valchuk](https://github.com/pyos) in particular 
for implementing this feature.

For more information on memory consumption in Kotlin, see the [documentation](native-memory-manager.md#memory-consumption).

### Improved tracking of memory consumption on Apple platforms

Starting with Kotlin 2.2.0, memory allocated by Kotlin code is now tagged. This can help you debug memory issues on Apple platforms.

When inspecting your application's high memory usage, you can now identify how much memory is reserved by Kotlin code. 
Kotlin's share is tagged with an identifier and can be tracked through tools like VM Tracker in Xcode Instruments.

This feature is enabled by default but is available only in the Kotlin/Native default memory allocator when _all_ the 
following conditions are met:

* **Tagging enabled**. The memory should be tagged with a valid identifier. Apple recommends numbers between 240 and 255; 
  the default value is 246.

  If you set up the `kotlin.native.binary.mmapTag=0` Gradle property, tagging is disabled.

* **Allocation with mmap**. The allocator should use the `mmap` system call to map files into memory.

  If you set up the `kotlin.native.binary.disableMmap=true` Gradle property, the default allocator uses `malloc` instead of `mmap`.

* **Paging enabled**. Paging of allocations (buffering) should be enabled.

  If you set up the [`kotlin.native.binary.pagedAllocator=false`](#per-object-memory-allocation) Gradle property, the memory is reserved on a 
  per-object basis instead.

For more information on memory consumption in Kotlin, see the [documentation](native-memory-manager.md#memory-consumption).

### LLVM update from 16 to 19

In Kotlin 2.2.0, we updated LLVM from version 16 to 19.
The new version includes performance improvements, bug fixes, and security updates.

This update shouldn't affect your code, but if you encounter any issues, please report them to our [issue tracker](http://kotl.in/issue).

### Windows 7 target deprecated

Starting with Kotlin 2.2.0, the minimal supported Windows version has been raised from Windows 7 to Windows 10. Since 
Microsoft ended support for Windows 7 in January 2025, we also decided to deprecate this legacy target.

For more information, see [](native-target-support.md).

## Kotlin/Wasm

In this release, the build infrastructure for the [Wasm target is separated from the JavaScript target](#build-infrastructure-for-wasm-target-separated-from-javascript-target). Additionally, now you can configure
[the Binaryen tool per project or module](#per-project-binaryen-configuration).

### Build infrastructure for Wasm target separated from JavaScript target

Before, the `wasmJs` target shared the same infrastructure as the `js` target. As a result, both targets were hosted in the same
directory (`build/js`) and used the same NPM tasks and configurations.

Now, the `wasmJs` target has its own infrastructure separate from the `js` target. This allows
Wasm tasks and types to be distinct from JavaScript ones, enabling independent configuration.

Additionally, Wasm-related project files and NPM dependencies are now stored in a separate `build/wasm` directory.

New NPM-related tasks have been introduced for Wasm, while existing JavaScript tasks are now dedicated only to JavaScript:

| **Wasm tasks**         | **JavaScript tasks** |
|------------------------|----------------------|
| `kotlinWasmNpmInstall` | `kotlinNpmInstall`   |
| `wasmRootPackageJson`  | `rootPackageJson`    |

Similarly, new Wasm-specific declarations have been added:

| **Wasm declarations**     | **JavaScript declarations** |
|---------------------------|-----------------------------|
| `WasmNodeJsRootPlugin`    | `NodeJsRootPlugin`          |
| `WasmNodeJsPlugin`        | `NodeJsPlugin`              |
| `WasmYarnPlugin`          | `YarnPlugin`                |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension`       |
| `WasmNodeJsEnvSpec`       | `NodeJsEnvSpec`             |
| `WasmYarnRootEnvSpec`     | `YarnRootEnvSpec`           |

You can now work with the Wasm target independently of the JavaScript target, which simplifies the configuration process.

This change is enabled by default and requires no additional setup.

### Per-project Binaryen configuration

The Binaryen tool, used in Kotlin/Wasm to [optimize production builds](whatsnew20.md#optimized-production-builds-by-default-using-binaryen),
was previously configured once in the root project.

Now, you can configure the Binaryen tool per project or module. This change aligns with Gradle's best practices and
ensures better support for features like [project isolation](https://docs.gradle.org/current/userguide/isolated_projects.html), 
improving build performance and reliability in complex builds.

Additionally, you can now configure different versions of Binaryen for different modules, if needed.

This feature is enabled by default. However, if you have a custom configuration of Binaryen,
you now need to apply it per project, rather than only in the root project.

## Kotlin/JS

This release improves [the `copy()` function in `@JsPlainObject` interfaces](#fix-for-copy-in-jsplainobject-interfaces),
[type aliases in files with the `@JsModule` annotation](#support-for-type-aliases-in-files-with-jsmodule-annotation), and other Kotlin/JS features.

### Fix for `copy()` in `@JsPlainObject` interfaces

Kotlin/JS has an experimental plugin called `js-plain-objects`, which introduced a `copy()` function for interfaces annotated with `@JsPlainObject`.
You can use the `copy()` function to manipulate objects.

However, the initial implementation of `copy()` was not compatible with inheritance, and this
caused issues when a `@JsPlainObject` interface extended other interfaces.

To avoid limitations on plain objects, the `copy()` function has been moved from the object itself to its companion object:

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
}

fun main() {
    val user = User(name = "SomeUser", age = 21)
    // This syntax is not valid anymore
    val copy = user.copy(age = 35)      
    // This is the correct syntax
    val copy = User.copy(user, age = 35)
}
```

This change resolves conflicts in the inheritance hierarchy and eliminates ambiguity.
It is enabled by default starting from Kotlin 2.2.0.

### Support for type aliases in files with `@JsModule` annotation

Previously, files annotated with `@JsModule` to import declarations from JavaScript modules
were restricted to external declarations only. This meant that you couldn't declare a `typealias` in such files.

Starting with Kotlin 2.2.0, you can declare type aliases inside files marked with `@JsModule`:

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

This change reduces an aspect of Kotlin/JS interoperability limitations, and more improvements are planned for future releases.

Support for type aliases in files with `@JsModule` is enabled by default.

### Support for `@JsExport` in multiplatform `expect` declarations

When working with the [`expect/actual` mechanism](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html) in Kotlin Multiplatform projects,
it was not possible to use the `@JsExport` annotation for `expect` declarations in common code.

Starting with this release, you can apply `@JsExport` directly to `expect` declarations:

```kotlin
// commonMain

// Produced error, but now works correctly 
@JsExport
expect class WindowManager {
    fun close()
}

@JsExport
fun acceptWindowManager(manager: WindowManager) {
    ...
}

// jsMain

@JsExport
actual class WindowManager {
    fun close() {
        window.close()
    }
}
```

You must also annotate with `@JsExport` the corresponding `actual` implementation in the JavaScript source set,
and it has to use only exportable types.

This fix allows shared code defined in `commonMain` to be correctly exported to JavaScript. You can now expose your
multiplatform code to JavaScript consumers without having to use manual workarounds.

This change is enabled by default.

### Ability to use `@JsExport` with the `Promise<Unit>` type

Previously, when you tried to export a function returning the `Promise<Unit>` type with the `@JsExport` annotation, 
the Kotlin compiler produced an error.

While return types like `Promise<Int>` worked correctly, using `Promise<Unit>` triggered a "non-exportable type" warning,
even though it correctly mapped to `Promise<void>` in TypeScript.

This restriction has been removed. Now, the following code compiles without error:

```kotlin
// Worked correctly before
@JsExport
fun fooInt(): Promise<Int> = GlobalScope.promise {
    delay(100)
    return@promise 42
}

// Produced error, but now works correctly
@JsExport
fun fooUnit(): Promise<Unit> = GlobalScope.promise {
    delay(100)
}
```

This change removes an unnecessary restriction in the Kotlin/JS interop model. This fix is enabled by default.

## Gradle

Kotlin 2.2.0 is fully compatible with Gradle 7.6.3 through 8.14. You can also use Gradle versions up to the latest Gradle 
release. However, be aware that doing so may result in deprecation warnings, and some new Gradle features might not work.

In this release, the Kotlin Gradle plugin comes with several improvements to its diagnostics. 
It also introduces an experimental integration of [binary compatibility validation](#binary-compatibility-validation-included-in-kotlin-gradle-plugin), making it easier to work on libraries.

### Binary compatibility validation included in Kotlin Gradle plugin
<primary-label ref="experimental-general"/>

To make it easier to check for binary compatibility between library versions, we're experimenting with moving the 
functionality of the [binary compatibility validator](https://github.com/Kotlin/binary-compatibility-validator) into the Kotlin Gradle plugin (KGP). 
You can try it out in toy projects, but we don't recommend using it in production yet. 

The original [binary compatibility validator](https://github.com/Kotlin/binary-compatibility-validator) continues to 
be maintained during this experimental phase.

Kotlin libraries can use one of two binary formats: JVM class files or `klib`. Since these formats aren't compatible, 
the KGP works with each of them separately.

To enable the binary compatibility validation feature set, add the following to the `kotlin{}` block in your `build.gradle.kts` file:

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // Use the set() function to ensure compatibility with older Gradle versions
        enabled.set(true)
    }
}
```

If your project has multiple modules where you want to check for binary compatibility, configure the feature in each 
module separately. Each module can have its own custom configuration.

Once enabled, run the `checkLegacyAbi` Gradle task to check for binary compatibility issues. You can run the task in 
IntelliJ IDEA or from the command line in your project directory:

```kotlin
./gradlew checkLegacyAbi
```

This task generates an application binary interface (ABI) dump from the current code as a UTF-8 text file. 
The task then compares the new dump with the one from the previous release. If the task finds any differences, 
it reports them as errors. After reviewing the errors, if you decide the changes are acceptable, you can update the 
reference ABI dump by running the `updateLegacyAbi` Gradle task.

#### Filter classes

The feature lets you filter classes in the ABI dump. You can include or exclude classes explicitly by name or partial 
name, or by the annotations (or parts of annotation names) that mark them.

For example, this sample excludes all classes in the `com.company` package:

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters.excluded.byNames.add("com.company.**")
    }
}
```

Explore the [KGP API reference](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl/-abi/) to learn more about configuring the binary compatibility validator.

#### Multiplatform limitations

In multiplatform projects, if your host doesn't support cross-compilation for all targets, the KGP tries to infer the 
ABI changes for unsupported targets by checking the ABI dumps from other ones. This approach helps avoid false validation 
failures if you later switch to a host that **can** compile all targets.

You can change this default behavior so that the KGP doesn't infer ABI changes for unsupported targets by adding 
the following to your `build.gradle.kts` file:

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

However, if you have an unsupported target in your project, running the `checkLegacyAbi` task fails because the task 
can't create an ABI dump. This behavior may be desirable if it's more important for the check to fail than to miss an 
incompatible change due to inferred ABI changes from other targets.

### Support for rich output in console for Kotlin Gradle plugin

In Kotlin 2.2.0, we support color and other rich output in the console during the Gradle build process, making 
it easier to read and understand the reported diagnostics.

Rich output is available in supported terminal emulators for Linux and macOS, and we're working on adding support for Windows.

![Gradle console](gradle-console-rich-output.png){width=600}

This feature is enabled by default, but if you want to override it, add the following Gradle property to your `gradle.properties` file:

```
org.gradle.console=plain
```

For more information about this property and its options, see Gradle's documentation on [Customizing log format](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format).

### Integration of Problems API within KGP diagnostics

Previously, the Kotlin Gradle Plugin (KGP) was only able to report diagnostics such as warnings and errors as plain text output to the console or logs.

Starting with 2.2.0, the KGP introduces an additional reporting mechanism: it now uses [Gradle's Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html),
a standardized way to report rich, structured problem information during the build process.

The KGP diagnostics are now easier to read and more consistently displayed across different interfaces, such as the Gradle CLI and IntelliJ IDEA.

This integration is enabled by default, starting with Gradle 8.6 or later.
As the API is still evolving, use the most recent Gradle version to benefit from the latest improvements.

### KGP compatibility with `--warning-mode`

The Kotlin Gradle Plugin (KGP) diagnostics reported issues using fixed severity levels, 
meaning Gradle's [`--warning-mode` command-line option](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings) had no effect on how the KGP displayed errors.

Now, the KGP diagnostics are compatible with the `--warning-mode` option, providing more flexibility. For example,
you can convert all warnings into errors or disable warnings entirely.

With this change, the KGP diagnostics adjust the output based on the selected warning mode:

* When you set `--warning-mode=fail`, diagnostics with `Severity.Warning` are now elevated to `Severity.Error`.
* When you set `--warning-mode=none`, diagnostics with `Severity.Warning` are not logged.

This behavior is enabled by default starting with 2.2.0.

To ignore the `--warning-mode` option, set the following Gradle property to your `gradle.properties` file:

```
kotlin.internal.diagnostics.ignoreWarningMode=true
```

## New experimental build tools API
<primary-label ref="experimental-general"/>

You can use Kotlin with various build systems, such as Gradle, Maven, Amper, and others. However, integrating Kotlin 
into each system to support the full feature set, such as incremental compilation and compatibility with Kotlin compiler 
plugins, daemons, and Kotlin Multiplatform, requires significant effort.

To simplify this process, Kotlin 2.2.0 introduces a new experimental build tools API (BTA). The BTA is a universal API 
that acts as an abstraction layer between build systems and the Kotlin compiler ecosystem. With this approach, each 
build system only needs to support a single BTA entry point.

Currently, the BTA supports Kotlin/JVM only. The Kotlin team at JetBrains already uses it in the Kotlin Gradle plugin 
(KGP) and the `kotlin-maven-plugin`. You can try the BTA through these plugins, but the API itself isn't ready yet for 
general use in your own build tool integrations. If you're curious about the BTA proposal or want to share your feedback, 
see this [KEEP](https://github.com/Kotlin/KEEP/issues/421) proposal.

To try the BTA in:

* The KGP, add the following property to your `gradle.properties` file:

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```   

* Maven, you don't need to do anything. It's enabled by default.

The BTA currently has no direct benefits for the Maven plugin, but it lays a solid foundation for the faster delivery 
of new features, such as [support for the Kotlin daemon](https://youtrack.jetbrains.com/issue/KT-77587/Maven-Introduce-Kotlin-daemon-support-and-make-it-enabled-by-default) and [the stabilization of incremental compilation](https://youtrack.jetbrains.com/issue/KT-77086/Stabilize-incremental-compilation-in-Maven).

For the KGP, using the BTA already has the following benefits:

* [Improved “in process” compiler execution strategy](#improved-in-process-compiler-execution-strategy)
* [More flexibility to configure different compiler versions from Kotlin](#flexibility-to-configure-different-compiler-versions-from-kotlin)

### Improved “in process” compiler execution strategy

The KGP supports three [Kotlin compiler execution strategies](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy). 
The “in process” strategy, which runs the compiler 
inside the Gradle daemon process, previously didn't support incremental compilation.

Now, using the BTA, the “in-process” strategy **does** support incremental compilation. To use it, add the following 
property to your `gradle.properties` file:

```kotlin
kotlin.compiler.execution.strategy=in-process
```

### Flexibility to configure different compiler versions from Kotlin

Sometimes you might want to use a newer Kotlin compiler version in your code while keeping the KGP on an older 
one – for example, to try new language features while still working through build script deprecations. Or you might 
want to update the version of the KGP but keep an older Kotlin compiler version.

The BTA makes this possible. Here's how you can configure it in your `build.gradle.kts` file:

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins { 
    kotlin("jvm") version "2.2.0"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories { 
    mavenCentral()
}

kotlin { 
    jvmToolchain(8)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class) 
    compilerVersion.set("2.1.21") // Different version than 2.2.0
}

```

The BTA supports configuring the KGP and Kotlin compiler versions with the three previous major versions and one 
subsequent major version. So in KGP 2.2.0, Kotlin compiler versions 2.1.x, 2.0.x, and 1.9.25 are supported. 
KGP 2.2.0 is also compatible with future Kotlin compiler versions 2.2.x and 2.3.x.

However, keep in mind that using different compiler versions together with compiler plugins may lead to Kotlin compiler 
exceptions. The Kotlin team plans to address these kinds of problems in future releases.

Try out the BTA with these plugins and send us your feedback in the dedicated YouTrack tickets for the [KGP](https://youtrack.jetbrains.com/issue/KT-56574) and the [Maven plugin](https://youtrack.jetbrains.com/issue/KT-73012).

## Kotlin standard library

In Kotlin 2.2.0, the [`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) and [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) are now [Stable](components-stability.md#stability-levels-explained).

### Stable Base64 encoding and decoding

Kotlin 1.8.20 introduced [Experimental support for Base64 encoding and decoding](whatsnew1820.md#support-for-base64-encoding).
In Kotlin 2.2.0, the [Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) is now [Stable](components-stability.md#stability-levels-explained) and
includes four encoding schemes, with the new `Base64.Pem` added in this release:

* [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/) uses the standard [Base64 encoding scheme](https://www.rfc-editor.org/rfc/rfc4648#section-4).

  > The `Base64.Default` is the companion object of the `Base64` class.
  > As a result, you can call its functions with `Base64.encode()` and `Base64.decode()` instead of `Base64.Default.encode()` and `Base64.Default.decode()`.
  >
  {style="tip"}

* [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html) uses the ["URL and Filename safe"](https://www.rfc-editor.org/rfc/rfc4648#section-5) encoding scheme.
* [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html) uses the [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 
  encoding scheme, inserting a line separator every 76 characters during encoding and skipping illegal characters during decoding.
* `Base64.Pem` encodes data like `Base64.Mime` but limits the line length to 64 characters.

You can use the Base64 API to encode binary data into a Base64 string and decode it back into bytes.

Here's an example:

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// Alternatively:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// Alternatively:
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```

On the JVM, use the `.encodingWith()` and `.decodingWith()` extension functions to encode and decode Base64 with input and output streams:

```kotlin
import kotlin.io.encoding.*
import java.io.ByteArrayOutputStream

fun main() {
    val output = ByteArrayOutputStream()
    val base64Output = output.encodingWith(Base64.Default)

    base64Output.use { stream ->
        stream.write("Hello World!!".encodeToByteArray()) 
    }

    println(output.toString())
    // SGVsbG8gV29ybGQhIQ==
}
```

### Stable Hexadecimal parsing and formatting with the `HexFormat` API

The [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) introduced in [Kotlin 1.9.0](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals) is now [Stable](components-stability.md#stability-levels-explained).
You can use it to convert between numerical values and hexadecimal strings.

For example:

```kotlin
fun main() {
    //sampleStart
    println(93.toHexString())
    //sampleEnd
}
```
{kotlin-runnable="true"}

For more information, see [New HexFormat class to format and parse hexadecimals](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals).

## Compose compiler

In this release, the Compose compiler introduces support for composable function references and changes defaults for several feature flags.

### Support for `@Composable` function references

The Compose compiler supports the declaration and usage of composable function references starting from the Kotlin 2.2.0 release:

```kotlin
val content: @Composable (String) -> Unit = ::Text

@Composable fun App() {
    content("My App")
}
```

Composable function references behave slightly differently from composable lambda objects at runtime. In particular, 
composable lambdas allow for finer control over skipping by extending the `ComposableLambda` class. Function references are expected to implement the `KCallable` interface, so the same optimization cannot be applied to them.

### `PausableComposition` feature flag enabled by default

The `PausableComposition` feature flag is enabled by default starting from Kotlin 2.2.0. This flag adjusts the 
Compose compiler output for restartable functions, allowing runtime to force skipping behavior and therefore effectively 
pause composition by skipping each function. This allows heavy compositions to be split between frames, which will be used 
by prefetching in a future release.

To disable this feature flag, add the following to your Gradle configuration:

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.PausableComposition.disabled())
}
```

### `OptimizeNonSkippingGroups` feature flag enabled by default

The `OptimizeNonSkippingGroups` feature flag is enabled by default starting from Kotlin 2.2.0. This optimization 
improves runtime performance by removing group calls generated for non-skipping composable functions. 
It should not result in any observable behavior changes at runtime.

If you encounter any issues, you can validate that this change causes the issue by disabling the feature flag. 
Please report any issues to the [Jetpack Compose issue tracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126).

To disable the `OptimizeNonSkippingGroups` flag, add the following to your Gradle configuration:

```kotlin
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups.disabled())
}
```

### Deprecated feature flags

The `StrongSkipping` and `IntrinsicRemember` feature flags are now deprecated and will be removed in a future release. 
If you encounter any issues that make you disable these feature flags, please report them to the [Jetpack Compose issue tracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126).

## Breaking changes and deprecations

* Starting with Kotlin 2.2.0, support for the [](ant.md) build system is deprecated. Kotlin support for Ant hasn't been 
  in active development for a long time, and there are no plans to maintain it further due to its relatively small user base.
  
  We plan to remove Ant support in 2.3.0. However, Kotlin remains open to [contribution](contribute.md). If you're 
  interested in becoming an external maintainer for Ant, leave a comment with the “jetbrains-team” visibility setting in [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-75875/).

* Kotlin 2.2.0 raises the deprecation level of the [`kotlinOptions{}` block in Gradle to error](compatibility-guide-22.md#deprecate-kotlinoptions-dsl). 
  Use the `compilerOptions{}` block instead. For guidance on updating your build scripts, see [Migrate from `kotlinOptions{}` to `compilerOptions{}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions).
* Kotlin scripting remains an important part of Kotlin's ecosystem, but we're focusing on specific use cases such as 
  custom scripting, as well as `gradle.kts` and `main.kts` scripts, to provide a better experience. 
  To learn more, see our updated [blog post](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/). As a result, Kotlin 2.2.0 deprecates support for:
  
  * REPL: To continue to use REPL via `kotlinc`, opt in with the `-Xrepl` compiler option.
  * JSR-223: Since this [JSR](https://jcp.org/en/jsr/detail?id=223) is in the **Withdrawn** state, the JSR-223 
    implementation continues to work with language version 1.9 but won't be migrated to use the K2 compiler in the future.
  * The `KotlinScriptMojo` Maven plugin: We didn't see enough traction with this plugin. You will see compiler warnings if you continue to use it.
* 
* In Kotlin 2.2.0, the [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) function in [`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) now [replaces configured sources instead of adding to them](compatibility-guide-22.md#correct-setsource-function-in-kotlincompiletool-to-replace-sources).
  If you want to add sources without replacing existing ones, use the [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) function.
* The type of [`annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) in `BaseKapt` has been [changed from `MutableList<Any>` to `MutableList<CommandLineArgumentProvider>`](compatibility-guide-22.md#deprecate-basekapt-annotationprocessoroptionproviders-property). If your code currently adds a list as a single element, use the `addAll()` function instead of the `add()` function.
* Following the deprecation of the dead code elimination (DCE) tool used in the legacy Kotlin/JS backend, 
  the remaining DSLs related to DCE are now removed from the Kotlin Gradle plugin:
  * The `org.jetbrains.kotlin.gradle.dsl.KotlinJsDce` interface
  * The `org.jetbrains.kotlin.gradle.targets.js.dsl.KotlinJsBrowserDsl.dceTask(body: Action<KotlinJsDce>)` function
  * The `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceCompilerToolOptions` interface
  * The `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceOptions` interface

  The current [JS IR compiler](js-ir-compiler.md) supports DCE out of the box, and the [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) annotation allows specifying which Kotlin functions and classes to retain during DCE.

* The deprecated `kotlin-android-extensions` plugin is [removed in Kotlin 2.2.0](compatibility-guide-22.md#deprecate-kotlin-android-extensions-plugin). 
  Use the `kotlin-parcelize` plugin for the `Parcelable` implementation generator and the Android Jetpack's [view bindings](https://developer.android.com/topic/libraries/view-binding) for synthetic views instead.
* Experimental `kotlinArtifacts` API is [deprecated in Kotlin 2.2.0](compatibility-guide-22.md#deprecate-kotlinartifacts-api). 
  Use the current DSL available in the Kotlin Gradle plugin to [build final native binaries](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html). If it's not sufficient for migration, leave a comment in [this YT issue](https://youtrack.jetbrains.com/issue/KT-74953).
* `KotlinCompilation.source`, deprecated in Kotlin 1.9.0, is now [removed from the Kotlin Gradle plugin](compatibility-guide-22.md#deprecate-kotlincompilation-source-api).
* The parameters for experimental commonization modes are [deprecated in Kotlin 2.2.0](compatibility-guide-22.md#deprecate-commonization-parameters). 
  Clear the commonization cache to delete invalid compilation artifacts.
* The deprecated `konanVersion` property is now [removed from the `CInteropProcess` task](compatibility-guide-22.md#deprecate-konanversion-in-cinteropprocess). 
  Use `CInteropProcess.kotlinNativeVersion` instead.
* Usage of the deprecated `destinationDir` property will now [lead to an error](compatibility-guide-22.md#deprecate-destinationdir-in-cinteropprocess). 
  Use `CInteropProcess.destinationDirectory.set()` instead.

## Documentation updates

This release brings notable documentation changes, including the migration of Kotlin Multiplatform documentation to the [KMP portal](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html). 

Additionally, we launched a documentation survey, created new pages and tutorials, and revamped existing ones. 

### Kotlin's documentation survey

We're looking for genuine feedback to make the Kotlin documentation better.

The survey takes around 15 minutes to complete, and your input will help shape the future of Kotlin docs.

[Take the survey here](https://surveys.jetbrains.com/s3/Kotlin-Docs-2025).

### New and revamped tutorials

* [Kotlin intermediate tour](kotlin-tour-welcome.md) – Take your understanding of Kotlin to the next level. Learn when to use extension functions, interfaces, classes, and more.
* [Build a Kotlin app that uses Spring AI](spring-ai-guide.md) – Learn how to create a Kotlin app that answers questions using OpenAI and a vector database.
* [](jvm-create-project-with-spring-boot.md) – Learn how to create a Spring Boot project with Gradle using IntelliJ IDEA's **New Project** wizard.
* [Mapping Kotlin and C tutorial series](mapping-primitive-data-types-from-c.md) – Learn how different types and constructs are mapped between Kotlin and C.
* [Create an app using C interop and libcurl](native-app-with-c-and-libcurl.md) – Create a simple HTTP client that can run natively using the libcurl C library.
* [Create your Kotlin Multiplatform library](https://www.jetbrains.com/help/kotlin-multiplatform-dev/create-kotlin-multiplatform-library.html) – Learn how to create and publish a multiplatform library using IntelliJ IDEA.
* [Build a full-stack application with Ktor and Kotlin Multiplatform](https://ktor.io/docs/full-stack-development-with-kotlin-multiplatform.html) – This tutorial now uses IntelliJ IDEA instead of Fleet, along with Material 3 and the latest versions of Ktor and Kotlin.
* [Manage local resource environment in your Compose Multiplatform app](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-resource-environment.html) – Learn how to manage the application's resource environment, like in-app theme and language.

### New and revamped pages

* [Kotlin for AI overview](kotlin-ai-apps-development-overview.md) – Discover Kotlin's capabilities for building AI-powered applications.
* [Dokka migration guide](https://kotlinlang.org/docs/dokka-migration.html) – Learn how to migrate to v2 of the Dokka Gradle plugin.
* [](metadata-jvm.md) – Explore guidance on reading, modifying, and generating metadata for Kotlin classes compiled for the JVM.
* [CocoaPods integration](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) – Learn how to set up the environment, add Pod dependencies, or use a Kotlin project as a CocoaPod dependency through tutorials and sample projects.
* New pages for Compose Multiplatform to support the iOS stable release:
    * [Navigation](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation.html) and [Deep linking](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation-deep-links.html) in particular.
    * [Implementing layouts in Compose](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-layout.html).
    * [Localizing strings](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-localize-strings.html) and other i18n pages like support for RTL languages.
* [Compose Hot Reload](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-hot-reload.html) – Learn how to use Compose Hot Reload with your desktop targets and how to add it to an existing project.
* [Exposed migrations](https://www.jetbrains.com/help/exposed/migrations.html) – Learn about the tools Exposed provides for managing database schema changes.

## How to update to Kotlin 2.2.0

The Kotlin plugin is distributed as a bundled plugin in IntelliJ IDEA and Android Studio.

To update to the new Kotlin version, [change the Kotlin version](releases.md#update-to-a-new-kotlin-version)
to 2.2.0 in your build scripts.