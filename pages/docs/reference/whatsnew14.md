---
type: doc
layout: reference
title: "What's New in Kotlin 1.4"
---

# What's New in Kotlin 1.4

## Language features and improvements

Kotlin 1.4 comes with a variety of different language features and improvements. They include:

* [SAM conversions for Kotlin interfaces](#sam-conversions-for-kotlin-interfaces)
* [Callable reference improvements](#callable-reference-improvements)

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

fun main(){
   println("Is 7 even? - ${isEven.accept(7)}")
}
```

</div>

Learn more about [Kotlin functional interfaces and SAM conversions](fun-interfaces.html).

### Callable reference improvements

Kotlin 1.4 supports more cases for using callable references:

* References to functions with default argument values
* Function references in `Unit`-returning functions 
* References adapting to functions with a variable number of arguments (`vararg`)
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

Previously, you should write additional overloads for the function `apply` to use the default argument values.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// some new overload
fun applyInt(func: (Int) -> String): String = func(0) 
```

</div>

#### Function references in `Unit`-returning functions 

In Kotlin 1.4, you can use callable references to functions returning any type in `Unit`-returning functions. 
Before Kotlin 1.4, you could use only lambda arguments in this case. Now you can use both.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // it was OK before 1.4
    foo(::returnsInt) // since Kotlin 1.4, it works as well
}
```

</div>

#### References adapting to functions with a variable number of arguments

Now you can adapt callable references to functions when passing a variable number of arguments (`vararg`) . 
You can pass any number of parameters of the same type at the end.

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

In addition to suspend conversion on lambdas, Kotlin 1.4 supports suspend conversion on callable references.

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

* [New more powerful type inference algorithm](#new-more-powerful-type-inference-algorithm) is enabled by default. 
* New JVM and JS IR BE are available in the experimental mode. They will become the default once we stabilize them.

### New more powerful type inference algorithm

Kotlin 1.4 uses a new, more powerful type inference algorithm. You were already able to try this new algorithm with 
Kotlin 1.3 by specifying a compiler option, and now it’s used by default. You can find the full list of issues fixed in 
the new algorithm in [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20). Here
you can find some of the most noticeable improvements:

* Inferring a type automatically in more cases
* Smart casts for the lambda’s last expression
* Smart casts for callable references
* Better inference for delegated properties
* SAM conversion for Java interfaces with different arguments
* Java SAM interfaces in Kotlin

#### Inferring a type automatically in more cases

The new inference algorithm infers types for many cases where the old inference required you to specify them explicitly. 
For instance, in the following example, the type of the lambda parameter `it` is correctly inferred to `String?`:

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

In Kotlin 1.3, you needed to introduce an explicit lambda parameter, or replace `to` with a `Pair` constructor with 
explicit generic arguments to make it work.

#### Smart casts for the lambda’s last expression

In Kotlin 1.3, the last expression inside lambda isn’t smart cast unless you specify the expected type. Thus, in the 
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

In Kotlin 1.4, thanks to the new inference algorithm, the last expression inside lambda gets smart cast, and this new, 
more precise type is used to infer the resulting lambda type. Thus, the type of the `result` variable becomes `String`.

In Kotlin 1.3, you often needed to add explicit casts (either `!!` or type casts like `as String`) to make such cases work, 
and now these casts have become unnecessary.

#### Smart casts for callable references

In Kotlin 1.3, you couldn’t access a member reference of a smart cast type. Now you can:

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
as parameters, both arguments need to be either lambdas or regular objects. You couldn't pass one argument as a lambda and 
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
In Kotlin 1.3, you could perform a SAM conversion only if you declared such a function `foo` in Java code.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

</div>

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
