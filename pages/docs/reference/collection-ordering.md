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

First, there is _natural_ order. It is defined for inheritors of the `Comparable` interface.
Natural order is used for sorting them when no other order is specified.

Most built-in types are comparable:

* Numeric types use the traditional numerical order: `1` is greater than `0`; `-3.4f` is greater than `-5f`, an so on.
* `Char` and `String` use the [lexicographical order](https://en.wikipedia.org/wiki/Lexicographical_order): `b` is greater than `a`; `world` is greater than `hello`.

To define a natural order for a user-defined type, make the type an inheritor of `Comparable`.
This requires implementing the `compareTo()` function. `compareTo()` must take another object of the same type as an argument and return an integer value showing which object is greater:

* Positive values show that the receiver object is greater.
* Negative values show that it's less than the argument.
* Zero shows that the objects are equal.

Below is a class that can be used for ordering versions that consist of the major and the minor part.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
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
//sampleEnd
}

```
</div>

_Custom_ orders let you sort instances of any type in a way you like.
Particularly, you can define an order for non-comparable objects or define an order other than natural for a comparable type.
To define a custom order for a type, create a `Comparator` for it.
`Comparator` contains the `compare()` function: it takes two instances of a class and returns the integer result of the comparison between them.
The result is interpreted in the same way as the result of a `compareTo()` as is described above. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val lengthComparator = Comparator { o1: String, o2: String -> o1.length - o2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))
//sampleEnd
}

```
</div>

Having the `lengthComparator`, you are able to arrange strings by their length instead of the default alphanumeric order.

A shorter way to define a `Comparator` is the `compareBy()` function from the standard library.
`compareBy()` takes a lambda function that produces a `Comparable` value from an instance and defines the custom order as the natural order of the produced values.
With `compareBy()`, the comparator from the example above looks like this:

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
On this page, we'll describe sorting functions that apply to [read-only](collections-overview.hmtl#collection-types) collections.
These functions return their result as a new collection containing the elements of the original collection in the requested order.
To learn about functions for sorting [mutable](collections-overview.hmtl#collection-types) collections in place, see the [List specific operations](list-operations.hmtl#sorting).

## Natural order

The basic functions `sorted()` and `sortedDescending()` return elements of a collection sorted into ascending and descending sequence according to their natural order.
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
 
For sorting in custom orders or sorting non-comparable objects, there are the functions `sortedBy()` and `sortedByDescending()`.
They take a selector function that maps collection elements to `Comparable` values and sort the collection in natural order of that values.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart    
    val numbers = listOf("one", "two", "three", "four")

    val sortedNumbers = numbers.sortedBy { it.length }
    println("Sorted by length ascending: $sortedNumbers")
    val sortedbyLast = numbers.sortByDescending { it.last() }
    println("Sorted by the last letter descending: $sortedbyLast")
//sampleEnd
}

```
</div>

To define a custom order for the collection sorting, you can provide your own `Comparator`.
To do this, call the `sortedWith()` function passing in your `Comparator`.
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

You can retrieve the collection in the reversed order using the `reversed()` function. 

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

Another reversing function - `asReversed()` - returns a reversed view of the same collection instance, so it may be more lightweight and preferable than `reversed()` if the original list is not going to change. 

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

Finally, there is a shuffle function that retrieves all collection elements in a random order - `shuffled()`. You can call it without arguments or with a `Random` object.

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
