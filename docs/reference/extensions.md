---
type: doc
layout: reference
category: "Syntax"
title: "Extensions"
---

# 扩展

Kotlin和c#、Gosu一样，能够扩展一个类的新功能,而无需继承类或使用任何类型的设计模式,如装饰者。 

这通过特殊的声明调用_extensions_.现在，Kotlin支持_extension functions_ 和 _extension properties_.

## 扩展方法


声明一个扩展方法，我们需要用一个 _receiver type_,也就是扩展的类型来作为他的前缀。下面是为`MutableList<Int>`添加一个`swap`方法：

``` kotlin
fun MutableList<Int>.swap(x: Int, y: Int) {
  val tmp = this[x] // 'this' corresponds to the list
  this[x] = this[y]
  this[y] = tmp
}
```

这个*this*{: .keyword }关键字在扩展方法内接受对应的对象（在点符号以前传过来的）


现在，我们可以像一个其他方法一样调用`MutableList<Int>`:  

``` kotlin
val l = mutableListOf(1, 2, 3)
l.swap(0, 2) // 'this' inside 'swap()' will hold the value of 'l'
```

当然，这个方法像这样`MutableList<T>`，我们可以使用泛型：

``` kotlin
fun <T> MutableList<T>.swap(x: Int, y: Int) {
  val tmp = this[x] // 'this' corresponds to the list
  this[x] = this[y]
  this[y] = tmp
}
```

在接收类型表达式中，我们要在方法名可用前声明泛型类型参数。参见[Generic functions](generics.html). 

## 扩展的静态解析

扩展不能真正的修改他们继承的类。通过定义一个扩展，你不能在类内插入新成员，仅仅是通过该类的实例去调用这个新方法。

我们想强调下扩展方法是被静态分发的，即他们不是接收类型的虚方法。如果有一个成员方法和相同类型的扩展方法都适用于给定的参数，**成员方法总是赢**.例如：

``` kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo() { println("extension") }
```


如果我们调用`C`类型的`c`的`c.foo()`，它将打印"member"，而不是"extension". 

## Nullable接受者


注意扩展可被定义为null的接受类型。这样的扩展被称为对象变量。即使他的值是null，你可以在方法体内检查`this == null`，这也允许你调用Kotlin中的toString()在没有检查null的时候：检查发生在扩展方法的内部的时候

``` kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // after the null check, 'this' is autocast to a non-null type, so the toString() below
    // resolves to the member function of the Any class
    return toString()
}
```

## 扩展属性

和方法相似，Kotlin支持扩展属性

``` kotlin
val <T> List<T>.lastIndex: Int
  get() = size - 1
```


注意：由于扩展没有实际的将成员插入类中，因此对扩展来说是无效的
属性是有[backing field](properties.html#backing-fields).这就是为什么**初始化其不允许有扩展属性**。他们的行为只能显式的使用 getters/setters.  

例子:

``` kotlin
val Foo.bar = 1 // error: initializers are not allowed for extension properties
```


## 伴生对象的扩展

如果一个类定义有一个[伴生对象](object-declarations.html#companion-objects) ，你也可以为伴生对象定义扩张方法和属性

``` kotlin
class MyClass {
  companion object { }  // will be called "Companion"
}

fun MyClass.Companion.foo() {
  // ...
}
```

  
就像伴生对象的其他普通成员，只用用类名作为限定符去调用他们
``` kotlin
MyClass.foo()
```


## 扩展范围

大多数时候，我们定义扩张方法在顶层，即直接在包里
 
``` kotlin
package foo.bar
 
fun Baz.goo() { ... } 
``` 

使用一个定义的包之外的扩展，我们需要导入他的头文件：

``` kotlin
package com.example.usage

import foo.bar.goo // importing all extensions by name "goo"
                   // or
import foo.bar.*   // importing everything from "foo.bar"

fun usage(baz: Baz) {
  baz.goo()
)

```
 更多信息参见[Imports](packages.html#imports)

## 动机


在Java中，我们将类命名为"\*Utils": `FileUtils`, `StringUtils`等，著名的`java.util.Collections`也属于同一种命名方式。关于这些Utils-classes的不愉快的部分是这样写代码的：

``` java
// Java
Collections.swap(list, Collections.binarySearch(list, Collections.max(otherList)), Collections.max(list))
```

 
这些类名总是碍手碍脚的，我们可以通过静态导入得到：

``` java
// Java
swap(list, binarySearch(list, max(otherList)), max(list))
```

这会变得好一点，但是我们并没有从IDE强大的自动补全功能中得到帮助。我们希望它能更好点


``` java
// Java
list.swap(list.binarySearch(otherList.max()), list.max())
```

但是我们不希望实现`List`类内所有可能的方法，对吧？这时候扩展将会帮助我们。


--- 

翻译By S_arige
