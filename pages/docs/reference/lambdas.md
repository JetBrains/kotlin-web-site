---
type: doc
layout: reference
category: "Syntax"
title: "高階関数とラムダ"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Higher-Order Functions and Lambdas"
- --
-->

# 高階関数とラムダ

<!--original
# Higher-Order Functions and Lambdas
-->

## 高階関数

<!--original
## Higher-Order Functions
-->

高階関数はパラメータとして関数を取るか、関数を返す関数です。このような機能の良い例が `lock()` のような関数です。これは lock オブジェクトと関数を受け取り、 lock をかけ、関数を実行して lock を解放します。

<!--original
A higher-order function is a function that takes functions as parameters, or returns a function.
A good example of such a function is `lock()` that takes a lock object and a function, acquires the lock, runs the function and releases the lock:
-->

``` kotlin
fun <T> lock(lock: Lock, body: () -> T): T {
  lock.lock()
  try {
    return body()
  }
  finally {
    lock.unlock()
  }
}
```

<!--original
``` kotlin
fun <T> lock(lock: Lock, body: () -> T): T {
  lock.lock()
  try {
    return body()
  }
  finally {
    lock.unlock()
  }
}
```
-->

それでは、上記のコードを見てみましょう。 `body` は[関数型](#function-types): `() -> T` を持ちます。つまり、パラメータを取らず、型 `T` の値を返す関数と考えられます。 `body` は `lock` によって保護されながら、 *try*{: .keyword } ブロック内で呼び出され、その結果は `lock()` 関数によって返されます。

<!--original
Let's examine the code above: `body` has a [function type](#function-types): `() -> T`,
so it's supposed to be a function that takes no parameters and returns a value of type `T`.
It is invoked inside the *try*{: .keyword }-block, while protected by the `lock`, and its result is returned by the `lock()` function.
-->

`lock()` を呼び出したい場合は、引数として別の関数を渡すことができます（[関数の参照](reflection.html#function-references)を参照してください）：

<!--original
If we want to call `lock()`, we can pass another function to it as an argument (see [function references](reflection.html#function-references)):
-->

``` kotlin
fun toBeSynchronized() = sharedResource.operation()

val result = lock(lock, ::toBeSynchronized)
```

<!--original
``` kotlin
fun toBeSynchronized() = sharedResource.operation()

val result = lock(lock, ::toBeSynchronized)
```
-->

別手段として、多くの場合、より便利な方法は[ラムダ式](#lambda-expressions-and-anonymous-functions)を渡すことです：

<!--original
Another, often more convenient way is to pass a [lambda expression](#lambda-expressions-and-anonymous-functions):
-->

``` kotlin
val result = lock(lock, { sharedResource.operation() })
```

<!--original
``` kotlin
val result = lock(lock, { sharedResource.operation() })
```
-->

ラムダ式は[以下でより詳細に](#lambda-expressions-and-anonymous-functions)説明しますが、このセクションを継続したいので、今は簡単な概要を見てみましょう：

<!--original
Lambda expressions are described in more [detail below](#lambda-expressions-and-anonymous-functions), but for purposes of continuing this section, let's see a brief overview:
-->

* ラムダ式は、常に中括弧で囲まれています
* そのパラメータは、（もしあれば） `->` の前で宣言されます（パラメータの型を省略してもかまいません）
* 本体が `->` に続きます（存在する場合）

<!--original
* A lambda expression is always surrounded by curly braces,
* Its parameters (if any) are declared before `->` (parameter types may be omitted),
* The body goes after `->` (when present).
-->

Kotlinでは、関数の最後のパラメータが関数である場合、そのパラメータは括弧の外に指定することができるという慣習があります：

<!--original
In Kotlin, there is a convention that if the last parameter to a function is a function, that parameter can be specified outside of the parentheses:
-->

``` kotlin
lock (lock) {
  sharedResource.operation()
}
```

<!--original
``` kotlin
lock (lock) {
  sharedResource.operation()
}
```
-->

別の例で高階関数が `map()` になっています：

<!--original
Another example of a higher-order function would be `map()`:
-->

``` kotlin
fun <T, R> List<T>.map(transform: (T) -> R): List<R> {
  val result = arrayListOf<R>()
  for (item in this)
    result.add(transform(item))
  return result
}
```

<!--original
``` kotlin
fun <T, R> List<T>.map(transform: (T) -> R): List<R> {
  val result = arrayListOf<R>()
  for (item in this)
    result.add(transform(item))
  return result
}
```
-->

この関数を次のように呼び出すことができます。

<!--original
This function can be called as follows:
-->

``` kotlin
val doubled = ints.map { it -> it * 2 }
```

<!--original
``` kotlin
val doubled = ints.map { it -> it * 2 }
```
-->

ラムダがその呼び出しに唯一の引数である場合、呼び出しの括弧を完全に省略することができることに注意してください。

<!--original
Note that the parentheses in a call can be omitted entirely if the lambda is the only argument to that call.
-->

### `it` : 単一パラメータの暗黙の名前

<!--original
### `it`: implicit name of a single parameter
-->

もう一つの有用な慣習は、関数リテラルがパラメータを1つだけ持つ場合、その宣言を（ `->` と一緒に）省略してもよいということです。その場合、その名前は、 it になります。

<!--original
One other helpful convention is that if a function literal has only one parameter,
its declaration may be omitted (along with the `->`), and its name will be `it`:
-->

``` kotlin
ints.map { it * 2 }
```

<!--original
``` kotlin
ints.map { it * 2 }
```
-->

これらの慣習により、 [LINQスタイル](http://msdn.microsoft.com/en-us/library/bb308959.aspx) のコードを書くことができます：

<!--original
These conventions allow to write [LINQ-style](http://msdn.microsoft.com/en-us/library/bb308959.aspx) code:
-->

``` kotlin
strings.filter { it.length == 5 }.sortBy { it }.map { it.toUpperCase() }
```

<!--original
``` kotlin
strings.filter { it.length == 5 }.sortBy { it }.map { it.toUpperCase() }
```
-->

## インライン関数

<!--original
## Inline Functions
-->

場合によっては、[インライン関数](inline-functions.html)の使用は高階関数のパフォーマンスの向上に有効です。

<!--original
Sometimes it is beneficial to enhance performance of higher-order functions using [inline functions](inline-functions.html).
-->

## ラムダ式と無名関数

<!--original
## Lambda Expressions and Anonymous Functions
-->

ラムダ式や無名関数は「関数リテラル」です。すなわち、その関数は宣言されたのではなく、表現としてすぐに渡されたということです。次の例を考えてみます：

<!--original
A lambda expression or an anonymous function is a "function literal", i.e. a function that is not declared,
but passed immediately as an expression. Consider the following example:
-->

``` kotlin
max(strings, { a, b -> a.length < b.length })
```

<!--original
``` kotlin
max(strings, { a, b -> a.length < b.length })
```
-->

関数 `max` は高階関数です。すなわち2番目の引数として関数値をとります。この2番目の引数はそれ自体が関数である式、すなわち関数リテラルです。関数としては、次と等価です：

<!--original
Function `max` is a higher-order function, i.e. it takes a function value as the second argument.
This second argument is an expression that is itself a function, i.e. a function literal. As a function, it is equivalent to
-->

``` kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

<!--original
``` kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```
-->

### 関数型

<!--original
### Function Types
-->

関数がパラメータとして別の関数を受け入れられるようにするために、そのパラメータの関数型を指定する必要があります。たとえば、次のように前述の関数 `max` が定義されているとします：

<!--original
For a function to accept another function as a parameter, we have to specify a function type for that parameter.
For example the abovementioned function `max` is defined as follows:
-->

``` kotlin
fun <T> max(collection: Collection<T>, less: (T, T) -> Boolean): T? {
  var max: T? = null
  for (it in collection)
    if (max == null || less(max, it))
      max = it
  return max
}
```

<!--original
``` kotlin
fun <T> max(collection: Collection<T>, less: (T, T) -> Boolean): T? {
  var max: T? = null
  for (it in collection)
    if (max == null || less(max, it))
      max = it
  return max
}
```
-->

パラメータ `less` は `(T, T) -> Boolean` 型、すなわち2つの `T` 型のパラメータをとり、前者が後者より小さければ `Boolean` : true を返す関数です。

<!--original
The parameter `less` is of type `(T, T) -> Boolean`, i.e. a function that takes two parameters of type `T` and returns a `Boolean`:
true if the first one is smaller than the second one.
-->

本体の4行目では、 `less` は関数として使用されています。つまり、型 `T` の2つの引数を渡すことによってその関数は呼び出されました。

<!--original
In the body, line 4, `less` is used as a function: it is called by passing two arguments of type `T`.
-->

関数型は前述の通り、または各パラメータの意味をドキュメント化する場合は、名前付きパラメータを使用することがあります。

<!--original
A function type is written as above, or may have named parameters, if you want to document the meaning of each parameter.
-->

``` kotlin
val compare: (x: T, y: T) -> Int = ...
```

<!--original
``` kotlin
val compare: (x: T, y: T) -> Int = ...
```
-->

### ラムダ式の構文

<!--original
### Lambda Expression Syntax
-->

ラムダ式、つまり関数型リテラルの完全な構文形式は、次のとおりです。

<!--original
The full syntactic form of lambda expressions, i.e. literals of function types, is as follows:
-->

``` kotlin
val sum = { x: Int, y: Int -> x + y }
```

<!--original
``` kotlin
val sum = { x: Int, y: Int -> x + y }
```
-->

ラムダ式は常に中括弧で囲まれ、完全な構文形式のパラメータ宣言はカッコ内にあり、型注釈を持つことができ、本体は `->` 記号の後に置かれます。必須ではない注釈をすべて省略した場合、残っているものは次のようになります：

<!--original
A lambda expression is always surrounded by curly braces,
parameter declarations in the full syntactic form go inside parentheses and have optional type annotations,
the body goes after an `->` sign.
If we leave all the optional annotations out, what's left looks like this:
-->

``` kotlin
val sum: (Int, Int) -> Int = { x, y -> x + y }
```

<!--original
``` kotlin
val sum: (Int, Int) -> Int = { x, y -> x + y }
```
-->

ラムダ式がパラメータを1つだけ持っていることはよくあることです。もしKotlinが署名自体を理解することができれば、唯一のパラメータ宣言を省略することができ、暗黙のうちにそれを `it` という名で宣言します。

<!--original
It's very common that a lambda expression has only one parameter.
If Kotlin can figure the signature out itself, it allows us not to declare the only parameter, and will implicitly
declare it for us under the name `it`:
-->

``` kotlin
ints.filter { it > 0 } // このリテラルは '(it: Int) -> Boolean' 型
```

<!--original
``` kotlin
ints.filter { it > 0 } // this literal is of type '(it: Int) -> Boolean'
```
-->

関数が最後のパラメータとして別の関数を取る場合は、ラムダ式の引数は括弧で囲まれた引数リストの外に渡すことができることに注意してください。[callSuffix](grammar.html#call-suffix)のための文法を参照してください。

<!--original
Note that if a function takes another function as the last parameter, the lambda expression argument can be passed
outside the parenthesized argument list.
See the grammar for [callSuffix](grammar.html#call-suffix).
-->

### 無名関数

<!--original
### Anonymous Functions
-->

上記のラムダ式の構文から一つ欠落しているのは、関数の戻り値の型を指定する機能です。ほとんどの場合は、戻り型を自動的に推論することができるので不要です。しかし、それを明示的に指定する必要がある場合、別の構文を使用することができます。_無名関数_です。

<!--original
One thing missing from the lambda expression syntax presented above is the ability to specify the return type of the
function. In most cases, this is unnecessary because the return type can be inferred automatically. However, if you
do need to specify it explicitly, you can use an alternative syntax: an _anonymous function_.
-->

``` kotlin
fun(x: Int, y: Int): Int = x + y
```

<!--original
``` kotlin
fun(x: Int, y: Int): Int = x + y
```
-->

無名関数は、その名が省略されていることを除いて、通常の関数の宣言と非常のよく似ています。その本体は、式（上記のように）、またはブロックのいずれかになります：

<!--original
An anonymous function looks very much like a regular function declaration, except that its name is omitted. Its body
can be either an expression (as shown above) or a block:
-->

``` kotlin
fun(x: Int, y: Int): Int {
  return x + y
}
```

<!--original
``` kotlin
fun(x: Int, y: Int): Int {
  return x + y
}
```
-->

パラメータおよび戻り型は、それらが文脈から推測することができ、パラメータの種類を省略することができる場合を除き、通常の関数と同じ方法で指定されます。

<!--original
The parameters and the return type are specified in the same way as for regular functions, except that the parameter
types can be omitted if they can be inferred from context:
-->

``` kotlin
ints.filter(fun(item) = item > 0)
```

<!--original
``` kotlin
ints.filter(fun(item) = item > 0)
```
-->

無名関数の戻り値の型推論は普通の関数のように動作します：戻り値の型は式本体と無名関数のために自動的に推論され、ブロック本体で無名関数のために明示的に指定され（または `Unit` とされ）ます。

<!--original
The return type inference for anonymous functions works just like for normal functions: the return type is inferred
automatically for anonymous functions with an expression body and has to be specified explicitly (or is assumed to be
`Unit`) for anonymous functions with a block body.
-->

無名関数のパラメータは、常にかっこ内に渡されることに注意してください。括弧の外の関数を残すことができるように、速記構文はラムダ式に対してのみ機能します。

<!--original
Note that anonymous function parameters are always passed inside the parentheses. The shorthand syntax allowing
to leave the function outside the parentheses works only for lambda expressions.
-->

ラムダ式と無名関数の間のもう一つの違いは、[非局所的なリターン](inline-functions.html#non-local-returns)の動作です。ラベルなしの *return*{: .keyword } 文は、常に *fun*{: .keyword } キーワードで宣言された関数から返されます。これは、ラムダ式の内側からの *return*{: .keyword } は囲んでいる関数から返される一方で、無名関数の内部 *return*{: .keyword } は無名関数自体から返されることを意味します。

<!--original
One other difference between lambda expressions and anonymous functions is the behavior of
[non-local returns](inline-functions.html#non-local-returns). A *return*{: .keyword }  statement without a label
always returns from the function declared with the *fun*{: .keyword } keyword. This means that a *return*{: .keyword }
inside a lambda expression will return from the enclosing function, whereas a *return*{: .keyword } inside
an anonymous function will return from the anonymous function itself.
-->

### クロージャ

<!--original
### Closures
-->

ラムダ式や無名関数（ならびに[ローカル関数](functions.html#local-functions)や[オブジェクト式](object-declarations.html#object-expressions)）は、その _クロージャ_ 、すなわち、外側のスコープで宣言された変数にアクセスすることができます。Javaとは異なり、クロージャに取り込まれた変数を変更することができます。

<!--original
A lambda expression or anonymous function (as well as a [local function](functions.html#local-functions) and an [object expression](object-declarations.html#object-expressions))
can access its _closure_, i.e. the variables declared in the outer scope. Unlike Java, the variables captured in the closure can be modified:
-->

``` kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
  sum += it
}
print(sum)
```


<!--original
``` kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
  sum += it
}
print(sum)
```

-->

### レシーバ付き関数リテラル

<!--original
### Function Literals with Receiver
-->

Kotlinは、指定された _レシーバ・オブジェクト_ と関数リテラルを呼び出す機能を提供します。リテラル関数の本体内では、任意の追加の修飾子なしでそのレシーバオブジェクトのメソッドを呼び出すことができます。これは、関数の本体内にあるレシーバオブジェクトのメンバにアクセスすることを可能にする拡張機能に似ています。それらの使用法の最も重要な例の一つは、[型安全のGroovyスタイルのビルダー](type-safe-builders.html)です。

<!--original
Kotlin provides the ability to call a function literal with a specified _receiver object_.
Inside the body of the function literal, you can call methods on that receiver object without any additional qualifiers.
This is similar to extension functions, which allow you to access members of the receiver object inside the body of the function.
One of the most important examples of their usage is [Type-safe Groovy-style builders](type-safe-builders.html).
-->

このような関数リテラルの型は、レシーバを持つ関数型です：

<!--original
The type of such a function literal is a function type with receiver:
-->

``` kotlin
sum : Int.(other: Int) -> Int
```

<!--original
``` kotlin
sum : Int.(other: Int) -> Int
```
-->

それはレシーバオブジェクトのメソッドであるかのように関数リテラルを呼び出すことができます。

<!--original
The function literal can be called as if it were a method on the receiver object:
-->

``` kotlin
1.sum(2)
```

<!--original
``` kotlin
1.sum(2)
```
-->

無名関数の構文は、直接関数リテラルのレシーバの種類を指定することができます。レシーバを持つ関数型の変数を宣言し、後でそれを使用する必要がある場合に役立ちます。

<!--original
The anonymous function syntax allows you to specify the receiver type of a function literal directly.
This can be useful if you need to declare a variable of a function type with receiver, and to use it later.
-->

``` kotlin
val sum = fun Int.(other: Int): Int = this + other
```

<!--original
``` kotlin
val sum = fun Int.(other: Int): Int = this + other
```
-->

レシーバ型は文脈から推測することができる場合、ラムダ式は、レシーバ関数リテラルとして使用することができます。

<!--original
Lambda expressions can be used as function literals with receiver when the receiver type can be inferred from context.
-->

``` kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
  val html = HTML()  // レシーバオブジェクトを生成
  html.init()        // そのレシーバオブジェクトをラムダに渡す
  return html
}


html {       // レシーバ付きラムダがここから始まる
    body()   // レシーバオブジェクトのメソッドを呼んでいる
}
```

<!--original
``` kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
  val html = HTML()  // create the receiver object
  html.init()        // pass the receiver object to the lambda
  return html
}


html {       // lambda with receiver begins here
    body()   // calling a method on the receiver object
}
```
-->