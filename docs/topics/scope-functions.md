[//]: # (title: Scope functions)

The Kotlin standard library contains several functions whose sole purpose is to execute a block of code within the context
of an object. When you call such a function on an object with a [lambda expression](lambdas.md) provided, it forms a
temporary scope. In this scope, you can access the object without its name. Such functions are called _scope functions_.
There are five of them: [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html), [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)
, [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html), [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html)
, and [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html).

Basically, these functions all perform the same action: execute a block of code on an object. What's different is how 
this object becomes available inside the block and what the result of the whole expression is.

Here's a typical example of how to use a scope function:

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    Person("Alice", 20, "Amsterdam").let {
        println(it)
        it.moveTo("London")
        it.incrementAge()
        println(it)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If you write the same without `let`, you'll have to introduce a new variable and repeat its name whenever you use it. 

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    val alice = Person("Alice", 20, "Amsterdam")
    println(alice)
    alice.moveTo("London")
    alice.incrementAge()
    println(alice)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Scope functions don't introduce any new technical capabilities, but they can make your code more concise and readable.

Due to the many similarities between scope functions, choosing the right one for your use case can be tricky. The 
choice mainly depends on your intent and the consistency of use in your project. Below, we provide detailed descriptions
of the differences between scope functions and their conventions.

## Function selection

To help you choose the right scope function for your purpose, we provide this table that summarizes the key differences 
between them.

| Function |Object reference|Return value|Is extension function|
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) |`it`|Lambda result|Yes|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |`this`|Lambda result|Yes|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |-|Lambda result|No: called without the context object|
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) |`this`|Lambda result|No: takes the context object as an argument.|
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) |`this`|Context object|Yes|
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) |`it`|Context object|Yes|

Detailed information about these functions is provided in the dedicated sections below.

Here is a short guide for choosing scope functions depending on the intended purpose:

* Executing a lambda on non-nullable objects: `let`
* Introducing an expression as a variable in local scope: `let`
* Object configuration: `apply`
* Object configuration and computing the result: `run`
* Running statements where an expression is required: non-extension `run`
* Additional effects: `also`
* Grouping function calls on an object: `with`

The use cases of different scope functions overlap, so you can choose which functions to use based on the specific 
conventions used in your project or team.

Although scope functions can make your code more concise, avoid overusing them: it can make your code hard to read and 
lead to errors. We also recommend that you avoid nesting scope functions and be careful when chaining them because it's 
easy to get confused about the current context object and value of `this` or `it`.

## Distinctions

Because scope functions are similar in nature, it's important to understand the differences between them.
There are two main differences between each scope function: 
* The way they refer to the context object.
* Their return value.

### Context object: this or it

