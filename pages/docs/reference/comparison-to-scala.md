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
* Structural types
* Value types
    * We plan to support [Project Valhalla](http://openjdk.java.net/projects/valhalla/) once it is released as part of the JDK
* Yield operator
* Actors
    * Kotlin supports [Quasar](http://www.paralleluniverse.co/quasar/), a third-party framework for actor support on the JVM
* Parallel collections
    * Kotlin supports Java 8 streams, which provide similar functionality

## What Kotlin has that Scala does not

* [Zero-overhead null-safety](null-safety.html)
    * Scala has Option, which is a syntactic and run-time wrapper
* [Smart casts](typecasts.html)
* [Kotlin's Inline functions facilitate Nonlocal jumps](inline-functions.html#inline-functions)
* [First-class delegation](delegation.html). Also implemented via 3rd party plugin: Autoproxy
