---
type: doc
layout: reference
category: "Syntax"
title: "Packages and Imports"
---

# Packages

A source file may start with a package declaration:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message { /*...*/ }

// ...
```
</div>

All the contents (such as classes and functions) of the source file are contained by the package declared.
So, in the example above, the full name of `printMessage()` is `org.example.printMessage`,
and the full name of `Message` is `org.example.Message`. 
 
If the package is not specified, the contents of such a file belong to the default package that has no name.

## Default Imports

A number of packages are imported into every Kotlin file by default:

- [kotlin.*](/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](/api/latest/jvm/stdlib/kotlin.comparisons/index.html)  (since 1.1)
- [kotlin.io.*](/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](/api/latest/jvm/stdlib/kotlin.text/index.html)

Additional packages are imported depending on the target platform:

- JVM:
  - java.lang.*
  - [kotlin.jvm.*](/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JS:    
  - [kotlin.js.*](/api/latest/jvm/stdlib/kotlin.js/index.html)

## Imports

Apart from the default imports, each file may contain its own import directives.
Syntax for imports is described in the [grammar](grammar.html#importHeader).

We can import either a single name, e.g.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import org.example.Message // Message is now accessible without qualification
```
</div>

or all the accessible contents of a scope (package, class, object etc):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import org.example.* // everything in 'org.example' becomes accessible
```
</div>

If there is a name clash, we can disambiguate by using *as*{: .keyword } keyword to locally rename the clashing entity:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import org.example.Message // Message is accessible
import org.test.Message as testMessage // testMessage stands for 'org.test.Message'
```
</div>

The `import` keyword is not restricted to importing classes; you can also use it to import other declarations:

  * top-level functions and properties;
  * functions and properties declared in [object declarations](object-declarations.html#object-declarations);
  * [enum constants](enum-classes.html).

## Visibility of Top-level Declarations

If a top-level declaration is marked *private*{: .keyword }, it is private to the file it's declared in (see [Visibility Modifiers](visibility-modifiers.html)).
