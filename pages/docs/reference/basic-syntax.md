---
type: doc
layout: reference
category: "Basics"
title: "Basic Syntax"
---

# Basic Syntax

## Defining packages

Package specification should be at the top of the source file:

``` kotlin
package my.demo

import java.util.*

// ...
```

It is not required to match directories and packages: source files can be placed arbitrarily in the file system.

See [Packages](packages.html).

## Defining functions

Function having two `Int` parameters with `Int` return type:

<div class="sample" markdown="1">

``` kotlin
//sampleStart
fun sum(a: Int, b: Int): Int {
    return a + b
}
//sampleEnd

fun main(args: Array<String>) {
    print("sum of 3 and 5 is ")
    println(sum(3, 5)) //sum of 3 and 5 is 8
}
```
</div>

Function with an expression body and inferred return type:

<div class="sample" markdown="1">

``` kotlin
//sampleStart
fun sum(a: Int, b: Int) = a + b
//sampleEnd

fun main(args: Array<String>) {
    println("sum of 19 and 23 is ${sum(19, 23)}") //sum of 19 and 23 is 42
}
```
</div>

Function returning no meaningful value:

<div class="sample" markdown="1">

``` kotlin
//sampleStart
fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main(args: Array<String>) {
    printSum(-1, 8) //sum of -1 and 8 is 7
}
```
</div>

`Unit` return type can be omitted:

<div class="sample" markdown="1">

``` kotlin
//sampleStart
fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main(args: Array<String>) {
    printSum(-1, 8) //sum of -1 and 8 is 7
}
```
</div>

See [Functions](functions.html).

## Defining local variables

Assign-once (read-only) local variable:

<div class="sample" markdown="1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    val a: Int = 1  // immediate assignment
    val b = 2   // `Int` type is inferred
    val c: Int  // Type required when no initializer is provided
    c = 3       // deferred assignment
//sampleEnd
    println("a = $a, b = $b, c = $c") //a = 1, b = 2, c = 3
}
```
</div>

Mutable variable:

<div class="sample" markdown="1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    var x = 5 // `Int` type is inferred
    x += 1
//sampleEnd
    println("x = $x") //x = 6
}
```
</div>

See also [Properties And Fields](properties.html).


## Comments

Just like Java and JavaScript, Kotlin supports end-of-line and block comments.

``` kotlin
// This is an end-of-line comment

/* This is a block comment
   on multiple lines. */
```

Unlike Java, block comments in Kotlin can be nested.

See [Documenting Kotlin Code](kotlin-doc.html) for information on the documentation comment syntax.

## Using string templates

<div class="sample" markdown="1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    var a = 1
    // simple name in template:
    val s1 = "a is $a" 
    
    a = 2
    // arbitrary expression in template:
    val s2 = "${s1.replace("is", "was")}, but now is $a"
//sampleEnd
    println(s2) //a was 1, but now is 2
}
```
</div>

See [String templates](basic-types.html#string-templates).

## Using conditional expressions


<div class="sample" markdown="1">

``` kotlin
//sampleStart
fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}
//sampleEnd

fun main(args: Array<String>) {
    println("max of 0 and 42 is ${maxOf(0, 42)}") //max of 0 and 42 is 42
}
```
</div>


Using *if*{: .keyword } as an expression:

<div class="sample" markdown="1">

``` kotlin
//sampleStart
fun maxOf(a: Int, b: Int) = if (a > b) a else b
//sampleEnd

fun main(args: Array<String>) {
    println("max of 0 and 42 is ${maxOf(0, 42)}") //max of 0 and 42 is 42
}
```
</div>

See [*if*{: .keyword }-expressions](control-flow.html#if-expression).

## Using nullable values and checking for *null*{: .keyword }

A reference must be explicitly marked as nullable when *null*{: .keyword } value is possible.

Return *null*{: .keyword } if `str` does not hold an integer:

``` kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

Use a function returning nullable value:


<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

//sampleStart
fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // Using `x * y` yields error because they may hold nulls.
    if (x != null && y != null) {
        // x and y are automatically cast to non-nullable after null check
        println(x * y)
    }
    else {
        println("either '$arg1' or '$arg2' is not a number")
    }    
}
//sampleEnd


fun main(args: Array<String>) {
    printProduct("6", "7") //42
    printProduct("a", "7") //either 'a' or '7' is not a number
    printProduct("a", "b") //either 'a' or 'b' is not a number
}
```
</div>

or


<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)
    
//sampleStart
    // ...
    if (x == null) {
        println("Wrong number format in arg1: '${arg1}'")
        return
    }
    if (y == null) {
        println("Wrong number format in arg2: '${arg2}'")
        return
    }

    // x and y are automatically cast to non-nullable after null check
    println(x * y)
//sampleEnd
}

fun main(args: Array<String>) {
    printProduct("6", "7") //42
    printProduct("a", "7") //Wrong number format in arg1: 'a'
    printProduct("99", "b") //Wrong number format in arg2: 'b'
}
```
</div>

See [Null-safety](null-safety.html).

## Using type checks and automatic casts

The *is*{: .keyword } operator checks if an expression is an instance of a type.
If an immutable local variable or property is checked for a specific type, there's no need to cast it explicitly:


<div class="sample" markdown="1">

``` kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // `obj` is automatically cast to `String` in this branch
        return obj.length
    }

    // `obj` is still of type `Any` outside of the type-checked branch
    return null
}
//sampleEnd


fun main(args: Array<String>) {
    fun printLength(obj: Any) {
        println("'$obj' string length is ${getStringLength(obj) ?: "... err, not a string"} ")
    }
    printLength("Incomprehensibilities") //'Incomprehensibilities' string length is 21 
    printLength(1000) //'1000' string length is ... err, not a string 
    printLength(listOf(Any())) //'[java.lang.Object@77459877]' string length is ... err, not a string
}
```
</div>

or

<div class="sample" markdown="1">

``` kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // `obj` is automatically cast to `String` in this branch
    return obj.length
}
//sampleEnd


fun main(args: Array<String>) {
    fun printLength(obj: Any) {
        println("'$obj' string length is ${getStringLength(obj) ?: "... err, not a string"} ")
    }
    printLength("Incomprehensibilities") //'Incomprehensibilities' string length is 21 
    printLength(1000) //'1000' string length is ... err, not a string
    printLength(listOf(Any())) //'[java.lang.Object@77459877]' string length is ... err, not a string 
}
```
</div>

or even

<div class="sample" markdown="1">

``` kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    // `obj` is automatically cast to `String` on the right-hand side of `&&`
    if (obj is String && obj.length > 0) {
        return obj.length
    }

    return null
}
//sampleEnd


fun main(args: Array<String>) {
    fun printLength(obj: Any) {
        println("'$obj' string length is ${getStringLength(obj) ?: "... err, is empty or not a string at all"} ")
    }
    printLength("Incomprehensibilities") //'Incomprehensibilities' string length is 21 
    printLength("") //'' string length is ... err, is empty or not a string at all 
    printLength(1000) //'1000' string length is ... err, is empty or not a string at all 
}
```
</div>

See [Classes](classes.html) and [Type casts](typecasts.html).

## Using a `for` loop

<div class="sample" markdown="1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    val items = listOf("apple", "banana", "kiwi")
    for (item in items) {
        println(item) //apple
                      //banana
                      //kiwi
    }
//sampleEnd
}
```
</div>

or

<div class="sample" markdown="1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    val items = listOf("apple", "banana", "kiwi")
    for (index in items.indices) {
        println("item at $index is ${items[index]}") //item at 0 is apple
                                                     //item at 1 is banana
                                                     //item at 2 is kiwi
    }
//sampleEnd
}
```
</div>


See [for loop](control-flow.html#for-loops).

## Using a `while` loop

<div class="sample" markdown="1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    val items = listOf("apple", "banana", "kiwi")
    var index = 0
    while (index < items.size) {
        println("item at $index is ${items[index]}")//item at 0 is apple
                                                    //item at 1 is banana
                                                    //item at 2 is kiwi
        index++
    }
//sampleEnd
}
```
</div>


See [while loop](control-flow.html#while-loops).

## Using `when` expression

<div class="sample" markdown="1">

``` kotlin
//sampleStart
fun describe(obj: Any): String =
    when (obj) {
        1          -> "One"
        "Hello"    -> "Greeting"
        is Long    -> "Long"
        !is String -> "Not a string"
        else       -> "Unknown"
    }
//sampleEnd

fun main(args: Array<String>) {
    println(describe(1)) //One
    println(describe("Hello")) //Greeting
    println(describe(1000L)) //Long
    println(describe(2)) //Not a string
    println(describe("other")) //Unknown
}
```
</div>


See [when expression](control-flow.html#when-expression).

## Using ranges

Check if a number is within a range using *in*{: .keyword } operator:

<div class="sample" markdown="1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    val x = 10
    val y = 9
    if (x in 1..y+1) {
        println("fits in range") //fits in range
    }
//sampleEnd
}
```
</div>


Check if a number is out of range:

<div class="sample" markdown="1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    val list = listOf("a", "b", "c")
    
    if (-1 !in 0..list.lastIndex) {
        println("-1 is out of range") //-1 is out of range
    }
    if (list.size !in list.indices) {
        println("list size is out of valid list indices range too") //list size is out of valid list indices range too
    }
//sampleEnd
}
```
</div>


Iterating over a range:

<div class="sample" markdown="1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    for (x in 1..5) {
        print(x) //12345
    }
//sampleEnd
}
```
</div>

or over a progression:

<div class="sample" markdown="1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    for (x in 1..10 step 2) {
        print(x) //13579
    }
    for (x in 9 downTo 0 step 3) {
        print(x) //9630
    }
//sampleEnd
}
```
</div>

See [Ranges](ranges.html).

## Using collections

Iterating over a collection:

<div class="sample" markdown="1">

``` kotlin
fun main(args: Array<String>) {
    val items = listOf("apple", "banana", "kiwi")
//sampleStart
    for (item in items) {
        println(item) //apple
                      //banana
                      //kiwi
    }
//sampleEnd
}
```
</div>


Checking if a collection contains an object using *in*{: .keyword } operator:

<div class="sample" markdown="1">

``` kotlin
fun main(args: Array<String>) {
    val items = setOf("apple", "banana", "kiwi")
//sampleStart
    when {
        "orange" in items -> println("juicy")
        "apple" in items -> println("apple is fine too") //apple is fine too
    }
//sampleEnd
}
```
</div>


Using lambda expressions to filter and map collections:


<div class="sample" markdown="1">

``` kotlin
fun main(args: Array<String>) {
    val fruits = listOf("banana", "avocado", "apple", "kiwi")
//sampleStart
    fruits
        .filter { it.startsWith("a") }
        .sortedBy { it }
        .map { it.toUpperCase() }
        .forEach { println(it) //APPLE
                               //AVOCADO }
//sampleEnd
}
```
</div>

See [Higher-order functions and Lambdas](lambdas.html).
