[//]: # (title: Numbers)
[//]: # (description: Learn how to use numbers in Kotlin, including numeric types, literals, conversions, arithmetic operations, overflow, and JVM-specific behavior.)


The Kotlin number types represent:
* Integer values ([Byte](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-byte/),
  [Short](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-short/),
  [Int](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-int/),
  and [Long](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-long/))
* Floating-point values ([Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/)
  and [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/))

Use numbers to store and process numeric data, for example, in arithmetic, counters, measurements,
and other calculations.

## Choose a number type

In most cases, you can refer to the following rules to determine the
correct number type:

* Use `Int` for whole numbers.
* Use `Long` for whole numbers outside the `Int` range.
* Use `Double` for decimal numbers.
* Use `Float` when lower precision is acceptable or required.
* Use `Byte` and `Short` when an API or data format requires them.

> Kotlin also provides [](unsigned-integer-types.md).
>
{style="tip"}

## Integer types

Kotlin provides four integer types with different sizes and value ranges:

| Type	    | Size (bits) | Min value                                    | Max value                                      |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`	  | 8           | -128                                         | 127                                            |
| `Short`	 | 16          | -32768                                       | 32767                                          |
| `Int`	   | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`	  | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |


**Declare integer values**

Kotlin supports the following literal forms for integer values:

* Decimals: `123`
* `Long`, with the capital `L` suffix: `123L`
* Hexadecimals: `0x0F`
* Binaries: `0b00001011`

> Kotlin does not support octal literals.
>
{style="note"}

To declare `Int` and `Long` values, you can specify the type explicitly or let Kotlin infer it.
You can also use underscores to make numeric literals easier to read:

```kotlin
// Int
val one: Int = 1
val hexBytes = 0xFF_EC_DE_5E // Hexadecimal form
val bytes = 0b11010010_01101001_10010100_10010010 // Binary form

// Long
val oneBillion: Long = 1000000000 
val threeBillion = 3_000_000_000
```

To declare a `Long` value explicitly, you can also append the `L` suffix to the value:

```kotlin
val oneLong = 1L
```

To declare a `Byte` or `Short` value, specify the type explicitly:

```kotlin 
val oneByte: Byte = 1
val oneShort: Short = 1
```

> When you declare a numeric type explicitly, the compiler checks that the value
> fits in the range of that type.
>
> When you do not specify a numeric type, Kotlin infers `Int` if the 
> value fits in the `Int` range. Otherwise, Kotlin infers `Long`. 
>
{style="note"}

If a value can be absent, use nullable types:

```kotlin
val maybeAbsent: Int? = null
```

## Floating-point types

For numbers with a fractional part, Kotlin provides `Float` and `Double`.

Floating-point types follow
the [IEEE 754 standard](https://en.wikipedia.org/wiki/IEEE_754).
`Float` reflects the _single precision_. `Double` reflects the _double precision_.

Floating-point types differ in size and precision:

| Type	    | Size (bits) | Significant bits | Exponent bits | Decimal digits |
|----------|-------------|------------------|---------------|----------------|
| `Float`	 | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |    


**Declare floating-point values**

To declare a floating-point literal, include a decimal point or use an exponent notation. 

By default, Kotlin infers floating-point literals as `Double`:

```kotlin
val pi = 3.14          
val oneDouble = 1.0    
```

To declare a `Float`, add the `f` or `F` suffix:

```kotlin
val eFloat = 2.7182818284f    
// Actual value is 2.7182817
```

> Kotlin rounds a `Float` literal that contains more precision than `Float` can store.
>
{style="note"}

If a value can be absent, use nullable types:

```kotlin
val maybeAbsent: Double? = null
```

## Arithmetic operations

Kotlin supports the standard arithmetic operations on numbers: `+`, `-`, `*`, `/`, and `%`.

Use these operators to perform common calculations:

```kotlin
fun main() {
//sampleStart
    println(1 + 2) // 3
    println(2_500_000_000L - 1L) // 2499999999
    println(3.14 * 2.71) // 8.5094
    println(10.0 / 3) // 3.3333333333333335
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The result type depends on the types of the operands. Learn more in [](#mixed-numeric-expressions).

> You can override these operators in custom number classes.
> For more information, see [Operator overloading](operator-overloading.md).
>
{style="tip"}

### Integer division

Division between integer values always returns an integer result. The compiler discards the fractional part:

```kotlin
fun main() {
//sampleStart
    val intValue = 5 / 2
    println(intValue) // 2
    
    val longValue = 5L / 2
    println(longValue) // 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To return a floating-point result, make at least one operand a `Float` or `Double`:

```kotlin
fun main() {
//sampleStart
    val a = 5 / 2.0
    println(a) // 2.5
    
    val b = 5 / 2.toDouble()
    println(b) // 2.5
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Data overflow

Each integer type can store only values within its defined range. When the result of an
arithmetic operation exceeds that range, _data overflow_ occurs:

```kotlin
fun main(){
//sampleStart
    val intNumber: Int = 2147483647
    // Max Int value is 2147483647
    println(intNumber + 1) // -2147483648
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Here, the result wraps around because the value no longer fits in `Int`.

> The compiler does not automatically produce an error when integer overflow occurs.
>
{style="note"}

However, since floating-point types follow the
[IEEE 754 Standard](https://en.wikipedia.org/wiki/IEEE_754), very large results can become `Infinity`:

```kotlin
fun main() {
//sampleStart
    println(Double.MAX_VALUE * 2) // Infinity
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Type conversion

Numeric types are not subtypes of one another. Kotlin requires explicit
conversions to avoid silent data loss and unexpected behavior.

For example, a function that expects `Double` cannot accept an `Int` or a `Float` value without conversion:

```kotlin
fun main() {
//sampleStart
    fun printDouble(x: Double) { 
        print(x) 
    }

    val x = 1.0
    val xInt = 1    
    val xFloat = 1.0f

    printDouble(x) // OK
    printDouble(xInt) // Error: argument type mismatch
    printDouble(xFloat) // Error: argument type mismatch
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

All number types support conversions to other numeric types.
To convert a number to another type, use an explicit conversion function:

* `toByte()` (deprecated for [Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) and [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html))
* `toShort()` (deprecated for [Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-short.html) and [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-short.html))
* `toInt()`
* `toLong()`
* `toFloat()`
* `toDouble()`

For example, the following code converts an `Int` value to `Double`:

```kotlin
fun main() {
//sampleStart
    val intValue: Int = 1
    val doubleValue= intValue.toDouble()
    
    println(doubleValue) // 1.0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

When you convert a floating-point value to an integer type, the compiler discards the fractional part:

```kotlin
fun main() {
//sampleStart
    val d: Double = 1.5
    val l: Long = d.toLong()
    
    println(l) // 1
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Mixed numeric expressions

Kotlin does not support implicit conversion for assignments or function arguments. 
However, you can combine different numeric types in arithmetic expressions. In such cases, 
Kotlin infers a result type based on the operand types, 
and arithmetic operators handle the conversion automatically:

```kotlin
val intNumber: Int = 1
val longNumber: Long = 1000
val result = intNumber + longNumber // 1001, Long
```

If you try to assign the result to a smaller type, the compiler reports an error:

```kotlin
val intNumber: Int = 1
val longNumber: Long = 1000
val result: Int = intNumber + longNumber 
// Error: Initializer type mismatch
```

> This behavior applies to expressions only. It does not replace explicit conversions
> when a specific target type is required.
>
{style="note"}


## Bitwise operations

Kotlin provides _bitwise operations_ for `Int` and `Long`. These operations are represented by functions that can
be called in [infix form](functions.md#infix-notation):

```kotlin
fun main() {
//sampleStart
    val x = 1
    
    println(x shl 2) // 4 
    println(x and 0x000FF000) // 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Bitwise operations include:

* `shl(bits)` – signed shift left
* `shr(bits)` – signed shift right
* `ushr(bits)` – unsigned shift right
* `and(bits)` – bitwise **AND**
* `or(bits)` – bitwise **OR**
* `xor(bits)` – bitwise **XOR**
* `inv()` – bitwise inversion

## Floating-point number comparison

In Kotlin, floating-point comparison depends on the static type of the operands.

When the operands are statically known to be `Float` or `Double` (including their nullable counterparts),
operations on the numbers and the range that they form
follow the [IEEE 754 Standard for Floating-Point Arithmetic](https://en.wikipedia.org/wiki/IEEE_754).

However, in generic use cases (such as `Any`, `Comparable<...>`, or `Collection<T>`), behavior differs for
operands that are not statically typed as floating-point numbers. In these cases, Kotlin
uses the `equals()` and `compareTo()` implementations for `Float` and `Double`. 

As a result:

* `NaN` is considered equal to itself
* `NaN` is considered greater than any other element including `POSITIVE_INFINITY`
* `-0.0` is considered less than `0.0`

The following example shows the difference between operands statically typed as floating-point numbers
and operands used through generic types:

```kotlin
fun main() {
    //sampleStart
    // Operand statically typed as floating-point number
    println(Double.NaN == Double.NaN) // false
    
    // Operand NOT statically typed as floating-point number
    println(listOf(Double.NaN) == listOf(Double.NaN)) // true

    // Operand statically typed as floating-point number
    println(0.0 == -0.0) // true
    
    // Operand NOT statically typed as floating-point number
    println(listOf(0.0) == listOf(-0.0)) // false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // [-0.0, 0.0, Infinity, NaN]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}

## Boxing and caching numbers on the Java Virtual Machine

On the JVM, non-nullable numeric values are usually stored using primitive types, such as `int`, `long`, or `double`.
However, when you use [generic types](generics.md) or nullable numeric types like `Int?`, the value is boxed and
represented as an object.

The JVM applies a [memory optimization technique](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)
to small numbers by caching their boxed representations. As a result,
boxed numbers with the same value can be [referentially equal](equality.md#referential-equality).

For example, the JVM caches boxed `Integer` values in the range `-128` to `127`. Therefore, the following
code returns `true`:

```kotlin
fun main() {
//sampleStart
    val score: Int = 100
    val savedScore: Int? = score
    val displayedScore: Int? = score
    
    println(savedScore === displayedScore) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For values outside the cached range, boxed values are separate objects. In that case,
they are not referentially equal, even if their values are [structurally equal](equality.md#structural-equality).
For this reason, use `==` to compare numeric values:

```kotlin
fun main() {
//sampleStart
    val score: Int = 10000
    val savedScore: Int? = score
    val displayedScore: Int? = score

    println(savedScore === displayedScore) // false
    println(savedScore == displayedScore)  // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}