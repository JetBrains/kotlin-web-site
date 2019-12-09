---
type: doc
layout: reference
category: "Syntax"
title: "クラスと継承"
related:
    - functions.md
    - nested-classes.md
    - interfaces.md
---

# クラスと継承

<!--original
# Classes and Inheritance
-->

## クラス

<!--original
## Classes
-->

Kotlinでのクラスは、*class*{: .keyword }キーワードを使用して宣言されます。

<!--original
Classes in Kotlin are declared using the keyword *class*{: .keyword }:
-->

``` kotlin
class Invoice {
}
```

<!--original
``` kotlin
class Invoice {
}
```
-->

クラス宣言はクラス名、クラスヘッダ（その型パラメータ、主コンストラクタ等）、そして波括弧で括られたクラス本体で構成されます。ヘッダと本体は両方とも必須ではありません。クラスに本体がない場合は、波括弧を省略することができます。

<!--original
The class declaration consists of the class name, the class header (specifying its type parameters, the primary
constructor etc.) and the class body, surrounded by curly braces. Both the header and the body are optional;
if the class has no body, curly braces can be omitted.
-->

``` kotlin
class Empty
```


<!--original
``` kotlin
class Empty
```

-->

### コンストラクタ

<!--original
### Constructors
-->

Kotlin内のクラスは、 **プライマリコンストラクタ** と1つまたは複数の **セカンダリコンストラクタ** を持つことができます。プライマリコンストラクタは、クラスのヘッダーの一部です。クラス名（型パラメータをつけることもできます）の後に続きます。

<!--original
A class in Kotlin can have a **primary constructor** and one or more **secondary constructors**. The primary
constructor is part of the class header: it goes after the class name (and optional type parameters).
-->

``` kotlin
class Person constructor(firstName: String) {
}
```

<!--original
``` kotlin
class Person constructor(firstName: String) {
}
```
-->

プライマリコンストラクタがアノテーションや可視性修飾子を持っていない場合は、 *constructor*{: .keyword }のキーワードを省略することができます。

<!--original
If the primary constructor does not have any annotations or visibility modifiers, the *constructor*{: .keyword }
keyword can be omitted:
-->

``` kotlin
class Person(firstName: String) {
}
```

<!--original
``` kotlin
class Person(firstName: String) {
}
```
-->

プライマリコンストラクタは、どんなコードも含めることはできません。初期化コードは、*init*{: .keyword }キーワードが付いている **初期化ブロック内** に書くことができます。

<!--original
The primary constructor cannot contain any code. Initialization code can be placed
in **initializer blocks**, which are prefixed with the *init*{: .keyword } keyword:
-->

``` kotlin
class Customer(name: String) {
    init {
        logger.info("Customer initialized with value ${name}")
    }
}
```

<!--original
``` kotlin
class Customer(name: String) {
    init {
        logger.info("Customer initialized with value ${name}")
    }
}
```
-->

プライマリコンストラクタの引数を初期化ブロックに使用できることに注意してください。クラス本体内で宣言されたプロパティの初期化処理で使用することもできます。

<!--original
Note that parameters of the primary constructor can be used in the initializer blocks. They can also be used in
property initializers declared in the class body:
-->

``` kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```

<!--original
``` kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```
-->

実際には、プロパティの宣言と初期化を主コンストラクタから行うために、Kotlinは簡潔な構文があります：

<!--original
In fact, for declaring properties and initializing them from the primary constructor, Kotlin has a concise syntax:

-->

``` kotlin
class Person(val firstName: String, val lastName: String, var age: Int) {
  // ...
}
```

<!--original
``` kotlin
class Person(val firstName: String, val lastName: String, var age: Int) {
  // ...
}
```
-->

通常のプロパティとほとんど同じ方法のように、プロパティは主コンストラクタの中で可変値（ミュータブル） ( *var*{: .keyword } ) または固定値（イミュータブル） ( *val*{: .keyword} ) で宣言することができます。

<!--original
Much the same way as regular properties, the properties declared in the primary constructor can be
mutable (*var*{: .keyword }) or read-only (*val*{: .keyword }).
-->

