[//]: # (title: Sealed classes and interfaces)

_Sealed_ classes and interfaces represent restricted class hierarchies that provide more control over inheritance.
Unlike `open` classes, which allow unrestricted subclassing, sealed classes and interfaces ensure inherent exhaustiveness 
in `when` expressions, thereby offering a more controlled hierarchy.
All direct subclasses of a sealed class are known at compile time. No other subclasses may appear outside
the module and package within which the sealed class is defined. 

Sealed classes are best used for scenarios when:

* **Limited Subclassing is Desired:** You can have a finite set of types extending a class that is known when this class is compiled.
* **Type-Safe Design is Required:** When safety and pattern matching are crucial in your project, particularly for state management or handling complex conditional logic. For an example, check out the [Sealed classes and when expression section](#sealed-classes-and-when-expression).
* **Working with closed APIs:** If you want to design robust and maintainable public APIs for libraries, sealed classes are ideal as they ensure that third-party clients use the APIs as intended.

Java introduced [a similar concept](https://docs.oracle.com/en/java/javase/15/language/sealed-classes-and-interfaces.html#GUID-0C709461-CC33-419A-82BF-61461336E65F) in Java 15, where sealed classes use the `sealed` keyword along with the `permits` clause to define restricted hierarchies.

The same logic applies to sealed interfaces and their implementations: once a module with a sealed interface is compiled,
no new implementations can appear.

As an example, consider a library's API. It's likely to contain error classes to let the library users handle errors 
that it can throw. If the hierarchy of such error classes includes interfaces or abstract classes visible in the public API,
then nothing prevents implementing or extending them in the client code. However, the library doesn't know about errors
declared outside it, so it can't treat them consistently with its own classes. With a sealed hierarchy of error classes,
library authors can be sure that they know all possible error types and that no other ones can appear later.

To declare a sealed class or interface, put the `sealed` modifier before its name:

```kotlin
sealed interface Error

sealed class IOError(): Error

class FileReadError(val file: File): IOError()
class DatabaseError(val source: DataSource): IOError()

object RuntimeError : Error
```

The hierarchy of our sealed interface and sealed class example looks like this:
![Hierarchy Illustration of Sealed Classes and Interfaces](sealedClasses_interfaces.png){width=600}

A sealed class itself is always an [abstract](classes.md#abstract-classes) and as a result cannot be instantiated directly. 
However, it may contain or inherit constructors. These constructors are not for creating instances of the sealed class itself but for its subclasses.
Let's look at an example where we have a sealed class called `Error` with several subclasses, which we instantiate:

```kotlin
sealed class Error(val message: String) {
    class NetworkError : Error("Network failure")
    class DatabaseError : Error("Database cannot be reached")
    class UnknownError : Error("An unknown error has occurred")
}

fun main() {
    val errors = listOf(Error.NetworkError(), Error.DatabaseError(), Error.UnknownError())
    errors.forEach { println(it.message) }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

Sealed classes share a restriction over the set of values with [`enum`](enum-classes.md) classes.
Each enum constant exists only as a _single instance_, whereas subclasses
of a sealed class may have _multiple_ instances, each with its own state. 
To illustrate this, consider error handling as an example. In our example, the `sealed class Error` along with its 
several subclasses, employs an `enum` to denote error severity.
Each subclass constructor initializes the `severity` and can alter its state:

```kotlin
enum class ErrorSeverity { MINOR, MAJOR, CRITICAL }

sealed class Error(val severity: ErrorSeverity) {
    class FileReadError(val file: File): Error(ErrorSeverity.MAJOR)
    class DatabaseError(val source: DataSource): Error(ErrorSeverity.CRITICAL)
    object RuntimeError : Error(ErrorSeverity.CRITICAL)
    // Additional error types can be added here
}
```

Constructors of sealed classes can have one of two [visibilities](visibility-modifiers.md): `protected` (by default) or
`private`:

```kotlin
sealed class IOError {
    constructor() { /*...*/ } // protected by default
    private constructor(description: String): this() { /*...*/ } // private is OK
    // public constructor(code: Int): this() {} // Error: public and internal are not allowed
}
```

## Location of direct subclasses

Direct subclasses of sealed classes and interfaces must be declared in the same package. They may be top-level or nested
inside any number of other named classes, named interfaces, or named objects. Subclasses can have any [visibility](visibility-modifiers.md)
as long as they are compatible with normal inheritance rules in Kotlin.

Subclasses of sealed classes must have a properly qualified name. They can't be local or anonymous objects.

> `enum` classes can't extend a sealed class (as well as any other class), but they can implement sealed interfaces.
>
{type="note"}

These restrictions don't apply to indirect subclasses. If a direct subclass of a sealed class is not marked as sealed,
it can be extended in any way that its modifiers allow:

```kotlin
sealed interface Error // has implementations only in the same package and module

sealed class IOError(): Error // extended only in same package and module
open class CustomError(): Error // can be extended wherever it's visible
```

### Inheritance in multiplatform projects

There is one more inheritance restriction in [multiplatform projects](multiplatform-get-started.md): direct subclasses of sealed classes must
reside in the same source set. It applies to sealed classes without the [expected and actual modifiers](multiplatform-expect-actual.md).

If a sealed class is declared as `expect` in a common source set and have `actual` implementations in platform source sets,
both `expect` and `actual` versions can have subclasses in their source sets. Moreover, if you use a hierarchical structure,
you can create subclasses in any source set between the `expect` and `actual` declarations. 

[Learn more about the hierarchical structure of multiplatform projects](multiplatform-hierarchy.md). 

## Sealed classes and when expression

The key benefit of using sealed classes comes into play when you use them in a [`when`](control-flow.md#when-expression)
expression.
The `when` expression, used with a sealed class, allows the Kotlin compiler to check exhaustively that all possible cases are covered. In such cases, you don't need to add an `else` clause. 
Here's an example demonstrating this with a `when` expression:

```kotlin
// Sealed class and its subclasses
sealed class Error {
    class FileReadError(val file: String): Error()
    class DatabaseError(val source: String): Error()
    object RuntimeError : Error()
}

//sampleStart
// Function to log errors
fun log(e: Error) = when(e) {
    is Error.FileReadError -> println("Error while reading file ${e.file}")
    is Error.DatabaseError -> println("Error while reading from database ${e.source}")
    Error.RuntimeError -> println("Runtime error")
    // No `else` clause is required because all the cases are covered
}
//sampleEnd

// List all errors
fun main() {
    val errors = listOf(
        Error.FileReadError("example.txt"),
        Error.DatabaseError("usersDatabase"),
        Error.RuntimeError
    )

    errors.forEach { log(it) }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

> `when` expressions on [`expect`](multiplatform-expect-actual.md) sealed classes in the common code of multiplatform projects still 
> require an `else` branch. This happens because subclasses of `actual` platform implementations aren't known in the 
> common code.
>
{type="note"}
