---
type: doc
layout: reference
category: "Syntax"
title: "Basic Types"
---

# Basic Types

Kotlin에서는, 어떤 변수의 멤버 함수와 프로퍼티를 호출할 수 있다는 개념에서 모든 것이 객체입니다. 몇몇 타입들은 그 구현이 최적화되어있어 빌트인으로 지정되어 있지만, 사용자에게는 평범한 클래스처럼 보입니다. 이 섹션에서 이 타입들에 대해 설명합니다: 숫자, 문자, 불, 배열.

## 숫자

Kotlin은 숫자를 Java와 비슷하게 다루지만, 정확히 같지는 않습니다. 예를 들면, 큰 범위로의 암시적 변환이 없고, 리터럴들은 몇몇 경우에 약간 다른 점이 있습니다.

Kotlin은 다음과 같은 빌트인 타입의 숫자형을 제공합니다 (이는 Java와 비슷합니다):

| Type	 | Bitwidth |
|--------|----------|
| Double | 64       |
| Float	 | 32       |
| Long	 | 64       |
| Int	   | 32       |
| Short	 | 16       |
| Byte	 | 8        |

Kotlin에서는 문자가 숫자가 아니라는 점을 알아두세요.

### 리터럴 상수

다음과 같은 종류의 정수값 리터럴 상수들이 있습니다:

* Decimals: `123`
  * Longs are tagged by a capital `L`: `123L`
* Hexadecimals: `0x0F`
* Binaries: `0b00001011`

NOTE: 8진법 리터럴은 지원하지 않습니다.

Kotlin은 또한 부동소수점 숫자의 관용적인 표현을 지원합니다:
 
* Doubles by default: `123.5`, `123.5e10`
* Floats are tagged by `f` or `F`: `123.5f` 

### 표현

Java 플랫폼에서, nullable 숫자를 참조(e.g. `Int?`)할 필요가 없거나 제너릭과 관계되지 않는 한 숫자는 물리적으로 JVM 프리미티브 타입으로 저장됩니다.
그러나 반대의 경우에는 숫자가 감싸져있습니다.

숫자를 감싼 것이 정체성을 유지하지 않는다는 것을 알아두세요:

``` kotlin
val a: Int = 10000
print(a identityEquals a) // Prints 'true'
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA identityEquals anotherBoxedA) // !!!Prints 'false'!!!
```

반면에, 동일성은 유지됩니다:

``` kotlin
val a: Int = 10000
print(a == a) // Prints 'true'
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA == anotherBoxedA) // Prints 'true'
```

### 명시적 변환

서로 다른 표현 때문에, 작은 타입은 큰 타입의 서브타입이 되지 않습니다.
그렇게 될 경우, 다음 내용처럼 문제점이 생길 수 있습니다.

``` kotlin
// Hypothetical code, does not actually compile:
val a: Int? = 1 // A boxed Int (java.lang.Integer)
val b: Long? = a // implicit conversion yields a boxed Long (java.lang.Long)
print(a == b) // Surprise! This prints "false" as Long's equals() check for other part to be Long as well
```

그래서 정체성 뿐만 아니라 동일성까지도 모든 부분에서 조용히 사라질 수 있습니다.

결론적으로, 작은 타입들은 암시적으로는 큰 타입으로 변환될 수 없습니다.
이는 명시적 변환 없이는 `Byte` 타입을 `Int` 타입으로 할당할 수 없음을 의미합니다.

``` kotlin
val b: Byte = 1 // OK, literals are checked statically
val i: Int = b // ERROR
```

더 큰 숫자로의 명시적 변환을 사용할 수 있습니다.

``` kotlin
val i: Int = b.toInt() // OK: explicitly widened
```

모든 숫자 타입은 다음 변환을 지원합니다:

