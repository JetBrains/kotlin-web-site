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

Additionally, there's a function similar to class references, which are currently unsupported in JS compiler:
`jsClass<ClassName>()`. This function returns `JsClass` as well.

Examples:

``` kotlin
class A
class B
class C

inline fun <reified T> foo() {
    println(jsClass<T>().name)
}

println(A().jsClass.name)   // prints "A"
println(jsClass<B>().name)  // prints "B"
foo<C>()                    // prints "C"
```
