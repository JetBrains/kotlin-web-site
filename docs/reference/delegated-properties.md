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
class Delegate() {
  fun get(thisRef: Any?, prop: PropertyMetadata): String {
    return "$thisRef, thank you for delegating '${prop.name}' to me!"
  }
 
  fun set(thisRef: Any?, prop: PropertyMetadata, value: String) {
    println("$value has been assigned")
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

For a **mutable** property (a *val*{:.keyword}), a delegate has to _additionally_ provide a function named `set` that takes the following parameters:
 
* receiver --- same as for `get()`,
* matadata --- same as for `get()`,
* new value --- must be of the same type as a property or its subtype.
 
## Standard Delegates


The `kotlin.properties.Delegates` object from the standard provides factory methods for several useful kinds of delegates.

### Lazy

`Delegates.lazy()` is a function that takes a lambda and returns a delegate that implements a lazy property: 
the first call to `get()` executes the lambda passed to `lazy()` and remembers the result, 
subsequent calls to `get()` simply return the remembered result. 


``` kotlin
import kotlin.properties.Delegates
 
val lazy: String by Delegates.lazy {
    println("computed!")
    "Hello"
}

fun main(args: Array<String>) {
    println(lazy)
    println(lazy)
}
```


If you want **thread safety**, use `blockingLazy()`: it works the same way, but guarantees that the values will be 
computed only in one thread, and that all threads will see the same value.


### Observable

`Delegates.observable()` takes two arguments: initial value and a handler for modifications. 
The handler gets called every time we assign to the property, it has three parameters: a property being assigned to, the old value and the new one: 

``` kotlin
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

### Not-Null

Sometimes we have a non-null *var*{:.keyword}, but we don’t have an appropriate value to assign to it in the constructor, 
i.e. it must be assigned later. The problem is that you can’t have an uninitialized non-abstract property in Kotlin:

``` kotlin
class Foo {
  var bar: Bar // ERROR: must be initialized
}
```

We could initialize it with `null`, bit then we’d have to check every time we access it. 

`Delegates.notNull()` can solve this problem:

``` kotlin
class Foo {
  var bar: Bar by Delegates.notNull()
}
```

If this property is read before being written to for the first time, it throws an exception, after the first assignment it works as expected.

### Storing Properties in a Map

`Delegates.mapVal()` takes a map instance and returns a delegate that reads property values from this map, using property name as a key.
There are many use cases of this kind in applications like parsing JSON or doing other “dynamic” things:

``` kotlin
class User(val map: Map<String, Any?>) {
    val name: String by Delegates.mapVal(map)
    val age: Int     by Delegates.mapVal(map)
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

For *var*{:.keyword}’s we can use `mapVar()` (note that it takes a `MutableMap` instead of read-only `Map`).