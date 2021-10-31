[//]: # (title: Classes)

Classes in Kotlin are declared using the keyword `class`:

```kotlin
class Person { /*...*/ }
```

The class declaration consists of the class name, the class header (specifying its type parameters, the primary constructor, 
and some other things), and the class body surrounded by curly braces. Both the header and the body are optional; if the
class has no body, the curly braces can be omitted.

```kotlin
class Empty
```

## Constructors

A class in Kotlin can have a _primary constructor_ and one or more _secondary constructors_. The primary constructor is a
part of the class header, and it goes after the class name and optional type parameters.

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

If the primary constructor does not have any annotations or visibility modifiers, the `constructor` keyword can be omitted:

```kotlin
class Person(firstName: String) { /*...*/ }
```

The primary constructor cannot contain any code. Initialization code can be placed in _initializer blocks_ prefixed with
the `init` keyword.

During the initialization of an instance, the initializer blocks are executed in the same order as they appear in the
class body, interleaved with the property initializers:

```kotlin
//sampleStart
class InitOrderDemo(name: String) {
    val firstProperty = "First property: $name".also(::println)
    
    init {
        println("First initializer block that prints ${name}")
    }
    
    val secondProperty = "Second property: ${name.length}".also(::println)
    
    init {
        println("Second initializer block that prints ${name.length}")
    }
}
//sampleEnd

fun main() {
    InitOrderDemo("hello")
}
```
{kotlin-runnable="true"}

Primary constructor parameters can be used in the initializer blocks. They can also be used in property initializers
declared in the class body:

```kotlin
class Customer(name: String) {
    val customerKey = name.uppercase()
}
```

Kotlin has a concise syntax for declaring properties and initializing them from the primary constructor:

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int)
```

Such declarations can also include default values of the class properties:

```kotlin
class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true)
```

You can use a [trailing comma](coding-conventions.md#trailing-commas) when you declare class properties:

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // trailing comma
) { /*...*/ }
```

Much like regular properties, properties declared in the primary constructor can be mutable (`var`) or read-only (`val`).

If the constructor has annotations or visibility modifiers, the `constructor` keyword is required and the modifiers go before it:

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

Learn more about [visibility modifiers](visibility-modifiers.md#constructors).

### Secondary constructors

A class can also declare _secondary constructors_, which are prefixed with `constructor`:

```kotlin
class Person(val pets: MutableList<Pet> = mutableListOf())

class Pet {
    constructor(owner: Person) {
        owner.pets.add(this) // adds this pet to the list of its owner's pets
    }
}
```

If the class has a primary constructor, each secondary constructor needs to delegate to the primary constructor, either
directly or indirectly through another secondary constructor(s). Delegation to another constructor of the same class is
done using the `this` keyword:

```kotlin
class Person(val name: String) {
    val children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

Code in initializer blocks effectively becomes part of the primary constructor. Delegation to the primary constructor
happens as the first statement of a secondary constructor, so the code in all initializer blocks and property initializers
is executed before the body of the secondary constructor.

Even if the class has no primary constructor, the delegation still happens implicitly, and the initializer blocks are
still executed:

```kotlin
//sampleStart
class Constructors {
    init {
        println("Init block")
    }

    constructor(i: Int) {
        println("Constructor $i")
    }
}
//sampleEnd

fun main() {
    Constructors(1)
}
```
{kotlin-runnable="true"}

If a non-abstract class does not declare any constructors (primary or secondary), it will have a generated primary constructor
with no arguments. The visibility of the constructor will be public.

If you don't want your class to have a public constructor, declare an empty primary constructor with non-default visibility:

```kotlin
class DontCreateMe private constructor () { /*...*/ }
```

> On the JVM, if all of the primary constructor parameters have default values, the compiler will generate an additional parameterless constructor which will use the default values. This makes it easier to use Kotlin with libraries such as Jackson or JPA that create class instances through parameterless constructors.
>
> ```kotlin
> class Customer(val customerName: String = "")
> ```
>
{type="note"}

## Creating instances of classes

To create an instance of a class, call the constructor as if it were a regular function:

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

> Kotlin does not have a `new` keyword.
>
{type="note"}

The process of creating instances of nested, inner, and anonymous inner classes is described in [Nested classes](nested-classes.md).

## Class members

Classes can contain:

* [Constructors and initializer blocks](classes.md#constructors)
* [Functions](functions.md)
* [Properties](properties.md)
* [Nested and inner classes](nested-classes.md)
* [Object declarations](object-declarations.md)

## Inheritance

Classes can be derived from each other and form inheritance hierarchies.
[Learn more about inheritance in Kotlin](inheritance.md).

## Abstract classes

A class may be declared `abstract`, along with some or all of its members.
An abstract member does not have an implementation in its class.
You don't need to annotate abstract classes or functions with `open`.

```kotlin
abstract class Polygon {
    abstract fun draw()
}

class Rectangle : Polygon() {
    override fun draw() {
        // draw the rectangle
    }
}
```

You can override a non-abstract `open` member with an abstract one.

```kotlin
open class Polygon {
    open fun draw() {
        // some default polygon drawing method
    }
}

abstract class WildShape : Polygon() {
    // Classes that inherit WildShape need to provide their own
    // draw method instead of using the default on Polygon
    abstract override fun draw()
}
```

## Companion objects

If you need to write a function that can be called without having a class instance but that needs access to the internals
of a class (such as a factory method), you can write it as a member of an [object declaration](object-declarations.md) inside that class.

Even more specifically, if you declare a [companion object](object-declarations.md#companion-objects) inside your class,
you can access its members using only the class name as a qualifier.
