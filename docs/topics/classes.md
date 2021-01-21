[//]: # (title: Classes and inheritance)

## Classes

Classes in Kotlin are declared using the keyword `class`:

```kotlin
class Invoice { /*...*/ }
```

The class declaration consists of the class name, the class header (specifying its type parameters, the primary
constructor etc.) and the class body, surrounded by curly braces. Both the header and the body are optional;
if the class has no body, curly braces can be omitted.

```kotlin
class Empty
```

### Constructors

A class in Kotlin can have a _primary constructor_ and one or more _secondary constructors_. The primary
constructor is part of the class header: it goes after the class name (and optional type parameters).

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

If the primary constructor does not have any annotations or visibility modifiers, the `constructor`
keyword can be omitted:

```kotlin
class Person(firstName: String) { /*...*/ }
```

The primary constructor cannot contain any code. Initialization code can be placed
in _initializer blocks_, which are prefixed with the `init` keyword.

During an instance initialization, the initializer blocks are executed in the same order as they appear 
in the class body, interleaved with the property initializers:

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

Parameters of the primary constructor can be used in the initializer blocks. They can also be used in
property initializers declared in the class body:

```kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```

In fact, for declaring properties and initializing them from the primary constructor, Kotlin has a concise syntax:

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int) { /*...*/ }
```

You can use a [trailing comma](coding-conventions.md#trailing-commas) when you declare class properties:

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // trailing comma
) { /*...*/ }
```

Much the same way as regular properties, the properties declared in the primary constructor can be
mutable (`var`) or read-only (`val`).

If the constructor has annotations or visibility modifiers, the `constructor` keyword is required, and
the modifiers go before it:

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

