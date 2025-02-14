[//]: # (title: Type aliases)

Type aliases provide alternative names for existing types.
If the type name is too long, you can introduce a different shorter name and use the new one instead.

For example, you can create shorter names for collection types:

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

You can also provide different aliases for function types:

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

Or, you can have new names for nested and inner classes:

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

Type aliases do not introduce new types.
They are equivalent to the corresponding underlying types.
For example, if you declare `typealias Predicate<T> = (T) -> Boolean` and use `Predicate<Int>` in your code, the Kotlin compiler expands the type to `(Int) -> Boolean`.
This means you can pass a variable of type `Predicate<Int>` whenever `(Int) -> Boolean` is required and vice versa:

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
{kotlin-runnable="true"}

