---
type: doc
layout: reference
category: "Syntax"
title: "Control Flow"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Control Flow"
- --
-->

# 制御フロー

<!--original
# Control Flow
-->

## if式

<!--original
## If Expression
-->

Kotlinでは、*if*{: .keyword }は式であり、すなわち値を返します。従って、三項演算子は存在しません（条件 ? 真の時 : 偽の時）。なぜなら普通の *if*{: .keyword } がその役割を果たすためです。

<!--original
In Kotlin, *if*{: .keyword } is an expression, i.e. it returns a value.
Therefore there is no ternary operator (condition ? then : else), because ordinary *if*{: .keyword } works fine in this role.
-->

``` kotlin
// 伝統的な使い方
var max = a 
if (a < b) 
  max = b 
 
// else付き
var max: Int
if (a > b) 
  max = a 
else 
  max = b 
 
// 表現として
val max = if (a > b) a else b
```

<!--original
``` kotlin
// Traditional usage 
var max = a 
if (a < b) 
  max = b 
 
// With else 
var max: Int
if (a > b) 
  max = a 
else 
  max = b 
 
// As expression 
val max = if (a > b) a else b
```
-->

*if*{: .keyword } の分岐はブロックにすることができ、最後の式がそのブロックの値となります：

<!--original
*if*{: .keyword } branches can be blocks, and the last expression is the value of a block:
-->

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

<!--original
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
-->

もし*if*{: .keyword }を文ではなく式として使用する（例えば値を返したり変数に代入したりする）ならば、その式には`else`分岐が必要です。 

<!--original
If you're using *if*{: .keyword } as an expression rather than a statement (for example, returning its value or
assigning it to a variable), the expression is required to have an `else` branch.
-->