もしコンストラクタがアノテーションや可視性修飾子を持つ場合は、 *constructor*{: .keyword } キーワードが必要で修飾子はその前に置かれる：

<!--original
If the constructor has annotations or visibility modifiers, the *constructor*{: .keyword } keyword is required, and
the modifiers go before it:
-->

``` kotlin
class Customer public @Inject constructor(name: String) { ... }
```

<!--original
``` kotlin
class Customer public @Inject constructor(name: String) { ... }
```
-->

詳細については、[可視性修飾子](visibility-modifiers.html#constructors)を参照してください。

<!--original
For more details, see [Visibility Modifiers](visibility-modifiers.html#constructors).

-->

#### セカンダリコンストラクタ

<!--original
#### Secondary Constructors
-->

クラスは、 *constructor*{: .keyword } プレフィクスと共に **セカンダリコンストラクタ** を宣言することができます：

<!--original
The class can also declare **secondary constructors**, which are prefixed with *constructor*{: .keyword }:
-->

``` kotlin
class Person {
    constructor(parent: Person) {
        parent.children.add(this)
    }
}
```

<!--original
``` kotlin
class Person {
    constructor(parent: Person) {
        parent.children.add(this)
    }
}
```
-->

もしクラスがプライマリコンストラクタを持つなら、それぞれのセカンダリコンストラクタは直接的または間接的に、他のセカンダリコンストラクタを介してプライマリコンストラクタへ委譲する必要があります。 同クラスの他コンストラクタへの委譲は *this*{: .keyword } キーワードを用いて行います：

<!--original
If the class has a primary constructor, each secondary constructor needs to delegate to the primary constructor, either
directly or indirectly through another secondary constructor(s). Delegation to another constructor of the same class
is done using the *this*{: .keyword } keyword:
-->

``` kotlin
class Person(val name: String) {
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

<!--original
``` kotlin
class Person(val name: String) {
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```
-->

もし非抽象クラスが何もコンストラクタ（プライマリ、セカンダリ共に）を宣言しなければ、プライマリコンストラクタが引数無しで生成されます。その際のコンストラクタの可視性はpublicになります。もしpublicなコンストラクタを望まないならば、空の主コンストラクタをデフォルトでない可視性で宣言する必要があります。

<!--original
If a non-abstract class does not declare any constructors (primary or secondary), it will have a generated primary
constructor with no arguments. The visibility of the constructor will be public. If you do not want your class
to have a public constructor, you need to declare an empty primary constructor with non-default visibility:
-->

``` kotlin
class DontCreateMe private constructor () {
}
```

<!--original
``` kotlin
class DontCreateMe private constructor () {
}
```
-->

> **注意**: JVMでは、プライマリコンストラクタの全ての引数がデフォルト値を持つなら、
> コンパイラは引数無しコンストラクタを追加で生成し、そのコンストラクタはデフォルト値を使用します。
> これにより、JacksonやJPAのように引数が無いコンストラクタを通してクラスインスタンスを作るようなライブラリを、
> Kotlinで使いやすくなります。
>
> ``` kotlin
> class Customer(val customerName: String = "")
> ```
{:.info}
 
<!--original
> **NOTE**: On the JVM, if all of the parameters of the primary constructor have default values, the compiler will
> generate an additional parameterless constructor which will use the default values. This makes it easier to use
> Kotlin with libraries such as Jackson or JPA that create class instances through parameterless constructors.
>
> ``` kotlin
> class Customer(val customerName: String = "")
> ```
{:.info}
-->

### クラスのインスタンス生成

<!--original
### Creating instances of classes
-->

クラスのインスタンスを生成するには、コンストラクタを普通の関数のように呼び出せば良いです：

<!--original
To create an instance of a class, we call the constructor as if it were a regular function:
-->

``` kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

<!--original
``` kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```
-->

Kotlinは *new*{: .keyword } キーワードを持たないことに注意してください。

<!--original
Note that Kotlin does not have a *new*{: .keyword } keyword.
-->

ネストされたクラス、インナークラス、そして匿名のインナークラスの生成は[ネストされたクラス](nested-classes.html)の中に記述されています。

<!--original
Creating instances of nested, inner and anonymous inner classes is described in [Nested classes](nested-classes.html).
-->

### クラスメンバ

<!--original
### Class Members
-->

クラスは以下を含めることができます：

<!--original
Classes can contain
-->

* コンストラクタと初期化ブロック
* [関数](functions.html)
* [プロパティ](properties.html)
* [ネストされたインナークラス](nested-classes.html)
* [オブジェクトの宣言](object-declarations.html)


<!--original
* Constructors and initializer blocks
* [Functions](functions.html)
* [Properties](properties.html)
* [Nested and Inner Classes](nested-classes.html)
* [Object Declarations](object-declarations.html)

-->

## 継承
<!--original
## Inheritance
-->

Kotlinの全てのクラスは共通の `Any` スーパークラスをもちます。これはスーパータイプの宣言がないクラスのデフォルトのスーパークラスです。

<!--original
All classes in Kotlin have a common superclass `Any`, that is a default super for a class with no supertypes declared:
-->

``` kotlin
class Example // Anyから暗黙の継承
```

<!--original
``` kotlin
class Example // Implicitly inherits from Any
```
-->

`Any` は `java.lang.Object` ではありません。特に注意すべきは、 `equals()` 、 `hashCode()` 、 `toString()` 以外のメンバを持ちません。 詳細については [Javaとの相互運用性](java-interop.html#object-methods) を参照してください。

<!--original
`Any` is not `java.lang.Object`; in particular, it does not have any members other than `equals()`, `hashCode()` and `toString()`.
Please consult the [Java interoperability](java-interop.html#object-methods) section for more details.
-->

クラスヘッダ内のコロンの後に型を書くと、明示的にスーパータイプを宣言できます：

<!--original
To declare an explicit supertype, we place the type after a colon in the class header:
-->

``` kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

<!--original
``` kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```
-->

もしこのような（明示的にスーパータイプを宣言する）クラスがプライマリコンストラクタをもつなら、基底の型をプライマリコンストラクタの引数を使用して、そこで初期化できる（し、しなければいけません）。

<!--original
If the class has a primary constructor, the base type can (and must) be initialized right there,
using the parameters of the primary constructor.
-->

もしこのようなクラスがプライマリコンストラクタを持たないならば、セカンダリコンストラクタはそれぞれ基底の型を *super*{: .keyword } キーワードを使って初期化するか、他の初期化してくれるコンストラクタに委譲しなければいけません。この事例では異なるセカンダリコンストラクタが異なる基底の型を持つコンストラクタを呼び出していることに注意すること：

<!--original
If the class has no primary constructor, then each secondary constructor has to initialize the base type
using the *super*{: .keyword } keyword, or to delegate to another constructor which does that.
Note that in this case different secondary constructors can call different constructors of the base type:
-->

``` kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx) {
    }

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs) {
    }
}
```

<!--original
``` kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx) {
    }

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs) {
    }
}
```
-->

クラスの *open*{: .keyword } アノテーションは、Javaの *final*{: .keyword } と反対です：他のクラスがこのクラスから継承することができます。デフォルトでは、Kotlinのすべてのクラスは [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html) のアイテム17（ *継承またはそれの禁止のためのデザインとドキュメント* ）に合致する final です。

<!--original
The *open*{: .keyword } annotation on a class is the opposite of Java's *final*{: .keyword }: it allows others
to inherit from this class. By default, all classes in Kotlin are final, which
corresponds to [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html),
Item 17: *Design and document for inheritance or else prohibit it*.
-->

### メンバのオーバーライド

<!--original
### Overriding Members
-->

前述の通り、私たちはKotlinに明示的にすることにこだわります。そして、Javaとは異なり、Kotlinはメンバをオーバーライドできるメンバ（私たちは *open* と呼んでいます）とオーバライド自体に明示的アノテーションを必要とします。

<!--original
As we mentioned before, we stick to making things explicit in Kotlin. And unlike Java, Kotlin requires explicit
annotations for overridable members (we call them *open*) and for overrides:
-->

``` kotlin
open class Base {
  open fun v() {}
  fun nv() {}
}
class Derived() : Base() {
  override fun v() {}
}
```

<!--original
``` kotlin
open class Base {
  open fun v() {}
  fun nv() {}
}
class Derived() : Base() {
  override fun v() {}
}
```
-->

*override*{: .keyword } アノテーションは `Derived.v()` のために必要です。もしなければ、コンパイラは文句を言うでしょう。もし `Base.nv()` のように *open*{: .keyword } アノテーションが関数になければ、メソッドをサブクラス内で同じ識別子で宣言することは *override*{: .keyword } の有無にかかわらず文法違反です。ファイナルクラス（例えば、 *open*{: .keyword } アノテーションを持たないクラス）の中では、openメンバは禁止されています。

<!--original
The *override*{: .keyword } annotation is required for `Derived.v()`. If it were missing, the compiler would complain.
If there is no *open*{: .keyword } annotation on a function, like `Base.nv()`, declaring a method with the same signature in a subclass is illegal,
either with *override*{: .keyword } or without it. In a final class (e.g. a class with no *open*{: .keyword } annotation), open members are prohibited.
-->

*override*{: .keyword } としてマークされているメンバは、それ自身がopenです。すなわち、サブクラス内でオーバライドされる可能性があります。もし再オーバライドを禁止したければ、 *final*{: .keyword } キーワードを使ってください：

<!--original
A member marked *override*{: .keyword } is itself open, i.e. it may be overridden in subclasses. If you want to prohibit re-overriding, use *final*{: .keyword }:
-->

``` kotlin
open class AnotherDerived() : Base() {
  final override fun v() {}
}
```

<!--original
``` kotlin
open class AnotherDerived() : Base() {
  final override fun v() {}
}
```
-->

プロパティのオーバライドもメソッドのオーバライドと同じように動きます。プライマリコンストラクターでプロパティ宣言の一部として、overrideキーワードを使用できることに注意してください。

<!--original
Overriding properties works in a similar way to overriding methods.
Note that you can use the `override` keyword as part of the property declaration in a primary constructor:
-->

``` kotlin
open class Foo {
    open val x: Int get { ... }
}

