---
type: doc
layout: reference
category: FAQ
title: "Comparison to Java"
---

# Comparison to Java

## Some Java issues addressed in Kotlin

Kotlin fixes a series of issues that Java suffers from

* Null references are [controlled by the type system](null-safety.html).
* [No raw types](java-interop.html)
* Arrays in Kotlin are [invariant](basic-types.html#Arrays)
* Kotlin has proper [function types](lambdas.html#function-types), as opposed to Java's SAM-conversions
* [Use-site variance](generics.html#use-site-variance) without wildcards
* Kotlin does not have checked [exceptions](exceptions.html)

## What Java has that Kotlin does not

* [Checked exceptions](exceptions.html)
* [Primitive types](basic-types.html) that are not classes
* [Static members](classes.html)
* [Non-private fields](properties.html)
* [Wildcard-types](generics.html)

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
* [Separate interfaces for read-only and mutable collections](collections.html)
