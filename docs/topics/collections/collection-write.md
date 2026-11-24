[//]: # (title: Change collections)

[Mutable collections](collections-overview.md#read-only-and-mutable-collections) support operations for changing the collection contents, for example, adding or removing elements.
This page describes operations available for all implementations of `MutableCollection`, alongside the index-based operations
of `MutableList` and the key-based operations of `MutableMap`:

| Goal | Mutable collections | Mutable lists | Mutable maps |
|------|---------------------|---------------|--------------|
| [Add](#add-elements) | `add()`, `addAll()`, `+=` | `add(index, element)`,<br/>`addAll(index, elements)` | `put()`, `putAll()`,<br/>`[key] =`, `+=`, `getOrPut()` |
| [Remove](#remove-elements) | `remove()`, `removeAll()`,<br/>`retainAll()`, `clear()`, `-=` | `removeAt()` | `remove()`, `keys.remove()`,<br/>`values.remove()`, `-=` |
| [Update](#update-elements) | | `set()`, `[index] =`,<br/>`fill()` | `put()`, `[key] =` |
| [Reorder](#reorder-elements) | | `sort*()`, `shuffle()`,<br/>`reverse()` | |

For other type-specific operations, see [](list-operations.md) and [](map-operations.md).

## Add elements

To add a single element to a list or a set, use the [`add()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-mutable-list/add.html) function. It appends the specified object to the end
of the collection:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    println(numbers)
    // [1, 2, 3, 4, 5]
//sampleEnd
}
```
{kotlin-runnable="true"}

To add every element of another object to a list or a set, use the [`addAll()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/add-all.html) function. The argument can be an `Iterable`,
a `Sequence`, or an `Array`, and its type doesn't have to match the receiver. For example, you can add all items
of a `Set` to a `List`. If the receiver is a list, `addAll()` preserves the order of the argument:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 5, 6)
    numbers.addAll(arrayOf(7, 8))
    println(numbers)
    // [1, 2, 5, 6, 7, 8]
//sampleEnd
}
```
{kotlin-runnable="true"}

> You can also append elements using the in-place [`plusAssign`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/plus-assign.html) (`+=`) operator.
> Learn more in [Combine collections](collection-combine.md#add-and-remove-elements).
>
{style="tip"}

### Add elements at a specific index

With `MutableList`, you can add elements at a specific position. For that, pass the index as the first argument of `add()` or `addAll()`.
The functions place the new element at the specified index. The elements that follow shift toward the end of the list:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "five", "six")
    numbers.add(1, "two")
    numbers.addAll(2, listOf("three", "four"))
    println(numbers)
    // [one, two, three, four, five, six]
//sampleEnd
}
```
{kotlin-runnable="true"}

### Add and update map entries

Maps address their elements by key, so their write operations follow two rules:

* You can change values, but you can't change the keys. Once you add an entry, its key is constant.
* Each key maps to exactly one value. You add and remove whole entries.

To add a new entry to a mutable map, use the [`put()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-mutable-map/put.html) function. In a `LinkedHashMap`, the default map implementation,
a new entry comes last when you iterate the map. In a sorted map, the order of the keys defines the positions of the new entry:

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    println(numbersMap)
    // {one=1, two=2, three=3}
//sampleEnd
}
```
{kotlin-runnable="true"}

To add multiple entries at a time, use the [`putAll()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/put-all.html) function.
Its argument can be a `Map` or a group of pairs: an `Iterable`, a `Sequence`, or an `Array`:

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.putAll(setOf("four" to 4, "five" to 5))
    println(numbersMap)
    // {one=1, two=2, three=3, four=4, five=5}
//sampleEnd
}
```
{kotlin-runnable="true"}

If a key already exists, `put()` and `putAll()` overwrite its value. Therefore, you can use them to update entries.
The `put()` function returns the previous value of the key, or `null` if the key is new:

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    val previousValue = numbersMap.put("one", 11)
    println("value associated with 'one', before: $previousValue, after: ${numbersMap["one"]}")
    // value associated with 'one', before: 1, after: 11
//sampleEnd
}
```
{kotlin-runnable="true"}

You can also add or update an entry using the indexed access operator `[]`, a shorthand for `put()`:

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    // Calls numbersMap.put("three", 3)
    numbersMap["three"] = 3
    println(numbersMap)
    // {one=1, two=2, three=3}
//sampleEnd
}
```
{kotlin-runnable="true"}

To add a pair or another map to a mutable map, use the [`plusAssign`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/plus-assign.html) (`+=`) operator.
If a key already exists, `+=` overwrites its value:

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap += "three" to 3
    numbersMap += mapOf("four" to 4, "one" to 11)
    println(numbersMap)
    // {one=11, two=2, three=3, four=4}
//sampleEnd
}
```
{kotlin-runnable="true"}

### Add default values for missing entries

To return an existing value or add a default value when no value is available, use the [`getOrPut()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/get-or-put.html) extension function.
If the key is missing or has a `null` value, `getOrPut()` stores the default value and returns it.

For maps with nullable values, you can use the following functions to control how `null` is treated:

* [`getOrPutIfNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/get-or-put-if-null.html) behaves like `getOrPut()`: it uses the default value if the key is missing or has a `null` value.
* [`getOrPutIfMissing()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/get-or-put-if-missing.html) uses the default value only if the key is missing, and keeps a stored `null`.

> The `getOrPutIfNull()` and `getOrPutIfMissing()` functions are [Experimental](components-stability.md#stability-levels-explained).
> To opt in, use the `@OptIn(ExperimentalStdlibApi::class)` annotation.
>
{style="warning"}

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
//sampleStart
    val mapForNull = mutableMapOf<String, Int?>("one" to null)
    val mapForMissing = mutableMapOf<String, Int?>("one" to null)

    // Replaces the value if "one" has a null value
    mapForNull.getOrPutIfNull("one") { 1 }

    println(mapForNull)
    // {one=1}

    // Keeps the null value because "one" exists in the map
    mapForMissing.getOrPutIfMissing("one") { 1 }

    println(mapForMissing)
    // {one=null}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4"}

## Remove elements

To remove an element from a mutable collection, use the [`remove()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/remove.html) function. It accepts the element value and removes
its first occurrence. If the collection doesn't contain the value, nothing happens:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    // Removes the first `3`
    numbers.remove(3)
    println(numbers)
    // [1, 2, 4, 3]

    // Removes nothing
    numbers.remove(5)
    println(numbers)
    // [1, 2, 4, 3]
//sampleEnd
}
```
{kotlin-runnable="true"}

To remove multiple elements at once, use the following functions:

* [`removeAll()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/remove-all.html) removes all elements that the argument collection contains.
  Alternatively, you can call it with a predicate as an argument. In this case, the function removes all elements for which
  the predicate returns `true`.
