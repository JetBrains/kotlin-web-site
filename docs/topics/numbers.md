[//]: # (title: Numbers)

## Integer types

Kotlin provides a set of built-in types that represent numbers.  
For integer numbers, there are four types with different sizes and value ranges:

| Type	    | Size (bits) | Min value                                    | Max value                                      |
|----------|-------------|----------------------------------------------|------------------------------------------------|
| `Byte`	  | 8           | -128                                         | 127                                            |
| `Short`	 | 16          | -32768                                       | 32767                                          |
| `Int`	   | 32          | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`	  | 64          | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

> In addition to signed integer types, Kotlin also provides unsigned integer types.
> As unsigned integers are aimed at a different set of use cases, they are covered separately.
> See [](unsigned-integer-types.md).
> 
{style="tip"}

When you initialize a variable with no explicit type specification, the compiler automatically infers the type with the 
smallest range enough to represent the value starting from `Int`. If it doesn't exceed the range of `Int`, the type is `Int`.
If it does exceed that range, the type is `Long`. To specify the `Long` value explicitly, append the suffix `L` to the value.
To use the `Byte` or `Short` type, specify it explicitly in the declaration. 
Explicit type specification triggers the compiler to check that the value doesn't exceed the range of the specified type.

```kotlin
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

## Floating-point types

For real numbers, Kotlin provides floating-point types `Float` and `Double` that adhere to the [IEEE 754 standard](https://en.wikipedia.org/wiki/IEEE_754).
`Float` reflects the IEEE 754 _single precision_, while `Double` reflects _double precision_.

These types differ in their size and provide storage for floating-point numbers with different precision:

| Type	    | Size (bits) | Significant bits | Exponent bits | Decimal digits |
|----------|-------------|------------------|---------------|----------------|
| `Float`	 | 32          | 24               | 8             | 6-7            |
| `Double` | 64          | 53               | 11            | 15-16          |    

You can initialize `Double` and `Float` variables only with numbers that have a fractional part.
Separate the fractional part from the integer part by a period (`.`)

For variables initialized with fractional numbers, the compiler infers the `Double` type:

```kotlin
val pi = 3.14          // Double

val one: Double = 1    // Int is inferred
// Initializer type mismatch

val oneDouble = 1.0    // Double
```
{validate="false"}

To explicitly specify the `Float` type for a value, add the suffix `f` or `F`.
If a value provided in this way contains more than 7 decimal digits, it is rounded:

```kotlin
val e = 2.7182818284          // Double
val eFloat = 2.7182818284f    // Float, actual value is 2.7182817
```

Unlike in some other languages, there are no implicit widening conversions for numbers in Kotlin.
For example, a function with a `Double` parameter can be called only on `Double` values, but not `Float`,
`Int`, or other numeric values:

```kotlin
fun main() {
//sampleStart
    fun printDouble(x: Double) { print(x) }

    val x = 1.0
    val xInt = 1    
    val xFloat = 1.0f 

    printDouble(x)
    
    printDouble(xInt)   
    // Argument type mismatch
    
    printDouble(xFloat)
    // Argument type mismatch
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

To convert numeric values to different types, use [explicit conversions](#explicit-number-conversions).

## Literal constants for numbers

There are several kinds of literal constants for integral values:

* Decimals: `123`
* Longs, ending with the capital `L`: `123L`
* Hexadecimals: `0x0F`
* Binaries: `0b00001011`

> Octal literals are not supported in Kotlin.
>
{style="note"}

Kotlin also supports conventional notation for floating-point numbers:

* Doubles (default when the fractional part does not end with a letter): `123.5`, `123.5e10`
* Floats, ending with the letter `f` or `F`: `123.5f`

You can use underscores to make number constants more readable:

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

> There are also special tags for unsigned integer literals.  
> Read more about [literals for unsigned integer types](unsigned-integer-types.md).
> 
{style="tip"}

## Boxing and caching numbers on the Java Virtual Machine

The way the JVM stores numbers can make your code behave counterintuitively because of the cache used by default
for small (byte-sized) numbers.

The JVM stores numbers as primitive types: `int`, `double`, and so on.
When you use [generic types](generics.md) or create a nullable number reference such as `Int?`, numbers are boxed in Java classes
such as `Integer` or `Double`.

The JVM applies [memory optimization](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7)
to `Integer` and other objects that represent numbers between `−128` and `127`.
All nullable references to such objects refer to the same cached object.
For example, nullable objects in the following code are [referentially equal](equality.md#referential-equality):

```kotlin
fun main() {
//sampleStart
    val a: Int = 100
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a
    
    println(boxedA === anotherBoxedA) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For numbers outside this range, the nullable objects are different but [structurally equal](equality.md#structural-equality):

```kotlin
fun main() {
//sampleStart
    val b: Int = 10000
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b
    
    println(boxedB === anotherBoxedB) // false
    println(boxedB == anotherBoxedB) // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For this reason, Kotlin warns about using referential equality with boxable numbers and literals
with the following message: `"Identity equality for arguments of types ... and ... is prohibited."`
When comparing `Int`, `Short`, `Long`, and `Byte` types (as well as `Char` and `Boolean`), use 
structural equality checks to get consistent results.

## Explicit number conversions

Due to different representations, number types _are not subtypes_ of each other.
As a consequence, smaller types are _not_ implicitly converted to bigger types and vice versa.
For example, assigning a value of type `Byte` to an `Int` variable requires an explicit conversion:

```kotlin
fun main() {
//sampleStart
    val byte: Byte = 1
    // OK, literals are checked statically
    
    val intAssignedByte: Int = byte 
    // Initializer type mismatch
    
    val intConvertedByte: Int = byte.toInt()
    
    println(intConvertedByte)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

All number types support conversions to other types:

* `toByte(): Byte` (deprecated for [Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) and [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html))
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`

In many cases, there is no need for explicit conversion because the type is inferred from the context,
and arithmetical operators are overloaded to handle conversions automatically. For example:

```kotlin
fun main() {
//sampleStart
    val l = 1L + 3       // Long + Int => Long
    println(l is Long)   // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### Reasoning against implicit conversions

Kotlin doesn't support implicit conversions because they can lead to unexpected behavior.

If numbers of different types were converted implicitly, we could sometimes lose equality and identity silently.
For example, imagine if `Int` was a subtype of `Long`:

```kotlin
// Hypothetical code, does not actually compile:
val a: Int? = 1    // A boxed Int (java.lang.Integer)
val b: Long? = a   // Implicit conversion yields a boxed Long (java.lang.Long)
print(b == a)      // Prints "false" as Long.equals() checks not only the value but whether the other number is Long as well
```

## Operations on numbers

Kotlin supports the standard set of arithmetical operations over numbers: `+`, `-`, `*`, `/`, `%`. They are declared
as members of appropriate classes:

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

You can override these operators in custom number classes.
See [Operator overloading](operator-overloading.md) for details.

### Division of integers

Division between integer numbers always returns an integer number. Any fractional part is discarded.

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2
    println(x == 2.5) 
    // Operator '==' cannot be applied to 'Int' and 'Double'
    
    println(x == 2)   
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

This is true for a division between any two integer types:

```kotlin
fun main() {
//sampleStart
    val x = 5L / 2
    println(x == 2L)
    // But not `x == 2`, as Long (x) cannot be compared to Int (2)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To return a division result with the fractional part, explicitly convert one of the arguments to a floating-point type:

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2.toDouble()
    println(x == 2.5)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Bitwise operations

Kotlin provides a set of _bitwise operations_ on integer numbers. They operate on the binary level directly with
bits of the numbers' representation.
Bitwise operations are represented by functions that can be called in infix form. They can be applied only to `Int` and `Long`:

```kotlin
fun main() {
//sampleStart
    val x = 1
    val xShiftedLeft = (x shl 2)
    println(xShiftedLeft)  
    // 4
    
    val xAnd = x and 0x000FF000
    println(xAnd)          
    // 0
//sampleEnd
}
```

The complete list of bitwise operations:

* `shl(bits)` – signed shift left
* `shr(bits)` – signed shift right
* `ushr(bits)` – unsigned shift right
* `and(bits)` – bitwise **AND**
* `or(bits)` – bitwise **OR**
* `xor(bits)` – bitwise **XOR**
* `inv()` – bitwise inversion

### Floating-point numbers comparison

The operations on floating-point numbers discussed in this section are:

* Equality checks: `a == b` and `a != b`
* Comparison operators: `a < b`, `a > b`, `a <= b`, `a >= b`
* Range instantiation and range checks: `a..b`, `x in a..b`, `x !in a..b`

When the operands `a` and `b` are statically known to be `Float` or `Double` or their nullable counterparts (the type is
declared or inferred or is a result of a [smart cast](typecasts.md#smart-casts)), the operations on the
numbers and the range that they form follow the [IEEE 754 Standard for Floating-Point Arithmetic](https://en.wikipedia.org/wiki/IEEE_754).

However, to support generic use cases and provide total ordering, the behavior is different for operands that are **not**
statically typed as floating-point numbers. For example, `Any`, `Comparable<...>`, or `Collection<T>` types. In this case, the 
operations use the `equals` and `compareTo` implementations for `Float` and `Double`. As a result:

* `NaN` is considered equal to itself
* `NaN` is considered greater than any other element including `POSITIVE_INFINITY`
* `-0.0` is considered less than `0.0`

Here is an example that shows the difference in behavior between operands statically typed as floating-point numbers 
(`Double.NaN`) and operands **not** statically typed as floating-point numbers (`listOf(T)`).

```kotlin
fun main() {
    //sampleStart
    // Operand statically typed as floating-point number
    println(Double.NaN == Double.NaN)                 // false
    
    // Operand NOT statically typed as floating-point number
    // So NaN is equal to itself
    println(listOf(Double.NaN) == listOf(Double.NaN)) // true

    // Operand statically typed as floating-point number
    println(0.0 == -0.0)                              // true
    
    // Operand NOT statically typed as floating-point number
    // So -0.0 is less than 0.0
    println(listOf(0.0) == listOf(-0.0))              // false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // [-0.0, 0.0, Infinity, NaN]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}