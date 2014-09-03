---
type: doc
layout: reference
category: "Basics"
title: "Basic Syntax"
---

# Basic Syntax

## Defining packages

Package specification should be at the top of the source file.

``` kotlin
package my.demo

import java.util.*

// ...
```

It is not required to match folder and package structure.

See [Packages](packages.html).

## Defining functions

Function having two `Int` parameters with `Int` return type:

``` kotlin
fun sum(a: Int, b: Int): Int {
  return a + b
}
```

Function with an expression body and inferred return type:

``` kotlin
fun sum(a: Int, b: Int) = a + b
```

Function returning no meaningful value:

``` kotlin
fun printSum(a: Int, b: Int): Unit {
  print(a + b)
}
```

Function visible from outside of a module should have return type explicitly specified:

``` kotlin
public fun sum(a: Int, b: Int): Int = a + b
```

`Unit` return type can be omitted:

``` kotlin
public fun printSum(a: Int, b: Int) {
  print(a + b)
}
```

See [Functions](functions.html).

## Defining local variables

Assign-once (read-only) local variable:

``` kotlin
val a: Int = 1
val b = 1 // `Int` type is inferred
val c: Int // Type required when no initializer provided
c = 1 // definite assignment
```

Mutable variable:

``` kotlin
var x = 5 // `Int` type is inferred
x += 1
```

See also [Properties And Fields](properties.html).

## Using string templates

``` kotlin
fun main(args: Array<String>) {
  if (args.size == 0) return

  print("First argument: ${args[0]}")
}
```

See [String templates](basic-types.html#string-templates).

## Using conditional expressions

``` kotlin
fun max(a: Int, b: Int): Int {
  if (a > b)
    return a
  else
    return b
}
```

Using `if` as an expression:

``` kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```

See [if expressions](control-flow.html#if-expression).

## Using nullable values and checking for null

A reference must be explicitly marked as nullable when `null` value is possible.

Return null if `str` does not hold an integer:

``` kotlin
fun parseInt(str: String): Int? {
  // ...
}
```

Use function returning nullable value:

``` kotlin
fun main(args: Array<String>) {
  if (args.size < 2) {
    print("Two integers expected.")
    return
  }

  val x = parseInt(args[0])
  val y = parseInt(args[1])

  // Using `x * y` yields error because they may hold nulls.
  if (x != null && y != null) {
    // x and y are automatically casted to non-nullable after null check
    print(x * y)
  }
}
```

or

``` kotlin
  // ...
  if (x == null) {
    print("Wrong number format in '${args[0]}'")
    return
  }
  if (y == null) {
    print("Wrong number format in '${args[1]}'")
    return
  }

  // x and y are automatically casted to non-nullable after null check
  print(x * y)
```

See [Null-safety](null-safety.html).

## Using type checks and automatic casts

The `is` operator checks if an expression is an instance of a type.
If an immutable local variable or property is checked for a specific type, there's no need to cast it explicitly:

``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj is String) {
    // `obj` is automatically casted to `String` in this branch
    return obj.length
  }

  // `obj` is still of type `Any` outside of type-checked branch
  return null
}
```

or

``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj !is String)
    return null

 // `obj` is automatically casted to `String` in this branch
 return obj.length
}
```

See [Classes](classes.html) and [Type casts](typecasts.html).

## Using a `for` loop

``` kotlin
fun main(args: Array<String>) {
  for (arg in args)
    print(arg)
```

or

``` kotlin
for (i in args.indices)
    print(args[i])
}
```

See [for loop](control-flow.html#for-loops).

## Using a `while` loop

``` kotlin
fun main(args: Array<String>) {
  var i = 0
  while (i < args.size)
    print(args[i++])
}
```

See [while loop](control-flow.html#while-loops).

## Using `when` expression

``` kotlin
fun cases(obj: Any) {
  when (obj) {
    1          -> print("One")
    "Hello"    -> print("Greeting")
    is Long    -> print("Long")
    !is String -> print("Not a string")
    else       -> print("Unknown")
  }
}
```

See [when expression](control-flow.html#when-expression).

## Using ranges

Check if a number is within a range using `in` operator:

``` kotlin
if (x in 1..y-1)
  print("OK")
```

Check if a number is out of range:

``` kotlin
if (x !in 0..array.lastIndex)
  print("Out")
```

Iterating over a range:

``` kotlin
for (x in 1..5)
  print(x)
```

See [Ranges](ranges.html).

## Using collections

Iterating over a collection:

``` kotlin
for (name in names)
  println(name)
```

Checking if a collection contains an object using `in` operator:

``` kotlin
if (text in names) // names.contains(text) is called
  print("Yes")
```

Using function literals to filter and map collections:

``` kotlin
names filter { it.startsWith("A") } sortBy { it } map { it.toUpperCase() } forEach { print(it) }
```

See [Higher-order functions and Function literals](lambdas.html).