* [`retainAll()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/retain-all.html) is the opposite of `removeAll()`: it removes all elements except the ones in the argument collection.
  With a predicate, it keeps only elements that match.
* [`clear()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-mutable-list/clear.html) removes all elements and keeps the collection empty.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.retainAll { it >= 3 }
    println(numbers)
    // [3, 4]

    numbers.clear()
    println(numbers)
    // []

    val numbersSet = mutableSetOf("one", "two", "three", "four")
    numbersSet.removeAll(setOf("one", "two"))
    println(numbersSet)
    // [three, four]
//sampleEnd
}
```
{kotlin-runnable="true"}

> Learn how to remove elements with the in-place [`minusAssign`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/minus-assign.html) (`-=`) operator in [Combine collections](collection-combine.md#add-and-remove-elements).
>
{style="tip"}

### Remove elements at a specific index

You can remove an element from a mutable list by its index using the [`removeAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-mutable-list/remove-at.html) function.
All indices of elements that follow decrease by one:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.removeAt(1)
    println(numbers)
    // [1, 3, 4, 3]
//sampleEnd
}
```
{kotlin-runnable="true"}

### Remove map entries

To remove an entry from a mutable map, use the [`remove()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-mutable-map/remove.html) function. Pass a key or a key and a value. If you specify
both the key and value, the function removes the entry only if its value matches the second argument:

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)

    numbersMap.remove("one")
    println(numbersMap)
    // {two=2, three=3}

    // Removes nothing, because the value doesn't match
    numbersMap.remove("three", 4)
    println(numbersMap)
    // {two=2, three=3}
//sampleEnd
}
```
{kotlin-runnable="true"}

You can also remove entries using the `keys` and `values` map properties. If you call `remove()` on `values`, the function
removes only the first entry with the given value:

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3, "threeAgain" to 3)

    numbersMap.keys.remove("one")
    println(numbersMap)
    // {two=2, three=3, threeAgain=3}

    numbersMap.values.remove(3)
    println(numbersMap)
    // {two=2, threeAgain=3}
//sampleEnd
}
```
{kotlin-runnable="true"}

To remove entries by key, use the [`minusAssign`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/minus-assign.html) (`-=`) operator.
The right-hand operand can be a single key or a collection of keys. Keys that the map doesn't contain don't affect the operation:

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap -= "two"
    println(numbersMap)
    // {one=1, three=3}

    // Removes nothing, because the map doesn't contain "five"
    numbersMap -= "five"
    println(numbersMap)
    // {one=1, three=3}
