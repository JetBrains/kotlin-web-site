---
type: doc
layout: reference
category: "Syntax"
title: "Classes and Inheritance"
related:
    - functions.md
    - nested-classes.md
    - interfaces.md
---

# クラスと継承

## クラス

Kotlinでのクラスは *class*{: .keyword } キーワードを使用して宣言される。

``` kotlin
class Invoice {
}
```

クラス宣言はクラス名、クラスヘッダ（その型パラメータ、主コンストラクタ等）、そしてクラス本体で構成され、波括弧で括られる。
ヘッダと本体はどちらも必須ではない。もしクラスが本体を持たないならば、波括弧は省略できる。

``` kotlin
class Empty
```


### コンストラクタ

Kotlinのクラスは **主コンストラクタ（プライマリコンストラクタ）** と **従コンストラクタ（セカンダリコンストラクタ）** を持つことができる。
主コンストラクタはクラスヘッダの一部であり、クラス名の後に続く（型引数は必須ではない）。

``` kotlin
class Person constructor(firstName: String) {
}
```

もし主コンストラクタがアノテーションや可視性修飾子を何も持たなければ、 *constructor*{: .keyword } キーワードは省略できる：

``` kotlin
class Person(firstName: String) {
}
```

主コンストラクタはどんなコードも含むことはできない。初期化コードは *init*{: .keyword } キーワードと共に **初期化ブロック（イニシャライザブロック）** の中に書くことができる：

``` kotlin
class Customer(name: String) {
    init {
        logger.info("Customer initialized with value ${name}")
    }
}
```

主コンストラクタの引数を初期化ブロック内で使用できることに注意すること。
クラス本体内で宣言されるプロパティの初期化処理の中でそれらを使うことができる：

``` kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```

実際には、プロパティの宣言と初期化を主コンストラクタから行うために、Kotlinは簡潔な構文がある：


``` kotlin
class Person(val firstName: String, val lastName: String, var age: Int) {
  // ...
}
```

通常のプロパティとほとんど同じ方法のように、プロパティは主コンストラクタの中で可変値（ミュータブル） (*var*{: .keyword }) または読み取り専用 (*val*{: .keyword }) で宣言することができる。

もしコンストラクタがアノテーションや可視性修飾子を持つ場合は、 *constructor*{: .keyword } キーワードが必要で修飾子はその前に置かれる：

``` kotlin
class Customer public @Inject constructor(name: String) { ... }
```

