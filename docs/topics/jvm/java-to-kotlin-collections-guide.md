[//]: # (title: Collections and iterating through them)

_Collections_ are groups of a variable number of items (possibly zero) that share significance to the problem being solved and are operated upon commonly. 
For the introduction to collections, see the [Collections overview](collections-overview.md) or watch a video by Sebastian Aigner, Kotlin Developer Advocate:

<video href="F8jj7e-_jFA" title="Kotlin Collections Overview"/>

## Operations that are the same in Java and Kotlin

In Kotlin, there are many operations that look absolutely the same as in Java:

| Description | Operation on a list | Operation on a map | Comment |
|-------------|---------------------|--------------------|---------|
| Add an element or elements | `add()`, `addAll()` | `put()`, `putAll()`, `putIfAbsent()`| In Kotlin, the same methods are under the hood of an assignment `collection[key] = value` |
| Replace an element or elements | `set()`,  `replaceAll()` | `put()`, `replace()`, `replaceAll()` | In Kotlin, it's more idiomatic to use indexing operator: `list[index] = value`, `map[key] = value` |
| Get an element | `get()` | `get()` | In Kotlin, use indexing operator to get an element: `collection[index]` |
| Check if a collection contains an element/elements | `contains()`, `containsAll()` | `containsKey()`, `containsValue()` | |
| Check if a collection is empty | `isEmpty()` |  `isEmpty()` | |
| Remove an element | [differs in Java and Kotlin](#removal-of-elements-from-a-list) | `remove(key)`, `remove(key, value)` | In Kotlin, you may also use [`minusAssign()`](collection-plus-minus.md) operator |
| Remove all elements from a collection | `clear()` | `clear()` | |
| Get a stream from a collection | `stream()` | `stream()` on entries, keys or values | |
| Get an iterator from a collection | `iterator()` | [differs in Java and Kotlin](#operations-differ-a-bit) | |
| Get a [Spliterator](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Spliterator.html) | `spliterator()` | `spliterator()` on keys or values | |

There are operations that exist only for lists and are the same in Java and Kotlin:

| Description | Operation |
|-------------|-----------|
| Get an index of some object | `indexOf()` |
| Get the last index of some object | `lastIndexOf()` |
| Remove by a condition | `removeIf()` |
| Leave only selected elements | `retainAll()` |
| Take a sublist | `sublist()` |

## Operations differ a bit

For lists:

| Description | Java | Kotlin |
|-------------|------|--------|
| Sort a list | `sort(Comparator<? super E> c)` or `stream().sorted().collect(toList())` | `sort()` will sort your list with the natural order by default |
| Remove element from a list | `remove(int index)`, `remove(Object o)`| `removeAt(index: Int)`, `remove(element: ElementType)` |
| Fill all elements of a list with some value | `Collections.fill()` | [`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) |
| Get unique elements of the list | `stream().distinct().collect(toList())` | [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) |

For any collection:

| Description | Java | Kotlin |
|-------------|------|--------|
| Get a collection's size | `size()` | `count()`, `size` |
| Get flat access to nested collection elements | `collectionOfCollections.forEach(flatCollection::addAll)` or `collectionOfCollections.stream().flatMap().collect()` | [`flatten()`](collection-transformations.md#flatten) or [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) |
| Map elements by some condition | `stream().map().collect()` | [`map()`](collection-filtering.md) |
| Apply the provided operation to the collection elements sequentially and return the accumulated result | `stream().reduce()` | [`reduce()`, `fold()`](collection-aggregate.md#fold-and-reduce) |
| Group elements by some condition | `stream().collect(Collectors.groupingBy())` | [`groupBy()`](collection-grouping.md) |
| Filter by a predicate | `stream().noneMatch()`, `stream().anyMatch()`, `stream().allMatch()` | [ `none()`, `any()`, `all()`](collection-filtering.md) |
| Sort elements | `stream().sorted().collect()` | [`sorted()`](collection-ordering.md#natural-order) |
| Take first N elements | `stream().limit(N).collect()` | [`take(N)`](collection-parts.md#take-and-drop) |
| Skip first N elements | `stream().skip(N).collect()` | [`drop(N)`](collection-parts.md#take-and-drop) |

To perform all operations listed above on maps, get an `entrySet` of a map firstly.

## Operations that don't exist in the Java's standard library

* [ `isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) – check if a collection is not empty.
* [`zip()`, `unzip()`, `associate()`](collection-transformations.md) – transform a collection.
* [`eachCount()`, `aggregate()`](collection-grouping.md) – group by some condition.
* [`slice()`, `chunked()`, `windowed()`](collection-parts.md) – retrieve collection parts.
* [Plus and minus operators](collection-plus-minus.md) – add or remove elements.

If you want to dive deep into `zip()`, `chunked()`, `windowed()`, and some other operations, watch a video by Sebastian Aigner, 
Kotlin Developer Advocate, about advanced collection operations in Kotlin:

<video href="N4CpLxGJlq0" title="Advanced Collection Operations"/>

Below are examples of differences between the same actions and concepts in Java and Kotlin code.

## Mutability

In Java, there are mutable collections:

```java
// Java
// this list is mutable!
public List<Customer> getCustomers() { … }
```

And partially mutable:

```java
// Java
List<String> numbers = Arrays.asList("one", "two", "three", "four");
numbers.add("five");
```

If you write such code in IDE, it will compile but fail in runtime with `UnsupportedOperationException`.

Apparently from Java, in Kotlin you can explicitly declare mutable or fully immutable collections depending on your needs. 
If you try to modify an immutable collection, the code won’t compile:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")      // this is OK
    //numbers = mutableListOf("six", "seven")      // compilation error - Val cannot be reassigned
    val immutableNumbers = listOf("one", "two")
    //immutableNumbers.add("five")      // compilation error - Unresolved reference: add
//sampleEnd
}
```
{kotlin-runnable="true"}

Read more about immutability in the [Kotlin coding conventions](coding-conventions.md#immutability).

## Covariance

In Java, you can’t pass a collection with a descendant’s type, for example, `Rectangle`, to a function that takes this type’s ancestor, for example, `Shape`. 
To make the code compilable, use the type `? extends Shape`, so the function can take collections with any inheritors of `Shape`:

```java
// Java
class Shape {}

class Rectangle extends Shape {}

public void doSthWithShapes(List<? extends Shape> shapes){
/* If using just List<Shape>, the code won't compile when calling this function with the List<Rectangle> as the argument as below */
}

@Test
public void main() {
   var rectangles = List.of(new Rectangle(), new Rectangle());
   doSthWithShapes(rectangles);
}
```

In Kotlin, the read-only collection types are [covariant](generics.md#variance). This means that, if a `Rectangle` class inherits from the `Shape` class, 
you can use the type `List<Rectangle>` anywhere the `List<Shape>` type is required. 
In other words, the collection types have the same subtyping relationship as the element types. Maps are covariant on the value type, but not on the key type.
In turn, mutable collections aren't covariant; otherwise, this would lead to runtime failures.

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
{kotlin-runnable="true"}

Read more details about [collections types](collections-overview.md#collection-types).

## Ranges and progressions

In Kotlin, you can create objects using [ranges](ranges.md#range). For example, `Version(1, 11)..Version(1, 30)` stays for all the versions from `1.11` to `1.30`. 
In Java, you would have to create such objects in a loop. Also, in Kotlin, you can check that your version is in the range using the `in` operator: `Version(0, 9) in versionRange`. 
In Java, you need to iterate over all `Versions` to check if a `Version` suits a condition. Compare the code in Java and in Kotlin. In Java:

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
   var versions = new ArrayList<>();
   for (int i = 11; i < 31; i++) {
       versions.add(new Version(1, i));
   }
   checkVersion(new Version(0, 9), versions);
   checkVersion(new Version(1, 20), versions);

}

public void checkVersion(Version versionToCheck, List<Version> versions) {
   for (Version version : versions) {
       if (versionToCheck.compareTo(version) == 0) {
           System.out.println(true);
           return;
       }
   }
   System.out.println(false);
}
```

In Kotlin:

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
{kotlin-runnable="true"}

## Comparison by several criteria

In Java, to compare objects by several criteria, you need to implement a Comparator and manually describe the logic of the comparison. 
For example, you want to compare people by their name and age:

```Java
class Person implements Comparable<Person> {
        String name;
        int age;

        Person(String name, int age) {
            this.name = name;
            this.age = age;
        }

        @Override
        public int compareTo(Person o) {
            if (this == o) {
                return 0;
            }
            var namesComparison = this.name.compareTo(o.name);
            if (namesComparison != 0) {
                return namesComparison;
            } else {
                return this.age - o.age;
            }
        }

        @Override
        public String toString() {
            return this.name + " " + age;
        }
}

public void comparePersons() {
    var persons = List.of(new Person("Jack", 35), new Person("David", 30), new Person("Jack", 25));
    System.out.println(persons.stream().sorted().collect(toList()));
}
```

In Kotlin, you just enumerate by which fields you want to compare:

```kotlin
data class Person(
   val name: String,
   val age: Int
)

fun sortPersons(persons: List<Person>) =
   persons.sortedWith(compareBy(Person::name, Person::age))

fun main() {
   val persons = listOf(Person("Jack", 35), Person("David", 30), Person("Jack", 25))
   println(sortPersons(persons))
}
```
{kotlin-runnable="true"}

## Sequences

In Java, generate a sequence of numbers this way:

```java
// Java
int sum = IntStream.iterate(1, e -> e + 3)
   .limit(10).sum();
System.out.println(sum); // Prints 145
```

In Kotlin, _sequence_ is the container type. Multi-step processing of sequences is executed lazily when possible: 
actual computing happens only when the result of the whole processing chain is requested.

```kotlin
// Kotlin
val sum = generateSequence (1) {
    it + 3
}.take(10).sum()
println(sum) // Prints 145
```
{kotlin-runnable="true"}

Sequences may reduce the amount of steps that is needed to perform some filtering operation. See the [sequence processing example](sequences.md#sequence-processing-example).

## Removal of elements from a list

In Java, the [`remove()`](https://docs.oracle.com/javase/7/docs/api/java/util/List.html#remove(int)) function accepts an index of an element to remove. 
It might be easy to mix up when operating with collections of integers. To remove the element, use the `Integer.valueOf()` function as the argument for `remove()` function:

```java
// Java
public void remove() {
   List<Integer> numbers = new LinkedList<>();
   numbers.add(1);
   numbers.add(2);
   numbers.add(3);
   numbers.add(1);
   numbers.remove(1); // this removes by index
   System.out.println(numbers); // [1, 3, 1]
   numbers.remove(Integer.valueOf(1));
   System.out.println(numbers); // [3, 1]
}
```

In Kotlin, there are two different functions for removal of an element: by index and by value, so it’s impossible to mix up:

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
{kotlin-runnable="true"}

## Traversing a map

In Java, traverse a map via the [`forEach`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html#forEach(java.util.function.BiConsumer)):

```java
// Java
numbers.forEach((k,v) -> System.out.println("Key = " + k + ", Value = " + v));
```

In Kotlin, you can traverse a map using a `for` loop:

```kotlin
fun main() {
//sampleStart
// Kotlin
    for ((k, v) in numbers) {
        println("Key = $k, Value = $v")
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

## Getting the first item of a possibly empty collection

In Java, you can safely get the first item this way:

```java
// Java
List<Email> emails = new LinkedList<>();
//...
if (emails.size() > 0) {
   System.out.println(emails.getFirst());
}
```

In Kotlin, there's a special function `firstOrNull()`, and using the [`Elvis operator`](null-safety.md#elvis-operator), you can perform further actions right away depending on the result.

```kotlin
// Kotlin
val emails = ... // might be empty
val mainEmail = emails.firstOrNull() ?: ""
```

## Getting a set from a list

In Java, to create a [`Set`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html) from 
a [`List`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html), you need to pass your list to a set's constructor:

```java
// Java
public void listToSet() {
   var sourceList = List.of(1, 2, 3, 1);
   var copySet = new HashSet<>(sourceList);
   System.out.println(copySet);
}
```

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
{kotlin-runnable="true"}

## Grouping

In Java, you may group elements with the [Collectors](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Collectors.html)' function `groupingBy`:

```Java
// Java
public void analyzeLogs() {
    var requests = List.of(
        new Request("https://kotlinlang.org/docs/home.html", 200),
        new Request("https://kotlinlang.org/docs/home.html", 400),
        new Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    );
    var urlsAndRequests = requests.stream().collect(Collectors.groupingBy(Request::getUrl));
    System.out.println(urlsAndRequests);
}
```

In Kotlin, use the function [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html):

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val requests = listOf(
        Request("https://kotlinlang.org/docs/home.html", 200),
        Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    )
    println(requests.groupBy(Request::url))
//sampleEnd
}
```
{kotlin-runnable="true"}

## Filtering

In Java, to filter some elements from a collection, you need to use the [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html). 
The Stream API has `intermediate` and `terminal` operations. `filter()` is an intermediate operation, which returns a stream. 
To receive a collection as the output, you need to use some terminal operation, for example, the `collect()`. 
For example, you want only those pairs which keys end with `1` and values are greater than `10`:

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

In Kotlin, filtering is built-in into collections, and `filter()` returns the same collection type that was filtered. 
So, all you need to write is the `filter()` and it’s predicate:

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
{kotlin-runnable="true"}

Learn more about [filtering maps](map-operations.md#filter).

### Indexed filtering

In pure Java, to filter some collection by items' values and indices, you need to use an iterator:

```java
// Java
public void streamIndexed() {
   var numbers = List.of("one", "two", "three", "four");
   var iterator = numbers.listIterator();
   var filtered = new ArrayList<String>();
   while (iterator.hasNext()) {
       if (iterator.nextIndex() != 0) {
           var value = iterator.next();
           if (value.length() < 5) {
               filtered.add(value);
           }
       } else {
           iterator.next();
       }
   }
   System.out.println(filtered);
}
```

All you need in Kotlin is a `filterIndexed()` function:

```kotlin
fun main() {
//sampleStart
// Kotlin
   val numbers = listOf("one", "two", "three", "four")
   val filtered = numbers.filterIndexed { index, s -> (index != 0) && (s.length < 5) }
   println(filtered)
//sampleEnd
}
```
{kotlin-runnable="true"}

The Kotlin code above would also work if the numbers are a set. To make the same in Java, you would need to create a list from the set:

```java
// Java
var numbers = new ArrayList<>(Set.of("one", "two", "three", "four"));
```

Learn more about [collection filtering](collection-filtering.md#filter-by-predicate).

### Filtering by type

In Java, to filter some objects by their type and do some actions on them, you need to check its type with 
the [`instanceof`](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html) operator and then do the type cast:

```java
// Java
public void objectIsInstance() {
// Java
   var numbers = new ArrayList<>();
   numbers.add(null);
   numbers.add(1);
   numbers.add("two");
   numbers.add(3.0);
   numbers.add("four");
   System.out.println("All String elements in upper case:");
   numbers.stream().filter(it -> it instanceof String).forEach( it -> System.out.println(((String) it).toUpperCase()));
}
```

In Kotlin, you just call [`filterIsInstance<String>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html) on your collection, 
and type cast is done by [Smart casts](typecasts.md#smart-casts):

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
{kotlin-runnable="true"}

### Test predicates

There are some tasks like checking if all, none or any elements satisfy some condition. 
In Java, you can make all these checks via the [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html) 
functions [`allMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#allMatch(java.util.function.Predicate)), 
[`noneMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#noneMatch(java.util.function.Predicate)), 
[`anyMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#anyMatch(java.util.function.Predicate)):

```java
// Java
public void testPredicateNone() {
   var numbers = List.of("one", "two", "three", "four");
   System.out.println(numbers.stream().noneMatch(it -> it.endsWith("e"))); // false
   System.out.println(numbers.stream().anyMatch(it -> it.endsWith("e"))); // true
   System.out.println(numbers.stream().allMatch(it -> it.endsWith("e"))); // false
}
```

In Kotlin, there are [extension functions](extensions.md) `none()`, `any()`, and `all()` 
for every [Iterable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/#kotlin.collections.Iterable) object:

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
{kotlin-runnable="true"}

Learn more about [test predicates](collection-filtering.md#test-predicates).

## Collection transformation operations

### Zip

In Java, you can clue two collections iterating simultaneously over them.

```java
// Java
public void zip() {
// Java
   var colors = List.of("red", "brown");
   var animals = List.of("fox", "bear", "wolf");

   var animalsDescriptions = new ArrayList<String>();
   var colorsIterator = colors.iterator();
   for (String animal : animals) {
       if (colorsIterator.hasNext()) {
           animalsDescriptions.add("The " + animal.substring(0, 1).toUpperCase() + animal.substring(1) + " is " + colorsIterator.next());
       } else {
           break;
       }
   }
   System.out.println(animalsDescriptions);
}
```

In Kotlin, use [`zip()`](collection-transformations.md#zip) function to do the same in 3 lines instead of 10 lines:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val colors = listOf("red", "brown")
    val animals = listOf("fox", "bear", "wolf")

    println(colors.zip(animals) { color, animal -> "The ${animal.replaceFirstChar { it.uppercase() }} is $color"})
//sampleEnd
}
```
{kotlin-runnable="true"}

### Associate

In Java, to associate elements with some characteristics, you need to iterate over all elements and put the associative value in the map:

```java
// Java
public void associate() {
   var numbers = List.of("one", "two", "three", "four");
   var wordAndLength = new HashMap<String, Integer>();
   for (String number: numbers) {
       wordAndLength.put(number, number.length());
   }
   System.out.println(wordAndLength);
}
```

In Kotlin, use [`associate()`](collection-transformations.md#associate) function:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf("one", "two", "three", "four")
   println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true"}

## What’s next?

* Visit [Kotlin Koans](koans.md).
* Look through other [Kotlin idioms](idioms.md).
* Learn how to convert existing Java code to Kotlin with [Java to Kotlin converter](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k).
* Discover [collections in Kotlin](collections-overview.md).

If you have a favorite idiom, contribute it by sending a pull request.
