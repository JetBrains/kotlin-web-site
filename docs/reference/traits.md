---
type: doc
layout: reference
category: "Syntax"
title: "Traits"
---

# Traits

Traits are essentially interfaces with optional method implementations. What makes them different from abstract classes is that traits
cannot store state. They can have properties but these need to be abstract.

A trait is defined using the keyword *trait*{: .keyword }

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
class Child : MyTrait {
   fun bar() {
      // body
   }
}
```

## Properties in Traits

Trait do not allow the definition of *state*, but traits do allow the definition of properties as long as these are *abstract*. In this case, the *abstract*{: .keyword} modifier can be omitted.

``` kotlin
trait MyTrait {
    val property: Int // abstract

    fun foo() {
        print(property)
    }
}

class Child : MyTrait {
    override val property: Int = 29
}
```

## Declaring Super Types

Similarly to [classes](classes.html#inheritance), even traits may declare *super types*. In its list of super types, a trait may declare *zero or more traits*, and *at most one* class type. 
The reason for which only *one* class type is allowed in the list of super types of a trait, is because of the [*single inheritance*](classes.html#inheritance) constraint.

``` kotlin
open class A(x: Int) {
  val y = x * 2
}
trait B : A {
  fun foo() {
    print(y)
  }
}
```




In this example, the open class `A` defines a property `y`.
The trait `B` *requires* the super type `A`, thus making the property `y` accessible to the code of the trait.

Any class that *implements* a trait that *requires* a class in its list of super types must *initialize* that class type. For instance, suppose that you want a class `C` to *implement* `B`: the super-type list *must* contain the initialization of `A`.

``` kotlin
class C : B, A(239) {}
```

Now, invoking `foo()` on an instance of `C` will print `478` on the screen, because `x` has been initialized as `239` in `A`, and `foo()` prints `y`, which has been initialized as `x * 2`.

## Resolving overriding conflicts

When we declare many types in our supertype list, it may appear that we inherit more than one implementation of the same method. For example

``` kotlin
trait A {
  fun foo() { print("A") }
  fun bar()
}

trait B {
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

Traits *A* and *B* both declare functions *foo()* and *bar()*. Both of them implement *foo()*, but only *B* implements *bar()* (*bar()* is not marked abstract in *A*,
because this is the default for traits, if the function has no body). Now, if we derive a concrete class *C* from *A*, we, obviously, have to override *bar()* and provide
an implementation. And if we derive *D* from *A* and *B*, we don’t have to override *bar()*, because we have inherited only one implementation of it.
But we have inherited two implementations of *foo()*, so the compiler does not know, which one to choose, and forces us to override *foo()* and say what we want explicitly.
