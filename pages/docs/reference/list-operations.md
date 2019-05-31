---
type: doc
layout: reference
category: "Collections"
title: "List Specific Operations"
---

# List Specific Operations

[`List`](collections-overview.html#list) is the most popular type of built-in collection in Kotlin. Index access to the elements of lists provides a powerful set of operations for lists. 

## Retrieving elements by index

Lists support all common operations for element retrieval: `elementAt()`, `first()`, `last()`, and others listed in [Retrieving Single Elements](collection-elements.html).
What is specific for lists is index access to the elements, so the simplest way to read an element is retrieving it by index.
That is done with the [`get()`](/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) function with the index passed in the argument or the shorthand `[index]` syntax.

If the list size is less than the specified index, an exception is thrown.
There are two other functions that help you avoid such exceptions: 

* [`getOrElse()`](/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) lets you provide the function for calculating the default value to return if the index isn't present in the collection.
* [`getOrNull()`](/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) returns `null` as the default value. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.get(0))
    println(numbers[0])
    //numbers.get(5)                         // exception!
    println(numbers.getOrNull(5))             // null
    println(numbers.getOrElse(5, {it}))        // 5
//sampleEnd
}

```
</div>

## Retrieving list parts

In addition to common operations for [Retrieving Collection Parts](collection-parts.html), lists provide the [`subList()`](/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html) function that returns a view of the specified elements range as a list.
Thus, if an element of the original collection changes, it also changes in the previously created sublists and vice versa.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.subList(3, 6))
//sampleEnd
}

```
</div>

## Finding element positions

### Linear search

In any lists, you can find the position of an element using the functions [`indexOf()`](/api/latest/jvm/stdlib/kotlin.collections/index-of.html) and [`lastIndexOf()`](/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html).
They return the first and the last position of an element equal to the given argument in the list.
If there are no such elements, both functions return `-1`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4, 2, 5)
    println(numbers.indexOf(2))
    println(numbers.lastIndexOf(2))
//sampleEnd
}

```
</div>

There is also a pair of functions that take a predicate and search for elements matching it:

* [`indexOfFirst()`](/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html) returns the *index of the first* element matching the predicate or `-1` if there are no such elements.
* [`indexOfLast()`](/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html) returns the *index of the last* element matching the predicate or `-1` if there are no such elements.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers.indexOfFirst { it > 2})
    println(numbers.indexOfLast { it % 2 == 1})
//sampleEnd
}

```
</div>

### Binary search in sorted lists

There is one more way to search elements in lists – [binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm).
It works significantly faster than other built-in search functions but *requires the list to be [sorted](collection-ordering.html)* in ascending order according to a certain ordering: natural or another one provided in the function parameter.
Otherwise, the result is undefined. 

To search an element in a sorted list, call the [`binarySearch()`](/api/latest/jvm/stdlib/kotlin.collections/binary-search.html) function passing the value as an argument.
If such an element exists, the function returns its index; otherwise, it returns `(-insertionPoint - 1)` where `insertionPoint` is the index where this element should be inserted so that the list remains sorted.
If there is more than one element with the given value, the search can return any of their indices.

You can also specify an index range to search in: in this case, the function searches only between two provided indices.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.sort()
    println(numbers)
    println(numbers.binarySearch("two"))  // 3
    println(numbers.binarySearch("z")) // -5
    println(numbers.binarySearch("two", 0, 2))  // -3
//sampleEnd
}

```
</div>

#### Comparator binary search

When list elements aren't `Comparable`, you should provide a [`Comparator`](/api/latest/jvm/stdlib/kotlin/-comparator.html) to use in the binary search.
The list must be sorted in ascending order according to this `Comparator`. Let's have a look at an example:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
data class Product(val name: String, val price: Double)

fun main() {
//sampleStart
    val productList = listOf(
        Product("WebStorm", 49.0),
        Product("AppCode", 99.0),
        Product("DotTrace", 129.0),
        Product("ReSharper", 149.0))

    println(productList.binarySearch(Product("AppCode", 99.0), compareBy<Product> { it.price }.thenBy { it.name }))
//sampleEnd
}

```
</div>

