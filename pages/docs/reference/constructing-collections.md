---
type: doc
layout: reference
category: "Collections"
title: "Constructing Collections"
---

# Constructing Collections

## Constructing from elements

The most common way to create a collection is with the standard library functions [`listOf<T>()`](/api/latest/jvm/stdlib/kotlin.collections/list-of.html), [`setOf<T>()`](/api/latest/jvm/stdlib/kotlin.collections/set-of.html), [`mutableListOf<T>()`](/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html), [`mutableSetOf<T>()`](/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html).
If you provide a comma-separated list of collection elements as arguments, the compiler detects the element type automatically.  When creating empty collections, specify the type explicitly.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val numbersSet = setOf("one", "two", "three", "four")
val emptySet = mutableSetOf<String>()
```
</div>

The same is available for maps with the functions [`mapOf()`](/api/latest/jvm/stdlib/kotlin.collections/map-of.html) and [`mutableMapOf()`](/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html). The map's keys and values are passed as `Pair` objects (usually created with `to` infix function). 

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```
</div>

Note that the `to` notation creates a short-living `Pair` object, so it's recommended that you use it only if performance isn't critical.
To avoid excessive memory usage, use alternative ways. For example, you can create a mutable map and populate it using the write operations.
The [`apply()`](scope-functions.html#apply) function can help to keep the initialization fluent here.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val numbersMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```
</div>

## Empty collections

There are also functions for creating collections without any elements: [`emptyList()`](/api/latest/jvm/stdlib/kotlin.collections/empty-list.html), [`emptySet()`](/api/latest/jvm/stdlib/kotlin.collections/empty-set.html), and [`emptyMap()`](/api/latest/jvm/stdlib/kotlin.collections/empty-map.html).
When creating empty collections, you should specify the type of elements that the collection will hold.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val empty = emptyList<String>()
```
</div>

## Initializer functions for lists

For lists, there is a constructor that takes the list size and the initializer function that defines the element value based on its index.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val doubled = List(3, { it * 2 })  // or MutableList if you want to change its content later
    println(doubled)
//sampleEnd
}
```
</div>

## Concrete type constructors

To create a concrete type collection, such as an `ArrayList` or `LinkedList`, you can use the available constructors for these types.
Similar constructors are available for implementations of `Set` and `Map`.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val linkedList = LinkedList<String>(listOf("one", "two", "three"))
val presizedSet = HashSet<Int>(32)
```
</div>

## Copying

To create a collection with the same elements as an existing collection, you can use copying operations. Collection copying operations from the standard library create _shallow_ copy collections with references to the same elements.
Thus, a change made to a collection element reflects in all its copies. 

Collection copying functions, such as [`toList()`](/api/latest/jvm/stdlib/kotlin.collections/to-list.html), [`toMutableList()`](/api/latest/jvm/stdlib/kotlin.collections/to-mutable-list.html), [`toSet()`](/api/latest/jvm/stdlib/kotlin.collections/to-set.html) and others, create a snapshot of a collection at a specific moment.
Their result is a new collection of the same elements.
If you add or remove elements from the original collection, this won't affect the copies. Copies may be changed independently of the source as well.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)
    val copyList = sourceList.toMutableList()
    val readOnlyCopyList = sourceList.toList()
    sourceList.add(4)
    println("Copy size: ${copyList.size}")   
    
    //readOnlyCopyList.add(4)             // compilation error
    println("Read-only copy size: ${readOnlyCopyList.size}")
//sampleEnd
}
```
</div>

These functions can also be used for converting collections to other types, for example, build a set from a list or vice versa.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)    
    val copySet = sourceList.toMutableSet()
    copySet.add(3)
    copySet.add(4)    
    println(copySet)
//sampleEnd
}
```
</div>

Alternatively, you can create new references to the same collection instance. New references are created when you initialize a collection variable with an existing collection.
So, when the collection instance is altered through a reference, the changes are reflected in all its references.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList = sourceList
    referenceList.add(4)
    println("Source size: ${sourceList.size}")
//sampleEnd
}
```
</div>

Collection initialization can be used for restricting mutability. For example, if you create a `List` reference to a `MutableList`, the compiler will produce errors if you try to modify the collection through this reference.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart 
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList: List<Int> = sourceList
    //referenceList.add(4)            //compilation error
    sourceList.add(4)
    println(referenceList) // shows the current state of sourceList
//sampleEnd
}
```
</div>

## Invoking functions on other collections

Collections can be created in result of various operations on other collections. For example, [filtering](collection-filtering.html) a list creates a new list of elements that match the filter:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart 
    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)
//sampleEnd
}
```
</div>

[Mapping](collection-transformations.html#mapping) produces a list of a transformation results:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart 
    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value -> value * idx })
//sampleEnd
}
```
</div>

[Association](collection-transformations.html#association) produces maps:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
</div>

For more information about operations on collections in Kotlin, see [Collection Operations Overview](collection-operations.html).
