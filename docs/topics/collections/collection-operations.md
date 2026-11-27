[//]: # (title: Collection operations overview)

The Kotlin standard library offers a broad variety of functions for performing operations on collections. This includes
simple operations, such as reading or adding elements, as well as more complex ones, such as search, sorting, filtering,
and transformations.

## Member and extension functions

The standard library declares collection operations in two ways:

* As [member functions](classes.md) of collection interfaces.

  Member functions define operations that are essential for a collection type. For example, [`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)
  declares the [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html) function to check if it holds any elements,
  or [`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) declares the [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) function for index access.

  When you create your own implementations of collection interfaces, you must implement their member functions.
  To make it easier, use the skeletal implementations of collection interfaces from the
  standard library: [`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html),
  [`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html),
  [`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html),
  [`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html), and their
  mutable counterparts.

* As [extension functions](extensions.md#extension-functions).

  Most other operations are extension functions. These include filtering, transformation, ordering, and other
  collection processing functions.

  The `kotlin.collections` package is [imported by default](packages.md#default-imports), so you can call its extension
  functions without an import. To use collection extensions from other packages or libraries, [import](packages.md#imports) them.

## Common operations

You can use common operations for both [read-only and mutable collections](collections-overview.md#read-only-and-mutable-collections).

These operations return their results as a new collection and don't affect the original collection. They are also _eager_:
an operation runs over the whole collection and builds its result in full before it returns. To keep the result of an
operation, store it in a variable or pass it on. To process elements lazily instead, use [sequences](sequences.md).

The following example shows a filtering operation that produces a new collection with the elements that match the predicate:

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    // The result is lost
    numbers.filter { it.length > 3 }
    println("Numbers are still $numbers")
    // Numbers are still [one, two, three, four]

    // The result is stored in `longerThan3`
    val longerThan3 = numbers.filter { it.length > 3 }
    println("Numbers longer than 3 chars are $longerThan3")
    // Numbers longer than 3 chars are [three, four]
//sampleEnd
}
```
{kotlin-runnable="true"}

For some collection operations, you can specify the _destination_ object.
Destination is a mutable collection to which the function appends its results instead of returning a new object.
These functions have the `To` postfix in their names, for example,
[`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html) instead of [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)
or [`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html) instead of [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html).
They take the destination collection as an additional parameter:

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    // Destination object
    val filterResults = mutableListOf<String>()
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ -> index == 0 }
    // Contains the results of both operations
    println(filterResults)
    // [three, four, one]
//sampleEnd
}
```
{kotlin-runnable="true"}

Since these functions return the destination collection back, you can create it directly in the corresponding
argument of the function call:

```kotlin
fun main() {
    val numbers = listOf("one", "two", "three", "four")
//sampleStart
    // Maps lengths into a new hash set, removing duplicates
    val result = numbers.mapTo(HashSet()) { it.length }
    println("Distinct item lengths are $result")
    // Distinct item lengths are [3, 4, 5]
//sampleEnd
}
```
{kotlin-runnable="true"}

You can use functions with destination for filtering, association, grouping, flattening, and other operations. For the
complete list of destination operations, see the [Kotlin collections reference](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html).

## Write operations

Mutable collections also support write operations, which change the state of the collection. These operations add, remove,
and update elements, and reorder a mutable list in place.

For details, see [](collection-write.md), which covers the operations available on `MutableCollection`, the index-based
operations of `MutableList`, and the key-based operations of `MutableMap`.
