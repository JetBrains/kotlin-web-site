---
type: doc
layout: reference
category: "Basics"
title: "基本的な構文"
---

<!--original
- --
type: doc
layout: reference
category: "Basics"
title: "Basic Syntax"
- --
-->

# 基本的な構文

<!--original
# Basic Syntax
-->

## パッケージの定義

<!--original
## Defining packages
-->

パッケージの記述は、ソースファイルの先頭に置かなければなりません。

<!--original
Package specification should be at the top of the source file:
-->

``` kotlin
package my.demo

import java.util.*

// ...
```

<!--original
``` kotlin
package my.demo

import java.util.*

// ...
```
-->

ディレクトリとパッケージと一致する必要はありません。ソースファイルは、ファイルシステム内の任意の場所に配置することができます。

<!--original
It is not required to match directories and packages: source files can be placed arbitrarily in the file system.
-->

[パッケージ](packages.html)を参照してください。

<!--original
See [Packages](packages.html).
-->

## 関数の定義

<!--original
## Defining functions
-->

2つの`Int`型の引数を持ち、`Int`型を戻り値とする関数：

<!--original
Function having two `Int` parameters with `Int` return type:
-->

``` kotlin
fun sum(a: Int, b: Int): Int {
  return a + b
}
```

<!--original
``` kotlin
fun sum(a: Int, b: Int): Int {
  return a + b
}
```
-->

式本体と推論された戻り値の型を持つ関数：

<!--original
Function with an expression body and inferred return type:
-->

``` kotlin
fun sum(a: Int, b: Int) = a + b
```

<!--original
``` kotlin
fun sum(a: Int, b: Int) = a + b
```
-->

意味のある値を返さない関数：

<!--original
Function returning no meaningful value:
-->

``` kotlin
fun printSum(a: Int, b: Int): Unit {
  print(a + b)
}
```

<!--original
``` kotlin
fun printSum(a: Int, b: Int): Unit {
  print(a + b)
}
```
-->

`Unit`型の戻り値は省略できます：

<!--original
`Unit` return type can be omitted:
-->

``` kotlin
fun printSum(a: Int, b: Int) {
  print(a + b)
}
```

<!--original
``` kotlin
fun printSum(a: Int, b: Int) {
  print(a + b)
}
```
-->

[関数](functions.html)を参照してください。

<!--original
See [Functions](functions.html).
-->

## ローカル変数の定義

<!--original
## Defining local variables
-->

1度だけ代入できる（読み取り専用）ローカル変数：

<!--original
Assign-once (read-only) local variable:
-->

``` kotlin
val a: Int = 1
val b = 1   // `Int`型が推論される
val c: Int  // 初期値が与えられない場合、型指定が必要
c = 1       // 明確な代入
```

<!--original
``` kotlin
val a: Int = 1
val b = 1   // `Int` type is inferred
val c: Int  // Type required when no initializer is provided
c = 1       // definite assignment
```
-->

変更可能 (Mutable) な変数：

<!--original
Mutable variable:
-->

``` kotlin
var x = 5 // `Int`型が推論される
x += 1
```

<!--original
``` kotlin
var x = 5 // `Int` type is inferred
x += 1
```
-->

[プロパティとフィールド](properties.html)も参照してください。

<!--original
See also [Properties And Fields](properties.html).
-->


## コメント

<!--original
## Comments
-->

JavaとJavaScriptのように、Kotlinは行末コメントとブロックコメントをサポートしています。

<!--original
Just like Java and JavaScript, Kotlin supports end-of-line and block comments.
-->

``` kotlin
// これは行末コメントです

/* これは複数行にわたる
   ブロックコメントです。 */
```

<!--original
``` kotlin
// This is an end-of-line comment

/* This is a block comment
   on multiple lines. */
```
-->

Javaとは異なり、Kotlinのブロックコメントは入れ子にすることができます。

<!--original
Unlike Java, block comments in Kotlin can be nested.
-->

ドキュメンテーションコメントの構文の詳細については、[Kotlinコードの文章化](kotlin-doc.html)を参照してください。

<!--original
See [Documenting Kotlin Code](kotlin-doc.html) for information on the documentation comment syntax.
-->

## 文字列テンプレートの使用

<!--original
## Using string templates
-->

``` kotlin
fun main(args: Array<String>) {
  if (args.size == 0) return

  print("First argument: ${args[0]}")
}
```

<!--original
``` kotlin
fun main(args: Array<String>) {
  if (args.size == 0) return

  print("First argument: ${args[0]}")
}
```
-->

