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

While you don't have to catch these exceptions explicitly, Kotlin provides the flexibility to catch them if needed.

### Exception hierarchy

The root of the Kotlin exception hierarchy is the [Throwable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) class. It has two direct subclasses, [Error](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/) and [Exception](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/).

The `Error` branch of the `Throwable` class is used to represent serious problems that a reasonable application should not try to catch. It represents abnormal conditions, such as [OutOfMemoryError](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) and `StackOverflowError`.

On the other hand, the `Exception` branch is used for conditions that you might want to catch. Subtypes of the `Exception` type, such as the [RuntimeException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) and `IOException` (Input/Output Exception), deal with exceptional events in applications.

![Exception herarchy - the Throwable class](throwable.png){width=600}

`RuntimeException` is usually caused by insufficient checks in the program code and can be prevented programmatically.
The following picture demonstrates a hierarchy of subtypes descended from `RuntimeException`:

![Hierarchy of RuntimeExceptions](runtime.png){width=600}

## Handling exceptions

There are numerous cases when we need to implement a more precise error-handling technique than the built-in exception classes provide. 

### Throwing exceptions

All exception classes in Kotlin inherit the [Throwable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) class, allowing you to manually raise (or throw) exceptions using the `throw` keyword. 
This is typically done to indicate that something unexpected has happened.

You can throw an exception without any additional parameters: 

```kotlin
throw Exception()
```

We recommend including some additional information, such as a custom message and an original cause.

