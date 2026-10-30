[//]: # (title: Data classes)
[//]: # (description: Learn what data classes in Kotlin are, when to use them, which members the compiler generates for them, and why named data classes are usually better than Pair and Triple.)

A data class is a kind of class optimized for holding data, as opposed to packing related behavior. This follows the
data-oriented programming approach that focuses on simple data structures that hold information as plain values and keeps
the program's logic and behavior in separate functions that operate that data.
Use data classes for the values that your program passes around and stores, for example:

* A user profile or another entity that comes from a database or a server response.
* A point, a size, or a color in a user interface.
* The description of a command or event in your system.
* A result with more than one value, like the quotient and remainder of a division.

The crucial difference with regular classes is that an instance of a data class is in principle determined by the _data_
it holds, as opposed to the identity of the instance. This is visible in the [pre-generated functions](#generated-functions)
that data classes have. Printing an instance of a data class shows all the primary properties, and equality ensures that
two instances holding the same data are considered equal for all purposes.

Kotlin stores data classes like any other class: an instance of a data class is a regular object, and
a variable of a data class type holds a reference to it. Kotlin gives no guarantees about stack or heap allocation, and
a data class is neither a struct nor a value type. If you need a type that wraps a single value, which the compiler can
represent without creating an object, use an [inline value class](inline-classes.md) instead.

## Declare a data class

To declare a data class, add the `data` keyword before the `class` and declare the data that the class holds
as primary constructor parameters:

```kotlin
data class User(val name: String, val age: Int)
```

To keep the generated functions consistent and meaningful, a data class has to fulfill the following requirements:

* The primary constructor must have at least one parameter.
* All primary constructor parameters must be marked as `val` or `var`.
* A data class is always `final`, so it [can't be inherited from](#inheritance).
* No custom implementations of the `componentN()` and `copy()` functions are allowed. But you can still write your own
  `equals()`, `hashCode()`, and `toString()` functions, which replace the [generated ones](#generated-functions).

You can create instances of a data class the same way as instances of any other class: pass the arguments in the order
of the constructor parameters, or pass them by name in any order, for example, `User(age = 35, name = "Jane")`.

As with regular classes, you can give constructor parameters default values so that you can omit them at the call site,
and you can add secondary constructors that build the data from other input and delegate to the primary constructor:

```kotlin
data class Point(val x: Int = 0, val y: Int = 0) {
    // Creates a point from a pair of values
    constructor(pair: Pair<Int, Int>) : this(pair.first, pair.second)
}

fun main() {
    println(Point())
    // Point(x=0, y=0)
    println(Point(y = 5))
    // Point(x=0, y=5)
}
```
{kotlin-runnable="true"}

> On the JVM, if the generated class needs to have a parameterless constructor, default values for the properties have
> to be specified (see [Constructors](classes.md#constructors-and-initializer-blocks)):
>
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

Just like in regular classes, you can add other class members, such as functions, computed properties, or validation in
the `init` block:

```kotlin
data class User(val name: String, val age: Int) {
    init {
        require(age >= 0) { "Age must not be negative" }
    }

    val isAdult: Boolean
        get() = age >= 18

    fun greet() = "Hello, $name!"
}
```

Such members don't take part in the [generated functions](#generated-functions), which are derived only from the
[properties](#properties) of the primary constructor.

You can also declare [extension functions](extensions.md#extension-functions) for a data class in another file,
for example, `fun User.canVote(): Boolean = age >= 18`.

## Generated functions

The following table lists all the members that the compiler automatically generates for a data class:

| Member                                                                                   | Description                                                                                                                                      |
|------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| [`equals()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-any/equals.html)      | Returns `true` if the other instance is of the same type and all the properties of the primary constructor are equal. Used by the `==` operator. |
| [`hashCode()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-any/hash-code.html) | Returns a hash code computed from the properties of the primary constructor, so that instances work as elements of a set and as keys in a map.   |
| [`toString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-any/to-string.html) | Returns a string with the class name and the properties of the primary constructor, such as `User(name=John, age=42)`.                           |
| [`copy()`](#copying)                                                                     | Returns a new instance with the same properties, except for the ones that you pass as arguments.                                                 |
| [`componentN()`](destructuring-declarations.md)                                          | Returns the property at the given position, which makes positional [destructuring declarations](#destructuring) possible.                        |

Here's a short example of the generated functions in action:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val u1 = User("John", 42)
    val u2 = u1.copy(age = 43)

    // toString()
    println(u1)
    // User(name=John, age=42)

    // equals() and componentN() (via destructuring)
    println(u1 == User("John", 42))
    // true
    val (name, age) = u2
    println("$name is $age")
    // John is 43
}
```
{kotlin-runnable="true"}

> The generated `equals()`, `hashCode()`, and `toString()` functions process the properties of the primary constructor
> recursively. If instances refer to each other, these functions can recurse indefinitely
> and fail with a `StackOverflowError`.
>
> For cyclic data structures such as graphs, doubly linked lists, or trees with parent links,
> keep the links outside the data (for example, using identifiers) or use a regular class with custom implementations that
> avoid the recursive cycles.
>
{style="warning"}

### Properties

The compiler uses only the properties defined inside the primary constructor for the automatically generated
functions. To exclude a property from the generated implementations, declare it inside the class body:

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

In the example below, only the `name` property is used inside the `toString()`, `equals()`, `hashCode()`,
and `copy()` implementations, and there is only one component function, `component1()`.
The `age` property is declared inside the class body and is excluded.
Therefore, two `Person` objects with the same `name` but different `age` values are considered equal since `equals()`
only evaluates properties from the primary constructor:

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}

fun main() {
    val person1 = Person("John")
    val person2 = Person("John")
    person1.age = 10
    person2.age = 20

    println("person1 == person2: ${person1 == person2}")
    // person1 == person2: true

    println("person1 with age ${person1.age}: ${person1}")
    // person1 with age 10: Person(name=John)

    println("person2 with age ${person2.age}: ${person2}")
    // person2 with age 20: Person(name=John)
}
```
{kotlin-runnable="true"}

> Prefer `val` over `var` for the properties in the primary constructor of a data class.
> Instances that never change are easier to manage, and their `hashCode()` stays stable while they are
> used in a set or as keys in a map. To change a value, create a new instance with [`copy()`](#copying).
>
{style="tip"}

#### Private properties

A property of the primary constructor can be `private`. The compiler still uses it in the generated functions:
`toString()` prints it, `equals()` and `hashCode()` take it into account, and `copy()` accepts it as a named argument.
Only the corresponding `componentN()` function becomes private:

```kotlin
data class Secret(val id: Int, private val token: String)

fun main() {
    val secret = Secret(1, "abc")

    // The private property is part of the generated toString()
    println(secret)
    // Secret(id=1, token=abc)

    // ... and of the generated equals() and hashCode()
    println(secret == Secret(1, "abc"))
    // true

    // copy() is public and takes the private property by name
    println(secret.copy(token = "xyz"))
    // Secret(id=1, token=xyz)
}
```
{kotlin-runnable="true"}

Because `component2()` is private as well, you can only destructure such an instance inside the class that declares it.

Marking a property as `private` doesn't keep its value out of the output of `toString()`.
If a property holds sensitive data, write `toString()` yourself:

```kotlin
data class Credentials(val user: String, private val password: String) {
    override fun toString(): String = "Credentials(user=$user, password=***)"
}
```

#### Property accessors

A data class doesn't need any special handling of [property accessors](properties.md#custom-getters-and-setters): a `val`
property has a generated getter, and a `var` property has a generated getter and setter, exactly as in regular classes.
On the JVM, this means that `data class User(val name: String, var age: Int)` is visible from Java
code as `getName()`, `getAge()`, and `setAge()`.

You can't write a custom accessor for a property of the primary constructor, as `get()` and `set()` are only allowed on
a property that is declared in the class body. The following code doesn't compile:

```kotlin
data class Temperature(val celsius: Double) {
    // Error: expecting member declaration
    // get() = celsius
}
```

To compute a value from the properties, declare an additional property with a custom getter in the class body:

```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double
        get() = celsius * 9 / 5 + 32
}

fun main() {
    val temperature = Temperature(100.0)

    println(temperature.fahrenheit)
    // 212.0

    // Only the property of the primary constructor is printed
    println(temperature)
    // Temperature(celsius=100.0)
}
```
{kotlin-runnable="true"}

If the callers of your class should see a transformed value instead of the stored one, keep the constructor property
`private` and expose a property with a custom getter. Keep in mind that the generated functions still use the stored
property:

```kotlin
data class Name(private val raw: String) {
    val value: String
        get() = raw.trim()
}

fun main() {
    val name = Name("  Jane  ")

    println(name.value)
    // Jane

    // toString() prints the stored value
    println(name)
    // Name(raw=  Jane  )
}
```
{kotlin-runnable="true"}

#### Collections and arrays

A data class property can have any type, including collections:

* `List`, `Set`, and `Map` of any element type, including other data classes.
* `Array` (with limitations).
* Nullable types, such as `List<String>?`, and empty or default collections, such as `emptyList()`.

You can work with properties that hold a list of objects just like with other collections:

```kotlin
data class Article(val title: String, val tags: List<String>)

fun main() {
    val article = Article("Data classes", listOf("kotlin", "classes"))

    // toString() prints the content of the list
    println(article)
    // Article(title=Data classes, tags=[kotlin, classes])

    println(article.tags.size)
    // 2
    println(article.tags.contains("kotlin"))
    // true
}
```
{kotlin-runnable="true"}

`Set` and `Map` properties work in exactly the same way, and you can give them a default value so that the caller can
omit them:

```kotlin
data class Config(
    val name: String,
    val features: Set<String> = emptySet(),
    val options: Map<String, String> = emptyMap()
)

fun main() {
    val config = Config("server", setOf("logging", "logging"), mapOf("port" to "8080"))

    // A Set keeps only unique elements
    println(config.features)
    // [logging]
    println(config.options["port"])
    // 8080

    // The default values make both collections optional
    println(Config("client"))
    // Config(name=client, features=[], options={})
}
```
{kotlin-runnable="true"}

A data class can also contain a list of objects, which is a common way to describe nested data:

```kotlin
data class Track(val title: String, val seconds: Int)
data class Album(val name: String, val tracks: List<Track>)

fun main() {
    val album = Album(
        "Kotlin Hits",
        listOf(Track("Data classes", 210), Track("Sealed classes", 185))
    )

    // Reads a property of a nested instance
    println(album.tracks.first().title)
    // Data classes

    // Uses the list with the standard collection functions
    println(album.tracks.map { it.seconds }.sum())
    // 395

    // toString() prints the nested instances as well
    println(album)
    // Album(name=Kotlin Hits, tracks=[Track(title=Data classes, seconds=210), Track(title=Sealed classes, seconds=185)])
}
```
{kotlin-runnable="true"}

> Prefer read-only collection types, such as `List` and `Set`, over their mutable counterparts: the elements of a
> mutable collection can change after the instance is created, which changes its `hashCode()`, and the collection is
> shared between an instance and its [copies](#copying).
>
{style="tip"}

The generated `equals()` and `hashCode()` functions call `equals()` and `hashCode()` of every property.
`List`, `Set`, and `Map` compare their contents, so two instances that hold equal elements are equal.
An `Array`, however, is compared by reference, so two instances that hold different arrays with the same elements are
_not_ equal:

```kotlin
data class ListTags(val items: List<String>)
data class ArrayTags(val items: Array<String>)

fun main() {
    // The lists have equal content, so the instances are equal
    println(ListTags(listOf("kotlin", "classes")) == ListTags(listOf("kotlin", "classes")))
    // true

    // The arrays are different objects, so the instances are not equal
    println(ArrayTags(arrayOf("kotlin", "classes")) == ArrayTags(arrayOf("kotlin", "classes")))
    // false
}
```
{kotlin-runnable="true"}

For this reason, prefer `List` over `Array` in data classes. If you have to store an array, for example, because an
external API returns one, write `equals()`, `hashCode()`, and `toString()` yourself and compare the content explicitly:

```kotlin
data class ArrayTags(val items: Array<String>) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || this::class != other::class) return false
        other as ArrayTags
        return items.contentEquals(other.items)
    }

    override fun hashCode(): Int = items.contentHashCode()

    override fun toString(): String = "ArrayTags(items=${items.contentToString()})"
}

fun main() {
    val tags = ArrayTags(arrayOf("kotlin", "classes"))

    println(tags)
    // ArrayTags(items=[kotlin, classes])
    println(tags == ArrayTags(arrayOf("kotlin", "classes")))
    // true
}
```
{kotlin-runnable="true"}

### Equality

In data classes, the `==` operator uses the generated `equals()` function to compare the content, while `===` still
compares identity. So two instances that hold the same values are equal but remain two different objects:

```kotlin
data class User(val name: String, var age: Int)

fun main() {
    val user1 = User("Jane", 35)
    val user2 = User("Jane", 35)

    // The content is equal
    println(user1 == user2)
    // true

    // But these are two different objects
    println(user1 === user2)
    // false

    // Both variables refer to the same object, so the change is visible through both of them
    val sameUser = user1
    sameUser.age = 36
    println(user1.age)
    // 36
}
```
{kotlin-runnable="true"}

For more information about the two kinds of comparison, see [Equality](equality.md).

### Copying

The `copy()` function copies an object, allowing you to alter some of its properties while keeping the rest unchanged.
For `data class User(val name: String, val age: Int)`, the generated implementation is equivalent to the following:

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

You can use the `copy()` function as follows:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val jack = User(name = "Jack", age = 1)
    val olderJack = jack.copy(age = 2)

    println(jack)
    // User(name=Jack, age=1)
    println(olderJack)
    // User(name=Jack, age=2)
}
```
{kotlin-runnable="true"}

The `copy()` function creates a _shallow_ copy of the instance. In other words, it doesn't copy components recursively.
As a result, references to other objects are shared.

For example, if a property holds a mutable list, changes made through the "original" value are also visible through the copy,
and changes made through the copy are visible through the original:

```kotlin
data class Employee(val name: String, val roles: MutableList<String>)

fun main() {
    val original = Employee("Jamie", mutableListOf("developer"))
    val duplicate = original.copy()

    duplicate.roles.add("team lead")

    println(original) 
    // Employee(name=Jamie, roles=[developer, team lead])
    println(duplicate) 
    // Employee(name=Jamie, roles=[developer, team lead])
}
```
{kotlin-runnable="true"}

* As you can see, modifying the `duplicate.roles` property also changes the `original.roles` property because both properties share the same list reference.
* To copy nested data as well, copy it explicitly, for example, with `original.copy(roles = original.roles.toMutableList())`.

To update instances in generic code, declare an interface with the functions that you need and implement them with
`copy()` in each data class:

```kotlin
interface Identified<T> {
    fun withId(id: Int): T
}

data class Task(val id: Int, val title: String) : Identified<Task> {
    override fun withId(id: Int): Task = copy(id = id)
}

fun <T : Identified<T>> reset(item: T): T = item.withId(0)

fun main() {
    println(reset(Task(7, "Write docs")))
    // Task(id=0, title=Write docs)
}
```
{kotlin-runnable="true"}

The compiler generates `copy()` for each data class separately, and the function doesn't come from a common supertype.
This means that you can't call it on a value whose type is a [type parameter](generics.md):

```kotlin
// Error: unresolved reference 'copy'
fun <T> duplicate(value: T): T = value.copy()
```

### Destructuring

The `componentN()` functions generated for data classes make it possible to use them in [destructuring declarations](destructuring-declarations.md).
This way, you can unpack an instance into separate variables in one line:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val jane = User("Jane", 35)
    val (name, age) = jane
    println("$name, $age years of age")
    // Jane, 35 years of age

    // Destructuring also works in a loop
    val users = listOf(User("Jane", 35), User("John", 42))
    for ((userName, userAge) in users) {
        println("$userName: $userAge")
    }
    // Jane: 35
    // John: 42
}
```
{kotlin-runnable="true"}

> Kotlin also supports [name-based destructuring](destructuring-declarations.md#name-based-destructuring), where
> variables match properties by name instead of by position. It's currently
> [Experimental](components-stability.md#stability-levels-explained) and requires an opt-in, but it's planned to become
> the recommended way of destructuring data classes.
>
{style="tip"}

## Inheritance

A data class is always `final`, so **you can't inherit from a data class**:

```kotlin
data class User(val name: String, val age: Int)

// Error: this type is final, so it can't be inherited from
// class Admin(name: String, age: Int) : User(name, age)
```

The limitations are the following:

* A data class can't be marked as `open`, `abstract`, `sealed`, or `inner`, so no other class can extend it.
* A data class can't be the supertype of another class, not even of another data class.

This keeps the generated `equals()`, `hashCode()`, and `copy()` functions consistent: a subclass could add
properties that these functions don't know about.

In the other direction, a data class can have a supertype, but the generated functions only use the properties of its
own primary constructor. Properties that come from a superclass or an interface are ignored by `toString()`,
`equals()`, `hashCode()`, `copy()`, and the `componentN()` functions:

```kotlin
open class Entity {
    var id: Int = 0
}

data class Note(val text: String) : Entity()

fun main() {
    val note1 = Note("Buy milk")
    val note2 = Note("Buy milk")
    note1.id = 1
    note2.id = 2

    // The inherited id property is not part of toString()
    println(note1)
    // Note(text=Buy milk)

    // ... or of equals(), so the two notes are equal
    println(note1 == note2)
    // true
}
```
{kotlin-runnable="true"}

If a value has to take part in comparison and printing, declare it in the primary constructor of the data class,
for example, by overriding a property of the supertype.

To share data or behavior between data classes, declare a supertype that they have in common or put the shared data
inside another data class as a property:

```kotlin
interface Named {
    val name: String
}

// Both data classes share the name property through the interface
data class User(override val name: String, val age: Int) : Named
data class Company(override val name: String, val employees: Int) : Named
```

So, while nothing can extend a data class, a data class itself can have supertypes. It can:

* Implement any number of interfaces, including [sealed interfaces](sealed-classes.md).
* Extend an [`open` or `abstract` class](inheritance.md).
* Extend a [sealed class](sealed-classes.md).

When a supertype declares some of the functions that a data class usually generates, the compiler decides about each
of the generated functions separately, following these rules:

* An explicit implementation of the `equals()`, `hashCode()`, or `toString()` functions in the data class body replaces the
  generated one. The remaining functions are still generated. For example, if you write only `equals()`, the
  compiler still generates `hashCode()` and `toString()`.
* A `final` implementation of `equals()`, `hashCode()`, or `toString()` in a superclass also prevents the generation
  of that particular function, and the inherited implementation is used instead.
* An `open` implementation in a superclass doesn't prevent generation. The generated function overrides the one of the
  superclass.
* If a supertype has `componentN()` functions that are `open` and return compatible types, the
  corresponding functions are generated for the data class and override those of the supertype. If the functions of the
  supertype cannot be overridden because of incompatible signatures or because they are final, an error is reported.

The following example shows the difference between an `open` and a `final` implementation in a superclass:

```kotlin
open class OpenBase {
    override fun toString(): String = "OpenBase"
}

open class FinalBase {
    final override fun toString(): String = "FinalBase"
}

data class WithOpenBase(val x: Int) : OpenBase()
data class WithFinalBase(val x: Int) : FinalBase()

fun main() {
    // The generated toString() overrides the open implementation
    println(WithOpenBase(1))
    // WithOpenBase(x=1)

    // The final implementation of the superclass is used, so nothing is generated
    println(WithFinalBase(1))
    // FinalBase
}
```
{kotlin-runnable="true"}

### Sealed hierarchies

A [sealed class or interface](sealed-classes.md) describes a limited set of cases, and data classes are a natural way
to declare those cases with the data that belongs to each of them. Because the compiler knows all the subclasses of a
sealed supertype, you can handle them in a [`when` expression](control-flow.md#when-expressions-and-statements)
without an `else` branch. The exhaustiveness and the smart casts come from the sealed hierarchy, not from the
subclasses being data classes:

```kotlin
sealed class Result

data class Success(val data: String) : Result()
data class Failure(val code: Int, val message: String) : Result()
object Loading : Result()

// The when expression covers all the subclasses, so no else branch is needed
fun describe(result: Result): String = when (result) {
    // Smart casts give access to the properties of each subclass
    is Success -> "Data: ${result.data}"
    is Failure -> "Error ${result.code}: ${result.message}"
    Loading -> "Loading..."
}

fun main() {
    println(describe(Success("Hello")))
    // Data: Hello
    println(describe(Failure(404, "Not found")))
    // Error 404: Not found
    println(describe(Loading))
    // Loading...

    // The generated functions work as usual in the subclasses
    println(Failure(404, "Not found"))
    // Failure(code=404, message=Not found)
    println(Success("Hello") == Success("Hello"))
    // true
}
```
{kotlin-runnable="true"}

If a case holds no data, declare it as an `object` instead of a data class, like `Loading` in the example above.
The primary constructor of a data class must have at least one parameter, so a data class can't be empty.
For a readable `toString()` in such cases, use a [data object](object-declarations.md#data-objects).

Sealed interfaces work in the same way, and a data class can implement one. Unlike a sealed class, a sealed interface
allows a class to implement multiple supertypes and doesn't participate in the implementing class's constructor.
Direct subclasses of a sealed class or interface must be declared in the same package and module.

> Instances of two different data classes are never equal, even if they hold the same values and share a supertype,
> because the generated `equals()` accepts only instances of the exact same type.
>
{style="note"}

For more examples with `when`, see [Use sealed classes with when expression](sealed-classes.md#use-sealed-classes-with-when-expression).

## Nested data classes

You can declare a data class inside another class. If the nested data class is used only by its enclosing class,
mark it `private` to hide it from the rest of the code. A typical use case is a key for an internal cache:

```kotlin
class SearchCache {
    // The data class is only visible inside SearchCache
    private data class Key(val query: String, val page: Int)

    private val results = mutableMapOf<Key, List<String>>()

    fun put(query: String, page: Int, value: List<String>) {
        results[Key(query, page)] = value
    }

    // The generated equals() and hashCode() make the key work in a map
    fun get(query: String, page: Int): List<String>? = results[Key(query, page)]
}

fun main() {
    val cache = SearchCache()
    cache.put("kotlin", 1, listOf("Data classes"))

    println(cache.get("kotlin", 1))
    // [Data classes]
    println(cache.get("kotlin", 2))
    // null
}
```
{kotlin-runnable="true"}

The enclosing class can be a data class as well, and the nested data class can be `private` there too:

```kotlin
data class Request(val url: String) {
    // Only Request works with this type
    private data class CacheKey(val url: String, val etag: String)

    fun cacheKeyFor(etag: String): String = CacheKey(url, etag).toString()
}

fun main() {
    println(Request("https://kotlinlang.org").cacheKeyFor("v1"))
    // CacheKey(url=https://kotlinlang.org, etag=v1)
}
```
{kotlin-runnable="true"}

Such a [nested class](nested-classes.md) has no access to the members of the outer class. A data class can't be `inner`
either, so it can never hold a reference to an instance of the outer class.

## Standard data classes

The standard library provides two ready-made data classes for grouping values without declaring a class:
[`Pair`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-pair/), which holds two values, and
[`Triple`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-triple/), which holds three.
As all data classes, they have generated functions: `toString()`, `equals()`, `hashCode()`, and `copy()` and support destructuring:

```kotlin
fun main() {
    val pair = Pair("Jane", 35)
    // The to() infix function also creates a Pair
    val samePair = "Jane" to 35
    val triple = Triple("Jane", 35, "Berlin")

    println(pair)
    // (Jane, 35)
    println(pair == samePair)
    // true
    println(triple.third)
    // Berlin
}
```
{kotlin-runnable="true"}

The drawback is that `Pair` and `Triple` describe only _how many_ values they hold, not _what_ those values mean.
Their properties are called `first`, `second`, and `third`, so the reader has to guess the meaning from the context:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val pair: Pair<String, Int> = Pair("Jane", 35)
    val user = User("Jane", 35)

    // What do first and second stand for?
    println("${pair.first} is ${pair.second} years old")
    // Jane is 35 years old

    // The property names describe the data
    println("${user.name} is ${user.age} years old")
    // Jane is 35 years old
}
```
{kotlin-runnable="true"}

Use `Pair` and `Triple` for short-lived values where the meaning is clear from the surrounding code,
for example, returning two values from a small local function, or creating map entries with `to`. In most cases,
it's recommended to use named data classes instead.

## What's next?

* Learn how to unpack an instance into variables in [Destructuring declarations](destructuring-declarations.md).
* Learn more about declaring classes, constructors, and members in [Classes](classes.md).
* Learn how to use data classes as the cases of a restricted hierarchy in [Sealed classes and interfaces](sealed-classes.md).
* Learn the difference between comparing content and comparing identity in [Equality](equality.md).
* Learn about a type that wraps a single value without creating an object in [Inline value classes](inline-classes.md).
* Read more about signatures of the generated functions in the [Kotlin language specification](https://kotlinlang.org/spec/declarations.html#data-class-declaration).
