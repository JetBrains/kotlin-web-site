---
type: doc
layout: reference
category: "Syntax"
title: "Classes and Inheritance"
related:
    - functions.md
    - nested-classes.md
    - interfaces.md
---

# Classes and Inheritance

## Classes

Classes in Kotlin are declared using the keyword *class*{: .keyword }:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Invoice { /*...*/ }
```

</div>

The class declaration consists of the class name, the class header (specifying its type parameters, the primary
constructor etc.) and the class body, surrounded by curly braces. Both the header and the body are optional;
if the class has no body, curly braces can be omitted.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Empty
```

</div>

### Constructors

A class in Kotlin can have a **primary constructor** and one or more **secondary constructors**. The primary
constructor is part of the class header: it goes after the class name (and optional type parameters).

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

</div>

If the primary constructor does not have any annotations or visibility modifiers, the *constructor*{: .keyword }
keyword can be omitted:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person(firstName: String) { /*...*/ }
```

</div>

The primary constructor cannot contain any code. Initialization code can be placed
in **initializer blocks**, which are prefixed with the *init*{: .keyword } keyword.

During an instance initialization, the initializer blocks are executed in the same order as they appear 
in the class body, interleaved with the property initializers:

<div class="sample" markdown="1" theme="idea">

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

</div>

Note that parameters of the primary constructor can be used in the initializer blocks. They can also be used in
property initializers declared in the class body:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```

</div>

In fact, for declaring properties and initializing them from the primary constructor, Kotlin has a concise syntax:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int) { /*...*/ }
```

</div>

Much the same way as regular properties, the properties declared in the primary constructor can be
mutable (*var*{: .keyword }) or read-only (*val*{: .keyword }).

If the constructor has annotations or visibility modifiers, the *constructor*{: .keyword } keyword is required, and
the modifiers go before it:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

</div>

For more details, see [Visibility Modifiers](visibility-modifiers.html#constructors).


#### Secondary constructors

The class can also declare **secondary constructors**, which are prefixed with *constructor*{: .keyword }:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person {
    var children: MutableList<Person> = mutableListOf<>()
    constructor(parent: Person) {
        parent.children.add(this)
    }
}
```

</div>

