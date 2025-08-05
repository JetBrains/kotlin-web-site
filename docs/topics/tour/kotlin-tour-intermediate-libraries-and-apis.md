[//]: # (title: Intermediate: Libraries and APIs)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">Extension functions</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">Scope functions</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">Lambda expressions with receiver</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">Classes and interfaces</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">Objects</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">Open and special classes</a><br />
        <img src="icon-7-done.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">Properties</a><br />
        <img src="icon-8-done.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null safety</a><br />
        <img src="icon-9.svg" width="20" alt="Ninth step" /> <strong>Libraries and APIs</strong><br /></p>
</tldr>

To get the most out of Kotlin, use existing libraries and APIs so you can spend more time coding and less time 
reinventing the wheel.

Libraries distribute reusable code that simplifies common tasks. Within libraries, there are packages and objects that
group related classes, functions, and utilities. Libraries expose APIs (Application Programming Interfaces) as a set of 
functions, classes, or properties that developers can use in their code.

![Kotlin libraries and APIs](kotlin-library-diagram.svg){width=600}

Let's explore what's possible with Kotlin.

## The standard library

Kotlin has a standard library that provides essential types, functions, collections, and utilities to make your code 
concise and expressive. A large portion of the standard library (everything in the [`kotlin` package](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/)) is readily available
in any Kotlin file without the need to import it explicitly:

```kotlin
fun main() {
    val text = "emosewa si niltoK"
    
   // Use the reversed() function from the standard library
    val reversedText = text.reversed()

    // Use the print() function from the standard library
    print(reversedText)
    // Kotlin is awesome
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-stdlib"}

However, some parts of the standard library require an import before you can use them in your code. 
For example, if you want to use the standard library's time measurement features, you need to import the [`kotlin.time` package](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/).

At the top of your file, add the `import` keyword followed by the package that you need:

```kotlin
import kotlin.time.*
```

The asterisk `*` is a wildcard import that tells Kotlin to import everything within the package. You can't use the 
asterisk `*` with companion objects. Instead, you need to explicitly declare the members of a companion object that you want to use.

For example:

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

fun main() {
    val thirtyMinutes: Duration = 30.minutes
    val halfHour: Duration = 0.5.hours
    println(thirtyMinutes == halfHour)
    // true
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-time"}

This example:

* Imports the `Duration` class and the `hours` and `minutes` extension properties from its companion object.
* Uses the `minutes` property to convert `30` into a `Duration` of 30 minutes.
* Uses the `hours` property to convert `0.5` into a `Duration` of 30 minutes.
* Checks if both durations are equal and prints the result.

### Search before you build

Before you decide to write your own code, check the standard library to see if what you're looking for already exists. 
Here's a list of areas where the standard library already provides a number of classes, functions, and properties for you:

* [Collections](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/)
* [Sequences](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.sequences/)
* [String manipulation](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/)
* [Time management](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/)

To learn more about what else is in the standard library, explore its [API reference](https://kotlinlang.org/api/core/kotlin-stdlib/).

## Kotlin libraries

The standard library covers many common use cases, but there are some that it doesn't address. Fortunately, the Kotlin
team and the rest of the community have developed a wide range of libraries to complement the standard library. For example,
[`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) helps you manage time across different platforms.

