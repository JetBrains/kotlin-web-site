---
type: doc
layout: reference
category: "Classes and Objects"
title: "データクラス"
---

<!--original
- --
type: doc
layout: reference
category: "Classes and Objects"
title: "Data Classes"
- --
-->

# データクラス

<!--original
# Data Classes
-->

何もしない、データを保持するためだけのクラスを作成することはよくあります。そのようなクラスでは、いくつかの標準機能は、データから機械的に推論できます。Kotlinでは、これは _データクラス_ と呼ばれ、 `data` としてマークされています。

<!--original
We frequently create a class to do nothing but hold data. In such a class some standard functionality is often mechanically
derivable from the data. In Kotlin, this is called a _data class_ and is marked as `data`:
-->
 
``` kotlin
data class User(val name: String, val age: Int)
```

<!--original
``` kotlin
data class User(val name: String, val age: Int)
```
-->

プライマリコンストラクタで宣言されたすべてのプロパティから、コンパイラは自動的に次のメンバを推論します：

<!--original
The compiler automatically derives the following members from all properties declared in the primary constructor:
-->
  
  * `equals()` / `hashCode()` のペア、
  * `"User(name=John, age=42)"` 形式の `toString()` 、
  * 宣言した順番でプロパティに対応する [`componentN()` 関数](multi-declarations.html)、
  * `copy()` 関数（下記参照）。

<!--original
  * `equals()`/`hashCode()` pair, 
  * `toString()` of the form `"User(name=John, age=42)"`,
  * [`componentN()` functions](multi-declarations.html) corresponding to the properties in their order of declaration,
  * `copy()` function (see below).
-->
  
これらの機能のいずれかが明示的にクラス本体に定義されているか、基本型から継承されている場合は、生成されません。

<!--original
If any of these functions is explicitly defined in the class body or inherited from the base types, it will not be generated.
-->

生成されたコードの一貫性と意味のある動作を保証するために、データクラスは、次の要件を満たさなければなりません：

<!--original
To ensure consistency and meaningful behavior of the generated code, data classes have to fulfil the following requirements:
-->

  * プライマリコンストラクタは、少なくとも1つのパラメータを持っている必要があります。
  * すべてのプライマリコンストラクタのパラメータは、 `val` または `var` としてマークする必要があります。
  * データクラスは、 abstract, open, sealed または inner にすることはできません。
  * データクラスは他のクラスを拡張しない場合があります（ただし、インターフェイスを実装することはできます）。

<!--original
  * The primary constructor needs to have at least one parameter;
  * All primary constructor parameters need to be marked as `val` or `var`;
  * Data classes cannot be abstract, open, sealed or inner;
  * Data classes may not extend other classes (but may implement interfaces).
-->
  
> JVM上で、生成されたクラスがパラメータなしのコンストラクタを持つ必要がある場合は、すべてのプロパティのデフォルト値を指定する必要があります（[コンストラクタ](classes.html#constructors)を参照してください）。
>
> ``` kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```

<!--original
> On the JVM, if the generated class needs to have a parameterless constructor, default values for all properties have to be specified
> (see [Constructors](classes.html#constructors)).
>
> ``` kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
-->

## コピー

<!--original
## Copying
-->
  
プロパティの _いくつか_ を変更し、残りをそのままにしてオブジェクトをコピーする、ということが必要になるのはよくあることです。これが `copy()` 関数が作成される理由です。次のような `User` クラスの場合、その実装は次のようになります。

<!--original
It's often the case that we need to copy an object altering _some_ of its properties, but keeping the rest unchanged. 
This is what `copy()` function is generated for. For the `User` class above, its implementation would be as follows:
-->

``` kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)     
```     

<!--original
``` kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)     
```     
-->

これは次のように書くことができます：

<!--original
This allows us to write
-->

``` kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

<!--original
``` kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```
-->

## データクラスと分解宣言 (Destructuring Declarations)

<!--original
## Data Classes and Destructuring Declarations
-->

データクラスのために生成した _コンポーネント関数_ は、[分解宣言](multi-declarations.html)内で使用できます。

<!--original
_Component functions_ generated for data classes enable their use in [destructuring declarations](multi-declarations.html):
-->

``` kotlin
val jane = User("Jane", 35) 
val (name, age) = jane
println("$name, $age years of age") // "Jane, 35 years of age" を出力する
```

<!--original
``` kotlin
val jane = User("Jane", 35) 
val (name, age) = jane
println("$name, $age years of age") // prints "Jane, 35 years of age"
```
-->

## 標準データクラス

<!--original
## Standard Data Classes
-->

標準ライブラリは、 `Pair` と `Triple` を提供します。プロパティのために意味のある名前を提供することにより、コードを読みやすくするため、というのが理由です。ほとんどのケースでは、名前付きデータクラスは、設計上のより良い選択ですが。

<!--original
The standard library provides `Pair` and `Triple`. In most cases, though, named data classes are a better design choice, 
because they make the code more readable by providing meaningful names for properties.
-->