---
type: doc
layout: reference
title: "Functional interfaces (SAM interfaces)"
---

# Functional (SAM) interfaces

An interface with only one abstract method is called a _functional interface_, or a _Single Abstract 
Method (SAM) interface_.

To declare a functional interface in Kotlin, use the `fun` modifier.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun interface Action {
    fun run()
}
```

</div>

## SAM conversions

For functional interfaces, you can use SAM conversions that help you make your code more concise and readable using 
lambda expressions.

Instead of creating a class that implements a functional interface manually, you can use a lambda expression. 
Thanks to a SAM conversion, Kotlin can convert any lambda expression whose signature matches 
the signature of the interface's single method into an instance of a class that implements the interface.

For example, consider the following Kotlin functional interface:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}
```

</div>

If you don't use lambdas, you will need to write code like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Creating an instance of a class
val isEven = object : IntPredicate {
    override fun accept(i: Int): Boolean {
        return i % 2 == 0
    }
}
```

</div>

By leveraging Kotlin's SAM conversion you can write the following equivalent code instead:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Creating an instance using lambda
val isEven = IntPredicate { it % 2 == 0 }
```

</div>

As you can see, a short lambda expression, which is prefixed with the name of the interface, replaces all the unnecessary 
code.

Here is what you get:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4-M1">

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main(){
    println("Is 7 even? - ${isEven.accept(7)}")
}
```

</div>

You can also use [SAM conversions for Java interfaces](java-interop.html#sam-conversions).

## Limitations of functional interfaces

Functional interfaces have the following limitations:

* Functional abstract classes are not supported.
* Functional interfaces should have exactly one abstract member.
* Functional interfaces do not support abstract properties.

