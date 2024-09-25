[//]: # (title: Collections in Java and Kotlin)
[//]: # (description: Learn how to migrate from Java collections to Kotlin collections. This guide covers such data structures as Kotlin and Java Lists, ArrayLists, Maps, Sets, and others.)

_Collections_ are groups of a variable number of items (possibly zero) that are significant to the problem being solved and are commonly operated on. 
This guide explains and compares collection concepts and operations in Java and Kotlin. 
It will help you migrate from Java to Kotlin and write your code in the authentically Kotlin way.

The first part of this guide contains a quick glossary of operations on the same collections in Java and Kotlin. 
It is divided into [operations that are the same](#operations-that-are-the-same-in-java-and-kotlin) 
and [operations that exist only in Kotlin](#operations-that-don-t-exist-in-java-s-standard-library). 
The second part of the guide, starting from [Mutability](#mutability), explains some of the differences by looking at specific cases.

For an introduction to collections, see the [Collections overview](collections-overview.md) or watch 
this [video](https://www.youtube.com/watch?v=F8jj7e-_jFA) by Sebastian Aigner, Kotlin Developer Advocate.

> All of the examples below use Java and Kotlin standard library APIs only.
>
{style="note"}

## Operations that are the same in Java and Kotlin

In Kotlin, there are many operations on collections that look exactly the same as their counterparts in Java.

### Operations on lists, sets, queues, and deques

| Description | Common operations | More Kotlin alternatives |
|-------------|-----------|---------------------|
| Add an element or elements | `add()`, `addAll()` | Use the [`plusAssign`(`+=`) operator](collection-plus-minus.md): `collection += element`, `collection += anotherCollection`. |
| Check whether a collection contains an element or elements | `contains()`, `containsAll()` | Use the [`in` keyword](collection-elements.md#check-element-existence) to call `contains()` in the operator form: `element in collection`. |
| Check whether a collection is empty | `isEmpty()` | Use [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) to check whether a collection is not empty. |
| Remove under a certain condition | `removeIf()` | |
| Leave only selected elements | `retainAll()` | |
| Remove all elements from a collection | `clear()` | |
| Get a stream from a collection | `stream()` | Kotlin has its own way to process streams: [sequences](#sequences) and methods like [`map()`](collection-filtering.md) and [`filter()`](#filter-elements). |
| Get an iterator from a collection | `iterator()` | |

### Operations on maps

| Description | Common operations | More Kotlin alternatives |
|-------------|-----------|---------------------|
| Add an element or elements | `put()`, `putAll()`, `putIfAbsent()`| In Kotlin, the assignment `map[key] = value` behaves the same as `put(key, value)`. Also, you may use the [`plusAssign`(`+=`) operator](collection-plus-minus.md): `map += Pair(key, value)` or `map += anotherMap`. |
| Replace an element or elements | `put()`, `replace()`, `replaceAll()` | Use the indexing operator `map[key] = value` instead of `put()` and `replace()`. |
| Get an element | `get()` | Use the indexing operator to get an element: `map[index]`. |
| Check whether a map contains an element or elements | `containsKey()`, `containsValue()` | Use the [`in` keyword](collection-elements.md#check-element-existence) to call `contains()` in the operator form: `element in map`. |
| Check whether a map is empty |  `isEmpty()` | Use [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) to check whether a map is not empty. |
| Remove an element | `remove(key)`, `remove(key, value)` | Use the [`minusAssign`(`-=`) operator](collection-plus-minus.md): `map -= key`. |
| Remove all elements from a map | `clear()` | |
| Get a stream from a map | `stream()` on entries, keys, or values | |

### Operations that exist only for lists

| Description | Common operations | More Kotlin alternatives |
|-------------|-----------|---------------------|
| Get an index of an element | `indexOf()` | |
| Get the last index of an element | `lastIndexOf()` | |
| Get an element | `get()` | Use the indexing operator to get an element: `list[index]`. |
| Take a sublist | `subList()` | |
| Replace an element or elements | `set()`,  `replaceAll()` | Use the indexing operator instead of `set()`: `list[index] = value`. |

## Operations that differ a bit

### Operations on any collection type

| Description | Java | Kotlin |
|-------------|------|--------|
| Get a collection's size | `size()` | `count()`, `size` |
| Get flat access to nested collection elements | `collectionOfCollections.forEach(flatCollection::addAll)` or `collectionOfCollections.stream().flatMap().collect()` | [`flatten()`](collection-transformations.md#flatten) or [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) |
| Apply the given function to every element | `stream().map().collect()` | [`map()`](collection-filtering.md) |
| Apply the provided operation to collection elements sequentially and return the accumulated result | `stream().reduce()` | [`reduce()`, `fold()`](collection-aggregate.md#fold-and-reduce) |
| Group elements by a classifier and count them | `stream().collect(Collectors.groupingBy(classifier, counting()))` | [`eachCount()`](collection-grouping.md) |
| Filter by a condition | `stream().filter().collect()` | [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) |
| Check whether collection elements satisfy a condition | `stream().noneMatch()`, `stream().anyMatch()`, `stream().allMatch()` | [`none()`, `any()`, `all()`](collection-filtering.md) |
| Sort elements | `stream().sorted().collect()` | [`sorted()`](collection-ordering.md#natural-order) |
| Take the first N elements | `stream().limit(N).collect()` | [`take(N)`](collection-parts.md#take-and-drop) |
| Take elements with a predicate | `stream().takeWhile().collect()` | [`takeWhile()`](collection-parts.md#take-and-drop) |
| Skip the first N elements | `stream().skip(N).collect()` | [`drop(N)`](collection-parts.md#take-and-drop) |
| Skip elements with a predicate | `stream().dropWhile().collect()` | [`dropWhile()`](collection-parts.md#take-and-drop) |
| Build maps from collection elements and certain values associated with them | `stream().collect(toMap(keyMapper, valueMapper))` | [`associate()`](collection-transformations.md#associate) |

To perform all of the operations listed above on maps, you first need to get an `entrySet` of a map.

### Operations on lists

| Description | Java | Kotlin |
|-------------|------|--------|
| Sort a list into natural order | `sort(null)` | `sort()` |
| Sort a list into descending order | `sort(comparator)` | `sortDescending()` |
| Remove an element from a list | `remove(index)`, `remove(element)`| `removeAt(index)`, `remove(element)` or [`collection -= element`](collection-plus-minus.md) |
| Fill all elements of a list with a certain value | `Collections.fill()` | [`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) |
| Get unique elements from a list | `stream().distinct().toList()` | [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) |

## Operations that don't exist in Java's standard library

* [`zip()`, `unzip()`](collection-transformations.md) – transform a collection.
* [`aggregate()`](collection-grouping.md) – group by a condition.
* [`takeLast()`, `takeLastWhile()`, `dropLast()`, `dropLastWhile()`](collection-parts.md#take-and-drop) – take or drop elements by a predicate.
* [`slice()`, `chunked()`, `windowed()`](collection-parts.md) – retrieve collection parts.
* [Plus (`+`) and minus (`-`) operators](collection-plus-minus.md) – add or remove elements.

If you want to take a deep dive into `zip()`, `chunked()`, `windowed()`, and some other operations, watch this video by Sebastian Aigner 
about advanced collection operations in Kotlin:

<video src="https://www.youtube.com/v/N4CpLxGJlq0" title="Advanced Collection Operations"/>

## Mutability

In Java, there are mutable collections:

```java
// Java
// This list is mutable!
public List<Customer> getCustomers() { ... }
```
{id="mutability-java"}

Partially mutable ones:

```java
// Java
List<String> numbers = Arrays.asList("one", "two", "three", "four");
numbers.add("five"); // Fails in runtime with `UnsupportedOperationException`
```
{id="mutability-partly-java"}

And immutable ones:

```java
// Java
List<String> numbers = new LinkedList<>();
// This list is immutable!
List<String> immutableCollection = Collections.unmodifiableList(numbers);
immutableCollection.add("five"); // Fails in runtime with `UnsupportedOperationException`
```
{id="immutable-java"}

If you write the last two pieces of code in IntelliJ IDEA, the IDE will warn you that you're trying to modify an immutable object. 
This code will compile and fail in runtime with `UnsupportedOperationException`. You can't tell whether a collection is mutable by 
looking at its type.

Unlike in Java, in Kotlin you explicitly declare mutable or read-only collections depending on your needs. 
If you try to modify a read-only collection, the code won't compile:

```kotlin
// Kotlin
val numbers = mutableListOf("one", "two", "three", "four")
numbers.add("five")            // This is OK
val immutableNumbers = listOf("one", "two")
//immutableNumbers.add("five") // Compilation error - Unresolved reference: add
```
{id="mutability-kotlin"}

Read more about immutability on the [Kotlin coding conventions](coding-conventions.md#immutability) page.

## Covariance

In Java, you can't pass a collection with a descendant type to a function that takes a collection of the ancestor type. 
For example, if `Rectangle` extends `Shape`, you can't pass a collection of `Rectangle` elements to a function that takes a collection of `Shape` elements. 
To make the code compilable, use the `? extends Shape` type so the function can take collections with any inheritors of `Shape`:

```java
// Java
class Shape {}

class Rectangle extends Shape {}

public void doSthWithShapes(List<? extends Shape> shapes) {
/* If using just List<Shape>, the code won't compile when calling
this function with the List<Rectangle> as the argument as below */
}

public void main() {
    var rectangles = List.of(new Rectangle(), new Rectangle());
    doSthWithShapes(rectangles);
}
```
{id="covariance-java"}

In Kotlin, read-only collection types are [covariant](generics.md#variance). This means that if a `Rectangle` class inherits from the `Shape` class, 
you can use the type `List<Rectangle>` anywhere the `List<Shape>` type is required. 
In other words, the collection types have the same subtyping relationship as the element types. Maps are covariant on the value type, but not on the key type.
Mutable collections aren't covariant – this would lead to runtime failures.

```kotlin
// Kotlin
open class Shape(val name: String)

class Rectangle(private val rectangleName: String) : Shape(rectangleName)

fun doSthWithShapes(shapes: List<Shape>) {
    println("The shapes are: ${shapes.joinToString { it.name }}")
}

fun main() {
    val rectangles = listOf(Rectangle("rhombus"), Rectangle("parallelepiped"))
    doSthWithShapes(rectangles)
}
```
{kotlin-runnable="true" id="covariance-kotlin"}

Read more about [collection types](collections-overview.md#collection-types) here.

## Ranges and progressions

In Kotlin, you can create intervals using [ranges](ranges.md). For example, `Version(1, 11)..Version(1, 30)` includes all of the versions from `1.11` to `1.30`. 
You can check that your version is in the range by using the `in` operator: `Version(0, 9) in versionRange`.

In Java, you need to manually check whether a `Version` fits both bounds:

```java
// Java
class Version implements Comparable<Version> {

    int major;
    int minor;

    Version(int major, int minor) {
        this.major = major;
        this.minor = minor;
    }

    @Override
    public int compareTo(Version o) {
        if (this.major != o.major) {
            return this.major - o.major;
        }
        return this.minor - o.minor;
    }
}

public void compareVersions() {
    var minVersion = new Version(1, 11);
    var maxVersion = new Version(1, 31);

   System.out.println(
           versionIsInRange(new Version(0, 9), minVersion, maxVersion));
   System.out.println(
           versionIsInRange(new Version(1, 20), minVersion, maxVersion));
}

public Boolean versionIsInRange(Version versionToCheck, Version minVersion, 
                                Version maxVersion) {
    return versionToCheck.compareTo(minVersion) >= 0 
            && versionToCheck.compareTo(maxVersion) <= 0;
}
```
{id="ranges-java"}

In Kotlin, you operate with a range as a whole object. You don't need to create two variables and compare a `Version` with them:

```kotlin
// Kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int {
        if (this.major != other.major) {
            return this.major - other.major
        }
        return this.minor - other.minor
    }
}

fun main() {
    val versionRange = Version(1, 11)..Version(1, 30)

    println(Version(0, 9) in versionRange)
    println(Version(1, 20) in versionRange)
}
```
{kotlin-runnable="true" id="ranges-kotlin"}

As soon as you need to exclude one of the bounds, like to check whether a version is greater than or equal to (`>=`) the minimum version 
and less than (`<`) the maximum version, these inclusive ranges won't help.

## Comparison by several criteria

In Java, to compare objects by several criteria, you may use the [`comparing()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#comparing-java.util.function.Function-) 
and [`thenComparingX()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#thenComparing-java.util.Comparator-)
functions from the [`Comparator`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html) interface. 
For example, to compare people by their name and age:

```java
class Person implements Comparable<Person> {
    String name;
    int age;

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return this.name + " " + age;
    }
}

public void comparePersons() {
    var persons = List.of(new Person("Jack", 35), new Person("David", 30), 
            new Person("Jack", 25));
    System.out.println(persons.stream().sorted(Comparator
            .comparing(Person::getName)
            .thenComparingInt(Person::getAge)).collect(toList()));
}
```
{id="comparison-java"}

In Kotlin, you just enumerate which fields you want to compare:

```kotlin
data class Person(
    val name: String,
    val age: Int
)

fun main() {
    val persons = listOf(Person("Jack", 35), Person("David", 30), 
        Person("Jack", 25))
    println(persons.sortedWith(compareBy(Person::name, Person::age)))
}
```
{kotlin-runnable="true" id="comparison-kotlin"}

## Sequences

In Java, you can generate a sequence of numbers this way:

```java
// Java
int sum = IntStream.iterate(1, e -> e + 3)
    .limit(10).sum();
System.out.println(sum); // Prints 145
```
{id="sequences-java"}

In Kotlin, use _[sequences](sequences.md)_. Multi-step processing of
sequences is executed lazily when possible –
actual computing happens only when the result of the whole processing chain is requested.

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val sum = generateSequence(1) {
        it + 3
    }.take(10).sum()
    println(sum) // Prints 145
//sampleEnd
}
```
{kotlin-runnable="true" id="sequences-kotlin"}

Sequences may reduce the number of steps that are needed to perform some filtering operations. 
See the [sequence processing example](sequences.md#sequence-processing-example), which shows the difference between `Iterable` and `Sequence`.

## Removal of elements from a list

In Java, the [`remove()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html#remove(int)) 
function accepts an index of an element to remove.

When removing an integer element, use the `Integer.valueOf()` function as the argument for the `remove()` function:

```java
// Java
public void remove() {
    var numbers = new ArrayList<>();
    numbers.add(1);
    numbers.add(2);
    numbers.add(3);
    numbers.add(1);
    numbers.remove(1); // This removes by index
    System.out.println(numbers); // [1, 3, 1]
    numbers.remove(Integer.valueOf(1));
    System.out.println(numbers); // [3, 1]
}
```
{id="remove-elements-java"}

In Kotlin, there are two types of element removal: 
by index with [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html) 
and by value with [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove.html).

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = mutableListOf(1, 2, 3, 1)
    numbers.removeAt(0)
    println(numbers) // [2, 3, 1]
    numbers.remove(1)
    println(numbers) // [2, 3]
//sampleEnd
}
```
{kotlin-runnable="true" id="remove-elements-kotlin"}

## Traverse a map

In Java, you can traverse a map via [`forEach`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html#forEach(java.util.function.BiConsumer)):

```java
// Java
numbers.forEach((k,v) -> System.out.println("Key = " + k + ", Value = " + v));
```
{id="traverse-map-java"}

In Kotlin, use a `for` loop or a `forEach`, similar to Java's `forEach`, to traverse a map:

```kotlin
// Kotlin
for ((k, v) in numbers) {
    println("Key = $k, Value = $v")
}
// Or
numbers.forEach { (k, v) -> println("Key = $k, Value = $v") }
```
{id="traverse-map-kotlin"}

## Get the first and the last items of a possibly empty collection

In Java, you can safely get the first and the last items by checking the size of the collection and using indices:

```java
// Java
var list = new ArrayList<>();
//...
if (list.size() > 0) {
    System.out.println(list.get(0));
    System.out.println(list.get(list.size() - 1));
}
```
{id="list-get-first-last-java"}

You can also use the [`getFirst()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getFirst()) 
and [`getLast()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getLast()) 
functions for [`Deque`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html) and 
its inheritors:

```java
// Java
var deque = new ArrayDeque<>();
//...
if (deque.size() > 0) {
    System.out.println(deque.getFirst());
    System.out.println(deque.getLast());
}
```
{id="deque-get-first-last-java"}

In Kotlin, there are the special
functions [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
and [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html). 
Using the [`Elvis operator`](null-safety.md#elvis-operator), you can perform further actions right away depending on the
result of a function. For example, `firstOrNull()`:

```kotlin
// Kotlin
val emails = listOf<String>() // Might be empty
val theOldestEmail = emails.firstOrNull() ?: ""
val theFreshestEmail = emails.lastOrNull() ?: ""
```
{id="get-first-last-kotlin"}

## Create a set from a list

In Java, to create a [`Set`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html) from 
a [`List`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html), you can use 
the [`Set.copyOf`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html#copyOf(java.util.Collection)) function:

```java
// Java
public void listToSet() {
    var sourceList = List.of(1, 2, 3, 1);
    var copySet = Set.copyOf(sourceList);
    System.out.println(copySet);
}
```
{id="list-to-set-java"}

In Kotlin, use the function `toSet()`:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val sourceList = listOf(1, 2, 3, 1)
    val copySet = sourceList.toSet()
    println(copySet)
//sampleEnd
}
```
{kotlin-runnable="true" id="list-to-set-kotlin"}

## Group elements

In Java, you can group elements with the [Collectors](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Collectors.html) 
function `groupingBy()`:

```java
// Java
public void analyzeLogs() {
    var requests = List.of(
        new Request("https://kotlinlang.org/docs/home.html", 200),
        new Request("https://kotlinlang.org/docs/home.html", 400),
        new Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    );
    var urlsAndRequests = requests.stream().collect(
            Collectors.groupingBy(Request::getUrl));
    System.out.println(urlsAndRequests);
}
```
{id="group-elements-java"}

In Kotlin, use the function [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html):

```kotlin
class Request(
    val url: String,
    val responseCode: Int
)

fun main() {
//sampleStart
    // Kotlin
    val requests = listOf(
        Request("https://kotlinlang.org/docs/home.html", 200),
        Request("https://kotlinlang.org/docs/home.html", 400),
        Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    )
    println(requests.groupBy(Request::url))
//sampleEnd
}
```
{kotlin-runnable="true" id="group-elements-kotlin"}

## Filter elements

In Java, to filter elements from a collection, you need to use the [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html). 
The Stream API has `intermediate` and `terminal` operations. `filter()` is an intermediate operation, which returns a stream. 
To receive a collection as the output, you need to use a terminal operation, like `collect()`. 
For example, to leave only those pairs whose keys end with `1` and whose values are greater than `10`:

```java
// Java
public void filterEndsWith() {
    var numbers = Map.of("key1", 1, "key2", 2, "key3", 3, "key11", 11);
    var filteredNumbers = numbers.entrySet().stream()
        .filter(entry -> entry.getKey().endsWith("1") && entry.getValue() > 10)
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    System.out.println(filteredNumbers);
}
```
{id="filter-elements-java"}

In Kotlin, filtering is built into collections, and `filter()` returns the same collection type that was filtered. 
So, all you need to write is the `filter()` and its predicate:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredNumbers = numbers.filter { (key, value) -> key.endsWith("1") && value > 10 }
    println(filteredNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" id="filter-elements-kotlin"}

Learn more about [filtering maps](map-operations.md#filter) here.

### Filter elements by type

In Java, to filter elements by type and perform actions on them, you need to check their types with 
the [`instanceof`](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html) operator and then do the type cast:

```java
// Java
public void objectIsInstance() {
    var numbers = new ArrayList<>();
    numbers.add(null);
    numbers.add(1);
    numbers.add("two");
    numbers.add(3.0);
    numbers.add("four");
    System.out.println("All String elements in upper case:");
    numbers.stream().filter(it -> it instanceof String)
        .forEach( it -> System.out.println(((String) it).toUpperCase()));
}
```
{id="filter-by-type-java"}

In Kotlin, you just call [`filterIsInstance<NEEDED_TYPE>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html) on your collection, 
and the type cast is done by [Smart casts](typecasts.md#smart-casts):

```kotlin
// Kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf(null, 1, "two", 3.0, "four")
    println("All String elements in upper case:")
    numbers.filterIsInstance<String>().forEach {
        println(it.uppercase())
    }
//sampleEnd
}
```
{kotlin-runnable="true" id="filter-by-type-kotlin"}

### Test predicates

Some tasks require you to check whether all, none, or any elements satisfy a condition. 
In Java, you can do all of these checks via the [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html) 
functions [`allMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#allMatch(java.util.function.Predicate)), 
[`noneMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#noneMatch(java.util.function.Predicate)), and 
[`anyMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#anyMatch(java.util.function.Predicate)):

```java
// Java
public void testPredicates() {
    var numbers = List.of("one", "two", "three", "four");
    System.out.println(numbers.stream().noneMatch(it -> it.endsWith("e"))); // false
    System.out.println(numbers.stream().anyMatch(it -> it.endsWith("e"))); // true
    System.out.println(numbers.stream().allMatch(it -> it.endsWith("e"))); // false
}
```
{id="test-predicates-java"}

In Kotlin, the [extension functions](extensions.md) `none()`, `any()`, and `all()` 
are available for every [Iterable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/#kotlin.collections.Iterable) object:

```kotlin
fun main() {
//sampleStart
// Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.none { it.endsWith("e") })
    println(numbers.any { it.endsWith("e") })
    println(numbers.all { it.endsWith("e") })
//sampleEnd
}
```
{kotlin-runnable="true" id="test-predicates-kotlin"}

Learn more about [test predicates](collection-filtering.md#test-predicates).

## Collection transformation operations

### Zip elements

In Java, you can make pairs from elements with the same positions in two collections by iterating simultaneously over them:

```java
// Java
public void zip() {
    var colors = List.of("red", "brown");
    var animals = List.of("fox", "bear", "wolf");

    for (int i = 0; i < Math.min(colors.size(), animals.size()); i++) {
        String animal = animals.get(i);
        System.out.println("The " + animal.substring(0, 1).toUpperCase()
               + animal.substring(1) + " is " + colors.get(i));
   }
}
```
{id="zip-elements-java"}

If you want to do something more complex than just printing pairs of elements into the output, 
you can use [Records](https://blogs.oracle.com/javamagazine/post/records-come-to-java). 
In the example above, the record would be `record AnimalDescription(String animal, String color) {}`.

In Kotlin, use the [`zip()`](collection-transformations.md#zip) function to do the same thing:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val colors = listOf("red", "brown")
    val animals = listOf("fox", "bear", "wolf")

    println(colors.zip(animals) { color, animal -> 
        "The ${animal.replaceFirstChar { it.uppercase() }} is $color" })
//sampleEnd
}
```
{kotlin-runnable="true" id="zip-elements-kotlin"}

`zip()` returns the List of [Pair](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) objects.

> If collections have different sizes, the result of `zip()` is the smaller size. The last elements of 
the larger collection are not included in the result.
>
{style="note"}

### Associate elements

In Java, you can use the [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html) 
to associate elements with characteristics:

```java
// Java
public void associate() {
    var numbers = List.of("one", "two", "three", "four");
    var wordAndLength = numbers.stream()
        .collect(toMap(number -> number, String::length));
    System.out.println(wordAndLength);
}
```
{id="associate-elements-java"}

In Kotlin, use the [`associate()`](collection-transformations.md#associate) function:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" id="associate-elements-kotlin"}

## What's next?

* Visit [Kotlin Koans](koans.md) – complete exercises to learn Kotlin syntax. Each exercise is created as a failing unit test and your job is to make it pass.
* Look through other [Kotlin idioms](idioms.md).
* Learn how to convert existing Java code to Kotlin with the [Java to Kotlin converter](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k).
* Discover [collections in Kotlin](collections-overview.md).

If you have a favorite idiom, we invite you to share it by sending a pull request.
