---
type: doc
layout: reference
category: "Syntax"
title: "拡張"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Extensions"
- --
-->

# 拡張 (extension)

<!--original
# Extensions
-->

Kotlinは、C#やGosuと似ていて、クラスを継承したりDecoratorのようなデザインパターンを使用せずとも、クラスを新しい機能で拡張する能力を提供します。
これは、 _拡張_ と呼ばれる特別な宣言を介して行われます。Kotlinは、 _拡張関数_ と _拡張プロパティ_ をサポートしています。

<!--original
Kotlin, similar to C# and Gosu, provides the ability to extend a class with new functionality without having to inherit from the class or use any type of design pattern such as Decorator.
This is done via special declarations called _extensions_. Kotlin supports _extension functions_ and _extension properties_.
-->

## 拡張関数

<!--original
## Extension Functions
-->

拡張関数を宣言するには _レシーバタイプ (receiver type)_ を関数名の前に付ける必要があります。
次の例では、 `swap` 関数を `MutableList<Int>` に追加しています：

<!--original
To declare an extension function, we need to prefix its name with a _receiver type_, i.e. the type being extended.
The following adds a `swap` function to `MutableList<Int>`:
-->

``` kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
  val tmp = this[index1] // 'this' がリストに対応する
  this[index1] = this[index2]
  this[index2] = tmp
}
```

<!--original
``` kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
  val tmp = this[index1] // 'this' corresponds to the list
  this[index1] = this[index2]
  this[index2] = tmp
}
```
-->

拡張関数内での *this*{: .keyword } キーワードは、レシーバオブジェクト（ドットの前に渡されたもの）に対応しています。これで、この関数を任意の `MutableList<Int>` からでも呼べるようになりました：

<!--original
The *this*{: .keyword } keyword inside an extension function corresponds to the receiver object (the one that is passed before the dot). 
Now, we can call such a function on any `MutableList<Int>`:
-->

``` kotlin
val l = mutableListOf(1, 2, 3)
l.swap(0, 2) // 'swap()' 中の 'this' は値 '1' を保持する
```

<!--original
``` kotlin
val l = mutableListOf(1, 2, 3)
l.swap(0, 2) // 'this' inside 'swap()' will hold the value of 'l'
```
-->

もちろん、任意の `MutableList<T>` についてこの関数は理にかなっており、ジェネリックにもできます：

<!--original
Of course, this function makes sense for any `MutableList<T>`, and we can make it generic:
-->

``` kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
  val tmp = this[index1] // 'this' はリストに対応する
  this[index1] = this[index2]
  this[index2] = tmp
}
```

<!--original
``` kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
  val tmp = this[index1] // 'this' corresponds to the list
  this[index1] = this[index2]
  this[index2] = tmp
}
```
-->

関数名の前でジェネリック型のパラメータを宣言すると、レシーバ型の式で使用できるようになります。[ジェネリック関数](generics.html)を参照してください。

<!--original
We declare the generic type parameter before the function name for it to be available in the receiver type expression. 
See [Generic functions](generics.html).
-->

## 拡張は **静的** に解決される

<!--original
## Extensions are resolved **statically**
-->

拡張機能は拡張したクラスを実際に変更するわけではありません。拡張を定義すると、クラスに新たなメンバを挿入するのではなく、そのクラスのインスタンスにおいて、ただ単にその新しい関数をただドット付きで呼べるようになるだけです。

<!--original
Extensions do not actually modify classes they extend. By defining an extension, you do not insert new members into a class,
but merely make new functions callable with the dot-notation on instances of this class.
-->

拡張関数は **静的に** 処理される、つまり、それらはレシーバの型による仮の存在ではないということを強調しておきたいです。これは、関数が呼び出されたときの式の型によって、呼び出される拡張関数が決定されるのであって、実行時の式の評価によるのではないことを意味します。例えば：

<!--original
We would like to emphasize that extension functions are dispatched **statically**, i.e. they are not virtual by receiver type.
This means that the extension function being called is determined by the type of the expression on which the function is invoked,
not by the type of the result of evaluating that expression at runtime. For example:
-->