Inside the lambda passed to a scope function, the context object is available by a short reference instead of its 
actual name. Each scope function uses one of two ways to reference the context object: as a lambda [receiver](lambdas.md#function-literals-with-receiver)
(`this`) or as a lambda argument (`it`). Both provide the same capabilities, so we describe the pros and cons of each
for different use cases and provide recommendations for their use.

```kotlin
fun main() {
    val str = "Hello"
    // this
    str.run {
        println("The string's length: $length")
        //println("The string's length: ${this.length}") // does the same
    }

    // it
    str.let {
        println("The string's length is ${it.length}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### this

`run`, `with`, and `apply` reference the context object as a lambda [receiver](lambdas.md#function-literals-with-receiver) - 
by keyword `this`. Hence, in their lambdas, the object is available as it would be in ordinary class functions. 

In most cases, you can omit `this` when accessing the members of the receiver object, making the code shorter. On the
 other hand, if `this` is omitted, it can be hard to distinguish between the receiver members and external objects or 
functions. So having the context object as a receiver (`this`) is recommended for lambdas that mainly operate on the 
object's members by calling its functions or assigning values to properties.

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply { 
        age = 20                       // same as this.age = 20
        city = "London"
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### it

In turn, `let` and `also` reference the context object as a lambda [argument](lambdas.md#lambda-expression-syntax). If 
the argument name is not specified, the object is accessed by the implicit default name `it`. `it` is shorter than 
`this` and expressions with `it` are usually easier to read. 

However, when calling the object's functions or properties, you don't have the object available implicitly like `this`. 
Hence, accessing the context object via `it` is better when the object is mostly used as an argument in function calls. 
`it` is also better if you use multiple variables in the code block.

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The example below demonstrates referencing the context object as a lambda argument with argument name: `value`.

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value ->
            writeToLog("getRandomInt() generated value $value")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Return value

Scope functions differ by the result they return:
* `apply` and `also` return the context object.
* `let`, `run`, and `with` return the lambda result.

You should consider carefully what return value you want based on what you want to do next in your code. This helps you 
to choose the best scope function to use.

#### Context object 

The return value of `apply` and `also` is the context object itself. Hence, they can be included into call chains as
_side steps_: you can continue chaining function calls on the same object, one after another.  

```kotlin
fun main() {
//sampleStart
    val numberList = mutableListOf<Double>()
    numberList.also { println("Populating the list") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("Sorting the list") }
        .sort()
//sampleEnd
    println(numberList)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

They also can be used in return statements of functions returning the context object.

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### Lambda result

`let`, `run`, and `with` return the lambda result. So you can use them when assigning the result to a variable, chaining
operations on the result, and so on.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run { 
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("There are $countEndsWithE elements that end with e.")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Additionally, you can ignore the return value and use a scope function to create a temporary scope for local variables. 

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()        
        println("First item: $firstItem, last item: $lastItem")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Functions

To help you choose the right scope function for your use case, we describe them in detail and provide
recommendations for use. Technically, scope functions are interchangeable in many cases, so the examples show 
conventions for using them. 

### let

- **The context object** is available as an argument (`it`).
- **The return value** is the lambda result.

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) can be used to invoke one or more functions on 
results of call chains. For example, the following code prints the results of two operations on a collection:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    val resultList = numbers.map { it.length }.filter { it > 3 }
    println(resultList)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

With `let`, you can rewrite the above example so that you're not assigning the result of the list
operations to a variable:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // and more function calls if needed
    } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If the code block passed to `let` contains a single function with `it` as an argument, you can use the method reference 
(`::`) instead of the lambda argument:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let` is often used to execute a code block containing non-null values. To perform actions on a non-null object, use
the [safe call operator `?.`](null-safety.md#safe-calls) on it and call `let` with the actions in its lambda.

```kotlin
fun processNonNullString(str: String) {}

fun main() {
//sampleStart
    val str: String? = "Hello"   
    //processNonNullString(str)       // compilation error: str can be null
    val length = str?.let { 
        println("let() called on $it")        
        processNonNullString(it)      // OK: 'it' is not null inside '?.let { }'
        it.length
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also use `let` to introduce local variables with a limited scope to make your code easier to read.
To define a new variable for the context object, provide its name as the lambda argument so that it can be used instead of
the default `it`.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem ->
        println("The first item of the list is '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("First item after modifications: '$modifiedFirstItem'")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### with

- **The context object** is available as a receiver (`this`).
- **The return value** is the lambda result.

As [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) is not an extension function: the context
object is passed as an argument, but inside the lambda, it's available as a receiver (`this`).

We recommend using `with` for calling functions on the context object when you don't need to use the returned result.
In code, `with` can be read as "_with this object, do the following._"

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with' is called with argument $this")
        println("It contains $size elements")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also use `with` to introduce a helper object whose properties or functions are used for calculating a value.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val firstAndLast = with(numbers) {
        "The first element is ${first()}," +
        " the last element is ${last()}"
    }
    println(firstAndLast)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### run

- **The context object** is available as a receiver (`this`). 
- **The return value** is the lambda result.

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) does the same as `with` but it is implemented as 
an extension function. So like `let`, you can call it on the context object using dot notation.

`run` is useful when your lambda both initializes objects and computes the return value.

```kotlin
class MultiportService(var url: String, var port: Int) {
    fun prepareRequest(): String = "Default request"
    fun query(request: String): String = "Result for query '$request'"
}

fun main() {
//sampleStart
    val service = MultiportService("https://example.kotlinlang.org", 80)

    val result = service.run {
        port = 8080
        query(prepareRequest() + " to port $port")
    }
    
    // the same code written with let() function:
    val letResult = service.let {
        it.port = 8080
        it.query(it.prepareRequest() + " to port ${it.port}")
    }
//sampleEnd
    println(result)
    println(letResult)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also invoke `run` as a non-extension function. The non-extension variant of `run` has no context object, but it
still returns the lambda result. Non-extension `run` lets you execute a block of several statements where an expression 
is required. In code, non-extension `run` can be read as "_run the code block and compute the result._"

```kotlin
fun main() {
//sampleStart
    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"
        
        Regex("[$sign]?[$digits$hexDigits]+")
    }
    
    for (match in hexNumberRegex.findAll("+123 -FFFF !%*& 88 XYZ")) {
        println(match.value)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### apply

- **The context object** is available as a receiver (`this`). 
- **The return value** is the object itself.

As [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) returns the context object itself, we 
recommend that you use it for code blocks that don't return a value and that mainly operate on the members of the 
receiver object. The most common use case for `apply` is for object configuration. Such calls can be read as "_apply 
the following assignments to the object._"

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply {
        age = 32
        city = "London"        
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Another use case for `apply` is to include `apply` in multiple call chains for more complex processing.

### also

- **The context object** is available as an argument (`it`). 
- **The return value** is the object itself.

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) is useful for performing some actions that take 
the context object as an argument. Use `also` for actions that need a reference to the object rather than its properties
and functions, or when you don't want to shadow the `this` reference from an outer scope.

When you see `also` in code, you can read it as "_and also do the following with the object._"

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("The list elements before adding new one: $it") }
        .add("four")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## takeIf and takeUnless

In addition to scope functions, the standard library contains the functions [`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html) 
and [`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html). These functions let you embed
checks of an object's state in call chains. 

When called on an object along with a predicate, `takeIf` returns this object if it satisfies the given predicate.
Otherwise, it returns `null`. So, `takeIf` is a filtering function for a single object.

`takeUnless` has the opposite logic of `takeIf`. When called on an object along with a predicate, `takeUnless` returns 
`null` if it satisfies the given predicate. Otherwise, it returns the object.

When using `takeIf` or `takeUnless`, the object is available as a lambda argument (`it`).

```kotlin
import kotlin.random.*

fun main() {
//sampleStart
    val number = Random.nextInt(100)

    val evenOrNull = number.takeIf { it % 2 == 0 }
    val oddOrNull = number.takeUnless { it % 2 == 0 }
    println("even: $evenOrNull, odd: $oddOrNull")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> When chaining other functions after `takeIf` and `takeUnless`, don't forget to perform a null check or use a safe call
> (`?.`) because their return value is nullable.
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() //compilation error
    println(caps)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf` and `takeUnless` are especially useful in combination with scope functions. For example, you can chain 
`takeIf` and `takeUnless` with `let` to run a code block on objects that match the given predicate. To do this, 
call `takeIf` on the object and then call `let` with a safe call (`?`). For objects that don't match the predicate, 
`takeIf` returns `null` and `let` isn't invoked.

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("The substring $sub is found in $input.")
            println("Its start position is $it.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For comparison, below is an example of how the same function can be written without using `takeIf` or scope functions:

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("The substring $sub is found in $input.")
            println("Its start position is $index.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

