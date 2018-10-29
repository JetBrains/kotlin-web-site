---
type: doc
layout: reference
category: "Other"
title: "Type aliases (since 1.1)"
---

## Type aliases

Type aliases provide alternative names for existing types.
If the type name is too long you can introduce a different shorter name and use the new one instead.
 
It's useful to shorten long generic types.
For instance, it's often tempting to shrink collection types:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```
</div>

You can provide different aliases for function types:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```
</div>

You can have new names for inner and nested classes:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
class A {
    inner class Inner
}
class B {
    inner class Inner
}

typealias AInner = A.Inner
typealias BInner = B.Inner
```
</div>

Type aliases do not introduce new types. 
They are equivalent to the corresponding underlying types.
When you add `typealias Predicate<T>` and use `Predicate<Int>` in your code, the Kotlin compiler always expand it to `(Int) -> Boolean`. 
Thus you can pass a variable of your type whenever a general function type is required and vice versa:

<div class="sample" markdown="1" theme="idea">
```kotlin
typealias Predicate<T> = (T) -> Boolean

fun foo(p: Predicate<Int>) = p(42)

fun main() {
    val f: (Int) -> Boolean = { it > 0 }
    println(foo(f)) // prints "true"

    val p: Predicate<Int> = { it > 0 }
    println(listOf(1, -2).filter(p)) // prints "[1]"
}
```
</div>
