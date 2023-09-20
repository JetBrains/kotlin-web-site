---
type: doc
layout: reference
category: "Syntax"
title: "委譲プロパティ"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Delegated Properties"
- --
-->

# 委譲プロパティ (Delegated Properties)

<!--original
# Delegated Properties
-->

必要なときに手動で実装することはできますが、一度実装してライブラリに入っていると非常にうれしいといった、ある種のよくある一般的なのプロパティはあります。例としては、

<!--original
There are certain common kinds of properties, that, though we can implement them manually every time we need them, 
would be very nice to implement once and for all, and put into a library. Examples include
-->

* 遅延プロパティ (lazy properties) ：値は最初のアクセス時に初めて計算されます
* オブザーバブルプロパティ (observable properties) ：リスナがこのプロパティの変更に関する通知を受け取ります
* フィールドとは分かれていない、map内でのストアリングプロパティ (storing properties)

<!--original
* lazy properties: the value gets computed only upon first access,
* observable properties: listeners get notified about changes to this property,
* storing properties in a map, not in separate field each.
-->

これら（およびその他）のケースをカバーするために、Kotlinは、 _委譲プロパティ (delegated properties)_ をサポートしています。

<!--original
To cover these (and other) cases, Kotlin supports _delegated properties_:
-->

``` kotlin
class Example {
  var p: String by Delegate()
}
```

<!--original
``` kotlin
class Example {
  var p: String by Delegate()
}
```
-->

構文は次のとおりです `val/var <property name>: <Type> by <expression>`
`get()` （と `set()` ）はその `getValue()` および `setValue()` メソッドに委譲されるプロパティに対応するため、 `by` の後に続く式は、 _委譲 (delegate)_ です。プロパティの委譲には、任意のインターフェイスを実装する必要はありませんが、 `getValue()` 関数（そして `setValue()` --- *var*{:.keyword}用に）を提供する必要があります。例えば：

