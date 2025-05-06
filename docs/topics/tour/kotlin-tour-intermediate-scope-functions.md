[//]: # (title: Intermediate: Scope functions)

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">Extension functions</a><br />
        <img src="icon-2.svg" width="20" alt="Second step" /> <strong>Scope functions</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">Lambda expressions with receiver</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">Classes and interfaces</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">Objects</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">Open and special classes</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">Properties</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null safety</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">Libraries and APIs</a></p>
</tldr>

In this chapter, you'll build on your understanding of extension functions to learn how to use scope functions to 
write more idiomatic code.

## Scope functions

In programming, a scope is the area in which your variable or object is recognized. The most commonly referred to scopes
are the global scope and the local scope:

* **Global scope** – a variable or object that is accessible from anywhere in the program.
* **Local scope** – a variable or object that is only accessible within the block or function where it is defined.

In Kotlin, there are also scope functions that allow you to create a temporary scope around an object and execute some code.

Scope functions make your code more concise because you don't have to refer to the name of your object within the temporary
scope. Depending on the scope function, you can access the object either by referencing it via the keyword `this` or using it as an
argument via the keyword `it`.

Kotlin has five scope functions in total: `let`, `apply`, `run`, `also`, and `with`.

Each scope function takes a lambda expression and returns either the object or the result of the lambda expression. In 
this tour, we explain each scope function and how to use it.

> You can also watch the [Back to the Stdlib: Making the Most of Kotlin's Standard Library](https://youtu.be/DdvgvSHrN9g?feature=shared&t=1511)
> talk on scope functions by Sebastian Aigner, Kotlin developer advocate.
> 
{style="tip"}

### Let

Use the `let` scope function when you want to perform null checks in your code and later perform further actions
with the returned object.

Consider the example:

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() {
    val address: String? = getNextAddress()
    sendNotification(address)
}
```
{validate = "false"}

The example has two functions:
* `sendNotification()`, which has a function parameter `recipientAddress` and returns a string.
* `getNextAddress()`, which has no function parameters and returns a string.

The example creates a variable `address` that has a nullable `String` type. But this becomes a problem when you call
the `sendNotification()` function because this function doesn't expect that `address` could be a `null` value.
The compiler reports an error as a result: 

```text
Type mismatch: inferred type is String? but String was expected
```

From the beginner tour, you already know that you can perform a null check with an if condition or use the [Elvis operator `?:`](kotlin-tour-null-safety.md#use-elvis-operator). 
But what if you want to use the returned object later in your code? You could achieve this with an if condition **and** an 
else branch:

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() { 
    //sampleStart
    val address: String? = getNextAddress()
    val confirm = if(address != null) {
        sendNotification(address)
    } else { null }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null-if"}

However, a more concise approach is to use the `let` scope function:

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() {
    //sampleStart
    val address: String? = getNextAddress()
    val confirm = address?.let {
        sendNotification(it)
    }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null"}

The example:
* Creates a variable called `confirm`.
* Uses a safe call for the `let` scope function on the `address` variable.
* Creates a temporary scope within the `let` scope function.
* Passes the `sendNotification()` function as a lambda expression into the `let` scope function.
* Refers to the `address` variable via `it`, using the temporary scope.
* Assigns the result to the `confirm` variable.

With this approach, your code can handle the `address` variable potentially being a `null` value, and you can use the 
`confirm` variable later in your code.

### Apply

Use the `apply` scope function to initialize objects, like a class instance, at the time of creation rather than later
on in your code. This approach makes your code easier to read and manage.

Consider the example:

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String = "Mock data"
}

val client = Client()

fun main() {
    client.token = "asdf"
    client.connect()
    // connected!
    client.authenticate()
    // authenticated!
    client.getData()
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-before"}

The example has a `Client` class that contains one property called `token` and three member functions: `connect()`,
`authenticate()`, and `getData()`.

The example creates `client` as an instance of the `Client` class before initializing its `token` property and calling its
member functions in the `main()` function.

Although this example is compact, in the real world, it can be a while before you can configure and use the class instance
(and its member functions) after you've created it. However, if you use the `apply` scope function you can create, configure and
use member functions on your class instance all in the same place in your code:

```kotlin
class Client() {
  var token: String? = null
  fun connect() = println("connected!")
  fun authenticate() = println("authenticated!")
  fun getData(): String = "Mock data"
}
//sampleStart
val client = Client().apply {
  token = "asdf"
  connect()
  authenticate()
}

fun main() {
  client.getData()
  // connected!
  // authenticated!
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-after"}

The example:

* Creates `client` as an instance of the `Client` class.
* Uses the `apply` scope function on the `client` instance.
* Creates a temporary scope within the `apply` scope function so that you don't have to explicitly refer to the `client` instance when accessing its properties or functions.
* Passes a lambda expression to the `apply` scope function that updates the `token` property and calls the `connect()` and `authenticate()` functions.
* Calls the `getData()` member function on the `client` instance in the `main()` function.

As you can see, this strategy is convenient when you are working with large pieces of code.

### Run

Similar to `apply`, you can use the `run` scope function to initialize an object, but it's better to use `run` 
to initialize an object at a specific moment in your code **and** immediately compute a result.

Let's continue the previous example for the `apply` function, but this time, you want the `connect()` and
`authenticate()` functions to be grouped so that they are called on every request.

For example:

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String = "Mock data"
}

//sampleStart
val client: Client = Client().apply {
    token = "asdf"
}

fun main() {
    val result: String = client.run {
        connect()
        // connected!
        authenticate()
        // authenticated!
        getData()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-run"}

The example:

* Creates `client` as an instance of the `Client` class.
* Uses the `apply` scope function on the `client` instance.
* Creates a temporary scope within the `apply` scope function so that you don't have to explicitly refer to the `client` instance when accessing its properties or functions.
* Passes a lambda expression to the `apply` scope function that updates the `token` property.

The `main()` function:

* Creates a `result` variable with type `String`.
* Uses the `run` scope function on the `client` instance.
* Creates a temporary scope within the `run` scope function so that you don't have to explicitly refer to the `client` instance when accessing its properties or functions.
* Passes a lambda expression to the `run` scope function that calls the `connect()`, `authenticate()`, and `getData()` functions.
* Assigns the result to the `result` variable.

Now you can use the returned result further in your code.

### Also

Use the `also` scope function to complete an additional action with an object and then return the object to continue 
using it in your code, like writing a log.

Consider the example:

```kotlin
fun main() {
    val medals: List<String> = listOf("Gold", "Silver", "Bronze")
    val reversedLongUppercaseMedals: List<String> =
        medals
            .map { it.uppercase() }
            .filter { it.length > 4 }
            .reversed()
    println(reversedLongUppercaseMedals)
    // [BRONZE, SILVER]
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-also-before"}

The example:

* Creates the `medals` variable that contains a list of strings.
* Creates the `reversedLongUpperCaseMedals` variable that has the `List<String>` type.
* Uses the `.map()` extension function on the `medals` variable.
* Passes a lambda expression to the `.map()` function that refers to `medals` via the `it` keyword and calls the `.uppercase()` extension function on it.
* Uses the `.filter()` extension function on the `medals` variable.
* Passes a lambda expression as a predicate to the `.filter()` function that refers to `medals` via the `it` keyword and checks if the length of the list contained in the `medals` variable is longer than 4 items.
* Uses the `.reversed()` extension function on the `medals` variable.
* Assigns the result to the `reversedLongUpperCaseMedals` variable.
* Prints the list contained in the `reversedLongUpperCaseMedals` variable.

It would be useful to add some logging in between the function calls to see what is happening to the `medals` variable.
The `also` function helps with that:

```kotlin
fun main() {
    val medals: List<String> = listOf("Gold", "Silver", "Bronze")
    val reversedLongUppercaseMedals: List<String> =
        medals
            .map { it.uppercase() }
            .also { println(it) }
            // [GOLD, SILVER, BRONZE]
            .filter { it.length > 4 }
            .also { println(it) }
            // [SILVER, BRONZE]
            .reversed()
    println(reversedLongUppercaseMedals)
    // [BRONZE, SILVER]
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-also-after"}

Now the example:

* Uses the `also` scope function on the `medals` variable.
* Creates a temporary scope within the `also` scope function so that you don't have to explicitly refer to the `medals` variable when using it as a function parameter.
* Passes a lambda expression to the `also` scope function that calls the `println()` function using the `medals` variable as a function parameter via the `it` keyword.

Since the `also` function returns the object, it is useful for not only logging but debugging, chaining
multiple operations, and performing other side-effect operations that don't affect the main flow of your code.

### With

Unlike the other scope functions, `with` is not an extension function, so the syntax is different. You pass the receiver
object to `with` as an argument. 

Use the `with` scope function when you want to call multiple functions on an object.

Consider this example:

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = println("$x, $y, $w, $h")
    fun circ(x: Int, y: Int, rad: Int): Unit = println("$x, $y, $rad")
    fun text(x: Int, y: Int, str: String): Unit = println("$x, $y, $str")
}

fun main() {
    val mainMonitorPrimaryBufferBackedCanvas = Canvas()

    mainMonitorPrimaryBufferBackedCanvas.text(10, 10, "Foo")
    mainMonitorPrimaryBufferBackedCanvas.rect(20, 30, 100, 50)
    mainMonitorPrimaryBufferBackedCanvas.circ(40, 60, 25)
    mainMonitorPrimaryBufferBackedCanvas.text(15, 45, "Hello")
    mainMonitorPrimaryBufferBackedCanvas.rect(70, 80, 150, 100)
    mainMonitorPrimaryBufferBackedCanvas.circ(90, 110, 40)
    mainMonitorPrimaryBufferBackedCanvas.text(35, 55, "World")
    mainMonitorPrimaryBufferBackedCanvas.rect(120, 140, 200, 75)
    mainMonitorPrimaryBufferBackedCanvas.circ(160, 180, 55)
    mainMonitorPrimaryBufferBackedCanvas.text(50, 70, "Kotlin")
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-with-before"}

The example creates a `Canvas` class that has three member functions: `rect()`, `circ()`, and `text()`. Each of these member
functions prints a statement constructed from the function parameters that you provide.

The example creates `mainMonitorPrimaryBufferBackedCanvas` as an instance of the `Canvas` class before calling a sequence
of member functions on the instance with different function parameters.

You can see that this code is hard to read. If you use the `with` function, the code is streamlined:

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = println("$x, $y, $w, $h")
    fun circ(x: Int, y: Int, rad: Int): Unit = println("$x, $y, $rad")
    fun text(x: Int, y: Int, str: String): Unit = println("$x, $y, $str")
}

fun main() {
    //sampleStart
    val mainMonitorSecondaryBufferBackedCanvas = Canvas()
    with(mainMonitorSecondaryBufferBackedCanvas) {
        text(10, 10, "Foo")
        rect(20, 30, 100, 50)
        circ(40, 60, 25)
        text(15, 45, "Hello")
        rect(70, 80, 150, 100)
        circ(90, 110, 40)
        text(35, 55, "World")
        rect(120, 140, 200, 75)
        circ(160, 180, 55)
        text(50, 70, "Kotlin")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-with-after"}

This example:
* Uses the `with` scope function with the `mainMonitorSecondaryBufferBackedCanvas` instance as the receiver object.
* Creates a temporary scope within the `with` scope function so that you don't have to explicitly refer to the `mainMonitorSecondaryBufferBackedCanvas` instance when calling its member functions.
* Passes a lambda expression to the `with` scope function that calls a sequence of member functions with different function parameters.

Now that this code is much easier to read, you are less likely to make mistakes.

## Use case overview

This section has covered the different scope functions available in Kotlin and their main use cases for making your code
more idiomatic. You can use this table as a quick reference. It's important to note that you don't need a complete understanding
of how these functions work in order to use them in your code.

| Function | Access to `x` via | Return value  | Use case                                                                                     |
|----------|-------------------|---------------|----------------------------------------------------------------------------------------------|
| `let`    | `it`              | Lambda result | Perform null checks in your code and later perform further actions with the returned object. |
| `apply`  | `this`            | `x`           | Initialize objects at the time of creation.                                                  |
| `run`    | `this`            | Lambda result | Initialize objects at the time of creation **AND** compute a result.                         |
| `also`   | `it`              | `x`           | Complete additional actions before returning the object.                                     |
| `with`   | `this`            | Lambda result | Call multiple functions on an object.                                                        |

For more information about scope functions, see [Scope functions](scope-functions.md).

## Practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-1"}

Rewrite the `.getPriceInEuros()` function as a single-expression function that uses safe call operators `?.` and the `let` scope function.

<deflist collapsible="true">
    <def title="Hint">
        Use safe call operators <code>?.</code> to safely access the <code>priceInDollars</code> property from the <code>getProductInfo()</code>
        function. Then, use the <code>let</code> scope function to convert the value of <code>priceInDollars</code> into euros.
    </def>
</deflist>

|---|---|
```kotlin
data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? {
        return ProductInfo(100.0)
    }
}

// Rewrite this function
fun Product.getPriceInEuros(): Double? {
    val info = getProductInfo()
    if (info == null) return null
    val price = info.priceInDollars
    if (price == null) return null
    return convertToEuros(price)
}

fun convertToEuros(dollars: Double): Double {
    return dollars * 0.85
}

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()

    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
        // Price in Euros: €85.0
    } else {
        println("Price information is not available.")
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-scope-functions-exercise-1"}

|---|---|
```kotlin
data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? {
        return ProductInfo(100.0)
    }
}

fun Product.getPriceInEuros() = getProductInfo()?.priceInDollars?.let { convertToEuros(it) }

fun convertToEuros(dollars: Double): Double {
    return dollars * 0.85
}

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()

    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
        // Price in Euros: €85.0
    } else {
        println("Price information is not available.")
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-scope-functions-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-2"}

You have an `updateEmail()` function that updates the email address of a user. Use the `apply` scope function
to update the email address and then the `also` scope function to print a log message: `Updating email for user with ID: ${it.id}`.

|---|---|
```kotlin
data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = // Write your code here

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    // Updating email for user with ID: 1

    println("Updated User: $updatedUser")
    // Updated User: User(id=1, email=new_email@example.com)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-scope-functions-exercise-2"}

|---|---|
```kotlin
data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = user.apply {
    this.email = newEmail
}.also { println("Updating email for user with ID: ${it.id}") }

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    // Updating email for user with ID: 1

    println("Updated User: $updatedUser")
    // Updated User: User(id=1, email=new_email@example.com)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-scope-functions-solution-2"}

## Next step

[Intermediate: Lambda expressions with receiver](kotlin-tour-intermediate-lambdas-receiver.md)