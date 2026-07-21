[//]: # (title: Context parameters)

> Context parameters replace an older experimental feature called [context receivers](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm).
> You can find their main differences in the [design document for context parameters](https://github.com/Kotlin/KEEP/blob/master/proposals/context-parameters.md#summary-of-changes-from-the-previous-proposal).
> To migrate from context receivers to context
> parameters, you can use assisted support in IntelliJ IDEA, as described in
> the related [blog post](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/).
>
{style="tip"}

Context parameters allow functions and properties to declare dependencies that are implicitly available in the
surrounding context.

With context parameters, you don't need to manually pass around values, such as services or dependencies, that are shared and rarely change across sets of function calls.

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

fun main() {
    val users = object : UserService {
        override fun log(message: String) {
            println(message)
        }

        override fun findUserById(id: Int): String {
            return "User $id"
        }
    }

    context(users) {
        outputMessage("Looking up the first user")
        println(firstUser)
        // User 1
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4"}

You can use `_` as a context parameter name. In this case, the parameter's value is available for resolution but is not accessible by name inside the block:

```kotlin
// Uses "_" as context parameter name
context(_: UserService)
fun logWelcome() {
    // Compiles: the UserService context parameter on outputMessage resolves to the
    // anonymous UserService context parameter of logWelcome
    outputMessage("Welcome!")
    // Does not compile: the UserService is not implicitly in scope, so UserService.log is not resolved
    log("Hello!")
    // Does compile: contextOf resolves the UserService
    contextOf<UserService>().log("Hi!")
}
```

## Context parameters resolution

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

### Pass context arguments explicitly
<primary-label ref="experimental-opt-in"/>

When overloads differ only by context parameters, a call can become ambiguous if multiple matching context values are available.

To resolve the ambiguity, pass an explicit context argument at the call site:

```kotlin
class EmailSender
class SmsSender

context(emailSender: EmailSender)
fun sendNotification() {
    println("Sent email notification")
}

context(smsSender: SmsSender)
fun sendNotification() {
    println("Sent SMS notification")
}

context(defaultEmailSender: EmailSender, defaultSmsSender: SmsSender)
fun notifyUser() {
    // Selects the overload with the EmailSender context parameter
    sendNotification(emailSender = defaultEmailSender)

    // Selects the overload with the SmsSender context parameter
    sendNotification(smsSender = defaultSmsSender)
}
```

You can also use explicit context arguments to reduce nesting in some function calls:

* For a single call, use explicit context arguments to make the call easier to read.
* If multiple calls use the same context arguments, use the `context()` function.

This feature is [Experimental](components-stability.md#stability-levels-explained). To opt in, add the following compiler option to your build file:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-context-arguments")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xexplicit-context-arguments</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

## Restrictions

Context parameters are in continuous improvement, and some of the current restrictions include:

* Constructors can't declare context parameters.
* Properties with context parameters can't have backing fields or initializers.
* Properties with context parameters can't use delegation.

Despite these restrictions, context parameters simplify managing dependencies through simplified dependency injection,
improved DSL design, and scoped operations.
