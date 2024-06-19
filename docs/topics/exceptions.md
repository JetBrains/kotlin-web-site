[//]: # (title: Exceptions)

Exceptions are key tools for handling runtime errors. They are designed to keep the program running predictably despite encountering 
issues that could disrupt its normal operation.
Kotlin simplifies exception management by treating all exceptions as unchecked. 
This means that exceptions can be caught but are not required to be explicitly handled or [declared](https://kotlinlang.org/docs/java-to-kotlin-interop.html#checked-exceptions), unlike in Java. 

For more information about how Kotlin handles exceptions when interacting with Java, Swift, and Objective-C, see 
[Exception interoperability with Java, Swift, and Objective-C](#exception-interoperability-with-java-swift-and-objective-c).

Exceptions are represented by subclasses of the 
[`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) class, which are subclasses of the 
[`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) class. For more information about the 
hierarchy, see the [Exception hierarchy](#exception-hierarchy) section. Since `Exception` is an open 
class, you can create [custom exceptions](#creating-custom-exceptions) to suit your application's specific needs.

Working with exceptions consists of two primary actions:

* **Throwing exceptions:** Indicate the occurrence of a problematic situation.
* **Catching exceptions:** Manage unexpected scenarios by remedying the issue or notifying the user.

## Throwing exceptions

All exception classes in Kotlin inherit from the [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) class,
allowing you to manually throw exceptions using the `throw` keyword.
This is typically done to indicate that something unexpected has happened. Exceptions are objects in Kotlin, 
and throwing an exception involves creating an instance of the `Exception` class, just as you would with any other object.

You can throw an exception without any parameters: 

```kotlin
throw IllegalArgumentException()
```

We recommend including additional information, such as a custom message and the original cause, 
to better track the source of the problem.

Let's look at a simple example:

```kotlin
val cause = IllegalStateException("Original cause: illegal state")

// Throws an IllegalArgumentException if userInput is negative 
// Additionally, it shows the original cause, represented by the cause IllegalStateException
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", cause)
}
```

In this example, an `IllegalArgumentException` is thrown when the user inputs a negative value.
Using this syntax, you can create custom error messages and retain the original cause (`cause`) of the exception, 
which will be included in the [stack trace](#stack-trace).

### Using precondition functions to throw exceptions

Kotlin offers additional idiomatic ways to automatically throw exceptions using precondition functions. 
Precondition functions include, [`require`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html), [`check`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html), and [`error`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html).
These functions are most suitable for situations where the program's flow cannot continue if specific conditions aren't met, 
streamlining code by handling these checks efficiently.

The `require` function is best used when the validity of input arguments is crucial for the function's operation, 
and there's no sensible way for the function to proceed if these arguments are invalid.

If the condition specified in `require` is not met, an [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/) is thrown.

For example:

```kotlin
fun getIndices(count: Int): List<Int> {
    require(count >= 0) { "Count must be non-negative. You set count to $count." }
    return List(count) { it + 1 }
}
fun main() {
    // This fails with an IllegalArgumentException
    println(getIndices(-1))
    
    // Uncomment the line below to see a working example
    // println(getIndices(3))
    // [1, 2, 3]
}
```
{kotlin-runnable="true"}

The `check` function is used to validate the state of an object or variable, 
where failing the check indicates a logic error that needs to be addressed.

If the condition specified in the `check` function is `false`, it throws an [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/).

Let’s look at an example:

```kotlin
fun main() {
    var someState: String? = null

    fun getStateValue(): String {

        val state = checkNotNull(someState) { "State must be set beforehand!" }
        check(state.isNotEmpty()) { "State must be non-empty!" }
        return state
    }
    // Uncomment the line below and the program fails with IllegalStateException
    // getStateValue()

    someState = ""

    // Uncomment the line below and the program fails with IllegalStateException
    // getStateValue() 
    someState = "non-empty-state"

    // This prints “non-empty-state”
    println(getStateValue())
}
```
{kotlin-runnable="true"}

> When using `require` and `check` for nullability checks, these functions allow the compiler to perform [smart casting](https://kotlinlang.org/docs/typecasts.html#smart-casts). 
> This means that after a successful check, the compiler automatically casts the variable to a non-null type. For example:
> 
> ```kotlin
> fun printNonNullString(str: String?) {
>    // Nullability check
>    require(str != null) 
>    // After this successful check, 'str' is guaranteed to be 
>    // non-null and is automatically smart cast to non-nullable String
>    println(str.length)
> }
> ```
> 
{type="note"}

Lastly, the `error` function is used to signal an illegal state or a condition in the code that logically should not occur.
It’s suitable for scenarios when you want to throw an exception intentionally in your code, such as when the code encounters 
an unexpected state. 
This function is particularly useful in `when` expressions, providing a clear way to handle cases that shouldn't logically happen.

In the following example, the `error` function is used to handle an undefined user role.
If the role is not one of the predefined ones, an [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/) is thrown:

```kotlin
class User(val name: String, val role: String)

fun processUserRole(user: User) {
    when (user.role) {
        "admin" -> println("${user.name} is an admin.")
        "editor" -> println("${user.name} is an editor.")
        "viewer" -> println("${user.name} is a viewer.")
        else -> error("Undefined role: ${user.role}")
    }
}

fun main() {
    // This works as expected
    val user1 = User("Alice", "admin")
    processUserRole(user1)
    // Alice is an admin.

    // This throws an IllegalStateException
    val user2 = User("Bob", "guest")
    processUserRole(user2)
}
```
{kotlin-runnable=”true”}

## Handling exceptions using try-catch blocks

When an exception is thrown, it interrupts the normal execution of the program. 
The exception is then caught by the first matching `catch` block that handles either its specific type or a superclass of the exception.

You can create such handlers using the `try` and `catch` keywords:

```kotlin
try {
    // code that may throw an exception
} catch (e: SomeException) {
    // code for handling the exception
}
```

It’s a common idiomatic approach to use `try-catch` as an expression, so it can return a value from either
the `try` block or the `catch` block. For example:

```kotlin
fun main() {
    val num: Int = try {

        // If count() completes successfully, its return value is assigned to num
        count()
        
    } catch (e: ArithmeticException) {
        
        // If count() throws an exception, the catch block returns -1, which is assigned to num
        -1
    }
    println("Result: $num")
}

// Simulates a function that might throw ArithmeticException
fun count(): Int {
    
    // Change this value to return a different value to num
    val a = 0
    
    return 10 / a
}
```
{kotlin-runnable=”true”}


Kotlin supports using several handlers associated with the same `try` block, each designed to catch only one specific type of exception. 
You can add as many `catch` blocks as needed to handle different exceptions distinctively.

Let’s look at an example using [custom exceptions](#creating-custom-exceptions):

```kotlin
open class WithdrawalException(message: String) : Exception(message)
class InsufficientFundsException(message: String) : WithdrawalException(message)

fun processWithdrawal(amount: Double, availableFunds: Double) {
    if (amount > availableFunds) {
        throw InsufficientFundsException("Insufficient funds for the withdrawal.")
    }
    if (amount < 1 || amount % 1 != 0.0) {
        throw WithdrawalException("Invalid withdrawal amount.")
    }
    println("Withdrawal processed")
}

fun main() {
    val availableFunds = 500.0

    // Change this value to test different scenarios
    val withdrawalAmount = 500.5

    try {
        processWithdrawal(withdrawalAmount.toDouble(), availableFunds)

    // The order of catch blocks is important!
    } catch (e: InsufficientFundsException) {
        println("Caught an InsufficientFundsException: ${e.message}")
    } catch (e: WithdrawalException) {
        println("Caught a WithdrawalException: ${e.message}")
    }
}
```
{kotlin-runnable="true"}

When you have multiple `catch` blocks, it's important to order them from the most specific to the least specific exception,
following a top-to-bottom order in your code. 
This ordering aligns with the program's execution flow. 
If you were to catch a general exception before a more specific one, the specific exception would never be reached, 
as the general catch block would intercept all exceptions, including the specific ones.

### The finally block

The `finally` block is a block of code that is always executed, regardless of whether the `try` block succeeds without
any problems or an exception is thrown.
The primary use of the `finally` block is to clean up code after the execution of `try` and `catch` block(s).
Using `finally` ensures that resources acquired in the `try` block are always released, preventing potential resource leaks.
It plays a critical role when working with resources like files or network connections, ensuring that they are properly
closed or released.

Here is how you would typically use the `try-catch-finally` blocks together:

```kotlin
try {
    // code that may throw an exception
}
catch (e: YourException) {
    // exception handler
}
finally {
    // code that is always executed
}
```

The returned value of a `try` expression is determined by the last expression in the `try-catch` block that gets executed.
This means the output depends on where the execution flow completes; either in the `try` block, if no exceptions occur,
or in the `catch` block, if an exception is handled. 
While the contents of the `finally` block are always executed, it doesn’t affect the result of the `try-catch` block.

Let's look at an example to demonstrate:

```kotlin
fun divideOrNull(a: Int): Int {
    
    // The try block is always executed
    // An exception here (division by zero) causes an immediate jump to the catch block
    try {
        val b = 44 / a
        println("try block: Executing division: $b")
        return b
    }
    
    // The catch block is executed due to the ArithmeticException (division by zero if a ==0)
    catch (e: ArithmeticException) {
        println("catch block: Encountered ArithmeticException $e")
        return -1
    }
    finally {
        println("finally block: The finally block is always executed")
    }
}

fun main() {
    
    // Change this value to get a different result. An ArithmeticException will return: -1
    divideOrNull(0)
}
```
{kotlin-runnable="true"}

> In Kotlin, the idiomatic way to manage resources that implement the [AutoClosable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) interface,
> such as file streams like `FileInputStream` or `FileOutputStream`, is to use the [`.use`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html) function. 
> This function automatically closes the resource when the block of code completes, regardless of whether
> an exception is thrown, thereby eliminating the need for a `finally` block. 
> Consequently, Kotlin does not require a special syntax like [Java's try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) for resource management.
> 
> ```kotlin
> FileWriter("test.txt").use { writer ->
> writer.write("some text") 
> // After this block, the .use function automatically calls writer.close(), similar to a finally block
> }
> ```
> 
{type="note"}

If your code requires resource cleanup without handling exceptions, you can also use `try` with the `finally` block without `catch` blocks:

```kotlin
class MockResource { 
    fun use() { 
        println("Resource being used") 
        // Simulate a resource being used 
        // This throws an ArithmeticException if division by zero occurs
        val result = 100 / 0
        
        // This line is not executed if an exception is thrown
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
        
        // Attempts to use the resource 
        resource.use()
        
    } finally {
        
        // Ensures that the resource is always closed, even if an exception occurs 
        resource.close()
    }

    // This line is not printed if an exception is thrown
    println("End of the program")
//sampleEnd
}
```
{kotlin-runnable="true"}

As you can see, the `finally` block guarantees that the resource is closed, regardless of whether an exception occurs.

In Kotlin, you have the flexibility to use only a `catch` block, only a `finally` block, or both, depending on your 
specific needs, but a `try` block must always be accompanied by at least one `catch` block or a `finally` block.

## Creating custom exceptions

In Kotlin, you can define custom exceptions by creating classes that extend the built-in `Exception` class, allowing you
to create more specific error types tailored to the unique needs of your application.

To create one, you can define a class that extends `Exception`:

```kotlin
class MyException: Exception("My message")
```

In this example, there is a default error message, "My message", but you can leave it blank if you want.

Custom exceptions can also be a subclass of any pre-existent exception subclass, like the `ArithmeticException` subclass:

```kotlin
class NumberTooLargeException: ArithmeticException("My message")
```

> Exceptions in Kotlin are stateful objects, carrying information specific to the context of their creation, referred to as the [stack trace](#stack-trace).
> Avoid creating exceptions using `object` declarations. 
> Instead, create a new instance of the exception every time you need one. 
> This way, you can ensure the exception's state accurately reflects the specific context.
> 
{type="tip"}

> In Kotlin, [classes are final by default](https://kotlinlang.org/docs/inheritance.html) and cannot be subclassed unless the parent
> class is declared as `open`.
> 
> For example:
>
> ```kotlin
> // Declares a custom exception as an open class making it subclassable
> open class MyCustomException(message: String): Exception(message)
>
> // Creates a subclass of the custom exception
> class SpecificCustomException: MyCustomException("Specific error message")
> ```
>
{type="note"}

Custom exceptions function just like built-in exceptions. You can throw them using the `throw` keyword, 
and handle them with `try-catch-finally` blocks. Let's look at an example to demonstrate:

```kotlin
class NegativeNumberException: Exception("Parameter is less than zero.")
class NonNegativeNumberException: Exception("Parameter is a non-negative number.")

fun myFunction(number: Int) {
    if (number < 0) throw NegativeNumberException()
    else if (number >= 0) throw NonNegativeNumberException()
}

fun main() {
    
    // Change the value in this function to a get a different exception
    myFunction(1)
}
```
{kotlin-runnable="true"}

In complex applications with diverse error scenarios,
creating a hierarchy of exceptions can help making the code clearer and more specific.
This can be achieved by employing an [`abstract class`](https://kotlinlang.org/docs/classes.html#abstract-classes) or a
[`sealed class`](https://kotlinlang.org/docs/sealed-classes.html#constructors) as a base for common exception features,
with specific subclasses to define detailed exception types.
Additionally, custom exceptions with optional parameters offer flexibility, allowing initialization with varied messages,
which enables more granular error handling.

Let's look at an example using `sealed class AccountException` as the base for an exception hierarchy, 
and `class APIKeyExpiredException`, a subclass, which showcases the use of optional parameters for improved exception detail:

```kotlin
//sampleStart
// Creates an abstract class as the base for an exception hierarchy for account-related errors
sealed class AccountException(message: String, cause: Throwable? = null):
Exception(message, cause)

// Creates a subclass of AccountException
class InvalidAccountCredentialsException : AccountException("Invalid account credentials detected")

// Creates a subclass of AccountException, which allows the addition of custom messages and causes
class APIKeyExpiredException(message: String = "API key expired", cause: Throwable? = null)	: AccountException(message, cause)

// Change values of placeholder functions to get different results
fun areCredentialsValid(): Boolean = true
fun isAPIKeyExpired(): Boolean = true
//sampleEnd

// Validates account credentials and API key
fun validateAccount() {
    if (!areCredentialsValid()) throw InvalidAccountCredentialsException()
    if (isAPIKeyExpired()) {
        // Example of throwing APIKeyExpiredException with a specific cause
        val cause = RuntimeException("API key validation failed due to network error")
        throw APIKeyExpiredException(cause = cause)
    }
}

fun main() {
    try {
        validateAccount()
        println("Operation successful: Account credentials and API key are valid.")
    } catch (e: AccountException) {
        println("Error: ${e.message}")
        e.cause?.let { println("Caused by: ${it.message}") }
    }
}
```
{kotlin-runnable="true"}

## The Nothing type

Every expression in Kotlin has a type. So what is the type of the expression `throw IllegalArgumentException()`? 
The answer is [Nothing](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html), a built-in type, 
a subtype of all other types, also known as [the bottom type](https://en.wikipedia.org/wiki/Bottom_type). 
Meaning `Nothing` can appear as a return type or generic type where any other type is expected without causing type errors.

`Nothing` is a unique type used to represent a function or expression that never successfully completes,
either due to always throwing an exception or leading to an endless execution path, like an infinite loop.
It is useful for marking functions that either aren't implemented yet or are intentionally designed to result in an exception,
thereby clearly communicating your intentions to both the compiler and readers of the code.
In fact, the compiler warns you if it infers a `Nothing` type in a function signature; 
explicitly defining `Nothing` as the return type in the function signature can get rid of this warning.

This Kotlin code demonstrates the use of the `Nothing` type, where the compiler marks the code following the function
call as unreachable:

```kotlin
class Person(val name: String?)

fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
    // This function will never return successfully; it will always throw an exception.
}

fun main() {
    // Creates an instance of Person with 'name' as null
    val person = Person(name = null)
    
    val s: String = person.name ?: fail("Name required")

    // 's' is guaranteed to be initialized at this point
    println(s)
}
```
{kotlin-runnable="true"}

Kotlin's [TODO](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html) function also uses the `Nothing` type, used as a placeholder to highlight areas of the code that
need future implementation:

```kotlin
fun notImplementedFunction(): Int {
    TODO("This function is not yet implemented")
}

fun main() {
    val result = notImplementedFunction()
    // This throws a NotImplementedError
    println(result)
}
```
{kotlin-runnable="true"}

As you can see, the `TODO` function always throws a [NotImplementedError](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-not-implemented-error/).

## Exception classes

Let's explore some common exception types found in Kotlin, which are all subclasses of the [RuntimeException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) class:

**[ArithmeticException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/)**: This exception occurs when an arithmetic operation is impossible to perform, like division by zero.

```kotlin
val example = 2 / 0 // throws ArithmeticException
```

**[IndexOutOfBoundsException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/)**: This exception is thrown to indicate that an index of some sort, such as an array or string is out of range.

```kotlin
val myList = mutableListOf(1, 2, 3)
myList.removeAt(3)  // throws IndexOutOfBoundsException
```

> The idiomatic way to avoid this exception is to use a safer alternative, the [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) function:
> 
> ```kotlin
> val myList = listOf(1, 2, 3)
> // Returns null, instead of IndexOutOfBoundsException
> val element = myList.getOrNull(3)
> println("Element at index 3: $element")
> ```
> 
{type="note"}

**[NoSuchElementException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/)**: This exception is thrown when an element that does not exist in a
particular collection is accessed. It occurs when using methods that expect a specific element,
such as [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html), [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html), or [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html).

```kotlin
val emptyList = listOf<Int>()
val firstElement = emptyList.first()  // throws NoSuchElementException
```

> The idiomatic way to avoid this exception is to use a safer alternative, for example the [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) function:
>
> ```kotlin
> val emptyList = listOf<Int>()
> // Returns null, instead of NoSuchElementException
> val firstElement = emptyList.firstOrNull()
> println("First element in empty list: $firstElement")
> ```
>
{type="note"}

**[NumberFormatException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/)**: This exception occurs when attempting to convert a string to a numeric type, 
but the string doesn't have an appropriate format.

```kotlin
val string = "This is not a number"
val number = string.toInt() // throws NumberFormatException
```

> The idiomatic way to avoid this exception is to use a safer alternative, the [`toIntOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int-or-null.html) function:
>
> ```kotlin
> val nonNumericString = "not a number"
> // Returns null, instead of NumberFormatException
> val number = nonNumericString.toIntOrNull()
> println("Converted number: $number")
> ```
>
{type="note"}

**[NullPointerException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)**: This exception is thrown when an application attempts to use an object reference that has the `null` value.
Even though Kotlin's null safety features significantly reduce the risk of NullPointerExceptions, 
they can still occur either through deliberate use of the `!!` operator or when interacting with Java, which lacks 
Kotlin's null safety.

```kotlin
val text: String? = null
println(text!!.length)  // throws a NullPointerException
```

While all exceptions are unchecked in Kotlin, and you don't have to catch them explicitly, you still have the flexibility to catch them if desired.

### Exception hierarchy

The root of the Kotlin exception hierarchy is the [Throwable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) class. It has two direct subclasses, [Error](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/) and [Exception](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/).

The `Error` subclass represents serious fundamental problems that an application might not be able to recover from by itself. 
These are problems that you generally would not attempt to handle, such as [OutOfMemoryError](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) or `StackOverflowError`.

On the other hand, the `Exception` subclass is used for conditions that you might want to handle. Subtypes of 
the `Exception` type, such as the [RuntimeException](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) and `IOException` (Input/Output Exception), 
deal with exceptional events in applications.

![Exception hierarchy - the Throwable class](throwable.svg){width=700}

`RuntimeException` is usually caused by insufficient checks in the program code and can be prevented programmatically.
Kotlin helps prevent common `RuntimeExceptions` like `NullPointerException` and provides compile-time warnings for potential runtime errors, 
such as division by zero. The following picture demonstrates a hierarchy of subtypes descended from `RuntimeException`:

![Hierarchy of RuntimeExceptions](runtime-exception.svg){width=700}

## Stack trace

The stack trace is a report generated by the runtime environment used for debugging that shows a sequence of 
function calls that have led to a point in the program, particularly to a point where an error or an exception occurred.

Let's see an example where the stack trace is automatically printed because of an exception in a JVM environment:

```kotlin
fun main() {
//sampleStart    
    throw ArithmeticException("This is an arithmetic exception!")
//sampleEnd    
}
```
{kotlin-runnable="true"}

Running this code in a JVM environment produces the following output:

```text
Exception in thread "main" java.lang.ArithmeticException: This is an arithmetic exception!
    at MainKt.main(Main.kt:3)
    at MainKt.main(Main.kt)
```

The first line is the description of the exception:

`Exception in thread "main" java.lang.ArithmeticException: This is an arithmetic exception!`: This line describes the exception that was thrown. 
It includes the type of exception (`java.lang.ArithmeticException`), the thread in which it occurred (`main`), and the message 
associated with the exception (`"This is an arithmetic exception!"`).

Each line that starts with an "`at`" after the exception description is the stack trace. A single line is called a stack trace element or a stack frame:

* `at MainKt.main (Main.kt:3)`: This line shows the method call (`MainKt.main`) and the source file and line number where the call was made (`Main.kt:3`). The line numbers indicate where in the code the current method was called.
* `at MainKt.main (Main.kt)`: This line indicates that the exception originates from the "`main`" function in the `Main.kt` file.

## Exception interoperability with Java, Swift, and Objective-C

Since Kotlin treats all exceptions as unchecked, it can lead to complications when such exceptions are called from
languages that distinguish between checked and unchecked exceptions.
To address this disparity in exception handling between Kotlin and languages like Java, Swift, and Objective-C,
you can use the [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/) annotation.
This annotation alerts callers about possible exceptions.
For more information, see [Calling Kotlin from Java](https://kotlinlang.org/docs/java-to-kotlin-interop.html#checked-exceptions) and
[Interoperability with Swift/Objective-C](https://kotlinlang.org/docs/native-objc-interop.html#errors-and-exceptions).
