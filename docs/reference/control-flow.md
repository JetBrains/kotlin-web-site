---
type: doc
layout: reference
category: "Syntax"
title: "Control Flow"
---

# 制御フロー

## if式

Kotlinでは、 *if*{: .keyword } は式であり、すなわち値を返す。従って、三項演算子は存在しない。なぜなら普通の *if*{: .keyword } がその役割を果たすためである。

``` kotlin
// 従来の使用法
var max = a
if (a < b)
  max = b

// elseも使用
var max: Int
if (a > b)
  max = a
else
  max = b

// 式として使用
val max = if (a > b) a else b
```

*if*{: .keyword } の分岐はブロックにすることができ、最後の式がそのブロックの値となる：

``` kotlin
val max = if (a > b) {
    print("Choose a")
    a
  }
  else {
    print("Choose b")
    b
  }
```

もし *if*{: .keyword } を文ではなく式として使用する（例えば値を返したり変数に代入したり）ならば、その式には `else` 分岐が必要である。

[grammar for *if*{: .keyword }](grammar.html#if) を参照のこと。

## when式

*when*{: .keyword } はC言語のような言語におけるswitch演算子の置き換えである。最も簡単な形式では、次のようになる：

``` kotlin
when (x) {
  1 -> print("x == 1")
  2 -> print("x == 2")
  else -> { // このブロックに注目
    print("x is neither 1 nor 2")
  }
}
```

*when*{: .keyword } はその引数と条件が満たされる分岐が現れるまで、順番に全ての分岐に対して比較する。

*when*{: .keyword } は式としても文としても使うことができる。
もし式として使用されれば、その値は条件が満たされた分岐が全ての式の値となる。
もし文として使用されれば、個別の条件は無視される（ *if*{: .keyword } と全く同じく、それぞれの条件はブロックになるため、その値はブロック内の最後の式のものとなる）。

*else*{: .keyword } 条件は他の条件が全て満たされなかった際に評価される。
もしが式として使用されれば、全てのあり得る場合を分岐条件で網羅できていることをコンパイラが証明できない限りは、 *else*{: .keyword } 条件は必須である。

もしたくさんの条件を同じ方法で処理する必要がある場合には、分岐条件をコンマでまとめることができる：

``` kotlin
when (x) {
  0, 1 -> print("x == 0 or x == 1")
  else -> print("otherwise")
}
```

分岐条件として任意の式（定数に限らない）を使用することができる：

``` kotlin
when (x) {
  parseInt(s) -> print("s encodes x")
  else -> print("s does not encode x")
}
```

*in*{: .keyword } または *!in*{: .keyword } を使用すると、コレクションの [範囲 (range)](ranges.html) をチェックすることもできる：

``` kotlin
when (x) {
  in 1..10 -> print("x is in the range")
  in validNumbers -> print("x is valid")
  !in 10..20 -> print("x is outside the range")
  else -> print("none of the above")
}
```

値をチェックする他の方法として、特定の型の *is*{: .keyword } または *!is*{: .keyword } がある。
[smart casts](typecasts.html#smart-casts) のおかげで、その型のメソッドやプロパティに追加のチェック無しでアクセスできることに注意すること。

```kotlin
val hasPrefix = when(x) {
  is String -> x.startsWith("prefix")
  else -> false
}
```

*when*{: .keyword } は *if*{: .keyword }-*else*{: .keyword } *if*{: .keyword } 連鎖を代替することもできる。
引数が与えられない場合は、分岐条件は単純なbooleanの式となり、分岐はその条件がtrueの場合に実行される：

``` kotlin
when {
  x.isOdd() -> print("x is odd")
  x.isEven() -> print("x is even")
  else -> print("x is funny")
}
```

[grammar for *when*{: .keyword }](grammar.html#when) を参照のこと。


## forループ

*for*{: .keyword } ループはイテレータによって提供されるもの全てを繰り返し実行する。
構文は次の通り：

``` kotlin
for (item in collection)
  print(item)
```

本文をブロックにすることもできる。

``` kotlin
for (item: Int in ints) {
  // ...
}
```

前述したように、 *for*{: .keyword } はイテレータとして提供されるもの全てを繰り返し実行する。すなわち：

* メンバ関数や拡張関数の `iterator()` は型を返し、
  * メンバ関数や拡張関数の `next()` と
  * メンバ関数や拡張関数の `hasNext()` は `Boolean` を返す。

これら3つの関数は全て `演算子` としてマークされる必要がある。

もし配列やリストをインデックス付きで繰り返し処理したいならば、この方法を使用できる：

``` kotlin
for (i in array.indices)
  print(array[i])
```

"範囲の繰り返し実行"は余分なオブジェクトを生成しない最高の実装へコンパイルされることに注意すること。

別方法として、ライブラリ関数の `withIndex` を使用することもできる：

``` kotlin
for ((index, value) in array.withIndex()) {
    println("the element at $index is $value")
}
```

[grammar for *for*{: .keyword }](grammar.html#for) を参照のこと。

## whileループ

*while*{: .keyword } と *do*{: .keyword }..*while*{: .keyword } はいつものように動く：

``` kotlin
while (x > 0) {
  x--
}

do {
  val y = retrieveData()
} while (y != null) // yはここで可観測！
```

[grammar for *while*{: .keyword }](grammar.html#while) を参照のこと。

## ループ内でのbreakとcontinue

Kotlinはループ中の従来の *break*{: .keyword } and *continue*{: .keyword } 演算子をサポートしている。 [Returns and jumps](returns.html) を参照のこと。
