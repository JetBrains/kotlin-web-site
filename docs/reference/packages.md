---
type: doc
layout: reference
category: "Syntax"
title: "Packages"
---

# 包

源文件通常以包声明开头:

``` kotlin
package foo.bar

fun baz() {}

class Goo {}

// ...
```

源文件所有的(无论是类或者函数)被包声明覆盖.
所以`baz()`的全名是`foo.bar.baz`, `Goo`的全名是`foo.bar.Goo`. 
 
如果没有明确声明文件属于"default"且包没有名称.

## 导入

除了模块定义的默认导入之外，每个源文件也可以声明自己的导入。
导入语句的语法定义描述在[grammar](grammar.html#imports).

可以导入一个单独的名称，如.

``` kotlin
import foo.Bar // Bar is now accessible without qualification
```

也可以导入一个作用域下的所有内容（包、类、对象等）:

``` kotlin
import foo.* // everything in 'foo' becomes accessible
```

如果出现名称冲突，可以使用 *as*{: .keyword } `as`关键字来重命名导入的名称：

``` kotlin
import foo.Bar // Bar is accessible
import bar.Bar as bBar // bBar stands for 'bar.Bar'
```

## 可见性和包嵌套

如果顶层声明是*private*{: .keyword }, 它将是私有的(查看 [Visibility Modifiers](visibility-modifiers.html)).
尽管Kotlin中可以包嵌套, 如 包`foo.bar` 是`foo`的一个成员,但是一些*private*{: .keyword } 仅仅可以被它的子包所见.

注意外部包成员**不是**默认引入的,例如，在`foo.bar`包的文件中我们不能在不引入的情况下访问`foo`.
