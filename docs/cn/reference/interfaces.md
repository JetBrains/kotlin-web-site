---
type: doc
layout: reference
category: "Syntax"
title: "Interfaces"
---

# Interfaces

Interfaces in Kotlin are very similar to Java 8. They can contain declarations of abstract methods, as well as method
implementations. What makes them different from abstract classes is that interfaces cannot store state. They can have
properties but these need to be abstract.

An interface is defined using the keyword *interface*{: .keyword }

``` kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // optional body
    }
}
```

## Implementing Interfaces

A class or object can implement one or more interfaces

``` kotlin
class Child : MyInterface {
   fun bar() {
      // body
   }
}
```

## Properties in Interfaces

Interfaces allow properties as long as these are stateless, that is because interfaces do not allow state.

``` kotlin
interface MyInterface {
    val property: Int // abstract

    fun foo() {
        print(property)
    }
}

class Child : MyInterface {
    override val property: Int = 29
}
```

## Resolving overriding conflicts

When we declare many types in our supertype list, it may appear that we inherit more than one implementation of the same method. For example

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
}
```

Interfaces *A* and *B* both declare functions *foo()* and *bar()*. Both of them implement *foo()*, but only *B* implements *bar()* (*bar()* is not marked abstract in *A*,
because this is the default for interfaces, if the function has no body). Now, if we derive a concrete class *C* from *A*, we, obviously, have to override *bar()* and provide
an implementation. And if we derive *D* from *A* and *B*, we don’t have to override *bar()*, because we have inherited only one implementation of it.
But we have inherited two implementations of *foo()*, so the compiler does not know which one to choose, and forces us to override *foo()* and say what we want explicitly.
