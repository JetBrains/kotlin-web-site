---
type: doc
layout: reference
title: "Functional interfaces (SAM interfaces)"
---

# Functional (SAM) interfaces

An interface with only one abstract method is called a _functional interface_, or a _Single Abstract 
Method (SAM) interface_.

Functional interfaces in Kotlin are marked with the `fun` keyword.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun interface Action {
    fun run()
}
```

</div>

For functional interfaces, you can use SAM conversions that help you make your code more concise and readable thanks to 
lambda expressions.

Instead of creating a class that implements a functional interface manually, you can use a lambda expression. 
Thanks to a SAM conversion, Kotlin can transparently convert any lambda expression whose signature matches 
the signature of the interface's single method into an instance of a class that implements the interface.

For example, consider the following Kotlin functional interface:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun interface Sum {
    fun add(a: Int, b: Int): Int
}
```

</div>

If you don't use lambdas, you will need to write code like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Creating an instance of a class
val sum = object : Sum {
    override fun add(a: Int, b: Int): Int {
        return a + b
    }
}
```

</div>

That's a lot of unnecessary code, which is also not very readable. By leveraging Kotlin's SAM conversion 
you can write the following equivalent code instead:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Creating an instance using lambda
val sum = Sum { a, b -> a + b }
```

</div>

As you can see, a short lambda expression, which is prefixed with the name of the interface, replaces all the unnecessary 
code.

Here is what you get:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4-M1">

```kotlin
fun interface Sum {
    fun add(a: Int, b: Int): Int
}

val sum = Sum { a, b -> a + b }

fun main(){
    println("Sum is ${sum.add(3,4)}")
}
```

</div>

## Limitations of functional interfaces

Functional interfaces have the following limitations:

* Functional abstract classes are not supported.
* Functional interfaces should have exactly one abstract member.
* Functional interfaces do not support abstract properties.
* Functional interfaces can have non-abstract members.

