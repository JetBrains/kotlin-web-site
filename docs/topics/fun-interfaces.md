[//]: # (title: Functional \(SAM\) interfaces)

An interface with only one abstract member function is called a _functional interface_, or a _Single Abstract
Method (SAM) interface_. The functional interface can have several non-abstract member functions but only one abstract 
member function.

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

### Pass callable references to SAM parameters

If the required behavior already exists as a named function, you can pass a [callable reference](lambdas.md#callable-reference).
Kotlin adapts a compatible callable reference to the expected functional interface:

```kotlin
fun interface Action {
    fun run()
}

fun execute(action: Action) {
    action.run()
}

fun start() {
    println("Run from a callable reference")
}

fun main() {
    // Kotlin converts the lambda to an Action instance
    execute { start() }
    // Run from a callable reference

    // Kotlin adapts the reference to an Action instance
    execute(::start)
    // Run from a callable reference
}
```
{kotlin-runnable="true"}

The lambda in `execute { start ()}` and the callable reference in `execute(::start)` produce compatible `Action` instances,
but they begin as different expressions. The first is a function literal and uses SAM conversion.
The second refers to an existing declaration and uses SAM adaptation.

SAM adaptation happens at compile time and doesn't perform runtime [reflection](reflection.md) or require the `kotlin-reflect` library.
The compiler checks that the referenced function is compatible with the interface's single abstract method.

Don't confuse a callable reference adapted to a SAM parameter with a callable reference to a functional interface constructor.
In `execute(::start)`, `::start` supplies the implementation of `Action.run()`. A reference, such as `::Action`, refers
to the implicit constructor that creates an `Action` from compatible behavior.

## Migration from an interface with constructor function to a functional interface

Starting from 1.6.20, Kotlin supports callable references to functional interface constructors, which
adds a source-compatible way to migrate from an interface with a constructor function to a functional interface.
Consider the following code:

```kotlin
interface Printer { 
    fun print() 
}

fun Printer(block: () -> Unit): Printer = object : Printer {
    override fun print() = block()
}
```

With callable references to functional interface constructors enabled, this code can be replaced with just a functional interface declaration:

```kotlin
fun interface Printer { 
    fun print()
}
```

Its constructor will be created implicitly, and any code using the `::Printer` function reference will compile. For example:

```kotlin
documentsStorage.addPrinter(::Printer)
```

Preserve the binary compatibility by marking the legacy function `Printer` with the [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)
annotation with `DeprecationLevel.HIDDEN`:

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

## Functional interfaces vs. type aliases

You can also simply rewrite the above using a [type alias](type-aliases.md) for a functional type:

```kotlin
typealias IntPredicate = (i: Int) -> Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun main() {
    println("Is 7 even? - ${isEven(7)}")
}
```

However, functional interfaces and [type aliases](type-aliases.md) serve different purposes.
Type aliases are just names for existing types – they don't create a new type, while functional interfaces do.
You can provide extensions that are specific to a particular functional interface to be inapplicable for plain functions or their type aliases.

Type aliases can have only one member, while functional interfaces can have multiple non-abstract member functions and one abstract member function.
Functional interfaces can also implement and extend other interfaces.

Functional interfaces are more flexible and provide more capabilities than type aliases, but they can be more costly both syntactically and at runtime because they can require conversions to a specific interface.
When you choose which one to use in your code, consider your needs:
* If your API needs to accept a function (any function) with some specific parameter and return types – use a simple functional type or define a type alias to give a shorter name to the corresponding functional type.
* If your API accepts a more complex entity than a function – for example, it has non-trivial contracts and/or operations on it that can't be expressed in a functional type's signature – declare a separate functional interface for it.