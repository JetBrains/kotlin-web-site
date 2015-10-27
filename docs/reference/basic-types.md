---
type: doc
layout: reference
category: "Syntax"
title: "Basic Types"
---

# 基本类型

在Kotlin中,所有东西都是对象，所以我们可以调用成员函数和属性的任何变量对象。有些类型是内置的,他们的实现被优化过, 但是用户看起来他们就像普通的类. 本节我们会描述这些类型: numbers, characters, booleans 和 arrays.

## Numbers

Kotlin处理numbers和Java很接近,但是并不完全相同. 例如, 对于numbers没有隐式扩大转换(如java中int可以隐式变为long),在一些情况下文字的使用有所不同.

对于numbers Kotlin提供了如下的内置类型 (与Java很相近):

| Type	 | Bitwidth |
|--------|----------|
| Double | 64       |
| Float	 | 32       |
| Long	 | 64       |
| Int	   | 32       |
| Short	 | 16       |
| Byte	 | 8        |

注意在kotlin中 characters 不是 numbers 

### 字面量

下面是一些常量的写法:

* 十进制: `123`
  * Longs类型用大写 `L` 标记: `123L`
* 十六进制: `0x0F`
* 二进制: `0b00001011`

注意: 不支持8进制

Kotlin 同样支持浮点数的常规表示方法:
 
* Doubles  `123.5`, `123.5e10`
* Floats用 `f` 或者 `F` 标记: `123.5f` 

### 存储方式

在Java平台数字是物理存储为JVM的原始类型,除非我们需要一个可空的引用（例如int？）或泛型. 后者情况下数字被装箱（指的是赋值的时候把实例复制了一下，不是相同实例）。

装箱数字不会保存它的实例:

``` kotlin
val a: Int = 10000
print(a identityEquals a) // Prints 'true'
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA identityEquals anotherBoxedA) // !!!Prints 'false'!!!
```
另一方面它们值相等:

``` kotlin
val a: Int = 10000
print(a == a) // Prints 'true'
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA == anotherBoxedA) // Prints 'true'
```

### 显示转换

由于不同的存储方式小的类型并不是大类型的子类型。
如果它们是的话，就会出现下述问题（下面的代码不能通过编译）：

``` kotlin
// Hypothetical code, does not actually compile:
val a: Int? = 1 // A boxed Int (java.lang.Integer)
val b: Long? = a // implicit conversion yields a boxed Long (java.lang.Long)
print(a == b) // Surprise! This prints "false" as Long's equals() check for other part to be Long as well
```

假设这样是可以的，这里我们就悄无声息的丢掉了一些数据.

因此较小的类型不能隐式转换为较大的类型。
因此我们不能声明一个 `Byte` 类型给一个 `Int` 变量，在不进行显示转换的情况下。

``` kotlin
val b: Byte = 1 // OK, literals are checked statically
val i: Int = b // ERROR
```

我们可以显示转换的去扩大类型

``` kotlin
val i: Int = b.toInt() // OK: explicitly widened
```

每个number类型支持如下的转换:

