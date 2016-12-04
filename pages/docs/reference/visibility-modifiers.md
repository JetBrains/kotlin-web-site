---
type: doc
layout: reference
category: "Classes and Objects"
title: "可視性修飾子"
---

<!--original
- --
type: doc
layout: reference
category: "Classes and Objects"
title: "Visibility Modifiers"
- --
-->

# 可視性修飾子

<!--original
# Visibility Modifiers
-->

クラス、オブジェクト、インタフェース、コンストラクタ、関数、プロパティとそのセッターは、_可視性修飾子 (visibility modifiers)_ を持つことができます。（ゲッターは常にプロパティと同じ可視性を持ちます。）Kotlinには4つの可視性修飾子があります： `private` , `protected` , `internal` , `public` 。明示的な修飾子がない場合に使用されるデフォルトの可視性は、`public` です。

<!--original
Classes, objects, interfaces, constructors, functions, properties and their setters can have _visibility modifiers_.
(Getters always have the same visibility as the property.) 
There are four visibility modifiers in Kotlin: `private`, `protected`, `internal` and `public`.
The default visibility, used if there is no explicit modifier, is `public`.
-->

宣言スコープの違いは、後述の例をご覧ください。

<!--original
Below please find explanations of these for different type of declaring scopes.
-->
  
## パッケージ

<!--original
## Packages
-->
  

関数、プロパティやクラス、オブジェクトやインターフェースは、「トップレベル」、つまり、パッケージ内部で直接宣言することができます。

<!--original
Functions, properties and classes, objects and interfaces can be declared on the "top-level", i.e. directly inside a package:
-->
  
``` kotlin
// ファイル名: example.kt
package foo

fun baz() {}
class Bar {}
```

<!--original
``` kotlin
// file name: example.kt
package foo

fun baz() {}
class Bar {}
```
-->

* 可視性修飾子を何も指定しない場合は、宣言がどこでも見える `public` がデフォルトして使用されます。
* `private` として宣言すると、その宣言を含むファイルの中でのみ見えます
* `internal` として宣言すると、同じモジュール内のどこからでも見えます
* `protected` はトップレベルの宣言では使用できません

<!--original
* If you do not specify any visibility modifier, `public` is used by default, which means that your declarations will be
visible everywhere;
* If you mark a declaration `private`, it will only be visible inside the file containing the declaration;
* If you mark it `internal`, it is visible everywhere in the same module;
* `protected` is not available for top-level declarations.
-->

例：

<!--original
Examples:
-->

``` kotlin
// ファイル名: example.kt
package foo

private fun foo() {} // example.kt の中で見える

public var bar: Int = 5 // プロパティはどこでも見える
    private set         // セッターは example.kt の中でのみ見える
    
internal val baz = 6    // 同じモジュール内でのみ見える
```

<!--original
``` kotlin
// file name: example.kt
package foo

private fun foo() {} // visible inside example.kt

public var bar: Int = 5 // property is visible everywhere
    private set         // setter is visible only in example.kt
    
internal val baz = 6    // visible inside the same module
```
-->

## クラスとインタフェース

<!--original
## Classes and Interfaces
-->

クラス内で宣言した場合：

<!--original
When declared inside a class:
-->

* `private` はそのクラス内（そのすべてのメンバーを含む）でのみ見える
* `protected` -- `private` と同じ + サブクラス内でも見えます
* `internal` -- `internal` 宣言するクラスを見る *そのモジュール内の* 任意のクライアントはその `internal` メンバが見えます
* `public` -- `public` 宣言するクラスを見ている任意のクライアントは、`public` のメンバが見えます

<!--original
* `private` means visible inside this class only (including all its members);
* `protected` --- same as `private` + visible in subclasses too;
* `internal` --- any client *inside this module* who sees the declaring class sees its `internal` members;
* `public` --- any client who sees the declaring class sees its `public` members.
-->

*注意* Javaのユーザーへ：Kotlinでは、外部クラスはその内部クラスのprivate メンバが見えません。

<!--original
*NOTE* for Java users: outer class does not see private members of its inner classes in Kotlin.
-->

`protected` のメンバをオーバーライドして、明示的に可視性を指定しない場合、オーバーライドするメンバも、`protected` の可視性になります。

<!--original
If you override a `protected` member and do not specify the visibility explicitly, the overriding member will also have `protected` visibility.
-->

例：

<!--original
Examples:
-->

``` kotlin
open class Outer {
    private val a = 1
    protected open val b = 2
    internal val c = 3
    val d = 4  // デフォルトで public
    
    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a は見えない
    // b, c, d は見える
    // Nested と e は見える

    override val b = 5   // 'b' は protected
}

class Unrelated(o: Outer) {
    // o.a, o.b は見えない
    // o.c and o.d は見える（同じモジュール）
    // Outer.Nested, Nested::e は見えない
}
```

<!--original
``` kotlin
open class Outer {
    private val a = 1
    protected open val b = 2
    internal val c = 3
    val d = 4  // public by default
    
    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a is not visible
    // b, c and d are visible
    // Nested and e are visible

    override val b = 5   // 'b' is protected
}

class Unrelated(o: Outer) {
    // o.a, o.b are not visible
    // o.c and o.d are visible (same module)
    // Outer.Nested is not visible, and Nested::e is not visible either 
}
```
-->

### コンストラクタ

<!--original
### Constructors
-->

クラスのプライマリコンストラクタの可視性を指定したい場合は、次の構文を使ってください（明示的に *constructor*{: .keyword }* キーワードを付加しなければならないことに注意）：

<!--original
To specify a visibility of the primary constructor of a class, use the following syntax (note that you need to add an
explicit *constructor*{: .keyword } keyword):
-->

``` kotlin
class C private constructor(a: Int) { ... }
```

<!--original
``` kotlin
class C private constructor(a: Int) { ... }
```
-->

ここでは、コンストラクタは `private` です。デフォルトでは、すべてのコンストラクタが `public` です。これにより、そのクラスが見える場所であればどこからでもそのクラスを見ることができます。（すなわち、 `internal` クラスのコンストラクタは、同じモジュール内でのみ見えます）

<!--original
Here the constructor is private. By default, all constructors are `public`, which effectively
amounts to them being visible everywhere where the class is visible (i.e. a constructor of an `internal` class is only 
visible within the same module).
-->
     
### ローカル宣言

<!--original
### Local declarations
-->
     
ローカル変数、関数やクラスは、可視性修飾子を持つことはできません。

<!--original
Local variables, functions and classes can not have visibility modifiers.
-->

## モジュール

<!--original
## Modules
-->

`internal` 可視性修飾子には、メンバが同じモジュールで見えることを意味します。具体的には、モジュールはKotlinのファイルセットであり、一緒にコンパイルされます。

<!--original
The `internal` visibility modifier means that the member is visible with the same module. More specifically,
a module is a set of Kotlin files compiled together:
-->

  * IntelliJ IDEAモジュール
  * MavenやGradleのプロジェクト
  * &lt;kotlinc&gt;Antタスクの1回の呼び出しでコンパイルされたファイルのセット

<!--original
  * an IntelliJ IDEA module;
  * a Maven or Gradle project;
  * a set of files compiled with one invocation of the <kotlinc> Ant task.
-->