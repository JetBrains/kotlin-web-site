[//]: # (title: Comparison to Java)

## Some Java issues addressed in Kotlin

Kotlin fixes a series of issues that Java suffers from:

* Null references are [controlled by the type system](null-safety.md).
* [No raw types](java-interop.md#java-generics-in-kotlin)
* Arrays in Kotlin are [invariant](basic-types.md#arrays)
* Kotlin has proper [function types](lambdas.md#function-types), as opposed to Java's SAM-conversions
* [Use-site variance](generics.md#use-site-variance-type-projections)  without wildcards
* Kotlin does not have checked [exceptions](exceptions.md)

## What Java has that Kotlin does not

* [Checked exceptions](exceptions.md)
* [Primitive types](basic-types.md) that are not classes. The byte-code uses primitives where possible, but they are not
    explicitly available.
* [Static members](classes.md) are replaced with [companion objects](object-declarations.md#companion-objects),
    [top-level functions](functions.md), [extension functions](extensions.md#extension-functions), or [@JvmStatic](java-to-kotlin-interop.md#static-methods).
* [Wildcard-types](generics.md) are replaced with [declaration-site variance](generics.md#declaration-site-variance) and
    [type projections](generics.md#type-projections).
* [Ternary-operator `a ? b : c`](control-flow.md#if-expression) is replaced with [if expression](control-flow.md#if-expression). 


## What Kotlin has that Java does not

* [Lambda expressions](lambdas.md) + [Inline functions](inline-functions.md) = performant custom control structures
* [Extension functions](extensions.md)
* [Null-safety](null-safety.md)
* [Smart casts](typecasts.md)
* [String templates](basic-types.md#strings)
* [Properties](properties.md)
* [Primary constructors](classes.md)
* [First-class delegation](delegation.md)
* [Type inference for variable and property types](basic-types.md)
* [Singletons](object-declarations.md)
* [Declaration-site variance & Type projections](generics.md)
* [Range expressions](ranges.md)
* [Operator overloading](operator-overloading.md)
* [Companion objects](classes.md#companion-objects)
* [Data classes](data-classes.md)
* [Separate interfaces for read-only and mutable collections](collections-overview.md)
* [Coroutines](coroutines-overview.md)

## What’s next?

Learn how to perform [typical tasks with strings in Java and Kotlin](java-to-kotlin-idioms-strings.md).