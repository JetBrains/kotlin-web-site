---
type: doc
layout: reference
category: "Syntax"
title: "Reflection"
---

# Reflection

Reflection is a set of language and library features that allows for introspecting the structure of you own program at runtime.
Kotlin makes functions and properties first-class citizens in the language, and introspecting them (i.e. learning a name or 
a type of a property or function at runtime) is closely intertwined with simply using functional or reactive style.   

## Function References

When we have a named function declared like this:
  
``` kotlin
fun isOdd(x: Int) = x % 2 != 0
```

We can easily call it directly (`isOdd(5)`), but we can also pass it as a value, e.g. to another function. 
To do this, we use the `::` operator:  
  
``` kotlin
val numbers = listOf(1, 2, 3)
println(numbers.filter(::isOdd)) // prints [1, 3]
```

Here `::isOdd` is a value of function type `(Int) -> Boolean`. 

If we need to use a member of a class, or an extension function, it needs to be qualified, 
and the result will be of type “extension function”,  
e.g. `String::toCharArray` gives us an extension function for type `String`: `String.() -> CharArray`.

### Example: Function Composition

Consider the following function:

``` kotlin
fun compose<A, B, C>(f: (B) -> C, g: (A) -> B): (A) -> C {
    return {x -> f(g(x))}
}
```

It returns a composition of two functions passed to it: `compose(f, g) = f(g(*))`. 
Now, you can apply it to callable references:


``` kotlin
fun length(s: String) = s.size
 
val oddLength = compose(::isOdd, ::length)
val strings = listOf("a", "ab", "abc")

println(strings.filter(oddLength)) // Prints "[a, abc]"
```

## Property References

To access properties as first-class objects in Kotlin, we can also use the `::` operator:

``` kotlin
var x = 1
 
fun main(args: Array<String>) {
    println(::x.get()) // prints "1"
    ::x.set(2)
    println(x)         // prints "2"
}
```

The expression `::x` evaluates to a property object of type `KProperty<Int>`, which allows one to read its 
value using `.get()` or retrieve the property name using the `.name` property. For more information, please refer to
 the [docs on the `KProperty` class](http://jetbrains.github.io/kotlin/versions/snapshot/apidocs/kotlin/reflect/KProperty.html).

For a mutable property, e.g. `var y = 1`, `::y` returns a value of type [`KMutableProperty<Int>`](http://jetbrains.github.io/kotlin/versions/snapshot/apidocs/kotlin/reflect/KMutableProperty.html), 
which has a `set()` method. 
 
To access a property that is a member of a class, we qualify it:


``` kotlin
class A(val p: Int)
 
fun main(args: Array<String>) {
    val prop = A::p
    println(prop.get(A(1))) // prints "1"
}
```

For an extension property:


``` kotlin
val String.lastChar: Char
  get() = this[size - 1]
 
fun main(args: Array<String>) {
  println(String::lastChar.get("abc")) // prints "c"
}
```

### Interoperability With Java Reflection

On the Java platform, standard library contains extensions for reflection classes that provide a mapping to and from Java
  reflection objects (see package `kotlin.reflect.jvm`).
For example, to find a backing field or a Java method that serves as a getter for a Kotlin property, you can say something like this:


``` kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main(args: Array<String>) {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```