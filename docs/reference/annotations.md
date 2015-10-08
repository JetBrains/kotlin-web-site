---
type: doc
layout: reference
category: "Syntax"
title: "Annotations"
---

# 注解

## 注解的声明

注解是连接元数据以及代码的。为了声明注解，把*annotation*{: .keyword } 这个关键字放在类前面：

``` kotlin
annotation class fancy
```

### 用途

``` kotlin
@fancy class Foo {
  @fancy fun baz(@fancy foo: Int): Int {
    return (@fancy 1)
  }
}
```


在很多情况下，`@ `这个标志不是强制性使用的。它只是在当注解表达式或者本地声明时需要：

``` kotlin
fancy class Foo {
  fancy fun baz(fancy foo: Int): Int {
    @fancy fun bar() { ... }
    return (@fancy 1)
  }
}
```


如果你需要注解类的主构造方法，你需要给构造方法的声明添加*constructor*{: .keyword}这个关键字，还有在前面添加注解：

``` kotlin
class Foo @inject constructor(dependency: MyDependency) {
  // ...
}
```


你也可以注解属性访问器：

``` kotlin
class Foo {
    var x: MyDependency? = null
        @inject set
}
```

### 构造方法


注解可以有参数的构造方法。

``` kotlin
annotation class special(val why: String)

special("example") class Foo {}
```

### Lambdas


注解也可以用在lambda表达式中。这将会应用到 lambda 生成的`invoke()`方法。这对[Quasar](http://www.paralleluniverse.co/quasar/)框架很有用，在这个框架中注解被用来并发控制

``` kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```


## Jave注解


Java注解是百分百适用于Kotlin：

``` kotlin
import org.junit.Test
import org.junit.Assert.*

class Tests {
  Test fun simple() {
    assertEquals(42, getTheAnswer())
  }
}
```


Java注解也可像用import修饰符重新命名：

``` kotlin
import org.junit.Test as test

class Tests {
  test fun simple() {
    ...
  }
}
```


因为在Java里，注释的参数顺序不是明确的，你不能使用常规的方法
调用语法传递的参数。相反的，你需要使用指定的参数语法。

``` java
// Java
public @interface Ann {
    int intValue();
    String stringValue();
}
```

``` kotlin
// Kotlin
Ann(intValue = 1, stringValue = "abc") class C
```


就像在Jave里一样，需要一个特殊的参数是' value`参数;它的值可以使用不明确的名称来指定。

``` java
// Java
public @interface AnnWithValue {
    String value();
}
```

``` kotlin
// Kotlin
AnnWithValue("abc") class C
```


如果在Java中`value`参数是array类型，在Kotlin中必须使用 `vararg`这个参数。

``` java
// Java
public @interface AnnWithArrayValue {
    String[] value();
}
```

``` kotlin
// Kotlin
AnnWithArrayValue("abc", "foo", "bar") class C
```


如果你需要像注解参数一样指定一个类，使用一个Kotlin的类吧([KClass](/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html))。Kotlin编译器会自动把它转换成Java类，使得Java代码能正常看到注解和参数。

``` kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any?>)

Ann(String::class, Int::class) class MyClass
```

注解实例的值被视为Kotlin的属性。

``` java
// Java
public @interface Ann {
    int value();
}
```

``` kotlin
// Kotlin
fun foo(ann: Ann) {
    val i = ann.value
}
```

---

翻译By [Wahchi](https://github.com/wahchi)
