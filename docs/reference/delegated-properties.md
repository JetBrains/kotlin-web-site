---
type: doc
layout: reference
category: "Syntax"
title: "Delegated Properties"
---

# 委托属性

有一些种类的属性，虽然我们可以在每次需要的时候手动实现它们，但是如果能够把他们之实现一次并放入一个库同时又能够一直使用它们那会更好。例如：

* 延迟属性（lazy properties）: 数值只在第一次被访问的时候计算。
* 可控性（observable properties）: 监听器得到关于这个特性变化的通知，
* 把所有特性储存在一个图型结构中，而不是分开每一条。

为了支持这些(或者其他)例子，Kotlin 采用 _委托属性_:

``` kotlin
class Example {
  var p: String by Delegate()
}
```

语法是: `val/var <property name>: <Type> by <expression>`.在*by*{:.keyword}后面的表达式是 _委托_, 
因为 `get()` (和 `set()`) 协同的属性会被委托给它。
特性委托不必实现任何的接口，但是需要提供一个 `get()`方法(和 `set()` --- 对于 *var*{:.keyword}'s). 
例如:

``` kotlin
class Delegate {

  fun get(thisRef: Any?, property: PropertyMetadata): String {
    return "$thisRef, thank you for delegating '${property.name}' to me!"
  }
 
  fun set(thisRef: Any?, property: PropertyMetadata, value: String) {
    println("$value has been assigned to '${property.name} in $thisRef.'")
  }
}
```

当我们读取一个`Delegate`的委托实例 `p` , `Delegate`中的`get()`就被调用, 
所以它第一变量就是我们从 `p` 读取的实例,第二个变量代表 `p` 自身的描述。 
(例如你可以用它的名字). 下面是例子:

``` kotlin
val e = Example()
println(e.p)
```

打印结果： 

```
Example@33a17727, thank you for delegating ‘p’ to me!
```
 
相同的，当我们给 `p` 赋值, `set()` 方法就被调用. 前两个参数是一样的，第三个参数代表被赋予的值:

``` kotlin
e.p = "NEW"
```

打印结果：
 
```
NEW has been assigned to ‘p’ in Example@33a17727.
```

## 属性委托要求

下面见到介绍委托对象的要求。 

对于一个 **只读** 属性 (如 *val*{:.keyword}), 一个委托一定会提供一个 `get`函数来处理下面的参数:

* 接收者 --- 必须与_属性所有者_类型相同或者是其父类(对于扩展属性，类型范围允许扩大),
* 包含数据 --- 一定要是 `属性包含数据` 的类型或它的父类型,
 
这个函数必须返回同样的类型作为属性（或者子类型）

对于一个 **可变** 属性 (如 *var*{:.keyword}), 一个委托需要提供_额外_的函数 `set` 来获取下面的参数:
 
* 接收者 --- 同 `get()`,
* 包含数据 --- 同 `get()`,
* 新的值 --- 必须和属性同类型或者是他的子类型。
 
## 标准委托

标准库中`kotlin.properties.Delegates` 对象对于一些有用的委托提供了工厂（factory）方法。

### 延迟属性 Lazy

函数 `Delegates.lazy()` 会在接受一个变量而后返回一个执行延迟属性的委托: 
第一个调用 `get()` 执行变量传递到 `lazy()` 并记录结果, 
后来的 `get()` 调用只会返回记录的结果。 


``` kotlin
import kotlin.properties.Delegates
 
val lazy: String by Delegates.lazy {
    println("computed!")
    "Hello"
}

fun main(args: Array<String>) {
    println(lazy)
    println(lazy)
}
```

By default, the evaluation of lazy properties is **synchronized**: the value is computed only in one thread, and all threads
will see the same value. If the synchronization of initialization delegate is not required, so that multiple threads
can execute it simultaneously, pass `LazyThreadSafetyMode.PUBLICATION` as a parameter to the `lazy()` function. 
And if you're sure that the initialization will always happen on a single thread, you can use `LazyThreadSafetyMode.NONE` mode, 
which doesn't incur any thread-safety guaratees and the related overhead.

如果你需要 **线程安全**, 使用 `blockingLazy()`: 它会进行同样的操作，但是能够保证数值将会只在一个线程中计算，同时所有线程会看到同样的数值。


### 观察者 Observable

`Delegates.observable()` 需要两个参数：初始值和修改后的处理(handler)。
这个 handler 会在每次赋值的时候被属性调用 (在工作完成前). 它有三个变量:一个被赋值的属性，旧的值和新的值：

``` kotlin
class User {
    var name: String by Delegates.observable("<no name>") {
        d, old, new ->
        println("$old -> $new")
    }
}

fun main(args: Array<String>) {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```

结果：

```
<no name> -> first
first -> second
```
如果你想截取它的分配并取消它，就使用 `vetoable()` 取代 `observable()`.

### 非空 Not-Null

有时候我们有一个非空的值*var*{:.keyword}, 但是我们却没有合适的值去给构造器去初始化。
例如，它必须被之后初始化。问题是在Kotlin中你不能有一个没有被初始化的非抽象属性：

``` kotlin
class Foo {
  var bar: Bar // ERROR: must be initialized
}
```

我们可以用*null*{: .keyword }去初始化它,但是我们不得不在每次使用前检查一下。

`Delegates.notNull()` 可以解决这个问题:

``` kotlin
class Foo {
  var bar: Bar by Delegates.notNull()
}
```

如果这个属性在首次写入前进行读取，它就会抛出一个异常，写入后就正常了。

### 把属性储存在map中

`Delegates.mapVal()` 用到一个map的实例，同时返回一个从map中以把属性名作为关键字读取属性的委托。
这有很多在程序中应用的例子，例如解析JASON数据或者做其他动态的事情：
``` kotlin
class User(val map: Map<String, Any?>) {
    val name: String by Delegates.mapVal(map)
    val age: Int     by Delegates.mapVal(map)
}
```

在这个例子中，构造函数持有一个map：

``` kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

委托会从这个图中取值 (通过属性的名字，也就是string关键字):


``` kotlin
println(user.name) // Prints "John Doe"
println(user.age)  // Prints 25
```

对于 *var*{:.关键词}’s 我们可以使用 `mapVar()` (注意这里需要一个 `MutableMap` 而不是只读的 `Map`).

---
 
翻译By EasonZhou
