---
type: doc
layout: reference
category: "Syntax"
title: "インライン関数"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Inline Functions"
- --
-->

# インライン関数

<!--original
# Inline Functions
-->

[高階関数](lambdas.html)を使用すると、特定のランタイムペナルティを課せられます。各関数はオブジェクトであり、それはクロージャ、すなわち、関数の本体でアクセスされるそれらの変数をキャプチャします。メモリ割り当て（関数オブジェクトとクラス用の両方）と仮想呼び出しは、実行時のオーバーヘッドを招きます。

<!--original
Using [higher-order functions](lambdas.html) imposes certain runtime penalties: each function is an object, and it captures a closure,
i.e. those variables that are accessed in the body of the function.
Memory allocations (both for function objects and classes) and virtual calls introduce runtime overhead.
-->

しかし、多くの場合、オーバーヘッドはこの種のラムダ式をインライン化することによって解消することができると思われます。以下に示す関数は、このような状況の良い例です。すなわち、`lock()` 関数は、簡単に呼び出し箇所でインライン化することができました。次のケースを考えてみます。

<!--original
But it appears that in many cases this kind of overhead can be eliminated by inlining the lambda expressions.
The functions shown above are good examples of this situation. I.e., the `lock()` function could be easily inlined at call-sites.
Consider the following case:
-->

``` kotlin
lock(l) { foo() }
```

<!--original
``` kotlin
lock(l) { foo() }
```
-->

パラメータやコールの生成のために関数オブジェクトを作成する代わりに、コンパイラは次のコードを放出する可能性があります：

<!--original
Instead of creating a function object for the parameter and generating a call, the compiler could emit the following code
-->

``` kotlin
l.lock()
try {
  foo()
}
finally {
  l.unlock()
}
```

<!--original
``` kotlin
l.lock()
try {
  foo()
}
finally {
  l.unlock()
}
```
-->

それは我々が当初から欲しかったものではないですか？

<!--original
Isn't it what we wanted from the very beginning?
-->

コンパイラがこれをできるようにするために、 `inline` 修飾子で `lock()` 関数をマークする必要があります：

<!--original
To make the compiler do this, we need to mark the `lock()` function with the `inline` modifier:
-->

``` kotlin
inline fun lock<T>(lock: Lock, body: () -> T): T {
  // ...
}
```

<!--original
``` kotlin
inline fun lock<T>(lock: Lock, body: () -> T): T {
  // ...
}
```
-->

`inline` 修飾子は、関数自体や関数の引数に渡されたラムダの両方を呼び出し箇所の中でインライン化させるはたらきをもちます。

<!--original
The `inline` modifier affects both the function itself and the lambdas passed to it: all of those will be inlined
into the call site.
-->

インライン化では生成されるコードが大きくなる可能性がありますが、合理的な方法で（大きな関数をインライン化しないで）実行すると、特にループ内の 「メガモーフィック (megamorphic)」な呼び出し箇所でパフォーマンスが向上します。

<!--original
Inlining may cause the generated code to grow, but if we do it in a reasonable way (do not inline big functions)
it will pay off in performance, especially at "megamorphic" call-sites inside loops.
-->

## noinline

<!--original
## noinline
-->

インライン関数に渡されたラムダのうち、インライン化したくないものがある場合は、 `noinline` 修飾子を付けることができます：

<!--original
In case you want only some of the lambdas passed to an inline function to be inlined, you can mark some of your function
parameters with the `noinline` modifier:
-->

``` kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) {
  // ...
}
```

<!--original
``` kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) {
  // ...
}
```
-->

インライン化されたラムダは、インライン関数内でのみ呼び出すことができます。または、インライン展開可能な引数として渡すこともできますが、 `noinline` は、好きなように操作できます。例えば、フィールドに保持したり、誰かに渡したり等。

<!--original
Inlinable lambdas can only be called inside the inline functions or passed as inlinable arguments,
but `noinline` ones can be manipulated in any way we like: stored in fields, passed around etc.
-->

