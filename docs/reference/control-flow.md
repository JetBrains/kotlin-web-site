---
type: doc
layout: reference
category: "Syntax"
title: "Control Flow"
---

# 控制流

## If表达式

在Kotlin中, *if*{: .keyword }是一个表达式,它会返回一个值.
因此就不需要三元运算符 (如 ? 三元表达式), 因为使用 *if*{: .keyword } 就可以了。

``` kotlin
// Traditional usage 
var max = a 
if (a < b) 
  max = b 
 
// With else 
var max: Int
if (a > b) 
  max = a 
else 
  max = b 
 
// As expression 
val max = if (a > b) a else b
```

*if*{: .keyword }的分支可以是代码段, 最后一行的表达式作为段的返回值:

``` kotlin
val max = if (a > b) { 
    print("Choose a") 
    a 
  } 
  else { 
    print("Choose b") 
    b 
  }
```

当*if*{: .keyword }仅仅有一个分支, 或者其中一个分支的返回结果`Unit`, 它的类型`Unit`.

See the [grammar for *if*{: .keyword }](grammar.html#if).

## When表达式

*when*{: .keyword } 替代了c语言风格的switch操作符. 最简单的形式如下：

``` kotlin
when (x) {
  1 -> print("x == 1")
  2 -> print("x == 2")
  else -> { // Note the block
    print("x is neither 1 nor 2")
  }
}
```

*when*{: .keyword } 将它的参数和所有的分支条件进行比较，直到某个分支满足条件。
*when*{: .keyword }既可以被当做表达式使用也可以被当做语句使用。 如果它被当做表达式, 符合条件的分支的值就是整个表达式的值，如果当做语句使用，则忽略单个分支的值。(就像*if*{: .keyword },每一个分支可以是一个代码块,它的值是最后的表达式的值.)

*else*{: .keyword } 分支将被执行如果其他分支都不满足条件。
如果 *when*{: .keyword } 作为一个表达式被使用,*else*{: .keyword } 分支是必须的，除非编译器能够检测出所有的可能情况都已经覆盖了。

如果很多分支需要用相同的方式处理，则可以把多个分支条件放在一起, 用`,`逗号分隔:

``` kotlin
when (x) {
  0, 1 -> print("x == 0 or x == 1")
  else -> print("otherwise")
}
```
我们可以在判断分支条件的地方使用任何表达式，而不仅仅是常量(和switch不同)：

``` kotlin
when (x) {
  parseInt(s) -> print("s encodes x")
  else -> print("s does not encode x")
}
```

我们也可以检查一个值 *in*{: .keyword } 或者 *!in*{: .keyword } 一个 [范围](ranges.html) 或者集合:

``` kotlin
when (x) {
  in 1..10 -> print("x is in the range")
  in validNumbers -> print("x is valid")
  !in 10..20 -> print("x is outside the range")
  else -> print("none of the above")
}
```

另一种用法是可以检查一个值*is*{: .keyword }或者*!is*{: .keyword }某种特定类型.注意,由于[smart casts](typecasts.html#smart-casts), 你可以访问该类型的方法和属性而不用额外的检查。

```kotlin
val hasPrefix = when(x) {
  is String -> x.startsWith("prefix")
  else -> false
}
```

*when*{: .keyword } 也可以用来替代*if*{: .keyword }-*else*{: .keyword } *if*{: .keyword }链.
如果不提供参数，所有的分支条件都是简单的布尔值，而当一个分支的条件返回true时，则调用该分支：

``` kotlin
when {
  x.isOdd() -> print("x is odd")
  x.isEven() -> print("x is even")
  else -> print("x is funny")
}
```

查看 [grammar for *when*{: .keyword }](grammar.html#when).


## For循环

*for*{: .keyword } 循环可以对任何提供迭代器(iterator)的集合进行遍历，语法如下:

``` kotlin
for (item in collection)
  print(item)
```

循环体可以是一个代码块.

``` kotlin
for (item: Int in ints) {
  // ...
}
```

像上面提到的一样, *for*{: .keyword }可以循环遍历任何提供了迭代器的集合。例如：

* 有一个成员函数或者扩展函数`iterator()`,它返回一个类型
  * 有一个成员函数或者扩展函数`next()`,并且
  * 有一个成员函数或者扩展函数`hasNext()`返回 `Boolean`.

如果你想要遍历一个数组或者一个list，你可以这么做:

``` kotlin
for (i in array.indices)
  print(array[i])
```
注意这种“遍历一个范围”的函数会被编译器优化，不会产生额外的对象。

See the [grammar for *for*{: .keyword }](grammar.html#for).

## While循环

*while*{: .keyword } 和 *do*{: .keyword }..*while*{: .keyword } 的使用方法和其他语言一致

``` kotlin
while (x > 0) {
  x--
}

do {
  val y = retrieveData()
} while (y != null) // y is visible here!
```

查看 [grammar for *while*{: .keyword }](grammar.html#while).

## Break和continue在循环中的使用

在循环中Kotlin支持传统的*break*{: .keyword }和*continue*{: .keyword }操作符.查看[Returns and jumps](returns.html).


