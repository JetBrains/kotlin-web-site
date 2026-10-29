[//]: # (title: Collection types)

Kotlin provides three main collection types: [List](#list), [Set](#set), and [Map](#map).
Choose a collection type based on how you need to store and access data.

## List

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) stores elements in a specified order and provides indexed access to them. Indices start from zero
and end at `lastIndex`, which is `(list.size - 1)`. A list can contain duplicate elements, including multiple references
to the same object.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Number of elements: ${numbers.size}")
    println("Third element: ${numbers.get(2)}")
    println("Fourth element: ${numbers[3]}")
    println("Index of element: \"two\" ${numbers.indexOf("two")}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> The performance of indexed access depends on the list implementation. When processing all elements of a list,
> prefer iteration over repeatedly accessing elements by index.
>
{style="tip"}

Two lists are equal if they have the same size and [structurally equal](equality.md#structural-equality) elements at the same positions:

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

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html) is a `List` with list-specific write operations. Unlike an [array](arrays.md), a mutable list can change size when you add or remove elements.
You can also replace an element at a specific position. For example:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    // Adds an elemnt to the list
    numbers.add(5)
    // Removes the element with index 1
    numbers.removeAt(1)
    // Replace the element with index 0
    numbers[0] = 0
    
    numbers.shuffle()
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The default implementation of `MutableList` is [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html).

## Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html) stores unique elements. The `Set<T>` interface doesn't guarantee iteration order. The order depends
on the implementation. A set can contain at most one `null` element if its element type is nullable and its implementation
supports `null`.  

Two sets are equal if they have the same size and each element of one set has an equal element in the other set:

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

[`MutableSet<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html) is a `Set` with write operations from `MutableCollection`.

The default implementation of `MutableSet` ([`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html)) preserves the element insertion order.
Therefore, the order-dependent functions like `first()` and `last()` return predictable results:

```kotlin
fun main() {
//sampleStart
    // LinkedHashSet is the default implementation
    val numbers = setOf(1, 2, 3, 4)
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    //false
    
    println(numbers.first() == numbersBackwards.last())
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If you don't need a predictable iteration order, you can use [`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html). It's an alternative implementation that doesn't 
guarantee iteration order, so don't rely on `first()` or `last()` returning elements in insertion order. 

## Map

Even though [`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html) is not an inheritor of the `Collection` interface, it's a Kotlin collection type.
A `Map` stores _key-value_ pairs or _entries_. Keys are unique, but different keys can be paired with equal values.
The `Map` interface provides specific functions, such as access to value by key, searching keys and values, and so on.

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    // Checks for the value with containsValue(), equivalent to the previous condition
    if (numbersMap.containsValue(1)) println("The value 1 is in the map")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

A map can contain at most one `null` key if its key type is nullable and its implementation supports `null` keys.
Support for `null` values also depends on the value type and the implementation.

Two maps are equal if they contain the same key-value pairs, regardless of the order:

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

[`MutableMap<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html) is a `Map` with map-specific write operations. For example, you can add a new key-value pair or update the value
associated with the given key:

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

([`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html)) The default implementation of `MutableMap`. It preserves the order in which entries are inserted.
In turn, [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html) is an alternative implementation that doesn't control the elements order.

## ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) is an implementation of a double-ended queue. It allows you to add or remove elements at either the beginning or the end of the deque. `ArrayDeque` also fills the role of both a stack and a queue data structure in Kotlin.
`ArrayDeque` stores its elements in a resizable array:

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