---
type: doc
layout: reference
category: "Syntax"
title: "Delegated Properties"
---

# Delegated Properties

There are certain common kinds of properties, that, though we can implement them manually every time we need them, 
would be very nice to implement once and for all, and put into a library. Examples include:

* lazy properties: the value gets computed only upon first access;
* observable properties: listeners get notified about changes to this property;
* storing properties in a map, instead of a separate field for each property.

To cover these (and other) cases, Kotlin supports _delegated properties_:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Example {
    var p: String by Delegate()
}
```

</div>

The syntax is: `val/var <property name>: <Type> by <expression>`. The expression after *by*{:.keyword} is the _delegate_, 
because `get()` (and `set()`) corresponding to the property will be delegated to its `getValue()` and `setValue()` methods.
Property delegates don’t have to implement any interface, but they have to provide a `getValue()` function (and `setValue()` --- for *var*{:.keyword}s).
For example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import kotlin.reflect.KProperty

class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "$thisRef, thank you for delegating '${property.name}' to me!"
    }
 
    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$value has been assigned to '${property.name}' in $thisRef.")
    }
}
```

</div>

When we read from `p` that delegates to an instance of `Delegate`, the `getValue()` function from `Delegate` is called,
so that its first parameter is the object we read `p` from and the second parameter holds a description of `p` itself 
(e.g. you can take its name). For example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val e = Example()
println(e.p)
```

</div>

This prints:

```
Example@33a17727, thank you for delegating ‘p’ to me!
```
 
Similarly, when we assign to `p`, the `setValue()` function is called. The first two parameters are the same, and the third holds the value being assigned:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
e.p = "NEW"
```

</div>

This prints
 
```
NEW has been assigned to ‘p’ in Example@33a17727.
```

The specification of the requirements to the delegated object can be found [below](delegated-properties.html#property-delegate-requirements).

Note that since Kotlin 1.1 you can declare a delegated property inside a function or code block, it shouldn't necessarily be a member of a class.
Below you can find [the example](delegated-properties.html#local-delegated-properties-since-11).

## Standard Delegates

The Kotlin standard library provides factory methods for several useful kinds of delegates.

### Lazy

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) is a function that takes a lambda and returns an instance of `Lazy<T>` which can serve as a delegate for implementing a lazy property:
the first call to `get()` executes the lambda passed to `lazy()` and remembers the result, 
subsequent calls to `get()` simply return the remembered result. 

<div class="sample" markdown="1" theme="idea">

```kotlin
val lazyValue: String by lazy {
    println("computed!")
    "Hello"
}

fun main() {
    println(lazyValue)
    println(lazyValue)
}
```

</div>

By default, the evaluation of lazy properties is **synchronized**: the value is computed only in one thread, and all threads
will see the same value. If the synchronization of initialization delegate is not required, so that multiple threads
can execute it simultaneously, pass `LazyThreadSafetyMode.PUBLICATION` as a parameter to the `lazy()` function. 
And if you're sure that the initialization will always happen on the same thread as the one where you use the property,
you can use `LazyThreadSafetyMode.NONE`: it doesn't incur any thread-safety guarantees and the related overhead.


### Observable

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html)
takes two arguments: the initial value and a handler for modifications.
The handler is called every time we assign to the property (_after_ the assignment has been performed). It has three
parameters: a property being assigned to, the old value and the new one:

<div class="sample" markdown="1" theme="idea">

```kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new ->
        println("$old -> $new")
    }
}

fun main() {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```

</div>