[文字列テンプレート](basic-types.html#string-templates)を参照してください。

<!--original
See [String templates](basic-types.html#string-templates).
-->

## 条件式の使用

<!--original
## Using conditional expressions
-->

``` kotlin
fun max(a: Int, b: Int): Int {
  if (a > b)
    return a
  else
    return b
}
```

<!--original
``` kotlin
fun max(a: Int, b: Int): Int {
  if (a > b)
    return a
  else
    return b
}
```
-->

*if*{: .keyword }を式として使用：

<!--original
Using *if*{: .keyword } as an expression:
-->

``` kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```

<!--original
``` kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```
-->

[*if*{: .keyword }式](control-flow.html#if-expression)を参照してください。

<!--original
See [*if*{: .keyword }-expressions](control-flow.html#if-expression).
-->

## NULL可能値を使用した、*null*{: .keyword }のチェック

<!--original
## Using nullable values and checking for *null*{: .keyword }
-->

*null*{: .keyword }値を取り得る場合、参照は明示的にnullとしてマークする必要があります。

<!--original
A reference must be explicitly marked as nullable when *null*{: .keyword } value is possible.
-->

`str`は整数を保持していない場合は*null*{: .keyword }を返します：

<!--original
Return *null*{: .keyword } if `str` does not hold an integer:
-->

``` kotlin
fun parseInt(str: String): Int? {
  // ...
}
```

<!--original
``` kotlin
fun parseInt(str: String): Int? {
  // ...
}
```
-->

null可能値を返す関数を使用：

<!--original
Use a function returning nullable value:
-->

``` kotlin
fun main(args: Array<String>) {
  if (args.size < 2) {
    print("Two integers expected")
    return
  }

  val x = parseInt(args[0])
  val y = parseInt(args[1])

  // `x`, `y`はnullが入っていることがあるので、`x * y`はエラーを引き起こす
  if (x != null && y != null) {
    // xとyは、nullチェックの後自動的に非null許容型へキャストされる
    print(x * y)
  }
}
```

<!--original
``` kotlin
fun main(args: Array<String>) {
  if (args.size < 2) {
    print("Two integers expected")
    return
  }

  val x = parseInt(args[0])
  val y = parseInt(args[1])

  // Using `x * y` yields error because they may hold nulls.
  if (x != null && y != null) {
    // x and y are automatically cast to non-nullable after null check
    print(x * y)
  }
}
```
-->

または

<!--original
or
-->

``` kotlin
  // ...
  if (x == null) {
    print("Wrong number format in '${args[0]}'")
    return
  }
  if (y == null) {
    print("Wrong number format in '${args[1]}'")
    return
  }

  // x and y are automatically cast to non-nullable after null check
  print(x * y)
```

<!--original
``` kotlin
  // ...
  if (x == null) {
    print("Wrong number format in '${args[0]}'")
    return
  }
  if (y == null) {
    print("Wrong number format in '${args[1]}'")
    return
  }

  // x and y are automatically cast to non-nullable after null check
  print(x * y)
```
-->

[null安全](null-safety.html)を参照してください。

<!--original
See [Null-safety](null-safety.html).
-->

## 型チェックと自動キャストの使用

<!--original
## Using type checks and automatic casts
-->

*is*{: .keyword }演算子はある式がある型のインスタンスであるかのチェックを行います。
不変のローカル変数やプロパティが特定の型であるかチェックされている場合は、明示的にキャストする必要はありません：

<!--original
The *is*{: .keyword } operator checks if an expression is an instance of a type.
If an immutable local variable or property is checked for a specific type, there's no need to cast it explicitly:
-->

``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj is String) {
    // `obj` はこのブランチ内では自動的に`String`へキャストされる
    return obj.length
  }

  // `obj` は型チェックが行われたブランチ外では、まだ`Any`型である
  return null
}
```

<!--original
``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj is String) {
    // `obj` is automatically cast to `String` in this branch
    return obj.length
  }

  // `obj` is still of type `Any` outside of the type-checked branch
  return null
}
```
-->

または

<!--original
or
-->

``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj !is String)
    return null

  // `obj` はこのブランチ内では自動的に`String`へキャストされる
  return obj.length
}
```

<!--original
``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj !is String)
    return null

  // `obj` is automatically cast to `String` in this branch
  return obj.length
}
```
-->

あるいは

<!--original
or even
-->

``` kotlin
fun getStringLength(obj: Any): Int? {
  // `obj` は`&&`の右側では自動的に`String`へキャストされる
  if (obj is String && obj.length > 0)
    return obj.length

  return null
}
```

