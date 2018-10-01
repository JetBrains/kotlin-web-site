---
type: doc
layout: reference
title: "What's Coming in Kotlin 1.3"
---

# What's Coming in Kotlin 1.3

## Coroutines release

After long and extensive battle testing, coroutines API is now released! It means that since Kotlin 1.3 API will remain stable on par with other released features. Check the new [coroutines overview](coroutines-overview.html) page

Kotlin 1.3 introduces callable references on suspend-functions, as well as support of Coroutines in the Reflection API

## Kotlin/native

Kotlin 1.3 continues to improve and polish Native target. See [Kotlin/Native overview](native-overview.html) for details 

## Multiplatform Projects

In 1.3, we've completely reworked model of multiplatform projects in order to improve expressiveness and flexibility, and to make sharing common code easier. Also, Kotlin/Native is now supported as one of the targets! See all details [here](multiplatform.html)

## Contracts

Kotlin compiler does extensive static analysis to provide warnings and reduce boilerplate. One of the notable features is smartcasts — ability to perform cast automatically based on performed type checks:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun foo(x: String?) {
    if (x != null) s.length // Compiler automatically casts 's' to 'String'
}
```

</div>

However, as soon as those checks are extracted in a separate function, all smartcasts immediately disappear:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun String.isNotNull(): Boolean = this != null

fun foo(x: String?) {
    if (x.isNotNull()) s.length // No smartcast :(
}
```

</div>

To improve behavior in such cases, Kotlin 1.3 introduces experimental mechanism called *contracts*.

*Contracts* allow function to explicitly describe its behavior in a way which is understood by the compiler. Currently, two wide classes of cases are supported:

* Improving smartcasts analysis by declaring relation between function's call outcome and passed arguments values:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun require(condition: Boolean) {
    // This is a syntax form, which tells compiler:
    // "if this function returns successfully, then passed 'condition' is true"
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(x: String?) {
    require(x is String)
    // x is smartcasted to 'String' here, because otherwise 
    // 'require' would have throw an exception
}
```

</div>

* Improving variable initialization analysis in presence of high-order functions:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun synchronize(lock: Any?, block: () -> Unit) {
    // It tells compiler:
    // "This function will invoke 'block' here and now, and exactly one time"
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // Compiler knows that lambda passed to 'synchronize' is called
               // exactly once, so no reassignment is reported
    }
    println(x) // Compiler knows that lambda will be definitely called, performing
               // initialization, so 'x' is considered to be initialized here
}
```

</div>

### Contracts in stdlib

`stdlib` already makes use of contracts, which leads to improvements in analyses described above.  This part of contracts is **stable**, meaning that you can benefit from improved analysis right now without any additional opt-ins:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println(x.length) // Yay, smartcasted to not-null!
    }
}
```

</div>

### Custom Contracts

It is possible to declare contracts for your own functions, but this feature is **experimental,** as current syntax is in the state of early prototype and most probably will be changed. Also, please note, that currently Kotlin compiler does not verify contracts, so it's programmer's responsibility to write correct and sound contracts. 

Custom contracts are introduced by the call to `contract` stdlib function, which provides DSL scope:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

</div>

See the details on syntax as well as compatibility notice in the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md)

## Capturing `when` subject in a variable

In Kotlin 1.3 it is now possible to capture `when` subject into variable:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

</div>

While it was already possible to extract that variable just before `when` , `val` in `when` has its scope properly restricted to the body of `when`, thus preventing namespace pollution. See full documentation on `when` [here](control-flow.html#when-expression)

## @JvmStatic and @JvmField in companion of interfaces

Since Kotlin 1.3, it is possible to mark members of `companion` object of interfaces with annotations `@JvmStatic` and `@JvmField`. In the classfile, such members will be lifted to the corresponding interface and marked as `static`

For example, the following Kotlin code:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface Foo {
    companion object {
        @JvmField
        val answer: Int = 42

        @JvmStatic
        fun sayHello() {
            println("Hello, world!")
        }
    }
}
```

</div>

Is equivalent to this Java code:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```java
interface Foo {
    public static int answer = 42;
    public static void sayHello() {
        // ...
    }
}
```

</div>

## Nested declarations in annotation classes

In Kotlin 1.3 it is possible for annotations to have nested classes, interfaces, objects and companions:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
annotation class Foo {
    enum class Direction { UP, DOWN, LEFT, RIGHT }
    
    annotation class Bar

    companion object {
        fun foo(): Int = 42
        val bar: Int = 42
    }
}
```

</div>

## Parameterless `main`

By convention, entry point of Kotlin program is a function with signature like `main(args: Array<String>)`, where `args` represent command-line arguments passed to the program. However, not every application supports command-line arguments, so this parameter often ends up being unused. 

Kotlin 1.3 introduced simpler form of `main` which takes no parameters. Now “Hello, World” in Kotlin is 19 characters shorter!

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
fun main() {
    println("Hello, world!")
}
```

