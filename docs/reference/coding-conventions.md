---
type: doc
layout: reference
category: Basics
title: Coding Conventions
---

# Coding Conventions

This page contains the current coding style for the Kotlin language.

## Naming Style
if in doubt default to the Java Coding Conventions such as:

* use of camelCase for names (and avoid underscore in names)
* types start with upper case
* methods and properties start with lower case
* use 4 space indentation
* public functions should have documentation such that it appears in Kotlin Doc

Kotlin does not have fields as a primary concept in the language - it only has properties. Avoid the use of prefixes on properties, such as _ or m_ or other kinds of notation; If you need access to a backing field of a property, use the $ prefix: $foo to refer to a field behind property foo; never create a private property and call it _foo

## Colon

There is a space before colon where colon separates type and supertype and there's no space where colon separates instance and type:

``` kotlin
trait Foo : Bar {
    fun foo(a: Int): String
}
```

## Unit
If a function returns Unit, the return type should be omitted:

``` kotlin
fun foo() { // ": Unit" is omitted here

}
```
