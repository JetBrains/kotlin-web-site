---
type: doc
layout: reference
category: "Collections"
title: "Aggregate Operations"
---

# Collection Aggregate Operations

Kotlin collections contain functions for commonly used _aggregate operations_ – operations that return a single value based on the collection content.
Most of them are well known and work the same way as they do in other languages:

* [`min()`](/api/latest/jvm/stdlib/kotlin.collections/min.html) and [`max()`](/api/latest/jvm/stdlib/kotlin.collections/max.html) return the smallest and the largest element respectively;
* [`average()`](/api/latest/jvm/stdlib/kotlin.collections/average.html) returns the average value of elements in the collection of numbers;
* [`sum()`](/api/latest/jvm/stdlib/kotlin.collections/sum.html) returns the sum of elements in the collection of numbers;
* [`count()`](/api/latest/jvm/stdlib/kotlin.collections/count.html) returns the number of elements in a collection;

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(6, 42, 10, 4)

    println("Count: ${numbers.count()}")
    println("Max: ${numbers.max()}")
    println("Min: ${numbers.min()}")
    println("Average: ${numbers.average()}")
    println("Sum: ${numbers.sum()}")
//sampleEnd
}
```
</div>

There are also functions for retrieving the smallest and the largest elements by certain selector function or custom [`Comparator`](/api/latest/jvm/stdlib/kotlin/-comparator/index.html):

* [`maxBy()`](/api/latest/jvm/stdlib/kotlin.collections/max-by.html)/[`minBy()`](/api/latest/jvm/stdlib/kotlin.collections/min-by.html) take a selector function and return the element for which it returns the largest or the smallest value.
* [`maxWith()`](/api/latest/jvm/stdlib/kotlin.collections/max-with.html)/[`minWith()`](/api/latest/jvm/stdlib/kotlin.collections/min-with.html) take a `Comparator` object and return the largest or smallest element according to that `Comparator`. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 42, 10, 4)
    val min3Remainder = numbers.minBy { it % 3 }
    println(min3Remainder)

    val strings = listOf("one", "two", "three", "four")
    val longestString = strings.maxWith(compareBy { it.length })
    println(longestString)
//sampleEnd
}
```
</div>

Additionally, there are advanced summation functions that take a function and return the sum of its return values on all elements: 

* [`sumBy()`](/api/latest/jvm/stdlib/kotlin.collections/sum-by.html) applies functions that return `Int` values on collection elements.
* [`sumByDouble()`](/api/latest/jvm/stdlib/kotlin.collections/sum-by-double.html) works with functions that return `Double`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart    
    val numbers = listOf(5, 42, 10, 4)
    println(numbers.sumBy { it * 2 })
    println(numbers.sumByDouble { it.toDouble() / 2 })
//sampleEnd
}
```
</div>

## Fold and reduce

For more specific cases, there are the functions [`reduce()`](/api/latest/jvm/stdlib/kotlin.collections/reduce.html) and [`fold()`](/api/latest/jvm/stdlib/kotlin.collections/fold.html) that apply the provided operation to the collection elements sequentially and return the accumulated result.
The operation takes two arguments:  the previously accumulated value and the collection element.

The difference between the two functions is that `fold()` takes an initial value and uses it as the accumulated value on the first step, whereas the first step of `reduce()` uses the first and the second elements as operation arguments on the first step.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)

    val sum = numbers.reduce { sum, element -> sum + element }
    println(sum)
    val sumDoubled = numbers.fold(0) { sum, element -> sum + element * 2 }
    println(sumDoubled)

    //val sumDoubledReduce = numbers.reduce { sum, element -> sum + element * 2 } //incorrect: the first element isn't doubled in the result
    //println(sumDoubledReduce)
//sampleEnd
}
```
</div>

The example above shows the difference: `fold()` is used for calculating the sum of doubled elements.
If you pass the same function to `reduce()`, it will return another result because it uses the list's first and second elements as arguments on the first step, so the first element won't be doubled.

To apply a function to elements in the reverse order, use functions [`reduceRight()`](/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html) and [`foldRight()`](/api/latest/jvm/stdlib/kotlin.collections/fold-right.html).
They work in a way similar to `fold()` and `reduce()` but start from the last element and then continue to previous.
Note that when folding or reducing right, the operation arguments change their order: first goes the element, and then the accumulated value.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)
    val sumDoubledRight = numbers.foldRight(0) { element, sum -> sum + element * 2 }
    println(sumDoubledRight)
//sampleEnd
}
```
</div>

You can also apply operations that take element indices as parameters.
For this purpose, use functions [`reduceIndexed()`](/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html) and [`foldIndexed()`](/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html) passing element index as the first argument of the operation. 

Finally, there are functions that apply such operations to collection elements from right to left - [`reduceRightIndexed()`](/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html) and [`foldRightIndexed()`](/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html). 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)
    val sumEven = numbers.foldIndexed(0) { idx, sum, element -> if (idx % 2 == 0) sum + element else sum }
    println(sumEven)

    val sumEvenRight = numbers.foldRightIndexed(0) { idx, element, sum -> if (idx % 2 == 0) sum + element else sum }
    println(sumEvenRight)
//sampleEnd
}
```
</div>