</div>

## Functions with big arity

In Kotlin, functional types are represented as generic classes taking different number of parameters: `Function0<R>`, `Function1<P0, R>`, `Function2<P0, P1, R>`, ... This approach has a problem in that this list is finite, and it currently ends with `Function22`. 

Kotlin 1.3 relaxes this limitation and adds support for functions with bigger arity:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 42 more */, Any) -> Any) {
    block(Any(), Any(), ..., Any())
}
```

</div>

## Progressive mode

Kotlin cares a lot about stability and backward compatibility of code: Kotlin compatibility policy says that "breaking changes" (e.g. change which makes code that used to compile fine to not compile anymore) can be introduced only in the major releases (1.2, 1.3, etc.)  

We believe that a lot of users could use much faster cycle, where critical compiler bug fixes arrive immediately, making code more safe and correct. Thus, Kotlin 1.3 introduces *progressive* compiler mode, which can be enabled by  passing argument `-progressive` to the compiler.

In progressive mode, some fixes in language semantics can arrive immedeately. All those fixes have two important properties:

* they preserve backward-compatibility of source code with older compilers, meaning that all code which is compilable by progressive compiler will be compiled fine by non-progressive one
* they only make code *safer* in some sense — e.g., some unsound smartcast can be forbidden, behavior of generated code may be changed to be more predictable/stable, and so on.

Enabling progressive mode can require you to rewrite some of your code, but it shouldn't be too much — all fixes which are enabled under progressive are carefully handpicked, reviewed and provided with tooling migration assistance. 
We expect that progressive mode should be a nice choice for actively maintained codebases which are updated to the latest language versions quickly.

## Inline classes

> Inline classes are available only since Kotlin 1.3 and currently are *experimental*. See details in the [reference](inline-classes.html#experimental-status-of-inline-classes)
{:.note}


Kotlin 1.3 introduces new declaration kind — `inline class`. Inline classes can be viewed as a restricted version of usual classes: in particular, inline classes must have exactly one property:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
inline class Name(val s: String)
```

</div>

Kotlin compiler will use that restriction to aggressively optimize runtime representation of inline classes and substitute their instances with the value of underlying property where possible, removing constructor calls, GC pressure and enabling other optimizations:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {
    // In the next line no constructor call happens, and
    // at the runtime 'name' contains just string "Kotlin"
    val name = Name("Kotlin")
    println(name.s) 
}
```

</div>

See [reference](inline-classes.html) for inline classes for details 

## Unsigned integers

> Unsigned integers are available only since Kotlin 1.3 and currently are *experimental*. See details in the [reference](basic-types.html#experimental-status-of-unsigned-integers)
{:.note}

Kotlin 1.3 introduces unsigned integer types:

* `kotlin.UByte`: an unsigned 8-bit integer, ranges from 0 to 255
* `kotlin.UShort`: an unsigned 16-bit integer, ranges from 0 to 65535
* `kotlin.UInt`: an unsigned 32-bit integer, ranges from 0 to 2^32 - 1
* `kotlin.ULong`: an unsigned 64-bit integer, ranges from 0 to 2^64 - 1

Most of the functionality of signed types supported for unsigned counterparts too:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// You can define unsigned types using literal suffixes
val uInt = 42u 
val uLong = 42uL

// You can convert signed types to unsigned and vice versa via stdlb extensions:
val sInt = uint.toInt()
val uLong2 = sInt.toULong()

// Unsigned types support similar operators:
val x = 20u + 22u 
val y = 1 shl 8 
val z = "42".toUInt()
val range = 1u .. 5u
```

</div>

