---
type: doc
layout: reference
category: FAQ
title: "对比Java"
---

# 对比Java

## Kotlin解决了一些Java中难搞的问题

Kotlin 修复了Java中一系列长期困扰我们的问题

* [类型系统](null-safety.html)控制了空引用的发生.
* [没有原始类型](java-interop.html)
* Kotlin中数组是[不变的](basic-types.html#Arrays)
* 相对于Java的SAM-conversions，Kotlin有更加合适的[函数类型](lambdas.html#function-types)
* 使用没有通配符的[site variance](generics.html#use-site-variance)
* Kotlin 没有检查[异常](exceptions.html)

## Java有但是Kotlin没有的东东

* [检查异常](exceptions.html)
* [原始类型](basic-types.html) ，不是类
* [静态成员](classes.html)
* [未私有化字段](properties.html)
* [通配符类型](generics.html)

## Kotlin有但是Java没有的东东

* [高阶函数](lambdas.html) + [内联函数](inline-functions.html) = 高性能自定义结构
* [扩展函数](extensions.html)
* [Null 安全性](null-safety.html)
* [智能类型转换](typecasts.html)
* [字符串类型模板](basic-types.html#strings)
* [属性](properties.html)
* [主构造方法](classes.html)
* [一级委托](delegation.html)
* [变量和属性类型的类型接口](basic-types.html)
* [单例](object-declarations.html)
* [声明点变化 & 类型预测](generics.html)
* [范围表达式](ranges.html)
* [运算符重载](operator-overloading.html)
* [同伴对象](classes.html#companion-objects)
