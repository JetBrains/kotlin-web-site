[//]: # (title: Extensions)

Kotlin _extensions_ let you extend a class or an interface with new functionality without using inheritance or
design patterns like _Decorator_. They are useful when working with third-party libraries you can't modify 
directly. Once created, you call these extensions as if they were members of the original class or interface.

The most common forms of extensions are [_extension functions_](#extension-functions) and [_extension properties_](#extension-properties).

Importantly, extensions don't modify the classes or interfaces they extend. When you define an extension, you don't add new members.
You make new functions callable or new properties accessible using the same syntax.

## Receivers

Extensions are always called on a receiver. The receiver has to have the same type as the class or interface being extended.
To use an extension, prefix it with the receiver followed by a `.` and the function or property name.

For example, the [`.appendLine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/append-line.html) extension function from the standard library extends the `StringBuilder` class.
So in this case, the receiver is a `StringBuilder` instance, and the _receiver type_ is `StringBuilder`:

```kotlin
fun main() { 
//sampleStart
    // builder is an instance of StringBuilder
    val builder = StringBuilder()
        // Calls .appendLine() extension function on builder
        .appendLine("Hello")
        .appendLine()
        .appendLine("World")
    println(builder.toString())
    // Hello
    //
    // World
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-stringbuilder"}

## Extension functions

Before creating your own extension functions, see if what you are looking for is already available in the Kotlin [standard library](https://kotlinlang.org/api/core/kotlin-stdlib/).
The standard library provides many useful extension functions for:

* Operating on collections: [`.map()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map.html), [`.filter()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter.html), [`.reduce()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce.html), [`.fold()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/fold.html), [`.groupBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/group-by.html).
* Converting to strings: [`.joinToString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/join-to-string.html).
* Working with null values: [`.filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html).

To create your own extension function, prefix its name with a receiver type followed by a `.`. In this example, the `.truncate()`
function extends the `String` class, so the receiver type is `String`:

```kotlin
fun String.truncate(maxLength: Int): String {
    return if (this.length <= maxLength) this else take(maxLength - 3) + "..."
}

fun main() {
    val shortUsername = "KotlinFan42"
    val longUsername = "JetBrainsLoverForever"

    println("Short username: ${shortUsername.truncate(15)}") 
    // KotlinFan42
    println("Long username:  ${longUsername.truncate(15)}")
    // JetBrainsLov...
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-truncate"}

The `.truncate()` function truncates any string that it's called on by the number in the `maxLength` argument and adds an ellipsis `...`.
If the string is shorter than `maxLength`, the function returns the original string.

In this example, the `.displayInfo()` function extends the `User` interface:

```kotlin
interface User {
    val name: String
    val email: String
}

fun User.displayInfo(): String = "User(name=$name, email=$email)"

// Inherits from and implements the properties of the User interface
class RegularUser(override val name: String, override val email: String) : User

fun main() {
    val user = RegularUser("Alice", "alice@example.com")
    println(user.displayInfo()) 
    // User(name=Alice, email=alice@example.com)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-interface"}

The `.displayInfo()` function returns a string containing the `name` and `email` of a `RegularUser` instance. Defining 
an extension on an interface like this is useful when you want to add functionality to all types that implement an interface
only once.

In this example, the `.mostVoted()` function extends the `Map<String, Int>` class:

```kotlin
fun Map<String, Int>.mostVoted(): String? {
    return maxByOrNull { (key, value) -> value }?.key
}

fun main() {
    val poll = mapOf(
        "Cats" to 37,
        "Dogs" to 58,
        "Birds" to 22
    )

    println("Top choice: ${poll.mostVoted()}") 
    // Dogs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-mostvoted"}

The `.mostVoted()` function iterates through the key-value pairs of the map it's called on and uses the [`maxByOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-by-or-null.html)
function to return the key of the pair containing the highest value. If the map is empty, the `maxByOrNull()` function
returns `null`. The `mostVoted()` function uses a safe call `?.` to only access the `key` property when the `maxByOrNull()` function
returns a non-null value.

### Generic extension functions

To create generic extension functions, declare the generic type parameter before the function name
to make it available in the receiver type expression. In this example, the `.endpoints()` function extends `List<T>` 
where `T` can be any type:

```kotlin
fun <T> List<T>.endpoints(): Pair<T, T> {
    return first() to last()
}

fun main() {
    val cities = listOf("Paris", "London", "Berlin", "Prague")
    val temperatures = listOf(21.0, 19.5, 22.3)

    val cityEndpoints = cities.endpoints()
    val tempEndpoints = temperatures.endpoints()

    println("First and last cities: $cityEndpoints")
    // (Paris, Prague)
    println("First and last temperatures: $tempEndpoints") 
    // (21.0, 22.3)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-endpoints"}

The `.endpoints()` function returns a pair containing the first and last elements of the list that it's called on.
Inside the function body, it calls the `first()` and `last()` functions and combines their returned values into a `Pair`
using the `to` infix function.

For more information about generics, see [generic functions](generics.md).

### Nullable receivers

You can define extension functions with a nullable receiver type, which allows you to call them on a variable
even if its value is null. When the receiver is `null`, `this` is also `null`. Make sure to handle nullability correctly
within your functions. For example, use `this == null` checks inside function bodies, [safe calls `?.`](null-safety.md#safe-call-operator), or the [Elvis operator `?:`](null-safety.md#elvis-operator).

In this example, you can call the `.toString()` function without checking for `null` because the check already happens inside
the extension function:

```kotlin
fun main() {
    //sampleStart
    // Extension function on nullable Any
    fun Any?.toString(): String {
        if (this == null) return "null"
        // After null check, `this` is smart-cast to non-nullable Any
        // So this call resolves to the regular toString() function
        return toString()
    }
    
    val number: Int? = 42
    val nothing: Any? = null
    
    println(number.toString())
    // 42
    println(nothing.toString()) 
    // null
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-nullable-receiver"}

### Extension or member functions?

Since extension and member function calls have the same notation, how does the compiler know which one to use?
Extension functions are dispatched _statically_, meaning the compiler determines which function to call based on the
receiver type at compile time. For example:

```kotlin
fun main() {
//sampleStart
    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(shape: Shape) {
        println(shape.getName())
    }
    
    printClassName(Rectangle())
    // Shape
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-shape"}

In this example, the compiler calls the `Shape.getName()` extension function because the parameter `shape` is declared
as type `Shape`. Because extension functions are resolved statically, the compiler chooses the function based on the declared
type, not the actual instance.

So even though the example passes a `Rectangle` instance, the `.getName()` function resolves to `Shape.getName()` since the 
variable is declared as type `Shape`.

If a class has a member function and there's an extension function with the same receiver type,
the same name, and compatible arguments, the member function takes precedence. For example:

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()
    // Member function
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function"}

However, extension functions can overload member functions that have the same name but a _different_ signature:

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    // Same name but different signature
    fun Example.printFunctionType(index: Int) { println("Extension function #$index") }
    
    Example().printFunctionType(1)
    // Extension function #1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function-overload"}

In this example, since an `Int` is passed to the `.printFunctionType()` function, the compiler chooses the extension
function because it matches the signature. The compiler ignores the member function, which takes no arguments.

### Anonymous extension functions

You can define extension functions without giving them a name. This is useful when you want to avoid cluttering the global
namespace or when you need to pass some extension behavior as a parameter.

For example, suppose you want to extend a data class with a one-time function to calculate shipping, without giving it a name:

```kotlin
fun main() {
    //sampleStart
    data class Order(val weight: Double)
    val calculateShipping = fun Order.(rate: Double): Double = this.weight * rate
    
    val order = Order(2.5)
    val cost = order.calculateShipping(3.0)
    println("Shipping cost: $cost") 
    // Shipping cost: 7.5
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-anonymous"}

To pass extension behavior as a parameter, use a [lambda expression](lambdas.md#lambda-expression-syntax) with a type annotation.
For example, let's say you want to check if a number is within a range without defining a named function:

```kotlin
fun main() {
    val isInRange: Int.(min: Int, max: Int) -> Boolean = { min, max -> this in min..max }

    println(5.isInRange(1, 10))
    // true
    println(20.isInRange(1, 10))
    // false
}
```
 {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-anonymous-lambda"}

In this example, the `isInRange` variable holds a function of type `Int.(min: Int, max: Int) -> Boolean`. The type is
an extension function on the `Int` class that takes `min` and `max` parameters and returns a `Boolean`.

The lambda body `{ min, max -> this in min..max }` checks whether the `Int` value the function is called on falls within the
range between `min` and `max` parameters. If the check is successful, the lambda returns `true`.

For more information, see [Lambda expressions and anonymous functions](lambdas.md).

## Extension properties

Kotlin supports extension properties, which are useful for performing data transformations or creating UI display helpers
without cluttering the class you're working with. 

To create an extension property, write the name of the class that you want to extend, followed by a `.` and the name of your property.

For example, suppose you have a data class that represents a user with a first and last name, and you want to create a 
property that returns an email-style username when accessed. Your code might look like this:

```kotlin
data class User(val firstName: String, val lastName: String)

// An extension property to get a username-style email handle
val User.emailUsername: String
    get() = "${firstName.lowercase()}.${lastName.lowercase()}"

fun main() {
    val user = User("Mickey", "Mouse")
    // Calls extension property
    println("Generated email username: ${user.emailUsername}")
    // Generated email username: mickey.mouse
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property"}

Since extensions don't actually add members to classes, there's no efficient way for an extension
property to have a [backing field](properties.md#backing-fields). That's why initializers are not allowed for
extension properties. You can define their behavior only by explicitly providing getters and setters. For example:

```kotlin
data class House(val streetName: String)

// Doesn't compile because there is no getter and setter
// var House.number = 1
// Error: Initializers are not allowed for extension properties

// Compiles successfully
val houseNumbers = mutableMapOf<House, Int>()
var House.number: Int
    get() = houseNumbers[this] ?: 1
    set(value) {
        println("Setting house number for ${this.streetName} to $value")
        houseNumbers[this] = value
    }

fun main() {
    val house = House("Maple Street")

    // Shows the default
    println("Default number: ${house.number} ${house.streetName}") 
    // Default number: 1 Maple Street
    
    house.number = 99
    // Setting house number for Maple Street to 99

    // Shows the updated number
    println("Updated number: ${house.number} ${house.streetName}") 
    // Updated number: 99 Maple Street
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property-error"}

In this example, the getter uses the [Elvis operator](null-safety.md#elvis-operator) to return the house number if it exists in the `houseNumbers` map or
`1`. To learn more about how to write getters and setters, see [Custom getters and setters](properties.md#custom-getters-and-setters).

## Companion object extensions

If a class defines a [companion object](object-declarations.md#companion-objects), you can also define extension
functions and properties for the companion object. Just like regular members of the companion object,
you can call them using only the class name as the qualifier. The compiler names the companion object `Companion` by
default:

```kotlin
class Logger {
    companion object { }
}

fun Logger.Companion.logStartupMessage() {
    println("Application started.")
}

fun main() {
    Logger.logStartupMessage()
    // Application started.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-companion-object"}

## Declaring extensions as members

You can declare extensions for one class inside another. Extensions like this have multiple _implicit receivers_.
An implicit receiver is an object whose members you can access without qualifying them with [`this`](this-expressions.md#qualified-this):

* The class where you declare the extension is the _dispatch receiver_.
* The extension function's receiver type is the _extension receiver_.

Consider this example where the `Connection` class has an extension function for the `Host` class called `printConnectionString()`:

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    // Host is the extension receiver
    fun Host.printConnectionString() {
        // Calls Host.printHostname()
        printHostname() 
        print(":")
        // Calls Connection.printPort()
        // Connection is the dispatch receiver
        printPort()
    }

    fun connect() {
        /*...*/
        // Calls the extension function
        host.printConnectionString() 
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    // kotl.in:443
    
    // Triggers an error because the extension function isn't available outside Connection
    // Host("kotl.in").printConnectionString()
    // Unresolved reference 'printConnectionString'.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-members"}

This example declares the `printConnectionString()` function inside the `Connection` class, so the `Connection` class is the
dispatch receiver. The extension function's receiver type is the `Host` class, so the `Host` class is the extension receiver.

If the dispatch receiver and the extension receiver have members with the same name, the extension receiver's member takes
precedence. To access the dispatch receiver explicitly, use the [qualified `this` syntax](this-expressions.md#qualified-this):

```kotlin
class Connection {
    fun Host.getConnectionString() {
        // Calls Host.toString()
        toString()
        // Calls Connection.toString()
        this@Connection.toString()
    }
}
```

### Overriding member extensions

You can declare member extensions as `open` and override them in subclasses, which is useful when you want
to customize the extension's behavior for each subclass. The compiler handles each receiver type differently:

| Receiver type      | Resolution time | Dispatch type |
|--------------------|-----------------|---------------|
| Dispatch receiver  | Runtime         | Virtual       |
| Extension receiver | Compile time    | Static        |

Consider this example, where the `User` class is `open` and the `Admin` class inherits from it. The `NotificationSender`
class defines `sendNotification()` extension functions for both `User` and `Admin` classes, and the
`SpecialNotificationSender` class overrides them:

```kotlin
open class User

class Admin : User()

open class NotificationSender {
    open fun User.sendNotification() {
        println("Sending user notification from normal sender")
    }

    open fun Admin.sendNotification() {
        println("Sending admin notification from normal sender")
    }

    fun notify(user: User) {
        user.sendNotification()
    }
}

class SpecialNotificationSender : NotificationSender() {
    override fun User.sendNotification() {
        println("Sending user notification from special sender")
    }

    override fun Admin.sendNotification() {
        println("Sending admin notification from special sender")
    }
}

fun main() {
    // Dispatch receiver is NotificationSender
    // Extension receiver is User
    // Resolves to User.sendNotification() in NotificationSender
    NotificationSender().notify(User())
    // Sending user notification from normal sender
    
    // Dispatch receiver is SpecialNotificationSender
    // Extension receiver is User
    // Resolves to User.sendNotification() in SpecialNotificationSender
    SpecialNotificationSender().notify(User())
    // Sending user notification from special sender 
    
    // Dispatch receiver is SpecialNotificationSender
    // Extension receiver is User NOT Admin
    // The notify() function declares user as type User
    // Statically resolves to User.sendNotification() in SpecialNotificationSender
    SpecialNotificationSender().notify(Admin())
    // Sending user notification from special sender 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-open"}

The dispatch receiver is resolved at runtime using virtual dispatch, which makes the behavior in the `main()` function
easier to follow. What may surprise you is that when you call the `notify()` function on an `Admin` instance, the 
compiler chooses the extension based on the declared type: `user: User`, because it resolves the extension receiver statically.

## Extensions and visibility modifiers

Extensions use the same [visibility modifiers](visibility-modifiers.md) as regular functions declared in the same scope, including extensions
declared as members of other classes.

For example, an extension declared at the top level of a file can access other `private` top-level declarations in the same file:

```kotlin
// File: StringUtils.kt

private fun removeWhitespace(input: String): String {
    return input.replace("\\s".toRegex(), "")
}

fun String.cleaned(): String {
    return removeWhitespace(this)
}

fun main() {
    val rawEmail = "  user @example. com  "
    val cleaned = rawEmail.cleaned()
    println("Raw:     '$rawEmail'")
    // Raw:     '  user @example. com  '
    println("Cleaned: '$cleaned'")
    // Cleaned: 'user@example.com'
    println("Looks like an email: ${cleaned.contains("@") && cleaned.contains(".")}") 
    // Looks like an email: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-top-level"}

And if an extension is declared outside its receiver type, it can't access the receiver's `private` or `protected` members:

```kotlin
class User(private val password: String) {
    fun isLoggedIn(): Boolean = true
    fun passwordLength(): Int = password.length
}

// Extension declared outside the class
fun User.isSecure(): Boolean {
    // Can't access password because it's private:
    // return password.length >= 8

    // Instead, we rely on public members:
    return passwordLength() >= 8 && isLoggedIn()
}

fun main() {
    val user = User("supersecret")
    println("Is user secure: ${user.isSecure()}") 
    // Is user secure: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-outside-receiver"}

If an extension is marked as `internal`, it's only accessible within its [module](visibility-modifiers.md#modules):

```kotlin
// Networking module
// JsonParser.kt
internal fun String.parseJson(): Map<String, Any> {
    return mapOf("fakeKey" to "fakeValue")
}
```

## Scope of extensions

In most cases, you define extensions on the top level, directly under packages:

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

To use an extension outside its declaring package, import it at the call site:

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

For more information, see [Imports](packages.md#imports).
