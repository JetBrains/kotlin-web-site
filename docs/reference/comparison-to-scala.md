---
type: doc
layout: reference
category: FAQ
title: "Comparison to Scala"
---

# Comparison to Scala

The main goal of the Kotlin team is to create a pragmatic and productive programming language, rather than to advance the state of the art in programming language research.
Taking this into account, if you are happy with Scala, you most likely do not need Kotlin.

## What Scala has that Kotlin does not

* Implicit conversions, parameters, etc
    * In Scala, sometimes it's very hard to tell what's happening in your code without using a debugger, because too many implicits get into the picture
    * To enrich your types with functions in Kotlin use [Extension functions](extensions.html).
* Overridable type members
* Path-dependent types
* Macros
* Existential types
    * [Type projections](generics.html#type-projections) are a very special case
* Complicated logic for initialization of traits
    * See [Classes and Inheritance](classes.html)
* Custom symbolic operations
    * See [Operator overloading](operator-overloading.html)
* Built-in XML
    * See [Type-safe Groovy-style builders](type-safe-builders.html)
* Structural types
* Value types
    * We plan to support [Project Valhalla](http://openjdk.java.net/projects/valhalla/) once it is released as part of the JDK
* Yield operator
* Actors
    * Kotlin supports [Quasar](http://www.paralleluniverse.co/quasar/), a third-party framework for actor support on the JVM
* Collections
    * Scala has its own unique collections library, while Koltin relies on Java collections with some extensions
        * Scala's basic list type is an immutable linked-list similar to LISP, while Kotlin is based on Java ArrayList
        * Scala has Traversable and Iterable, while Kotlin just supports Iterable.
    * Parallel collections
        * Kotlin supports Java 8 streams, which provide similar functionality
* Pattern Matching
    * Scala's match is (currently) more powerful than Kotlin's when, but this may change in the future.

## What Kotlin has that Scala does not

* [Zero-overhead null-safety](null-safety.html)
    * Scala has Option, which is a syntactic and run-time wrapper
* [Smart casts](typecasts.html)
* [Kotlin's Inline functions facilitate Nonlocal jumps](inline-functions.html#inline-functions)
* [First-class delegation](delegation.html). Also implemented via 3rd party plugin: Autoproxy
* [Member references](reflection.html#function-references) (also supported in Java 8).