```kotlin
throw Exception("This is my error message.", cause)
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

Normally, when an exception occurs, it interrupts the normal execution of the program. After a line of code throws an exception, Kotlin attempts to find a suitable handler for it.

You can create such handlers using the `try` and `catch` functions:

```kotlin
try {
    // code that may throw an exception
} catch (e: SomeException) {
    // code for handling the exception
}
```

> You can use `try-catch` as an expression so it has a return value. For example:
>
> ```kotlin
> val a: Int? = try { input.toInt() } catch (e: NumberFormatException) { null }
> ```
>
{type="note"}

Kotlin supports the use of several handlers inside the same `try` block. You can add as many catch blocks as you need:

```kotlin
fun main() {
    val numbers = arrayOf(10, 0, null)
    val index = 1 // Change this value to get different exceptions.

    try {
        val number = numbers[index] 
        val result = 10 / number!! 
        println("Result: $result")
    } catch (e: ArrayIndexOutOfBoundsException) {
        println("Caught an ArrayIndexOutOfBoundsException: ${e.message}")
    } catch (e: ArithmeticException) {
        println("Caught an ArithmeticException: ${e.message}")
    } catch (e: NullPointerException) {
        println("Caught a NullPointerException: ${e.message}")
    } catch (e: Exception) {
        println("Another exception happened: ${e.message}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

When you have multiple `catch` blocks, it's important to order them from the most specific to the least specific exception.
This ordering aligns with the program's execution flow. If you were to catch a general exception before a more specific one, the specific exception would never be reached, as the general catch block would intercept all exceptions, including the specific ones.

> Alternatively, you can also use a `when` statement inside a `catch` block to handle multiple exceptions:
> ```kotlin
> catch (e: Exception) {
>		when (e) {
>            is ArrayIndexOutOfBoundsException -> println("Caught an ArrayIndexOutOfBoundsException: ${e.message}")
>            is ArithmeticException -> println("Caught an ArithmeticException: ${e.message}")
>            is NullPointerException -> println("Caught a NullPointerException: ${e.message}")
>            else -> println ("Another exception happened: ${e.message}")
>        }
>    }
> ```
> 
> {type="tip"}

The `finally` block in Kotlin is used to execute code after the `try` and any `catch` blocks have been completed. 
The `finally` block is executed regardless if an exception was thrown or caught. You can use it for cleanup tasks and ensure that certain operations are completed no matter what happens in the `try-catch` blocks.

Here is how you would typically use the `try-catch-finally` blocks together:

```kotlin
try {
    // code that may throw an exception
}
catch (e: Exception) {
    // exception handler
}
finally {
    // code is always executed
}
```

The returned value of a `try` expression is either the last expression in the `try` block or the
last expression in the `catch` block (or blocks).
The contents of the `finally` block don't affect the result of the expression, but it is always printed.

Let's look at an example to demonstrate:

```kotlin
fun division() { 
    //sampleStart
    val a = 0 // Change this value to 0 to execute the catch block or to a non-zero Int value to execute the try block.
    try {
        val b = 44 / a
        println("The try block is executed if a != 0")
    }
    catch (e: ArithmeticException) {
        println("The catch block is executed if a == 0")
    }
    finally {
        println("The finally block is always executed")
    }
    //sampleEnd
}

fun main() {
    division()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also use `try` with the `finally` block, without `catch` blocks:

```kotlin
fun main() {
    try {
        val a = 0/0 // throws ArithmeticException
    }
    finally {
        println("End of the try block") // will be printed
    }
    println("End of the program") // will not be printed
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

As you can see, in Kotlin, you have the flexibility to use only a `catch` block, only a `finally` block, or both, depending on your specific needs, but a try block must always be accompanied by at least one `catch` block or a `finally` block.

### The Nothing type

In Kotlin, [Nothing](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html) is a subtype of all other types. This means you can use `Nothing` in a generic type or as a return type where any other type is expected without causing type errors.

`Nothing` is a unique type used to represent a function or expression that never successfully completes, either due to always throwing an exception or some other form of non-standard termination, like an infinite loop. It is useful if you want to signal abnormal termination
or unfinished code, making your intentions clear both to the compiler and to anyone reading your code.

This Kotlin code demonstrates the use of the `Nothing` type:

```kotlin
fun fail(): Nothing {
    throw Exception("Declared to return nothing and to always throw an exception")
}

fun exampleFunction(): String {
    return fail() // This is allowed at compile time because Nothing is a subtype of String
}

fun main() {
    val result: String = exampleFunction() // This will never return a String, instead it throws an exception
    println(result)
}
```
{kotlin-runnable="true"}

Kotlin's [TODO](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html) function also uses the `Nothing` type, used as a placeholder to highlight areas of the code that need future implementation:

```kotlin
fun notImplementedSuperFunction(): Int {
    TODO("This function is not yet implemented")
}

fun main() {
    val result = notImplementedSuperFunction() // This will throw a NotImplementedError
    println(result)
}
```
{kotlin-runnable="true"}

As you can see, the `TODO` function always throws a [NotImplementedError](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-not-implemented-error/).

## Creating custom exceptions

Custom exceptions in Kotlin are user-defined exception classes that extend the built-in `Exception` class, allowing you to create more specific error types tailored to the unique needs of your application.

To create one, you can define a class that extends `Exception`:

```kotlin
class MyException: Exception("My message")
```

In this example, we added a default error message, "My message", but you can leave it blank if you want. 

Custom exceptions can also be a subclass of any pre-existent exception subclass, like the `ArithmeticException` subclass:

```kotlin
class MyException: ArithmeticException("My message")
```

Custom exceptions behave the same way as built-in exceptions. You can use the `throw` keyword to throw them, `try-catch-finally` blocks to handle them, and so on. Let's look at an example to demonstrate:

```kotlin
class NegativeNumber: Exception("Parameter is less than zero.")

class NonNegativeNumber: Exception("Parameter is a non-negative number.")


fun myFunction(par: Int) {
    if (par < 0) throw NegativeNumber()
    else if (par <= 10) throw NonNegativeNumber()
}

fun main() {
    myFunction(1) // Change this parameter to a get a different exception.
}
```
{kotlin-runnable="true"}

Additionally, you can create custom exceptions with multiple constructors using the `super` keyword.
The derived exception should not have a primary constructor to use this method. For each constructor, the relevant base exception constructor is initialized (or delegated to the new constructor). The syntax for each secondary constructor and how to throw them is illustrated in the following example:

```kotlin
class MyException: Exception {
    constructor() : super()  // No parameters
    constructor(message: String?) : super(message)  // Only the String parameter
    constructor(message: String?, cause: Throwable?) : super(message, cause) // Both parameters
    constructor(cause: Throwable?) : super(cause)  // Only the exception parameter
}
fun main(){
    throw MyException() // No parameters
    throw MyException("My exception message") // Only the String parameter
    throw MyException("My exception message", otherException) // Both parameters
    throw MyException(otherException) // Only the exception parameter
} 
```

## Stack trace

The stack trace is a tool used for debugging that shows a sequence of method calls that have led to a point in the program, particularly to a point where an error or an exception occurred.

Let's see an example where the stack trace is automatically printed because of an exception:

```kotlin
fun main() {
//sampleStart    
    throw Exception("This is an exception!")
//sampleEnd    
}
```
{kotlin-runnable="true"}

Now, we can analyze the output. The first line is the description of the exception:

`Exception in thread "main" java.lang.Exception: This is an exception!`: This line describes the exception that was thrown. It includes the type of exception (`java.lang.Exception`), the thread in which it occurred (`main`), and the message associated with the exception ("This is an exception!").

Each line that starts with an "`at`" after the exception description is the stack trace. A single line is called a stack trace element or a stack frame:

* `at FileKt.main (File.kt:2)`:  This line shows the method call (`FileKt.main`) and the source file and line number where the call was made (`File.kt:2`). The line numbers indicate where in the code the current method was called.
* `at FileKt.main (File.kt:-1)`: The line number `-1` or special markers like `-2` often indicate native or internal JVM methods where the source code mapping is not directly available.
* `at jdk.internal.reflect.NativeMethodAccessorImpl.invoke0 (:-2)`: This is also a stack trace element, which represents an internal JVM method call, without a specific source code line reference.

You can also create a stack trace without throwing an exception by using the `Thread.currentThread().stackTrace` property:

```kotlin
fun main() {
    printCurrentStackTrace()
}

//sampleStart
fun printCurrentStackTrace() {
    val stackTraceElements = Thread.currentThread().stackTrace

    for (i in 1 until stackTraceElements.size) {
        val element = stackTraceElements[i]
        println("at ${element.className}.${element.methodName}(${element.fileName}:${element.lineNumber})")
//sampleEnd        
    }
}
```
{kotlin-runnable="true"}

In the provided code, we have slightly modified the output format of the stack trace to more closely resemble the format typically seen in exception stack traces. This is achieved by custom formatting the `StackTraceElement` objects to include the "`at`" prefix, followed by the class name, method name, file name, and line number, mirroring the conventional presentation of an exception's stack trace.

## What's next?

* For information about Java interoperability, see the section on exceptions on the [Java interoperability page](java-interop.md#checked-exceptions).
* Check out exception-related idioms on the [Idioms page](idioms.md#try-catch-expression).