Here's a list of `Product` instances that aren't `Comparable` and a `Comparator` that defines the order: product `p1` precedes product `p2` if `p1`'s  price is less than `p2`'s price.
So, having a list sorted ascending according to this order, we use `binarySearch()` to find the index of the specified `Product`.

Custom comparators are also handy when a list uses an order different from natural one, for example, a case-insensitive order for `String` elements. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 3
//sampleEnd
}

```
</div>

#### Comparison binary search

Binary search with _comparison_ function lets you find elements without providing explicit search values.
Instead, it takes a comparison function mapping elements to `Int` values and searches for the element where the function returns zero.
The list must be sorted in the ascending order according to the provided function; in other words, the return values of comparison must grow from one list element to the next one.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlin.math.sign
//sampleStart
data class Product(val name: String, val price: Double)

fun priceComparison(product: Product, price: Double) = sign(product.price - price).toInt()

fun main() {
    val productList = listOf(
        Product("WebStorm", 49.0),
        Product("AppCode", 99.0),
        Product("DotTrace", 129.0),
        Product("ReSharper", 149.0))

    println(productList.binarySearch { priceComparison(it, 99.0) })
}
//sampleEnd
```
</div>

Both comparator and comparison binary search can be performed for list ranges as well.

## List write operations

In addition to the collection modification operations described in [Collection Write Operations](collection-write.html), [mutable](collections-overview.html#collection-types) lists support specific write operations.
Such operations use the index to access elements to broaden the list modification capabilities.

### Adding

To add elements to a specific position in a list, use [`add()`](/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) and [`addAll()`](/api/latest/jvm/stdlib/kotlin.collections/add-all.html) providing the position for element insertion as an additional argument.
All elements that come after the position shift to the right.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "five", "six")
    numbers.add(1, "two")
    numbers.addAll(2, listOf("three", "four"))
    println(numbers)
//sampleEnd
}

```
</div>

### Updating

Lists also offer a function to replace an element at a given position - [`set()`](/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html) and its operator form `[]`. `set()` doesn't change the indexes of other elements.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "five", "three")
    numbers[1] =  "two"
    println(numbers)
//sampleEnd
}

```
</div>

[`fill()`](/api/latest/jvm/stdlib/kotlin.collections/fill.html) simply replaces all the collection elements with the specified value.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.fill(3)
    println(numbers)
//sampleEnd
}

```
</div>


### Removing

To remove an element at a specific position from a list, use the [`removeAt()`](/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html) function providing the position as an argument.
All indices of elements that come after the element being removed will decrease by one.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)    
    numbers.removeAt(1)
    println(numbers)
//sampleEnd
}

```
</div>

### Sorting

In [Collection Ordering](collection-ordering.html), we describe operations that retrieve collection elements in specific orders.
For mutable lists, the standard library offers similar extension functions that perform the same ordering operations in place.
When you apply such an operation to a list instance, it changes the order of elements in that exact instance.

The in-place sorting functions have similar names to the functions that apply to read-only lists, but without the `ed/d` suffix:

*  `sort*` instead of `sorted*` in the names of all sorting functions: [`sort()`](/api/latest/jvm/stdlib/kotlin.collections/sort.html), [`sortDescending()`](/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html), [`sortBy()`](/api/latest/jvm/stdlib/kotlin.collections/sort-by.html), and so on.
* [`shuffle()`](/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) instead of `shuffled()`.
* [`reverse()`](/api/latest/jvm/stdlib/kotlin.collections/reverse.html) instead of `reversed()`.

[`asReversed()`](/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) called on a mutable list returns another mutable list which is a reversed view of the original list. Changes in that view are reflected in the original list.
The following example shows sorting functions for mutable lists:


<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")

    numbers.sort()
    println("Sort into ascending: $numbers")
    numbers.sortDescending()
    println("Sort into descending: $numbers")

    numbers.sortBy { it.length }
    println("Sort into ascending by length: $numbers")
    numbers.sortByDescending { it.last() }
    println("Sort into descending by the last letter: $numbers")
    
    numbers.sortWith(compareBy<String> { it.length }.thenBy { it })
    println("Sort by Comparator: $numbers")

    numbers.shuffle()
    println("Shuffle: $numbers")

    numbers.reverse()
    println("Reverse: $numbers")
//sampleEnd
}

```
</div>




