---
type: doc
layout: reference
category: "Syntax"
title: "Delegation"
---

# 委托

## 委托类


[委托模式](https://en.wikipedia.org/wiki/Delegation_pattern)是实现继承的一个有效方式.

Kotlin原生支持它。

一个类 `Derived` 可以从一个接口 `Base`继承并且委托所有的共有方法为具体对象。


``` kotlin

interface Base {

  fun print()

}




class BaseImpl(val x: Int) : Base {

  override fun print() { print(x) }

}




class Derived(b: Base) : Base by b




fun main() {

  val b = BaseImpl(10)

  Derived(b).print() // prints 10

}

```




在父类`Derived`中的 *by*{: .keyword }-语句表示 `b` 将会被 储存在 `Derived` 的内部对象中

并且编译器会把所有 `Base` 的方法生成给最终的 `b`.


---

翻译By EasonZhou

