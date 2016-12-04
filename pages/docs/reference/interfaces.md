---
type: doc
layout: reference
category: "Syntax"
title: "インタフェース"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Interfaces"
- --
-->

# インターフェース

<!--original
# Interfaces
-->

Kotlinでのインタフェースは、Java 8と非常によく似ています。インタフェースは抽象メソッドの宣言と同様に、メソッドの実装を含めることができます。抽象クラスと違って、インタフェースは状態を持てません。インタフェースはプロパティを持つことができますが、これらは abstract であること、またはアクセサの実装を提供することが必要です。

<!--original
Interfaces in Kotlin are very similar to Java 8. They can contain declarations of abstract methods, as well as method
implementations. What makes them different from abstract classes is that interfaces cannot store state. They can have
properties but these need to be abstract or to provide accessor implementations.
-->

インタフェースは、 *interface*{: .keyword } キーワードを使用して定義されます。

<!--original
An interface is defined using the keyword *interface*{: .keyword }
-->

``` kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // 本体は任意
    }
}
```

<!--original
``` kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // optional body
    }
}
```
-->

## インタフェースの実装

<!--original
## Implementing Interfaces
-->

クラスやオブジェクトは、1つまたは複数のインターフェイスを実装することができます：

<!--original
A class or object can implement one or more interfaces
-->

``` kotlin
class Child : MyInterface {
   override fun bar() {
      // 本体
   }
}
```

<!--original
``` kotlin
class Child : MyInterface {
   override fun bar() {
      // body
   }
}
```
-->

## インターフェイス内のプロパティ

<!--original
## Properties in Interfaces
-->

インターフェイス内にプロパティを宣言することができます。インタフェースで宣言されたプロパティは、 abstract にすることも、アクセサの実装を提供することもできます。インタフェース内で宣言されたプロパティはバッキングフィールドを持つことはできず、それ故にインタフェース内で宣言されたアクセサはそれらを参照できません。

<!--original
You can declare properties in interfaces. A property declared in an interface can either be abstract, or it can provide
implementations for accessors. Properties declared in interfaces can't have backing fields, and therefore accessors
declared in interfaces can't reference them.
-->

``` kotlin
interface MyInterface {
    val property: Int // abstract

    val propertyWithImplementation: String
        get() = "foo"

    fun foo() {
        print(property)
    }
}

class Child : MyInterface {
    override val property: Int = 29
}
```

<!--original
``` kotlin
interface MyInterface {
    val property: Int // abstract

    val propertyWithImplementation: String
        get() = "foo"

    fun foo() {
        print(property)
    }
}

class Child : MyInterface {
    override val property: Int = 29
}
```
-->

## オーバーライドの競合解決

<!--original
## Resolving overriding conflicts
-->

スーパータイプのリストでたくさんの型を宣言すると、同メソッドの複数の実装を継承するように見えることがあります。例えば：

<!--original
When we declare many types in our supertype list, it may appear that we inherit more than one implementation of the same method. For example
-->

``` kotlin
interface A {
  fun foo() { print("A") }
  fun bar()
}

interface B {
  fun foo() { print("B") }
  fun bar() { print("bar") }
}

class C : A {
  override fun bar() { print("bar") }
}

class D : A, B {
  override fun foo() {
    super<A>.foo()
    super<B>.foo()
  }
}
```

<!--original
``` kotlin
interface A {
  fun foo() { print("A") }
  fun bar()
}

interface B {
  fun foo() { print("B") }
  fun bar() { print("bar") }
}

class C : A {
  override fun bar() { print("bar") }
}

class D : A, B {
  override fun foo() {
    super<A>.foo()
    super<B>.foo()
  }
}
```
-->

インタフェース *A* と *B* は、両方とも関数 *foo()* と *bar()* を宣言しています。両方とも *foo()* を実装していますが、 *B* のみが *bar()* を実装しています。（ *bar()* は *A* では abstract としてマークされていません。これは関数が本体を持たないときのインタフェースのデフォルトだからです。） 
さて、もし具体クラス *C* を *A* から得れば、 *bar()* をオーバライドし、実装を提供しなければならないことは明らかです。そしてもし *D* を *A* と *B* から得れば、 *bar()* をオーバライドする必要はありません。なぜなら1つの実装を継承したからです。
しかし *foo()* の実装を2つ継承してしまったため、コンパイラはどっちを選んだら良いかわかりません。したがって *foo()* のオーバライドが強制され、何が欲しいのかを明示する必要があります。

<!--original
Interfaces *A* and *B* both declare functions *foo()* and *bar()*. Both of them implement *foo()*, but only *B* implements *bar()* (*bar()* is not marked abstract in *A*,
because this is the default for interfaces, if the function has no body). Now, if we derive a concrete class *C* from *A*, we, obviously, have to override *bar()* and provide
an implementation. And if we derive *D* from *A* and *B*, we don’t have to override *bar()*, because we have inherited only one implementation of it.
But we have inherited two implementations of *foo()*, so the compiler does not know which one to choose, and forces us to override *foo()* and say what we want explicitly.
-->