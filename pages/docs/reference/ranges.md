---
type: doc
layout: reference
category: "Syntax"
title: "Ranges"
---

# Ranges

Range expressions are formed with `rangeTo` functions that have the operator form `..` which is complemented by *in*{: .keyword } and *!in*{: .keyword }.
Range is defined for any comparable type, but for integral primitive types it has an optimized implementation. Here are some examples of using ranges:

``` kotlin
if (i in 1..10) { // equivalent of 1 <= i && i <= 10
    println(i)
}
```

Integral type ranges (`IntRange`, `LongRange`, `CharRange`) have an extra feature: they can be iterated over.
The compiler takes care of converting this analogously to Java's indexed *for*{: .keyword }-loop, without extra overhead:

``` kotlin
for (i in 1..4) print(i) // prints "1234"

for (i in 4..1) print(i) // prints nothing
```

What if you want to iterate over numbers in reverse order? It's simple. You can use the `downTo()` function defined in the standard library:

``` kotlin
for (i in 4 downTo 1) print(i) // prints "4321"
```

Is it possible to iterate over numbers with arbitrary step, not equal to 1? Sure, the `step()` function will help you:

``` kotlin
for (i in 1..4 step 2) print(i) // prints "13"

for (i in 4 downTo 1 step 2) print(i) // prints "42"
```

To create a range which does not include its end element, you can use the `until` function:

``` kotlin
for (i in 1 until 10) { // i in [1, 10), 10 is excluded
     println(i)
}
```

## How it works

Ranges implement a common interface in the library: `ClosedRange<T>`.

`ClosedRange<T>` denotes a closed interval in the mathematical sense, defined for comparable types.
It has two endpoints: `start` and `endInclusive`, which are included in the range.
The main operation is `contains`, usually used in the form of *in*{: .keyword }/*!in*{: .keyword } operators.

Integral type progressions (`IntProgression`, `LongProgression`, `CharProgression`) denote an arithmetic progression.
Progressions are defined by the `first` element, the `last` element and a non-zero `step`.
The first element is `first`, subsequent elements are the previous element plus `step`. The `last` element is always hit by iteration unless the progression is empty.

A progression is a subtype of `Iterable<N>`, where `N` is `Int`, `Long` or `Char` respectively, so it can be used in *for*{: .keyword }-loops and functions like `map`, `filter`, etc.
Iteration over `Progression` is equivalent to an indexed *for*{: .keyword }-loop in Java/JavaScript:

``` java
for (int i = first; i != last; i += step) {
  // ...
}
```

For integral types, the `..` operator creates an object which implements both `ClosedRange<T>` and `*Progression`.
For example, `IntRange` implements `ClosedRange<Int>` and extends `IntProgression`, thus all operations defined for `IntProgression` are available for `IntRange` as well.
The result of the `downTo()` and `step()` functions is always a `*Progression`.

Progressions are constructed with the `fromClosedRange` function defined in their companion objects:

``` kotlin
IntProgression.fromClosedRange(start, end, step)
```

The `last` element of the progression is calculated to find maximum value not greater than the `end` value for positive `step` or minimum value not less than the `end` value for negative `step` such that `(last - first) % step == 0`.



## Utility functions

### `rangeTo()`

The `rangeTo()` operators on integral types simply call the constructors of `*Range` classes, e.g.:

``` kotlin
class Int {
    //...
    operator fun rangeTo(other: Long): LongRange = LongRange(this, other)
    //...
    operator fun rangeTo(other: Int): IntRange = IntRange(this, other)
    //...
}
```

Floating point numbers (`Double`, `Float`) do not define their `rangeTo` operator, and the one provided by the standard library for generic `Comparable` types is used instead:

``` kotlin
    public operator fun <T: Comparable<T>> T.rangeTo(that: T): ClosedRange<T>
```

The range returned by this function cannot be used for iteration.

### `downTo()`

The `downTo()` extension function is defined for any pair of integral types, here are two examples:

``` kotlin
fun Long.downTo(other: Int): LongProgression {
    return LongProgression.fromClosedRange(this, other.toLong(), -1L)
}

fun Byte.downTo(other: Int): IntProgression {
    return IntProgression.fromClosedRange(this.toInt(), other, -1)
}
```

### `reversed()`

The `reversed()` extension functions are defined for each `*Progression` classes, and all of them return reversed progressions:

``` kotlin
fun IntProgression.reversed(): IntProgression {
    return IntProgression.fromClosedRange(last, first, -step)
}
```

### `step()`

`step()` extension functions are defined for `*Progression` classes,
all of them return progressions with modified `step` values (function parameter).
The step value is required to be always positive, therefore this function never changes the direction of iteration:

``` kotlin
fun IntProgression.step(step: Int): IntProgression {
    if (step <= 0) throw IllegalArgumentException("Step must be positive, was: $step")
    return IntProgression.fromClosedRange(first, last, if (this.step > 0) step else -step)
}

fun CharProgression.step(step: Int): CharProgression {
    if (step <= 0) throw IllegalArgumentException("Step must be positive, was: $step")
    return CharProgression.fromClosedRange(first, last, if (this.step > 0) step else -step)
}
```

Note that the `last` value of the returned progression may become different from the `last` value of the original progression in order to preserve the invariant `(last - first) % step == 0`. Here is an example:

``` kotlin
(1..12 step 2).last == 11  // progression with values [1, 3, 5, 7, 9, 11]
(1..12 step 3).last == 10  // progression with values [1, 4, 7, 10]
(1..12 step 4).last == 9   // progression with values [1, 5, 9]
```
