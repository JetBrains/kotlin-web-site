---
type: doc
layout: reference
category: "Other"
title: "Destructuring Declarations"
---

# Destructuring Declarations

Sometimes it is convenient to _destructure_ an object into a number of variables, for example:

``` kotlin
val (name, age) = person 
```

This syntax is called a _destructuring declaration_. A destructuring declaration creates multiple variables at once.
We have declared two new variables: `name` and `age`, and can use them independently:
 
``` kotlin
println(name)
println(age)
```

A destructuring declaration is compiled down to the following code:

``` kotlin
val name = person.component1()
val age = person.component2()
```

The `component1()` and `component2()` functions are another example of the _principle of conventions_ widely used in Kotlin 
(see operators like `+` and `*`, *for*{: .keyword }-loops etc.). 
Anything can be on the right-hand side of a destructuring declaration, as long as the required number of component functions can be called on it.
And, of course, there can be `component3()` and `component4()` and so on.

Note that the `componentN()` functions need to be marked with the `operator` keyword to allow using them in a destructuring declaration.

Destructuring declarations also work in *for*{: .keyword }-loops: when you say:

``` kotlin
for ((a, b) in collection) { ... }
```

Variables `a` and `b` get the values returned by `component1()` and `component2()` called on elements of the collection. 

## Example: Returning Two Values from a Function
 
Let's say we need to return two things from a function. For example, a result object and a status of some sort.
A compact way of doing this in Kotlin is to declare a [_data class_](data-classes.html) and return its instance:
 
``` kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// Now, to use this function:
val (result, status) = function(...)
```

Since data classes automatically declare `componentN()` functions, destructuring declarations work here.

**NOTE**: we could also use the standard class `Pair` and have `function()` return `Pair<Int, Status>`, 
but it's often better to have your data named properly.  

## Example: Destructuring Declarations and Maps

Probably the nicest way to traverse a map is this:

``` kotlin
for ((key, value) in map) {
   // do something with the key and the value
}
```

To make this work, we should 

* present the map as a sequence of values by providing an `iterator()` function;
* present each of the elements as a pair by providing functions `component1()` and `component2()`.
  
And indeed, the standard library provides such extensions:

``` kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```  
  
So you can freely use destructuring declarations in *for*{: .keyword }-loops with maps (as well as collections of data class instances etc).

## Underscore for unused variables (since 1.1)

If you don't need a variable in the destructuring declaration, you can place an underscore instead of its name:

``` kotlin
val (_, status) = getResult()
```

The `componentN()` operator functions are not called for the components that are skipped in this way.

## Destructuring in Lambdas (since 1.1)

You can use the destructuring declarations syntax for lambda parameters.
If a lambda has a parameter of the `Pair` type (or `Map.Entry`, or any other type that has the appropriate `componentN` functions), you can introduce several new parameters instead of one by putting them in parentheses:   

``` kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

Note the difference between declaring two parameters and declaring a destructuring pair instead of a parameter:  

``` kotlin
{ a -> ... } // one parameter
{ a, b -> ... } // two parameters
{ (a, b) -> ... } // a destructured pair
{ (a, b), c -> ... } // a destructured pair and another parameter
```

If a component of the destructured parameter is unused, you can replace it with the underscore to avoid inventing its name:

``` kotlin
map.mapValues { (_, value) -> "$value!" }
```

You can specify the type for the whole destructured parameter or for a specific component separately:

``` kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }
```
