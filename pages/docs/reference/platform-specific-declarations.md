---
type: doc
layout: reference
category: "Other"
title: "Platform-Specific Declarations"
---

## Platform-Specific Declarations

> Multiplatform projects are an experimental feature in Kotlin 1.2 and 1.3. All of the language
and tooling features described in this document are subject to change in future Kotlin versions.
{:.note}

One of the key capabilities of Kotlin's multiplatform code is a way for common code to
depend on platform-specific declarations. In other languages, this can often be accomplished
by building a set of interfaces in the common code and implementing these interfaces in platform-specific
modules. However, this approach is not ideal in cases when you have a library on one of the platforms
that implements the functionality you need, and you'd like to use the API of this library directly
without extra wrappers. Also, it requires common declarations to be expressed as interfaces, which
doesn't cover all possible cases.

As an alternative, Kotlin provides a mechanism of _expected and actual declarations_.
With this mechanism, a common module can define _expected declarations_, and a platform module
can provide _actual declarations_ corresponding to the expected ones. 
To see how this works, let's look at an example first. This code is part of a common module:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` kotlin
package org.jetbrains.foo

expect class Foo(bar: String) {
    fun frob()
}

fun main(args: Array<String>) {
    Foo("Hello").frob()
}
```
</div>

And this is the corresponding JVM module:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` kotlin
package org.jetbrains.foo

actual class Foo actual constructor(val bar: String) {
    actual fun frob() {
        println("Frobbing the $bar")
    }
}
```
</div>

This illustrates several important points:

  * An expected declaration in the common module and its actual counterparts always
    have exactly the same fully qualified name.
  * An expected declaration is marked with the `expect` keyword; the actual declaration
    is marked with the `actual` keyword.
  * All actual declarations that match any part of an expected declaration need to be marked
    as `actual`.
  * Expected declarations never contain any implementation code.

Note that expected declarations are not restricted to interfaces and interface members.
In this example, the expected class has a constructor and can be created directly from common code.
You can apply the `expect` modifier to other declarations as well, including top-level declarations and
annotations:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` kotlin
// Common
expect fun formatString(source: String, vararg args: Any): String

expect annotation class Test

// JVM
actual fun formatString(source: String, vararg args: Any) =
    String.format(source, args)
    
actual typealias Test = org.junit.Test
```
</div>

The compiler ensures that every expected declaration has actual declarations in all platform
modules that implement the corresponding common module, and reports an error if any actual declarations are 
missing. The IDE provides tools that help you create the missing actual declarations.

If you have a platform-specific library that you want to use in common code while providing your own
implementation for another platform, you can provide a typealias to an existing class as the actual
declaration:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` kotlin
expect class AtomicRef<V>(value: V) {
  fun get(): V
  fun set(value: V)
  fun getAndSet(value: V): V
  fun compareAndSet(expect: V, update: V): Boolean
}

actual typealias AtomicRef<V> = java.util.concurrent.atomic.AtomicReference<V>
```
</div>