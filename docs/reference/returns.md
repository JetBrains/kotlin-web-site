---
type: doc
layout: reference
category: "Syntax"
title: "Returns and Jumps"
---

# Returns and Jumps

Kotlin has three structural jump operators

* `return`. By default returns from the nearest enclosing function.
* `break`. Terminates the nearest enclosing loop.
* `continue`. Proceeds to the next step of the nearest enclosing loop or to the next branch in the nearest enclosing [when expression](control-flow.html#when-expression)

## Break and Continue Labels

Any expression in Kotlin may be marked with a *label*{: .keyword }.
Labels have the from of the `@` sign followed by an identifier, for example: `@abc`, `@fooBar` are valid labels (see the [grammar](grammar.html#label)).
To label an expression, we just put a label in front of it

``` kotlin
@loop for (i in 1..100) {
  // ...
}
```

Now, we can qualify a break or continue with a label:

``` kotlin
@loop for (i in 1..100) {
  for (j in 1..100) {
    if (...)
      break@loop
  }
}
```

A break qualified with a label jumps to the execution point right after the loop marked with that label. A continue proceeds to the next iteration of that loop.


## Return at Labels

With function literals, local functions and object expression, functions can be nested in Kotlin. 
Qualified return's allow us to return from an outer function. 
The most important use case is returning from a function literal. Recall that when we write this:

``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return
    print(it)
  }
}
```

The return expression returns from the nearest enclosing function, i.e. `foo`. 
(Note that such non-local returns are supported only for function literals passed to [inline-functions](lambdas.html#inline-functions).) 
If we need to return from a function literal, we have to label it and qualify the `return`:

``` kotlin
fun foo() {
  ints.forEach @lit {
    if (it == 0) return@lit
    print(it)
  }
}
```

Now, it returns only from the function literal. Often times it is more convenient to use implicits labels: 
such a label has the same names as the function to which the lambda is passed:  

``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return@forEach
    print(it)
  }
}
```

When returning a value, the parser gives preference to the qualified return, i.e.

``` kotlin
return@a 1
```

means "return `1` at label `@a`" and not "return a labeled expression `(@a 1)`".

Named functions automatically define labels

``` kotlin
fun outer() {
  fun inner() {
    return@outer // the label @outer was defined automatically
  }
}                                                                             
```

**Non-local returns are not implemented yet.**<br/>
See the corresponding [issue](http://youtrack.jetbrains.com/issue/KT-1435).
{:.warning}