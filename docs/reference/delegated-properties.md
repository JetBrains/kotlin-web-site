---
type: doc
layout: reference
category: "Syntax"
title: "Delegated Properties"
---

# Delegated Properties

There are certain common kinds of properties, that, though we can implement them manually every time we need them, 
would be very nice to implement once and for all, and put into a library. Examples include

* lazy properties: the value gets computed only upon first access,
* observable properties: listeners get notified about changes to this property,
* storing properties in a map, not in separate field each.

To cover these (and other) cases, Kotlin supports _delegated properties_:

``` kotlin
class Example {
  var p: String by Delegate()
}
```

The syntax is: `val/var <property name>: <Type> by <expression>`. The expression after *by*{:.keyword} is the _delegate_, 
because `get()` (and `set()`) corresponding to the property will be delegated to it.  
Property delegates don’t have to implement any interface, but they have to provide a `get()` function (and `set()` --- for *var*{:.keyword}'s). 
For example:

``` kotlin
class Delegate {
  fun get(thisRef: Any?, prop: PropertyMetadata): String {
    return "$thisRef, thank you for delegating '${prop.name}' to me!"
  }
 
  fun set(thisRef: Any?, prop: PropertyMetadata, value: String) {
    println("$value has been assigned to '${prop.name} in $thisRef.'")
  }
}
```

When we read from `p` that delegates to an instance of `Delegate`, the `get()` function from `Delegate` is called, 
so that its first parameter is the object we read `p` from and the second parameter holds a description of `p` itself 
(e.g. you can take its name). For example:

``` kotlin
val e = Example()
println(e.p)
```

This prints 

```
Example@33a17727, thank you for delegating ‘p’ to me!
```
 
Similarly, when we assign to `p`, the `set()` function is called. The first two parameters are the same, and the third holds the value being assigned:

``` kotlin
e.p = "NEW"
```

This prints
 
```
NEW has been assigned to ‘p’ in Example@33a17727.
```

## Property Delegate Requirements

Here we summarize requirements to delegate objects. 

For a **read-only** property (i.e. a *val*{:.keyword}), a delegate has to provide a function named `get` that takes the following parameters:

* receiver --- must be the same or a supertype of the _property owner_ (for extension properties --- the type being extended),
* metadata --- must be of type `PropertyMetadata` or its supertype,
 
this function must return the same type as property (or its subtype).

For a **mutable** property (a *var*{:.keyword}), a delegate has to _additionally_ provide a function named `set` that takes the following parameters:
 
* receiver --- same as for `get()`,
* metadata --- same as for `get()`,
* new value --- must be of the same type as a property or its subtype.
 
## Standard Delegates

The Kotlin standard library provides factory methods for several useful kinds of delegates.

### Lazy

`lazy()` is a function that takes a lambda and returns a delegate that implements a lazy property:
the first call to `get()` executes the lambda passed to `lazy()` and remembers the result, 
subsequent calls to `get()` simply return the remembered result. 


``` kotlin
val lazyValue: String by lazy {
    println("computed!")
    "Hello"
}

fun main(args: Array<String>) {
    println(lazyValue)
    println(lazyValue)
}
```

By default, the evaluation of lazy properties is **synchronized**: the value is computed only in one thread, and all threads
will see the same value. If the synchronization is not required (multiple threads can call the delegate), pass
`LazyThreadSafetyMode.NONE` as a parameter to the `lazy()` function.


### Observable

`Delegates.observable()` takes two arguments: the initial value and a handler for modifications.
The handler gets called every time we assign to the property (before the assignment is performed). It has three
parameters: a property being assigned to, the old value and the new one:

``` kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        d, old, new ->
        println("$old -> $new")
    }
}

fun main(args: Array<String>) {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```

This example prints

```
<no name> -> first
first -> second
```

If you want to be able to intercept an assignment and "veto" it, use `vetoable()` instead of `observable()`.


## Storing Properties in a Map

One common use case is storing the values of properties in a map.
This comes up often in applications like parsing JSON or doing other “dynamic” things.
In this case, you can use the map instance itself as the delegate for a delegated property.
In order for this to work, you need to import an extension function that adapts maps to the
delegated property API:

``` kotlin
import kotlin.properties.get

class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

In this example, the constructor takes a map:

``` kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

Delegates take values from this map (by the string keys – names of properties):


``` kotlin
println(user.name) // Prints "John Doe"
println(user.age)  // Prints 25
```

This works also for *var*{:.keyword}’s properties if you use a `MutableMap` instead of read-only `Map`
and import an additional extension function: `kotlin.properties.set`