詳細については、 [Visibility Modifiers](visibility-modifiers.html#constructors) を参照のこと。


#### 従コンストラクタ（セカンダリコンストラクタ）

クラスは **従コンストラクタ（セカンダリコンストラクタ）** として *constructor*{: .keyword } と共に宣言することができる：

``` kotlin
class Person {
    constructor(parent: Person) {
        parent.children.add(this)
    }
}
```

もしクラスが主コンストラクタを持つなら、それぞれの従コンストラクタは直接的であろうとなかろうと他の従コンストラクタを介して主コンストラクタへ委譲する必要がある。
同クラスの他コンストラクタへの委譲は *this*{: .keyword } キーワードを用いて行う：

``` kotlin
class Person(val name: String) {
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

もし非抽象クラスが何もコンストラクタ（主従共に）を宣言しなければ、主コンストラクタが引数無しで生成される。
コンストラクタの可視性はpublicになる。
もしpublicなコンストラクタを望まないならば、空の主コンストラクタをデフォルトでない可視性で宣言しなければならない。

``` kotlin
class DontCreateMe private constructor () {
}
```


> **注意**: JVMでは、全ての主コンストラクタの全ての引数がデフォルト値を持つなら、コンパイラは追加の引数無しコンストラクタを生成し、デフォルト値として使用される。
> これはクラスインスタンスを引数無しコンストラクタとして生成するJacksonやJPAのようなライブラリをKotlinで使用することを容易にする。
>
> ``` kotlin
> class Customer(val customerName: String = "")
> ```
{:.info}

### クラスのインスタンス生成

クラスのインスタンスを生成するには、コンストラクタを普通の関数のように呼び出せば良い：

``` kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

Kotlinは *new*{: .keyword } キーワードを持たないことに注意すること。


### クラスメンバ

クラスは以下を含むことができる：

* コンストラクタと初期化ブロック
* [関数](functions.html)
* [プロパティ](properties.html)
* [ネストされたインナークラス](nested-classes.html)
* [オブジェクト宣言](object-declarations.html)


## 継承

Kotlinの全てのクラスは共通の `Any` スーパークラスをもつ。これはデフォルトのクラスで、スーパータイプの宣言がない。

``` kotlin
class Example // Anyからの暗黙的継承
```

`Any` は `java.lang.Object` ではない。特に、 `equals()` 、 `hashCode()` 、 `toString()` 以外のメンバを持たない。
詳細については [Java interoperability](java-interop.html#object-methods) を参照のこと。


明示的にスーパータイプを宣言するには、クラスヘッダ内のコロンの後に型を書けば良い：

``` kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

もし明示的にスーパータイプを宣言するクラスが主コンストラクタを持つなら、主コンストラクタの引数を使用して基本型をここで初期化できる（そして、しなければならない）。

もし明示的にスーパータイプを宣言するクラスが主コンストラクタを持たないならば、従コンストラクタはそれぞれ基本型を *super*{: .keyword } キーワードを使って初期化するか、他の初期化してくれるコンストラクタに委譲しなければならない
この事例では異なる従コンストラクタが異なる基本型を持つコンストラクタを呼び出していることに注意すること：

``` kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx) {
    }

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs) {
    }
}
```

The *open*{: .keyword } annotation on a class is the opposite of Java's *final*{: .keyword }: it allows others
to inherit from this class. By default, all classes in Kotlin are final, which
corresponds to [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html),
Item 17: *Design and document for inheritance or else prohibit it*.

クラスにおける *open*{: .keyword } アノテーションはJavaの *final*{: .keyword } と対照的であり、他者に自身のクラスを継承することを許可する。

### メンバのオーバライド

前述の通り、Kotlinでは明示的に作るということにこだわる。
そしてJavaとは異なり、Kotlinではオーバライドできるメンバとオーバライドには明示的アノテーションが必要である。

``` kotlin
open class Base {
  open fun v() {}
  fun nv() {}
}
class Derived() : Base() {
  override fun v() {}
}
```

*override*{: .keyword } アノテーションは `Derived.v()` の為に必要である。もし無ければ、コンパイラはエラーを発する。
もし *open*{: .keyword } アノテーションが `Base.nv()` のように関数になければ、メソッドをサブクラス内で同じ識別子で宣言することは *override*{: .keyword } の有無にかかわらず文法違反である。
ファイナルクラス（例えば、 *open*{: .keyword } アノテーションを持たないクラス）の中では、openメンバは禁止されている。

*override*{: .keyword } としてマークされているメンバは、それ自身がopenである。すなわち、サブクラス内でオーバライドされうる。
もしあなたが再オーバライドを禁止したければ、 *final*{: .keyword } キーワードを使うこと：

``` kotlin
open class AnotherDerived() : Base() {
  final override fun v() {}
}
```

#### 待って！じゃあどうやって自分のライブラリをハックすれば良いの？！

オーバライドのKotlinでの方法（クラスやメンバはデフォルトでfinal）には1つ問題がある。
あなたが使用しているライブラリ内の何かをサブクラス化し、
いくつかのメソッドをオーバライドして（ライブラリの設計者はそれを意図していない）
そこにいくつかの厄介なハックを導入するのが難しくなる。

我々はこれが次の理由から欠点ではないと考えている：

* ベストプラクティスは「とにかくこれらのハックを許可すべきではない」ということである
* 同様のアプローチを取っている他の言語 (C++, C#) はうまくいっている
* もし本当にこのハックが必要ならば、それでも方法は残っている：いつでもハックをJavaで書き、Kotlinから呼ぶことができる（ *[Java Interop](java-interop.html)を参照のこと* ）し、Aspectフレームワークはいつもこれらの目的にかなう

### ルールのオーバライド

Kotlinでは、継承の実装は次のルールで定められている：もしクラスが直接のスーパークラスから同じメンバの多くの実装を継承する場合、クラスはこのメンバを継承し、その独自の実装（おそらく、継承されたものの一つを使用して）を提供しなければならない。
継承された実装のスーパータイプであることを示すために、スーパータイプの名前を角括弧で記述し、 *super*{: .keyword } キーワードを使用する。
例： `super<Base>`

``` kotlin
open class A {
  open fun f() { print("A") }
  fun a() { print("a") }
}

