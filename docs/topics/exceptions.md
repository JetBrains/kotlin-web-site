[//]: # (title: Exceptions)

Exceptions are key tools for handling runtime errors, designed to maintain program flow and prevent crashes.
Kotlin simplifies exception management by treating all exceptions as unchecked, an approach also seen in languages like 
C#. This means that exceptions can be caught but are not required to be explicitly handled or declared, unlike in Java. 
For more information about how Kotlin handles exceptions when interacting with Java, Swift, and Objective-C, see 
[Exception interoperability with Java, Swift, and Objective-C](#exception-interoperability-with-java-swift-and-objective-c).

Exceptions are represented by subclasses of the 
[Exception](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) class, which are subclasses of the 
[Throwable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) class. For more information about the 
hierarchy, see the [Exception hierarchy](#exception-hierarchy) section. Since Exception is an open 
class, you can create [custom exceptions](#creating-custom-exceptions) to suit your application's specific needs.

## Working with exceptions

Working with exceptions consists of two primary actions:

* **Throwing exceptions:** Indicate the occurrence of a problematic situation.
* **Catching exceptions:** Manage unexpected scenarios by remedying the issue or notifying the user.

### Throwing exceptions

All exception classes in Kotlin inherit the [Throwable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) class,
allowing you to manually raise (or throw) exceptions using the `throw` keyword. 
This is typically done to indicate that something unexpected has happened. Exceptions are objects in Kotlin, 
and throwing an exception involves creating an instance of the exception class, just as you would with any other object.

You can throw an exception without any additional parameters: 

```kotlin
throw Exception()
```

We recommend including some additional information, such as a custom message and an original cause, to keep track of the 
original source of the problem.

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
By using this syntax, you can create custom error messages and retain the original cause (`e`) of the exception, 
which will be included in the [stack trace](#stack-trace).

Additionally, Kotlin provides idiomatic ways to throw exceptions using the `require` or `check` functions. 
These functions throw exceptions automatically when a condition is not met, simplifying the code. 

If the condition specified in `require` is not met (is `false`), an `IllegalArgumentException` is thrown.
For example:

```kotlin
fun main() {
    val userInput = -1
//sampleStart
    require(userInput >= 0) { "Input must be non-negative" }
//sampleEnd
}
```
{kotlin-runnable="true"}

Similarly, if the condition specified in `check` is not met (is `false`), it throws an `IllegalStateException`.
This function is used to verify the state of an object or variable. Here's an example using `check`:

```kotlin
fun main() {
    val userInput = -1
//sampleStart    
    check(userInput >= 0) { "Input must be non-negative" }
//sampleEnd
}
```
{kotlin-runnable="true"}

### Handling exceptions using try-catch-finally blocks

When an exception occurs, the normal execution of the program is interrupted. At that point, Kotlin attempts to find a 
suitable handler based on its type. For the handler to be considered suitable, the catch block specified
to handle the exception must match the thrown exception type or be its superclass.

You can create such handlers using the `try` and `catch` keywords:

```kotlin
try {
    // code that may throw an exception
} catch (e: SomeException) {
    // code for handling the exception
}
```

> The Kotlin idiomatic way is to use `try-catch` as an expression, so it has a return value. For example:
>
> ```kotlin
> val result = try { 
>     count() 
> } catch (e: ArithmeticException) {
>     throw IllegalStateException(e) 
> }
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
{kotlin-runnable="true"}

When you have multiple `catch` blocks, it's important to order them from the most specific to the least specific 
exception, following a top-to-bottom order in your code.
This ordering aligns with the program's execution flow. If you were to catch a general exception before a more 
specific one, the specific exception would never be reached, as the general catch block would intercept all exceptions, including the specific ones.

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

When working with resources like files or network connections, ensuring that they are properly released or closed is crucial.
This is where the `finally` block in Kotlin plays a vital role. 
It is mainly used for code cleanup after the execution of `try` and `catch` block(s), guaranteeing that the code 
in the `finally` block runs regardless of whether an exception was thrown or caught. 
This ensures that resources acquired in the `try` block are always released, preventing potential resource leaks.

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

> In Kotlin, the idiomatic way to manage resources that implement the
> `[AutoClosable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/)` interface, such as files 
> streams like `FileInputStream` or `FileOutputStream`, is to use the 
> `[.use](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html)` function. 
> This function automatically closes the resource when the block of code completes, regardless of whether an exception is
> thrown, thereby eliminating the need for a `finally` block. Consequently, Kotlin does not require a special syntax 
> like [Java's `try-with-resources`](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) 
> for resource management.
> ```kotlin
> FileWriter("test.txt").use { writer ->
> writer.write("some text") // After this block, '.use' automatically calls 'writer.close()', similar to a 'finally' block
> }
> ```
> 
> {type="tip"}

The returned value of a `try` block is determined by the last expression in the `try-catch` block that gets executed.
While the contents of the `finally` block are always executed, it doesn't affect the result of the `try-catch` block.

Let's look at an example to demonstrate:

```kotlin
fun division() { 
    //sampleStart
    val a = 0 // Change this value to 0 to execute the catch block or to a non-zero Int value to execute the try block.
    try {
        val b = 44 / a
        println("try block: Executing division: $b") 
    // The try block is always executed, but an exception here (division by zero) causes an immediate jump to the catch 
    // block.
    }
    catch (e: ArithmeticException) {
        println("catch block: Division by zero encountered.")
    //The catch block is executed due to the ArithmeticException (division by zero if a==0)
    }
    finally {
        println("finally block: The finally block is always executed")
    }
    //sampleEnd
}

fun main() {
    division()
}
```
{kotlin-runnable="true"}

If your code requires resource cleanup without handling exceptions, you can also use `try` with the `finally` block 
without `catch` blocks:

```kotlin
class MockResource {
    fun use() {
        println("Resource being used")
        // Simulate a resource being used
        val result = 100 / 0 // This will throw an ArithmeticException
        println("Result: $result")
    }

    fun close() {
        println("Resource closed")
    }
}

fun main() {
    val resource = MockResource()
//sampleStart
    try {
        resource.use() // Attempt to use the resource
    } finally {
        resource.close() // Ensure the resource is always closed, even if an exception occurs
    }
    println("End of the program") // This line will be printed, then the exception is propagated after this block
//sampleEnd
}
```
{kotlin-runnable="true"}

As you can see, the `finally` block guarantees that the resource is closed, regardless of whether an exception occurs.

In Kotlin, you have the flexibility to use only a `catch` block, only a `finally` block, or both, depending on your 
needs, but a `try` block must always be accompanied by at least one `catch` block or a `finally` block.

### Exception interoperability with Java, Swift, and Objective-C

Since Kotlin treats all exceptions as unchecked, it can lead to complications when such exceptions are called from 
languages that distinguish between checked and unchecked exceptions. 
To address this disparity in exception handling between Kotlin and languages like Java, Swift, and Objective-C, 
you can use the [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/) annotation. 
This annotation alerts callers about possible exceptions. 
For more information, see [Calling Kotlin from Java](https://kotlinlang.org/docs/java-to-kotlin-interop.html#checked-exceptions) and 
[Interoperability with Swift/Objective-C](https://kotlinlang.org/docs/native-objc-interop.html#errors-and-exceptions).

### The Nothing type

Every expression in Kotlin has a type. So what is the type of `throw IllegalArgumentException()`? 
The answer is [Nothing](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html), a built-in type, 
a subtype of all other types, also known as [the bottom type](https://en.wikipedia.org/wiki/Bottom_type). 
This means you can use Nothing in a generic type or as a return type where any other type is expected without causing 
type errors.

`Nothing` is a unique type used to represent a function or expression that never successfully completes, either due to 
always throwing an exception or some other form of non-standard termination, like an infinite loop. 
It is useful for marking functions that either aren't implemented yet or are intentionally designed to result in an 
exception, thereby clearly communicating your intentions to both the compiler and readers of the code.
In fact, the compiler warns you if it infers a `Nothing` type since it usually hides further problems in your code; 
explicitly defining `Nothing` as the return type in the function signature can get rid of this warning.

This Kotlin code demonstrates the use of the `Nothing` type, where the compiler marks the code following the function 
call as unreachable:

```kotlin
fun fail(): Nothing {
    throw Exception("Declared to return nothing and to always throw an exception")
}

fun exampleFunction(): String {
    return fail() // This is allowed at compile time because Nothing is a subtype of String. 
// The compiler marks any code within this function as unreachable after this call.
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

## Exception classes

Let's explore the types of exceptions commonly found in Kotlin, which are all subclasses of the [RuntimeException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) class:

**[ArithmeticException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/)**: Occurs when an arithmetic operation is impossible to perform, like division by zero.

```kotlin
val example = 2 / 0 // throws ArithmeticException
```

**[IndexOutOfBoundsException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/)**: Thrown to indicate that an index of some sort (array, string, etc.) is out of range.

```kotlin
val myList = mutableListOf(1, 2, 3)
myList.removeAt(3)  // throws IndexOutOfBoundsException
```

**[NumberFormatException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/)**: This exception occurs when attempting to convert a string to a numeric type, 
but the string doesn't have an appropriate format.

```kotlin
val string = "This is not a number"
val number = string.toInt() // throws NumberFormatException
```

**[NoSuchElementException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/)**: This exception is thrown when an element that does not exist in a 
particular collection is accessed. It commonly occurs when using methods that expect a specific element, 
such as `first()`, `last()`, or `elementAt()`.

```kotlin
val emptyList = listOf<Int>()
val firstElement = emptyList.first()  // throws NoSuchElementException
```

**[NullPointerException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)**: Thrown when an application attempts to use an object reference that has the null value.
Even though Kotlin's null safety features significantly reduce the risk of NullPointerExceptions, 
they can still occur either through deliberate use of the `!!` operator or when interacting with languages like Java, 
which lack Kotlin's null safety.

```kotlin
val text: String? = null
println(text!!.length)  // throws a NullPointerException
```

While you don't have to catch these exceptions explicitly, Kotlin provides the flexibility to catch them if needed.

### Exception hierarchy

The root of the Kotlin exception hierarchy is the [Throwable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) class. It has two direct subclasses, [Error](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/) and [Exception](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/).

The `Error` subclass represents serious fundamental problems that an application might not be able to recover from by itself. 
These are problems that you generally would not attempt to handle, such as [OutOfMemoryError](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) and `StackOverflowError`.

On the other hand, the `Exception` subclass is used for conditions that you might want to catch. Subtypes of 
the `Exception` type, such as the [RuntimeException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) and `IOException` (Input/Output Exception), 
deal with exceptional events in applications.

![Exception hierarchy - the Throwable class](throwable.png){width=600}

`RuntimeException` is usually caused by insufficient checks in the program code and can be prevented programmatically.
Kotlin helps prevent common RuntimeExceptions like `NullpointerException` and provides compile-time warnings for potential runtime errors, such as divisions by zero.
The following picture demonstrates a hierarchy of subtypes descended from `RuntimeException`:

![Hierarchy of RuntimeExceptions](runtime.png){width=600}

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
class NegativeNumberException: Exception("Parameter is less than zero.")

class NonNegativeNumberException: Exception("Parameter is a non-negative number.")


fun myFunction(par: Int) {
    if (par < 0) throw NegativeNumberException()
    else if (par >= 0) throw NonNegativeNumberException()
}

fun main() {
    myFunction(1) // Change this parameter to a get a different exception.
}
```
{kotlin-runnable="true"}

In more complex applications, like those involving various error scenarios like network connections, it's beneficial to 
create an error hierarchy. 
For example, you can create an abstract `ConnectionException` class with subclasses for each specific connection error.
This approach allows for more granular error handling and clearer code:

```kotlin
abstract class AccountException(message: String): Exception(message)

class InsufficientFundsException : AccountException("Insufficient funds for the transaction")
class UnauthorizedAccessException : AccountException("Unauthorized access to account")
```

Additionally, you can create a custom exception by using a primary constructor with optional parameters. 
This constructor initializes the base exception with a message and a cause, allowing for flexible exception handling. 
The following example demonstrates this simplified approach to defining custom exceptions:

```kotlin
class YourException(message: String? = null, cause: Throwable? = null): Exception(message, cause)

fun main() {
    // Example cause for the exception
    val otherException = RuntimeException("Example cause")
    // Instantiating YourException
    throw YourException(message = "My exception message", cause = otherException) // Both parameters with named arguments

    // Other ways to instantiate YourException:
    //throw YourException() // No parameters
    //throw YourException("My exception message") // With only the String parameter
    //throw YourException(cause = otherException) // With only the exception parameter, using a named argument
}
```
{kotlin-runnable="true"}

## Stack trace

The stack trace is a report generated by the runtime environment used for debugging that shows a sequence of 
function calls that have led to a point in the program, particularly to a point where an error or an exception occurred.

Let's see an example where the stack trace is automatically printed because of an exception in a JVM environment:

```kotlin
fun main() {
//sampleStart    
    throw Exception("This is an exception!")
//sampleEnd    
}
```
{kotlin-runnable="true"}

Running this code in a JVM environment produces the following output:

```kotlin
Exception in thread "main" java.lang.Exception: This is an exception!
    at MainKt.main(Main.kt:3)
    at MainKt.main(Main.kt)
```

The first line is the description of the exception:

`Exception in thread "main" java.lang.Exception: This is an exception!`: This line describes the exception that was thrown. 
It includes the type of exception (`java.lang.Exception`), the thread where it occurred (`main`), and the message 
associated with the exception ("This is an exception!").

Each line that starts with an "`at`" after the exception description is the stack trace. A single line is called a stack trace element or a stack frame:

* `at MainKt.main (Main.kt:3)`: This line shows the method call (`MainKt.main`) and the source file and line number where the call was made (`Main.kt:3`). The line numbers indicate where in the code the current method was called.
* `at MainKt.main (Main.kt)`: This line shows the entry point into the `main` function.
