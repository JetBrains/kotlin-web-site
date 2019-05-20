---
type: doc
layout: reference
category: "Syntax"
title: "関数"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Functions"
- --
-->

# 関数

<!--original
# Functions
-->

## 関数の宣言

<!--original
## Function Declarations
-->

Kotlinの関数は *fun*{: .keyword } キーワードを使用して宣言されています。

<!--original
Functions in Kotlin are declared using the *fun*{: .keyword } keyword
-->

``` kotlin
fun double(x: Int): Int {
}
```

<!--original
``` kotlin
fun double(x: Int): Int {
}
```
-->

## 関数の使い方

<!--original
## Function Usage
-->

関数の呼び出しは、伝統的なアプローチを採用しています。

<!--original
Calling functions uses the traditional approach
-->

``` kotlin
val result = double(2)
```


<!--original
``` kotlin
val result = double(2)
```

-->

メンバ関数の呼び出しは、ドット表記を使用します。

<!--original
Calling member functions uses the dot notation
-->

``` kotlin
Sample().foo() // Sampleクラスのインスタンスを作ってfooを呼ぶ
```

<!--original
``` kotlin
Sample().foo() // create instance of class Sample and calls foo
```
-->

### 中置記法

<!--original
### Infix notation
-->

次のようなとき、中置表記法 (infix notations) を使用して関数を呼び出すことができます：

<!--original
Functions can also be called using infix notations when
-->

* メンバ関数や[拡張関数](extensions.html)であるとき
* 単一のパラメータを持っているとき
* `infix` キーワードでマークされているとき

<!--original
* They are member functions or [extension functions](extensions.html)
* They have a single parameter
* They are marked with the `infix` keyword
-->

``` kotlin
// Intにエクステンションを定義
infix fun Int.shl(x: Int): Int {
...
}

// 拡張関数を infix ノーテーションを使用して呼ぶ

1 shl 2

// これは次と同じ

1.shl(2)
```

<!--original
``` kotlin
// Define extension to Int
infix fun Int.shl(x: Int): Int {
...
}

// call extension function using infix notation

1 shl 2

// is the same as

1.shl(2)
```
-->

### パラメーター

<!--original
### Parameters
-->

関数のパラメータはパスカル記法、すなわち *名前*: *タイプ* を使用して定義されています。パラメータはカンマを使用して分離されます。各パラメータは、明示的に入力する必要があります。

<!--original
Function parameters are defined using Pascal notation, i.e. *name*: *type*. Parameters are separated using commas. Each parameter must be explicitly typed.
-->

``` kotlin
fun powerOf(number: Int, exponent: Int) {
...
}
```

<!--original
``` kotlin
fun powerOf(number: Int, exponent: Int) {
...
}
```
-->

### デフォルトの引数

<!--original
### Default Arguments
-->

関数パラメータは、対応する引数が省略されているときに使用されるデフォルト値をもつことができます。これにより、他言語に比べてオーバーロード数を減らすことができます。

<!--original
Function parameters can have default values, which are used when a corresponding argument is omitted. This allows for a reduced number of overloads compared to
other languages.
-->

``` kotlin
fun read(b: Array<Byte>, off: Int = 0, len: Int = b.size()) {
...
}
```

<!--original
``` kotlin
fun read(b: Array<Byte>, off: Int = 0, len: Int = b.size()) {
...
}
```
-->

デフォルト値は値と共に記述した後に **=** を使用して定義されます。

<!--original
Default values are defined using the **=** after type along with the value.
-->

オーバーライドメソッドは、常にベースメソッドと同じデフォルトのパラメータ値を使用します。デフォルトのパラメータ値を持つメソッドをオーバーライドする場合は、デフォルトのパラメータ値は、シグネチャから省略されている必要があります。

<!--original
Overriding methods always use the same default parameter values as the base method.
When overriding a method with default parameters values, the default parameter values must be omitted from the signature:
-->

``` kotlin
open class A {
    open fun foo(i: Int = 10) { ... }
}

class B : A() {
    override fun foo(i: Int) { ... }  // デフォルト値は使用できない
}
```

<!--original
``` kotlin
open class A {
    open fun foo(i: Int = 10) { ... }
}

class B : A() {
    override fun foo(i: Int) { ... }  // no default value allowed
}
```
-->

### 名前付き引数

<!--original
### Named Arguments
-->

関数を呼び出すとき、関数のパラメータに名前を付けることができます。これは関数が沢山のパラメータやデフォルトのパラメータを持つ場合に非常に便利です。

<!--original
Function parameters can be named when calling functions. This is very convenient when a function has a high number of parameters or default ones.
-->

次の関数を考えます：

