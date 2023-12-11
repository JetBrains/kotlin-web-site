[//]: # (title: Arrays)

An array is a data structure that holds a fixed number of values of the same type or its subtypes. 
The most common type of array in Kotlin is the object-type array, represented by the [`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) class.

> If you use primitives in an object-type array, this has a performance impact because your primitives are [boxed](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)
> into objects. To avoid boxing overhead, use [primitive-type arrays](#primitive-type-arrays) instead.
>
{type="note"}

## When to use arrays

Use arrays in Kotlin when you have specialized low-level requirements that you need to meet. For example, if you have 
performance requirements beyond what is needed for regular applications, or you need to build custom data structures. If
you don't have these sorts of restrictions, use [collections](collections-overview.md) instead.

Collections have the following benefits compared to arrays:
* Collections can be read-only, which gives you more control and allows you to write robust code that has a clear intent.
* It is easy to add or remove elements from collections. In comparison, arrays are fixed in size. The only way to 
add or remove elements from an array is to create a new array each time, which is very inefficient:

  ```kotlin
  fun main() {
  //sampleStart
      var riversArray = arrayOf("Nile", "Amazon", "Yangtze")

      // Using the += assignment operation creates a new riversArray,
      // copies over the original elements and adds "Mississippi"
      riversArray += "Mississippi"
      println(riversArray.joinToString())
      // Nile, Amazon, Yangtze, Mississippi
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-rivers-array-kotlin"}

* You can use the equality operator (`==`) to check if collections are structurally equal. You can't use this operator
for arrays. Instead, you have to use a special function, which you can read more about in [Compare arrays](#compare-arrays).

For more information about collections, see [Collections overview](collections-overview.md).

## Create arrays

To create arrays in Kotlin, you can use:
* functions, such as [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html), [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 
or [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html).
* the `Array` constructor.

This example uses the [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) function 
and passes item values to it:

```kotlin
fun main() {
//sampleStart
    // Creates an array with values [1, 2, 3]
    val simpleArray = arrayOf(1, 2, 3)
    println(simpleArray.joinToString())
    // 1, 2, 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-simple-array-kotlin"}

This example uses the [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int))
function to create an array of a given size filled with `null` elements:

```kotlin
fun main() {
//sampleStart
    // Creates an array with values [null, null, null]
    val nullArray: Array<Int?> = arrayOfNulls(3)
    println(nullArray.joinToString())
    // null, null, null
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-null-array-kotlin"}

This example uses the [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) function to 
create an empty array :

```kotlin
    var exampleArray = emptyArray<String>()
```

> You can specify the type of the empty array on the left-hand or right-hand side of the assignment due to Kotlin's type
> inference.
>
> For example:
> ```Kotlin
> var exampleArray = emptyArray<String>()
> 
> var exampleArray: Array<String> = emptyArray()
>```
>
{type="note"}

The `Array` constructor takes the array size and a function that returns values for array elements given its index:

```kotlin
fun main() {
//sampleStart
    // Creates an Array<Int> that initializes with zeros [0, 0, 0]
    val initArray = Array<Int>(3) { 0 }
    println(initArray.joinToString())
    // 0, 0, 0

    // Creates an Array<String> with values ["0", "1", "4", "9", "16"]
    val asc = Array(5) { i -> (i * i).toString() }
    asc.forEach { print(it) }
    // 014916
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-array-constructor-kotlin"}

> Like in most programming languages, indices start from 0 in Kotlin.
>
{type="note"}

### Nested arrays

Arrays can be nested within each other to create multidimensional arrays:

```kotlin
fun main() {
//sampleStart
    // Creates a two-dimensional array
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }
    println(twoDArray.contentDeepToString())
    // [[0, 0], [0, 0]]

    // Creates a three-dimensional array
    val threeDArray = Array(3) { Array(3) { Array<Int>(3) { 0 } } }
    println(threeDArray.contentDeepToString())
    // [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-multidimensional-array-kotlin"}

> Nested arrays don't have to be the same type or the same size.
>
{type="note"}

## Access and modify elements

Arrays are always mutable. To access and modify elements in an array, use the [indexed access operator](operator-overloading.md#indexed-access-operator)`[]`:

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }

    // Accesses the element and modifies it
    simpleArray[0] = 10
    twoDArray[0][0] = 2

    // Prints the modified element
    println(simpleArray[0].toString()) // 10
    println(twoDArray[0][0].toString()) // 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-access-array-kotlin"}

Arrays in Kotlin are _invariant_. This means that Kotlin doesn't allow you to assign an `Array<String>`
to an `Array<Any>` to prevent a possible runtime failure. Instead, you can use `Array<out Any>`. For more information,
see [Type Projections](generics.md#type-projections).

## Work with arrays

In Kotlin, you can work with arrays by using them to pass a variable number of arguments to a function or perform operations
on the arrays themselves. For example, comparing arrays, transforming their contents or converting them to collections.

### Pass variable number of arguments to a function

In Kotlin, you can pass a variable number of arguments to a function via the [`vararg`](functions.md#variable-number-of-arguments-varargs)
parameter. This is useful when you don't know the number of arguments in advance, like when formatting a message or
creating an SQL query.

To pass an array containing a variable number of arguments to a function, use the _spread_ operator
(`*`). The spread operator passes each element of the array as individual arguments to your chosen function:

```kotlin
fun main() {
    val lettersArray = arrayOf("c", "d")
    printAllStrings("a", "b", *lettersArray)
    // abcd
}

fun printAllStrings(vararg strings: String) {
    for (string in strings) {
        print(string)
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-vararg-array-kotlin"}

For more information, see [Variable number of arguments (varargs)](functions.md#variable-number-of-arguments-varargs).

### Compare arrays

To compare whether two arrays have the same elements in the same order, use the [`.contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)
and [`.contentDeepEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-deep-equals.html) 
functions:

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val anotherArray = arrayOf(1, 2, 3)

    // Compares contents of arrays
    println(simpleArray.contentEquals(anotherArray))
    // true

    // Using infix notation, compares contents of arrays after an element 
    // is changed
    simpleArray[0] = 10
    println(simpleArray contentEquals anotherArray)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-compare-array-kotlin"}

> Don't use equality (`==`) and inequality (`!=`) [operators](equality.md#structural-equality) to compare the contents 
> of arrays. These operators check whether the assigned variables point to the same object.
> 
> To learn more about why arrays in Kotlin behave this way, see our [blog post](https://blog.jetbrains.com/kotlin/2015/09/feedback-request-limitations-on-data-classes/#Appendix.Comparingarrays).
> 
{type="warning"}

### Transform arrays

Kotlin has many useful functions to transform arrays. This document highlights a few but this isn't an 
exhaustive list. For the full list of functions, see our [API reference](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/).

#### Sum

To return the sum of all elements in an array, use the [`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)
function:

```Kotlin
fun main() {
//sampleStart
    val sumArray = arrayOf(1, 2, 3)

    // Sums array elements
    println(sumArray.sum())
    // 6
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-sum-array-kotlin"}

> The `.sum()` function can only be used with arrays of [numeric data types](numbers.md), such as `Int`.
>
{type="note"}

#### Shuffle

To randomly shuffle the elements in an array, use the [`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html)
function:

```Kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)

    // Shuffles elements [3, 2, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

    // Shuffles elements again [2, 3, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-shuffle-array-kotlin"}

### Convert arrays to collections

If you work with different APIs where some use arrays and some use collections, then you can convert your arrays to [collections](collections-overview.md)
and vice versa.

#### Convert to List or Set

To convert an array to a `List` or `Set`, use the [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)
and [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) functions.

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf("a", "b", "c", "c")

    // Converts to a Set
    println(simpleArray.toSet())
    // [a, b, c]

    // Converts to a List
    println(simpleArray.toList())
    // [a, b, c, c]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-list-set-kotlin"}

#### Convert to Map

To convert an array to a `map`, use the [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html)
function. 

Only an array of [`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) can be converted to a `map`.
The first value of a `Pair` instance becomes a key, and the second becomes a value. This example uses the [infix notation](functions.md#infix-notation)
to call the [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) function to create tuples of `Pair`:

```kotlin
fun main() {
//sampleStart
    val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)

    // Converts to a Map
    // The keys are fruits and the values are their number of calories
    // Note how keys must be unique, so the latest value of "apple"
    // overwrites the first
    println(pairArray.toMap())
    // {apple=140, banana=150, cherry=90}

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-map-kotlin"}

## Primitive-type arrays

If you use the `Array` class with primitive values, these values are boxed into objects. 
As an alternative, you can use primitive-type arrays, which allow you to store primitives in an array without the
side effect of boxing overhead:

| Primitive-type array | Equivalent in Java |
|---|----------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`|
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) | `byte[]`|
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/) | `char[]`|
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/) | `double[]`|
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/) | `float[]`|
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/) | `int[]`|
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/) | `long[]`|
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/) | `short[]`|

These classes have no inheritance relation to the `Array` class, but they have the same set of functions and properties.

This example creates an instance of  the `IntArray` class:

```kotlin
fun main() {
//sampleStart
    // Creates an array of Int of size 5 with values
    val exampleArray = IntArray(5)
    println(exampleArray.joinToString())
    // 0, 0, 0, 0, 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-primitive-type-array-kotlin"}

> To convert primitive-type arrays to object-type arrays, use the [`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html)
> function.
> 
> To convert object-type arrays to primitive-type arrays, use [`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html),
> [`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html), [`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html),
> and so on.
> 
{type="note"}

## What's next?

* To learn more about why we recommend using collections for most use cases, read our [Collections overview](collections-overview.md).
* Learn about other [basic types](basic-types.md).
* If you are a Java developer, read our Java to Kotlin migration guide for [Collections](java-to-kotlin-collections-guide.md).
