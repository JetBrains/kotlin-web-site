[//]: # (title: Inline classes)

Sometimes it is necessary for business logic to create a wrapper around some type. However, it introduces runtime 
overhead due to additional heap allocations. Moreover, if the wrapped type is primitive, the performance hit is terrible, 
because primitive types are usually heavily optimized by the runtime, while their wrappers don't get any special treatment. 

To solve such issues, Kotlin introduces a special kind of class called an _inline class_. 
Inline classes are a subset of [value-based classes](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md). They don't have an identity and can only hold values.

To declare an inline class, use a `value` modifier before the name of the class:

```kotlin
value class Password(private val s: String)
```

To declare an inline class for the JVM backend, use the `value` modifier along with the `@JvmInline` annotation before the class declaration: 

```kotlin
// For JVM backends
@JvmInline
value class Password(private val s: String)
```

> The `inline` modifier is deprecated with the `WARNING` level.
> 
{type="warning"}

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
functions, and have the `init` block:

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

Inline class properties cannot have [backing fields](properties.md#backing-fields). They can only have simple computable 
properties (no `lateinit`/delegated properties).

## Inheritance

Inline classes are allowed to inherit from interfaces:

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

Because inline classes may be represented both as the underlying value and as a wrapper, [referential equality](equality.md#referential-equality) 
is pointless for them and is therefore prohibited.

### Mangling

Since inline classes are compiled to their underlying type, it may lead to various obscure errors, for example unexpected platform signature clashes:

```kotlin
@JvmInline
value class UInt(val x: Int)

// Represented as 'public final void compute(int x)' on the JVM
fun compute(x: Int) { }

// Also represented as 'public final void compute(int x)' on the JVM!
fun compute(x: UInt) { }
```

To mitigate such issues, functions using inline classes are *mangled* by adding some stable hashcode to the function name. 
Therefore, `fun compute(x: UInt)` will be represented as `public final void compute-<hashcode>(int x)`, which solves the clash problem.

> The mangling scheme has been changed in Kotlin 1.4.30. 
> Use the `-Xuse-14-inline-classes-mangling-scheme` compiler flag to force the compiler to use the old 1.4.0 mangling scheme and preserve binary compatibility.
>
{type="note"}

### Calling from Java code

You can call functions that accept inline classes from Java code. To do so, you should manually disable mangling:
add the `@JvmName` annotation before the function declaration:

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

## Inline classes vs type aliases

At first sight, inline classes seem very similar to [type aliases](type-aliases.md). Indeed, both seem to introduce 
a new type and both will be represented as the underlying type at runtime.

However, the crucial difference is that type aliases are *assignment-compatible* with their underlying type (and with 
other type aliases with the same underlying type), while inline classes are not.

In other words, inline classes introduce a truly _new_ type, contrary to type aliases which only introduce an alternative name 
(alias) for an existing type:

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