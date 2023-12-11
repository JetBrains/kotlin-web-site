[//]: # (title: Exceptions)

Exceptions are key tools for handling runtime errors, designed to maintain program flow and prevent crashes.
Unlike Java, Kotlin simplifies exception management by treating all exceptions as unchecked. This means that exceptions
can be caught but are not required to be explicitly handled or declared, which streamlines error handling.

Exceptions are represented by the [Exception](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) class.

## Exception classes

Let's explore some of the common types of exceptions in Kotlin, which are all subclasses of the [RuntimeException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) class:

**[ArithmeticException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/)**: Occurs when an arithmetic operation is impossible to perform, like division by zero. 

```kotlin
val example = 2 / 0 // throws ArithmeticException
```

**[IndexOutOfBoundsException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/)**: Thrown to indicate that an index of some sort (array, string, etc.) is out of range.

```kotlin
val myList = mutableListOf(1, 2, 3)
myList.removeAt(3)  // throws IndexOutOfBoundsException
```

**[NumberFormatException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/)**: This exception occurs when attempting to convert a string to a numeric type, but the string doesn't have an appropriate format.

```kotlin
val string = "This is not a number"
val number = string.toInt() // throws NumberFormatException
```

**[NullPointerException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)**: Thrown when an application attempts to use an object reference that has the null value. Even though Kotlin's null safety features significantly reduce the risk of NullPointerExceptions, they can still occur if a null value is explicitly accessed without safety checks.

```kotlin
val text: String? = null
println(text!!.length)  // throws a NullPointerException
```

While you don't have to explicitly catch these exceptions, Kotlin provides the flexibility to catch them if needed.

## Handling exceptions

There are numerous cases when we need to implement a more precise error handling technique than the built-in exception classes provide. 

### Throwing exceptions

All exception classes in Kotlin inherit the [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) class, allowing you to manually raise (or throw) exceptions using the `throw` keyword. 
This is typically done to indicate that something unexpected has happened.

You can throw an exception without any additional parameters: 

```kotlin
throw Exception()
```

It is usually recommended to include some additional information, such as a custom message and an original cause.

```kotlin
throw Exception("My error message", cause)
```

Let's look at a simple example:

```kotlin
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", e)
}
```

In this example, we are throwing an `IllegalArgumentException` when the user inputs a negative value.
By using this syntax, you can create custom error messages and retain the original cause (`e`) of the exception, which will be included in the [stack trace](#stack-trace).

### Using try-catch-finally statements

Normally, when an exception occurs it interrupts the normal execution of the program. After a line of code throws an exception, Kotlin attempts to find a suitable handler for it.
You can create such handlers using the `try` and `catch` functions.

> You can use `try` as an expression, which means it can have a return value. For example:
>
>```kotlin
>val a: Int? = try { input.toInt() } catch (e: NumberFormatException) { null }
>```
> 
{type="note"}

The returned value of a `try` expression is either the last expression in the `try` block or the
last expression in the `catch` block (or blocks).
The contents of the `finally` block don't affect the result of the expression, but it is always printed.

### The Nothing type



### Exception hierarchy



## Stack trace



## What's next?



## Throwing exceptions with the throwable class

All exception classes in Kotlin inherit the `Throwable` class.
Every exception has a message, a stack trace, and an optional cause.

To throw an exception object, use the `throw` expression:

```kotlin
fun main() {
//sampleStart
    throw Exception("Hi There!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To catch an exception, use the `try`...`catch` expression:

```kotlin
try {
    // some code
} catch (e: SomeException) {
    // handler
} finally {
    // optional finally block
}
```

There may be zero or more `catch` blocks, and the `finally` block may be omitted.
However, at least one `catch` or `finally` block is required.

If you want to alert callers about possible exceptions when calling Kotlin code from Java, Swift, or Objective-C,
you can use the `@Throws` annotation. Read more about using this annotation [for Java](java-to-kotlin-interop.md#checked-exceptions)
and [for Swift and Objective-C](native-objc-interop.md#errors-and-exceptions).

## The Nothing type old

`throw` is an expression in Kotlin, so you can use it, for example, as part of an Elvis expression:

```kotlin
val s = person.name ?: throw IllegalArgumentException("Name required")
```

The `throw` expression has the type `Nothing`.
This type has no values and is used to mark code locations that can never be reached.
In your own code, you can use `Nothing` to mark a function that never returns:

```kotlin
fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
}
```

When you call this function, the compiler will know that the execution doesn't continue beyond the call:

```kotlin
val s = person.name ?: fail("Name required")
println(s)     // 's' is known to be initialized at this point
```

You may also encounter this type when dealing with type inference. The nullable variant of this type,
`Nothing?`, has exactly one possible value, which is `null`. If you use `null` to initialize
a value of an inferred type and there's no other information that can be used to determine a more
specific type, the compiler will infer the `Nothing?` type:

```kotlin
val x = null           // 'x' has type `Nothing?`
val l = listOf(null)   // 'l' has type `List<Nothing?>
```

## Java interoperability

Please see the section on exceptions in the [Java interoperability page](java-interop.md) for information about Java interoperability.
