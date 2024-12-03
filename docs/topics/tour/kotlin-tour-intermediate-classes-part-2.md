[//]: # (title: Intermediate: Objects and special classes)

In this chapter, you'll expand your understanding of classes by exploring object declarations and special classes
with specific purposes. This knowledge will help you efficiently manage behavior across your projects.

## Object declarations

In Kotlin, you can use **object declarations** to declare a class with a single instance. In a sense, you declare the 
class and create the single instance _at the same time_. Object declarations are useful when you want to create a class to
use as a single reference point for your program or to coordinate behavior across a system.

> A class that has only one instance that is easily accessible is called a **singleton**.
>
{style="tip"}

Objects in Kotlin are **lazy**, meaning they are created only when accessed. Kotlin also ensures that all
objects are created in a thread-safe manner so that you don't have to check this manually.

To create an object declaration, use the `object` keyword:

```kotlin
object DoAuth {}
```

Following the name of your `object`, add any properties or member functions within the object body defined by curly braces `{}`.

> Objects can't have constructors, so they don't have headers like classes.
>
{style="note"}

For example, let's say that you wanted to create an object called `DoAuth` that is responsible for authentication:

```kotlin
object DoAuth {
    fun takeParams(username: String, password: String) {
        println("input Auth parameters = $username:$password")
    }
}

fun main(){
    // The object is created when the takeParams() function is called
    DoAuth.takeParams("coding_ninja", "N1njaC0ding!")
    // input Auth parameters = coding_ninja:N1njaC0ding!
}
```

The object has a member function called `takeParams` that accepts `username` and `password` variables as parameters
and returns a string to the console. The `DoAuth` object is only created when the function is called for the first time.

> Objects can inherit from classes and interfaces. For example:
> 
> ```kotlin
> interface Auth {
>     fun takeParams(username: String, password: String)
> }
>
> object DoAuth : Auth {
>     override fun takeParams(username: String, password: String) {
>         println("input Auth parameters = $username:$password")
>     }
> }
> ```
>
{style="note"}

#### Data objects

To make it easier to print the contents of an object declaration, Kotlin has **data** objects. Similar to data classes,
which you learned about in the beginners tour, data objects come automatically with additional member functions: 
`.toString()` and `.equals()`.

> Unlike data classes, data objects do not come automatically with the `.copy()` member function because they only have
> a single instance that can't be copied.
>
{type ="note"}

To create a data object, use the same syntax as for object declarations but prefix it with the `data` keyword:

```kotlin
data object AppConfig {}
```

For example:

```kotlin
data object AppConfig {
    var appName: String = "My Application"
    var version: String = "1.0.0"
}

fun main() {
    println(AppConfig)
    // App config
}
```

For more information about data objects, see [](object-declarations.md#data-objects).

#### Companion objects

In Kotlin, a class can also have an object: a **companion** object. You can only have **one** companion object per class.
A companion object is created only when its class is referenced for the first time.

Any properties or functions declared inside a companion object are shared across all class instances.

To create a companion object within a class, use the same syntax for an object declaration but prefix it with the `companion`
keyword:

```kotlin
companion object Bonger {}
```

> A companion object doesn't have to have a name. If you don't define one, the default is `Companion`.
> 
{style="note"}

To access any properties or functions of the companion object, reference the class name. For example:

```kotlin
class BigBen {
    companion object Bonger {
        fun getBongs(nTimes: Int) {
            repeat(nTimes) { print("BONG") }
            }
        }
    }

fun main() {
    // Companion object is created because the class is referenced for the first time.
    BigBen.getBongs(12)
    // BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG 
}
```

This example creates a class called `BigBen` that contains a companion object called `Bonger`. The companion object
has a member function called `getBongs()` that accepts an integer and prints `"BONG"` to the console the same number of times
as the integer.

In the `main()` function, the `getBongs()` function is called by referring to the class name. The companion object is created
at this point. The `getBongs()` function is called with parameter `12`.

For more information about companion objects, see [](object-declarations.md#companion-objects).

## Object declarations practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-1"}

You run a coffee shop and have a system for tracking customer orders. Consider the code below and complete the declaration
of the second data object so that the following code in the `main()` function runs successfully:

```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object // write your code here

fun main() {
    // Print the contents of each data object
    println("Order One Details: $OrderOne")
    println("Order Two Details: $OrderTwo")

    // Check if the orders are identical
    println("Are the two orders identical? ${OrderOne == OrderTwo}")

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-1"}

|---|---|
```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object OrderTwo: Order {
    override val orderId = "002"
    override val customerName = "Bob"
    override val orderTotal = 12.75
}

fun main() {
    // Print the contents of each data object
    println("Order One Details: $OrderOne")
    println("Order Two Details: $OrderTwo")

    // Check if the orders are identical
    println("Are the two orders identical? ${OrderOne == OrderTwo}")

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-objects-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-2"}

Create an object declaration that inherits from the `Vehicle` interface to create a unique vehicle type: `FlyingSkateboard`.
Implement the `name` property and the `move()` function in your object so that the following code in the `main()` function runs 
successfully:

```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object // write your code here

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-2"}

|---|---|
```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object FlyingSkateboard : Vehicle {
    override val name = "Flying Skateboard"
    override fun move() = "Glides through the air with a hover engine"

   fun fly(): String = "Woooooooo"
}

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-objects-solution-2"}

### Exercise 3 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-3"}

You have an app where you want to record temperatures. The class itself stores the information in Celsius, but 
you want to provide an easy way to create an instance in Fahrenheit as well. Complete the data class so that
the following code in the `main()` function runs successfully:

<deflist collapsible="true">
    <def title="Hint">
        Use a companion object.
    </def>
</deflist>

|---|---|
```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    // write your code here
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${temp.celsius}°C is $fahrenheit °F")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-3"}

|---|---|
```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    companion object {
        fun fromFahrenheit(fahrenheit: Double): Temperature = Temperature((fahrenheit - 32) * 5 / 9)
    }
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${temp.celsius}°C is $fahrenheit °F")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-objects-solution-3"}

## Special classes

In addition to normal classes and data classes, Kotlin has special types of classes designed for various purposes, such 
as restricting specific behavior or reducing the performance impact of creating small objects.

### Sealed classes

There may be times when you want to restrict inheritance. You can do this with sealed classes. Sealed classes are a special
type of [abstract class](kotlin-tour-intermediate-classes-part-1.md#abstract-classes). Once you declare that a class is sealed, you can only create child classes 
from it within the same package. It's not possible to inherit from the sealed class outside of this scope.

> A package is a collection of code with related classes and functions, typically within a directory. To learn more about
> packages in Kotlin, see [Packages and imports](packages.md).
> 
{style="tip"}

To create a sealed class, use the `sealed` keyword:

```kotlin
sealed class Mammal
```

Sealed classes are particularly useful when combined with a `when` expression. By using a `when` expression, you can
define the behavior for all possible child classes. For example:

```kotlin
sealed class Mammal(val name: String)

class Cat(val catName: String) : Mammal(catName)
class Human(val humanName: String, val job: String) : Mammal(humanName)

fun greetMammal(mammal: Mammal): String {
    when (mammal) {
        is Human -> return "Hello ${mammal.name}; You're working as a ${mammal.job}"
        is Cat -> return "Hello ${mammal.name}"   
    }
}

fun main() {
    println(greetMammal(Cat("Snowy")))
    // Hello Snowy
}
```

In the example:

* There is a sealed class called `Mammal` that has the `name` parameter in the constructor.
* The `Cat` class inherits from the `Mammal` sealed class and uses the `name` parameter from the `Mammal` class as the
`catName` parameter in its own constructor.
* The `Human` class inherits from the `Mammal` sealed class and uses the `name` parameter from the `Mammal` class as the
`humanName` parameter in its own constructor. It also has the `job` parameter in its constructor.
* The `greetMammal()` function accepts an argument of `Mammal` type and returns a string.
* Within the `greetMammal()` function body, there's a `when` expression that uses the [`is` operator](typecasts.md#is-and-is-operators) to check the type of `mammal` and decide which action to perform.
* The `main()` function calls the `greetMammal()` function with an instance of the `Cat` class and `name` parameter called `Snowy`.

For more information about sealed classes and their recommended use cases, see [Sealed classes and interfaces](sealed-classes.md).

### Enum classes

Enum classes are useful when you want to represent a finite set of distinct values in a class. An enum class contains enum
constants, which are themselves instances of the enum class.

To create an enum class, use the `enum` keyword:

```kotlin
enum class State
```

Let's say that you want to create an enum class that contains the different states of a process. Each enum constant must
be separated by a comma `,`:

```kotlin
enum class State {
    IDLE, RUNNING, FINISHED
}
```

The `State` enum class has enum constants: `IDLE`, `RUNNING`, and `FINISHED`. To access an enum constant, use the
class name followed by a `.` and the name of the enum constant:

```kotlin
val state = State.RUNNING
```

You can use this enum class with a `when` expression to define the action to take depending on the value of the enum constant:

```kotlin
enum class State {
    IDLE, RUNNING, FINISHED
}

fun main() {
    val state = State.RUNNING
    val message = when (state) {
        State.IDLE -> "It's idle"
        State.RUNNING -> "It's running"
        State.FINISHED -> "It's finished"
    }
    println(message)
    // It's running
}
```

Enum classes can have properties and member functions just like normal classes. 

For example, let's say you're working with HTML and you want to create an enum class containing some colors. 
You want each color to have a property, let's call it `rgb`, that contains their RGB value as a hexadecimal. 
When creating the enum constants, you must initialize it with this property:

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF),
    YELLOW(0xFFFF00)
}
```

> Kotlin stores hexadecimals as integers, so the `rgb` property has the `Int` type, not the `String` type.
>
{style="note"}

To add a member function to this class, separate it from the enum constants with a semicolon `;`:

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF),
    YELLOW(0xFFFF00);

    fun containsRed() = (this.rgb and 0xFF0000 != 0)
}

fun main() {
    val red = Color.RED
    
    // Calls containsRed() function on enum constant
    println(red.containsRed())
    // true

    // Calls containsRed() function on enum constants via class names
    println(Color.BLUE.containsRed())
    // false
    println(Color.YELLOW.containsRed())
    // true
}
```

In this example, the `containsRed()` member function accesses the value of the enum constant's `rgb` property using the
`this` keyword and checks if the hexadecimal value contains `FF` as its first bits to return a boolean value.

For more information, see [Enum classes](enum-classes.md).

### Inline value classes

Sometimes in your code, you may want to create small objects from classes and use them only briefly. This approach can
have a performance impact. Inline value classes are a special type of class that avoids this performance impact. However,
they can only contain values.

To create an inline value class, use the `value` keyword and the `@JvmInline` annotation:

```kotlin
@JvmInline
value class Email
```

> The `@JvmInline` annotation instructs Kotlin to optimize the code when it is compiled. To learn more,
> see [Annotations](annotations.md).
> 
{style="note"}

An inline value class **must** have a single property initialized in the class header.

Let's say that you want to create a class that collects an email address:

```kotlin
// The value property is initialized in the class header.
@JvmInline
value class Email(val value: String)

fun sendEmail(email: Email) {
    println("Sending email to ${email.value}")
}

fun main() {
    val myEmail = Email("example@example.com")
    sendEmail(myEmail)
    // Sending email to example@example.com
}
```

In the example:

* `Email` is an inline value class that has one property in the class header: `value`.
* The `sendEmail()` function accepts objects with type `Email` and prints a string to the standard output.
* The `main()` function:
    * Creates an instance of the `Email` class called `email`.
    * Calls the `sendEmail()` function on the `email` object.

By using an inline value class, you make the class inlined and can use it directly in your code without creating an object.
This can significantly reduce memory footprint and improve your code's runtime performance.

For more information about inline value classes, see [Inline value classes](inline-classes.md).

## Special classes practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-1"}

You manage a delivery service and need a way to track the status of packages. Create a sealed class called `DeliveryStatus`,
containing data classes to represent the following statuses: `Pending`, `InTransit`, `Delivered`, `Canceled`. Complete
the `DeliveryStatus` class declaration so that the code in the `main()` function runs successfully:

```kotlin
// Write your code here

fun printDeliveryStatus(status: DeliveryStatus) {
    when (status) {
        is DeliveryStatus.Pending -> {
            println("The package is pending pickup from ${status.sender}.")
        }
        is DeliveryStatus.InTransit -> {
            println("The package is in transit and expected to arrive by ${status.estimatedDeliveryDate}.")
        }
        is DeliveryStatus.Delivered -> {
            println("The package was delivered to ${status.recipient} on ${status.deliveryDate}.")
        }
        is DeliveryStatus.Canceled -> {
            println("The delivery was canceled due to: ${status.reason}.")
        }
    }
}

fun main() {
    val status1: DeliveryStatus = DeliveryStatus.Pending("Alice")
    val status2: DeliveryStatus = DeliveryStatus.InTransit("2024-11-20")
    val status3: DeliveryStatus = DeliveryStatus.Delivered("2024-11-18", "Bob")
    val status4: DeliveryStatus = DeliveryStatus.Canceled("Address not found")

    printDeliveryStatus(status1)
    printDeliveryStatus(status2)
    printDeliveryStatus(status3)
    printDeliveryStatus(status4)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-special-classes-exercise-1"}

|---|---|
```kotlin
sealed class DeliveryStatus {
    data class Pending(val sender: String) : DeliveryStatus()
    data class InTransit(val estimatedDeliveryDate: String) : DeliveryStatus()
    data class Delivered(val deliveryDate: String, val recipient: String) : DeliveryStatus()
    data class Canceled(val reason: String) : DeliveryStatus()
}

fun printDeliveryStatus(status: DeliveryStatus) {
    when (status) {
        is DeliveryStatus.Pending -> {
            println("The package is pending pickup from ${status.sender}.")
        }
        is DeliveryStatus.InTransit -> {
            println("The package is in transit and expected to arrive by ${status.estimatedDeliveryDate}.")
        }
        is DeliveryStatus.Delivered -> {
            println("The package was delivered to ${status.recipient} on ${status.deliveryDate}.")
        }
        is DeliveryStatus.Canceled -> {
            println("The delivery was canceled due to: ${status.reason}.")
        }
    }
}

fun main() {
    val status1: DeliveryStatus = DeliveryStatus.Pending("Alice")
    val status2: DeliveryStatus = DeliveryStatus.InTransit("2024-11-20")
    val status3: DeliveryStatus = DeliveryStatus.Delivered("2024-11-18", "Bob")
    val status4: DeliveryStatus = DeliveryStatus.Canceled("Address not found")

    printDeliveryStatus(status1)
    printDeliveryStatus(status2)
    printDeliveryStatus(status3)
    printDeliveryStatus(status4)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-special-classes-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-2"}

In your program, you want to be able to handle different statuses and types of errors. You have a sealed class to capture
the different statuses which are declared in data classes or objects. Complete the code below by creating an enum class 
called `Problem` that represents the different problem types: `NETWORK`, `TIMEOUT`, and `UNKNOWN`.

```kotlin
sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) {
    // Write your code here
}
    data class OK(val data: List<String>)
}

fun handleStatus(status: Status) {
    when (status) {
        is Status.Loading -> println("Loading...")
        is Status.OK -> println("Data received: ${status.data}")
        is Status.Error -> when (status.problem) {
            Status.Error.Problem.NETWORK -> println("Network issue")
            Status.Error.Problem.TIMEOUT -> println("Request timed out")
            Status.Error.Problem.UNKNOWN -> println("Unknown error occurred")
        }
    }
}

fun main() {
    val status1: Status = Status.Error(Status.Error.Problem.NETWORK)
    val status2: Status = Status.OK(listOf("Data1", "Data2"))

    handleStatus(status1)
    handleStatus(status2)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-special-classes-exercise-2"}

|---|---|
```kotlin
sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) {
           enum class Problem {
            NETWORK,
            TIMEOUT,
            UNKNOWN
        }
}
    data class OK(val data: List<String>)
}

fun handleStatus(status: Status) {
    when (status) {
        is Status.Loading -> println("Loading...")
        is Status.OK -> println("Data received: ${status.data}")
        is Status.Error -> when (status.problem) {
            Status.Error.Problem.NETWORK -> println("Network issue")
            Status.Error.Problem.TIMEOUT -> println("Request timed out")
            Status.Error.Problem.UNKNOWN -> println("Unknown error occurred")
        }
    }
}

fun main() {
    val status1: Status = Status.Error(Status.Error.Problem.NETWORK)
    val status2: Status = Status.OK(listOf("Data1", "Data2"))

    handleStatus(status1)
    handleStatus(status2)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-special-classes-solution-2"}

## Next step

