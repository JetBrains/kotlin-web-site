---
type: doc
layout: reference
category: FAQ
title: "Comparison to Java"
---

# Comparison to Java Programming Language

## Some Java issues addressed in Kotlin

Kotlin fixes a series of issues that Java suffers from:

* Null references are [controlled by the type system](null-safety.html).
* [No raw types](java-interop.html)
* Arrays in Kotlin are [invariant](basic-types.html#arrays)
* Kotlin has proper [function types](lambdas.html#function-types), as opposed to Java's SAM-conversions
* [Use-site variance](generics.html#use-site-variance-type-projections) without wildcards
* Kotlin does not have checked [exceptions](exceptions.html)

## What Java has that Kotlin does not

* [Checked exceptions](exceptions.html)
* [Primitive types](basic-types.html) that are not classes - The byte-code uses primitives where possible, but they are not explicitly available.
* [Static members](classes.html) - replaced with [companion objects](object-declarations.html#companion-objects), [top-level functions](functions.html), [extension functions](extensions.html#extension-functions), or [@JvmStatic](java-to-kotlin-interop.html#static-methods).
* [Wildcard-types](generics.html) - replaced with [declaration-site variance](generics.html#declaration-site-variance) and [type projections](generics.html#type-projections).
* [Ternary-operator `a ? b : c`](control-flow.html#if-expression) - replaced with [if expression](control-flow.html#if-expression). 

## What Kotlin has that Java does not

* [Lambda expressions](lambdas.html) + [Inline functions](inline-functions.html) = performant custom control structures
* [Extension functions](extensions.html)
* [Null-safety](null-safety.html)
* [Smart casts](typecasts.html)
* [String templates](basic-types.html#strings)
* [Properties](properties.html)
* [Primary constructors](classes.html)
* [First-class delegation](delegation.html)
* [Type inference for variable and property types](basic-types.html)
* [Singletons](object-declarations.html)
* [Declaration-site variance & Type projections](generics.html)
* [Range expressions](ranges.html)
* [Operator overloading](operator-overloading.html)
* [Companion objects](classes.html#companion-objects)
* [Data classes](data-classes.html)
* [Separate interfaces for read-only and mutable collections](collections-overview.html)
* [Coroutines](coroutines.html)
