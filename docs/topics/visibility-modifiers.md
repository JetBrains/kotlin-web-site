[//]: # (title: Visibility modifiers)

Classes, objects, interfaces, constructors, and functions, as well as properties and their setters, can have *visibility modifiers*.
Getters always have the same visibility as their properties.

There are four visibility modifiers in Kotlin: `private`, `protected`, `internal`, and `public`.
The default visibility is `public`.

On this page, you'll learn how the modifiers apply to different types of declaring scopes.

## Packages

Functions, properties, classes, objects, and interfaces can be declared at the "top-level" directly inside a package:

```kotlin
// file name: example.kt
package foo

fun baz() { ... }
class Bar { ... }
```

* If you don’t use a visibility modifier, `public` is used by default, which means that your declarations will be
  visible everywhere.
* If you mark a declaration as `private`, it will only be visible inside the file that contains the declaration.
* If you mark it as `internal`, it will be visible everywhere in the same [module](#modules).
* The `protected` modifier is not available for top-level declarations.

>To use a visible top-level declaration from another package, you should [import](packages.md#imports) it.
>
{type="note"}

Examples:

```kotlin
// file name: example.kt
package foo

private fun foo() { ... } // visible inside example.kt

public var bar: Int = 5 // property is visible everywhere
    private set         // setter is visible only in example.kt
    
internal val baz = 6    // visible inside the same module
```

## Class members

For members declared inside a class:

* `private` means that the member is visible inside this class only (including all its members).
* `protected` means that the member has the same visibility as one marked as `private`, but that it is also visible in subclasses.
* `internal` means that any client *inside this module* who sees the declaring class sees its `internal` members.
* `public` means that any client who sees the declaring class sees its `public` members.

> In Kotlin, an outer class does not see private members of its inner classes.
>
{type="note"}

If you override a `protected` or an `internal` member and do not specify the visibility explicitly, the overriding member
will also have the same visibility as the original.

Examples:

```kotlin
open class Outer {
    private val a = 1
    protected open val b = 2
    internal open val c = 3
    val d = 4  // public by default
    
    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a is not visible
    // b, c and d are visible
    // Nested and e are visible

    override val b = 5   // 'b' is protected
    override val c = 7   // 'c' is internal
}

class Unrelated(o: Outer) {
    // o.a, o.b are not visible
    // o.c and o.d are visible (same module)
    // Outer.Nested is not visible, and Nested::e is not visible either 
}
```

### Constructors

Use the following syntax to specify the visibility of the primary constructor of a class:

> You need to add an explicit `constructor` keyword.
>
{type="note"}

```kotlin
class C private constructor(a: Int) { ... }
```

Here the constructor is private. By default, all constructors are `public`, which effectively
amounts to them being visible everywhere the class is visible (this means that a constructor of an `internal` class is only
visible within the same module).

### Local declarations

Local variables, functions, and classes can't have visibility modifiers.

## Modules

The `internal` visibility modifier means that the member is visible within the same module. More specifically,
a module is a set of Kotlin files compiled together, for example:

* An IntelliJ IDEA module.
* A Maven project.
* A Gradle source set (with the exception that the `test` source set can access the internal declarations of `main`).
* A set of files compiled with one invocation of the `<kotlinc>` Ant task.

