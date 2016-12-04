---
type: doc
layout: reference
category: "Syntax"
title: "ジェネリクス"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Generics"
- --
-->

# ジェネリクス

<!--original
# Generics
-->

Javaと同じように、Kotlinのクラスは型パラメータを持っている場合があります。

<!--original
As in Java, classes in Kotlin may have type parameters:
-->

``` kotlin
class Box<T>(t: T) {
  var value = t
}
```

<!--original
``` kotlin
class Box<T>(t: T) {
  var value = t
}
```
-->

一般的に、このようなクラスのインスタンスを作成するために、我々は、型引数を提供する必要があります。

<!--original
In general, to create an instance of such a class, we need to provide the type arguments:
-->

``` kotlin
val box: Box<Int> = Box<Int>(1)
```

<!--original
``` kotlin
val box: Box<Int> = Box<Int>(1)
```
-->

しかし、パラメータを推測することができる場合には、（例えば、コンストラクタの引数から、または何らかの他の手段によって）、「1」は、型引数を省略することができます：

<!--original
But if the parameters may be inferred, e.g. from the constructor arguments or by some other means, one is allowed to omit the type arguments:
-->

``` kotlin
val box = Box(1) // 1 は Int型をもつため、ここでは Box<Int> について話しているとコンパイラはわかる
```

<!--original
``` kotlin
val box = Box(1) // 1 has type Int, so the compiler figures out that we are talking about Box<Int>
```
-->

## 分散

<!--original
## Variance
-->

Javaの型システムの最もトリッキーな部分の一つは、ワイルドカードの種類（[JavaのジェネリックのFAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)を参照してください）です。そして、Kotlinは、いずれも持っていません。その代わり、2つの別のものがあります：宣言箇所の分散と型プロジェクションです。

<!--original
One of the most tricky parts of Java's type system is wildcard types (see [Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)).
And Kotlin doesn't have any. Instead, it has two other things: declaration-site variance and type projections.
-->

まずは、Javaがこれらの神秘的なワイルドカードを必要とする理由について考えてみましょう。この問題は[Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html)の項目28「APIの柔軟性を高めるためのバインドされたワイルドカードの使用」で説明されています。まず、Javaでジェネリック型は不変です。これは、 `List<String>` は `List<Object>` のサブタイプ **ではない** ことを意味します。なぜそうなのか？もしリストが **不変** でなかった場合は、次のコードはコンパイルされ、実行時に例外を発生させていたので、それは、Javaの配列より良いものではなかったでしょう。

<!--original
First, let's think about why Java needs those mysterious wildcards. The problem is explained in [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html), Item 28: *Use bounded wildcards to increase API flexibility*.
First, generic types in Java are **invariant**, meaning that `List<String>` is **not** a subtype of `List<Object>`. 
Why so? If List was not **invariant**, it would have been no 
better than Java's arrays, since the following code would have compiled and caused an exception at runtime:
-->

``` java
// Java
List<String> strs = new ArrayList<String>();
List<Object> objs = strs; // !!! 今後の問題の原因はここにあります。 Javaはこれを禁止しています！
objs.add(1); // Integer を Strings のリストへ入れる
String s = strs.get(0); // !!! ClassCastException: Integer を String へキャストできない
```
つまり、Javaの実行時の安全性を保証するためにそのようなことを禁止しているのです。しかし、これはいくつかの意味があります。例えば、 `Collection` インタフェースからの `addAll()` メソッドを考えます。このメソッドのシグネチャは何でしょうか？直感的に、我々はそれをこのように置くと思います。

<!--original
``` java
// Java
List<String> strs = new ArrayList<String>();
List<Object> objs = strs; // !!! The cause of the upcoming problem sits here. Java prohibits this!
objs.add(1); // Here we put an Integer into a list of Strings
String s = strs.get(0); // !!! ClassCastException: Cannot cast Integer to String
```
So, Java prohibits such things in order to guarantee run-time safety. But this has some implications. For example, consider the `addAll()` method from `Collection` 
interface. What's the signature of this method? Intuitively, we'd put it this way:
-->

