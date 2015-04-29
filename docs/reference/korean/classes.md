---
type: doc
layout: reference
category: "Syntax"
title: "Classes and Inheritance"
related:
    - functions.md
    - nested-classes.md
    - traits.md
---

# Classes and Inheritance

## 클래스

Kotlin의 클래스는 *class*{: .keyword }라는 키워드로 정의합니다:

``` kotlin
class Invoice {
}
```

클래스의 선언은 클래스의 이름, 클래스의 헤더(타입 매개 변수, 주생성자를 명세하는), 중괄호로 감싼 클래스의 내용부로 구성됩니다. 헤더와 내용부는 필수적이지는 않습니다; 클래스의 내용이 없다면, 중괄호를 생략할 수 있습니다.

``` kotlin
class Empty
```


### 생성자

Kotlin의 클래스는 하나의 **주생성자**와 한 개 이상의 **부생성자**를 가질 수 있습니다. 주생성자는 클래스 헤더에 위치합니다: 클래스 이름의 뒤에 위치하고, 타입 매개 변수는 옵션입니다.

``` kotlin
class Person(firstName: String) {
}
```

주생성자는 어떠한 코드도 포함하지 않습니다. 초기화 코드는 *init*{: .keyword }로 정의되는 **초기화 블록**에 넣습니다:

``` kotlin
class Customer(name: String) {
    init {
        logger.info("Customer initialized with value ${name}")
    }
}
```

주생성자의 매개 변수들은 초기화 블록에서 사용할 수 있다는 점을 알아두시기 바랍니다. 또한 이들은 클래스 내용부에 정의된 프로퍼티 초기화에도 사용할 수 있습니다:

``` kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```

사실은, Kotlin은 주생성자에서 프로퍼티를 선언하고 초기화하기 위한 간결한 문법을 제공합니다:


``` kotlin
class Person(val firstName: String, val lastName: String, var age: Int) {
  // ...
}
```

일반적인 프로퍼티와 같이, 주생성자에 정의된 프로퍼티들도 가변적으로(*var*{: .keyword }) 혹은 읽기 전용으로(*val*{: .keyword }) 설정할 수 있습니다.

주생성자의 가시성은 다음과 같이 정할 수 있습니다:

``` kotlin
class Customer private (name: String) { ... }
```

더 자세히 보려면, [Visibility Modifiers](visibility-modifiers.html#constructors)를 참고하세요.


#### 부생성자

클래스는 *constructor*{: .keyword } 키워드를 이용하여 **secondary constructors**를 선언할 수 있습니다:

``` kotlin
class Person {
    constructor(parent: Person) {
        parent.children.add(this)
    }
}
```

클래스가 주생성자를 가지고 있다면, 각각의 부생성자는 직접적으로든 다른 부생성자를 통해 간접적으로든 주생성자를 대신할 수 있어야 합니다. 같은 클래스의 다른 생성자는 *this*{: .keyword } 키워드로 대체할 수 있습니다:

``` kotlin
class Person(val name: String) {
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

만약 비추상 클래스가 주생성자와 부생성자 둘 중 어느 것도 정의하지 않는다면, 자동으로 생성된 빈 주생성자를 갖게 됩니다. 해당 생성자는 public으로 접근 가능합니다. 클래스가 public 생성자를 갖길 원하지 않는다면, 기본값이 아닌 가시성을 갖는 빈 주생성자를 정의해야 합니다:

``` kotlin
class DontCreateMe private () {
}
```

> **NOTE**: On the JVM, if all of the parameters of the primary constructor have default values, the compiler will
> generate an additional parameterless constructor which will use the default values. This makes it easier to use
> Kotlin with libraries such as Jackson or JPA that create class instances through parameterless constructors.
>
> ``` kotlin
> class Customer(val customerName: String = "")
> ```
{:.info}

### 클래스 인스턴스 생성

클래스의 인스턴스를 생성하려면, 일반적인 함수처럼 생성자를 호출합니다:

``` kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

Kotlin에는 *new*{: .keyword } 키워드가 없다는 점을 알아두세요.


### 클래스 멤버

클래스는 다음과 같은 내용을 포함합니다.

* 생성자와 초기화 블록
* [Functions](functions.html)
* [Properties](properties.html)
* [Nested and Inner Classes](nested-classes.html)
* [Object Declarations](object-declarations.html)


## 상속

Kotlin의 모든 클래스는 `Any`를 슈퍼클래스로 갖습니다. 이는 슈퍼타입이 정의되어있지 않은 클래스의 기본 슈퍼클래스입니다:

``` kotlin
class Example // Implicitly inherits from Any
```

`Any`는 `java.lang.Object`와 다릅니다; 특히, `Any`는  `equals()`, `hashCode()`, `toString()` 함수만을 멤버로 갖습니다.
더 자세한 내용은 [Java interoperability](java-interop.html#object-methods) 섹션을 참고하세요.

명시적으로 슈퍼타입을 정의하기 위해, 클래스 헤더에서 콜론 뒤에 타입을 붙일 수 있습니다:

``` kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

클래스가 주생성자를 갖는다면, 기본 타입은 주생성자의 매개 변수를 이용하여 그 자리에서 초기화되어야 합니다.

클래스가 주생성자를 갖지 않는다면, 각각의 부생성자는 *super*{: .keyword } 키워드를 이용하여 기본 타입을 초기화하거나, 그 역할을 하는 다른 생성자를 대신해야 합니다.
이 경우에 서로 다른 부생성자들이 기본 타입의 다른 생성자를 호출할 수 있다는 점을 알아두세요:

``` kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx) {
    }

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs) {
    }
}
```

클래스의 *open*{: .keyword } annotation은 Java의 *final*{: .keyword }과 반대되는 개념입니다: 이는 이 클래스로부터 다른 클래스들이 상속을 가능하게 합니다. [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html)의 Item 17: *Design and document for inheritance or else prohibit it*에 따라 기본값으로 모든 Kotlin 클래스는 final입니다.

### 멤버 오버라이딩

위에서도 설명했듯이, 우리는 Kotlin에서 어떤 것이든 명시적으로 정합니다. Java와는 다르게, Kotlin은 오버라이드가 가능한 멤버들(*open*이라고 부릅니다.)과 오버라이드를 위해 명시적인 annotation을 필요로 합니다::

``` kotlin
open class Base {
  open fun v() {}
  fun nv() {}
}
class Derived() : Base() {
  override fun v() {}
}
```

*override*{: .keyword } annotation은 `Derived.v()`에 필요합니다. 이 것이 없다면 아마도 컴파일러가 불만을 표할 것입니다.
`Base.nv()`처럼 함수에 *open*{: .keyword } annotation이 없다면, *override*{: .keyword }가 있든 없든 서브클래스에서 메소드를 같은 시그니쳐로 선언하는 것이 허용되지 않습니다. Final 클래스(*open*{: .keyword } annotation이 없는 클래스)에서는, open 멤버들은 금지됩니다.

*override*{: .keyword }로 표시된 멤버는 그 자체가 open이고, 서브클래스에서 오버라이드 됩니다. 다시 오버라이딩할 수 없도록 하기 위해 *final*{: .keyword }을 사용할 수 있습니다:

``` kotlin
open class AnotherDerived() : Base() {
  final override fun v() {}
}
```

#### 잠깐! 이제 내 라이브러리를 어떻게 뜯어봐야 하나요?!

오버라이딩에 대한 이러한 접근(클래스와 멤버들이 기본적으로 final인 점)의 한 가지 이슈는, 라이브러리 설계자가 오버라이딩을 하도록 의도하지 않은 어떠한 메소드를 오버라이드하기 위해 라이브러리 안에 서브클래스를 두거나 그 안에 자잘한 해킹을 제공하기가 어려워질 수 있다는 것입니다.

우리는 다음과 같은 이유들로 이 것이 단점이라고 여기지 않습니다:

* 타 모범 사례들은 어쨌든 간에 이러한 해킹을 허용하지 않을 것을 강조합니다.
* 다른 언어(C++, C#)를 사용하는 사람들 또한 비슷한 접근을 무리 없이 사용합니다.
* 정말 해킹을 원할 경우 여전히 방법은 있습니다: Java에 그 해킹을 작성하고 Kotlin에서 호출하면, Aspect 프레임워크가 적절한 목적에 맞게 작동합니다.

### 오버라이딩 규칙

Kotlin에서, 구현 상속은 다음 규칙들에 의해 규제됩니다: 클래스가 그의 직계 슈퍼클래스로부터 같은 멤버의 많은 구현들을 상속할 경우, 이 멤버들을 오버라이드하고 그 구현을 제공해야 합니다(아마, 상속받은 것들 중 하나를 사용할 것입니다).
상속받은 구현의 슈퍼타입을 표시할 때에는, *super*{: .keyword }를 부등호 괄호 안에 슈퍼타입을 지정하여 사용합니다. e.g. `super<Base>`:

``` kotlin
open class A {
  open fun f() { print("A") }
  fun a() { print("a") }
}