<!--original
Given the following function
-->

``` kotlin
fun reformat(str: String,
             normalizeCase: Boolean = true,
             upperCaseFirstLetter: Boolean = true,
             divideByCamelHumps: Boolean = false,
             wordSeparator: Char = ' ') {
...
}
```

<!--original
``` kotlin
fun reformat(str: String,
             normalizeCase: Boolean = true,
             upperCaseFirstLetter: Boolean = true,
             divideByCamelHumps: Boolean = false,
             wordSeparator: Char = ' ') {
...
}
```
-->

私たちは、デフォルト引数を使用して、これを呼び出すことができます：

<!--original
we could call this using default arguments
-->

``` kotlin
reformat(str)
```

<!--original
``` kotlin
reformat(str)
```
-->

しかし、デフォルト値が無い場合はそれの呼び出しは次のようになります：

<!--original
However, when calling it with non-default, the call would look something like
-->

``` kotlin
reformat(str, true, true, false, '_')
```

<!--original
``` kotlin
reformat(str, true, true, false, '_')
```
-->

名前付き引数で、コードをはるかに読みやすくすることができます：

<!--original
With named arguments we can make the code much more readable
-->

``` kotlin
reformat(str,
    normalizeCase = true,
    upperCaseFirstLetter = true,
    divideByCamelHumps = false,
    wordSeparator = '_'
  )
```

<!--original
``` kotlin
reformat(str,
    normalizeCase = true,
    upperCaseFirstLetter = true,
    divideByCamelHumps = false,
    wordSeparator = '_'
  )
```
-->

すべての引数を必要としない場合：

<!--original
and if we do not need all arguments
-->

``` kotlin
reformat(str, wordSeparator = '_')
```

<!--original
``` kotlin
reformat(str, wordSeparator = '_')
```
-->

Javaバイトコードは常に関数パラメータの名を保存しないため、Java関数を呼び出すときに名前付き引数構文を使用できないことに注意してください。

<!--original
Note that the named argument syntax cannot be used when calling Java functions, because Java bytecode does not
always preserve names of function parameters.

-->

### Unit を返す関数

<!--original
### Unit-returning functions
-->

関数が任意の有用な値を返さない場合、その戻り値の型は `Unit` です。 `Unit` は、唯一の値 ( `Unit` ) だけを持つ型です。
この値は、明示的に return されなくてもかまいません：

<!--original
If a function does not return any useful value, its return type is `Unit`. `Unit` is a type with only one value - `Unit`. This
value does not have to be returned explicitly
-->

``` kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello ${name}")
    else
        println("Hi there!")
    // `return Unit` または `return` は必須ではない
}
```

<!--original
``` kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello ${name}")
    else
        println("Hi there!")
    // `return Unit` or `return` is optional
}
```
-->

`Unit` の戻り型の宣言も任意です。上記のコードは次と等価です：

<!--original
The `Unit` return type declaration is also optional. The above code is equivalent to
-->

``` kotlin
fun printHello(name: String?) {
    ...
}
```

<!--original
``` kotlin
fun printHello(name: String?) {
    ...
}
```
-->

### 単一式関数

<!--original
### Single-Expression functions
-->

関数は、単一の式を返すと中括弧を省略することができ、本体は **=** 記号の後に指定されています：

<!--original
When a function returns a single expression, the curly braces can be omitted and the body is specified after a **=** symbol
-->

``` kotlin
fun double(x: Int): Int = x * 2
```

<!--original
``` kotlin
fun double(x: Int): Int = x * 2
```
-->

コンパイラによって戻り値の型を推論することができる時には、明示的な戻り値の型の宣言は任意です：

