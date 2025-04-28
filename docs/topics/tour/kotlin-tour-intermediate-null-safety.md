[//]: # (title: Intermediate: Null safety)

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">Extension functions</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">Scope functions</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">Lambda expressions with receiver</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">Classes and interfaces</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">Objects</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">Open and special classes</a><br />
        <img src="icon-7-done.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">Properties</a><br />
        <img src="icon-8.svg" width="20" alt="Eighth step" /> <strong>Null safety</strong><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">Libraries and APIs</a></p>
</tldr>

In the beginner tour, you learned how to handle `null` values in your code. This chapter covers common use cases for null
safety features and how to make the most of them.

## Smart casts and safe casts

Kotlin can sometimes infer the type without explicit declaration. When you tell Kotlin to treat a variable or object as if it belongs to a
specific type, this process is called **casting**. When a type is automatically cast, like when it's inferred, it's called
**smart casting**.

### is and !is operators

Before we explore how casting works, let's see how you can check if an object has a certain type. For this, you can use the
`is` and `!is` operators with `when` or `if` conditional expressions:

* `is` checks if the object has the type and returns a boolean value.
* `!is` checks if the object **doesn't** have the type and returns a boolean value.

For example:

```kotlin
fun printObjectType(obj: Any) {
    when (obj) {
        is Int -> println("It's an Integer with value $obj")
        !is Double -> println("It's NOT a Double")
        else -> println("Unknown type")
    }
}

fun main() {
    val myInt = 42
    val myDouble = 3.14
    val myList = listOf(1, 2, 3)
  
    // The type is Int
    printObjectType(myInt)
    // It's an Integer with value 42

    // The type is List, so it's NOT a Double.
    printObjectType(myList)
    // It's NOT a Double

    // The type is Double, so the else branch is triggered.
    printObjectType(myDouble)
    // Unknown type
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-casts"}

> You've already seen an example of how to use a `when` conditional expression with the `is` and `!is` operators in the [Open and other special classes](kotlin-tour-intermediate-open-special-classes.md#sealed-classes) chapter.
> 
{style="tip"}

### as and as? operators

To explicitly _cast_ an object to any other type, use the `as` operator. This includes casting from a nullable 
type to its non-nullable counterpart. If the cast isn't possible, the program crashes **at runtime**. This is why it's 
called the **unsafe** cast operator.

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as String

    // Triggers an error at runtime
    print(b)
//sampleEnd
}
```
{kotlin-runnable="true" validate="false" id="kotlin-tour-null-safety-as-operator"}

To explicitly cast an object to a non-nullable type, but return `null` instead of throwing an error on failure, use the `as?`
operator. Since the `as?` operator doesn't trigger an error on failure, it is called the **safe** operator.

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as? String

    // Returns null value
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-safe-operator"}

You can combine the `as?` operator with the Elvis operator `?:` to reduce several lines of code down to one. For example,
the following `calculateTotalStringLength()` function calculates the total length of all strings provided in a mixed list:

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    var totalLength = 0

    for (item in items) {
        totalLength += if (item is String) {
            item.length
        } else {
            0  // Add 0 for non-String items
        }
    }

    return totalLength
}
```

The example:

* Uses the `totalLength` variable as a counter.
* Uses a `for` loop to loop through every item in the list.
* Uses an `if` and the `is` operator to check if the current item is a string:
  * If it is, the string's length is added to the counter.
  * If it is not, the counter isn't incremented.
* Returns the final value of the `totalLength` variable.

This code can be reduced to:

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    return items.sumOf { (it as? String)?.length ?: 0 }
}
```

The example uses the [`.sumOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sum-of.html) extension function and provides a lambda expression that:

* For each item in the list, performs a safe cast to `String` using `as?`.
* Uses a safe call `?.` to access the `length` property if the call doesn't return a `null` value.
* Uses the Elvis operator `?:` to return `0` if the safe call returns a `null` value.

## Null values and collections

In Kotlin, working with collections often involves handling `null` values and filtering out unnecessary elements. Kotlin
has useful functions that you can use to write clean, efficient, and null-safe code when working with lists, sets, maps,
and other types of collections.

To filter `null` values from a list, use the [`filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html) function:

