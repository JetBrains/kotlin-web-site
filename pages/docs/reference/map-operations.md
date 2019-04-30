---
type: doc
layout: reference
category: "Collections"
title: "Map Specific Operations"
---

# Map Specific Operations

In [maps](collections-overview.html), both keys and values are user-defined. They can be instances of any type.
Key-based access to map entries enables various map-specific processing capabilities from getting a value by key to separate filtering of keys and values.
On this page, we provide descriptions of the map processing functions from the standard library.

## Retrieving keys and values

For retrieving a value from a map, you must provide its key as an argument of the `get()` function.
The shorthand `[key]` syntax is also supported. If the given key is not found, it returns `null`.
There is also the function `getValue()` which has slightly different behavior: it throws an exception if the key is not found in the map.
Additionally, you have two more options to handle the key absence: 

* `getOrElse()` works the same way as for lists: the values for non-existent keys are returned from the given lambda function.
* `getOrDefault()` returns the specified default value if the key is not found.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numberMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    println(numberMap.get("one"))
    println(numberMap["one"])
    println(numberMap.getOrDefault("four", 10))
    println(numberMap.get("five"))               // null
    //numberMap.getValue("six")      // exception!
//sampleEnd
}

```
</div>

To perform operations on all keys or all values of a map, you can retrieve them from the properties keys and values accordingly.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numberMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    println(numberMap.keys)
    println(numberMap.values)
//sampleEnd
}

```
</div>

## Filtering

You can filter maps with the [`filter()`](collection-filtering.html) function as well as other collections.
When calling `filter()` on a map, pass to it a predicate with a `Pair` as an argument.
This enables you to use both the key and the value in the filtering predicate.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numberMap = mutableMapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numberMap.filter { (key, value) -> key.endsWith("1") && value > 10}
    println(filteredMap)
//sampleEnd
}

```
</div>

There are also two specific ways for filtering maps: by keys and by values.
For each way, there is a function: `filterKeys()` and `filterValues()`.
Both return a new map of entries which match the given predicate.
The predicate for `filterKeys()` checks only the element keys, the one for `filterValues()` checks only values.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numberMap = mutableMapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredKeysMap = numberMap.filterKeys { it.endsWith("1") }
    val filteredValuesMap = numberMap.filterValues { it < 10 }

    println(filteredKeysMap)
    println(filteredValuesMap)
//sampleEnd
}

```
</div>

## `plus` and `minus` operators

Due to the key access to elements, `+` (`plus`) and `-` (`minus`) operators work for maps differently than for other collections. 
`plus` returns a `Map` that contains elements of its both operands: a `Map` on the left and a `Pair` or another `Map` on the right.
When the right-hand side operand contains entries with keys present in the left-hand side `Map`, the result map contains the entries from the right side.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numberMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numberMap + Pair("four", 4))
    println(numberMap + Pair("one", 10))
    println(numberMap + mapOf("five" to 5, "one" to 11))
//sampleEnd
}

```
</div>

`minus` creates a `Map` from entries of a `Map` on the left except those with keys from the right-hand side operand.
So, the right-hand side operand can be either a single key or a collection of keys: list, set, and so on.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numberMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numberMap - "one")
    println(numberMap - listOf("two", "four"))
//sampleEnd
}

```
</div>

For details on using `+=` (`plusAssign`) and `-=` (`minusAssign`) operators on mutable maps, see [Map write operations](#map-write-operations) below.

## Map write operations

[Mutable](collections-overview.html#collection-types) maps offer map-specific write operations.
These operations let you change the map content using the key-based access to the values.

There are certain rules that define write operations on maps:

* Values can be updated. In turn, keys never change: once you add an entry, its key is constant.
* For each key, there is always a single value associated with it. You can add and remove whole entries.

Below are descriptions of the standard library functions for write operations available on mutable maps.

### Adding and updating entries

To  add a new key-value pair to a mutable map, use `put()`.
In `LinkedHashMap`, which is the default map implementation, new entries are added so that they are in the end when iterating the map.
In sorted maps, the positions of new elements are defined by the order of their keys. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numberMap = mutableMapOf("one" to 1, "two" to 2)
    numberMap.put("three", 3)
    println(numberMap)
//sampleEnd
}

```
</div>

To add multiple entries at a time, use `putAll()`. Its argument can be a `Map` or a group of `Pairs`: `Iterable`, `Sequence`, or `Array`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numberMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numberMap.putAll(setOf("four" to 4, "five" to 5))
    println(numberMap)
//sampleEnd
}

```
</div>

Both `put()` and `putAll()` overwrite the values if the given keys already exist in the map. Thus, you can use them to update values of map entries.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numberMap = mutableMapOf("one" to 1, "two" to 2)
    numberMap.set("one", 11)
    println(numberMap)
//sampleEnd
}

```
</div>

You can also add new entries to maps using the shorthand operator form. There are two ways:

* `+=` (`plusAssign`) operator.
* the `set()` function in the form of `[]` operator. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numberMap = mutableMapOf("one" to 1, "two" to 2)
    numberMap["three"] = 3     // calls numberMap.set("three", 3)
    mapOf("four" to 4, "five" to 5)
    println(numberMap)
//sampleEnd
}

```
</div>

When called with the key present in the map, operators overwrite the values of the corresponding entries. 

### Removing entries

To remove an entry from a mutable map, use the `remove()` function.
When calling `remove()`, you can pass either a key or a whole key-value-pair.
If you specify both the key and value, the element with this key will be removed only if its value matches the second argument. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numberMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numberMap.remove("one")
    println(numberMap)
    numberMap.remove("three", 4)            //doesn't remove anything
    println(numberMap)
//sampleEnd
}

```
</div>

You can also remove entries from a mutable map by their keys or values.
To do this, call `remove()` on the map's keys or values providing the key or the value of an entry.
When called on values, `remove()` removes only the first entry with the given value.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numberMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3, "threeAgain" to 3)
    numberMap.keys.remove("one")
    println(numberMap)
    numberMap.values.remove(3)
    println(numberMap)
//sampleEnd
}

```
</div>


The `-=` (`minusAssign`) operator is also available for mutable maps. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numberMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numberMap -= "two"
    println(numberMap)
    numberMap -= "five"             //doesn't remove anything
    println(numberMap)
//sampleEnd
}

```
</div>

