---
type: doc
layout: reference
category: "Syntax"
title: "Functions"
---

# 函数

## 函数声明

在Kotlin中，函数声明使用关键字 *fun*{: .keyword }

``` kotlin
fun double(x: Int): Int {
}
```

### 参数

函数参数是使用Pascal符号定义,即 *name*: *type*.

参数用逗号隔开。每个参数必须显式类型。

``` kotlin
fun powerOf(number: Int, exponent: Int) {
...
}
```

### 默认参数(缺省参数)

函数参数有默认值,当对应的参数是省略。与其他语言相比可以减少数量的过载。

``` kotlin
fun read(b: Array<Byte>, off: Int = 0, len: Int = b.size) {
...
}
```

默认值定义使用后* * = * *类型的值。

### 参数命名

函数参数可以在调用函数时被命名。这是非常方便的，当一个函数有大量的参数或默认的。

给出下面的函数:

``` kotlin
fun reformat(str: String,
             normalizeCase: Boolean = true,
             upperCaseFirstLetter: Boolean = true,
             divideByCamelHumps: Boolean = false,
             wordSeparator: Character = ' ') {
...
}
```

我们可以使用默认参数来调用这个

``` kotlin
reformat(str)
```

然而，调用非默认时，调用类似于

``` kotlin
reformat(str, true, true, false, '_')
```

使用命名参数我们可以使代码更具有可读性

``` kotlin
reformat(str,
    normalizeCase = true,
    uppercaseFirstLetter = true,
    divideByCamelHumps = false,
    wordSeparator = '_'
  )
```

如果我们不需要所有的参数


``` kotlin
reformat(str, wordSeparator = '_')
```

### Unit返回函数

如果一个函数不返回任何有用的值，它的返回类型是`Unit`。Unit`是一种只有一个值 - `Unit`。这值不需要显式地返回

``` kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello ${name}")
    else
        println("Hi there!")
    // `return Unit` or `return` is optional
}
```

`Unit`返回类型声明也是可选的。上面的代码等同于

``` kotlin
fun printHello(name: String?) {
    ...
}
```

### 单个表达式函数

当一个函数返回单个表达式，花括号可以省略并且主体由** =**符号之后指定

``` kotlin
fun double(x: Int): Int = x * 2
```

显式地声明返回类型[可选](# explicit-return-types)时,这可以由编译器推断

``` kotlin
fun double(x: Int) = x * 2
```

### 显式地返回类型

在某些情况下,一个显式地返回类型是必需的:

* 函数表达式是公共的或是受保护的.这些都被认为是公共API的一部分.由于没有显式地返回类型使得它有可能更容易更改类型.这就是为什么显式地类型都需要相同的原因[属性](properties.html#getters-and-setters).

* 函数模块体必须显式地指定返回类型,除非是用于返回`Unit`,在这种情况下,它是可选的。Kotlin不推断返回类型与函数在模块体的功能，因为这些功能可能在模块体有复杂的控制流程，返回类型将不明显的阅读器（有时甚至为编译器）.


### 可变的参数(可变参数)

函数的最后一个参数可以使用'vararg`注释

``` kotlin
fun asList<T>(vararg ts: T): List<T> {
  val result = ArrayList<T>()
  for (t in ts) // ts is an Array
    result.add(t)
  return result
}
```

允许可变参数传递给函数:

```kotlin
  val list = asList(1, 2, 3)
```

内部函数`vararg`类型`T`是可见的array`T`,即`ts`变量在上面的例子是`Array<out T>`类型。

只有一个参数可以标注为 `vararg`.这可能是最后一个参数或前一个最后的，如果最后一个参数类型（允许一个lambda括号外传递）

当我们调用`vararg`函数，我们可以一个接一个传递参数，例如 `asList(1, 2, 3)`或者，如果我们已经有了一个数组并希望将其内容传递给函数，我们使用**spread** 操作符(在数组前面加`*`)

```kotlin
val a = array(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

## 函数作用域(函数范围)

在Kotlin中,函数可以在文件头部声明，这意味着您不需要创建一个类来保存一个函数,类似的语言如Java，C＃或Scala。此外除了头部函数功能，Kotlin函数也可以在局部声明，作为成员函数和扩展功能.

### 局部函数

Kotlin提供局部函数,即一个函数在另一个函数中

``` kotlin
fun dfs(graph: Graph) {
  fun dfs(current: Vertex, visited: Set<Vertex>) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v, visited)
  }

  dfs(graph.vertices[0], HashSet())
}
```

局部函数可以访问外部函数的局部变量(即，关闭),所以在上面的例子，the *visited*是局部变量.


``` kotlin
fun dfs(graph: Graph) {
  val visited = HashSet<Vertex>()
  fun dfs(current: Vertex) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v)
  }

  dfs(graph.vertices[0])
}
```

从外部函数使用局部函数甚至可以返回[正确的表达式](returns.html)

``` kotlin
fun reachable(from: Vertex, to: Vertex): Boolean {
  val visited = HashSet<Vertex>()
  fun dfs(current: Vertex) {
    // here we return from the outer function:
    if (current == to) return@reachable true
    // And here -- from local function:
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v)
  }

  dfs(from)
  return false // if dfs() did not return true already
}
```

### 成员函数

成员函数是一个函数,定义在一个类或对象里

``` kotlin
class Sample() {
  fun foo() { print("Foo") }
}
```

成员函数调用点符号

``` kotlin
Sample().foo() // creates instance of class Sample and calls foo
```

有关类信息和主要成员查看[Classes](classes.html) 和 [Inheritance](classes.html#inheritance)

### 重载函数

函数可以有泛型参数,在函数之后使用尖括号和在参数值之前。

``` kotlin
fun singletonArray<T>(item: T): Array<T> {
  return Array<T>(1, {item})
}
```

有关重载函数更多信息请查看 [Generics](generics.html)

### 内联函数

内联函数解释 [here](inline-functions.html)


### 扩展函数

扩展函数解释 [their own section](extensions.html)


### 高阶函数和Lambdas表达式

高阶函数和Lambdas表达式中有详细解释 [their own section](lambdas.html)

## 函数用途

调用函数使用传统的方法

``` kotlin
val result = double(2)
```

调用成员函数使用点符号

``` kotlin
Sample().foo() // create instance of class Sample and calls foo
```

### 插入表示法 

函数还可以用中缀表示法，当

 * 他们是成员函数 或者 [扩展函数](extensions.html)
 
 * 他们有一个参数

``` kotlin
// Define extension to Int
fun Int.shl(x: Int): Int {
...
}

// call extension function using infix notation

1 shl 2

// is the same as

1.shl(2)
```

---

翻译By Jacky Xu









