---
type: doc
layout: reference
category: "Syntax"
title: "Dynamic Type"
---

# 动态类型

作为一个静态类型语言,Kotlin仍然可能会与无类型或者弱类型语言相互调用，比如JavaScript,为了这方面使用可以使用`dynamic`类型。

``` kotlin
val dyn: dynamic = ...
```

 `dynamic`类型关闭了Kotlin类型检查:

  - 这样的类型可以分配任意变量或者在任意的地方作为参数传递,
  - 任何值都可以分配为`dynamic`类型，或者作为参数传递给任何接受 `dynamic`类型参数的函数，
  - 这样的值不`null`检查。

`dynamic`最奇特的特性就是可以在`dynamic`变量上调用**任何**属性或**任何**函数：

``` kotlin
dyn.whatever(1, "foo", dyn) // 'whatever' is not defined anywhere
dyn.whatever(*array(1, 2, 3))
```

在JavaScript平台这段代码被编译为"as is": `dyn.whatever(1)`在Kotlin中`dyn.whatever(1)` 生成JavaScript 代码.

动态调用返回`dynamic`作为结果，因此我们可以轻松实现链式调用：

``` kotlin
dyn.foo().bar.baz()
```

当给动态调用传递一个 lambda 表达式时，所有的参数默认都是`dynamic`：

``` kotlin
dyn.foo {
  x -> x.bar() // x is dynamic
}
```

更多细节, [查看](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md).


