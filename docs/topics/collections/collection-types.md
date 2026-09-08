[//]: # (title: Collection types)

Kotlin provides three main collection types: [List](#list), [Set](#set), and [Map](#map).
Choose a type according to your goal.

## List

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) stores elements in a
specified order and provides indexed access to them. Indices start from zero – the index of the first element – and go
to `lastIndex` which is the `(list.size - 1)`.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Number of elements: ${numbers.size}")
    println("Third element: ${numbers.get(2)}")
    println("Fourth element: ${numbers[3]}")
    println("Index of element \"two\" ${numbers.indexOf("two")}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

List elements (including nulls) can duplicate: a list can contain any number of equal objects or occurrences of a
single object.
Two lists are considered equal if they have the same sizes and [structurally equal](equality.md#structural-equality)
elements at the same positions.

```kotlin
data class Person(var name: String, var age: Int)

fun main() {
//sampleStart
    val bob = Person("Bob", 31)
    val people = listOf(Person("Adam", 20), bob, bob)
    val people2 = listOf(Person("Adam", 20), Person("Bob", 31), bob)
    println(people == people2)
    bob.age = 32
    println(people == people2)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html) is a `List`
with list-specific write operations, for example, to add or remove an element at a specific position.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    numbers.removeAt(1)
    numbers[0] = 0
    numbers.shuffle()
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

As you see, in some aspects lists are very similar to arrays.
However, there is one important difference:  an array's size is defined upon initialization and is never changed;
in turn, a list doesn't have a predefined size; a list's size can be changed as a result of write operations: adding,
updating, or removing elements.

In Kotlin, the default implementation of `MutableList` is [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)
which you can think of as a resizable array.

## Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html) stores unique elements;
their order is generally undefined. `null` elements are unique as well: a `Set` can contain only one `null`.
Two sets are equal if they have the same size, and for each element of a set there is an equal element in the other set.

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)
    println("Number of elements: ${numbers.size}")
    if (numbers.contains(1)) println("1 is in the set")

    val numbersBackwards = setOf(4, 3, 2, 1)
    println("The sets are equal: ${numbers == numbersBackwards}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html) is a `Set` with
write operations from `MutableCollection`.

The default implementation of `MutableSet` – [`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html) –
preserves the order of elements insertion.
Hence, the functions that rely on the order, such as `first()` or `last()`, return predictable results on such sets.

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)  // LinkedHashSet is the default implementation
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

An alternative implementation – [`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html) –
says nothing about the elements order, so calling such functions on it returns unpredictable results. However, `HashSet`
requires less memory to store the same number of elements.

## Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html) is not an inheritor of
the `Collection` interface; however, it's a Kotlin collection type as well.
A `Map` stores _key-value_ pairs (or _entries_); keys are unique, but different keys can be paired with equal values.
The `Map` interface provides specific functions, such as access to value by key, searching keys and values, and so on.

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // same as previous
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Two maps containing the equal pairs are equal regardless of the pair order.

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)    
    val anotherMap = mapOf("key2" to 2, "key1" to 1, "key4" to 1, "key3" to 3)
    
    println("The maps are equal: ${numbersMap == anotherMap}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html) is a `Map` with
map write operations, for example, you can add a new key-value pair or update the value associated with the given key.

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    numbersMap["one"] = 11

    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The default implementation of `MutableMap` – [`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html) –
preserves the order of elements insertion when iterating the map.
In turn, an alternative implementation – [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html) –
says nothing about the elements order.

## ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) is an implementation of a double-ended queue, which allows you to add or remove elements both at the beginning or end of the queue.
As such, `ArrayDeque` also fills the role of both a Stack and Queue data structure in Kotlin. Behind the scenes, `ArrayDeque` is realized using a resizable array that automatically adjusts in size when required:

```kotlin
fun main() {
    val deque = ArrayDeque(listOf(1, 2, 3))

    deque.addFirst(0)
    deque.addLast(4)
    println(deque) // [0, 1, 2, 3, 4]

    println(deque.first()) // 0
    println(deque.last()) // 4

    deque.removeFirst()
    deque.removeLast()
    println(deque) // [1, 2, 3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}