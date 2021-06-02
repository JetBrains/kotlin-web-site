[//]: # (title: Functional \(SAM\) interfaces)

An interface with only one abstract method is called a _functional interface_, or a _Single Abstract
Method (SAM) interface_. The functional interface can have several non-abstract members but only one abstract member.

To declare a functional interface in Kotlin, use the `fun` modifier.

```kotlin
fun interface KRunnable {
   fun invoke()
}
```

## SAM conversions

For functional interfaces, you can use SAM conversions that help make your code more concise and readable by using
[lambda expressions](lambdas.md#lambda-expressions-and-anonymous-functions).

Instead of creating a class that implements a functional interface manually, you can use a lambda expression.
With a SAM conversion, Kotlin can convert any lambda expression whose signature matches
the signature of the interface's single method into the code, which dynamically instantiates the interface implementation.

For example, consider the following Kotlin functional interface:

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

If you don't use a SAM conversion, you will need to write code like this:

```kotlin
// Creating an instance of a class
val isEven = object : IntPredicate {
   override fun accept(i: Int): Boolean {
       return i % 2 == 0
   }
}
```

By leveraging Kotlin's SAM conversion, you can write the following equivalent code instead:

```kotlin
// Creating an instance using lambda
val isEven = IntPredicate { it % 2 == 0 }
```

A short lambda expression replaces all the unnecessary code.

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven.accept(7)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

You can also use [SAM conversions for Java interfaces](java-interop.md#sam-conversions).

## Functional interfaces vs. type aliases

Functional interfaces and [type aliases](type-aliases.md) serve different purposes.
Type aliases are just names for existing types – they don't create a new type, while functional interfaces do.
You can provide extensions that are specific to a particular functional interface to be inapplicable for plain functions or their type aliases.

Type aliases can have only one member, while functional interfaces can have multiple non-abstract members and one abstract member.
Functional interfaces can also implement and extend other interfaces.

Functional interfaces are more flexible and provide more capabilities than type aliases, but they can be more costly both syntactically and at runtime because they can require conversions to a specific interface.
When you choose which one to use in your code, consider your needs:
* If your API needs to accept a function (any function) with some specific parameter and return types – use a simple functional type or define a type alias to give a shorter name to the corresponding functional type.
* If your API accepts a more complex entity than a function – for example, it has non-trivial contracts and/or operations on it that can't be expressed in a functional type's signature – declare a separate functional interface for it.