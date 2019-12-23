---
type: doc
layout: reference
category: "Syntax"
title: "基本の型"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Basic Types"
- --
-->

# 基本の型

<!--original
# Basic Types
-->

Kotlinでは、メンバ関数やプロパティをどんな変数からでも呼び出せるという意味で、全てのものがオブジェクトです。 いくつかの型は実装が最適化されているためビルトインであるが、ユーザから見ると普通のクラスのように見えます。このセクションでは、次の型の大部分を説明します：数値、文字、真偽値（boolean）、配列。

<!--original
In Kotlin, everything is an object in the sense that we can call member functions and properties on any variable. Some types are built-in, because their implementation is optimized, but to the user they look like ordinary classes. In this section we describe most of these types: numbers, characters, booleans and arrays.
-->

## 数値

<!--original
## Numbers
-->

Kotlinは、Javaに近い方法で数字を扱うが、全く同じではありません。例えば、数値の暗黙の拡大変換が存在せず、リテラルはいくつかの事例では少し異なる。

<!--original
Kotlin handles numbers in a way close to Java, but not exactly the same. For example, there are no implicit widening conversions for numbers, and literals are slightly different in some cases.
-->

Kotlinは数値の表現用に次のビルトインの型を提供します（これはJavaに近い）：

<!--original
Kotlin provides the following built-in types representing numbers (this is close to Java):
-->

| 型	 | ビット幅 |
|--------|----------|
| Double | 64       |
| Float	 | 32       |
| Long	 | 64       |
| Int	 | 32       |
| Short	 | 16       |
| Byte	 | 8        |

<!--original
| Type	 | Bit width|
|--------|----------|
| Double | 64       |
| Float	 | 32       |
| Long	 | 64       |
| Int	 | 32       |
| Short	 | 16       |
| Byte	 | 8        |
-->

Kotlinでは文字は数値でないことに注意してください。

<!--original
Note that characters are not numbers in Kotlin.
-->

### リテラル定数

<!--original
### Literal Constants
-->


整数値のためのリテラル定数は、次の種類があります。

<!--original
There are the following kinds of literal constants for integral values:
-->

* 数値: `123`
  * Long型の数を表すには大文字の`L`でタグ付けする: `123L`
* 16進数: `0x0F`
* 2進数: `0b00001011`

<!--original
* Decimals: `123`
  * Longs are tagged by a capital `L`: `123L`
* Hexadecimals: `0x0F`
* Binaries: `0b00001011`
-->

注：8進数のリテラルはサポートされていません。

<!--original
NOTE: Octal literals are not supported.
-->

Kotlinは浮動小数点数の従来の表記法もサポートしています。

<!--original
Kotlin also supports a conventional notation for floating-point numbers:
-->
 
* デフォルトではdouble型: `123.5`, `123.5e10`
* float型を表すには `f` or `F` でタグ付けする: `123.5f` 

<!--original
* Doubles by default: `123.5`, `123.5e10`
* Floats are tagged by `f` or `F`: `123.5f` 
-->

### 表現

<!--original
### Representation
-->

Javaプラットフォームでは、null許容型な数値の参照（例：`Int?`）やジェネリクスが関与している場合を除いて、JVMプリミティブ型として数値が物理的に格納されています。後者の例では番号がボクシングされています。

<!--original
On the Java platform, numbers are physically stored as JVM primitive types, unless we need a nullable number reference (e.g. `Int?`) or generics are involved. 
In the latter cases numbers are boxed.
-->

数値のボクシングは一様性を保持しないことに注意してください：

<!--original
Note that boxing of numbers does not preserve identity:
-->

``` kotlin
val a: Int = 10000
print(a === a) // 'true'を出力する
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA === anotherBoxedA) // !!! 'false'を出力する !!!
```

<!--original
``` kotlin
val a: Int = 10000
print(a === a) // Prints 'true'
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA === anotherBoxedA) // !!!Prints 'false'!!!
```
-->

一方、これは同一性を保持しています：

