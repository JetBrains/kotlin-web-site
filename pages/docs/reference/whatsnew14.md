---
type: doc
layout: reference
title: "What's New in Kotlin 1.4"
---

# What's New in Kotlin 1.4

## Language features and improvements

Kotlin 1.4 comes with a variety of different language features and improvements. They include:

* [SAM conversions for Kotlin interfaces](#sam-conversions-for-kotlin-interfaces)
* [Delegated properties improvements](#delegated-properties-improvements)
* [Mixing named and positional arguments](#mixing-named-and-positional-arguments)
* [Callable reference improvements](#callable-reference-improvements)
* [Using `break` and `continue` inside `when` expressions included in loops](#using-break-and-continue-inside-when-expressions-included-in-loops)

### SAM conversions for Kotlin interfaces

Before Kotlin 1.4, you could apply SAM (Single Abstract Method) conversions only [when working with Java methods and Java
interfaces from Kotlin](java-interop.html#sam-conversions). From now on, you can use SAM conversions for Kotlin interfaces as well.
To do so, mark a Kotlin interface explicitly as functional with the `fun` modifier.

SAM conversion applies if you pass a lambda as an argument when an interface with only one single abstract method is expected
as a parameter. In this case, the compiler automatically converts the lambda to an instance of the class that implements the abstract member function.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() { 
    println("Is 7 even? - ${isEven.accept(7)}")
}
```

</div>

Learn more about [Kotlin functional interfaces and SAM conversions](fun-interfaces.html).

### Delegated properties improvements

In 1.4, we have added new features to improve your experience with delegated properties in Kotlin:
- Now a property can be delegated to another property.
- A new interface `PropertyDelegateProvider` helps create delegate providers in a single declaration.
- `ReadWriteProperty` now extends `ReadOnlyProperty` so you can use both of them for read-only properties.

Aside from the new API, we've made some optimizations that reduce the resulting bytecode size. These optimizations are
described in  [this blog post](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties). 

For more information about delegated properties, see the [documentation](delegated-properties.html).

### Mixing named and positional arguments

In Kotlin 1.3, when you called a function with [named arguments](functions.html#named-arguments), you had to place all the
arguments without names (positional arguments) before the first named argument. For example, you could call `f(1, y = 2)`, 
but you couldn't call `f(x = 1, 2)`.

It was really annoying when all the arguments were in their correct positions but you wanted to specify a name for one argument in the middle.
It was especially helpful for making absolutely clear which attribute a boolean or `null` value belongs to.

In Kotlin 1.4, there is no such limitation – you can now specify a name for an argument in the middle of a set of positional 
arguments. Moreover, you can mix positional and named arguments any way you like, as long as they remain in the correct order.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun reformat(
    str : String,
    uppercaseFirstLetter : Boolean = true,
    wordSeparator : Character = ' '
) {
  // ...
}

//Function call with a named argument in the middle
reformat('This is a String!', uppercaseFirstLetter = false , '-')
```

</div>


### Callable reference improvements

Kotlin 1.4 supports more cases for using callable references:

* References to functions with default argument values
* Function references in `Unit`-returning functions 
* References that adapt based on the number of arguments in a function
* Suspend conversion on callable references 

#### References to functions with default argument values 

Now you can use callable references to functions with default argument values. If the callable reference 
to the function `foo` takes no arguments, the default value `0` is used.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () -> String): String = func()

fun main() {
    println(apply(::foo))
}
```

</div>

Previously, you had to write additional overloads for the function `apply` to use the default argument values.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// some new overload
fun applyInt(func: (Int) -> String): String = func(0) 
```

</div>

#### Function references in `Unit`-returning functions 

In Kotlin 1.4, you can use callable references to functions returning any type in `Unit`-returning functions. 
Before Kotlin 1.4, you could only use lambda arguments in this case. Now you can use both lambda arguments and callable references.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // this was the only way to do it  before 1.4
    foo(::returnsInt) // starting from 1.4, this also works
}
```

</div>

#### References that adapt based on the number of arguments in a function

Now you can adapt callable references to functions when passing a variable number of arguments (`vararg`) . 
You can pass any number of parameters of the same type at the end of the list of passed arguments.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun foo(x: Int, vararg y: String) {}

fun use0(f: (Int) -> Unit) {}
fun use1(f: (Int, String) -> Unit) {}
fun use2(f: (Int, String, String) -> Unit) {}

fun test() {
    use0(::foo) 
    use1(::foo) 
    use2(::foo) 
}
```

</div>

#### Suspend conversion on callable references

In addition to suspend conversion on lambdas, Kotlin now supports suspend conversion on callable references starting from version 1.4.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // OK before 1.4
    takeSuspend(::call) // In Kotlin 1.4, it also works
}
```

</div>

### Using `break` and `continue` inside `when` expressions included in loops

In Kotlin 1.3, you could not use unqualified `break` and `continue` inside `when` expressions included in loops. The reason was that these keywords were reserved for possible [fall-through behavior](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough) in `when` expressions. 

That’s why if you wanted to use `break` and `continue` inside `when` expressions in loops, you had to [label](returns.html#break-and-continue-labels) them, which became rather cumbersome.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun test(xs: List<Int>) {
    LOOP@for (x in xs) {
        when (x) {
            2 -> continue@LOOP
            17 -> break@LOOP
            else -> println(x)
        }
    }
}
```

</div>

In Kotlin 1.4, you can use `break` and `continue` without labels inside `when` expressions included in loops. They behave as expected by terminating the nearest enclosing loop or proceeding to its next step.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun test(xs: List<Int>) {
    for (x in xs) {
        when (x) {
            2 -> continue
            17 -> break
            else -> println(x)
        }
    }
}
```

</div>

The fall-through behavior inside `when` is subject to further design.

## Explicit API mode for library authors

Kotlin compiler offers _explicit API mode_ for library authors. In this mode, the compiler performs additional checks that
help make the library’s API clearer and more consistent. It adds the following requirements for declarations exposed
to the library’s public API:

* Visibility modifiers are required for declarations if the default visibility exposes them to the public API.
This helps ensure that no declarations are exposed to the public API unintentionally.
* Explicit type specifications are required for properties and functions that are exposed to the public API.
This guarantees that API users are aware of the types of API members they use.

Depending on your configuration, these explicit APIs can produce errors (_strict_ mode) or warnings (_warning_ mode).
Certain kinds of declarations are excluded from such checks for the sake of readability and common sense:

* primary constructors
* properties of data classes
* property getters and setters
* `override` methods

Explicit API mode analyzes only the production sources of a module.

To compile your module in the explicit API mode, add the following lines to your Gradle build script:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = 'strict'
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = 'warning'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = ExplicitApiMode.Strict
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = ExplicitApiMode.Warning
}
```

</div>
</div>

When using the command-line compiler, switch to explicit API mode by adding  the `-Xexplicit-api` compiler option
with the value `strict` or `warning`.

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
-Xexplicit-api={strict|warning}
```

</div>

For more details about the explicit API mode, see the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md). 

## New compiler

The new Kotlin compiler is going to be really fast; it will unify all the supported platforms and provide 
an API for compiler extensions. It's a long-term project, and we've already completed several steps in Kotlin 1.4:

* [New, more powerful type inference algorithm](#new-more-powerful-type-inference-algorithm) is enabled by default. 
* [New JVM and JS IR back-ends](#unified-back-ends-and-extensibility) are available in experimental mode. They will become the default once we stabilize them.

### New more powerful type inference algorithm

Kotlin 1.4 uses a new, more powerful type inference algorithm. This new algorithm was already available to try in 
Kotlin 1.3 by specifying a compiler option, and now it’s used by default. You can find the full list of issues fixed in 
the new algorithm in [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20). Here
you can find some of the most noticeable improvements:

* More cases where type is inferred automatically
* Smart casts for a lambda’s last expression
* Smart casts for callable references
* Better inference for delegated properties
* SAM conversion for Java interfaces with different arguments
* Java SAM interfaces in Kotlin

#### More cases where type is inferred automatically

The new inference algorithm infers types for many cases where the old algorithm required you to specify them explicitly. 
For instance, in the following example the type of the lambda parameter `it` is correctly inferred to `String?`:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
//sampleStart
val rulesMap: Map<String, (String?) -> Boolean> = mapOf(
    "weak" to { it != null },
    "medium" to { !it.isNullOrBlank() },
    "strong" to { it != null && "^[a-zA-Z0-9]+$".toRegex().matches(it) }
)
//sampleEnd

fun main() {
    println(rulesMap.getValue("weak")("abc!"))
    println(rulesMap.getValue("strong")("abc"))
    println(rulesMap.getValue("strong")("abc!"))
}
```

</div>

In Kotlin 1.3, you needed to introduce an explicit lambda parameter or replace `to` with a `Pair` constructor with 
explicit generic arguments to make it work.

#### Smart casts for a lambda’s last expression

In Kotlin 1.3, the last expression inside a lambda wasn’t  smart cast unless you specified the expected type. Thus, in the 
following example, Kotlin 1.3 infers `String?` as the type of the `result` variable:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val result = run {
    var str = currentValue()
    if (str == null) {
        str = "test"
    }
    str // the Kotlin compiler knows that str is not null here
}
// The type of 'result' is String? in Kotlin 1.3 and String in Kotlin 1.4
```

</div>

In Kotlin 1.4, thanks to the new inference algorithm, the last expression inside a lambda gets smart cast, and this new, 
more precise type is used to infer the resulting lambda type. Thus, the type of the `result` variable becomes `String`.

In Kotlin 1.3, you often needed to add explicit casts (either `!!` or type casts like `as String`) to make such cases work, 
and now these casts have become unnecessary.

#### Smart casts for callable references

In Kotlin 1.3, you couldn’t access a member reference of a smart cast type. Now in Kotlin 1.4 you can:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
import kotlin.reflect.KFunction

sealed class Animal
class Cat : Animal() {
    fun meow() {
        println("meow")
    }
}

class Dog : Animal() {
    fun woof() {
        println("woof")
    }
}

//sampleStart
fun perform(animal: Animal) {
    val kFunction: KFunction<*> = when (animal) {
        is Cat -> animal::meow
        is Dog -> animal::woof
    }
    kFunction.call()
}
//sampleEnd

fun main() {
    perform(Cat())
}
```

</div>

You can use different member references `animal::meow` and `animal::woof` after the animal variable has been smart cast 
to specific types `Cat` and `Dog`. After type checks, you can access member references corresponding to subtypes.

#### Better inference for delegated properties

The type of a delegated property wasn’t taken into account while analyzing the delegate expression which follows the `by` 
keyword. For instance, the following code didn’t compile before, but now the compiler correctly infers the types of the 
`old` and `new` parameters as `String?`:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
import kotlin.properties.Delegates

fun main() {
    var prop: String? by Delegates.observable(null) { p, old, new ->
        println("$old → $new")
    }
    prop = "abc"
    prop = "xyz"
}
```

</div>

#### SAM conversion for Java interfaces with different arguments

Kotlin has supported SAM conversions for Java interfaces from the beginning, but there was one case that wasn’t supported, 
which was sometimes annoying when working with existing Java libraries. If you called a Java method that took two SAM interfaces 
as parameters, both arguments needed to be either lambdas or regular objects. You couldn't pass one argument as a lambda and 
another as an object. 

The new algorithm fixes this issue, and you can pass a lambda instead of a SAM interface in any case, 
which is the way you’d naturally expect it to work.

<div class="sample" markdown="1" theme="idea" mode="java" data-highlight-only>

```java
// FILE: A.java
public class A {
    public void static foo(Runnable r1, Runnable r2) {}
}
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// FILE: test.kt
fun test(r1: Runnable) {
    A.foo(r1) {}  // Works in Kotlin 1.4
}
```

</div>

#### Java SAM interfaces in Kotlin

In Kotlin 1.4, you can use Java SAM interfaces in Kotlin and apply SAM conversions to them. 

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

</div>

In Kotlin 1.3, you would have had to declare the function `foo` above in Java code to perform a SAM conversion.

### Unified back-ends and extensibility

In Kotlin, we have three back-ends that generate executables: Kotlin/JVM, Kotlin/JS, and Kotlin/Native. Kotlin/JVM and Kotlin/JS 
don't share much code since they were developed independently of each other. Kotlin/Native is based on a new 
infrastructure built around an internal representation (IR) for Kotlin code. 

We are now migrating Kotlin/JVM and Kotlin/JS to the same IR. As a result, all three back-ends
share a lot of logic and have a unified pipeline. This allows us to implement most features, optimizations, and bug fixes 
only once for all platforms.

A common back-end infrastructure also opens the door for multiplatform compiler extensions. You will be able to plug into the 
pipeline and add custom processing and transformations that will automatically work for all platforms. 

Kotlin 1.4 does not provide a public API for such extensions yet, but we are working closely with our partners, 
including [JetPack Compose](https://developer.android.com/jetpack/compose), who are already building their compiler plugins 
using our new back-end.

Now you can opt into using the new JVM IR back-end, where we've fixed many long-standing issues of the old back-end. 
If you find any bugs, we’ll be very thankful if you could report them to our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

To enable the new JVM IR back-end, specify an additional compiler option in your Gradle build script:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
kotlinOptions.useIR = true
```

</div>

When using the command-line compiler, add the compiler option `-Xuse-ir`.

> You can use code compiled by the new JVM IR back-end only if you've enabled the new back-end. Otherwise, you will get an error.
> Considering this, we don't recommend that library authors switch to the new back-end in production.
{:.note}

You can also opt into using the new JS IR back-end (ADD LINK).

## Kotlin/JVM

### New modes for generating default methods

When compiling Kotlin code to targets JVM 1.8 and above, you could compile non-abstract methods of Kotlin interfaces into
Java's `default` methods. For this purpose, there was a mechanism that includes the `@JvmDefault` annotation for marking
such methods and the `-Xjmv-default` compiler option that enables processing of this annotation.

In 1.4, we've added a new mode for generating default methods: `-Xjvm-default=all` compiles *all* non-abstract methods of Kotlin
interfaces to `default` Java methods. For compatibility with the code that uses the interfaces compiled without `default`, 
we also added `all-compatibility` mode. 

For more information about default methods in the Java interop, see the [documentation](java-to-kotlin-interop.html#default-methods-in-interfaces) and 
[this blog post](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/).


## Kotlin/Native

### Simplified management of CocoaPods dependencies

Previously, once you integrated your project with the dependency manager CocoaPods, you could build an iOS, macOS, watchOS, 
or tvOS part of your project only in Xcode, separate from other parts of your multiplatform project. These other parts could 
be built in Intellij IDEA. 

Moreover, every time you added a dependency on an Objective-C library stored in CocoaPods (Pod library), you had to switch 
from IntelliJ IDEA to Xcode, call `pod install`, and run the Xcode build there. 

Now you can manage Pod dependencies right in Intellij IDEA while enjoying the benefits it provides for working with code, 
such as code highlighting and completion. You can also build the whole Kotlin project with Gradle, without having to 
switch to Xcode. This means you only have to go to Xcode when you need to write Swift/Objective-C code or run your application 
on a simulator or device.

Now you can also work with Pod libraries stored locally.

Depending on your needs, you can add dependencies between:
* A Kotlin project and Pod libraries stored remotely in the CocoaPods repository or stored locally on your machine.
* A Kotlin Pod (Kotlin project used as a CocoaPods dependency) and an Xcode project with one or more targets.

Complete the initial configuration, and when you add a new dependency to `cocoapods`, just re-import the project in IntelliJ IDEA. 
The new dependency will be added automatically. No additional steps are required.

Learn [how to add dependencies](native/cocoapods.html).


## Standard library

### Common exception processing API

The following API elements were moved to the common library:
* `Throwable.stackTraceToString()` extension function, which returns the detailed description of this throwable with its
stack trace, and `Throwable.printStackTrace()`, which prints this description to the standard error output.
* `Throwable.addSuppressed()` function, which lets you specify the exceptions that were suppressed in order to deliver
the exception, and the `Throwable.suppressedExceptions` property, which returns a list of all the suppressed exceptions.
* `@Throws` annotation lists exception types that will be checked when the function is compiled to a platform method
(on JVM or native platofrms). 

### New functions for arrays and collections

#### Collections

In 1.4, the standard library includes a number of useful functions for working with **collections**:

* `setOfNotNull()` that makes a set consisting of all the non-null items among the provided arguments.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">
    
    ```kotlin
    fun main() {
    //sampleStart
        val set = setOfNotNull(null, 1, 2, 0, null)
        println(set)
    //sampleEnd
    }
    ```
    </div>

* `shuffled()` for sequences.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">
    
    ```kotlin
    fun main() {
    //sampleStart
        val numbers = (0 until 50).asSequence()
        val result = numbers.map { it * 2 }.shuffled().take(5)
        println(result.toList()) //five random even numbers below 100
    //sampleEnd
    }
    ```
    </div>

* `*Indexed()` counterparts for `onEach()` and `flatMap()`.
The operation that they apply to the collection elements has the element index as a parameter.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">
    
    ```kotlin
    fun main() {
    //sampleStart
        val list = mutableListOf("a", "b", "c", "d").onEachIndexed {
            index, item -> println(index.toString() + ":" + item)
        }
  
       val list = listOf("hello", "kot", "lin", "world")
              val kotlin = list.flatMapIndexed { index, item ->
                  if (index in 1..2) item.toList() else emptyList() 
              }
    //sampleEnd
              println(kotlin)
    }
    ```
    </div>

* `*OrNull()` counterparts `randomOrNull()`, `reduceOrNull()`, and `reduceIndexedOrNull()`. 
empty collections.
    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">
    
    ```kotlin
    fun main() {
    //sampleStart
         val empty = emptyList<Int>()
         empty.reduceOrNull { a, b -> a + b }
         //empty.reduce { a, b -> a + b } // Exception: Empty collection can't be reduced.
    //sampleEnd
    }
    ```
    </div>

* `runningFold()` (and its synonym `scan()`) and `runningReduce()`, similarly to`fold()` and `reduce()`, apply the given
operation to the collection elements subsequently; the difference is that they return the whole sequence of intermediate results.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">
    
    ```kotlin
    fun main() {
    //sampleStart
        val numbers = mutableListOf(0, 1, 2, 3, 4, 5)
        val runningReduceSum = numbers.runningReduce() { sum, item -> sum + item} // [0, 1, 3, 6, 10, 15]
        val runningFoldSum = numbers.runningFold(10) { sum, item -> sum + item} // [10, 10, 11, 13, 16, 20, 25]
    //sampleEnd
    }
    ```
    </div>

* `sumOf()` takes a selector function and returns a sum of its values on all elements of a collection.
`sumOf()` can produce sums of the types `Int`, `Long`, `Double`, `UInt`, `ULong`. On the JVM, `BigInteger` and `BigDecimal` are also available.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">
    
    ```kotlin
    data class OrderItem(val name: String, val price: Double, val count: Int)
    
    fun main() {
    //sampleStart
        val order = listOf<OrderItem>(
            OrderItem("Cake", price = 10.0, count = 1),
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))
    
        val total = order.sumOf { it.price * it.count} // Double
        val count = order.sumOf { it.count } // Int
    //sampleEnd
        println("You've ordered $count items that cost $total in total")
    }
    ```
    </div>

* `min()` and `max()` functions have been renamed to `minOrNull()` and `maxOrNull()` to comply with the naming
  convention used across the Kotlin collections API: `*OrNull` suffix in the function name means that it returns `null`
  if the receiver collection is empty. The same applies to `minBy()`, `maxBy()`, `minWith()`, `maxWith()` - in 1.4, 
  they have `*OrNull()` synonyms.
* New `minOf()` and `maxOf()` extension functions return the minimum and the maximum value of the given selector function
  on the collection items.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">
    
    ```kotlin
    data class OrderItem(val name: String, val price: Double, val count: Int)
    
    fun main() {
    //sampleStart
        val order = listOf<OrderItem>(
            OrderItem("Cake", price = 10.0, count = 1),
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))
        val highestPrice = order.maxOf { it.price }
    //sampleEnd
        println("The most expensive item in the order costs $highestPrice")
    }
    ```
    </div>

    There are also `minOfWith()` and `maxOfWith()`, which take a `Comparator` as an argument, and `*OrNull()` versions
of all four functions that return `null` on empty collections.

* New overloads for `flatMap` and `flatMapTo` let you use transformations with return types that don’t match the receiver type, namely:
    * transformations to `Sequence` on `Iterable`, `Array`, and `Map`
    * transformations to `Iterable` on `Sequence`

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">
    
    ```kotlin
    fun main() {
    //sampleStart
        val list = listOf("kot", "lin")
        val lettersList = list.flatMap { it.asSequence() }
        val lettersSeq = list.asSequence().flatMap { it.toList() }    
    //sampleEnd
        println(lettersList)
        println(lettersSeq.toList())
    }
    ```
    </div>

* `removeFirst()` and `removeLast()` for mutable list and their `*orNull()` counterparts.

We also add the `ArrayDeque` class - an implementation of double-ended queue.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
fun main() {
    val deque = ArrayDeque(listOf(1, 2, 3))

    deque.addFirst(0)
    deque.addLast(4)
    println(deque) // [0, 1, 2, 3, 4]

    println(deque.first()) // 0
    println(deque.last()) // 4

    deque.removeFirst()
    deque.removeLast()
    println(deque) // [1, 2, 3]
}
```
</div>

#### Arrays

To provide a consistent experience when working with different container types, we’ve also added new functions for **arrays**:

* `shuffle()` puts the array elements in a random order.
* `onEach()` performs the given action on each array element and returns the array itself.
* `associateWith()` and `associateWithTo()`
* `reverse()` for array subranges reverses the order of the elements in the subrange.
* `sortDescending()` for array subranges sorts the elements in the subrange in descending order.
* `sort()` and `sortWith()` for array subranges are now available in the common library.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
fun main() {
//sampleStart
    var language = ""
    val letters = arrayOf("k", "o", "t", "l", "i", "n")
    val fileExt = letters.onEach { language += it }
       .filterNot { it in "aeuio" }.take(2)
       .joinToString(prefix = ".", separator = "")
    println(language) // "kotlin"
    println(fileExt) // ".kt"

    letters.shuffle()
    letters.reverse(0, 3)
    letters.sortDescending(2, 5)
    println(letters.contentToString()) // [k, o, t, l, i, n]
//sampleEnd
}
```
</div>

Additonally, there are new functions for conversions between `CharArray`/`ByteArray` and `String`:
* `ByteArray.decodeToString()` and `String.encodeToByteArray()`
* `CharArray.concatToString()` and `String.toCharArray()`

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
fun main() {
//sampleStart
	val str = "kotlin"
    val array = str.toCharArray()
    println(array.concatToString())
//sampleEnd
}
```
</div>

### Functions for string manipulations

The standard library in 1.4 includes a number of improvements in the API for string manipulation:

* `StringBuilder` has new useful extension functions: `set()`, `setRange()`, `deleteAt()`, `deleteRange()`, `appendRange()`
and others.
    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">
    
    ```kotlin
    fun main() {
    //sampleStart
        val sb = StringBuilder("Bye Kotlin 1.3.72")
        sb.deleteRange(0, 3)
        sb.insertRange(0, "Hello", 0 ,5)
        sb.set(15, '4')
        sb.setRange(17, 19, "0")
        print(sb.toString())
    //sampleEnd
    }
    ```
    </div>
    
* Some existing functions of `StringBuilder` are available in the common library. Among them are `append()`, `insert()`,
`substring()`, `setLength()`, and more. 
* New functions `Appendable.appendLine()` and `StringBuilder.appendLine()` are added to the common library. They replace
JVM-only `appendln()` functions of these classes.
    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">
    
    ```kotlin
    fun main() {
    //sampleStart
        println(buildString {
            appendLine("Hello,")
            appendLine("world")
        })
    //sampleEnd
    }
    ```
    </div>
    
* `StringBuilder.append()` now accept nullable arguments.

### Bit operations

New functions for bit manipulations:
* `countOneBits()` 
* `countLeadingZeroBits()`
* `countTrailingZeroBits()`
* `takeHighestOneBit()`
* `takeLowestOneBit()` 
*  `rotateLeft()` and `rotateRight(`) (experimental)

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
fun main() {
//sampleStart
    val number = "1010000".toInt(radix = 2)
    println(number.countOneBits())
    println(number.countTrailingZeroBits())
    println(number.takeHighestOneBit().toString(2))
//sampleEnd
}
```
</div>

### Converting from KType to Java Type

A new extension property `KType.javaType` (currently experimental) in the stdlib helps obtain a `java.lang.reflect.Type`
from a Kotlin type without using the whole `kotlin-reflect` dependency.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
import kotlin.reflect.javaType
import kotlin.reflect.typeOf

@OptIn(ExperimentalStdlibApi::class)
inline fun <reified T> accessReifiedTypeArg() {
   val kType = typeOf<T>()
   println("Kotlin type: $kType")
   println("Java type: ${kType.javaType}")
}

@OptIn(ExperimentalStdlibApi::class)
fun main() {
   accessReifiedTypeArg<String>()
   // Kotlin type: kotlin.String
   // Java type: class java.lang.String
  
   accessReifiedTypeArg<List<String>>()
   // Kotlin type: kotlin.collections.List<kotlin.String>
   // Java type: java.util.List<java.lang.String>
}
```
</div>

### Proguard configurations for Kotlin reflection

Starting from 1.4, we have embedded Proguard/R8 configurations for Kotlin Reflection in `kotlin-reflect.jar`. With this
in place, most Android projects using R8 or Proguard should work with kotlin-reflect without additional configuration magic.
You no longer need to copy paste the Proguard rules for kotlin-reflect internals. But note that you still need to list
explicitly all APIs you’re going to reflect on.

### Improving the existing API

* Several functions now work on null receivers, for example:
    * `toBoolean()` on strings
    * `contentEquals()`, `contentHashcode()`, `contentToString()` on arrays

* `NaN`, `NEGATIVE_INFINITY`, and `POSITIVE_INFINITY` in `Double` and `Float` are now defined as `const`, so you can use
them as annotation arguments.

* New constants `SIZE_BITS` and `SIZE_BYTES` in `Double` and `Float` contain the number of bits and bytes accordingly used
to represent an instance of the type in binary form.

* `maxOf()` and `minOf()` top-level functions can accept a variable number of arguments (`vararg`).

### Standard library artifacts now include module-info descriptors

Kotlin 1.4 adds `module-info.java` module information to default standard library artifacts. This lets you use them with 
[**jlink** tool](https://docs.oracle.com/en/java/javase/11/tools/jlink.html) that generates custom Java runtime images
containing only the platform modules that are required for your app.
You could use jlink with Kotlin standard library artifacts before, but you had to use separate artifacts for that – the
ones with the “modular” classifier – and the whole setup wasn’t straightforward.  
In Android, make sure you use the Android Gradle plugin version 3.2 or higher, which can correctly process jars with module-info.

### Deprecations

#### toShort() and toByte() of Double and Float
We deprecate functions toShort() and toByte() on Double and Float because they could lead to unexpected results because
of the narrow value range and smaller variable size.

To convert floating-point numbers to `Byte` or `Short`, use the two-step conversion: to `Int` and then to the target type.

#### contains(), indexOf(), and lastIndexOf() on floating-point arrays

We deprecate `contains`, `indexOf`, and `lastIndexOf` extension functions of `FloatArray` and `DoubleArray` because
they use the [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) standard equality which contradicts with the total order equality in some corner cases.
See [this issue](https://youtrack.jetbrains.com/issue/KT-28753) for details.

#### min() and max() collection functions

We deprecate `min()` and `max()` collection functions in favor of `minOrNull()` and `maxOrNull` to properly reflect their
behavoir – returning `null` on empty collections. See [this issue](https://youtrack.jetbrains.com/issue/KT-38854) for details. 

### Exclusion of the deprecated experimental coroutines
 
The `kotlin.coroutines.experimental` API was deprecated in favor of kotlin.coroutines in 1.3.0. In 1.4, we’re completing
the deprecation cycle for `kotlin.coroutines.experimental` by removing it from the standard library. For those who still
use it on the JVM, we provide a compatibility artifact `kotlin-coroutines-experimental-compat.jar` with all the experimental
coroutines APIs. We publish it to maven and include it in the Kotlin distribution beside the standard library.