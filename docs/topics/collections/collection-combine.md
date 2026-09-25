[//]: # (title: Combine collections)

Kotlin provides operators and functions for adding, removing, and comparing collection elements. These operations return
a new read-only collection, leaving the original collections unchanged.

## Add and remove elements

In Kotlin, you can use [`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) and [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) operators for collections.
They take a collection as the first operand; the second operand can be either an element or another collection.
The return value is a new read-only collection:

* The result of `plus` contains the elements from the original collection _and_ from the second operand.
* The result of `minus` contains the elements of the original collection _except_ the elements from the second operand.
   If it's an element, `minus` removes its _first_ occurrence; if it's a collection, _all_ occurrences of its elements are removed.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val plusList = numbers + "five"
    val minusList = numbers - listOf("three", "four")
    println(plusList)
    println(minusList)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The [augmented assignment operators](operator-overloading.md#augmented-assignments) [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html)
(`+=`) and [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) are
also defined for collections. However, for read-only collections, they actually use the `plus` or `minus` operators and
try to assign the result to the same variable. Thus, they are available only on `var` read-only collections.
For mutable collections, they modify the collection if it's a `val`. For more details, see [Collection write operations](collection-write.md).

For the details on `plus` and `minus` operators for maps, see [Map specific operations](map-operations.md).

## Merge two collections

To merge two collections into one, use the [`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html)
function. It can be used in the infix form `a union b`.
Note that for ordered collections, the order of the operands is important. In the resulting collection, the elements of the
first operand go before the elements of the second:

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // output according to the order
    println(numbers union setOf("four", "five"))
    // [one, two, three, four, five]
    println(setOf("four", "five") union numbers)
    // [four, five, one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Unlike `plus`, `union()` removes duplicate elements and returns a `Set`.

## Find an intersection between two collections

To find an intersection between two collections (elements present in both of them), use the [`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) function.
To find collection elements not present in another collection, use the [`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html) function.
Both these functions can be called in the infix form as well, for example, `a intersect b`.

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // same output
    println(numbers intersect setOf("two", "one"))
    // [one, two]
    println(numbers subtract setOf("three", "four"))
    // [one, two]
    println(numbers subtract setOf("four", "three"))
    // [one, two]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The result is a `Set`.

## Find elements present in only one collection

To find the elements present in either one of the two collections but not in their intersection, you can also use the `union()` function.
For this operation (known as symmetric difference), calculate the differences between the two collections and merge the
results:

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // merge differences 
    println((numbers - numbers2) union (numbers2 - numbers))
    // [one, two, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The result is a `Set`.