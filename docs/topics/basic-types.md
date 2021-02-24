[//]: # (title: Basic types)

In Kotlin, everything is an object in the sense that we can call member functions and properties on any variable.
Some types can have a special internal representation - for example, numbers, characters and booleans can be
represented as primitive values at runtime - but to the user they look like ordinary classes. 
In this section we describe the basic types used in Kotlin: [numbers](#numbers), [booleans](#booleans), 
[characters](#characters), [strings](#strings), and [arrays](#arrays).

## Numbers

### Integer types

Kotlin provides a set of built-in types that represent numbers.  
For integer numbers, there are four types with different sizes and, hence, value ranges.

| Type	 |Size (bits)| Min value| Max value|
|--------|-----------|----------|--------- |
| Byte	 | 8         |-128      |127       |
| Short	 | 16        |-32768    |32767     |
| Int	 | 32        |-2,147,483,648 (-2<sup>31</sup>)| 2,147,483,647 (2<sup>31</sup> - 1)|
| Long	 | 64        |-9,223,372,036,854,775,808 (-2<sup>63</sup>)|9,223,372,036,854,775,807 (2<sup>63</sup> - 1)|

All variables initialized with integer values not exceeding the maximum value of `Int`
have the inferred type `Int`. If the initial value exceeds this value, then the type is `Long`.
To specify the `Long` value explicitly, append the suffix `L` to the value.

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

### Floating-point types

For real numbers, Kotlin provides floating-point types `Float` and `Double`.
According to the [IEEE 754 standard](https://en.wikipedia.org/wiki/IEEE_754),
floating point types differ by their _decimal place_, that is, how many decimal digits they can store.
`Float` reflects the IEEE 754 _single precision_, while `Double` provides _double precision_.   
 
| Type	 |Size (bits)|Significant bits|Exponent bits|Decimal digits|
|--------|-----------|--------------- |-------------|--------------|
| Float	 | 32        |24              |8            |6-7            |
| Double | 64        |53              |11           |15-16          |    
  
You can initialize `Double` and `Float` variables  with numbers having a fractional part.
It's separated from the integer part by a period (`.`) 
For variables initialized with fractional numbers, the compiler infers the `Double` type.

```kotlin
val pi = 3.14 // Double
// val one: Double = 1 // Error: type mismatch
val oneDouble = 1.0 // Double
```

To explicitly specify the `Float` type for a value, add the suffix `f` or `F`.
If such a value contains more than 6-7 decimal digits, it will be rounded. 

```kotlin
val e = 2.7182818284 // Double
val eFloat = 2.7182818284f // Float, actual value is 2.7182817
```

Note that unlike some other languages, there are no implicit widening conversions for numbers in Kotlin.
For example, a function with a `Double` parameter can be called only on `Double` values, but not `Float`, 
`Int`, or other numeric values.  

```kotlin
fun main() {
    fun printDouble(d: Double) { print(d) }

    val i = 1    
    val d = 1.0
    val f = 1.0f 

    printDouble(d)
//    printDouble(i) // Error: Type mismatch
//    printDouble(f) // Error: Type mismatch
}
```

To convert numeric values to different types, use [Explicit conversions](#explicit-conversions).

### Literal constants

There are the following kinds of literal constants for integral values:

* Decimals: `123`
  * Longs are tagged by a capital `L`: `123L`
* Hexadecimals: `0x0F`
* Binaries: `0b00001011`

>Octal literals are not supported.
>
{type="note"}

Kotlin also supports a conventional notation for floating-point numbers:
 
* Doubles by default: `123.5`, `123.5e10`
* Floats are tagged by `f` or `F`: `123.5f`
 
You can use underscores to make number constants more readable:

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
```

### Numbers representation on the JVM

On the JVM platform, numbers are stored as primitive types: `int`, `double`, and so on. 
Exceptions are cases when you create a nullable number reference such as `Int?` or use generics.
In these cases numbers are boxed in Java classes `Integer`, `Double`, and so on.

Note that nullable references to the same number can be different objects:

```kotlin
fun main() {
//sampleStart
    val a: Int = 100
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a
    
    val b: Int = 10000
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b
    
    println(boxedA === anotherBoxedA) // true
    println(boxedB === anotherBoxedB) // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

On the other hand, they are still equal:

```kotlin
fun main() {
//sampleStart
    val a: Int = 10000
    println(a == a) // Prints 'true'
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a
    println(boxedA == anotherBoxedA) // Prints 'true'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Explicit conversions

Due to different representations, smaller types *are not subtypes* of bigger ones.
If they were, we would have troubles of the following sort:

```kotlin
// Hypothetical code, does not actually compile:
val a: Int? = 1 // A boxed Int (java.lang.Integer)
val b: Long? = a // implicit conversion yields a boxed Long (java.lang.Long)
print(b == a) // Surprise! This prints "false" as Long's equals() checks whether the other is Long as well
```

So equality would have been lost silently, not to mention identity.

As a consequence, smaller types _are NOT implicitly converted_ to bigger types.
This means that assigning a value of type `Byte` to an `Int` variable requires an explicit conversion.

```kotlin
fun main() {
//sampleStart
    val b: Byte = 1 // OK, literals are checked statically
    // val i: Int = b // ERROR
    val i1: Int = b.toInt()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

All number types support conversions to other types:

* `toByte(): Byte`
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`
* `toChar(): Char`

In many cases, there is no need in explicit conversions because the type is inferred from the context,
and arithmetical operations are overloaded for appropriate conversions, for example:

```kotlin
val l = 1L + 3 // Long + Int => Long
```

### Operations

Kotlin supports the standard set of arithmetical operations over numbers: `+`, `-`, `*`, `/`, `%`. They are declared 
as members of appropriate classes. 

```kotlin
fun main() {
//sampleStart
    println(1 + 2)
    println(2_500_000_000L - 1L)
    println(3.14 * 2.71)
    println(10.0 / 3)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also override these operators for custom classes. See [Operator overloading](operator-overloading.md) for details.

#### Division of integers

Division between integers numbers always returns an integer number. Any fractional part is discarded.

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2
    //println(x == 2.5) // ERROR: Operator '==' cannot be applied to 'Int' and 'Double'
    println(x == 2)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

This is true for a division between any two integer types.

```kotlin
fun main() {
//sampleStart
    val x = 5L / 2
    println(x == 2L)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To return a floating-point type, explicitly convert one of the arguments to a floating-point type.

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2.toDouble()
    println(x == 2.5)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### Bitwise operations 

Kotlin provides a set of _bitwise operations_ on integer numbers. They operate on the binary level directly with 
bits of the numbers' representation.
Bitwise operations are represented by functions that can be called in infix form. They can be applied only to `Int` and `Long`.

```kotlin
val x = (1 shl 2) and 0x000FF000
```

Here is the complete list of bitwise operations:

* `shl(bits)` – signed shift left
* `shr(bits)` – signed shift right
* `ushr(bits)` – unsigned shift right
* `and(bits)` – bitwise __and__
* `or(bits)` – bitwise __or__
* `xor(bits)` – bitwise __xor__
* `inv()` – bitwise inversion

### Floating-point numbers comparison

The operations on floating-point numbers discussed in this section are:

* Equality checks: `a == b` and `a != b`
* Comparison operators: `a < b`, `a > b`, `a <= b`, `a >= b`
* Range instantiation and range checks: `a..b`, `x in a..b`, `x !in a..b`

When the operands `a` and `b` are statically known to be `Float` or `Double` or their nullable counterparts (the type is 
declared or inferred or is a result of a [smart cast](typecasts.md#smart-casts)), the operations on the 
numbers and the range that they form follow the [IEEE 754 Standard for Floating-Point Arithmetic]((https://en.wikipedia.org/wiki/IEEE_754)). 

However, to support generic use cases and provide total ordering, when the operands are **not** statically typed as 
floating point numbers (e.g. `Any`, `Comparable<...>`, a type parameter), the operations use the 
`equals` and `compareTo` implementations for `Float` and `Double`, which disagree with the standard, so that:

* `NaN` is considered equal to itself
* `NaN` is considered greater than any other element including `POSITIVE_INFINITY`
* `-0.0` is considered less than `0.0`

### Unsigned integers

>Unsigned types are available only since Kotlin 1.3 and currently in [Beta](components-stability.md). See details [below](#beta-status-of-unsigned-integers)
>
{type="note"}

In addition to [integer types](#integer-types), Kotlin provides the following types for unsigned integer numbers:

* `UByte`: an unsigned 8-bit integer, ranges from 0 to 255
* `UShort`: an unsigned 16-bit integer, ranges from 0 to 65535
* `UInt`: an unsigned 32-bit integer, ranges from 0 to 2^32 - 1
* `ULong`: an unsigned 64-bit integer, ranges from 0 to 2^64 - 1

Unsigned types support most of the operations of their signed counterparts.

>Changing type from unsigned type to signed counterpart (and vice versa) is a *binary incompatible* change.
>
{type="note"}

Unsigned types are implemented using feature that's not yet stable, namely [inline classes](inline-classes.md).

#### Unsigned arrays and ranges 

Same as for primitives, each of unsigned type has corresponding type that represents arrays of that type:

* `UByteArray`: an array of unsigned bytes
* `UShortArray`: an array of unsigned shorts
* `UIntArray`: an array of unsigned ints
* `ULongArray`: an array of unsigned longs

Same as for signed integer arrays, they provide similar API to `Array` class without boxing overhead. 

Also, [ranges and progressions](ranges.md) are supported for `UInt` and `ULong` by classes `UIntRange`,
`UIntProgression`, `ULongRange`, and `ULongProgression`. 

#### Literals

To make unsigned integers easier to use, Kotlin provides an ability to tag an integer literal with a suffix
indicating a specific unsigned type (similarly to `Float` or `Long`):

* `u` and `U` tag unsigned literals. The exact type is determined based on the expected type.
If no expected type is provided, compiler will use `UInt` or `ULong` depending on the size of literal.

```kotlin
val b: UByte = 1u  // UByte, expected type provided
val s: UShort = 1u // UShort, expected type provided
val l: ULong = 1u  // ULong, expected type provided

val a1 = 42u // UInt: no expected type provided, constant fits in UInt
val a2 = 0xFFFF_FFFF_FFFFu // ULong: no expected type provided, constant doesn't fit in UInt
```

* `uL` and `UL` explicitly tag literal as unsigned long.

```kotlin
val a = 1UL // ULong, even though no expected type provided and constant fits into UInt
```

#### Beta status of unsigned integers

The design of unsigned types is in [Beta](components-stability.md), meaning that its compatibility is best-effort only and not guaranteed.

When using unsigned arithmetics, a warning will be reported, indicating that this feature has not been released to stable.
To remove the warning, you have to opt in for usage of unsigned types:

* To propagate the opt-in requirement, annotate declarations that use unsigned integers with  `@ExperimentalUnsignedTypes`.
* To opt-in without propagating, either annotate declarations with `@OptIn(ExperimentalUnsignedTypes::class)`
or pass `-Xopt-in=kotlin.ExperimentalUnsignedTypes` to the compiler.

It's up to you to decide if your clients have to explicitly opt-in into usage of your API, but keep in mind that
unsigned types are not a stable feature, so API which uses them can be suddenly broken by changes in the language. 

See the [opt-in requirements](opt-in-requirements.md) for details on using APIs that require opt-in.

#### Further discussion

See [language proposal for unsigned types](https://github.com/Kotlin/KEEP/blob/master/proposals/unsigned-types.md)
for technical details and further discussion.

## Booleans

The type `Boolean` represents boolean objects that can have two values: `true` and `false`.

`Boolean` has a nullable counterpart `Boolean?` that also has the `null` value.

Built-in operations on booleans include:

* `||` – disjunction (logical _OR_)
* `&&` – conjunction (logical _AND_)
* `!` - negation (logical _NOT_)

`||` and `&&` work lazily.

```kotlin
fun main() {
//sampleStart
    val myTrue: Boolean = true
    val myFalse: Boolean = false
    val boolNull: Boolean? = null
    
    println(myTrue || myFalse)
    println(myTrue && myFalse)
    println(!myTrue)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

>**On JVM**: nullable references to boolean objects are boxed similarly to [numbers](#numbers-representation-on-the-jvm).
>
{type="note"}

## Characters

Characters are represented by the type `Char`. Character literals go in single quotes: `'1'`.

Special characters start from an escaping backslash `\`. 
The following escape sequences are supported: `\t`, `\b`, `\n`, `\r`, `\'`, `\"`, `\\` and `\$`.

To encode any other character, use the Unicode escape sequence syntax: `'\uFF00'`.

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'
 
    println(aChar)
    println('\n') //prints an extra newline character
    println('\uFF00')
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If a value of character variable is a digit, you can explicitly convert it to an `Int` number:

```kotlin
fun decimalDigitValue(c: Char): Int {
    if (c !in '0'..'9')
        throw IllegalArgumentException("Out of range")
    return c.toInt() - '0'.toInt() // Explicit conversions to numbers
}
```

>**On JVM**: Like [numbers](#numbers-representation-on-the-jvm), characters are boxed when a nullable reference is needed.
>Identity is not preserved by the boxing operation.
>
{type="note"}

## Strings

Strings in Kotlin are represented by the type `String`. Generally, a string value is a sequence of characters in double quotes (`"`).
 
```kotlin
val str = "abcd 123"
```

Elements of a string are characters that you can access via the indexing operation: `s[i]`.
You can iterate over these characters with a `for` loop:

```kotlin
fun main() {
val str = "abcd"
//sampleStart
for (c in str) {
    println(c)
}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Strings are immutable. Once you initialize a string, you can't change its value or assign a new value to it.
All operations that transform strings return their results in a new `String` object, leaving the original string unchanged.

```kotlin
fun main() {
//sampleStart
    val str = "abcd"
    println(str.toUpperCase()) // Create and print a new String object
    println(str) // the original string remains the same
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To concatenate strings, use the `+` operator. This also works for concatenating strings with values of other types, as long
as the first element in the expression is a string:

```kotlin
fun main() {
//sampleStart
val s = "abc" + 1
println(s + "def")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Note that in most cases using [string templates](#string-templates) or raw strings is preferable to string concatenation.

### String literals

Kotlin has two types of string literals:

* _escaped_ strings that may contain escaped characters
* _raw_ strings that can contain newlines and arbitrary text

Here's an example of an escaped string:

```kotlin
val s = "Hello, world!\n"
```

Escaping is done in the conventional way, with a backslash (`\`). See [Characters](#characters) above for the list of supported escape sequences.

A raw string is delimited by a triple quote (`"""`), contains no escaping and can contain newlines and any other characters:

```kotlin
val text = """
    for (c in "foo")
        print(c)
"""
```

To remove leading whitespace from raw strings, use the [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) function:

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

By default, `|` is used as margin prefix, but you can choose another character and pass it as a parameter, like `trimMargin(">")`.

### String templates

String literals may contain _template_ expressions - pieces of code that are evaluated and whose results are concatenated into the string.
A template expression starts with a dollar sign (`$`) and consists of either a name:

```kotlin
fun main() {
//sampleStart
    val i = 10
    println("i = $i") // prints "i = 10"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

or an expression in curly braces:

```kotlin
fun main() {
//sampleStart
    val s = "abc"
    println("$s.length is ${s.length}") // prints "abc.length is 3"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can use templates both in raw and escaped strings.
To insert the `$` character in a raw string (which doesn't support backslash escaping), use the following syntax:

```kotlin
val price = """
${'$'}9.99
"""
```

## Arrays

Arrays in Kotlin are represented by the `Array` class. It has `get` and `set` functions that turn into `[]` by operator overloading conventions,
 and the `size` property, along with other useful member functions:

```kotlin
class Array<T> private constructor() {
    val size: Int
    operator fun get(index: Int): T
    operator fun set(index: Int, value: T): Unit

    operator fun iterator(): Iterator<T>
    // ...
}
```

To create an array, use the function `arrayOf()` and pass the item values to it, so that `arrayOf(1, 2, 3)` creates an array `[1, 2, 3]`.
Alternatively, the `arrayOfNulls()` function can be used to create an array of a given size filled with `null` elements.

Another option is to use the `Array` constructor that takes the array size and the function that returns values
of array elements given its index:

```kotlin
fun main() {
//sampleStart
    // Creates an Array<String> with values ["0", "1", "4", "9", "16"]
    val asc = Array(5) { i -> (i * i).toString() }
    asc.forEach { println(it) }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

As we said above, the `[]` operation stands for calls to member functions `get()` and `set()`.

Arrays in Kotlin are _invariant_. This means that Kotlin does not let us assign an `Array<String>`
to an `Array<Any>`, which prevents a possible runtime failure (but you can use `Array<out Any>`, 
see [Type Projections](generics.md#type-projections)).

### Primitive type arrays

Kotlin also has classes that represent arrays of primitive types without boxing overhead: `ByteArray`,
`ShortArray`, `IntArray`, and so on. These classes have no inheritance relation to the `Array` class, but they
have the same set of methods and properties. Each of them also has a corresponding factory function:

```kotlin
val x: IntArray = intArrayOf(1, 2, 3)
x[0] = x[1] + x[2]
```

```kotlin
// Array of int of size 5 with values [0, 0, 0, 0, 0]
val arr = IntArray(5)

// e.g. initialise the values in the array with a constant
// Array of int of size 5 with values [42, 42, 42, 42, 42]
val arr = IntArray(5) { 42 }

// e.g. initialise the values in the array using a lambda
// Array of int of size 5 with values [0, 1, 2, 3, 4] (values initialised to their index value)
var arr = IntArray(5) { it * 1 } 
```
