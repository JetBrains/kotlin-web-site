---
type: doc
layout: reference
category: "Syntax"
title: "Delegation"
---

# Delegation

## Class Delegation

The Delegation pattern has proven to be a good alternative to implementation inheritance, and Kotlin supports it natively requiring zero boilerplate code. A class Derived can inherit from a trait Base and delegate all of its public methods to a specified object:

``` kotlin
trait Base {
  fun print()
}

class BaseImpl(val x : Int) : Base {
  override fun print() { print(x) }
}

class Derived(b : Base) : Base by b

fun main() {
  val b = BaseImpl(10)
  Derived(b).print() // prints 10
}
```

The by-clause in the supertype list for Derived indicates that b will be stored internally in objects of Derived and the compiler will generate all the methods of Base that forward to b.