[*if*{: .keyword }の文法](grammar.html#if)を参照してください。

<!--original
See the [grammar for *if*{: .keyword }](grammar.html#if).
-->

## when式

<!--original
## When Expression
-->

*when*{: .keyword } はC言語のような言語におけるswitch演算子の置き換えです。最も簡単な形式では、次のようになります：

<!--original
*when*{: .keyword } replaces the switch operator of C-like languages. In the simplest form it looks like this
-->

``` kotlin
when (x) {
  1 -> print("x == 1")
  2 -> print("x == 2")
  else -> { // このブロックに注目してください
    print("x is neither 1 nor 2")
  }
}
```

<!--original
``` kotlin
when (x) {
  1 -> print("x == 1")
  2 -> print("x == 2")
  else -> { // Note the block
    print("x is neither 1 nor 2")
  }
}
```
-->

*when*{: .keyword } はその引数と条件が満たされる分岐が現れるまで、順番に全ての分岐に対して比較されます。*when*{: .keyword } は式としても文としても使うことができます。 もし式として使用されれば、その値は条件が満たされた分岐が全ての式の値となります。もし文として使用されれば、個別の条件は無視されます。（*if*{: .keyword }と全く同じく、それぞれの条件はブロックになれるため、その値はブロック内の最後の式のものとなる。）

<!--original
*when*{: .keyword } matches its argument against all branches sequentially until some branch condition is satisfied.
*when*{: .keyword } can be used either as an expression or as a statement. If it is used as an expression, the value
of the satisfied branch becomes the value of the overall expression. If it is used as a statement, the values of
individual branches are ignored. (Just like with *if*{: .keyword }, each branch can be a block, and its value
is the value of the last expression in the block.)
-->

*else*{: .keyword }条件は他の条件が全て満たされなかった際に評価されます。 もしが式として使用されれば、全てのあり得る場合を分岐条件で網羅できていることをコンパイラが証明できない限りは、*else*{: .keyword }条件は必須です。

<!--original
The *else*{: .keyword } branch is evaluated if none of the other branch conditions are satisfied.
If *when*{: .keyword } is used as an expression, the *else*{: .keyword } branch is mandatory,
unless the compiler can prove that all possible cases are covered with branch conditions.
-->

もしたくさんの条件を同じ方法で処理する必要がある場合には、分岐条件をコンマでまとめることができます：

<!--original
If many cases should be handled in the same way, the branch conditions may be combined with a comma:
-->

``` kotlin
when (x) {
  0, 1 -> print("x == 0 or x == 1")
  else -> print("それ以外")
}
```

<!--original
``` kotlin
when (x) {
  0, 1 -> print("x == 0 or x == 1")
  else -> print("otherwise")
}
```
-->

分岐条件として任意の式（定数に限らない）を使用することができます：

<!--original
We can use arbitrary expressions (not only constants) as branch conditions
-->

``` kotlin
when (x) {
  parseInt(s) -> print("sはxをエンコードする")
  else -> print("sはxをエンコードしない")
}
```

<!--original
``` kotlin
when (x) {
  parseInt(s) -> print("s encodes x")
  else -> print("s does not encode x")
}
```
-->

*in*{: .keyword }または*!in*{: .keyword }を使用すると、コレクションの [範囲 (range)](ranges.html) をチェックすることもできます： 

<!--original
We can also check a value for being *in*{: .keyword } or *!in*{: .keyword } a [range](ranges.html) or a collection:
-->

``` kotlin
when (x) {
  in 1..10 -> print("xは範囲内")
  in validNumbers -> print("xは有効")
  !in 10..20 -> print("xは範囲外")
  else -> print("どれにも該当せず")
}
```

<!--original
``` kotlin
when (x) {
  in 1..10 -> print("x is in the range")
  in validNumbers -> print("x is valid")
  !in 10..20 -> print("x is outside the range")
  else -> print("none of the above")
}
```
-->

値をチェックする他の方法として、特定の型の*is*{: .keyword }または*!is*{: .keyword }があります。[スマートキャスト](typecasts.html#smart-casts)のおかげで、その型のメソッドやプロパティに追加のチェック無しでアクセスできることに注意してください。

<!--original
Another possibility is to check that a value *is*{: .keyword } or *!is*{: .keyword } of a particular type. Note that,
due to [smart casts](typecasts.html#smart-casts), you can access the methods and properties of the type without
any extra checks.
-->

```kotlin
val hasPrefix = when(x) {
  is String -> x.startsWith("prefix")
  else -> false
}
```

<!--original
```kotlin
val hasPrefix = when(x) {
  is String -> x.startsWith("prefix")
  else -> false
}
```
-->

*when*{: .keyword }は *if*{: .keyword}-*else*{: .keyword} *if*{: .keyword}連鎖を代替することもできます。 引数が与えられない場合は、分岐条件は単純なbooleanの式となり、分岐はその条件がtrueの場合に実行されます：

<!--original
*when*{: .keyword } can also be used as a replacement for an *if*{: .keyword }-*else*{: .keyword } *if*{: .keyword } chain.
If no argument is supplied, the branch conditions are simply boolean expressions, and a branch is executed when its condition is true:
-->

``` kotlin
when {
  x.isOdd() -> print("x is odd")
  x.isEven() -> print("x is even")
  else -> print("x is funny")
}
```

<!--original
``` kotlin
when {
  x.isOdd() -> print("x is odd")
  x.isEven() -> print("x is even")
  else -> print("x is funny")
}
```
-->

[*when*{: .keyword } の文法](grammar.html#when)を参照してください。

<!--original
See the [grammar for *when*{: .keyword }](grammar.html#when).

-->

## Forループ

<!--original
## For Loops
-->

*for*{: .keyword }ループはイテレータによって提供されるものを何でも繰り返し実行します。構文は次のとおりです：

<!--original
*for*{: .keyword } loop iterates through anything that provides an iterator. The syntax is as follows:
-->

``` kotlin
for (item in collection)
  print(item)
```

<!--original
``` kotlin
for (item in collection)
  print(item)
```
-->

本文をブロックにすることもできます。

<!--original
The body can be a block.
-->

``` kotlin
for (item: Int in ints) {
  // ...
}
```

<!--original
``` kotlin
for (item: Int in ints) {
  // ...
}
```
-->

前述したように、 *for*{: .keyword} はイテレータとして提供されるものを何でも繰り返し実行します。すなわち：

<!--original
As mentioned before, *for*{: .keyword } iterates through anything that provides an iterator, i.e.
-->

* メンバ関数や拡張関数の `iterator()` は型を返し、
  * メンバ関数や拡張関数の `next()` と
  * メンバ関数や拡張関数の `hasNext()` は `Boolean` を返します。

<!--original
* has a member- or extension-function `iterator()`, whose return type
  * has a member- or extension-function `next()`, and
  * has a member- or extension-function `hasNext()` that returns `Boolean`.
-->

これら3つの関数は全て `演算子 (operator)` としてマークされる必要があります。

<!--original
All of these three functions need to be marked as `operator`.
-->

配列の`for`ループはイテレータオブジェクトを作成しないインデックスベースのループにコンパイルされます。

<!--original
A `for` loop over an array is compiled to an index-based loop that does not create an iterator object.
-->

もし配列やリストをインデックス付きで繰り返し処理したいならば、この方法を使用できる： 

<!--original
If you want to iterate through an array or a list with an index, you can do it this way:
-->

``` kotlin
for (i in array.indices)
  print(array[i])
```

<!--original
``` kotlin
for (i in array.indices)
  print(array[i])
```
-->

“範囲の繰り返し実行”は余分なオブジェクトを生成しない最適な実装へコンパイルされることに注意すること。

<!--original
Note that this "iteration through a range" is compiled down to optimal implementation with no extra objects created.
-->

別方法として、ライブラリ関数の withIndex を使用することもできます：

<!--original
Alternatively, you can use the `withIndex` library function:
-->

``` kotlin
for ((index, value) in array.withIndex()) {
    println("$indexの要素は$value")
}
```

<!--original
``` kotlin
for ((index, value) in array.withIndex()) {
    println("the element at $index is $value")
}
```
-->

[*for*{: .keyword }の文法](grammar.html#for)を参照してください。

<!--original
See the [grammar for *for*{: .keyword }](grammar.html#for).
-->

## whileループ

<!--original
## While Loops
-->

*while*{: .keyword } と *do*{: .keyword }..*while*{: .keyword } はいつものように動きます：

<!--original
*while*{: .keyword } and *do*{: .keyword }..*while*{: .keyword } work as usual
-->

``` kotlin
while (x > 0) {
  x--
}

do {
  val y = retrieveData()
} while (y != null) // y はここで可視(visible)
```

<!--original
``` kotlin
while (x > 0) {
  x--
}

do {
  val y = retrieveData()
} while (y != null) // y is visible here!
```
-->

[*while*{: .keyword }の文法](grammar.html#while)を参照してください。

<!--original
See the [grammar for *while*{: .keyword }](grammar.html#while).
-->

## ループ内でのbreakとcontinue

<!--original
## Break and continue in loops
-->

Kotlinはループ中の従来の *break*{: .keyword }と*continue*{: .keyword } 演算子をサポートしています。[Returnとジャンプ](returns.html)を参照してください。

<!--original
Kotlin supports traditional *break*{: .keyword } and *continue*{: .keyword } operators in loops. See [Returns and jumps](returns.html).
-->