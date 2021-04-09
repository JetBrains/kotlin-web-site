[//]: # (title: What's new in Kotlin 1.4.30)

Kotlin 1.4.30 offers preview versions of new language features, promotes the new IR backend of the Kotlin/JVM compiler to
Beta, and ships various performance and functional improvements.

You can also learn about new features in [this blog post](http://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/).

## Language features

Kotlin 1.5.0 is going to deliver new language features – JVM records support, sealed interfaces, and Stable inline classes.
In Kotlin 1.4.30, you can try these features and improvements in preview mode. We’d be very grateful if you share your
feedback with us in the corresponding YouTrack tickets, as that will allow us to address it before the release of 1.5.0.

* [JVM records support](#jvm-records-support)
* [Sealed interfaces](#sealed-interfaces) and [sealed class improvements](#package-wide-sealed-class-hierarchies)
* [Improved inline classes](#improved-inline-classes)

To enable these language features and improvements in preview mode, you need to opt in by adding specific compiler options.
See the sections below for details.

Learn more about the new features preview in [this blog post](https://blog.jetbrains.com/kotlin/2021/01/new-language-features-preview-in-kotlin-1-4-30).

### JVM records support

> The JVM records feature is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see the details below), and you should use it only for evaluation purposes.  We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430).
>
{type="warning"}

The [JDK 16 release](https://openjdk.java.net/projects/jdk/16/) includes plans to stabilize a new Java class type called
[record](https://openjdk.java.net/jeps/395). To provide all the benefits of Kotlin and maintain its interoperability
with Java, Kotlin is introducing experimental record class support.

You can use record classes that are declared in Java just like classes with properties in Kotlin. No additional steps are
required.

Starting with 1.4.30, you can declare the record class in Kotlin using the `@JvmRecord` annotation for a [data class](data-classes.md):

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

To try the preview version of JVM records, add the compiler options `-Xjvm-enable-preview` and `-language-version 1.5`.

We’re continuing to work on JVM records support and we’d be very grateful if you would share your feedback with us using
this [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-42430).

Learn more about implementation, restrictions, and the syntax in [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md).

### Sealed interfaces

> Sealed interfaces are [Experimental](components-stability.md). They may be dropped or changed at any time.
> Opt-in is required (see the details below), and you should use them only for evaluation purposes.  We would appreciate your feedback on them in [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433).
>
{type="warning"}

In Kotlin 1.4.30, we’re shipping the prototype of _sealed interfaces_. They complement sealed classes and make it possible
to build more flexible restricted class hierarchies.

They can serve as “internal” interfaces that cannot be implemented outside the same module. You can rely on that fact,
for example, to write exhaustive `when` expressions.

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when() is exhaustive: no other polygon implementations can appear
// after the module is compiled
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle -> // ...
    is Triangle -> // ...
}

```

Another use-case: with sealed interfaces, you can inherit a class from two or more sealed superclasses.

```kotlin
sealed interface Fillable {
   fun fill()
}
sealed interface Polygon {
   val vertices: List<Point>
}

class Rectangle(override val vertices: List<Point>): Fillable, Polygon {
   override fun fill() { /*...*/ }
}
```

To try the preview version of sealed interfaces, add the compiler option `-language-version 1.5`. Once you switch to this
version, you’ll be able to use the `sealed` modifier on interfaces. We’d be very grateful if you would share your feedback
with us using this [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-42433).

[Learn more about sealed interfaces](sealed-classes.md).

### Package-wide sealed class hierarchies

> Package-wide hierarchies of sealed classes are [Experimental](components-stability.md). They may be dropped or changed at any time.
> Opt-in is required (see the details below), and you should use them only for evaluation purposes.  We would appreciate your feedback on them in [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433).
>
{type="warning"}

Sealed classes can now form more flexible hierarchies. They can have subclasses in all files of the same compilation unit
and the same package. Previously, all subclasses had to appear in the same file.

Direct subclasses may be top-level or nested inside any number of other named classes, named interfaces, or named objects.
The subclasses of a sealed class must have a name that is properly qualified – they cannot be local nor anonymous objects.

To try package-wide hierarchies of sealed classes, add the compiler option `-language-version 1.5`. We’d be very grateful
if you would share your feedback with us using this [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-42433).

[Learn more about package-wide hierarchies of sealed classes](sealed-classes.md#location-of-direct-subclasses).

### Improved inline classes

> Inline value classes are in [Beta](components-stability.md). They are almost stable, but migration steps may be required
> in the future. We'll do our best to minimize any changes you have to make. We would appreciate your feedback on the inline classes feature in [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434).
>
{type="warning"}

Kotlin 1.4.30 promotes [inline classes](inline-classes.md) to [Beta](components-stability.md) and brings the following
features and improvements to them:

* Since inline classes are [value-based](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html),
  you can define them using the `value` modifier. The `inline` and `value` modifiers are now equivalent to each other.
  In future Kotlin versions, we’re planning to deprecate the `inline` modifier.

  From now on, Kotlin requires the `@JvmInline` annotation before a class declaration for the JVM backend:
  
  ```kotlin
  inline class Name(private val s: String)
  
  value class Name(private val s: String)
  
  // For JVM backends
  @JvmInline
  value class Name(private val s: String)
  ```

* Inline classes can have `init` blocks. You can add code to be executed right after the class is instantiated:
  
  ```kotlin
  @JvmInline
  value class Negative(val x: Int) {
    init {
        require(x < 0) { }
    }
  }
  ```

* Calling functions with inline classes from Java code: before Kotlin 1.4.30, you couldn't call functions that accept
  inline classes from Java because of mangling.
  From now on, you can disable mangling manually. To call such functions from Java code, you should add the `@JvmName`
  annotation before the function declaration:

  ```kotlin
  inline class UInt(val x: Int)
  
  fun compute(x: Int) { }
  
  @JvmName("computeUInt")
  fun compute(x: UInt) { }
  ```

* In this release, we’ve changed the mangling scheme for functions to fix the incorrect behavior. These changes led to ABI
  changes.

  Starting with 1.4.30, the Kotlin compiler uses a new mangling scheme by default. Use the `-Xuse-14-inline-classes-mangling-scheme`
  compiler flag to force the compiler to use the old 1.4.0 mangling scheme and preserve binary compatibility.

Kotlin 1.4.30 promotes inline classes to Beta and we are planning to make them Stable in future releases. We’d be very
grateful if you would share your feedback with us using this [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-42434).

To try the preview version of inline classes, add the compiler option `-Xinline-classes` or `-language-version 1.5`.

Learn more about the mangling algorithm in [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md).

[Learn more about inline classes](inline-classes.md).

## Kotlin/JVM

### JVM IR compiler backend reaches Beta

The [IR-based compiler backend](whatsnew14.md#unified-backends-and-extensibility) for Kotlin/JVM, which was presented in
1.4.0 in [Alpha](components-stability.md), has reached Beta. This is the last pre-stable level before the IR backend
becomes the default for the Kotlin/JVM compiler.

We’re now dropping the restriction on consuming binaries produced by the IR compiler. Previously, you could use code
compiled by the new JVM IR backend only if you had enabled the new backend. Starting from 1.4.30, there is no such limitation,
so you can use the new backend to build components for third-party use, such as libraries. Try the Beta version of the
new backend and share your feedback in our [issue tracker](https://kotl.in/issue).

To enable the new JVM IR backend, add the following lines to the project’s configuration file:
* In Gradle:

  <tabs>
  
  ```groovy
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
    kotlinOptions.useIR = true
  }
  ```
  
  ```kotlin
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile::class) {
    kotlinOptions.useIR = true
  }
  ```
  
  </tabs>

* In Maven:

  ```xml
  <configuration>
      <args>
          <arg>-Xuse-ir</arg>
      </args>
  </configuration>
  ```

Learn more about the changes that the JVM IR backend brings in [this blog post](https://blog.jetbrains.com/kotlin/2021/01/the-jvm-backend-is-in-beta-let-s-make-it-stable-together).

## Kotlin/Native

### Performance improvements

Kotlin/Native has received a variety of performance improvements in 1.4.30, which has resulted in faster compilation times.
For example, the time required to rebuild the framework in the [KMM Networking and Data Storage sample](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final)
has decreased from 9.5 seconds (in 1.4.10) to 4.5 seconds (in 1.4.30).

### Apple watchOS 64-bit simulator target

The x86 simulator target has been deprecated for watchOS since version 7.0. To keep up with the latest watchOS versions,
Kotlin/Native has the new target `watchosX64` for running the simulator on 64-bit architecture.

### Support for Xcode 12.2 libraries

We have added support for the new libraries delivered with Xcode 12.2. You can now use them from Kotlin code.

## Kotlin/JS

### Lazy initialization of top-level properties

> Lazy initialization of top-level properties is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see the details below), and you should use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-44320).
>
{type="warning"}

The [IR backend](js-ir-compiler.md) for Kotlin/JS is receiving a prototype implementation of lazy initialization for
top-level properties. This reduces the need to initialize all top-level properties when the application starts, and it
should significantly improve application start-up times.

We’ll keep working on the lazy initialization, and we ask you to try the current prototype and share your thoughts and
results in this [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-44320) or the [`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69)
channel in the official [Kotlin Slack](https://kotlinlang.slack.com) (get an invite [here](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).

To use the lazy initialization, add the `-Xir-property-lazy-initialization` compiler option when compiling the code with
the JS IR compiler.

## Gradle project improvements

### Support the Gradle configuration cache

Starting with 1.4.30, the Kotlin Gradle plugin supports the [configuration cache](https://docs.gradle.org/current/userguide/configuration_cache.html)
feature. It speeds up the build process: once you run the command, Gradle executes the configuration phase and calculates
the task graph. Gradle caches the result and reuses it for subsequent builds.

To start using this feature, you can [use the Gradle command](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)
or [set up the IntelliJ based IDE]( https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij).

## Standard library

### Locale-agnostic API for upper/lowercasing text

> The locale-agnostic API feature is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Use it only for evaluation purposes.
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-42437).
>
{type="warning"}

This release introduces the experimental locale-agnostic API for changing the case of strings and characters.
The current `toLowerCase()`, `toUpperCase()`, `capitalize()`, `decapitalize()` API functions are locale-sensitive.
This means that different platform locale settings can affect code behavior. For example, in the Turkish locale, when
the string “kotlin” is converted using `toUpperCase`, the result is "KOTLİN", not "KOTLIN".

```kotlin
// current API
println("Needs to be capitalized".toUpperCase()) // NEEDS TO BE CAPITALIZED

// new API
println("Needs to be capitalized".uppercase()) // NEEDS TO BE CAPITALIZED
```

Kotlin 1.4.30 provides the following alternatives:

* For `String` functions:

  |**Earlier versions**|**1.4.30 alternative**| 
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* For `Char` functions:

  |**Earlier versions**|**1.4.30 alternative**| 
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> For Kotlin/JVM, there are also overloaded `uppercase()`, `lowercase()`, and `titlecase()` functions with an explicit
> `Locale` parameter.
>
{type="note"}

See the full list of changes to the text processing functions in [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions.md).

### Clear Char-to-code and Char-to-digit conversions

> The unambiguous API for the `Char` conversion feature is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Use it only for evaluation purposes.
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-44333).
>
{type="warning"}

The current `Char` to numbers conversion functions, which return UTF-16 codes expressed in different numeric types, are
often confused with the similar String-to-Int conversion, which returns the numeric value of a string:

```kotlin
"4".toInt() // returns 4
'4'.toInt() // returns 52
// and there was no common function that would return the numeric value 4 for Char '4'
```

To avoid this confusion we've decided to separate `Char` conversions into two following sets of clearly named functions:

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
* An extension function for `Int` to convert the non-negative single digit it represents to the corresponding `Char`
  representation:

  ```kotlin
  fun Int.digitToChar(radix: Int): Char
  ```

See more details in [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md).

## Serialization updates

Along with Kotlin 1.4.30, we are releasing `kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC), which includes some new features:

* Inline classes serialization support
* Unsigned primitive type serialization support

### Inline classes serialization support

Starting with Kotlin 1.4.30, you can make inline classes [serializable](serialization.md):

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

> The feature requires the new 1.4.30 IR compiler.
>
{type="note"}

The serialization framework does not box serializable inline classes when they are used in other serializable classes.

Learn more in the `kotlinx.serialization` [docs](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#serializable-inline-classes).

### Unsigned primitive type serialization support

Starting from 1.4.30, you can use standard JSON serializers of [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)
for unsigned primitive types: `UInt`, `ULong`, `UByte`, and `UShort`:

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

Learn more in the `kotlinx.serialization` [docs](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#unsigned-types-support-json-only).
