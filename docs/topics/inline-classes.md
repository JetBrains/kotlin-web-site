[//]: # (title: Inline classes)

> Inline classes are in [Alpha](#alpha-status-of-inline-classes). This feature may change incompatibly in the future and require manual migration. 
> We will appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issues/KT).
>
{type="warning"}

Sometimes it is necessary for business logic to create a wrapper around some type. However, it introduces runtime 
overhead due to additional heap allocations. Moreover, if the wrapped type is primitive, the performance hit is terrible, 
because primitive types are usually heavily optimized by the runtime, while their wrappers don't get any special treatment. 

To solve such issues, Kotlin introduces a special kind of class called an *inline class*, which is declared by placing an 
`inline` modifier before the name of the class:

```kotlin
inline class Password(val value: String)
```

An inline class must have a single property initialized in the primary constructor. At runtime, instances of the inline 
class will be represented using this single property (see details about runtime representation [below](#representation)):

```kotlin
// No actual instantiation of class 'Password' happens
// At runtime 'securePassword' contains just 'String'
val securePassword = Password("Don't try this in production") 
```

This is the main feature of inline classes, which inspired the name *inline*: data of the class is *inlined* into its 
usages (similar to how content of [inline functions](inline-functions.md) is inlined to call sites).

## Members

Inline classes support some functionality of regular classes. In particular, they are allowed to declare properties and 
functions:

```kotlin
inline class Name(val s: String) {
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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

However, there are some restrictions for inline class members:
* Inline classes cannot have `init` blocks.
* Inline class properties cannot have [backing fields](properties.md#backing-fields). They can only have simple computable 
properties (no `lateinit`/delegated properties).

## Inheritance

Inline classes are allowed to inherit from interfaces:

```kotlin
interface Printable {
    fun prettyPrint(): String
}

inline class Name(val s: String) : Printable {
    override fun prettyPrint(): String = "Let's $s!"
}

fun main() {
    val name = Name("Kotlin")
    println(name.prettyPrint()) // Still called as a static method
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

It is forbidden for inline classes to participate in a class hierarchy. This means that inline classes cannot extend 
other classes and must be `final`.

## Representation

In generated code, the Kotlin compiler keeps a *wrapper* for each inline class. Inline class instances can be represented 
at runtime either as wrappers or as the underlying type. This is similar to how `Int` can be 
[represented](basic-types.md#numbers-representation-on-the-jvm) either as a primitive `int` or as the wrapper `Integer`.

The Kotlin compiler will prefer using underlying types instead of wrappers to produce the most performant and optimized code. 
However, sometimes it is necessary to keep wrappers around. As a rule of thumb, inline classes are boxed whenever they 
are used as another type.

```kotlin
interface I

inline class Foo(val i: Int) : I

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

Because inline classes may be represented both as the underlying value and as a wrapper, [referential equality](equality.md#referential-equality) 
is pointless for them and is therefore prohibited.

### Mangling

Since inline classes are compiled to their underlying type, it may lead to various obscure errors, for example unexpected platform signature clashes:

```kotlin
inline class UInt(val x: Int)

// Represented as 'public final void compute(int x)' on the JVM
fun compute(x: Int) { }

// Also represented as 'public final void compute(int x)' on the JVM!
fun compute(x: UInt) { }
```

To mitigate such issues, functions using inline classes are *mangled* by adding some stable hashcode to the function name. 
Therefore, `fun compute(x: UInt)` will be represented as `public final void compute-<hashcode>(int x)`, which solves the clash problem.

> `-` is an *invalid* symbol in Java, meaning that it's not possible to call functions which accept inline classes from Java.
>
{type="note"}

## Inline classes vs type aliases

At first sight, inline classes seem very similar to [type aliases](type-aliases.md). Indeed, both seem to introduce 
a new type and both will be represented as the underlying type at runtime.

However, the crucial difference is that type aliases are *assignment-compatible* with their underlying type (and with 
other type aliases with the same underlying type), while inline classes are not.

In other words, inline classes introduce a truly _new_ type, contrary to type aliases which only introduce an alternative name 
(alias) for an existing type:

```kotlin
typealias NameTypeAlias = String
inline class NameInlineClass(val s: String)

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

## Alpha status of inline classes

The design of inline classes is in [Alpha](components-stability.md), meaning that no compatibility guarantees are given for future versions. 
When using inline classes, a warning will be reported, indicating that this feature has not been released as stable.

To remove the warning you have to opt in to the usage of this feature by passing the compiler argument `-Xinline-classes`.

### Enabling inline classes in Gradle

<tabs>
<tab title="Groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings.enableLanguageFeature('InlineClasses')
    }
}
```

</tab>
<tab title="Kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.enableLanguageFeature("InlineClasses")
    }
}
```

</tab>
</tabs>

See [compiler options in Gradle](gradle.md#compiler-options) for details. For [multiplatform project](mpp-intro.md) settings, 
see [language settings](mpp-dsl-reference.md#language-settings).

### Enabling inline classes in Maven

```xml
<configuration>
    <args>
        <arg>-Xinline-classes</arg> 
    </args>
</configuration>
```

See [compiler options in Maven](maven.md#specifying-compiler-options) for details.

## Further discussion

See this [language proposal for inline classes](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 
for other technical details and discussion.
