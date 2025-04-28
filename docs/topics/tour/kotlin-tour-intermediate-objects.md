[//]: # (title: Intermediate: Objects)

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">Extension functions</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">Scope functions</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">Lambda expressions with receiver</a><br /> 
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">Classes and interfaces</a><br /> 
        <img src="icon-5.svg" width="20" alt="Fourth step" /> <strong>Objects</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">Open and special classes</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">Properties</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null safety</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">Libraries and APIs</a></p>
</tldr>

In this chapter, you'll expand your understanding of classes by exploring object declarations. This knowledge will help 
you efficiently manage behavior across your projects.

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
{kotlin-runnable="true" id="kotlin-tour-object-declarations"}

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
which you learned about in the beginner tour, data objects automatically come with additional member functions: 
`toString()` and `equals()`.

> Unlike data classes, data objects do not come automatically with the `copy()` member function because they only have
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
    // AppConfig
    
    println(AppConfig.appName)
    // My Application
}
```
{kotlin-runnable="true" id="kotlin-tour-data-objects"}

For more information about data objects, see [](object-declarations.md#data-objects).

#### Companion objects

In Kotlin, a class can have an object: a **companion** object. You can only have **one** companion object per class.
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
            repeat(nTimes) { print("BONG ") }
            }
        }
    }

fun main() {
    // Companion object is created when the class is referenced for the
    // first time.
    BigBen.getBongs(12)
    // BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-companion-object"}

This example creates a class called `BigBen` that contains a companion object called `Bonger`. The companion object
has a member function called `getBongs()` that accepts an integer and prints `"BONG"` to the console the same number of times
as the integer.

In the `main()` function, the `getBongs()` function is called by referring to the class name. The companion object is created
at this point. The `getBongs()` function is called with parameter `12`.

For more information, see [](object-declarations.md#companion-objects).

## Object declarations practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-1"}

You run a coffee shop and have a system for tracking customer orders. Consider the code below and complete the declaration
of the second data object so that the following code in the `main()` function runs successfully:

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

data object // Write your code here

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

|---|---|

```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object // Write your code here

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

    // Write your code here
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

## Next step

[Intermediate: Open and special classes](kotlin-tour-intermediate-open-special-classes.md)
