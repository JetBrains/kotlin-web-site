[//]: # (title: What's new in Kotlin 1.5.0)

_[Release date: 5 May 2021](releases.md#release-details)_

Kotlin 1.5.0 introduces new language features, stable IR-based JVM compiler backend, performance improvements,
and evolutionary changes such as stabilizing experimental features and deprecating outdated ones.

You can also find an overview of the changes in the [release blog post](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/).

## Language features

Kotlin 1.5.0 brings stable versions of the new language features presented for [preview in 1.4.30](whatsnew1430.md#language-features):
* [JVM records support](#jvm-records-support)
* [Sealed interfaces](#sealed-interfaces) and [sealed class improvements](#package-wide-sealed-class-hierarchies)
* [Inline classes](#inline-classes)

Detailed descriptions of these features are available in [this blog post](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)
and the corresponding pages of Kotlin documentation.

### JVM records support

Java is evolving fast, and to make sure Kotlin remains interoperable with it, we’ve introduced support for one of its latest
features – [record classes](https://openjdk.java.net/jeps/395).

Kotlin’s support for JVM records includes bidirectional interoperability:
* In Kotlin code, you can use Java record classes like you would use typical classes with properties.
* To use a Kotlin class as a record in Java code, make it a `data` class and mark it with the `@JvmRecord` annotation.

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

[Learn more about using JVM records in Kotlin](jvm-records.md).

<video href="iyEWXyuuseU" title="Support for JVM Records in Kotlin 1.5.0"/>

### Sealed interfaces

Kotlin interfaces can now have the `sealed` modifier, which works on interfaces in the same way it works on classes: all
implementations of a sealed interface are known at compile time.

```kotlin
sealed interface Polygon
```

You can rely on that fact, for example, to write exhaustive `when` expressions.

```kotlin
fun draw(polygon: Polygon) = when (polygon) {
   is Rectangle -> // ...
   is Triangle -> // …
   // else is not needed - all possible implementations are covered
}

```

Additionally, sealed interfaces enable more flexible restricted class hierarchies because a class can directly inherit
more than one sealed interface.

```kotlin
class FilledRectangle: Polygon, Fillable
```

[Learn more about sealed interfaces](sealed-classes.md).

<video href="d_Mor21W_60" title="Sealed Interfaces and Sealed Classes Improvements"/>

### Package-wide sealed class hierarchies

Sealed classes can now have subclasses in all files of the same compilation unit
and the same package. Previously, all subclasses had to appear in the same file.

Direct subclasses may be top-level or nested inside any number of other named classes, named interfaces, or named objects.

The subclasses of a sealed class must have a name that is properly qualified – they cannot be local or anonymous objects.

[Learn more about sealed class hierarchies](sealed-classes.md#location-of-direct-subclasses).

### Inline classes

Inline classes are a subset of [value-based](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md) classes
that only hold values. You can use them as wrappers for a value of a certain type without the additional overhead that
comes from using memory allocations.

Inline classes can be declared with the `value` modifier before the name of the class:

```kotlin
value class Password(val s: String)
```

The JVM backend also requires a special `@JvmInline` annotation:

```kotlin
@JvmInline
value class Password(val s: String)
```

The `inline` modifier is now deprecated with a warning.

[Learn more about inline classes](inline-classes.md).

<video href="LpqvtgibbsQ" title="From Inline to Value Classes"/>

## Kotlin/JVM

Kotlin/JVM has received a number of improvements, both internal and user-facing. Here are the most notable among them:

* [Stable JVM IR backend](#stable-jvm-ir-backend)
* [New default JVM target: 1.8](#new-default-jvm-target-1-8)
* [SAM adapters via invokedynamic](#sam-adapters-via-invokedynamic)
* [Lambdas via invokedynamic](#lambdas-via-invokedynamic)
* [Deprecation of @JvmDefault and old Xjvm-default modes](#deprecation-of-jvmdefault-and-old-xjvm-default-modes)
* [Improvements to handling nullability annotations](#improvements-to-handling-nullability-annotations)

### Stable JVM IR backend

The [IR-based backend](whatsnew14.md#new-jvm-ir-backend) for the Kotlin/JVM compiler is now [Stable](components-stability.md)
and enabled by default.

Starting from [Kotlin 1.4.0](whatsnew14.md), early versions of the IR-based backend were available for preview, and it has
now become the default for language version `1.5`. The old backend is still used by default for earlier language versions.

You can find more details about the benefits of the IR backend and its future development in [this blog post](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/).

If you need to use the old backend in Kotlin 1.5.0, you can add the following lines to the project’s configuration file:

* In Gradle:

 <tabs>

 ```groovy
 tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
  kotlinOptions.useOldBackend = true
 }
 ```

 ```kotlin
 tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
   kotlinOptions.useOldBackend = true
 }
 ```

 </tabs>

* In Maven:

 ```xml
 <configuration>
     <args>
         <arg>-Xuse-old-backend</arg>
     </args>
 </configuration>
 ```

### New default JVM target: 1.8

The default target version for Kotlin/JVM compilations is now `1.8`. The `1.6` target is deprecated.

If you need a build for JVM 1.6, you can still switch to this target. Learn how:

* [in Gradle](gradle.md#attributes-specific-for-jvm)
* [in Maven](maven.md#attributes-specific-for-jvm)
* [in the command-line compiler](compiler-reference.md#jvm-target-version)

### SAM adapters via invokedynamic

Kotlin 1.5.0 now uses dynamic invocations (`invokedynamic`) for compiling SAM (Single Abstract Method) conversions:
* Over any expression if the SAM type is a [Java interface](java-interop.md#sam-conversions)
* Over lambda if the SAM type is a [Kotlin functional interface](fun-interfaces.md#sam-conversions)

The new implementation uses [`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)
and auxiliary wrapper classes are no longer generated during compilation. This decreases the size of the application’s JAR,
which improves the JVM startup performance.

To roll back to the old implementation scheme based on anonymous class generation, add the compiler option `-Xsam-conversions=class`.

Learn how to add compiler options in [Gradle](gradle.md#compiler-options), [Maven](maven.md#specifying-compiler-options), and the [command-line compiler](compiler-reference.md#compiler-options).

### Lambdas via invokedynamic

> Compiling plain Kotlin lambdas into invokedynamic is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see details below), and you should use it only for evaluation purposes. We would appreciate hearing your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-45375).
>
{type="warning"}

Kotlin 1.5.0 is introducing experimental support for compiling plain Kotlin lambdas (which are not converted to an instance
of a functional interface) into dynamic invocations (`invokedynamic`). The implementation produces lighter binaries by using
[`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-),
which effectively generates the necessary classes at runtime. Currently, it has three limitations compared to ordinary
lambda compilation:

* A lambda compiled into invokedynamic is not serializable.
* Calling `toString()` on such a lambda produces a less readable string representation.
* Experimental [`reflect`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API does not support lambdas created with `LambdaMetafactory`.

To try this feature, add the `-Xlambdas=indy` compiler option. We’d be grateful if you could share your feedback on it using
this [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-45375).

Learn how to add compiler options in [Gradle](gradle.md#compiler-options), [Maven](maven.md#specifying-compiler-options), and [command-line compiler](compiler-reference.md#compiler-options).

### Deprecation of @JvmDefault and old Xjvm-default modes

Prior to Kotlin 1.4.0, there was the `@JvmDefault` annotation along with `-Xjvm-default=enable` and `-Xjvm-default=compatibility`
modes. They served to create the JVM default method for any particular non-abstract member in the Kotlin interface.

In Kotlin 1.4.0, we [introduced the new `Xjvm-default` modes](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/),
which switch on default method generation for the whole project.

In Kotlin 1.5.0, we are deprecating `@JvmDefault` and the old Xjvm-default modes: `-Xjvm-default=enable` and `-Xjvm-default=compatibility`.

[Learn more about default methods in the Java interop](java-to-kotlin-interop.md#default-methods-in-interfaces).

### Improvements to handling nullability annotations

Kotlin supports handling type nullability information from Java with [nullability annotations](java-interop.md#nullability-annotations).
Kotlin 1.5.0 introduces a number of improvements for the feature:

* It reads nullability annotations on type arguments in compiled Java libraries that are used as dependencies.
* It supports nullability annotations with the `TYPE_USE` target for:
  * Arrays
  * Varargs
  * Fields
  * Type parameters and their bounds
  * Type arguments of base classes and interfaces
* If a nullability annotation has multiple targets applicable to a type, and one of these targets is `TYPE_USE`, then `TYPE_USE` is preferred.
  For example, the method signature `@Nullable String[] f()` becomes `fun f(): Array<String?>!` if `@Nullable` supports both
  `TYPE_USE` and `METHOD`as targets.

For these newly supported cases, using the wrong type nullability when calling Java from Kotlin produces warnings.
Use the `-Xtype-enhancement-improvements-strict-mode` compiler option to enable strict mode for these cases (with error reporting).

[Learn more about null-safety and platform types](java-interop.md#null-safety-and-platform-types).

## Kotlin/Native

Kotlin/Native is now more performant and stable. The notable changes are:
* [Performance improvements](#performance-improvements)
* [Deactivation of the memory leak checker](#deactivation-of-the-memory-leak-checker)

### Performance improvements

In 1.5.0, Kotlin/Native is receiving a set of performance improvements that speed up both compilation and execution.

[Compiler caches](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native) are now supported in
debug mode for `linuxX64` (only on Linux hosts) and `iosArm64` targets. With compiler caches enabled, most debug compilations
complete much faster, except for the first one. Measurements showed about a 200% speed increase on our test projects.

To use compiler caches for new targets, opt in by adding the following lines to the project’s `gradle.properties`:
* For `linuxX64` : `kotlin.native.cacheKind.linuxX64=static`
* For `iosArm64`: `kotlin.native.cacheKind.iosArm64=static`

If you encounter any issues after enabling the compiler caches, please report them to our issue tracker [YouTrack](https://kotl.in/issue).

Other improvements speed up the execution of Kotlin/Native code:
* Trivial property accessors are inlined.
* `trimIndent()` on string literals is evaluated during the compilation.

### Deactivation of the memory leak checker

The built-in Kotlin/Native memory leak checker has been disabled by default.

It was initially designed for internal use, and it is able to find leaks only in a limited number of cases, not all of them.
Moreover, it later turned out to have issues that can cause application crashes. So we’ve decided to turn off the memory leak checker.

The memory leak checker can still be useful for certain cases, for example, unit testing. For these cases, you can enable
it by adding the following line of code:

```kotlin
Platform.isMemoryLeakCheckerActive = true
```

Note that enabling the checker for the application runtime is not recommended.

## Kotlin/JS

Kotlin/JS is receiving evolutionary changes in 1.5.0. We’re continuing our work on moving the [JS IR compiler backend](js-ir-compiler.md)
towards stable and shipping other updates:

* [Upgrade of webpack to version 5](#upgrade-to-webpack-5)
* [Frameworks and libraries for the IR compiler](#frameworks-and-libraries-for-the-ir-compiler)

### Upgrade to webpack 5

The Kotlin/JS Gradle plugin now uses webpack 5 for browser targets instead of webpack 4. This is a major webpack upgrade
that brings incompatible changes. If you’re using a custom webpack configuration, be sure to check the [webpack 5 release notes](https://webpack.js.org/blog/2020-10-10-webpack-5-release/).

[Learn more about bundling Kotlin/JS projects with webpack](js-project-setup.md#webpack-bundling).

### Frameworks and libraries for the IR compiler

> The Kotlin/JS IR compiler is in [Alpha](components-stability.md). It may change incompatibly and require manual migration
>in the future. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issues/KT).
>
{type="warning"}

Along with working on the IR-based backend for Kotlin/JS compiler, we encourage and help library authors to build their
projects in `both` mode. This means they are able to produce artifacts for both Kotlin/JS compilers, therefore growing
the ecosystem for the new compiler.

Many well-known frameworks and libraries are already available for the IR backend: [KVision](https://kvision.io/), [fritz2](https://www.fritz2.dev/),
[doodle](https://github.com/nacular/doodle), and others. If you’re using them in your project, you can already build it
with the IR backend and see the benefits it brings.

If you’re writing your own library, [compile it in the 'both' mode](js-ir-compiler.md#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)
so that your clients can also use it with the new compiler.


## Kotlin Multiplatform

In Kotlin 1.5.0, [choosing a testing dependency for each platform has been simplified](#simplified-test-dependencies-usage-in-multiplatform-projects)
and it is now done automatically by the Gradle plugin.

A new [API for getting a char category is now available in multiplatform projects](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code).

## Standard library

The standard library has received a range of changes and improvements, from stabilizing experimental parts to adding new features:

* [Stable unsigned integer types](#stable-unsigned-integer-types)
* [Stable locale-agnostic API for uppercase/lowercase text](#stable-locale-agnostic-api-for-upper-lowercasing-text)
* [Stable Char-to-integer conversion API](#stable-char-to-integer-conversion-api)
* [Stable Path API](#stable-path-api)
* [Floored division and the mod operator](#floored-division-and-the-mod-operator)
* [Duration API changes](#duration-api-changes)
* [New API for getting a char category now available in multiplatform code](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)
* [New collections function firstNotNullOf()](#new-collections-function-firstnotnullof)
* [Strict version of String?.toBoolean()](#strict-version-of-string-toboolean)

You can learn more about the standard library changes in [this blog post](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-rc-released).

<video href="MyTkiT2I6-8" title="New Standard Library Features"/>

### Stable unsigned integer types

The `UInt`, `ULong`, `UByte`, `UShort` unsigned integer types are now [Stable](components-stability.md). The same goes
for operations on these types, ranges, and progressions of them. Unsigned arrays and operations on them remain in Beta.

[Learn more about unsigned integer types](basic-types.md#unsigned-integers).

### Stable locale-agnostic API for upper/lowercasing text

This release brings a new locale-agnostic API for uppercase/lowercase text conversion. It provides an alternative to the
`toLowerCase()`, `toUpperCase()`, `capitalize()`, and `decapitalize()` API functions, which are locale-sensitive.
The new API helps you avoid errors due to different locale settings.

Kotlin 1.5.0 provides the following fully [Stable](components-stability.md) alternatives:

* For `String` functions:

  |**Earlier versions**|**1.5.0 alternative**|
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* For `Char` functions:

  |**Earlier versions**|**1.5.0 alternative**|
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> For Kotlin/JVM, there are also overloaded `uppercase()`, `lowercase()`, and `titlecase()` functions with an explicit
> `Locale` parameter.
>
{type="note"}

The old API functions are marked as deprecated and will be removed in a future release.

See the full list of changes to the text processing functions in [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-case-conversions.md).

### Stable char-to-integer conversion API

Starting from Kotlin 1.5.0, new char-to-code and char-to-digit conversion functions are [Stable](components-stability.md).
These functions replace the current API functions, which were often confused with the similar string-to-Int conversion.

The new API removes this naming confusion, making the code behavior more transparent and unambiguous.

This release introduces `Char` conversions that are divided into the following sets of clearly named functions:

* Functions to get the integer code of `Char` and to construct `Char` from the given code:

 ```kotlin
 fun Char(code: Int): Char
 fun Char(code: UShort): Char
 val Char.code: Int
 ```

* Functions to convert `Char` to the numeric value of the digit it represents:

 ```kotlin
 fun Char.digitToInt(radix: Int): Int
 fun Char.digitToIntOrNull(radix: Int): Int?
 ```

* An extension function for `Int` to convert the non-negative single digit it represents to the corresponding `Char` representation:

 ```kotlin
 fun Int.digitToChar(radix: Int): Char
 ```

The old conversion APIs, including `Number.toChar()` with its implementations (all except `Int.toChar()`) and `Char` extensions for conversion to a
numeric type, like `Char.toInt()`, are now deprecated.

[Learn more about the char-to-integer conversion API in KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md).

### Stable Path API

The [experimental Path API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/) with extensions
for `java.nio.file.Path` is now [Stable](components-stability.md).

```kotlin
// construct path with the div (/) operator
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory"

// list files in a directory
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

[Learn more about the Path API](whatsnew1420.md#extensions-for-java-nio-file-path).

### Floored division and the mod operator

New operations for modular arithmetics have been added to the standard library:
* `floorDiv()` returns the result of [floored division](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions). It is available for integer types.
* `mod()` returns the remainder of floored division (_modulus_). It is available for all numeric types.

These operations look quite similar to the existing [division of integers](basic-types.md#operations) and [rem()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/rem.html)
function (or the `%`operator), but they work differently on negative numbers:
* `a.floorDiv(b)` differs from a regular `/` in that `floorDiv` rounds the result down (towards the lesser integer),
  whereas `/` truncates the result to the integer closer to 0.
* `a.mod(b)` is the difference between `a` and `a.floorDiv(b) * b`. It’s either zero or has the same sign as `b`,
  while `a % b` can have a different one.

```kotlin
fun main() {
//sampleStart
    println("Floored division -5/3: ${(-5).floorDiv(3)}")
    println( "Modulus: ${(-5).mod(3)}")
    
    println("Truncated division -5/3: ${-5 / 3}")
    println( "Remainder: ${-5 % 3}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### Duration API changes

> The Duration API is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Use it only for evaluation purposes. We would appreciate hearing your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issues/KT).
>
{type="warning"}

There is an experimental [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) class for representing
duration amounts in different time units. In 1.5.0, the Duration API has received the following changes:

* Internal value representation now uses `Long` instead of `Double` to provide better precision.
* There is a new API for conversion to a particular time unit in `Long`. It comes to replace the old API, which operates
  with `Double` values and is now deprecated. For example, [`Duration.inWholeMinutes`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/in-whole-minutes.html) returns the value of the duration
  expressed as `Long` and replaces `Duration.inMinutes`.
* There are new companion functions for constructing a `Duration` from a number. For example, [`Duration.seconds(Int)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/seconds.html)
  creates a `Duration` object representing an integer number of seconds. Old extension properties like `Int.seconds` are now deprecated.

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val duration = Duration.milliseconds(120000)
    println("There are ${duration.inWholeSeconds} seconds in ${duration.inWholeMinutes} minutes")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### New API for getting a char category now available in multiplatform code

Kotlin 1.5.0 introduces the new API for getting a character’s category according to Unicode in multiplatform projects.
Several functions are now available in all the platforms and in the common code.

Functions for checking whether a char is a letter or a digit:
* [`Char.isDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-digit.html)
* [`Char.isLetter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter.html)
* [`Char.isLetterOrDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter-or-digit.html)

```kotlin
fun main() {
//sampleStart
    val chars = listOf('a', '1', '+')
    val (letterOrDigitList, notLetterOrDigitList) = chars.partition { it.isLetterOrDigit() }
    println(letterOrDigitList) // [a, 1]
    println(notLetterOrDigitList) // [+]
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

Functions for checking the case of a char:
* [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html)
* [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html)
* [`Char.isTitleCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-title-case.html)

```kotlin
fun main() {
//sampleStart
    val chars = listOf('ǅ', 'ǈ', 'ǋ', 'ǲ', '1', 'A', 'a', '+')
    val (titleCases, notTitleCases) = chars.partition { it.isTitleCase() }
    println(titleCases) // [ǅ, ǈ, ǋ, ǲ]
    println(notTitleCases) // [1, A, a, +]
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

Some other functions:
* [`Char.isDefined()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-defined.html)
* [`Char.isISOControl()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-i-s-o-control.html)

The property [`Char.category`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/category.html) and its return type
enum class [`CharCategory`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-char-category/), which indicates
a char's general category according to Unicode, are now also available in multiplatform projects.

[Learn more about characters](https://kotlinlang.org/docs/basic-types.html#characters).

### New collections function firstNotNullOf()

The new [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html) and [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)
functions combine [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html)
with [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) or [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html).
They map the original collection with the custom selector function and return the first non-null value. If there is no such value,
`firstNotNullOf()` throws an exception, and `firstNotNullOfOrNull()` returns null.

```kotlin
fun main() {
//sampleStart
    val data = listOf("Kotlin", "1.5")
    println(data.firstNotNullOf(String::toDoubleOrNull))
    println(data.firstNotNullOfOrNull(String::toIntOrNull))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### Strict version of String?.toBoolean()

Two new functions introduce case-sensitive strict versions of the existing [String?.toBoolean()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean.html):
* [`String.toBooleanStrict()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict.html) throws an exception for all inputs except the literals `true` and `false`.
* [`String.toBooleanStrictOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict-or-null.html) returns null for all inputs except the literals `true` and `false`.

```kotlin
fun main() {
//sampleStart
    println("true".toBooleanStrict())
    println("1".toBooleanStrictOrNull())
    // println("1".toBooleanStrict()) // Exception
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## kotlin-test library
The [kotlin-test](https://kotlinlang.org/api/latest/kotlin.test/) library introduces some new features:
* [Simplified test dependencies usage in multiplatform projects](#simplified-test-dependencies-usage-in-multiplatform-projects)
* [Automatic selection of a testing framework for Kotlin/JVM source sets](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* [Assertion function updates](#assertion-function-updates)

### Simplified test dependencies usage in multiplatform projects

Now you can use the `kotlin-test` dependency to add dependencies for testing in the `commonTest` source set, and the 
Gradle plugin will infer the corresponding platform dependencies for each test source set:
* `kotlin-test-junit` for JVM source sets, see [automatic choice of a testing framework for Kotlin/JVM source sets](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* `kotlin-test-js` for Kotlin/JS source sets
* `kotlin-test-common` and `kotlin-test-annotations-common` for common source sets
* No extra artifact for Kotlin/Native source sets

Additionally, you can use the `kotlin-test` dependency in any shared or platform-specific source set.

An existing kotlin-test setup with explicit dependencies will continue to work both in Gradle and in Maven.

Learn more about [setting dependencies on test libraries](gradle.md#set-dependencies-on-test-libraries).

### Automatic selection of a testing framework for Kotlin/JVM source sets

The Gradle plugin now chooses and adds a dependency on a testing framework automatically. All you need to do is add
the dependency `kotlin-test` in the common source set.

Gradle uses JUnit 4 by default. Therefore, the `kotlin("test")` dependency resolves to the variant for JUnit 4, 
namely `kotlin-test-junit`:

 <tabs>

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // This brings the dependency 
                                              // on JUnit 4 transitively
            }
        }
    }
}
```

```kotlin
kotlin {
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test")) // This brings the dependency
                                               // on JUnit 4 transitively
            }
        }
    }
}
```

 </tabs>

You can choose JUnit 5 or TestNG by calling [`useJUnitPlatform()`]( https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)
or [`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG) in the test task:

```groovy
tasks {
    test {
        // enable TestNG support
        useTestNG()
        // or
        // enable JUnit Platform (a.k.a. JUnit 5) support
        useJUnitPlatform()
    }
}
```

You can disable automatic testing framework selection by adding the line `kotlin.test.infer.jvm.variant=false`
to the project’s `gradle.properties`.

Learn more about [setting dependencies on test libraries](gradle.md#set-dependencies-on-test-libraries).

###  Assertion function updates

This release brings new assertion functions and improves the existing ones.

The `kotlin-test` library now has the following features:

* **Checking the type of a value**

  You can use the new `assertIs<T>` and `assertIsNot<T>` to check the type of a value:

  ```kotlin
  @Test
  fun testFunction() {
      val s: Any = "test"
      assertIs<String>(s)  // throws AssertionError mentioning the actual type of s if the assertion fails
      // can now print s.length because of contract in assertIs
      println("${s.length}")
  }
  ```

  Because of type erasure, this assert function only checks whether the `value` is of the `List` type in the following example and doesn't check whether it's a list of the particular `String` element type:  `assertIs<List<String>>(value)`.

* **Comparing the container content for arrays, sequences, and arbitrary iterables**

  There is a new set of overloaded `assertContentEquals()` functions for comparing content for different collections that don’t implement [structural equality](equality.md#structural-equality):

  ```kotlin
  @Test
  fun test() {
      val expectedArray = arrayOf(1, 2, 3)
      val actualArray = Array(3) { it + 1 }
      assertContentEquals(expectedArray, actualArray)
  }
  ```

* **New overloads to `assertEquals()` and `assertNotEquals()` for `Double` and `Float` numbers**

  There are new overloads for the `assertEquals()` function that make it possible to compare two `Double` or `Float` numbers with absolute precision. The precision value is specified as the third parameter of the function:

  ```kotlin
   @Test
  fun test() {
      val x = sin(PI)

      // precision parameter
      val tolerance = 0.000001

      assertEquals(0.0, x, tolerance)
  }
  ```

* **New functions for checking the content of collections and elements**

  You can now check whether the collection or element contains something with the `assertContains()` function.
  You can use it with Kotlin collections and elements that have the `contains()` operator, such as `IntRange`, `String`, and others:

  ```kotlin
  @Test
  fun test() {
      val sampleList = listOf<String>("sample", "sample2")
      val sampleString = "sample"
      assertContains(sampleList, sampleString)  // element in collection
      assertContains(sampleString, "amp")       // substring in string
  }
  ```

* **`assertTrue()`, `assertFalse()`, `expect()` functions are now inline**

  From now on, you can use these as inline functions, so it's possible to call [suspend functions](composing-suspending-functions.md) inside a lambda expression:

  ```kotlin
  @Test
  fun test() = runBlocking<Unit> {
      val deferred = async { "Kotlin is nice" }
      assertTrue("Kotlin substring should be present") {
          deferred.await() .contains("Kotlin")
      }
  }
  ```

## kotlinx libraries

Along with Kotlin 1.5.0, we are releasing new versions of the kotlinx libraries:
* `kotlinx.coroutines` [1.5.0-RC](#coroutines-1-5-0-rc)
* `kotlinx.serialization` [1.2.1](#serialization-1-2-1)
* `kotlinx-datetime` [0.2.0](#datetime-0-2-0)

### Coroutines 1.5.0-RC

`kotlinx.coroutines` [1.5.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC) is here with:
* [New channels API](channels.md)
* Stable [reactive integrations](async-programming.md#reactive-extensions)
* And more

Starting with Kotlin 1.5.0, [experimental coroutines](whatsnew14.md#exclusion-of-the-deprecated-experimental-coroutines)
are disabled and the `-Xcoroutines=experimental` flag is no longer supported.

Learn more in the [changelog](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC) and the
[`kotlinx.coroutines` 1.5.0 release blog post](https://blog.jetbrains.com/kotlin/2021/05/kotlin-coroutines-1-5-0-released/).

<video href="EVLnWOcR0is" title="kotlinx.coroutines 1.5.0"/>

### Serialization 1.2.1

`kotlinx.serialization` [1.2.1](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1) is here with:
* Improvements to JSON serialization performance
* Support for multiple names in JSON serialization
* Experimental .proto schema generation from `@Serializable` classes
* And more

Learn more in the [changelog](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1) and the
[`kotlinx.serialization` 1.2.1 release blog post](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-serialization-1-2-released/).

<video href="698I_AH8h6s" title="kotlinx.serialization 1.2.1"/>

### dateTime 0.2.0

`kotlinx-datetime` [0.2.0](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0) is here with:
* `@Serializable` Datetime objects
* Normalized API of `DateTimePeriod` and `DatePeriod`
* And more

Learn more in the [changelog](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0) and the
[`kotlinx-datetime` 0.2.0 release blog post](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-datetime-0-2-0-is-out/).

## Migrating to Kotlin 1.5.0

IntelliJ IDEA and Android Studio will suggest updating the Kotlin plugin to 1.5.0 once it is available.

To migrate existing projects to Kotlin 1.5.0, just change the Kotlin version to `1.5.0` and re-import your Gradle or Maven
project. [Learn how to update to Kotlin 1.5.0](releases.md#update-to-a-new-release).

To start a new project with Kotlin 1.5.0, update the Kotlin plugin and run the Project Wizard from **File** \| **New** \|
**Project**.

The new command-line compiler is available for downloading on the [GitHub release page](https://github.com/JetBrains/kotlin/releases/tag/v1.5.0).

Kotlin 1.5.0 is a [feature release](kotlin-evolution.md#feature-releases-and-incremental-releases) and therefore can
bring incompatible changes to the language. Find the detailed list of such changes in the [Compatibility Guide for Kotlin 1.5](compatibility-guide-15.md).
