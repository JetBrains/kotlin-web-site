---
type: doc
layout: reference
category: "Syntax"
title: "Basic Types"
---

# 基本の型

Kotlinでは、メンバ関数やプロパティをどんな変数からでも呼び出せるという意味で、全てのものがオブジェクトである。
いくつかの型は実装が最適化されているためビルトインであるが、ユーザから見ると普通のクラスのように見える。
このセクションでは、次の型の大部分を説明する：数値、文字、真偽値（boolean）、配列。

## 数値

KotlinはJavaに似た方法で数を扱うが、完全に同じというわけではない。
例えば、数値の暗黙の拡大変換や、リテラルはいくつかの事例では少し異なる。

Kotlinは数値の表現用に次のビルトインの型を提供する（これはJavaに近い）：

| 型	 | ビット幅 |
|--------|----------|
| Double | 64       |
| Float	 | 32       |
| Long	 | 64       |
| Int	 | 32       |
| Short	 | 16       |
| Byte	 | 8        |

Kotlinでは文字は数値でないことに注意すること。

### リテラル定数

次の整数値を表現するためのリテラル定数には、次の種類がある：

* 小数: `123`
  * Long型の数を表すには大文字の`L`でタグ付けする: `123L`
* 16進数: `0x0F`
* 2進数: `0b00001011`

注意：8進数のリテラルはサポートされていない。
Kotlinは浮動小数点数の従来記法もサポートしている。

* Double型（デフォルト）: `123.5`, `123.5e10`
* `f` or `F`でタグ付けするとFloat型: `123.5f`

### 表現

