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
  fun get(thisRef: Any?, property: PropertyMetadata): String {
    return "$thisRef, thank you for delegating '${prop.name}' to me!"
  }
 
  fun set(thisRef: Any?, property: PropertyMetadata, value: String) {
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
* new value --- must be of the same type as a property or its supertype.
 
`get()` and/or `set()` functions may be provided either as member functions of the delegate class or extension functions. The latter is handy when you need to delegate property to an object, which doesn't originally provide these functions.


## Standard Delegates

The Kotlin standard library provides factory methods for several useful kinds of delegates.

### Lazy

`lazy()` is a function that takes a lambda and returns an instance of `Lazy<T>` which can serve as a delegate for implementing a lazy property:
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
The handler gets called every time we assign to the property (_after_ the assignment has been performed). It has three
parameters: a property being assigned to, the old value and the new one:

``` kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new ->
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

If you want to be able to intercept an assignment and "veto" it, use `vetoable()` instead of `observable()`. The handler passed to the `vetoable` is called _before_ the assignment of a new property value has been performed.


### Storing Properties in a Map

You can delegate read-only (*val*{:.keyword}) properties to a read-only map with the extension `get()` accessor provided by standard library. This accessor reads property values from the map, using property name as a key.
There are many use cases of this kind in applications like parsing JSON or doing other “dynamic” things:

``` kotlin
import kotlin.properties.*

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

Delegated properties take values from this map (by the string keys --– names of properties):


``` kotlin
println(user.name) // Prints "John Doe"
println(user.age)  // Prints 25
```

To delegate *var*{:.keyword} properties you should use a `MutableMap` instead of read-only `Map`, so the property value can be stored back to the map:

``` kotlin
import kotlin.properties.*

class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```
