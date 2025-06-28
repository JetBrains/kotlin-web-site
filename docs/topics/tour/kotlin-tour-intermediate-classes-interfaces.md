[//]: # (title: Intermediate: Classes and interfaces)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">Extension functions</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">Scope functions</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">Lambda expressions with receiver</a><br /> 
        <img src="icon-4.svg" width="20" alt="Fourth step" /> <strong>Classes and interfaces</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">Objects</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">Open and special classes</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">Properties</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null safety</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">Libraries and APIs</a></p>
</tldr>

In the beginner tour, you learned how to use classes and data classes to store data and maintain a collection of characteristics
that can be shared in your code. Eventually, you will want to create a hierarchy to efficiently share code within your 
projects. This chapter explains the options Kotlin provides for sharing code and how they can make your code safer and easier to maintain.

## Class inheritance

In a previous chapter, we covered how you can use extension functions to extend classes without modifying the original source code.
But what if you are working on something complex where sharing code **between** classes would be useful? In such cases, 
you can use class inheritance.

By default, classes in Kotlin can't be inherited. Kotlin is designed this way to prevent unintended inheritance and make
your classes easier to maintain.

Kotlin classes only support **single inheritance**, meaning it is only possible to inherit from **one class at a time**.
This class is called the **parent**.

The parent of a class inherits from another class (the grandparent), forming a hierarchy. At the top of Kotlin's class
hierarchy is the common parent class: `Any`. All classes ultimately inherit from the `Any` class:

![An example of the class hierarchy with Any type](any-type-class.png){width="200"}

The `Any` class provides the `toString()` function as a member function automatically. Therefore, you can
use this inherited function in any of your classes. For example:

```kotlin
class Car(val make: String, val model: String, val numberOfDoors: Int)

fun main() {
    //sampleStart
    val car1 = Car("Toyota", "Corolla", 4)

    // Uses the .toString() function via string templates to print class properties
    println("Car1: make=${car1.make}, model=${car1.model}, numberOfDoors=${car1.numberOfDoors}")
    // Car1: make=Toyota, model=Corolla, numberOfDoors=4
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-any-class"}

If you want to use inheritance to share some code between classes, first consider using abstract classes.

### Abstract classes

Abstract classes can be inherited by default. The purpose of abstract classes is to provide members that other classes 
inherit or implement. As a result, they have a constructor, but you can't create instances from them. Within the child 
class, you define the behavior of the parent's properties and functions with the `override` keyword. In this way, 
you can say that the child class "overrides" the members of the parent class.

> When you define the behavior of an inherited function or property, we call that an **implementation**.
> 
{style="tip"}

Abstract classes can contain both functions and properties **with** implementation as well as functions and properties 
**without** implementation, known as abstract functions and properties.

To create an abstract class, use the `abstract` keyword:

```kotlin
abstract class Animal
```

To declare a function or a property **without** an implementation, you also use the `abstract` keyword:

```kotlin
abstract fun makeSound()
abstract val sound: String
```

For example, let's say that you want to create an abstract class called `Product` that you can create child classes from
to define different product categories:

```kotlin
abstract class Product(val name: String, var price: Double) {
    // Abstract property for the product category
    abstract val category: String

    // A function that can be shared by all products
    fun productInfo(): String {
        return "Product: $name, Category: $category, Price: $price"
    }
}
```

In the abstract class:

* The constructor has two parameters for the product's `name` and `price`.
* There is an abstract property that contains the product category as a string.
* There is a function that prints information about the product.

Let's create a child class for electronics. Before you define an implementation for the `category` property in the child class,
you must use the `override` keyword:

```kotlin
class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}
```

The `Electronic` class:

* Inherits from the `Product` abstract class.
* Has an additional parameter in the constructor: `warranty`, which is specific to electronics.
* Overrides the `category` property to contain the string `"Electronic"`.

Now, you can use these classes like this:

```kotlin
abstract class Product(val name: String, var price: Double) {
    // Abstract property for the product category
    abstract val category: String

    // A function that can be shared by all products
    fun productInfo(): String {
        return "Product: $name, Category: $category, Price: $price"
    }
}

class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}

