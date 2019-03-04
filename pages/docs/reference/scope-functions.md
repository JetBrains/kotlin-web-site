---
type: doc
layout: reference
category: "Syntax"
title: "Scope Functions"
---

# Scope Functions

The Kotlin standard library contains several functions whose sole purpose is to execute a block of code within the context of an object. When you call such a function on an object with a [lambda expression](lambdas.html) provided, it forms a temporary scope. In this scope, you can access the object without its name. Such functions are called _scope functions_. There are five of them: `let`, `run`, `with`, `apply`, and `also`.

Basically, these functions do the same: execute a block of code on an object. What's different is how this object becomes available inside the block and what is the result of the whole expression.

Here's a typical usage of a scope function:


<div class="sample" markdown="1" theme="idea">
```kotlin
data class Person(var name: String, var age, var city) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    Person("Alice", 20, "Amsterdam").let {
        println("Calling run()")
        it.moveTo("London")
        it.incrementAge()
        println(it)
    }
//sampleEnd
}
```
</div>

If you write the same without `let`, you'll have to introduce a new variable and repeat its name whenever you use it. 

<div class="sample" markdown="1" theme="idea">
```kotlin
data class Person(var name: String, var age, var city) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    val alice = Person("Alice", 20, "Amsterdam")
    println("Without run()")
    alice.moveTo("London")
    alice.incrementAge()
    println(alice)
//sampleEnd
}
```
</div>

The scope functions do not introduce any new technical capabilities, but they can make your code more concise and readable.

Due to the similar nature of scope functions, choosing the right one for your case can be a bit tricky. The choice mainly depends on your intent and the consistency of use in your project. Below we'll provide detailed descriptions of the distinctions between scope functions and the conventions on their usage.

## Distinctions

Because the scope functions are all quite similar in nature, it's important to understand the differences between them. There are two main differences between each scope function: 
* The way to refer to the context object
* The return value.

### Context object: `this` or `it`

Each scope function uses one of two ways to access the context object in the passed lambda function: as a lambda receiver (`this`) or as a lambda argument (`it`). Both provide the same technical capabilities, so we'll describe the pros and cons of each for different cases and provide recommendations on their use.

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
    val str = "Hello"
    // this
    str.run {
        println("The receiver string's length is $length")
        //println("The receiver string's length is ${this.length}") // does the same
    }

    // it
    str.let {
        println("The receiver string's length is ${it.length}")
    }
}
```
</div>

#### this

`run`, `with`, and `apply` refer to the context object as a lambda receiver - by keyword `this`. Hence, in their lambdas, the object is available as it would be in ordinary class functions. In most cases, you can omit `this` when accessing the members of the receiver object, making the code shorter. On the other hand, if `this` is omitted, it can be hard to distinguish between the receiver members and external objects or functions. So, having the context object as a receiver (`this`) is recommended for lambdas that mainly operate the object members: call its functions or assign properties.

<div class="sample" markdown="1" theme="idea">
```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply { 
        age = 20                       // same as this.age = 20 or adam.age = 20
        city = "London"
    }
//sampleEnd
}
```
</div>

#### it

In turn, `let` and `also` have the context object as a lambda argument. If the argument name is not specified, the object is accessed by the implicit default name `it`. `it` is shorter than `this` and expressions with `it` are usually easier for reading. However, you can't omit the argument name, so there is no way to shorten calls to the object functions or properties. Hence, having the context object as `it` is better when the object is mostly used as an argument in function calls. `it` is also better if you operate multiple variables in the code block.

<div class="sample" markdown="1" theme="idea">
```kotlin
fun writeToLog(str: String) {}
fun writeToFile(str: String) {}

fun main() {
//sampleStart
    "Hello".also {
        println("Also called on the string $it")
        writeToLog(it)
        writeToFile(it)
    }
//sampleEnd
}
```
</div>

Additionally, when you pass the context object as an argument, you can provide a custom name for the context object inside the scope.

<div class="sample" markdown="1" theme="idea">
```kotlin
fun writeToLog(str: String) {}