``` kotlin
open class C

class D: C()

fun C.foo() = "c"

fun D.foo() = "d"

fun printFoo(c: C) {
    println(c.foo())
}

printFoo(D())
```

<!--original
``` kotlin
open class C

class D: C()

fun C.foo() = "c"

fun D.foo() = "d"

fun printFoo(c: C) {
    println(c.foo())
}

printFoo(D())
```
-->

この例では、 "c"を出力します。呼び出されている拡張関数は `C` クラスのパラメータ `c` の宣言型にのみ依存するためです。

<!--original
This example will print "c", because the extension function being called depends only on the declared type of the
parameter `c`, which is the `C` class.
-->

もし、あるクラスがメンバ関数を持つうえ、さらに、同じレシーバ型、同じ名前を有し、与えられた引数を受容可能な拡張関数が宣言されると、 **常にメンバが優先されます** 。例えば：

<!--original
If a class has a member function, and an extension function is defined which has the same receiver type, the same name
and is applicable to given arguments, the **member always wins**.
For example:
-->

``` kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo() { println("extension") }
```

<!--original
``` kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo() { println("extension") }
```
-->

`C` 型の任意の `c` から `c.foo()` を呼べば、"extension" ではなく、 "member" と表示します。

<!--original
If we call `c.foo()` of any `c` of type `C`, it will print "member", not "extension".
-->

しかしながら、異なる署名を持つが同名のメンバ関数を拡張関数がオーバライドすることは全く問題ありません：

<!--original
However, it's perfectly OK for extension functions to overload member functions which have the same name but a different signature:
-->

``` kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo(i: Int) { println("extension") }
```

<!--original
``` kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo(i: Int) { println("extension") }
```
-->

`C().foo(1)` の呼び出しで "extension" を表示します。

<!--original
The call to `C().foo(1)` will print "extension".

-->

## Null許容レシーバー

<!--original
## Nullable Receiver
-->

拡張は、null許容なレシーバの型で定義できることに注意してください。このような拡張は、その値がnullの場合でも、オブジェクト変数で呼び出すことができ、かつその本体内で `this == null` をチェックすることができます。これにより、null をチェックせずに Kotlin で toString() を呼び出すことができます。チェックは拡張関数内で行われます。

<!--original
Note that extensions can be defined with a nullable receiver type. Such extensions can be called on an object variable
even if its value is null, and can check for `this == null` inside the body. This is what allows you
to call toString() in Kotlin without checking for null: the check happens inside the extension function.
-->

``` kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // nullチェックの後だと、 'this' は非null型に自動キャストされるので、
    // 下記の toString() は Any クラスのメンバであると解決される
    return toString()
}
```

<!--original
``` kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // after the null check, 'this' is autocast to a non-null type, so the toString() below
    // resolves to the member function of the Any class
    return toString()
}
```
-->

## 拡張プロパティ

<!--original
## Extension Properties
-->

関数と同様、Kotlinは拡張プロパティをサポートしています。

<!--original
Similarly to functions, Kotlin supports extension properties:
-->

``` kotlin
val <T> List<T>.lastIndex: Int
  get() = size - 1
```

<!--original
``` kotlin
val <T> List<T>.lastIndex: Int
  get() = size - 1
```
-->

