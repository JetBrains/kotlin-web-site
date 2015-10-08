---
type: doc
layout: reference
category: "Syntax"
title: "Classes and Inheritance"
related:
    - functions.md
    - nested-classes.md
    - interfaces.md
---

# 类和继承

## 类

类声明Kotlin使用关键字*class *{:.keyword}

``` kotlin
class Invoice {
}
```

这个类声明被花括号包围，包括类名、类头(指定其类型参数,主构造函数等)和这个类的主干。类头和主干都是可选的；
如果这个类没有主干，花括号可以被省略。

``` kotlin
class Empty
```


### 构造 

在Kotlin中的类可以有**主构造函数**和一个或多个**二级构造函数**。主构造函数是类头的一部分:它跟在这个类名后面（和可选的类型参数）

``` kotlin
class Person constructor(firstName: String) {
}
```

如果这个主构造函数没有任何注解或者可见的修饰符，这个*constructor*{: .keyword }关键字可以被省略


``` kotlin
class Person(firstName: String) {
}
```

这个主构造函数不能包含任何的代码。初始化的代码可以被放置在**initializer blocks**（初始的模块），以*init*为前缀作为关键字{:.keyword}

``` kotlin
class Customer(name: String) {
    init {
        logger.info("Customer initialized with value ${name}")
    }
}
```

请注意，主构造的参数可以在初始化模块中使用。它们也可以在类体内声明初始化的属性：

``` kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```

事实上，声明属性和初始化主构造函数,Kotlin有简洁的语法:

``` kotlin
class Person(val firstName: String, val lastName: String, var age: Int) {
  // ...
}
```

与普通属性一样,主构造函数中声明的属性可以是可变的或者是只读的

If the constructor has annotations or visibility modifiers, the *constructor*{: .keyword } keyword is required, and
the modifiers go before it:
如果构造函数有注解或可见性修饰符，这个*constructor*{: .keyword }需要被关键字修饰。

``` kotlin
class Customer public inject constructor(name: String) { ... }
```

