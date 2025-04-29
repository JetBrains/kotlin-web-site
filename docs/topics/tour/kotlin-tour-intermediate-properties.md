[//]: # (title: Intermediate: Properties)

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">Extension functions</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">Scope functions</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">Lambda expressions with receiver</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">Classes and interfaces</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">Objects</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">Open and special classes</a><br />
        <img src="icon-7.svg" width="20" alt="Seventh step" /> <strong>Properties</strong><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null safety</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">Libraries and APIs</a></p>
</tldr>

In the beginner tour, you learned how properties are used to declare characteristics of class instances and how to access
them. This chapter digs deeper into how properties work in Kotlin and explores other ways that you can use them in your code.

## Backing fields

In Kotlin, properties have default `get()` and `set()` functions, known as property accessors, which handle retrieving 
and modifying their values. While these default functions are not explicitly visible in the code, the compiler automatically
generates them to manage property access behind the scenes. These accessors use a **backing field** to store 
the actual property value.

Backing fields exist if either of the following is true:

* You use the default `get()` or `set()` functions for the property.
* You try to access the property value in code by using the `field` keyword.

> `get()` and `set()` functions are also called getters and setters.
>
{style="tip"}

For example, this code has the `category` property that has no custom `get()` or `set()` functions and therefore uses the
default implementations:

```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

Under the hood, this is equivalent to this pseudocode:

```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
        get() = field
        set(value) {
            field = value
        }
}
```
{validate="false"}

In this example:

* The `get()` function retrieves the property value from the field: `""`.
* The `set()` function accepts `value` as a parameter and assigns it to the field, where `value` is `""`. 

Access to the backing field is useful when you want to add extra logic in your `get()` or `set()` functions 
without causing an infinite loop. For example, you have a `Person` class with a `name` property:


```kotlin
class Person {
    var name: String = ""
}
```

You want to ensure that the first letter of the `name` property is capitalized, so you create a custom `set()` function
that uses the [`.replaceFirstChar()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace-first-char.html) 
and [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase-char.html) extension functions. 
However, if you refer to the property directly in your `set()` function, you create an infinite loop and see a `StackOverflowError`
at runtime:

```kotlin
class Person {
    var name: String = ""
        set(value) {
            // This causes a runtime error
            name = value.replaceFirstChar { firstChar -> firstChar.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
    // Exception in thread "main" java.lang.StackOverflowError
}
```
{validate ="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-stackoverflow"}

To fix this, you can use the backing field in your `set()` function instead by referencing it with the `field` keyword:

```kotlin
class Person {
    var name: String = ""
        set(value) {
            field = value.replaceFirstChar { firstChar -> firstChar.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
    // Kodee
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-backingfield"}

Backing fields are also useful when you want to add logging, send notifications when a property value changes,
or use additional logic that compares the old and new property values.

For more information, see [Backing fields](properties.md#backing-fields).

## Extension properties

Just like extension functions, there are also extension properties. Extension properties allow you to add new properties
to existing classes without modifying their source code. However, extension properties in Kotlin do **not** have backing
fields. This means that you need to write the `get()` and `set()` functions yourself. Additionally, the lack of a backing
field means that they can't hold any state.

To declare an extension property, write the name of the class that you want to extend followed by a `.` and the name of
your property. Just like with normal class properties, you need to declare a receiver type for your property. 
For example:

```kotlin
val String.lastChar: Char
```
{validate="false"}

Extension properties are most useful when you want a property to contain a computed value without using inheritance.
You can think of extension properties working like a function with only one parameter: the receiver object.

For example, let's say that you have a data class called `Person` with two properties: `firstName` and `lastName`.

```kotlin
data class Person(val firstName: String, val lastName: String)
```

You want to be able to access the person's full name without modifying the `Person` data class or inheriting from it.
You can do this by creating an extension property with a custom `get()` function:

```kotlin
data class Person(val firstName: String, val lastName: String)

// Extension property to get the full name
val Person.fullName: String
    get() = "$firstName $lastName"

