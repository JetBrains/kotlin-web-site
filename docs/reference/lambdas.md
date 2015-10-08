---
type: doc
layout: reference
category: "Syntax"
title: "Higher-Order Functions and Lambdas"
---

# 高阶函数和lambda表达式

## 高阶函数

高阶函数是一种能用函数作为参数或者返回值为函数的一种函数。
`lock()`是高阶函数中一个比较好的例子，它接收一个lock对象和一个函数，获得锁，运行传入的函数，并释放锁：

```kotlin
fun lock<T>(lock: Lock, body: () -> T): T {
  lock.lock()
  try {
    return body()
  }
  finally {
    lock.unlock()
  }
}
```

我们分析一下上面的代码：函数`body`拥有[函数类型](#function-types):`() -> T`
所以body应该是一个不带参数并且返回`T`类型的值的函数。
它在*try*{: .keyword }代码块中调用，被`lock`保护的，当`lock()`函数被调用时返回他的值。


如果我们想调用`lock()`函数，我们可以把另一个函数传递给它作为参数(详见 [函数引用](reflection.html#function-references)):

``` kotlin
fun toBeSynchronized() = sharedResource.operation()
val result = lock(lock, ::toBeSynchronized)
```


另外一种更为便捷的方式是传入一个 [函数字面量](#function-literals-and-function-expressions) (通常被称为 _lambd 表达式_):

``` kotlin
val result = lock(lock, { sharedResource.operation() })
```

函数字面量 [这里](#function-literals-and-function-expressions)有更详细的描述, 但是为了继续这一段，让我们看到一个简短的概述：

* 一个函数字面值总是被大括号包围着。
* 其参数（如果有的话）被声明在`->`之前（参数类型可以省略）
* 函数体在 `->` 后面 (如果存在的话).

在Kotlin中, 如果函数的最后一个参数是一个函数，那么我们可以省略括号

``` kotlin
lock (lock) {
  sharedResource.operation()
}
```

另一个高阶函数的例子是 `map()` ( [MapReduce](http://en.wikipedia.org/wiki/MapReduce)):

```kotlin
fun <T, R> List<T>.map(transform: (T) -> R): List<R> {
  val result = arrayListOf<R>()
  for (item in this)
    result.add(transform(item))
  return result
}
```

这个函数可以如下调用:

```kotlin
val doubled = ints.map {it -> it * 2}
```

还有一个有用的公约是：如果函数字面量有一个参数，那它的声明可以省略，用 `it` 表示。

``` kotlin
ints map {it * 2} // Infix call + Implicit 'it'
```

这些约定可以写成 [LINQ-风格](http://msdn.microsoft.com/en-us/library/bb308959.aspx) 的代码:

``` kotlin
strings filter {it.length == 5} sortBy {it} map {it.toUpperCase()}
```

## 内联函数

使用[内联函数](inline-functions.html)有时能提高高阶函数的性能。

## 函数字面量和函数表达式

一个函数字面量和函数表达式是一个“匿名函数”, 即 一个未声明的函数,但却立即写为表达式。思考下面的例子：

``` kotlin
max(strings, {a, b -> a.length < b.length})
```

`max`函数是一个高阶函数, 也就是说 他的第二个参数是一个函数.
这个参数是一个表达式，但它本身也是一个函数, 也就是函数字面量.写成一个函数的话，它相当于

``` kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

### 函数类型

对于一个接收一个函数作为参数的函数，我们必须为该参数指定一个函数类型。譬如上述`max`函数定义如下：

``` kotlin
fun max<T>(collection: Collection<out T>, less: (T, T) -> Boolean): T? {
  var max: T? = null
  for (it in collection)
    if (max == null || less(max!!, it))
      max = it
  return max
}
```

参数 `less` 是一个 `(T, T) -> Boolean`类型的函数, 也就是说`less`函数接收两个`T`类型的参数并返回一个`Boolean`值:
如果第一个比第二个小就返回`True`.

在第四行代码里, `less` 被用作为一个函数: 它传入两个`T`类型的参数.

如上所写的是就函数类型, 或者还有命名参数, 目的就是能通过[命名参数](functions.html#named-arguments)调用.

``` kotlin
val compare: (x: T, y: T) -> Int = ...
```

### 函数字面量语法

函数字面量的全部语法形式, 也就是函数类型的字面量, 譬如下面的代码:

``` kotlin
val sum = {x: Int, y: Int -> x + y}
```

一个函数字面值总是被大括号包围着,在括号内有全部语法形式中的参数声明并且有可选的参数类型。
函数体后面有一个 `->` 符号。如果我们把所有的可选注释都留了出来，那剩下的是什么样子的：

``` kotlin
val sum: (Int, Int) -> Int = {x, y -> x + y}
```

这是非常常见的，一个函数字面量只有一个参数。
如果Kotlin能自己计算出自己的数字签名，我们就可以不去声明这个唯一的参数。并且用`it`进行隐式声明。

``` kotlin
ints.filter {it > 0} // this literal is of type '(it: Int) -> Boolean'
```

请注意，如果函数取另一个函数作为最后一个参数，该函数字面量参数可以放在括号外的参数列表。
语法细则详见 [call-Suffix](grammar.html#call-suffix).

### 函数表达式

上述函数字面量的语法还少了一个东西： 能够指定函数的返回类型。在大多数情况下, 这是不必要的。因为返回类型可以被自动推断出来. 然而，如果你需要要明确的指定。你需要一个替代语法:
函数表达式.

``` kotlin
fun(x: Int, y: Int): Int = x + y
```

函数表达式看起来很像一个正则函声明, 只是名字被省略了. 内容也是一个表达式（如上面的代码）或者代码块:

``` kotlin
fun(x: Int, y: Int): Int {
  return x + y
}
```

指定的参数和返回类型与指定一个正则函数方式相同，只是如果参数类型能沟通过上下文推断出来，那么该参数类型是可以省略的:

``` kotlin
ints.filter(fun(item) = item > 0)
```

函数表达式的返回类型推断法只适用于常规函数：具有表达式体并且必须明确指定函数体有代码（或者假定`Unit`）块的返回类型能够被自动推断出来。

请注意，函数表达式参数始终在圆括号内传递. 允许在函数括号外使用的速记语法只针对于函数字面量。 

另一个函数字面量和函数表达式区别是  [non-local    returns](inline-functions.html#non-local-returns)的行为.一个带标签的*return*{：. keyword} 语句，总是在用*fun*{: .keyword } 关键词声明的函数中返回。这意味着函数字面中的return*{: .keyword }将在函数闭包中返回 。然而函数表达式*return*{: .keyword}的就是在函数表达式中返回。

### 闭包

一个函数字面量或表达式（以及一个[本地函数](functions.html#local-functions)本地函数和一个 [对象表达式](object-declarations.html#object-expressions)）可以访问他的_闭包_,即声明在外范围内的变量。与java不同，在闭包中捕获的变量可以被修改：

``` kotlin
var sum = 0
ints filter {it > 0} forEach {
  sum += it
}
print(sum)
```

### 扩展函数表达式

除了常规函数，kotlin支持扩展函数。拓展函数字面量是很有用处的，并且支持表达式。
他们的一个最重要的例子是[Type-safe Groovy-style builders](type-safe-builders.html)的使用。

扩展函数表达式不同于一般的函数表达式，它有一个接收器类型规范。

``` kotlin
val sum = fun Int.(other: Int): Int = this + other
```

接收器类型可仅在函数表达式中指定，而不是在函数字面量中。函数字面量能作为拓展函数表达式，但是只能在接收器类型能够通过上下文推断出来的时候。

扩展函数表达式的类型是接收器函数类型：

``` kotlin
sum : Int.(other: Int) -> Int
```

该函数可以被称为一个点或中缀形式（因为它只有一个参数）:

``` kotlin
1.sum(2)
1 sum 2
```

---

翻译By Airoyee





