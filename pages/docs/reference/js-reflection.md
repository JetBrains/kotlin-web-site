---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript Reflection"
---

# JavaScript Reflection

In Kotlin compiled to JavaScript, there's a property available
on any object called `jsClass` which returns a `JsClass` instance. `JsClass` currently can do nothing more than providing
a (non-qualified) name of the class. However, the `JsClass` instance itself is a reference to the constructor function.
This can be used to interoperate with JS functions that expect a reference to a constructor.

To get a reference to a class, you can use the `::class` syntax. Full reflection API is currently not supported
in Kotlin for JavaScript; the only available properties are `.simpleName` which returns the name of the class
and `.js` which returns the corresponding `JsClass`.

Examples:

``` kotlin
class A
class B
class C

inline fun <reified T> foo() {
    println(jsClass<T>().name)
}

println(A().jsClass.name)     // prints "A"
println(B::class.simpleName)  // prints "B"
println(B::class.js.name)     // prints "B"
foo<C>()                      // prints "C"
```
