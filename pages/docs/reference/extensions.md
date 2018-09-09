---
type: doc
layout: reference
category: "Syntax"
title: "Extensions"
---

# Extensions

Kotlin, similar to C# and Gosu, provides the ability to extend a class with new functionality without having to inherit from the class or use any type of design pattern such as Decorator.
This is done via special declarations called _extensions_. Kotlin supports _extension functions_ and _extension properties_.

## Extension Functions

To declare an extension function, we need to prefix its name with a _receiver type_, i.e. the type being extended.
The following adds a `swap` function to `MutableList<Int>`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' corresponds to the list
    this[index1] = this[index2]
    this[index2] = tmp
}
```
</div>

The *this*{: .keyword } keyword inside an extension function corresponds to the receiver object (the one that is passed before the dot). 
Now, we can call such a function on any `MutableList<Int>`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
val l = mutableListOf(1, 2, 3)
l.swap(0, 2) // 'this' inside 'swap()' will hold the value of 'l'
```
</div>

Of course, this function makes sense for any `MutableList<T>`, and we can make it generic:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' corresponds to the list
    this[index1] = this[index2]
    this[index2] = tmp
}
```
</div>

We declare the generic type parameter before the function name for it to be available in the receiver type expression. 
See [Generic functions](generics.html).

## Extensions are resolved **statically**

Extensions do not actually modify classes they extend. By defining an extension, you do not insert new members into a class,
but merely make new functions callable with the dot-notation on variables of this type.

We would like to emphasize that extension functions are dispatched **statically**, i.e. they are not virtual by receiver type.
This means that the extension function being called is determined by the type of the expression on which the function is invoked,
not by the type of the result of evaluating that expression at runtime. For example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
open class C

class D: C()

fun C.foo() = "c"

fun D.foo() = "d"

fun printFoo(c: C) {
    println(c.foo())
}

printFoo(D())
```
</div>

This example will print "c", because the extension function being called depends only on the declared type of the
parameter `c`, which is the `C` class.

If a class has a member function, and an extension function is defined which has the same receiver type, the same name is applicable to given arguments, the **member always wins**.
For example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo() { println("extension") }
```
</div>

If we call `c.foo()` of any `c` of type `C`, it will print "member", not "extension".

However, it's perfectly OK for extension functions to overload member functions which have the same name but a different signature:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo(i: Int) { println("extension") }
```
</div>

The call to `C().foo(1)` will print "extension".


## Nullable Receiver

Note that extensions can be defined with a nullable receiver type. Such extensions can be called on an object variable
even if its value is null, and can check for `this == null` inside the body. This is what allows you
to call toString() in Kotlin without checking for null: the check happens inside the extension function.

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // after the null check, 'this' is autocast to a non-null type, so the toString() below
    // resolves to the member function of the Any class
    return toString()
}
```
</div>

## Extension Properties

Similarly to functions, Kotlin supports extension properties:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">
``` kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```
</div>

Note that, since extensions do not actually insert members into classes, there's no efficient way for an extension 
property to have a [backing field](properties.html#backing-fields). This is why **initializers are not allowed for 
extension properties**. Their behavior can only be defined by explicitly providing getters/setters.

Example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
val Foo.bar = 1 // error: initializers are not allowed for extension properties
```
</div>


## Companion Object Extensions

If a class has a [companion object](object-declarations.html#companion-objects) defined, you can also define extension
functions and properties for the companion object:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
class MyClass {
    companion object { }  // will be called "Companion"
}

fun MyClass.Companion.foo() { ... }
```
</div>

Just like regular members of the companion object, they can be called using only the class name as the qualifier:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
MyClass.foo()
```
</div>


## Scope of Extensions

Most of the time we define extensions on the top level, i.e. directly under packages:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
package foo.bar
 
fun Baz.goo() { ... } 
```
</div>

To use such an extension outside its declaring package, we need to import it at the call site:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
package com.example.usage

import foo.bar.goo // importing all extensions by name "goo"
                   // or
import foo.bar.*   // importing everything from "foo.bar"

fun usage(baz: Baz) {
    baz.goo()
}

```
</div>

See [Imports](packages.html#imports) for more information.

## Declaring Extensions as Members

Inside a class, you can declare extensions for another class. Inside such an extension, there are multiple _implicit receivers_ -
objects members of which can be accessed without a qualifier. The instance of the class in which the extension is declared is called
_dispatch receiver_, and the instance of the receiver type of the extension method is called _extension receiver_.

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
class D {
    fun bar() { ... }
}

class C {
    fun baz() { ... }

    fun D.foo() {
        bar()   // calls D.bar
        baz()   // calls C.baz
    }

    fun caller(d: D) {
        d.foo()   // call the extension function
    }
}
```
</div>

In case of a name conflict between the members of the dispatch receiver and the extension receiver, the extension receiver takes
precedence. To refer to the member of the dispatch receiver you can use the [qualified `this` syntax](this-expressions.html#qualified).

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
class C {
    fun D.foo() {
        toString()         // calls D.toString()
        this@C.toString()  // calls C.toString()
    }
}
```
</div>

Extensions declared as members can be declared as `open` and overridden in subclasses. This means that the dispatch of such
functions is virtual with regard to the dispatch receiver type, but static with regard to the extension receiver type.

<div class="sample" markdown="1" theme="idea">
``` kotlin
open class D { }

class D1 : D() { }

open class C {
    open fun D.foo() {
        println("D.foo in C")
    }

    open fun D1.foo() {
        println("D1.foo in C")
    }

    fun caller(d: D) {
        d.foo()   // call the extension function
    }
}

class C1 : C() {
    override fun D.foo() {
        println("D.foo in C1")
    }

    override fun D1.foo() {
        println("D1.foo in C1")
    }
}

fun main(args: Array<String>) {
    C().caller(D())   // prints "D.foo in C"
    C1().caller(D())  // prints "D.foo in C1" - dispatch receiver is resolved virtually
    C().caller(D1())  // prints "D.foo in C" - extension receiver is resolved statically
}
```
</div>

## Note on visibility

Extensions utilize the same [visibility of other entities](visibility-modifiers.html) as regular functions declared in the same scope would. For example:

* An extension declared on top level of a file has access to the other `private` top-level declarations in the same file;
* If an extension is declared outside its receiver type, such an extension cannot access the receiver's `private` members.

## Motivation

In Java, we are used to classes named "\*Utils": `FileUtils`, `StringUtils` and so on. The famous `java.util.Collections` belongs to the same breed.
And the unpleasant part about these Utils-classes is that the code that uses them looks like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">
```java
// Java
Collections.swap(list, Collections.binarySearch(list,
    Collections.max(otherList)),
    Collections.max(list));
```
</div>

Those class names are always getting in the way. We can use static imports and get this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```java
// Java
swap(list, binarySearch(list, max(otherList)), max(list));
```
</div>

This is a little better, but we have no or little help from the powerful code completion of the IDE. It would be so much better if we could say:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```java
// Java
list.swap(list.binarySearch(otherList.max()), list.max());
```
</div>

But we don't want to implement all the possible methods inside the class `List`, right? This is where extensions help us.
