---
type: doc
layout: reference
title: "What's New in Kotlin 1.1"
---

# What's New in Kotlin 1.1

## Table of Contents

* [Coroutines](#coroutines-experimental)
* [Other language features](#other-language-features)
* [Standard library](#standard-library)
* [JVM backend](#jvm-backend)
* [JavaScript backend](#javascript-backend)

## JavaScript

Starting with Kotlin 1.1, the JavaScript target is no longer considered experimental. All language features are supported,
and there are many new tools for integration with the front-end development environment. See [below](#javascript-backend) for
a more detailed list of changes.

## Coroutines (experimental)

The key new feature in Kotlin 1.1 is *coroutines*, bringing the support of `async`/`await`, `yield` and similar programming
patterns. The key feature of Kotlin's design is that the implementation of coroutine execution is part of the libraries,
not the language, so you aren't bound to any specific programming paradigm or concurrency library.

A coroutine is effectively a light-weight thread that can be suspended and resumed later. Coroutines are supported through [*suspending functions*](coroutines.html#suspending-functions): a call to such a function can potentially suspend a coroutine, and to start a new coroutine we usually use an anonymous suspending functions (i.e. suspending lambdas).  

Let's look at `async`/`await` which is implemented in an external library, [kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines): 

``` kotlin
// runs the code in the background thread pool
fun asyncOverlay() = async(CommonPool) {
    // start two async operations
    val original = asyncLoadImage("original")
    val overlay = asyncLoadImage("overlay")
    // and then apply overlay to both results
    applyOverlay(original.await(), overlay.await())
}

// launches new coroutine in UI context
launch(UI) {
    // wait for async overlay to complete
    val image = asyncOverlay().await()
    // and then show it in UI
    showImage(image)
}
```

Here, `async { ... }` starts a coroutine and, when we use `await()`, the execution of the coroutine is suspended while the operation being awaited is executed, and is resumed (possibly on a different thread) when the operation being awaited completes.

The standard library uses coroutines to support *lazily generated sequences* with `yield` and `yieldAll` functions.
In such a sequence, the block of code that returns sequence elements is suspended after each element has been retrieved,
and resumed when the next element is requested. Here's an example:

<div class="sample" markdown="1" data-min-compiler-version="1.1"> 

``` kotlin
import kotlin.coroutines.experimental.*

fun main(args: Array<String>) {
//sampleStart
  val seq = buildSequence {
      for (i in 1..5) {
          // yield a square of i
          yield(i * i)
      }
      // yield a range
      yieldAll(26..28)
  }
  
  // print the sequence
  println(seq.toList())
//sampleEnd
}
```

</div>


Run the code above to see the result. Feel free to edit it and run again!

For more information, please refer to the [coroutine documentation](/docs/reference/coroutines.html) and [tutorial](/docs/tutorials/coroutines-basic-jvm.html).

Note that coroutines are currently considered an **experimental feature**, meaning that the Kotlin team is not committing
to supporting the backwards compatibility of this feature after the final 1.1 release.


## Other Language Features

### Type aliases

A type alias allows you to define an alternative name for an existing type.
This is most useful for generic types such as collections, as well as for function types.
Here is an example:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
//sampleStart
typealias OscarWinners = Map<String, String>

fun countLaLaLand(oscarWinners: OscarWinners) =
        oscarWinners.count { it.value.contains("La La Land") }

// Note that the type names (initial and the type alias) are interchangeable:
fun checkLaLaLandIsTheBestMovie(oscarWinners: Map<String, String>) =
        oscarWinners["Best picture"] == "La La Land"
//sampleEnd

fun oscarWinners(): OscarWinners {
    return mapOf(
            "Best song" to "City of Stars (La La Land)",
            "Best actress" to "Emma Stone (La La Land)",
            "Best picture" to "Moonlight" /* ... */)
}

fun main(args: Array<String>) {
    val oscarWinners = oscarWinners()

    val laLaLandAwards = countLaLaLand(oscarWinners)
    println("LaLaLandAwards = $laLaLandAwards (in our small example), but actually it's 6.")

    val laLaLandIsTheBestMovie = checkLaLaLandIsTheBestMovie(oscarWinners)
    println("LaLaLandIsTheBestMovie = $laLaLandIsTheBestMovie")
}
```
</div>

See the [documentation](type-aliases.html) and [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases.md) for more details.


### Bound callable references

You can now use the `::` operator to get a [member reference](reflection.html#function-references) pointing to a method or property of a specific object instance.
Previously this could only be expressed with a lambda.
Here's an example:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
//sampleStart
val numberRegex = "\\d+".toRegex()
val numbers = listOf("abc", "123", "456").filter(numberRegex::matches)
//sampleEnd

fun main(args: Array<String>) {
    println("Result is $numbers")
}
```
</div>


Read the [documentation](reflection.html#bound-function-and-property-references-since-11) and [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references.md) for more details.


### Sealed and data classes

Kotlin 1.1 removes some of the restrictions on sealed and data classes that were present in Kotlin 1.0.
Now you can define subclasses of a top-level sealed class on the top level in the same file, and not just as nested classes of the sealed class.
Data classes can now extend other classes.
This can be used to define a hierarchy of expression classes nicely and cleanly:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
//sampleStart
sealed class Expr

data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
}
val e = eval(Sum(Const(1.0), Const(2.0)))
//sampleEnd

fun main(args: Array<String>) {
    println("e is $e") // 3.0
}
```
</div>

Read the [documentation](sealed-classes.html) or
[sealed class](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance.md) and
[data class](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance.md) KEEPs for more detail.


### Destructuring in lambdas

You can now use the [destructuring declaration](multi-declarations.html) syntax to unpack the arguments passed to a lambda.
Here's an example:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf(1 to "one", 2 to "two")
    // before
    println(map.mapValues { entry ->
        val (key, value) = entry
        "$key -> $value!"
    })
    // now
    println(map.mapValues { (key, value) -> "$key -> $value!" })
//sampleEnd    
}
```
</div>

Read the [documentation](multi-declarations.html#destructuring-in-lambdas-since-11) and [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters.md) for more details.


### Underscores for unused parameters

For a lambda with multiple parameters, you can use the `_` character to replace the names of the parameters you don't use:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
fun main(args: Array<String>) {
    val map = mapOf(1 to "one", 2 to "two")

//sampleStart
    map.forEach { _, value -> println("$value!") }
//sampleEnd    
}
```
</div>

This also works in [destructuring declarations](multi-declarations.html):

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
data class Result(val value: Any, val status: String)

fun getResult() = Result(42, "ok").also { println("getResult() returns $it") }

fun main(args: Array<String>) {
//sampleStart
    val (_, status) = getResult()
//sampleEnd
    println("status is '$status'")
}
```
</div>

Read the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters.md) for more details.


### Underscores in numeric literals

Just as in Java 8, Kotlin now allows to use underscores in numeric literals to separate groups of digits:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
//sampleStart
val oneMillion = 1_000_000
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
//sampleEnd

fun main(args: Array<String>) {
    println(oneMillion)
    println(hexBytes.toString(16))
    println(bytes.toString(2))
}
```
</div>

Read the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals.md) for more details.


### Shorter syntax for properties

For properties with the getter defined as an expression body, the property type can now be omitted:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
//sampleStart
data class Person(val name: String, val age: Int) {
    val isAdult get() = age >= 20 // Property type inferred to be 'Boolean'
}
//sampleEnd

fun main(args: Array<String>) {
    val akari = Person("Akari", 26)
    println("$akari.isAdult = ${akari.isAdult}")
}
```
</div>

### Inline property accessors

You can now mark property accessors with the `inline` modifier if the properties don't have a backing field.
Such accessors are compiled in the same way as [inline functions](inline-functions.html).

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
//sampleStart
public val <T> List<T>.lastIndex: Int
    inline get() = this.size - 1
//sampleEnd

fun main(args: Array<String>) {
    val list = listOf('a', 'b')
    // the getter will be inlined
    println("Last index of $list is ${list.lastIndex}")
}
```
</div>

You can also mark the entire property as `inline` - then the modifier is applied to both accessors.

Read the [documentation](inline-functions.html#inline-properties) and [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties.md) for more details.


### Local delegated properties

You can now use the [delegated property](delegated-properties.html) syntax with local variables.
One possible use is defining a lazily evaluated local variable:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
import java.util.Random

fun needAnswer() = Random().nextBoolean()

fun main(args: Array<String>) {
//sampleStart
    val answer by lazy {
        println("Calculating the answer...")
        42
    }
    if (needAnswer()) {                     // returns the random value
        println("The answer is $answer.")   // answer is calculated at this point
    }
    else {
        println("Sometimes no answer is the answer...")
    }
//sampleEnd
}
```
</div>

Read the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties.md) for more details.


### Interception of delegated property binding

For [delegated properties](delegated-properties.html), it is now possible to intercept delegate to property binding using the
`provideDelegate` operator.
For example, if we want to check the property name before binding, we can write something like this:

``` kotlin
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(thisRef: MyUI, prop: KProperty<*>): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
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

Read the [documentation](delegated-properties.html#providing-a-delegate-since-11) for more details.


### Generic enum value access

It is now possible to enumerate the values of an enum class in a generic way.

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
//sampleStart
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}
//sampleEnd

fun main(args: Array<String>) {
    printAllValues<RGB>() // prints RED, GREEN, BLUE
}
```
</div>

### Scope control for implicit receivers in DSLs

The [`@DslMarker`](/api/latest/jvm/stdlib/kotlin/-dsl-marker/index.html) annotation allows to restrict the use of receivers from outer scopes in a DSL context.
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
and applying it to the base class of the tag classes.

Read the [documentation](type-safe-builders.html#scope-control-dslmarker-since-11) and [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers.md) for more details.


### `rem` operator

The `mod` operator is now deprecated, and `rem` is used instead. See [this issue](https://youtrack.jetbrains.com/issue/KT-14650) for motivation.

## Standard library

### String to number conversions

There is a bunch of new extensions on the String class to convert it to a number without throwing an exception on invalid number:
`String.toIntOrNull(): Int?`, `String.toDoubleOrNull(): Double?` etc.

```
val port = System.getenv("PORT")?.toIntOrNull() ?: 80
```

Also integer conversion functions, like `Int.toString()`, `String.toInt()`, `String.toIntOrNull()`,
each got an overload with `radix` parameter, which allows to specify the base of conversion (2 to 36).

### onEach()

`onEach` is a small, but useful extension function for collections and sequences, which allows to perform some action,
possibly with side-effects, on each element of the collection/sequence in a chain of operations.
On iterables it behaves like `forEach` but also returns the iterable instance further. And on sequences it returns a
wrapping sequence, which applies the given action lazily as the elements are being iterated.

``` kotlin
inputDir.walk()
        .filter { it.isFile && it.name.endsWith(".txt") }
        .onEach { println("Moving $it to $outputDir") }
        .forEach { moveFile(it, File(outputDir, it.toRelativeString(inputDir))) }
```

### also(), takeIf() and takeUnless()

These are three general-purpose extension functions applicable to any receiver.
 
`also` is like `apply`: it takes the receiver, does some action on it, and returns that receiver. 
The difference is that in the block inside `apply` the receiver is available as `this`, 
while in the block inside `also` it's available as `it` (and you can give it another name if you want).
This comes handy when you do not want to shadow `this` from the outer scope:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
class Block {
    lateinit var content: String
}

//sampleStart
fun Block.copy() = Block().also {
    it.content = this.content
}
//sampleEnd

// using 'apply' instead
fun Block.copy1() = Block().apply {
    this.content = this@copy1.content
}

fun main(args: Array<String>) {
    val block = Block().apply { content = "content" }
    val copy = block.copy()
    println("Testing the content was copied:")
    println(block.content == copy.content)
}
```
</div>

`takeIf` is like `filter` for a single value. It checks whether the receiver meets the predicate, and
returns the receiver, if it does or `null` if it doesn't. 
Combined with an elvis-operator and early returns it allows to write constructs like:

``` kotlin
val outDirFile = File(outputDir.path).takeIf { it.exists() } ?: return false
// do something with existing outDirFile
```

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
fun main(args: Array<String>) {
    val input = "Kotlin"
    val keyword = "in"

//sampleStart
    val index = input.indexOf(keyword).takeIf { it >= 0 } ?: error("keyword not found")
    // do something with index of keyword in input string, given that it's found
//sampleEnd
    
    println("'$keyword' was found in '$input'")
    println(input)
    println(" ".repeat(index) + "^")
}
```
</div>

`takeUnless` is the same as `takeIf`, but it takes the inverted predicate. It returns the receiver when it _doesn't_ meet the predicate and `null` otherwise. So one of the examples above could be rewritten with `takeUnless` as following:

``` kotlin
val index = input.indexOf(keyword).takeUnless { it < 0 } ?: error("keyword not found")
```

It is also convenient to use when you have a callable reference instead of the lambda:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
private fun testTakeUnless(string: String) {
//sampleStart
    val result = string.takeUnless(String::isEmpty)
//sampleEnd

    println("string = \"$string\"; result = \"$result\"")
}

fun main(args: Array<String>) {
    testTakeUnless("")
    testTakeUnless("abc")
}
```
</div>

### groupingBy()

This API can be used to group a collection by key and fold each group simultaneously. For example, it can be used
to count the number of words starting with each letter:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
fun main(args: Array<String>) {
    val words = "one two three four five six seven eight nine ten".split(' ')
//sampleStart
    val frequencies = words.groupingBy { it.first() }.eachCount()
//sampleEnd
    println("Counting first letters: $frequencies.")

    // The alternative way that uses 'groupBy' and 'mapValues' creates an intermediate map, 
    // while 'groupingBy' way counts on the fly.
    val groupBy = words.groupBy { it.first() }.mapValues { (_, list) -> list.size }
    println("Comparing the result with using 'groupBy': ${groupBy == frequencies}.")
}
```
</div>

### Map.toMap() and Map.toMutableMap()

These functions can be used for easy copying of maps:

``` kotlin
class ImmutablePropertyBag(map: Map<String, Any>) {
    private val mapCopy = map.toMap()
}
```

### Map.minus(key)

The operator `plus` provides a way to add key-value pair(s) to a read-only map producing a new map, however there was not a simple way to do the opposite: to remove a key from the map you have to resort to less straightforward ways to like `Map.filter()` or `Map.filterKeys()`.
Now the operator `minus` fills this gap. There are 4 overloads available: for removing a single key, a collection of keys, a sequence of keys and an array of keys.

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf("key" to 42)
    val emptyMap = map - "key"
//sampleEnd
    
    println("map: $map")
    println("emptyMap: $emptyMap")
}
```
</div>

### minOf() and maxOf()

These functions can be used to find the lowest and greatest of two or three given values, where values are primitive numbers or `Comparable` objects. There is also an overload of each function that take an additional `Comparator` instance, if you want to compare objects that are not comparable themselves.

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    val list1 = listOf("a", "b")
    val list2 = listOf("x", "y", "z")
    val minSize = minOf(list1.size, list2.size)
    val longestList = maxOf(list1, list2, compareBy { it.size })
//sampleEnd
    
    println("minSize = $minSize")
    println("longestList = $longestList")
}
```
</div>

### Array-like List instantiation functions

Similar to the `Array` constructor, there are now functions that create `List` and `MutableList` instances and initialize
each element by calling a lambda:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    val squares = List(10) { index -> index * index }
    val mutable = MutableList(10) { 0 }
//sampleEnd

    println("squares: $squares")
    println("mutable: $mutable")
}
```
</div>

### Map.getValue()

This extension on `Map` returns an existing value corresponding to the given key or throws an exception, mentioning which key was not found.
If the map was produced with `withDefault`, this function will return the default value instead of throwing an exception.

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
fun main(args: Array<String>) {

//sampleStart    
    val map = mapOf("key" to 42)
    // returns non-nullable Int value 42
    val value: Int = map.getValue("key")

    val mapWithDefault = map.withDefault { k -> k.length }
    // returns 4
    val value2 = mapWithDefault.getValue("key2")

    // map.getValue("anotherKey") // <- this will throw NoSuchElementException
//sampleEnd
    
    println("value is $value")
    println("value2 is $value2")
}
```
</div>

### Abstract collections

These abstract classes can be used as base classes when implementing Kotlin collection classes.
For implementing read-only collections there are `AbstractCollection`, `AbstractList`, `AbstractSet` and `AbstractMap`, 
and for mutable collections there are `AbstractMutableCollection`, `AbstractMutableList`, `AbstractMutableSet` and `AbstractMutableMap`.
On JVM these abstract mutable collections inherit most of their functionality from JDK's abstract collections.

### Array manipulation functions

The standard library now provides a set of functions for element-by-element operations on arrays: comparison
(`contentEquals` and `contentDeepEquals`), hash code calculation (`contentHashCode` and `contentDeepHashCode`),
and conversion to a string (`contentToString` and `contentDeepToString`). They're supported both for the JVM
(where they act as aliases for the corresponding functions in `java.util.Arrays`) and for JS (where the implementation
is provided in the Kotlin standard library).

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
fun main(args: Array<String>) {
//sampleStart
    val array = arrayOf("a", "b", "c")
    println(array.toString())  // JVM implementation: type-and-hash gibberish
    println(array.contentToString())  // nicely formatted as list
//sampleEnd
}
```
</div>

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


### javax.script support

Kotlin now integrates with the [javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223).
The API allows to evaluate snippets of code at runtime:

``` kotlin
val engine = ScriptEngineManager().getEngineByExtension("kts")!!
engine.eval("val x = 3")
println(engine.eval("x + 2"))  // Prints out 5
```

See [here](https://github.com/JetBrains/kotlin/tree/master/libraries/examples/kotlin-jsr223-local-example)
for a larger example project using the API.


### kotlin.reflect.full

To [prepare for Java 9 support](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-whats-coming-in-the-standard-library/), the extension functions and properties in the `kotlin-reflect.jar` library have been moved
to the package `kotlin.reflect.full`. The names in the old package (`kotlin.reflect`) are deprecated and will be removed in
Kotlin 1.2. Note that the core reflection interfaces (such as `KClass`) are part of the Kotlin standard library,
not `kotlin-reflect`, and are not affected by the move.


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
external interface JQuery {
    fun toggle(duration: Int = definedExternally): JQuery
    fun click(handler: (Event) -> Unit): JQuery
}

@JsModule("jquery")
@JsNonModule
@JsName("$")
external fun jquery(selector: String): JQuery
```

In this case, JQuery will be imported as a module named `jquery`. Alternatively, it can be used as a $-object,
depending on what module system Kotlin compiler is configured to use.

You can use these declarations in your application like this:

``` kotlin
fun main(args: Array<String>) {
    jquery(".toggle-button").click {
        jquery(".toggle-panel").toggle(300)
    }
}
```
