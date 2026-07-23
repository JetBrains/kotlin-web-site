[//]: # (title: Type aliases)

Type aliases provide alternative names for existing types. They can make long or frequently used type expressions shorter
and easier to understand.

For example, you can create aliases for generic types, function types, and nested or inner classes:

```kotlin
// Generic types
typealias UserIndex = Map<Long, User>
typealias FileTable<K> = MutableMap<K, MutableList<File>>

// Function types
typealias RequestHandler = (Request) -> Response
typealias Predicate<T> = (T) -> Boolean

// Inner and nested classes
class Database {
    inner class Transaction
}
typealias DatabaseTransaction = Database.Transaction
```

A type alias doesn't create a new type. It introduces an alternative name for an existing type. The alias and its underlying
type are interchangeable. For example, when you add `typealias Predicate<T>` and use `Predicate<Int>`, the compiler
expands it to `(Int) -> Boolean`. You can use a value declared with the alias wherever the underlying type is expected, and
the other way around:

```kotlin
typealias Predicate<T> = (T) -> Boolean

fun evaluate(predicate: Predicate<Int>) = predicate(42)

fun main() {
    val isPositive: (Int) -> Boolean = { it > 0 }
    println(evaluate(isPositive))
    // true

    val isValid: Predicate<Int> = { it > 0 }
    println(listOf(1, -2).filter(isValid))
    // [1]
}
```
{kotlin-runnable="true"}

## Declare type aliases

You can declare a type alias:

* At the top level of a Kotlin file (top-level type aliases).
* Inside a class, interface, or object (nested type aliases).

You can't declare a type alias in a local scope, such as inside a function or [lambda expression](lambdas.md#lambda-expressions-and-anonymous-functions).

The declaration location determines the scope of a type alias, while its visibility determines which code can access it.
By default, a type alias is `public`. The effective accessibility of a type alias depends on its visibility and the accessibility
of its containing declarations. For example, a `public` alias inside an `internal` class isn't accessible from outside
the module.

A type alias can't expose a type with more restrictive [visibility](visibility-modifiers.md) than its own. For example, a `public` type alias can't
refer to a `private` class.

### Top-level type aliases

A top-level type alias is a package-level declaration. Within the same package, you can refer to an alias by its unqualified name.
To use the alias from another package, import the alias or refer to it by its qualified name:

```kotlin
// UserId.kt
package org.example.users

typealias UserId = Long

fun createUser(id: UserId) {
    // UserId is used by its unqualified name
}

// UserService.kt
package org.example.services

import org.example.users.UserId

fun findUser(id: UserId) {
    // UserId is available by its unqualified name
}

fun deleteUser(id: org.example.users.UserId) {
    // UserId is referenced by its fully qualified name
}
```

### Nested type aliases

Nested type aliases allow for cleaner, more maintainable code by improving encapsulation, reducing package-level clutter,
and simplifying internal implementations. Nested type aliases follow the same scope and name-resolution rules as [nested classes](nested-classes.md).

Declare a type alias inside a class, interface, or object when the alternative name is relevant only in the context of
that declaration. This keeps the alias close to the code that uses it and avoids adding another name to the package scope.

Within the containing declaration, you can refer to the alias by its unqualified name. Outside the declaration, qualify
the alias with the name of its containing declaration:

```kotlin
class UserRepository {
    typealias UserIndex = Map<UserId, User>

    // Refers to the alias by its unqualified name inside UserRepository
    fun saveAll(users: UserIndex) {
        // ...
    }
}

// Refers to the alias by its qualified name outside UserRepository
fun synchronizeUsers(users: UserRepository.UserIndex) {
  // ...
}
```

> Nested type aliases aren't supported in Kotlin Multiplatform [`expect/actual` declarations](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html).
>
{style="note"}

#### Type parameters

To use type parameters in a nested type alias, add them to the alias declaration:

```
class Graph<Node> {
    typealias Path<T> = List<T>
}

val cityPath: Graph.Path<String> = listOf("London", "Berlin")
```

In this example, `Path` declares its type parameter `T`. In `Graph.Path<String>`, `String` is the type argument for `T`
and is independent of the `Node` type parameter declared by `Graph`.

If you refer to a type parameter declared by its containing class or interface, the compiler reports an error:

```
class Graph<Node> {
    typealias Path = List<Node>
    // Unresolved reference 'Node'.
}
```

Here, `Path` refers to `Node` from `Graph` instead of declaring its own type parameter.