interface B {
  fun f() { print("B") } // インタフェースメンバはデフォルトで'open'
  fun b() { print("b") }
}

class C() : A(), B {
  // コンパイラはf()をオーバライドするために必要とする：
  override fun f() {
    super<A>.f() // A.f() を呼ぶ
    super<B>.f() // B.f() を呼ぶ
  }
}
```

`A` と `B` の両方から継承するのは問題なく、  `C` はそれらの関数の唯一の実装であるため `a()` と `b()` も同様である。
しかし `f()` については、2つの実装が `C` に継承されているため、 `C` の `f()` をオーバライドし、曖昧さを排除するため独自の実装を提供する必要がある。

## 抽象クラス

クラスとそのメンバは *abstract*{: .keyword } を使用してabstractとして宣言することができる。
抽象メンバはそのクラス内に実装を持たない。
それ故、いくつかの子孫が抽象メンバを継承すれば、それは実装としてカウントされない：

``` kotlin
abstract class A {
  abstract fun f()
}

interface B {
  fun f() { print("B") }
}

class C() : A(), B {
  // f()をオーバライドする必要はない
}
```

抽象クラスや抽象関数をopenアノテーションを付ける必要はないことに注意すること。言うまでもないが。

非抽象openメンバを抽象メンバとしてオーバライドすることもできる：

``` kotlin
open class Base {
  open fun f() {}
}

abstract class Derived : Base() {
  override abstract fun f()
}
```

## コンパニオンオブジェクト（Companion Objects）

Kotlinでは、JavaやC#とは異なり、staticメソッドを持たない。ほとんどの場合、パッケージレベルの関数を使用することが推奨される。

もしクラスインスタンスを持たずに呼べるがクラス内部（例えばファクトリメソッド）へアクセスする必要のある関数を書く必要があれば、そのクラスの中で [object declaration](object-declarations.html) のメンバとして書くことができる。

もし [companion object](object-declarations.html#companion-objects) をクラス内で宣言した場合であっても、クラス名を識別子として、static関数をJava/C# で呼ぶのと同じ構文でそのメンバを呼ぶことができる。


## シールクラス（Sealed Classes）

値が制限されたセットの1つの型を持つが、他の型を持てない場合、シールクラスが制限されたクラス階層を表現する際に用いられる。
それらはある意味、enum（列挙型）クラスの拡張である。
enum型の値のセットも同じく制限されているが、それぞれのenum定数はシングルインスタンスとしてのみ存在し、シールクラスのサブクラスは状態を保持できる複数のインスタンスをもつことができる。


シールクラスを宣言するには、 `sealed` 修飾子をクラス名の前に置けば良い。シールクラスはサブクラスを持つことができるが、それらは全てシールクラス自身の宣言の中にネストされていなければならない。

``` kotlin
sealed class Expr {
    class Const(val number: Double) : Expr()
    class Sum(val e1: Expr, val e2: Expr) : Expr()
    object NotANumber : Expr()
}
```

シールクラスのサブクラス（間接的な継承）を拡張するクラスはどこにでも置くことができ、シールクラスの中に書く必要はないことに注意すること。


シールクラスを使うことの主な利点は [`when` expression](control-flow.html#when-expression) の中で使用されたときに発揮される。
もし文が全てのcaseをカバーすることを確認できれば、 `else` 句を追加する必要はない。

``` kotlin
fun eval(expr: Expr): Double = when(expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
    // 全てのcaseがカバーされているため、`else` 句は必要ではない
}
```
