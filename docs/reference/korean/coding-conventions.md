---
type: doc
layout: reference
category: Basics
title: Coding Conventions
---

# Coding Conventions

이 페이지는 Kotlin 언어의 현재 코딩 스타일에 대한 내용을 담고 있습니다.

## 네이밍 스타일
기본적으로 다음과 같은 Java 코딩 컨벤션을 따릅니다:

* 이름에 카멜케이스(언더스코어는 지양)를 사용합니다.
* 타입은 대문자로 시작합니다.
* 메소드와 프로퍼티는 소문자로 시작합니다.
* 들여쓰기는 4칸의 스페이스를 사용합니다.
* public 함수는 Kotlin 문서에 나타나도록 문서화를 합니다.

Kotlin은 언어의 주요 컨셉에서 필드를 갖지 않습니다 -- 오직 프로퍼티만을 갖습니다.
프로퍼티의 앞에 _나 m_ 등의 표시와 같은 접두어를 사용하지 않습니다.
프로퍼티의 backing field에 접근할 경우, $ 접두어를 사용합니다: `$foo`는 `foo` 속성 뒤의 필드들을 참조합니다;
private 프로퍼티를 만들어 `_foo`로 이름을 붙이지 않습니다.

## 콜론

타입과 슈퍼타입을 구분하는 콜론의 앞에는 공백을 넣고, 인스턴스와 타입을 구분하는 콜론의 앞에는 공백을 넣지 않습니다:

``` kotlin
trait Foo<out T : Any> : Bar {
    fun foo(a: Int): T
}
```

## Unit
함수가 Unit을 반환할 경우, 반환 타입은 생략합니다:

``` kotlin
fun foo() { // ": Unit" is omitted here

}
```
