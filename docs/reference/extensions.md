---
type: doc
layout: reference
category: "Syntax"
title: "Extensions"
---

# Extensions

Kotlin, similar to C# and Gosu, provides the ability to extend a class with new functionality without having to inherit from the class or use any type of design pattern such as Decorator.
This is done via special declarations called _extensions_. Currently, Kotlin supports _extension functions_ and _extension properties_.

## Extension Functions

To declare an extension function, we need to prefix its name with a _receiver type_, i.e. the type being extended.
The following adds a `swap` function to `MutableList<Int>`:

``` kotlin
fun MutableList<Int>.swap(x: Int, y: Int) {
  val tmp = this[x] // 'this' corresponds to the list
  this[x] = this[y]
  this[y] = tmp
}
```

The *this*{: .keyword } keyword inside an extension function corresponds to the receiver object (the one that is passed before the dot). 
Now, we can call such a function on any `MutableList<Int>`:

``` kotlin
val l = mutableListOf(1, 2, 3)
l.swap(0, 2) // 'this' inside 'swap()' will hold the value of 'l'
```

Of course, this function makes sense for any `MutableList<T>`, and we can make it generic:

``` kotlin
fun <T> MutableList<T>.swap(x: Int, y: Int) {
  val tmp = this[x] // 'this' corresponds to the list
  this[x] = this[y]
  this[y] = tmp
}
```

We declare the generic type parameter before the function name for it to be available in the receiver type expression. 
See [Generic functions](generics.html).

## Extensions are resolved **statically**

Extensions do not actually modify classes they extend. By defining an extension, you do not insert new members into a class,
but merely make new functions callable with the dot-notation on instances of this class.

We would like to emphasize that extension functions are dispatched **statically**, i.e. they are not virtual by receiver type.
If there's a member and extension of the same type both applicable to given arguments, a **member always wins**. 
For example:

``` kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo() { println("extension") }
```

If we call `c.foo()` of any `c` of type `C`, it will print "member", not "extension".

## Nullable Receiver

Note that extensions can be defined with a nullable receiver type. Such extensions can be called on an object variable
even if its value is null, and can check for `this == null` inside the body. This is what allows you
to call toString() in Kotlin without checking for null: the check happens inside the extension function.

``` kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // after the null check, 'this' is autocast to a non-null type, so the toString() below
    // resolves to the member function of the Any class
    return toString()
}
```

## Extension Properties

Similarly to functions, Kotlin supports extension properties:

``` kotlin
val <T> List<T>.lastIndex: Int
  get() = size - 1
```

Note that, since extensions do not actually insert members into classes, there's no efficient way for an extension 
property to have a [backing field](properties.html#backing-fields). This is why **initializers are not allowed for 
extension properties**. Their behavior can only be defined by explicitly providing getters/setters.

Example:

``` kotlin
val Foo.bar = 1 // error: initializers are not allowed for extension properties
```
    

## Scope of Extensions

Most of the time we define extensions on the top level, i.e. directly under packages:
 
``` kotlin
package foo.bar
 
fun Baz.goo() { ... } 
``` 

To use such an extension outside its declaring package, we need to import it at the call site:

``` kotlin
package com.example.usage

import foo.bar.goo // importing all extensions by name "goo"
                   // or
import foo.bar.*   // importing everything from "foo.bar"

fun usage(baz: Baz) {
  baz.goo()
)

```

See [Imports](packages.html#imports) for more information.
 
## Motivation

In Java, we are used to classes named "\*Utils": `FileUtils`, `StringUtils` and so on. The famous `java.util.Collections` belongs to the same breed.
And the unpleasant part about these Utils-classes is that the code that uses them looks like this:

``` java
// Java
Collections.swap(list, Collections.binarySearch(list, Collections.max(otherList)), Collections.max(list))
```

Those class names are always getting in the way. We can use static imports and get this:

``` java
// Java
swap(list, binarySearch(list, max(otherList)), max(list))
```

This is a little better, but we have no or little help from the powerful code completion of the IDE. It would be so much better if we could say

``` java
// Java
list.swap(list.binarySearch(otherList.max()), list.max())
```

But we don't want to implement all the possible methods inside the class `List`, right? This is where extensions help us.
