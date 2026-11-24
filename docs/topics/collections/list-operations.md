[//]: # (title: List-specific operations)

[`List`](collection-types.md#list) is the most popular type of built-in collection in Kotlin. Index access to the elements
of lists provides a powerful set of operations for lists. 

## Retrieve elements by index

Lists support all common operations for element retrieval: `elementAt()`, `first()`, `last()`, and others listed in [Retrieve single elements](collection-elements.md).
What is specific for lists is index access to the elements, so the simplest way to read an element is retrieving it by index.
That is done with the [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) function
with the index passed in the argument or the shorthand `[index]` syntax.

If the list size is less than the specified index, an exception is thrown.
There are two other functions that help you avoid such exceptions: 

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) lets you provide the function for calculating the default value to return if the index isn't present in the collection.
* [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) returns `null` as the default value. 

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
{kotlin-runnable="true"}

## Retrieve list parts

In addition to common operations for [Retrieving Collection Parts](collection-parts.md), lists provide the [`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html)
function that returns a view of the specified elements range as a list.
Thus, if an element of the original collection changes, it also changes in the previously created sublists and vice versa.

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.subList(3, 6))
//sampleEnd
}
```
{kotlin-runnable="true"}

## Find element positions

### Linear search

In any lists, you can find the position of an element using the functions [`indexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of.html) and [`lastIndexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html).
They return the first and the last position of an element equal to the given argument in the list.
If there are no such elements, both functions return `-1`.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4, 2, 5)
    println(numbers.indexOf(2))
    println(numbers.lastIndexOf(2))
//sampleEnd
}
```
{kotlin-runnable="true"}

There is also a pair of functions that take a predicate and search for elements matching it:

* [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html) returns the *index of the first* element matching the predicate or `-1` if there are no such elements.
* [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html) returns the *index of the last* element matching the predicate or `-1` if there are no such elements.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers.indexOfFirst { it > 2})
    println(numbers.indexOfLast { it % 2 == 1})
//sampleEnd
}
```
{kotlin-runnable="true"}

### Binary search in sorted lists

There is one more way to search elements in lists – [binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm).
It works significantly faster than other built-in search functions but *requires the list to be [sorted](collection-ordering.md)*
in ascending order according to a certain ordering: natural or another one provided in the function parameter.
Otherwise, the result is undefined. 

To search an element in a sorted list, call the [`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html)
function passing the value as an argument.
If such an element exists, the function returns its index; otherwise, it returns `(-insertionPoint - 1)` where `insertionPoint`
is the index where this element should be inserted so that the list remains sorted.
If there is more than one element with the given value, the search can return any of their indices.

You can also specify an index range to search in: in this case, the function searches only between two provided indices.

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
{kotlin-runnable="true"}

#### Comparator binary search

When list elements aren't `Comparable`, you should provide a [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/) to use in the binary search.
The list must be sorted in ascending order according to this `Comparator`. Let's have a look at an example:

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
{kotlin-runnable="true"}

Here's a list of `Product` instances that aren't `Comparable` and a `Comparator` that defines the order: product `p1`
precedes product `p2` if `p1`'s  price is less than `p2`'s price.
So, having a list sorted ascending according to this order, we use `binarySearch()` to find the index of the specified `Product`.

Custom comparators are also handy when a list uses an order different from natural one, for example, a case-insensitive order for `String` elements. 

```kotlin

fun main() {
//sampleStart
    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 3
//sampleEnd
}
```
{kotlin-runnable="true"}

#### Comparison binary search

Binary search with _comparison_ function lets you find elements without providing explicit search values.
Instead, it takes a comparison function mapping elements to `Int` values and searches for the element where the function returns zero.
The list must be sorted in the ascending order according to the provided function; in other words, the return values of
comparison must grow from one list element to the next one.

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
{kotlin-runnable="true"}

Both comparator and comparison binary search can be performed for list ranges as well.

## Write operations

Mutable lists support write operations that address elements by index, and operations that reorder the list in place.
For details, see [](collection-write.md).