``` java
// Java
interface Collection<E> ... {
  void addAll(Collection<E> items);
}
```

<!--original
``` java
// Java
interface Collection<E> ... {
  void addAll(Collection<E> items);
}
```
-->

しかし、その後、次のような簡単なこと（完全に安全である）を行うことができなくなります。

<!--original
But then, we would not be able to do the following simple thing (which is perfectly safe):
-->

``` java
// Java
void copyAll(Collection<Object> to, Collection<String> from) {
  to.addAll(from); // !!! addAllのネイティブの宣言ではコンパイルできません：
                   //       Collection<String> は Collection <Object> のサブタイプではありません
}
```

<!--original
``` java
// Java
void copyAll(Collection<Object> to, Collection<String> from) {
  to.addAll(from); // !!! Would not compile with the naive declaration of addAll:
                   //       Collection<String> is not a subtype of Collection<Object>
}
```
-->

（Javaでは、この教訓に堅い方法を学びました。 [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html)の項目25「 *配列よりリストを好む* 」を参照してください。）

<!--original
(In Java, we learned this lesson the hard way, see [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html), Item 25: *Prefer lists to arrays*)

-->

これが、 `addAll()` の実際のシグネチャが以下の通りになる理由です：

<!--original
That's why the actual signature of `addAll()` is the following:
-->

``` java
// Java
interface Collection<E> ... {
  void addAll(Collection<? extends E> items);
}
```

<!--original
``` java
// Java
interface Collection<E> ... {
  void addAll(Collection<? extends E> items);
}
```
-->

**ワイルドカード型引数** `? extends T` は、このメソッドが受け入れるコレクションは `T` **のサブタイプ** のオブジェクトであって、 `T` 自身ではないことを示します。
私たちが安全に `T` の項目（このコレクションの要素は `T` のサブクラスのインスタンスです）を **読み取る** ことができても、未知の `T` のサブタイプに対して、どのオブジェクトが応じるかわからないため、 **書き込みができない** 理由はこれです。
この制限と引き換えに、私たちは望んだ動作を得ます： `Collection<String>` は `Collection<? extends Object>` のサブタイプ *である* ということ。
「賢い言葉」で言い換えると、 **拡張する** バインド（ **上昇** のバインド）のワイルドカードは **型共変** になります。

<!--original
The **wildcard type argument** `? extends T` indicates that this method accepts a collection of objects of *some subtype of* `T`, not `T` itself. 
This means that we can safely **read** `T`'s from items (elements of this collection are instances of a subclass of T), but **cannot write** to 
it since we do not know what objects comply to that unknown subtype of `T`. 
In return for this limitation, we have the desired behaviour: `Collection<String>` *is* a subtype of `Collection<? extends Object>`. 
In "clever words", the wildcard with an **extends**\-bound (**upper** bound) makes the type **covariant**.
-->

このトリックがなぜ働くのかを理解するための鍵は、かなりシンプルです：コレクションからアイテムを **取り出す** ことだけできるのならば、`String` のコレクションを使用して、 `Object` で読み出せば良いのです。
反対に、コレクションにアイテムを _入れる_ ことだけできるのならば、 `Object` のコレクションを使用し、 `String` を入れても良いのです。 Javaでは `List<Object>` の **スーパータイプ** である、 `List<? super String>` を使用します。

<!--original
The key to understanding why this trick works is rather simple: if you can only **take** items from a collection, then using a collection of `String`s
and reading `Object`s from it is fine. Conversely, if you can only _put_ items into the collection, it's OK to take a collection of
`Object`s and put `String`s into it: in Java we have `List<? super String>` a **supertype** of `List<Object>`.
-->
 
後者は **反変性** と呼ばれ、 String を `List<? super String>` の引数としたメソッドを呼ぶことのみができます（例えば、 `add(String)` や `set(int, String)` を呼ぶことができます）。ただし、`List<T>` で `T` を返す何かを呼んだとき、得るのは `String` ではなく `Object` ですが。