trait B {
  fun f() { print("B") } // trait members are 'open' by default
  fun b() { print("b") }
}

class C() : A(), B {
  // The compiler requires f() to be overridden:
  override fun f() {
    super<A>.f() // call to A.f()
    super<B>.f() // call to B.f()
  }
}
```

`A`와 `B` 모두를 상속해도 좋습니다. `C`가 각 함수들의 한 가지 구현만을 상속하기 때문에 `a()`와 `b()`에서도 문제가 발생하지 않습니다.
하지만 `f()`에 대해서는 `C`에 의해 두 가지 구현을 상속받기 때문에, `C`에서 `f()`를 오버라이드하고 이를 제공하여 애매함을 제거해야 합니다.

## 추상 클래스

어떤 클래스와 그 멤버들 중 몇몇은 *abstract*{: .keyword }로 선언될 수 있습니다.
추상 멤버는 해당 클래스에서 그 구현을 하지 않습니다.
그래서 어떤 자손이 추상 멤버를 상속할 때, 구현을 카운트하지 않습니다:

``` kotlin
abstract class A {
  abstract fun f()
}

trait B {
  open fun f() { print("B") }
}

class C() : A(), B {
  // We are not required to override f()
}
```

추상 클래스를 open으로 따로 표시할 필요가 없다는 점을 알아두세요 – 굳이 명시하지 않아도 됩니다. 추상 함수의 경우에도 마찬가지 입니다.

비추상 open 멤버도 추상 멤버로 오버라이드할 수 있습니다.

``` kotlin
open class Base {
  open fun f() {}
}

abstract class Derived : Base() {
  override abstract fun f()
}
```

## Companion 객체

Java나 C#과는 다르게 Kotlin 클래스는 static 메소드를 갖지 않습니다. 대부분의 경우에 패키지 레벨의 함수를 대신 쓰는 것을 권장합니다.

클래스 인스턴스 없이 클래스의 내부에 접근해서 호출할 수 있는 함수를 만들고 싶다면, 해당 클래스 안에 [object declaration](object-declarations.html)의 멤버로 작성할 수 있습니다.

더 특별한 방법으로, 클래스 안에 [companion object](object-declarations.html#companion-objects)을 선언하면, Java/C#의 static 메소드를 호출하듯이 클래스 이름을 이용하여 그 클래스의 멤버를 호출할 수 있게 됩니다.
