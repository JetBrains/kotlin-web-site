---
type: doc
layout: reference
category: "Collections"
title: "Sequences"
---

# Sequences

Along with collections, the Kotlin standard library contains another container type – _sequences_ (`Sequence<T>`).
Sequences offer the same functions as `Iterable` but implement another approach to multi-step collection processing.

When the processing of an `Iterable` includes multiple steps, they are executed _eagerly_: each intermediate step completes and returns its result – an intermediate collection.
The following step executes on this collection.

In turn, multi-step processing of sequences is executed _lazily_ when possible: actual computing happens only on calling a terminal operation that returns the result of the whole processing chain, such as `toList()` or `sum()`.
If the processing chain doesn't include terminal operations, its result is a new `Sequence`. However, you can retrieve its elements only with terminal operations.

The order of operations execution is different as well: `Sequence` performs all the processing steps one-by-one for every single element.
In turn, `Iterable` completes each step for the whole collection and then proceeds to the next step. 
So, the sequences let you avoid building results of intermediate steps, therefore improving the performance of the whole collection processing chain.

However, the lazy nature of sequences adds some overhead which may be significant when processing smaller collections or doing simpler computations.
Hence, you should consider both `Sequence` and `Iterable` and decide which one is better for your case.

## Constructing

### From elements
To create a sequence, call the `sequenceOf()` function listing the elements as its arguments.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val mySequence = sequenceOf("four", "three", "two", "one")
```
</div>

### From `Iterable`
If you already have an `Iterable` object (such as a `List` or a `Set`), you can create a sequence from it by calling `asSequence()`.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val myList = listOf("one", "two", "three", "four")
val myListSequence = myList.asSequence()

```
</div>

### From function
One more way to create a sequence is by building it with a function that calculates its elements.
To build a sequence based on a function, call `generateSequence()` with this function as an argument.
Optionally, you can specify the first element as an explicit value or a result of a function call.
The sequence generation stops when the provided function returns `null`. So, the sequence in the example below is infinite.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {
//sampleStart
    val oddNumbers = generateSequence(1) { it + 2 } // `it` is the previous element
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // error: the sequence is infinite
//sampleEnd
}
```
</div>

To create a finite sequence with `generateSequence()`, provide a function that returns `null` after the last element you need.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {
//sampleStart
    val oddNumbersLessThan10 = generateSequence(1) { if (it < 10) it + 2 else null }
    println(oddNumbersLessThan10.count())
//sampleEnd
}
```
</div>

### From chunks

Finally, there is a function that lets you produce sequence elements one by one or by chunks of arbitrary sizes – the `sequence()` function.
This function takes a lambda expression containing calls of `yield()` and `yieldAll()` functions.
They return an element to the sequence consumer and suspend the execution of `sequence()` until the next element is requested by the consumer.
`yield()` takes a single element as an argument; `yieldAll()` can take an `Iterable` object, an `Iterator`, or another `Sequence`. A `Sequence` argument of `yieldAll()` can be infinite. However, such a call must be the last: all subsequent calls will never be executed.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {
//sampleStart
    val oddNumbers = sequence {
        yield(1)
        yieldAll(listOf(3, 5))
        yieldAll(generateSequence(7) { it + 2 })
    }
    println(oddNumbers.toList().take(5))
//sampleEnd
}
```
</div>

## Sequence processing example

Let's take a look at the difference between `Iterable` and `Sequence` with an example. 

Assume that you have a list of words. The code below filters the words longer than three characters and prints the lengths of first four such words.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {    
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    val lengthsList = words.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars:")
    println(lengthsList)
//sampleEnd
}
```
</div>

When you run this code, you'll see that the `filter()` and `map()` functions are executed in the same order as they appear in the code.
First, you see `filter:` for all elements, then `length:` for the elements left after filtering, and then the output of the two last lines. 
This is how the list processing goes:

![List processing]({{ url_for('asset', path='images/reference/sequences/list-processing.png') }})

Now let's write the same with sequences:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    //convert the List to a Sequence
    val wordsSequence = words.asSequence()

    val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars")
    // terminal operation: obtaining the result as a List
    println(lengthsSequence.toList())
//sampleEnd
}
```
</div>

The output of this code shows that the `filter()` and `map()` functions are called only when building the result list.
So, you first see the line of text `“Lengths of..”` and then the sequence processing starts.
Note that for elements left after filtering, the map executes before filtering the next element.
When the result size reaches 4, the processing stops because it's the largest possible size that `take(4)` can return.

The sequence processing goes like this:

![Sequences processing]({{ url_for('asset', path='images/reference/sequences/sequence-processing.png') }})

In this example, the sequence processing takes 18 steps instead of 23 steps for doing the same with lists.
