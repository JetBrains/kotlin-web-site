---
type: doc
layout: reference
category: "Basics"
title: "Basic Syntax"
---

# Basic Syntax

{:#defining-packages}

## Package definition and imports

Package specification should be at the top of the source file:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
package my.demo

import kotlin.text.*

// ...
```

</div>

It is not required to match directories and packages: source files can be placed arbitrarily in the file system.

See [Packages](packages.html).

## Program entry point

An entry point of a Kotlin application is the `main` function.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
    println("Hello world!")
}
```

</div>

{:#defining-functions}

## Functions

Function having two `Int` parameters with `Int` return type:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun sum(a: Int, b: Int): Int {
    return a + b
}
//sampleEnd

fun main() {
    print("sum of 3 and 5 is ")
    println(sum(3, 5))
}
```

</div>

Function with an expression body and inferred return type:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun sum(a: Int, b: Int) = a + b
//sampleEnd

fun main() {
    println("sum of 19 and 23 is ${sum(19, 23)}")
}
```

</div>

Function returning no meaningful value:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
```

</div>

`Unit` return type can be omitted:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
```

</div>

See [Functions](functions.html).

{:#defining-variables}

## Variables

Read-only local variables are defined using the keyword `val`. They can be assigned a value only once.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val a: Int = 1  // immediate assignment
    val b = 2   // `Int` type is inferred
    val c: Int  // Type required when no initializer is provided
    c = 3       // deferred assignment
//sampleEnd
    println("a = $a, b = $b, c = $c")
}
```

</div>

Variables that can be reassigned use the `var` keyword:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    var x = 5 // `Int` type is inferred
    x += 1
//sampleEnd
    println("x = $x")
}
```

</div>

Top-level variables:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
val PI = 3.14
var x = 0

fun incrementX() { 
    x += 1 
}
//sampleEnd

fun main() {
    println("x = $x; PI = $PI")
    incrementX()
    println("incrementX()")
    println("x = $x; PI = $PI")
}
```

</div>

See also [Properties And Fields](properties.html).


## Comments

Just like most modern languages, Kotlin supports single-line (or _end-of-line_) and multi-line (_block_) comments.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// This is an end-of-line comment

/* This is a block comment
   on multiple lines. */
```

</div>

Block comments in Kotlin can be nested.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
/* The comment starts here
/* contains a nested comment */     
and ends here. */
```

</div>

See [Documenting Kotlin Code](kotlin-doc.html) for information on the documentation comment syntax.

{:#using-string-templates}

## String templates

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    var a = 1
    // simple name in template:
    val s1 = "a is $a" 
    
    a = 2
    // arbitrary expression in template:
    val s2 = "${s1.replace("is", "was")}, but now is $a"
//sampleEnd
    println(s2)
}
```

</div>

See [String templates](basic-types.html#string-templates) for details.

{:#using-conditional-expressions}

## Conditional expressions

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```

</div>


In Kotlin, *if*{: .keyword } can also be used as an expression:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int) = if (a > b) a else b
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```

</div>

See [*if*{: .keyword }-expressions](control-flow.html#if-expression).

{:#using-nullable-values-and-checking-for-null}

## Nullable values and *null*{: .keyword } checks

A reference must be explicitly marked as nullable when *null*{: .keyword } value is possible.

Return *null*{: .keyword } if `str` does not hold an integer:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

</div>

Use a function returning nullable value:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
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
        println("'$arg1' or '$arg2' is not a number")
    }    
}
//sampleEnd


fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("a", "b")
}
```

</div>

or


<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)
    
//sampleStart
    // ...
    if (x == null) {
        println("Wrong number format in arg1: '$arg1'")
        return
    }
    if (y == null) {
        println("Wrong number format in arg2: '$arg2'")
        return
    }

    // x and y are automatically cast to non-nullable after null check
    println(x * y)
//sampleEnd
}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("99", "b")
}
```

</div>

See [Null-safety](null-safety.html).

{:#using-type-checks-and-automatic-casts}

## Type checks and automatic casts

The *is*{: .keyword } operator checks if an expression is an instance of a type.
If an immutable local variable or property is checked for a specific type, there's no need to cast it explicitly:


<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
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


fun main() {
    fun printLength(obj: Any) {
        println("'$obj' string length is ${getStringLength(obj) ?: "... err, not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```

</div>

or

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // `obj` is automatically cast to `String` in this branch
    return obj.length
}
//sampleEnd


fun main() {
    fun printLength(obj: Any) {
        println("'$obj' string length is ${getStringLength(obj) ?: "... err, not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```

</div>

or even

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    // `obj` is automatically cast to `String` on the right-hand side of `&&`
    if (obj is String && obj.length > 0) {
        return obj.length
    }

    return null
}
//sampleEnd


fun main() {
    fun printLength(obj: Any) {
        println("'$obj' string length is ${getStringLength(obj) ?: "... err, is empty or not a string at all"} ")
    }
    printLength("Incomprehensibilities")
    printLength("")
    printLength(1000)
}
```

</div>

See [Classes](classes.html) and [Type casts](typecasts.html).

{:#using-a-for-loop}

## `for` loop

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (item in items) {
        println(item)
    }
//sampleEnd
}
```

</div>

or

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (index in items.indices) {
        println("item at $index is ${items[index]}")
    }
//sampleEnd
}
```

</div>


See [for loop](control-flow.html#for-loops).

{:#using-a-while-loop}

## `while` loop

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    var index = 0
    while (index < items.size) {
        println("item at $index is ${items[index]}")
        index++
    }
//sampleEnd
}
```

</div>


See [while loop](control-flow.html#while-loops).

{:#using-when-expression}

## `when` expression

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
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

fun main() {
    println(describe(1))
    println(describe("Hello"))
    println(describe(1000L))
    println(describe(2))
    println(describe("other"))
}
```

</div>


See [when expression](control-flow.html#when-expression).

{:#using-ranges}

## Ranges

Check if a number is within a range using *in*{: .keyword } operator:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val x = 10
    val y = 9
    if (x in 1..y+1) {
        println("fits in range")
    }
//sampleEnd
}
```

</div>


Check if a number is out of range:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val list = listOf("a", "b", "c")
    
    if (-1 !in 0..list.lastIndex) {
        println("-1 is out of range")
    }
    if (list.size !in list.indices) {
        println("list size is out of valid list indices range, too")
    }
//sampleEnd
}
```

</div>

Iterating over a range:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    for (x in 1..5) {
        print(x)
    }
//sampleEnd
}
```

</div>

or over a progression:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    for (x in 1..10 step 2) {
        print(x)
    }
    println()
    for (x in 9 downTo 0 step 3) {
        print(x)
    }
//sampleEnd
}
```

</div>

See [Ranges](ranges.html).

{:#using-collections}

## Collections

Iterating over a collection:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
    val items = listOf("apple", "banana", "kiwifruit")
//sampleStart
    for (item in items) {
        println(item)
    }
//sampleEnd
}
```

</div>

Checking if a collection contains an object using *in*{: .keyword } operator:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
    val items = setOf("apple", "banana", "kiwifruit")
//sampleStart
    when {
        "orange" in items -> println("juicy")
        "apple" in items -> println("apple is fine too")
    }
//sampleEnd
}
```

</div>

Using lambda expressions to filter and map collections:

<div class="sample" markdown="1" theme="idea" auto-indent="false" indent="2">

```kotlin
fun main() {
//sampleStart
    val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
    fruits
      .filter { it.startsWith("a") }
      .sortedBy { it }
      .map { it.toUpperCase() }
      .forEach { println(it) }
//sampleEnd
}
```

</div>

See [Collections overview](collections-overview.html).

## Creating basic classes and their instances

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val rectangle = Rectangle(5.0, 2.0)
    val triangle = Triangle(3.0, 4.0, 5.0)
//sampleEnd
    println("Area of rectangle is ${rectangle.calculateArea()}, its perimeter is ${rectangle.perimeter}")
    println("Area of triangle is ${triangle.calculateArea()}, its perimeter is ${triangle.perimeter}")
}

abstract class Shape(val sides: List<Double>) {
    val perimeter: Double get() = sides.sum()
    abstract fun calculateArea(): Double
}

interface RectangleProperties {
    val isSquare: Boolean
}

class Rectangle(
    var height: Double,
    var length: Double
) : Shape(listOf(height, length, height, length)), RectangleProperties {
    override val isSquare: Boolean get() = length == height
    override fun calculateArea(): Double = height * length
}

class Triangle(
    var sideA: Double,
    var sideB: Double,
    var sideC: Double
) : Shape(listOf(sideA, sideB, sideC)) {
    override fun calculateArea(): Double {
        val s = perimeter / 2
        return Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC))
    }
}
```

</div>

See [classes](classes.html) and [objects and instances](object-declarations.html).
