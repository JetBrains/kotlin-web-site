---
type: doc
layout: reference
category: "Syntax"
title: "Packages"
---

# パッケージ

ソースファイルはパッケージ宣言から始めることができる。

``` kotlin
package foo.bar

fun baz() {}

class Goo {}

// ...
```

ソースファイル中のクラスや関数のような全ての内容は宣言パッケージに含まれる。
従って、次の例で示すとおり、 `baz()` の完全名は `foo.bar.baz` であり、 `Goo` の完全名は `foo.bar.Goo` である。
もしパッケージが指定されない場合は、ファイルの内容は名前を持たない"default"パッケージの属することになる。

## インポート（Imports）

標準のインポートとは違い、それぞれのファイルは独自のインポートディレクティブを含んで良い。
インポートの文法は、 [grammar](grammar.html#imports) に記載されている。

単一の名前を指定してインポートできる。例：

``` kotlin
import foo.Bar // Barには許可無しで利用可能になる
```

または、あるスコープ（パッケージ、クラス、オブジェクト等）内の全てのアクセス可能なコンテンツの場合：

``` kotlin
import foo.* // 'foo'内の全てが利用可能になる
```

もし名前空間が衝突したら、 *as*{: .keyword } キーワードを使用して衝突するエンティティを局所的にリネームすることで明確にできる：

``` kotlin
import foo.Bar // Barは利用可能
import bar.Bar as bBar // bBarは'bar.Bar'を意味する
```

`import` キーワードわクラスをインポートするために限定されるわけではない。他の宣言をインポートするために使用することができる：

  * トップレベルの関数やプロパティ
  * [object declarations](object-declarations.html#object-declarations) で宣言された関数やプロパティ
  * [enum定数](enum-classes.html)

Javaとは違って、Kotlinは別の"import static"構文を持っていない。全ての宣言は普通の `import` キーワードによってインポートされる。

## トップレベル宣言の可視性

もしトップレベルの宣言に *private*{: .keyword } マークがついていれば、それが宣言されたファイル内に対しprivateである。  [Visibility Modifiers](visibility-modifiers.html) を参照のこと。
