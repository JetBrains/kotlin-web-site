---
type: doc
layout: reference
category: "Syntax"
title: "Properties and Fields"
---

# 属性和字段

## 声明属性

Kotlin的属性.
这些声明是可变的,用关键字*var*{: .keyword }或者使用只读关键字*val*{: .keyword }.

``` kotlin
public class Address { 
  public var name: String = ...
  public var street: String = ...
  public var city: String = ...
  public var state: String? = ...
  public var zip: String = ...
}
```

要使用一个属性，只需要使用名称引用即可，就相当于Java中的公共字段：

``` kotlin
fun copyAddress(address: Address): Address {
  val result = Address() // there's no 'new' keyword in Kotlin
  result.name = address.name // accessors are called
  result.street = address.street
  // ...
  return result
}
```

## getters和setters

声明一个属性的完整语法

``` kotlin
var <propertyName>: <PropertyType> [= <property_initializer>]
  <getter>
  <setter>
```

上面的定义中，初始器(initializer)、getter和setter都是可选的。
属性类型(PropertyType)如果可以从初始器或者父类中推导出来，也可以省略。

例如:

``` kotlin
var allByDefault: Int? // error: explicit initializer required, default getter and setter implied
var initialized = 1 // has type Int, default getter and setter
```

注意公有的API(即**public**和**protected**)的属性，类型是不做推导的。
这么设计是为了防止改变初始化器时不小心改变了公有API。比如：

``` kotlin
public val example = 1 // error: a public property must have a type specified explicitly
```

一个只读属性的语法和一个可变的语法有两方面的不同：1·只读属性的用val开始代替var 2·只读属性不许setter

``` kotlin
val simple: Int? // has type Int, default getter, must be initialized in constructor
val inferredType = 1 // has type Int and a default getter
```

我们可以编写自定义的访问器,非常像普通函数,对内部属性声明。这里有一个定义的getter的例子:

``` kotlin
val isEmpty: Boolean
  get() = this.size == 0
```

一个定义setter的例子:

``` kotlin
var stringRepresentation: String
  get() = this.toString()
  set(value) {
    setDataFromString(value) // parses the string and assigns values to other properties
  }
```
按照惯例,setter参数的名称是“value”,但是如果你喜欢你可以选择一个不同的名称。

如果你需要改变一个访问器或注释的可见性,但是不需要改变默认的实现,
您可以定义访问器而不定义它的实例:

``` kotlin
var setterVisibility: String = "abc" // Initializer required, not a nullable type
  private set // the setter is private and has the default implementation

var setterWithAnnotation: Any?
  @Inject set // annotate the setter with Inject
```

### 实际字段

在Kotlin不能有字段。然而,有时有必要有使用一个字段在使用定制的访问器的时候。对于这些目的,Kotlin提供
自动支持,在属性名后面使用* $ *符号。

``` kotlin
var counter = 0 // the initializer value is written directly to the backing field
  set(value) {
    if (value >= 0)
      $counter = value
  }
```

上面的`$counter`字段就可以在counter属性的访问器实现里读和写。并且只能在构造函数里赋值。在其他地方，都不能使用或访问`$counter`

编译器会查看访问器的内部， 如果他们使用了实际字段（或者访问器使用默认实现），那么将会生成一个实际字段，否则不会生成。

例如，下面的情况下， 就没有实际字段：

``` kotlin
val isEmpty: Boolean
  get() = this.size == 0
```

### 支持属性

如果你的需求不符合这套“隐式的实际字段“方案，那么总可以使用“后背支持属性”(backing property)的方法：

``` kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
  get() {
    if (_table == null)
      _table = HashMap() // Type parameters are inferred
    return _table ?: throw AssertionError("Set to null by another thread")
  }
```
从各种角度看，这和在Java中定义Bean属性的方式一样。因为访问私有的属性的getter和setter函数，会被编译器优化成直接反问其实际字段。

## 重写属性

查看 [Overriding Members](classes.html#overriding-members)

## 委托属性
  
从支持域最常见类型的属性只读(写入)。
另一方面,使用自定义getter和setter属性可以实现任何方法行为。
介于两者之间,有一些常见的模式属性是如何工作的。一个例子:lazy values,从映射读取关键字,访问一个数据库,访问通知侦听器,等等。

像常见的行为可以从函数库调用像delegated properties。
更多信息在[这里](delegated-properties.html)。

--- 

翻译BY 空白