<!--original
The latter is called **contravariance**, and you can only call methods that take String as an argument on `List<? super String>` 
(e.g., you can call `add(String)` or `set(int, String)`), while 
if you call something that returns `T` in `List<T>`, you don't get a `String`, but an `Object`.
-->

ジョシュア・ブロック (Joshua Bloch) はこれらのオブジェクトを 「 **プロデューサ（生産者）** からのみ **読み込み** 、**コンシューマ（消費者）** にのみ **書き込む** 」と呼びました。彼の勧めによると、 *「最大の柔軟性を得るために、プロデューサやコンシューマを表す入力パラメータにワイルドカードタイプを使用する」* 。 次の記憶術 (mnemonic) も提案しています。

<!--original
Joshua Bloch calls those objects you only **read** from **Producers**, and those you only **write** to **Consumers**. He recommends: "*For maximum flexibility, use wildcard types on input parameters that represent producers or consumers*", and proposes the following mnemonic:
-->

*PECSはProducer-Extends, Consumer-Super を意味します。*

<!--original
*PECS stands for Producer-Extends, Consumer-Super.*
-->

*注* ：プロデューサオブジェクトを使用する場合（たとえば、 `List<? extends Foo>` ）、このオブジェクト上の `add()` や `set()` を呼び出すことができません。しかし、このオブジェクトは **イミュータブル（不変）** であるというわけでもありません。例えば、 `clear()` は全くパラメータを取らないため、リストからすべての項目を削除するために `clear()` を呼び出しても構いません。ワイルドカード（または分散の他の型）によって唯一保証されるのは **型の安全性** です。不変性は全く別の話です。

<!--original
*NOTE*: if you use a producer-object, say, `List<? extends Foo>`, you are not allowed to call `add()` or `set()` on this object, but this does not mean 
that this object is **immutable**: for example, nothing prevents you from calling `clear()` to remove all items from the list, since `clear()` 
does not take any parameters at all. The only thing guaranteed by wildcards (or other types of variance) is **type safety**. Immutability is a completely different story.
-->

### 宣言箇所分散

<!--original
### Declaration-site variance
-->

ジェネリックインターフェイスの `Source<T>` があると仮定します。また、パラメータとして `T` をとるメソッドを持たず、 `T` を返すメソッドのみを持つとします。 

<!--original
Suppose we have a generic interface `Source<T>` that does not have any methods that take `T` as a parameter, only methods that return `T`:
-->

``` java
// Java
interface Source<T> {
  T nextT();
}
```

<!--original
``` java
// Java
interface Source<T> {
  T nextT();
}
```
-->

それは `Source<Object>` 型の変数（呼び出せるコンシューマメソッドがない）内で `Source<String>` のインスタンスへの参照を保持するのに完全に安全です。 -- しかし、Javaはこれを知っているし、まだそれを禁止していません：

<!--original
Then, it would be perfectly safe to store a reference to an instance of `Source<String>` in a variable of type `Source<Object>` -- there are no consumer-methods to call. But Java does not know this, and still prohibits it:
-->

``` java
// Java
void demo(Source<String> strs) {
  Source<Object> objects = strs; // !!! Java では許可されていない
  // ...
}
```

<!--original
``` java
// Java
void demo(Source<String> strs) {
  Source<Object> objects = strs; // !!! Not allowed in Java
  // ...
}
```
-->

これを修正するために、`Source<? extends Object>` 型のオブジェクトを宣言する必要があります。全ての同メソッドを前のような変数で呼ぶことができるので、順序に意味はなく、より複雑な型で追加することに価値はありません。しかし、コンパイラはそれを知りません。

<!--original
To fix this, we have to declare objects of type `Source<? extends Object>`, which is sort of meaningless, because we can call all the same methods on such a variable as before, so there's no value added by the more complex type. But the compiler does not know that.
-->

