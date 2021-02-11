[//]: # (title: Collection transformation operations)

The Kotlin standard library provides a set of extension functions for collection _transformations_.
These functions build new collections from existing ones based on the transformation rules provided.
In this page, we'll give an overview of the available collection transformation functions.

## Map

The _mapping_ transformation creates a collection from the results of a function on the elements of another collection.
The basic mapping function is [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html).
It applies the given lambda function to each subsequent element and returns the list of the lambda results.
The order of results is the same as the original order of elements. 
To apply a transformation that additionally uses the element index as an argument, use [`mapIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed.html).  

```kotlin

fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value -> value * idx })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If the transformation produces `null` on certain elements, you can filter out the `null`s from the result collection by
calling the [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html) function
instead of `map()`, or [`mapIndexedNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed-not-null.html)
instead of `mapIndexed()`.

```kotlin

fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3)
    println(numbers.mapNotNull { if ( it == 2) null else it * 3 })
    println(numbers.mapIndexedNotNull { idx, value -> if (idx == 0) null else value * idx })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

When transforming maps, you have two options: transform keys leaving values unchanged and vice versa.
To apply a given transformation to keys, use [`mapKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-keys.html);
in turn, [`mapValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-values.html) transforms values.
Both functions use the transformations that take a map entry as an argument, so you can operate both its key and value.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    println(numbersMap.mapKeys { it.key.toUpperCase() })
    println(numbersMap.mapValues { it.value + it.key.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Zip

_Zipping_ transformation is building pairs from elements with the same positions in both collections.
In the Kotlin standard library, this is done by the [`zip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip.html)
extension function.

When called on a collection or an array with another collection (array) as an argument, `zip()` returns the `List` of 
`Pair` objects. The elements of the receiver collection are the first elements in these pairs.

If the collections have different sizes, the result of the `zip()` is the smaller size; the last elements of the larger
collection are not included in the result.

`zip()` can also be called in the infix form `a zip b`.

```kotlin

fun main() {
//sampleStart
    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    println(colors zip animals)

    val twoAnimals = listOf("fox", "bear")
    println(colors.zip(twoAnimals))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also call `zip()` with a transformation function that takes two parameters: the receiver element and the argument
element. In this case, the result `List` contains the return values of the transformation function called on pairs of the
receiver and the argument elements with the same positions.

```kotlin

fun main() {
//sampleStart
    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    
    println(colors.zip(animals) { color, animal -> "The ${animal.capitalize()} is $color"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

When you have a `List` of `Pair`s, you can do the reverse transformation – _unzipping_ – that builds two lists from these
pairs:

* The first list contains the first elements of each `Pair` in the original list. 
* The second list contains the second elements.

To unzip a list of pairs, call [`unzip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/unzip.html).

```kotlin

fun main() {
//sampleStart
    val numberPairs = listOf("one" to 1, "two" to 2, "three" to 3, "four" to 4)
    println(numberPairs.unzip())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Associate

_Association_ transformations allow building maps from the collection elements and certain values associated with them.
In different association types, the elements can be either keys or values in the association map.

The basic association function [`associateWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-with.html)
creates a `Map` in which the elements of the original collection are keys, and values are produced from them by the given
transformation function. If two elements are equal, only the last one remains in the map.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For building maps with collection elements as values, there is the function [`associateBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-by.html).
It takes a function that returns a key based on an element's value. If two elements are equal, only the last one remains
in the map.

`associateBy()` can also be called with a value transformation function.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.associateBy { it.first().toUpperCase() })
    println(numbers.associateBy(keySelector = { it.first().toUpperCase() }, valueTransform = { it.length }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Another way to build maps in which both keys and values are somehow produced from collection elements is the function [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html). 
It takes a lambda function that returns a `Pair`: the key and the value of the corresponding map entry.

Note that `associate()` produces short-living `Pair` objects which may affect the performance.
Thus, `associate()` should be used when the performance isn't critical or it's more preferable than other options.

An example of the latter is when a key and the corresponding value are produced from an element together. 

```kotlin

fun main() {
data class FullName (val firstName: String, val lastName: String)

fun parseFullName(fullName: String): FullName {
    val nameParts = fullName.split(" ")
    if (nameParts.size == 2) {
        return FullName(nameParts[0], nameParts[1])
    } else throw Exception("Wrong name format")
}

//sampleStart
    val names = listOf("Alice Adams", "Brian Brown", "Clara Campbell")
    println(names.associate { name -> parseFullName(name).let { it.lastName to it.firstName } })  
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Here we call a transform function on an element first, and then build a pair from the properties of that function's result.

## Flatten

If you operate nested collections, you may find the standard library functions that provide flat access to nested collection
elements useful.

The first function is [`flatten()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flatten.html).
You can call it on a collection of collections, for example, a `List` of `Set`s.
The function returns a single `List` of all the elements of the nested collections.

```kotlin

fun main() {
//sampleStart
    val numberSets = listOf(setOf(1, 2, 3), setOf(4, 5, 6), setOf(1, 2))
    println(numberSets.flatten())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Another function – [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) provides
a flexible way to process nested collections. It takes a function that maps a collection element to another collection.
As a result, `flatMap()` returns a single list of its return values on all the elements.
So, `flatMap()` behaves as a subsequent call of `map()` (with a collection as a mapping result) and `flatten()`.

```kotlin

data class StringContainer(val values: List<String>)

fun main() {
//sampleStart
    val containers = listOf(
        StringContainer(listOf("one", "two", "three")),
        StringContainer(listOf("four", "five", "six")),
        StringContainer(listOf("seven", "eight"))
    )
    println(containers.flatMap { it.values })
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## String representation

If you need to retrieve the collection content in a readable format, use functions that transform the collections to
strings: [`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) and
[`joinTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to.html).

`joinToString()` builds a single `String` from the collection elements based on the provided arguments.
`joinTo()` does the same but appends the result to the given [`Appendable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-appendable/index.html) object.

When called with the default arguments, the functions return the result similar to calling `toString()` on the collection:
a `String` of elements' string representations separated by commas with spaces. 

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    
    println(numbers)         
    println(numbers.joinToString())
    
    val listString = StringBuffer("The list of numbers: ")
    numbers.joinTo(listString)
    println(listString)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To build a custom string representation, you can specify its parameters in function arguments `separator`, `prefix`, and
`postfix`. The resulting string will start with the `prefix` and end with the `postfix`. The `separator` will come after
each element except the last.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")    
    println(numbers.joinToString(separator = " | ", prefix = "start: ", postfix = ": end"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For bigger collections, you may want to specify the `limit` – a number of elements that will be included into result.
If the collection size exceeds the `limit`, all the other elements will be replaced with a single value of the `truncated`
argument.

```kotlin

fun main() {
//sampleStart
    val numbers = (1..100).toList()
    println(numbers.joinToString(limit = 10, truncated = "<...>"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Finally, to customize the representation of elements themselves, provide the `transform` function. 

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.joinToString { "Element: ${it.toUpperCase()}"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}