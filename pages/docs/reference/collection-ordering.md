---
type: doc
layout: reference
category: "Collections"
title: "Ordering"
---

# Collection Ordering

The order of elements is an important aspect of certain collection types.
For example, two lists of the same elements are not equal if their elements are ordered differently. 

In Kotlin, the orders of objects can be defined in several ways.

First, there is _natural_ order. It is defined for inheritors of the [`Comparable`](/api/latest/jvm/stdlib/kotlin/-comparable/index.html) interface.
Natural order is used for sorting them when no other order is specified.

Most built-in types are comparable:

* Numeric types use the traditional numerical order: `1` is greater than `0`; `-3.4f` is greater than `-5f`, and so on.
* `Char` and `String` use the [lexicographical order](https://en.wikipedia.org/wiki/Lexicographical_order): `b` is greater than `a`; `world` is greater than `hello`.

To define a natural order for a user-defined type, make the type an inheritor of `Comparable`.
This requires implementing the `compareTo()` function. `compareTo()` must take another object of the same type as an argument and return an integer value showing which object is greater:

* Positive values show that the receiver object is greater.
* Negative values show that it's less than the argument.
* Zero shows that the objects are equal.

Below is a class that can be used for ordering versions that consist of the major and the minor part.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int {
        if (this.major != other.major) {
            return this.major - other.major
        } else if (this.minor != other.minor) {
            return this.minor - other.minor
        } else return 0
    }
}

fun main() {    
    println(Version(1, 2) > Version(1, 3))
    println(Version(2, 0) > Version(1, 5))
}
```
</div>

_Custom_ orders let you sort instances of any type in a way you like.
Particularly, you can define an order for non-comparable objects or define an order other than natural for a comparable type.
To define a custom order for a type, create a [`Comparator`](/api/latest/jvm/stdlib/kotlin/-comparator/index.html) for it.
`Comparator` contains the `compare()` function: it takes two instances of a class and returns the integer result of the comparison between them.
The result is interpreted in the same way as the result of a `compareTo()` as is described above. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val lengthComparator = Comparator { str1: String, str2: String -> str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))
//sampleEnd
}

```
</div>

Having the `lengthComparator`, you are able to arrange strings by their length instead of the default lexicographical order.

A shorter way to define a `Comparator` is the [`compareBy()`](/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html) function from the standard library.
`compareBy()` takes a lambda function that produces a `Comparable` value from an instance and defines the custom order as the natural order of the produced values.
With `compareBy()`, the length comparator from the example above looks like this:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart    
println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))
//sampleEnd
}

```
</div>

The Kotlin collections package provides functions for sorting collections in natural, custom, and even random orders.
On this page, we'll describe sorting functions that apply to [read-only](collections-overview.html#collection-types) collections.
These functions return their result as a new collection containing the elements of the original collection in the requested order.
To learn about functions for sorting [mutable](collections-overview.html#collection-types) collections in place, see the [List Specific Operations](list-operations.html#sorting).

## Natural order

The basic functions [`sorted()`](/api/latest/jvm/stdlib/kotlin.collections/sorted.html) and [`sortedDescending()`](/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html) return elements of a collection sorted into ascending and descending sequence according to their natural order.
These functions apply to collections of `Comparable` elements.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println("Sorted ascending: ${numbers.sorted()}")
    println("Sorted descending: ${numbers.sortedDescending()}")
//sampleEnd
}

```
</div>

## Custom orders
 
For sorting in custom orders or sorting non-comparable objects, there are the functions [`sortedBy()`](/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html) and [`sortedByDescending()`](/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html).
They take a selector function that maps collection elements to `Comparable` values and sort the collection in natural order of that values.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val sortedNumbers = numbers.sortedBy { it.length }
    println("Sorted by length ascending: $sortedNumbers")
    val sortedByLast = numbers.sortedByDescending { it.last() }
    println("Sorted by the last letter descending: $sortedByLast")
//sampleEnd
}

```
</div>

To define a custom order for the collection sorting, you can provide your own `Comparator`.
To do this, call the [`sortedWith()`](/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html) function passing in your `Comparator`.
With this function, sorting strings by their length looks like this:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")
//sampleEnd
}

```
</div>

## Reverse order

You can retrieve the collection in the reversed order using the [`reversed()`](/api/latest/jvm/stdlib/kotlin.collections/reversed.html) function. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())
//sampleEnd
}

```
</div>

`reversed()` returns a new collection with the copies of the elements.
So, if you change the original collection later, this won't affect the previously obtained results of `reversed()`.

Another reversing function - [`asReversed()`](/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) - returns a reversed view of the same collection instance, so it may be more lightweight and preferable than `reversed()` if the original list is not going to change. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
//sampleEnd
}

```
</div>

If the original list is mutable, all its changes reflect in its reversed views and vice versa.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
    numbers.add("five")
    println(reversedNumbers)
//sampleEnd
}

```
</div>

However, if the mutability of the list is unknown or the source is not a list at all, `reversed()` is more preferable since its result is a copy that won't change in the future.

## Random order

Finally, there is a function that returns a new `List` containing the collection elements in a random order - [`shuffled()`](/api/latest/jvm/stdlib/kotlin.collections/shuffled.html).
You can call it without arguments or with a [`Random`](/api/latest/jvm/stdlib/kotlin.random/-random/index.html) object.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())
//sampleEnd
}

```
</div>
