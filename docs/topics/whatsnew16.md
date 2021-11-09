[//]: # (title: What's new in Kotlin 1.6.0)

_[Release date: 15 November 2021](releases.md#release-details)_

Kotlin 1.6.0 introduces new language features, optimizations and improvements of existing ones, and a lot of improvements of the Kotlin standard library.

Here some of them:
* JVM optimization and performance improvements.

## Language

Kotlin 1.6.0 brings stabilization to several language features introduced for preview in the previous 1.5.30 release:
* [Stable exhaustive when statements for enum, sealed and Boolean subjects](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [Stable suspending functions as supertypes](#stable-suspending-functions-as-supertypes)
* [Stable suspend conversions](#stable-suspend-conversions)
* [Stable instantiation of annotation classes](#stable-instantiation-of-annotation-classes)

It also receives various type inference improvements and the support of annotations on class type parameters:
* [Improved type inference for recursive generic types](#improved-type-inference-for-recursive-generic-types)
* [Changes to builder inference](#changes-to-builder-inference)
* [Support of annotations on class type parameters](#support-of-annotations-on-class-type-parameters)

### Stable exhaustive when statements for enum, sealed and Boolean subjects

An _exhaustive_ [`when`](control-flow.md#when-expression) statement contains branches for all possible types or values of its subject or for some types plus an `else` branch. In other words, it covers all possible cases.

We’re going to prohibit non-exhaustive `when` statements soon to make the behavior consistent with `when` expressions. To ensure smooth migration, Kotlin 1.6 reports warnings about non-exhaustive `when` statements with an enum, a sealed or a Boolean subject. Such warnings will become errors in the future.

```kotlin
sealed class Mode {
    object ON : Mode()
    object OFF : Mode()
}

fun main() {
    val x: Mode = Mode.ON
    when (x) { 
        Mode.ON -> println("ON")
    }
// WARNING: Non exhaustive 'when' statements on sealed classes/interfaces 
// will be prohibited in 1.7, add an 'OFF' or 'else' branch instead

    val y: Boolean = true
    when (y) {  
        true -> println("true")
    }
// WARNING: Non exhaustive 'when' statements on Booleans will be prohibited 
// in 1.7, add a 'false' or 'else' branch instead
}
```

### Stable suspending functions as supertypes

Kotlin 1.6.0 makes an implementation of suspending functional types [Stable](components-stability.md). A preview of the feature was available [in 1.5.30](whatsnew1530.md#suspending-functions-as-supertypes).

Note that there are currently two limitations coming from implementation details:
* You can’t mix ordinary functional types and suspending ones in the list of supertypes.
* You can't use multiple suspending functional supertypes.

```kotlin
class MyClass: suspend () -> Unit {
    override suspend fun invoke() = TODO()
}
```

### Stable suspend conversions

Kotlin 1.6.0 introduces [Stable](components-stability.md) conversions from regular to suspending functional type.
Starting from 1.4.0, the feature supported functional literals and callable references.
With 1.6.0, it works with any form of expression. As a call argument, you can now pass any expression of a suitable regular functional type where suspending is expected. The compiler will perform an implicit conversion automatically.

```kotlin
fun foo(f: suspend () -> Unit) {}

fun bar() {}

fun test(baz: () -> Unit) {
    foo { }    // OK
    foo(::bar) // OK
    foo(baz)   // OK
}
```

### Stable instantiation of annotation classes

Kotlin 1.5.30 [introduced](whatsnew1530.md#instantiation-of-annotation-classes) the experimental support for annotation classes instantiation on the JVM platform. With 1.6, the feature becomes available by default both for Kotlin/JVM and Kotlin/JS.

Learn more about instantiation of annotation classes in [this KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md).

### Improved type inference for recursive generic types

Kotlin 1.5.30 introduced an improvement to type inference for recursive generic types, which allowed inferring their type arguments based only on upper bounds of corresponding type parameters. The improvement was available with the compiler option. From 1.6.0 on, it is enabled by default.

```kotlin
// Before 1.5.30
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
    withDatabaseName("db")
    withUsername("user")
    withPassword("password")
    withInitScript("sql/schema.sql")
}

// With compiler option in 1.5.30 or by default starting with 1.6.0
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
    .withDatabaseName("db")
    .withUsername("user")
    .withPassword("password")
    .withInitScript("sql/schema.sql")
```

### Changes to builder inference

Builder inference is a type inference flavor, which comes in handy when calling generic builder functions. It can infer the type arguments of a call with the help of type information from calls inside its lambda argument.

We follow the way towards builder inference full stabilization by making multiple changes. Starting with 1.6.0:
* You can make calls returning an instance of not yet inferred type inside a builder lambda without specifying the `-Xunrestricted-builder-inference` compiler option [introduced in 1.5.30](whatsnew1530.md#eliminating-builder-inference-restrictions).
* With `-Xenable-builder-inference`, you can write your own builders without applying [`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) annotation.

    > Note that clients of these builders will need to specify the same `-Xenable-builder-inference` compiler option.
    >
    {type=”warning”}

* With `-Xenable-builder-inference`, builder inference automatically turns on if regular type inference cannot get enough information about a type.

[Learn how to write custom generic builders](using-builders-with-builder-inference.md).

### Support of annotations on class type parameters

Support of annotations on class type parameters looks the following way:

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class Ann

class Foo<@Ann T> {}
```

Annotations on all type parameters are emitted into JVM bytecode, so annotation processors are able to use them.

For motivating use-case, read this [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-43714).

Learn more about [annotations](annotations.md).

## New API support flow

Starting with Kotlin 1.6.0, we support the development for three previous API versions instead of two, along with the current stable one. Currently, it's 1.3, 1.4, 1.5, and 1.6.

## Kotlin/JVM

As for Kotlin/JVM, starting with 1.6.0, the compiler can generate classes with a bytecode version corresponding to JVM 17. The new language version also brings repeatable annotations, which we had on the roadmap:
* [Repeatable annotations with runtime retention for 1.8 JVM target](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)

### Optimize delegated properties which call get/set on the given KProperty instance

We optimized the generated JVM bytecode by omitting the `$delegate` field and generating immediate access to the referenced property.

For example, in this code

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin no longer generates the field `content$delegate`.
Property accessors of the `content` variable invoke the `impl` variable directly, skipping the delegated property’s `getValue`/`setValue` operators, and thus avoiding the need for the property reference object of the [`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) type.

Thanks to our Google colleagues for their major contribution to the implementation!

Learn more about [delegated properties](delegated-properties.md).

### Repeatable annotations with runtime retention for 1.8 JVM target

Java 8 introduced [repeatable annotations](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html), which are applicable multiple times to a single code element. The feature requires two declarations to be present in the Java code: the repeatable annotation itself marked with [`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html) and the containing annotation to hold its values.

Kotlin also has repeatable annotations but requires only [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) to be present on an annotation declaration to make it repeatable. Before 1.6.0, the feature supported only `SOURCE` retention and was incompatible with the Java one. Kotlin 1.6.0 removes these limitations: `@kotlin.annotation.Repeatable` now accepts any retention and makes the annotation repeatable both in Kotlin and Java. Java repeatable annotations are now also supported from the Kotlin side.

Note that you still don’t need to declare a containing annotation, although you can. For example:
* If an annotation `@Tag` is marked with `@kotlin.annotation.Repeatable`, the Kotlin compiler automatically generates a containing annotation class under the name of `@Tag.Container`.

    ```kotlin
    @Repeatable 
    annotation class Tag(val name: String)
    
    // The compiler generates @Tag.Container containing annotation
    ```

* To set a custom name for a containing annotation, apply [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) meta-annotation and pass as an argument the explicitly declared containing annotation class.

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)
    
    annotation class Tags(val value: Array<Tag>)
    ```

Kotlin reflection also receives support for both Kotlin and Java repeatable annotations via a new function [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html).

Learn more about Kotlin repeatable annotations in [this KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md).

## Kotlin/Native

Kotlin/Native is receiving multiple improvements and component updates, some of them in the preview state:
* [Preview of the new memory manager](#preview-of-the-new-memory-manager)
* [Support for Xcode 13](#support-for-xcode-13)
* [Compilation of Windows targets on any host](#compilation-of-windows-targets-on-any-host)
* [LLVM and linker updates](#llvm-and-linker-updates)
* [Performance improvements](#performance-improvements)
* [Unified compiler plugin ABI with JVM and JS IR backends](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [Detailed error messages for klib linkage failures](#detailed-error-messages-for-klib-linkage-failures)
* [Reworked unhandled exception handling API](#reworked-unhandled-exception-handling-api)

### Preview of the new memory manager

> The new Kotlin/Native memory manager is [Experimental](components-stability.md).
> It may be dropped or changed at any time. Opt-in is required (see details below), and you should use it only for evaluation purposes.
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525).
>
{type="warning"}

With Kotlin 1.6.0, you can try the development preview of the new Kotlin/Native memory manager. It moves us closer to eliminating the differences between the JVM and Native platforms to provide a consistent developer experience in multiplatform projects.

One of the notable changes is the lazy initialization of top-level properties like in Kotlin/JVM. A top-level property gets initialized when a top-level property or function from the same file is accessed for the first time. This mode also includes a global interprocedural optimization (enabled only for release binaries), which removes redundant initialization checks.

We’ve recently published a [blog post](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/) about the new memory manager. Read it to learn about the current state of the new memory manager and find some demo projects, or jump right to the [migration instructions](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md) to try it yourself.
Please check how the new memory manager works on your projects and share feedback in our issue tracker, [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525).

### Support for Xcode 13

Kotlin/Native 1.6.0 supports the latest version of Xcode – 13. Feel free to update your Xcode and continue working on your Kotlin projects for Apple operating systems.

> Note: new libraries added in Xcode 13 aren’t available for using from Kotlin 1.6.0. We’re going to support them in the nearest versions.
>
{type=”note”}

### Compilation of Windows targets on any host

Starting from 1.6.0, you don’t need a Windows host for compiling Windows targets `mingwX64` and `mingwX86`. They can be compiled on any host that supports Kotlin/Native.

### LLVM and linker updates

We’ve reworked the LLVM dependency that Kotlin/Native uses under the hood. This brings various benefits, including:
* Updated LLVM version to 11.1.0.
* Decreased dependency size. For example, on macOS it’s now about 300 MB instead of 1200 MB in the previous version.
* [Excluded dependency on the `ncurses5` library](https://youtrack.jetbrains.com/issue/KT-42693) that isn’t available in modern Linux distributions.

In addition to the LLVM update, Kotlin/Native now uses the [LLD](https://lld.llvm.org/) linker (a linker from the LLVM project) for MingGW targets. It provides various benefits over the previously used ld.bfd linker, and will allow us to improve runtime performance of produced binaries and support compiler caches for MinGW targets. Note that LLD [requires import libraries for DLL linkage](whatsnew1530.md#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets). Learn more in [this Stack Overflow thread](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527).

### Performance improvements

Kotlin/Native 1.6.0 has received the following performance improvements:

* Compilation time: compiler caches are enabled by default for `linuxX64` and `iosArm64` targets. This speeds up most compilations in the debug mode (except the first one). Measurements showed about a 200% speed increase on our test projects. The compiler caches were available for these targets since Kotlin 1.5.0 with [additional Gradle properties](whatsnew15.md#performance-improvements); you can remove them now.
* Runtime: iterating over arrays with the `for` loops is now up to 12% faster due to optimizations in the produced LLVM code.

### Unified compiler plugin ABI with JVM and JS IR backends

> The option to use common IR compiler plugin ABI for Kotlin/Native is [Experimental](components-stability.md).
> It may be dropped or changed at any time. Opt-in is required (see details below), and you should use it only for evaluation purposes.
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-48595).
>
{type="warning"}

In previous versions, authors of compiler plugins had to provide separate artifacts for Kotlin/Native because of the differences in the ABI.
Starting from 1.6.0, Kotlin Multiplatform Gradle plugin is able to use the embeddable compiler jar – the one used for JVM and JS IR backends – for Kotlin/Native. This is a step towards unification of compiler plugin development experience: you can now use the same compiler plugin artifacts for Native and other supported platforms.

This is a preview version of such support, and it requires an opt-in. To start using generic compiler plugin artifacts for Kotlin/Native, add the following line to `gradle.properties`: `kotlin.native.useEmbeddableCompilerJar=true`.

We’re planning to use the embeddable compiler jar for Kotlin/Native by default in the future, so it’s vital for us to hear how the preview works for you.

If you are an author of a compiler plugin, please try this mode and check if it works for your plugin. Note that depending on your plugin’s structure, migration steps may be required. See [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48595) for migration instructions and leave you feedback in comments.

### Detailed error messages for klib linkage failures

Now the Kotlin/Native compiler provides detailed error messages for klib linkage errors. The messages now have clear error descriptions and also include information about possible causes and ways to fix them. Example:

* 1.5.30:

    ```text
    e: java.lang.IllegalStateException: IrTypeAliasSymbol expected: Unbound public symbol for public kotlinx.coroutines/CancellationException|null[0]
    <stack trace>
    ```

* 1.6.0:

    ```text
    e: The symbol of unexpected type encountered during IR deserialization: IrClassPublicSymbolImpl, kotlinx.coroutines/CancellationException|null[0]. IrTypeAliasSymbol is expected.
    
    This could happen if there are two libraries, where one library was compiled against the different version of the other library than the one currently used in the project. Please check that the project configuration is correct and has consistent versions of dependencies.
    
    The list of libraries that depend on "org.jetbrains.kotlinx:kotlinx-coroutines-core (org.jetbrains.kotlinx:kotlinx-coroutines-core-macosx64)" and may lead to conflicts:
    <list of libraries and potential version mismatches>
    
    Project dependencies:
    <dependencies tree>
    ```

### Reworked unhandled exception handling API

We've unified unhandled exception processing across the Kotlin/Native runtime and exposed the default processing as a function `processUnhandledException(throwable: Throwable)` for use by custom execution environments. For example, by `kotlinx.coroutines`.
This processing is also applied to exceptions escaping operation in `Worker.executeAfter()` but only for the new [memory manager](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md).

API improvements also affected the hooks that have been set by `setUnhandledExceptionHook()`: previously such hooks were reset after the Kotlin/Native runtime called hook with unhandled exception, and the program would always terminate right after.
Now these hooks may be used more than once, and if you want the program to always terminate on unhandled exception, either do not set an unhandled exception hook (`setUnhandledExceptionHook()`), or make sure to call `terminateWithUnhandledException()` at the end of your hook.
This will help you to send exceptions to any third-party crash reporting service (like Firebase Crashlytics) and then terminate the program.
Exceptions escaping `main()` and exceptions crossing interop boundary will always terminate the program, even if the hook did not call `terminateWithUnhandledException()`.

## Kotlin/JS

We’re continuing to work on stabilizing the IR backend for Kotlin/JS compiler. Aside from it, Kotlin/JS is receiving one new feature:
* [Option to disable downloading of Node.js and Yarn](#option-to-use-pre-installed-node-js-and-yarn)

### Option to use pre-installed Node.js and Yarn

You can now disable downloading of Node.js and Yarn when building Kotlin/JS projects and use the instances already installed on the host. This is useful for building on servers without internet connection, such as CI servers.

To disable downloading of external components, add the following lines to your `build.gradle(.kts)`:

* Yarn:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // or true for default behavior
    }
    ```
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
    }
    ```
    
    </tab>
    </tabs>

* Node.js:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin::class.java> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // or true for default behavior
    }
     
    ```
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension).download = false
    }
    ```
    
    </tab>
    </tabs>

## Kotlin Gradle plugin

In Kotlin 1.6.0, we changed the deprecation level of the `KotlinGradleSubplugin` class to 'ERROR'. This class was used for writing compiler plugins. In the following releases, we’ll remove this class. Use the class `KotlinCompilerPluginSupportPlugin` instead.

We removed the `kotlin.useFallbackCompilerSearch` build option and `noReflect` and `includeRuntime` compiler options. We hid the `useIR` compiler option and will remove it in the following releases.

Learn more about [currently supported compiler options](gradle.md#compiler-options) in Kotlin Gradle plugin.

## Standard library

The new 1.6.0 version has received multiple changes: stabilizing experimental features, introducing new ones, and behavior unification across platforms:

* [New readline functions](#new-readline-functions)
* [Stable `typeOf()`](#stable-typeof)
* [Stable collection builders](#stable-collection-builders)
* [Stable Duration API](#stable-duration-api)
* [Splitting Regex to a sequence](#splitting-regex-to-a-sequence)
* [Bit operations](#bit-operations)
* [Changes for replace() and replaceFirst() in JS](#changes-for-replace-and-replacefirst-in-js)
* [Improving the existing API](#improving-the-existing-api)
* [Deprecations](#deprecations)

### New readline functions

Kotlin 1.6.0 introduces new cross-platform functions for handling standard input: `readln()` and `readlnOrNull()`.

|**Earlier versions**|**1.6 alternative**|**Usage**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| reads a line from stdin and returns it,<br/>throws a `RuntimeException` if EOF has been reached |
|`readLine()`|`readlnOrNull()`| reads a line from stdin and returns it,<br/>returns `null` if EOF has been reached |

We believe that eliminating the need to use `!!` when reading a line will improve the experience for newcomers and simplify the teaching of Kotlin.
To make the read-line operation name consistent with its `println()` counterpart, we've decided to shorten the names of new functions to 'ln'.

```kotlin
fun main() {
//sampleStart
    println("What is your nickname?")
    val nickname = readln()
    println("Hello, $nickname!")
    //sampleEnd
}
```

```kotlin
fun main() {
//sampleStart
    var sum = 0
    while (true) {
        val nextLine = readlnOrNull().takeUnless { it.isNullOrEmpty() } ?: break
        sum += nextLine.toInt()
    }
    println(sum)
//sampleEnd
}
```

For now, the existing `readLine()` function will get a lower priority than `readln()` and `readlnOrNull()` in your IDE code completion. Even more, IDE inspections will recommend using new functions instead of the legacy `readLine()`.

We're planning to gradually deprecate the `readLine()` function in one of the future releases.

### Stable `typeOf()`

The version 1.6.0 brings [Stable](components-stability.md) [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) function closing [one](https://youtrack.jetbrains.com/issue/KT-45396) of the major roadmap items.

[Since 1.3.40](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/), `typeOf()` was available on the JVM platform as an experimental API. Now you can use it in any Kotlin platform and get [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) representation of any Kotlin type that the compiler can infer.

```kotlin
inline fun <reified T> renderType(): String {
    val type = typeOf<T>()
    return type.toString()
}

fun main() {
    val fromExplicitType = typeOf<Int>()
    val fromReifiedType = renderType<List<Int>>()
}
```

### Stable collection builders

In Kotlin 1.6.0, collection builder functions are promoted to Stable. Collections returned by collection builders are now serializable in their read-only state.

You can now use [`buildMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html),
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html), and [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)
without the opt-in annotation:

```kotlin
fun main(args: Array<String>) {
//sampleStart
   val x = listOf('b', 'c')
   val y = buildList {
       add('a')
       addAll(x)
       add('d')
   }
   println(y)  // [a, b, c, d]
//sampleEnd
}
```

### Stable Duration API

The [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) class for representing
duration amounts in different time units is promoted to [Stable](components-stability.md). In 1.6.0, the Duration API has received the following changes:

* The first component of the [`toComponents`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) function that decomposes the duration into days, hours, minutes, seconds, and nanoseconds, now has the `Long` type instead of `Int`.
  Веfore, if the value didn't fit into the `Int` range, it was coerced into that range. With the `Long` type, you can decompose any value in the duration range without cutting off the values that don't fit into `Int`.

* The `DurationUnit` enum is now standalone and not a type alias of `java.util.concurrent.TimeUnit` on JVM.
  We haven't found convincing cases when having `typealias DurationUnit = TimeUnit` could be useful. Also, exposing the `TimeUnit` API through a type alias may confuse `DurationUnit` users.

* In response to the community feedback, we're bringing back extension properties like `Int.seconds`. But we'd like to limit their applicability, so we put them into the companion of the Duration class. While IDE can still propose extensions in completion and automatically insert an import from the companion, we plan to limit this behavior in the future to cases when the `Duration` type is expected.

```kotlin
import kotlin.time.Duration.Companion.seconds

fun main() {
// sampleStart
    val duration = 10000
    println("There are ${duration.seconds.inWholeMinutes} minutes in $duration seconds")
    // There are 166 minutes in 10000 seconds
// sampleEnd
}
```

We suggest replacing previously introduced companion functions, such as `Duration.seconds(Int)`, and deprecated top-level extensions
like `Int.seconds` with new extensions in `Duration.Companion`.

> Note that such replacement may cause ambiguity between the old top-level extensions and new companion extensions.
> Be sure to use the wildcard import of the kotlin.time package: `import kotlin.time.*` before doing automated migration.
>
{type="note"}

### Splitting Regex to a sequence

The `Regex.splitToSequence(CharSequence)` and `CharSequence.splitToSequence(Regex)` functions are promoted to Stable too. They split the string around matches of the given regex, but return the result as a [Sequence](sequences.md) so that all operations on this result are executed lazily.

```kotlin
fun main() {
//sampleStart
   val colorsText = "green, red , brown&blue, orange, pink&green"
   val regex = "[,\\s]+".toRegex()
   val mixedColor = regex.splitToSequence(colorsText)
       .onEach { println(it) }
       .firstOrNull { it.contains('&') }
   println(mixedColor) // "brown&blue"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

```kotlin
   val mixedColor = colorsText.splitToSequence(regex)
```
{kotlin-runnable="false"}

### Bit operations

In Kotlin 1.6.0, the `rotateLeft()` and `rotateRight()` functions for bit manipulations became Stable. The functions rotate binary representation of the number left or right by the specified number of bits:

```kotlin
fun main() {
//sampleStart
    val number: Short = 0b10001
    println(number.rotateRight(2).toString(radix = 2)) // 100000000000100
    println(number.rotateLeft(2).toString(radix = 2))  // 1000100
//sampleEnd
}
```

### Changes for replace() and replaceFirst() in JS

Before Kotlin 1.6.0, the [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html)
and [`replaceFirst()`] (https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) Regex functions behaved differently in Java and JS when replacement string contained group reference. To make the behavior predictable for all target platforms, we've changed their implementation in JS.

Occurrences of `${name}` or `$index` in the replacement string are substituted with the subsequences corresponding to the captured groups with the specified index or a name:
* `$index` – the first digit after '$' is always treated as a part of the group reference. Subsequent digits are incorporated into the `index` only if they form a valid group reference. Only digits '0'..'9' are considered potential components of the group reference. Note that indexes of captured groups start from '1'. The group with an index '0' stands for the whole match.
* `${name}` – the `name` can consist of Latin letters 'a'..'z', 'A'..'Z', or digits '0'..'9'. The first character must be a letter.

    > Note that the support of named groups in replacement patterns is currently available only in JVM.
    >
    {type="note"}

* To include the succeeding character as a literal in the replacement string, use the backslash character `\`:

    ```kotlin
    fun main() {
    //sampleStart
       println(Regex("(.+)").replace("Kotlin", "\$ $1")) // $ Kotlin
       println(Regex("(.+)").replaceFirst("1.6.0", "\\ $1")) // \ 1.6.0
    //sampleEnd
    }
    ```

You can use [`Regex.escapeReplacement()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/escape-replacement.html) if the replacement string has to be treated as a literal string.

### Improving the existing API

* Added the `compareTo` infix extension function that compares two objects for order:

    ```kotlin
    class WrappedText(val text: String) : Comparable<WrappedText> {
        override fun compareTo(other: WrappedText): Int =
            this.text compareTo other.text
    }
    ```

* `Regex.replace()` in JS is now also not inline to unify its implementation across all platforms.
* The `compareTo()` and `equals()` String functions, as well as the `isBlank()` CharSequence function now behave in JS exactly like on the JVM. Previously there were deviations when it came to non-ASCII characters.

### Deprecations

In Kotlin 1.6.0, we're starting the deprecation cycle with a warning for some JS-only stdlib API.

#### concat(), match(), and matches() string functions

* To concatenate the string with the string representation of the given other object, use `plus()` instead of `concat()`.
* For finding all occurrences of a regular expression within the input, use `findAll()` of the Regex class instead of `String.match(regex: String)`.
* To check if the regular expression matches the entire input, use `matches()` of the Regex class instead of `String.matches(regex: String)`.

#### sort() on arrays taking comparison functions

We've deprecated the `Array<out T>.sort()` function and inline functions: `ByteArray.sort()`, `ShortArray.sort()`,
`IntArray.sort()`, `LongArray.sort()`, `FloatArray.sort()`, `DoubleArray.sort()`, and `CharArray.sort()` that sorted arrays following the order passed by the comparison function. For array sorting, use other standard library functions. See the [collection ordering](collection-ordering.md) section for reference.

## Tools

### Kover — code coverage tool for Kotlin

>The Kover Gradle plugin is Experimental. We would appreciate your feedback on it in [GitHub](https://github.com/Kotlin/kotlinx-kover/issues).
>
{type=”warning”}

With Kotlin 1.6.0, we’re introducing Kover — the Gradle plugin for Kotlin code coverage agents IntelliJ and JaCoCo. It works with all language constructs including inline functions.

Learn more about Kover on its [GitHub repository](https://github.com/Kotlin/kotlinx-kover).

## Migrating to Kotlin 1.6.0

IntelliJ IDEA and Android Studio will suggest updating the Kotlin plugin to 1.6.0 once it is available.

To migrate existing projects to Kotlin 1.6.0, just change the Kotlin version to `1.6.0` and re-import your Gradle or Maven
project. [Learn how to update to Kotlin 1.6.0](releases.md#update-to-a-new-release).

To start a new project with Kotlin 1.6.0, update the Kotlin plugin and run the Project Wizard from **File** \| **New** \|
**Project**.

The new command-line compiler is available for download on the [GitHub release page](https://github.com/JetBrains/kotlin/releases/tag/v1.6.0).

Kotlin 1.6.0 is a [feature release](kotlin-evolution.md#feature-releases-and-incremental-releases) and can therefore bring incompatible changes to the language. Find the detailed list of such changes in the [Compatibility Guide for Kotlin 1.6](compatibility-guide-16.md).