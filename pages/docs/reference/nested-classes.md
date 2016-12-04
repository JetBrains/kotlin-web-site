---
type: doc
layout: reference
category: "Syntax"
title: "ネストされたクラス"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Nested Classes"
- --
-->

# ネストされたクラス

<!--original
# Nested Classes
-->

クラスは他のクラスの中に入れ子にすることができます：

<!--original
Classes can be nested in other classes
-->

``` kotlin
class Outer {
  private val bar: Int = 1
  class Nested {
    fun foo() = 2
  }
}

val demo = Outer.Nested().foo() // == 2
```

<!--original
``` kotlin
class Outer {
  private val bar: Int = 1
  class Nested {
    fun foo() = 2
  }
}

val demo = Outer.Nested().foo() // == 2
```
-->

## 内部クラス

<!--original
## Inner classes
-->

クラスは、外部クラスのメンバーにアクセスできるように *inner*{:.keyword} としてマークされてもかまいません。内部クラスは、外部クラスのオブジェクトへの参照をもちます：

<!--original
A class may be marked as *inner*{: .keyword } to be able to access members of outer class. Inner classes carry a reference to an object of an outer class:
-->

``` kotlin
class Outer {
  private val bar: Int = 1
  inner class Inner {
    fun foo() = bar
  }
}

val demo = Outer().Inner().foo() // == 1
```

<!--original
``` kotlin
class Outer {
  private val bar: Int = 1
  inner class Inner {
    fun foo() = bar
  }
}

val demo = Outer().Inner().foo() // == 1
```
-->

内部クラス内での *this*{:.keyword} の曖昧さ回避について学ぶために、[修飾された *this*{:.keyword} 式](this-expressions.html)を参照してください。

<!--original
See [Qualified *this*{: .keyword } expressions](this-expressions.html) to learn about disambiguation of *this*{: .keyword } in inner classes.
-->

## 無名内部クラス

<!--original
## Anonymous inner classes
-->

無名内部クラスのインスタンスは[オブジェクト式](object-declarations.html#object-expressions)を使用して作成されます：

<!--original
Anonymous inner class instances are created using an [object expression](object-declarations.html#object-expressions):
-->
                                                      
``` kotlin
window.addMouseListener(object: MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }
                                                      
  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
})
```

<!--original
``` kotlin
window.addMouseListener(object: MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }
                                                      
  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
})
```
-->

オブジェクトが機能的なJavaインタフェースのインスタンス（つまり、あるJavaインタフェースがひとつの抽象メソッドとひもづく）である場合は、インタフェースの型が前に付いたラムダ式を使用してオブジェクトを作成できます。

<!--original
If the object is an instance of a functional Java interface (i.e. a Java interface with a single abstract method),
you can create it using a lambda expression prefixed with the type of the interface:
-->

``` kotlin
val listener = ActionListener { println("clicked") }
```

<!--original
``` kotlin
val listener = ActionListener { println("clicked") }
```
-->