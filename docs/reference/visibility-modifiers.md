---
type: doc
layout: reference
category: "Classes and Objects"
title: "Visibility Modifiers"
---

# 可視性修飾子

クラス、オブジェクト、インタフェース、コンストラクタ、関数、プロパティ、そしてセッターは _可視性修飾子 (visibility modifiers)_ を持つ。
（ゲッターは常にプロパティと同じ可視性を持つ。）
Kotlinには4つの可視性修飾子がある： `private` 、 `protected` 、 `internal` 、 `public` である。
デフォルトの可視性は明示的修飾子が無い場合に使われる `public` である。

これらの型宣言のスコープの違いは、後述する。

## パッケージ

関数、プロパティ、クラス、オブジェクトそしてインタフェースは"トップレベル"で宣言することができる。すなわち、パッケージの中に直接宣言することができる：

``` kotlin
// ファイル名： example.kt
package foo

fun baz() {}
class Bar {}
```

* 可視性修飾子を指定しなければ、宣言がどこからでも見える `public` がデフォルトとして使用される。
* `private` として宣言すれば、その宣言を含むファイル中でのみ見える
* `internal` として宣言すれば、同じモジュールのどこからでも見える
* `protected` はトップレベル宣言では有効ではない

例：

``` kotlin
// ファイル名： example.kt
package foo

private fun foo() {} // example.ktの中で見える

public var bar: Int = 5 // プロパティはどこからでも見える
    private set         // セッターはexample.ktの中でのみ見える

internal val baz = 6    // 同じモジュール内で見える
```

## クラスと継承

When declared inside a class:
クラスの中で宣言した場合：

* `private` --- そのクラス内（全てのメンバを含む）でのみ見える
* `protected` --- `private` と同じ + サブクラスでも見える
* `internal` ---  その宣言したクラスを見る *そのモジュール内の* 任意のクライアントはその内部メンバが見える
* `public` --- その宣言クラスを見る任意のクライアントは `public` のメンバが見える

*注意* Javaユーザへ：Kotlinでは、外部クラス (outer class) はその内部クラス (inner class) のprivateメンバが見えない。

例：

``` kotlin
open class Outer {
    private val a = 1
    protected val b = 2
    internal val c = 3
    val d = 4  // デフォルトでpublic

    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // aは見えない
    // b, c, dは見える
    // Nestedとeは見える
}

class Unrelated(o: Outer) {
    // o.a, o.b は見えない
    // o.c と o.d は見える（同じモジュール）
    // Outer.Nested は見えないし、 Nested::e も見えない
}
```

### コンストラクタ

クラスの主コンストラクタの可視性を指定したい場合は、次の構文を使うと良い（明示的に *constructor*{: .keyword } キーワードを付加しなければならないことに注意）：

``` kotlin
class C private constructor(a: Int) { ... }
```

このコンストラクタはprivateである。デフォルトでは、全てのコンストラクタは `public` である。クラスが見える場所全てから可観測であることは有効的である（すなわち、 `internal` クラスのコンストラクタはそのモジュール内でのみ見える）。

### 局所的宣言（Local declarations）

ローカル変数、ローカル関数、ローカルクラスは可視性修飾子を持てない。


## モジュール

`internal` 可視性修飾子はメンバが同じモジュールで見えることを意味する。
具体的には、複数のKotlinファイルで構成される1つのモジュールは一緒にコンパイルされる：

  * IntelliJ IDEAのモジュール
  * Maven や Gradle のプロジェクト
  * Antタスクの1つの呼び出しで複数のファイルがコンパイルされる
