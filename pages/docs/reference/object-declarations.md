---
type: doc
layout: reference
category: "Syntax"
title: "オブジェクト式と宣言"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Object Expressions and Declarations"
- --
-->

# オブジェクト式と宣言

<!--original
# Object Expressions and Declarations
-->

時には、あるクラスをわずかに修正しただけのオブジェクトを、それのための新しいサブクラスを明示的に宣言せずに作成する必要があります。Javaでは *無名内部クラス* でこの事例を処理します。
Kotlinでは*オブジェクト式* と *オブジェクトの宣言* だけでこの概念を一般化します。

<!--original
Sometimes we need to create an object of a slight modification of some class, without explicitly declaring a new subclass for it.
Java handles this case with *anonymous inner classes*.
Kotlin slightly generalizes this concept with *object expressions* and *object declarations*.
-->

## オブジェクト式

<!--original
## Object expressions
-->

いくつかの型（1つでも複数でも）から継承する無名クラスのオブジェクトを作成するには、このようにします：

<!--original
To create an object of an anonymous class that inherits from some type (or types), we write:
-->

``` kotlin
window.addMouseListener(object : MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }

  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
})
```

<!--original
``` kotlin
window.addMouseListener(object : MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }

  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
})
```
-->

スーパータイプがコンストラクタを持っている場合は、適切なコンストラクタのパラメータが渡されなければなりません。多くのスーパータイプは、コロンの後にコンマ区切りのリストとして指定することができます：

<!--original
If a supertype has a constructor, appropriate constructor parameters must be passed to it.
Many supertypes may be specified as a comma-separated list after the colon:

-->

``` kotlin
open class A(x: Int) {
  public open val y: Int = x
}

interface B {...}

val ab: A = object : A(1), B {
  override val y = 15
}
```

<!--original
``` kotlin
open class A(x: Int) {
  public open val y: Int = x
}

interface B {...}

val ab: A = object : A(1), B {
  override val y = 15
}
```
-->

万が一、自明でないスーパータイプの「オブジェクトのみ」が必要な場合は、単純に次のように言うことができます：

<!--original
If, by any chance, we need "just an object", with no nontrivial supertypes, we can simply say:
-->

``` kotlin
val adHoc = object {
  var x: Int = 0
  var y: Int = 0
}
print(adHoc.x + adHoc.y)
```

<!--original
``` kotlin
val adHoc = object {
  var x: Int = 0
  var y: Int = 0
}
print(adHoc.x + adHoc.y)
```
-->

ただ、Javaの無名内部クラスのように、内包するスコープからオブジェクト式のコードが変数にアクセスすることができます。（Javaのものとは違って、これは final の変数に限定されるものではありません。）

<!--original
Just like Java's anonymous inner classes, code in object expressions can access variables from the enclosing scope.
(Unlike Java, this is not restricted to final variables.)
-->

``` kotlin
fun countClicks(window: JComponent) {
  var clickCount = 0
  var enterCount = 0

  window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) {
      clickCount++
    }

    override fun mouseEntered(e: MouseEvent) {
      enterCount++
    }
  })
  // ...
}
```

<!--original
``` kotlin
fun countClicks(window: JComponent) {
  var clickCount = 0
  var enterCount = 0

  window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) {
      clickCount++
    }

    override fun mouseEntered(e: MouseEvent) {
      enterCount++
    }
  })
  // ...
}
```
-->

## オブジェクトの宣言

<!--original
## Object declarations
-->