<!--original
On the other hand, it preserves equality:
-->

``` kotlin
val a: Int = 10000
print(a == a) // 'true'を出力する
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA == anotherBoxedA) // 'true'を出力する
```

<!--original
``` kotlin
val a: Int = 10000
print(a == a) // Prints 'true'
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA == anotherBoxedA) // Prints 'true'
```
-->

### 明示的な変換

<!--original
### Explicit Conversions
-->

異なる表現であるが故に、小さな型は大きな型のサブタイプではありません。 もし仮にそうであったならば、次の種類の悩みを抱えたでしょう：

<!--original
Due to different representations, smaller types are not subtypes of bigger ones.
If they were, we would have troubles of the following sort:
-->

``` kotlin
// 仮説のコードであり、実際はコンパイルできません：
val a: Int? = 1 // ボクシングされたInt型 (java.lang.Integer)
val b: Long? = a // 暗黙の変換がLong型 (java.lang.Long)へのボクシングを引き起こします
print(a == b) // 仰天！これはLong型のequals()チェックで他の部分がLong型になるのと同等に "false" を出力します
```

<!--original
``` kotlin
// Hypothetical code, does not actually compile:
val a: Int? = 1 // A boxed Int (java.lang.Integer)
val b: Long? = a // implicit conversion yields a boxed Long (java.lang.Long)
print(a == b) // Surprise! This prints "false" as Long's equals() check for other part to be Long as well
```
-->

つまり、同一性だけでなく一様性でさえも全ての場所において静かに失われたのです。

<!--original
So not only identity, but even equality would have been lost silently all over the place.
-->

その結果、小さな型は、暗黙的に大きな型に変換されるのではありません。これは明示的変換無しで`Byte`型の値を`Int`型へ代入することができないことを意味します。


<!--original
As a consequence, smaller types are NOT implicitly converted to bigger types.
This means that we cannot assign a value of type `Byte` to an `Int` variable without an explicit conversion
-->

``` kotlin
val b: Byte = 1 // OK, リテラルは静的にチェックされています
val i: Int = b // ERROR
```

<!--original
``` kotlin
val b: Byte = 1 // OK, literals are checked statically
val i: Int = b // ERROR
```
-->

明示的変換は数字を拡張する際に使用することができます。

<!--original
We can use explicit conversions to widen numbers
-->

``` kotlin
val i: Int = b.toInt() // OK: 明示的に拡張されました
```

<!--original
``` kotlin
val i: Int = b.toInt() // OK: explicitly widened
```
-->

全ての数値型は次の変換をサポートしています：

<!--original
Every number type supports the following conversions:
-->

* `toByte(): Byte`
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`
* `toChar(): Char`

<!--original
* `toByte(): Byte`
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`
* `toChar(): Char`
-->

明示的変換がないことは滅多に目立ちません。なぜならその型は文脈から推測され、算術演算がオーバロードされ適切に変換されるからです。例えば：

<!--original
Absence of implicit conversions is rarely noticeable because the type is inferred from the context, and arithmetical operations are overloaded for appropriate conversions, for example
-->

``` kotlin
val l = 1L + 3 // Long + Int => Long
```

<!--original
``` kotlin
val l = 1L + 3 // Long + Int => Long
```
-->

### 演算

<!--original
### Operations
-->

Kotlinは算術計算の標準セットをサポートしています。それらは適切なクラス（ただしコンパイラは対応する命令の呼び出しを最適化する）のメンバとして宣言されています。[演算子のオーバーロード](operator-overloading.html)を参照してください。

<!--original
Kotlin supports the standard set of arithmetical operations over numbers, which are declared as members of appropriate classes (but the compiler optimizes the calls down to the corresponding instructions).
See [Operator overloading](operator-overloading.html).
-->

ビット演算にはそのような特殊な文字列がありませんが、中置形で呼び出せる名前付き関数があります。例えば：

<!--original
As of bitwise operations, there're no special characters for them, but just named functions that can be called in infix form, for example:
-->

``` kotlin
val x = (1 shl 2) and 0x000FF000
```

