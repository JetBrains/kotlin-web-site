---
type: doc
layout: reference
category: "Basics"
title: "Basic Syntax"
---

# 基础语法

## 定义包

应该在源文件的最顶端定义包:

``` kotlin
package my.demo

import java.util.*

// ...
```

没必要去匹配目录和包: 在文件系统中源文件可以任意放置。

查看 [包](packages.html).

## 定义方法

这个方法有两个 `Int` 参数 ，和`Int`类型的返回值:

``` kotlin
fun sum(a: Int, b: Int): Int {
  return a + b
}
```

这个方法使用的是表达式的方法体和推断类型的返回值:

``` kotlin
fun sum(a: Int, b: Int) = a + b
```

一个方法如果是public的，应该有明确的返回值:

``` kotlin
public fun sum(a: Int, b: Int): Int = a + b
```

这个方法是返回无意义的值（其实就是空吧）:

``` kotlin
fun printSum(a: Int, b: Int): Unit {
  print(a + b)
}
```

`Unit`返回值可以被省略:

``` kotlin
public fun printSum(a: Int, b: Int) {
  print(a + b)
}
```

查看 [方法](functions.html).

## 定义局部变量

不可变(只读)变量:

``` kotlin
val a: Int = 1
val b = 1 // `Int` type is inferred
val c: Int // Type required when no initializer is provided
c = 1 // definite assignment
```

可变变量:

``` kotlin
var x = 5 // `Int` type is inferred
x += 1
```

查看 [Properties And Fields](properties.html).

## 使用String模板

``` kotlin
fun main(args: Array<String>) {
  if (args.size() == 0) return

  print("First argument: ${args[0]}")
}
```

查看 [String模板](basic-types.html#string-templates).

## 使用条件表达式

``` kotlin
fun max(a: Int, b: Int): Int {
  if (a > b)
    return a
  else
    return b
}
```

使用 *if*{: .keyword } 作表达式:

``` kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```

查看 [*if*{: .keyword }-表达式](control-flow.html#if-expression).

## 使用可空类型（nullable）变量来判断 *null*{: .keyword }

一个引用必须被显示标记为nullable，当它可能为空的时候。

返回 *null*{: .keyword } 如果 `str` 不是整数的话。

``` kotlin
fun parseInt(str: String): Int? {
  // ...
}
```

下面是返回可空值的方法:

``` kotlin
fun main(args: Array<String>) {
  if (args.size() < 2) {
    print("Two integers expected")
    return
  }

  val x = parseInt(args[0])
  val y = parseInt(args[1])

  // Using `x * y` yields error because they may hold nulls.
  if (x != null && y != null) {
    // x and y are automatically cast to non-nullable after null check
    print(x * y)
  }
}
```

或者

``` kotlin
  // ...
  if (x == null) {
    print("Wrong number format in '${args[0]}'")
    return
  }
  if (y == null) {
    print("Wrong number format in '${args[1]}'")
    return
  }

  // x and y are automatically cast to non-nullable after null check
  print(x * y)
```

查看 [Null-safety](null-safety.html).

## 使用类型检查和自动转换

*is*{: .keyword } 操作符会检查一个表达式是否是该类型。
如果检查到一个局部变量或属性是这个类型，那么就会进行自动转换:

``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj is String) {
    // `obj` is automatically cast to `String` in this branch
    return obj.length
  }

  // `obj` is still of type `Any` outside of the type-checked branch
  return null
}
```

或者

``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj !is String)
    return null

  // `obj` is automatically cast to `String` in this branch
  return obj.length
}
```

更甚

``` kotlin
fun getStringLength(obj: Any): Int? {
  // `obj` is automatically cast to `String` on the right-hand side of `&&`
  if (obj is String && obj.length > 0)
    return obj.length

  return null
}
```

查看 [Classes](classes.html) 和 [Type casts](typecasts.html).

## 使用 `for` 循环

``` kotlin
fun main(args: Array<String>) {
  for (arg in args)
    print(arg)
}
```

或者

``` kotlin
for (i in args.indices)
  print(args[i])
```

查看 [for loop](control-flow.html#for-loops).

## 使用  `while` 循环

``` kotlin
fun main(args: Array<String>) {
  var i = 0
  while (i < args.size())
    print(args[i++])
}
```

查看 [while loop](control-flow.html#while-loops).

## 使用 `when` 表达式

``` kotlin
fun cases(obj: Any) {
  when (obj) {
    1          -> print("One")
    "Hello"    -> print("Greeting")
    is Long    -> print("Long")
    !is String -> print("Not a string")
    else       -> print("Unknown")
  }
}
```

查看 [when expression](control-flow.html#when-expression).

## 使用范围表达式

查看一个数字是否在某个范围里使用 *in*{: .keyword } 操作符:

``` kotlin
if (x in 1..y-1)
  print("OK")
```

检查一个数字是否不在某范围:

``` kotlin
if (x !in 0..array.lastIndex)
  print("Out")
```

在一个范围内迭代:

``` kotlin
for (x in 1..5)
  print(x)
```

查看 [Ranges](ranges.html).

## 使用集合

在一个集合里迭代:

``` kotlin
for (name in names)
  println(name)
```

查看一个集合里是否有某个对象使用 *in*{: .keyword } 操作符:

``` kotlin
if (text in names) // names.contains(text) is called
  print("Yes")
```

使用函数来过滤和控制集合:

``` kotlin
names filter { it.startsWith("A") } sortBy { it } map { it.toUpperCase() } forEach { print(it) }
```

查看 [Higher-order functions and Lambdas](lambdas.html).