class Bar1(override val x: Int) : Foo() {

}
```

<!--original
``` kotlin
open class Foo {
    open val x: Int get { ... }
}

class Bar1(override val x: Int) : Foo() {

}
```
-->

`val` プロパティを `var` プロパティでオーバライドすることもでき、その逆もまた然りです（逆もまた同じです）。これは、`val` のプロパティは、本質的にgetterメソッドを宣言しているためであり、それを `var` としてオーバライドすることは、さらにsetterメソッドを派生クラスに宣言しているためです。

<!--original
You can also override a `val` property with a `var` property, but not vice versa.
This is allowed because a `val` property essentially declares a getter method, and overriding it as a `var` additionally declares a setter method in the derived class.

-->

#### 待って！じゃあどうやって自分のライブラリをハックすれば良いの？！

<!--original
#### Wait! How will I hack my libraries now?!
-->

オーバライドのKotlinでの方法（クラスやメンバはデフォルトでfinal）には1つ問題があります。あなたが使用しているライブラリ内の何かをサブクラス化し、 いくつかのメソッドをオーバライドして（ライブラリの設計者はそれを意図していない） そこにいくつかの厄介なハックを導入するのが難しくなる、という問題です。

<!--original
One issue with our approach to overriding (classes and members final by default) is that it would be difficult to subclass something inside the libraries you use to override some method that was not intended for overriding by the library designer, and introduce some nasty hack there.
-->

私たちは、次のような理由から、これは欠点ではないと考えています：

<!--original
We think that this is not a disadvantage, for the following reasons:
-->

* ベストプラクティスは「とにかくこれらのハックを許可すべきではない」ということである
* 同様のアプローチを取っている他の言語 (C++, C#) はうまくいっている
* もし本当にこのハックが必要ならば、それでも方法は残っている：いつでもハックをJavaで書き、Kotlinから呼ぶことができる（ *[Java Interop](java-interop.html)を参照* してください ）し、Aspectフレームワークはいつもこれらの目的にかないます

<!--original
* Best practices say that you should not allow these hacks anyway
* People successfully use other languages (C++, C#) that have similar approach
* If people really want to hack, there still are ways: you can always write your hack in Java and call it from Kotlin (*see [Java Interop](java-interop.html)*), and Aspect frameworks always work for these purposes
-->

### ルールのオーバーライド


<!--original
### Overriding Rules
-->

Kotlinでは、継承の実装は次のルールで定められています：もしクラスが直接のスーパークラスから同じメンバの多くの実装を継承する場合、クラスはこのメンバを継承し、その独自の実装（おそらく、継承されたものの一つを使用して）を提供しなければいけません。スーパータイプの名前を角括弧で記述し、 super キーワードを使用すると、継承された実装のスーパータイプであることを示すことができます。 例： `super<Base>`

<!--original
In Kotlin, implementation inheritance is regulated by the following rule: if a class inherits many implementations of the same member from its immediate superclasses,
it must override this member and provide its own implementation (perhaps, using one of the inherited ones).
To denote the supertype from which the inherited implementation is taken, we use *super*{: .keyword } qualified by the supertype name in angle brackets, e.g. `super<Base>`:
-->

``` kotlin
open class A {
  open fun f() { print("A") }
  fun a() { print("a") }
}

