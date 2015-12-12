---
type: doc
layout: reference
category: "Syntax"
title: "Returns and Jumps"
---

# returnとジャンプ

Kotlinには3つの構造的ジャンプ演算子がある。

* *return*{: .keyword }。デフォルトでは最近のクロージャ（関数閉包）や [function expression](lambdas.html#function-expressions) から抜け出す。
* *break*{: .keyword }。最近の内包ループを終わらせる。
* *continue*{: .keyword }。次の最近内包ループへ進む。

## breakとcontinueのラベル

Kotlinの式は *label*{: .keyword } としてマークできる。
ラベルは `@` の記号で終わる識別子を持つ。例として、 `abc@` や `fooBar@` は有効なラベルである（ [grammar](grammar.html#label)) を参照のこと）。
式をラベル付けするにはラベルをその前に置けば良い：

``` kotlin
loop@ for (i in 1..100) {
  // ...
}
```

*break*{: .keyword } や *continue*{: .keyword } にはラベルをつけることができる。


``` kotlin
loop@ for (i in 1..100) {
  for (j in 1..100) {
    if (...)
      break@loop
  }
}
```

ラベル付き *break*{: .keyword } はそのラベルが付いたループの後右の実行ポイントへジャンプする。
*continue*{: .keyword } はそのループの次の繰り返し実行（イテレーション）まで進む。


## returnでラベルに復帰する

Kotlinでは、関数リテラル、ローカル変数、オブジェクト式を使用すると、関数を入れ子にすることができる。
ラベル付き *return*{: .keyword } は外側の関数から復帰することができる。
最も重要なユースケースは関数リテラルからの復帰である。復帰を書くときは思い出せ：
（訳注：最新版では次のように書き換わっている。「最も重要なユースケースは **ラムダ式** からの復帰である。復帰を書くときは思い出せ：」）
<!-- 最新版：The most important use case is returning from a lambda expression. -->

``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return
    print(it)
  }
}
```

*return*{: .keyword } 式は最近のクロージャ、すなわち `foo` から復帰する。
（このようなローカルでない（非局所的な）復帰は [inline-functions](inline-functions.html) に渡された関数リテラルにのみサポートされている。）
もし関数リテラルからの復帰が必要なら、 *return*{: .keyword } のラベル付けが必要である：

``` kotlin
fun foo() {
  ints.forEach lit@ {
    if (it == 0) return@lit
    print(it)
  }
}
```

これは関数リテラルからのみ復帰する。
（訳注：最新版では「これはラムダ式からのみ復帰する。」）
多くの場合、暗黙ラベルを使用する方が便利である。例えばこのようなラベルはラムダが渡される関数と同じ名前を持つ。

``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return@forEach
    print(it)
  }
}
```

代わりの手法として、関数リテラルと [function expression](lambdas.html#function-expressions) を置換することができる。
（訳注：最新版では[無名関数](https://kotlinlang.org/docs/reference/lambdas.html#anonymous-functions)）
関数式内の *return*{: .keyword } 文は、その関数式自身から復帰する。
（訳注：最新版では「無名関数内の *return*{: .keyword } 文はその無名関数自体から復帰する。」）

``` kotlin
fun foo() {
  ints.forEach(fun(value: Int) {
    if (value == 0) return
    print(value)
  })
}
```

値を返すときにはパーサはラベル付きreturnを優先する。すなわち、

``` kotlin
return@a 1
```

上記は、「 `@a` ラベルにおける復帰」を意味し、「 `(@a1)` ラベルが付いた式からの復帰」ではない。