Javaプラットフォームでは、null許容型な数値の参照（例：`Int?`）や[ジェネリクス](https://ja.wikipedia.org/wiki/%E3%82%B8%E3%82%A7%E3%83%8D%E3%83%AA%E3%83%83%E3%82%AF%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0#Java.E3.81.AE.E3.82.B8.E3.82.A7.E3.83.8D.E3.83.AA.E3.82.AF.E3.82.B9)が関与している場合を除いて、JVMプリミティブ型として数値が物理的に格納されている
後者の事例では、数値が[ボクシング](https://ja.wikipedia.org/wiki/%E3%82%AA%E3%83%BC%E3%83%88%E3%83%9C%E3%82%AF%E3%82%B7%E3%83%B3%E3%82%B0)されている。

数値のボクシングは一様性を保持しないことに注意すること：

``` kotlin
val a: Int = 10000
print(a === a) // 'true' を出力
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA === anotherBoxedA) // !!! 'false' を出力 !!!
```

一方、これは同一性を保持している：

``` kotlin
val a: Int = 10000
print(a == a) // 'true' を出力
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA == anotherBoxedA) // 'true' を出力
```

### 明示的変換

異なる表現であるが故に、小さな型は大きな型のサブタイプではない。
仮に小さな型がそうであれば、次の種類の悩みを抱えたであろう：

``` kotlin
// 仮説のコードであり、実際はコンパイルできない：
val a: Int? = 1 // ボクシングされたInt型 (java.lang.Integer)
val b: Long? = a // 暗黙の変換がLong型 (java.lang.Long) へのボクシングを引き起こす
print(a == b) // 仰天！これはLong型のequals()チェックで他の部分がLong型になるのと同等 に "false" を出力する
```

つまり、一様性だけでなく同一性でさえも全ての場所において静かに失われたのである。

結果として、小さな型は大きな型に暗黙的に変換される **のではない**。
これは明示的変換無しで`Byte`型の値を`Int`型へ代入することができないことを意味する。

``` kotlin
val b: Byte = 1 // OK, リテラルは静的にチェックされている
val i: Int = b // ERROR
```

明示的変換は数字を拡張する際に使用することができる。

``` kotlin
val i: Int = b.toInt() // OK: 明示的に拡張された
```

全ての数値型は次の変換をサポートしている：

* `toByte(): Byte`
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`
* `toChar(): Char`

明示的変換がないことは滅多に目立たない。なぜならその型は文脈から推測され、算術演算オーバロードされ適切に変換されるからである。例：

``` kotlin
val l = 1L + 3 // Long + Int => Long
```

### 算術

Kotlinは算術計算の標準セットをサポートしている。それらは適切なクラス（ただしコンパイラは対応する命令の呼び出しを最適化する）のメンバとして宣言されている。
[Operator overloading](operator-overloading.html)を参照のこと。

ビット演算のように特別な文字ではなく、ただ中に置かれる名前付きの関数として呼ばれる。例：

``` kotlin
val x = (1 shl 2) and 0x000FF000
```

これらはビット単位の操作を行う全リストである（`Int`と`Long`のみ利用可能）：

* `shl(bits)` – signed shift left (Javaの `<<`)
* `shr(bits)` – signed shift right (Javaの `>>`)
* `ushr(bits)` – unsigned shift right (Javaの `>>>`)
* `and(bits)` – bitwise and
* `or(bits)` – bitwise or
* `xor(bits)` – bitwise xor
* `inv()` – bitwise inversion

## 文字

文字は`Char`型で表される。直接数字として扱うことはできない。

``` kotlin
fun check(c: Char) {
  if (c == 1) { // ERROR: 非互換の型
    // ...
  }
}
```

文字リテラルはシングルクォートで囲む： `'1'`, `'\n'`, `'\uFF00'`.
明示的に文字を`Int`型の数に変換することができる。

``` kotlin
fun decimalDigitValue(c: Char): Int {
  if (c !in '0'..'9')
    throw IllegalArgumentException("Out of range")
  return c.toInt() - '0'.toInt() // 数への明示的変換
}
```

数値のように、文字はnull許容参照が必要なときにボクシングされる。同一性はボクシング操作されると保持されない。

## 真偽値（Boolean)

`Boolean` 型は真偽値を表し、 *true*{: .keyword } と *false*{: .keyword } との2値を表す。

Booleanはnull許容参照が必要なときにボクシングされる。

Booleanのビルトイン演算は次を含む：

* `||` – 遅延評価論理和
* `&&` – 遅延評価論理積
* `!` - 否定

## 配列（Arrays）

Kotlinでの配列は `Array` クラスで表され、`get` と `set` 関数を持つ（ `[]` の演算子をオーバロードすることによって実現している）。また、 `size` プロパティがいくつかの有用なメンバ関数と共に有効になっている：

``` kotlin
class Array<T> private constructor() {
  val size: Int
  fun get(index: Int): T
  fun set(index: Int, value: T): Unit

  fun iterator(): Iterator<T>
  // ...
}
```

配列を作るには、ライブラリ関数の`arrayOf()`にアイテムの値を渡せば良い。`arrayOf(1, 2, 3)` は[1, 2, 3]の配列を作成する。
または、ライブラリ関数の `arrayOfNulls()`で、null要素で埋められた指定サイズの配列を作ることができる。

他のやり方として、ファクトリ関数を使う方法がある。これは配列のサイズと各要素のインデックス値と計算する内容を引数に取る：

``` kotlin
// 値が ["0", "1", "4", "9", "16"] である Array<String> を作成する
val asc = Array(5, { i -> (i * i).toString() })
```

前述したとおり、 `[]` 演算はメンバ関数の `get()` と `set()` を表す。

注意：Javaとは違って、Kotlinでの配列は不変である。つまりKotlinでは `Array<Any>` へ `Array<String>` を代入することができないということを表す。これは実行時エラーを回避するためである（しかし、`Array<out Any>` を使えば代入できる。[Type Projections](generics.html#type-projections)を参照のこと）。

Kotlinはプリミティブ型（`ByteArray` 、 `ShortArray` 、 `IntArray` 等）の配列について、オーバーヘッド無しでボクシングができる特別なクラスを持つ。
これらのクラスは `Array` クラスと継承関係を持たないが、同じメソッドとプロパティを持つ。
それぞれのクラスにおいて、対応するファクトリ関数を持つ：

``` kotlin
val x: IntArray = intArrayOf(1, 2, 3)
x[0] = x[1] + x[2]
```

## 文字列（String）

文字列は `String` 型で表現される。文字列はイミュータブル（不変）である。
文字列の要素は、インデックスの演算でアクセスできる： `s[i]`
文字列は *for*{: .keyword }-loop でイテレート（繰り返し操作）できる：

``` kotlin
for (c in str) {
  println(c)
}
```

### 文字列リテラル

Kotlinは2つの種類の文字列リテラルを持つ：1つはエスケープされた文字列を持ちうる、エスケープ済み文字列である。もう1つは改行と任意の文字を含む生文字列である。
エスケープ済み文字列はJavaの文字列に非常によく似ている：

``` kotlin
val s = "Hello, world!\n"
```

バックスラッシュを用いる従来の手法でエスケープが行われる。

生文字列は三連クオート (`"""`) で区切られる。エスケープは含まれておらず、改行や他の文字を含めることができる：

``` kotlin
val text = """
  for (c in "foo")
    print(c)
"""
```


### 文字列テンプレート

文字列はテンプレート表現を含むことができる。例）評価され、その結果が文字列と結合されるコードの断片。
テンプレート表現はダラー記号 ($) で始まり、簡単な名前で構成される：

``` kotlin
val i = 10
val s = "i = $i" // "i = 10" であると評価される
```

または、波括弧を使った従来の記法もある：

``` kotlin
val s = "abc"
val str = "$s.length is ${s.length}" // "abc.length is 3" であると評価される
```

テンプレートは生文字列、エスケープ済み文字列のどちらに含まれていても動作する。
もし `$` の文字リテラルを表現する必要がある場合は、次の文法を使用できる：

``` kotlin
val price = "${'$'}9.99"
```