<!--original
``` kotlin
fun getStringLength(obj: Any): Int? {
  // `obj` is automatically cast to `String` on the right-hand side of `&&`
  if (obj is String && obj.length > 0)
    return obj.length

  return null
}
```
-->

[クラス](classes.html)と[型のキャスト](typecasts.html)を参照してください。

<!--original
See [Classes](classes.html) and [Type casts](typecasts.html).
-->

## `for`ループの使用

<!--original
## Using a `for` loop
-->

``` kotlin
fun main(args: Array<String>) {
  for (arg in args)
    print(arg)
}
```

<!--original
``` kotlin
fun main(args: Array<String>) {
  for (arg in args)
    print(arg)
}
```
-->

または

<!--original
or
-->

``` kotlin
for (i in args.indices)
  print(args[i])
```

<!--original
``` kotlin
for (i in args.indices)
  print(args[i])
```
-->

[forループ](control-flow.html#for-loops)を参照してください。

<!--original
See [for loop](control-flow.html#for-loops).
-->

## `while`ループの使用

<!--original
## Using a `while` loop
-->

``` kotlin
fun main(args: Array<String>) {
  var i = 0
  while (i < args.size)
    print(args[i++])
}
```

<!--original
``` kotlin
fun main(args: Array<String>) {
  var i = 0
  while (i < args.size)
    print(args[i++])
}
```
-->

[whileループ](control-flow.html#while-loops)を参照してください。

<!--original
See [while loop](control-flow.html#while-loops).
-->

## `when`式の使用

<!--original
## Using `when` expression
-->

``` kotlin
fun cases(obj: Any) {
  when (obj) {
    1          -> print("One")
    "Hello"    -> print("Greeting")
    is Long    -> print("Long")
    !is String -> print("Not a string")
    else       -> print("Unknown")
  }
}
```

<!--original
``` kotlin
fun cases(obj: Any) {
  when (obj) {
    1          -> print("One")
    "Hello"    -> print("Greeting")
    is Long    -> print("Long")
    !is String -> print("Not a string")
    else       -> print("Unknown")
  }
}
```
-->

[when式](control-flow.html#when-expression)を参照してください。

<!--original
See [when expression](control-flow.html#when-expression).
-->

## 範囲の使用

<!--original
## Using ranges
-->

*in*{: .keyword }演算子を使用すると、数が範囲内にあるかどうかを確認できます：

<!--original
Check if a number is within a range using *in*{: .keyword } operator:
-->

``` kotlin
if (x in 1..y-1)
  print("OK")
```

<!--original
``` kotlin
if (x in 1..y-1)
  print("OK")
```
-->

数が範囲外であるかどうかを確認します：

<!--original
Check if a number is out of range:
-->

``` kotlin
if (x !in 0..array.lastIndex)
  print("Out")
```

<!--original
``` kotlin
if (x !in 0..array.lastIndex)
  print("Out")
```
-->

範囲内で反復処理：

<!--original
Iterating over a range:
-->

``` kotlin
for (x in 1..5)
  print(x)
```

<!--original
``` kotlin
for (x in 1..5)
  print(x)
```
-->

[範囲](ranges.html)を参照してください。

<!--original
See [Ranges](ranges.html).
-->

## コレクションの使用

<!--original
## Using collections
-->

コレクション内で反復処理：

<!--original
Iterating over a collection:
-->

``` kotlin
for (name in names)
  println(name)
```

<!--original
``` kotlin
for (name in names)
  println(name)
```
-->

コレクションがあるオブジェクトを含むかを*in*{: .keyword }演算子で調べる：

<!--original
Checking if a collection contains an object using *in*{: .keyword } operator:
-->

``` kotlin
if (text in names) // names.contains(text) が呼ばれる
  print("Yes")
```

<!--original
``` kotlin
if (text in names) // names.contains(text) is called
  print("Yes")
```
-->

フィルタやマップコレクションにラムダ式を使用します：

<!--original
Using lambda expressions to filter and map collections:
-->

``` kotlin
names
    .filter { it.startsWith("A") }
    .sortedBy { it }
    .map { it.toUpperCase() }
    .forEach { print(it) }
```

<!--original
``` kotlin
names
    .filter { it.startsWith("A") }
    .sortedBy { it }
    .map { it.toUpperCase() }
    .forEach { print(it) }
```
-->

[高階関数とラムダ](lambdas.html)を参照してください。

<!--original
See [Higher-order functions and Lambdas](lambdas.html).
-->
