---
type: doc
layout: reference
category: "Basics"
title: "Idioms"
---

<!--- # Idioms -->

# 慣用句

<!--- A collection of random and frequently used idioms in Kotlin. If you have a favorite idiom, contribute it. Do a pull request. -->
Kotlinでよく使用される慣用句を集めた。もし好みの慣用句があるならプルリクエストを投げて貢献して欲しい。

<!--- ### Creating DTO's (POJO's/POCO's) -->

### DTOを作成する (POJO/POCO)

``` kotlin
data class Customer(val name: String, val email: String)
```

<!--- provides a `Customer` class with the following functionality: -->
`Customer`クラスは次の機能を提供する：

<!---
* getters (and setters in case of *var*{: .keyword }'s) for all properties
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* `component1()`, `component2()`, ..., for all properties (see [Data classes](data-classes.html))
-->

* 全てのプロパティに対するゲッター (そして*var*{: .keyword }キーワードが使用されたときはセッターも )
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* すべてのプロパティに対して、`component1()`, `component2()`, ..., ([Data classes](data-classes.html)を参照のこと。)


<!--- ### Default values for function parameters -->

### 関数の引数に対するデフォルト値

``` kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

<!--- ### Filtering a list -->

### リストのフィルタ

``` kotlin
val positives = list.filter { x -> x > 0 }
```

<!--- Or alternatively, even shorter: -->
または、こう短くも書ける：

``` kotlin
val positives = list.filter { it > 0 }
```

<!--- ### String Interpolation -->

### Stringの補完

``` kotlin
println("Name $name")
```

<!--- ### Instance Checks -->

### インスタンスのチェック

``` kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

<!--- ### Traversing a map/list of pairs -->

### mapやlistのペアを書き下す

``` kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

<!--- `k`, `v` can be called anything. -->
`k`, `v`の名前は特に定まっていない。

<!--- ### Using ranges -->

### 範囲の使用

``` kotlin
for (i in 1..100) { ... }
for (x in 2..10) { ... }
```

<!--- ### Read-only list -->

### 読み取り専用のlist

``` kotlin
val list = listOf("a", "b", "c")
```

<!--- ### Read-only map -->

### 読み取り専用のmap

``` kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

<!--- ### Accessing a map -->

### mapにアクセスする

``` kotlin
println(map["key"])
map["key"] = value
```

<!--- ### Lazy property -->

### 遅延評価プロパティ

<!---
``` kotlin
val p: String by lazy {
    // compute the string
}
```
-->

``` kotlin
val p: String by lazy {
    // 文字列を計算する
}
```

<!--- ### Extension Functions -->

### 拡張関数

``` kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

<!--- ### Creating a singleton -->

### シングルトンの作成

``` kotlin
object Resource {
    val name = "Name"
}
```

<!--- ### If not null shorthand -->

### if not nullの速記法

``` kotlin
val files = File("Test").listFiles()

println(files?.size)
```

<!--- ### If not null and else shorthand -->

### if not null and elseの速記法

``` kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty")
```

<!--- ### Executing a statement if null -->

### if null文の実行

``` kotlin
val data = ...
val email = data["email"] ?: throw IllegalStateException("Email is missing!")
```

<!--- ### Execute if not null -->

### if not nullの実行

<!---
``` kotlin
val data = ...

data?.let {
    ... // execute this block if not null
}
```
-->

``` kotlin
val data = ...

data?.let {
    ... // nullでなければこのブロックが実行される
}
```

<!--- ### Return on when statement -->

### when文でreturnする

``` kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}
```

<!--- ### 'try/catch' expression -->

### 'try/catch'式

<!---
``` kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // Working with result
}
```
-->

``` kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // resultを使用する
}
```

<!--- ### 'if' expression -->

### 'if'式

``` kotlin
fun foo(param: Int) {
    val result = if (param == 1) {
        "one"
    } else if (param == 2) {
        "two"
    } else {
        "three"
    }
}
```

<!--- ### Builder-style usage of methods that return `Unit` -->

### `Unit`を返すビルダースタイルの使用

``` kotlin
fun arrayOfMinusOnes(size: Int) {
    return IntArray(size).apply { fill(-1) }
}
```


<!--- ### Single-expression functions -->

### 単一行関数

``` kotlin
fun theAnswer() = 42
```

<!--- This is equivalent to -->
これは次と同等である：

``` kotlin
fun theAnswer(): Int {
    return 42
}
```

<!--- This can be effectively combined with other idioms, leading to shorter code. E.g. with the *when*{: .keyword }-expression: -->
これは他の慣用句と組み合わせることができ、コードを短くすることにつながる。例） *when*{: .keyword }-式:

``` kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

<!--- ### Calling multiple methods on an object instance ('with') -->

### あるオブジェクトのインスタンスで 'with' を使って複数の関数を呼ぶ

<!---``` kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { //draw a 100 pix square
    penDown()
    for(i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```-->

``` kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { // 100ピクセル四方の四角形を描く
    penDown()
    for(i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

<!--- ### Java 7's try with resources -->

### Java 7のtry-with-resources

``` kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```
