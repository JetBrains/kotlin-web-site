---
type: doc
layout: reference
category: "Syntax"
title: "Ranges"
---

# Ranges

Range expressions are formed with rangeTo functions that have the operator form of .. which are complemented by in and !in. Range is
defined for any comparable type, but for number primitives it is optimized. Here are examples of using ranges

``` kotlin
if (i in 1..10) { // equivalent of 1 <= i && i <= 10
  println(i)
}

if (x !in 1.0..3.0) println(x)

if (str in "island".."isle") println(str)
```

Numerical ranges have extra feature: they can be iterated over. Compiler takes care about converting this in simple analogue of Java's indexed for-loop, without extra overhead. Examples

``` kotlin
for (i in 1..4) print(i) // prints "1234"

for (i in 4..1) print(i) // prints nothing

for (x in 1.0..2.0) print("$x ") // prints "1.0 2.0 "
```

What if you want to iterate over numbers in reversed order? It's simple. You can use downTo() function defined in standard library

``` kotlin
for (i in 4 downTo 1) print(i) // prints "4321"
```

Is it possible to iterate over numbers with arbitrary step, not equal to 1? Sure, step() function will help you

``` kotlin
for (i in 1..4 step 2) print(i) // prints "13"

for (i in 4 downTo 1 step 2) print(i) // prints "42"

for (i in 1.0..2.0 step 0.3) print("$i ") // prints "1.0 1.3 1.6 1.9 "
```


## How it works

There are two traits in the library: Range<T> and Progression<N>.

Range<T> denotes an interval in the mathematical sense, defined for comparable types. It has two endpoints: start and end, which are included in the range. Main operation is contains, usually used in the form of in/!in operators.

Progression<N> denotes arithmetic progression, defined for number types. It has start, end and non-zero increment. Progression<N> is a subtype of Iterable<N>, so it can be used in for-loops and functions like map, filter, etc. First element is start, every next element equals previous plus increment. Iteration over Progression is equivalent to an indexed for-loop in Java/JavaScript:

``` kotlin
// if increment > 0
for (int i = start; i <= end; i += increment) {
  // ...
}
```

``` kotlin
// if increment < 0
for (int i = start; i >= end; i += increment) {
  // ...
}
```

For numbers, the ".." operator creates an object which is both Range and Progression. Result of downTo() and step() functions is always a Progression.

## Range Specifications

### Use Cases

``` kotlin
// Checking if value of comparable is in range. Optimized for number primitives.
if (i in 1..10) println(i)

if (x in 1.0..3.0) println(x)

if (str in "island".."isle") println(str)

// Iterating over arithmetical progression of numbers. Optimized for number primitives (as indexed for-loop in Java).
for (i in 1..4) print(i) // prints "1234"

for (i in 4..1) print(i) // prints nothing

for (i in 4 downTo 1) print(i) // prints "4321"

for (i in 1..4 step 2) print(i) // prints "13"

for (i in (1..4).reversed()) print(i) // prints "4321"

for (i in (1..4).reversed() step 2) print(i) // prints "42"

for (i in 4 downTo 1 step 2) print(i) // prints "42"

for (x in 1.0..2.0) print("$x ") // prints "1.0 2.0 "

for (i in 1.0..2.0 step 0.3) print("$x ") // prints "1.0 1.3 1.6 1.9 "

for (i in 2.0 downTo 1.0 step 0.3) print("$x ") // prints "2.0 1.7 1.4 1.1 "

for (str in *"island".."isle"*{: .error }) println(str) // can't be compiled: string range cannot be iterated over
```

### Common Traits Definition

There are two base traits: Range and Progression.

Range trait defines a range, or interval in mathematical sense. It has two endpoints, start and end, and also contains() function which checks if range contains given number (it also can be used as in/!in operator, which is neater). Start and end are included in range. If start == end, range contains exactly one element. If start > end, range is empty.

``` kotlin
trait Range<T: Comparable<T>> {
  val start: T
  val end: T
  fun contains(element: T): Boolean
}
```

Progression defines a kind of arithmetical progression. It has start (first element of progression), end (last element which can be included) and increment (difference between each progression element and previous, non-zero). But the main feature of it is that the progression can be iterated over, so it is a subtype of Iterable. end is not necessary the last element of progression. Also, progression can be empty if start < end && increment > 0 or start > end && increment < 0.

``` kotlin
trait Progression<N: Number>: Iterable<N> {
  val start: N
  val end: N
  val increment: Number // not N, because for Char we'll want it to be negative sometimes
  // fun iterator(): Iterator<N> is defined in Iterable trait
}
```

Iteration over Progression is equivalent of indexed for-loop in Java:

``` kotlin
// if increment > 0
for (int i = start; i <= end; i += increment) {
  // ...
}

// if increment < 0
for (int i = start; i >= end; i += increment) {
  // ...
}
```


### Implementation Classes

To avoid unnecessary repetetion, let's consider only one number type, Int. For other number types implementation is the same. Note that instances can be created using constructors of these classes, while it's more handy to use rangeTo() (by this name, or as .. operator), downTo(), reversed() and step() utility functions, which are introduced later.

IntProgression class is pretty straightforward and simple:

``` kotlin
class IntProgression(override val start: Int, override val end: Int, override val increment: Int): Progression<Int> {
  override fun iterator(): Iterator<Int> = IntProgressionIteratorImpl(start, end, increment) // implementation of iterator is obvious
}
```

IntRange is a bit tricky: it implements Progression<Int> along with Range<Int>, because it's natural to iterate over a range (default increment value is 1 for both integer and floating-point types):

``` kotlin
class IntRange(override val start: Int, override val end: Int): Range<Int>, Progression<Int> {
  override val increment: Int
    get() = 1
  override fun contains(element: Int): Boolean = start <= element && element <= end
  override fun iterator(): Iterator<Int> = IntProgressionIteratorImpl(start, end, increment)
}
```

ComparableRange is also simple (remember that comparisons are translated into invocation of compareTo()):

``` kotlin
class ComparableRange<T: Comparable<T>>(override val start: T, override val end: T): Range<T> {
  override fun contains(element: T): Boolean = start <= element && element <= end
}
```

## Utility functions


### rangeTo()

Set of rangeTo() functions in number types simply call constructors of *Range classes, e.g.:

``` kotlin
class Int {
  //...
  fun rangeTo(other: Byte) : IntRange = IntRange(this, other)
  //...
  fun rangeTo(other: Int) : IntRange = IntRange(this, other)
  //...
}
```

### downTo()

downTo() extension function is defined for any pair of number types, here are two examples:

``` kotlin
fun Long.downTo(other: Double): DoubleProgression {
  return DoubleProgression(this, other, -1.0)
}

fun Byte.downTo(other: Int): IntProgression {
  return IntProgression(this, other, -1)
}
```

### reversed()

Set of reversed() extension functions are defined for each *Range and *Progression classes, and all of them return reversed progressions.

``` kotlin
IntProgression.reversed(): IntProgression {
  return IntProgression(end, start, -increment)
}

IntRange.reversed(): IntProgression {
  return IntProgression(end, start, -1)
}
```

### step()

step() extension functions are defined for each *Range and *Progression classes, all of them return progressions with modified step value (function parameter). Note that step value is always positive, therefore this function never changes direction of iteration.

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
