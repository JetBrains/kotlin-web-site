---
type: doc
layout: reference
title: "What's New in Kotlin 1.1"
---

# What's New in Kotlin 1.1

Kotlin 1.1 is currently [available in beta](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-beta-is-here/). Here you can find a list of new features available in this release.
Note that any new functionality is subject to change before Kotlin 1.1 is released.

## JavaScript

Starting with Kotlin 1.1, the JavaScript target is no longer considered experimental. All language features are supported,
and there are many new tools for integration with the front-end development environment. See [below](#javascript-backend) for
a more detailed list of changes.

## Coroutines (experimental)

The key new feature in Kotlin 1.1 is *coroutines*, bringing the support of `future`/`await`, `yield` and similar programming
patterns. The key feature of Kotlin's design is that the implementation of coroutine execution is part of the libraries,
not the language, so you aren't bound to any specific programming paradigm or concurrency library.

A coroutine is effectively a function that can be suspended and resumed later. For example, with `future`/`await`,
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

The implementation of `future`/`await` is provided as an external library, [kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines).
Here's an example showing its use:

``` kotlin
future {
    val original = asyncLoadImage("...original...") // creates a Future
    val overlay = asyncLoadImage("...overlay...")   // creates a Future
    ...
    // suspend while awaiting the loading of the images
    // then run `applyOverlay(...)` when they are both loaded
    return applyOverlay(original.await(), overlay.await())
}
```


kotlinx.coroutines `future` implementation relies on `CompletableFuture` and therefore requires JDK 8, but it also provides portable `defer` primitive and it's possible to build other implementations.

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

``` kotlin
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


### Shorter syntax for properties

For properties without custom accessors, or with the getter defined as an expression body, the property type can now be omitted:

``` kotlin
val name = ""

val lazyName get() = ""
```

For both of these properties, the compiler will infer that the property type is `String`.


### Inline property accessors

You can now mark property accessors with the `inline` modifier if the properties don't have a backing field.
Such accessors are compiled in the same way as [inline functions](inline-functions.html).

``` kotlin
val foo: Foo
    inline get() = Foo()
```

Read the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties.md) for more details.


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


### Interception of delegated property binding

For [delegated properties](delegated-properties.html), it is now possible to intercept delegate to property binding using the
`provideDelegate` operator.
For example, if we want to check the property name before binding, we can write something like this:

``` kotlin
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(thisRef: MyUI, property: KProperty<*>): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, property.name)
        ... // property creation
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

class MyUI {
    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

The `provideDelegate` method will be called for each property during the creation of a `MyUI` instance, and it can perform
the necessary validation right away.


### Generic enum value access

It is now possible to enumerate the values of an enum class in a generic way:

``` kotlin
enum class RGB { RED, GREEN, BLUE }

print(enumValues<RGB>().joinToString { it.name }) // prints RED, GREEN, BLUE
```


### Scope control for implicit receivers in DSLs

The `@DslMarker` annotation allows to restrict the use of receivers from outer scopes in a DSL context.
Consider the canonical [HTML builder example](type-safe-builders.html):

``` kotlin
table {
    tr {
        td { +"Text" }
    }
}
```

In Kotlin 1.0, code in the lambda passed to `td` has access to three implicit receivers: the one passed to `table`, to `tr`
and to `td`. This allows you to call methods that make no sense in the context - for example to call `tr` inside `td` and thus
to put a `<tr>` tag in a `<td>`.

In Kotlin 1.1, you can restrict that, so that only methods defined on the implicit receiver of `td`
will be available inside the lambda passed to `td`. You do that by defining your annotation marked with the `@DslMarker` meta-annotation
and applying it to the base class of the tag classes:

``` kotlin
@DslMarker
annotation class HtmlTagMarker

@HtmlTagMarker
abstract class Tag(val name: String) { ... }

class TD() : Tag("td") { ... }

fun Tag.td(init: TD.() -> Unit) {
}
```

Now that the implicit receiver of the `init` lambda passed to the `td` function is a class annotated with `@HtmlTagMarker`,
so the outer receivers of types which also have this annotation will be blocked.

Read the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers.md) for more details.


### `rem` operator

