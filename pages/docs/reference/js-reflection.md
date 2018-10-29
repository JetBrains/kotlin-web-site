---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript Reflection"
---

# JavaScript Reflection

At this time, JavaScript does not support the full Kotlin reflection API. The only supported part of the API
is the `::class` syntax which allows you to refer to the class of an instance, or the class corresponding to the given type.
The value of a `::class` expression is a stripped-down [KClass](/api/latest/jvm/stdlib/kotlin.reflect/-k-class/)
implementation that only supports the [simpleName](/api/latest/jvm/stdlib/kotlin.reflect/-k-class/simple-name.html) and
[isInstance](/api/latest/jvm/stdlib/kotlin.reflect/-k-class/is-instance.html) members.

In addition to that, you can use [KClass.js](/api/latest/jvm/stdlib/kotlin.js/js.html) to access the
[JsClass](/api/latest/jvm/stdlib/kotlin.js/-js-class/index.html) instance corresponding to the class.
The `JsClass` instance itself is a reference to the constructor function.
This can be used to interoperate with JS functions that expect a reference to a constructor.

Examples:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
class A
class B
class C

inline fun <reified T> foo() {
    println(T::class.simpleName)
}

val a = A()
println(a::class.simpleName)  // Obtains class for an instance; prints "A"
println(B::class.simpleName)  // Obtains class for a type; prints "B"
println(B::class.js.name)     // prints "B"
foo<C>()                      // prints "C"
```
</div>
