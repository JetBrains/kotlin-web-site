---
type: doc
layout: reference
category: Basics
title: Coding Conventions
---

# 编码习惯

下面是kotlin语言当前的编码习惯。

## 命名风格
很多情况采用Java的编码风格，例如:

* 名称使用驼峰写法 (避免名称中出现下划线)
* 类型用大写字母开头
* 方法和属性用小写字母开头
* 4个空格缩进
* public 方法应该有文档注释

Kotlin没有fields概念 -- 只有属性。
避免在属性前使用前缀, 例如 _ 或者 m_ 或者其它符号。
如果你希望一个属性能像field一样使用, 使用 $前缀: `$foo`指的是后面属性`foo`;
永远不要建立像这样的`_foo` 私有属性。

## 冒号

在分隔子父类或接口的时候，或在分隔实例和类型的时候应该有一个空格:

``` kotlin
interface Foo<out T : Any> : Bar {
    fun foo(a: Int): T
}
```

## Unit
如果一个方法返回 Unit（感觉就是空）,返回类型可以被省略:

``` kotlin
fun foo() { // ": Unit" is omitted here

}
```
