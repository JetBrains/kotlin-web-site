---
type: doc
layout: reference
category: Basics
title: Coding Conventions
---

# 编码约定

此页面包含当前 Kotlin 语言的代码风格

## 命名风格
如果拿不准的时候，默认使用Java的代码风格，比如：

* 使用驼峰法命名 (避免命名含有下划线)
* 类、接口、枚举等类型名字以大写字母打头
* 方法和属性使用小写字母打头
* 使用4个空格作为缩进
* public 函数应撰写函数文档，这样这些文档才会出现在 Kotlin Doc 中

## 冒号

类和超类、接口等以大写字母开头的类型与冒号之间应留有空格，实例这种以小写字母开头的与冒号之间不留空格：

``` kotlin
interface Foo<out T : Any> : Bar {
    fun foo(a: Int): T
}
```

## Lambda表达式

在lambda表达式中, 大括号旁要加空格，箭头 -> 旁也要加空格以区分参数与代码体
lambda表达应尽可能不要写在括号中

``` kotlin
list.filter { it > 10 }.map { element -> element * 2 }
```

在非嵌套的短lambda表达式中，最好使用约定俗成的默认参数 `it` 来替代自定义的明确的参数名
在嵌套的lambda表达式中，参数应明确声明

## Unit

如果函数返回 Unit 类型，那么返回的类型忽略掉，不必明确写出：

``` kotlin
fun foo() { // ": Unit" 忽略了

}
```
