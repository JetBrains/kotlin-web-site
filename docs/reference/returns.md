---
layout: reference
title: "Returns and Jumps"
category: reference
subcategory: syntax
---

Kotlin has three structural jump operators

* `return`. By default returns from the nearest enclosing function.
* `break`. Terminates the nearest enclosing loop.
* `continue`. Proceeds to the next step of the nearest enclosing loop or to the next branch in the nearest enclosing [when expression]({{ site.baseurl }}/docs/reference/control-flow.html#when-expression)

## Break and Continue Labels

Any expression in Kotlin may be marked with a *label*{: .keyword }.
Labels have the from of the @ sign followed by an optional identifier, for examples @, @abc, @fooBar are valid labels (see the [grammar]({{ site.baseurl }}/docs/reference/grammar.html#label)).
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

With function literals, local functions and object expression, functions can be nested in Kotlin. Qualified return's allow us to return from an outer function. The most important use case is returning from a function literal. Recall that when we write this:

``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return
    print(it)
  }
}
```

The return expression returns from the nearest enclosing function, i.e. foo. If we need to return from a function literal, we have to label it and qualify the return

``` kotlin
fun foo() {
  ints.forEach @lit {
    if (it == 0) return@lit
    print(it)
  }
}
```

Now, it returns only from the function literal. Often times it is more convenient to use the shortest implicit label @ for function literals

``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return@ // Works if there's one and only one function literal in lexical scope up to named entity (function or class)
    print(it)
  }
}
```

Note that such non-local returns are supported only for function literals passed to inline-functions.

When returning a value, the parser gives preference to the qualified return, i.e.

``` kotlin
return@a 1
```

means "return 1 at label @a" and not "return a labeled expression (@a 1)".

Named functions automatically define labels

``` kotlin
fun outer() {
  fun inner() {
    return@outer // the label @outer was defined automatically
  }
}
```

*Non-local returns are not implemented yet
 See the corresponding [issue](http://youtrack.jetbrains.com/issue/KT-1435).*{: warning }

## Break and continue in custom control structures

Inline functions make writing performant "custom control structures" easy, for example, the forEach() function that executes a function literal for every element in a collection

``` kotlin
inline fun <T> Collection<T>.forEach(body : (item : T) -> Unit) {
  for (item in this) {
    body(item)
  }
}
```

Note that this function is not exactly a redundant example easily substitutable by a normal for loop. Consider the following code

``` kotlin
ints filter {it > 0} sortby {-it} forEach {print(it)}
```

Now, what happens when we write break (or continue) inside the body of forEach? We simply get a compile-time error, because, lexically, there's no loop to break

``` kotlin
ints forEach {
  if (it < 0) break // Error: 'break' does not belong to a loop
  print(it)
}
```

But, actually, there is a loop, hidden inside forEach, and it is inlined there, so we should be able to tell the compiler to understand that. An we can, by annotating the loop inside forEach with the loop annotation. The function parameter should also be annotated with loopbody annotation

``` kotlin
inline fun <T> Collection<T>.forEach(loopbody body : (item : T) -> Unit) {
  [loop] for (item in this) {
    body(item)
  }
}
```

Now, the compiler allows break and continue in the function literal argument passed to forEach, and these operators apply to the loop marked with @@.

*Break and continue for custom control structures are not implemented yet. See the corresponding [issue](http://youtrack.jetbrains.com/issue/KT-1436).*{: warning }
