---
type: doc
layout: reference
title: "What's New in Kotlin 1.1"
---

# What's New in Kotlin 1.1

Kotlin 1.1 is currently available in beta. Here you can find a list of new features available in this release.
Note that any new functionality is subject to change before Kotlin 1.1 is released.

## Coroutines

The key new feature in Kotlin 1.1 is *coroutines*, bringing the support of `async`/`await`, `yield` and similar programming
patterns. The key feature of Kotlin's design is that the implementation of coroutine execution is part of the libraries,
not the language, so you aren't bound to any specific programming paradigm or concurrency library.

A coroutine is effectively a function that can be suspended and resumed later. For example, with `async`/`await`,
when you use `await`, the execution of the function is suspended while the operation being awaited is executed, and
is resumed (possibly on a different thread) when the operation being awaited completes.

The standard library uses coroutines to support *lazily generated sequences* with `yield` and `yieldAll` functions.
In such a sequence, the block of code that returns sequence elements is suspended after each element has been retrieved,
and resumed when the next element is requested. Here's an example:

``` kotlin
val seq = buildSequence {
    println("Yielding 1")
    yield(1)
    println("Yielding 2")
    yield(2)
    println("Yielding a range")
    yieldAll(3..5)
}

for (i in seq) {
    println("Generated $i")
}
```

This will print:

```
Yielding 1
Generated 1
Yielding 2
Generated 2
Yielding a range
Generated 3
Generated 4
Generated 5
```

The implementation of `async`/`await` is provided as an external library, [kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines).
Here's an example showing its use:

``` kotlin
async {
    val original = asyncLoadImage("...original...") // creates a Future
    val overlay = asyncLoadImage("...overlay...")   // creates a Future
    ...
    // suspend while awaiting the loading of the images
    // then run `applyOverlay(...)` when they are both loaded
    return applyOverlay(original.await(), overlay.await())
}
```


kotlinx.coroutines relies on `CompletableFuture` and therefore requires JDK 8, but it's possible to build other implementations
that will be compatible with environments such as Android where only Java 6 is available.

The [KEEP document](https://github.com/Kotlin/kotlin-coroutines/blob/master/kotlin-coroutines-informal.md) provides an extended
description of the coroutine functionality.

Note that coroutines are currently considered an **experimental feature**, meaning that the Kotlin team is not committing
to supporting the backwards compatibility of this feature after the final 1.1 release.


## Other Language Features

### Type aliases

A type alias allows you to define an alternative name for an existing type.
This is most useful for generic types such as collections, as well as for function types.
Here are a few examples:

``` kotlin
typealias FileTable<K> = MutableMap<K, MutableList<File>>

typealias MouseEventHandler = (Any, MouseEvent) -> Unit
```

Read the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases.md) for more details.


### Bound callable references

You can now use the `::` operator to get a [member reference](reflection.html#function-references) pointing to a method or property of a specific object instance.
Previously this could only be expressed with a lambda.
Here's an example:

``` kotlin
val numberRegex = "\\d+".toRegex()
val numbers = listOf("abc", "123", "456").filter(numberRegex::matches)
// Result is list of "123", "456"
```

Read the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references.md) for more details.


### Local delegated properties

You can now use the [delegated property](delegated-properties.html) syntax with local variables.
One possible use is defining a lazily evaluated local variable:

``` kotlin
fun foo() {
    val data: String by lazy { /* calculate the data */ }
    if (needData()) {
        println(data)   // data is calculated at this point
    }
}
```

Read the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties.md) for more details.


### Sealed and data classes

Kotlin 1.1 removes some of the restrictions on sealed and data classes that were present in Kotlin 1.0.
Now you can define subclasses of a sealed class anywhere in the same file, and not just as nested classes of the sealed class.
Data classes can now extend other classes.
This can be used to define a hierarchy of expression classes nicely and cleanly:

``` kotlin
sealed class Expr

data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
}
```

Read the [sealed class](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance.md) and
[data class](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance.md) KEEPs for more detail.


### Destructuring in lambdas

You can now use the [destructuring declaration](multi-declarations.html) syntax to unpack the arguments passed to a lambda.
Here's an example:

``` kotlin
map.mapValues { (key, value) -> "$value!" }
```

Read the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters.md) for more details.


### Underscores for unused parameters

For a lambda with multiple parameters, you can use the `_` character to replace the names of the parameters you don't use:

``` kotlin
map.forEach { _, value -> println("$value!") }
```

This also works in [destructuring declarations](multi-declarations.html):

```
val (_, status) = getResult()
```

Read the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters.md) for more details.


### Underscores in numeric literals

Just as in Java 8, Kotlin now allows to use underscores in numeric literals to separate groups of digits:

``` kotlin
val oneMillion = 1_000_000
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
```

Read the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals.md) for more details.