更多请查看[Visibility Modifiers](visibility-modifiers.html#constructors)

#### 扩展构造函数

类也可以拥有被称为"二级构造函数"(为了实现Kotlin向Java一样拥有多个构造函数)，通常被加上前缀"constructor"

``` kotlin
class Person {
    constructor(parent: Person) {
        parent.children.add(this)
    }
}
```

如果类有一个主构造函数,每个二级构造函数需要委托给主构造函数,直接或间接地通过另一个二级函数。
委托到另一个使用同一个类的构造函数用*this*{: .keyword }关键字

``` kotlin
class Person(val name: String) {
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

如果一个非抽象类没有声明任何构造函数（原发性或继发性），这将有一个生成的主构造函数不带参数。构造函数的可见性是public。如果你不希望你的类有一个公共构造函数，你需要声明与非缺省可见一个空的主构造函数：



``` kotlin
class DontCreateMe private constructor () {
}
```


> **注意**在JVM上，如果所有的主构造函数的参数有默认值，编译器会产生一个额外的参数的构造函数，将使用默认值。
> 这使得更易于使用kotlin与通过参数构造函数创建类的实例，如使用Jackson或JPA库的时候。
>
> ``` kotlin
> class Customer(val customerName: String = "")
> ```
{:.info}

### 创建类的实例

要创建一个类的实例，我们调用构造函数，就好像它是普通的函数：

``` kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

注意Kotlin不能有“new”关键字


### 类成员

类可以包括

* 构造和初始化模块
* [函数](functions.html)
* [属性](properties.html)
* [匿名和内部类](nested-classes.html)
* [对象声明](object-declarations.html)


## 继承

在Kotlin所有的类中都有一个共同的父类`Any`，这是一个默认的父类且没有父类型声明：

``` kotlin
class Example // Implicitly inherits from Any
```

`Any`不属于`java.lang.Object`;特别是，它并没有任何其他任何成员，甚至连`equals()`，`hashCode()`和`toString()`都没有。   

请参阅[Java的互操作性](java-interop.html#object-methods)更多的细节部分。

要声明一个明确的父类，我们把类型放到类头冒号之后：

``` kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

如上所见，父类可以（并且必须）在声明继承的地方，用原始构造函数初始化。

如果类没有主构造，那么每个次级构造函数初始化基本类型
使用*super*{：.keyword}关键字，或委托给另一个构造函数做到这一点。
注意，在这种情况下，不同的二级构造函数可以调用基类型的不同的构造：

``` kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx) {
    }

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs) {
    }
}
```

父类上的*open*{：.keyword}标注可以理解为Java中*final*{：.keyword}的反面，它允许其他他类
从这个类中继承。默认情况下，在Kotlin所有的类都是final，
对应于 [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html)
书中的17条：**设计并显示标注继承，否则就禁止它**。


### 覆盖成员

我们之前提到过，Kotlin力求清晰显式。不像Java中，Kotlin需要明确的
标注覆盖的成员（我们称之为*open*）和重写的函数。（继承父类并覆盖父类函数时，Kotlin要求父类必须有*open*标注，被覆盖的函数必须有*open*标注，并且子类的函数必须加*override*标注。）：

``` kotlin
open class Base {
  open fun v() {}
  fun nv() {}
}
class Derived() : Base() {
  override fun v() {}
}
```

Derived.v()函数上必须加上**override**标注。如果没写，编译器将会报错。
如果父类的这个函数没有标注**open**，则子类中不允许定义同名函数，不论加不加**override**。
在一个**final**类中（即没有声明**open**的类），函数上也不允许加**open**标注。


成员标记为*override*{：.keyword}的本身是开放的，也就是说，它可以在子类中重写。如果你想禁止重写的，使用*final*{：.keyword}关键字：

``` kotlin
open class AnotherDerived() : Base() {
  final override fun v() {}
}
```

#### 等等!!这样我怎么hack我的库？


我们这样设计继承和覆盖的方式(类和成员默认**final**)，会让人很难继承第三方的类，因此很难进行hack。

我们认为这不是一个劣势，原因如下：

* 最佳实践已经表明不应该使用这些hacks
* 其他的有类似机制的语言(C++, C#)已经证明是成功的
* 如果人们实在想hack，仍然有办法：比如某些情况下可以使用Java进行hack，再用Kotlin调用；或者使用面向切面的框架(Aspect)。（请参阅[Java的互操作](java-interop.html))

### 重写的规则

在Kotlin中，实现继承的调用通过以下规则：
如果一个类继承父类成员的多种实现方法，可以直接在子类中引用，
它必须重写这个成员，并提供其自己的实现（当然也可以使用父类的）。
为了表示从中继承的实现而采取的父类型，我们使用*super*{：.keyword}在尖括号，如规范的父名`super<Base>`：


``` kotlin
open class A {
  open fun f() { print("A") }
  fun a() { print("a") }
}

interface B {
  fun f() { print("B") } // interface members are 'open' by default
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

类C同时继承A和B是可以的，而且我们在调用a()和b()函数时没有任何问题，因为他们在C的基类中只有一个实现。
但是f()函数则在A,B中都有实现，所以我们*必须*在C中覆盖f()，并且提供我们的实现以消除歧义。



## 抽象类

类和其中的某些实现可以声明为*abstract*{：.keyword}。
抽象成员在本类中可以不用实现。。
因此，当一些子类继承一个抽象的成员，它并不算是一个实现：

``` kotlin
abstract class A {
  abstract fun f()
}

interface B {
  open fun f() { print("B") }
}

class C() : A(), B {
  // We are not required to override f()
}
```

Note that we do not need to annotate an abstract class or function with open – it goes without saying.

We can override a non-abstract open member with an abstract one

需要注意的是，我们并不需要标注一个抽象类或者函数为*open* - 因为这不言而喻。

我们可以重写一个*open*非抽象成员使之为抽象的。

``` kotlin
open class Base {
  open fun f() {}
}

abstract class Derived : Base() {
  override abstract fun f()
}
```

## 同伴对象

在Kotlin中，不像Java或C＃，类没有静态方法。在大多数情况下，它建议简单地使用包级函数。

如果你需要写一个可以调用的函数，而不依赖一个类的实例，但需要访问的内部一个类（例如，一个工厂方法），你可以写为[对象声明]（object_declarations.html）中的一员里面的那个类。

更具体地讲，如果你声明一个[同伴对象](object-declarations.html#companion-objects)在你的的类中，
你就可以在Java/ C＃中调用与它的成员方法相同的语法的静态方法，只使用类名作为一个修饰语。

---

翻译BY S_arige