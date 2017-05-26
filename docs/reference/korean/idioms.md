---
type: doc
layout: reference
category: "Basics"
title: "Idioms"
---

# Idioms

Kotlin에서 임의로, 자주 사용되는 관용구들의 모음입니다. 좋아하는 관용구가 있다면, Pull Request 하세요.

### DTO 생성 (POJO/POCO)

``` kotlin
data class Customer(val name: String, val email: String)
```

`Customer` 클래스에 다음 기능을 제공합니다:

* getters (and setters in case of *var*{: .keyword }'s) for all properties
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* `component1()`, `component2()`, ..., for all properties (see [Data classes](data-classes.html))

### Final 지역 변수 정의

``` kotlin
val a = foo()
```

### 함수 매개 변수 기본값

``` kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

### 리스트 필터링

``` kotlin
val positives = list.filter { x -> x > 0 }
```

Or alternatively, even shorter:

``` kotlin
val positives = list.filter { it > 0 }
```

### 문자열 삽입

``` kotlin
println("Name $name")
```

### 인스턴스 체크

``` kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

### Pair의 맵/리스트

``` kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

`k`, `v`는 어떤 이름으로든 불릴 수 있습니다.

### 범위 사용

``` kotlin
for (i in 1..100) { ... }
for (x in 2..10) { ... }
```

### 읽기 전용 리스트

``` kotlin
val list = listOf("a", "b", "c")
```

### 읽기 전용 맵

``` kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

### 맵에 접근하기

``` kotlin
println(map["key"])
map["key"] = value
```

### Lazy 프로퍼티

``` kotlin
val p: String by Delegates.lazy {
    // compute the string
}
```

### 확장 함수

``` kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

### 싱글톤 생성

``` kotlin
object Resource {
    val name = "Name"
}
```

### 간단한 if not null

``` kotlin
val files = File("Test").listFiles()

println(files?.size)
```

### 간단한 if not null과 else

``` kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty")
```

### Null이면 구문 실행

``` kotlin
val data = ...
val email = data["email"] ?: throw IllegalStateException("Email is missing!")
```

### Null이 아니면 실행

``` kotlin
val data = ...

data?.let {
    ... // execute this block if not null
}
```

### when 구문에서의 반환

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

### try catch 구문에서의 반환

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

### if 구문에서의 반환

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

### 단일 expression 함수

``` kotlin
fun theAnswer() = 42
```

This is equivalent to

``` kotlin
fun theAnswer(): Int {
    return 42
}
```

이는 더 짧은 코드의 다른 관용구로 효율적으로 합쳐질 수 있습니다. E.g. *when*{: .keyword }-expression:

``` kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```