* `toByte(): Byte`
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`
* `toChar(): Char`

암시적 변환이 없다는 점은 문맥으로부터 타입을 유추할 수 있고, 산술 연산들이 적절하게 오버로딩되어 리터럴들을 거의 자유롭게 사용할 수 있기 때문에 좀처럼 눈에 띄지 않는 부분입니다. 예를 들자면 이렇습니다.

``` kotlin
val l = 1.toLong() + 3 // Long + Int => Long
```

### 연산

Kotlin은 적절한 클래스의 멤버로 선언되어 있는 숫자들의 표준 산술 연산 셋을 지원합니다(컴파일러가 연산 호출을 해당하는 명령으로 최적화합니다).
[Operator overloading](operator-overloading.html) 참고.

비트 연산에서, 특정한 문자는 없지만 중위 연산의 형태로 호출이 가능한 함수가 있습니다:

``` kotlin
val x = (1 shl 2) and 0x000FF000
```

다음 함수들이 모든 비트 연산들입니다. (`Int`와 `Long` 타입에서만 사용 가능합니다.):

* `shl(bits)` – signed shift left (Java's `<<`)
* `shr(bits)` – signed shift right (Java's `>>`)
* `ushr(bits)` – unsigned shift right (Java's `>>>`)
* `and(bits)` – bitwise and
* `or(bits)` – bitwise or
* `xor(bits)` – bitwise xor
* `inv()` – bitwise inversion

## 문자

문자는 `Char`라는 타입으로 표현됩니다. 문자는 숫자로 직접 사용할 수는 없습니다.

``` kotlin
fun check(c: Char) {
  if (c == 1) { // ERROR: incompatible types
    // ...
  }
}
```

문자 리터럴은 작은 따옴표로 묶어서 사용합니다: `'1'`, `'\n'`, `'\uFF00'`.
`Int` 타입 숫자로 명시적 변환이 가능합니다.

``` kotlin
fun decimalDigitValue(c: Char): Int {
  if (c !in '0'..'9')
    throw IllegalArgumentException("Out of range")
  return c.toInt() - '0'.toInt() // Explicit conversions to numbers
}
```

숫자와 같이, 문자도 nullable 참조가 필요할 때 감싸져 사용됩니다. 정체성은 감싸지는 것에 의해 보존되지 않습니다.

## 불

`Boolean`은 불 타입을 표현하고, 두 개의 값을 갖습니다: *true*{: .keyword } 와 *false*{: .keyword }.

불 타입 또한 nullable 참조가 필요할 경우 감싸집니다.

불 타입의 빌트인 연산은 다음과 같은 것들이 있습니다.

* `||` – lazy disjunction
* `&&` – lazy conjunction

## 배열

Kotlin의 배열은 (연산자 오버로딩 컨벤션에 의해 `[]`로 표현되는) `get`과 `set` 함수, `size` 함수 등 몇 가지 유용한 멤버 함수들을 갖는 `Array` 클래스로 표현됩니다:

``` kotlin
class Array<T> private () {
  fun size(): Int
  fun get(index: Int): T
  fun set(index: Int, value: T): Unit

  fun iterator(): Iterator<T>
  // ...
}
```

배열을 만들기 위해 `array()`라는 라이브러리 함수에 항목 값들을 넘겨줄 수 있는데, 따라서 `array(1, 2, 3)`는 [1, 2, 3] 이라는 배열을 만듭니다.
이를 대신해서, `arrayOfNulls()`라는 라이브러리 함수를 사용하여 주어진 크기만큼 null 항목으로 채워진 배열을 만들 수도 있습니다.

또 다른 옵션으로 배열의 크기와 주어진 인덱스로부터 항목의 초기 값을 반환하는 함수를 갖는 팩토리 함수를 사용할 수 있습니다:

``` kotlin
// Creates an Array<String> with values ["0", "1", "4", "9", "16"]
val asc = Array(5, {i -> (i * i).toString()})
```

위에서 말했듯이, `[]` 연산은 멤버 함수인 `get()`과 `set()` 의 호출을 대체합니다.

Note: Java와 다르게, Kotlin의 배열은 변하지 않습니다. 이는 Kotlin이 가능한 런타임 실패를 막기 위해 `Array<String>`을 `Array<Any>`로 할당할 수 없음을 의미합니다(하지만 `Array<out Any>`를 사용할 수 있습니다. [Type Projections](generics.html#type-projections) 참고).

Kotlin은 또한 오버헤드 박싱 없이 프리미티브 타입들의 배열을 표현하기에 특화된 클래스를 갖습니다: ByteArray,
ShortArray, IntArray 등. 이 클래스들은 `Array` 클래스와 상속 관계가 없지만, 같은 메소드와 프로퍼티 셋을 갖습니다. 이들 각각은 그에 해당하는 팩토리 함수도 갖습니다:

``` kotlin
val x: IntArray = intArray(1, 2, 3)
x[0] = x[1] + x[2]
```

## 문자열

문자열은 `String` 타입으로 표현됩니다. 문자열은 불변적입니다.
문자열의 원소들은 다음과 같이 인덱싱 연산으로 접근 가능한 문자들입니다: `s[i]`.
문자열은 *for*{: .keyword }-반복으로 반복 연산을 수행할 수 있습니다:

``` kotlin
for (c in str) {
  println(c)
}
```

### 문자열 리터럴

Kotlin은 두 가지 타입의 문자열 리터럴을 갖습니다: 이스케이프 문자들을 갖는 이스케이프 문자열, 개행과 임의의 텍스트를 포함하는 raw 문자열. 이스케이프 문자열은 Java 문자열과 매우 흡사합니다:

``` kotlin
val s = "Hello, world!\n"
```

이스케이핑은 역슬래시와 함께 관용적인 방식으로 수행됩니다.

Raw 문자열은 이스케이핑을 포함하지 않고 개행과 다른 문자들을 포함하며 삼중 따옴표로 구분됩니다:

``` kotlin
val text = """
  for (c in "foo")
    print(c)
"""
```


### 템플릿

문자열은 템플릿 표현을 포함할 수 있습니다. 이는 아래의 코드처럼 문자열로 결합됩니다. 템플릿 표현은 달러 표시($)로 시작하고 간단한 이름으로 구성됩니다:

``` kotlin
val i = 10
val s = "i = $i" // evaluates to "i = 10"
```

또한 중괄호로 묶어 임의의 expression을 표현할 수도 있습니다:

``` kotlin
val s = "abc"
val str = "$s.length is ${s.length}" // evaluates to "abc.length is 3"
```

