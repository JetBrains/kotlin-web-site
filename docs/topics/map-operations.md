[//]: # (title: Map-specific operations)

In [maps](collections-overview.md#map), types of both keys and values are user-defined.
Key-based access to map entries enables various map-specific processing capabilities from getting a value by key to separate
filtering of keys and values.
On this page, we provide descriptions of the map processing functions from the standard library.

## Retrieve keys and values

For retrieving a value from a map, you must provide its key as an argument of the [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html) function.
The shorthand `[key]` syntax is also supported. If the given key is not found, it returns `null`.
There is also the function [`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html)
which has slightly different behavior: it throws an exception if the key is not found in the map.
Additionally, you have two more options to handle the key absence: 

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) works the same way as for lists: the values for non-existent keys are returned from the given lambda function.
* [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html) returns the specified default value if the key is not found.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.get("one"))
    println(numbersMap["one"])
    println(numbersMap.getOrDefault("four", 10))
    println(numbersMap["five"])               // null
    //numbersMap.getValue("six")      // exception!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To perform operations on all keys or all values of a map, you can retrieve them from the properties `keys` and `values` accordingly.
`keys` is a set of all map keys and `values` is a collection of all map values.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.keys)
    println(numbersMap.values)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Filter

You can [filter](collection-filtering.md) maps with the [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) function as well as other collections.
When calling `filter()` on a map, pass to it a predicate with a `Pair` as an argument.
This enables you to use both the key and the value in the filtering predicate.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) -> key.endsWith("1") && value > 10}
    println(filteredMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

There are also two specific ways for filtering maps: by keys and by values.
For each way, there is a function: [`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html) and [`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html).
Both return a new map of entries which match the given predicate.
The predicate for `filterKeys()` checks only the element keys, the one for `filterValues()` checks only values.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredKeysMap = numbersMap.filterKeys { it.endsWith("1") }
    val filteredValuesMap = numbersMap.filterValues { it < 10 }

    println(filteredKeysMap)
    println(filteredValuesMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Plus and minus operators

Due to the key access to elements, [`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) and [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html)
(`-`) operators work for maps differently than for other collections. 
`plus` returns a `Map` that contains elements of its both operands: a `Map` on the left and a `Pair` or another `Map` on the right.
When the right-hand side operand contains entries with keys present in the left-hand side `Map`, the result map contains
the entries from the right side.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap + Pair("four", 4))
    println(numbersMap + Pair("one", 10))
    println(numbersMap + mapOf("five" to 5, "one" to 11))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`minus` creates a `Map` from entries of a `Map` on the left except those with keys from the right-hand side operand.
So, the right-hand side operand can be either a single key or a collection of keys: list, set, and so on.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap - "one")
    println(numbersMap - listOf("two", "four"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For details on using [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) and [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html)
(`-=`) operators on mutable maps, see [Map write operations](#map-write-operations) below.

## Map write operations

[Mutable](collections-overview.md#collection-types) maps offer map-specific write operations.
These operations let you change the map content using the key-based access to the values.

There are certain rules that define write operations on maps:

* Values can be updated. In turn, keys never change: once you add an entry, its key is constant.
* For each key, there is always a single value associated with it. You can add and remove whole entries.

Below are descriptions of the standard library functions for write operations available on mutable maps.

### Add and update entries

To  add a new key-value pair to a mutable map, use [`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html).
When a new entry is put into a `LinkedHashMap` (the default map implementation), it is added so that it comes last when
iterating the map. In sorted maps, the positions of new elements are defined by the order of their keys. 

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To add multiple entries at a time, use [`putAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/put-all.html).
Its argument can be a `Map` or a group of `Pair`s: `Iterable`, `Sequence`, or `Array`.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.putAll(setOf("four" to 4, "five" to 5))
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Both `put()` and `putAll()` overwrite the values if the given keys already exist in the map. Thus, you can use them to update
values of map entries.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    val previousValue = numbersMap.put("one", 11)
    println("value associated with 'one', before: $previousValue, after: ${numbersMap["one"]}")
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also add new entries to maps using the shorthand operator form. There are two ways:

* [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) operator.
* the `[]` operator alias for `set()`.  

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap["three"] = 3     // calls numbersMap.put("three", 3)
    numbersMap += mapOf("four" to 4, "five" to 5)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

When called with the key present in the map, operators overwrite the values of the corresponding entries. 

### Remove entries

To remove an entry from a mutable map, use the [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html) function.
When calling `remove()`, you can pass either a key or a whole key-value-pair.
If you specify both the key and value, the element with this key will be removed only if its value matches the second argument. 

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.remove("one")
    println(numbersMap)
    numbersMap.remove("three", 4)            //doesn't remove anything
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also remove entries from a mutable map by their keys or values.
To do this, call `remove()` on the map's keys or values providing the key or the value of an entry.
When called on values, `remove()` removes only the first entry with the given value.

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3, "threeAgain" to 3)
    numbersMap.keys.remove("one")
    println(numbersMap)
    numbersMap.values.remove(3)
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) operator
is also available for mutable maps. 

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap -= "two"
    println(numbersMap)
    numbersMap -= "five"             //doesn't remove anything
    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}