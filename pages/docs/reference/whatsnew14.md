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
* [Trailing comma in enumerations](#trailing-comma-in-enumerations)
* [Callable reference improvements](#callable-reference-improvements)
* [`break` and `continue` inside `when` included in loops](#using-break-and-continue-inside-when-expressions-included-in-loops)

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
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' '
) {
    // ...
}

//Function call with a named argument in the middle
reformat('This is a String!', uppercaseFirstLetter = false , '-')
```

</div>

### Trailing comma in enumerations

With Kotlin 1.4 you can now add a trailing comma in enumerations such as argument 
and parameter lists, `when` entries, and components of destructuring declarations.
With a trailing comma, you can add new items and change their order without adding or removing commas.

This is especially helpful if you use multi-line syntax for parameters or values. After adding a trailing comma, you can 
then easily swap lines with parameters or values.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' ', //trailing comma
) {
    // ...
}
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val colors = listOf(
    "red",
    "green",
    "blue", //trailing comma
)
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
including [Jetpack Compose](https://developer.android.com/jetpack/compose), who are already building their compiler plugins 
using our new back-end.

We encourage you to try out the new Kotlin/JVM backend, and to file any issues and feature requests to our [issue tracker](https://youtrack.jetbrains.com/issues/KT). This will help us to unify the compiler pipelines and bring compiler extensions like Jetpack Compose to the Kotlin community more quickly.

To enable the new JVM IR back-end, specify an additional compiler option in your Gradle build script:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
kotlinOptions.useIR = true
```

</div>

> If you [enable Jetpack Compose](https://developer.android.com/jetpack/compose/setup?hl=en), you will automatically be 
> opted in to the new JVM backend without needing to specify the compiler option in `kotlinOptions`.
{:.note}

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
