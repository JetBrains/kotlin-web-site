---
type: doc
layout: reference
category: "Syntax"
title: "Delegation"
---

# Delegation

## Property Delegation

Delegated properties are described on a separate page: [Delegated Properties](delegated-properties.html).

## Implementation by Delegation

The [Delegation pattern](https://en.wikipedia.org/wiki/Delegation_pattern) has proven to be a good alternative to implementation inheritance,
and Kotlin supports it natively requiring zero boilerplate code.
A class `Derived` can implement an interface `Base` by delegating all of its public members to a specified object:

<div class="sample" markdown="1" theme="idea">

```kotlin
interface Base {
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override fun print() { print(x) }
}

class Derived(b: Base) : Base by b

fun main() {
    val b = BaseImpl(10)
    Derived(b).print()
}
```

</div>

The *by*{: .keyword }-clause in the supertype list for `Derived` indicates that `b` will be stored internally in objects 
of `Derived` and the compiler will generate all the methods of `Base` that forward to `b`.

### Overriding a member of an interface implemented by delegation 

[Overrides](classes.html#overriding-methods) work as you might expect: the compiler will use your `override` 
implementations instead of those in the delegate object. If we were to add `override fun printMessage() { print("abc") }` to 
`Derived`, the program would print "abc" instead of "10" when `printMessage` is called:

<div class="sample" markdown="1" theme="idea">

```kotlin
interface Base {
    fun printMessage()
    fun printMessageLine()
}

class BaseImpl(val x: Int) : Base {
    override fun printMessage() { print(x) }
    override fun printMessageLine() { println(x) }
}

class Derived(b: Base) : Base by b {
    override fun printMessage() { print("abc") }
}

fun main() {
    val b = BaseImpl(10)
    Derived(b).printMessage()
    Derived(b).printMessageLine()
}
```

</div>

Note, however, that members overridden in this way do not get called from the members of the 
delegate object, which can only access its own implementations of the interface members:

<div class="sample" markdown="1" theme="idea">

```kotlin
interface Base {
    val message: String
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override val message = "BaseImpl: x = $x"
    override fun print() { println(message) }
}

class Derived(b: Base) : Base by b {
    // This property is not accessed from b's implementation of `print`
    override val message = "Message of Derived"
}

fun main() {
    val b = BaseImpl(10)
    val derived = Derived(b)
    derived.print()
    println(derived.message)
}
```

</div>

> **On the JVM**: when an interface with `default` methods is used for delegation (including Kotlin interfaces with  `@JvmDefault`),
>the default implementations are called even if the actual delegate type provides its own implementations.
>For details, see [Calling Kotlin from Java](java-to-kotlin-interop.html#using-in-delegates).
{:.note}