interface B {
  fun f() { print("B") } // インタフェースのメンバはデフォルトで'open'
  fun b() { print("b") }
}

class C() : A(), B {
  // オーバライドするためにコンパイラは f() を要求する
  override fun f() {
    super<A>.f() // A.f()の呼び出し
    super<B>.f() // B.f()の呼び出し
  }
}
```

<!--original
``` kotlin
open class A {
  open fun f() { print("A") }
  fun a() { print("a") }
}

interface B {
  fun f() { print("B") } // interface members are 'open' by default
  fun b() { print("b") }
}

class C() : A(), B {
  // The compiler requires f() to be overridden:
  override fun f() {
    super<A>.f() // call to A.f()
    super<B>.f() // call to B.f()
  }
}
```
-->

`A` と `B` の両方から継承するのは問題なく、 `C` はそれらの関数の唯一の実装であるため `a()` と `b()` も同様です。しかし `f()` については、2つの実装が `C` に継承されているため、 `C` にある `f()` をオーバライドし、曖昧さを排除するため独自の実装を提供する必要があります。

<!--original
It's fine to inherit from both `A` and `B`, and we have no problems with `a()` and `b()` since `C` inherits only one implementation of each of these functions.
But for `f()` we have two implementations inherited by `C`, and thus we have to override `f()` in `C`
and provide our own implementation that eliminates the ambiguity.
-->

## 抽象クラス

<!--original
## Abstract Classes
-->

クラスとそのメンバは *abstract*{: .keyword } を使用して抽象クラス・抽象メンバとして宣言することができます。抽象メンバはそのクラス内に実装を持ちません。抽象クラスや抽象関数にopenアノテーションを付ける必要はないことに注意してください。もっとも、それは言うまでもないことですが。

<!--original
A class and some of its members may be declared *abstract*{: .keyword }.
An abstract member does not have an implementation in its class.
Note that we do not need to annotate an abstract class or function with open – it goes without saying.
-->

非抽象オープンメンバを抽象メンバでオーバライドすることもできます。

<!--original
We can override a non-abstract open member with an abstract one
-->

``` kotlin
open class Base {
  open fun f() {}
}

