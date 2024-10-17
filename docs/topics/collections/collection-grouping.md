[//]: # (title: Grouping)

The Kotlin standard library provides extension functions for grouping collection elements.
The basic function [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) takes a
lambda function and returns a `Map`. In this map, each key is the lambda result, and the corresponding value is the `List`
of elements on which this result is returned. This function can be used, for example, to group a list of `String`s by
their first letter. 

You can also call `groupBy()` with a second lambda argument – a value transformation function.
In the result map of `groupBy()` with two lambdas, the keys produced by `keySelector` function are mapped to the results
of the value transformation function instead of the original elements.

This example illustrates using the `groupBy()` function to group the strings by their first letter, iterating through
the groups on the resulting `Map` with the `for` operator, and then transforming the values to uppercase using the `keySelector` function:

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    // Groups the strings by their first letter using groupBy()
    val groupedByFirstLetter = numbers.groupBy { it.first().uppercase() }
    println(groupedByFirstLetter)
    // {O=[one], T=[two, three], F=[four, five]}

    // Iterates through each group and prints the key and its associated values
    for ((key, value) in groupedByFirstLetter) {
        println("Key: $key, Values: $value")
    }
    // Key: O, Values: [one]
    // Key: T, Values: [two, three]
    // Key: F, Values: [four, five]

    // Groups the strings by their first letter and transforms the values to uppercase
    val groupedAndTransformed = numbers.groupBy(keySelector = { it.first() }, valueTransform = { it.uppercase() })
    println(groupedAndTransformed)
    // {o=[ONE], t=[TWO, THREE], f=[FOUR, FIVE]}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If you want to group elements and then apply an operation to all groups at one time, use the function [`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html).
It returns an instance of the [`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html)
type. The `Grouping` instance lets you apply operations to all groups in a lazy manner: the groups are actually built
right before the operation execution.

Namely, `Grouping` supports the following operations:

* [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html) counts the elements in each group.
* [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) and [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)
  perform [fold and reduce](collection-aggregate.md#fold-and-reduce) operations on each group as a separate collection
  and return the results.
* [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html) applies a given operation
  subsequently to all the elements in each group and returns the result.
  This is the generic way to perform any operations on a `Grouping`. Use it to implement custom operations when fold or reduce are not enough.

You can use the `for` operator on the resulting `Map` to iterate through the groups created by the `groupingBy()` function.
This allows you to access each key and the count of elements associated with that key.

The following example demonstrates how to group strings by their first letter using the `groupingBy()` function,
count the elements in each group, and then iterate through each group to print the key and count of elements:

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    // Groups the strings by their first letter using groupingBy() and counts the elements in each group
    val grouped = numbers.groupingBy { it.first() }.eachCount()

    // Iterates through each group and prints the key and its associated values
    for ((key, count) in grouped) {
        println("Key: $key, Count: $count")
        // Key: o, Count: 1
        // Key: t, Count: 2
        // Key: f, Count: 2
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
