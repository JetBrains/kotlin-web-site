---
type: doc
layout: reference
category: "Syntax"
title: "Basic Types"
---

# Basic Types

In Kotlin, everything is an object in the sense that one can call member functions and properties on any variable. Some types are built-in, because their implementation is optimized, but for the used they look like ordinary classes. In this section we describe most of these types: numbers, characters, booleans and arrays.

## Numbers

Kotlin handles numbers in a way close to Java, but not exactly the same. For example, there are no implicit widening conversions for numbers, and literals are slightly different in some cases.

Kotlin provides the following built-in types representing numbers (this is close to Java):

| Type	 | Bitwidth |
|--------|----------|
| Double | 64       |
| Float	 | 32       |
| Long	 | 64       |
| Int	   | 32       |
| Short	 | 16       |
| Byte	 | 8        |

Note that characters are not numbers in Kotlin.

### Literal Constants

There are the following kinds of literal constants for integral values:

* Decimals: `123`
  * Longs are tagged by a capital `L`: `123L`
* Hexadecimals: `0x0F`
* Binaries: `0b00001011`

NOTE: Octal literals are not supported.

Kotlin also supports a conventional notation for floating-point numbers:
 
* Doubles by default: `123.5`, `123.5e10`
* Floats are tagged by `f` or `F`: `123.5f` 

### Representation

On the Java platform, numbers are physically stored as JVM primitive types, unless we need a nullable number reference (e.g. `Int?`) or generics are involved. 
In the latter cases numbers are boxed.

Note that boxing of numbers does not preserve identity:

``` kotlin
val a: Int = 10000
print(a identityEquals a) // Prints 'true'
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA identityEquals anotherBoxedA) // !!!Prints 'false'!!!
```

On the other hand, it preserves equality:

``` kotlin
val a: Int = 10000
print(a == a) // Prints 'true'
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA == anotherBoxedA) // Prints 'true'
```

### Explicit Conversions

Due to different representations, smaller types are not subtypes of bigger ones.
If they were, we would have troubles of the following sort

``` kotlin
// Hypothetical code, does not actually compile:
val a: Int? = 1 // A boxed Int (java.lang.Integer)
val b: Long? = a // implicit conversion yields a boxed Long (java.lang.Long)
print(a == b) // Surprise! This prints "false" as Long's equals() check for other part to be Long as well
```

So not only identity, but even equality would have been lost silently all over the place.

As a consequence, smaller types are NOT implicitly converted to bigger types. This means that one cannot assign a value of type Byte to an Integer variable without an explicit conversion

``` kotlin
val b: Byte = 1 // OK, literals are checked statically
val i: Int = b // ERROR
```

We can use explicit conversions to widen numbers

``` kotlin
val i: Int = b.toInt() // OK: explicitly widened
```

Every number type supports the following conversions:

* `toByte()` : Byte
* `toShort()` : Short
* `toInt()` : Int
* `toLong()` : Long
* `toFloat()` : Float
* `toDouble()` : Double
* `toChar()` : Char

Absence of implicit conversions is rarely noticeable because one can use literals almost freely cause the type is inferred from the context, and arithmetical operations are overloaded for appropriate conversions, for example

``` kotlin
val l = 1.toLong() + 3 // Long + Int => Long
```

### Operations

Kotlin supports the standard set of arithmetical operations over numbers, which are declared as members of appropriate classes (but the compiler optimizes the calls down to the corresponding instructions). See Operator overloading.

As of bitwise operations, there're no special characters for them, but just named functions that can be called in infix form, for example:

``` kotlin
val x = (1 shl 2) and 0x000FF000
```

Here is the complete list of bitwise operations (available for Int and Long only):

* `shl(bits)` – signed shift left (Java's \<\<)
* `shr(bits)` – signed shift right (Java's \>\>)
* `ushr(bits)` – unsigned shift right (Java's \>\>\>)
* `and(bits)` – bitwise and
* `or(bits)` – bitwise or
* `xor(bits)` – bitwise xor
* `inv()` – bitwise inversion

## Characters

Characters are represented by the type Char. They are can not be treated directly as numbers

``` kotlin
fun check(c: Char) {
  if (c == 1) { // ERROR: incompatible types
    // ...
  }
}
```

Character literals go in single quotes: '1', '\n', '\uFF00'.
One can explicitly convert a character to an Int number

``` kotlin
fun decimalDigitValue(c: Char) : Int {
  if (c !in '0'..'9')
    throw IllegalArgumentException("Out of range")
  return c.toInt() - '0'.toInt() // Explicit conversions to numbers
}
```

Like numbers, characters are boxed when a nullable reference is needed. Identity is not preserved by the boxing operation.

## Booleans

The type Boolean represents booleans, and has two values: true and false.

Booleans are boxed if a nullable reference is needed.

Built-in operations on booleans include

* `||` – lazy disjunction
* `&&` – lazy conjunction

## Arrays

Arrays in Kotlin are represented by the Array class, that has get and set functions (that turn into [] by operator overloading conventions), and size, along with a few other useful member functions:

``` kotlin
class Array<T>(val size: Int, init: (Int) -> T) {
  fun get(index: Int) : T
  fun set(index: Int, value: T) : Unit

  fun iterator() : Iterator<T>

  val indices: IntRange
}
```

To create an array one can call its constructor providing the array size and a function that knows how to initialize elements of the array

``` kotlin
val asc = Array<Int>(5, {i -> i * i}) // Creates an array [0, 1, 4, 9, 16]
```

Or, alternatively, one can use a library function array() and pass the item values to it, so that array(1, 2, 3) creates an array [1, 2, 3].

As we said above, the [] operation stands for calls to member functions get() and set(). When compiling to JVM byte codes, the compiler optimizes
access to arrays so that there's no overhead introduced, and all operations work exactly like in Java

``` kotlin
val array = array(1, 2, 3, 4)
array[x] = array[x] * 2 // no actual calls to get() and set() generated
for (x in array) // no iterator created
  print(x)
```

Even when we navigate with an index, it does not introduce any overhead

``` kotlin
for (i in array.indices) // no iterator created
  array[i] += 2
```

Finally, in-checks have no overhead either

``` kotlin
if (i in array.indices) { // same as (i >= 0 && i < array.size)
  print(array[i])
}
```

Note: arrays are invariant. For the best performance on the JVM use specialized array classes.

## Strings

Strings are represented by the type String. Strings are immutable. Elements of a string are characters can be accessed by the indexing operation: s[i]. A string can be iterated over with a for loop:

``` kotlin
for (c in str) {
  println(c)
}
```

### String Literals

Kotlin has two types of string literals: escaped strings that may have escaped characters in them and raw strings that can contain newlines and arbitrary text. An escaped string is very much like a Java string:

``` kotlin
val s = "Hello, world!\n"
```

Escaping is done in the conventional way, with a backslash.

A raw string is delimited by a triple quote ("""), contains no escaping and can contain newlines and any other characters:

``` kotlin
val text = """
  for (c in "foo")
    print(c)
"""
```


### Templates

Strings may contain template expressions, i.e. pieces of code that are evaluated and whose results are concatenated into the string. A template expression starts with a dollar sign ($) and consists of either a simple name:

``` kotlin
val i = 10
val s = "i = $i" // evaluates to "i = 10"
```

or an arbitrary expression in curly braces:

``` kotlin
val s = "abc"
val str = "$s.length is ${s.length}" // evaluates to "abc.length is 3"
```

