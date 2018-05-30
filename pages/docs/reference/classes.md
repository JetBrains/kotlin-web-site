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

``` kotlin
class Invoice {
}
```

The class declaration consists of the class name, the class header (specifying its type parameters, the primary
constructor etc.) and the class body, surrounded by curly braces. Both the header and the body are optional;
if the class has no body, curly braces can be omitted.

``` kotlin
class Empty
```


### Constructors

A class in Kotlin can have a **primary constructor** and one or more **secondary constructors**. The primary
constructor is part of the class header: it goes after the class name (and optional type parameters).

``` kotlin
class Person constructor(firstName: String) {
}
```

If the primary constructor does not have any annotations or visibility modifiers, the *constructor*{: .keyword }
keyword can be omitted:

``` kotlin
class Person(firstName: String) {
}
```

The primary constructor cannot contain any code. Initialization code can be placed
in **initializer blocks**, which are prefixed with the *init*{: .keyword } keyword.

During an instance initialization, the initializer blocks are executed in the same order as they appear 
in the class body, interleaved with the property initializers:

<div class="sample" markdown="1">

``` kotlin
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

fun main(args: Array<String>) {
    InitOrderDemo("hello")
}
```
</div>

Note that parameters of the primary constructor can be used in the initializer blocks. They can also be used in
property initializers declared in the class body:

``` kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```

In fact, for declaring properties and initializing them from the primary constructor, Kotlin has a concise syntax:


``` kotlin
class Person(val firstName: String, val lastName: String, var age: Int) {
    // ...
}
```

Much the same way as regular properties, the properties declared in the primary constructor can be
mutable (*var*{: .keyword }) or read-only (*val*{: .keyword }).

If the constructor has annotations or visibility modifiers, the *constructor*{: .keyword } keyword is required, and
the modifiers go before it:

``` kotlin
class Customer public @Inject constructor(name: String) { ... }
```

