---
type: doc
layout: reference
category: "Basics"
title: "イディオム"
---

<!--original
- --
type: doc
layout: reference
category: "Basics"
title: "Idioms"
- --
-->

# イディオム

<!--original
# Idioms
-->

Kotlinでよく使用されるイディオムを集めました。もし好みのイディオムがあれば、プルリクエストを投げて貢献してください。

<!--original
A collection of random and frequently used idioms in Kotlin. If you have a favorite idiom, contribute it. Do a pull request.
-->

DTOの作成（POJO/ POCO）

<!--original
### Creating DTO's (POJO's/POCO's)
-->

``` kotlin
data class Customer(val name: String, val email: String)
```

<!--original
``` kotlin
data class Customer(val name: String, val email: String)
```
-->

`Customer`クラスは次の機能を提供します：

<!--original
provides a `Customer` class with the following functionality:
-->

* 全てのプロパティのゲッター（と*var*{: .keyword }キーワードが使用されたときはセッターも）
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* すべてのプロパティに対して、`component1()`, `component2()`, …, （[Data classes](data-classes.html)を参照してください）
関数の引数に対するデフォルト値

<!--original
* getters (and setters in case of *var*{: .keyword }'s) for all properties
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* `component1()`, `component2()`, ..., for all properties (see [Data classes](data-classes.html))
-->

### 関数の引数に対するデフォルト値

<!--original
### Default values for function parameters
-->

``` kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

<!--original
``` kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```
-->

### リストのフィルタリング

<!--original
### Filtering a list
-->

``` kotlin
val positives = list.filter { x -> x > 0 }
```

<!--original
``` kotlin
val positives = list.filter { x -> x > 0 }
```
-->

または、こう短くも書けます：

<!--original
Or alternatively, even shorter:
-->

``` kotlin
val positives = list.filter { it > 0 }
```

<!--original
``` kotlin
val positives = list.filter { it > 0 }
```
-->

### 文字列補完

<!--original
### String Interpolation
-->

``` kotlin
println("Name $name")
```

<!--original
``` kotlin
println("Name $name")
```
-->

### インスタンスのチェック

<!--original
### Instance Checks
-->

``` kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

<!--original
``` kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```
-->

### mapやlistのペアを書き下す

<!--original
### Traversing a map/list of pairs
-->

``` kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

<!--original
``` kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```
-->

`k`, `v`は何からでも呼び出すことができます。

<!--original
`k`, `v` can be called anything.
-->

### 範囲の使用

<!--original
### Using ranges
-->

``` kotlin
for (i in 1..100) { ... }
for (x in 2..10) { ... }
```

<!--original
``` kotlin
for (i in 1..100) { ... }
for (x in 2..10) { ... }
```
-->

### 読み取り専用list

<!--original
### Read-only list
-->

``` kotlin
val list = listOf("a", "b", "c")
```

<!--original
``` kotlin
val list = listOf("a", "b", "c")
```
-->

### 読み取り専用map

<!--original
### Read-only map
-->

``` kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

<!--original
``` kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```
-->

### mapへのアクセス

<!--original
### Accessing a map
-->

``` kotlin
println(map["key"])
map["key"] = value
```

<!--original
``` kotlin
println(map["key"])
map["key"] = value
```
-->

### 遅延評価プロパティ

<!--original
### Lazy property
-->

``` kotlin
val p: String by lazy {
    // 文字列を評価
}
```

<!--original
``` kotlin
val p: String by lazy {
    // compute the string
}
```
-->

### 拡張関数

<!--original
### Extension Functions
-->

``` kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

<!--original
``` kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```
-->

### シングルトンの作成

<!--original
### Creating a singleton
-->

``` kotlin
object Resource {
    val name = "Name"
}
```

<!--original
``` kotlin
object Resource {
    val name = "Name"
}
```
-->

### if not nullの省略記法

<!--original
### If not null shorthand
-->

``` kotlin
val files = File("Test").listFiles()

println(files?.size)
```

<!--original
``` kotlin
val files = File("Test").listFiles()

println(files?.size)
```
-->

### if not null and elseの省略記法

<!--original
### If not null and else shorthand
-->

``` kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty")
```

<!--original
``` kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty")
```
-->

### if null文の実行

<!--original
### Executing a statement if null
-->

``` kotlin
val data = ...
val email = data["email"] ?: throw IllegalStateException("Email is missing!")
```

<!--original
``` kotlin
val data = ...
val email = data["email"] ?: throw IllegalStateException("Email is missing!")
```
-->

### if not null文の実行

<!--original
### Execute if not null
-->

``` kotlin
val data = ...

data?.let {
    ... // nullでなければこのブロックを実行する
}
```

<!--original
``` kotlin
val data = ...

data?.let {
    ... // execute this block if not null
}
```
-->

### when文でreturnする

<!--original
### Return on when statement
-->

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

<!--original
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
-->

### 'try / catch'式

<!--original
### 'try/catch' expression
-->

``` kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // resultを使って何かする
}
```

<!--original
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

### 'if'式

<!--original
### 'if' expression
-->

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

<!--original
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
-->

### Unitを返すメソッドのビルダースタイルの使用

<!--original
### Builder-style usage of methods that return `Unit`
-->

``` kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```

<!--original
``` kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```
-->


### 単一式関数

<!--original
### Single-expression functions
-->

``` kotlin
fun theAnswer() = 42
```

<!--original
``` kotlin
fun theAnswer() = 42
```
-->

これは次と等価です：

<!--original
This is equivalent to
-->

``` kotlin
fun theAnswer(): Int {
    return 42
}
```

<!--original
``` kotlin
fun theAnswer(): Int {
    return 42
}
```
-->


これは他のイディオムと組み合わせることができ、コードを短くすることにつながります。例） *when*{: .keyword }-式：

<!--original
This can be effectively combined with other idioms, leading to shorter code. E.g. with the *when*{: .keyword }-expression:
-->

``` kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

<!--original
``` kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```
-->

### 'with' を使って、あるオブジェクトのインスタンスで複数の関数を呼ぶ

<!--original
### Calling multiple methods on an object instance ('with')
-->

``` kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { // 100pxの四角形を描く
    penDown()
    for(i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

<!--original
``` kotlin
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
```
-->

### Java 7のtry-with-resources

<!--original
### Java 7's try with resources
-->

``` kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```

<!--original
``` kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```
-->