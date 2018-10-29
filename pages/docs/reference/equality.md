---
type: doc
layout: reference
category: "Other"
title: "Equality"
---

# Equality

In Kotlin there are two types of equality:

* Structural equality (a check for `equals()`).
* Referential equality (two references point to the same object);

## Structural equality

Structural equality is checked by the `==` operation (and its negated counterpart `!=`). By convention, an expression like `a == b` is translated to:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
a?.equals(b) ?: (b === null)
```
</div>

I.e. if `a` is not `null`, it calls the `equals(Any?)` function, otherwise (i.e. `a` is `null`) it checks that `b` is referentially equal to `null`.

Note that there's no point in optimizing your code when comparing to `null` explicitly: `a == null` will be automatically translated to `a === null`.

## Floating point numbers equality

When an equality check operands are statically known to be `Float` or `Double` (nullable or not), the check follows the IEEE 754 
Standard for Floating-Point Arithmetic. 

Otherwise, the structural equality is used, which disagrees with the standard so that `NaN` is equal to itself, and `-0.0` is not equal to `0.0`.

See: [Floating Point Numbers Comparison](basic-types.html#floating-point-numbers-comparison).

## Referential equality

Referential equality is checked by the `===` operation (and its negated counterpart `!==`). `a === b` evaluates to
true if and only if `a` and `b` point to the same object. For values which are represented as primitive types at runtime
(for example, `Int`), the `===` equality check is equivalent to the `==` check.
