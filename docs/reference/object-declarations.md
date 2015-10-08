---
type: doc
layout: reference
category: "Syntax"
title: "Object Expressions and Declarations"
---

# 对象表达式和对象声明

有些时候我们需要创造一个对象对某些类做稍微改变，而不用为了它明确定义一个新的子类。

Java把这处理为*匿名内部类*。在Kotlin稍微归纳为*对象表达式*和*对象声明*。

## 对象表达式


创建一个继承自一些类型的内部类的对象，我们可以这么写：

``` kotlin
window.addMouseListener(object : MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }

  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
})
```


如果父类型有一个构造函数，合适的构造函数参数必须被传递下去。多个父类型用逗号隔开，跟在冒号后面：


``` kotlin
open class A(x: Int) {
  public open val y: Int = x
}

interface B {...}

val ab = object : A(1), B {
  override val y = 15
}
```


或许如果我们需要“仅仅是一个对象”,没有父类的，我们可以简单这么写：

``` kotlin
val adHoc = object {
  var x: Int = 0
  var y: Int = 0
}
print(adHoc.x + adHoc.y)
```


就像Jave的匿名内部类，在对象表达里代码可以使变量与作用域联系起来（与Java不同的是，这不是受final变量限制的。）

``` kotlin
fun countClicks(window: JComponent) {
  var clickCount = 0
  var enterCount = 0

  window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) {
      clickCount++
    }

    override fun mouseEntered(e: MouseEvent) {
      enterCount++
    }
  })
  // ...
}
```

## 对象声明

[单例模式](http://en.wikipedia.org/wiki/Singleton_pattern)是一种非常有用的模式，而在Kotilin（在Scala之后）中使得单例模式很容易声明。

``` kotlin
object DataProviderManager {
  fun registerDataProvider(provider: DataProvider) {
    // ...
  }

  val allDataProviders : Collection<DataProvider>
    get() = // ...
}
```


这被称为*对象声明*。如果有一个*object*{: .keyword }关键字在名字前面，这不能再被称为_表达_。我们不能把它归于变量，但我们可以通过它的名字来指定它。这些对象可以有父类型：

``` kotlin
object DefaultListener : MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }

  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
}
```


**NOTE**: 对象声明不能是本地的（例如：直接嵌套在函数里面），但它们可以被嵌套进另外的对象声明或者非内部类里。


### 伴生对象


一个对象声明在一个类里可以标志上*companion*{: .keyword }这个关键字：

``` kotlin
class MyClass {
  companion object Factory {
    fun create(): MyClass = MyClass()
  }
}
```


伴生对象的成员可以被称为使用类名称作为限定符：

``` kotlin
val instance = MyClass.create()
```

The name of the companion object can be omitted, in which case the name `Companion` will be used:

使用`companion`关键字时候，伴生对象的名称可以省略：

``` kotlin
class MyClass {
  companion object {
  }
}

val x = MyClass.Companion
```

 

记住，虽然伴生对象的成员在其他语言中看起来像静态成员，但在日常使用中它们仍然是实体的实例成员，而且比如说能继承接口：


``` kotlin
interface Factory<T> {
  fun create(): T
}


class MyClass {
  companion object : Factory<MyClass> {
    override fun create(): MyClass = MyClass()
  }
}
```


然而，在JVM中你可以有些产生自真正的静态方法和域的伴生对象的成员，如果你使用`@platformStatic`注解。可以从[Java interoperability](java-interop.html#static-methods-and-fields) 这里查看详情。


### 对象表达式与对象声明区别


这是一个重要的的不同在对象表达式与对象声明上


* 对象声明被**lazily**初始化，当被第一次访问的时候
* 对对象表达被**立即**执行（被初始化），当它被用到的时候

--- 

翻译By Wahchi