<!--original
``` kotlin
val x = (1 shl 2) and 0x000FF000
```
-->

これらはビット単位の操作を行う全リストです（`Int`と`Long`のみ利用可能）：

<!--original
Here is the complete list of bitwise operations (available for `Int` and `Long` only):
-->

* `shl(bits)` – 符号付き左シフト (Javaの `<<`)
* `shr(bits)` – 符号付き右シフト (Javaの `>>`)
* `ushr(bits)` – 符号無し右シフト (Javaの `>>>`)
* `and(bits)` – ビット演算のand
* `or(bits)` – ビット演算のor
* `xor(bits)` – ビット演算のxor
* `inv()` – ビット演算の反転

<!--original
* `shl(bits)` – signed shift left (Java's `<<`)
* `shr(bits)` – signed shift right (Java's `>>`)
* `ushr(bits)` – unsigned shift right (Java's `>>>`)
* `and(bits)` – bitwise and
* `or(bits)` – bitwise or
* `xor(bits)` – bitwise xor
* `inv()` – bitwise inversion
-->

## 文字

<!--original
## Characters
-->

文字は、`Char`型で表されます。数字として直接扱うことはできません。

<!--original
Characters are represented by the type `Char`. They can not be treated directly as numbers
-->

``` kotlin
fun check(c: Char) {
  if (c == 1) { // ERROR: 非互換の型
    // ...
  }
}
```

<!--original
``` kotlin
fun check(c: Char) {
  if (c == 1) { // ERROR: incompatible types
    // ...
  }
}
```
-->

[translation here]
文字リテラルを表現するには、シングルクォートで囲みます： `'1'`
特殊文字はバックスラッシュを使ってエスケープすることができます。
次のエスケープシーケンスがサポートされています：`\t`, `\b`, `\n`, `\r`, `\'`, `\"`, `\\`, `\$`
他の文字をエンコードするには、Unicodeエスケープシーケンスの構文を使用します：`'\uFF00'`


<!--original
Character literals go in single quotes: `'1'`.
Special characters can be escaped using a backslash.
The following escape sequences are supported: `\t`, `\b`, `\n`, `\r`, `\'`, `\"`, `\\` and `\$`.
To encode any other character, use the Unicode escape sequence syntax: `'\uFF00'`.
-->

明示的に文字を`Int`型の数に変換することもできます。

<!--original
We can explicitly convert a character to an `Int` number:
-->

``` kotlin
fun decimalDigitValue(c: Char): Int {
  if (c !in '0'..'9')
    throw IllegalArgumentException("Out of range")
  return c.toInt() - '0'.toInt() // 暗黙的な数値への変換
}
```

<!--original
``` kotlin
fun decimalDigitValue(c: Char): Int {
  if (c !in '0'..'9')
    throw IllegalArgumentException("Out of range")
  return c.toInt() - '0'.toInt() // Explicit conversions to numbers
}
```
-->

数値のように、文字はnull許容参照が必要なときにボクシングされます。同一性ははボクシング操作されると保持されません 。

<!--original
Like numbers, characters are boxed when a nullable reference is needed. Identity is not preserved by the boxing operation.
-->

## 真偽値 (Boolean)

<!--original
## Booleans
-->

[translation here]
`Boolean`型は真偽値を表し、*true*{: .keyword }と*false*{: .keyword }の2つの値があります。

<!--original
The type `Boolean` represents booleans, and has two values: *true*{: .keyword } and *false*{: .keyword }.
-->

Booleanはnull許容参照が必要なときにボクシングされます。

<!--original
Booleans are boxed if a nullable reference is needed.
-->

Booleanのビルトイン演算は次を含みます：

<!--original
Built-in operations on booleans include
-->

* `||` – 遅延評価論理和
* `&&` – 遅延評価論理積
* `!` - 否定

<!--original
* `||` – lazy disjunction
* `&&` – lazy conjunction
* `!` - negation
-->

## 配列

<!--original
## Arrays
-->

Kotlinでの配列は Array クラスで表され、`get`と`set`関数を持ちます（`[]`の演算子をオーバロードすることによって実現している）。また、`size`プロパティがいくつかの有用なメンバ関数と共に有効になっています：

<!--original
Arrays in Kotlin are represented by the `Array` class, that has `get` and `set` functions (that turn into `[]` by operator overloading conventions), and `size` property, along with a few other useful member functions:
-->

``` kotlin
class Array<T> private constructor() {
  val size: Int
  fun get(index: Int): T
  fun set(index: Int, value: T): Unit

  fun iterator(): Iterator<T>
  // ...
}
```

<!--original
``` kotlin
class Array<T> private constructor() {
  val size: Int
  fun get(index: Int): T
  fun set(index: Int, value: T): Unit

  fun iterator(): Iterator<T>
  // ...
}
```
-->

配列を作るには、ライブラリ関数の`arrayOf()`にアイテムの値を渡してください。つまり、`arrayOf(1, 2, 3)`は[1, 2, 3]の配列を作成します。
あるいはライブラリ関数の`arrayOfNulls()`で、null要素で埋められた指定サイズの配列を作ることができます。

<!--original
To create an array, we can use a library function `arrayOf()` and pass the item values to it, so that `arrayOf(1, 2, 3)` creates an array [1, 2, 3].
Alternatively, the `arrayOfNulls()` library function can be used to create an array of a given size filled with null elements.
-->

他のやり方として、配列のサイズと配列のインデックス値を与えると各要素の初期値用に値を返す関数を引数にとるファクトリ関数の使用があります。

<!--original
Another option is to use a factory function that takes the array size and the function that can return the initial value
of each array element given its index:
-->

``` kotlin
// Array<String>を["0", "1", "4", "9", "16"]の値で作成します
val asc = Array(5, { i -> (i * i).toString() })
```

<!--original
``` kotlin
// Creates an Array<String> with values ["0", "1", "4", "9", "16"]
val asc = Array(5, { i -> (i * i).toString() })
```
-->

前述したとおり、`[]`演算はメンバ関数の`get()`と`set()`の呼び出しを表します。

<!--original
As we said above, the `[]` operation stands for calls to member functions `get()` and `set()`.
-->

注：Javaとは異なり、Kotlinの配列は不変です。つまりKotlinでは`Array<Any>`へ`Array<String>`を代入することができないということを表します。これは実行時エラーを回避するためです（しかし、`Array<out Any>`を使えば代入できます。型プロジェクションを参照してください）。

<!--original
Note: unlike Java, arrays in Kotlin are invariant. This means that Kotlin does not let us assign an `Array<String>`
to an `Array<Any>`, which prevents a possible runtime failure (but you can use `Array<out Any>`, 
see [Type Projections](generics.html#type-projections)).
-->

Kotlinはプリミティブ型（`ByteArray`、`ShortArray`、`IntArray`等）の配列について、オーバーヘッド無しでボクシングができる特別なクラスを持ちます。 これらのクラスは`Array`クラスと継承関係を持ちませんが、同じメソッドとプロパティを持ちます。 それぞれのクラスにおいて、対応するファクトリ関数を持ちます：

<!--original
Kotlin also has specialized classes to represent arrays of primitive types without boxing overhead: `ByteArray`,
`ShortArray`, `IntArray` and so on. These classes have no inheritance relation to the `Array` class, but they
have the same set of methods and properties. Each of them also has a corresponding factory function:
-->

``` kotlin
val x: IntArray = intArrayOf(1, 2, 3)
x[0] = x[1] + x[2]
```

<!--original
``` kotlin
val x: IntArray = intArrayOf(1, 2, 3)
x[0] = x[1] + x[2]
```
-->

## 文字列

<!--original
## Strings
-->

文字列は、`String`型で表されます。文字列は不変（イミュータブル）です。
文字列の要素は、インデックスの演算でアクセスできます：`s[i]`
文字列は *for*{: .keyword }ループでイテレート（繰り返し操作）できます：

<!--original
Strings are represented by the type `String`. Strings are immutable.
Elements of a string are characters that can be accessed by the indexing operation: `s[i]`.
A string can be iterated over with a *for*{: .keyword }-loop:
-->

``` kotlin
for (c in str) {
  println(c)
}
```

<!--original
``` kotlin
for (c in str) {
  println(c)
}
```
-->

### 文字列リテラル

<!--original
### String Literals
-->

Kotlinは2つの種類の文字列リテラルを持ちます：1つはエスケープされた文字列を持ちうるエスケープ済み文字列で、もう1つは改行と任意の文字を含む生文字列です。 エスケープ済み文字列はJavaの文字列に非常によく似ています：

<!--original
Kotlin has two types of string literals: escaped strings that may have escaped characters in them and raw strings that can contain newlines and arbitrary text. An escaped string is very much like a Java string:
-->

``` kotlin
val s = "Hello, world!\n"
```

<!--original
``` kotlin
val s = "Hello, world!\n"
```
-->

エスケープは、バックスラッシュを用いて従来の方法で行われます。サポートされているエスケープシーケンスのリストについては、[文字列](#characters)を参照してください。

<!--original
Escaping is done in the conventional way, with a backslash. See [Characters](#characters) above for the list of supported escape sequences.
-->

生文字列は三連クオート (`"""`) で区切られます。エスケープは含まれておらず、改行や他の文字を含めることができます：

<!--original
A raw string is delimited by a triple quote (`"""`), contains no escaping and can contain newlines and any other characters:
-->

``` kotlin
val text = """
  for (c in "foo")
    print(c)
"""
```

<!--original
``` kotlin
val text = """
  for (c in "foo")
    print(c)
"""
```
-->

先頭の空白を[`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html)関数で削除することができます。

<!--original
You can remove leading whitespace with [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) function:
-->

``` kotlin
val text = """
    |Tell me and I forget. 
    |Teach me and I remember. 
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

<!--original
``` kotlin
val text = """
    |Tell me and I forget. 
    |Teach me and I remember. 
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```
-->

デフォルトでは`|`はマージンの接頭辞として使用されますが、`trimMargin(">")`のように、パラメータとして別の文字を渡すとそれを接頭辞として使用することができます。

<!--original
By default `|` is used as margin prefix, but you can choose another character and pass it as a parameter, like `trimMargin(">")`.
-->

### 文字列テンプレート

<!--original
### String Templates
-->

文字列はテンプレート式、すなわち、評価され、その結果が文字列と結合されるコードの断片を含むことができる。テンプレート式は、ドル記号（$）で始まり、簡単な名前で構成されます：

<!--original
Strings may contain template expressions, i.e. pieces of code that are evaluated and whose results are concatenated into the string.
A template expression starts with a dollar sign ($) and consists of either a simple name:
-->

``` kotlin
val i = 10
val s = "i = $i" // "i = 10"と評価される
```

<!--original
``` kotlin
val i = 10
val s = "i = $i" // evaluates to "i = 10"
```
-->

または、波括弧を使った従来の記法もあります：

<!--original
or an arbitrary expression in curly braces:
-->

``` kotlin
val s = "abc"
val str = "$s.length is ${s.length}" // "abc.length is 3"と評価される
```

<!--original
``` kotlin
val s = "abc"
val str = "$s.length is ${s.length}" // evaluates to "abc.length is 3"
```
-->

テンプレートは生文字列、エスケープ済み文字列のどちらに含まれていても動作します。
もし`$`の文字リテラルを生文字列内（バックスラッシュでのエスケープをサポートしない）で表現する必要がある場合は、次の文法を使用できる：

<!--original
Templates are supported both inside raw strings and inside escaped strings.
If you need to represent a literal `$` character in a raw string (which doesn't support backslash escaping), you can use the following syntax:
-->

``` kotlin
val price = """
${'$'}9.99
"""
```

<!--original
``` kotlin
val price = """
${'$'}9.99
"""
```
-->
