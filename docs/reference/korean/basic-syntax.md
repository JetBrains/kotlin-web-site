---
type: doc
layout: reference
category: "Basics"
title: "Basic Syntax"
---

# Basic Syntax

## 패키지 정의

패키지는 소스 파일의 가장 윗쪽에 명세합니다:

``` kotlin
package my.demo

import java.util.*

// ...
```

디렉토리와 패키지를 꼭 맞추어야 할 필요는 없습니다: 소스 파일들은 파일 시스템에서 임의의 위치에 놓여질 수 있습니다.

[Packages](packages.html) 참고.

## 함수 정의

다음은 두 개의 `Int` 매개 변수를 전달 받아 `Int`를 반환하는 함수입니다:

``` kotlin
fun sum(a: Int, b: Int): Int {
  return a + b
}
```

다음은 expression부에서 반환 타입을 암시하는 함수입니다:

``` kotlin
fun sum(a: Int, b: Int) = a + b
```

다음은 명시적으로 반환 타입이 지정되어 있고 모듈의 외부에서도 볼 수 있는 함수입니다:

``` kotlin
public fun sum(a: Int, b: Int): Int = a + b
```

의미 있는 값을 반환하지 않는 함수입니다:

``` kotlin
fun printSum(a: Int, b: Int): Unit {
  print(a + b)
}
```

`Unit`이라는 반환 타입은 생략할 수 있습니다:

``` kotlin
public fun printSum(a: Int, b: Int) {
  print(a + b)
}
```

[Functions](functions.html) 참고.

## 지역 변수 선언

한 번만 할당 가능한 읽기 전용 지역 변수:

``` kotlin
val a: Int = 1
val b = 1 // `Int` type is inferred
val c: Int // Type required when no initializer is provided
c = 1 // definite assignment
```

가변적인 변수:

``` kotlin
var x = 5 // `Int` type is inferred
x += 1
```

[Properties And Fields](properties.html) 참고.

## 문자열 템플릿

``` kotlin
fun main(args: Array<String>) {
  if (args.size() == 0) return

  print("First argument: ${args[0]}")
}
```

[String templates](basic-types.html#string-templates) 참고.

## 조건문

``` kotlin
fun max(a: Int, b: Int): Int {
  if (a > b)
    return a
  else
    return b
}
```

Expression으로서의 *if*{: .keyword } 사용:

``` kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```

[*if*{: .keyword }-expressions](control-flow.html#if-expression) 참고.

## Nullable 값과 *null*{: .keyword } 체크

값이 *null*{: .keyword }일 수 있다면 참조시에 명시적으로 nullable 속성을 표시해야합니다.

다음 코드는 `str`이 정수 값을 갖지 않을 때 *null*{: .keyword }을 반환합니다:

``` kotlin
fun parseInt(str: String): Int? {
  // ...
}
```

다음과 같이 nullable 값을 반환하는 함수를 활용할 수 있습니다:

``` kotlin
fun main(args: Array<String>) {
  if (args.size() < 2) {
    print("Two integers expected")
    return
  }

  val x = parseInt(args[0])
  val y = parseInt(args[1])

  // Using `x * y` yields error because they may hold nulls.
  if (x != null && y != null) {
    // x and y are automatically cast to non-nullable after null check
    print(x * y)
  }
}
```

혹은

``` kotlin
  // ...
  if (x == null) {
    print("Wrong number format in '${args[0]}'")
    return
  }
  if (y == null) {
    print("Wrong number format in '${args[1]}'")
    return
  }

  // x and y are automatically cast to non-nullable after null check
  print(x * y)
```

[Null-safety](null-safety.html) 참고.

## 타입 체크와 자동 형변환

*is*{: .keyword } 연산자는 expression이 특정 타입의 인스턴스인지 체크합니다.
정적인 지역 변수나 프로퍼티를 특정 타입으로 체크했다면, 명시적으로 형변환을 할 필요가 없습니다:

``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj is String) {
    // `obj` is automatically cast to `String` in this branch
    return obj.length
  }

  // `obj` is still of type `Any` outside of the type-checked branch
  return null
}
```

혹은

``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj !is String)
    return null

  // `obj` is automatically cast to `String` in this branch
  return obj.length
}
```

또,

``` kotlin
fun getStringLength(obj: Any): Int? {
  // `obj` is automatically cast to `String` on the right-hand side of `&&`
  if (obj is String && obj.length > 0)
    return obj.length

  return null
}
```

[Classes](classes.html)와 [Type casts](typecasts.html) 참고.

## `for` 반복

``` kotlin
fun main(args: Array<String>) {
  for (arg in args)
    print(arg)
}
```

혹은

``` kotlin
for (i in args.indices)
  print(args[i])
```

[for loop](control-flow.html#for-loops) 참고.

## `while` 반복

``` kotlin
fun main(args: Array<String>) {
  var i = 0
  while (i < args.size())
    print(args[i++])
}
```

[while loop](control-flow.html#while-loops) 참고.

## `when` expression

``` kotlin
fun cases(obj: Any) {
  when (obj) {
    1          -> print("One")
    "Hello"    -> print("Greeting")
    is Long    -> print("Long")
    !is String -> print("Not a string")
    else       -> print("Unknown")
  }
}
```

[when expression](control-flow.html#when-expression) 참고.

## 범위

다음과 같이 *in*{: .keyword } 연산을 통해 어떤 수가 범위 안에 포함되는지 체크할 수 있고:

``` kotlin
if (x in 1..y-1)
  print("OK")
```

범위 밖에 있는지 체크할 수도 있습니다:

``` kotlin
if (x !in 0..array.lastIndex)
  print("Out")
```

범위 내에서의 반복:

``` kotlin
for (x in 1..5)
  print(x)
```

[Ranges](ranges.html) 참고.

## Collection

Collection 내에서의 반복:

``` kotlin
for (name in names)
  println(name)
```

*in*{: .keyword } 연산을 통해 collection 안에 특정 객체가 포함되어있는지 체크할 수 있습니다:

``` kotlin
if (text in names) // names.contains(text) is called
  print("Yes")
```

함수 리터럴을 통한 collection 필터링, 매핑:

``` kotlin
names filter { it.startsWith("A") } sortBy { it } map { it.toUpperCase() } forEach { print(it) }
```

[Higher-order functions and Function literals](lambdas.html) 참고.

