---
type: doc
layout: reference
category: "Syntax"
title: "Ranges"
---

# Ranges

Range expressions are formed with `rangeTo` functions that have the operator form `..` which is complemented by *in*{: .keyword } and *!in*{: .keyword }.
Range is defined for any comparable type, but for number primitives it is optimized. Here are some examples of using ranges

``` kotlin
if (i in 1..10) { // equivalent of 1 <= i && i <= 10
  println(i)
}
```

Numerical ranges have an extra feature: they can be iterated over.
The compiler takes care of converting this analogously to Java's indexed *for*{: .keyword }-loop, without extra overhead.

``` kotlin
for (i in 1..4) print(i) // prints "1234"

for (i in 4..1) print(i) // prints nothing
```

What if you want to iterate over numbers in reverse order? It's simple. You can use the `downTo()` function defined in the standard library

``` kotlin
for (i in 4 downTo 1) print(i) // prints "4321"
```

Is it possible to iterate over numbers with arbitrary step, not equal to 1? Sure, the `step()` function will help you

``` kotlin
for (i in 1..4 step 2) print(i) // prints "13"

for (i in 4 downTo 1 step 2) print(i) // prints "42"
```


## How it works

There are two interfaces in the library: `Range<T>` and `Progression<N>`.

`Range<T>` denotes an interval in the mathematical sense, defined for comparable types.
It has two endpoints: `start` and `end`, which are included in the range.
The main operation is `contains`, usually used in the form of *in*{: .keyword }/*!in*{: .keyword } operators.

`Progression<N>` denotes an arithmetic progression, defined for number types.
It has `start`, `end` and a non-zero `increment`.
`Progression<N>` is a subtype of `Iterable<N>`, so it can be used in *for*{: .keyword }-loops and functions like `map`, `filter`, etc.
The first element is `start`, subsequent elements are the previous element plus `increment`.
Iteration over `Progression` is equivalent to an indexed *for*{: .keyword }-loop in Java/JavaScript:

``` java
// if increment > 0
for (int i = start; i <= end; i += increment) {
  // ...
}
```

``` java
// if increment < 0
for (int i = start; i >= end; i += increment) {
  // ...
}
```

For numbers, the `..` operator creates an object which implements both `Range` and `Progression`.
The result of the `downTo()` and `step()` functions is always a `Progression`.

## Utility functions

### `rangeTo()`

The `rangeTo()` functions in number types simply call the constructors of `*Range` classes, e.g.:

``` kotlin
class Int {
  //...
  operator fun rangeTo(other: Byte): IntRange = IntRange(this, other)
  //...
  operator fun rangeTo(other: Int): IntRange = IntRange(this, other)
  //...
}
```

### `downTo()`

The `downTo()` extension function is defined for any pair of number types, here are two examples:

``` kotlin
fun Long.downTo(other: Double): DoubleProgression {
  return DoubleProgression(this, other, -1.0)
}

fun Byte.downTo(other: Int): IntProgression {
  return IntProgression(this, other, -1)
}
```

### `reversed()`

The `reversed()` extension functions are defined for each `*Range` and `*Progression` classes, and all of them return reversed progressions.

``` kotlin
fun IntProgression.reversed(): IntProgression {
  return IntProgression(end, start, -increment)
}

fun IntRange.reversed(): IntProgression {
  return IntProgression(end, start, -1)
}
```

### `step()`

`step()` extension functions are defined for `*Range` and `*Progression` classes,
all of them return progressions with modified `step` values (function parameter).
Note that the step value is always positive, therefore this function never changes the direction of iteration.

``` kotlin
fun IntProgression.step(step: Int): IntProgression {
  if (step <= 0) throw IllegalArgumentException("Step must be positive, was: $step")
  return IntProgression(start, end, if (increment > 0) step else -step)
}

fun IntRange.step(step: Int): IntProgression {
  if (step <= 0) throw IllegalArgumentException("Step must be positive, was: $step")
  return IntProgression(start, end, step)
}
```
