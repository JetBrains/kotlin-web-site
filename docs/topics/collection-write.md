[//]: # (title: Collection write operations)

[Mutable collections](collections-overview.md#collection-types) support operations for changing the collection contents, for example, adding or removing elements.
On this page, we'll describe write operations available for all implementations of `MutableCollection`.
For more specific operations available for `List` and `Map`, see [List-specific Operations](list-operations.md) and [Map Specific Operations](map-operations.md) respectively.

## Adding elements

To add a single element to a list or a set, use the [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) function. The specified object is appended to the end of the collection.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) adds every element of the argument object to a list or a set. The argument can be an `Iterable`, a `Sequence`, or an `Array`.
The types of the receiver and the argument may be different, for example, you can add all items from a `Set` to a `List`.

When called on lists, `addAll()` adds new elements in the same order as they go in the argument.
You can also call `addAll()` specifying an element position as the first argument.
The first element of the argument collection will be inserted at this position.
Other elements of the argument collection will follow it, shifting the receiver elements to the end. 

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 5, 6)
    numbers.addAll(arrayOf(7, 8))
    println(numbers)
    numbers.addAll(2, setOf(3, 4))
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also add elements using the in-place version of the [`plus` operator](collection-plus-minus.md) - [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`)
 When applied to a mutable collection, `+=` appends the second operand (an element or another collection) to the end of the collection.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two")
    numbers += "three"
    println(numbers)
    numbers += listOf("four", "five")    
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Removing elements

To remove an element from a mutable collection, use the [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) function.
`remove()` accepts the element value and removes one occurrence of this value. 

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // removes the first `3`
    println(numbers)
    numbers.remove(5)                    // removes nothing
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For removing multiple elements at once, there are the following functions :

* [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html) removes all elements that are present in the argument collection.
   Alternatively, you can call it with a predicate as an argument; in this case the function removes all elements for which the predicate yields `true`.
* [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html) is the opposite of `removeAll()`: it removes all elements except the ones from the argument collection.
   When used with a predicate, it leaves only elements that match it.
* [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html) removes all elements from a list and leaves it empty.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers)
    numbers.retainAll { it >= 3 }
    println(numbers)
    numbers.clear()
    println(numbers)

    val numbersSet = mutableSetOf("one", "two", "three", "four")
    numbersSet.removeAll(setOf("one", "two"))
    println(numbersSet)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Another way to remove elements from a collection is with the [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) operator – the in-place version of [`minus`](collection-plus-minus.md). 
The second argument can be a single instance of the element type or another collection.
With a single element on the right-hand side, `-=` removes the _first_ occurrence of it.
In turn, if it's a collection, _all_ occurrences of its elements are removed.
For example, if a list contains duplicate elements, they are removed at once.
The second operand can contain elements that are not present in the collection. Such elements don't affect the operation execution.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // does the same as above
    println(numbers)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Updating elements

Lists and maps also provide operations for updating elements.
They are described in [List-specific Operations](list-operations.md) and [Map Specific Operations](map-operations.md).
For sets, updating doesn't make sense since it's actually removing an element and adding another one.