<!--original
The syntax is: `val/var <property name>: <Type> by <expression>`. The expression after *by*{:.keyword} is the _delegate_, 
because `get()` (and `set()`) corresponding to the property will be delegated to its `getValue()` and `setValue()` methods.
Property delegates don’t have to implement any interface, but they have to provide a `getValue()` function (and `setValue()` --- for *var*{:.keyword}'s).
For example:
-->

``` kotlin
class Delegate {
  operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
    return "$thisRef, thank you for delegating '${property.name}' to me!"
  }
 
  operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
    println("$value has been assigned to '${property.name} in $thisRef.'")
  }
}
```

<!--original
``` kotlin
class Delegate {
  operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
    return "$thisRef, thank you for delegating '${property.name}' to me!"
  }
 
  operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
    println("$value has been assigned to '${property.name} in $thisRef.'")
  }
}
```
-->

Delegate インスタンスのデリゲートである `p` を読み込むとき、 `Delegate` の`getValue()` 関数が呼び出されています。そのため、その最初のパラメータは、 `p` を読み取る先のオブジェクトであり、2番目のパラメータは、 `p` 自体の説明を保持しています（例えば、あなたがその名前を得ることができます）。例えば：

<!--original
When we read from `p` that delegates to an instance of `Delegate`, the `getValue()` function from `Delegate` is called,
so that its first parameter is the object we read `p` from and the second parameter holds a description of `p` itself 
(e.g. you can take its name). For example:
-->

``` kotlin
val e = Example()
println(e.p)
```

<!--original
``` kotlin
val e = Example()
println(e.p)
```
-->

これは次の通り出力します

<!--original
This prints 
-->

```
Example@33a17727, thank you for delegating ‘p’ to me!
```

<!--original
```
Example@33a17727, thank you for delegating ‘p’ to me!
```
-->
 
`p` に代入するのと同様に、`setValue()` 関数が呼び出されます。最初の2つのパラメータは同じであり、3つ目は、割り当てられた値を保持します。

<!--original
Similarly, when we assign to `p`, the `setValue()` function is called. The first two parameters are the same, and the third holds the value being assigned:
-->

``` kotlin
e.p = "NEW"
```

<!--original
``` kotlin
e.p = "NEW"
```
-->

これは次の通り出力します

<!--original
This prints
-->
 
```
NEW has been assigned to ‘p’ in Example@33a17727.
```

<!--original
```
NEW has been assigned to ‘p’ in Example@33a17727.
```
-->

## プロパティデリゲートの要件

<!--original
## Property Delegate Requirements
-->

ここでは、オブジェクトを委譲するための要件をまとめます。

<!--original
Here we summarize requirements to delegate objects. 
-->

**読み取り専用**プロパティ（すなわち *val*{:.keyword}）のために、デリゲートは、次のパラメータを取る `getValue` という名前の関数を提供する必要があります。

<!--original
For a **read-only** property (i.e. a *val*{:.keyword}), a delegate has to provide a function named `getValue` that takes the following parameters:
-->

* レシーバ --- _プロパティ所有者_ のものと同じかスーパータイプでなければなりません（拡張プロパティー --- 拡張されるタイプの場合）。
* メタデータ --- 型 `KProperty <*>`またはそのスーパータイプでなければなりません。

<!--original
* receiver --- must be the same or a supertype of the _property owner_ (for extension properties --- the type being extended),
* metadata --- must be of type `KProperty<*>` or its supertype,
-->

この関数は、プロパティ（またはそのサブタイプ）と同じ型を返さなければなりません。

<!--original
this function must return the same type as property (or its subtype).
-->

**変更可能な** プロパティ ( *var*{:.keyword} ) の場合、デリゲートは、さらに次のパラメータを取り `setValue` という名前の関数を _追加で_ 提供する必要があります。

<!--original
For a **mutable** property (a *var*{:.keyword}), a delegate has to _additionally_ provide a function named `setValue` that takes the following parameters:
-->
 
* レシーバ --- `getValue()` と同じ
* メタデータ --- `getValue()` と同じ
* 新しい値 --- プロパティまたはそのスーパータイプと同じタイプでなければなりません。

<!--original
* receiver --- same as for `getValue()`,
* metadata --- same as for `getValue()`,
* new value --- must be of the same type as a property or its supertype.
-->
 
`getValue()` および/または `setValue()` 関数は、いずれかの委譲クラスや拡張機能のメンバ関数として提供することができます。これらの機能を提供していないオブジェクトにプロパティを委譲する必要がある場合、後者が便利です。関数の両方を `operator` キーワードでマークする必要があります。

<!--original
`getValue()` and/or `setValue()` functions may be provided either as member functions of the delegate class or extension functions.
The latter is handy when you need to delegate property to an object which doesn't originally provide these functions.
Both of the functions need to be marked with the `operator` keyword.

## 標準デリゲート

<!--original
## Standard Delegates
-->

Kotlin標準ライブラリでは、いくつかの有用なデリゲートのファクトリメソッドを提供します。

<!--original
The Kotlin standard library provides factory methods for several useful kinds of delegates.
-->

### 遅延 (lazy)

<!--original
### Lazy
-->

`lazy()` はラムダをとり、遅延プロパティを実装するためのデリゲートとして機能する `Lazy<T>` のインスタンスを返す関数です。`get()` の最初の呼び出しは `lazy()` に渡されたラムダを実行し、結果を保持します。 それ以降、`get()` を呼び出すと、単に記憶された結果が返されます。

<!--original
`lazy()` is a function that takes a lambda and returns an instance of `Lazy<T>` which can serve as a delegate for implementing a lazy property:
the first call to `get()` executes the lambda passed to `lazy()` and remembers the result, 
subsequent calls to `get()` simply return the remembered result. 
-->

``` kotlin
val lazyValue: String by lazy {
    println("computed!")
    "Hello"
}

fun main(args: Array<String>) {
    println(lazyValue)
    println(lazyValue)
}
```

<!--original
``` kotlin
val lazyValue: String by lazy {
    println("computed!")
    "Hello"
}

fun main(args: Array<String>) {
    println(lazyValue)
    println(lazyValue)
}
```
-->

デフォルトでは、遅延特性の評価が **同期されます** 。値は1つのスレッドで計算され、すべてのスレッドで同じ値が表示されます。もし初期化デリゲートの同期が必要ではない場合は、 複数のスレッドが同時に初期化を実行できるように `LazyThreadSafetyMode.PUBLICATION` を `lazy()` 関数のパラメータとして渡します。初期化が常に単一のスレッドで起こると確信しているなら、任意のスレッドの安全性の保証および関連するオーバーヘッドが発生しない `LazyThreadSafetyMode.NONE` モードを使用することができます。

<!--original
By default, the evaluation of lazy properties is **synchronized**: the value is computed only in one thread, and all threads
will see the same value. If the synchronization of initialization delegate is not required, so that multiple threads
can execute it simultaneously, pass `LazyThreadSafetyMode.PUBLICATION` as a parameter to the `lazy()` function. 
And if you're sure that the initialization will always happen on a single thread, you can use `LazyThreadSafetyMode.NONE` mode, 
which doesn't incur any thread-safety guarantees and the related overhead.

-->

### オブザーバブル (Observable)

<!--original
### Observable
-->

`Delegates.observable()` は、2つの引数を取ります。初期値と修正のためのハンドラです。ハンドラは（割り当てが行われた _後_ に）プロパティに割り当てるたびに呼び出されます。それには3つのパラメータがあり、割り当てられているプロパティ、古い値、そして新しい値です：

<!--original
`Delegates.observable()` takes two arguments: the initial value and a handler for modifications.
The handler gets called every time we assign to the property (_after_ the assignment has been performed). It has three
parameters: a property being assigned to, the old value and the new one:
-->

``` kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new ->
        println("$old -> $new")
    }
}

fun main(args: Array<String>) {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```

<!--original
``` kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new ->
        println("$old -> $new")
    }
}

fun main(args: Array<String>) {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```
-->

この例の出力：

<!--original
This example prints
-->

```
<no name> -> first
first -> second
```

<!--original
```
<no name> -> first
first -> second
```
-->

もし代入を傍受し、それに対し 「拒否権」を発動できるようにしたい場合は、observable() の代わりに `vetoable()` を使います。 `vetoable` に渡されたハンドラは、新しいプロパティ値の割り当てが行われる _前_ に呼び出されます。

<!--original
If you want to be able to intercept an assignment and "veto" it, use `vetoable()` instead of `observable()`.
The handler passed to the `vetoable` is called _before_ the assignment of a new property value has been performed.
-->

## Map 中のストアリングプロパティ (Storing Properties in a Map)

<!--original
## Storing Properties in a Map
-->

一般的な使用例のひとつとして、map 内のプロパティの値を記憶することが挙げられます。これはJSONをパースしたり、他の「動的」なことをやるようなアプリケーションで頻繁に起こっています。この事例では、委譲プロパティのデリゲートとして map のインスタンス自体を使用することができます。

<!--original
One common use case is storing the values of properties in a map.
This comes up often in applications like parsing JSON or doing other “dynamic” things.
In this case, you can use the map instance itself as the delegate for a delegated property.
-->

``` kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

<!--original
``` kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```
-->

この例では、コンストラクタは、 map を取ります。

<!--original
In this example, the constructor takes a map:
-->

``` kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

<!--original
``` kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```
-->

委譲プロパティは、このマップから（文字列 --- この場合プロパティの名前 --- のキーを使って）値を取ります：

<!--original
Delegated properties take values from this map (by the string keys --- names of properties):

-->

``` kotlin
println(user.name) // 出力："John Doe"
println(user.age)  // 出力：25
```

<!--original
``` kotlin
println(user.name) // Prints "John Doe"
println(user.age)  // Prints 25
```
-->

読み取り専用 `Map` の代わりに `MutableMap` を使用すると、これは *var*{:.keyword} のプロパティに対しても動作します：

<!--original
This works also for *var*{:.keyword}’s properties if you use a `MutableMap` instead of read-only `Map`:
-->

``` kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

<!--original
``` kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```
-->
