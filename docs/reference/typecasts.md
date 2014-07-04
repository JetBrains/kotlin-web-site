---
type: doc
layout: reference
category: "Syntax"
title: "Type Checks and Casts"
---

# Type Checks and Casts

## `is` and `!is` Operators

One can check whether an object conforms to a given type at runtime using `is` operator or its negated form `!is`:

``` kotlin
if (obj is String) {
  print(obj.length)
}

if (obj !is String) { // same as !(obj is String)
  print("Not a String")
}
else {
  print(obj.length)
}
```

## Smart Casts

In many cases, one does not need to use explicit cast operators in Kotlin, because the compiler tracks the
`is`-checks for immutable values and inserts (safe) casts automatically when needed:

``` kotlin
fun demo(x : Any) {
  if (x is String) {
    print(x.length) // x is automatically cast to String
  }
}
```

Such _smart casts_ work for [when](control-flow.html#when-expressions) expressions and [while loops](control-flow.html#while-loops) as well:

``` kotlin
when (x) {
  is Int -> print(x + 1)
  is String -> print(x.length + 1)
  is Array<Int> -> print(x.sum())
}
```


## "Unsafe" cast operator

Usually, cast operator throws an exception if the cast is not possible. Thus, we call it unsafe. The unsafe cast in Kotlin is done by an infix operator as (see [operator precedence](grammar.html#operator-precedence)):

``` kotlin
val x : String = y as String
```

Note that null cannot be cast to String as this type is not [nullable](null-safety.html), i.e. if y is null, the code above throws an exception.
In order to match Java cast semantics we have to have [nullable](null-safety.html) type at cast right hand side, like

``` kotlin
val x : String? = y as String?
```

## "Safe" (nullable) cast operator

To avoid an exception being thrown, one can use a "safe" cast operator as? that returns null on failure:

``` kotlin
val x : String? = y as? String
```

Note that despite the fact that the right-hand side of as? is a non-null type String the result of the cast is nullable.

