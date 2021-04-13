[//]: # (title: Retrieve single elements)

Kotlin collections provide a set of functions for retrieving single elements from collections.
Functions described on this page apply to both lists and sets.

As the [definition of list](collections-overview.md) says, a list is an ordered collection.
Hence, every element of a list has its position that you can use for referring.
In addition to functions described on this page, lists offer a wider set of ways to retrieve and search for elements by indices.
For more details, see [List-specific operations](list-operations.md).

In turn, set is not an ordered collection by [definition](collections-overview.md).
However, the Kotlin `Set` stores elements in certain orders.
These can be the order of insertion (in `LinkedHashSet`), natural sorting order (in `SortedSet`), or another order.
The order of a set of elements can also be unknown.
In such cases, the elements are still ordered somehow, so the functions that rely on the element positions still return their results.
However, such results are unpredictable to the caller unless they know the specific implementation of `Set` used.

## Retrieve by position

For retrieving an element at a specific position, there is the function [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html).
Call it with the integer number as an argument, and you'll receive the collection element at the given position.
The first element has the position `0`, and the last one is `(size - 1)`.
 
`elementAt()` is useful for collections that do not provide indexed access, or are not statically known to provide one.
In case of `List`, it's more idiomatic to use [indexed access operator](list-operations.md#retrieve-elements-by-index) (`get()` or `[]`).

```kotlin

fun main() {
//sampleStart
    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // elements are stored in the ascending order
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

There are also useful aliases for retrieving the first and the last element of the collection: [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
and [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html).

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.first())    
    println(numbers.last())    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To avoid exceptions when retrieving element with non-existing positions, use safe variations of `elementAt()`:

* [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html) returns null when the specified position is out of the collection bounds.
* [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html) additionally takes a lambda function that maps an `Int` argument to an instance of the collection element type.
   When called with an out-of-bounds position, the `elementAtOrElse()` returns the result of the lambda on the given value.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAtOrNull(5))
    println(numbers.elementAtOrElse(5) { index -> "The value for index $index is undefined"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Retrieve by condition

Functions [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) and [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)
also let you search a collection for elements matching a given predicate. When you call `first()` with a predicate that
tests a collection element, you'll receive the first element on which the predicate yields `true`.
In turn, `last()` with a predicate returns the last element matching it. 

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.first { it.length > 3 })
    println(numbers.last { it.startsWith("f") })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If no elements match the predicate, both functions throw exceptions.
To avoid them, use [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
and [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html) instead:
they return `null` if no matching elements are found.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Use the aliases if their names suit your situation better:

* [`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html) instead of `firstOrNull()`
* [`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html) instead of `lastOrNull()`

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.find { it % 2 == 0 })
    println(numbers.findLast { it % 2 == 0 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Retrieve with selector

If you need to map the collection before retrieving the element, there is a function [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html).
It combines 2 actions:
- Maps the collection with the selector function
- Returns the first non-null value in the result

`firstNotNullOf()` throws the `NoSuchElementException` if the resulting collection doesn't have a non-null element. 
Use the counterpart [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html) 
to return null in this case.

```kotlin
fun main() {
//sampleStart
    val list = listOf<Any>(0, "true", false)
    // Converts each element to string and returns the first one that has required length
    val longEnough = list.firstNotNullOf { item -> item.toString().takeIf { it.length >= 4 } }
    println(longEnough)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## Random element

If you need to retrieve an arbitrary element of a collection, call the [`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html) function.
You can call it without arguments or with a [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html)
object as a source of the randomness.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

On empty collections, `random()` throws an exception. To receive `null` instead, use [`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)

## Check element existence

To check the presence of an element in a collection, use the [`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html) function.
It returns `true` if there is a collection element that `equals()` the function argument.
You can call `contains()` in the operator form with the `in` keyword.

To check the presence of multiple instances together at once, call [`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html)
with a collection of these instances as an argument.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.contains("four"))
    println("zero" in numbers)
    
    println(numbers.containsAll(listOf("four", "two")))
    println(numbers.containsAll(listOf("one", "zero")))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Additionally, you can check if the collection contains any elements by calling [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html)
or [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html). 

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.isEmpty())
    println(numbers.isNotEmpty())
    
    val empty = emptyList<String>()
    println(empty.isEmpty())
    println(empty.isNotEmpty())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

