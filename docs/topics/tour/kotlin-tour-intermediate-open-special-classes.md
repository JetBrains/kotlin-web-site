[//]: # (title: Intermediate: Open and special classes)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">Extension functions</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">Scope functions</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">Lambda expressions with receiver</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">Classes and interfaces</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">Objects</a><br />
        <img src="icon-6.svg" width="20" alt="Fourth step" /> <strong>Open and special classes</strong><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">Properties</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null safety</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">Libraries and APIs</a></p>
</tldr>

In this chapter, you'll learn about open classes, how they work with interfaces, and other special
types of classes available in Kotlin.

## Open classes

If you can't use interfaces or abstract classes, you can explicitly make a class inheritable by declaring it as **open**.
To do this, use the `open` keyword before your class declaration:

```kotlin
open class Vehicle(val make: String, val model: String)
```

To create a class that inherits from another, add a colon after your class header followed by a call to the constructor
of the parent class that you want to inherit from. In this example, the `Car` class inherits from the `Vehicle` class:

```kotlin
open class Vehicle(val make: String, val model: String)

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model)

fun main() {
    // Creates an instance of the Car class
    val car = Car("Toyota", "Corolla", 4)

    // Prints the details of the car
    println("Car Info: Make - ${car.make}, Model - ${car.model}, Number of doors - ${car.numberOfDoors}")
    // Car Info: Make - Toyota, Model - Corolla, Number of doors - 4
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-open-class"}

Just like when creating a normal class instance, if your class inherits from a parent class, then it must initialize
all the parameters declared in the parent class header. So in the example, the `car` instance of the `Car` class initializes
the parent class parameters: `make` and `model`.

### Overriding inherited behavior

If you want to inherit from a class but change some of the behavior, you can override the inherited behavior.

By default, it's not possible to override a member function or property of a parent class. Just like with abstract classes,
you need to add special keywords.

#### Member functions

To allow a function in the parent class to be overridden, use the `open` keyword before its declaration in the parent class:

```kotlin
open fun displayInfo() {}
```
{validate="false"}

To override an inherited member function, use the `override` keyword before the function declaration in the child class:

```kotlin
override fun displayInfo() {}
```
{validate="false"}

For example:

```kotlin
open class Vehicle(val make: String, val model: String) {
    open fun displayInfo() {
        println("Vehicle Info: Make - $make, Model - $model")
    }
}

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model) {
    override fun displayInfo() {
        println("Car Info: Make - $make, Model - $model, Number of Doors - $numberOfDoors")
    }
}

fun main() {
    val car1 = Car("Toyota", "Corolla", 4)
    val car2 = Car("Honda", "Civic", 2)

    // Uses the overridden displayInfo() function
    car1.displayInfo()
    // Car Info: Make - Toyota, Model - Corolla, Number of Doors - 4
    car2.displayInfo()
    // Car Info: Make - Honda, Model - Civic, Number of Doors - 2
}
```
{kotlin-runnable="true" id="kotlin-tour-class-override-function"}

This example:

* Creates two instances of the `Car` class that inherit from the `Vehicle` class: `car1` and `car2`.
* Overrides the `displayInfo()` function in the `Car` class to also print the number of doors.
* Calls the overridden `displayInfo()` function on `car1` and `car2` instances.

#### Properties

In Kotlin, it's not common practice to make a property inheritable by using the `open` keyword and overriding it later. Most of the
time, you use an abstract class or an interface where properties are inheritable by default.

Properties inside open classes are accessible by their child class. In general, it's better to access them directly rather
than override them with a new property.

For example, let's say that you have a property called `transmissionType` that you want to override later. The syntax for
overriding properties is exactly the same as for overriding member functions. You can do this:

```kotlin
open class Vehicle(val make: String, val model: String) {
    open val transmissionType: String = "Manual"
}

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model) {
    override val transmissionType: String = "Automatic"
}
```

However, this is not good practice. Instead, you can add the property to the constructor of your inheritable class and 
declare its value when you create the `Car` child class:

```kotlin
open class Vehicle(val make: String, val model: String, val transmissionType: String = "Manual")

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model, "Automatic")
```

Accessing properties directly, instead of overriding them, leads to simpler and more readable code. By declaring properties
once in the parent class and passing their values through the constructor, you eliminate the need for unnecessary overrides
in child classes.

For more information about class inheritance and overriding class behavior, see [Inheritance](inheritance.md).

### Open classes and interfaces

You can create a class that inherits a class **and** implements multiple interfaces. In this case, you must declare
the parent class first, after the colon, before listing the interfaces:

```kotlin
// Define interfaces
interface EcoFriendly {
    val emissionLevel: String
}

interface ElectricVehicle {
    val batteryCapacity: Double
}

// Parent class
open class Vehicle(val make: String, val model: String)

// Child class
open class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model)