//sampleEnd
}
```
{kotlin-runnable="true"}

## Update elements

Only collections that address their elements by index or key support in-place updates. For sets, updating an element means
removing one element and adding another, so sets don't have update operations. For maps, use the `put()` function or the
`[]` operator as described in [](#add-and-update-map-entries).

To replace the element at a specified index in a mutable list, use the [`set()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-mutable-list/set.html) function or its operator form `[]`. The
indices of other elements don't change:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "five", "three")
    numbers[1] = "two"
    println(numbers)
    // [one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true"}

You can also replace every element of a list with the same value using the [`fill()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/fill.html) function:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.fill(3)
    println(numbers)
    // [3, 3, 3, 3]
//sampleEnd
}
```
{kotlin-runnable="true"}

## Change collections while iterating

Kotlin provides [`MutableIterator`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-mutable-iterator/index.html), which lets you change a collection through its [iterator](iterators.md).

`MutableIterator` extends `Iterator` with the [`remove()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-mutable-iterator/remove.html) function, which removes the element returned
by the last call to the `next()` function:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val mutableIterator = numbers.iterator()

    mutableIterator.next()
    mutableIterator.remove()
    println("After removal: $numbers")
    // After removal: [two, three, four]
//sampleEnd
}
```
{kotlin-runnable="true"}

[`MutableListIterator`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-mutable-list-iterator/index.html) can also insert and replace elements while iterating a list by using the [`add()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-mutable-list-iterator/add.html)
and [`set()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-mutable-list-iterator/set.html) functions.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "four", "four")
    val mutableListIterator = numbers.listIterator()

    mutableListIterator.next()
    mutableListIterator.add("two")
    println(numbers)
    // [one, two, four, four]

    mutableListIterator.next()
    mutableListIterator.set("three")
    println(numbers)
    // [one, two, three, four]
//sampleEnd
}
```
{kotlin-runnable="true"}

> If you modify a collection in any other way while iterating it, the iterator may fail with a `ConcurrentModificationException`
> on its next call.
>
{style="note"}

## Reorder elements

[Ordering functions](collection-ordering.md) can retrieve collection elements in specific orders.
For mutable lists, the standard library provides the same operations in place. These functions return [`Unit`](functions.md#unit-returning-functions) and change the list.
They have similar names to the functions that apply to read-only lists, but without the `ed/d` suffix:

| Reorders in place | Returns a new list |
|-------------------|--------------------|
| [`sort()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sort.html), [`sortDescending()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sort-descending.html),<br/>[`sortBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sort-by.html), [`sortByDescending()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sort-by-descending.html),<br/>[`sortWith()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sort-with.html)   | [`sorted()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sorted.html), [`sortedDescending()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sorted-descending.html),<br/>[`sortedBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sorted-by.html), [`sortedByDescending()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sorted-by-descending.html),<br/>[`sortedWith()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sorted-with.html) |
| [`shuffle()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/shuffle.html)  | [`shuffled()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/shuffled.html)  |
| [`reverse()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reverse.html)  | [`reversed()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reversed.html)  |

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")

    numbers.sort()
    println("Sort into ascending: $numbers")
    // Sort into ascending: [four, one, three, two]

    numbers.sortDescending()
    println("Sort into descending: $numbers")
    // Sort into descending: [two, three, one, four]

    numbers.sortBy { it.length }
    println("Sort into ascending by length: $numbers")
    // Sort into ascending by length: [two, one, four, three]

    numbers.sortByDescending { it.last() }
    println("Sort into descending by the last letter: $numbers")
    // Sort into descending by the last letter: [four, two, one, three]

    numbers.sortWith(compareBy<String> { it.length }.thenBy { it })
    println("Sort by Comparator: $numbers")
    // Sort by Comparator: [one, two, four, three]

    numbers.shuffle()
    println("Shuffle: $numbers")
    // The output varies

    numbers.reverse()
    println("Reverse: $numbers")
    // The output varies
//sampleEnd
}
```
{kotlin-runnable="true"}

You can also work with a list back to front without reordering it. For that, use the [`asReversed()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/as-reversed.html) function. When
called on a mutable list, it returns a reversed view of the original list. Changes in that view appear in the original list:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()

    reversedNumbers[0] = "FOUR"
    println(reversedNumbers)
    // [FOUR, three, two, one]
    println(numbers)
    // [one, two, three, FOUR]
//sampleEnd
}
```
{kotlin-runnable="true"}

> If you use the `asReversed()` function on a read-only list, it returns a read-only view. This also reflects later changes
> to the original list. If you need an independent copy, use the [`reversed()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reversed.html) function.
>
{style="note"}
