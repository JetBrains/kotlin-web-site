---
type: doc
layout: reference
category: "Syntax"
title: "Traits"
---

# Traits

Traits are essentially interfaces with optional method implementations. What makes them different from abstract classes is that traits
cannot store state. They can have properties but these need to be abstract.

A trait is defined using the keyword *Trait*{: .keyword }

``` kotlin
trait MyTrait {
    fun bar()
    fun foo() {
      // optional body
    }
}
```

## Implementing Traits

A class or object can implement one or more traits

``` kotlin
class Child: MyTrait {

   fun bar() {
      // body
   }
}
```

## Properties in Traits

Traits allow properties as long as these are stateless, that is because traits do not allow state.

``` kotlin
trait MyTrait {
    val property: Int // abstract

    fun foo() {
        print(property)
    }
}

class Child: MyTrait {
    override val property: Int = 29
}
```

## Accessing state in trait

While traits cannot have state, you can access state

``` kotlin
open class A(x : Int) {
  val y = x * 2
}

trait B : A {
  fun foo() {
    print(y)
  }
}

class C() : A(239), B {}
```

In this example, we have a base class *A*, that defines a concrete property *y* and initializes it.
The trait *B* extends this class, but does not pass a constructor parameter in, because traits have no initialization code at all.
Note that *B* has access to the property *y* defined in *A*. Now, class *C* extends *A* and initializes it with *239*, and extends *B*.
Extending *B* is OK because *B* requires *A*, and we extend *A*.

What happens when we call *foo()* on an instance of *C*?
It prints 478 (239 * 2), because the value of *y* is obtained from this instance, and the constructor of *C* has written 239 there.

## Resolving overriding conflicts

When we declare many types in out supertype list, it may appear that we inherit more than one implementation of the same method. For example

``` kotlin
trait A {
  fun foo() { print("A") }
  fun bar()
}

trait B {
  fun foo() {print("B")}
  fun bar() {print("bar")}
}

class C() : A {
  override fun bar() { print("bar") }
}

class D() : A, B {
  override fun foo() {
    super<A>.foo()
    super<B>.foo()
  }
}
```

Traits *A* and *B* both declare functions *foo()* and *bar()*. Both of them implement *foo()*, but only *B* implements *bar()* (*bar()* is not marked abstract in *A*,
because this is the default for traits, if the function has no body). Now, if we derive a concrete class *C* from *A*, we, obviously, have to override *bar()* and provide
an implementation. And if we derive *D* from *A* and *B*, we don’t have to override *bar()*, because we have inherited only one implementation of it.
But we have inherited two implementations of *foo()*, so the compiler does not know, which one to choose, and forces us to override *foo()* and say what we want explicitly.