---
type: doc
layout: reference
category: "Syntax"
title: "Properties and Fields"
---

# プロパティとフィールド

## プロパティの宣言

Kotlinでのクラスはプロパティを持つことができる。
*var*{: .keyword } キーワードでミュータブルとして宣言でき、 *val*{: .keyword } キーワードで読み取り専用として宣言できる

``` kotlin
public class Address {
  public var name: String = ...
  public var street: String = ...
  public var city: String = ...
  public var state: String? = ...
  public var zip: String = ...
}
```

プロパティを使うにはJavaでのフィールでやるように、ただ単純に名前で参照するだけで良い：

``` kotlin
fun copyAddress(address: Address): Address {
  val result = Address() // Kotlinには 'new' キーワードがない
  result.name = address.name // アクセサが呼ばれる
  result.street = address.street
  // ...
  return result
}
```

## ゲッターとセッター

プロパティを宣言する完全な構文は

``` kotlin
var <propertyName>: <PropertyType> [= <property_initializer>]
  <getter>
  <setter>
```

イニシャライザであるゲッターとセッターは必須ではない。
イニシャライザか基本クラスのメンバーからオーバライドされることが推測される場合は、プロパティの型はオプションである。

例:

``` kotlin
var allByDefault: Int? // error: explicit initializer required, default getter and setter implied
var initialized = 1 // has type Int, default getter and setter
```

読み取り専用のプロパティ宣言の完全な構文は、ミュータブルのものと比べて2点異なる。
`var` の代わりに `val` で始まるのと、セッターを認めないことである：

``` kotlin
val simple: Int? // これはInt型を持ち、デフォルトのゲッターはコンストラクタ内で初期化されなければならない
val inferredType = 1 // これはInt型とデフォルトのゲッターを持つ
```

カスタムアクセサは普通の関数ととても似ており、プロパティの中に宣言することができる。
これはカスタムゲッターの例である：

``` kotlin
val isEmpty: Boolean
  get() = this.size == 0
```

カスタムセッターはこのようになる：

``` kotlin
var stringRepresentation: String
  get() = this.toString()
  set(value) {
    setDataFromString(value) // 文字列をパースし、値を他のプロパティへ代入する
  }
```

慣例では、セッターのパラメータは `value` であるが、異なる名前が良いならそちらを選択することもできる。

アクセサの可視性を変えたりアノテーションを付けたりしたいときは、デフォルトの実装を変える必要はなく、本体を定義せずにアクセサを定義するすることができる：

``` kotlin
var setterVisibility: String = "abc" // イニシャライザが必要、null許容型でない
  private set // セッターはprivateでデフォルトの実装を持つ

var setterWithAnnotation: Any?
  @Inject set // セッターを Inject でアノテーション付けする
```

### バッキングフィールド（Backing Fields）

Kotlinのクラスはフィールドを持つことができない。しかし、バッキングフィールドがカスタムアクセサを使用する際に時々必要になることがある。
この目的のため、Kotlinは自動バッキングフィールドを提供する。このフィールドには `field` 識別子を使うとアクセス可能になる。

``` kotlin
var counter = 0 // イニシャライザの値は直接バッキングフィールドへ書き込まれる
  set(value) {
    if (value >= 0)
      field = value
  }
```

`field` 識別子はプロパティのアクセサのみで使用できる。

The compiler looks at the accessors' bodies, and if they use the backing field (or the accessor implementation is left by default), a backing field is generated, otherwise it is not.
アクセサの本体や本体がバッキングフィールドを使用しているかどうか（またはアクセサの実装がデフォルトと異なっているか）をコンパイラは見て、バッキングフィールドが生成される。それ以外の場合はされない。

例えば、次の事例ではバッキングフィールドは存在しない：

``` kotlin
val isEmpty: Boolean
  get() = this.size == 0
```

### バッキングプロパティ

"暗黙的バッキングフィールド"にそぐわないことをやりたい場合には、 *backing property* を持つようにもできる：

``` kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
  get() {
    if (_table == null)
      _table = HashMap() // 型パラメータが推測される
    return _table ?: throw AssertionError("Set to null by another thread")
  }
```

全ての点より、これはちょうどJavaと同じである。
なぜなら、privateプロパティへデフォルトゲッターとセッターでアクセスし、セッターがオーバヘッド無しの関数呼び出しに最適化されているためである。


## コンパイル時定数

コンパイル時に把握されるプロパティの値は `const` 修飾子を使用して _compile time constants_ としてマークすることができる。
このようなプロパティは次の要件を満たす必要がある：

  * トップレベル、または `object` のメンバ
  * `String` 型で初期化されるかプリミティブ型であること
  * カスタムゲッターが無いこと

このプロパティはアノテーションで使用することができる：

``` kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```


## 遅延初期化プロパティ

通常、非null型として宣言されたプロパティは、コンストラクタ内で初期化される必要がある。
しかし、これはかなり不便である。例えば、プロパティが依存オブジェクト (dependency injection　訳注：[参考](http://blog.a-way-out.net/blog/2015/08/31/your-dependency-injection-is-wrong-as-I-expected/))により初期化されたり、ユニットテストのセットアップメソッドで初期化されたり。
この事例では、非nullイニシャライザをコンストラクタ内で提供することができないが、それでもクラス内の本体にあるプロパティを参照する際にnullチェックを避けたいであろう。

このような事例を処理するには、プロパティを `lateinit` 識別子でマークすることができる：

``` kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // 直接、逆参照する
    }
}
```

この識別子はクラス本体（主コンストラクタでない）の中で宣言された `var` プロパティで、カスタムゲッターやカスタムセッターを持たないプロパティでのみ使用することができる。
プロパティの型は非nullでなければならず、プリミティブ型であってはならない。

`lateinit` プロパティが初期化される前にアクセスした場合、アクセスされたプロパティと、それが初期化されていないことを明確に示す特別な例外が投げられる。

## プロパティのオーバライド

[Overriding Members](classes.html#overriding-members) を参照のこと。

## 委譲プロパティ（Delegated Properties）

プロパティの最も一般的な種類はバッキングフィールドから読み込む（または書き込むかもしれない）ことである。
一方、カスタムゲッターとセッターを使えばプロパティの振る舞いを如何様にも実装できる。
プロパティの動作の確立された共通パターンがある。遅延評価値、与えられたキーでのmapの読み込み、データベースへのアクセス、アクセスをトリガとしてリスナに通知等が例として挙げられる。

このような一般的な振る舞いは、 _delegated properties_ を使ってライブラリに実装することができる。
詳細は [here](delegated-properties.html) を参照のこと。
