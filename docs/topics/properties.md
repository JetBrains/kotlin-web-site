[//]: # (title: Properties)

In Kotlin, properties let you store and manage data without writing functions to access or change the data.
You can use properties in [classes](classes.md), [interfaces](interfaces.md), [objects](object-declarations.md), [companion objects](object-declarations.md#companion-objects),
and even outside these structures as top-level properties.

Every property has a name, a type, and an automatically generated `get()` function called a getter. You can use the getter
to read the property's value. If the property is mutable, it also has a `set()` function called a setter, which allows 
you to change the property's value.

> Getters and setters are called _accessors_.
> 
{style="tip"}

## Declaring properties

Properties can be mutable (`var`) or read-only (`val`).
You can declare them as a top-level property in a `.kt` file. Think of a top-level property as a global variable
that belongs to a package:

```kotlin
// File: Constants.kt
package my.app

val pi = 3.14159
var counter = 0
```

You can also declare properties inside a class, interface, or object:

```kotlin
// Class with properties
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

// Interface with a property
interface ContactInfo {
    val email: String
}

// Object with properties
object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

// Class implementing the interface
class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}
```

To use a property, refer to it by its name:

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

interface ContactInfo {
    val email: String
}

object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}

//sampleStart
fun copyAddress(address: Address): Address {
    val result = Address()
    // Accesses properties in the result instance
    result.name = address.name
    result.street = address.street
    result.city = address.city
    return result
}

fun main() {
    val sherlockAddress = Address()
    val copy = copyAddress(sherlockAddress)
    // Accesses properties in the copy instance
    println("Copied address: ${copy.name}, ${copy.street}, ${copy.city}")
    // Copied address: Holmes, Sherlock, Baker, London

    // Accesses properties in the Company object
    println("Company: ${Company.name} in ${Company.country}")
    // Company: Detective Inc. in UK
    
    val contact = PersonContact()
    // Access properties in the contact instance
    println("Email: ${contact.email}")
    // Email: sherlock@email.com
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-access-properties"}

In Kotlin, we recommend initializing properties when you declare them to keep your code safe and easy to read. However, 
you can [initialize them later](#late-initialized-properties-and-variables) in special cases.

Declaring the property type is optional if the compiler can infer it from the initializer or the getter's return type:

```kotlin
var initialized = 1 // The inferred type is Int
var allByDefault    // ERROR: Property must be initialized.
```
{validate="false"}

## Custom getters and setters

By default, Kotlin automatically generates getters and setters. You can define your own custom accessors when
you need extra logic, such as validation, formatting, or calculations based on other properties.

A custom getter runs every time the property is accessed:

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-custom-getter"}

You can omit the type if the compiler can infer it from the getter:

```kotlin
val area get() = this.width * this.height
```

A custom setter runs every time you assign a value to the property, except during initialization.
By convention, the name of the setter parameter is `value`, but you can choose a different name:

```kotlin
class Point(var x: Int, var y: Int) {
    var coordinates: String
        get() = "$x,$y"
        set(value) {
            val parts = value.split(",")
            x = parts[0].toInt()
            y = parts[1].toInt()
        }
}

fun main() {
    val location = Point(1, 2)
    println(location.coordinates) 
    // 1,2

    location.coordinates = "10,20"
    println("${location.x}, ${location.y}") 
    // 10, 20
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-custom-setter"}

### Changing visibility or adding annotations

In Kotlin, you can change accessor visibility or add [annotations](annotations.md) without replacing the default implementation. 
You don't have to make these changes within a body `{}`.

To change the visibility of an accessor, use the modifier before the `get` or `set` keyword:

```kotlin
class BankAccount(initialBalance: Int) {
    var balance: Int = initialBalance
        // Only the class can modify the balance
        private set 

    fun deposit(amount: Int) {
        if (amount > 0) balance += amount
    }

    fun withdraw(amount: Int) {
        if (amount > 0 && amount <= balance) balance -= amount
    }
}

fun main() {
    val account = BankAccount(100)
    println("Initial balance: ${account.balance}") 
    // 100

    account.deposit(50)
    println("After deposit: ${account.balance}") 
    // 150

    account.withdraw(70)
    println("After withdrawal: ${account.balance}") 
    // 80

    // account.balance = 1000  
    // Error: cannot assign because setter is private
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-private-setter"}

To annotate an accessor, use the annotation before the `get` or `set` keyword:

```kotlin
// Defines an annotation that can be applied to a getter
@Target(AnnotationTarget.PROPERTY_GETTER)
annotation class Inject

class Service {
    var dependency: String = "Default Service"
        // Annotates the getter
        @Inject get 
}

fun main() {
    val service = Service()
    println(service.dependency)
    // Default service
    println(service::dependency.getter.annotations)
    // [@Inject()]
    println(service::dependency.setter.annotations)
    // []
}
```
{validate="false"}

This example uses [reflection](reflection.md) to show which annotations are present on the getter and setter.

## Backing fields

The compiler automatically generates backing fields for properties when a value needs to be stored in memory.

For example, the compiler creates a backing field when you use the default `get()` and `set()` functions because they
read and write the stored value:

```kotlin
var count = 0
```

You can access backing fields by using the `field` keyword in a [custom `get()` or `set()` function](#custom-getters-and-setters).
For example, you can add extra logic to a getter or setter, or trigger an additional action when a property changes.

In this example, the `score` property uses the backing field inside the `set()` function so that updating the value also triggers a log event:

```kotlin
class Scoreboard {
    var score: Int = 0
        set(value) {
            field = value
            // Adds logging when updating the value
            println("Score updated to $field")
        }
}

fun main() {
    val board = Scoreboard()
    board.score = 10  
    // Score updated to 10
    board.score = 20  
    // Score updated to 20
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-field"}

Backing fields aren't created by default for all properties because they might not need them. For example, the `isEmpty`
property doesn't have a backing field because the value is calculated from the `size` property each time you access it:

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### Explicit backing fields

Sometimes you might need more flexibility. For example, if you have an API where you want to be able to modify the property
internally but not externally. In such cases, you can use an _explicit backing field_.

In the following example, the `ShoppingCart` class has an `items` property that represents everything in the shopping cart.
The class exposes the `items` property as a read-only list of strings, but internally it stores the data in a mutable list
with an explicit backing field:

```kotlin
class ShoppingCart {
    // Public read-only view with explicit backing field
    val items: List<String>
        field = mutableListOf()
    
    fun addItem(item: String) {
        items.add(item)
    }

    fun removeItem(item: String) {
        items.remove(item)
    }
}

fun main() {
    val cart = ShoppingCart()
    cart.addItem("Apple")
    cart.addItem("Banana")

    println(cart.items) 
    // [Apple, Banana]
    
    cart.removeItem("Apple")
    println(cart.items) 
    // [Banana]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4" id="kotlin-explicit-backing-field"}

In this example, the compiler infers the type of the backing field from the `mutableListOf()` call: `MutableList<String>`.
You can also declare the type of the backing field explicitly:

```kotlin
val items: List<String>
    // Explicit backing field with explicit type
    field: MutableList<String> = mutableListOf()
```
{validate="false"}

In the example of the `ShoppingCart` class, the compiler smart casts the `items` property to the `MutableList<String>` type, so the
class can add and remove items from the cart through the `add()` and `remove()` functions. Outside the class, the compiler
uses the public property type `List<String>`, so API users can only read what's in the `items` list.

#### Limitations

To use explicit backing fields, their properties and the backing fields themselves must follow certain rules. Properties
can have explicit backing fields only if they:

* Don't have a custom getter.
* Are read-only (`val`).
* Aren't `open`.
* Aren't a [delegated property](delegated-properties.md).
* Aren't [compile-time constants](#compile-time-constants).

In addition, the backing field type must be a subtype of the property's type and have [`private` visibility](visibility-modifiers.md).

You can work around these restrictions by using backing properties instead.

### Backing properties

If explicit backing fields don't fit your use case, you can try using a coding pattern called a _backing property_.

For example, if your property needs a custom getter:

```kotlin
class UserDirectory {
    private val _users = mutableListOf(
        "sarah",
        "mike",
        "emma"
    )

    val users: List<String>
        get() = _users.sorted()

    fun addUser(username: String) {
        _users.add(username)
    }
}

fun main() {
    val directory = UserDirectory()

    directory.addUser("alex")
    println(directory.users)
    // [alex, emma, mike, sarah]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-property-custom-getter"}

> Use a leading underscore when naming backing properties to follow Kotlin [coding conventions](coding-conventions.md#names-for-backing-properties).
>
{style="tip"}

In this example, the `UserDirectory` class has a read-only `users` property that lists every user in the directory. The 
`_users` variable is the private backing property containing the real list. The getter for the public `users` property
sorts the entries before returning them.

## Compile-time constants

If the value of a read-only property is known at compile time, mark it as a _compile-time constant_ using the `const` modifier.
Compile-time constants are inlined at compile time, so each reference is replaced with its actual value. They are accessed
more efficiently because no getter is called:

```kotlin
// File: AppConfig.kt
package com.example

// Compile-time constant
const val MAX_LOGIN_ATTEMPTS = 3
```

Compile-time constants must meet the following requirements:

* They must be either a top-level property, or a member of an [`object` declaration](object-declarations.md#object-declarations-overview) or a [companion object](object-declarations.md#companion-objects).
* They must be initialized with a value of type `String` or a [primitive type](types-overview.md).
* They can't have a custom getter.

Compile-time constants still have a backing field, so you can interact with them using [reflection](reflection.md).

You can also use these properties in annotations:

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun processLegacyOrders() { ... }
```

## Late-initialized properties and variables

Normally, you must initialize properties in the constructor.
However, this isn't always convenient. For example, you might initialize properties through dependency
injection or inside the setup method of a unit test.

To handle these situations, mark the property with the `lateinit` modifier:

```kotlin
public class OrderServiceTest {
    lateinit var orderService: OrderService

    @SetUp fun setup() {
        orderService = OrderService()
    }

    @Test fun processesOrderSuccessfully() {
        // Calls orderService directly without checking for null
        // or initialization
        orderService.processOrder()  
    }
}
```

You can use the `lateinit` modifier on `var` properties declared as:

* Top-level properties.
* Local variables.
* Properties inside the body of a class.

For class properties:

* You can't declare them in the primary constructor.
* They must not have a custom getter or setter.

In all cases, the property or variable must be non-nullable and must not be a [primitive type](types-overview.md).

If you access a `lateinit` property before initializing it, Kotlin throws a specific exception that identifies the uninitialized
property being accessed:

```kotlin
class ReportGenerator {
    lateinit var report: String

    fun printReport() {
        // Throws an exception as it's accessed before
        // initialization
        println(report)
    }
}

fun main() {
    val generator = ReportGenerator()
    generator.printReport()
    // Exception in thread "main" kotlin.UninitializedPropertyAccessException: lateinit property report has not been initialized
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property" validate="false"}

To check whether a `lateinit var` has already been initialized, use the [`isInitialized`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/is-initialized.html)
property on the [reference to that property](reflection.md#property-references):

```kotlin
class WeatherStation {
    lateinit var latestReading: String

    fun printReading() {
        // Checks whether the property is initialized
        if (this::latestReading.isInitialized) {
            println("Latest reading: $latestReading")
        } else {
            println("No reading available")
        }
    }
}

fun main() {
    val station = WeatherStation()

    station.printReading()
    // No reading available
    station.latestReading = "22°C, sunny"
    station.printReading()
    // Latest reading: 22°C, sunny
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property-check-initialization"}

You can only use `isInitialized` on a property if you can already access that property in your code. The property must be declared
in the same class, in an outer class, or as a top-level property in the same file.

## Overriding properties

See [Overriding properties](inheritance.md#overriding-properties).

## Delegated properties

To reuse logic and reduce code duplication, you can delegate the responsibility of getting and setting a property to a
separate object.

Delegating accessor behavior keeps the property's accessor logic centralized, making it easier to reuse. This approach
is useful when implementing behaviors like:

* Computing a value lazily.
* Reading from a map by a given key.
* Accessing a database.
* Notifying a listener when a property is accessed.

You can implement these common behaviors in libraries yourself or use existing delegates provided by external libraries.
For more information, see [delegated properties](delegated-properties.md).