If the class has a primary constructor, each secondary constructor needs to delegate to the primary constructor, either
directly or indirectly through another secondary constructor(s). Delegation to another constructor of the same class
is done using the *this*{: .keyword } keyword:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person(val name: String) {
    var children: MutableList<Person> = mutableListOf<>()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

</div>

Note that code in initializer blocks effectively becomes part of the primary constructor. Delegation to the primary
constructor happens as the first statement of a secondary constructor, so the code in all initializer blocks and property initializers is executed
before the secondary constructor body. Even if the class has no primary constructor, the delegation still happens
implicitly, and the initializer blocks are still executed:

<div class="sample" markdown="1" theme="idea">

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

</div>

If a non-abstract class does not declare any constructors (primary or secondary), it will have a generated primary
constructor with no arguments. The visibility of the constructor will be public. If you do not want your class
to have a public constructor, you need to declare an empty primary constructor with non-default visibility:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class DontCreateMe private constructor () { /*...*/ }
```

</div>

> **NOTE**: On the JVM, if all of the parameters of the primary constructor have default values, the compiler will
> generate an additional parameterless constructor which will use the default values. This makes it easier to use
> Kotlin with libraries such as Jackson or JPA that create class instances through parameterless constructors.

><div class="sample" markdown="1" theme="idea" data-highlight-only>
>
>```kotlin
>class Customer(val customerName: String = "")
>```
>
></div>

{:.info}

### Creating instances of classes

To create an instance of a class, we call the constructor as if it were a regular function:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

</div>

Note that Kotlin does not have a *new*{: .keyword } keyword.

Creating instances of nested, inner and anonymous inner classes is described in [Nested classes](nested-classes.html).

### Class members

Classes can contain:

* [Constructors and initializer blocks](classes.html#constructors)
* [Functions](functions.html)
* [Properties](properties.html)
* [Nested and Inner Classes](nested-classes.html)
* [Object Declarations](object-declarations.html)


## Inheritance

All classes in Kotlin have a common superclass `Any`, that is the default superclass for a class with no supertypes declared:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Example // Implicitly inherits from Any
```

</div>

`Any` has three methods: `equals()`, `hashCode()` and `toString()`. Thus, they are defined for all Kotlin classes. 

By default, Kotlin classes are final: they can’t be inherited.
To make a class inheritable, mark it with the `open` keyword.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Base //Class is open for inheritance

```

</div>

 

To declare an explicit supertype, place the type after a colon in the class header:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

</div>

If the derived class has a primary constructor, the base class can (and must) be initialized right there,
using the parameters of the primary constructor.

If the derived class has no primary constructor, then each secondary constructor has to initialize the base type
using the *super*{: .keyword } keyword, or to delegate to another constructor which does that.
Note that in this case different secondary constructors can call different constructors of the base type:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

</div>

### Overriding methods

As we mentioned before, we stick to making things explicit in Kotlin. So, Kotlin requires explicit
modifiers for overridable members (we call them *open*) and for overrides:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

</div>

The *override*{: .keyword } modifier is required for `Circle.draw()`. If it were missing, the compiler would complain.
If there is no *open*{: .keyword } modifier on a function, like `Shape.fill()`, declaring a method with the same signature in a subclass is illegal,
either with *override*{: .keyword } or without it. The *open*{: .keyword } modifier has no effect when added on members of a final class (i.e.. a class with no *open*{: .keyword } modifier).

A member marked *override*{: .keyword } is itself open, i.e. it may be overridden in subclasses. If you want to prohibit re-overriding, use *final*{: .keyword }:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

</div>

### Overriding properties 

Overriding properties works in a similar way to overriding methods; properties declared on a superclass 
that are then redeclared on a derived class must be prefaced with *override*{: .keyword }, and they must have a compatible type.
Each declared property can be overridden by a property with an initializer or by a property with a `get` method.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

</div>

You can also override a `val` property with a `var` property, but not vice versa.
This is allowed because a `val` property essentially declares a `get` method,
and overriding it as a `var` additionally declares a `set` method in the derived class.

Note that you can use the *override*{: .keyword } keyword as part of the property declaration in a primary constructor.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // Always has 4 vertices

class Polygon : Shape {
    override var vertexCount: Int = 0  // Can be set to any number later
}
```

</div>

### Derived class initialization order

During construction of a new instance of a derived class, the base class initialization is done as the first step (preceded only by evaluation of the arguments for the base class constructor) and thus happens before the initialization logic of the derived class is run. 

<div class="sample" markdown="1" theme="idea">

```kotlin
//sampleStart
open class Base(val name: String) {

    init { println("Initializing Base") }

    open val size: Int = 
        name.length.also { println("Initializing size in Base: $it") }
}

class Derived(
    name: String,
    val lastName: String
) : Base(name.capitalize().also { println("Argument for Base: $it") }) {

    init { println("Initializing Derived") }

    override val size: Int =
        (super.size + lastName.length).also { println("Initializing size in Derived: $it") }
}
//sampleEnd

fun main() {
    println("Constructing Derived(\"hello\", \"world\")")
    val d = Derived("hello", "world")
}
```

</div>

It means that, by the time of the base class constructor execution, the properties declared or overridden in the derived class are not yet initialized. If any of those properties are used in the base class initialization logic (either directly or indirectly, through another overridden *open*{: .keyword } member implementation), it may lead to incorrect behavior or a runtime failure. When designing a base class, you should therefore avoid using *open*{: .keyword } members in the constructors, property initializers, and *init*{: .keyword } blocks.

### Calling the superclass implementation

Code in a derived class can call its superclass functions and property accessors implementations using the *super*{: .keyword } keyword:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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

</div>

Inside an inner class, accessing the superclass of the outer class is done with the *super*{: .keyword } keyword qualified with the outer class name: `super@Outer`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class FilledRectangle: Rectangle() {
    fun draw() { /* ... */ }
    val borderColor: String get() = "black"
    
    inner class Filler {
        fun fill() { /* ... */ }
        fun drawAndFill() {
            super@FilledRectangle.draw() // Calls Rectangle's implementation of draw()
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // Uses Rectangle's implementation of borderColor's get()
        }
    }
}
```

</div>

### Overriding rules

In Kotlin, implementation inheritance is regulated by the following rule: if a class inherits multiple implementations of the same member from its immediate superclasses,
it must override this member and provide its own implementation (perhaps, using one of the inherited ones).
To denote the supertype from which the inherited implementation is taken, we use *super*{: .keyword } qualified by the supertype name in angle brackets, e.g. `super<Base>`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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

</div>

It's fine to inherit from both `Rectangle` and `Polygon`,
but both of them have their implementations of `draw()`, so we have to override `draw()` in `Square`
and provide its own implementation that eliminates the ambiguity.

## Abstract classes

A class and some of its members may be declared *abstract*{: .keyword }.
An abstract member does not have an implementation in its class.
Note that we do not need to annotate an abstract class or function with open – it goes without saying.

We can override a non-abstract open member with an abstract one

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Polygon {
    open fun draw() {}
}

abstract class Rectangle : Polygon() {
    abstract override fun draw()
}
```

</div>

## Companion objects

If you need to write a function that can be called without having a class instance but needs access to the internals
of a class (for example, a factory method), you can write it as a member of an [object declaration](object-declarations.html)
inside that class.

Even more specifically, if you declare a [companion object](object-declarations.html#companion-objects) inside your class,
you can access its members using only the class name as a qualifier.
