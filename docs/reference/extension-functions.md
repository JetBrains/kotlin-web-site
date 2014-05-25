---
layout: reference
title: "Extension Functions"
category: reference
subcategory: syntax
---

# Extension Functions

## Extending Classes with Functionality

Kotlin, similar to C# and Gosu provides the ability to extend a class with new functionality without having to inherit from the class or use any type of design pattern such as Decorator.
This is done via Extension Functions

The following adds a *swap* function to *MutableList*

``` kotlin
fun MutableList<Int>.swap(x : Int, y : Int) {
  val tmp = this[x] // 'this' corresponds to the list
  this[x] = this[y]
  this[y] = tmp
}
```

The *this*{: .keyword } keyword inside an extension function corresponds to the receiver object (the one that is passed before the dot). Now, we can call such a function on any List<Int>

``` kotlin
val l = mutableListOf(1, 2, 3)
l.swap(0, 2) // 'this' inside 'swap()' will hold the value of 'l'
```

Of course, this function makes sense for any List<T>, and we can make it generic

``` kotlin
fun <T> MutableList<T>.swap(x : Int, y : Int) {
  val tmp = this[x] // 'this' corresponds to the list
  this[x] = this[y]
  this[y] = tmp
}
```

We declare the generic type parameter before the function name for it to be available in the receiver type expression. See [Generic functions](generics.html)

## Motivation

In Java, we are used to classes named *Utils: FileUtils, StringUtils* and so on. The famous java.util.Collections belongs to the same breed.
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

But we don't want to implement all the possible methods inside the class List, right? Extension functions help with this.