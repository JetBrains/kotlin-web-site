---
type: doc
layout: reference
category: "Other"
title: "Multi-Declarations"
---

# 多重申明

有时把一个对象_分解_成很多变量很比较方便，比如:

``` kotlin
val (name, age) = person 
```

这种语法叫做_多重申明_。一个多重申明同时创造多个变量。
我们申明了两个新变量：`name` 和 `age`,并且可以独立使用他们。
 
``` kotlin
println(name)
println(age)
```

一个多重申明会被向下编译成下面的代码：

``` kotlin
val name = person.component1()
val age = person.component2()
```

`component1()` 和 `component2()` 函数是 _principle of conventions_ widely 在Kotlin 中的另一个例子。 
(参考运算符如 `+` ， `*`, *for*{: .keyword }-loops 等)
任何可以被放在多重分配右边的和组件函数的需求数字都可以调用它。当然，这里可以有更多的如 `component3()` 和 `component4()`.

多重申明对 *for*{: .keyword }-loops有效：

``` kotlin
for ((a, b) in collection) { ... }
```

变量 `a` 和 `b` 从调用从 `component1()` 和 `component2()` 返回的集合collection中的对象。

## 例：从函数中返回两个变量
 
让我们从一个函数中返回两个变量。例如，一个结果对象和一些排序的状态。
在Kotlin中一个简单的实现方式是申明一个[_data class_](data-classes.html)并且返回他的实例：
 
``` kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // computations
    
    return Result(result, status)
}

// Now, to use this function:
val (result, status) = function(...)
```

既然数据类自动申明 `componentN()` 函数，多重申明在这里也有效。

**NOTE**: 我们也可用标准类 `Pair` 并且让 `function()` 返回 `Pair<Int, Status>`, 
但是如果让数据合理命名通常还是更好。  

## 例: 多重申明和图。

可能最好的遍历一个图的方式就是这样：

``` kotlin
for ((key, value) in map) {
   // do something with the key and the value
}
```

为了实现这个，我们需要

* 通过提供一个 `iterator()`迭代函数来表示一系列有序值来表示图。
* 把每个元素标识为一对函数 `component1()` 和 `component2()`.
  
当然，标准库中提供了这一扩展:

``` kotlin
fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
fun <K, V> Map.Entry<K, V>.component1() = getKey()
fun <K, V> Map.Entry<K, V>.component2() = getValue()
  
```  
  
于是你可以自由的使用多重申明 *for*{: .keyword }-loops 来操作图(也可以用在数据类实例的集合等)。

---

翻译By EasonZhou