インライン関数にインライン化できる関数の引数がなく、[具体化型パラメータ](#reified-type-parameters)が指定されていない場合、コンパイラは警告を発します。このような関数のインライン展開は有益ではないためです（インライン展開が必要な場合は警告を抑制できます）。

<!--original
Note that if an inline function has no inlinable function parameters and no
[reified type parameters](#reified-type-parameters), the compiler will issue a warning, since inlining such functions is
 very unlikely to be beneficial (you can suppress the warning if you are sure the inlining is needed).
-->

## 非局所リターン

<!--original
## Non-local returns
-->

Kotlinでは、名前付き関数または無名関数から抜けるためには、通常、ラベル無し `return` のみが使用できます。これは、ラムダを終了するには[ラベル](returns.html#return-at-labels)を使用しなければならず、ラムダが自身を内包する関数からの `return` を作ることができないため、ラムダ内での裸のリターンは禁止されていることを意味します。

<!--original
In Kotlin, we can only use a normal, unqualified `return` to exit a named function or an anonymous function.
This means that to exit a lambda, we have to use a [label](returns.html#return-at-labels), and a bare `return` is forbidden
inside a lambda, because a lambda can not make the enclosing function return:
-->

``` kotlin
fun foo() {
  ordinaryFunction {
     return // エラー: `foo` をここで return することはできない
  }
}
```

<!--original
``` kotlin
fun foo() {
  ordinaryFunction {
     return // ERROR: can not make `foo` return here
  }
}
```
-->

しかし、ラムダがインライン化されるために渡された関数の場合は、returnも同様にインライン化することができ、それが許可されています。

<!--original
But if the function the lambda is passed to is inlined, the return can be inlined as well, so it is allowed:
-->

``` kotlin
fun foo() {
  inlineFunction {
    return // OK: ラムダはインライン
  }
}
```

<!--original
``` kotlin
fun foo() {
  inlineFunction {
    return // OK: the lambda is inlined
  }
}
```
-->

（ラムダに位置するが、内包する関数から抜ける）このようなリターンは、 *非局所リターン* と呼ばれています。私たちは、インライン関数がしばしば内包するこのようなループの構造に慣れています。

<!--original
Such returns (located in a lambda, but exiting the enclosing function) are called *non-local* returns. We are used to
this sort of constructs in loops, which inline functions often enclose:
-->

``` kotlin
fun hasZeros(ints: List<Int>): Boolean {
  ints.forEach {
    if (it == 0) return true // hasZeros から return する
  }
  return false
}
```

<!--original
``` kotlin
fun hasZeros(ints: List<Int>): Boolean {
  ints.forEach {
    if (it == 0) return true // returns from hasZeros
  }
  return false
}
```
-->

インライン関数の中には、渡されたラムダを、関数本体から直接ではなく、ローカルオブジェクトやネストされた関数などの別の実行コンテキストからのパラメータとして呼び出すものがあります。このような場合には、ラムダの中の非局所制御フローは許可されません。それを示すために、ラムダパラメータを `crossinline` 修飾子でマークする必要があります：

<!--original
Note that some inline functions may call the lambdas passed to them as parameters not directly from the function body,
but from another execution context, such as a local object or a nested function. In such cases, non-local control flow
is also not allowed in the lambdas. To indicate that, the lambda parameter needs to be marked with
the `crossinline` modifier:
-->

``` kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```


<!--original
``` kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

-->

`break` と `continue` はインライン化されたラムダではまだ利用できませんが、我々はそれらをサポートすることを計画しています。

<!--original
> `break` and `continue` are not yet available in inlined lambdas, but we are planning to support them too
-->

## 具体化型パラメータ (Reified type parameters)

<!--original
## Reified type parameters
-->

時にはパラメータとして渡された型にアクセスする必要があります。

<!--original
Sometimes we need to access a type passed to us as a parameter:
-->

``` kotlin
fun <T> TreeNode.findParentOfType(clazz: Class<T>): T? {
    var p = parent
    while (p != null && !clazz.isInstance(p)) {
        p = p?.parent
    }
    @Suppress("UNCHECKED_CAST")
    return p as T
}
```

<!--original
``` kotlin
fun <T> TreeNode.findParentOfType(clazz: Class<T>): T? {
    var p = parent
    while (p != null && !clazz.isInstance(p)) {
        p = p?.parent
    }
    @Suppress("UNCHECKED_CAST")
    return p as T
}
```
-->

ここでは、ツリーをたどってリフレクションを使用して、ノードに特定のタイプがあるかどうかを確認します。全く問題はないのですが、呼び出し箇所はそれほど美味しくなりません：

<!--original
Here, we walk up a tree and use reflection to check if a node has a certain type.
It’s all fine, but the call site is not very pretty:
-->

``` kotlin
myTree.findParentOfType(MyTreeNodeType::class.java)
```

<!--original
``` kotlin
myTree.findParentOfType(MyTreeNodeType::class.java)
```
-->

私たちが実際にしたいのはこの関数に型を渡すだけ、すなわち、このように呼び出すだけです：

<!--original
What we actually want is simply pass a type to this function, i.e. call it like this:
-->

``` kotlin
myTree.findParentOfType<MyTreeNodeType>()
```

<!--original
``` kotlin
myTree.findParentOfType<MyTreeNodeType>()
```
-->

これを有効にするには、インライン関数が *具体化型パラメータ* をサポートするので、私たちはこのように書くことができます：

<!--original
To enable this, inline functions support *reified type parameters*, so we can write something like this:
-->

``` kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p?.parent
    }
    return p as T
}
```

<!--original
``` kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p?.parent
    }
    return p as T
}
```
-->

私たちは `reified` 修飾子で型パラメータを修飾しました。これで、関数内でアクセス可能になり、これは通常のクラスと同じように機能します。関数はインライン化されているので、リフレクションは必要ありません。 `!is` や `as` のような通常の演算子が動作するようになります。また、前述したようなやりかたで呼び出すことができます：`myTree.findParentOfType<MyTreeNodeType>()`

<!--original
We qualified the type parameter with the `reified` modifier, now it’s accessible inside the function,
almost as if it were a normal class. Since the function is inlined, no reflection is needed, normal operators like `!is`
and `as` are working now. Also, we can call it as mentioned above: `myTree.findParentOfType<MyTreeNodeType>()`.
-->

リフレクションは多くの場合に必要とされないかもしれませんが、具体化型パラメータで型パラメータを使用することができます：

<!--original
Though reflection may not be needed in many cases, we can still use it with a reified type parameter:
-->

``` kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
  println(membersOf<StringBuilder>().joinToString("\n"))
}
```

<!--original
``` kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
  println(membersOf<StringBuilder>().joinToString("\n"))
}
```
-->

通常の関数（`inline`としてマークされていない）は具体化パラメータをもつことはできません。実行時表現を持たない型（例えば、reifiedされていない型パラメータや `Nothing` のような架空の型）は、reified 型のパラメータの引数として使用できません。

<!--original
Normal functions (not marked as inline) can not have reified parameters.
A type that does not have a run-time representation (e.g. a non-reified type parameter or a fictitious type like `Nothing`)
can not be used as an argument for a reified type parameter.
-->

低レベルの説明については、[仕様書](https://github.com/JetBrains/kotlin/blob/master/spec-docs/reified-type-parameters.md)を参照してください。

<!--original
For a low-level description, see the [spec document](https://github.com/JetBrains/kotlin/blob/master/spec-docs/reified-type-parameters.md).
-->