You can find useful libraries on our [search platform](https://klibs.io/). To use them, you need to take extra steps,
like adding a dependency or plugin. Each library has a GitHub repository with instructions on how to include
it in your Kotlin projects.

Once you add the library, you can import any package within it. Here's an example of how to import the `kotlinx-datetime`
package to find the current time in New York: 

```kotlin
import kotlinx.datetime.*

fun main() {
    val now = Clock.System.now() // Get current instant
    println("Current instant: $now")

    val zone = TimeZone.of("America/New_York")
    val localDateTime = now.toLocalDateTime(zone)
    println("Local date-time in NY: $localDateTime")
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-datetime"}

This example:

* Imports the `kotlinx.datetime` package.
* Uses the `Clock.System.now()` function to create an instance of the `Instant` class that contains the current time and assigns the result to the `now` variable.
* Prints the current time.
* Uses the `TimeZone.of()` function to find the time zone for New York and assigns the result to the `zone` variable.
* Calls the `.toLocalDateTime()` function on the instance containing the current time, with the New York time zone as an argument.
* Assigns the result to the `localDateTime` variable.
* Prints the time adjusted for the time zone in New York.

> To explore the functions and classes that this example uses in more detail, see the [API reference](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/).
>
{style="tip"}

## Opt in to APIs

Library authors may mark certain APIs as requiring opt-in before you can use them in your code. They usually do this when
an API is still in development and may change in the future. If you don't opt in, you see warnings or errors like this:

```text
This declaration needs opt-in. Its usage should be marked with '@...' or '@OptIn(...)'
```

To opt in, write `@OptIn` followed by parentheses containing the class name that categorizes the API, appended by two colons `::` and `class`.

For example, the `uintArrayOf()` function from the standard library falls under `@ExperimentalUnsignedTypes`, as shown
[in the API reference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/to-u-int-array.html):

```kotlin
@ExperimentalUnsignedTypes
inline fun uintArrayOf(vararg elements: UInt): UIntArray
```

In your code, the opt-in looks like:

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
```

Here's an example that opts in to use the `uintArrayOf()` function to create an array of unsigned integers and modifies one of its elements:

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
fun main() {
    // Create an unsigned integer array
    val unsignedArray: UIntArray = uintArrayOf(1u, 2u, 3u, 4u, 5u)

    // Modify an element
    unsignedArray[2] = 42u
    println("Updated array: ${unsignedArray.joinToString()}")
    // Updated array: 1, 2, 42, 4, 5
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-apis"}

This is the easiest way to opt in, but there are other ways. To learn more, see [Opt-in requirements](opt-in-requirements.md).

## Practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="libraries-exercise-1"}

You are developing a financial application that helps users calculate the future value of their investments. The formula
to calculate compound interest is:

<math>A = P \times (1 + \displaystyle\frac{r}{n})^{nt}</math>

Where:

* `A` is the amount of money accumulated after interest (principal + interest).
* `P` is the principal amount (the initial investment).
* `r` is the annual interest rate (decimal).
* `n` is the number of times interest is compounded per year.
* `t` is the time the money is invested for (in years).

Update the code to:

1. Import the necessary functions from the [`kotlin.math` package](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.math/).
2. Add a body to the `calculateCompoundInterest()` function that calculates the final amount after applying compound interest.

|--|--|

```kotlin
// Write your code here

fun calculateCompoundInterest(P: Double, r: Double, n: Int, t: Int): Double {
    // Write your code here
}

fun main() {
    val principal = 1000.0
    val rate = 0.05
    val timesCompounded = 4
    val years = 5
    val amount = calculateCompoundInterest(principal, rate, timesCompounded, years)
    println("The accumulated amount is: $amount")
    // The accumulated amount is: 1282.0372317085844
}

```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-libraries-exercise-1"}

|---|---|
```kotlin
import kotlin.math.*

fun calculateCompoundInterest(P: Double, r: Double, n: Int, t: Int): Double {
    return P * (1 + r / n).pow(n * t)
}

fun main() {
    val principal = 1000.0
    val rate = 0.05
    val timesCompounded = 4
    val years = 5
    val amount = calculateCompoundInterest(principal, rate, timesCompounded, years)
    println("The accumulated amount is: $amount")
    // The accumulated amount is: 1282.0372317085844
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-libraries-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true" id="libraries-exercise-2"}

You want to measure the time it takes to perform multiple data processing tasks in your program. Update the code
to add the correct import statements and functions from the [`kotlin.time`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/) package:

|---|---|

```kotlin
// Write your code here

fun main() {
    val timeTaken = /* Write your code here */ {
        // Simulate some data processing
        val data = List(1000) { it * 2 }
        val filteredData = data.filter { it % 3 == 0 }

        // Simulate processing the filtered data
        val processedData = filteredData.map { it / 2 }
        println("Processed data")
    }

    println("Time taken: $timeTaken") // e.g. 16 ms
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-libraries-exercise-2"}

|---|---|
```kotlin
import kotlin.time.measureTime

fun main() {
    val timeTaken = measureTime {
        // Simulate some data processing
        val data = List(1000) { it * 2 }
        val filteredData = data.filter { it % 3 == 0 }

        // Simulate processing the filtered data
        val processedData = filteredData.map { it / 2 }
        println("Processed data")
    }

    println("Time taken: $timeTaken") // e.g. 16 ms
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-libraries-solution-2"}

### Exercise 3 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-3"}

There's a new feature in the standard library available in the latest Kotlin release. You want to try it out, but it 
requires opt-in. The feature falls under [`@ExperimentalStdlibApi`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-experimental-stdlib-api/).
What should the opt-in look like in your code?

|---|---|
```kotlin
@OptIn(ExperimentalStdlibApi::class)
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-libraries-solution-3"}

## What's next?

Congratulations! You've completed the intermediate tour! As a next step, check out our tutorials for popular Kotlin applications:

* [Create a backend application with Spring Boot and Kotlin](jvm-create-project-with-spring-boot.md)
* Create a cross-platform application for Android and iOS from scratch and:
    * [Share business logic while keeping the UI native](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
    * [Share business logic and UI](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
