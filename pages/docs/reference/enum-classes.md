---
type: doc
layout: reference
category: "Syntax"
title: "列挙型クラス"
---

<!--original
- --
type: doc
layout: reference
category: "Syntax"
title: "Enum Classes"
- --
-->

# 列挙型クラス (Enum Classes)

<!--original
# Enum Classes
-->

列挙型クラスの最も基本的な使用法は、型安全な列挙型を実装しています：

<!--original
The most basic usage of enum classes is implementing type-safe enums
-->

``` kotlin
enum class Direction {
  NORTH, SOUTH, WEST, EAST
}
```

<!--original
``` kotlin
enum class Direction {
  NORTH, SOUTH, WEST, EAST
}
```
-->

各列挙型の定数はオブジェクトです。列挙型定数はカンマで区切られます。

<!--original
Each enum constant is an object. Enum constants are separated with commas.
-->

## 初期化

<!--original
## Initialization
-->

各列挙型は列挙型クラスのインスタンスなので、初期化することができます：

<!--original
Since each enum is an instance of the enum class, they can be initialized
-->

``` kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

<!--original
``` kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```
-->

## 無名クラス

<!--original
## Anonymous Classes
-->

列挙型定数は、独自の無名クラスを宣言することができます：

<!--original
Enum constants can also declare their own anonymous classes
-->

``` kotlin
enum class ProtocolState {
  WAITING {
    override fun signal() = TALKING
  },

  TALKING {
    override fun signal() = WAITING
  };

  abstract fun signal(): ProtocolState
}
```

<!--original
``` kotlin
enum class ProtocolState {
  WAITING {
    override fun signal() = TALKING
  },

  TALKING {
    override fun signal() = WAITING
  };

  abstract fun signal(): ProtocolState
}
```
-->

それらに対応するメソッド、オーバーライドした基本メソッドも同様に併せて宣言できます。列挙型クラスでメンバが定義されている場合は、Javaの場合と同様に、メンバ定義から 列挙型 定数定義をセミコロンで区切る必要があります。

<!--original
with their corresponding methods, as well as overriding base methods. Note that if the enum class defines any
members, you need to separate the enum constant definitions from the member definitions with a semicolon, just like
in Java.
-->

## 列挙型定数を使用した作業

<!--original
## Working with Enum Constants
-->

ちょうどJavaと同じように、Kotlinの列挙型クラスは、定義された列挙型定数を羅列し、その名前で列挙型定数を得ることを可能にする合成メソッドを持っています。（列挙型クラスの名前を `EnumClass` と仮定して）これらのメソッドのシグネチャは次のとおりです。

<!--original
Just like in Java, enum classes in Kotlin have synthetic methods allowing to list
the defined enum constants and to get an enum constant by its name. The signatures
of these methods are as follows (assuming the name of the enum class is `EnumClass`):
-->

``` kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.values(): Array<EnumClass>
```

<!--original
``` kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.values(): Array<EnumClass>
```
-->

指定された名前が、クラスで定義されている列挙型定数のいずれとも一致しない場合、`valueOf()` メソッドは `IllegalArgumentException` をスローします。

<!--original
The `valueOf()` method throws an `IllegalArgumentException` if the specified name does
not match any of the enum constants defined in the class.
-->

すべての列挙型定数は、列挙型クラス宣言でその名前と位置を取得するためのプロパティがあります。

<!--original
Every enum constant has properties to obtain its name and position in the enum class declaration:
-->

``` kotlin
val name: String
val ordinal: Int
```

<!--original
``` kotlin
val name: String
val ordinal: Int
```
-->

列挙型定数は列挙型クラスで定義された順序である自然な順序で、[Comparable](/api/latest/jvm/stdlib/kotlin/-comparable/index.html) インタフェースも実装します。

<!--original
The enum constants also implement the [Comparable](/api/latest/jvm/stdlib/kotlin/-comparable/index.html) interface,
with the natural order being the order in which they are defined in the enum class.
-->