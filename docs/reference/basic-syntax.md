---
type: doc
layout: reference
category: "Basics"
title: "Basic Syntax"
---

# Basic Syntax

## Defining Packages

``` kotlin
package my.demo // One per file

import std.io.*

// ...

```

See [Packages](packages.html).

## Defining functions

``` kotlin
// Return type mandatory
fun sum(a : Int, b : Int) : Int {
  return a + b
}
```

or

``` kotlin
// Return type may be inferred
fun sum(a : Int, b : Int) = a + b
When no meaningful value returned:

fun printSum(a : Int, b : Int) : Unit {
  print(a + b)
}
```

or

``` kotlin
// Return type is optional when Unit is intended
fun printSum(a : Int, b : Int) {
  print(a + b)
}
```

See [Functions](functions.html).


## Defining local variables

Assign-once (read-only) local variable:

``` kotlin
val a : Int = 1
val b = 1 // Type is inferred
val c : Int // Type required when no initializer provided
c = 1 // definite assignment
```

Note that semicolons are optional.

Mutable variable:

``` kotlin
var x = 5 // Type inferred
x += 1
```

See also [Properties And Fields](properties.html).

Use a string template

``` kotlin
fun main(args : Array<String>) {
  if (args.size == 0) return

  print("First argument: ${args[0]}")
}
```

See [String templates](basic-types.html#string-templates).
See [Arrays](basic-types.html#arrays).


## Using conditional expressions

``` kotlin
fun max(a : Int, b : Int) : Int {
  if (a > b)
    return a
  else
    return b
}
```

or

``` kotlin
// 'if' is an expression
fun max(a : Int, b : Int) = if (a > b) a else b
```

See [if expressions](control-flow.html#if-expression).

## Null-checks

A reference must be explicitly marked as nullable to be able hold a null:

``` kotlin
package multiplier

// Return null if str does not hold a number
fun parseInt(str : String) : Int? {
  // ...
}

fun main(args : Array<String>) {
  if (args.size < 2) {
    print("No number supplied");
  }
  val x = parseInt(args[0])
  val y = parseInt(args[1])

  // We cannot say 'x * y' now because they may hold nulls

  if (x != null && y != null) {
    print(x * y) // Now we can
  }
}
```

or

``` kotlin
// ...
  if  (x == null) {
    print("Wrong number format in '${args[0]}'")
    return
  }
  if  (y == null) {
    print("Wrong number format in '${args[1]}'")
    return
  }
  print(x * y) // Now we know that x and y are not nulls
```

See [Null-safety](null-safety.html).

## is-checks and automatic casts

The is operator checks if an expression is an instance of a type (and more). If we is-checked an immutable local variable or property, there's no need to cast it explicitly to the is-checked type:

``` kotlin
fun getStringLength(obj : Any) : Int? {
  if (obj is String)
    return obj.length // no cast to String is needed
  return null
}
```

or

``` kotlin
fun getStringLength(obj : Any) : Int? {
  if (obj !is String)
    return null
  return obj.length // no cast to String is needed
}
```

See [Classes](classes.html) and [Inheritance](classes.html#inheritance).
See [Type casts](typecasts.html).

## Using a for-loop

``` kotlin
fun main(args : Array<String>) {
  for (arg in args)
    print(arg)
```

or

``` kotlin
for (i in args.indices)
    print(args[i])
}
```

See [for-loops](control-flow.html#for-loops).

## Using a while-loop

``` kotlin
fun main(args : Array<String>) {
  var i = 0
  while (i < args.size)
    print(args[i++])
}
```

See [while-loop](control-flow.html#while-loops).

## Using when-expression

``` kotlin
fun cases(obj : Any) {
  when (obj) {
    1          -> print("One")
    "Hello"    -> print("Greeting")
    is Long    -> print("Long")
    !is String -> print("Not a string")
    else       -> print("Unknown")
  }
}
```

See [`when`-expressions](control-flow.html#when-expression).

## Using ranges and in

Check if a number lies within a range:

``` kotlin
if (x in 1..y-1)
  print("OK")
```

Check if a number is out of range:

``` kotlin
if (x !in 0..array.lastIndex)
  print("Out")
```

Check if a collection contains an object:

``` kotlin
if (obj in collection) // collection.contains(obj) is called
  print("Yes")
```

## Iterating over a range:

``` kotlin
for (x in 1..5)
  print(x)
```

See [Ranges](ranges.html).

Using function literals to filter and map collections

``` kotlin
names filter {it.startsWith("A")} sortBy {it} map {it.toUpperCase()} forEach {print(it)}
```

See [Higher-order functions and Function literals](lambdas.html).