```kotlin
fun main() {
//sampleStart
    val emails: List<String?> = listOf("alice@example.com", null, "bob@example.com", null, "carol@example.com")

    val validEmails = emails.filterNotNull()

    println(validEmails)
    // [alice@example.com, bob@example.com, carol@example.com]
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-filternotnull"}

If you want to perform filtering of `null` values directly when creating a list, use the [`listOfNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/list-of-not-null.html) function:

```kotlin
fun main() {
//sampleStart
    val serverConfig = mapOf(
        "appConfig.json" to "App Configuration",
        "dbConfig.json" to "Database Configuration"
    )

    val requestedFile = "appConfig.json"
    val configFiles = listOfNotNull(serverConfig[requestedFile])

    println(configFiles)
    // [App Configuration]
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-listofnotnull"}

In both of these examples, if all items are `null` values, an empty list is returned.

Kotlin also provides functions that you can use to find values in collections. If a value isn't found, they return `null`
values instead of triggering an error:

* [`singleOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/single-or-null.html) looks for only one item by its exact value. If one doesn't exist or there are multiple items with the same value, returns a `null` value.
* [`maxOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-or-null.html) finds the highest value. If one doesn't exist, returns a `null` value.
* [`minOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/min-or-null.html) finds the lowest value. If one doesn't exist, returns a `null` value.

For example:

```kotlin
fun main() {
//sampleStart
    // Temperatures recorded over a week
    val temperatures = listOf(15, 18, 21, 21, 19, 17, 16)

    // Check if there was exactly one day with 30 degrees
    val singleHotDay = temperatures.singleOrNull()
    println("Single hot day with 30 degrees: ${singleHotDay ?: "None"}")
    // Single hot day with 30 degrees: None

    // Find the highest temperature of the week
    val maxTemperature = temperatures.maxOrNull()
    println("Highest temperature recorded: ${maxTemperature ?: "No data"}")
    // Highest temperature recorded: 21

    // Find the lowest temperature of the week
    val minTemperature = temperatures.minOrNull()
    println("Lowest temperature recorded: ${minTemperature ?: "No data"}")
    // Lowest temperature recorded: 15
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-collections"}

This example uses the Elvis operator `?:` to return a printed statement if the functions return a `null` value.

> The `singleOrNull()`, `maxOrNull()`, and `minOrNull()` functions are designed to be used with collections that **don't**
> contain `null` values. Otherwise, you can't tell whether the function couldn't find the desired value or whether it
> found a `null` value.
>
{style="note"}

Some functions use a lambda expression to transform a collection and return `null` values if they can't 
fulfill their purpose.

For example, to transform a collection with a lambda expression and return the first value that isn't `null`, use the 
[`firstNotNullOfOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first-not-null-of-or-null.html) function. If no such value exists, the function returns a `null` value:

```kotlin
fun main() {
//sampleStart
    data class User(val name: String?, val age: Int?)

    val users = listOf(
        User(null, 25),
        User("Alice", null),
        User("Bob", 30)
    )

    val firstNonNullName = users.firstNotNullOfOrNull { it.name }
    println(firstNonNullName)
    // Alice
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-firstnotnullofornull"}

To use a lambda function to process each collection item sequentially and create an accumulated value (or return a 
`null` value if the collection is empty) use the [`reduceOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce-or-null.html) function:

```kotlin
fun main() {
//sampleStart
    // Prices of items in a shopping cart
    val itemPrices = listOf(20, 35, 15, 40, 10)

    // Calculate the total price using the reduceOrNull() function
    val totalPrice = itemPrices.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("Total price of items in the cart: ${totalPrice ?: "No items"}")
    // Total price of items in the cart: 120

    val emptyCart = listOf<Int>()
    val emptyTotalPrice = emptyCart.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("Total price of items in the empty cart: ${emptyTotalPrice ?: "No items"}")
    // Total price of items in the empty cart: No items
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-reduceornull"}

This example also uses the Elvis operator `?:` to return a printed statement if the function returns a `null` value.

> The `reduceOrNull()` function is designed to be used with collections that **don't** contain `null` values.
>
{style="note"}

Explore Kotlin's [standard library](https://kotlinlang.org/api/core/kotlin-stdlib/) to find more functions that you can 
use to make your code safer.

## Early returns and the Elvis operator

In the beginner tour, you learned how to use [early returns](kotlin-tour-functions.md#early-returns-in-functions) to stop
your function from being processed further than a certain point. You can use the Elvis operator `?:` with an early return
to check preconditions in a function. This approach is a great way to keep your code concise because you don't need to use
nested checks. The reduced complexity of your code also makes it easier to maintain. For example:

```kotlin
data class User(
    val id: Int,
    val name: String,
    // List of friend user IDs
    val friends: List<Int>
)

