[//]: # (title: Control flow)

<microformat>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">Basic types</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">Collections</a><br />
        <img src="icon-4.svg" width="20" alt="Fourth step" /> <strong>Control flow</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">Functions</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">Classes</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">Null safety</a></p>
</microformat>

Like other programming languages, Kotlin is capable of making decisions based on whether a piece of code is evaluated to
be true. Such pieces of code are called **conditional expressions**. Kotlin is also able to create and iterate
through loops.

## Conditional expressions

Kotlin provides `if` and `when` for checking conditional expressions. 

> If you have to choose between `if` and `when`, we recommend using `when` as it leads to more robust and safer programs.
> 
{type="note"}

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
`when` can be used either as a statement or as an expression.

Here is an example of using `when` as a statement:
* Place the conditional expression within parentheses `()` and the actions to take
within curly braces `{}`. 
* Use `->` in each branch to separate each condition from each action.

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
{type="note"}

Here is an example of using `when` as an expression. The `when` syntax is assigned immediately to a variable:

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

If `when` is used as an expression, the else branch is mandatory, unless the compiler can detect that all possible cases 
are covered by the branch conditions.

The previous example showed that `when` is useful for matching a variable. `when` is also useful when you need to check
a chain of Boolean expressions:

```kotlin
fun main() {
//sampleStart
    val temp = 18

    val description = when {
        // If temp < 0 is true, sets description to "very cold"
        temp < 0 -> "very cold"
        // If temp < 10 is true, sets description to "a bit cold"
        temp < 10 -> "a bit cold"
        // If temp < 20 is true, sets description to "warm"
        temp < 20 -> "warm"
        // Sets description to "hot" if no previous condition is satisfied
        else -> "hot"             
    }
    println(description)
    // warm
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression-boolean"}

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
{type="note"}

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

## Practice

### Exercise 1 {initial-collapse-state="collapsed"}

Using a `when` expression, update the following program so that when you input the names of GameBoy buttons, the actions
are printed to output. 

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
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-exercise-1"}

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
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-control-flow-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed"}

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
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-exercise-2"}

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
{initial-collapse-state="collapsed" collapsed-title="Example solution 1" id="kotlin-tour-control-flow-exercise-2-solution-1"}

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
{initial-collapse-state="collapsed" collapsed-title="Example solution 2" id="kotlin-tour-control-flow-exercise-2-solution-2"}

### Exercise 3 {initial-collapse-state="collapsed"}

Write a program that simulates the [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz) game. Your task is to print 
numbers from 1 to 100 incrementally, replacing any number divisible by three with the word "fizz", and any number 
divisible by five with the word "buzz". Any number divisible by both 3 and 5 must be replaced with the word "fizzbuzz".

<deflist collapsible="true">
    <def title="Hint">
        Use a <code>for</code> loop to count numbers and a <code>when</code> expression to decide what to print at each
        step. 
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-exercise-3"}

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
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-control-flow-solution-3"}

### Exercise 4 {initial-collapse-state="collapsed"}

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
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-exercise-4"}

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
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-control-flow-solution-4"}

## Next step

[Functions](kotlin-tour-functions.md)
