---
type: doc
layout: reference
category: "Syntax"
title: "Null Safety"
---

# Null 安全性

## 可空（Nullable）和不可空（Non-Null） 类型

Kotlin 的类型系统致力于消除空引用异常，又称[《上亿美元的错误》](http://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions)。

许多编程语言，包括 Java 中最常见的错误就是访问空引用的成员变量，导致空引用异常。在 Java 中，叫作 `NullPointerException` 或简称 `NPE` 。

Kotlin 类型系统的目的就是从我们的代码中消除 `NullPointerException` 。 `NPE` 的原因可能是

* 显式调用 `throw NullPointerException()`
* 外部 Java 代码引起
* 对于初始化，有一些数据不一致 (比如一个还没初始化的 `this` 用于构造函数的某个地方)

在 Kotlin 中，类型系统是要区分一个引用是否可以是 *null*{: .keyword } （nullable references）或者不可以，即 不可空引用（non-null references）。
例如，常见的 `String` 就不能够为 *null*{: .keyword }：

``` kotlin
var a: String = "abc"
a = null // 编译错误
```

若是想要允许 `null` ，我们可以声明一个变量为可空字符串，写作 `String?` ：

``` kotlin
var b: String? = "abc"
b = null // ok
```

现在，如果你调用 `a` （译者注：`a` 是一个不可空类型）的一个方法，它保证不会造成 `NPE`，这样你就可以放心地使用：

``` kotlin
val l = a.length()
```

但是如果你想调用 `b` 的一些方法，这将是不安全的，同时编译器会报错：

``` kotlin
val l = b.length() // 错误：变量 b 可能为 null
```

可是我仍然需要调用这些方法，对吧？这里有一些方式可以这么做：

## 使用条件语句检测是否为 *null*{: .keyword } 

首先，你可以明确地检查 `b` 是否为 *null*{: .keyword }，并分别处理两种选择：

``` kotlin
val l = if (b != null) b.length() else -1
```

编译器会跟踪所执行的检查信息，然后允许你在 *if*{: .keyword } 中调用 `length()`  
同时，也支持更复杂（更智能）的条件：

``` kotlin
if (b != null && b.length() > 0)
  print("String of length ${b.length()}")
else
  print("Empty string")
```

需要注意的是其中 `b` 是不可变的，这仅适用（例如，不可变的局部变量，*val*{: .keyword } 成员，并且是不可重写的），否则在检查之后它可能它为空导致异常。

## 安全的调用

你的第二个选择是安全的操作符，写作 `?.` ：

``` kotlin
b?.length()
```
如果 `b` 是非空的，就会返回 `b.length()` ，否则返回 *null*{: .keyword }，这个表达式的类型就是 `Int?`.

安全调用在链式调用的时候十分有用。例如，如果Bob，一个雇员，可被分配给一个部门（或不），这反过来又可以获得 Bob 的部门负责人的名字（如果有的话），我们这么写：

``` kotlin
bob?.department?.head?.name
```

如果任意一个属性（环节）为空，这个链式调用就会返回 *null*{: .keyword }。

## Elvis 操作符

当我们有一个可以为空的变量 `r`，我们可以说 「如果 `r` 非空，我们使用它；否则使用某个非空的值：

``` kotlin
val l: Int = if (b != null) b.length() else -1
```

对于完整的 *if*{: .keyword }-表达式, 可以换成 Elvis 操作符来表达, 写作 `?:`:

``` kotlin
val l = b?.length() ?: -1
```

如果  `?:` 的左边表达式是非空的， elvis 操作符就会返回左边的结果, 否则返回右边的内容。  
请注意，仅在左侧为空的时候，右侧表达式才会进行计算。

注意, 因为 *throw*{: .keyword } 和 *return*{: .keyword } 在 Kotlin 中都是一种表达式，它们也可以用在 Elvis 操作符的右边。非常方便，例如，检查函数参数：

``` kotlin
fun foo(node: Node): String? {
  val parent = node.getParent() ?: return null
  val name = node.getName() ?: throw IllegalArgumentException("name expected")
  // ...
}
```

## `!!` 操作符

第三种操作的方式是给 NPE 爱好者的。我们可以写 `b!!` ，这样就会返回一个不可空的 `b` 的值（例如：在我们例子中的 `String`）或者如果 `b` 是空的，就会抛出 `NPE` 异常：

``` kotlin
val l = b!!.length()
```

因此，如果你想要一个 `NPE`，你可以使用它。but you have to ask for it explicitly, and it does not appear out of the blue.

另外， `!!` 是为了简明，和扩展模拟以前的标准库功能，定义如下：

``` kotlin
inline fun <T : Any> T?.sure(): T =
  if (this == null)
    throw NullPointerException()
  else
    this
```

## 安全转型

转型的时候，可能会经常出现 `ClassCastException`。
所以，现在可以使用安全转型，当转型不成功的时候，它会返回 *null*{: .keyword }：

``` kotlin
val aInt: Int? = a as? Int
```

------------

翻译 by [drakeet](https://github.com/drakeet) 
