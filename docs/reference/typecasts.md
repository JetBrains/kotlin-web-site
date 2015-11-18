---
type: doc
layout: reference
category: "Syntax"
title: "Type Checks and Casts"
---

# Type Checks and Casts

## `is` and `!is` Operators

We can check whether an object conforms to a given type at runtime by using the `is` operator or its negated form `!is`:

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
fun demo(x: Any) {
  if (x is String) {
    print(x.length) // x is automatically cast to String
  }
}
```

The compiler is smart enough to know a cast to be safe if a negative check leads to a return:

``` kotlin
  if (x !is String) return
  print(x.length) // x is automatically cast to String
```

or in the right-hand side of `&&` and `||`:

``` kotlin
  // x is automatically cast to string on the right-hand side of `||`
  if (x !is String || x.length == 0) return

  // x is automatically cast to string on the right-hand side of `&&`
  if (x is String && x.length > 0)
      print(x.length) // x is automatically cast to String
```


Such _smart casts_ work for [*when*{: .keyword }-expressions](control-flow.html#when-expressions)
and [*while*{: .keyword }-loops](control-flow.html#while-loops) as well:

``` kotlin
when (x) {
  is Int -> print(x + 1)
  is String -> print(x.length + 1)
  is IntArray -> print(x.sum())
}
```

Note that smart casts do not work when the compiler cannot guarantee that the variable cannot change between the check and the usage.
More specifically, smart casts are applicable according to the following rules:

  * *val*{: .keyword } local variables - always;
  * *val*{: .keyword } properties - if the property is private or internal or the check is performed in the same module where the property is declared. Smart casts aren't applicable to open properties or properties that have custom getters;
  * *var*{: .keyword } local variables - if the variable is not modified between the check and the usage and is not captured in a lambda that modifies it;
  * *var*{: .keyword } properties - never (because the variable can be modified at any time by other code).


## "Unsafe" cast operator

Usually, the cast operator throws an exception if the cast is not possible. Thus, we call it *unsafe*.
The unsafe cast in Kotlin is done by the infix operator *as*{: .keyword } (see [operator precedence](grammar.html#operator-precedence)):

``` kotlin
val x: String = y as String
```

Note that *null*{: .keyword } cannot be cast to `String` as this type is not [nullable](null-safety.html),
i.e. if `y` is null, the code above throws an exception.
In order to match Java cast semantics we have to have nullable type at cast right hand side, like

``` kotlin
val x: String? = y as String?
```

## "Safe" (nullable) cast operator

To avoid an exception being thrown, one can use a *safe* cast operator *as?*{: .keyword } that returns *null*{: .keyword } on failure:

``` kotlin
val x: String? = y as? String
```

Note that despite the fact that the right-hand side of *as?*{: .keyword } is a non-null type `String` the result of the cast is nullable.