If you want to intercept assignments and "veto" them, use [`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html) instead of `observable()`.
The handler passed to the `vetoable` is called _before_ the assignment of a new property value has been performed.

## Storing Properties in a Map

One common use case is storing the values of properties in a map.
This comes up often in applications like parsing JSON or doing other “dynamic” things.
In this case, you can use the map instance itself as the delegate for a delegated property.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

</div>

In this example, the constructor takes a map:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

</div>

Delegated properties take values from this map (by the string keys --– names of properties):

<div class="sample" markdown="1" theme="idea">

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}

fun main() {
    val user = User(mapOf(
        "name" to "John Doe",
        "age"  to 25
    ))
//sampleStart
    println(user.name) // Prints "John Doe"
    println(user.age)  // Prints 25
//sampleEnd
}
```

</div>

This works also for *var*{:.keyword}’s properties if you use a `MutableMap` instead of read-only `Map`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

</div>

## Local Delegated Properties (since 1.1)

You can declare local variables as delegated properties.
For instance, you can make a local variable lazy:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

</div>

The `memoizedFoo` variable will be computed on the first access only.
If `someCondition` fails, the variable won't be computed at all.

## Property Delegate Requirements

Here we summarize requirements to delegate objects. 

For a **read-only** property (*val*{:.keyword}), a delegate has to provide an operator function `getValue()` with the following parameters:

* `thisRef` --- must be the same or a supertype of the _property owner_ (for extension properties --- the type being extended).
* `property` --- must be of type `KProperty<*>` or its supertype.
 
`getValue()` must return the same type as the property (or its subtype).

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Resource

class Owner {
    val valResource: Resource by ResourceDelegate()
}

class ResourceDelegate {
    operator fun getValue(thisRef: Owner, property: KProperty<*>): Resource {
        return Resource()
    }
}
```

</div>

For a **mutable** property (*var*{:.keyword}), a delegate has to additionally provide an operator function `setValue()` 
with the following parameters:

* `thisRef` --- must be the same or a supertype of the _property owner_ (for extension properties --- the type being extended).
* `property` --- must be of type `KProperty<*>` or its supertype.
* `value` --- must be of the same type as the property (or its supertype).
 
<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Resource

class Owner {
    var varResource: Resource by ResourceDelegate()
}

class ResourceDelegate(private var resource: Resource = Resource()) {
    operator fun getValue(thisRef: Owner, property: KProperty<*>): Resource {
        return resource
    }
    operator fun setValue(thisRef: Owner, property: KProperty<*>, value: Any?) {
        if (value is Resource) {
            resource = value
        }
    }
}
```

</div>

`getValue()` and/or `setValue()` functions may be provided either as member functions of the delegate class or extension functions.
The latter is handy when you need to delegate property to an object which doesn't originally provide these functions.
Both of the functions need to be marked with the `operator` keyword.

The delegate class may implement one of the interfaces `ReadOnlyProperty` and `ReadWriteProperty` containing the required `operator` methods.
These interfaces are declared in the Kotlin standard library:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
interface ReadOnlyProperty<in R, out T> {
    operator fun getValue(thisRef: R, property: KProperty<*>): T
}

interface ReadWriteProperty<in R, T> {
    operator fun getValue(thisRef: R, property: KProperty<*>): T
    operator fun setValue(thisRef: R, property: KProperty<*>, value: T)
}
```

</div>

### Translation Rules

Under the hood for every delegated property the Kotlin compiler generates an auxiliary property and delegates to it.
For instance, for the property `prop` the hidden property `prop$delegate` is generated, and the code of the accessors simply delegates to this additional property:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// this code is generated by the compiler instead:
class C {
    private val prop$delegate = MyDelegate()
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

</div>

The Kotlin compiler provides all the necessary information about `prop` in the arguments: the first argument `this` refers to an instance of the outer class `C` and `this::prop` is a reflection object of the `KProperty` type describing `prop` itself.

Note that the syntax `this::prop` to refer a [bound callable reference](reflection.html#bound-function-and-property-references-since-11) in the code directly is available only since Kotlin 1.1.  

### Providing a delegate (since 1.1)

By defining the `provideDelegate` operator you can extend the logic of creating the object to which the property implementation is delegated.
If the object used on the right hand side of `by` defines `provideDelegate` as a member or extension function, that function will be
called to create the property delegate instance.

One of the possible use cases of `provideDelegate` is to check property consistency when the property is created, not only in its getter or setter.

For example, if you want to check the property name before binding, you can write something like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class ResourceDelegate<T> : ReadOnlyProperty<MyUI, T> {
    override fun getValue(thisRef: MyUI, property: KProperty<*>): T { ... }
}
    
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(
            thisRef: MyUI,
            prop: KProperty<*>
    ): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        // create delegate
        return ResourceDelegate()
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

class MyUI {
    fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

</div>

The parameters of `provideDelegate` are the same as for `getValue`:

* `thisRef` --- must be the same or a supertype of the _property owner_ (for extension properties --- the type being extended);
* `property` --- must be of type `KProperty<*>` or its supertype.

The `provideDelegate` method is called for each property during the creation of the `MyUI` instance, and it performs the necessary validation right away.

Without this ability to intercept the binding between the property and its delegate, to achieve the same functionality
you'd have to pass the property name explicitly, which isn't very convenient:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Checking the property name without "provideDelegate" functionality
class MyUI {
    val image by bindResource(ResourceID.image_id, "image")
    val text by bindResource(ResourceID.text_id, "text")
}

fun <T> MyUI.bindResource(
        id: ResourceID<T>,
        propertyName: String
): ReadOnlyProperty<MyUI, T> {
   checkProperty(this, propertyName)
   // create delegate
}
```

</div>

In the generated code, the `provideDelegate` method is called to initialize the auxiliary `prop$delegate` property.
Compare the generated code for the property declaration `val prop: Type by MyDelegate()` with the generated code 
[above](delegated-properties.html#translation-rules) (when the `provideDelegate` method is not present):

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// this code is generated by the compiler 
// when the 'provideDelegate' function is available:
class C {
    // calling "provideDelegate" to create the additional "delegate" property
    private val prop$delegate = MyDelegate().provideDelegate(this, this::prop)
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

</div>

Note that the `provideDelegate` method affects only the creation of the auxiliary property and doesn't affect the code generated for getter or setter.
