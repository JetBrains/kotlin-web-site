[//]: # (title: Retrieve collection parts)

The Kotlin standard library contains extension functions for retrieving parts of a collection.
These functions provide a variety of ways to select elements for the result collection: listing their positions explicitly,
specifying the result size, and others. 

## Slice

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html) returns a list of the collection
elements with given indices. The indices may be passed either as a [range](ranges.md) or as a collection of integer values. 

```kotlin

fun main() {
//sampleStart    
    val numbers = listOf("one", "two", "three", "four", "five", "six")    
    println(numbers.slice(1..3))
    println(numbers.slice(0..4 step 2))
    println(numbers.slice(setOf(3, 5, 0)))    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Take and drop

To get the specified number of elements starting from the first, use the [`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html) function.
For getting the last elements, use [`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html).
When called with a number larger than the collection size, both functions return the whole collection.  

To take all the elements except a given number of first or last elements, call the [`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html)
and [`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html) functions respectively. 

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.take(3))
    println(numbers.takeLast(3))
    println(numbers.drop(1))
    println(numbers.dropLast(5))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also use predicates to define the number of elements for taking or dropping.
There are four functions similar to the ones described above:

* [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html) is `take()` with a predicate: it takes the elements up to but excluding the first one not matching the predicate. If the first collection element doesn't match the predicate, the result is empty.
* [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html) is similar to `takeLast()`: it takes the range of elements matching the predicate from the end of the collection. The first element of the range is the element next to the last element not matching the predicate. If the last collection element doesn't match the predicate, the result is empty;
* [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html) is the opposite to `takeWhile()` with the same predicate: it returns the elements from the first one not matching the predicate to the end.
* [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html) is the opposite to `takeLastWhile()` with the same predicate: it returns the elements from the beginning to the last one not matching the predicate.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.takeWhile { !it.startsWith('f') })
    println(numbers.takeLastWhile { it != "three" })
    println(numbers.dropWhile { it.length == 3 })
    println(numbers.dropLastWhile { it.contains('i') })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Chunked

To break a collection onto parts of a given size, use the [`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html) function.
`chunked()` takes a single argument – the size of the chunk – and returns a `List` of `List`s of the given size.
The first chunk starts from the first element and contains the `size` elements, the second chunk holds the next `size` elements,
and so on. The last chunk may have a smaller size. 

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.chunked(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also apply a transformation for the returned chunks right away.
To do this, provide the transformation as a lambda function when calling `chunked()`.
The lambda argument is a chunk of the collection. When `chunked()` is called with a transformation,
the chunks are short-living `List`s that should be consumed right in that lambda.  

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList() 
    println(numbers.chunked(3) { it.sum() })  // `it` is a chunk of the original collection
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Windowed

You can retrieve all possible ranges of the collection elements of a given size.
The function for getting them is called [`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html):
it returns a list of element ranges that you would see if you were looking at the collection through a sliding window of the given size.
Unlike `chunked()`,  `windowed()` returns element ranges (_windows_) starting from *each* collection element.
All the windows are returned as elements of a single `List`.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.windowed(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`windowed()` provides more flexibility with optional parameters:

* `step` defines a distance between first elements of two adjacent windows. By default the value is 1, so the result contains windows starting from all elements. If you increase the step to 2, you will receive only windows starting from odd elements: first, third, and so on.
* `partialWindows` includes windows of smaller sizes that start from the elements at the end of the collection. For example, if you request windows of three elements, you can't build them for the last two elements. Enabling `partialWindows` in this case includes two more lists of sizes 2 and 1.

Finally, you can apply a transformation to the returned ranges right away.
To do this, provide the transformation as a lambda function when calling `windowed()`.

```kotlin

fun main() {
//sampleStart
    val numbers = (1..10).toList()
    println(numbers.windowed(3, step = 2, partialWindows = true))
    println(numbers.windowed(3) { it.sum() })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To build two-element windows, there is a separate function - [`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html).
It creates pairs of adjacent elements of the receiver collection.
Note that `zipWithNext()` doesn't break the collection into pairs; it creates a `Pair` for _each_ element except the last
one, so its result on `[1, 2, 3, 4]` is `[[1, 2], [2, 3], [3, 4]]`, not `[[1, 2`], `[3, 4]]`.
`zipWithNext()` can be called with a transformation function as well; it should take two elements of the receiver collection
as arguments.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.zipWithNext())
    println(numbers.zipWithNext() { s1, s2 -> s1.length > s2.length})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