// New class that inherits from Car and implements two interfaces
class ElectricCar(
    make: String,
    model: String,
    numberOfDoors: Int,
    val capacity: Double,
    val emission: String
) : Car(make, model, numberOfDoors), EcoFriendly, ElectricVehicle {
    override val batteryCapacity: Double = capacity
    override val emissionLevel: String = emission
}
```

## Special classes

In addition to abstract, open, and data classes, Kotlin has special types of classes designed for various purposes, such 
as restricting specific behavior or reducing the performance impact of creating small objects.

### Sealed classes

There may be times when you want to restrict inheritance. You can do this with sealed classes. Sealed classes are a special
type of [abstract class](kotlin-tour-intermediate-classes-interfaces.md#abstract-classes). Once you declare that a class is sealed, you can only create child classes 
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
{kotlin-runnable="true" id="kotlin-tour-sealed-classes"}

In the example:

* There is a sealed class called `Mammal` that has the `name` parameter in the constructor.
* The `Cat` class inherits from the `Mammal` sealed class and uses the `name` parameter from the `Mammal` class as the
`catName` parameter in its own constructor.
* The `Human` class inherits from the `Mammal` sealed class and uses the `name` parameter from the `Mammal` class as the
`humanName` parameter in its own constructor. It also has the `job` parameter in its constructor.
* The `greetMammal()` function accepts an argument of `Mammal` type and returns a string.
* Within the `greetMammal()` function body, there's a `when` expression that uses the [`is` operator](typecasts.md#is-and-is-operators) to check the type of `mammal` and decide which action to perform.
* The `main()` function calls the `greetMammal()` function with an instance of the `Cat` class and `name` parameter called `Snowy`.

> This tour discusses the `is` operator in more detail in the [Null safety](kotlin-tour-intermediate-null-safety.md) chapter.
> 
{style ="tip"}

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
{kotlin-runnable="true" id="kotlin-tour-enum-classes"}

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
{kotlin-runnable="true" id="kotlin-tour-interface-enum-classes-members"}

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
{style="tip"}

An inline value class **must** have a single property initialized in the class header.

Let's say that you want to create a class that collects an email address:

```kotlin
// The address property is initialized in the class header.
@JvmInline
value class Email(val address: String)

fun sendEmail(email: Email) {
    println("Sending email to ${email.address}")
}

fun main() {
    val myEmail = Email("example@example.com")
    sendEmail(myEmail)
    // Sending email to example@example.com
}
```
{kotlin-runnable="true" id="kotlin-tour-inline-value-class"}

In the example:

* `Email` is an inline value class that has one property in the class header: `address`.
* The `sendEmail()` function accepts objects with type `Email` and prints a string to the standard output.
* The `main()` function:
    * Creates an instance of the `Email` class called `email`.
    * Calls the `sendEmail()` function on the `email` object.

By using an inline value class, you make the class inlined and can use it directly in your code without creating an object.
This can significantly reduce memory footprint and improve your code's runtime performance.

For more information about inline value classes, see [Inline value classes](inline-classes.md).

## Practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-1"}

You manage a delivery service and need a way to track the status of packages. Create a sealed class called `DeliveryStatus`,
containing data classes to represent the following statuses: `Pending`, `InTransit`, `Delivered`, `Canceled`. Complete
the `DeliveryStatus` class declaration so that the code in the `main()` function runs successfully:

|---|---|

```kotlin
sealed class // Write your code here

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
    // The package is pending pickup from Alice.
    printDeliveryStatus(status2)
    // The package is in transit and expected to arrive by 2024-11-20.
    printDeliveryStatus(status3)
    // The package was delivered to Bob on 2024-11-18.
    printDeliveryStatus(status4)
    // The delivery was canceled due to: Address not found.
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
    // The package is pending pickup from Alice.
    printDeliveryStatus(status2)
    // The package is in transit and expected to arrive by 2024-11-20.
    printDeliveryStatus(status3)
    // The package was delivered to Bob on 2024-11-18.
    printDeliveryStatus(status4)
    // The delivery was canceled due to: Address not found.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-special-classes-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-2"}

In your program, you want to be able to handle different statuses and types of errors. You have a sealed class to capture
the different statuses which are declared in data classes or objects. Complete the code below by creating an enum class 
called `Problem` that represents the different problem types: `NETWORK`, `TIMEOUT`, and `UNKNOWN`.

|---|---|

```kotlin
sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) : Status() {
        // Write your code here
    }

    data class OK(val data: List<String>) : Status()
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
    // Network issue
    handleStatus(status2)
    // Data received: [Data1, Data2]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-special-classes-exercise-2"}

|---|---|
```kotlin
sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) : Status() {
        enum class Problem {
            NETWORK,
            TIMEOUT,
            UNKNOWN
        }
    }

    data class OK(val data: List<String>) : Status()
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
    // Network issue
    handleStatus(status2)
    // Data received: [Data1, Data2]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-special-classes-solution-2"}

## Next step

[Intermediate: Properties](kotlin-tour-intermediate-properties.md)
