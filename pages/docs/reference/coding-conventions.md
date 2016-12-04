---
type: doc
layout: reference
category: Basics
title: コーディング規約
---

<!--original
- --
type: doc
layout: reference
category: Basics
title: Coding Conventions
- --
-->

# コーディング規約

<!--original
# Coding Conventions
-->

このページでは、Kotlin言語の現在のコーディングスタイルを紹介します。

<!--original
This page contains the current coding style for the Kotlin language.
-->

## 命名スタイル

よく分からない場合はJava のコード規約に従ってください：


<!--original
## Naming Style
If in doubt default to the Java Coding Conventions such as:
-->

* キャメルケースの使用（そして命名でのアンダースコアの使用を避ける）
* 型は大文字で始まる
* メソッドとプロパティは小文字で始まる
* 4スペースインデントの使用
* public関数はKotlin Docに登場するようなドキュメンテーションがないといけない

<!--original
* use of camelCase for names (and avoid underscore in names)
* types start with upper case
* methods and properties start with lower case
* use 4 space indentation
* public functions should have documentation such that it appears in Kotlin Doc
-->

## コロン

<!--original
## Colon
-->

コロンが型と継承元のセパレータとして使用される際は、一つ前にスペースが必要です。 一方、インスタンスと型のセパレータとして使用するときには、スペースは不要です。

<!--original
There is a space before colon where colon separates type and supertype and there's no space where colon separates instance and type:
-->

``` kotlin
interface Foo<out T : Any> : Bar {
    fun foo(a: Int): T
}
```

<!--original
``` kotlin
interface Foo<out T : Any> : Bar {
    fun foo(a: Int): T
}
```
-->

## ラムダ

<!--original
## Lambdas
-->

ラムダ式では、スペースが波括弧の周りに必要です。また、パラメータを本体と分かつアロー（->）も同様です。 可能な限り、ラムダを括弧の外に渡す必要があります。

<!--original
In lambda expressions, spaces should be used around the curly braces, as well as around the arrow which separates the parameters
from the body. Whenever possible, a lambda should be passed outside of parentheses.
-->

``` kotlin
list.filter { it > 10 }.map { element -> element * 2 }
```

<!--original
``` kotlin
list.filter { it > 10 }.map { element -> element * 2 }
```
-->

短くてネストされていない（入れ子でない）ラムダ内では、 パラメータを明示的に宣言する代わりに `it` 規約を使用することを推奨します。パラメータを持つネストされたラムダでは、パラメータを常に明示的に宣言する必要があります。

<!--original
In lambdas which are short and not nested, it's recommended to use the `it` convention instead of declaring the parameter
explicitly. In nested lambdas with parameters, parameters should be always declared explicitly.
-->

## ユニット (Unit)

<!--original
## Unit
-->

関数がUnitを返す場合、戻り値の型は省略されるべきです：

<!--original
If a function returns Unit, the return type should be omitted:
-->

``` kotlin
fun foo() { // ": Unit" が省略されている

}
```

<!--original
``` kotlin
fun foo() { // ": Unit" is omitted here

}
```
-->