---
type: doc
layout: reference
category: "Syntax"
title: "Reflection"
---

# 反射

反射是一系列语言和库的特性，允许在运行时获取你代码结构。把函数和属性作为语言的一等公民，反射它们（如获名称或者属性类型或者方法）和使用函数式编程或反应是编程风格很像。


> 在Java平台，使用反射特性所需的运行时组件作为一个单独的Jar文件(`kotlin-reflect.jar`).这样做减小了不使用反射的应用程序库的大小.如果你确实要使用反射,请确保该文件被添加到了项目路径.
{:.note}

## 类引用

最基本的反射特性就是得到运行时的类引用。要获取引用并使之成为静态类可以使用字面类语法:

``` kotlin
val c = MyClass::class
```

引用是[KClass](/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html)类型.你可以使用`KClass.properties`
和`KClass.extensionProperties`来获得类和父类所有[属性引用](#property-references)的列表。

注意Kotlin类引用不完全与Java类引用一致.查看[Java interop section](java-interop.html#object-methods)
详细信息。

## 函数引用

我们有一个像下面这样的函数声明:
  
``` kotlin
fun isOdd(x: Int) = x % 2 != 0
```

我们可以直接调用(`isOdd(5)`), 也可以把它作为一个值传给其他函数. 
我们使用`::`操作符实现:  
  
``` kotlin
val numbers = listOf(1, 2, 3)
println(numbers.filter(::isOdd)) // prints [1, 3]
```

这里 `::isOdd`是一个函数类型的值 `(Int) -> Boolean`.

注意现在`::`不能被使用来重载函数. 将来, 我们计划提供一个语法明确参数类型这样就可以使用明确的重载函数了。

如果我们需要使用类成员或者一个扩展方法，它必须是有权访问的, 
它的返回类型是“extension function”,
例如`String::toCharArray`带着一个`String`: `String.() -> CharArray`类型扩展函数.

### 例子: 函数组合

考量以下方法：

``` kotlin
fun compose<A, B, C>(f: (B) -> C, g: (A) -> B): (A) -> C {
    return {x -> f(g(x))}
}
```

它返回一个由俩个传递进去的函数的组合。现在你可以把它用在可调用的引用上了：


``` kotlin
fun length(s: String) = s.size
 
val oddLength = compose(::isOdd, ::length)
val strings = listOf("a", "ab", "abc")

println(strings.filter(oddLength)) // Prints "[a, abc]"
```

## 属性引用

我们同样可以用`::`操作符来访问Kotlin中的顶级类的属性：

``` kotlin
var x = 1
 
fun main(args: Array<String>) {
    println(::x.get()) // prints "1"
    ::x.set(2)
    println(x)         // prints "2"
}
```

表达式`::x`推断为`KProperty<Int>`类型的属性对象,它允许我们使用`get()`函数来读它的值或者使用`name`属性来得到它的值。更多请查看[docs on the `KProperty` class](/api/latest/jvm/stdlib/kotlin.reflect/-k-property.html).

对于可变属性,例如`var y = 1`, `::y`返回值类型是[`KMutableProperty<Int>`](/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property.html),
它有一个`set()`方法. 
 
访问一个类的属性成员，我们这样修饰：

``` kotlin
class A(val p: Int)
 
fun main(args: Array<String>) {
    val prop = A::p
    println(prop.get(A(1))) // prints "1"
}
```

对于扩展属性:


``` kotlin
val String.lastChar: Char
  get() = this[size - 1]
 
fun main(args: Array<String>) {
  println(String::lastChar.get("abc")) // prints "c"
}
```

### 与Java反射调用


在 java 平台上，标准库包括反射类的扩展，提供了到 java 反射对象的映射(参看 `kotlin.reflect.jvm`包)。比如，想找到一个备用字段或者 java getter 方法，你可以这样写：

``` kotlin
import kotlin.reflect.jvm.*
 
class A(val p: Int)
 
fun main(args: Array<String>) {
    println(A::p.javaGetter) // prints "public final int A.getP()"
    println(A::p.javaField)  // prints "private final int A.p"
}
```

## 构造函数引用

构造函数可以像属性和方法那样引用. 它们可以使用在任何一个函数类型的对象的地方，期望得到相同参数的构造函数，并返回一个适当类型的对象. 
构造函数使用`::`操作符加类名引用.考虑如下函数，需要一个无参数函数返回类型是`Foo`:

``` kotlin
class Foo

fun function(factory : () -> Foo) {
    val x : Foo = factory()
}
```

我们可以简单的这样使用:

``` kotlin
function(::Foo)
```
