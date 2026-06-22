[//]: # (title: Arrays)
[//]: # (description: Learn how to create, access, modify, compare, and convert arrays in Kotlin.)

An array is a data structure that holds a fixed number of values of the same type or its subtypes.
Array elements are ordered and accessed by index.

Kotlin provides the [`Array<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) class and [primitive-type arrays](#primitive-type-arrays).

## When to use arrays

Use arrays for interoperability with Java APIs or low-level requirements. For example, if you have 
performance requirements beyond what is needed for regular applications, or you need to build custom data structures.

For most use cases, prefer [collections](collections-overview.md) instead.

| Functionality                                       | Arrays                                                                                                                                               | Collections                                       |
|-----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|
| Size                                                | Fixed                                                                                                                                                | Depends on the type                               |           
| Read-only variant                                   | No, always mutable                                                                                                                                   | Yes (`List` and `Set`)                            |
| Adding and removing elements                        | No native support.<br/> Allocate and copy to a new array                                                                                             | Yes (mutable collections)                         |
| Structural equality with `==`                       | No, compares references.<br/> Use [`.contentEquals()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/content-equals.html) instead | Yes                                               |
| Primitive values                                    | Primitive-type arrays store values<br/> without boxing                                                                                               | Usually boxed                                     |
| Java interoperability                               | Maps to `T[]`                                                                                                                                        | Maps to `java.util.List` and<br/> `java.util.Set` |
| Functional-style filtering and<br/> transformations | Limited                                                                                                                                              | Extensive                                         |

> Learn how to [convert arrays to collections](#convert-to-collections). 
> 
{style="tip"}

## Create arrays

To create arrays, you can use:

* The [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html), [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)), 
or [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) functions.
* The `Array` constructor.

> Declaring an array with `val` only prevents reassigning the variable but doesn't make the contents read-only.
> Elements are mutable in both `val` and `var` arrays. The distinction only affects the reference, not the contents.
> For a read-only view, use [collections](collections-overview.md) instead.
> 
{style="note"}

### Array with values

To create a typed array from a known set of values, use the [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) function.
Kotlin infers the type automatically:

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3) // Array<Int>
    println(simpleArray.joinToString())
    // 1, 2, 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-simple-array-kotlin"}

### Empty array

To create an array with no elements, use the [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) function.
You can specify the type of elements on the left-hand or right-hand side of the assignment:

```kotlin
val emptyArrayRight = emptyArray<String>()
val emptyArrayLeft: Array<String> = emptyArray()
```

> Learn [how to add elements](#add-and-remove-elements) to an array.
> 
{style="tip"}

### Array with nulls

To create an array of a given size filled with `null` elements,
use the [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) function:

```kotlin
fun main() {
//sampleStart
    val nullArray: Array<Int?> = arrayOfNulls(3)
    println(nullArray.joinToString())
    // null, null, null
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-null-array-kotlin"}

### Array constructor

The `Array` constructor takes the array size and a function that returns values for array elements:

```kotlin
fun main() {
//sampleStart
    val zeroes = Array<Int>(3) { 0 }
    println(zeroes.joinToString())
    // 0, 0, 0
    
    val squares = Array(5) { i -> i * i }
    println(squares.joinToString())
    // 0, 1, 4, 9, 16
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-array-constructor-kotlin"}

### Nested arrays

To create a nested or multidimensional array, use an array of arrays.
Nested arrays don't have to be the same type or the same size.

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

## Primitive-type arrays

If you use the `Array` class with primitive values, the compiler boxes these values into objects.
To avoid boxing overhead, you can use dedicated primitive-type arrays.
They are not subclasses of the [`Array<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) class, but they provide a similar set of functions and properties.

| Kotlin type                                                                             | Java equivalent |
|-----------------------------------------------------------------------------------------|-----------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/)   | `boolean[]`     |
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)         | `byte[]`        |
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/)         | `char[]`        |
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/)     | `double[]`      |
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/)       | `float[]`       |
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/)           | `int[]`         |
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/)         | `long[]`        |
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/)       | `short[]`       |

> Kotlin doesn't have a dedicated `StringArray` type. `String` is not a primitive, so
> use the [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) or `arrayOf<String>()` functions with inferred type instead.
> 
{style="note"}

To create a primitive-type array, use one of the following options:

* Constructor functions:

  ```kotlin
  fun main() {
  //sampleStart
      // Creates an Int array of size 5 with the values initialized to zero
      val primitiveTypeArray = IntArray(5)
      println(primitiveTypeArray.joinToString())
      // 0, 0, 0, 0, 0
  
      // Creates an Int array and takes an initializer function
      val squares = IntArray(5) { i -> i * i }
      println(squares.joinToString())
      // 0, 1, 4, 9, 16
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-primitive-type-array-kotlin"}

* Factory functions:

  ```kotlin
  fun main() {
  //sampleStart
      // Creates an Int array with 5 elements
      val numbers = intArrayOf(1, 2, 3, 4, 5)
      println(numbers.joinToString())
      // 1, 2, 3, 4, 5

      // Creates a Char array with 3 elements
      val characters = charArrayOf('K', 't', 'l')
      println(characters.joinToString())
      // K, t, l

      // Creates a Double array with 3 elements
      val doubles = doubleArrayOf(0.22, 4.16, 0.5)
      println(doubles.joinToString()) 
      // 0.22, 4.16, 0.5
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> To convert primitive-type arrays to object-type arrays, use the [`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html)
> function.
>
> To convert object-type arrays to primitive-type arrays, use [`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html),
> [`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html), [`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html),
> and so on.
>
{style="note"}

## Work with arrays

Arrays support many of the same operations as collections, including iteration,
searching, sorting, and transformations.
In Kotlin, you can work with arrays by using them to pass a variable number of arguments to a function or perform operations
on the arrays themselves.
Find the most common properties and functions in the following table:

| Member                                                                                                                                                                                                 | Returns                               |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|
| [`size`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-array/size.html)                                                                                                                        | The number of elements                |
| [`indices`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/indices.html)                                                                                                             | The range of valid indices            |
| [`lastIndex`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/last-index.html)                                                                                                        | The last valid index                  |
| [`first()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first.html) and [`last()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/last.html)                    | First and last element                |
| [`isEmpty()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/is-empty.html) and [`isNotEmpty()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/is-not-empty.html) | `true` if array is empty or not empty |
| [`contains()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/contains.html)                                                                                                         | `true` if array has the element       |

> Learn more about array properties and functions in the [API Reference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-array/).
> 
{style="tip"}

This section introduces some of the most commonly used operations.

### Access and modify elements

To access and modify elements in an array, use the [indexed access operator](operator-overloading.md#indexed-access-operator)
(`[]`):

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }

    // Accesses the element and modifies it
    simpleArray[0] = 10
    twoDArray[0][0] = 2

    // Prints the modified element
    println(simpleArray[0]) 
    // 10
    println(twoDArray[0][0]) 
    // 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-access-array-kotlin"}

> If you try to access an index outside the bounds of an array, Kotlin throws `ArrayIndexOutOfBoundsException` at runtime.
>
{style="note"} 

You can also use the [`fill(element, fromIndex, toIndex)`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/fill.html) function
to replace elements in a range in place. `fromIndex` is inclusive and `toIndex` is exclusive:

```kotlin
fun main() {
//sampleStart
    val arr = IntArray(3)
    println(arr.joinToString())
    // 0, 0, 0
    
   arr.fill(1)
   println(arr.joinToString())
   // 1, 1, 1
  
   arr.fill(0, 0, 2)
   println(arr.joinToString())
   // 0, 0, 1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

In Kotlin, arrays are _invariant_. This means, `Array<String>` is not a subtype
of `Array<Any>`. This prevents possible runtime type failures. To express covariance, use the `Array<out Any>`
[type projection](generics.md#type-projections):

```kotlin
fun main() {
//sampleStart
    fun printArr(arr: Array<out Any>) {
        for (item in arr) print("$item, ")
    }

    printArr(arrayOf("k", "t", "n"))  
    // k, t, n, 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Add and remove elements

Since arrays have a fixed size, they don't support the `.add()` and `.remove()` functions. To perform these operations,
you need to create a new array. For that, you can use one of the following options:

* Use the [`.copyOf`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/copy-of.html) function:

  ```kotlin
  fun main() {
  //sampleStart
      var arr = intArrayOf(0, 1, 2)
      
      arr = arr.copyOf(arr.size + 1)
      println(arr.joinToString())
      // 0, 1, 2, 0

      arr[arr.lastIndex] = 3
      println(arr.joinToString())
      // 0, 1, 2, 3
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

* Use the `+` or `+=` operators:

  ```kotlin
  fun main() {
  //sampleStart
      var arr = intArrayOf(0, 1, 2)

      arr += 3
      println(arr.joinToString())
      // 0, 1, 2, 3

      arr = arr + intArrayOf(4, 5)
      println(arr.joinToString())
      // 0, 1, 2, 3, 4, 5
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> If you need to frequently add or remove elements,
> use [mutable collections](collections-overview.md#collection-types) instead.
>
{style="tip"}

### Compare

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
{style="warning"}

### Transform arrays

Kotlin has many useful functions to transform arrays. This section highlights some of them. 
See the complete list in our [API reference](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/).

#### Sum

To return the sum of all elements in an array, use the [`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)
function:

```kotlin
fun main() {
//sampleStart
    val sumArray = arrayOf(1, 2, 3)
    println(sumArray.sum())
    // 6
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-sum-array-kotlin"}

> The `.sum()` function can only be used with arrays of [numeric data types](numbers.md), such as `Int`.
>
{style="note"}

#### Sort and shuffle

You can sort the elements in the array according to their natural order with the [`.sort()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sort.html) function or
randomly shuffle them with the [`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html)
function:

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)

    // Randomly shuffles elements
    simpleArray.shuffle()
    println(simpleArray.joinToString())
  
    // Sorts elements
    simpleArray.sort()
    println(simpleArray.joinToString())
    // 1, 2, 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-shuffle-array-kotlin"}

To get a new sorted array without modifying the original, use the
[`.sortedArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sorted-array.html) function instead.

### Pass variable number of arguments to a function

In Kotlin, you can pass a variable number of arguments to a function via the [`vararg`](functions.md#variable-number-of-arguments-varargs)
parameter. This is useful when you don't know the number of arguments in advance, like when formatting a message or
creating an SQL query.

To pass an array containing a variable number of arguments to a function, use the _spread operator_
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

## Convert to collections

If you work with different APIs where some use arrays and some use collections, you can convert your arrays to collections
and vice versa. For that, use the [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html), [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html), and [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) functions.
These functions copy the content from your array to the independent copy. They don't reflect subsequent changes
to the array.

### Convert to List or Set

To convert an array to a `List` or `Set`, use the [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)
and [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) functions:

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

Unless you are completely sure that the original array isn't changed or shared elsewhere,
don't use [`.asList()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/as-list.html)
and related `as*` functions. These functions wrap the original array instead of copying it. Therefore,
changes to the array are reflected in the list and vice versa.

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf("a", "b", "c")

    val list = simpleArray.asList()
    simpleArray[0] = "d"
    println(list)
    // [d, b, c]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Convert to Map

To convert an array to a `Map`, use the [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html)
function.

You can convert only an array of [`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) to a `Map`.
The first value of a `Pair` instance becomes a key, and the second becomes a value. 
If the same key appears more than once, the last value is used.

This example uses the [infix notation](functions.md#infix-notation)
to call the [`.to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) function to create tuples of `Pair`:

```kotlin
fun main() {
//sampleStart
    val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)

    // Converts to a Map
    // Fruits are keys, number of calories are values
    // The latest "apple" value overwrites the first one
    println(pairArray.toMap())
    // {apple=140, banana=150, cherry=90}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-map-kotlin"}

## What's next?

* Learn more about why we recommend using collections for most use cases in [Collections overview](collections-overview.md).
* Learn about other [basic types](types-overview.md).
* If you are a Java developer, read our [Java to Kotlin migration guide for Collections](java-to-kotlin-collections-guide.md).
