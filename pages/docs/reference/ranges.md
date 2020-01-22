---
type: doc
layout: reference
category: "Syntax"
title: "Ranges and Progressions"
---

# Ranges and Progressions

Kotlin lets you easily create ranges of values using the [`rangeTo()`](/api/latest/jvm/stdlib/kotlin.ranges/range-to.html) function from the `kotlin.ranges` package and its operator form `..`.
Usually, `rangeTo()` is complemented by `in` or `!in` functions.

<div class="sample" markdown="1" theme="idea"  data-highlight-only>

```kotlin
if (i in 1..4) {  // equivalent of 1 <= i && i <= 4
    print(i)
}
```
</div>

Integral type ranges ([`IntRange`](/api/latest/jvm/stdlib/kotlin.ranges/-int-range/index.html), [`LongRange`](/api/latest/jvm/stdlib/kotlin.ranges/-long-range/index.html), [`CharRange`](/api/latest/jvm/stdlib/kotlin.ranges/-char-range/index.html)) have an extra feature: they can be iterated over.
These ranges are also [progressions](https://en.wikipedia.org/wiki/Arithmetic_progression) of the corresponding integral types.
Such ranges are generally used for iteration in the `for` loops.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    for (i in 1..4) print(i)
//sampleEnd
}

```
</div>

To iterate numbers in reverse order, use the [`downTo`](/api/latest/jvm/stdlib/kotlin.ranges/down-to.html) function instead of `..`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
//sampleEnd
}

```
</div>

It is also possible to iterate over numbers with an arbitrary step (not necessarily 1). This is done via the [`step`](/api/latest/jvm/stdlib/kotlin.ranges/step.html) function.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    println()
    for (i in 8 downTo 1 step 2) print(i)
//sampleEnd
}

```
</div>

To iterate a number range which does not include its end element, use the [`until`](/api/latest/jvm/stdlib/kotlin.ranges/until.html) function:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    for (i in 1 until 10) {       // i in [1, 10), 10 is excluded
        print(i)
    }
//sampleEnd
}

```
</div>

## Range

A range defines a closed interval in the mathematical sense: it is defined by its two endpoint values which are both included in the range.
Ranges are defined for comparable types: having an order, you can define whether an arbitrary instance is in the range between two given instances.
The main operation on ranges is `contains`, which is usually used in the form of `in` and `!in` operators.
 
To create a range for your class, call the `rangeTo()` function on the range start value and provide the end value as an argument.
`rangeTo()` is often called in its operator form `..`.
<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int {
        if (this.major != other.major) {
            return this.major - other.major
        }
        return this.minor - other.minor
    }
}

fun main() {
//sampleStart
    val versionRange = Version(1, 11)..Version(1, 30)
    println(Version(0, 9) in versionRange)
    println(Version(1, 20) in versionRange)
//sampleEnd
}

```
</div>

## Progression

As shown in the examples above, the ranges of integral types, such as `Int`, `Long`, and `Char`, can be treated as [arithmetic progressions](https://en.wikipedia.org/wiki/Arithmetic_progression) of them.
In Kotlin, these progressions are defined by special types: [`IntProgression`](/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html), [`LongProgression`](/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html), and [`CharProgression`](/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html).

Progressions have three essential properties: the `first` element, the `last` element, and a non-zero `step`.
The first element is `first`, subsequent elements are the previous element plus a `step`. 
Iteration over a progression with a positive step is equivalent to an indexed `for` loop in Java/JavaScript.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```
</div>

When you create a progression implicitly by iterating a range, this progression's `first` and `last` elements are the range's endpoints, and the `step` is 1.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    for (i in 1..10) print(i)
//sampleEnd
}

```
</div>

To define a custom progression step, use the `step` function on a range.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
//sampleEnd
}

```
</div>

The `last` element of the progression is calculated this way:
* For a positive step: the maximum value not greater than the end value such that `(last - first) % step == 0`.
* For a negative step: the minimum value not less than the end value such that `(last - first) % step == 0`.

Thus, the `last` element is not always the same as the specified end value.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // the last element is 7
//sampleEnd
}

```
</div>

To create a progression for iterating in reverse order, use `downTo` instead of `..` when defining the range for it.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
//sampleEnd
}

```
</div>

Progressions implement `Iterable<N>`, where `N` is `Int`, `Long`, or `Char` respectively, so you can use them in various [collection functions](collection-operations.html) like `map`, `filter`, and other.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
//sampleEnd
}

```
</div>


