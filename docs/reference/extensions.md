---
type: doc
layout: reference
category: "Syntax"
title: "Extensions"
---

# 拡張

Kotlinは、C#やGosuと似ていて、クラスを継承したりDecoratorのようなデザインパターンを使用せずとも、クラスを新しい機能で拡張する能力を提供する。
これは _拡張 (extensions)_ と呼ばれる特別な宣言で行われる。
Kotlinは _拡張関数 (extension functions)_ と _拡張プロパティ (extension properties)_ をサポートする。

## 拡張関数

拡張関数を宣言するには _レシーバタイプ (receiver type)_ を関数名の前に付ける必要がある。すなわち、その型は拡張されている。
次の例では、 `swap` 関数を `MutableList<Int>` に追加している：

``` kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
  val tmp = this[index1] // 'this' はlistに合致する
  this[index1] = this[index2]
  this[index2] = tmp
}
```

拡張関数の中にある *this*{: .keyword } キーワードはレシーバオブジェクト（ドットの前に置かれるもの）と合致する。
これでこの関数をどの `MutableList<Int>` からでも呼べるようになった：

``` kotlin
val l = mutableListOf(1, 2, 3)
l.swap(0, 2) // 'swap()'の中にある'this'は'l'の値を保持する
```

もちろん、任意の `MutableList<T>` についてこの関数は理にかなっており、ジェネリックにもできる：

``` kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
  val tmp = this[index1] // 'this'はlistに合致する
  this[index1] = this[index2]
  this[index2] = tmp
}
```

関数名の前でジェネリック型のパラメータを宣言すると、レシーバ型の式で使用できるようになる。

詳細は [Generic functions](generics.html) を参照のこと。

## 拡張は **静的** に解決される

拡張は拡張したクラスを実際に変更するわけではない。
拡張を定義すると、クラスに新たなメンバを挿入できなくなるが、そのクラスのインスタンスにおいてその新しい関数をただドット付きで呼べるようにするだけではない。

拡張関数は **静的に** 処理されるということを強調したい。つまり、それらはレシーバ型における仮想ではない。
もしメンバと同型の拡張が与えられた引数において受容可能であれば、 **常にメンバが優先される** 。 
例：

``` kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo() { println("extension") }
```

`C` 型の任意の `c` から `c.foo()` を呼べば、"extension"ではなく、"member"と表示する。

## null許容レシーバ

拡張はnull許容レシーバ型で定義することができることに注意すること。
そのような拡張は値がnullであってもオブジェクトから呼び出すことができる。そして、本体で `this == null` のチェックを行うことができる。
これにより、KotlinではnullチェックをせずにtoString()を呼ぶことができ、チェックは拡張関数の中で行われる。

``` kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // nullチェック後、 'this' は非null型に自動キャストされ、
    // 次のtoString()はAnyクラスのメンバ関数として解決される
    return toString()
}
```

## 拡張プロパティ

関数と同様、Kotlinは拡張プロパティをサポートする：

``` kotlin
val <T> List<T>.lastIndex: Int
  get() = size - 1
```

拡張は実際にメンバをクラスへ挿入しないので、拡張プロパティが[バッキングフィールド](properties.html#backing-fields)をもつ効果的な方法はない。
これは **イニシャライザが拡張プロパティで許可されていない** からである。
この振る舞いは明示的にゲッター/セッターを提供して定義したときのみおこる。

例：

``` kotlin
val Foo.bar = 1 // エラー：イニシャライザは拡張プロパティでは許可されていない
```


## コンパニオンオブジェクトの拡張

クラスが [コンパニオンオブジェクト](object-declarations.html#companion-objects) 定義を持つなら、拡張関数やプロパティもコンパニオンオブジェクトに定義することができる：

``` kotlin
class MyClass {
  companion object { }  // "コンパニオン"と呼ばれる
}

fun MyClass.Companion.foo() {
  // ...
}
```

コンパニオンオブジェクトの通常のメンバと同じように、クラス名のみを修飾子として使用して呼ぶことができる。

``` kotlin
MyClass.foo()
```


## 拡張のスコープ

ほとんどの場合、トップレベルで拡張を定義する。すなわち、パッケージ直下である：

``` kotlin
package foo.bar

fun Baz.goo() { ... }
```

宣言パッケージ外でこのような拡張を使用するには、呼び出し時にインポートする必要がある：

``` kotlin
package com.example.usage

import foo.bar.goo // "goo"という名前の全ての拡張をインポートする
                   // または
import foo.bar.*   // 全てを"foo.bar"からインポートする

fun usage(baz: Baz) {
  baz.goo()
)

```

詳細は [Imports](packages.html#imports) を参照のこと。

##  モチベーション

Javaでは、"\*Utils"のような名前のクラスを使っている。例として、 `FileUtils` や `StringUtils` 等が挙げられる。
有名な `java.util.Collections` は同じ種に属する。
そしてこれらのUtilsクラスの不快な部分は、コードを次のように使うところである：

``` java
// Java
Collections.swap(list, Collections.binarySearch(list, Collections.max(otherList)), Collections.max(list))
```

これらのクラス名は常に邪魔になる。staticインポートでこのようになる：

``` java
// Java
swap(list, binarySearch(list, max(otherList)), max(list))
```

これは少し良いが、IDEの強力な助けを全くまたはほとんど得られない。次のようにできればどんなに良いことだろう：

``` java
// Java
list.swap(list.binarySearch(otherList.max()), list.max())
```

しかし全てのとりうるメソッドを `List` クラスの中に実装したくはないだろう？このようなときに拡張が助けてくれる。