注意してほしいのは、拡張機能は、実際にはクラスにメンバを挿入しないので、拡張プロパティが[バッキングフィールド](properties.html#backing-fields)を持つ効率的な方法がない、ということです。これが **初期化子が、拡張プロパティでは許可されていない** 理由です。この挙動は、明示的にゲッター/セッターを作ることによって定義することのみができます。

<!--original
Note that, since extensions do not actually insert members into classes, there's no efficient way for an extension 
property to have a [backing field](properties.html#backing-fields). This is why **initializers are not allowed for 
extension properties**. Their behavior can only be defined by explicitly providing getters/setters.
-->

例：

<!--original
Example:
-->

``` kotlin
val Foo.bar = 1 // エラー：初期化子は拡張プロパティでは許可されていない
```


<!--original
``` kotlin
val Foo.bar = 1 // error: initializers are not allowed for extension properties
```

-->

## コンパニオンオブジェクトの拡張機能

<!--original
## Companion Object Extensions
-->

クラスに[コンパニオンオブジェクト](object-declarations.html#companion-objects)が定義されている場合は、コンパニオンオブジェクトの拡張関数とプロパティを定義することもできます。

<!--original
If a class has a [companion object](object-declarations.html#companion-objects) defined, you can also define extension
functions and properties for the companion object:
-->

``` kotlin
class MyClass {
  companion object { }  // "Companion" と呼ばれる
}

fun MyClass.Companion.foo() {
  // ...
}
```

<!--original
``` kotlin
class MyClass {
  companion object { }  // will be called "Companion"
}

fun MyClass.Companion.foo() {
  // ...
}
```
-->

ちょうどコンパニオンオブジェクトの普通のメンバと同じように、それらは修飾子としてクラス名のみを使用して呼び出すことができます。

<!--original
Just like regular members of the companion object, they can be called using only the class name as the qualifier:
-->

``` kotlin
MyClass.foo()
```


<!--original
``` kotlin
MyClass.foo()
```

-->

## 拡張関数のスコープ

<!--original
## Scope of Extensions
-->

ほとんどの場合、トップレベル、すなわちパッケージ直下に拡張を定義します：

<!--original
Most of the time we define extensions on the top level, i.e. directly under packages:
-->
 

-->

``` kotlin
package foo.bar
 
fun Baz.goo() { ... } 
``` 

<!--original
``` kotlin
package foo.bar
 
fun Baz.goo() { ... } 
``` 
-->

そのような拡張を宣言しているパッケージの外で使用するには、それを呼び出し箇所でインポートする必要があります：

<!--original
To use such an extension outside its declaring package, we need to import it at the call site:
-->

``` kotlin
package com.example.usage

import foo.bar.goo // "goo" という名前で全ての拡張をインポートする
                   // または
import foo.bar.*   // "foo.bar" から全てインポートする

fun usage(baz: Baz) {
  baz.goo()
)

```

<!--original
``` kotlin
package com.example.usage

import foo.bar.goo // importing all extensions by name "goo"
                   // or
import foo.bar.*   // importing everything from "foo.bar"

fun usage(baz: Baz) {
  baz.goo()
)

```
-->

詳細については、[インポート](packages.html#imports)を参照してください。

<!--original
See [Imports](packages.html#imports) for more information.
-->

## メンバとして拡張関数を宣言

<!--original
## Declaring Extensions as Members
-->

クラス内では、別のクラスの拡張を宣言することができます。そのような拡張の中には、複数の _暗黙的なレシーバ_があります。修飾子なしでアクセスできるオブジェクトのメンバです。拡張が宣言されているクラスのインスタンスは _ディスパッチレシーバ (dispatch receiver)_ と呼ばれ、拡張関数のレシーバ型のインスタンスは _拡張レシーバ_ と呼ばれます。

<!--original
Inside a class, you can declare extensions for another class. Inside such an extension, there are multiple _implicit receivers_ -
objects members of which can be accessed without a qualifier. The instance of the class in which the extension is declared is called
_dispatch receiver_, and the instance of the receiver type of the extension method is called _extension receiver_.
-->

``` kotlin
class D {
    fun bar() { ... }
}

class C {
    fun baz() { ... }

    fun D.foo() {
        bar()   // D.bar を呼ぶ
        baz()   // C.baz を呼ぶ
    }

    fun caller(d: D) {
        d.foo()   // 拡張関数を呼ぶ
    }
}
```

<!--original
``` kotlin
class D {
    fun bar() { ... }
}

class C {
    fun baz() { ... }

    fun D.foo() {
        bar()   // calls D.bar
        baz()   // calls C.baz
    }

    fun caller(d: D) {
        d.foo()   // call the extension function
    }
}
```
-->

ディスパッチレシーバのメンバーと拡張レシーバの名前が衝突する場合には、拡張レシーバが優先されます。ディスパッチレシーバのメンバを参照するには、[修飾子付き `this` の構文](this-expressions.html#qualified)を使用することができます。

<!--original
In case of a name conflict between the members of the dispatch receiver and the extension receiver, the extension receiver takes
precedence. To refer to the member of the dispatch receiver you can use the [qualified `this` syntax](this-expressions.html#qualified).
-->

``` kotlin
class C {
    fun D.foo() {
        toString()         // D.toString() を呼ぶ
        this@C.toString()  // C.toString() を呼ぶ
    }
```

<!--original
``` kotlin
class C {
    fun D.foo() {
        toString()         // calls D.toString()
        this@C.toString()  // calls C.toString()
    }
```
-->

メンバとして宣言された拡張関数は、 `open` として宣言され、サブクラスでオーバーライドすることができます。これは、そのような関数のディスパッチは、ディスパッチレシーバ型に関しては仮想的であるが、拡張レシーバ型に関しては静的であることを意味する。

<!--original
Extensions declared as members can be declared as `open` and overridden in subclasses. This means that the dispatch of such
functions is virtual with regard to the dispatch receiver type, but static with regard to the extension receiver type.
-->

``` kotlin
open class D {
}

class D1 : D() {
}

open class C {
    open fun D.foo() {
        println("D.foo in C")
    }

    open fun D1.foo() {
        println("D1.foo in C")
    }

    fun caller(d: D) {
        d.foo()   // 拡張関数を呼ぶ
    }
}

class C1 : C() {
    override fun D.foo() {
        println("D.foo in C1")
    }

    override fun D1.foo() {
        println("D1.foo in C1")
    }
}

C().caller(D())   // 出力： "D.foo in C"
C1().caller(D())  // 出力： "D.foo in C1" - ディスパッチレシーバは仮想的に解決される
C().caller(D1())  // 出力： "D.foo in C" - 拡張レシーバは静的に解決される
``` 


<!--original
``` kotlin
open class D {
}

class D1 : D() {
}

open class C {
    open fun D.foo() {
        println("D.foo in C")
    }

    open fun D1.foo() {
        println("D1.foo in C")
    }

    fun caller(d: D) {
        d.foo()   // call the extension function
    }
}

class C1 : C() {
    override fun D.foo() {
        println("D.foo in C1")
    }

    override fun D1.foo() {
        println("D1.foo in C1")
    }
}

C().caller(D())   // prints "D.foo in C"
C1().caller(D())  // prints "D.foo in C1" - dispatch receiver is resolved virtually
C().caller(D1())  // prints "D.foo in C" - extension receiver is resolved statically
``` 

-->

## 動機

<!--original
## Motivation
-->

Javaでは、 "*Utils" という名前のクラス（ `FileUtils` 、 `StringUtils` など）をよく使っていました。有名な `java.util.Collections` は、同じ品種に属します。そして、これらのUtils-クラスについての不快な部分は、それらを使用するコードが次のようになることです：

<!--original
In Java, we are used to classes named "\*Utils": `FileUtils`, `StringUtils` and so on. The famous `java.util.Collections` belongs to the same breed.
And the unpleasant part about these Utils-classes is that the code that uses them looks like this:
-->

``` java
// Java
Collections.swap(list, Collections.binarySearch(list, Collections.max(otherList)), Collections.max(list))
```

<!--original
``` java
// Java
Collections.swap(list, Collections.binarySearch(list, Collections.max(otherList)), Collections.max(list))
```
-->

これらのクラス名は常に邪魔になってきます。static インポートを使用すると、これをこうすることができます：

<!--original
Those class names are always getting in the way. We can use static imports and get this:
-->

``` java
// Java
swap(list, binarySearch(list, max(otherList)), max(list))
```

<!--original
``` java
// Java
swap(list, binarySearch(list, max(otherList)), max(list))
```
-->

これは少しだけマシですが、IDEの強力なコード補完の助けを全くまたはほんの少ししか得られません。次のようにできるならば、それはとても良いでしょう：

<!--original
This is a little better, but we have no or little help from the powerful code completion of the IDE. It would be so much better if we could say
-->

``` java
// Java
list.swap(list.binarySearch(otherList.max()), list.max())
```

<!--original
``` java
// Java
list.swap(list.binarySearch(otherList.max()), list.max())
```
-->

でも、 `List` クラスの中に考えられるすべてのメソッドを実装したいというわけではありませんよね？このようなときに拡張が私たちを助けてくれます。

<!--original
But we don't want to implement all the possible methods inside the class `List`, right? This is where extensions help us.
-->