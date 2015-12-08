---
type: doc
layout: reference
category: "Syntax"
title: "Returns and Jumps"
---

# Returns and Jumps

Kotlin has three structural jump operators

* *return*{: .keyword }. By default returns from the nearest enclosing function or [anonymous function](lambdas.html#anonymous-functions).
* *break*{: .keyword }. Terminates the nearest enclosing loop.
* *continue*{: .keyword }. Proceeds to the next step of the nearest enclosing loop.

## Break and Continue Labels

Any expression in Kotlin may be marked with a *label*{: .keyword }.
Labels have the form of an identifier followed by the `@` sign, for example: `abc@`, `fooBar@` are valid labels (see the [grammar](grammar.html#label)).
To label an expression, we just put a label in front of it

``` kotlin
loop@ for (i in 1..100) {
  // ...
}
```

Now, we can qualify a *break*{: .keyword } or a *continue*{: .keyword } with a label:

``` kotlin
loop@ for (i in 1..100) {
  for (j in 1..100) {
    if (...)
      break@loop
  }
}
```

A *break*{: .keyword } qualified with a label jumps to the execution point right after the loop marked with that label.
A *continue*{: .keyword } proceeds to the next iteration of that loop.


## Return at Labels

With function literals, local functions and object expression, functions can be nested in Kotlin. 
Qualified *return*{: .keyword }s allow us to return from an outer function. 
The most important use case is returning from a lambda expression. Recall that when we write this:

``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return
    print(it)
  }
}
```

The *return*{: .keyword }-expression returns from the nearest enclosing function, i.e. `foo`.
(Note that such non-local returns are supported only for lambda expressions passed to [inline functions](inline-functions.html).)
If we need to return from a lambda expression, we have to label it and qualify the *return*{: .keyword }:

``` kotlin
fun foo() {
  ints.forEach lit@ {
    if (it == 0) return@lit
    print(it)
  }
}
```

Now, it returns only from the lambda expression. Oftentimes it is more convenient to use implicits labels:
such a label has the same name as the function to which the lambda is passed.

``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return@forEach
    print(it)
  }
}
```

Alternatively, we can replace the lambda expression with an [anonymous function](lambdas.html#anonymous-functions).
A *return*{: .keyword } statement in an anomymous function will return from the anonymous function itself.

``` kotlin
fun foo() {
  ints.forEach(fun(value: Int) {
    if (value == 0) return
    print(value)
  })
}
```

When returning a value, the parser gives preference to the qualified return, i.e.

``` kotlin
return@a 1
```

means "return `1` at label `@a`" and not "return a labeled expression `(@a 1)`".
