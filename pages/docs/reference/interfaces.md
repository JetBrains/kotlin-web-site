---
type: doc
layout: reference
category: "Syntax"
title: "Interfaces"
---

# Interfaces

Interfaces in Kotlin are very similar to Java 8. They can contain declarations of abstract methods, as well as method
implementations. What makes them different from abstract classes is that interfaces cannot store state. They can have
properties but these need to be abstract or to provide accessor implementations.

An interface is defined using the keyword *interface*{: .keyword }

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // optional body
    }
}
```
</div>

## Implementing Interfaces

A class or object can implement one or more interfaces

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
class Child : MyInterface {
    override fun bar() {
        // body
    }
}
```
</div>

## Properties in Interfaces

You can declare properties in interfaces. A property declared in an interface can either be abstract, or it can provide
implementations for accessors. Properties declared in interfaces can't have backing fields, and therefore accessors
declared in interfaces can't reference them.

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
interface MyInterface {
    val prop: Int // abstract

    val propertyWithImplementation: String
        get() = "foo"

    fun foo() {
        print(prop)
    }
}

class Child : MyInterface {
    override val prop: Int = 29
}
```
</div>

## Interfaces Inheritance

An interface can derive from other interfaces and thus both provide implementations for their members and declare new functions and properties. Quite naturally, classes implementing such an interface are only required to define the missing implementations:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
interface Named {
    val name: String
}

interface Person : Named {
    val firstName: String
    val lastName: String
    
    override val name: String get() = "$firstName $lastName"
}

data class Employee(
    // implementing 'name' is not required
    override val firstName: String,
    override val lastName: String,
    val position: Position
) : Person
```
</div>

## Resolving overriding conflicts

When we declare many types in our supertype list, it may appear that we inherit more than one implementation of the same method. For example

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
interface A {
    fun foo() { print("A") }
    fun bar()
}

interface B {
    fun foo() { print("B") }
    fun bar() { print("bar") }
}

class C : A {
    override fun bar() { print("bar") }
}

class D : A, B {
    override fun foo() {
        super<A>.foo()
        super<B>.foo()
    }

    override fun bar() {
        super<B>.bar()
    }
}
```
</div>

Interfaces *A* and *B* both declare functions *foo()* and *bar()*. Both of them implement *foo()*, but only *B* implements *bar()* (*bar()* is not marked abstract in *A*,
because this is the default for interfaces, if the function has no body). Now, if we derive a concrete class *C* from *A*, we, obviously, have to override *bar()* and provide
an implementation.

However, if we derive *D* from *A* and *B*, we need to implement all the methods which we have
inherited from multiple interfaces, and to specify how exactly *D* should implement them. This rule applies
both to methods for which we've inherited a single implementation (*bar()*) and multiple implementations (*foo()*).