See [reference](basic-types.html#unsigned-integers) for details.

## @JvmDefault

> `@JvmDefault` is available only since Kotlin 1.3 and currently is *experimental*. See details in the [reference page](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html)
{:.note}


Kotlin targets wide range of the Java versions, including Java 6 and Java 7, where default methods in interfaces are not allowed. For your convenience, Kotlin compiler workarounds that limitation, but this workaround isn't compatible with `default` methods, introduced in Java 8. 

This could be an issue for Java-interoperability, so Kotlin 1.3 introduces `@JvmDefault` annotation. Methods, annotated with this annotation will be generated as `default` methods for JVM:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface Foo {
    // Will be generated as 'default' method
    @JvmDefault
    fun foo(): Int = 42
}
```

</div>

> Warning! Annotating your API with `@JvmDefault` has serious implications on binary compatibility. Make sure to carefully read the [reference page](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html) before using `@JvmDefault` in production
{:.note}

# Standard library

## Multiplatform `Random`

Prior to Kotlin 1.3, there were no uniform way to generate random numbers on all platforms — one had to resort to platform specific solutions, like `java.util.Random` on JVM. This releases fixes this issue by introducing class `kotlin.random.Random`, which is available on all platforms:

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
import kotlin.random.Random

fun main() {
//sampleStart
    val number = Random.nextInt(42)  // number is in range [0, limit)
    println(number)
//sampleEnd
}
```

</div>

## isNullOrEmpty/orEmpty extensions

`isNullOrEmpty` and `orEmpty` extensions for some types already present in stdlib . The first one returns `true` if the receiver is `null` or empty, and the second one falls back to an empty instance if the receiver is `null`.
Kotlin 1.3 provides similar extensions on collections, maps and arrays of objects.

## Copying elements between two existing arrays

The `array.copyInto(targetArray, targetOffset, startIndex, endIndex)` functions for the existing array types, including the unsigned arrays, make it easier to implement array-based containers in pure Kotlin.

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val sourceArr = arrayOf("k", "o", "t", "l", "i", "n")
    val targetArr = sourceArr.copyInto(arrayOfNulls<String>(6), 3, startIndex = 3, endIndex = 6)
    println(targetArr.contentToString())
    
    sourceArr.copyInto(targetArr, startIndex = 0, endIndex = 3)
    println(targetArr.contentToString())
//sampleEnd
}
```

</div>

## associateWith

It is quite common situation when you have a list of keys and you want to build a map by associating each of these keys with some value. It was possible to do it before with the `associate { it to getValue(it) }` function, but now we’re introducing a more efficient and easy to explore alternative: `keys.associateWith { getValue(it) }`

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }
//sampleEnd
}
```

</div>

## ifEmpty and ifBlank functions

Collections, maps, object arrays, char sequences and sequences now have `ifEmpty` function, which allows to specify a fallback value that will be used instead of the receiver if it is empty:

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    fun printAllUppercase(data: List<String>) {
        val result = data
        .filter { it.all { c -> c.isUpperCase() } }
            .ifEmpty { listOf("<no uppercase>") }
        result.forEach { println(it) }
    }
    
    printAllUppercase(listOf("foo", "Bar"))
    printAllUppercase(listOf("FOO", "BAR"))
//sampleEnd
}
```

</div>

Char sequences and strings in addition have `ifBlank` extension that does the same thing as `ifEmpty`, but checks for the string being all whitespace instead of empty.

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val s = "    \n"
    println(s.ifBlank { "<blank>" })
    println(s.ifBlank { null })
//sampleEnd
}
```

</div>

## Sealed classes in reflection

We’ve added a new API to `kotlin-reflect` that can be used to enumerate all direct subtypes of a `sealed` class, namely `KClass.sealedSubclasses`.

## Smaller changes

* `Boolean` type now has companion
* Introduced `Any?.hashCode()` extension which returns 0 for `null`
* `Char` now provides `MIN_VALUE`/`MAX_VALUE` constants

# Tooling

## Code Style Support in IDE

Kotlin 1.3 introduces support for the [recommended code style](coding-conventions.html) in the IDE. Check [this page](code-style-migration-guide.html) for migration guidelines

## kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) is a library which provides multiplatform support for (de)serializing objects in Kotlin. Previously, it was a separate project, but since Kotlin 1.3, it ships with Kotlin compiler distribution on par with other compiler plugins. The main difference is that you don't need to manually watch for Serialization IDE Plugin to be compatible with Kotlin IDE Plugin version you're using: now Kotlin IDE Plugin already includes serialization!

See here for [details](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/eap13.md)

> Please, note, that even though kotlinx.serialization now ships with Kotlin Compiler distribution, it is still considered to be an experimental feature. 
{:.note}

## Scripting update

> Please, note, that scripting is experimental feature, meaning that no compatibility guarantees on API are given.
{:.note}

Kotlin 1.3 continues to evolve and improve scripting API, introducing an experimental support for scripts customization, such as adding external properties, providing static or dynamic dependencies, and so on. 

For additional details, please consult the [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md). 

## Scratches support

Kotlin 1.3 introduces support for runnable Kotlin *scratch files*. *Scratch file* is a kotlin script file with .kts extension which you can run and get evaluation results directly in the editor. 

Consult the general [Scratches documentation](https://www.jetbrains.com/help/idea/scratches.html) for details

