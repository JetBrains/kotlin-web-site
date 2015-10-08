---
type: doc
layout: reference
category: "Classes and Objects"
title: "Visibility Modifiers"

---

# 可见性修饰符  

类，对象，接口，构造方法，和它们的setter方法都可以用_visibility modifiers_来做修饰。(getter一直与属性有着相同的可见性.)

在Kotlin中有以下四个可见性修饰符:

* `private` --- 只有在声明的范围及其方法可见(在同一模块);

* `protected` --- (只适用于类/接口成员)和"private"一样,但也在子类可见;

* `internal` --- (在默认情况下使用)在同一个模块中可见(如果声明范围的所有者是可见的);

* `public` --- 随处可见(如果声明范围的所有者是可见的).

**注意**: 函数 _with expression bodies_ 所有的属性声明`public`必须始终显式指定返回类型。
这是必需的，这样我们就不会随意改变一个类型,仅通过改变实现公共API的一部分。

``` kotlin
public val foo: Int = 5    // explicit return type required
public fun bar(): Int = 5  // explicit return type required
public fun bar() {}        // block body: return type is Unit and can't be changed accidentally, so not required
```

下面将解释不同类型的声明范围。

## 包名

函数，属性和类，对象和接口可以在顶层声明，即直接在包内：

``` kotlin
// file name: example.kt
package foo

fun baz() {}
class Bar {}
```

*  如果你不指定任何可见性修饰符，那么默认情况下使用`internal`修饰，这意味着你们将声明在同一个模块中可见;

* 如果你声明`private`，只会是这个包及其子包内可见的，并且只在相同的模块;


* 如果你声明`public`,随处可见。

* `protected`不适用于顶层声明。

例子:

``` kotlin
// file name: example.kt
package foo

private fun foo() {} // visible inside this package and subpackaged

public var bar: Int = 5 // property is visible everywhere
    private set         // setter is visible only in this package and subpackages
    
internal val baz = 6    // visible inside the same module, the modifier can be omitted    
```

## 类和接口

当一个类中声明：

* `private` 意味着这个类只在内部可见(包含所有成员).

* `protected`--- 和`private`一样+在子类可见。

* `internal` --- 任何客户端 *inside this module* 谁看到声明类，其`internal`成员在里面;

* `public` ---  任何客户端看到声明类看到其`public`成员。

*注意* 对于Java用户:外部类不能访问Kotlin内部类的private成员。

例子:

``` kotlin
open class Outer {
    private val a = 1
    protected val b = 2
    val c = 3 // internal by default
    public val d: Int = 4 // return type required
    
    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a is not visible
    // b, c and d are visible
    // Nested and e are visible
}

class Unrelated(o: Outer) {
    // o.a, o.b are not visible
    // o.c and o.d are visible (same module)
    // Outer.Nested is not visible, and Nested::e is not visible either 
}
```

### 构造函数

指定一个类的可见性的主构造函数,使用以下语法(注意你需要添加一个显示构造函数{:.keyword} keyword)：

``` kotlin
class C private constructor(a: Int) { ... }
```

这里的构造函数是私有的。不像其他的声明，在默认情况下，所有构造函数是`public`，这实际上等于他们是随处可见，其中的类是可见(即内部类的构造函数是唯一可见在同一模块内).

### 局部声明

局部变量，函数和类不能有可见性修饰符。

---

翻译By Jacky Xu