* `toByte(): Byte`
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`
* `toChar(): Char`

失去隐式类型转换，其实并没有带来多少困扰，因为使用字面量的时候是没有代价的，因为字面量的类型是推导出来的；
另一方面，算数运算操作都针对不同类型的参数做好了重载，比如：

``` kotlin
val l = 1.toLong() + 3 // Long + Int => Long
```

### 运算符

Kotlin支持标准的算数操作符，并在相应的类上定义为成员函数（但编译器会针对运算进行优化，将函数调用优化成直接的算数操作）。
查看 [Operator overloading](operator-overloading.html).

对于按位操作(bitwise operation)，没有特别的符号来表示，而是直接使用命名函数:

``` kotlin
val x = (1 shl 2) and 0x000FF000
```

这是完整的位运算操作 (只能对 `Int` 或者 `Long` 使用):

* `shl(bits)` – signed shift left (Java's `<<`)
* `shr(bits)` – signed shift right (Java's `>>`)
* `ushr(bits)` – unsigned shift right (Java's `>>>`)
* `and(bits)` – bitwise and
* `or(bits)` – bitwise or
* `xor(bits)` – bitwise xor
* `inv()` – bitwise inversion

## Characters

Characters 用 `Char`来表示. 不能像对待numbers那样处理

``` kotlin
fun check(c: Char) {
  if (c == 1) { // ERROR: incompatible types
    // ...
  }
}
```

用单引号表示一个Character，例如: `'1'`, `'\n'`, `'\uFF00'`.
我们可以调用显示转换把Character转换为`Int`

``` kotlin
fun decimalDigitValue(c: Char): Int {
  if (c !in '0'..'9')
    throw IllegalArgumentException("Out of range")
  return c.toInt() - '0'.toInt() // Explicit conversions to numbers
}
```

像numbers, characters是被装箱当使用一个可空的引用.这样实例不会被保存。

## Booleans

类型`Boolean`有两个值: *true*{: .keyword } 和 *false*{: .keyword }.

Booleans使用nullable时候Boolean也会被装箱.

内置对Booelan的操作

* `||` – 短路或
* `&&` – 短路与

## 数组

数组在Kotlin中使用 `Array`类来表示, `Array`类定义了set和get函数(使用时可以用`[]`，通过符号重载的约定转换), 和`size`等等一些有用的成员函数:

``` kotlin
class Array<T> private () {
  fun size(): Int
  fun get(index: Int): T
  fun set(index: Int, value: T): Unit

  fun iterator(): Iterator<T>
  // ...
}
```

我们可以使用库函数`array()`来创建一个包含数值的数组, `array(1, 2, 3)` 创建了 array [1, 2, 3].
或者, `arrayOfNulls()`可以创建一个指定大小，元素都为空的数组。  
或者使用函数来创建一个数组:

``` kotlin
// Creates an Array<String> with values ["0", "1", "4", "9", "16"]
val asc = Array(5, {i -> (i * i).toString()})
```

综上, `[]`操作符代表了成员函数`get()`和`set()`.

注意: 与Java不同的是, Kotlin中数组不可变. 这意味着我们不能声明 `Array<String>`到`Array<Any>`, 否则可能会产生一个运行时错误(但是你可以使用 `Array<out Any>`, 查看 [Type Projections](generics.html#type-projections)).

Kotlin有专门的类来表示原始类型的数组，避免了装箱开销: ByteArray,
ShortArray, IntArray 等等. 这些类和`Array`并没有继承关系,但是它们有同样的方法属性集. 它们也都有相应的工厂方法:

``` kotlin
val x: IntArray = intArray(1, 2, 3)
x[0] = x[1] + x[2]
```

## 字符串

字符串用`String`表示。字符串是不可变的。  
字符串的原始字符可以使用操作符访问: `s[i]`.
字符串可以使用*for*{: .keyword }循环遍历:

``` kotlin
for (c in str) {
  println(c)
}
```

### 字符串字面量
Kotlin有两种类型的字符串: 转义字符串可能由转义字符、原生字符串、换行和任意文本.转义字符串很像java的String:

``` kotlin
val s = "Hello, world!\n"
```

转义方式采用传统的反斜杠.

*原生字符串*使用三个引号(""")包括，内部没有转义，可以包含换行和任何其他文本:

``` kotlin
val text = """
  for (c in "foo")
    print(c)
"""
```


### 模板

字符串可以包含*模板表达式*，即一些小段代码，会求值并把结果合并到字符串中。模板表达式以`$`符号开始，包含一个简单的名称:

``` kotlin
val i = 10
val s = "i = $i" // evaluates to "i = 10"
```

或者用花括号扩起来，内部可以是任意表达式:

``` kotlin
val s = "abc"
val str = "$s.length is ${s.length}" // evaluates to "abc.length is 3"
```

---

校对BY 空白

