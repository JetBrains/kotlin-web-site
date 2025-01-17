[//]: # (title: Hello world)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="First step" /> <strong>Hello world</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">Basic types</a><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">Collections</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">Control flow</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">Functions</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">Classes</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">Null safety</a></p>
</tldr>

Here is a simple program that prints "Hello, world!":

```kotlin
fun main() {
    println("Hello, world!")
    // Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="hello-world-kotlin"}

In Kotlin:

* `fun` is used to declare a function
* The `main()` function is where your program starts from
* The body of a function is written within curly braces `{}`
* [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) and [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) functions print their arguments to standard output

A function is a set of instructions that performs a specific task. Once you create a function, you can use it whenever 
you need to perform that task, without having to write the instructions all over again. Functions are discussed in more
detail in a couple of chapters. Until then, all examples use the `main()` function.

## Variables

All programs need to be able to store data, and variables help you to do just that. In Kotlin, you can declare:

* Read-only variables with `val`
* Mutable variables with `var`

> You can't change a read-only variable once you have given it a value.
> 
{type ="note"}

To assign a value, use the assignment operator `=`.

For example:

```kotlin
fun main() { 
//sampleStart
    val popcorn = 5    // There are 5 boxes of popcorn
    val hotdog = 7     // There are 7 hotdogs
    var customers = 10 // There are 10 customers in the queue
    
    // Some customers leave the queue
    customers = 8
    println(customers)
    // 8
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-variables"}

> Variables can be declared outside the `main()` function at the beginning of your program. Variables declared in this way
> are said to be declared at **top level**.
> 
{style="tip"}

As `customers` is a mutable variable, its value can be reassigned after declaration.

> We recommend that you declare all variables as read-only (`val`) by default. Declare mutable variables (`var`) only if 
> necessary.
> 
{style="note"}

## String templates

It's useful to know how to print the contents of variables to standard output. You can do this with **string templates**. 
You can use template expressions to access data stored in variables and other objects, and convert them into strings.
A string value is a sequence of characters in double quotes `"`. Template expressions always start with a dollar sign `$`.

To evaluate a piece of code in a template expression, place the code within curly braces `{}` after the dollar sign `$`.

For example:

```kotlin
fun main() { 
//sampleStart
    val customers = 10
    println("There are $customers customers")
    // There are 10 customers
    
    println("There are ${customers + 1} customers")
    // There are 11 customers
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-string-templates"}

For more information, see [String templates](strings.md#string-templates).

You will notice that there aren't any types declared for variables. Kotlin has inferred the type itself: `Int`. This tour
explains the different Kotlin basic types and how to declare them in the [next chapter](kotlin-tour-basic-types.md).

## Practice

### Exercise {initial-collapse-state="collapsed" collapsible="true"}

Complete the code to make the program print `"Mary is 20 years old"` to standard output:

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-hello-world-exercise"}

|---|---|
```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    println("$name is $age years old")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-hello-world-solution"}

## Next step

[Basic types](kotlin-tour-basic-types.md)