For more details, see [Visibility Modifiers](visibility-modifiers.html#constructors).


#### Secondary Constructors

The class can also declare **secondary constructors**, which are prefixed with *constructor*{: .keyword }:

``` kotlin
class Person {
    constructor(parent: Person) {
        parent.children.add(this)
    }
}
```

If the class has a primary constructor, each secondary constructor needs to delegate to the primary constructor, either
directly or indirectly through another secondary constructor(s). Delegation to another constructor of the same class
is done using the *this*{: .keyword } keyword:

``` kotlin
class Person(val name: String) {
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

Note that code in initializer blocks effectively becomes part of the primary constructor. Delegation to the primary
constructor happens as the first statement of a secondary constructor, so the code in all initializer blocks is executed
before the secondary constructor body. Even if the class has no primary constructor, the delegation still happens
implicitly, and the initializer blocks are still executed:

<div class="sample" markdown="1">

``` kotlin
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

fun main(args: Array<String>) {
    Constructors(1)
}
```
</div>

If a non-abstract class does not declare any constructors (primary or secondary), it will have a generated primary
constructor with no arguments. The visibility of the constructor will be public. If you do not want your class
to have a public constructor, you need to declare an empty primary constructor with non-default visibility:

``` kotlin
class DontCreateMe private constructor () {
}
```

> **NOTE**: On the JVM, if all of the parameters of the primary constructor have default values, the compiler will
> generate an additional parameterless constructor which will use the default values. This makes it easier to use
> Kotlin with libraries such as Jackson or JPA that create class instances through parameterless constructors.
>
> ``` kotlin
> class Customer(val customerName: String = "")
> ```
{:.info}

### Creating instances of classes

To create an instance of a class, we call the constructor as if it were a regular function:

``` kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

Note that Kotlin does not have a *new*{: .keyword } keyword.

Creating instances of nested, inner and anonymous inner classes is described in [Nested classes](nested-classes.html).

### Class Members

Classes can contain:

* [Constructors and initializer blocks](classes.html#constructors)
* [Functions](functions.html)
* [Properties](properties.html)
* [Nested and Inner Classes](nested-classes.html)
* [Object Declarations](object-declarations.html)


## Inheritance

All classes in Kotlin have a common superclass `Any`, that is the default superclass for a class with no supertypes declared:

``` kotlin
class Example // Implicitly inherits from Any
```

> Note: `Any` is not `java.lang.Object`; in particular, it does not have any members other than `equals()`, `hashCode()` and `toString()`.
Please consult the [Java interoperability](java-interop.html#object-methods) section for more details.

To declare an explicit supertype, we place the type after a colon in the class header:

``` kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

> The *open*{: .keyword } annotation on a class is the opposite of Java's *final*{: .keyword }: it allows others
to inherit from this class. By default, all classes in Kotlin are final, which
corresponds to [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html),
Item 17: *Design and document for inheritance or else prohibit it*.

If the derived class has a primary constructor, the base class can (and must) be initialized right there,
using the parameters of the primary constructor.

If the class has no primary constructor, then each secondary constructor has to initialize the base type
using the *super*{: .keyword } keyword, or to delegate to another constructor which does that.
Note that in this case different secondary constructors can call different constructors of the base type:

``` kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

### Overriding Methods

As we mentioned before, we stick to making things explicit in Kotlin. And unlike Java, Kotlin requires explicit
annotations for overridable members (we call them *open*) and for overrides:

``` kotlin
open class Base {
    open fun v() {}
    fun nv() {}
}
class Derived() : Base() {
    override fun v() {}
}
```

The *override*{: .keyword } annotation is required for `Derived.v()`. If it were missing, the compiler would complain.
If there is no *open*{: .keyword } annotation on a function, like `Base.nv()`, declaring a method with the same signature in a subclass is illegal,
either with *override*{: .keyword } or without it. In a final class (e.g. a class with no *open*{: .keyword } annotation), open members are prohibited.

A member marked *override*{: .keyword } is itself open, i.e. it may be overridden in subclasses. If you want to prohibit re-overriding, use *final*{: .keyword }:

``` kotlin
open class AnotherDerived() : Base() {
    final override fun v() {}
}
```

### Overriding Properties 

Overriding properties works in a similar way to overriding methods; properties declared on a superclass that are then redeclared on a derived class must be prefaced with *override*{: .keyword }, and they must have a compatible type. Each declared property can be overridden by a property with an initializer or by a property with a getter method.

``` kotlin
open class Foo {
    open val x: Int get() { ... }
}

class Bar1 : Foo() {
    override val x: Int = ...
}
```

You can also override a `val` property with a `var` property, but not vice versa. This is allowed because a `val` property essentially declares a getter method, and overriding it as a `var` additionally declares a setter method in the derived class.

Note that you can use the *override*{: .keyword } keyword as part of the property declaration in a primary constructor.

``` kotlin 
interface Foo {
    val count: Int
}

class Bar1(override val count: Int) : Foo

class Bar2 : Foo {
    override var count: Int = 0
}
```

### Derived class initialization order

During construction of a new instance of a derived class, the base class initialization is done as the first step (preceded only by evaluation of the arguments for the base class constructor) and thus happens before the initialization logic of the derived class is run. 

<div class="sample" markdown="1" data-min-compiler-version="1.2">

``` kotlin
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

fun main(args: Array<String>) {
    println("Constructing Derived(\"hello\", \"world\")")
    val d = Derived("hello", "world")
}
```
</div>

It means that, by the time of the base class constructor execution, the properties declared or overridden in the derived class are not yet initialized. If any of those properties are used in the base class initialization logic (either directly or indirectly, through another overridden *open*{: .keyword } member implementation), it may lead to incorrect behavior or a runtime failure. Designing a base class, you should therefore avoid using *open*{: .keyword } members in the constructors, property initializers, and *init*{: .keyword } blocks.

### Calling the superclass implementation

Code in a derived class can call its superclass functions and property accessors implementations using the *super*{: .keyword } keyword:

```kotlin
open class Foo {
    open fun f() { println("Foo.f()") }
    open val x: Int get() = 1
}

class Bar : Foo() {
    override fun f() { 
        super.f()
        println("Bar.f()") 
    }
    
    override val x: Int get() = super.x + 1
}
```

Inside an inner class, accessing the superclass of the outer class is done with the *super*{: .keyword } keyword qualified with the outer class name: `super@Outer`:

```kotlin
class Bar : Foo() {
    override fun f() { /* ... */ }
    override val x: Int get() = 0
    
    inner class Baz {
        fun g() {
            super@Bar.f() // Calls Foo's implementation of f()
            println(super@Bar.x) // Uses Foo's implementation of x's getter
        }
    }
}
```

### Overriding Rules

In Kotlin, implementation inheritance is regulated by the following rule: if a class inherits many implementations of the same member from its immediate superclasses,
it must override this member and provide its own implementation (perhaps, using one of the inherited ones).
To denote the supertype from which the inherited implementation is taken, we use *super*{: .keyword } qualified by the supertype name in angle brackets, e.g. `super<Base>`:

``` kotlin
open class A {
    open fun f() { print("A") }
    fun a() { print("a") }
}

interface B {
    fun f() { print("B") } // interface members are 'open' by default
    fun b() { print("b") }
}

class C() : A(), B {
    // The compiler requires f() to be overridden:
    override fun f() {
        super<A>.f() // call to A.f()
        super<B>.f() // call to B.f()
    }
}
```

It's fine to inherit from both `A` and `B`, and we have no problems with `a()` and `b()` since `C` inherits only one implementation of each of these functions.
But for `f()` we have two implementations inherited by `C`, and thus we have to override `f()` in `C`
and provide our own implementation that eliminates the ambiguity.

## Abstract Classes

A class and some of its members may be declared *abstract*{: .keyword }.
An abstract member does not have an implementation in its class.
Note that we do not need to annotate an abstract class or function with open – it goes without saying.

We can override a non-abstract open member with an abstract one

``` kotlin
open class Base {
    open fun f() {}
}

abstract class Derived : Base() {
    override abstract fun f()
}
```

## Companion Objects

In Kotlin, unlike Java or C#, classes do not have static methods. In most cases, it's recommended to simply use
package-level functions instead.

If you need to write a function that can be called without having a class instance but needs access to the internals
of a class (for example, a factory method), you can write it as a member of an [object declaration](object-declarations.html)
inside that class.

Even more specifically, if you declare a [companion object](object-declarations.html#companion-objects) inside your class,
you'll be able to call its members with the same syntax as calling static methods in Java/C#, using only the class name
as a qualifier.
