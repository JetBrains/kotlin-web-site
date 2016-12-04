---
type: doc
layout: reference
category: "Syntax"
title: "Returns and Jumps"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Returns and Jumps"
- --
-->

# returnとジャンプ

<!--original
# Returns and Jumps
-->

Kotlinには3つの構造的ジャンプ演算子があります。

<!--original
Kotlin has three structural jump operators
-->

* *return*{: .keyword }. デフォルトでは最近のクロージャ（関数閉包）や[匿名関数](lambdas.html#anonymous-functions)から抜け出します。
* *break*{: .keyword } 最も近い外側のループを終わらせます。
* *continue*{: .keyword }. 最も近い外側のループである次のステップに進みます。

<!--original
* *return*{: .keyword }. By default returns from the nearest enclosing function or [anonymous function](lambdas.html#anonymous-functions).
* *break*{: .keyword }. Terminates the nearest enclosing loop.
* *continue*{: .keyword }. Proceeds to the next step of the nearest enclosing loop.
-->


## breakとcontinueのラベル

<!--original
## Break and Continue Labels
-->

Kotlinにおける任意の式を *label*{: .keyword }でマークすることができます。ラベルは、たとえば、 `@` 記号に続く識別子の形式を持っています： `abc@` 、`fooBar@`が有効なラベル（[文法](grammar.html#label)を参照してください）です。式にラベルを付けるには、式の前にラベルを置きましょう：

<!--original
Any expression in Kotlin may be marked with a *label*{: .keyword }.
Labels have the form of an identifier followed by the `@` sign, for example: `abc@`, `fooBar@` are valid labels (see the [grammar](grammar.html#label)).
To label an expression, we just put a label in front of it
-->

``` kotlin
loop@ for (i in 1..100) {
  // ...
}
```

<!--original
``` kotlin
loop@ for (i in 1..100) {
  // ...
}
```
-->

さあ、これで私たちは *break*{: .keyword } や *continue*{: .keyword } をラベル付けできるようになりました：

<!--original
Now, we can qualify a *break*{: .keyword } or a *continue*{: .keyword } with a label:
-->

``` kotlin
loop@ for (i in 1..100) {
  for (j in 1..100) {
    if (...)
      break@loop
  }
}
```

<!--original
``` kotlin
loop@ for (i in 1..100) {
  for (j in 1..100) {
    if (...)
      break@loop
  }
}
```
-->

ラベル付き *break*{: .keyword }  はそのラベルが付いたループの右後の実行ポイントへジャンプします。
*continue*{: .keyword } はそのループの次の繰り返し実行（イテレーション）まで進みます。

<!--original
A *break*{: .keyword } qualified with a label jumps to the execution point right after the loop marked with that label.
A *continue*{: .keyword } proceeds to the next iteration of that loop.

-->

## ラベルに復帰する

<!--original
## Return at Labels
-->

Kotlinでは、関数リテラル、ローカル変数、オブジェクト式を使用すると、関数を入れ子にすることができます。
ある条件付きの *return*{: .keyword }を使うと、外側の関数から復帰することができます。
最も重要なユースケースは、ラムダ式からのreturnです。これを書くとき、思い出してください：

<!--original
With function literals, local functions and object expression, functions can be nested in Kotlin. 
Qualified *return*{: .keyword }s allow us to return from an outer function. 
The most important use case is returning from a lambda expression. Recall that when we write this:
-->

``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return
    print(it)
  }
}
```

<!--original
``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return
    print(it)
  }
}
```
-->

*return*{: .keyword } 式は最も内側の関数、すなわち `foo` から復帰します。
（このような非局所的復帰が[インライン関数](inline-functions.html)に渡されたラムダ式でのみサポートされていることに注意してください。）
もしラムダ式から復帰する必要がある場合は、それにラベルを付け、 *return*{: .keyword } を修飾する必要があります：

<!--original
The *return*{: .keyword }-expression returns from the nearest enclosing function, i.e. `foo`.
(Note that such non-local returns are supported only for lambda expressions passed to [inline functions](inline-functions.html).)
If we need to return from a lambda expression, we have to label it and qualify the *return*{: .keyword }:
-->

``` kotlin
fun foo() {
  ints.forEach lit@ {
    if (it == 0) return@lit
    print(it)
  }
}
```

<!--original
``` kotlin
fun foo() {
  ints.forEach lit@ {
    if (it == 0) return@lit
    print(it)
  }
}
```
-->

これはラムダ式からのみ復帰します。多くの場合、暗黙のラベルを使用する方が便利です。
そのようなラベルは、ラムダが渡された関数と同じ名前を持っています。

<!--original
Now, it returns only from the lambda expression. Oftentimes it is more convenient to use implicits labels:
such a label has the same name as the function to which the lambda is passed.
-->

``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return@forEach
    print(it)
  }
}
```

<!--original
``` kotlin
fun foo() {
  ints.forEach {
    if (it == 0) return@forEach
    print(it)
  }
}
```
-->

代わりの手法として、[無名関数](lambdas.html#anonymous-functions)とラムダ式を置き換えることができます。
無名関数内の *return*{: .keyword } 文は、その無名関数自体から復帰します。

<!--original
Alternatively, we can replace the lambda expression with an [anonymous function](lambdas.html#anonymous-functions).
A *return*{: .keyword } statement in an anomymous function will return from the anonymous function itself.
-->

``` kotlin
fun foo() {
  ints.forEach(fun(value: Int) {
    if (value == 0) return
    print(value)
  })
}
```

<!--original
``` kotlin
fun foo() {
  ints.forEach(fun(value: Int) {
    if (value == 0) return
    print(value)
  })
}
```
-->

値を返すとき、パーサは資格を持つreturnを優先します。すなわち、

<!--original
When returning a value, the parser gives preference to the qualified return, i.e.
-->

``` kotlin
return@a 1
```

<!--original
``` kotlin
return@a 1
```
-->

上記は「 `@a` ラベルにおけるreturn `1` 」を意味し、「 `(@a 1)` ラベルが付いた式からのreturn」ではありません。

<!--original
means "return `1` at label `@a`" and not "return a labeled expression `(@a 1)`".
-->