fun main() {
    val person = Person(firstName = "John", lastName = "Doe")

    // Use the extension property
    println(person.fullName)
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-extension"}

> Extension properties can't override existing properties of a class.
> 
{style="note"}

Just like with extension functions, the Kotlin standard library uses extension properties widely. For example,
see the [`lastIndex` property](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/last-index.html) for a `CharSequence`.

## Delegated properties

You already learned about delegation in the [Classes and interfaces](kotlin-tour-intermediate-classes-interfaces.md#delegation) chapter. You can
also use delegation with properties to delegate their property accessors to another object. This is useful
when you have more complex requirements for storing properties that a simple backing field can't handle, such as storing
values in a database table, browser session, or map. Using delegated properties also reduces boilerplate code because the
logic for getting and setting your properties is contained only in the object that you delegate to.

The syntax is similar to using delegation with classes but operates on a different level. Declare your property, followed by
the `by` keyword and the object you want to delegate to. For example:

```kotlin
val displayName: String by Delegate
```

Here, the delegated property `displayName` refers to the `Delegate` object for its property accessors.

Every object you delegate to **must** have a `getValue()` operator function, which Kotlin uses to retrieve the value of 
the delegated property. If the property is mutable, it must also have a `setValue()` operator function for Kotlin to set its value.

By default, the `getValue()` and `setValue()` functions have the following construction:

```kotlin
operator fun getValue(thisRef: Any?, property: KProperty<*>): String {}

operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {}
```
{validate="false"}

In these functions:

* The `operator` keyword marks these functions as operator functions, enabling them to overload the `get()` and `set()` functions.
* The `thisRef` parameter refers to the object **containing** the delegated property. By default, the type is set to `Any?`, but you may need to declare a more specific type.
* The `property` parameter refers to the property whose value is accessed or changed. You can use this parameter to access information
like the property's name or type. By default, the type is set to `Any?`. You don't need to worry about changing this in your code.

The `getValue()` function has a return type of `String` by default, but you can adjust this if you want.

The `setValue()` function has an additional parameter `value`, which is used to hold the new value that's assigned to the
property.

So, how does this look in practice? Suppose you want to have a computed property, like a user's display name, that is calculated
only once because the operation is expensive and your application is performance-sensitive. You can use a delegated property
to cache the display name so that it is only computed once but can be accessed anytime without performance impact.

First, you need to create the object to delegate to. In this case, the object will be an instance of the `CachedStringDelegate` class:

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null
}
```

The `cachedValue` property contains the cached value. Within the `CachedStringDelegate` class, add the behavior that you
want from the `get()` function of the delegated property to the `getValue()` operator function body:

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null

    operator fun getValue(thisRef: Any?, property: Any?): String {
        if (cachedValue == null) {
            cachedValue = "Default Value"
            println("Computed and cached: $cachedValue")
        } else {
            println("Accessed from cache: $cachedValue")
        }
        return cachedValue ?: "Unknown"
    }
}
```

The `getValue()` function checks whether the `cachedValue` property is `null`. If it is, the function assigns the
`"Default value"` and prints a string for logging purposes. If the `cachedValue` property has already been computed, the
property isn't `null`. In this case, another string is printed for logging purposes. Finally, the function uses the Elvis
operator to return the cached value or `"Unknown"` if the value is `null`.

Now you can delegate the property that you want to cache (`val displayName`) to an instance of the `CachedStringDelegate` class:

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null

    operator fun getValue(thisRef: User, property: Any?): String {
        if (cachedValue == null) {
            cachedValue = "${thisRef.firstName} ${thisRef.lastName}"
            println("Computed and cached: $cachedValue")
        } else {
            println("Accessed from cache: $cachedValue")
        }
        return cachedValue ?: "Unknown"
    }
}

class User(val firstName: String, val lastName: String) {
    val displayName: String by CachedStringDelegate()
}

