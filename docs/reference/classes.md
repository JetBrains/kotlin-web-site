---
type: doc
layout: reference
category: "Syntax"
title: "Classes and Inheritance"
related:
    - functions.md
    - nested-classes.md
    - traits.md
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
constructor is part of the class header: it goes between the class name and the opening curly brace.

``` kotlin
class Person(firstName: String) {
}
```

The primary constructor cannot contain any code. Initialization code can be placed
in **initializer blocks**, which are prefixed with *init*{: .keyword }:

``` kotlin
class Customer(name: String) {
    init {
        logger.info("Customer initialized with value ${name}")
    }
}
```

Note that parameters of the primary constructor can be used in the initializer blocks. They can also be used in
property initializers declared in the class body:

``` kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```

In fact, for declaring properties and initializing them from the constructor, Kotlin has a more concise syntax:


``` kotlin
class Person(val firstName: String, val lastName: String, var age: Int) {
  // ...
}
```

This is equivalent to the previous code. Much the same way as regular properties, the properties explicitly
declared in the constructor can be mutable (*var*{: .keyword }) or read-only (*val*{: .keyword }).

To specify the visibility of the primary constructor, use the following syntax:

``` kotlin
class Customer private (name: String) { ... }
```

For more details, see [Visibility Modifiers](visibility-modifiers.html#constructors).

#### Secondary Constructors

The class can also contain **secondary constructors**, which are prefixed with *constructor*{: .keyword }:

``` kotlin
class Person {
    constructor(parent: Person) {
        parent.children.add(this)
    }
}
```

If the class has a primary constructor, each secondary constructor needs to delegate to the primary constructor, either
directly or indirectly through another secondary constructor(s). Delegation to another constructor is done using the
*this*{: .keyword } keyword:

``` kotlin
class Person(val name: String) {
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

If a non-abstract class does not declare any constructors (primary or secondary), it will have a generated primary
constructor with no arguments. The visibility of the constructor will be public. If you do not want your class
to have a public constructor, you need to declare an empty primary constructor with non-default visibility:

``` kotlin
class DontCreateMe private () {
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


### Class Members

Classes can contain

* Constructors and initializer blocks
* [Functions](functions.html)
* [Properties](properties.html)
* [Nested and Inner Classes](nested-classes.html)
* [Object Declarations](object-declarations.html)


## Inheritance

All classes in Kotlin have a common superclass `Any`, that is a default super for a class with no supertypes declared:

``` kotlin
class Example // Implicitly inherits from Any
```

`Any` is not `java.lang.Object`; in particular, it does not have any members other than `equals()`, `hashCode()` and `toString()`.
Please consult the [Java interoperability](java-interop.html#object-methods) section for more details.

To declare an explicit supertype, we place the type after a colon in the class header:

``` kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

If the class has a primary constructor, the base type can (and must) be initialized right there,
using the parameters of the primary constructor.

If the class has no primary constructor, then each secondary constructor has to initialize the base type
using the *super*{: .keyword } keyword, or to delegate to another constructor which does that.
Note that in this case different secondary constructors can call different constructors of the base type:

``` kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx) {
    }

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs) {
    }
}
```

The *open*{: .keyword } annotation on a class is the opposite of Java's *final*{: .keyword }: it allows others
to inherit from this class. By default, all classes in Kotlin are final, which
corresponds to [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html),
Item 17: *Design and document for inheritance or else prohibit it*.

### Overriding Members

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

#### Wait! How will I hack my libraries now?!

One issue with our approach to overriding (classes and members final by default) is that it would be difficult to subclass something inside the libraries you use to override some method that was not intended for overriding by the library designer, and introduce some nasty hack there.

We think that this is not a disadvantage, for the following reasons:

* Best practices say that you should not allow these hacks anyway
* People successfully use other languages (C++, C#) that have similar approach
* If people really want to hack, there still are ways: in some cases it will be possible to write your hack in Java, and Aspect frameworks always work for these purposes...


### Overriding Rules

In Kotlin, implementation inheritance is regulated by the following rule: if a class inherits many implementations of the same member from its immediate superclasses,
it must override this member and provide its own implementation (perhaps, using one of the inherited ones).
To denote the supertype from which the inherited implementation is taken, we use *super*{: .keyword } qualified by the supertype name in angle brackets, e.g. `super<Base>`:

``` kotlin
open class A {
  open fun f() { print("A") }
  fun a() { print("a") }
}

trait B {
  fun f() { print("B") } // trait members are 'open' by default
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
Thus, when some descendant inherits an abstract member, it does not count as an implementation:

``` kotlin
abstract class A {
  abstract fun f()
}

trait B {
  open fun f() { print("B") }
}

class C() : A(), B {
  // We are not required to override f()
}
```

Note that we do not need to annotate an abstract class open – it goes without saying. Neither need we annotate an abstract function open.

We can override a non-abstract open member with an abstract one

``` kotlin
open class Base {
  open fun f() {}
}

abstract class Derived : Base() {
  override abstract fun f()
}
```

## Class Objects

In Kotlin, unlike Java or C#, classes do not have static methods. In most cases, package-level functions form a good substitute for them,
but there are a few cases when they don't. These cases involve access to class' internals (private members).

For example, to replace a constructor with a factory method, we make the constructor private and provide a function that calls the constructor.
But if this function is located outside the class in question, it would not have any access to the constructor.

To address this issue (and to provide some other interesting features), Kotlin introduces a concept of a class object
(the closest analog in other languages would be companion objects in Scala).
Roughly speaking, a class object for class `C` is an object (in the sense of [Object declaration](object-declarations.html#object-declarations)) that is associated to `C`.
There may be not more than one class object for each class.
A class object is declared inside its associated class, and thus it can access its private members.
A class object for `C` itself is (usually) not an instance of `C`. For example:

``` kotlin
class C {
  class object {
    fun create() = C()
  }
}

fun main() {
  val c = C.create() // C denotes the class object here
}
```

At first you may think that this is just a way of grouping static members of a class together instead of mixing them with instance members:
in Java we access static members of `C` by calling `C.foo()`, and the same happens with class object's members in Kotlin.
But in fact there is an important difference: a class object can have supertypes, and `C`, as an expression denotes this object as a value,
so we can pass it around, say, as an argument for a function. Let's modify our example to demonstrate this

``` kotlin
abstract class Factory<out T> {
  abstract fun create(): T
}

class C {
  class object : Factory<C>() {
    override fun create(): C = C()
  }
}

fun main() {
  val factory = C // C denotes the class object
  val c = factory.create()
}
```

Note that class objects are never inherited:

``` kotlin
class D : C()

val d = D.create() // Error: no class object for D
```

A description of some more interesting features related to class objects can be found in the [Generic constraints](generics.html#generic-constraints) section.

Note: if you think that class objects are a great way of implementing singletons in Kotlin, please see [Object expressions and Declarations](object-declarations.html).

