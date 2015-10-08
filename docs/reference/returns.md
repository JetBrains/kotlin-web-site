---
type: doc
layout: reference
category: "Syntax"
title: "Returns and Jumps"
---

# 返回和跳转


Kotlin 有三种跳出结构

* *return*{: .keyword }.默认情况下，从最近的一个封闭的方法或者 [方法表达式](lambdas.html#function-expressions)跳出.

* *break*{: .keyword }.终止最近的封闭循环

* *continue*{: .keyword }.直接进入循环体的下次循环

## 中断和继续标签
 
在Kotlin中任何表达式都可以用*label*{: .keyword } （标签）来标记。  
label的格式是被'@'标识符标记，例如：`abc@`, `fooBar@`都是有效的label（参见[语法](grammar.html#label)）  
  
你可以在一个方法前面放一个label。
``` kotlin
loop@ for (i in 1..100) {
  // ...
}
```

现在，我们可以将label与 *break*{: .keyword } 或者*continue*{: .keyword }一起使用：

``` kotlin
loop@ for (i in 1..100) {
  for (j in 1..100) {
    if (...)
      break@loop
  }
}
```

break执行后将跳转到标记处。

*continue*{: .keyword }将进入循环体的下次循环


## 返回标签

在Kotlin里，函数字面量、局部函数和对象表达式等函数都可以被嵌套在一起
适当的返回方式允许我们从外部方法返回值  

带标签的**return**，最重要的一个用途，就是让我们可以从函数字面量中返回。

``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return
    print(it)
  }
}
```


这个 *return*{: .keyword }表达式从最近的封闭的方法中返回，例如‘foo’。

 (注意，非全局的返回只支持内部方法，参见[内联方法](inline-functions.html).)
如果我们只是需要跳出内部方法，我们必须标记它并且返回这个标签
``` kotlin
fun foo() {
  ints.forEach lit@ {
    if (it == 0) return@lit
    print(it)
  }
}
```


现在只是从内部方法返回。有时候用匿名的标签将会更加方便 
像这样和方法同名的标签是可以的

``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return@forEach
    print(it)
  }
}
```
 
通常，我们用一个[方法表达式](lambdas.html#function-expressions)替代内部匿名方法。在方法内部声明一个*return*{: .keyword }将从其内部返回

``` kotlin
fun foo() {
  ints.forEach(fun(value: Int) {
    if (value == 0) return
    print(value)
  })
}
```


当要返回一个值得时候，推荐使用描述性的返回，例如：
``` kotlin
return@a 1
```

 
意思是“返回被标记为‘@a’值是‘1’的标签，而不是像‘（@a 1）’的一个标签表达式”

被命名的方法自动被定义成为标签

``` kotlin
fun outer() {
  fun inner() {
    return@outer // the label @outer was defined automatically
  }
}                                                                             
```

---

翻译BY S_arige

