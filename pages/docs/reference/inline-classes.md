---
type: doc
layout: reference
category: "Classes and Objects"
title: "Inline classes"
---

# Inline classes

> Inline classes are available only since Kotlin 1.3 and currently are *experimental*. See details [below](#experimental-status-of-inline-classes)
{:.note}

Sometimes it is necessary for business logic to create a wrapper around some type. However, it introduces runtime overhead due to additional heap allocations. Moreover, if wrapped type was primitive, performance hit is terrible, because primitive types usually are heavily optimized by runtime, while their wrappers don't get any special treatment. 

To solve such kind of issues, Kotlin introduces special kind of classes called `inline classes`, which are introduced by placing modifier `inline` before the name of the class:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
inline class Password(val value: String)
```  

</div>

Inline class must have a single property initialized in the primary constructor. At runtime, instances of the inline class will be represented using this single property (see details about runtime representation [below](#representation)):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// No actual instantiation of class 'Password' happens
// At runtime 'securePassword' contains just 'String'
val securePassword = Password("Don't try this in production") 
```

</div>

This is the primary property of inline classes, which inspired name "inline": data of the class is "inlined" into its usages (similar to how content of [inline functions](inline-functions.html) is inlined to call sites)

## Members

Inline classes support some functionality of usual classes. In particular, they are allowed to declare properties and functions:

<div class="sample" markdown="1" theme="idea">

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

</div>

However, there are some restrictions for inline classes members:
* inline class cannot have *init*{: .keyword } block
* inline class cannot have *inner*{: .keyword } classes
* inline class field cannot have [backing fields](properties.html#backing-fields)
    * it follows that inline class can have only simple computable properties (no lateinit/delegated properties)


## Inheritance

Inline classes are allowed to inherit interfaces:

<div class="sample" markdown="1" theme="idea">

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

</div>

It is forbidden for inline classes to participate in classes hierarchy, so inline class can not extend other classes and itself must be *final*{: .keyword }. 

## Representation

In the generated code Kotlin compiler keeps a *wrapper* for each inline class. Inline classes instances can be represented at runtime either as wrappers or underlying type. This is similar to how `Int` can be [represented](basic-types.html#representation) either as primitive `int` or wrapper `Integer`.

Kotlin compiler will prefer using underlying types instead of wrappers to produce most performant and optimized code, but sometimes it is necessary to keep wrappers around. Rule of thumb: inline class is boxed whenever it is used as another type.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
    
    // below, 'f' first is boxed (while passing to 'id') and then unboxed (when returned from 'id') 
    // In the end, 'c' contains unboxed representation (just '42'), as 'f' 
    val c = id(f)  
}
```  

</div>

Because inline classes may be represented both as underlying value and as a wrapper, [referential equality](equality.html#referential-equality) is pointless for them and thus prohibited.

### Mangling

The fact that inline classes are compiled to their underlying type may lead to various obscure errors, for example, unexpected platform signature clashes:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
inline class UInt(val x: Int)

// Represented as 'public final void compute(int x)' at JVM
fun compute(x: Int) { }
// Represented as 'public final void compute(int x)' at JVM too!
fun compute(x: UInt) { }
```

</div>

To mitigate such issues, functions which use inline classes are *mangled* by adding some stable hashcode to the function name. Therefore, actually `fun compute(x: UInt)` will be represented as `public final void compute-<hashcode>(int x)`, therefore solving clash problem.

> Note that `-` is *not valid* symbol in Java, meaning that it is impossible to call functions which accept inline classes from Java.  
{:.note}

## Inline classes vs type aliases

Inline classes may appear very similar to [type aliases](type-aliases.html) from the first glance. Indeed, both appear to introduce new type and both will be represented as the underlying type at runtime. 

However, crucial difference is that type aliases are *assignment-compatible* with their underlying type (and with other type aliases with the same underlying type), while inline classes are not. 

In other words, inline classes introduce _new_ type, contrary to type aliases, which only introduce alternative name (alias) to the existing type:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
    acceptNameTypeAlias("") // OK: pass underlying type instead of alias
    acceptNameInlineClass("") // Not OK: can't pass underlying type instead of inline class
}
```

</div>


## Experimental status of inline classes

The design of inline classes is experimental, meaning that this feature is *moving fast* and no compatibility guarantees are given. When using inline classes in Kotlin 1.3+, warning will be reported, indicating that this feature is experimental. 

To remove warning, you have to opt into usage of experimental feature by passing argument `-XXLanguage:+InlineClasses` to the `kotlinc`.

### Enabling inline classes in Gradle:
<div class="sample" markdown="1" theme="idea" mode='groovy'>

``` groovy

compileKotlin {
    kotlinOptions.freeCompilerArgs += ["-XXLanguage:+InlineClasses"]
}
```

</div>

See [Compiler options in Gradle](using-gradle.html#compiler-options) for details

### Enabling inline classes in Maven

<div class="sample" markdown="1" theme="idea" mode='xml'>

```xml
<configuration>
    <args>
        <arg>-XXLanguage:+InlineClasses</arg> 
    </args>
</configuration>
```

</div>

See [Compiler options in Maven](using-maven.html#specifying-compiler-options) for details

## Further discussion

See [language proposal for inline classes](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) for other technical details and discussion .