<!--original
Explicitly declaring the return type is [optional](#explicit-return-types) when this can be inferred by the compiler
-->

``` kotlin
fun double(x: Int) = x * 2
```

<!--original
``` kotlin
fun double(x: Int) = x * 2
```
-->

### 明示的な戻り値の型

<!--original
### Explicit return types
-->

`Unit` を返すことを意図していない限り、ブロック本体を持つ関数は、それが任意である場合には、常に明示的に戻り値の型を指定しなければなりません。Kotlinはブロック本体と関数の戻り値の型を推論することはありません。なぜならこのような機能は本体内に複雑な制御フローをもつことがあり、戻り値の型が読み手（時にはコンパイラ）に自明ではないからです。

<!--original
Functions with block body must always specify return types explicitly, unless it's intended for them to return `Unit`, [in which case it is optional](#unit-returning-functions).
Kotlin does not infer return types for functions with block bodies because such functions may have complex control flow in the body, and the return
type will be non-obvious to the reader (and sometimes even for the compiler). 

-->

### 可変長引数（可変引数, Varargs）

<!--original
### Variable number of arguments (Varargs)
-->

関数（通常は最後のひとつ）のパラメータは、 `vararg` 修飾子でマークされることがあります：

<!--original
A parameter of a function (normally the last one) may be marked with `vararg` modifier:
-->

``` kotlin
fun <T> asList(vararg ts: T): List<T> {
  val result = ArrayList<T>()
  for (t in ts) // ts は配列
    result.add(t)
  return result
}
```

<!--original
``` kotlin
fun <T> asList(vararg ts: T): List<T> {
  val result = ArrayList<T>()
  for (t in ts) // ts is an Array
    result.add(t)
  return result
}
```
-->

関数に渡される引数を可変数にすることができます：

<!--original
allowing a variable number of arguments to be passed to the function:
-->

```kotlin
  val list = asList(1, 2, 3)
```

<!--original
```kotlin
  val list = asList(1, 2, 3)
```
-->

関数の中では、 `T` 型の `vararg` をつけたパラメータは `T` の配列として見えます。すなわち、前述例での `ts` 変数は `Array<out T>` 型を持ちます。

<!--original
Inside a function a `vararg`-parameter of type `T` is visible as an array of `T`, i.e. the `ts` variable in the example above has type `Array<out T>`.
-->

唯一のパラメータが `vararg` としてマークされることがあります。 `vararg` パラメータが変数リストの最後のひとつでない場合には、名前付き引数の構文を使用して、またはパラメータが関数型をもっている場合、括弧の外でラムダを渡すことによって、リストにおける次のパラメータの値を渡すことができます。 

<!--original
Only one parameter may be marked as `vararg`. If a `vararg` parameter is not the last one in the list, values for the
following parameters can be passed using the named argument syntax, or, if the parameter has a function type, by passing
a lambda outside parentheses.
-->

`vararg` をもつ関数を呼び出すとき、例えば `asList(1, 2, 3)` のように、一つずつ引数を渡すことができます。または、すでに配列を持っており、関数にその内容を渡したい場合は、（ * を配列名の接頭辞にする） **spread** 演算子を使用します：

<!--original
When we call a `vararg`-function, we can pass arguments one-by-one, e.g. `asList(1, 2, 3)`, or, if we already have an array
 and want to pass its contents to the function, we use the **spread** operator (prefix the array with `*`):
-->

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

<!--original
```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```
-->

## 関数のスコープ

<!--original
## Function Scope
-->

Kotlinでは、関数はファイルのトップレベルで宣言することができます。これは、関数を保持するためのクラスを作成する必要がないことを意味します。JavaやC#, Scalaなどの言語と同じように。トップレベルの関数に加えて、Kotlinの関数はメンバ関数や拡張機能として、ローカルに宣言することもできます。

<!--original
In Kotlin functions can be declared at top level in a file, meaning you do not need to create a class to hold a function, like languages such as Java, C# or Scala. In addition
to top level functions, Kotlin functions can also be declared local, as member functions and extension functions.
-->

### ローカル関数

<!--original
### Local Functions
-->

Kotlinはローカル関数、すなわち、ある関数内の別の関数をサポートしています。

<!--original
Kotlin supports local functions, i.e. a function inside another function
-->

``` kotlin
fun dfs(graph: Graph) {
  fun dfs(current: Vertex, visited: Set<Vertex>) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v, visited)
  }

  dfs(graph.vertices[0], HashSet())
}
```

<!--original
``` kotlin
fun dfs(graph: Graph) {
  fun dfs(current: Vertex, visited: Set<Vertex>) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v, visited)
  }

  dfs(graph.vertices[0], HashSet())
}
```
-->

ローカル関数は、外側の関数（すなわちクロージャ）のローカル変数にアクセスすることができます。これにより、上記の場合には、 visited をローカル変数にすることができます。

<!--original
Local function can access local variables of outer functions (i.e. the closure), so in the case above, the *visited* can be a local variable
-->

``` kotlin
fun dfs(graph: Graph) {
  val visited = HashSet<Vertex>()
  fun dfs(current: Vertex) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v)
  }

  dfs(graph.vertices[0])
}
```

<!--original
``` kotlin
fun dfs(graph: Graph) {
  val visited = HashSet<Vertex>()
  fun dfs(current: Vertex) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v)
  }

  dfs(graph.vertices[0])
}
```
-->

### メンバ関数

<!--original
### Member Functions
-->

メンバ関数は、クラスやオブジェクトの内部で定義される関数です。

<!--original
A member function is a function that is defined inside a class or object
-->

``` kotlin
class Sample() {
  fun foo() { print("Foo") }
}
```

<!--original
``` kotlin
class Sample() {
  fun foo() { print("Foo") }
}
```
-->

メンバ関数は、ドット表記によって呼ばれます。

<!--original
Member functions are called with dot notation
-->

``` kotlin
Sample().foo() // Sampleクラスのインスタンスを作り、 foo を呼ぶ
```

<!--original
``` kotlin
Sample().foo() // creates instance of class Sample and calls foo
```
-->

クラスおよびオーバーライドするメンバの詳細については クラスと継承 を参照してください。

<!--original
For more information on classes and overriding members see [Classes](classes.html) and [Inheritance](classes.html#inheritance)
-->

## ジェネリック関数

<!--original
## Generic Functions
-->

関数は、関数名の前に山括弧（訳注：＜＞のことです）を使用して、ジェネリックパラメータを持つことができます。

<!--original
Functions can have generic parameters which are specified using angle brackets before the function name
-->

``` kotlin
fun <T> singletonList(item: T): List<T> {
  // ...
}
```

<!--original
``` kotlin
fun <T> singletonList(item: T): List<T> {
  // ...
}
```
-->

ジェネリック関数の詳細については、[ジェネリクス](generics.html) を参照してください。

<!--original
For more information on generic functions see [Generics](generics.html)
-->

## インライン関数

<!--original
## Inline Functions
-->

インライン関数は、 [ここ](inline-functions.html) で説明されています。

<!--original
Inline functions are explained [here](inline-functions.html)
-->

## 拡張関数

<!--original
## Extension Functions
-->

拡張機能は、 [拡張関数](extensions.html) で説明されています。

<!--original
Extension functions are explained in [their own section](extensions.html)
-->

## 高階関数とラムダ

<!--original
## Higher-Order Functions and Lambdas
-->

高階関数とラムダは、 [高階関数とラムダ](lambdas.html) で説明されています。

<!--original
Higher-Order functions and Lambdas are explained in [their own section](lambdas.html)
-->

## 末尾再帰関数

<!--original
## Tail recursive functions
-->

Kotlinは[末尾再帰](https://en.wikipedia.org/wiki/Tail_call)として知られている関数型プログラミングのスタイルをサポートしています。これは通常ループを使用して書かれるいくつかのアルゴリズムを代わりに再帰で、しかし、普通の再帰と違ってスタックオーバーフローのリスクがないように書くことです。ある関数が `tailrec` 修飾子でマークされ、必要な形式を満たしている場合、コンパイラは高速かつ効率的なループベースのバージョンを残して、再帰を最適化します。

<!--original
Kotlin supports a style of functional programming known as [tail recursion](https://en.wikipedia.org/wiki/Tail_call).
This allows some algorithms that would normally be written using loops to instead be written using a recursive function, but without the risk of stack overflow.
When a function is marked with the `tailrec` modifier and meets the required form the compiler optimises out the recursion, leaving behind a fast and efficient loop based version instead.
-->

``` kotlin
tailrec fun findFixPoint(x: Double = 1.0): Double
        = if (x == Math.cos(x)) x else findFixPoint(Math.cos(x))
```

<!--original
``` kotlin
tailrec fun findFixPoint(x: Double = 1.0): Double
        = if (x == Math.cos(x)) x else findFixPoint(Math.cos(x))
```
-->

このコードは、数学定数であるコサインの不動点（固定点, fixpoint）を算出します。それは Math.cos を 1.0 から始めて結果に0.7390851332151607の結果を得、それ以上変化しなくなるまで単に繰り返し呼び出します。その結果生成されたコードは、このより伝統的なスタイルに相当します。

<!--original
This code calculates the fixpoint of cosine, which is a mathematical constant. It simply calls Math.cos repeatedly starting at 1.0 until the result doesn't change any more, yielding a result of 0.7390851332151607. The resulting code is equivalent to this more traditional style:
-->

``` kotlin
private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (x == y) return y
        x = y
    }
}
```

<!--original
``` kotlin
private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (x == y) return y
        x = y
    }
}
```
-->

`tailrec` 修飾子の対象となるためには、関数は実行する最後の操作として自身を呼び出す必要があります。再帰呼び出しの後に多くのコードがあるときは、末尾再帰を使用することはできません。 try / catch / finally ブロック内で使用することもできません。現在、末尾再帰はJVMのバックエンドでのみサポートされています。

<!--original
To be eligible for the `tailrec` modifier, a function must call itself as the last operation it performs. You cannot use tail recursion when there is more code after the recursive call, and you cannot use it within try/catch/finally blocks. Currently tail recursion is only supported in the JVM backend.

-->
