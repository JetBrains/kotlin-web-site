---
type: doc
layout: reference
category: "Syntax"
title: "Annotations"
---

# Annotations

## Annotation 선언
Annotation이란 코드에 메타데이터를 첨부하는 것을 의미합니다. Annotation을 정의하기 위해, 클래스의 앞에 *annotation*{: .keyword } 키워드를 추가할 수 있습니다:

``` kotlin
annotation class fancy
```

### 사용 예시

``` kotlin
[fancy] class Foo {
  [fancy] fun baz([fancy] foo: Int): Int {
    return [fancy] 1
  }
}
```

대부분의 경우, 대괄호는 필수가 아니라 Annotation의 표현이나 지역 선언을 할 때에만 필요합니다:

``` kotlin
fancy class Foo {
  fancy fun baz(fancy foo: Int) {
    [fancy] fun bar() { ... }
    return [fancy] 1
  }
}
```

클래스의 주생성자에 Annotation을 추가하려면, 다음 코드를 활용하면 됩니다:

``` kotlin
class Foo [inject](dependency: MyDependency) {
  // ...
}
```

프로퍼티 접근자에도 Annotation을 추가할 수 있습니다:

``` kotlin
class Foo {
    var x: MyDependency? = null
        [inject] set
}
```

### 생성자

Annotation은 매개 변수를 갖는 생성자를 가질 수 있습니다.

``` kotlin
annotation class special(val why: String)

special("example") class Foo {}
```

## Java Annotations

Java의 Annotation은 Kotlin과 100% 호환됩니다:

``` kotlin
import org.junit.Test
import org.junit.Assert.*

class Tests {
  Test fun simple() {
    assertEquals(42, getTheAnswer())
  }
}
```

Java Annotation은 import에서 새로운 이름을 정의함으로써 제어자처럼 사용될 수 있습니다:

``` kotlin
import org.junit.Test as test

class Tests {
  test fun simple() {
    ...
  }
}
```


