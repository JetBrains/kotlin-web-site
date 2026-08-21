[//]: # (title: Data classes)
[//]: # (description: Learn what data classes in Kotlin are, when to use them, which members the compiler generates for them, and why named data classes are usually better than Pair and Triple.)

A data class is a class whose main job is to hold data. It behaves like any other class, but the compiler
automatically generates the members that you would otherwise write by hand: printing an instance as readable text,
comparing two instances by their content, and copying an instance with some values changed.

Use data classes for the values that your program passes around and stores, for example:

* A user profile or another entity that comes from a database or a server response.
* A point, a size, or a color in a user interface.
* A parameter object that groups several related arguments.
* A result that consists of more than one value.

To declare a data class, add the `data` keyword before `class`, and declare the data that the class holds
as primary constructor parameters:

```kotlin
data class User(val name: String, val age: Int)
```

Create instances of a data class the same way as instances of any other class. You can pass the arguments in the order
of the constructor parameters, or pass them by name in any order:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
//sampleStart
    val john = User("John", 42)
    val jane = User(age = 35, name = "Jane")

    println(john)
    // User(name=John, age=42)
    println(jane)
    // User(name=Jane, age=35)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

As with regular classes, you can give constructor parameters default values, so that you can omit them at the call site:

```kotlin
data class Point(val x: Int = 0, val y: Int = 0)

fun main() {
//sampleStart
    println(Point())
    // Point(x=0, y=0)
    println(Point(y = 5))
    // Point(x=0, y=5)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also add secondary constructors that build the data from other input and delegate to the primary constructor:

```kotlin
data class Point(val x: Int, val y: Int) {
    // Creates a point on the diagonal from a single number
    constructor(value: Int) : this(value, value)
}

fun main() {
//sampleStart
    println(Point(2, 3))
    // Point(x=2, y=3)
    println(Point(4))
    // Point(x=4, y=4)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The compiler generates these members from all the properties declared in the primary constructor. For the full list
with descriptions, see [Generated members](#generated-members). Besides the generated members, a data class can
contain [functions of its own](#functions), just like any other class.

To keep the generated members consistent and meaningful, a data class has to fulfill the following requirements:

* The primary constructor must have at least one parameter.
* All primary constructor parameters must be marked as `val` or `var`.
* A data class can't be abstract, open, sealed, or inner. It can't be inherited from either, but it can extend
  another class or implement interfaces. For details, see [Inheritance](#inheritance).
* You can't provide explicit implementations of the `componentN()` and `copy()` functions.

> On the JVM, if the generated class needs to have a parameterless constructor, default values for the properties have
> to be specified (see [Constructors](classes.md#constructors-and-initializer-blocks)):
>
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## Data classes compared to ordinary classes

An ordinary class only has the members that you declare in it. It inherits the default `toString()` and `equals()`
implementations from `Any`, which means that printing an instance shows the class name and an identifier,
and that two instances are only equal if they are the same object:

```kotlin
class OrdinaryUser(val name: String, val age: Int)

fun main() {
//sampleStart
    val user1 = OrdinaryUser("John", 42)
    val user2 = OrdinaryUser("John", 42)

    println(user1)
    // OrdinaryUser@6b884d57 (the identifier differs on every run)
    println(user1 == user2)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

With the `data` keyword, the same class immediately becomes convenient to print, compare, copy, and
[destructure](destructuring-declarations.md):

```kotlin
data class User(val name: String, val age: Int)

fun main() {
//sampleStart
    val user1 = User("John", 42)
    val user2 = User("John", 42)

    // toString() shows the property values
    println(user1)
    // User(name=John, age=42)

    // equals() compares the property values
    println(user1 == user2)
    // true

    // hashCode() makes instances usable as keys in maps and elements in sets
    println(setOf(user1, user2).size)
    // 1

    // copy() creates a new instance with some properties changed
    println(user1.copy(age = 43))
    // User(name=John, age=43)

    // componentN() functions allow destructuring
    val (name, age) = user1
    println("$name is $age years old")
    // John is 42 years old
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Data classes are still ordinary classes, so you can add anything else that a class can have,
such as [functions](#functions), computed properties, or validation in an `init` block:

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

> Prefer `val` over `var` for the properties of a data class.
> Instances that never change are easier to reason about, and their `hashCode()` stays stable while they are
> used in a set or as keys in a map. To change a value, create a new instance with [`copy()`](#copying).
>
{style="tip"}

## Example: data classes in a program

The following example shows a typical use of data classes: a list of orders that the program filters, updates,
and groups. Because `Order` and `Customer` are data classes, you get readable output, comparison by content,
and updated copies without writing any of that code yourself:

```kotlin
data class Customer(val name: String, val city: String)
data class Order(val id: Int, val customer: Customer, val total: Double, val paid: Boolean = false)

fun main() {
//sampleStart
    val orders = listOf(
        Order(1, Customer("Jane", "Berlin"), 25.0),
        Order(2, Customer("John", "Madrid"), 60.0, paid = true),
        Order(3, Customer("Jane", "Berlin"), 15.5)
    )

    // Reads the properties, just like with any other class
    val unpaid = orders.filter { !it.paid }
    println(unpaid.size)
    // 2

    // toString() prints all the values, which is handy for logging
    println(unpaid.first())
    // Order(id=1, customer=Customer(name=Jane, city=Berlin), total=25.0, paid=false)

    // copy() marks an order as paid and leaves the original unchanged
    val paidOrder = unpaid.first().copy(paid = true)
    println(paidOrder)
    // Order(id=1, customer=Customer(name=Jane, city=Berlin), total=25.0, paid=true)

    // equals() and hashCode() compare customers by content, so grouping works as expected
    val ordersPerCustomer = orders.groupBy { it.customer }
    println(ordersPerCustomer[Customer("Jane", "Berlin")]?.size)
    // 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Properties

The compiler only uses the properties defined inside the primary constructor for the automatically generated
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
//sampleStart
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
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Private properties

A property of the primary constructor can be `private`. The compiler still uses it in the generated functions:
`toString()` prints it, `equals()` and `hashCode()` take it into account, and `copy()` accepts it as a named argument.
Only the corresponding `componentN()` function becomes private:

```kotlin
data class Secret(val id: Int, private val token: String)

fun main() {
//sampleStart
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
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Because `component2()` is private as well, you can only destructure such an instance inside the class that declares it.

> Marking a property as `private` doesn't keep its value out of the output of `toString()`.
> If a property holds sensitive data, write `toString()` yourself:
>
> ```kotlin
> data class Credentials(val user: String, private val password: String) {
>     override fun toString(): String = "Credentials(user=$user, password=***)"
> }
> ```
>
{style="note"}

### Property accessors

A data class doesn't need any special handling of [property accessors](properties.md#getters-and-setters): a `val`
property has a generated getter and a `var` property has a generated getter and setter, exactly as in a class without
the `data` keyword. On the JVM, this means that `data class User(val name: String, var age: Int)` is visible from Java
code as `getName()`, `getAge()`, and `setAge()`.

You can't write a custom accessor for a property of the primary constructor, as `get()` and `set()` are only allowed on
a property that is declared in the class body. The following code doesn't compile:

```kotlin
data class Temperature(val celsius: Double) {
    // Error: expecting member declaration
    // get() = celsius
}
```

To compute a value from the properties, declare an additional property with a custom getter in the class body.
Such a property is excluded from the generated functions, just like any other property of the class body:

```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double
        get() = celsius * 9 / 5 + 32
}

fun main() {
//sampleStart
    val temperature = Temperature(100.0)

    println(temperature.fahrenheit)
    // 212.0

    // Only the property of the primary constructor is printed
    println(temperature)
    // Temperature(celsius=100.0)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If the callers of your class should see a transformed value instead of the stored one, keep the constructor property
`private` and expose a property with a custom getter. Keep in mind that the generated functions still use the stored
property:

```kotlin
data class Name(private val raw: String) {
    val value: String
        get() = raw.trim()
}

fun main() {
//sampleStart
    val name = Name("  Jane  ")

    println(name.value)
    // Jane

    // toString() prints the stored value
    println(name)
    // Name(raw=  Jane  )
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Functions

A data class can contain functions. Declare them in the class body with the `fun` keyword, exactly as you would
in a class without the `data` keyword:

```kotlin
data class Rectangle(val width: Int, val height: Int) {
    // Computes a value from the properties
    fun area(): Int = width * height

    // Takes a parameter and returns a new instance
    fun scaledBy(factor: Int): Rectangle = Rectangle(width * factor, height * factor)
}

fun main() {
//sampleStart
    val rectangle = Rectangle(3, 4)

    println(rectangle.area())
    // 12
    println(rectangle.scaledBy(2))
    // Rectangle(width=6, height=8)

    // The generated members work as usual and ignore the functions
    println(rectangle)
    // Rectangle(width=3, height=4)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Such functions are different from the members that the compiler generates:

* You write them yourself, and they can do anything that a function in an ordinary class can do.
* They don't change the [generated members](#generated-members). `toString()`, `equals()`, `hashCode()`, `copy()`,
  and the `componentN()` functions are still derived only from the properties of the primary constructor.
* They aren't limited to the class body. You can also declare
  [extension functions](extensions.md#extension-functions) for a data class in another file, for example,
  `fun Rectangle.isSquare(): Boolean = width == height`.

## Generated members

The following table lists all the members that the compiler generates for a data class:

| Member | Description |
|---|---|
| [`equals()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-any/equals.html) | Returns `true` if the other instance is of the same type and all the properties of the primary constructor are equal. Used by the `==` operator. |
| [`hashCode()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-any/hash-code.html) | Returns a hash code computed from the properties of the primary constructor, so that instances work as elements of a set and as keys in a map. |
| [`toString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-any/to-string.html) | Returns a string with the class name and the properties of the primary constructor, such as `User(name=John, age=42)`. |
| [`copy()`](#copying) | Returns a new instance with the same properties, except for the ones that you pass as arguments. |
| [`componentN()`](destructuring-declarations.md) | Returns the property at the given position, which makes [destructuring declarations](#data-classes-and-destructuring-declarations) possible. |

Data classes have no other generated members, and they inherit the rest of their members from
[`Any`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-any/), the superclass of every Kotlin class.
The compiler generates these members for your own class, so they don't have a page of their own in the API reference;
`equals()`, `hashCode()`, and `toString()` override the functions of the same name in `Any`.

The compiler decides about each of these functions separately, following these rules:

* An explicit implementation of `equals()`, `hashCode()`, or `toString()` in the data class body replaces the
  generated one. The remaining two functions are still generated. For example, if you write only `equals()`, the
  compiler still generates `hashCode()` and `toString()`.
* A `final` implementation of `equals()`, `hashCode()`, or `toString()` in a superclass also prevents the generation
  of that particular function, and the inherited implementation is used.
* An `open` implementation in a superclass doesn't prevent generation. The generated function overrides the one of the
  superclass.
* If a supertype has `componentN()` functions that are `open` and return compatible types, the
  corresponding functions are generated for the data class and override those of the supertype. If the functions of the
  supertype cannot be overridden due to incompatible signatures or due to their being final, an error is reported.
* Providing explicit implementations for the `componentN()` and `copy()` functions is not allowed.

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
//sampleStart
    // The generated toString() overrides the open implementation
    println(WithOpenBase(1))
    // WithOpenBase(x=1)

    // The final implementation of the superclass is used, so nothing is generated
    println(WithFinalBase(1))
    // FinalBase
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For the exact signatures of these members, see
[Data class declaration](https://kotlinlang.org/spec/declarations.html#data-class-declaration) in the Kotlin language
specification.

## Inheritance

A data class is always `final`, so **you can't inherit from a data class**:

```kotlin
data class User(val name: String, val age: Int)

// Error: this type is final, so it can't be inherited from
//class Admin(name: String, age: Int) : User(name, age)
```

The limitations are the following:

* A data class can't be marked as `open`, `abstract`, `sealed`, or `inner`, so no other class can extend it.
* A data class can't be the supertype of another class, not even of another data class.

This keeps the generated `equals()`, `hashCode()`, and `copy()` functions consistent: a subclass could add
properties that these functions know nothing about.

In the other direction, a data class can have a supertype, but the generated functions only use the properties of its
own primary constructor. Properties that come from a superclass or an interface are ignored by `toString()`,
`equals()`, `hashCode()`, `copy()`, and the `componentN()` functions:

```kotlin
open class Entity {
    var id: Int = 0
}

data class Note(val text: String) : Entity()

fun main() {
//sampleStart
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
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If a value has to take part in comparison and printing, declare it in the primary constructor of the data class,
for example, by overriding a property of the supertype.

To share data or behavior between data classes, declare a supertype that they have in common, or put the shared data
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

### Sealed hierarchy

A [sealed class](sealed-classes.md) describes a limited set of cases, and data classes are a natural way to declare
those cases with the data that belongs to each of them. Because the compiler knows all the subclasses of a sealed
class, you can handle them in a [`when` expression](control-flow.md#when-expressions-and-statements) without an
`else` branch.

The `data` keyword itself doesn't give a class any special treatment in `when`. The exhaustiveness and the smart casts
in the following example come from the sealed hierarchy, not from the subclasses being data classes. There is also no
destructuring form inside `when`; to work with the properties as separate variables, destructure the subject
beforehand, as in `val (code, message) = failure`:

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
//sampleStart
    println(describe(Success("Hello")))
    // Data: Hello
    println(describe(Failure(404, "Not found")))
    // Error 404: Not found
    println(describe(Loading))
    // Loading...

    // The generated members work as usual in the subclasses
    println(Failure(404, "Not found"))
    // Failure(code=404, message=Not found)
    println(Success("Hello") == Success("Hello"))
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If a case holds no data, declare it as an `object` instead of a data class, like `Loading` in the example above.
The primary constructor of a data class must have at least one parameter, so a data class can't be empty.
For a readable `toString()` in such cases, use a [data object](object-declarations.md#data-objects).

### Sealed interface hierarchy

Sealed interfaces work in the same way, and a data class can implement one. Unlike a sealed class, a sealed interface
lets a class implement several supertypes and doesn't take part in the constructor of the implementing class:

```kotlin
import kotlin.math.PI

sealed interface Shape {
    fun area(): Double
}

data class Circle(val radius: Double) : Shape {
    override fun area(): Double = PI * radius * radius
}

data class Square(val side: Double) : Shape {
    override fun area(): Double = side * side
}

fun main() {
//sampleStart
    val shapes: List<Shape> = listOf(Circle(1.0), Square(2.0))

    for (shape in shapes) {
        // The when expression is exhaustive here as well
        val name = when (shape) {
            is Circle -> "Circle"
            is Square -> "Square"
        }
        println("$name with area ${shape.area()}: $shape")
    }
    // Circle with area 3.141592653589793: Circle(radius=1.0)
    // Square with area 4.0: Square(side=2.0)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

Direct subclasses of a sealed class or interface must be declared in the same package and module.
For the full set of rules, see [Sealed classes and interfaces](sealed-classes.md), and for more examples with `when`,
see [Use sealed classes with when expression](sealed-classes.md#use-sealed-classes-with-when-expression).

> Instances of two different data classes are never equal, even if they hold the same values and share a supertype.
> The generated `equals()` also only compares the properties of the primary constructor of the data class itself,
> as described in [Inheritance](#inheritance).
>
{style="note"}

## Collections as properties

A data class property can have any type, including collections, so a data class can hold a list of objects.
The types that you need every day work without any extra code:

* `List`, `Set`, and `Map` of any element type, including other data classes.
* `Array`, with the [limitation described below](#arrays).
* Nullable types, such as `List<String>?`, and empty or default collections, such as `emptyList()`.

You work with such a property just like with any other collection:

```kotlin
data class Article(val title: String, val tags: List<String>)

fun main() {
//sampleStart
    val article = Article("Data classes", listOf("kotlin", "classes"))

    // toString() prints the content of the list
    println(article)
    // Article(title=Data classes, tags=[kotlin, classes])

    println(article.tags.size)
    // 2
    println(article.tags.contains("kotlin"))
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`Set` and `Map` properties work in exactly the same way, and you can give them a default value so that the caller can
omit them:

```kotlin
data class Config(
    val name: String,
    val features: Set<String> = emptySet(),
    val options: Map<String, String> = emptyMap()
)

fun main() {
//sampleStart
    val config = Config("server", setOf("logging", "logging"), mapOf("port" to "8080"))

    // A Set keeps only unique elements
    println(config.features)
    // [logging]
    println(config.options["port"])
    // 8080

    // The default values make both collections optional
    println(Config("client"))
    // Config(name=client, features=[], options={})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

A data class can also contain a list of objects, which is a common way to describe nested data:

```kotlin
data class Track(val title: String, val seconds: Int)
data class Album(val name: String, val tracks: List<Track>)

fun main() {
//sampleStart
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
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> Prefer read-only collection types, such as `List` and `Set`, over their mutable counterparts.
> The elements of a mutable collection can change after the instance is created, which changes its `hashCode()`
> and makes the instance impossible to find in a set or a map. A mutable collection is also shared between an instance
> and its [copies](#copying).
>
{style="tip"}

### Arrays

The generated `equals()` and `hashCode()` functions call `equals()` and `hashCode()` of every property.
`List`, `Set`, and `Map` compare their content, so two instances that hold equal elements are equal.
An `Array`, however, is compared by reference, so two instances that hold different arrays with the same elements are
_not_ equal:

```kotlin
data class ListTags(val items: List<String>)
data class ArrayTags(val items: Array<String>)

fun main() {
//sampleStart
    // The lists have equal content, so the instances are equal
    println(ListTags(listOf("kotlin", "classes")) == ListTags(listOf("kotlin", "classes")))
    // true

    // The arrays are different objects, so the instances are not equal
    println(ArrayTags(arrayOf("kotlin", "classes")) == ArrayTags(arrayOf("kotlin", "classes")))
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

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
//sampleStart
    val tags = ArrayTags(arrayOf("kotlin", "classes"))

    println(tags)
    // ArrayTags(items=[kotlin, classes])
    println(tags == ArrayTags(arrayOf("kotlin", "classes")))
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Copying

Use the `copy()` function to copy an object, allowing you to alter _some_ of its properties while keeping the rest unchanged.
For `data class User(val name: String, val age: Int)`, the generated implementation is equivalent to the following:

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

You can then write the following:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
//sampleStart
    val jack = User(name = "Jack", age = 1)
    val olderJack = jack.copy(age = 2)

    println(jack)
    // User(name=Jack, age=1)
    println(olderJack)
    // User(name=Jack, age=2)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

As you can see, modifying the `duplicate.roles` property also changes the `original.roles` property because both properties share the same list reference.

To copy nested data as well, copy it explicitly, for example, with `original.copy(roles = original.roles.toMutableList())`.

### Copying in generic code

The compiler generates `copy()` for each data class separately, and the function doesn't come from a common supertype.
This means that you can't call it on a value whose type is a [type parameter](generics.md):

```kotlin
// Error: unresolved reference 'copy'
//fun <T> duplicate(value: T): T = value.copy()
```

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
//sampleStart
    println(reset(Task(7, "Write docs")))
    // Task(id=0, title=Write docs)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Data classes and destructuring declarations

_Component functions_ generated for data classes make it possible to use them in [destructuring declarations](destructuring-declarations.md).
This way, you can unpack an instance into separate variables in one line:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
//sampleStart
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
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Nested data classes

A data class can be declared inside another class, and you can restrict it to that class with the `private` modifier.
This is useful for data that only the enclosing class works with, such as a key of an internal cache:

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
//sampleStart
    val cache = SearchCache()
    cache.put("kotlin", 1, listOf("Data classes"))

    println(cache.get("kotlin", 1))
    // [Data classes]
    println(cache.get("kotlin", 2))
    // null
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The enclosing class can be a data class as well, and the nested data class can be `private` there too:

```kotlin
data class Request(val url: String) {
    // Only Request works with this type
    private data class CacheKey(val url: String, val etag: String)

    fun cacheKeyFor(etag: String): String = CacheKey(url, etag).toString()
}

fun main() {
//sampleStart
    println(Request("https://kotlinlang.org").cacheKeyFor("v1"))
    // CacheKey(url=https://kotlinlang.org, etag=v1)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Such a [nested class](nested-classes.md) has no access to the members of the outer class. A data class can't be `inner`
either, so it can never hold a reference to an instance of the outer class.

## Instances are objects, not values

The `data` keyword doesn't change how Kotlin stores an instance: an instance of a data class is an ordinary object, and
a variable of a data class type holds a reference to it. Kotlin gives no guarantees about stack or heap allocation, and
a data class is neither a struct nor a value type.

What the `data` keyword changes is comparison: `==` uses the generated `equals()` and compares the content, while `===`
still compares identity. Two instances that hold the same values are equal but remain two different objects:

```kotlin
data class User(val name: String, var age: Int)

fun main() {
//sampleStart
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
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For more information about the two kinds of comparison, see [Equality](equality.md). If you need a type that wraps a
single value and that the compiler can represent without creating an object, use an
[inline value class](inline-classes.md) instead.

## Cyclic data structures

The generated `equals()`, `hashCode()`, and `toString()` functions process the properties of the primary constructor
recursively. If instances refer to each other, these functions call themselves over and over again and fail with a
`StackOverflowError`:

```kotlin
data class Employee(val name: String, var manager: Employee? = null)

fun main() {
//sampleStart
    val jane = Employee("Jane")
    val john = Employee("John")

    // The two instances refer to each other
    jane.manager = john
    john.manager = jane

    try {
        println(jane)
    } catch (e: StackOverflowError) {
        println("toString() doesn't terminate")
    }
    // toString() doesn't terminate
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Therefore, data classes are a poor fit for cyclic data structures, such as graphs, doubly linked lists, or trees with a
reference to the parent node. To work with such data, you can:

* Store an identifier of the related instance, such as `val managerId: Int?`, instead of a reference to it.
* Keep the links outside the data, for example, in a map from an identifier to its neighbors.
* Use an ordinary class and write `equals()`, `hashCode()`, and `toString()` yourself so that they don't follow the
  cyclic references.

## Standard data classes

The standard library provides two ready-made data classes for grouping values without declaring a class:
[`Pair`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-pair/), which holds two values, and
[`Triple`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-triple/), which holds three.
They are data classes themselves, so they support `toString()`, `equals()`, `hashCode()`, `copy()`, and destructuring:

```kotlin
fun main() {
//sampleStart
    val pair = Pair("Jane", 35)
    // The to infix function creates a Pair as well
    val samePair = "Jane" to 35
    val triple = Triple("Jane", 35, "Berlin")

    println(pair)
    // (Jane, 35)
    println(pair == samePair)
    // true
    println(triple.third)
    // Berlin
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The drawback is that `Pair` and `Triple` describe only _how many_ values they hold, not _what_ those values mean.
Their properties are called `first`, `second`, and `third`, so the reader has to guess the meaning from the context:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
//sampleStart
    val pair: Pair<String, Int> = Pair("Jane", 35)
    val user = User("Jane", 35)

    // What do first and second stand for?
    println("${pair.first} is ${pair.second} years old")
    // Jane is 35 years old

    // The property names describe the data
    println("${user.name} is ${user.age} years old")
    // Jane is 35 years old
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

This is why a named data class is usually the better choice:

* The names explain the data. `User(name, age)` tells you what the values mean, while `Pair<String, Int>` doesn't.
* The compiler catches mistakes. A `User` and a `City` can't be mixed up, even if both hold a `String` and an `Int`,
  but two `Pair<String, Int>` values can.
* It can grow with your code. You can add a property, a default value, a function, or validation.
  `Pair` and `Triple` always hold exactly two or three values.

Use `Pair` and `Triple` for short-lived values where the meaning is clear from the code around them,
for example, returning two values from a small local function, or creating map entries with `to`.

## What's next?

* See the full list of members that the compiler generates in [Generated members](#generated-members).
* Learn how to unpack an instance into variables in [Destructuring declarations](destructuring-declarations.md).
* Learn more about declaring classes, constructors, and members in [Classes](classes.md).
* Learn how to use data classes as the cases of a restricted hierarchy in [Sealed classes and interfaces](sealed-classes.md).
* Learn the difference between comparing content and comparing identity in [Equality](equality.md).
* Learn about a type that wraps a single value without creating an object in [Inline value classes](inline-classes.md).
* Read the formal rules for data classes in the [Kotlin language specification](https://kotlinlang.org/spec/declarations.html#data-class-declaration).
