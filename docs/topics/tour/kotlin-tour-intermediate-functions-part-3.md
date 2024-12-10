[//]: # (title: Intermediate: Lambda expressions with receiver)

In this chapter, you'll learn how to use receiver objects with another type of function, lambda expressions, and how they
can make your code more concise and readable.

## Lambda expressions with receiver

In the beginner's tour, you learned how to use [lambda expressions](kotlin-tour-functions.md#lambda-expressions). Lambda expressions can also have a receiver, 
which means that the lambda expression can access any member functions or properties of the receiver object without having
to explicitly specify it each time. Without these additional references, your code is easier to read and maintain.

> Lambda expressions with receiver are also called function literals with receiver.
>

The syntax for a lambda expression with receiver is different when you define the function type. First, write the receiver
object that you want to extend. Next, put a `.` and then complete the rest of your function type definition. For example:
`MutableList<Int>.() -> Unit`.

This function type has:

* `MutableList<Int>` as the receiver type.
* No function parameters within the parentheses `()`.
* No return value: `Unit`.

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
* The lambda expression calls the `append()` member function from the `StringBuilder` class and uses the string `"Hello!"` as the function parameter.
* An instance of the `StringBuilder` class is created.
* The lambda expression assigned to `appendText` is called on the `stringBuilder` instance.
* The `stringBuilder` instance is converted to string with the `.toString()` function and printed via the `println()` function.

Lambda expressions with receiver are helpful when you want to create a domain-specific language (DSL). Since you have
access to the receiver object's member functions and properties without explicitly referencing the receiver, your code 
becomes more concise and easier to read.

To demonstrate this, consider an example that configures items in a menu. Let's begin with a `MenuItem` class and a 
`Menu` class that contains a function to add items to the menu called `item()`, as well as a list of all menu items `items`:

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

Now you can use the DSL to configure a menu and create a `printMenu()` function to print the menu structure to the console:

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
DSLs for APIs, UI frameworks, and configuration builders to produce streamlined code, allowing you to focus more easily 
on the underlying code structure and logic.

Kotlin's ecosystem has many examples of this design pattern, such as in the [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)
and [`buildString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) functions from the 
standard library.

> Lambda expressions with receivers can be combined with **type-safe builders** in Kotlin to make DSLs that detect any problems
> with types at compile time rather than at runtime. To learn more, see [Type-safe builders](type-safe-builders.md).
>
{style="note"}

## Practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-1"}

You have a `fetchData()` function that accepts a lambda expression with receiver. Update the lambda expression to use 
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

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-2"}

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

### Exercise 3 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-3"}

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

[Classes and interfaces](kotlin-tour-intermediate-classes-part-1.md)