---
type: doc
layout: reference
category: Other
title: "Collections"
---

# Collections

Unlike many languages, Kotlin distinguishes between mutable and immutable collections (lists, sets, maps, etc). Precise control over exactly when collections can be edited is useful for eliminating bugs, and for designing good APIs.

It is important to understand up front the difference between a read only _view_ of a mutable collection, and an actually immutable collection. Both are easy to create, but the type system doesn't express the difference, so keeping track of that (if it's relevant) is up to you.

The Kotlin `List<out T>` type is an interface that provides read only operations like `size`, `get` and so on. Like in Java, it inherits from `Collection<T>` and that in turn inherits from `Iterable<T>`. Methods that change the list are added by the `MutableList<T>` interface. This pattern holds also for `Set<out T>/MutableSet<T>` and `Map<K, out V>/MutableMap<K, V>`.

We can see basic usage of the list and set types below:

``` kotlin
val numbers: MutableList<Int> = mutableListOf(1, 2, 3)
val readOnlyView: List<Int> = numbers
println(numbers)        // prints "[1, 2, 3]"
numbers.add(4)
println(readOnlyView)   // prints "[1, 2, 3, 4]"
readOnlyView.clear()    // -> does not compile

val strings = hashSetOf("a", "b", "c", "c")
assert(strings.size == 3)
```

Kotlin does not have dedicated syntax constructs for creating lists or sets. Use methods from the standard library, such as
`listOf()`, `mutableListOf()`, `setOf()`, `mutableSetOf()`.
For creating maps in a not performance-critical code a simple [idiom](idioms.html#read-only-map) may be used: `mapOf(a to b, c to d)`

Note that the `readOnlyView` variable points to the same list and changes as the underlying list changes. If the only references that exist to a list are of the read only variety, we can consider the collection fully immutable. A simple way to create such a collection is like this:

``` kotlin
val items = listOf(1, 2, 3)
```

Currently, the `listOf` method is implemented using an array list, but in future more memory-efficient fully immutable collection types could be returned that exploit the fact that they know they can't change.

Note that the read only types are [covariant](generics.html#variance). That means, you can take a `List<Rectangle>` and assign it to `List<Shape>` assuming Rectangle inherits from Shape. This wouldn't be allowed with the mutable collection types because it would allow for failures at runtime.

Sometimes you want to return to the caller a snapshot of a collection at a particular point in time, one that's guaranteed to not change:

``` kotlin
class Controller {
    private val _items = mutableListOf<String>()
    val items: List<String> get() = _items.toList()
}
```

The `toList` extension method just duplicates the lists items, thus, the returned list is guaranteed to never change.

There are various useful extension methods on lists and sets that are worth being familiar with:

``` kotlin
val items = listOf(1, 2, 3, 4)
items.first() == 1
items.last() == 4
items.filter { it % 2 == 0 }   // returns [2, 4]

val rwList = mutableListOf(1, 2, 3)
rwList.requireNoNulls()        // returns [1, 2, 3]
if (rwList.none { it > 6 }) println("No items above 6")  // prints "No items above 6"
val item = rwList.firstOrNull()
```

... as well as all the utilities you would expect such as sort, zip, fold, reduce and so on.

Maps follow the same pattern. They can be easily instantiated and accessed like this:

``` kotlin
val readWriteMap = hashMapOf("foo" to 1, "bar" to 2)
println(readWriteMap["foo"])  // prints "1"
val snapshot: Map<String, Int> = HashMap(readWriteMap)
```
