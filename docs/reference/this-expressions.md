---
type: doc
layout: reference
category: "Syntax"
title: "This expressions"
---

# This表达式

为了记录下当前的接受者我们使用*this*{: .keyword }表达式:

* 在一个[类](classes.html#inheritance)成员中, *this*{: .keyword }指的是当前类对象。
* 在一个[扩展函数](extensions.html)或者[扩展字面函数](lambdas.html#function-literals),
*this*{: .keyword }表示左边的接受者.

如果 *this*{: .keyword } 没有应用者，则指向的是最内层的闭合范围。为了在其它范围中返回 this ，需要使用标签：

## *this*{: .keyword }使用范围
{:#qualified}

为了在范围外部访问*this*{: .keyword }(一个[类](classes.html), 或者[扩展函数](extensions.html),
或者带标签的[扩展字面函数](lambdas.html#function-literals) 我们使用`this@label`作为[label](returns.html)：

``` kotlin
class A { // implicit label @A
  inner class B { // implicit label @B
    fun Int.foo() { // implicit label @foo
      val a = this@A // A's this
      val b = this@B // B's this

      val c = this // foo()'s receiver, an Int
      val c1 = this@foo // foo()'s receiver, an Int

      val funLit = @lambda {String.() ->
        val d = this // funLit's receiver
        val d1 = this@lambda // funLit's receiver
      }


      val funLit2 = { (s: String) ->
        // foo()'s receiver, since enclosing function literal 
        // doesn't have any receiver
        val d1 = this 
      }
    }
  }
}
```
