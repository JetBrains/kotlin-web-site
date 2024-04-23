[//]: # (title: Functions)

<microformat>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">Basic types</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">Collections</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">Control flow</a><br />
        <img src="icon-5.svg" width="20" alt="Fifth step" /> <strong>Functions</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">Classes</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">Null safety</a></p>
</microformat>

You can declare your own functions in Kotlin using the `fun` keyword.

```kotlin
fun hello() {
    return println("Hello, world!")
}

fun main() {
    hello()
    // Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-function-demo"}

In Kotlin:
* function parameters are written within parentheses `()`.
* each parameter must have a type, and multiple parameters must be separated by commas `,`.
* the return type is written after the function's parentheses `()`, separated by a colon `:`.
* the body of a function is written within curly braces `{}`.
* the `return` keyword is used to exit or return something from a function.

> If a function doesn't return anything useful, the return type and `return` keyword can be omitted. Learn more about
> this in [Functions without return](#functions-without-return).
>
{type="note"}

In the following example:
* `x` and `y` are function parameters.
* `x` and `y` have type `Int`.
* the function's return type is `Int`.
* the function returns a sum of `x` and `y` when called.

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function"}

> We recommend in our [coding conventions](coding-conventions.md#function-names) that you name functions starting with 
> a lowercase letter and use camel case with no underscores.
> 
{type="note"}

## Named arguments

For concise code, when calling your function, you don't have to include parameter names. However, including parameter names
does make your code easier to read. This is called using **named arguments**. If you do include parameter names, then 
you can write the parameters in any order.

> In the following example, [string templates](strings.md#string-templates) (`$`) are used to access
> the parameter values, convert them to `String` type, and then concatenate them into a string for printing.
> 
{type="tip"}

```kotlin
fun printMessageWithPrefix(message: String, prefix: String) {
    println("[$prefix] $message")
}

fun main() {
    // Uses named arguments with swapped parameter order
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-named-arguments-function"}

## Default parameter values

You can define default values for your function parameters. Any parameter with a default value can be omitted when
calling your function. To declare a default value, use the assignment operator `=` after the type:

```kotlin
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    // Function called with both parameters
    printMessageWithPrefix("Hello", "Log") 
    // [Log] Hello
    
    // Function called only with message parameter
    printMessageWithPrefix("Hello")        
    // [Info] Hello
    
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-default-param-function"}

> You can skip specific parameters with default values, rather than omitting them all. However, after the 
> first skipped parameter, you must name all subsequent parameters.
>
{type="note"}

## Functions without return

If your function doesn't return a useful value then its return type is `Unit`. `Unit` is a type with only one value – 
`Unit`. You don't have to declare that `Unit` is returned explicitly in your function body. This means that you don't 
have to use the `return` keyword or declare a return type:

```kotlin
fun printMessage(message: String) {
    println(message)
    // `return Unit` or `return` is optional
}

fun main() {
    printMessage("Hello")
    // Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-unit-function"}

## Single-expression functions

To make your code more concise, you can use single-expression functions. For example, the `sum()` function can be shortened:

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-before"}

You can remove the curly braces `{}` and declare the function body using the assignment operator `=`. And due to Kotlin's
type inference, you can also omit the return type. The `sum()` function then becomes one line:

```kotlin
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-after"}

> Omitting the return type is only possible when your function has no body (`{}`). Unless your function's return type
> is `Unit`.
> 
{type="note"}

## Functions practice

### Exercise 1 {initial-collapse-state="collapsed" id="functions-exercise-1"}

Write a function called `circleArea` that takes the radius of a circle in integer format as a parameter and outputs the
area of that circle.

> In this exercise, you import a package so that you can access the value of pi via `PI`. For more information about
> importing packages, see [Packages and imports](packages.md).
>
{type = "note"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea() {
    // Write your code here
}
fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-1"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double {
    return PI * radius * radius
}

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-functions-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" id="functions-exercise-2"}

Rewrite the `circleArea` function from the previous exercise as a single-expression function.

|---|---|
```kotlin
import kotlin.math.PI

// Write your code here

fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-2"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double = PI * radius * radius

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-functions-solution-2"}

### Exercise 3 {initial-collapse-state="collapsed" id="functions-exercise-3"}

You have a function that translates a time interval given in hours, minutes, and seconds into seconds. In most cases,
you need to pass only one or two function parameters while the rest are equal to 0. Improve the function and the code that
calls it by using default parameter values and named arguments so that the code is easier to read.

|---|---|
```kotlin
fun intervalInSeconds(hours: Int, minutes: Int, seconds: Int) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(0, 1, 25))
    println(intervalInSeconds(2, 0, 0))
    println(intervalInSeconds(0, 10, 0))
    println(intervalInSeconds(1, 0, 1))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-3"}

|---|---|
```kotlin
fun intervalInSeconds(hours: Int = 0, minutes: Int = 0, seconds: Int = 0) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(minutes = 1, seconds = 25))
    println(intervalInSeconds(hours = 2))
    println(intervalInSeconds(minutes = 10))
    println(intervalInSeconds(hours = 1, seconds = 1))
}
```
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-functions-solution-3"}

## Lambda expressions

Kotlin allows you to write even more concise code for functions by using lambda expressions.

For example, the following `uppercaseString()` function:

```kotlin
fun uppercaseString(message: String): String {
    return message.uppercase()
}
fun main() {
    println(uppercaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-before"}

Can also be written as a lambda expression:

```kotlin
fun main() {
    println({ message: String -> message.uppercase() }("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-after"}

Lambda expressions can be hard to understand at first glance so let's break it down. Lambda expressions are written 
within curly braces `{}`.

Within the lambda expression, you write:
* the parameters followed by an `->`.
* the function body after the `->`.

In the previous example:
* `message` is a function parameter.
* `message` has type `String`.
* the function returns the result of the [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html)
function called on `message`.

> If you declare a lambda without parameters, then there is no need to use `->`. For example:
> ```kotlin
> { println("Log message") }
> ```
>
{type="note"}

Lambda expressions can be used in a number of ways. You can:
* [assign a lambda to a variable that you can then invoke later](#assign-to-variable)
* [pass a lambda expression as a parameter to another function](#pass-to-another-function)
* [return a lambda expression from a function](#return-from-a-function)
* [invoke a lambda expression on its own](#invoke-separately)

### Assign to variable

To assign a lambda expression to a variable, use the assignment operator `=`:

```kotlin
fun main() {
    val upperCaseString = { message: String -> message.uppercase() }
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-variable"}

### Pass to another function

A great example of when it is useful to pass a lambda expression to a function, is using the [`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)
function on collections:

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val positives = numbers.filter { x -> x > 0 }
    val negatives = numbers.filter { x -> x < 0 }
    println(positives)
    // [1, 3, 5]
    println(negatives)
    // [-2, -4, -6]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-filter"}

The `.filter()` function accepts a lambda expression as a predicate:
* `{ x -> x > 0 }` takes each element of the list and returns only those that are positive.
* `{ x -> x < 0 }` takes each element of the list and returns only those that are negative.

> If a lambda expression is the only function parameter, you can drop the function parentheses `()`.
> This is an example of a [trailing lambda](#trailing-lambdas), which is discussed in more detail at the end of this
> chapter.
>
{type = "note"}

Another good example, is using the [`.map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 
function to transform items in a collection:

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val doubled = numbers.map { x -> x * 2 }
    val tripled = numbers.map { x -> x * 3 }
    println(doubled)
    // [2, -4, 6, -8, 10, -12]
    println(tripled)
    // [3, -6, 9, -12, 15, -18]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-map"}

The `.map()` function accepts a lambda expression as a transform function:
* `{ x -> x * 2 }` takes each element of the list and returns that element multiplied by 2.
* `{ x -> x * 3 }` takes each element of the list and returns that element multiplied by 3.

### Function types

Before you can return a lambda expression from a function, you first need to understand **function
types**.

You have already learned about basic types but functions themselves also have a type. Kotlin's type inference 
can infer a function's type from the parameter type. But there may be times when you need to explicitly
specify the function type. The compiler needs the function type so that it knows what is and isn't 
allowed for that function.

The syntax for a function type has:
* each parameter's type written within parentheses `()` and separated by commas `,`.
* the return type written after `->`.

For example: `(String) -> String` or `(Int, Int) -> Int`.

This is what a lambda expression looks like if a function type for `upperCaseString()` is defined:

```kotlin
val upperCaseString: (String) -> String = { message -> message.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-type"}

If your lambda expression has no parameters then the parentheses `()` are left empty. For example: `() -> Unit`

> You must declare parameter and return types either in the lambda expression or as a function type. Otherwise, the
> compiler won't be able to know what type your lambda expression is.
> 
> For example, the following won't work:
> 
> `val upperCaseString = { str -> str.uppercase() }`
>
{type="note"}

### Return from a function

Lambda expressions can be returned from a function. So that the compiler understands what type the lambda
expression returned is, you must declare a function type.

In the following example, the `toSeconds()` function has function type `(Int) -> Int` because it always returns a lambda
expression that takes a parameter of type `Int` and returns an `Int` value.

This example uses a `when` expression to determine which lambda expression is returned when `toSeconds()` is called:

```kotlin
fun toSeconds(time: String): (Int) -> Int = when (time) {
    "hour" -> { value -> value * 60 * 60 }
    "minute" -> { value -> value * 60 }
    "second" -> { value -> value }
    else -> { value -> value }
}

fun main() {
    val timesInMinutes = listOf(2, 10, 15, 1)
    val min2sec = toSeconds("minute")
    val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()
    println("Total time is $totalTimeInSeconds secs")
    // Total time is 1680 secs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-return-from-function"}

### Invoke separately

Lambda expressions can be invoked on their own by adding parentheses `()` after the curly braces `{}` and including
any parameters within the parentheses:

```kotlin
fun main() {
    //sampleStart
    println({ message: String -> message.uppercase() }("hello"))
    // HELLO
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-standalone"}

### Trailing lambdas

As you have already seen, if a lambda expression is the only function parameter, you can drop the function parentheses `()`.
If a lambda expression is passed as the last parameter of a function, then the expression can be written outside the
function parentheses `()`. In both cases, this syntax is called a **trailing lambda**.

For example, the [`.fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html) function accepts an 
initial value and an operation:

```kotlin
fun main() {
    //sampleStart
    // The initial value is zero. 
    // The operation sums the initial value with every item in the list cumulatively.
    println(listOf(1, 2, 3).fold(0, { x, item -> x + item })) // 6

    // Alternatively, in the form of a trailing lambda
    println(listOf(1, 2, 3).fold(0) { x, item -> x + item })  // 6
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-trailing-lambda"}

For more information on lambda expressions, see [Lambda expressions and anonymous functions](lambdas.md#lambda-expressions-and-anonymous-functions).

The next step in our tour is to learn about [classes](kotlin-tour-classes.md) in Kotlin.

## Lambda expressions practice

### Exercise 1 {initial-collapse-state="collapsed" id="lambdas-exercise-1"}

You have a list of actions supported by a web service, a common prefix for all requests, and an ID of a particular resource.
To request an action `title` over the resource with ID: 5, you need to create the following URL: `https://example.com/book-info/5/title`.
Use a lambda expression to create a list of URLs from the list of actions.

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = // Write your code here
    println(urls)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-1"}

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action -> "$prefix/$id/$action" }
    println(urls)
}
```
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-lambdas-solution-1"}

### Exercise 2 {initial-collapse-state="collapsed" id="lambdas-exercise-2"}

Write a function that takes an `Int` value and an action (a function with type `() -> Unit`) which then repeats the 
action the given number of times. Then use this function to print “Hello” 5 times.

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    // Write your code here
}

fun main() {
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-2"}

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    for (i in 1..n) {
        action()
    }
}

fun main() {
    repeatN(5) {
        println("Hello")
    }
}
```
{initial-collapse-state="collapsed" collapsed-title="Example solution" id="kotlin-tour-lambdas-solution-2"}

## Next step

[Classes](kotlin-tour-classes.md)
