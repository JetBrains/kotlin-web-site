---
type: doc
layout: reference
category: "Classes and Objects"
title: "Data Classes"
---

# 数据类

我们经常创建一些只是处理数据的类。在这些类里的功能经常是衍生自他们所持有的数据。在Kotlin中，这样的类可以被称为`data`：

 
``` kotlin
data class User(val name: String, val age: Int)
```


这被叫做一个 _数据类_。编译器自动从在主构造函数定义的全部特性中得到以下成员：
  
  * `equals()`/`hashCode()`, 
  * `toString()` 格式是 `"User(name=John, age=42)"`,
  * [`componentN()` functions](multi-declarations.html) 对应按声明顺序出现的所有属性,
  * `copy()` 方法 .


如果有某个函数被明确地定义在类里或者被继承，编译器就不会生成这个函数。
  
To ensure consistency and meaningful behavior of the generated code, data classes have to fulfil the following requirements:

  * The primary constructor needs to have at least one parameter;
  * All primary constructor parameters need to be marked as `val` or `var`;
  * Data classes cannot be abstract, open, sealed or inner;
  * Data classes may not extend other classes (but may implement interfaces).

> 在JVM中，如果生成的类需要含有一个无参的构造函数，则所有的属性必须有默认值。
> (查看 [Constructors](classes.html#constructors)).
>
> ``` kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```

## 复制
 

在很多情况下，我们我们需要对一些属性做修改而其他的不变。这就是`copy()`这个方法的来源。对于上文的`User`类，应该是这么实现这个方法的
     
``` kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)     
```     


也可以这么写

``` kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## 数据类和多重声明


_成员方法_用于使数据类可以[多声明](multi-declarations.html)：

``` kotlin
val jane = User("Jane", 35) 
val (name, age) = jane
println("$name, $age years of age") // prints "Jane, 35 years of age"
```

## 标准数据类

在标准库提供了`Pair`和`Triple`。在很多情况下，即使命名数据类是一个更好的设计选择，因为这能让代码可读性更强。

---

翻译By Wahchi
