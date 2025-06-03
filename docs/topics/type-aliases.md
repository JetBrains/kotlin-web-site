[//]: # (title: Type aliases)

Type aliases provide alternative names for existing types.
If the type name is too long you can introduce a different shorter name and use the new one instead.
 
It's useful to shorten long generic types.
For instance, it's often tempting to shrink collection types:

```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```

You can provide different aliases for function types:

```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```

You can have new names for inner and nested classes:

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
When you add `typealias Predicate<T>` and use `Predicate<Int>` in your code, the Kotlin compiler always expands it to `(Int) -> Boolean`. 
Thus you can pass a variable of your type whenever a general function type is required and vice versa:

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

## Nested type aliases

<primary-label ref="beta"/>

In Kotlin, you can define type aliases inside other declarations, as long as they
don't capture type parameters from their outer class:

```kotlin
class Dijkstra {
   typealias VisitedNodes = Set<Node>

   private fun step(visited: VisitedNodes, ...) = ...
}
```

Capturing means that the type alias refers to a type parameter defined in the outer class:

```kotlin
class Graph<Node> {
    // Incorrect because captures Node
    typealias Path = List<Node>
}
```

To fix this issue, declare the type parameter directly in the type alias:

```kotlin
class Graph<Node> {
    // Correct because Node is a type alias parameter
    typealias Path<Node> = List<Node>
}
```

Nested type aliases allow for cleaner, more maintainable code by improving encapsulation, reducing package-level clutter,
and simplifying internal implementations.

### Rules for nested type aliases

Nested type aliases follow specific rules to ensure clear and consistent behavior:

* Nested type aliases must follow all existing type alias rules.
* In terms of visibility, the alias can't expose more than its referenced types allow.
* Their scope is the same as [nested classes](nested-classes.md). You can define them inside classes,
  and they hide any parent type aliases with the same name as they don't override.
* Nested type aliases can be marked as `internal` or `private` to limit their visibility.
* When a type alias refers to an `inner class`, Kotlin generates a constructor in the static scope for nested type aliases.
* Nested type aliases are not supported in Kotlin Multiplatform's [`expect/actual` declarations](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html).

### How to enable nested type aliases

To enable nested type aliases in your project, use the following compiler option in the command line:

```bash
-Xnested-type-aliases
```

Or add it to the `compilerOptions {}` block of your Gradle build file:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnested-type-aliases")
    }
}
```


