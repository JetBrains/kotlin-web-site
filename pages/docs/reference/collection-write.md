---
type: doc
layout: reference
category: "Collections"
title: "Collection Write Operations"
---

# Collection Write Operations

[Mutable collections](collections-overview.html#collection-types) support operations for changing the collection contents, for example, adding or removing elements.
On this page, we'll describe write operations available for all implementations of `MutableCollection`.
For more specific operations available for `List` and `Map`, see [List Specific Operations](list-operations.html) and [Map Specific Operations](map-operations.html) respectively.

## Adding elements

To add a single element to a list or a set, use the `add()` function. The specified object is appended to the end of the collection.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    println(numbers)
//sampleEnd
}
```
</div>

`addAll()` adds every element of the argument object to a list or a set.
The argument can be any `Collection`, for example, you can add all items from a `Set` to a `List`.
Moreover, `addAll()` can accept any `Iterable`, `Sequence`, or `Array`.

For lists, you can also specify the index where the elements should be inserted.
Other elements of the argument collection will follow it preserving their order.


`addAll()` adds every element of the argument object to a list or a set. The argument can be an `Iterable`, a `Sequence`, or an `Array`.
The types of the receiver and the argument may be different, for example, you can add all items from a `Set` to a `List`.

When called on lists, `addAll()` adds elements in the same order as they go in the argument. Additionally, you can specify the position where the first element of the argument should be inserted.
Starting from this position, the elements of the receiver will be shifted to the end to let the argument elements follow the first of them. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 5, 6)
    numbers.addAll(arrayOf(7, 8))
    println(numbers)
    numbers.addAll(2, setOf(3, 4))
    println(numbers)
//sampleEnd
}
```
</div>

You can also add elements using the in-place version of the [`plus` operator](collection-plus-minus.html) - `plusAssign` (`+=`)
 When applied to a mutable collection, `+=` appends the second operand (an element or another collection) to the end of the collection.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two")
    numbers += "three"
    println(numbers)
    numbers += listOf("four", "five")    
    println(numbers)
//sampleEnd
}
```
</div>

## Removing elements

To remove an element from a mutable collection, use the `remove()` function.
`remove()` accepts the element value and removes one occurrence of this value. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // removes the first `3`
    println(numbers)
    numbers.remove(5)                    // removes nothing
    println(numbers)
//sampleEnd
}
```
</div>

For removing multiple elements at once, there are the following functions :

* `removeAll()` removes all elements that are present in the argument collection.
   Alternatively, you can call it with a predicate as an argument; in this case the function removes all elements for which the predicate yields `true`.
* `retainAll()` is the opposite of `removeAll()`: it removes all elements except the ones from the argument collection.
   When used with a predicate, it leaves only elements that match it.
* `clear()` removes all elements and makes the collection empty.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers)
    numbers.retainAll { it >= 3 }
    println(numbers)
    numbers.clear()
    println(numbers)

    val numbersSet = mutableSetOf("one", "two", "three", "four")
    numbersSet.removeAll(setOf("one", "two"))
    println(numbersSet)
//sampleEnd
}
```
</div>

Another way to remove elements from a collection is with the `minusAssign` (`-=`) operator – the in-place version of [`minus`](collection-plus-minus.html). 
The second argument can be a single instance of the element type or another collection.
With a single element on the right-hand side, `-=` removes the _first_ occurrence of it.
In turn, if it's a collection, _all_ occurrences of its elements are removed.
For example, if a list contains duplicate elements, they are removed at once.
The second operand can contain elements that are not present in the collection. Such elements don't affect the operation execution.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // does the same as above
    println(numbers)    
//sampleEnd
}
```
</div>

## Updating elements

Finally, there are functions for updating collection elements : 

* `replaceAll()` applies the specified transformation for each element and replaces it with the transform result.
   For maps, `replaceAll()` is available only on JVM starting from JDK 8: it replaces only the values leaving the keys unchanged.
* `fill()` simply replaces all the collection elements with the specified value.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.fill(3)
    println(numbers)
    
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.replaceAll { k, v -> v * 2}
    println(numbersMap)
//sampleEnd
}
```
</div>

