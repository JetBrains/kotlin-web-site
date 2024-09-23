[//]: # (title: Control flow)

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">Basic types</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">Collections</a><br />
        <img src="icon-4.svg" width="20" alt="Fourth step" /> <strong>Control flow</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">Functions</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">Classes</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">Null safety</a></p>
</tldr>

Like other programming languages, Kotlin is capable of making decisions based on whether a piece of code is evaluated to
be true. Such pieces of code are called **conditional expressions**. Kotlin is also able to create and iterate
through loops.

## Conditional expressions

Kotlin provides `if` and `when` for checking conditional expressions. 

> If you have to choose between `if` and `when`, we recommend using `when` because it:
> 
> * Makes your code easier to read.
> * Makes it easier to add another branch.
> * Leads to fewer mistakes in your code.
> 
{style="note"}

### If

To use `if`, add the conditional expression within parentheses `()` and the action to take if the result is true within 
curly braces `{}`:

```kotlin
fun main() {
//sampleStart
    val d: Int
    val check = true

    if (check) {
        d = 1
    } else {
        d = 2
    }

    println(d)
    // 1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if"}

There is no ternary operator `condition ? then : else` in Kotlin. Instead, `if` can be used as an expression. If there is
only one line of code per action, the curly braces `{}` are optional:

```kotlin
fun main() { 
//sampleStart
    val a = 1
    val b = 2

    println(if (a > b) a else b) // Returns a value: 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if-expression"}

### When

Use `when` when you have a conditional expression with multiple branches.

To use `when`:

* Place the value you want to evaluate within parentheses `()`.
* Place the branches within curly braces `{}`.
* Use `->` in each branch to separate each check from the action to take if the check is successful.

`when` can be used either as a statement or as an expression. A **statement** doesn't return anything but performs actions
instead.

Here is an example of using `when` as a statement:

```kotlin
fun main() {
//sampleStart
    val obj = "Hello"

    when (obj) {
        // Checks whether obj equals to "1"
        "1" -> println("One")
        // Checks whether obj equals to "Hello"
        "Hello" -> println("Greeting")
        // Default statement
        else -> println("Unknown")     
    }
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-statement"}

> Note that all branch conditions are checked sequentially until one of them is satisfied. So only the first suitable 
> branch is executed.
>
{style="note"}

An **expression** returns a value that can be used later in your code.

Here is an example of using `when` as an expression. The `when` expression is assigned immediately to a variable which is
later used with the `println()` function:

```kotlin
fun main() {
//sampleStart    
    val obj = "Hello"    
    
    val result = when (obj) {
        // If obj equals "1", sets result to "one"
        "1" -> "One"
        // If obj equals "Hello", sets result to "Greeting"
        "Hello" -> "Greeting"
        // Sets result to "Unknown" if no previous condition is satisfied
        else -> "Unknown"
    }
    println(result)
    // Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression"}

The examples of `when` that you've seen so far both had a subject: `obj`. But `when` can also be used without a subject.

This example uses a `when` expression **without** a subject to check a chain of Boolean expressions:

```kotlin
fun main() {
    val trafficLightState = "Red" // This can be "Green", "Yellow", or "Red"

    val trafficAction = when {
        trafficLightState == "Green" -> "Go"
        trafficLightState == "Yellow" -> "Slow down"
        trafficLightState == "Red" -> "Stop"
        else -> "Malfunction"
    }

    println(trafficAction)
    // Stop
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression-boolean"}

However, you can have the same code but with `trafficLightState` as the subject:

```kotlin
fun main() {
    val trafficLightState = "Red" // This can be "Green", "Yellow", or "Red"

    val trafficAction = when (trafficLightState) {
        "Green" -> "Go"
        "Yellow" -> "Slow down"
        "Red" -> "Stop"
        else -> "Malfunction"
    }

    println(trafficAction)  
    // Stop
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression-boolean-subject"}

Using `when` with a subject makes your code easier to read and maintain. When you use a subject with a `when` expression, 
it also helps Kotlin check that all possible cases are covered. Otherwise, if you don't use a subject with a 
`when` expression, you need to provide an else branch.

## Ranges

Before talking about loops, it's useful to know how to construct ranges for loops to iterate over.

The most common way to create a range in Kotlin is to use the `..` operator. For example, `1..4` is equivalent to `1, 2, 3, 4`.

To declare a range that doesn't include the end value, use the `..<` operator. For example, `1..<4` is equivalent to `1, 2, 3`.

To declare a range in reverse order, use `downTo.` For example, `4 downTo 1` is equivalent to `4, 3, 2, 1`.

To declare a range that increments in a step that isn't 1, use `step` and your desired increment value.
For example, `1..5 step 2` is equivalent to `1, 3, 5`.

You can also do the same with `Char` ranges:

* `'a'..'d'` is equivalent to `'a', 'b', 'c', 'd'`
* `'z' downTo 's' step 2` is equivalent to `'z', 'x', 'v', 't'`

## Conditional expressions and ranges practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-1"}

Create a simple game where you win if throwing two dice results in the same number. Use `if` to print `You win :)`
if the dice match or `You lose :(` otherwise.

> In this exercise, you import a package so that you can use the `Random.nextInt()` function to give you a random `Int`.
> For more information about importing packages, see [Packages and imports](packages.md).
>
{type = "tip"}

<deflist collapsible="true">
    <def title="Hint">
        Use the <a href="operator-overloading.md#equality-and-inequality-operators">equality operator</a> (<code>==</code>) to compare the dice results. 
    </def>
</deflist>

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-conditional-exercise-1"}

|---|---|
```kotlin
import kotlin.random.Random

fun main() {
    val firstResult = Random.nextInt(6)
    val secondResult = Random.nextInt(6)
    if (firstResult == secondResult)
        println("You win :)")
    else
        println("You lose :(")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-control-flow-conditional-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true" id="conditional-expressions-exercise-2"}

Using a `when` expression, update the following program so that it prints the corresponding actions when you input the 
names of game console buttons.

| **Button** | **Action**             |
|------------|------------------------|
| A          | Yes                    |
| B          | No                     |
| X          | Menu                   |
| Y          | Nothing                |
| Other      | There is no such button |

|---|---|
```kotlin
fun main() {
    val button = "A"

    println(
        // Write your code here
    )
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-conditional-exercise-2"}

|---|---|
```kotlin
fun main() {
    val button = "A"
    
    println(
        when (button) {
            "A" -> "Yes"
            "B" -> "No"
            "X" -> "Menu"
            "Y" -> "Nothing"
            else -> "There is no such button"
        }
    )
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-control-flow-conditional-solution-2"}

## Loops

The two most common loop structures in programming are `for` and `while`. Use `for` to iterate over a range of 
values and perform an action. Use `while` to continue an action until a particular condition is satisfied.

### For

Using your new knowledge of ranges, you can create a `for` loop that iterates over numbers 1 to 5 and prints the number 
each time.

Place the iterator and range within parentheses `()` with keyword `in`. Add the action you want to complete within curly
braces `{}`:

```kotlin
fun main() {
//sampleStart
    for (number in 1..5) { 
        // number is the iterator and 1..5 is the range
        print(number)
    }
    // 12345
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-loop"}

Collections can also be iterated over by loops:

```kotlin
fun main() { 
//sampleStart
    val cakes = listOf("carrot", "cheese", "chocolate")

    for (cake in cakes) {
        println("Yummy, it's a $cake cake!")
    }
    // Yummy, it's a carrot cake!
    // Yummy, it's a cheese cake!
    // Yummy, it's a chocolate cake!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-collection-loop"}

### While

`while` can be used in two ways:

  * To execute a code block while a conditional expression is true. (`while`)
  * To execute the code block first and then check the conditional expression. (`do-while`)

In the first use case (`while`):

* Declare the conditional expression for your while loop to continue within parentheses `()`. 
* Add the action you want to complete within curly braces `{}`.

> The following examples use the [increment operator](operator-overloading.md#increments-and-decrements) `++` to
> increment the value of the `cakesEaten` variable.
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    var cakesEaten = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    // Eat a cake
    // Eat a cake
    // Eat a cake
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-loop"}

In the second use case (`do-while`):

* Declare the conditional expression for your while loop to continue within parentheses `()`.
* Define the action you want to complete within curly braces `{}` with the keyword `do`.

```kotlin
fun main() {
//sampleStart
    var cakesEaten = 0
    var cakesBaked = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    do {
        println("Bake a cake")
        cakesBaked++
    } while (cakesBaked < cakesEaten)
    // Eat a cake
    // Eat a cake
    // Eat a cake
    // Bake a cake
    // Bake a cake
    // Bake a cake
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-do-loop"}

For more information and examples of conditional expressions and loops, see [Conditions and loops](control-flow.md).

Now that you know the fundamentals of Kotlin control flow, it's time to learn how to write your own [functions](kotlin-tour-functions.md).

## Loops practice

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-1"}

You have a program that counts pizza slices until there’s a whole pizza with 8 slices. Refactor this program in two ways:

* Use a `while` loop.
* Use a `do-while` loop.

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    // Start refactoring here
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    // End refactoring here
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-1"}

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    while ( pizzaSlices < 7 ) {
        pizzaSlices++
        println("There's only $pizzaSlices slice/s of pizza :(")
    }
    pizzaSlices++
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution 1" id="kotlin-tour-control-flow-loops-exercise-1-solution-1"}

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    pizzaSlices++
    do {
        println("There's only $pizzaSlices slice/s of pizza :(")
        pizzaSlices++
    } while ( pizzaSlices < 8 )
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}

```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution 2" id="kotlin-tour-control-flow-loops-exercise-1-solution-2"}

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-2"}

Write a program that simulates the [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz) game. Your task is to print 
numbers from 1 to 100 incrementally, replacing any number divisible by three with the word "fizz", and any number 
divisible by five with the word "buzz". Any number divisible by both 3 and 5 must be replaced with the word "fizzbuzz".

<deflist collapsible="true">
    <def title="Hint 1">
        Use a <code>for</code> loop to count numbers and a <code>when</code> expression to decide what to print at each
        step. 
    </def>
</deflist>

<deflist collapsible="true">
    <def title="Hint 2">
        Use the modulo operator (<code>%</code>) to return the remainder of a number being divided. Use the <a href="operator-overloading.md#equality-and-inequality-operators">equality operator</a> 
        (<code>==</code>) to check if the remainder equals zero.
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-2"}

|---|---|
```kotlin
fun main() {
    for (number in 1..100) {
        println(
            when {
                number % 15 == 0 -> "fizzbuzz"
                number % 3 == 0 -> "fizz"
                number % 5 == 0 -> "buzz"
                else -> "$number"
            }
        )
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-control-flow-loops-solution-2"}

### Exercise 3 {initial-collapse-state="collapsed" collapsible="true" id="loops-exercise-3"}

You have a list of words. Use `for` and `if` to print only the words that start with the letter `l`.

<deflist collapsible="true">
    <def title="Hint">
        Use the <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html"> <code>.startsWith()</code>
        </a> function for <code>String</code> type. 
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-loops-exercise-3"}

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    for (w in words) {
        if (w.startsWith("l"))
            println(w)
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-control-flow-loops-solution-3"}

## Next step

[Functions](kotlin-tour-functions.md)
