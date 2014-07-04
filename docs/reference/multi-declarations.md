---
type: doc
layout: reference
category: "Other"
title: "Multi-Declarations"
---

# Multi-Declarations

Sometimes it is convenient to _decompose_ an object into a number of variables, for example:

``` kotlin
val (name, age) = person 
```

This syntax is called a _multi-declaration_. A multi-declaration creates multiple variable at once.  
We have declared two new variables: `name` and `age`, and can use them independently:
 
``` kotlin
println(name)
println(age)
```

A multi-declarations is compiled down to the following code:

``` kotlin
val name = person.component1()
val age = person.component2()
```

The `component1()` and `component2()` functions are another example of the _principle of conventions_ widely used in Kotlin 
(see operators like `+` and `*`, **for**-loops etc.). 
Anything can be on the right-hand side of a multi-assignment, as long as the required number of component functions can be called on it. 
And, of course, there can be `component3()` and `component4()` and so on.

Multi-declarations also work in for-loops: when you say

``` kotlin
for ((a, b) in collection) { ... }
```

Variables `a` and `b` get the values returned by `component1()` and `component2()` called on elements of the collection. 

## Example: Returning Two Values from a Function
 
Let's say we need to return two things from a function. For example, a result object and a status of some sort.
A compact way of doing this in Kotlin is to declare a [_data-class_](data-classes.html) and return its instance:
 
``` kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// Now, to use this function:
val (result, status) = function(...)
```

Since data classes automatically declare `componentN()` functions, multi-declarations work here.

**NOTE**: we could also use the standard class `Pair` and have `function()` return `Pair<Int, Status>`, 
but it's often better to have your data named properly.  

## Example: Multi-Declarations and Maps

Probably the nicest way to traverse a map is this:

``` kotlin
for ((key, value) in map) {
   // do something with the key and the value
}
```

To make this work, we should 
1. present the map as sequence of values by providing an `iterator()` function,
2. present each of the elements as a pair by providing functions `component1()` and `component2()`.
  
And indeed, the standard library provides such extensions:

``` kotlin
fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V> = entrySet().iterator()
fun <K, V> Map.Entry<K, V>.component1() = getKey()
fun <K, V> Map.Entry<K, V>.component2() = getValue()
  
```  
  
So you can freely use multi-declarations in for-loops with maps (as well as collections of data class instances etc).