fun main() {
//sampleStart
    "Hello".also { myString -> 
        println("Also called on the string $myString")
        writeToLog(myString)
    }
//sampleEnd
}
```
</div>

### Return value

Scope functions return different values:
* `apply` and `also` return the context object.
* `let`, `run`, and `with` return the lambda result.

These two options let you choose the proper function depending on what you do next in your code.

Having the object itself as a return value is useful for chaining other operations on it.

<div class="sample" markdown="1" theme="idea">
```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "") {
    fun moveTo(newCity: String) { city = newCity}
}

fun main() {
//sampleStart
    val adam = Person("Adam")
    adam.apply {
        age = 32
        city = "London"
    }.moveTo("Manchester")
//sampleEnd
}
```
</div>

The lambda result is generally better for other purposes: assigning it to a variable, chaining operations on the result, and so on.

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val resultSize = numbers.run { 
        add("four")
        add("five")
        filter { it.endsWith("e") }.size        
    }
    println("There are $resultSize elements that end with e.")
//sampleEnd
}
```
</div>

Additionally, you can ignore the return value and use a scope function for creating a temporary scope. 

<div class="sample" markdown="1" theme="idea">
```kotlin
data class Person(var name: String, var age: Int, var city: String)

fun main() {
//sampleStart
    val adam = Person("Adam", 20, "London")
    val length = run {
        val hello = "Hello"
        val greeting = "$hello, ${adam.name}"
        val length = greeting.length             // the variables are available only within the lambda
        length
    }
//sampleEnd
}
```
</div>

## Functions

To help you choose the right scope function for your case, we'll describe them in detail and provide usage recommendations. Technically, functions are interchangeable in many cases, so the examples show the conventions that define the common usage style. 

### `let`

**The context object** is available as an argument (`it`). **The return value** is the lambda result.

`let` can be used to invoke one or more functions on results of call chains. For example, the following code prints the results of two operations on a collection:

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    val resultList = numbers.map { it.length }.filter { it > 3 }
    println(resultList)    
//sampleEnd
}
```
</div>

With `let`, you can rewrite it:

<div class="sample" markdown="1" theme="idea">
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
</div>

If the code block contains a single function with `it` as an argument, you can use the method reference (`::`) instead of the lambda:

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```
</div>

`let` is often used for executing a code block only with non-null values. To perform actions on a non-null object, use the safe call operator `?` on it and call `let` with the actions in its lambda.

<div class="sample" markdown="1" theme="idea">
```kotlin
fun processNonNullString(str: String) {}

fun main() {
//sampleStart
    val str: String? = "Hello"   
    //processNonNullString(str)       // compilation error: str can be null
    val length = str?.let { 
        println("let() called on $it")        
        processNonNullString(it)      // OK: the function is called only on non-nulls
        it.length
    }
//sampleEnd
}
```
</div>

Another case for using `let` is introducing local variables for improving code readability. To define a variable, provide its name as the lambda argument so that it can be used instead of the default `it`.

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    val str: String = "Hello"   
    val length = str.let { myString ->
        println("let() called on $myString")
        myString.length
    }
//sampleEnd
}
```
</div>

### `with`

A non-extension function: **the context object** is passed as an argument, but inside the lambda, it's available as a receiver (`this`). **The return value** is the lambda result. 

We recommend `with` for calling functions on the context object without providing the lambda result. In the code, `with` can be read as “_with this object, do the following._”

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("With called with argument $this")
        println("It contains $size elements")
    }
//sampleEnd
}
```
</div>

Another use case for `with` is introducing a helper object whose properties or functions will be used for calculating a value.

<div class="sample" markdown="1" theme="idea">
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
</div>

### `run`

**The context object** is available as a receiver (`this`). **The return value** is the lambda result.

`run` does the same as `with` but invokes as `let` - as an extension function of the context object.

`run` is useful when your lambda contains both the object initialization and the computation of the return value.

<div class="sample" markdown="1" theme="idea">
```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val isTeenager = Person("Adam").run {
        age = 32
        city = "London"
        age > 12 && age < 20
    }
    println("Is Adam a teenager? $isTeenager")
//sampleEnd
}
```
</div>

Besides calling `run` on a receiver object, you can use it as a non-extension function. Non-extension `run` lets you execute a block of several statements where an expression is required.

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val numbers2 = mutableListOf("four", "five")

    val resultSize = run {
        println("run called without receiver.")
        for (str in numbers2) numbers.add(str)
        numbers.size
    }
    println("The list size is $resultSize")
