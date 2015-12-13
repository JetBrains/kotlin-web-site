---
type: doc
layout: reference
category: "Syntax"
title: "Interfaces"
---

# インタフェース

KotlinでのインタフェースはJava 8と非常に似ている。メソッドの実装と同じように抽象メソッドの宣言を含むことができる。
抽象クラスとの違いはインタフェースは状態を持てないことである。プロパティは状態を持てるが、抽象である必要がある。

インタフェースは *interface*{: .keyword } キーワードを用いて宣言される。

``` kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // 本体は必須ではない
    }
}
```

## インタフェースの実装

クラスやオブジェクトは1つまたは複数のインタフェースを実装できる：

``` kotlin
class Child : MyInterface {
   fun bar() {
      // 本体
   }
}
```

## インタフェース内のプロパティ

インタフェースはプロパティがステートレスである限り許容する。これはインタフェースが状態を持つことを許可しないためである。
（訳注：最新版は以下の通り：プロパティをインタフェース内に宣言することができる。インタフェースの中で宣言されたプロパティは抽象にも慣れるし、アクセサの実装を提供することもできる。インタフェース内で宣言されたプロパティはバッキングフィールドを持つことはできず、それ故にインタフェース内で宣言されたアクセサはそれらを参照できない。）

``` kotlin
interface MyInterface {
    val property: Int // abstract

    fun foo() {
        print(property)
    }
}

class Child : MyInterface {
    override val property: Int = 29
}
```

## オーバライドの衝突解決

スーパータイプのリストで沢山の型を宣言すると同メソッドの複数の実装を継承するように見えることがある。例えば：

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

インタフェース *A* と *B* は、両方とも関数 *foo()* と *bar()* を宣言している。
両方とも *foo()* を実装しているが、 *B* のみが *bar()* を実装している。（ *bar()* は *A* ではabstractとしてマークされていない。これは関数が本体を持たない際のインタフェースのデフォルトであるためだ。）
さて、もし具体クラス *C* を *A* から得れば、 *bar()* をオーバライドし、実装を提供しなければならないことは明らかである。
そしてもし *D* を *A* と *B* から得れば、 *bar()* をオーバライドする必要はない。なぜなら1つの実装を継承したからである。

しかし *foo()* の実装を2つ継承してしまったため、コンパイラはどっちを選んだら良いかわからない。従って *foo()* のオーバライドが強制され、何が欲しいのかを明示する必要がある。
