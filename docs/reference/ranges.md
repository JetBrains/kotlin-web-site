---
type: doc
layout: reference
category: "Syntax"
title: "Ranges"
---

# 范围

范围表达式是由“rangeTo”函数组成的，操作符的形式是`..`由*in*{: .keyword }和*!in*{: .keyword }补充。
范围被定义为任何可比类型,但是最好用于数字的比较。下面是使用范围的例子

``` kotlin
if (i in 1..10) { // equivalent of 1 <= i && i <= 10
  println(i)
}

if (x !in 1.0..3.0) println(x)

if (str in "island".."isle") println(str)
```

数值范围有一个额外的功能:他们可以遍历。
编译者需要关心的转换是简单模拟Java的索引*for*{: .keyword }循环,不用担心越界。例如：

``` kotlin
for (i in 1..4) print(i) // prints "1234"

for (i in 4..1) print(i) // prints nothing

for (x in 1.0..2.0) print("$x ") // prints "1.0 2.0 "
```

你想要遍历数字颠倒顺序吗?这很简单。您可以使用标准库里面的`downTo()`函数

``` kotlin
for (i in 4 downTo 1) print(i) // prints "4321"
```

是否可以任意进行数量的迭代,而不必每次的变化都是1呢?当然, `step()`函数可以实现

``` kotlin
for (i in 1..4 step 2) print(i) // prints "13"

for (i in 4 downTo 1 step 2) print(i) // prints "42"

for (i in 1.0..2.0 step 0.3) print("$i ") // prints "1.0 1.3 1.6 1.9 "
```


## 它是如何工作的

在库里有两个接口:`Range<T>`和`Progression<N>`。

`Range<T>` 在数学意义上表示一个间隔,是对比较类型的定义。
它有两个端点:‘开始’和‘结束’,这是包含在范围内。
主要的操作是`contains`,通常用*in*{: .keyword } /*!in* {: .keyword }操作符内。

`Progression<N>` 表示一个等差数列,是数字类型定义。
它有“开始”,“结束”和一个非零的“增量”。
`Progression<N>` 是一Iterable < N >的子类,所以它可以用在*for* {: .keyword }循环中或者`map`, `filter`等函数中。
第一个元素是`start`,下一个元素等于前面加上`increment`。
迭代`Progression`与Java/JavaScript的*for*{: .keyword }循环相同:

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

对于数字, `..`操作符创建一个对象既包含`Range`也包含`Progression`。
由于 `downTo()`和 `step()`函数所以一直是`Progression`。

## 范围指标

### 使用范例

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

for (x in 1.0..2.0 step 0.3) print("$x ") // prints "1.0 1.3 1.6 1.9 "

for (x in 2.0 downTo 1.0 step 0.3) print("$x ") // prints "2.0 1.7 1.4 1.1 "

for (str in "island".."isle") println(str) // error: string range cannot be iterated over
```

###常见的接口定义

有两种基本接口:`Range`和`Progression`。

`Range` 接口定义了一个范围或一个数学意义上的区间。
它有两个端点,`start` 和`end`,并且`contains()`函数检查是否包含一个给定的数字范围
(也可以作为*in*{: .keyword } /*!in*{: .keyword }操作符)。
“开始”和“结束”是包含在范围内。如果`start`= =`end`,范围包含一个确定的元素。
如果 `start` > `end`,范围是空的.

``` kotlin
interface Range<T : Comparable<T>> {
  val start: T
  val end: T
  fun contains(element: T): Boolean
}
```

`Progression`定义了一种等差算法。
它有 `start`(进程中的第一个元素), `end`(被包含的最后一个元素)
和`increment` (每个进程元素和以前的区别,非零)。
但它的主要特征是,可以遍历过程,所以这是`Iterable`的子类。
`end`最后一个元素不是必须的，如 `start < end && increment < 0` or `start > end && increment > 0`.

``` kotlin
interface Progression<N : Number> : Iterable<N> {
  val start: N
  val end: N
  val increment: Number // not N, because for Char we'll want it to be negative sometimes
  // fun iterator(): Iterator<N> is defined in Iterable interface
}
```

迭代'Progression'相当于一个索引*for* {:.Java关键字}循环:

``` java
// if increment > 0
for (int i = start; i <= end; i += increment) {
  // ...
}

// if increment < 0
for (int i = start; i >= end; i += increment) {
  // ...
}
```


### 类的实现

为了避免不必要的重复,让我们只考虑一个数字类型,`Int`。
对于其他类型的数量实现是一样的。
注意,可以使用这些类的构造函数创建实例,
而更方便使用的`rangeTo()`(这个名字,或作为`..`操作符), `downTo()`, `reversed()`和`step()`等实用的函数,以后介绍。

`IntProgression` 类很简单快捷:

``` kotlin
class IntProgression(override val start: Int, override val end: Int, override val increment: Int): Progression<Int> {
  override fun iterator(): Iterator<Int> = IntProgressionIteratorImpl(start, end, increment) // implementation of iterator is obvious
}
```

`IntRange` IntRange是有点复杂:它的实现类是 `Progression<Int>`和`Range<Int>`,因为它是自然的遍历的(默认增量值为1整数和浮点类型):

``` kotlin
class IntRange(override val start: Int, override val end: Int): Range<Int>, Progression<Int> {
  override val increment: Int
    get() = 1
  override fun contains(element: Int): Boolean = start <= element && element <= end
  override fun iterator(): Iterator<Int> = IntProgressionIteratorImpl(start, end, increment)
}
```

`ComparableRange` 也很简单(请记住,比较转换是`compareTo()`):

``` kotlin
class ComparableRange<T : Comparable<T>>(override val start: T, override val end: T): Range<T> {
  override fun contains(element: T): Boolean = start <= element && element <= end
}
```

## 一些实用函数


### `rangeTo()`

定义`rangeTo()`函数,只要简单地调用构造函数`*Range`类,例如:

``` kotlin
class Int {
  //...
  fun rangeTo(other: Byte): IntRange = IntRange(this, other)
  //...
  fun rangeTo(other: Int): IntRange = IntRange(this, other)
  //...
}
```

### `downTo()`

`downTo()`的扩展函数可以为任何数字类型定义,这里有两个例子:

``` kotlin
fun Long.downTo(other: Double): DoubleProgression {
  return DoubleProgression(this, other, -1.0)
}

fun Byte.downTo(other: Int): IntProgression {
  return IntProgression(this, other, -1)
}
```

### `reversed()`

定义`reversed()`扩展函数是为了每个 `*Range`和 `*Progression`类定义的,它们返回反向的级数。

``` kotlin
fun IntProgression.reversed(): IntProgression {
  return IntProgression(end, start, -increment)
}

fun IntRange.reversed(): IntProgression {
  return IntProgression(end, start, -1)
}
```

### `step()`

`step()`扩展函数是为每个`*Range` 和 `*Progression`类定义的,
他们返回级数与都修改了`step`值(函数参数)。
注意,step值总是正的,因此这个函数从不改变的迭代方向。

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

---

翻译By 空白
