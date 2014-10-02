---
type: doc
layout: reference
category: "Syntax"
title: "Nested Classes"
---

# Nested Classes

Classes can be nested in other classes

``` kotlin
class Outer() {
  private val bar : Int = 1
  class Nested() {
    fun foo() = 2
  }
}

val demo = Outer.Inner().foo() // == 2
```

## Inner classes

A class may be marked as *inner* to be able to access members of outer class. Inner classes carry a reference to an object of an outer class:

``` kotlin
class Outer() {
  private val bar : Int = 1
  inner class Inner() {
    fun foo() = bar
  }
}

val demo = Outer().Inner().foo() // == 1
```

See [Qualified *this*{: .keyword } expressions](this-expressions.html) to learn about disambiguation of *this*{: .keyword } in inner classes.