abstract class Derived : Base() {
  override abstract fun f()
}
```

<!--original
``` kotlin
open class Base {
  open fun f() {}
}

abstract class Derived : Base() {
  override abstract fun f()
}
```
-->

## コンパニオンオブジェクト (Companion Objects)

<!--original
## Companion Objects
-->

Kotlinでは、JavaやC＃とは異なり、クラスはstaticメソッドを持ちません。ほとんどの場合、代替として、パッケージレベルの関数を使用することが推奨されています。

<!--original
In Kotlin, unlike Java or C#, classes do not have static methods. In most cases, it's recommended to simply use
package-level functions instead.
-->

もしクラスインスタンスを持たずに呼べるがクラス内部（例えばファクトリメソッド）へのアクセスが要る関数を書く必要があれば、そのクラスの中で [オブジェクト宣言](object-declaration.html) のメンバとして書くことができます。

<!--original
If you need to write a function that can be called without having a class instance but needs access to the internals
of a class (for example, a factory method), you can write it as a member of an [object declaration](object-declarations.html)
inside that class.
-->

特に、もし [コンパニオンオブジェクト](object-declarations.html#companion-objects) をクラス内で宣言した場合であっても、クラス名を識別子として、static関数をJava/C# で呼ぶのと同じ構文でそのメンバを呼ぶことができます。

<!--original
Even more specifically, if you declare a [companion object](object-declarations.html#companion-objects) inside your class,
you'll be able to call its members with the same syntax as calling static methods in Java/C#, using only the class name
as a qualifier.

-->

シールクラス (Sealed Classes)

<!--original
## Sealed Classes
-->

値が制限されたセットの1つの型を持つが、他の型を持てない場合、シールクラスが制限されたクラス階層を表現する際に用いられます。それらはある意味、enum（列挙型）クラスの拡張です。enum型の値のセットも同じく制限されているが、それぞれのenum定数はシングルインスタンスとしてのみ存在し、シールクラスのサブクラスは状態を保持できる複数のインスタンスをもつことができます。

<!--original
Sealed classes are used for representing restricted class hierarchies, when a value can have one of the types from a
limited set, but cannot have any other type. They are, in a sense, an extension of enum classes: the set of values
for an enum type is also restricted, but each enum constant exists only as a single instance, whereas a subclass
of a sealed class can have multiple instances which can contain state.
-->

`sealed` 修飾子をクラス名の前に置くと、シールクラスを宣言できます。シールクラスはサブクラスを持つことができますが、それらは全てシールクラス自身の宣言の中にネストされていなければいけません。

<!--original
To declare a sealed class, you put the `sealed` modifier before the name of the class. A sealed class can have
subclasses, but all of them must be nested inside the declaration of the sealed class itself.
-->

``` kotlin
sealed class Expr {
    class Const(val number: Double) : Expr()
    class Sum(val e1: Expr, val e2: Expr) : Expr()
    object NotANumber : Expr()
}
```

<!--original
``` kotlin
sealed class Expr {
    class Const(val number: Double) : Expr()
    class Sum(val e1: Expr, val e2: Expr) : Expr()
    object NotANumber : Expr()
}
```
-->

シールクラスのサブクラス（間接的な継承）を拡張するクラスはどこにでも置くことができ、シールクラスの中に書く必要はないことに注意してください。

<!--original
Note that classes which extend subclasses of a sealed class (indirect inheritors) can be placed anywhere, not necessarily inside
the declaration of the sealed class.
-->

シールクラスの主な利点は [`when`式](control-flow.html#when-expression) の中で使用されたときに発揮されます。もし文が全ての事象をカバーすることを確認・証明できれば、 `else` 句を追加する必要はありません。

<!--original
The key benefit of using sealed classes comes into play when you use them in a [`when` expression](control-flow.html#when-expression). If it's possible
to verify that the statement covers all cases, you don't need to add an `else` clause to the statement.
-->

``` kotlin
fun eval(expr: Expr): Double = when(expr) {
    is Expr.Const -> expr.number
    is Expr.Sum -> eval(expr.e1) + eval(expr.e2)
    Expr.NotANumber -> Double.NaN
    // 全ての事例を嘗めたため、`else` 句は不要
}
```

<!--original
``` kotlin
fun eval(expr: Expr): Double = when(expr) {
    is Expr.Const -> expr.number
    is Expr.Sum -> eval(expr.e1) + eval(expr.e2)
    Expr.NotANumber -> Double.NaN
    // the `else` clause is not required because we've covered all the cases
}
```
-->