// Function to get the number of friends for a user
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // Retrieves the user or return -1 if not found
    val user = users[userId] ?: return -1
    // Returns the number of friends
    return user.friends.size
}

fun main() {
    // Creates some sample users
    val user1 = User(1, "Alice", listOf(2, 3))
    val user2 = User(2, "Bob", listOf(1))
    val user3 = User(3, "Charlie", listOf(1))

    // Creates a map of users
    val users = mapOf(1 to user1, 2 to user2, 3 to user3)

    println(getNumberOfFriends(users, 1))
    // 2
    println(getNumberOfFriends(users, 2))
    // 1
    println(getNumberOfFriends(users, 4))
    // -1
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-early-return"}

In this example:

* There is a `User` data class that has properties for the user's `id`, `name` and list of friends.
* The `getNumberOfFriends()` function:
  * Accepts a map of `User` instances and a user ID as an integer.
  * Accesses the value of the map of `User` instances with the provided user ID.
  * Uses an Elvis operator to return the function early with the value of `-1` if the map value is a `null` value.
  * Assigns the value found from the map to the `user` variable.
  * Returns the number of friends in the user's friends list by using the `size` property.
* The `main()` function:
  * Creates three `User` instances. 
  * Creates a map of these `User` instances and assigns them to the `users` variable. 
  * Calls the `getNumberOfFriends()` function on the `users` variable with values `1` and `2` that returns two friends for `"Alice"` and one friend for `"Bob"`.
  * Calls the `getNumberOfFriends()` function on the `users` variable with value `4`, which triggers an early return with a value of `-1`.

You may notice that the code could be more concise without an early return. However, this approach needs multiple safe 
calls because the `users[userId]` might return a `null` value, making the code slightly harder to read:

```kotlin
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // Retrieve the user or return -1 if not found
    return users[userId]?.friends?.size ?: -1
}
```
{validate="false"}

Although this example checks only one condition with the Elvis operator, you can add multiple checks to cover any critical
error paths. Early returns with the Elvis operator prevent your program from doing unnecessary work and make your code 
safer by stopping as soon as a `null` value or invalid case is detected.

For more information about how you can use `return` in your code, see [Returns and jumps](returns.md).

## Null safety practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-1"}

You are developing a notification system for an app where users can enable or disable different types of notifications.
Complete the `getNotificationPreferences()` function so that:

1. The `validUser` variable uses the `as?` operator to check if `user` is an instance of the `User` class. If it isn't, return an empty list.
2. The `userName` variable uses the Elvis `?:` operator to ensure that the user's name defaults to `"Guest"` if it is `null`.
3. The final return statement uses the `.takeIf()` function to include email and SMS notification preferences only if they are enabled.
4. The `main()` function runs successfully and prints the expected output.

> The [`takeIf()` function](scope-functions.md#takeif-and-takeunless) returns the original value if the given condition is true,
> otherwise it returns `null`. For example:
>
> ```kotlin
> fun main() {
>     // The user is logged in
>     val userIsLoggedIn = true
>     // The user has an active session
>     val hasSession = true
> 
>     // Gives access to the dashboard if the user is logged in
>     // and has an active session
>     val canAccessDashboard = userIsLoggedIn.takeIf { hasSession }
> 
>     println(canAccessDashboard ?: "Access denied")
>     // true
> }
> ```
>
{style = "tip"}

|--|--|

```kotlin
data class User(val name: String?)

fun getNotificationPreferences(user: Any, emailEnabled: Boolean, smsEnabled: Boolean): List<String> {
    val validUser = // Write your code here
    val userName = // Write your code here

    return listOfNotNull( /* Write your code here */)
}

fun main() {
    val user1 = User("Alice")
    val user2 = User(null)
    val invalidUser = "NotAUser"

    println(getNotificationPreferences(user1, emailEnabled = true, smsEnabled = false))
    // [Email Notifications enabled for Alice]
    println(getNotificationPreferences(user2, emailEnabled = false, smsEnabled = true))
    // [SMS Notifications enabled for Guest]
    println(getNotificationPreferences(invalidUser, emailEnabled = true, smsEnabled = true))
    // []
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-1"}

|--|--|

```kotlin
data class User(val name: String?)

fun getNotificationPreferences(user: Any, emailEnabled: Boolean, smsEnabled: Boolean): List<String> {
    val validUser = user as? User ?: return emptyList()
    val userName = validUser.name ?: "Guest"

    return listOfNotNull(
        "Email Notifications enabled for $userName".takeIf { emailEnabled },
        "SMS Notifications enabled for $userName".takeIf { smsEnabled }
    )
}

fun main() {
    val user1 = User("Alice")
    val user2 = User(null)
    val invalidUser = "NotAUser"

    println(getNotificationPreferences(user1, emailEnabled = true, smsEnabled = false))
    // [Email Notifications enabled for Alice]
    println(getNotificationPreferences(user2, emailEnabled = false, smsEnabled = true))
    // [SMS Notifications enabled for Guest]
    println(getNotificationPreferences(invalidUser, emailEnabled = true, smsEnabled = true))
    // []
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-null-safety-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-2"}

You are working on a subscription-based streaming service where users can have multiple subscriptions, but **only one 
can be active at a time**. Complete the `getActiveSubscription()` function so that it uses the `singleOrNull()` function
with a predicate to return a `null` value if there is more than one active subscription:

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? // Write your code here

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // null
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-2"}

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? {
    return subscriptions.singleOrNull { subscription -> subscription.isActive }
}

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // null
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution 1" id="kotlin-tour-null-safety-solution-2-1"}

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? =
    subscriptions.singleOrNull { it.isActive }

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // null
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution 2" id="kotlin-tour-null-safety-solution-2-2"}

### Exercise 3 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-3"}

You are working on a social media platform where users have usernames and account statuses. You want to see the list of 
currently active usernames. Complete the `getActiveUsernames()` function so that the [`mapNotNull()` function](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map-not-null.html)
has a predicate that returns the username if it is active or a `null` value if it isn't:

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> {
    return users.mapNotNull { /* Write your code here */ }
}

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // [alice123, charlie99]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-3"}

|--|--|

> Just like in Exercise 1, you can use the [`takeIf()` function](scope-functions.md#takeif-and-takeunless) when you check
> if the user is active.
>
{ style = "tip" }

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> {
    return users.mapNotNull { user ->
        if (user.isActive) user.username else null
    }
}

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // [alice123, charlie99]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution 1" id="kotlin-tour-null-safety-solution-3-1"}

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> = users.mapNotNull { user -> user.username.takeIf { user.isActive } }

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // [alice123, charlie99]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution 2" id="kotlin-tour-null-safety-solution-3-2"}

### Exercise 4 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-4"}

You are working on an inventory management system for an e-commerce platform. Before processing a sale, you need to check
if the requested quantity of a product is valid based on the available stock.

Complete the `validateStock()` function so that it uses early returns and the Elvis operator (where applicable) to check if:

* The `requested` variable is `null`.
* The `available` variable is `null`.
* The `requested` variable is a negative value.
* The amount in the `requested` variable is higher than in the `available` variable.

In all of the above cases, the function must return early with the value of `-1`.

|--|--|

```kotlin
fun validateStock(requested: Int?, available: Int?): Int {
    // Write your code here
}

fun main() {
    println(validateStock(5,10))
    // 5
    println(validateStock(null,10))
    // -1
    println(validateStock(-2,10))
    // -1
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-4"}

|--|--|

```kotlin
fun validateStock(requested: Int?, available: Int?): Int {
    val validRequested = requested ?: return -1
    val validAvailable = available ?: return -1

    if (validRequested < 0) return -1
    if (validRequested > validAvailable) return -1

    return validRequested
}

fun main() {
    println(validateStock(5,10))
    // 5
    println(validateStock(null,10))
    // -1
    println(validateStock(-2,10))
    // -1
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-null-safety-solution-4"}

## Next step

[Intermediate: Libraries and APIs](kotlin-tour-intermediate-libraries-and-apis.md)