fun main() {
    val user = User("John", "Doe")

    // First access computes and caches the value
    println(user.displayName)
    // Computed and cached: John Doe
    // John Doe

    // Subsequent accesses retrieve the value from cache
    println(user.displayName)
    // Accessed from cache: John Doe
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-delegated"}

This example:

* Creates a `User` class that has two properties in the header, `firstName`, and `lastName`, and one property in the
class body, `displayName`.
* Delegates the `displayName` property to an instance of the `CachedStringDelegate` class.
* Creates an instance of the `User` class called `user`.
* Prints the result of accessing the `displayName` property on the `user` instance.

Note that in the `getValue()` function, the type for the `thisRef` parameter is narrowed from `Any?` type to the object
type: `User`. This is so that the compiler can access the `firstName` and `lastName` properties of the `User` class.

### Standard delegates

The Kotlin standard library provides some useful delegates for you so you don't have to always create yours from scratch.
If you use one of these delegates, you don't need to define `getValue()` and `setValue()` functions because the standard
library automatically provides them.

#### Lazy properties

To initialize a property only when it's first accessed, use a lazy property. The standard library provides the `Lazy`
interface for delegation. 

To create an instance of the `Lazy` interface, use the `lazy()` function by providing it
with a lambda expression to execute when the `get()` function is called for the first time. Any further calls of the `get()`
function return the same result that was provided on the first call. Lazy properties use the [trailing lambda](kotlin-tour-functions.md#trailing-lambdas) syntax
to pass the lambda expression.

For example:

```kotlin
class Database {
    fun connect() {
        println("Connecting to the database...")
    }

    fun query(sql: String): List<String> {
        return listOf("Data1", "Data2", "Data3")
    }
}

val databaseConnection: Database by lazy {
    val db = Database()
    db.connect()
    db
}

fun fetchData() {
    val data = databaseConnection.query("SELECT * FROM data")
    println("Data: $data")
}

fun main() {
    // First time accessing databaseConnection
    fetchData()
    // Connecting to the database...
    // Data: [Data1, Data2, Data3]

    // Subsequent access uses the existing connection
    fetchData()
    // Data: [Data1, Data2, Data3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-lazy"}

In this example:

* There is a `Database` class with `connect()` and `query()` member functions. 
* The `connect()` function prints a string to the console, and the `query()` function accepts an SQL query and returns a list.
* There is a `databaseConnection` property that is a lazy property.
* The lambda expression provided to the `lazy()` function:
  * Creates an instance of the `Database` class.
  * Calls the `connect()` member function on this instance (`db`).
  * Returns the instance.
* There is a `fetchData()` function that:
  * Creates an SQL query by calling the `query()` function on the `databaseConnection` property.
  * Assigns the SQL query to the `data` variable.
  * Prints the `data` variable to the console.
* The `main()` function calls the `fetchData()` function. The first time it is called, the lazy property is initialized.
The second time, the same result is returned as the first call.

Lazy properties are useful not only when initialization is resource-intensive but also when a property might not be used
in your code. Additionally, lazy properties are thread-safe by default, which is particularly beneficial if you are working
in a concurrent environment.

For more information, see [Lazy properties](delegated-properties.md#lazy-properties).

#### Observable properties

To monitor whether the value of a property changes, use an observable property. An observable property is useful when
you want to detect a change in the property value and use this knowledge to trigger a reaction. The standard library provides
the `Delegates` object for delegation.

To create an observable property, you must first import `kotlin.properties.Delegates.observable`. Then, use the `observable()` function
and provide it with a lambda expression to execute whenever the property changes. Just like with lazy properties, observable
properties use the [trailing lambda](kotlin-tour-functions.md#trailing-lambdas) syntax to pass the lambda expression.

For example:

```kotlin
import kotlin.properties.Delegates.observable

class Thermostat {
    var temperature: Double by observable(20.0) { _, old, new ->
        if (new > 25) {
            println("Warning: Temperature is too high! ($old°C -> $new°C)")
        } else {
            println("Temperature updated: $old°C -> $new°C")
        }
    }
}

fun main() {
    val thermostat = Thermostat()
    thermostat.temperature = 22.5
    // Temperature updated: 20.0°C -> 22.5°C

    thermostat.temperature = 27.0
    // Warning: Temperature is too high! (22.5°C -> 27.0°C)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-observable"}

In this example:

* There is a `Thermostat` class that contains an observable property: `temperature`.
* The `observable()` function accepts `20.0` as a parameter and uses it to initialize the property.
* The lambda expression provided to the `observable()` function:
  * Has three parameters:
    * `_`, which refers to the property itself.
    * `old`, which is the old value of the property.
    * `new`, which is the new value of the property.
  * Checks if the `new` parameter is greater than `25` and, depending on the result, prints a string to console.
* The `main()` function:
  * Creates an instance of the `Thermostat` class called `thermostat`.
  * Updates the value of the `temperature` property of the instance to `22.5`, which triggers a print statement with a temperature update.
  * Updates the value of the `temperature` property of the instance to `27.0`, which triggers a print statement with a warning.

Observable properties are useful not only for logging and debugging purposes. You can also use them for use cases like
updating a UI or to perform additional checks, like verifying the validity of data.

For more information, see [Observable properties](delegated-properties.md#observable-properties).

## Practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-1"}

You manage an inventory system at a bookstore. The inventory is stored in a list where each item represents the quantity
of a specific book. For example, `listOf(3, 0, 7, 12)` means the store has 3 copies of the first book, 0 of the second,
7 of the third, and 12 of the fourth.

Write a function called `findOutOfStockBooks()` that returns a list of indices for all the books that are out of stock.

<deflist collapsible="true">
    <def title="Hint 1">
        Use the <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/indices.html"><code>indices</code></a> extension property from the standard library.
    </def>
</deflist>

<deflist collapsible="true">
    <def title="Hint 2">
        You can use the <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/build-list.html"><code>buildList()</code></a> function to create and manage a list instead of manually creating and returning a mutable list. The <code>buildList()</code> function uses a lambda with a receiver, which you learned about in earlier chapters.
    </def>
</deflist>

|--|--|

```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    // Write your code here
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-1"}

|---|---|
```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    val outOfStockIndices = mutableListOf<Int>()
    for (index in inventory.indices) {
        if (inventory[index] == 0) {
            outOfStockIndices.add(index)
        }
    }
    return outOfStockIndices
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution 1" id="kotlin-tour-properties-solution-1-1"}

|---|---|
```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> = buildList {
    for (index in inventory.indices) {
        if (inventory[index] == 0) {
            add(index)
        }
    }
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution 2" id="kotlin-tour-properties-solution-1-2"}

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-2"}

You have a travel app that needs to display distances in both kilometers and miles. Create an extension property for the
`Double` type called `asMiles` to convert a distance in kilometers to miles:

> The formula to convert kilometers to miles is `miles = kilometers * 0.621371`.
>
{style="note"}

<deflist collapsible="true">
    <def title="Hint">
        Remember that extension properties need a custom <code>get()</code> function.
    </def>
</deflist>

|---|---|

```kotlin
val // Write your code here

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${distanceKm.asMiles} miles")
    // 5.0 km is 3.106855 miles

    val marathonDistance = 42.195
    println("$marathonDistance km is ${marathonDistance.asMiles} miles")
    // 42.195 km is 26.218757 miles
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-2"}

|---|---|
```kotlin
val Double.asMiles: Double
    get() = this * 0.621371

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${distanceKm.asMiles} miles")
    // 5.0 km is 3.106855 miles

    val marathonDistance = 42.195
    println("$marathonDistance km is ${marathonDistance.asMiles} miles")
    // 42.195 km is 26.218757 miles
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-properties-solution-2"}

### Exercise 3 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-3"}

You have a system health checker that can determine the state of a cloud system. However, the two functions it can run 
to perform a health check are performance intensive. Use lazy properties to initialize the checks so that the expensive
functions are only run when needed:

|---|---|

```kotlin
fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    // Write your code here

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
    // Performing application server health check...
    // Application server is online and healthy
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-3"}

|---|---|
```kotlin
fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    val isAppServerHealthy by lazy { checkAppServer() }
    val isDatabaseHealthy by lazy { checkDatabase() }

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
   // Performing application server health check...
   // Application server is online and healthy
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-properties-solution-3"}

### Exercise 4 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-4"}

You're building a simple budget tracker app. The app needs to observe changes to the user's remaining budget and notify
them whenever it goes below a certain threshold. You have a `Budget` class that is initialized with a `totalBudget` property
that contains the initial budget amount. Within the class, create an observable property called `remainingBudget` that prints:

* A warning when the value is lower than 20% of the initial budget.
* An encouraging message when the budget is increased from the previous value.

|---|---|

```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
    var remainingBudget: Int // Write your code here
}

fun main() {
    val myBudget = Budget(totalBudget = 1000)
    myBudget.remainingBudget = 800
    myBudget.remainingBudget = 150
    // Warning: Your remaining budget (150) is below 20% of your total budget.
    myBudget.remainingBudget = 50
    // Warning: Your remaining budget (50) is below 20% of your total budget.
    myBudget.remainingBudget = 300
    // Good news: Your remaining budget increased to 300.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-4"}

|---|---|
```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
  var remainingBudget: Int by observable(totalBudget) { _, oldValue, newValue ->
    if (newValue < totalBudget * 0.2) {
      println("Warning: Your remaining budget ($newValue) is below 20% of your total budget.")
    } else if (newValue > oldValue) {
      println("Good news: Your remaining budget increased to $newValue.")
    }
  }
}

fun main() {
  val myBudget = Budget(totalBudget = 1000)
  myBudget.remainingBudget = 800
  myBudget.remainingBudget = 150
  // Warning: Your remaining budget (150) is below 20% of your total budget.
  myBudget.remainingBudget = 50
  // Warning: Your remaining budget (50) is below 20% of your total budget.
  myBudget.remainingBudget = 300
  // Good news: Your remaining budget increased to 300.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-properties-solution-4"}

## Next step

[Intermediate: Null safety](kotlin-tour-intermediate-null-safety.md)