[//]: # (title: What's new in Kotlin 1.4)

_[Release date: 17 August 2020](releases.md#release-details)_

In Kotlin 1.4.0, we ship a number of improvements in all of its components, with the [focus on quality and performance](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/).
Below you will find the list of the most important changes in Kotlin 1.4.0.

## Language features and improvements

Kotlin 1.4.0 comes with a variety of different language features and improvements. They include:

* [SAM conversions for Kotlin interfaces](#sam-conversions-for-kotlin-interfaces)*
* [Explicit API mode for library authors](#explicit-api-mode-for-library-authors)
* [Mixing named and positional arguments](#mixing-named-and-positional-arguments)
* [Trailing comma](#trailing-comma)
* [Callable reference improvements](#callable-reference-improvements)
* [break and continue inside when included in loops](#using-break-and-continue-inside-when-expressions-included-in-loops)

### SAM conversions for Kotlin interfaces

Before Kotlin 1.4.0, you could apply SAM (Single Abstract Method) conversions only [when working with Java methods and Java
interfaces from Kotlin](java-interop.md#sam-conversions). From now on, you can use SAM conversions for Kotlin interfaces as well.
To do so, mark a Kotlin interface explicitly as functional with the `fun` modifier.

SAM conversion applies if you pass a lambda as an argument when an interface with only one single abstract method is expected
as a parameter. In this case, the compiler automatically converts the lambda to an instance of the class that implements the abstract member function.

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() { 
    println("Is 7 even? - ${isEven.accept(7)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

[Learn more about Kotlin functional interfaces and SAM conversions](fun-interfaces.md).

### Explicit API mode for library authors

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

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

When using the command-line compiler, switch to explicit API mode by adding  the `-Xexplicit-api` compiler option
with the value `strict` or `warning`.

```bash
-Xexplicit-api={strict|warning}
```

[Find more details about the explicit API mode in the KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md). 

### Mixing named and positional arguments

In Kotlin 1.3, when you called a function with [named arguments](functions.md#named-arguments), you had to place all the
arguments without names (positional arguments) before the first named argument. For example, you could call `f(1, y = 2)`, 
but you couldn't call `f(x = 1, 2)`.

It was really annoying when all the arguments were in their correct positions but you wanted to specify a name for one argument in the middle.
It was especially helpful for making absolutely clear which attribute a boolean or `null` value belongs to.

In Kotlin 1.4, there is no such limitation – you can now specify a name for an argument in the middle of a set of positional 
arguments. Moreover, you can mix positional and named arguments any way you like, as long as they remain in the correct order.

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Char = ' '
) {
    // ...
}

//Function call with a named argument in the middle
reformat("This is a String!", uppercaseFirstLetter = false , '-')
```

### Trailing comma

With Kotlin 1.4 you can now add a trailing comma in enumerations such as argument 
and parameter lists, `when` entries, and components of destructuring declarations.
With a trailing comma, you can add new items and change their order without adding or removing commas.

This is especially helpful if you use multi-line syntax for parameters or values. After adding a trailing comma, you can 
then easily swap lines with parameters or values.

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' ', //trailing comma
) {
    // ...
}
```

```kotlin
val colors = listOf(
    "red",
    "green",
    "blue", //trailing comma
)
```

### Callable reference improvements

Kotlin 1.4 supports more cases for using callable references:

* References to functions with default argument values
* Function references in `Unit`-returning functions 
* References that adapt based on the number of arguments in a function
* Suspend conversion on callable references 

#### References to functions with default argument values 

Now you can use callable references to functions with default argument values. If the callable reference 
to the function `foo` takes no arguments, the default value `0` is used.

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () -> String): String = func()

fun main() {
    println(apply(::foo))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

Previously, you had to write additional overloads for the function `apply` to use the default argument values.

```kotlin
// some new overload
fun applyInt(func: (Int) -> String): String = func(0) 
```

#### Function references in Unit-returning functions 

In Kotlin 1.4, you can use callable references to functions returning any type in `Unit`-returning functions. 
Before Kotlin 1.4, you could only use lambda arguments in this case. Now you can use both lambda arguments and callable references.

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // this was the only way to do it  before 1.4
    foo(::returnsInt) // starting from 1.4, this also works
}
```

#### References that adapt based on the number of arguments in a function

Now you can adapt callable references to functions when passing a variable number of arguments (`vararg`) . 
You can pass any number of parameters of the same type at the end of the list of passed arguments.

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

#### Suspend conversion on callable references

In addition to suspend conversion on lambdas, Kotlin now supports suspend conversion on callable references starting from version 1.4.0.

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // OK before 1.4
    takeSuspend(::call) // In Kotlin 1.4, it also works
}
```

### Using break and continue inside when expressions included in loops

In Kotlin 1.3, you could not use unqualified `break` and `continue` inside `when` expressions included in loops. The reason was that these keywords were reserved for possible [fall-through behavior](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough) in `when` expressions. 

That’s why if you wanted to use `break` and `continue` inside `when` expressions in loops, you had to [label](returns.md#break-and-continue-labels) them, which became rather cumbersome.

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

In Kotlin 1.4, you can use `break` and `continue` without labels inside `when` expressions included in loops. They behave as expected by terminating the nearest enclosing loop or proceeding to its next step.

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

The fall-through behavior inside `when` is subject to further design.

## New tools in the IDE

With Kotlin 1.4, you can use the new tools in IntelliJ IDEA to simplify Kotlin development:

* [New flexible Project Wizard](#new-flexible-project-wizard)
* [Coroutine Debugger](#coroutine-debugger)

### New flexible Project Wizard

With the flexible new Kotlin Project Wizard, you have a place to easily create and configure different types of Kotlin 
projects, including multiplatform projects, which can be difficult to configure without a UI.

![Kotlin Project Wizard – Multiplatform project](mpp-project-1-wn.png)

The new Kotlin Project Wizard is both simple and flexible:

1. *Select the project template*, depending on what you’re trying to do. More templates will be added in the future.
2. *Select the build system* – Gradle (Kotlin or Groovy DSL), Maven, or IntelliJ IDEA.  
    The Kotlin Project Wizard will only show the build systems supported on the selected project template.
3. *Preview the project structure* directly on the main screen.

Then you can finish creating your project or, optionally, *configure the project* on the next screen:

4. *Add/remove modules and targets* supported for this project template.
5. *Configure module and target settings*, for example, the target JVM version, target template, and test framework.

![Kotlin Project Wizard - Configure targets](mpp-project-2-wn.png)

In the future, we are going to make the Kotlin Project Wizard even more flexible by adding more configuration options and templates.

You can try out the new Kotlin Project Wizard by working through these tutorials:

* [Create a console application based on Kotlin/JVM](jvm-get-started.md)
* [Create a Kotlin/JS application for React](js-get-started.md)
* [Create a Kotlin/Native application](native-get-started.md)

### Coroutine Debugger

Many people already use [coroutines](coroutines-guide.md) for asynchronous programming.
But when it came to debugging, working with coroutines before Kotlin 1.4, could be a real pain. Since coroutines jumped between threads, 
it was difficult to understand what a specific coroutine was doing and check its context. In some cases, tracking steps 
over breakpoints simply didn’t work. As a result, you had to rely on logging or mental effort to debug code that used coroutines. 

In Kotlin 1.4, debugging coroutines is now much more convenient with the new functionality shipped with the Kotlin plugin.

> Debugging works for versions 1.3.8 or later of `kotlinx-coroutines-core`.
>
{type="note"}

The **Debug Tool Window** now contains a new **Coroutines** tab. In this tab, you can find information about both currently 
running and suspended coroutines. The coroutines are grouped by the dispatcher they are running on. 

![Debugging coroutines](coroutine-debugger-wn.png)

Now you can:
* Easily check the state of each coroutine.
* See the values of local and captured variables for both running and suspended coroutines.
* See a full coroutine creation stack, as well as a call stack inside the coroutine. The stack includes all frames with 
variable values, even those that would be lost during standard debugging.

If you need a full report containing the state of each coroutine and its stack, right-click inside the **Coroutines** tab, and then
click **Get Coroutines Dump**. Currently, the coroutines dump is rather simple, but we’re going to make it more readable 
and helpful in future versions of Kotlin.

![Coroutines Dump](coroutines-dump-wn.png)

Learn more about debugging coroutines in [this blog post](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/)
and [IntelliJ IDEA documentation](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html).

## New compiler

The new Kotlin compiler is going to be really fast; it will unify all the supported platforms and provide 
an API for compiler extensions. It's a long-term project, and we've already completed several steps in Kotlin 1.4.0:

* [New, more powerful type inference algorithm](#new-more-powerful-type-inference-algorithm) is enabled by default. 
* [New JVM and JS IR backends](#unified-backends-and-extensibility). They will become the default once we stabilize them.

### New more powerful type inference algorithm

Kotlin 1.4 uses a new, more powerful type inference algorithm. This new algorithm was already available to try in 
Kotlin 1.3 by specifying a compiler option, and now it’s used by default. You can find the full list of issues fixed in 
the new algorithm in [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20). Here
you can find some of the most noticeable improvements:

* [More cases where type is inferred automatically](#more-cases-where-type-is-inferred-automatically)
* [Smart casts for a lambda’s last expression](#smart-casts-for-a-lambda-s-last-expression)
* [Smart casts for callable references](#smart-casts-for-callable-references)
* [Better inference for delegated properties](#better-inference-for-delegated-properties)
* [SAM conversion for Java interfaces with different arguments](#sam-conversion-for-java-interfaces-with-different-arguments)
* [Java SAM interfaces in Kotlin](#java-sam-interfaces-in-kotlin)

#### More cases where type is inferred automatically

The new inference algorithm infers types for many cases where the old algorithm required you to specify them explicitly. 
For instance, in the following example the type of the lambda parameter `it` is correctly inferred to `String?`:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

In Kotlin 1.3, you needed to introduce an explicit lambda parameter or replace `to` with a `Pair` constructor with 
explicit generic arguments to make it work.

#### Smart casts for a lambda’s last expression

In Kotlin 1.3, the last expression inside a lambda wasn’t  smart cast unless you specified the expected type. Thus, in the 
following example, Kotlin 1.3 infers `String?` as the type of the `result` variable:

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

In Kotlin 1.4, thanks to the new inference algorithm, the last expression inside a lambda gets smart cast, and this new, 
more precise type is used to infer the resulting lambda type. Thus, the type of the `result` variable becomes `String`.

In Kotlin 1.3, you often needed to add explicit casts (either `!!` or type casts like `as String`) to make such cases work, 
and now these casts have become unnecessary.

#### Smart casts for callable references

In Kotlin 1.3, you couldn’t access a member reference of a smart cast type. Now in Kotlin 1.4 you can:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

You can use different member references `animal::meow` and `animal::woof` after the animal variable has been smart cast 
to specific types `Cat` and `Dog`. After type checks, you can access member references corresponding to subtypes.

#### Better inference for delegated properties

The type of a delegated property wasn’t taken into account while analyzing the delegate expression which follows the `by` 
keyword. For instance, the following code didn’t compile before, but now the compiler correctly infers the types of the 
`old` and `new` parameters as `String?`:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

#### SAM conversion for Java interfaces with different arguments

Kotlin has supported SAM conversions for Java interfaces from the beginning, but there was one case that wasn’t supported, 
which was sometimes annoying when working with existing Java libraries. If you called a Java method that took two SAM interfaces 
as parameters, both arguments needed to be either lambdas or regular objects. You couldn't pass one argument as a lambda and 
another as an object. 

The new algorithm fixes this issue, and you can pass a lambda instead of a SAM interface in any case, 
which is the way you’d naturally expect it to work.

```java
// FILE: A.java
public class A {
    public static void foo(Runnable r1, Runnable r2) {}
}
```

```kotlin
// FILE: test.kt
fun test(r1: Runnable) {
    A.foo(r1) {}  // Works in Kotlin 1.4
}
```

#### Java SAM interfaces in Kotlin

In Kotlin 1.4, you can use Java SAM interfaces in Kotlin and apply SAM conversions to them. 

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

In Kotlin 1.3, you would have had to declare the function `foo` above in Java code to perform a SAM conversion.

### Unified backends and extensibility

In Kotlin, we have three backends that generate executables: Kotlin/JVM, Kotlin/JS, and Kotlin/Native. Kotlin/JVM and Kotlin/JS 
don't share much code since they were developed independently of each other. Kotlin/Native is based on a new 
infrastructure built around an intermediate representation (IR) for Kotlin code. 

We are now migrating Kotlin/JVM and Kotlin/JS to the same IR. As a result, all three backends
share a lot of logic and have a unified pipeline. This allows us to implement most features, optimizations, and bug fixes 
only once for all platforms. Both new IR-based back-ends are in [Alpha](components-stability.md).

A common backend infrastructure also opens the door for multiplatform compiler extensions. You will be able to plug into the 
pipeline and add custom processing and transformations that will automatically work for all platforms.

We encourage you to use our new [JVM IR](#new-jvm-ir-backend) and [JS IR](#new-js-ir-backend) backends, which are currently in Alpha, and 
share your feedback with us.

## Kotlin/JVM

Kotlin 1.4.0 includes a number of JVM-specific improvements, such as:
 
* [New JVM IR backend](#new-jvm-ir-backend)
* [New modes for generating default methods in interfaces](#new-modes-for-generating-default-methods)
* [Unified exception type for null checks](#unified-exception-type-for-null-checks)
* [Type annotations in the JVM bytecode](#type-annotations-in-the-jvm-bytecode)

### New JVM IR backend

Along with Kotlin/JS, we are migrating Kotlin/JVM to the [unified IR backend](#unified-backends-and-extensibility), 
which allows us to implement most features and bug fixes once for all platforms. You will also be able to benefit from this 
by creating multiplatform extensions that will work for all platforms.

Kotlin 1.4.0 does not provide a public API for such extensions yet, but we are working closely with our partners, 
including [Jetpack Compose](https://developer.android.com/jetpack/compose), who are already building their compiler plugins 
using our new backend.

We encourage you to try out the new Kotlin/JVM backend, which is currently in Alpha, and to file any issues and feature requests to our [issue tracker](https://youtrack.jetbrains.com/issues/KT). 
This will help us to unify the compiler pipelines and bring compiler extensions like Jetpack Compose to the Kotlin community more quickly.

To enable the new JVM IR backend, specify an additional compiler option in your Gradle build script:

```kotlin
kotlinOptions.useIR = true
```

> If you [enable Jetpack Compose](https://developer.android.com/jetpack/compose/setup?hl=en), you will automatically be 
> opted in to the new JVM backend without needing to specify the compiler option in `kotlinOptions`.
>
{type="note"}

When using the command-line compiler, add the compiler option `-Xuse-ir`.

> You can use code compiled by the new JVM IR backend only if you've enabled the new backend. Otherwise, you will get an error.
> Considering this, we don't recommend that library authors switch to the new backend in production.
>
{type="note"}

### New modes for generating default methods

When compiling Kotlin code to targets JVM 1.8 and above, you could compile non-abstract methods of Kotlin interfaces into
Java's `default` methods. For this purpose, there was a mechanism that includes the `@JvmDefault` annotation for marking
such methods and the `-Xjvm-default` compiler option that enables processing of this annotation.

In 1.4.0, we've added a new mode for generating default methods: `-Xjvm-default=all` compiles *all* non-abstract methods of Kotlin
interfaces to `default` Java methods. For compatibility with the code that uses the interfaces compiled without `default`, 
we also added `all-compatibility` mode. 

For more information about default methods in the Java interop, see the [interoperability documentation](java-to-kotlin-interop.md#default-methods-in-interfaces) and 
[this blog post](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/). 

### Unified exception type for null checks

Starting from Kotlin 1.4.0, all runtime null checks will throw a `java.lang.NullPointerException` instead of `KotlinNullPointerException`,
`IllegalStateException`, `IllegalArgumentException`, and `TypeCastException`. This applies to: the `!!` operator, parameter
null checks in the method preamble, platform-typed expression null checks, and the `as` operator with a non-null type.
This doesn’t apply to `lateinit` null checks and explicit library function calls like `checkNotNull` or `requireNotNull`.

This change increases the number of possible null check optimizations that can be performed either by the Kotlin compiler
or by various kinds of bytecode processing tools, such as the Android [R8 optimizer](https://developer.android.com/studio/build/shrink-code).

Note that from a developer’s perspective, things won’t change that much: the Kotlin code will throw exceptions with the
same error messages as before. The type of exception changes, but the information passed stays the same.

### Type annotations in the JVM bytecode

Kotlin can now generate type annotations in the JVM bytecode (target version 1.8+), so that they become available in Java reflection at runtime.
To emit the type annotation in the bytecode, follow these steps:

1. Make sure that your declared annotation has a proper annotation target (Java’s `ElementType.TYPE_USE` or Kotlin’s
`AnnotationTarget.TYPE`) and retention (`AnnotationRetention.RUNTIME`).
2. Compile the annotation class declaration to JVM bytecode target version 1.8+. You can specify it with `-jvm-target=1.8`
compiler option.
3. Compile the code that uses the annotation to JVM bytecode target version 1.8+ (`-jvm-target=1.8`) and add the
`-Xemit-jvm-type-annotations` compiler option.

Note that the type annotations from the standard library aren’t emitted in the bytecode for now because the standard library is compiled
with the target version 1.6.

So far, only the basic cases are supported:

- Type annotations on method parameters, method return types and property types;
- Invariant projections of type arguments, such as `Smth<@Ann Foo>`, `Array<@Ann Foo>`.

In the following example, the `@Foo` annotation on the `String` type can be emitted to the bytecode and then used by the
library code:

```kotlin
@Target(AnnotationTarget.TYPE)
annotation class Foo

class A {
    fun foo(): @Foo String = "OK"
}
```

## Kotlin/JS

On the JS platform, Kotlin 1.4.0 provides the following improvements:

- [New Gradle DSL](#new-gradle-dsl)
- [New JS IR backend](#new-js-ir-backend)

### New Gradle DSL

The `kotlin.js` Gradle plugin comes with an adjusted Gradle DSL, which provides a number of new configuration options and is more closely aligned to the DSL used by the `kotlin-multiplatform` plugin. Some of the most impactful changes include:

- Explicit toggles for the creation of executable files via `binaries.executable()`. Read more about the [executing Kotlin/JS and its environment here](js-project-setup.md#execution-environments).
- Configuration of webpack's CSS and style loaders from within the Gradle configuration via `cssSupport`. Read more about [using CSS and style loaders here](js-project-setup.md#css).
- Improved management for npm dependencies, with mandatory version numbers or [semver](https://docs.npmjs.com/misc/semver#versions) version ranges, as well as support for _development_, _peer_, and _optional_ npm dependencies using `devNpm`, `optionalNpm` and `peerNpm`. [Read more about dependency management for npm packages directly from Gradle here](js-project-setup.md#npm-dependencies).
- Stronger integrations for [Dukat](https://github.com/Kotlin/dukat), the generator for Kotlin external declarations. External declarations can now be generated at build time, or can be manually generated via a Gradle task. [Read more about how to use the integration here](js-external-declarations-with-dukat.md).

### New JS IR backend

The [IR backend for Kotlin/JS](js-ir-compiler.md), which currently has [Alpha](components-stability.md) stability, provides some new functionality specific to the Kotlin/JS target which is focused around the generated code size through dead code elimination, and improved interoperation with JavaScript and TypeScript, among others.

To enable the Kotlin/JS IR backend, set the key `kotlin.js.compiler=ir` in your `gradle.properties`, or pass the `IR` compiler type to the `js` function of your Gradle build script:

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // . . .
    }
    binaries.executable()
}
```

For more detailed information about how to configure the new backend, check out the [Kotlin/JS IR compiler documentation](js-ir-compiler.md).

With the new [@JsExport](js-to-kotlin-interop.md#jsexport-annotation) annotation and the ability to **[generate TypeScript definitions](js-ir-compiler.md#preview-generation-of-typescript-declaration-files-d-ts) from Kotlin code**, the Kotlin/JS IR compiler backend improves JavaScript & TypeScript interoperability. This also makes it easier to integrate Kotlin/JS code with existing tooling, to create **hybrid applications** and leverage code-sharing functionality in multiplatform projects.

[Learn more about the available features in the Kotlin/JS IR compiler backend](js-ir-compiler.md).

## Kotlin/Native

In 1.4.0, Kotlin/Native got a significant number of new features and improvements, including: 

* [Support for suspending functions in Swift and Objective-C](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [Objective-C generics support by default](#objective-c-generics-support-by-default)
* [Exception handling in Objective-C/Swift interop](#exception-handling-in-objective-c-swift-interop)
* [Generate release .dSYMs on Apple targets by default](#generate-release-dsyms-on-apple-targets-by-default)
* [Performance improvements](#performance-improvements)
* [Simplified management of CocoaPods dependencies](#simplified-management-of-cocoapods-dependencies)

### Support for Kotlin’s suspending functions in Swift and Objective-C

In 1.4.0, we add the basic support for suspending functions in Swift and Objective-C. Now, when you compile a Kotlin module
into an Apple framework, suspending functions are available in it as functions with callbacks (`completionHandler` in 
the Swift/Objective-C terminology). When you have such functions in the generated framework’s header, you can call them
from your Swift or Objective-C code and even override them.

For example, if you write this Kotlin function:

```kotlin
suspend fun queryData(id: Int): String = ...
```

…then you can call it from Swift like so:

```swift
queryData(id: 17) { result, error in
   if let e = error {
       print("ERROR: \(e)")
   } else {
       print(result!)
   }
}
```

[Learn more about using suspending functions in Swift and Objective-C](native-objc-interop.md).

### Objective-C generics support by default

Previous versions of Kotlin provided experimental support for generics in Objective-C interop. Since 1.4.0, Kotlin/Native 
generates Apple frameworks with generics from Kotlin code by default. In some cases, this may break existing Objective-C
or Swift code calling Kotlin frameworks. To have the framework header written without generics, add the `-Xno-objc-generics` compiler option.

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

Please note that all specifics and limitations listed in the [documentation on interoperability with Objective-C](native-objc-interop.md#generics) are still valid.

### Exception handling in Objective-C/Swift interop

In 1.4.0, we slightly change the Swift API generated from Kotlin with respect to the way exceptions are translated. There is
a fundamental difference in error handling between Kotlin and Swift. All Kotlin exceptions are unchecked, while Swift has
only checked errors. Thus, to make Swift code aware of expected exceptions, Kotlin functions should be marked with a `@Throws`
annotation specifying a list of potential exception classes.

When compiling to Swift or the Objective-C framework, functions that have or are inheriting `@Throws` annotation are represented
as `NSError*`-producing methods in Objective-C and as `throws` methods in Swift.

Previously, any exceptions other than `RuntimeException` and `Error` were propagated as `NSError`. Now this behavior changes: 
now `NSError` is thrown only for exceptions that are instances of classes specified as parameters of `@Throws` annotation 
(or their subclasses). Other Kotlin exceptions that reach Swift/Objective-C are considered unhandled and cause program termination.

### Generate release .dSYMs on Apple targets by default

Starting with 1.4.0, the Kotlin/Native compiler produces [debug symbol files](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information)
(`.dSYM`s) for release binaries on Darwin platforms by default. This can be disabled with the `-Xadd-light-debug=disable`
compiler option. On other platforms, this option is disabled by default. To toggle this option in Gradle, use:

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

[Learn more about crash report symbolication](native-ios-symbolication.md).

### Performance improvements

Kotlin/Native has received a number of performance improvements that speed up both the development process and execution.
Here are some examples:

- To improve the speed of object allocation, we now offer the [mimalloc](https://github.com/microsoft/mimalloc)
memory allocator as an alternative to the system allocator. mimalloc works up to two times faster on some benchmarks.
Currently, the usage of mimalloc in Kotlin/Native is experimental; you can switch to it using the `-Xallocator=mimalloc` compiler option.

- We’ve reworked how C interop libraries are built. With the new tooling, Kotlin/Native produces interop libraries up to
4 times as fast as before, and artifacts are 25% to 30% the size they used to be.

- Overall runtime performance has improved because of optimizations in GC. This improvement will be especially apparent
in projects with a large number of long-lived objects. `HashMap` and `HashSet` collections now work faster by escaping redundant boxing.

- In 1.3.70 we introduced two new features for improving the performance of Kotlin/Native compilation:
[caching project dependencies and running the compiler from the Gradle daemon](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native).
Since that time, we’ve managed to fix numerous issues and improve the overall stability of these features.

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

[Learn how to add dependencies](native-cocoapods.md).

## Kotlin Multiplatform

> Support for multiplatform projects is in [Alpha](components-stability.md). It may change incompatibly and require manual migration in the future.
> We appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issues/KT).
>
{type="warning"}

[Kotlin Multiplatform](multiplatform.md) reduces time spent writing and maintaining the same code for [different platforms](mpp-supported-platforms.md) 
while retaining the flexibility and benefits of native programming. We continue investing our effort in multiplatform features
and improvements:

* [Sharing code in several targets with the hierarchical project structure](#sharing-code-in-several-targets-with-the-hierarchical-project-structure)
* [Leveraging native libs in the hierarchical structure](#leveraging-native-libs-in-the-hierarchical-structure)
* [Specifying kotlinx dependencies only once](#specifying-dependencies-only-once)

> Multiplatform projects require Gradle 6.0 or later.
>
{type="note"}

### Sharing code in several targets with the hierarchical project structure

With the new hierarchical project structure support, you can share code among [several platforms](mpp-supported-platforms.md)
 in a [multiplatform project](mpp-discover-project.md).

Previously, any code added to a multiplatform project could be placed either in a platform-specific source set, which is 
limited to one target and can’t be reused by any other platform, or in a common source set, like `commonMain` or `commonTest`, 
which is shared across all the platforms in the project. In the common source set, you could only call a platform-specific 
API by using an [`expect` declaration that needs platform-specific `actual` implementations](mpp-connect-to-apis.md).

This made it easy to [share code on all platforms](mpp-share-on-platforms.md#share-code-on-all-platforms), but it was
not so easy to [share between only some of the targets](mpp-share-on-platforms.md#share-code-on-similar-platforms), 
especially similar ones that could potentially reuse a lot of the common logic and third-party APIs.

For example, in a typical multiplatform project targeting iOS, there are two iOS-related targets: one for iOS ARM64 devices, 
and the other for the x64 simulator. They have separate platform-specific source sets, but in practice, there is rarely 
a need for different code for the device and simulator, and their dependencies are much alike. So iOS-specific code could 
be shared between them.

Apparently, in this setup, it would be desirable to have a *shared source set for two iOS targets*, with Kotlin/Native 
code that could still directly call any of the APIs that are common to both the iOS device and the simulator.

![Code shared for iOS targets](iosmain-hierarchy.png){width=300}

Now you can do this with the [hierarchical project structure support](mpp-share-on-platforms.md#share-code-on-similar-platforms), which infers and adapts the API and language features 
available in each source set based on which targets consume them.

For common combinations of targets, you can create a hierarchical structure with [target shortcuts](mpp-share-on-platforms.md#use-target-shortcuts).

For example, create two iOS targets and the shared source set shown above with the `ios()` shortcut:

```kotlin
kotlin {
    ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```

For other combinations of targets, <!--TODO: [create a hierarchy manually](mpp-share-on-platforms.md#configure-the-hierarchical-structure-manually) -->
by connecting the source sets with the `dependsOn` relation.

![Hierarchical structure](hierarchical-structure.png)

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin{
    sourceSets {
        val desktopMain by creating {
            dependsOn(commonMain)
        }
        val linuxX64Main by getting {
            dependsOn(desktopMain)
        }
        val mingwX64Main by getting {
            dependsOn(desktopMain)
        }
        val macosX64Main by getting {
            dependsOn(desktopMain)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        desktopMain {
            dependsOn(commonMain)
        }
        linuxX64Main {
            dependsOn(desktopMain)
        }
        mingwX64Main {
            dependsOn(desktopMain)
        }
        macosX64Main {
            dependsOn(desktopMain)
        }
    }
}

```

</tab>
</tabs>

Thanks to the hierarchical project structure, libraries can also provide common APIs for a subset of targets. Learn more
about [sharing code in libraries](mpp-share-on-platforms.md#share-code-in-libraries).

### Leveraging native libs in the hierarchical structure 

You can use platform-dependent libraries, such as `Foundation`, `UIKit`, and `posix`, in source sets shared among several 
native targets. This can help you share more native code without being limited by platform-specific dependencies. 

No additional steps are required – everything is done automatically. IntelliJ IDEA will help you detect common declarations 
that you can use in the shared code.

[Learn more about usage of platform-dependent libraries](mpp-share-on-platforms.md#use-native-libraries-in-the-hierarchical-structure).

### Specifying dependencies only once

From now on, instead of specifying dependencies on different variants of the same library in shared and platform-specific 
source sets where it is used, you should specify a dependency only once in the shared source set.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

Don’t use kotlinx library artifact names with suffixes specifying the platform, such as  `-common`, `-native`, or similar, 
as they are NOT supported anymore. Instead, use the library base artifact name, which in the example above is `kotlinx-coroutines-core`. 

However, the change doesn’t currently affect:
* The `stdlib` library – starting from Kotlin 1.4.0, [the stdlib dependency is added automatically](#dependency-on-the-standard-library-added-by-default).
* The `kotlin.test` library – you should still use `test-common` and `test-annotations-common`. These dependencies will be
addressed later.

If you need a dependency only for a specific platform, you can still use platform-specific variants of standard and kotlinx 
libraries with such suffixes as `-jvm` or` -js`, for example `kotlinx-coroutines-core-jvm`. 

[Learn more about configuring dependencies](gradle.md#configuring-dependencies).

## Gradle project improvements

Besides Gradle project features and improvements that are specific to [Kotlin Multiplatform](#kotlin-multiplatform), [Kotlin/JVM](#kotlin-jvm), 
[Kotlin/Native](#kotlin-native), and [Kotlin/JS](#kotlin-js), there are several changes applicable to all Kotlin Gradle projects:

* [Dependency on the standard library is now added by default](#dependency-on-the-standard-library-added-by-default)
* [Kotlin projects require a recent version of Gradle](#minimum-gradle-version-for-kotlin-projects)
* [Improved support for Kotlin Gradle DSL in the IDE](#improved-gradle-kts-support-in-the-ide)

### Dependency on the standard library added by default

You no longer need to declare a dependency on the `stdlib` library in any Kotlin Gradle project, including a multiplatform one.
The dependency is added by default. 

The automatically added standard library will be the same version of the Kotlin Gradle plugin, 
since they have the same versioning.

For platform-specific source sets, the corresponding platform-specific variant of the library is used, while a common standard 
library is added to the rest. The Kotlin Gradle plugin will select the appropriate JVM standard library depending on 
the `kotlinOptions.jvmTarget` [compiler option](gradle.md#compiler-options) of your Gradle build script.

[Learn how to change the default behavior](gradle.md#dependency-on-the-standard-library).

### Minimum Gradle version for Kotlin projects

To enjoy the new features in your Kotlin projects, update Gradle to the [latest version](https://gradle.org/releases/). 
Multiplatform projects require Gradle 6.0 or later, while other Kotlin projects work with Gradle 5.4 or later.

### Improved *.gradle.kts support in the IDE 

In 1.4.0, we continued improving the IDE support for Gradle Kotlin DSL scripts (`*.gradle.kts` files). Here is what the new
version brings:

- _Explicit loading of script configurations_ for better performance. Previously, the changes you make to the build script
were loaded automatically in the background. To improve the performance, we've disabled the automatic loading of build script
configuration in 1.4.0. Now the IDE loads the changes only when you explicitly apply them.

  In Gradle versions earlier than 6.0, you need to manually load the script configuration by clicking **Load Configuration** in the editor.

  ![*.gradle.kts – Load Configuration](gradle-kts-load-config.png)

  In Gradle 6.0 and above, you can explicitly apply changes by clicking **Load Gradle Changes** or by reimporting the
Gradle project.
 
  We’ve added one more action in IntelliJ IDEA 2020.1 with Gradle 6.0 and above – **Load Script Configurations**, which loads changes
to the script configurations without updating the whole project. This takes much less time than reimporting the whole project.

  ![*.gradle.kts – Load Script Changes and Load Gradle Changes](gradle-kts.png)

  You should also **Load Script Configurations** for newly created scripts or when you open a project with new Kotlin plugin for the first time.
  
  With Gradle 6.0 and above, you are now able to load all scripts at once as opposed to the previous implementation where
  they were loaded individually. Since each request requires the Gradle configuration phase to be executed, this could be
  resource-intensive for large Gradle projects. 
  
  Currently, such loading is limited to `build.gradle.kts` and `settings.gradle.kts` files (please vote for the related [issue](https://github.com/gradle/gradle/issues/12640)).
  To enable highlighting for `init.gradle.kts` or applied [script plugins](https://docs.gradle.org/current/userguide/plugins.html#sec:script_plugins),
  use the old mechanism – adding them to standalone scripts. Configuration for that scripts will be loaded separately when you need it.
  You can also enable auto-reload for such scripts.
    
  ![*.gradle.kts – Add to standalone scripts](gradle-kts-standalone.png)
  
- _Better error reporting_. Previously you could only see errors from the Gradle Daemon in separate log files. Now the
Gradle Daemon returns all the information about errors directly and shows it in the Build tool window. This saves you both
time and effort.

## Standard library

Here is the list of the most significant changes to the Kotlin standard library in 1.4.0: 

- [Common exception processing API](#common-exception-processing-api)
- [New functions for arrays and collections](#new-functions-for-arrays-and-collections)
- [Functions for string manipulations](#functions-for-string-manipulations)
- [Bit operations](#bit-operations)
- [Delegated properties improvements](#delegated-properties-improvements)
- [Converting from KType to Java Type](#converting-from-ktype-to-java-type)
- [Proguard configurations for Kotlin reflection](#proguard-configurations-for-kotlin-reflection)
- [Improving the existing API](#improving-the-existing-api)
- [module-info descriptors for stdlib artifacts](#module-info-descriptors-for-stdlib-artifacts)
- [Deprecations](#deprecations)
- [Exclusion of the deprecated experimental coroutines](#exclusion-of-the-deprecated-experimental-coroutines)

### Common exception processing API

The following API elements have been moved to the common library:

* `Throwable.stackTraceToString()` extension function, which returns the detailed description of this throwable with its
stack trace, and `Throwable.printStackTrace()`, which prints this description to the standard error output.
* `Throwable.addSuppressed()` function, which lets you specify the exceptions that were suppressed in order to deliver
the exception, and the `Throwable.suppressedExceptions` property, which returns a list of all the suppressed exceptions.
* `@Throws` annotation, which lists exception types that will be checked when the function is compiled to a platform method
(on JVM or native platforms). 

### New functions for arrays and collections

#### Collections

In 1.4.0, the standard library includes a number of useful functions for working with **collections**:

* `setOfNotNull()`, which makes a set consisting of all the non-null items among the provided arguments.

    ```kotlin
    fun main() {
    //sampleStart
        val set = setOfNotNull(null, 1, 2, 0, null)
        println(set)
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `shuffled()` for sequences.

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = (0 until 50).asSequence()
        val result = numbers.map { it * 2 }.shuffled().take(5)
        println(result.toList()) //five random even numbers below 100
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `*Indexed()` counterparts for `onEach()` and `flatMap()`.
The operation that they apply to the collection elements has the element index as a parameter.

    ```kotlin
    fun main() {
    //sampleStart
        listOf("a", "b", "c", "d").onEachIndexed {
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
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `*OrNull()` counterparts `randomOrNull()`, `reduceOrNull()`, and `reduceIndexedOrNull()`. 
They return `null` on empty collections.

    ```kotlin
    fun main() {
    //sampleStart
         val empty = emptyList<Int>()
         empty.reduceOrNull { a, b -> a + b }
         //empty.reduce { a, b -> a + b } // Exception: Empty collection can't be reduced.
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `runningFold()`, its synonym `scan()`, and `runningReduce()` apply the given operation to the collection elements sequentially,
 similarly to`fold()` and `reduce()`; the difference is that these new functions return the whole sequence of intermediate results.

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = mutableListOf(0, 1, 2, 3, 4, 5)
        val runningReduceSum = numbers.runningReduce { sum, item -> sum + item }
        val runningFoldSum = numbers.runningFold(10) { sum, item -> sum + item }
    //sampleEnd
        println(runningReduceSum.toString())
        println(runningFoldSum.toString())
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `sumOf()` takes a selector function and returns a sum of its values for all elements of a collection.
`sumOf()` can produce sums of the types `Int`, `Long`, `Double`, `UInt`, and `ULong`. On the JVM, `BigInteger` and `BigDecimal` are also available.

    ```kotlin
    data class OrderItem(val name: String, val price: Double, val count: Int)
    
    fun main() {
    //sampleStart
        val order = listOf<OrderItem>(
            OrderItem("Cake", price = 10.0, count = 1),
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))
    
        val total = order.sumOf { it.price * it.count } // Double
        val count = order.sumOf { it.count } // Int
    //sampleEnd
        println("You've ordered $count items that cost $total in total")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* The `min()` and `max()` functions have been renamed to `minOrNull()` and `maxOrNull()` to comply with the naming
  convention used across the Kotlin collections API. An `*OrNull` suffix in the function name means that it returns `null`
  if the receiver collection is empty. The same applies to `minBy()`, `maxBy()`, `minWith()`, `maxWith()` – in 1.4, 
  they have `*OrNull()` synonyms.
* The new `minOf()` and `maxOf()` extension functions return the minimum and the maximum value of the given selector function
  on the collection items.

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
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

    There are also `minOfWith()` and `maxOfWith()`, which take a `Comparator` as an argument, and `*OrNull()` versions
of all four functions that return `null` on empty collections.

* New overloads for `flatMap` and `flatMapTo` let you use transformations with return types that don’t match the receiver type, namely:
    * Transformations to `Sequence` on `Iterable`, `Array`, and `Map`
    * Transformations to `Iterable` on `Sequence`

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
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* `removeFirst()` and `removeLast()` shortcuts for removing elements from mutable lists, and `*orNull()` counterparts
of these functions.

#### Arrays

To provide a consistent experience when working with different container types, we’ve also added new functions for **arrays**:

* `shuffle()` puts the array elements in a random order.
* `onEach()` performs the given action on each array element and returns the array itself.
* `associateWith()` and `associateWithTo()` build maps with the array elements as keys.
* `reverse()` for array subranges reverses the order of the elements in the subrange.
* `sortDescending()` for array subranges sorts the elements in the subrange in descending order.
* `sort()` and `sortWith()` for array subranges are now available in the common library.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

Additionally, there are new functions for conversions between `CharArray`/`ByteArray` and `String`:
* `ByteArray.decodeToString()` and `String.encodeToByteArray()`
* `CharArray.concatToString()` and `String.toCharArray()`

```kotlin
fun main() {
//sampleStart
	val str = "kotlin"
    val array = str.toCharArray()
    println(array.concatToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

#### ArrayDeque

We've also added the `ArrayDeque` class – an implementation of a double-ended queue.
Double-ended queue lets you can add or remove elements both at the beginning and the end of the queue in an amortized
constant time. You can use a double-ended queue by default when you need a queue or a stack in your code.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

The `ArrayDeque` implementation uses a resizable array underneath: it stores the contents in a circular buffer, an `Array`,
and resizes this `Array` only when it becomes full.

### Functions for string manipulations

The standard library in 1.4.0 includes a number of improvements in the API for string manipulation:

* `StringBuilder` has useful new extension functions: `set()`, `setRange()`, `deleteAt()`, `deleteRange()`, `appendRange()`,
and others.

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
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* Some existing functions of `StringBuilder` are available in the common library. Among them are `append()`, `insert()`,
`substring()`, `setLength()`, and more. 
* New functions `Appendable.appendLine()` and `StringBuilder.appendLine()` have been added to the common library. They
replace the JVM-only `appendln()` functions of these classes.

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
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### Bit operations

New functions for bit manipulations:
* `countOneBits()` 
* `countLeadingZeroBits()`
* `countTrailingZeroBits()`
* `takeHighestOneBit()`
* `takeLowestOneBit()` 
* `rotateLeft()` and `rotateRight()` (experimental)

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### Delegated properties improvements

In 1.4.0, we have added new features to improve your experience with delegated properties in Kotlin:
- Now a property can be delegated to another property.
- A new interface `PropertyDelegateProvider` helps create delegate providers in a single declaration.
- `ReadWriteProperty` now extends `ReadOnlyProperty` so you can use both of them for read-only properties.

Aside from the new API, we've made some optimizations that reduce the resulting bytecode size. These optimizations are
described in [this blog post](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties). 

[Learn more about delegated properties](delegated-properties.md).

### Converting from KType to Java Type

A new extension property `KType.javaType` (currently experimental) in the stdlib helps you obtain a `java.lang.reflect.Type`
from a Kotlin type without using the whole `kotlin-reflect` dependency.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### Proguard configurations for Kotlin reflection

Starting from 1.4.0, we have embedded Proguard/R8 configurations for Kotlin Reflection in `kotlin-reflect.jar`. With this
in place, most Android projects using R8 or Proguard should work with kotlin-reflect without needing any additional configuration.
You no longer need to copy-paste the Proguard rules for kotlin-reflect internals. But note that you still need to explicitly 
list all the APIs you’re going to reflect on.

### Improving the existing API

* Several functions now work on null receivers, for example:
    * `toBoolean()` on strings
    * `contentEquals()`, `contentHashcode()`, `contentToString()` on arrays

* `NaN`, `NEGATIVE_INFINITY`, and `POSITIVE_INFINITY` in `Double` and `Float` are now defined as `const`, so you can use
them as annotation arguments.

* New constants `SIZE_BITS` and `SIZE_BYTES` in `Double` and `Float` contain the number of bits and bytes used
to represent an instance of the type in binary form.

* The `maxOf()` and `minOf()` top-level functions can accept a variable number of arguments (`vararg`).

### module-info descriptors for stdlib artifacts

Kotlin 1.4.0 adds `module-info.java` module information to default standard library artifacts. This lets you use them with 
[jlink tool](https://docs.oracle.com/en/java/javase/11/tools/jlink.html), which generates custom Java runtime images
containing only the platform modules that are required for your app.
You could already use jlink with Kotlin standard library artifacts, but you had to use separate artifacts to do so – the
ones with the “modular” classifier – and the whole setup wasn’t straightforward.  
In Android, make sure you use the Android Gradle plugin version 3.2 or higher, which can correctly process jar files with module-info.

### Deprecations

#### toShort() and toByte() of Double and Float

We've deprecated the functions `toShort()` and `toByte()` on `Double` and `Float` because they could lead to unexpected results
because of the narrow value range and smaller variable size.

To convert floating-point numbers to `Byte` or `Short`, use the two-step conversion: first, convert them to `Int`, and then 
convert them again to the target type.

#### contains(), indexOf(), and lastIndexOf() on floating-point arrays

We've deprecated the `contains()`, `indexOf()`, and `lastIndexOf()` extension functions of `FloatArray` and `DoubleArray`
because they use the [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) standard equality, which contradicts the total
order equality in some corner cases. See [this issue](https://youtrack.jetbrains.com/issue/KT-28753) for details.

#### min() and max() collection functions

We've deprecated the `min()` and `max()` collection functions in favor of `minOrNull()` and `maxOrNull()`, which more
properly reflect their behavior – returning `null` on empty collections.
See [this issue](https://youtrack.jetbrains.com/issue/KT-38854) for details. 

### Exclusion of the deprecated experimental coroutines
 
The `kotlin.coroutines.experimental` API was deprecated in favor of kotlin.coroutines in 1.3.0. In 1.4.0, we’re completing
the deprecation cycle for `kotlin.coroutines.experimental` by removing it from the standard library. For those who still
use it on the JVM, we've provided a compatibility artifact `kotlin-coroutines-experimental-compat.jar` with all the experimental
coroutines APIs. We've published it to Maven, and we include it in the Kotlin distribution alongside the standard library.

## Stable JSON serialization

With Kotlin 1.4.0, we are shipping the first stable version of [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) -
1.0.0-RC. Now we are pleased to declare the JSON serialization API in `kotlinx-serialization-core` (previously known as `kotlinx-serialization-runtime`)
stable. Libraries for other serialization formats remain experimental, along with some advanced parts of the core library.

We have significantly reworked the API for JSON serialization to make it more consistent and easier to use. From now on,
we'll continue developing the JSON serialization API in a backward-compatible manner.
However, if you have used previous versions of it, you'll need to rewrite some of your code when migrating to 1.0.0-RC.
To help you with this, we also offer the [Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md) –
the complete set of documentation for `kotlinx.serialization`. It will guide you through the process of using the most
important features and it can help you address any issues that you might face.

>**Note**: `kotlinx-serialization` 1.0.0-RC only works with Kotlin compiler 1.4. Earlier compiler versions are not compatible.
>
{type="note"}

## Scripting and REPL

In 1.4.0, scripting in Kotlin benefits from a number of functional and performance improvements along with other updates.
Here are some of the key changes:

- [New dependencies resolution API](#new-dependencies-resolution-api)
- [New REPL API](#new-repl-api)
- [Compiled scripts cache](#compiled-scripts-cache)
- [Artifacts renaming](#artifacts-renaming)

To help you become more familiar with scripting in Kotlin, we’ve prepared a [project with examples](https://github.com/Kotlin/kotlin-script-examples).
It contains examples of the standard scripts (`*.main.kts`) and examples of uses of the Kotlin Scripting API and custom
script definitions. Please give it a try and share your feedback using our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

### New dependencies resolution API

In 1.4.0, we’ve introduced a new API for resolving external dependencies (such as Maven artifacts), along with implementations
for it. This API is published in the new artifacts `kotlin-scripting-dependencies` and `kotlin-scripting-dependencies-maven`.
The previous dependency resolution functionality in `kotlin-script-util` library is now deprecated.

### New REPL API

The new experimental REPL API is now a part of the Kotlin Scripting API. There are also several implementations of it in
the published artifacts, and some have advanced functionality, such as code completion. We use this API in the 
[Kotlin Jupyter kernel](https://blog.jetbrains.com/kotlin/2020/05/kotlin-kernel-for-jupyter-notebook-v0-8/)
and now you can try it in your own custom shells and REPLs.

### Compiled scripts cache

The Kotlin Scripting API now provides the ability to implement a compiled scripts cache, significantly speeding up subsequent
executions of unchanged scripts. Our default advanced script implementation `kotlin-main-kts` already has its own cache.

### Artifacts renaming

In order to avoid confusion about artifact names, we’ve renamed `kotlin-scripting-jsr223-embeddable` and `kotlin-scripting-jvm-host-embeddable`
to just `kotlin-scripting-jsr223` and `kotlin-scripting-jvm-host`. These artifacts depend on the `kotlin-compiler-embeddable`
artifact, which shades the bundled third-party libraries to avoid usage conflicts. With this renaming, we’re making the usage of
`kotlin-compiler-embeddable` (which is safer in general) the default for scripting artifacts.
If, for some reason, you need artifacts that depend on the unshaded `kotlin-compiler`, use the artifact versions with the 
`-unshaded` suffix, such as `kotlin-scripting-jsr223-unshaded`. Note that this renaming affects only the scripting artifacts
that are supposed to be used directly; names of other artifacts remain unchanged.

## Migrating to Kotlin 1.4.0

The Kotlin plugin’s migration tools help you migrate your projects from earlier versions of Kotlin to 1.4.0.

Just change the Kotlin version to `1.4.0` and re-import your Gradle or Maven project. The IDE will then ask you about migration.
 
If you agree, it will run migration code inspections that will check your code and suggest corrections for anything that doesn't work 
or that is not recommended in 1.4.0. 

![Run migration](run-migration-wn.png){width=300}

Code inspections have different [severity levels](https://www.jetbrains.com/help/idea/configuring-inspection-severities.html), 
to help you decide which suggestions to accept and which to ignore.

![Migration inspections](migration-inspection-wn.png)

Kotlin 1.4.0 is a [feature release](kotlin-evolution.md#feature-releases-and-incremental-releases) and therefore can 
bring incompatible changes to the language. Find the detailed list of such changes in the [Compatibility Guide for Kotlin 1.4](compatibility-guide-14.md).

<!-- ### Migrating multiplatform projects

To help you start using the new features of [Kotlin multiplatform](#kotlin-multiplatform) in existing projects, we
publish the TODO: [migration guide for multiplatform projects](migrating-multiplatform-project-to-14.md). -->