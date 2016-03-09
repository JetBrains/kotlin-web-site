---
type: doc
layout: reference
category: FAQ
title: "Comparison to Scala"
---

# Comparison to Scala

The main goal of the Kotlin team is to create a pragmatic and productive programming language.
Taking this into account, if you are happy with Scala, you most likely do not need Kotlin.

## What Scala has that Kotlin does not

* Implicit conversions, parameters
    * In Scala, sometimes it's very hard to tell what's happening in your code, because too many implicits get into the picture
    * To enrich your types with functions in Kotlin use [Extension functions](extensions.html).
* Overridable type members
* Path-dependent types
* Macros
* Existential types
    * [Type projections](generics.html#type-projections) are a special case
* Custom symbolic operators
    * See [Operator overloading](operator-overloading.html)
* Built-in XML
    * See [Type-safe Groovy-style builders](type-safe-builders.html)
* Structural types
* Value types
* Parallel collections
    * Kotlin supports Java 8 streams, which provide similar functionality

## What Kotlin has that Scala does not

* [Zero-overhead null-safety](null-safety.html)
    * Scala has Option, which is just a first-class value in Scala
* [Smart casts](typecasts.html)
* [Kotlin's Inline functions facilitate Nonlocal jumps](inline-functions.html#inline-functions)
* [function type with receiver](type-safe-builders.html)
* [First-class delegation](delegation.html)
