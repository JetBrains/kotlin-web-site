[//]: # (title: Advanced matching rules for expected and actual declarations)

There are a number of special cases regarding expected and actual declarations.

## Using type aliases to satisfy actual declarations

Sometimes, you don't have to write the implementation of an actual declaration from scratch. It can be an existing type,
such as a class provided by a third-party library.

You can use this type as long as it meets all the requirements associated with the expected declaration. For example,
consider these two expected declarations:

```kotlin
expect enum class Month {
    JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY,
    AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER
}

expect class MyDate {
    fun getYear(): Int
    fun getMonth(): Month
    fun getDayOfMonth(): Int
}
```

Within a JVM module, the `java.time.Month` enum could be used to implement the first expected declaration, and
the `java.time.LocalDate` class to implement the second. However, there's no way to add the `actual` keyword directly to
these types.

Instead, you can use [type aliases](type-aliases.md) to connect the expected declarations and the platform-specific
types:

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

## Widened visibility in actual declarations

An actual implementation is allowed to be more visible than the corresponding expected declaration.

For example, if you declare the following expected declaration in the common source set:

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

Then you can also use this actual implementation in a platform-specific source set, even though the visibility has been
relaxed from `internal` to `public`:

```kotlin
public actual class Messenger {
    actual fun sendMessage(message: String) {
    }
}
```

This rule also applies to [type aliases](#using-type-aliases-to-satisfy-actual-declarations), making the following code
valid as well:

```kotlin
internal class MyMessenger {
    fun sendMessage(message: String) {
    }
}

public actual typealias Messenger = MyMessenger
```

## Additional enumeration entries in actual declarations

When an enumeration is declared with `expect`, each platform module should have a corresponding `actual` declaration.
These declarations must contain the same enum constants, but they can have additional constants too.

For example, consider the following enumeration in common code:

```kotlin
expect enum class Department { IT, HR, Sales }
```

When you provide an actual declaration for `Department` in platform modules, you can add extra constants:

```kotlin
// In jvmMain:
actual enum class Department { IT, HR, Sales, Legal }

// In nativeMain: 
actual enum class Department { IT, HR, Sales, Marketing }
```

However, the matching on `Department` in common code can never be exhaustive now. Therefore, the compiler requires you
to handle potential additional cases.

So, the function that implements the `when` construction on `Department` needs an `else` clause:

```kotlin
// An else clause is required:
fun matchOnDepartment(dept: Department) {
    when (dept) {
        Department.IT -> println("The IT Department")
        Department.HR -> println("The IT Department")
        Department.Sales -> println("The IT Department")
        
        else -> println("Some other department")
    }
}
```

## Default function implementations and expected interfaces

The rule that expected declarations must contain no implementation creates an issue when working with interfaces.
Consider the declaration below:

```kotlin
enum class Severity {
    Low, Medium, High
}

interface Logger {
    fun defaultSeverity() = Severity.Low

    fun log(message: String, severity: Severity = defaultSeverity())
}
```

The `Logger` interface here defines the default severity of a message inside its declaration. Let's say you need to make
this interface platform-dependent.

If you add the `expect` keyword to the interface declaration, you'll get an error because the type contains an
implementation:

```kotlin
expect interface Logger {
    // Compilation error: “Expected declaration must not have a body”
    fun defaultSeverity() = Severity.Low
    
    fun log(message: String, severity: Severity = defaultSeverity())
}
```

But if you remove the implementation, each class that implements the interface in common code will need to override
the `defaultSeverity()` function:

```kotlin
// To avoid the compilation error, the interface implementation is removed:
expect interface Logger {
    fun defaultSeverity(): Severity
    fun log(message: String, severity: Severity = defaultSeverity())
}

// Now you're required to override the defaultSeverity() and the log() functions
class MyLogger : Logger {
    override fun defaultSeverity() = Severity.High
    override fun log(message: String, severity: Severity) {
        println("$message with severity $severity")
    }
}
```

To solve this issue, declare the type as follows:

```kotlin
enum class Severity {
    Low, Medium, High
}

expect interface Logger {
    open fun defaultSeverity(): Severity

    fun log(message: String, severity: Severity = defaultSeverity())
}
```

The `open` keyword on the `defaultSeverity()` function indicates that every actual declaration must provide an
implementation for this function. For example, you can implement it on JVM using the system property:

```kotlin
actual interface Logger {
    actual fun defaultSeverity() =
        Severity.valueOf(System.getProperty("log.severity") ?: "Low")

    actual fun log(message: String, severity: Severity)
}
```

Any concrete type that implements the interface is not required to override the `defaultSeverity()` function because the
compiler knows every actual declaration of `Logger` will provide it instead:

```kotlin
class MyLogger : Logger {
    // No need to define defaultSeverity() here:

    override fun log(message: String, severity: Severity) {
        println("$message ($severity)")
    }
}
```