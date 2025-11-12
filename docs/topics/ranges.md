[//]: # (title: Ranges and progressions)

Ranges and progressions define sequences of values in Kotlin, supporting range operators, iteration, custom step values, and arithmetic progressions.

## Ranges {id="range"}

Kotlin lets you easily create ranges of values using the [`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html)
and [`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html) functions from the 
`kotlin.ranges` package. 

A range represents an ordered set of values with a defined start and end. By default, it increments by 1 at each step.
For example, `1..4` represents the numbers 1, 2, 3, and 4.

To create:

* a closed-ended range, call the `.rangeTo()` function with the `..` operator. This includes both the start and end values.
* an open-ended range, call the `.rangeUntil()` function with the `..<` operator. This includes the start value but excludes the end value.

For example:

```kotlin
fun main() {
//sampleStart
    // Closed-ended range: includes both 1 and 4
    println(4 in 1..4)
    // true
    
    // Open-ended range: includes 1, excludes 4
    println(4 in 1..<4)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-rangeto-rangeuntil"}

Ranges are particularly useful for iterating over `for` loops:

```kotlin
fun main() {
//sampleStart
    for (i in 1..4) print(i)
    // 1234
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-for-loop"}

To iterate numbers in reverse order, use the [`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html)
function instead of `..`.

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
    // 4321
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-downto"}

You can also iterate over numbers with a custom step using the
[`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html) function, instead of the default increment of 1:

```kotlin
fun main() {
//sampleStart
    for (i in 0..8 step 2) print(i)
    println()
    // 02468
    for (i in 0..<8 step 2) print(i)
    println()
    // 0246
    for (i in 8 downTo 0 step 2) print(i)
    // 86420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-step"}

## Progressions

The ranges of integral types, such as `Int`, `Long`, and `Char`, can be treated as
[arithmetic progressions](https://en.wikipedia.org/wiki/Arithmetic_progression).
In Kotlin, these progressions are defined by special types: [`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html),
[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html),
and [`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html).

Progressions have three essential properties: the `first` element, the `last` element, and a non-zero `step`.
The first element is `first`, subsequent elements are the previous element plus a `step`. 
Iteration over a progression with a positive step is equivalent to an indexed `for` loop in Java/JavaScript.

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

When you create a progression implicitly by iterating a range, this progression's `first` and `last` elements are the
range's endpoints, and the `step` is 1.

```kotlin
fun main() {
//sampleStart
    for (i in 1..10) print(i)
    // 12345678910
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions"}

To define a custom progression step, use the `step` function on a range.

```kotlin

fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    // 1357
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-step"}

The `last` element of the progression is calculated this way:
* For a positive step: the maximum value not greater than the end value such that `(last - first) % step == 0`.
* For a negative step: the minimum value not less than the end value such that `(last - first) % step == 0`.

Thus, the `last` element is not always the same as the specified end value.

```kotlin

fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // the last element is 7
    // 147
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-last"}

Progressions implement `Iterable<N>`, where `N` is `Int`, `Long`, or `Char` respectively, so you can use them in various
[collection functions](collection-operations.md) like `map`, `filter`, and other.

```kotlin

fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-filter"}

