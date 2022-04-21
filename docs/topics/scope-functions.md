[//]: # (title: Scope functions)

The Kotlin standard library contains several functions whose sole purpose is to execute a block of code within the
context of an object. When you call such a function on an object with a [lambda expression](lambdas.md) provided, it
forms a temporary scope. In this scope, you can access the object without its name.  Such functions are called _scope
functions_. There are five of them: `let`, `run`, `with`, `apply`, and `also`.

All scope functions execute a block of code on an object, but they differ in two important ways:

-  They make context objects available within the provided lambda in different ways, either as a [receiver
   object](lambdas.md#function-literals-with-receiver) or [implicit single
   argument](lambdas.md#it-implicit-name-of-a-single-parameter).
-  They return different result values.

Here's a typical usage of a scope function:

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

To write equivalent code without using `let`, you'll have to introduce a new variable and repeat its name whenever you
use it.

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

Scope functions do not introduce any new technical capabilities, but they can make your code more concise and readable.

Choosing the right scope function for your use case can be a bit tricky. The choice mainly depends on your intent and
the consistency of use in your project. The sections below provide additional details on the differences between scope
functions and the common conventions surrounding their usage.

## Function selection

To help you choose the right scope function for your purpose, we provide the table of key differences between them.

|Function|Object reference|Return value|Is extension function|
|---|---|---|---|
|`let`|`it`|Lambda result|Yes|
|`run`|`this`|Lambda result|Yes|
|`run`|-|Lambda result|No: called without the context object|
|`with`|`this`|Lambda result|No: takes the context object as an argument.|
|`apply`|`this`|Context object|Yes|
|`also`|`it`|Context object|Yes|

Detailed information about the differences is provided in the dedicated sections below.

Here is a short guide for choosing scope functions depending on the intended purpose:

* Executing a lambda on non-null objects: `let`
* Introducing an expression as a variable in local scope: `let`
* Object configuration: `apply`
* Object configuration and computing the result: `run`
* Running statements where an expression is required: non-extension `run`
* Additional effects: `also`
* Grouping function calls on an object: `with`

The use cases for different scope functions overlap, so that you can choose the functions based on the specific
conventions used in your project or team.

Although scope functions can make your code more concise, avoid overusing them: overuse of scope functions can decrease
the readability of your code and lead to errors. Avoid nesting scope functions and be careful when chaining them: when
scope functions are nested, it's easy to get confused about which context object a scope function's `this` or `it`
bindings refer to.

## Distinctions

Because scope functions are all similar in nature, it's important to understand the differences between them. There are
two main differences between each scope function:

* The way that the context object is passed to the scope function's lambda.
* The scope function's return value.

### Context object: this or it

Inside the lambda passed to a scope function, the context object is available by an implicitly declared short name. Each
scope function uses one of two ways to access the context object: as a lambda
[receiver](lambdas.md#function-literals-with-receiver) (`this`) or as a [lambda
argument](lambdas.md#it-implicit-name-of-a-single-parameter) (`it`). Both provide the same capabilities, so we'll
describe the pros and cons of each for different cases and provide recommendations on their use.

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

`run`, `with`, and `apply` bind the context object as a [receiver object](lambdas.md#function-literals-with-receiver)
using the keyword `this`.  Hence, in their lambdas, the object is available as it would be in the context of class
method declarations. In most cases, you can omit `this` when accessing the members of the receiver object, which can
make your code more concise. On the other hand, when `this` is omitted, it can be hard to distinguish between the
receiver members and external objects or functions. In general, we recommend using these scope functions to execute
blocks that mainly operate on the object's members, such as calling its functions or assigning values to its properties.

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply { 
        age = 20                       // same as this.age = 20 or adam.age = 20
        city = "London"
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### it

`let` and `also` bind the context object as a [lambda argument](lambdas.md#lambda-expression-syntax). If the argument
name is not specified, you can access the object using the implicit default parameter name `it`. `it` is shorter than
`this` and expressions with `it` are usually easier to read.

However, when the context object is passed as a lambda argument, its members are not implicitly available without
qualification as they are when it is bound as a receiver object. Using these scope functions is better when the object
is mostly used as an argument in function calls. `it` can also be better if you use multiple variables in the lambda.

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

Additionally, when the context object is passed as an argument, you can provide a custom name for the context object
inside the lambda scope.

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

Scope functions also differ by the result value they return:

* `apply` and `also` return the context object.
* `let`, `run`, and `with` return the lambda result.

These two options let you choose the proper function depending on what result value you need.

#### Context object 

The return value of `apply` and `also` is the context object itself. This makes them a good fit for call chains as _side
steps_: you can continue chaining function calls on the same object after the scope function ends.

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

`let`, `run`, and `with` return the result returned by the provided lambda. So, you can use them when assigning the
result to a variable, chaining operations on the result, and so on.

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

To help you choose the right scope function, we'll describe them in detail and provide usage recommendations.
Technically, scope functions are typically interchangeable, so the examples show common conventions for using them.

### let

- **The context object** is available as a lambda argument (`it`).
- **The return value** is the lambda result.

`let` can be used to invoke one or more functions on the result of a call chain. For example, the following code prints
the results of two operations on a collection:

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

With `let`, you can rewrite it without assigning the result of the list
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

If the code block passed to `let` contains a single function that takes only one argument, you can use pass a method
reference (`::`) to `let` instead of a lambda:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let` is often used to execute a block of code only when a value is non-null. To perform actions on a non-null object,
use the [safe call operator `?.`](null-safety.md#safe-calls) on it and call `let` with the actions in its lambda.

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

You can also use `let` to introduce local variables with a limited scope to improve code readability. To define a new
variable for the context object, provide its name as the lambda argument so that it can be used instead of the default
`it`.

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

- **the context object**: is passed as an argument, but inside the lambda, it's
  available as a function receiver (`this`).
- **The return value**: is the lambda result.

`with` is _not_ an extension function, so it cannot be invoked on a context object using dot notation. Instead, invoke
`with` like a top-level function, passing the desired context object as an argument.

We recommend using `with` for calling functions on a context object when you don't need to use the returned result. For
example, it's a good choice for executing a block of side-effects using the context object. In the code, `with` can be
read as “_with this object, do the following._”

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

- **The context object** is available as a receiver object (`this`).
- **The return value** is the lambda result.

`run` is the same as `with` but is implemented as an extension function. So, like `let`, you can call it on the context
object using dot notation.

`run` is useful when the provided lambda both initializes an object and computes a needed return value.

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
still returns the result of the argument lambda. Non-extension `run` lets you execute a block of several statements
where an expression is required.

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

- **The context object** is available as a receiver object (`this`).
- **The return value** is the context object.

`apply` is an extension function. `apply` will always return the context object, so it's best suited for code blocks
that don't return a value and mainly operate on the members of the context object. This scope function is commonly used
for object configuration. Such calls can be read as “_apply the following assignments to the object._”

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

Because `apply` returns the context object, you can easily include `apply` in call chains for more complex processing.

### also

- **The context object** is available as an argument (`it`).
- **The return value** is the context object.

`also` is an extension function that is similar to `apply` but differs in the way the context object is passed to the
provided lambda. `also` is good for performing actions that take the context object as an argument. Use `also` for
actions that need a reference to the object rather than its properties and functions, or when you don't want to shadow
an existing `this` reference from an outer scope (such as `this` in the context of a class declaration).

When you see `also` in the code, you can read it as “_and also do the following with the object._”

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

In addition to scope functions, the standard library contains the functions `takeIf` and `takeUnless`. These functions
let you embed checks on an object's state in call chains.

`takeIf` is a filtering function for a single object: it takes a predicate as an argument, and can be invoked as an
extension function on a context object.  When the context object satisfies the given predicate, `takeIf` returns the
context object, otherwise it returns null. `takeIf` passes the context object to the provided predicate as a lambda
argument (it can be referenced using the name `it`).

`takeUnless` has the same binding and invocation behaviors as `takeIf`, but it inverts its predicate checking behavior.
While `takeIf` returns the context object only if the given predicate returns `true` when applied to the object,
`takeUnless` only returns the context object if the given predicate returns `false` when applied to the object.

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

When chaining other functions after `takeIf` and `takeUnless`, don't forget to perform the null check or the safe call
(`?.`) because their return value is nullable.

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

`takeIf` and `takeUnless` are especially useful in combination with scope functions. A good case is chaining them with
`let` for running a code block on objects that match the given predicate. To do this, call `takeIf` on the object and
then call `let` with a safe call (`?`). For objects that don't match the predicate, `takeIf` returns `null` and `let`
isn't invoked.

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

This is how the same function can be implemented without using `takeIf` or scope functions:

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

