---
type: doc
layout: reference
category: "Syntax"
title: "Enum Classes"
---

# 枚举类

枚举类的最基本应用是实现类型安全的多项目集合。

``` kotlin
enum class Direction {
  NORTH, SOUTH, WEST, EAST
}
```

其中每一个常量（NORTH，SOUTH……）都是一个对象。每一个常量用逗号“,"分隔。

## 初始化

因为每一条枚举（RED，GREEN……）都是枚举类的实例，所以他们可以被初始化。

``` kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 匿名类

枚举实例也可以被声明为他们自己的匿名类，并同时包含他们相应原本的方法和覆盖基本方法。

``` kotlin
enum class ProtocolState {
  WAITING {
    override fun signal() = TALKING
  },

  TALKING {
    override fun signal() = WAITING
  };

  abstract fun signal(): ProtocolState
}
```

注意如果枚举类定义了任何成员，你需要像JAVA一样把枚举实例的定义和成员定义用分号分开。

## 枚举实例的用法

像JAVA一样，枚举类在Kotlin中有合成方法。它允许列举枚举实例并且通过名称返回枚举实例。下面是应用实例 (假设枚举实例名称是`EnumClass`):

``` kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.values(): Array<EnumClass>
```

如果特定的对象名无法对应任何一个定义在枚举类中的枚举常量， `valueOf()` 方法会抛出一个异常 `IllegalArgumentException`。

每一个枚举常量在枚举类定义时都有一个方法去获得他们的名字和位置。

``` kotlin
name(): String
ordinal(): Int
```

枚举常量也可以实现[Comparable](/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 接口。他们会依照在枚举类中的定义先后以自然顺序排列。


---

翻译By EasonZhou