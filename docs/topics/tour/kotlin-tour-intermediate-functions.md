[//]: # (title: Intermediate functions)

In this chapter, you will explore special Kotlin functions that make your code more concise and readable, 
and learn how they can help you use efficient design patterns to take your projects to the next level.

## Extension functions

In software development, you often need to modify the behavior of a program without altering the original source code. 
For example, in your project, you might want to add additional functionality to a class from a third-party library.

Extension functions allow you to extend a class with additional functionality. You call extension functions as if they 
are member functions of a class.

Before introducing the syntax for extension functions, you need to understand the terms **receiver type** and 
**receiver object**.

The receiver object is what the function is called on. In other words, the receiver is where or with whom the information is shared.

In this example, the `main()` function calls the `.first()` function. The `.first()` function is called on the `readOnlyShapes`
variable so the `readOnlyShapes` variable is the receiver:

![An example of sender and receiver](receiver-highlight.png){width="500"}

The receiver object has a **type** so that the compiler understands when the function can be used.

To declare an extension function, write the name of the class that you want to extend followed by a `.` and the name of
your function. Continue with the rest of the function declaration, including its arguments and return type.

In the following example:

* `String` is the class that is extended, also known as the receiver type.
* The `.bold()` extension function's return type is `String`.
* An instance of `String` is the receiver object.
* The receiver object is accessed inside the body by the [keyword](keyword-reference.md): `this`.
* A string template (`$`) is used to access the value of `this`.
* The `.bold()` extension function takes a string and returns it in a `<b>` HTML element for bold text.

```kotlin
fun String.bold(): String = "<b>$this</b>"

fun main() {
    // "hello" is the receiver object
    println("hello".bold())
    // <b>hello</b>
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-function"}

### Extension-oriented design

Extension functions can be defined anywhere, enabling you to create extension-oriented designs. Such designs separate 
core functionality from useful but non-essential features, making your code easier to read and maintain.

A good example is the [`HttpClient`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) class from the Ktor library, which helps with performing network requests. The core of
its functionality is a single function, which takes all the information you may use in a HTTP request:

```kotlin
class HttpClient {
  fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
    // Network code
  }
}
```

In practice, most people just want to perform a GET or POST request, so it makes sense for the library to provide shorter
names for that common use case. However, those don't require writing new network code, only the specific call to request.
In other words, they are perfect candidates to be defined as extension functions:

```kotlin
fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())
fun HttpClient.post(url: String): HttpResponse = request("POST", url, emptyMap())
```

This extension-oriented approach is widely used in Kotlin's [standard library](https://kotlinlang.org/api/latest/jvm/stdlib/)
and other libraries. For example, the `String` class has many [extension functions](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/#extension-functions)
to help you work with strings.

For more information about extension functions, see [Extensions](extensions.md).

## Extension functions practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-1"}

Write a function called `isPositive` that takes an integer and checks whether it is positive.

|---|---|
```kotlin
fun // Write your code here