[シングルトン](http://en.wikipedia.org/wiki/Singleton_pattern)は非常に便利なパターンであり、Kotlin（Scalaの後です）は、シングルトンを容易に宣言できるようにしました：

<!--original
[Singleton](http://en.wikipedia.org/wiki/Singleton_pattern) is a very useful pattern, and Kotlin (after Scala) makes it easy to declare singletons:
-->

``` kotlin
object DataProviderManager {
  fun registerDataProvider(provider: DataProvider) {
    // ...
  }

  val allDataProviders: Collection<DataProvider>
    get() = // ...
}
```
- これはオブジェクトの宣言と呼ばれ、それは常に object キーワードの後に名前を持ちます。ちょうど変数宣言と同じように、オブジェクトの宣言は式ではなく、代入文の右側に使用することはできません。

<!--original
``` kotlin
object DataProviderManager {
  fun registerDataProvider(provider: DataProvider) {
    // ...
  }

  val allDataProviders: Collection<DataProvider>
    get() = // ...
}
```
-
This is called an *object declaration*, and it always has a name following the *object*{: .keyword } keyword.
Just like a variable declaration, an object declaration is not an expression, and cannot be used on the right hand side of an assignment statement.
-->

オブジェクトを参照するために、その名前を直接使用します。

<!--original
To refer to the object, we use its name directly:
-->

``` kotlin
DataProviderManager.registerDataProvider(...)
```

<!--original
``` kotlin
DataProviderManager.registerDataProvider(...)
```
-->

このようなオブジェクトは、スーパータイプを持つことができます：

<!--original
Such objects can have supertypes:
-->

``` kotlin
object DefaultListener : MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }

  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
}
```

<!--original
``` kotlin
object DefaultListener : MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }

  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
}
```
-->

**注**：オブジェクト宣言はローカルにすることはできません（つまり、関数内で直接ネストする必要があります）。ただし、他のオブジェクト宣言または非内部クラスにネストすることもできます。

<!--original
**NOTE**: object declarations can't be local (i.e. be nested directly inside a function), but they can be nested into other object declarations or non-inner classes.

-->

### コンパニオンオブジェクト (Companion Objects)

<!--original
### Companion Objects
-->

クラス内のオブジェクトの宣言は、 *companion*{: .keyword } キーワードでマークすることができます。

<!--original
An object declaration inside a class can be marked with the *companion*{: .keyword } keyword:
-->

``` kotlin
class MyClass {
  companion object Factory {
    fun create(): MyClass = MyClass()
  }
}
```

<!--original
``` kotlin
class MyClass {
  companion object Factory {
    fun create(): MyClass = MyClass()
  }
}
```
-->

コンパニオンオブジェクトのメンバーは修飾子として単にクラス名を使用して呼び出すことができます：

<!--original
Members of the companion object can be called by using simply the class name as the qualifier:
-->

``` kotlin
val instance = MyClass.create()
```

<!--original
``` kotlin
val instance = MyClass.create()
```
-->

コンパニオンオブジェクトの名前を省略することができます。この場合、 `Companion` という名前が使用されます。

<!--original
The name of the companion object can be omitted, in which case the name `Companion` will be used:
-->

``` kotlin
class MyClass {
  companion object {
  }
}

val x = MyClass.Companion
```

<!--original
``` kotlin
class MyClass {
  companion object {
  }
}

val x = MyClass.Companion
```
-->

コンパニオンオブジェクトのメンバは、他の言語のスタティックメンバのように見えますが、実行時にはそれらはまだ実際のオブジェクトのインスタンスメンバであり、たとえばインターフェイスを実装できます：

<!--original
Note that, even though the members of companion objects look like static members in other languages, at runtime those
are still instance members of real objects, and can, for example, implement interfaces:
-->

``` kotlin
interface Factory<T> {
  fun create(): T
}


class MyClass {
  companion object : Factory<MyClass> {
    override fun create(): MyClass = MyClass()
  }
}
```

<!--original
``` kotlin
interface Factory<T> {
  fun create(): T
}


class MyClass {
  companion object : Factory<MyClass> {
    override fun create(): MyClass = MyClass()
  }
}
```
-->

しかしながら、JVM上では、 `@JvmStatic` アノテーションを使用すると、コンパニオンオブジェクトのメンバを実際の静的メソッドやフィールドとして生成することができます。詳細については、[Javaの相互運用性](java-to-kotlin-interop.html#static-fields)のセクションを参照してください。

<!--original
However, on the JVM you can have members of companion objects generated as real static methods and fields, if you use
the `@JvmStatic` annotation. See the [Java interoperability](java-to-kotlin-interop.html#static-fields) section
for more details.

-->

### オブジェクト式と宣言の間の意味の違い

<!--original
### Semantic difference between object expressions and declarations
-->

オブジェクト式とオブジェクトの宣言の間には、ある重要な意味上の違いがあります：

<!--original
There is one important semantic difference between object expressions and object declarations:
-->

* オブジェクト式は **すぐに** 実行され（初期化され）、そこで使用されます
* オブジェクト宣言は、初回アクセス時に **遅延して** 初期化されます
* コンパニオンオブジェクトは、対応するクラスが読み込まれた（解決）されたときに初期化され、これは Java の静的初期化子のセマンティクスに一致します

<!--original
* object expressions are executed (and initialized) **immediately**, where they are used
* object declarations are initialized **lazily**, when accessed for the first time
* a companion object is initialized when the corresponding class is loaded (resolved), matching the semantics of a Java static initializer
-->