The `mod` operator is now deprecated, and `rem` is used instead. See [this issue](https://youtrack.jetbrains.com/issue/KT-14650) for motivation.

## Standard library

### String to number conversions

There is a bunch of new extensions on the String class to convert it to a number without throwing an exception on invalid number:
`String.toIntOrNull(): Int?`, `String.toDoubleOrNull(): Double?` etc.

Also integer conversion functions, like `Int.toString()`, `String.toInt()`, `String.toIntOrNull()`,
each got an overload with `radix` parameter, which allows to specify the base of conversion.

### onEach()

`onEach` is a small, but useful extension function for collections and sequences, which allows to perform some action,
possibly with side-effects, on each element of the collection/sequence in a chain of operations.
On iterables it behaves like `forEach` but also returns the iterable instance further. And on sequences it returns a
wrapping sequence, which applies the given action lazily as the elements are being iterated.

### takeIf() and also()

These are two general-purpose extension functions applicable to any receiver.
 
`also` is like `apply`: it takes the receiver, does some action on it, and returns that receiver. 
The difference is that in the block inside `apply` the receiver is available as `this`, 
while in the block inside `also` it's available as `it` (and you can give it another name if you want).
This comes handy when you do not want to shadow `this` from the outer scope:

```kotlin
fun Block.copy() = Block().also { it.content = this.content }
```

`takeIf` is like `filter` for a single value. It checks whether the receiver meets the predicate, and
returns the receiver, if it does or `null` if it doesn't. 
Combined with an elvis-operator and early returns it allows to write constructs like:

```kotlin
val outDirFile = File(outputDir.path).takeIf { it.exists() } ?: return false
// do something with existing outDirFile

val index = input.indexOf(keyword).takeIf { it >= 0 } ?: error("keyword not found")
// do something with index of keyword in input string, given that it's found
```


### groupingBy()

This API can be used to group a collection by key and fold each group simultaneously. For example, it can be used
to count the frequencies of characters in a text:

``` kotlin
val frequencies = words.groupingBy { it }.eachCount()
```

### Map.toMap() and Map.toMutableMap()

These functions can be used for easy copying of maps:

``` kotlin
class ImmutablePropertyBag(map: Map<String, Any>) {
    private val mapCopy = map.toMap()
}
```

### minOf() and maxOf()

These functions can be used to find the minimum and maximum of two given numbers.

### Array-like List instantiation functions

Similar to the `Array` constructor, there are now functions that create `List` and `MutableList` instances and initialize
each element by calling a lambda:

``` kotlin
List(size) { index -> element }
MutableList(size) { index -> element }
```

### Map.getValue()

This method on `Map` returns an existing value corresponding to the given key or throws an exception, mentioning which key was not found.
If the map was produced with `withDefault`, this method will return the default value instead of throwing an exception.


### Abstract collections

These abstract classes can be used as base classes when implementing Kotlin collection classes.
For implementing read-only collections there are `AbstractCollection`, `AbstractList`, `AbstractSet` and `AbstractMap`, 
and for mutable collections there are `AbstractMutableCollection`, `AbstractMutableList`, `AbstractMutableSet` and `AbstractMutableMap`.
On JVM these abstract mutable collections inherit most of their functionality from JDK's abstract collections.

## JVM Backend

### Java 8 bytecode support

Kotlin has now the option of generating Java 8 bytecode (`-jvm-target 1.8` command line option or the corresponding options
in Ant/Maven/Gradle). For now this doesn't change the semantics of the bytecode (in particular, default methods in interfaces
and lambdas are generated exactly as in Kotlin 1.0), but we plan to make further use of this later.


### Java 8 standard library support

There are now separate versions of the standard library supporting the new JDK APIs added in Java 7 and 8.
If you need access to the new APIs, use `kotlin-stdlib-jre7` and `kotlin-stdlib-jre8` maven artifacts instead of the standard `kotlin-stdlib`.
These artifacts are tiny extensions on top of `kotlin-stdlib` and they bring it to your project as a transitive dependency.


### Parameter names in the bytecode

Kotlin now supports storing parameter names in the bytecode. This can be enabled using the `-java-parameters` command line option.


### Constant inlining

The compiler now inlines values of `const val` properties into the locations where they are used.


### Mutable closure variables

The box classes used for capturing mutable closure variables in lambdas no longer have volatile fields. This change improves
performance, but can lead to new race conditions in some rare usage scenarios. If you're affected by this, you need to provide
your own synchronization for accessing the variables.


### javax.scripting support

Kotlin now integrates with the [javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223). See [here](https://github.com/JetBrains/kotlin/tree/master/libraries/examples/kotlin-jsr223-local-example)
for an example project using the API.


## JavaScript Backend

### Unified standard library

A much larger part of the Kotlin standard library can now be used from code compiled to JavaScript.
In particular, key classes such as collections (`ArrayList`, `HashMap` etc.), exceptions (`IllegalArgumentException` etc.) and a few
others (`StringBuilder`, `Comparator`) are now defined under the `kotlin` package. On the JVM, the names are type
aliases for the corresponding JDK classes, and on the JS, the classes are implemented in the Kotlin standard library.

### Better code generation

JavaScript backend now generates more statically checkable code, which is friendlier to JS code processing tools,
like minifiers, optimisers, linters, etc.

### The `external` modifier

If you need to access a class implemented in JavaScript from Kotlin in a typesafe way, you can write a Kotlin
declaration using the `external` modifier. (In Kotlin 1.0, the `@native` annotation was used instead.)
Unlike the JVM target, the JS one permits to use external modifier with classes and properties.
For example, here's how you can declare the DOM `Node` class:

``` kotlin
external class Node {
    val firstChild: Node

    fun appendChild(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}
```

### Improved import handling

You can now describe declarations which should be imported from JavaScript modules more precisely.
If you add the `@JsModule("<module-name>")` annotation on an external declaration it will be properly imported
to a module system (either CommonJS or AMD) during the compilation. For example, with CommonJS the declaration will be
imported via `require(...)` function.
Additionally, if you want to import a declaration either as a module or as a global JavaScript object,
you can use the `@JsNonModule` annotation.

For example, here's how you can import JQuery into a Kotlin module:

``` kotlin
@JsNonModule
@JsName("$")
external abstract class JQuery {
    fun toggle(duration: Int = 0): JQuery
    fun click(handler: (Event) -> Unit): JQuery
}

@JsModule("jquery")
@JsNonModule
@JsName("$")
external fun JQuery(selector: String): JQuery
```

In this case, JQuery will be imported as a module named `jquery`. Alternatively, it can be used as a $-object,
depending on what module system Kotlin compiler is configured to use.

You can use these declarations in your application like this:

``` kotlin
fun main(args: Array<String>) {
    JQuery(".toggle-button").click {
        JQuery(".toggle-panel").toggle(300)
    }
}
```