fun main() {
    println(1.isPositive())
    // true
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-functions-exercise-1"}

|---|---|
```kotlin
fun Int.isPositive(): Boolean = this > 0

fun main() {
    println(1.isPositive())
    // true
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-extension-functions-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-2"}

Write a function called `toLowercaseString` that takes a string and returns a lowercase version.

<deflist collapsible="true">
    <def title="Hint">
        Use the <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html"> <code>.lowercase()</code>
        </a> function for <code>String</code> type. 
    </def>
</deflist>

|---|---|
```kotlin
// Write your code here

fun main() {
    println(input.toLowercaseString("Hello World!"))
    // hello world!
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-functions-exercise-2"}

|---|---|
```kotlin
fun String.toLowercaseString(): String = this.lowercase()

fun main() {
    println("Hello World!".toLowercaseString())
    // hello world!
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-extension-functions-solution-2"}


## Scope functions

In programming, a scope is the area in which your variable or object is recognized. The most commonly referred to scopes
are global scope and local scope. In Kotlin, there are scope functions that allow you to create a temporary scope around
an object and execute some code.

Scope functions also make your code more concise because you don't have to refer to the name of your object within the temporary
scope. Depending on the scope function, you can access the object either by referencing it via the keyword `this` or using it as an
argument via the keyword `it`.

Kotlin has five scope functions in total: `.let()`, `.apply()`, `.run()`, `.also()`,  and `with()`.

Each scope function takes a lambda expression and returns either the object or the result of the lambda expression. In 
this tour, we explain each scope function with a recommendation for how to use it.

> If you prefer, the information in this section is also presented in a YouTube video by our developer advocate: Sebastian Aigner.
> To learn more, watch [Back to the Stdlib: Making the Most of Kotlin's Standard Library](https://youtu.be/DdvgvSHrN9g?feature=shared&t=1511).
>

### Let

Use the `.let()` scope function when you want to perform null checks in your code and later perform further actions
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
    val addr: String? = getNextAddress()
    sendNotification(addr)
}
```
{validate = "false"}

The example has two functions:
* `sendNotification()`, which has a function parameter `recipientAddress` and returns a string.
* `getNextAddress()`, which has no function parameters and returns a string.

The example creates a variable `addr` that has nullable `String` type. But this becomes a problem when you call
the `sendNotification()` function because the `sendNotification()` function doesn't expect that `addr` could be a `null` value.
The compiler reports an error as a result: 

```text
Type mismatch: inferred type is String? but String was expected
```

From the beginner tour, you already know that you can perform a null check with an if condition or use the [Elvis operator](kotlin-tour-null-safety.md#use-elvis-operator). 
But what if you want to use the returned object later on in your code? You could achieve this with an if condition **and** an 
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
    val addr: String? = getNextAddress()
    val confirm = if(addr != null) {
        sendNotification(addr)
    } else { null }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null-if"}

However, a more concise approach is to use the `.let()` scope function:

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
    val addr: String? = getNextAddress()
    val confirm = addr?.let {
        sendNotification(it)
    }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null"}

The example:
* Creates a variable called `confirm`.
* Uses a safe call to call the `.let()` scope function on the `addr` variable.
* Creates a temporary scope within the `.let()` scope function so that you don't have to explicitly refer to the `addr` variable.
* Passes the `sendNotification()` function as a lambda expression into the `.let()` scope function.
* Uses the temporary scope to refer to the `addr` variable via `it`.
* Assigns the result to the `confirm` variable.

With this approach, your code can handle the `addr` variable potentially being a `null` value, and you can use the 
`confirm` variable later on in your code.

### Apply

Use the `.apply()` scope function to initialize objects, like a class instance, at the time of creation rather than later
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

Although this example is compact, in the real world it can be a while after the creation of your class instance before you
configure it and use its member functions. However, if you use the `.apply()` scope function you can create, configure and
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
* Uses the `.apply()` scope function on the `client` instance.
* Creates a temporary scope within the `.apply()` scope function so that you don't have to explicitly refer to the `client` instance when accessing its properties or functions.
* Passes a lambda expression to the `.apply()` scope function that updates the `token` property and calls the `connect()` and `authenticate()` functions.
* Calls the `getData()` member function on the `client` instance in the `main()` function.

As you can see, this strategy is convenient when you are working with large pieces of code.

### Run

Similar to `.apply()` you can use the `.run()` scope function to initialize an object, but it's better to use `.run()` 
to initialize an object at a specific moment in your code **and** immediately compute a result.

Let's continue the previous example for the `.apply()` function but this time you want the `connect()` and
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
* Uses the `.apply()` scope function on the `client` instance.
* Creates a temporary scope within the `.apply()` scope function so that you don't have to explicitly refer to the `client` instance when accessing its properties or functions.
* Passes a lambda expression to the `.apply()` scope function that updates the `token` property.

|--|--|

* Creates a `result` variable with type `String`.
* Uses the `.run()` scope function on the `client` instance.
* Creates a temporary scope within the `.run()` scope function so that you don't have to explicitly refer to the `client` instance when accessing its properties or functions.
* Passes a lambda expression to the `.run()` scope function that calls the `connect()`, `authenticate()`, and `getData()` functions.
* Assigns the result to the `result` variable.

Now you can use the returned result further in your code.

### Also

Use the `.also()` scope function to complete an additional action with an object and then return the object to continue 
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
* Creates the `reversedLongUpperCaseMedals` variable that has `List<String>` type.
* Uses the `.map()` extension function on the `medals` variable.
* Passes a lambda expression to the `.map()` function that refers to `medals` via the `it` keyword and calls the `upperCase()` extension function on it.
* Uses the `.filter()` extension function on the `medals` variable.
* Passes a lambda expression as a predicate to the `.filter()` function that refers to `medals` via the `it` keyword and checks if the length of the list contained in the `medals` variable is longer than 4 items.
* Uses the `.reversed()` extension function on the `medals` variable.
* Assigns the result to the `reversedLongUpperCaseMedals` variable.
* Prints the list contained in the `reversedLongUpperCaseMedals` variable.

It would be useful to add some logging in between the function calls to see what is happening to the `medals` variable.
The `.also()` function helps with that:

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

* Uses the `.also()` scope function on the `medals` variable.
* Creates a temporary scope within the `.also()` scope function so that you don't have to explicitly refer to the `medals` variable when using it as a function parameter.
* Passes a lambda expression to the `.also()` scope function that calls the `println()` function using the `medals` variable as a function parameter via the `it` keyword.

Since the `.also()` function returns the object, it is useful for not only logging but debugging, chaining
multiple operations, and performing other side-effect operations that don't affect the main flow of your code.

### With

Unlike the other scope functions, `with()` is not an extension function, so the syntax is different. You pass the receiver
object to `with()` as an argument. 

Use the `with()` scope function when you want to call multiple functions on an object.

Consider this example:

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = print("$x, $y, $w, $h")
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

You can see that this code is hard to read. If you use the `with()` function, the code is streamlined:

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = print("$x, $y, $w, $h")
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
* Uses the `with()` scope function with the `mainMonitorSecondaryBufferBackedCanvas` instance as the receiver object.
* Creates a temporary scope within the `with()` scope function so that you don't have to explicitly refer to the `mainMonitorSecondaryBufferBackedCanvas` instance when calling its member functions.
* Passes a lambda expression to the `.also()` scope function that calls the `println()` function using the `medals` variable as a function parameter via the `it` keyword.
* Calls a sequence of member functions with different function parameters.

Now that this code is much easier to read, you are less likely to make mistakes.

### Use case overview

This section has covered the different scope functions available in Kotlin and their main use cases for making your code
more idiomatic. You can use this table as a quick reference. It's important to note that you don't need a complete understanding
of how these functions work in order to use them in your code.

| Function        | Access to `x` via | Return value  | Use case                                                                                     |
|-----------------|-------------------|---------------|----------------------------------------------------------------------------------------------|
| `x.let { … }`   | `it`              | Lambda result | Perform null checks in your code and later perform further actions with the returned object. |
| `x.apply { … }` | `this`            | `x`           | Initialize objects at the time of creation.                                                  |
| `x.run { … }`   | `this`            | Lambda result | Initialize objects at the time of creation **AND** compute a result.                         |
| `x.also { … }`  | `it`              | `x`           | Complete additional actions before returning the object.                                     |
| `with(x) { … }` | `this`            | Lambda result | Call multiple functions on an object.                                                        |

For more information about scope functions, see [Scope functions](scope-functions.md).

## Scope functions practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-1"}

Rewrite the `getPriceInEuros` function as a single-expression function that uses Elvis operators `?.` and the `.let()` scope function.

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
        Price in Euros: €85.0
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

You have an `updateEmail` function that updates the email address of one of your users. Use the `.apply()` scope function
to update the email address and the `.also()` scope function to print a log message: `Updating email for user with ID: ${it.id}`.

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

## Lambda expressions with receiver

In the beginner's tour, you learned how to use [lambda expressions](kotlin-tour-functions.md#lambda-expressions). Lambda expressions can also have a receiver, 
which means that the lambda expression can access any member functions or properties of the receiver object without having
to explicitly specify it each time. Without these additional references, your code is easier to read and maintain.

The syntax for a lambda expression with receiver is different when you define the function type: write the receiver object
that you want to extend followed by a `.` and the rest of your function type definition. For example: `MutableList<Int>.() -> Unit`.

This function type has:

* `MutableList<Int>` as the receiver type.
* No function parameters within the parentheses `()`.
* No return value: `Unit`.

> Lambda expressions with receiver are also called function literals with receiver.
>

Consider this example that extends the `StringBuilder` class:

```kotlin
fun main() {
    // Lambda expression with receiver definition
    fun StringBuilder.appendText() { append("Hello!") }
    }

    // Use the lambda expression with receiver
    val stringBuilder = StringBuilder()
    stringBuilder.appendText()
    println(stringBuilder.toString())  
    // Hello!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver"}

In this example:
* The `StringBuilder` class is the receiver type.
* The function type of the lambda expression has no function parameters `()` and has no return value `Unit`.
* The lambda expression calls the `append()` member function from the `StringBuilder` class and uses the string "Hello!" as the function parameter.

|---|---|

* An instance of the `StringBuilder` class is created.
* The lambda expression assigned to `appendText` is called on the `stringBuilder` instance.
* The `stringBuilder` instance is converted to string with the `.toString()` function and printed via the `println()` function.

Lambda expressions with receiver are helpful when you want to create a domain-specific language (DSL). Since you have
access to the receiver object's member functions and properties without explicitly referencing the receiver, your code 
becomes more concise and easier to read.

To demonstrate this, consider an example that configures items in a menu. Let's begin with a `MenuItem` class, and a 
`Menu` class that contains a function to add items to the menu called `item()` as well as a list of all menu items `items`:

```kotlin
class MenuItem(val name: String)

class Menu(val name: String) {
  val items = mutableListOf<MenuItem>()

  fun item(name: String) {
    items.add(MenuItem(name))
  }
}
```

Let's use a lambda expression with receiver passed as a function parameter (`init`) to the `menu()` function that builds 
a menu as a starting point. You'll notice that the code follows a similar approach to the previous example with the 
`StringBuilder` class:

```kotlin
fun menu(name: String, init: Menu.() -> Unit): Menu {
    // Creates an instance of the Menu class
    val menu = Menu(name)
    // Calls the lambda expression with receiver init() on the class instance
    menu.init()
    return menu
}
```

Now you can use the DSL to configure a menu and create a `printMenu()` function to print the menu structure to console:

```kotlin
class MenuItem(val name: String)

class Menu(val name: String) {
  val items = mutableListOf<MenuItem>()

  fun item(name: String) {
    items.add(MenuItem(name))
  }
}

fun menu(name: String, init: Menu.() -> Unit): Menu {
  val menu = Menu(name)
  menu.init()
  return menu
}

//sampleStart
fun printMenu(menu: Menu) {
  println("Menu: ${menu.name}")
  menu.items.forEach { println("  Item: ${it.name}") }
}

// Use the DSL
fun main() {
    // Create the menu
    val mainMenu = menu("Main Menu") {
        // Add items to the menu
        item("Home")
        item("Settings")
        item("Exit")
    }
    
    // Print the menu
    printMenu(mainMenu)
    // Menu: Main Menu
      // Item: Home
      // Item: Settings
      // Item: Exit
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver-dsl"}

As you can see, using a lambda expression with receiver greatly simplifies the code needed to create your menu. Lambda 
expressions are not only useful for setup and creation but also for configuration. They are commonly used in building 
DSLs for APIs, UI frameworks and configuration builders to produce streamlined code, allowing you to focus more easily 
on the underlying code structure and logic.

Kotlin's ecosystem has many examples of this design pattern, such as in the [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)
and [`buildString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) functions from the 
standard library.

> Lambda expressions with receivers can be combined with **type-safe builders** in Kotlin to make DSLs that detect any problems
> with types at compile time rather than at runtime. To learn more, see [Type-safe builders](type-safe-builders.md).
>
{style="note"}

## Lambda expressions with receiver practice

### Exercise 1 {initial-collapse-state="collapsed" id="lambda-receivers-exercise-1"}

You have a `fetchData` function that accepts a lambda expression with receiver. Update the lambda expression to use 
the `append()` function so that the output of your code is: `Data received - Processed`.

|---|---|
```kotlin
fun fetchData(callback: StringBuilder.() -> Unit) {
    val builder = StringBuilder("Data received")
    builder.callback()
}

fun main() {
    fetchData {
        // Write your code here
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-receivers-exercise-1"}

|---|---|
```kotlin
fun fetchData(callback: StringBuilder.() -> Unit) {
    val builder = StringBuilder("Data received")
    builder.callback()
}

fun main() {
    fetchData {
        append(" - Processed")
        println(this.toString())
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-lambda-receievers-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" id="lambda-receivers-exercise-2"}

You have a `Button` class and `ButtonEvent` and `Position` data classes. Write some code that triggers the `onEvent()`
member function of the `Button` class to trigger a double-click event. Your code should print `"Double click!"`.

```kotlin
class Button {
    fun onEvent(action: ButtonEvent.() -> Unit) {
        // Simulate a double-click event (not a right-click)
        val event = ButtonEvent(isRightClick = false, amount = 2, position = Position(100, 200))
        event.action() // Trigger the event callback
    }
}

data class ButtonEvent(
    val isRightClick: Boolean,
    val amount: Int,
    val position: Position
)

data class Position(
    val x: Int,
    val y: Int
)

fun main() {
    val button = Button()
    
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-receivers-exercise-2"}

|---|---|
```kotlin
class Button {
    fun onEvent(action: ButtonEvent.() -> Unit) {
        // Simulate a double-click event (not a right-click)
        val event = ButtonEvent(isRightClick = false, amount = 2, position = Position(100, 200))
        event.action() // Trigger the event callback
    }
}

data class ButtonEvent(
    val isRightClick: Boolean,
    val amount: Int,
    val position: Position
)

data class Position(
    val x: Int,
    val y: Int
)

fun main() {
    val button = Button()
    
    button.onEvent {
        if (!isRightClick && amount == 2) {
            println("Double click!")
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-lambda-receievers-solution-2"}

### Exercise 3 {initial-collapse-state="collapsed" id="lambda-receivers-exercise-3"}

Write a function that creates a copy of a list of integers where every element is incremented by 1. Use the provided 
function skeleton that extends `List<Int>` with an `incremented` function.

```kotlin
fun List<Int>.incremented(): List<Int> {
    val originalList = this
    return buildList {
        // Write your code here
    }
}

fun main() {
    val originalList = listOf(1, 2, 3)
    val newList = originalList.incremented()
    println(newList)
    // [2, 3, 4]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-receivers-exercise-3"}

|---|---|
```kotlin
fun List<Int>.incremented(): List<Int> {
    val originalList = this
    return buildList {
        for (n in originalList) add(n + 1)
    }
}

fun main() {
    val originalList = listOf(1, 2, 3)
    val newList = originalList.incremented()
    println(newList)
    // [2, 3, 4]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-lambda-receievers-solution-3"}

## Next step

<!-- [Intermediate classes](kotlin-tour-intermediate-classes.md) -->