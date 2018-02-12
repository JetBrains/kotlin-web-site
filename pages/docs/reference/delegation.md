---
type: doc
layout: reference
category: "Syntax"
title: "Delegation"
---

# Delegation

## Class Delegation

The [Delegation pattern](https://en.wikipedia.org/wiki/Delegation_pattern) has proven to be a good alternative to implement inheritance,
and Kotlin supports it natively requiring zero boilerplate code.
A class `Derived` can inherit from an interface `Base` and delegate all of its public methods to a specified object:

``` kotlin
interface Base {
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override fun print() { print(x) }
}

class Derived(b: Base) : Base by b

fun main(args: Array<String>) {
    val b = BaseImpl(10)
    Derived(b).print() // prints 10
}
```

The *by*{: .keyword }-clause in the supertype list for `Derived` indicates that `b` will be stored internally in objects of `Derived`
and the compiler will generate all the methods of `Base` that forward to `b`.

Note that overrides work as you might expect: The compiler will use your `override` implementations instead of those in the delegate object. If we were to add `override fun print() { print("abc") }` to `Derived`, the program would print "abc" instead of "10".
