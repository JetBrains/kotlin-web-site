---
type: doc
layout: reference
category: "Collections"
title: "Filtering Collections"
---

# Filtering

Filtering is one of the most popular tasks in the collection processing.
In Kotlin, filtering conditions are defined by _predicates_ – lambda functions that take a collection element and return a boolean value: `true` means that the given element matches the predicate, `false` means the opposite.

The standard library contains a group of extension functions that let you filter collections in a single call.
These functions leave the original collection unchanged, so they are available for both [mutable and read-only](collections-overview.html#collection-types) collections.
To operate the filtering result, you should assign it to a variable or chain the functions after filtering.

## Filtering by predicate

The basic filtering function is [`filter()`](/api/latest/jvm/stdlib/kotlin.collections/filter.html).
When called with a predicate, `filter()` returns the collection elements that match it.
For both `List` and `Set`, the resulting collection is a `List`, for `Map` it's a `Map` as well.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) -> key.endsWith("1") && value > 10}
    println(filteredMap)
//sampleEnd
}
```
</div>

The predicates in `filter()` can only check the values of the elements.
If you want to use element positions in the filter, use [`filterIndexed()`](/api/latest/jvm/stdlib/kotlin.collections/filter-indexed.html).
It takes a predicate with two arguments: the index and the value of an element. 

To filter collections by negative conditions, use [`filterNot()`](/api/latest/jvm/stdlib/kotlin.collections/filter-not.html).
It returns a list of elements for which the predicate yields `false`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    
    val filteredIdx = numbers.filterIndexed { index, s -> (index != 0) && (s.length < 5)  }
    val filteredNot = numbers.filterNot { it.length <= 3 }

    println(filteredIdx)
    println(filteredNot)
//sampleEnd
}
```
</div>

There are also functions that narrow the element type by filtering elements of a given type:

* [`filterIsInstance()`](/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html) returns collection elements of a given type. Being called on a `List<Any>`, `filterIsInstance<T>()` returns a `List<T>`, thus allowing you to call functions of the  `T` type on its items.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(null, 1, "two", 3.0, "four")
    println("All String elements in upper case:")
    numbers.filterIsInstance<String>().forEach {
        println(it.toUpperCase())
    }
//sampleEnd
}
```
</div>
    
* [`filterNotNull()`](/api/latest/jvm/stdlib/kotlin.collections/filter-not-null.html) returns all non-null elements. Being called on a `List<T?>`, `filterNotNull()` returns a `List<T: Any>`, thus allowing you to treat the elements as non-null objects.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(null, "one", "two", null)
    numbers.filterNotNull().forEach {
        println(it.length)   // length is unavailable for nullable Strings
    }
//sampleEnd
}
```
</div>

## Partitioning

Another filtering function – [`partition()`](/api/latest/jvm/stdlib/kotlin.collections/partition.html) – filters a collection by a predicate and keeps the elements that don't match it in a separate list.
So, you have a `Pair` of `List`s as a return value: the first list containing elements that match the predicate and the second one containing everything else from the original collection.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val (match, rest) = numbers.partition { it.length > 3 }

    println(match)
    println(rest)
//sampleEnd
}
```
</div>

## Testing predicates

Finally, there are functions that simply test a predicate against collection elements:

* [`any()`](/api/latest/jvm/stdlib/kotlin.collections/any.html) returns `true` if at least one element matches the given predicate.
* [`none()`](/api/latest/jvm/stdlib/kotlin.collections/none.html) returns `true` if none of the elements match the given predicate.
* [`all()`](/api/latest/jvm/stdlib/kotlin.collections/all.html) returns `true` if all elements match the given predicate. Note that `all()` returns `true` when called with any valid predicate on an empty collection. Such behavior is known in logic as [_vacuous truth_](https://en.wikipedia.org/wiki/Vacuous_truth).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.any { it.endsWith("e") })
    println(numbers.none { it.endsWith("a") })
    println(numbers.all { it.endsWith("e") })

    println(emptyList<Int>().all { it > 5 })   // vacuous truth
//sampleEnd
}
```
</div>

`any()` and `none()` can also be used without a predicate: in this case they just check the collection emptiness.
`any()` returns `true` if there are elements and `false` if there aren't; `none()` does the opposite.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val empty = emptyList<String>()

    println(numbers.any())
    println(empty.any())
    
    println(numbers.none())
    println(empty.none())
//sampleEnd
}
```
</div>

