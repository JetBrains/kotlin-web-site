[//]: # (title: Aggregate operations)

Kotlin collections contain functions for commonly used _aggregate operations_ – operations that return a single value based
on the collection content. Most of them are well known and work the same way as they do in other languages:

* [`minOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-or-null.html) and [`maxOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-or-null.html) return the smallest and the largest element respectively. On empty collections, they return `null`.
* [`average()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/average.html) returns the average value of elements in the collection of numbers.
* [`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) returns the sum of elements in the collection of numbers.
* [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) returns the number of elements in a collection.

```kotlin

fun main() {
    val numbers = listOf(6, 42, 10, 4)

    println("Count: ${numbers.count()}")
    println("Max: ${numbers.maxOrNull()}")
    println("Min: ${numbers.minOrNull()}")
    println("Average: ${numbers.average()}")
    println("Sum: ${numbers.sum()}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

There are also functions for retrieving the smallest and the largest elements by certain selector function or custom [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html):

* [`maxByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-by-or-null.html) and [`minByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-by-or-null.html) take a selector function and return the element for which it returns the largest or the smallest value.
* [`maxWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-with-or-null.html) and [`minWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-with-or-null.html) take a `Comparator` object and return the largest or smallest element according to that `Comparator`. 

These functions return `null` on empty collections. There are also alternatives for `maxByOrNull()` and `minByOrNull()`: 
[`maxOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html) and [`minOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of.html), 
which do the same but throw a `NoSuchElementException` on empty collections.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(5, 42, 10, 4)
    val min3Remainder = numbers.minByOrNull { it % 3 }
    println(min3Remainder)

    val strings = listOf("one", "two", "three", "four")
    val longestString = strings.maxWithOrNull(compareBy { it.length })
    println(longestString)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Besides regular `sum()`, there is an advanced summation function [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)
that takes a selector function and returns the sum of its application to all collection elements. Selector can return 
different numeric types: `Int`, `Long`, `Double`, `UInt`, and `ULong` (also `BigInteger` and `BigDecimal` on the JVM).

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(5, 42, 10, 4)
    println(numbers.sumOf { it * 2 })
    println(numbers.sumOf { it.toDouble() / 2 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

## Fold and reduce

For more specific cases, there are the functions [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) and [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) that apply the provided operation to the collection elements sequentially and return the accumulated result.
The operation takes two arguments: the previously accumulated value and the collection element.

The difference between the two functions is that `fold()` takes an initial value and uses it as the accumulated value on
the first step, whereas the first step of `reduce()` uses the first and the second elements as operation arguments on the first step.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)

    val simpleSum = numbers.reduce { sum, element -> sum + element }
    println(simpleSum)
    val sumDoubled = numbers.fold(0) { sum, element -> sum + element * 2 }
    println(sumDoubled)

    //incorrect: the first element isn't doubled in the result
    //val sumDoubledReduce = numbers.reduce { sum, element -> sum + element * 2 } 
    //println(sumDoubledReduce)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The example above shows the difference: `fold()` is used for calculating the sum of doubled elements.
If you pass the same function to `reduce()`, it will return another result because it uses the list's first and second
elements as arguments on the first step, so the first element won't be doubled.

To apply a function to elements in the reverse order, use functions [`reduceRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html)
and [`foldRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right.html).
They work in a way similar to `fold()` and `reduce()` but start from the last element and then continue to previous.
Note that when folding or reducing right, the operation arguments change their order: first goes the element, and then the accumulated value.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)
    val sumDoubledRight = numbers.foldRight(0) { element, sum -> sum + element * 2 }
    println(sumDoubledRight)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also apply operations that take element indices as parameters.
For this purpose, use functions [`reduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html)
and [`foldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html) passing element
index as the first argument of the operation. 

Finally, there are functions that apply such operations to collection elements from right to left - [`reduceRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html)
and [`foldRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html). 

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

All reduce operations throw an exception on empty collections. To receive `null` instead, use their `*OrNull()` counterparts:
* [`reduceOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-or-null.html)
* [`reduceRightOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-or-null.html)
* [`reduceIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed-or-null.html)
* [`reduceRightIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed-or-null.html)

For cases where you want to save intermediate accumulator values, there are functions
[`runningFold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold.html) (or its synonym [`scan()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/scan.html)) 
and [`runningReduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce.html).

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(0, 1, 2, 3, 4, 5)
    val runningReduceSum = numbers.runningReduce { sum, item -> sum + item }
    val runningFoldSum = numbers.runningFold(10) { sum, item -> sum + item }
//sampleEnd
    val transform = { index: Int, element: Int -> "N = ${index + 1}: $element" }
    println(runningReduceSum.mapIndexed(transform).joinToString("\n", "Sum of first N elements with runningReduce:\n"))
    println(runningFoldSum.mapIndexed(transform).joinToString("\n", "Sum of first N elements with runningFold:\n"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

If you need an index in the operation parameter, use [`runningFoldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold-indexed.html)
or [`runningReduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce-indexed.html).