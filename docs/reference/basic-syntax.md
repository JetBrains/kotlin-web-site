---
type: doc
layout: reference
category: "Basics"
title: "Basic Syntax"
---

# 基本文法

## パッケージの定義

パッケージの記述は、ソースファイルの先頭になければならない。

``` kotlin
package my.demo

import java.util.*

// ...
```

ディレクトリやパッケージに合致する必要はない。
ソースファイルをファイルシステムの任意の位置に置くことができる。

[Packages](packages.html)を参照のこと。

## 関数の定義

2つの`Int`型の引数を持ち、`Int`型を戻り値とする関数：

``` kotlin
fun sum(a: Int, b: Int): Int {
  return a + b
}
```

実体と推論された戻り値の型を持つ関数：

``` kotlin
fun sum(a: Int, b: Int) = a + b
```

意味のある値を返さない関数：

``` kotlin
fun printSum(a: Int, b: Int): Unit {
  print(a + b)
}
```

`Unit`型の戻り値は、省略できる：

``` kotlin
public fun printSum(a: Int, b: Int) {
  print(a + b)
}
```

[Functions](functions.html)を参照のこと。

## ローカル変数の定義

1度だけ代入できる（読み取り専用）ローカル変数：

``` kotlin
val a: Int = 1
val b = 1   // `Int`型が推論される
val c: Int  // 初期値が与えられない場合、型指定が必要
c = 1       // 明確な代入
```

Mutable（可変）な変数：

``` kotlin
var x = 5 // `Int`型が推論される
x += 1
```

[Properties And Fields](properties.html)も参照のこと。

## Stringテンプレートの使用

``` kotlin
fun main(args: Array<String>) {
  if (args.size == 0) return

  print("First argument: ${args[0]}")
}
```

[String templates](basic-types.html#string-templates)も参照のこと。

## 条件式

``` kotlin
fun max(a: Int, b: Int): Int {
  if (a > b)
    return a
  else
    return b
}
```

*if*{: .keyword }を式のように使用することもできる：

``` kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```

[*if*{: .keyword }-expressions](control-flow.html#if-expression)を参照のこと。

## null許容変数の使用と *null*{: .keyword }のチェック

*null*{: .keyword }値を許容するのであれば、明示的にnull許容であると表記しなければならない。

もし`str`が整数値を持たなければ、 *null*{: .keyword }を返す：

``` kotlin
fun parseInt(str: String): Int? {
  // ...
}
```

null許容値を戻り値として返す関数を使う：

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
    // `x`と`y`は、nullチェックの後自動的に非null許容型へキャストされる
    print(x * y)
  }
}
```

または

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

  // `x`と`y`は、nullチェックの後自動的に非null許容型へキャストされる
  print(x * y)
```

[Null-safety](null-safety.html)を参照のこと。

## 型チェックと自動キャストの使用

*is*{: .keyword }演算子は、式がその型のインスタンスであるかを確かめる。
もし可変なローカル変数やプロパティが特定の型でチェックされれば、明示的にキャストする必要はない：

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

または

``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj !is String)
    return null

  // `obj` はこのブランチ内では自動的に`String`へキャストされる
  return obj.length
}
```

または

``` kotlin
fun getStringLength(obj: Any): Int? {
  // `obj` は`&&`の右側では自動的に`String`へキャストされる
  if (obj is String && obj.length > 0)
    return obj.length

  return null
}
```

[Classes](classes.html) and [Type casts](typecasts.html)を参照のこと。

## `for`ループの使用

``` kotlin
fun main(args: Array<String>) {
  for (arg in args)
    print(arg)
}
```

または

``` kotlin
for (i in args.indices)
  print(args[i])
```

[for loop](control-flow.html#for-loops)を参照のこと。

## `while`ループの使用

``` kotlin
fun main(args: Array<String>) {
  var i = 0
  while (i < args.size)
    print(args[i++])
}
```

[while loop](control-flow.html#while-loops)を参照のこと。

## `when`式の使用

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

[when expression](control-flow.html#when-expression)を参照のこと。

## 範囲の使用

*in*{: .keyword }演算子を使用すると、ある数が範囲内にあるかをチェックできる：

``` kotlin
if (x in 1..y-1)
  print("OK")
```

ある数が範囲外かチェックする：

``` kotlin
if (x !in 0..array.lastIndex)
  print("Out")
```

範囲内で反復する：

``` kotlin
for (x in 1..5)
  print(x)
```

[Ranges](ranges.html)を参照のこと。

## コレクションの使用

コレクション内で反復する：

``` kotlin
for (name in names)
  println(name)
```

コレクションがあるオブジェクトを含むかを *in*{: .keyword }演算子で調べる：

``` kotlin
if (text in names) // names.contains(text) が呼ばれる
  print("Yes")
```

関数リテラルを`filter`や`map`のコレクションとして使用する：

``` kotlin
names
    .filter { it.startsWith("A") }
    .sortedBy { it }
    .map { it.toUpperCase() }
    .forEach { print(it) }
```

[Higher-order functions and Lambdas](lambdas.html)を参照のこと。
