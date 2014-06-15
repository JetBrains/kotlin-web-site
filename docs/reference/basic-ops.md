---
type: doc
layout: reference
category: "Basics"
title: "Basic Operations"
---

# Basic Operations

## Equality

In Kotlin there are two types of equality:

* Referential equality (two references point to the same object)
* Structural equality (a check for equals()

### Referential equality

There is no built-in operator to check for referential equality, for we believe that it is rarely needed. Instead,
there's an inline function *identityEquals()* that can be called in the following way

``` kotlin
a.identityEquals(b)
// or
a identityEquals b // infix call
```

And returns true if and only if a and b point to the same object.

### Structural equality

Structural equality is checked by the == operation (and its negated counterpart !=). By convention, an expression like a == b is translated to

``` kotlin
a?.equals(b) ?: b.identityEquals(null)
```

I.e. if a is not null, it calls the equals(Any?) function, otherwise (i.e. a is null) it checks that b is referentially equal to null.

Note that there's no point in optimizing your code when comparing to null explicitly: a == null will be automatically translated to a.identityEquals(null).


