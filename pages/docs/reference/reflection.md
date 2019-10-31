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

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val c = MyClass::class
```
</div>

The reference is a value of type [KClass](/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html).

Note that a Kotlin class reference is not the same as a Java class reference. To obtain a Java class reference,
use the `.java` property on a `KClass` instance.

## Bound Class References (since 1.1)

You can get the reference to a class of a specific object with the same `::class` syntax by using the object as a receiver:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```
</div>

You obtain the reference to an exact class of an object, for instance `GoodWidget` or `BadWidget`, despite the type of the receiver expression (`Widget`).

## Callable references

References to functions, properties, and constructors, apart from introspecting the program structure, can 
also be called or used as instances of [function types](lambdas.html#function-types).

The common supertype for all callable references is [`KCallable<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-callable/index.html), 
where `R` is the return value type, which is the property type for properties, and the constructed type for constructors. 

### Function References

When we have a named function declared like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun isOdd(x: Int) = x % 2 != 0
```
</div>

We can easily call it directly (`isOdd(5)`), but we can also use it as a function type value, e.g. pass it 
to another function. To do this, we use the `::` operator:

<div class="sample" markdown="1" theme="idea">
```kotlin
fun isOdd(x: Int) = x % 2 != 0

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd))
//sampleEnd
}
```
</div>

Here `::isOdd` is a value of function type `(Int) -> Boolean`.

Function references belong to one of the [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html)
subtypes, depending on the parameter count, e.g. `KFunction3<T1, T2, T3, R>`.

`::` can be used with overloaded functions when the expected type is known from the context.
For example:

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    fun isOdd(x: Int) = x % 2 != 0
    fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"
    
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd)) // refers to isOdd(x: Int)
//sampleEnd
}
```
</div>

Alternatively, you can provide the necessary context by storing the method reference in a variable with an explicitly specified type:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val predicate: (String) -> Boolean = ::isOdd   // refers to isOdd(x: String)
```
</div>

If we need to use a member of a class, or an extension function, it needs to be qualified, e.g. `String::toCharArray`.

Note that even if you initialize a variable with a reference to an extension function, the inferred function type will
have no receiver (it will have an additional parameter accepting a receiver object). To have a function type 
with receiver instead, specify the type explicitly:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val isEmptyStringList: List<String>.() -> Boolean = List<String>::isEmpty 
```
</div>

### Example: Function Composition

Consider the following function:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}
```
</div>

It returns a composition of two functions passed to it: `compose(f, g) = f(g(*))`.
Now, you can apply it to callable references:

<div class="sample" markdown="1" theme="idea">
```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}

fun isOdd(x: Int) = x % 2 != 0

fun main() {
//sampleStart
    fun length(s: String) = s.length
    
    val oddLength = compose(::isOdd, ::length)
    val strings = listOf("a", "ab", "abc")
    
    println(strings.filter(oddLength))
//sampleEnd
}
```
</div>

### Property References

To access properties as first-class objects in Kotlin, we can also use the `::` operator:

<div class="sample" markdown="1" theme="idea">
```kotlin
val x = 1

fun main() {
    println(::x.get())
    println(::x.name) 
}
```
</div>

The expression `::x` evaluates to a property object of type `KProperty<Int>`, which allows us to read its
value using `get()` or retrieve the property name using the `name` property. For more information, please refer to
the [docs on the `KProperty` class](/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html).

For a mutable property, e.g. `var y = 1`, `::y` returns a value of type [`KMutableProperty<Int>`](/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html),
which has a `set()` method:

<div class="sample" markdown="1" theme="idea">
```kotlin
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
```       
</div>            

A property reference can be used where a function with a single generic parameter is expected:

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    val strs = listOf("a", "bc", "def")
    println(strs.map(String::length))
//sampleEnd
}
```
</div>

To access a property that is a member of a class, we qualify it:

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    class A(val p: Int)
    val prop = A::p
    println(prop.get(A(1)))
//sampleEnd
}
```
</div>

For an extension property:

<div class="sample" markdown="1" theme="idea" auto-indent="false">
```kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
```
</div>

### Interoperability With Java Reflection

On the Java platform, standard library contains extensions for reflection classes that provide a mapping to and from Java
  reflection objects (see package `kotlin.reflect.jvm`).
For example, to find a backing field or a Java method that serves as a getter for a Kotlin property, you can say something like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main() {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```
</div>

To get the Kotlin class corresponding to a Java class, use the `.kotlin` extension property:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```
</div>

### Constructor References

Constructors can be referenced just like methods and properties. They can be used wherever an object of function type 
is expected that takes the same parameters as the constructor and returns an object of the appropriate type. 
Constructors are referenced by using the `::` operator and adding the class name. Consider the following function 
that expects a function parameter with no parameters and return type `Foo`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
class Foo

fun function(factory: () -> Foo) {
    val x: Foo = factory()
}
```
</div>

Using `::Foo`, the zero-argument constructor of the class Foo, we can simply call it like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
function(::Foo)
```
</div>

Callable references to constructors are typed as one of the 
[`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) subtypes
, depending on the parameter count.

## Bound Function and Property References (since 1.1)

You can refer to an instance method of a particular object:

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    println(numberRegex.matches("29"))
     
    val isNumber = numberRegex::matches
    println(isNumber("29"))
//sampleEnd
}
```
</div>

Instead of calling the method `matches` directly we are storing a reference to it.
Such reference is bound to its receiver.
It can be called directly (like in the example above) or used whenever an expression of function type is expected:

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    val strings = listOf("abc", "124", "a70")
    println(strings.filter(numberRegex::matches))
//sampleEnd
}
```
</div>

Compare the types of bound and the corresponding unbound references.
Bound callable reference has its receiver "attached" to it, so the type of the receiver is no longer a parameter:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val isNumber: (CharSequence) -> Boolean = numberRegex::matches

val matches: (Regex, CharSequence) -> Boolean = Regex::matches
```
</div>

Property reference can be bound as well:

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main() {
//sampleStart
    val prop = "abc"::length
    println(prop.get())
//sampleEnd
}
```
</div>

Since Kotlin 1.2, explicitly specifying `this` as the receiver is not necessary: `this::foo` and `::foo` are equivalent.

### Bound constructor references

A bound callable reference to a constructor of an [*inner*{: .keyword} class](nested-classes.html#inner-classes) can 
be obtained by providing an instance of the outer class:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner
```
</div>