Kotlinでは、コンパイラにこの種の問題を説明する方法があります。これは、 **宣言箇所分散** と呼ばれています：ソースの **型パラメータ** `T` を `Source<T>` のメンバからのみ **返し** （プロデュースする）、消費されることがないということを確認するために、アノテーションを付けることができます。これを行うために、我々は **out** 修飾子を提供します。

<!--original
In Kotlin, there is a way to explain this sort of thing to the compiler. This is called **declaration-site variance**: we can annotate the **type parameter** `T` of Source to make sure that it is only **returned** (produced) from members of `Source<T>`, and never consumed. 
To do this we provide the **out** modifier:
-->

``` kotlin
abstract class Source<out T> {
  abstract fun nextT(): T
}

fun demo(strs: Source<String>) {
  val objects: Source<Any> = strs // これは OK 、なぜなら T はoutパラメータのため
  // ...
}
```

<!--original
``` kotlin
abstract class Source<out T> {
  abstract fun nextT(): T
}

fun demo(strs: Source<String>) {
  val objects: Source<Any> = strs // This is OK, since T is an out-parameter
  // ...
}
```
-->

一般的なルールは次のとおりです。クラス `C` の型パラメータ `T` が、 **out** として宣言されているとき、 `C` のメンバの中で **out** の位置でのみそれが起きることがあります。 しかし、 `C<Base>` を返すときは `C<Derived>` のスーパータイプに安全になり得ます。

<!--original
The general rule is: when a type parameter `T` of a class `C` is declared **out**, it may occur only in **out**\-position in the members of `C`, but in return `C<Base>` can safely be a supertype 
of `C<Derived>`.
-->

「賢い言葉」でいうと、クラス `C` は、パラメータ `T` に **共変** である、または `T` が **共変** の型パラメータであるとなります。 `C` は `T` の **プロデューサ** であり、 `T` の **コンシューマ** ではない、と考えることができます。

<!--original
In "clever words" they say that the class `C` is **covariant** in the parameter `T`, or that `T` is a **covariant** type parameter. 
You can think of `C` as being a **producer** of `T`'s, and NOT a **consumer** of `T`'s.
-->

**out** 修飾子は、 **分散アノテーション** と呼ばれ、それは型パラメータの宣言箇所で提供されているので、我々は **宣言箇所分散** について話しています。
これは、ワイルドカードが使用時に型を共変にする、Javaの **使用箇所分散** とは対照的です。

<!--original
The **out** modifier is called a **variance annotation**, and  since it is provided at the type parameter declaration site, we talk about **declaration-site variance**. 
This is in contrast with Java's **use-site variance** where wildcards in the type usages make the types covariant.
-->

**out** に加えて、Kotlinは **in** という補完的な分散アノテーションを提供します。これは、型パラメータの **反変** を行います。消費されるのみであり、決してプロデュース（生産）されません。
反変クラスの良い例は `Comparable` です：

<!--original
In addition to **out**, Kotlin provides a complementary variance annotation: **in**. It makes a type parameter **contravariant**: it can only be consumed and never 
produced. A good example of a contravariant class is `Comparable`:
-->

``` kotlin
abstract class Comparable<in T> {
  abstract fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
  x.compareTo(1.0) // 1.0 は Number のサブタイプである Double 型をもつ
  // それゆえ、 x を Comparable<Double> 型の変数へ代入できる
  val y: Comparable<Double> = x // OK!
}
```

<!--original
``` kotlin
abstract class Comparable<in T> {
  abstract fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
  x.compareTo(1.0) // 1.0 has type Double, which is a subtype of Number
  // Thus, we can assign x to a variable of type Comparable<Double>
  val y: Comparable<Double> = x // OK!
}
```
-->

（C#で何度も成功しているように）**in** と **out** は自己説明的であるゆえに、以前述べた記憶術（ニーモニック）は本当は不要で、より高次の目的のために言い換えることができます：

