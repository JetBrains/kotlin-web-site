---
type: doc
layout: reference
category: FAQ
title: "Comparison to Scala"
---

# Comparison to Scala

The two main design goals for Kotlin are:

* Make compilation at least as fast as Java
* Keep useful level of expressiveness while maintaining the language simple as possible

Taking this into account, if you are happy with Scala, you probably do not need Kotlin

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
    * See Classes and Inheritance
* Custom symbolic operations
    * See [Operator overloading](operator-overloading.html)
* Built-in XML
    * See [Type-safe Groovy-style builders](type-safe-groovy-builders.html)

Things that may be added to Kotlin later:

* Structural types
* Value types
* Yield operator
* Actors
* Parallel collections

## What Kotlin has that Scala does not

* [Zero-overhead null-safety](null-safety.html)
    * Scala has Option, which is a syntactic and run-time wrapper
* [Smart casts](typecasts.html)
* [Kotlin's Inline functions facilitate Nonlocal jumps](lambdas.html#inline-functions)
* [First-class delegation](delegation.html). Also implemented via 3rd party plugin: Autoproxy
