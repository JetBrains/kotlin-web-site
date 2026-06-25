[//]: # (title: Packages and imports)

In a Kotlin project, code is organized using packages and imports:

* A **package** is a container for one or more Kotlin files. Files are linked to a package using a `package` header.
* An **import** is a directive that makes entities from other packages available in the current file.

## Package declarations

A source file may start with a package declaration:

```kotlin
package org.example

fun printMessage() { /*...*/ }
class Message(val text: String) { /*...*/ }
```

All contents of the source file (such as classes and functions) belong to this package.
A declaration's fully qualified name combines the package name with the name of the declaration.
In the example above:

* The fully qualified name of `printMessage()` is `org.example.printMessage`.
* The fully qualified name of `Message` is `org.example.Message`.

If no package is specified, the file's contents belong to the default root package.

## Imports

To use an entity from a file in a different package, use an `import` directive.
Apart from the default imports, each file may declare its own imports.

### Import a single declaration

Import one specific declaration so it can be used without qualification:

```kotlin
import org.example.Message // Message is accessible without qualification

fun main() {
    val message = Message("Hello")
    println(message.text)
}
```

### Import the contents of a scope

Star-imports ending in an asterisk (`*`) import all named entities inside the corresponding scope:

```kotlin
import org.example.* // Everything in 'org.example' is accessible

fun main() {
    printMessage()
    val message = Message("Hi")
}
```

If a name is imported via both a star import and an explicit single import,
the explicit single import takes priority during name resolution.

### Resolve name clashes with aliases

If two imported names clash, use the `as` keyword to locally rename one of them:

```kotlin
import org.example.Message             // Message refers to 'org.example.Message'
import org.test.Message as TestMessage // TestMessage refers to 'org.test.Message'

fun main() {
    val a = Message("from example")
    val b = TestMessage("from test")
}
```

### What you can import

The `import` keyword is not limited to classes. You can import any of the following declarations,
whether they come from a package, a class, an object, or an enum:

* Top-level functions and properties declared directly inside a package:
    ```kotlin
    import org.example.printMessage // Top-level function
    import org.example.VERSION      // Top-level property
    ```
* Functions and properties from [object declarations](object-declarations.md#object-declarations-overview):
    ```kotlin
    import org.example.Config.DEFAULT_TIMEOUT // Property from an object
    import org.example.Config.loadSettings    // Function from an object
    ```
* Members of a [companion object](object-declarations.md#companion-objects), referenced through the enclosing class name:
    ```kotlin
    import org.example.MyClass.create // Refers to MyClass.Companion.create
    ```
* [Enum constants](enum-classes.md):
    ```kotlin
    import org.example.Color.RED
    import org.example.Color.GREEN
    ```
* Nested classes:
    ```kotlin
    import org.example.Outer.Nested
    ```

## Default imports

Kotlin imports several packages into every file by default:

* [kotlin.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/index.html)
* [kotlin.annotation.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.annotation/index.html)
* [kotlin.collections.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/index.html)
* [kotlin.comparisons.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/index.html)
* [kotlin.io.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io/index.html)
* [kotlin.ranges.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.ranges/index.html)
* [kotlin.sequences.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.sequences/index.html)
* [kotlin.text.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/index.html)
* [kotlin.math.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.math/index.html)

Additional packages are imported based on the target platform:

* JVM:
  * [java.lang.*](https://docs.oracle.com/javase/8/docs/api/java/lang/package-summary.html)
  * [kotlin.jvm.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/index.html)

* JS:
  * [kotlin.js.*](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.js/index.html)

## Visibility and imports

The ability to import an entity depends on its [visibility modifiers](visibility-modifiers.md):

* `public` entities can be imported anywhere.
* `internal` entities can be imported only within the same module.
* `protected` entities cannot be imported.
* Top-level `private` entities are only accessible within their declaring file.
* Other `private` entities cannot be imported.