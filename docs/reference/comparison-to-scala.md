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
* Existential types
    * [Type projections](generics.html#type-projections) are a very special case
* Complicated logic for initialization of traits
    * See Classes and Inheritance
* Custom symbolic operations
    * See [Operator overloading](operator-overloading.html)
* Built-in XML
    * See [Type-safe Groovy-style builders](type-safe-groovy-builders.html)

Things that may be added to Kotlin later:

* Higher kinds
* Structural types
* Yield operator
* Actors
* Parallel collections
* .NET target


## What Kotlin has that Scala does not

* [Zero-overhead null-safety](null-safety.html)
    * Scala has Option, which is a syntactic and run-time wrapper
* [Smart casts](typecasts.html)
* Static [extension functions](extensions.html)
    * Instead of wrapping at runtime (with Scala 2.10, implicit value classes will fix the runtime overhead problem)
* [Kotlin's Inline functions facilitate Nonlocal jumps](lambdas.html#inline-functions)
* [String templates](basic-types.html#strings)
    * This feature will be supported in Scala 2.10
* [First-class delegation](delegation.html). Also implemented via 3rd party plugin: Autoproxy
