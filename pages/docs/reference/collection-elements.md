---
type: doc
layout: reference
category: "Collections"
title: "Retrieving Single Elements"
---

# Retrieving Single Elements

Kotlin collections provide a set of functions for retrieving single elements from collections.
Functions described on this page apply to both lists and sets.

As the [list definition](collections-overview.html) says, a list is an ordered collection.
Hence, every element of a list has its position that you can use for referring.
In addition to functions described on this page, lists offer a wider set of ways to retrieve and search for elements by indices.
For more details, see [List Specific Operations](list-operations.html).

In turn, set is not an ordered collection by [definition](collections-overview.html).
However, the Kotlin `Set` stores elements in certain orders.
These can be the order of insertion (in `LinkedHashSet`), natural sorting order (in `SortedSet`), or another order.
The order of a set of elements can also be unknown.
In such cases, the elements are still ordered somehow, so the functions that rely on the element positions still return their results.
However, such results are unpredictable to the caller unless they know the specific implementation of `Set` used.

## Retrieving by position

 For retrieving an element at a specific position, there is the function `elementAt()`.
 Call it with the integer number as an argument, and you'll receive the collection element at the given position.
 The first element has the position `0`, and the last one is `(size - 1)`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // elements are stored in the ascending order
//sampleEnd
}
```
</div>

There are also useful aliases for retrieving the first and the last element of the collection: `first()` and `last()`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.first())    
    println(numbers.last())    
//sampleEnd
}
```
</div>

To avoid exceptions when retrieving element with non-existing positions, use safe variations of `elementAt()`:

* `elementAtOrNull()` returns null when the specified position is out of the collection bounds.
* `elementAtOrElse()` additionally takes a lambda function that maps an `Int` argument to an instance of the collection element type.
   When called with an out-of-bounds position, the `elementAtOrElse()` returns the result of the lambda on the given value.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAtOrNull(5))
    println(numbers.elementAtOrElse(5) { index -> "The value for index $index is undefined"})
//sampleEnd
}
```
</div>

## Retrieving by condition

Functions `first()` and `last()` also let you search a collection for elements matching a given predicate.
When you call `first()` with a predicate that tests a collection element, you'll receive the first element on which the predicate yields `true`.
In turn, `last()` with a predicate returns the last element matching it. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.first { it.length > 3 })
    println(numbers.last { it.startsWith("f") })
//sampleEnd
}
```
</div>

If no elements match the predicate, both functions throw exceptions.
To avoid them, use `firstOrNull()` and `lastOrNull()` instead: they return `null` if no matching elements are found.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })
//sampleEnd
}
```
</div>

Alternatively, you can use the aliases if their names suit your situation better:

* `find()` instead of `firstOrNull()`
* `findLast()` instead of `lastOrNull()`

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.find { it % 2 == 0 })
    println(numbers.findLast { it % 2 == 0 })
//sampleEnd
}
```
</div>

## Random element

If you need to retrieve an arbitrary element of a collection, call the `random()` function.
You can call it without arguments or with a `Random` object as a source of the randomness.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())
//sampleEnd
}
```
</div>

## Checking existence

To check the presence of an element in a collection, use the `contains()` function.
It returns `true` if there is a collection element that `equals()` the function argument.
You can call `contains()` in the operator form with the `in` keyword.

To check the presence of multiple instances together at once, call `containsAll()` with a collection of these instances as an argument.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

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
</div>

Additionally, you can check if the collection contains any elements by calling `isEmpty()` or `isNotEmpty()`. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

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
</div>

