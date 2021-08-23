[//]: # (title: Iterators)

For traversing collection elements, the Kotlin standard library supports the commonly used mechanism of _iterators_ –
objects that provide access to the elements sequentially without exposing the underlying structure of the collection.
Iterators are useful when you need to process all the elements of a collection one-by-one, for example, print values or
make similar updates to them.

Iterators can be obtained for inheritors of the [`Iterable<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)
interface, including `Set` and `List`, by calling the [`iterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/iterator.html)
function.

Once you obtain an iterator, it points to the first element of a collection; calling the [`next()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterator/next.html)
function returns this element and moves the iterator position to the following element if it exists.

Once the iterator passes through the last element, it can no longer be used for retrieving elements; neither can it be
reset to any previous position. To iterate through the collection again, create a new iterator.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val numbersIterator = numbers.iterator()
    while (numbersIterator.hasNext()) {
        println(numbersIterator.next())
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Another way to go through an `Iterable` collection is the well-known `for` loop. When using `for` on a collection, you
obtain the iterator implicitly. So, the following code is equivalent to the example above:

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    for (item in numbers) {
        println(item)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Finally, there is a useful `forEach()` function that lets you automatically iterate a collection and execute the given
code for each element. So, the same example would look like this:

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    numbers.forEach {
        println(it)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## List iterators

For lists, there is a special iterator implementation: [`ListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/index.html).
It supports iterating lists in both directions: forwards and backwards.

Backward iteration is implemented by the functions [`hasPrevious()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/has-previous.html)
and [`previous()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous.html).
Additionally, the `ListIterator` provides information about the element indices with the functions [`nextIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/next-index.html)
and [`previousIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous-index.html).

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val listIterator = numbers.listIterator()
    while (listIterator.hasNext()) listIterator.next()
    println("Iterating backwards:")
    while (listIterator.hasPrevious()) {
        print("Index: ${listIterator.previousIndex()}")
        println(", value: ${listIterator.previous()}")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Having the ability to iterate in both directions, means the `ListIterator` can still be used after it reaches the last element.

## Mutable iterators

For iterating mutable collections, there is [`MutableIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/index.html)
that extends `Iterator` with the element removal function [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/remove.html).
So, you can remove elements from a collection while iterating it. 

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four") 
    val mutableIterator = numbers.iterator()
    
    mutableIterator.next()
    mutableIterator.remove()    
    println("After removal: $numbers")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

In addition to removing elements, the [`MutableListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/index.html)
can also insert and replace elements while iterating the list.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "four", "four") 
    val mutableListIterator = numbers.listIterator()
    
    mutableListIterator.next()
    mutableListIterator.add("two")
    mutableListIterator.next()
    mutableListIterator.set("three")   
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

