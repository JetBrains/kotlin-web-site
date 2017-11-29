---
type: doc
layout: reference
category: "Syntax"
title: "Reflection"
---

# Reflection

Reflection is a set of language and library features that allows for introspecting the structure of your own program at runtime.
Kotlin makes functions and properties first-class citizens in the language, and introspecting them (i.e. learning a name or 
a type of a property or function at runtime) is closely intertwined with simply using a functional or reactive style.

> On the Java platform, the runtime component required for using the reflection features is distributed as a separate
JAR file (`kotlin-reflect.jar`). This is done to reduce the required size of the runtime library for applications
that do not use reflection features. If you do use reflection, please make sure that the .jar file is added to the
classpath of your project.
{:.note}

## Class References

The most basic reflection feature is getting the runtime reference to a Kotlin class. To obtain the reference to a
statically known Kotlin class, you can use the _class literal_ syntax:

``` kotlin
val c = MyClass::class
```

The reference is a value of type [KClass](/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html).

Note that a Kotlin class reference is not the same as a Java class reference. To obtain a Java class reference,
use the `.java` property on a `KClass` instance.

## Bound Class References (since 1.1)

You can get the reference to a class of a specific object with the same `::class` syntax by using the object as a receiver:

``` kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

You obtain the reference to an exact class of an object, for instance `GoodWidget` or `BadWidget`, despite the type of the receiver expression (`Widget`).  

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

`::` can be used with overloaded functions when the expected type is known from the context.
For example:

``` kotlin
fun isOdd(x: Int) = x % 2 != 0
fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"

val numbers = listOf(1, 2, 3)
println(numbers.filter(::isOdd)) // refers to isOdd(x: Int)
```

Alternatively, you can provide the necessary context by storing the method reference in a variable with an explicitly specified type:

``` kotlin
val predicate: (String) -> Boolean = ::isOdd   // refers to isOdd(x: String)
```

If we need to use a member of a class, or an extension function, it needs to be qualified.
e.g. `String::toCharArray` gives us an extension function for type `String`: `String.() -> CharArray`.

### Example: Function Composition

Consider the following function:

``` kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}
```

It returns a composition of two functions passed to it: `compose(f, g) = f(g(*))`.
Now, you can apply it to callable references:


``` kotlin
fun length(s: String) = s.length

val oddLength = compose(::isOdd, ::length)
val strings = listOf("a", "ab", "abc")

println(strings.filter(oddLength)) // Prints "[a, abc]"
```

## Property References

To access properties as first-class objects in Kotlin, we can also use the `::` operator:

``` kotlin
val x = 1

fun main(args: Array<String>) {
    println(::x.get()) // prints "1"
    println(::x.name)  // prints "x"
}
```

The expression `::x` evaluates to a property object of type `KProperty<Int>`, which allows us to read its
value using `get()` or retrieve the property name using the `name` property. For more information, please refer to
the [docs on the `KProperty` class](/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html).

For a mutable property, e.g. `var y = 1`, `::y` returns a value of type [`KMutableProperty<Int>`](/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html),
which has a `set()` method:

``` kotlin
var y = 1

fun main(args: Array<String>) {
    ::y.set(2)
    println(y) // prints "2"
}
```                   

A property reference can be used where a function with no parameters is expected:
 
``` kotlin
val strs = listOf("a", "bc", "def")
println(strs.map(String::length)) // prints [1, 2, 3]
```

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
    get() = this[length - 1]

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

To get the Kotlin class corresponding to a Java class, use the `.kotlin` extension property:

``` kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

## Constructor References

Constructors can be referenced just like methods and properties. They can be used wherever an object of function type 
is expected that takes the same parameters as the constructor and returns an object of the appropriate type. 
Constructors are referenced by using the `::` operator and adding the class name. Consider the following function 
that expects a function parameter with no parameters and return type `Foo`:

``` kotlin
class Foo

fun function(factory: () -> Foo) {
    val x: Foo = factory()
}
```

Using `::Foo`, the zero-argument constructor of the class Foo, we can simply call it like this:

``` kotlin
function(::Foo)
```

## Bound Function and Property References (since 1.1)

You can refer to an instance method of a particular object:

``` kotlin 
val numberRegex = "\\d+".toRegex()
println(numberRegex.matches("29")) // prints "true"
 
val isNumber = numberRegex::matches
println(isNumber("29")) // prints "true"
```

Instead of calling the method `matches` directly we are storing a reference to it.
Such reference is bound to its receiver.
It can be called directly (like in the example above) or used whenever an expression of function type is expected:

``` kotlin
val strings = listOf("abc", "124", "a70")
println(strings.filter(numberRegex::matches)) // prints "[124]"
```

Compare the types of bound and the corresponding unbound references.
Bound callable reference has its receiver "attached" to it, so the type of the receiver is no longer a parameter:

``` kotlin
val isNumber: (CharSequence) -> Boolean = numberRegex::matches

val matches: (Regex, CharSequence) -> Boolean = Regex::matches
```

Property reference can be bound as well:

``` kotlin
val prop = "abc"::length
println(prop.get())   // prints "3"
```

Since Kotlin 1.2, explicitly specifying `this` as the receiver is not necessary: `this::foo` and `::foo` are equivalent.