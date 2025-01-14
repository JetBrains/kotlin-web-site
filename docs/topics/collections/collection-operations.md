[//]: # (title: Collection operations overview)

The Kotlin standard library offers a broad variety of functions for performing operations on collections. This includes
simple operations, such as getting or adding elements, as well as more complex ones including search, sorting, filtering,
transformations, and so on.  

## Extension and member functions

Collection operations are declared in the standard library in two ways: [member functions](classes.md#class-members) of
collection interfaces and [extension functions](extensions.md#extension-functions). 

Member functions define operations that are essential for a collection type. For example, [`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)
contains the function [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html)
for checking its emptiness; [`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) contains
[`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) for index access to elements,
and so on.

When you create your own implementations of collection interfaces, you must implement their member functions.
To make the creation of new implementations easier, use the skeletal implementations of collection interfaces from the
standard library: [`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html), 
[`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html),
[`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html),
[`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html), and their
mutable counterparts.

Other collection operations are declared as extension functions. These are filtering, transformation, ordering, and other
collection processing functions. 

## Common operations

Common operations are available for both [read-only and mutable collections](collections-overview.md#collection-types).
Common operations fall into these groups:

* [Transformations](collection-transformations.md)
* [Filtering](collection-filtering.md)
* [`plus` and `minus` operators](collection-plus-minus.md)
* [Grouping](collection-grouping.md)
* [Retrieving collection parts](collection-parts.md)
* [Retrieving single elements](collection-elements.md)
* [Ordering](collection-ordering.md)
* [Aggregate operations](collection-aggregate.md)

Operations described on these pages return their results without affecting the original collection. For example, a filtering
operation produces a _new collection_ that contains all the elements matching the filtering predicate.
Results of such operations should be either stored in variables, or used in some other way, for example, passed in other
functions.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    numbers.filter { it.length > 3 }  // nothing happens with `numbers`, result is lost
    println("numbers are still $numbers")
    val longerThan3 = numbers.filter { it.length > 3 } // result is stored in `longerThan3`
    println("numbers longer than 3 chars are $longerThan3")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For certain collection operations, there is an option to specify the _destination_ object.
Destination is a mutable collection to which the function appends its resulting items instead of returning them in a new object.
For performing operations with destinations, there are separate functions with the `To` postfix in their names, for example,
[`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html) instead of [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 
or [`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html) instead of [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html).
These functions take the destination collection as an additional parameter.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val filterResults = mutableListOf<String>()  //destination object
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ -> index == 0 }
    println(filterResults) // contains results of both operations
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For convenience, these functions return the destination collection back, so you can create it right in the corresponding
argument of the function call:

```kotlin

fun main() {
    val numbers = listOf("one", "two", "three", "four")
//sampleStart
    // filter numbers right into a new hash set, 
    // thus eliminating duplicates in the result
    val result = numbers.mapTo(HashSet()) { it.length }
    println("distinct item lengths are $result")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Functions with destination are available for filtering, association, grouping, flattening, and other operations. For the
complete list of destination operations see the [Kotlin collections reference](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html).

## Write operations

For mutable collections, there are also _write operations_ that change the collection state. Such operations include
adding, removing, and updating elements. Write operations are listed in the [Write operations](collection-write.md) and
corresponding sections of [List-specific operations](list-operations.md#list-write-operations) and [Map specific operations](map-operations.md#map-write-operations).

For certain operations, there are pairs of functions for performing the same operation: one applies the operation in-place
and the other returns the result as a separate collection. For example, [`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)
sorts a mutable collection in-place, so its state changes; [`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)
creates a new collection that contains the same elements in the sorted order.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val sortedNumbers = numbers.sorted()
    println(numbers == sortedNumbers)  // false
    numbers.sort()
    println(numbers == sortedNumbers)  // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
