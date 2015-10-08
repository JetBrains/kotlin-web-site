---
type: doc
layout: reference
category: "Basics"
title: "Idioms"
---

# Kotlin特点

一些在 Kotlin 中广泛使用的语法习惯，如果你有更喜欢的语法习惯或者风格，pull一个request贡献给我们吧！

### 创建方便任务间传递的数据 DTO's (POJO's/POCO's)

``` kotlin
data class Customer(val name: String, val email: String)
```

会为 `Customer` 类提供以下功能：

* getters (还有 setters )， 所有以 *var*{: .keyword }'s) 标记的类属性都会自动生成
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* `component1()`, `component2()`, ..., 所有属性都会生成 (参阅 [Data classes](data-classes.html))


### 函数默认参数

``` kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

### 过滤链表

``` kotlin
val positives = list.filter { x -> x > 0 }
```

或者可以更短:

``` kotlin
val positives = list.filter { it > 0 }
```

### String内插入String

``` kotlin
println("Name $name")
```

### 类型判断

``` kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

### 遍历 map/list 中的键值对

``` kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

`k`, `v` 可以改成任意名字.

### 使用区间 ranges

``` kotlin
for (i in 1..100) { ... }
for (x in 2..10) { ... }
```

### 只读链表

``` kotlin
val list = listOf("a", "b", "c")
```

### 只读表

``` kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

### 表的访问与赋值

``` kotlin
println(map["key"])
map["key"] = value
```

### 延迟属性

``` kotlin
val p: String by lazy {
    // compute the string
}
```

### 扩展函数

``` kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

### 创建单例

``` kotlin
object Resource {
    val name = "Name"
}
```

### If not null 缩写

``` kotlin
val files = File("Test").listFiles()

println(files?.size)
```

files?.size 等价于 if (files != null) files.size else null

### If not null and else 缩写

``` kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty")
```

### if null 缩写

``` kotlin
val data = ...
val email = data["email"] ?: throw IllegalStateException("Email is missing!")
```

### if not null 缩写

``` kotlin
val data = ...

data?.let {
    ... // 代码会执行到此处, 假如data不为null
}
```

### when表达式具有返回值

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

### 'try/catch' 表达式也具有返回值

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

### 'if' 表达式你猜

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

### 返回类型为 `Unit` 的方法，可以轻松实现类Builder模式的代码风格

``` kotlin
fun arrayOfMinusOnes(size: Int) {
    return IntArray(size).apply { fill(-1) }
}
```


### 单表达式函数

``` kotlin
fun theAnswer() = 42
```

等价于

``` kotlin
fun theAnswer(): Int {
    return 42
}
```

单表达式函数与其它kotlin风格一起使用的时候，能简化代码，比如和 *when*{: .keyword } 表达式一起使用：

``` kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```
