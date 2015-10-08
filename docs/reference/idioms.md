---
type: doc
layout: reference
category: "Basics"
title: "Idioms"
---

# 习惯用法

一些在使用Kotlin时候的习惯用法.如果你有一个特别好的用法你可以发起一个pull request.

### 创建 DTO's (POJO's/POCO's)

``` kotlin
data class Customer(val name: String, val email: String)
```

创建一个 `Customer` 类同时具有下面这些方法:

* getters (and setters 方法对于所有的 *var*{: .keyword }的属性) 
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* `component1()`, `component2()`, ..., 对于所有属性 (查看 [Data classes](data-classes.html))

### 定义常量

``` kotlin
val a = foo()
```

### 函数参数带有默认值

``` kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

### 过滤一个list

``` kotlin
val positives = list.filter { x -> x > 0 }
```

或者更短一些

``` kotlin
val positives = list.filter { it > 0 }
```

### 字符串插入值

``` kotlin
println("Name $name")
```

### 检查实例

``` kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

### 遍历map

``` kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

`k`, `v` 可以是其他任何名称.

### 使用范围

``` kotlin
for (i in 1..100) { ... }
for (x in 2..10) { ... }
```

### 只读list

``` kotlin
val list = listOf("a", "b", "c")
```

### 只读map

``` kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

### 访问map

``` kotlin
println(map["key"])
map["key"] = value
```

### Lazy属性

``` kotlin
val p: String by Delegates.lazy {
    // compute the string
}
```

### 拓展方法

``` kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

### 创建一个单例

``` kotlin
object Resource {
    val name = "Name"
}
```

### If not null的快速写法

``` kotlin
val files = File("Test").listFiles()

println(files?.size)
```

### If not null and else 的快速写法

``` kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty")
```

### if null执行后面语句

``` kotlin
val data = ...
val email = data["email"] ?: throw IllegalStateException("Email is missing!")
```

### 执行 if not null

``` kotlin
val data = ...

data?.let {
    ... // execute this block if not null
}
```

### 使用when声明返回

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

### 使用try catch代码块返回

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

### if语句中返回

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

### 单表达式方法（单语句函数）

``` kotlin
fun theAnswer() = 42
```

这个等同于

``` kotlin
fun theAnswer(): Int {
    return 42
}
```

这些用法可以相互组合产生更短的代码.看下面这个例子:

``` kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```