<!--original
We believe that the words **in** and **out** are self-explaining (as they were successfully used in C# for quite some time already), 
thus the mnemonic mentioned above is not really needed, and one can rephrase it for a higher purpose:
-->

**[実存的](http://en.wikipedia.org/wiki/Existentialism)言い換え：コンシューマ（消費者）は in、プロデューサ（生産者）は out ！** :-)

<!--original
**[The Existential](http://en.wikipedia.org/wiki/Existentialism) Transformation: Consumer in, Producer out\!** :-)
-->

## タイププロジェクション（型投影）

<!--original
## Type projections
-->

### 利用箇所の分散：タイププロジェクション

<!--original
### Use-site variance: Type projections
-->

*out* 型パラメータTを宣言し、使用箇所のサブタイプとの問題がないことは非常に便利です。
そう、それは問題のクラスが実際に `T` のインスタンスのみを返すよう制限 **できる** ときですが、できないのはどんなときでしょう。この良い例は、Arrayです。

<!--original
It is very convenient to declare a type parameter T as *out* and have no trouble with subtyping on the use site. Yes, it is, when the class in question **can** actually be restricted to only return `T`'s, but what if it can't? 
A good example of this is Array:
-->

``` kotlin
class Array<T>(val size: Int) {
  fun get(index: Int): T { /* ... */ }
  fun set(index: Int, value: T) { /* ... */ }
}
```

<!--original
``` kotlin
class Array<T>(val size: Int) {
  fun get(index: Int): T { /* ... */ }
  fun set(index: Int, value: T) { /* ... */ }
}
```
-->

このクラスは `T` の共変または反変のいずれかにもなることはできません。そして、これは特定の不撓（ふとう）性（曲げられない特性）を課しています。次の関数を考えてみます：

<!--original
This class cannot be either co\- or contravariant in `T`. And this imposes certain inflexibilities. Consider the following function:
-->

``` kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
  assert(from.size == to.size)
  for (i in from.indices)
    to[i] = from[i]
}
```

<!--original
``` kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
  assert(from.size == to.size)
  for (i in from.indices)
    to[i] = from[i]
}
```
-->

この関数は、ある配列から別の配列へ、アイテムをコピーすることになっています。それでは、実際にそれを適用してみましょう：

<!--original
This function is supposed to copy items from one array to another. Let's try to apply it in practice:
-->

``` kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3)
copy(ints, any) // エラー： (Array<Any>, Array<Any>) が期待されている
```

<!--original
``` kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3)
copy(ints, any) // Error: expects (Array<Any>, Array<Any>)
```
-->

ここで同じようなよくある問題に遭遇します： `Array<T>` は `T` において **不変** であり、ゆえに `Array<Int>` も `Array<Any>` も他のサブタイプではありません。
どうして？コピーが何か悪いこと（すなわち `from` への文字列の **書き込み** や出力の試行）をやっている **可能性がある** ためです。また `Int` の配列を実際に渡されると、`ClassCastException` が時々後で投げられるでしょう。

<!--original
Here we run into the same familiar problem: `Array<T>` is **invariant** in `T`, thus neither of `Array<Int>` and `Array<Any>` 
is a subtype of the other. Why? Again, because copy **might** be doing bad things, i.e. it might attempt to **write**, say, a String to `from`,
and if we actually passed an array of `Int` there, a `ClassCastException` would have been thrown sometime later.
-->

ここで、唯一の保証したいことは、`copy()` がいかなる悪さもしないということです。 `copy()` が `from` に書き込むことを禁止したく、それを行うことはできます：

<!--original
Then, the only thing we want to ensure is that `copy()` does not do any bad things. We want to prohibit it from **writing** to `from`, and we can:
-->

``` kotlin
fun copy(from: Array<out Any>, to: Array<Any>) {
 // ...
}
```

<!--original
``` kotlin
fun copy(from: Array<out Any>, to: Array<Any>) {
 // ...
}
```
-->

ここで起こったことは、 **タイププロジェクション（型投影）** と呼ばれています。 `from` は単純に配列なのではなく、制限された（ **投影された** ）ものであるということです。型パラメータ `T` を返すこれらのメソッドはこのケースでのみ呼び出すことができます。
つまり、 `get()` を呼ぶことのみができるということです。これが、 **使用箇所分散** のための我々のアプローチであり、Javaの `Array<? extends Object>` に対応しますが、少しだけ簡単な方法です。

<!--original
What has happened here is called **type projection**: we said that `from` is not simply an array, but a restricted (**projected**) one: we can only call those methods that return the type parameter 
`T`, in this case it means that we can only call `get()`. This is our approach to **use-site variance**, and corresponds to Java's `Array<? extends Object>`, 
but in a slightly simpler way.
-->

このように **in** でタイププロジェクション（型投影）を使用できます：

<!--original
You can project a type with **in** as well:
-->

``` kotlin
fun fill(dest: Array<in String>, value: String) {
  // ...
}
```

<!--original
``` kotlin
fun fill(dest: Array<in String>, value: String) {
  // ...
}
```
-->

`Array<in String>` は Javaの `Array<? super String>` に対応します。すなわち、 `CharSequence` の配列や `Object` の配列を `fill()` 関数へ渡すことができます。

<!--original
`Array<in String>` corresponds to Java's `Array<? super String>`, i.e. you can pass an array of `CharSequence` or an array of `Object` to the `fill()` function.
-->

### スタープロジェクション (star-projections)

<!--original
### Star-projections
-->

型引数について何も知らないが、それでも安全な方法で使用したいと、時には言いたくなることもあるでしょう。ここでの安全な方法とは、ジェネリック型のそのようなプロジェクションを定義することです。ジェネリック型を具体的にインスタンス化すると、全てそのプロジェクションのサブタイプになります。

<!--original
Sometimes you want to say that you know nothing about the type argument, but still want to use it in a safe way.
The safe way here is to define such a projection of the generic type, that every concrete instantiation of that generic type would be a subtype of that projection.
-->

Kotlinはこのために、いわゆる **スタープロジェクション (star-projection)** 構文を提供します：

<!--original
Kotlin provides so called **star-projection** syntax for this:
-->

 - `Foo <out T>` の場合、`T` は上限 `TUpper` を持つ共変の型のパラメータであり、 `Foo <*>` は `Foo<out TUpper>` と等価です。これは、 `T` が不明な場合に、安全には `Foo <*>` から `TUpper` の値を読み取ることができることを意味します。
 - `T` が反変の型パラメータである `Foo<in T>` については、 `Foo<*>` は `Foo <in Nothing>` と等価です。それは `T` は不明である場合は安全な方法で `Foo <*>` に書き込むことができる方法がないことを意味します。
 - `Foo <T>` の場合、 `T` は上限 `TUpper` を持つ不変の型パラメータであり、値を読み込むための `Foo<out TUpper>`および値を書き込むための `Foo<in Nothing>` と `Foo <*>` は同等です。

<!--original
 - For `Foo<out T>`, where `T` is a covariant type parameter with the upper bound `TUpper`, `Foo<*>` is equivalent to `Foo<out TUpper>`. It means that when the `T` is unknown you can safely *read* values of `TUpper` from `Foo<*>`.
 - For `Foo<in T>`, where `T` is a contravariant type parameter, `Foo<*>` is equivalent to `Foo<in Nothing>`. It means there is nothing you can *write* to `Foo<*>` in a safe way when `T` is unknown.
 - For `Foo<T>`, where `T` is an invariant type parameter with the upper bound `TUpper`, `Foo<*>` is equivalent to `Foo<out TUpper>` for reading values and to `Foo<in Nothing>` for writing values.
-->

ジェネリック型がいくつかの型パラメータをもつ場合、それらは独立してプロジェクション（投影）することができます。
例えば、型が `interface Function<in T, out U>` として宣言されている場合ならが、次のようなスタープロジェクションを想像することができます：

<!--original
If a generic type has several type parameters each of them can be projected independently.
For example, if the type is declared as `interface Function<in T, out U>` we can imagine the following star-projections:
-->

 - `Function<*, String>` は `Function<in Nothing, String>` を意味します
 - `Function<Int, *>` は `Function<Int, out Any?>` を意味します
 - `Function<*, *>` は `Function<in Nothing, out Any?>` を意味します

<!--original
 - `Function<*, String>` means `Function<in Nothing, String>`;
 - `Function<Int, *>` means `Function<Int, out Any?>`;
 - `Function<*, *>` means `Function<in Nothing, out Any?>`.
-->

*注意* ：スタープロジェクションは非常にJavaの raw タイプににていますが、安全です。

<!--original
*Note*: star-projections are very much like Java's raw types, but safe.
-->

# ジェネリック関数

<!--original
# Generic functions
-->

型パラメータを持つことができるのはクラスだけではありません。関数も同じです。
型パラメータは、関数名の前に置かれます。

<!--original
Not only classes can have type parameters. Functions can, too. Type parameters are placed before the name of the function:
-->

``` kotlin
fun <T> singletonList(item: T): List<T> {
  // ...
}

fun <T> T.basicToString() : String {  // 拡張関数
  // ...
}
```

<!--original
``` kotlin
fun <T> singletonList(item: T): List<T> {
  // ...
}

fun <T> T.basicToString() : String {  // extension function
  // ...
}
```
-->

ジェネリック関数を呼び出すには、関数名の **後に** 呼び出し箇所で型引数を指定します。

<!--original
To call a generic function, specify the type arguments at the call site **after** the name of the function:
-->

``` kotlin
val l = singletonList<Int>(1)
```

<!--original
``` kotlin
val l = singletonList<Int>(1)
```
-->

# ジェネリックの制約

<!--original
# Generic constraints
-->

与えられる型パラメータに置換することができるすべての許容される型の集合は、 **ジェネリックの制約** によって制限されてもかまいません。

<!--original
The set of all possible types that can be substituted for a given type parameter may be restricted by **generic constraints**.
-->

## 上限 (Upper bounds)

<!--original
## Upper bounds
-->

制約の最も一般的なタイプは、Javaの extends キーワードに対応する **上限** です。

<!--original
The most common type of constraint is an **upper bound** that corresponds to Java's *extends* keyword:
-->

``` kotlin
fun <T : Comparable<T>> sort(list: List<T>) {
  // ...
}
```

<!--original
``` kotlin
fun <T : Comparable<T>> sort(list: List<T>) {
  // ...
}
```
-->

コロンの後に指定されたタイプが **上限** です。 `Comparable<T>` のサブタイプは `T` の代わりに使用することができます。例えば：

<!--original
The type specified after a colon is the **upper bound**: only a subtype of `Comparable<T>` may be substituted for `T`. For example
-->

``` kotlin
sort(listOf(1, 2, 3)) // OK. Int は Comparable<Int> のサブタイプです
sort(listOf(HashMap<Int, String>())) // エラー： HashMap<Int, String> は Comparable<HashMap<Int, String>> のサブタイプではない
```

<!--original
``` kotlin
sort(listOf(1, 2, 3)) // OK. Int is a subtype of Comparable<Int>
sort(listOf(HashMap<Int, String>())) // Error: HashMap<Int, String> is not a subtype of Comparable<HashMap<Int, String>>
```
-->

デフォルトの上限（いずれも指定されていない場合）は `Any?` です。唯一の上限を、角括弧内で指定することができます。
同じ型パラメータに複数の上限を必要とする場合、それぞれ独立した **where** 句が必要になります：

<!--original
The default upper bound (if none specified) is `Any?`. Only one upper bound can be specified inside the angle brackets.
If the same type parameter needs more than one upper bound, we need a separate **where**\-clause:
-->

``` kotlin
fun <T> cloneWhenGreater(list: List<T>, threshold: T): List<T>
    where T : Comparable,
          T : Cloneable {
  return list.filter { it > threshold }.map { it.clone() }
}
```

<!--original
``` kotlin
fun <T> cloneWhenGreater(list: List<T>, threshold: T): List<T>
    where T : Comparable,
          T : Cloneable {
  return list.filter { it > threshold }.map { it.clone() }
}
```
-->