Learn more about [visibility modifiers](visibility-modifiers.md#constructors).

#### Secondary constructors

The class can also declare _secondary constructors_, which are prefixed with `constructor`:

```kotlin
class Person {
    var children: MutableList<Person> = mutableListOf()
    constructor(parent: Person) {
        parent.children.add(this)
    }
}
```

If the class has a primary constructor, each secondary constructor needs to delegate to the primary constructor, either
directly or indirectly through another secondary constructor(s). Delegation to another constructor of the same class
is done using the `this` keyword:

```kotlin
class Person(val name: String) {
    var children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

Code in initializer blocks effectively becomes part of the primary constructor. Delegation to the primary
constructor happens as the first statement of a secondary constructor, so the code in all initializer blocks and property initializers is executed
before the secondary constructor body. 

Even if the class has no primary constructor, the delegation still happens
implicitly, and the initializer blocks are still executed:

```kotlin
//sampleStart
class Constructors {
    init {
        println("Init block")
    }

    constructor(i: Int) {
        println("Constructor")
    }
}
//sampleEnd

fun main() {
    Constructors(1)
}
```
{kotlin-runnable="true"}

If a non-abstract class does not declare any constructors (primary or secondary), it will have a generated primary
constructor with no arguments. The visibility of the constructor will be public.

If you don't want your class
to have a public constructor, declare an empty primary constructor with non-default visibility:

```kotlin
class DontCreateMe private constructor () { /*...*/ }
```

> On the JVM, if all of the parameters of the primary constructor have default values, the compiler will
> generate an additional parameterless constructor which will use the default values. This makes it easier to use
> Kotlin with libraries such as Jackson or JPA that create class instances through parameterless constructors.
>
> ```kotlin
> class Customer(val customerName: String = "")
> ```
> 
{type="note"}

### Creating instances of classes

To create an instance of a class, call the constructor as if it were a regular function:

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

> Kotlin does not have a `new` keyword.
>
{type="note"}

Creating instances of nested, inner and anonymous inner classes is described in [Nested classes](nested-classes.md).

### Class members

Classes can contain:

* [Constructors and initializer blocks](classes.md#constructors)
* [Functions](functions.md)
* [Properties](properties.md)
* [Nested and inner classes](nested-classes.md)
* [Object declarations](object-declarations.md)

## Inheritance

All classes in Kotlin have a common superclass `Any`, that is the default superclass for a class with no supertypes declared:

```kotlin
class Example // Implicitly inherits from Any
```

`Any` has three methods: `equals()`, `hashCode()` and `toString()`. Thus, they are defined for all Kotlin classes. 

By default, Kotlin classes are final: they can’t be inherited.
To make a class inheritable, mark it with the `open` keyword.

```kotlin
open class Base //Class is open for inheritance

```

To declare an explicit supertype, place the type after a colon in the class header:

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

If the derived class has a primary constructor, the base class can (and must) be initialized right there,
using the parameters of the primary constructor.

If the derived class has no primary constructor, then each secondary constructor has to initialize the base type
using the `super` keyword, or to delegate to another constructor which does that.
Note that in this case different secondary constructors can call different constructors of the base type:

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

### Overriding methods

Kotlin requires explicit modifiers for overridable members and overrides:

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

The `override` modifier is required for `Circle.draw()`. If it were missing, the compiler would complain.
If there is no `open` modifier on a function, like `Shape.fill()`, declaring a method with the same signature in a subclass is illegal,
either with `override` or without it. The `open` modifier has no effect when added on members of a final class (i.e.. a class with no `open` modifier).

A member marked `override` is itself open, i.e. it may be overridden in subclasses. If you want to prohibit re-overriding, use `final`:

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

### Overriding properties 

Overriding properties works in a similar way to overriding methods; properties declared on a superclass 
that are then redeclared on a derived class must be prefaced with `override`, and they must have a compatible type.
Each declared property can be overridden by a property with an initializer or by a property with a `get` method.

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

You can also override a `val` property with a `var` property, but not vice versa.
This is allowed because a `val` property essentially declares a `get` method,
and overriding it as a `var` additionally declares a `set` method in the derived class.

Note that you can use the `override` keyword as part of the property declaration in a primary constructor.

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // Always has 4 vertices

class Polygon : Shape {
    override var vertexCount: Int = 0  // Can be set to any number later
}
```

### Derived class initialization order

During construction of a new instance of a derived class, the base class initialization is done as the first step (preceded only by evaluation of the arguments for the base class constructor) and thus happens before the initialization logic of the derived class is run. 

```kotlin
//sampleStart
open class Base(val name: String) {

    init { println("Initializing a base class") }

    open val size: Int = 
        name.length.also { println("Initializing size in the base class: $it") }
}

class Derived(
    name: String,
    val lastName: String,
) : Base(name.capitalize().also { println("Argument for the base class: $it") }) {

    init { println("Initializing a derived class") }

    override val size: Int =
        (super.size + lastName.length).also { println("Initializing size in the derived class: $it") }
}
//sampleEnd

fun main() {
    println("Constructing the derived class(\"hello\", \"world\")")
    val d = Derived("hello", "world")
}
```
{kotlin-runnable="true"}

It means that, by the time of the base class constructor execution, the properties declared or overridden in the derived class are not yet initialized. If any of those properties are used in the base class initialization logic (either directly or indirectly, through another overridden `open` member implementation), it may lead to incorrect behavior or a runtime failure. When designing a base class, you should therefore avoid using `open` members in the constructors, property initializers, and `init` blocks.

### Calling the superclass implementation

Code in a derived class can call its superclass functions and property accessors implementations using the `super` keyword:

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

class FilledRectangle : Rectangle() {
    override fun draw() {
        super.draw()
        println("Filling the rectangle")
    }

    val fillColor: String get() = super.borderColor
}
```

Inside an inner class, accessing the superclass of the outer class is done with the `super` keyword qualified with the outer class name: `super@Outer`:

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

//sampleStart
class FilledRectangle: Rectangle() {
    override fun draw() { 
    	val filler = Filler()
        filler.drawAndFill()
    }
    
    inner class Filler {
        fun fill() { println("Filling") }
        fun drawAndFill() {
            super@FilledRectangle.draw() // Calls Rectangle's implementation of draw()
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // Uses Rectangle's implementation of borderColor's get()
        }
    }
}
//sampleEnd

fun main() {
    val fr = FilledRectangle()
        fr.draw()
}
```
{kotlin-runnable="true"}

### Overriding rules

In Kotlin, implementation inheritance is regulated by the following rule: if a class inherits multiple implementations of the same member from its immediate superclasses,
it must override this member and provide its own implementation (perhaps, using one of the inherited ones).

To denote the supertype from which the inherited implementation is taken, use `super` qualified by the supertype name in angle brackets, e.g. `super<Base>`:

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // interface members are 'open' by default
}

class Square() : Rectangle(), Polygon {
    // The compiler requires draw() to be overridden:
    override fun draw() {
        super<Rectangle>.draw() // call to Rectangle.draw()
        super<Polygon>.draw() // call to Polygon.draw()
    }
}
```

It's fine to inherit from both `Rectangle` and `Polygon`,
but both of them have their implementations of `draw()`, so you need to override `draw()` in `Square`
and provide its own implementation that eliminates the ambiguity.

## Abstract classes

A class and some of its members may be declared `abstract`.
An abstract member does not have an implementation in its class.
You don't need to annotate an abstract class or function with `open`.

You can override a non-abstract `open` member with an abstract one.

```kotlin
open class Polygon {
    open fun draw() {}
}

abstract class Rectangle : Polygon() {
    abstract override fun draw()
}
```

## Companion objects

If you need to write a function that can be called without having a class instance but needs access to the internals
of a class (for example, a factory method), you can write it as a member of an [object declaration](object-declarations.md)
inside that class.

Even more specifically, if you declare a [companion object](object-declarations.md#companion-objects) inside your class,
you can access its members using only the class name as a qualifier.
