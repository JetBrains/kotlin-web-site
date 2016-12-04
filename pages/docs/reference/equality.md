---
type: doc
layout: reference
category: "Other"
title: "Equality"
---

# Equality

In Kotlin there are two types of equality:

* Referential equality (two references point to the same object)
* Structural equality (a check for `equals()`)

## Referential equality

Referential equality is checked by the `===` operation (and its negated counterpart `!==`). `a === b` evaluates to
true if and only if `a` and `b` point to the same object.

## Structural equality

Structural equality is checked by the `==` operation (and its negated counterpart `!=`). By convention, an expression like `a == b` is translated to

``` kotlin
a?.equals(b) ?: (b === null)
```

I.e. if `a` is not `null`, it calls the `equals(Any?)` function, otherwise (i.e. `a` is `null`) it checks that `b` is referentially equal to `null`.

Note that there's no point in optimizing your code when comparing to `null` explicitly: `a == null` will be automatically translated to `a === null`.


