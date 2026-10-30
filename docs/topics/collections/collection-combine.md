[//]: # (title: Combine collections)

Kotlin provides operators and functions for adding and removing collection elements and combining collections. These
operations return a new read-only collection, leaving the original collections unchanged.

You can also modify mutable collections by adding or removing elements. For more information, see [](collection-write.md).

## Add and remove elements

In Kotlin, you can use [`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) and [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) operators to add or remove collection elements.
The first operand is a collection, and the second is either an element or another collection.
Each operator returns a new read-only collection:

* `plus` returns a collection containing the original elements and the element or elements from the second operand.
* `minus` returns a collection without the specified elements in the second operand. If that operand is an element,
  `minus` removes its first occurrence. If the second operand is a collection, `minus` removes all occurrences of its elements.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val plusList = numbers + "five"
    val minusList = numbers - listOf("three", "four")
    
    println(plusList)
    // [one, two, three, four, five]
   
    println(minusList)
    // [one, two]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also use the [augmented assignment operators](operator-overloading.md#augmented-assignments) [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) and [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) with 
collections:

* For a read-only collection stored in a variable declared with `var`, these operators use `plus` or `minus`
  and assign the resulting collection back to the variable.
* For a mutable collection stored in a variable declared with `val`, these operators use `plusAssign` or
  `minusAssign` to modify the collection in place.

For details on the `plus` and `minus` operators for maps, see [Map-specific operations](map-operations.md).

## Merge two collections

To merge two collections, use the [`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html) function. It returns a `Set` containing distinct elements from both
collections. You can also call it in infix form: `a union b`.

The result preserves the iteration order of the first collection, followed by elements from the second collection
that aren't already present, in their iteration order:

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // Swapping the collections changes the result's iteration order
    println(numbers union setOf("four", "five"))
    // [one, two, three, four, five]
    println(setOf("four", "five") union numbers)
    // [four, five, one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Find the intersection of two collections

To find elements present in both collections (their intersection), use [`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html).
To find elements present in the first collection but absent from the second, use [`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html).

Both functions return a `Set` and support infix notations (`a intersect b` and `a subtract b`):

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // Finds elements present in both collections
    println(numbers intersect setOf("two", "one"))
    // [one, two]
   
    // Excludes elements present in the second collection
    println(numbers subtract setOf("three", "four"))
    // [one, two]

    // Reordering the second collection doesn't change the result
    println(numbers subtract setOf("four", "three"))
    // [one, two]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Find elements present in only one collection

To find elements present only in one of two collections, subtract the collections from each other and combine the results with 
`union()`. This operation is called the _symmetric difference_ and returns a `Set`:

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // Combines the differences in both directions
    println((numbers - numbers2) union (numbers2 - numbers))
    // [one, two, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}