//sampleStart
fun main() {
    // Creates an instance of the Electronic class
    val laptop = Electronic(name = "Laptop", price = 1000.0, warranty = 2)

    println(laptop.productInfo())
    // Product: Laptop, Category: Electronic, Price: 1000.0
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-abstract-class"}

Although abstract classes are great for sharing code in this way, they are restricted because classes in Kotlin
only support single inheritance. If you need to inherit from multiple sources, consider using interfaces.

## Interfaces

Interfaces are similar to classes, but they have some differences:

* You can't create an instance of an interface. They don't have a constructor or header.
* Their functions and properties are implicitly inheritable by default. In Kotlin, we say that they are "open".
* You don't need to mark their functions as `abstract` if you don't give them an implementation.

Similar to abstract classes, you use interfaces to define a set of functions and properties that classes can inherit and
implement later. This approach helps you focus on the abstraction described by the interface, rather than the specific
implementation details. Using interfaces makes your code:

* More modular, as it isolates different parts, allowing them to evolve independently.
* Easier to understand by grouping related functions into a cohesive set.
* Easier to test, as you can quickly swap an implementation with a mock for testing.

To declare an interface, use the `interface` keyword:

```kotlin
interface PaymentMethod
```

### Interface implementation

Interfaces support multiple inheritance so a class can implement multiple interfaces at once. First, let's consider
the scenario where a class implements **one** interface.

To create a class that implements an interface, add a colon after your class header, followed by the interface name
that you want to implement. You don't use parentheses `()` after the interface name because interfaces don't have a 
constructor:

```kotlin
class CreditCardPayment : PaymentMethod
```

For example:

```kotlin
interface PaymentMethod {
    // Functions are inheritable by default
    fun initiatePayment(amount: Double): String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod {
    override fun initiatePayment(amount: Double): String {
        // Simulate processing payment with credit card
        return "Payment of $$amount initiated using Credit Card ending in ${cardNumber.takeLast(4)}."
    }
}

fun main() {
    val paymentMethod = CreditCardPayment("1234 5678 9012 3456", "John Doe", "12/25")
    println(paymentMethod.initiatePayment(100.0))
    // Payment of $100.0 initiated using Credit Card ending in 3456.
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-inheritance"}

In the example:

* `PaymentMethod` is an interface that has an `initiatePayment()` function without an implementation.
* `CreditCardPayment` is a class that implements the `PaymentMethod` interface.
* The `CreditCardPayment` class overrides the inherited `initiatePayment()` function.
* `paymentMethod` is an instance of the `CreditCardPayment` class.
* The overridden `initiatePayment()` function is called on the `paymentMethod` instance with a parameter of `100.0`.

To create a class that implements **multiple** interfaces, add a colon after your class header followed by the name of the interfaces
that you want to implement separated by a comma:

```kotlin
class CreditCardPayment : PaymentMethod, PaymentType
```

For example:

```kotlin
interface PaymentMethod {
    fun initiatePayment(amount: Double): String
}

interface PaymentType {
    val paymentType: String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod,
    PaymentType {
    override fun initiatePayment(amount: Double): String {
        // Simulate processing payment with credit card
        return "Payment of $$amount initiated using Credit Card ending in ${cardNumber.takeLast(4)}."
    }

    override val paymentType: String = "Credit Card"
}

fun main() {
    val paymentMethod = CreditCardPayment("1234 5678 9012 3456", "John Doe", "12/25")
    println(paymentMethod.initiatePayment(100.0))
    // Payment of $100.0 initiated using Credit Card ending in 3456.

    println("Payment is by ${paymentMethod.paymentType}")
    // Payment is by Credit Card
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-multiple-inheritance"}

In the example:

* `PaymentMethod` is an interface that has the `initiatePayment()` function without an implementation.
* `PaymentType` is an interface that has the `paymentType` property that isn't initialized.
* `CreditCardPayment` is a class that implements the `PaymentMethod` and `PaymentType` interfaces.
* The `CreditCardPayment` class overrides the inherited `initiatePayment()` function and the `paymentType` property.
* `paymentMethod` is an instance of the `CreditCardPayment` class.
* The overridden `initiatePayment()` function is called on the `paymentMethod` instance with a parameter of `100.0`.
* The overridden `paymentType` property is accessed on the `paymentMethod` instance.

For more information about interfaces and interface inheritance, see [Interfaces](interfaces.md).

## Delegation

Interfaces are useful, but if your interface contains many functions, child classes may end up with a lot of 
boilerplate code. When you only want to override a small part of your parent's behavior, you need to repeat yourself a lot.

> Boilerplate code is a chunk of code that is reused with little or no alteration in multiple parts of a software project.
> 
{style="tip"}

For example, let's say that you have an interface called `Drawable` that contains a number of functions and one property
called `color`:

```kotlin
interface Drawable {
    fun draw()
    fun resize()
    val color: String?
}
```

You create a class called `Circle` which implements the `Drawable` interface and provides implementations for all of
its members:

```kotlin
class Circle : Drawable {
    override fun draw() {
        TODO("An example implementation")
    }
    
    override fun resize() {
        TODO("An example implementation")
    }
   override val color = null
}
```

If you wanted to create a child class of the `Circle` class which had the same behavior **except** for the value of the
`color` property, you still need to add implementations for each member function of the `Circle` class:

```kotlin
class RedCircle(val circle: Circle) : Circle {

    // Start of boilerplate code
    override fun draw() {
        circle.draw()
    }

    override fun resize() {
        circle.resize()
    }

    // End of boilerplate code
    override val color = "red"
}
```

You can see that if you have a large number of member functions in the `Drawable` interface, the amount of boilerplate
code in the `RedCircle` class can be very large. However, there is an alternative.

In Kotlin, you can use delegation to delegate the interface implementation to an instance of a class. For example,
you can create an instance of the `Circle` class and delegate the implementations of the member functions of the `Circle`
class to this instance. To do this, use the `by` keyword. For example:

```kotlin
class RedCircle(param: Circle) : Drawable by param
```

Here, `param` is the name of the instance of the `Circle` class that the implementations of member functions are delegated to.

Now you don't have to add implementations for the member functions in the `RedCircle` class. The compiler does
this for you automatically from the `Circle` class. This saves you from having to write a lot of boilerplate code. Instead,
you add code only for the behavior you want to change for your child class. 

For example, if you want to change the value of the `color` property:

```kotlin
class RedCircle(param : Circle) : Drawable by param {
    // No boilerplate code!
    override val color = "red"
}
```

If you want to, you can also override the behavior of an inherited member function in the `RedCircle` class, but now
you don't have to add new lines of code for every inherited member function.

For more information, see [Delegation](delegation.md).

## Practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-1"}

Imagine you're working on a smart home system. A smart home typically has different types of devices that all have some
basic features but also unique behaviors. In the code sample below, complete the `abstract` class called `SmartDevice` 
so that the child class `SmartLight` can compile successfully.

Then, create another child class called `SmartThermostat` that inherits from the `SmartDevice` class and implements 
`turnOn()` and `turnOff()` functions that return print statements describing which thermostat is heating or turned off.
Finally, add another function called `adjustTemperature()` that accepts a temperature measurement as an input and prints:
`$name thermostat set to $temperature°C.`

<deflist collapsible="true">
    <def title="Hint">
        In the <code>SmartDevice</code> class, add the <code>turnOn()</code> and <code>turnOff()</code> functions so that 
        you can override their behavior later in the <code>SmartThermostat</code> class.
    </def>
</deflist>

|--|--|

```kotlin
abstract class // Write your code here

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name is now ON.")
    }

    override fun turnOff() {
        println("$name is now OFF.")
    }

   fun adjustBrightness(level: Int) {
        println("Adjusting $name brightness to $level%.")
    }
}

class SmartThermostat // Write your code here

fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")
    
    livingRoomLight.turnOn()
    // Living Room Light is now ON.
    livingRoomLight.adjustBrightness(10)
    // Adjusting Living Room Light brightness to 10%.
    livingRoomLight.turnOff()
    // Living Room Light is now OFF.

    bedroomThermostat.turnOn()
    // Bedroom Thermostat thermostat is now heating.
    bedroomThermostat.adjustTemperature(5)
    // Bedroom Thermostat thermostat set to 5°C.
    bedroomThermostat.turnOff()
    // Bedroom Thermostat thermostat is now off.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-1"}

|---|---|
```kotlin
abstract class SmartDevice(val name: String) {
    abstract fun turnOn()
    abstract fun turnOff()
}

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name is now ON.")
    }

    override fun turnOff() {
        println("$name is now OFF.")
    }

   fun adjustBrightness(level: Int) {
        println("Adjusting $name brightness to $level%.")
    }
}

class SmartThermostat(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name thermostat is now heating.")
    }

    override fun turnOff() {
        println("$name thermostat is now off.")
    }

   fun adjustTemperature(temperature: Int) {
        println("$name thermostat set to $temperature°C.")
    }
}


fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")
    
    livingRoomLight.turnOn()
    // Living Room Light is now ON.
    livingRoomLight.adjustBrightness(10)
    // Adjusting Living Room Light brightness to 10%.
    livingRoomLight.turnOff()
    // Living Room Light is now OFF.

    bedroomThermostat.turnOn()
    // Bedroom Thermostat thermostat is now heating.
    bedroomThermostat.adjustTemperature(5)
    // Bedroom Thermostat thermostat set to 5°C.
    bedroomThermostat.turnOff()
    // Bedroom Thermostat thermostat is now off.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-classes-interfaces-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-2"}

Create an interface called `Media` that you can use to implement specific media classes like `Audio`, `Video`, or 
`Podcast`. Your interface must include:

* A property called `title` to represent the title of the media.
* A function called `play()` to play the media.

Then, create a class called `Audio` that implements the `Media` interface. The `Audio` class must use the `title` property
in its constructor as well as have an additional property called `composer` that has `String` type. In the class, implement
the `play()` function to print the following: `"Playing audio: $title, composed by $composer"`.

<deflist collapsible="true">
    <def title="Hint">
        You can use the <code>override</code> keyword in class headers to implement a property from an interface in the constructor.
    </def>
</deflist>

|---|---|
```kotlin
interface // Write your code here

class // Write your code here

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
   // Playing audio: Symphony No. 5, composed by Beethoven
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-2"}

|---|---|
```kotlin
interface Media {
    val title: String
    fun play()
}

