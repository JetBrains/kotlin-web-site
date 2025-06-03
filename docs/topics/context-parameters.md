[//]: # (title: Context parameters)

<primary-label ref="experimental-general"/>

> Context parameters replace an older experimental feature called [context receivers](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm).
> To migrate from context receivers to context
> parameters, you can use assisted support in IntelliJ IDEA, as described in
> the related [blog post](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/).
>
{style="tip"}

Context parameters allow functions and properties to declare dependencies that are implicitly available in the
surrounding context.

To declare context parameters for properties and functions, use the `context` keyword
followed by a list of parameters, with each parameter declared as `name: Type`. Here is an example with a dependency on the `UserService` interface:

```kotlin
// UserService defines the dependency required in context 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// Declares a function with a context parameter
context(users: UserService)
fun outputMessage(message: String) {
    // Uses log from the context
    users.log("Log: $message")
}

// Declares a property with a context parameter
context(users: UserService)
val firstUser: String
    // Uses findUserById from the context    
    get() = users.findUserById(1)
```

You can use `_` as a context parameter name. In this case, the parameter's value is available for resolution but is not accessible by name inside the block:

```kotlin
// Uses "_" as context parameter name
context(_: UserService)
fun logWelcome() {
    // Resolution still finds the appropriate log function from UserService
    outputMessage("Welcome!")
}
```

#### Context parameters resolution

Kotlin resolves context parameters at the call site by searching for matching context values in the current scope. Kotlin matches them by their type.
If multiple compatible values exist at the same scope level, the compiler reports an ambiguity:

```kotlin
// UserService defines the dependency required in context
interface UserService {
    fun log(message: String)
}

// Declares a function with a context parameter
context(users: UserService)
fun outputMessage(message: String) {
    users.log("Log: $message")
}

fun main() {
    // Implements UserService 
    val serviceA = object : UserService {
        override fun log(message: String) = println("A: $message")
    }

    // Implements UserService
    val serviceB = object : UserService {
        override fun log(message: String) = println("B: $message")
    }

    // Both serviceA and serviceB match the expected UserService type at the call site
    context(serviceA, serviceB) {
        // This results in an ambiguity error
        outputMessage("This will not compile")
    }
}
```

#### Restrictions

Context parameters are in continuous improvement, and some of the current restrictions include:

* Constructors can't declare context parameters.
* Properties with context parameters can't have backing fields or initializers.
* Properties with context parameters can't use delegation.

Despite these restrictions, context parameters simplify managing dependencies through simplified dependency injection,
improved DSL design, and scoped operations.

#### How to enable context parameters

To enable context parameters in your project, use the following compiler option in the command line:

```Bash
-Xcontext-parameters
```

Or add it to the `compilerOptions {}` block of your Gradle build file:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-parameters")
    }
}
```

> Specifying both `-Xcontext-receivers` and `-Xcontext-parameters` compiler options simultaneously leads to an error.
>
{style="warning"}

This feature is planned to be [stabilized](components-stability.md#stability-levels-explained) and improved in future Kotlin releases.
We would appreciate your feedback in our issue tracker [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes).
