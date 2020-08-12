---
type: doc
layout: reference
title: "Functional interfaces (SAM interfaces)"
---

# Functional (SAM) interfaces

An interface with only one abstract method is called a _functional interface_, or a _Single Abstract
Method (SAM) interface_. The functional interface can have several non-abstract members but only one abstract member.

To declare a functional interface in Kotlin, use the `fun` modifier.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun interface KRunnable {
   fun invoke()
}
```

</div>

## SAM conversions

For functional interfaces, you can use SAM conversions that help make your code more concise and readable by using
[lambda expressions](lambdas.html#lambda-expressions-and-anonymous-functions).

Instead of creating a class that implements a functional interface manually, you can use a lambda expression.
With a SAM conversion, Kotlin can convert any lambda expression whose signature matches
the signature of the interface's single method into an instance of a class that implements the interface.

For example, consider the following Kotlin functional interface:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

</div>

If you don't use a SAM conversion, you will need to write code like this:

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

By leveraging Kotlin's SAM conversion, you can write the following equivalent code instead:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Creating an instance using lambda
val isEven = IntPredicate { it % 2 == 0 }
```

</div>

A short lambda expression replaces all the unnecessary code.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4-M1">

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven.accept(7)}")
}
```

</div>

You can also use [SAM conversions for Java interfaces](java-interop.html#sam-conversions).

## Functional interfaces vs. type aliases

Functional interfaces and [type aliases](type-aliases.html) serve different purposes. Type aliases are just names for
existing types – they don't create a new type, while functional interfaces do.

Type aliases can have only one member, while functional interfaces can have multiple non-abstract members and one abstract member.
Functional interfaces can also implement and extend other interfaces.

Considering the above, functional interfaces are more flexible and provide more capabilities than type aliases.