---
type: doc
layout: reference
category: "Syntax"
title: "Inline Functions"
---

# 内联函数 inline

使用[高阶函数](lambdas.html)会带来一些运行时间效率的损失：每一个函数都是一个对象，并且都会捕获一个闭包。
例如：一些在函数体内会被访问的变量。
内存分配(对于函数对象和类)和虚拟调用引入运行时间开销。
但是在许多情况下通过内联化匿名函数可以降低这类的开销。
我们通过下面的示例函数来分析上面这些内容。如，`lock()` 函数可以被很容易的在申明调用时被内联化。

``` kotlin
lock(l) {foo()}
```
编译器没有为参数创建一个函数对象和产生一个调用点。取而代之，编译器产生了下面的代码：

``` kotlin
lock.lock()
try {
  foo()
}
finally {
  lock.unlock()
}
```

这个不是我们在一开始时候想要的么？
为了让编译器做这个，我们需要在`lock()`函数前面加上`inline`:

``` kotlin
inline fun lock<T>(lock: Lock, body: () -> T): T {
  // ...
}
```

`inline`关键字注释会影响函数体本身以及传递过来的lambdas: 这些所都会被内联到调用点。

内联本身有时会引起生成的代码数量增加，但是如果我们使用得当(不要内联大的函数)。它将在性能上有所提升，尤其是在极其巨大的调用循环中。

## 禁止内联@noinline

为了预防有时候你只希望一部分的lambdas传递到一个内联函数后背内联，你可以把一些你的函数变量用 `@noinline` 标记:

``` kotlin
inline fun foo(inlined: () -> Unit, @noinline notInlined: () -> Unit) {
  // ...
}
```

可以内联的lambdas只能在内联函数内部被调用或者被当作一个可内联的参数传递。但是通过 `@noinline`
我们可以把它变化成任何的方式：储存在指定地点，传递它等等。

需要注意的是，如果一个内联函数没有可以内联的函数变量并且没有[泛型变量](#reified-type-parameters), 编译器会产生一个警告。因为内联一个这样的函数很可能是无意义的(你可以无视这个警告如果你确定内联是必须的).

## 非本地的返回

在Kotlin中，我们只能使用一个普通的，无限制的`return`来退出一个命名的函数或者函数表达式。这个意味着为了退出一个lambda,我们不得不用一个 [标签](returns.html#return-at-labels),同时 在一个lambda中`return`单独出现时不允许的,因为一个lambda不可能让完整的函数返回:

``` kotlin
fun foo() {
  ordinaryFunction {
     return // ERROR: can not make `foo` return here
  }
}
```
但是如果函数和lambda被传到一个内联函数中，return也可以被内联。于是下面就是允许的：

``` kotlin
fun foo() {
  inlineFunction {
    return // OK: the lambda is inlined
  }
}
```

这样的返回(在lambda中，但是退出闭包的函数)被称作*non-local*返回。我们把这种排序构造用在循环中。通常这些内联函数是闭合的：

``` kotlin
fun hasZeros(ints: List<Int>): Boolean {
  ints.forEach {
    if (it == 0) return true // returns from hasZeros
  }
  return false
}
```

注意有些内联函数可能会不直接从在函数体中调用被作为参数传递过来的lambdas，而从其他执行语句中调用，像一个本地对象或者一个嵌套函数。在这种情况下，非本地的控制流程也会被lambdas禁止。为了标识这种情况，lambda参数需要以`InlineOptions.ONLY_LOCAL_RETURN` 标注:

``` kotlin
inline fun f(inlineOptions(InlineOption.ONLY_LOCAL_RETURN) body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```


> `break` 和 `continue` 在内联的lambdas还不能使用, 但是我们正在计划支持他们。

## 泛型变量

有时候我们需要访问一个作为参数传递过来的变量类型：

``` kotlin
fun <T> TreeNode.findParentOfType(clazz: Class<T>): T? {
    var p = parent
    while (p != null && !clazz.isInstance(p)) {
        p = p?.parent
    }
    @suppress("UNCHECKED_CAST")
    return p as T
}
```

在这里我们访问一个树并且检查每个节点是不是特定的类型。这都没有问题，但是访问点并不理想：

``` kotlin
myTree.findParentOfType(javaClass<MyTreeNodeType>())
```

我们真正想要的只是简单的传递一个类型给函数，例如这样调用：

``` kotlin
myTree.findParentOfType<MyTreeNodeType>()
```

为了实现这个，内联函数支持 *泛型变量*, 于是我们就可以这样写：

``` kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p?.parent
    }
    return p as T
}
```

我们用泛型修饰符reified表示变量类型，于是现在它在函数内部就可以像正常函数一样的访问了。既然这个函数是内联的，没有必须的反射，一般的运算符 `!is`
和 `as`就开始工作. 同时，我们也可以这样调用它: `myTree.findParentOfType<MyTreeNodeType>()`.

虽然反射在很多情况下不一定需要，我们还是可以在泛型参数里使用它： `javaClass()` 给我们权限去访问它:

``` kotlin
inline fun methodsOf<reified T>() = javaClass<T>().getMethods()

fun main(s: Array<String>) {
  println(methodsOf<String>().joinToString("\n"))
}
```

正常的函数 (没有被标记为内联) 不能够有泛型参数.
一个没有一个运行时表示的类型 (例如一个非泛型参数或者一个虚构类型如 `Nothing`)不能被用做泛型参数的变量。

更详细解释参考 [spec document](https://github.com/JetBrains/kotlin/blob/master/spec-docs/reified-type-parameters.md).

---

翻译By EasonZhou