class Audio(override val title: String, val composer: String) : Media {
    override fun play() {
        println("Playing audio: $title, composed by $composer")
    }
}

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
   // Playing audio: Symphony No. 5, composed by Beethoven
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-classes-interfaces-solution-2"}

### Exercise 3 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-3"}

You're building a payment processing system for an e-commerce application. Each payment method needs to be able to 
authorize a payment and process a transaction. Some payments also need to be able to process refunds.

1. In the `Refundable` interface, add a function called `refund()` to process refunds.

2. In the `PaymentMethod` abstract class:
   * Add a function called `authorize()` that takes an amount and prints a message containing the amount.
   * Add an abstract function called `processPayment()` that also takes an amount.

3. Create a class called `CreditCard` that implements the `Refundable` interface and `PaymentMethod` abstract class.
In this class, add implementations for the `refund()` and `processPayment()` functions so that they print the following 
statements:
   * `"Refunding $amount to the credit card."`
   * `"Processing credit card payment of $amount."`

|---|---|
```kotlin
interface Refundable {
    // Write your code here
}

abstract class PaymentMethod(val name: String) {
    // Write your code here
}

class CreditCard // Write your code here

fun main() {
    val visa = CreditCard("Visa")
    
    visa.authorize(100.0)
    // Authorizing payment of $100.0.
    visa.processPayment(100.0)
    // Processing credit card payment of $100.0.
    visa.refund(50.0)
    // Refunding $50.0 to the credit card.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-3"}

|---|---|
```kotlin
interface Refundable {
    fun refund(amount: Double)
}

abstract class PaymentMethod(val name: String) {
    fun authorize(amount: Double) {
        println("Authorizing payment of $$amount.")
    }

    abstract fun processPayment(amount: Double)
}

class CreditCard(name: String) : PaymentMethod(name), Refundable {
    override fun processPayment(amount: Double) {
        println("Processing credit card payment of $$amount.")
    }

    override fun refund(amount: Double) {
        println("Refunding $$amount to the credit card.")
    }
}

fun main() {
    val visa = CreditCard("Visa")
    
    visa.authorize(100.0)
    // Authorizing payment of $100.0.
    visa.processPayment(100.0)
    // Processing credit card payment of $100.0.
    visa.refund(50.0)
    // Refunding $50.0 to the credit card.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-classes-interfaces-solution-3"}

### Exercise 4 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-4"}

You have a simple messaging app that has some basic functionality, but you want to add some functionality for 
_smart_ messages without significantly duplicating your code.

In the code below, define a class called `SmartMessenger` that inherits from the `Messenger` interface but delegates 
the implementation to an instance of the `BasicMessenger` class. 

In the `SmartMessenger` class, override the `sendMessage()` function to send smart messages. The function must accept
a `message` as an input and return a printed statement: `"Sending a smart message: $message"`. In addition, call the 
`sendMessage()` function from the `BasicMessenger` class and prefix the message with `[smart]`.

> You don't need to rewrite the `receiveMessage()` function in the `SmartMessenger` class.
> 
{style="note"}

|--|--|

```kotlin
interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) {
        println("Sending message: $message")
    }

    override fun receiveMessage(): String {
        return "You've got a new message!"
    }
}

class SmartMessenger // Write your code here

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)
    
    basicMessenger.sendMessage("Hello!")
    // Sending message: Hello!
    println(smartMessenger.receiveMessage())
    // You've got a new message!
    smartMessenger.sendMessage("Hello from SmartMessenger!")
    // Sending a smart message: Hello from SmartMessenger!
    // Sending message: [smart] Hello from SmartMessenger!
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-4"}

|---|---|
```kotlin
interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) {
        println("Sending message: $message")
    }

    override fun receiveMessage(): String {
        return "You've got a new message!"
    }
}

class SmartMessenger(val basicMessenger: BasicMessenger) : Messenger by basicMessenger {
    override fun sendMessage(message: String) {
        println("Sending a smart message: $message")
        basicMessenger.sendMessage("[smart] $message")
    }
}

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)
    
    basicMessenger.sendMessage("Hello!")
    // Sending message: Hello!
    println(smartMessenger.receiveMessage())
    // You've got a new message!
    smartMessenger.sendMessage("Hello from SmartMessenger!")
    // Sending a smart message: Hello from SmartMessenger!
    // Sending message: [smart] Hello from SmartMessenger!
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-classes-interfaces-solution-4"}

## Next step

[Intermediate: Objects](kotlin-tour-intermediate-objects.md)
