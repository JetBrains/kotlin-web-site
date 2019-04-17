---
type: doc
layout: reference
category: "Collections"
title: "Constructing Collections"
---

# Constructing Collections

## Constructing from elements

The most common way to create a collection is with the standard library functions `listOf<T>()`, `setOf<T>()`, `mutableListOf<T>()`, `mutableSetOf<T>()`.
If you provide a comma-separated list of collection elements as arguments, the compiler detects the element type automatically.  When creating empty collections, specify the type explicitly.

```kotlin
val mySet = setOf("one", "two", "three", "four")
val myMutableSet = mutableSetOf<String>()
```

The same is available for maps with the functions `mapOf()` and `mutableMapOf()`. The map's keys and values are passed as `Pair` objects (usually created with `to` infix function). 

```kotlin
val myMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```

Note that the to notation creates a short-living `Pair` object, so it's recommended that you use it only if performance isn't critical.
To avoid excessive memory usage, use alternative ways. For example, you can create a mutable map and populate it using the write operations.
The `apply()` function can help to keep the initialization fluent here.

```kotlin
val myMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```

## Empty collections

There are also functions for creating collections without any elements: `emptyList()`, `emptySet()`, and `emptyMap()`.
When creating empty collections, you should specify the type of elements that the collection will hold.

```kotlin
val empty = emptyList<String>()
```

## Initializer functions for lists

For lists, there is a constructor that takes the list size and the initializer function that defines the element value based on its index.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {   
    val myList = List(3, { it * 2 })  // or MutableList if you want to change its content later
    println(myList)
}
```
</div>

## Concrete type constructors

To create a concrete type collection, such as an `ArrayList` or `LinkedList`, you can use the available constructors for these types.
Similar constructors are available for implementations of `Set` and `Map`.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {   
    val myList = LinkedList<String>(listOf("one", "two", "three"))
    val mySortedSet = HashSet<Int>(3)
}
```
</div>

## Copying

To create a collection with the same elements as an existing collection, you can use copying operations. Collection copying operations from the standard library create _shallow_ copy collections with references to the same elements. Thus, a change made to a collection element reflects in all its copies. 
Collection copying functions, such as `toList()`, `toMutableList()`, `toSet()` and others, create a snapshot of a collection at a specific moment. Their result is a new collection of the same elements. If you add or remove elements from the original collection, this won't affect the copies. Copies may be changed independently of the source as well.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {   
    val sourceList = mutableListOf(1, 2, 3)
    val copyList = sourceList.toMutableList()
    val readOnlyCopyList = sourceList.toList()
    sourceList.add(4)
    println("Copy size: ${copyList.size}")   
    
    //readOnlyCopyList.add(4)             // compilation error
    println("Read-only copy size: ${copyList.size}")
}
```
</div>

These functions can also be used for converting collections to other types, for example, build a set from a list or vice versa.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {   
    val sourceList = mutableListOf(1, 2, 3)    
    val copySet = sourceList.toMutableSet()
    copySet.add(3)
    copySet.add(4)    
    println(copySet)
}
```
</div>

Alternatively, you can create new references to the same collection instance. New references are created when you initialize a collection variable with an existing collection.
So, when the collection instance is altered through a reference, the changes are reflected in all its references.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {   
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList = sourceList
    referenceList.add(4)
    println("Source size: ${sourceList.size}")
}
```
</div>

Collection initialization can be used for restricting mutability. For example, if you create a `List` reference to a `MutableList`, the compiler will produce errors if you try to modify the collection through this reference.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {   
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList: List<Int> = sourceList
    //referenceList.add(4)            //compilation error
    sourceList.add(4)
    println(referenceList) // shows the current state of sourceList
}
```
</div>

