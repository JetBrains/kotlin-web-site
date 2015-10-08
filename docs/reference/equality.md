---
type: doc
layout: reference
category: "Other"
title: "Equality"
---

# 等式 

Kotlin中有两种类型的等于:

* 引用相等(两个引用指向相同的对象)
* 结构相等 (`equals()`)

## 引用相等

引用相等使用`===`操作符判断(它的否定是`!==`). `a === b` 只有当`a`和`b`指向同一个对象才返回true。
另外，你可以使用内联函数 identityEquals() 判断引用相等：

``` kotlin
a.identityEquals(b)
// or
a identityEquals b // infix call
```
当且仅当`a`和`b`指向同一个对象返回true。

## 结构相等

结构相等使用`==`操作符判断(它的否定是`!=`). 通常,`a == b`表达式被翻译为：

``` kotlin
a?.equals(b) ?: b === null
```

如果 a 不是 null 则调用 equals(Any?) 函数，否则检查 b 是否等于 null。

注意完全没有必要为优化你的代码而将 a == null 写成 a === null 编译器会自动帮你做的。


