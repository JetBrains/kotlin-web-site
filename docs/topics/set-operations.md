[//]: # (title: Set-specific operations)

The Kotlin collections package contains extension functions for popular operations on sets: finding intersections, merging,
or subtracting collections from each other.

To merge two collections into one, use the [`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html)
function. It can be used in the infix form `a union b`.
Note that for ordered collections the order of the operands is important. In the resulting collection, the elements of the
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

To find an intersection between two collections (elements present in both of them), use the [`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) function.
To find collection elements not present in another collection, use the [`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html) function. 
Both these functions can be called in the infix form as well, for example, `a intersect b`:

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

You can also apply `union()`, `intersect()`, and `subtract()` functions to lists.
However, their result is _always_ a `Set`. In this result, all the duplicate elements are merged into one and the index access is not available:

```kotlin
fun main() {
//sampleStart
    val list1 = listOf(1, 1, 2, 3, 5, 8, -1)
    val list2 = listOf(1, 1, 2, 2, 3, 5)

    // result on two lists is a Set
    println(list1 intersect list2)
    //[1, 2, 3, 5]

    // equal elements are merged into one
    println(list1 union list2)
    // [1, 2, 3, 5, 8, -1]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
