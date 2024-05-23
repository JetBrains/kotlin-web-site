[//]: # (title: Grouping)

The Kotlin standard library provides extension functions for grouping collection elements.
The basic function [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) takes a
lambda function and returns a `Map`. In this map, each key is the lambda result and the corresponding value is the `List`
of elements on which this result is returned. This function can be used, for example, to group a list of `String`s by
their first letter. 

You can also call `groupBy()` with a second lambda argument – a value transformation function.
In the result map of `groupBy()` with two lambdas, the keys produced by `keySelector` function are mapped to the results
of the value transformation function instead of the original elements.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    println(numbers.groupBy { it.first().uppercase() })
    println(numbers.groupBy(keySelector = { it.first() }, valueTransform = { it.uppercase() }))
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

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.groupingBy { it.first() }.eachCount())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To iterate through the groups created by the `groupBy()` function, you can use the [`forEach`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/for-each.html) function on the resulting `Map`.
This allows you to access each key and the list of elements associated with that key.

Let's look at an example where we group the strings by their first letter, convert it to uppercase,
and then iterate through each group to print the key and its associated values:

```kotlin
fun main() {
    val numbers = listOf("one", "two", "three", "four", "five")

    // Groups the strings by their first letter using groupBy and converts it to uppercase
    val grouped = numbers.groupBy { it.first().uppercase() }

    // Iterates through each group and prints the key and its associated values
    grouped.forEach { (key, value) ->
        println("Key: $key, Values: $value")
    }
    // Key: the first letter of the strings in uppercase
    // Values: the list of strings that start with the key letter

    // Groups the strings by their first letter and counts the elements in each group
    println(numbers.groupingBy { it.first() }.eachCount())
}
```
{kotlin-runnable="true"}
