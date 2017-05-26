---
type: doc
layout: reference
category: "Basics"
title: "Basic Syntax"
---

# 基本语法

## 定义包

包的声明应处于文件顶部：

``` kotlin
package my.demo

import java.util.*

// ...
```

包的结构并不需要与文件夹路径完全匹配：源代码可以在文件系统的任意位置

参阅 [Packages](packages.html).

## 定义函数

带有两个 `Int` 参数， 返回 `Int` 的函数:

``` kotlin
fun sum(a: Int, b: Int): Int {
  return a + b
}
```

将表达式作为函数体，返回值自动推断的函数:

``` kotlin
fun sum(a: Int, b: Int) = a + b
```

不确定返回值 `Unit` 的函数:

``` kotlin
fun printSum(a: Int, b: Int): Unit {
  print(a + b)
}
```

`Unit` 类型的返回，在函数定义中可以省略:

``` kotlin
public fun printSum(a: Int, b: Int) {
  print(a + b)
}
```

参阅 [Functions](functions.html).

## 定义局部变量

常量（使用 `val` 关键字声明）:

``` kotlin
val a: Int = 1
val b = 1  // `Int` 类型自动推断
val c: Int // 如果没有初始值，声明常量时，常量的类型不能省略
c = 1 // 明确赋值
```

变量（使用 `var` 关键字声明）:

``` kotlin
var x = 5 // `Int` 类型自动推断（ 5 默认是 `Int` ）
x += 1
```

参阅 [Properties And Fields](properties.html).

## 使用字符串模板

``` kotlin
fun main(args: Array<String>) {
  if (args.size() == 0) return

  print("First argument: ${args[0]}")
}
```

参阅 [String templates](basic-types.html#string-templates).

## 使用条件判断

``` kotlin
fun max(a: Int, b: Int): Int {
  if (a > b)
    return a
  else
    return b
}
```

使用 *if*{: .keyword } 作为表达式:

``` kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```

参阅 [*if*{: .keyword }-expressions](control-flow.html#if-expression).

## Using nullable values and checking for *null*{: .keyword }

当某个变量的值可以为 *null*{: .keyword } 的时候，必须在声明处的类型后添加 ? 来标识该引用可为空
A reference must be explicitly marked as nullable when *null*{: .keyword } value is possible.

返回 *null*{: .keyword } 假如 `str` 的内容不是数字:

``` kotlin
fun parseInt(str: String): Int? {
  // ...
}
```

返回值可以是 *null*{: .keyword } 的函数:

``` kotlin
fun main(args: Array<String>) {
  if (args.size() < 2) {
    print("Two integers expected")
    return
  }

  val x = parseInt(args[0])
  val y = parseInt(args[1])

  // 直接使用 `x * y` 可能会报错，因为他们可能为 null
  if (x != null && y != null) {
    // 在空指针判断后，x 和 y 会自动变成非空(non-nullable)值
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

  // 在空指针判断后，x 和 y 会自动变成非空值
  print(x * y)
```

参阅 [Null-safety](null-safety.html).

## Using type checks and automatic casts

*is*{: .keyword } 运算符用于类型判断: 检查某个实例是否是某类型
如果一个局部常量或者不可变的类成员变量已经判断出为某类型，那么判断后的分支中可以直接当作该类型使用，无需强制转换

``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj is String) {
    // `obj` 在该条件判断分支内自动转换成 `String`
    return obj.length
  }

  // 在离开类型判断分支后， `obj` 仍然是 `Any` 类型
  return null
}
```

或者

``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj !is String)
    return null

  // `obj` 在一下类型判断分支自动转换为 `String`
  return obj.length
}
```

甚至

``` kotlin
fun getStringLength(obj: Any): Int? {
  // `obj` 在 `&&` 右边自动转换成 `String` 类型
  if (obj is String && obj.length > 0)
    return obj.length

  return null
}
```

参阅 [Classes](classes.html) and [Type casts](typecasts.html).

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

参阅 [for循环](control-flow.html#for-loops).

## Using a `while` loop

``` kotlin
fun main(args: Array<String>) {
  var i = 0
  while (i < args.size())
    print(args[i++])
}
```

See [while 循环](control-flow.html#while-loops).

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

参阅 [when表达式](control-flow.html#when-expression).

## 使用区间（ranges）

使用 *in*{: .keyword } 运算符来检查某个数字是否在指定区间内：

``` kotlin
if (x in 1..y-1)
  print("OK")
```

检查某个数字是否在指定区间外:

``` kotlin
if (x !in 0..array.lastIndex)
  print("Out")
```

区间内迭代:

``` kotlin
for (x in 1..5)
  print(x)
```

参阅 [区间 Ranges](ranges.html).

## 使用集合

对集合进行迭代:

``` kotlin
for (name in names)
  println(name)
```

使用 *in*{: .keyword } 运算符来判断集合内是否包含(.contains)某实例 *in*{: .keyword } ：

``` kotlin
if (text in names) // 自动调用 names.contains(text)
  print("Yes")
```

使用字面量函数(方便的 Higher-order 函数)来过滤(filter)和变换(map)集合：

``` kotlin
names.filter { it.startsWith("A") }.sortBy { it }.map { it.toUpperCase() }.forEach { print(it) }
```

参阅 [Higher-order函数及Lambda表达式](lambdas.html).