//sampleEnd
}
```
</div>

### `apply`

**The context object** is available as a receiver (`this`). **The return value** is the object itself.

Use `apply` for code blocks that don't return a value and mainly operate the members of the receiver object. The common case for `apply` is the object configuration. Such calls can be read as “_apply the following assignments to the object._”

<div class="sample" markdown="1" theme="idea">
```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply {
        age = 32
        city = "London"        
    }
//sampleEnd
}
```
</div>

Having the receiver as the return value, you can easily include `apply` into call chains for more complex processing.

### `also`

**The context object** is available as an argument (`it`). **The return value** is the object itself.

`also` is good for performing some actions that take the context object as an argument. Use `also` for additional actions that don't alter the object, such as logging or printing debug information. Usually, you can remove the calls of `also` from the call chain without breaking the program logic. 

When you see `also` in the code, you can read it as “_and also do the following_”.

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    numbers.also {
        println("Adding new element to the list")
    }.add("four")
//sampleEnd
}
```
</div>

## Function Selection

To help you choose the right scope function for your purpose, we provide the table of key differences between them. 

|Function|Object reference|Return value|Is extension function|
|---|---|---|---|
|`let`|`it`|Lambda result|Yes|
|`run`|`this`|Lambda result|Yes|
|`run`|-|Lambda result|No: called without the context object|
|`with`|`this`|Lambda result|No: takes the context object as an argument.|
|`apply`|`this`|Context object|Yes|
|`also`|`it`|Context object|Yes|

Here is a short guide for choosing scope functions depending on the intended purpose:

* Executing a lambda on non-null objects: `let`
* Introducing an expression as a variable in local scope: `let`
* Object configuration: `apply`
* Object configuration and computing the result: `run`
* Running statements where an expression is required: non-extension `run`
* Additional effects: `also`
* Grouping function calls on an object: `with`

The use cases of different functions overlap, so that you can choose the functions based on the specific conventions used in your project or team.

Although the scope functions are a way of making the code more concise, avoid overusing them: it can decrease your code readability and lead to errors. Avoid nesting scope functions and be careful when chaining them: it's easy to get confused about the current context object and the value of `this` or `it`.

## `takeIf` and `takeUnless`

In addition to scope functions, the standard library contains the functions `takeIf` and `takeUnless`. These functions let you embed checks of the object state in call chains. 

When called on an object with a predicate provided, `takeIf` returns this object if it matches the predicate. Otherwise, it returns `null`. In turn, `takeUnless` returns the object if it doesn't match the predicate and `null` if it does. The object is available as a lambda argument (`it`).

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    val str = "Hello"
    val emptyStr = ""

    val definitelyNotEmpty = str.takeIf { it.isNotEmpty() }
    val nullForEmpty = emptyStr.takeUnless { it.isEmpty() }
//sampleEnd
}
```
</div>

When chaining other functions after `takeIf` and `takeUnless`, don't forget to perform the null check or the safe call (`?`) because their return value is nullable.

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.toUpperCase()
   //val caps = str.takeIf { it.isNotEmpty() }.toUpperCase() //compilation error
    println(caps)
//sampleEnd
}
```
</div>

`takeIf` and `takeUnless` are especially useful together with scope functions. A good case is chaining them with `let` for running a code block on objects that match the given predicate. To do this, call `takeIf` on the object and then call `let` with a safe call (`?`). For objects that don't match the predicate, `takeIf` returns null and `let` isn't invoked.

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    fun findSubstringPosition(input: String, sub: String): Int {
        return input.indexOf(sub).takeIf { it >= 0 } ?: error("Substring not found")
    }
    
    println(findSubstringPosition("010000011", "11"))
    println(findSubstringPosition("010000011", "12"))
//sampleEnd
}
```
</div>

This how the same function looks without the standard library functions:

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    fun findSubstringPosition(input: String, sub: String): Int {
        if (input.indexOf(sub) >= 0) {
            return input.indexOf(sub)
        } else {
            error("Substring not found")
        }
    }
    
    println(findSubstringPosition("010000011", "11"))
    println(findSubstringPosition("010000011", "12"))
//sampleEnd
}
```
</div>





