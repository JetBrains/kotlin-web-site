---
type: doc
layout: reference
category: "Collections"
title: "Grouping"
---

# Grouping

The Kotlin standard library provides extension functions for grouping collection elements.
The basic function [`groupBy()`](/api/latest/jvm/stdlib/kotlin.collections/group-by.html) takes a lambda function and returns a `Map`.
In this map, each key is the lambda result and the corresponding value is the `List` of elements on which this result is returned.
This function can be used, for example, to group a list of `String`s by their first letter. 

You can also call `groupBy()` with a second lambda argument – a value transformation function.
In the result map of `groupBy()` with two lambdas, the keys produced by `keySelector` function are mapped to the results of the value transformation function instead of the original elements.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    println(numbers.groupBy { it.first().toUpperCase() })
    println(numbers.groupBy(keySelector = { it.first() }, valueTransform = { it.toUpperCase() }))
//sampleEnd
}
```
</div>

If you want to group elements and then apply an operation to all groups at one time, use the function [`groupingBy()`](/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html).
It returns an instance of the [`Grouping`](/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html) type.
The `Grouping` instance lets you apply operations to all groups in a lazy manner: the groups are actually built right before the operation execution.

Namely, `Grouping` supports the following operations:

* [`eachCount()`](/api/latest/jvm/stdlib/kotlin.collections/each-count.html) counts the elements in each group. 
* [`fold()`](/api/latest/jvm/stdlib/kotlin.collections/fold.html) and [`reduce()`](/api/latest/jvm/stdlib/kotlin.collections/reduce.html) perform [fold and reduce](collection-aggregate.html#fold-and-reduce) operations on each group as a separate collection and return the results.
* [`aggregate()`](/api/latest/jvm/stdlib/kotlin.collections/aggregate.html) applies a given operation subsequently to all the elements in each group and returns the result.
   This is the generic way to perform any operations on a `Grouping`. Use it to implement custom operations when fold or reduce are not enough.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.groupingBy { it.first() }.eachCount())
//sampleEnd
}
```
</div>

