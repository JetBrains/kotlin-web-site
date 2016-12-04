---
type: doc
layout: reference
category: "Syntax"
title: "パッケージ"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Packages"
- --
-->

# パッケージ

<!--original
# Packages
-->

パッケージ宣言をするときは、ソースファイルの先頭に書いてください。

<!--original
A source file may start with a package declaration:
-->

``` kotlin
package foo.bar

fun baz() {}

class Goo {}

// ...
```

<!--original
``` kotlin
package foo.bar

fun baz() {}

class Goo {}

// ...
```
-->

ソースファイルの（このようなクラスや関数など）全ての内容は宣言パッケージに含まれています。従って、次の例で示すとおり、`baz()`の完全名は`foo.bar.baz`であり、`Goo`の完全名は`foo.bar.Goo`です。

<!--original
All the contents (such as classes and functions) of the source file are contained by the package declared.
So, in the example above, the full name of `baz()` is `foo.bar.baz`, and the full name of `Goo` is `foo.bar.Goo`. 
-->
 

もしパッケージが指定されない場合は、ファイルの内容は名前を持たない”default”パッケージに属することになる。

<!--original
If the package is not specified, the contents of such a file belong to "default" package that has no name.
-->

## インポート

<!--original
## Imports
-->

標準のインポートとは違い、それぞれのファイルは独自のインポートディレクティブを含んでもかまいません。
インポートの文法は、[文法](grammar.html#import)に記載されています。

<!--original
Apart from the default imports, each file may contain its own import directives.
Syntax for imports is described in the [grammar](grammar.html#import).
-->

単一の名前を指定してインポートできます。例：

<!--original
We can import either a single name, e.g.
-->

``` kotlin
import foo.Bar // Barは許可無しでアクセス可能になります
```

<!--original
``` kotlin
import foo.Bar // Bar is now accessible without qualification
```
-->

または、あるスコープ（パッケージ、クラス、オブジェクト等）内の全てのアクセス可能なコンテンツの場合：

<!--original
or all the accessible contents of a scope (package, class, object etc):
-->

``` kotlin
import foo.* // 'foo'内の全てがアクセス可能になります
```

<!--original
``` kotlin
import foo.* // everything in 'foo' becomes accessible
```
-->

名前の衝突がある場合、*as*{: .keyword }キーワードを使用して衝突するエンティティを局所的にリネームすることで明確にできます：

<!--original
If there is a name clash, we can disambiguate by using *as*{: .keyword } keyword to locally rename the clashing entity:
-->

``` kotlin
import foo.Bar // Barはアクセス可能
import bar.Bar as bBar // bBarは'bar.Bar'を意味する
```

<!--original
``` kotlin
import foo.Bar // Bar is accessible
import bar.Bar as bBar // bBar stands for 'bar.Bar'
```
-->

import キーワードはクラスをインポートするために限定されるわけではありません。他の宣言をインポートするために使用することができます：

<!--original
The `import` keyword is not restricted to importing classes; you can also use it to import other declarations:
-->

* トップレベルの関数とプロパティ
* [オブジェクトの宣言](object-declarations.html#object-declarations)で宣言された関数とプロパティ
* [enum定数](enum-classes.html)

<!--original
  * top-level functions and properties;
  * functions and properties declared in [object declarations](object-declarations.html#object-declarations);
  * [enum constants](enum-classes.html)
-->

Javaとは違って、Kotlinは別の"import static"構文を持っていません。全ての宣言は普通の`import`キーワードによってインポートされます。

<!--original
Unlike Java, Kotlin does not have a separate "import static" syntax; all of these declarations are imported using the regular `import` keyword.
-->

## トップレベル宣言の可視性

<!--original
## Visibility of Top-level Declarations
-->

もしトップレベルの宣言に*private*{: .keyword }マークがついていれば、それが宣言されたファイル内に対しプライベートです。 （[可視性修飾子](visibility-modifiers.html) を参照してください。）

<!--original
If a top-level declaration is marked *private*{: .keyword }, it is private to the file it's declared in (see [Visibility Modifiers](visibility-modifiers.html)).
-->