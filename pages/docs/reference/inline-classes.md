---
type: doc
layout: reference
category: "Classes and Objects"
title: "Inline classes"
---

# Inline classes

> Inline classes are in [Beta](evolution/components-stability.html). They are almost stable, but migration steps may be required in the future. 
> We'll do our best to minimize any changes you will have to make.
> We would appreciate your feedback on the inline classes feature in [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434).
{:.note}

Sometimes it is necessary for business logic to create a wrapper around some type. However, it introduces runtime overhead due to additional heap allocations. Moreover, if the wrapped type is primitive, the performance hit is terrible, because primitive types are usually heavily optimized by the runtime, while their wrappers don't get any special treatment. 

To solve such issues, Kotlin introduces a special kind of class called an _inline class_. 
Inline classes are a subset of value-based classes. They don't have an identity and can only hold values.

To declare an inline class, use an `inline` or `value` modifier before the name of the class:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
inline class Password(val value: String)
```  

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
value class Password(private val s: String)
```

</div>

To declare an inline class for the JVM backend, use the `value` modifier along with the `@JvmInline` annotation before the class declaration: 

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// For JVM backends
@JvmInline
value class Password(private val s: String)
```

</div>

An inline class must have a single property initialized in the primary constructor. At runtime, instances of the inline class will be represented using this single property (see details about runtime representation [below](#representation)):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// No actual instantiation of class 'Password' happens
// At runtime 'securePassword' contains just 'String'
val securePassword = Password("Don't try this in production") 
```

</div>

This is the main feature of inline classes, which inspired the name "inline": data of the class is "inlined" into its usages (similar to how content of [inline functions](inline-functions.html) is inlined to call sites).

## Members

Inline classes support some functionality of regular classes. In particular, they are allowed to declare properties and functions, and have the `init` block:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@JvmInline
value class Name(val s: String) {
    init {
        require(s.length > 0) { }
    }

    val length: Int
        get() = s.length

    fun greet() {
        println("Hello, $s")
    }
}    

fun main() {
    val name = Name("Kotlin")
    name.greet() // method `greet` is called as a static method
    println(name.length) // property getter is called as a static method
}
```

</div>

There are some restrictions for inline class members:
* inline class properties cannot have [backing fields](properties.html#backing-fields). They can only have simple computable properties (no `lateinit`/delegated properties).
* Inline classes cannot have `var` properties or extension `var` properties.


## Inheritance

Inline classes are allowed to inherit from interfaces:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface Printable {
    fun prettyPrint(): String
}

@JvmInline
value class Name(val s: String) : Printable {
    override fun prettyPrint(): String = "Let's $s!"
}    

fun main() {
    val name = Name("Kotlin")
    println(name.prettyPrint()) // Still called as a static method
}
```  

</div>

It is forbidden for inline classes to participate in a class hierarchy. This means that inline classes cannot extend other classes and must be *final*{: .keyword }.

## Representation

In generated code, the Kotlin compiler keeps a *wrapper* for each inline class. Inline class instances can be represented at runtime either as wrappers or as the underlying type. This is similar to how `Int` can be [represented](basic-types.html#representation) either as a primitive `int` or as the wrapper `Integer`.

The Kotlin compiler will prefer using underlying types instead of wrappers to produce the most performant and optimized code. However, sometimes it is necessary to keep wrappers around. As a rule of thumb, inline classes are boxed whenever they are used as another type.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface I

@JvmInline
value class Foo(val i: Int) : I

fun asInline(f: Foo) {}
fun <T> asGeneric(x: T) {}
fun asInterface(i: I) {}
fun asNullable(i: Foo?) {}

fun <T> id(x: T): T = x

fun main() {
    val f = Foo(42) 
    
    asInline(f)    // unboxed: used as Foo itself
    asGeneric(f)   // boxed: used as generic type T
    asInterface(f) // boxed: used as type I
    asNullable(f)  // boxed: used as Foo?, which is different from Foo
    
    // below, 'f' first is boxed (while being passed to 'id') and then unboxed (when returned from 'id') 
    // In the end, 'c' contains unboxed representation (just '42'), as 'f' 
    val c = id(f)  
}
```  

</div>

Because inline classes may be represented both as the underlying value and as a wrapper, [referential equality](equality.html#referential-equality) is pointless for them and is therefore prohibited.

### Mangling

Since inline classes are compiled to their underlying type, it may lead to various obscure errors, for example unexpected platform signature clashes:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@JvmInline
value class UInt(val x: Int)

// Represented as 'public final void compute(int x)' on the JVM
fun compute(x: Int) { }

// Also represented as 'public final void compute(int x)' on the JVM!
fun compute(x: UInt) { }
```

</div>

To mitigate such issues, functions using inline classes are *mangled* by adding some stable hashcode to the function name. Therefore, `fun compute(x: UInt)` will be represented as `public final void compute-<hashcode>(int x)`, which solves the clash problem.

> The mangling scheme has been changed in Kotlin 1.4.30. 
> Use the `-Xuse-14-inline-classes-mangling-scheme` compiler flag to force the compiler to use the old 1.4.0 mangling scheme and preserve binary compatibility.
{:.note}

### Calling from Java code

You can call functions that accept inline classes from Java code. To do so, you should manually disable mangling:
add the `@JvmName` annotation before the function declaration:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

</div>

## Inline classes vs type aliases

At first sight, inline classes may appear to be very similar to [type aliases](type-aliases.html). Indeed, both seem to introduce a new type and both will be represented as the underlying type at runtime.

However, the crucial difference is that type aliases are *assignment-compatible* with their underlying type (and with other type aliases with the same underlying type), while inline classes are not.

In other words, inline classes introduce a truly _new_ type, contrary to type aliases which only introduce an alternative name (alias) for an existing type:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
typealias NameTypeAlias = String

@JvmInline
value class NameInlineClass(val s: String)

fun acceptString(s: String) {}
fun acceptNameTypeAlias(n: NameTypeAlias) {}
fun acceptNameInlineClass(p: NameInlineClass) {}

fun main() {
    val nameAlias: NameTypeAlias = ""
    val nameInlineClass: NameInlineClass = NameInlineClass("")
    val string: String = ""

    acceptString(nameAlias) // OK: pass alias instead of underlying type
    acceptString(nameInlineClass) // Not OK: can't pass inline class instead of underlying type

    // And vice versa:
    acceptNameTypeAlias(string) // OK: pass underlying type instead of alias
    acceptNameInlineClass(string) // Not OK: can't pass underlying type instead of inline class
}
```

</div>


## Enabling inline classes

When using inline classes in Kotlin 1.3+, a warning will be reported, indicating that this feature has not been released as stable.
To remove the warning you have to opt in to the usage of this feature by passing the compiler argument `-Xinline-classes`.

### Gradle

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-lang="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings.enableLanguageFeature('InlineClasses')
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.enableLanguageFeature("InlineClasses")
    }
}
```

</div>
</div>

See [Compiler options in Gradle](using-gradle.html#compiler-options) for details. For [multiplatform projects](mpp-intro.html), 
see [language settings](mpp-dsl-reference.html#language-settings).

### Maven

<div class="sample" markdown="1" theme="idea" mode='xml'>

```xml
<configuration>
    <args>
        <arg>-Xinline-classes</arg> 
    </args>
</configuration>
```

</div>

See [Compiler options in Maven](using-maven.html#specifying-compiler-options) for details.

## Further discussion

See this [language proposal for inline classes](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) for other technical details and discussion.
