[//]: # (title: Object expressions and declarations)

Sometimes you need to create an object that is a slight modification of some class, without explicitly declaring a new
subclass for it. Kotlin can handle this with _object expressions_ and _object declarations_.

## Object expressions

_Object expressions_ create objects of anonymous classes, that is, classes that aren't explicitly declared with the `class`
declaration. Such classes are useful for one-time use. You can define them from scratch, inherit from existing classes,
or implement interfaces. Instances of anonymous classes are also called _anonymous objects_ because they are defined by
an expression, not a name.

### Creating anonymous objects from scratch

Object expressions start with the `object` keyword.

If you just need an object that doesn’t have any nontrivial supertypes, write its members in curly braces after `object`:

```kotlin

fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // object expressions extend Any, so `override` is required on `toString()`
        override fun toString() = "$hello $world"
    }
//sampleEnd
    print(helloWorld)
}
```
{kotlin-runnable="true"}

### Inheriting anonymous objects from supertypes

To create an object of an anonymous class that inherits from some type (or types), specify this type after `object` and a
colon (`:`). Then implement or override the members of this class as if you were [inheriting](inheritance.md) from it:

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

If a supertype has a constructor, pass appropriate constructor parameters to it.
Multiple supertypes can be specified as a comma-delimited list after the colon:

```kotlin
open class A(x: Int) {
    public open val y: Int = x
}

interface B { /*...*/ }

val ab: A = object : A(1), B {
    override val y = 15
}
```

### Using anonymous objects as return and value types

When an anonymous object is used as a type of a local or [private](visibility-modifiers.md#packages) but not [inline](inline-functions.md)
declaration (function or property), all its members are accessible via this function or property:

```kotlin
class C {
    private fun getObject() = object {
        val x: String = "x"
    }

    fun printX() {
        println(getObject().x)
    }
}
```

If this function or property is public or private inline, its actual type is:
* `Any` if the anonymous object doesn't have a declared supertype
* The declared supertype of the anonymous object, if there is exactly one such type
* The explicitly declared type if there is more than one declared supertype

In all these cases, members added in the anonymous object are not accessible. Overridden members are accessible if they
are declared in the actual type of the function or property:

```kotlin
interface A {
    fun funFromA() {}
}
interface B

class C {
    // The return type is Any. x is not accessible
    fun getObject() = object {
        val x: String = "x"
    }

    // The return type is A; x is not accessible
    fun getObjectA() = object: A {
        override fun funFromA() {}
        val x: String = "x"
    }

    // The return type is B; funFromA() and x are not accessible
    fun getObjectB(): B = object: A, B { // explicit return type is required
        override fun funFromA() {}
        val x: String = "x"
    }
}
```

### Accessing variables from anonymous objects

The code in object expressions can access variables from the enclosing scope:

```kotlin
fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // ...
}
```

## Object declarations
{id="object-declarations-overview"}

The [Singleton](https://en.wikipedia.org/wiki/Singleton_pattern) pattern can be useful in several cases,
and Kotlin makes it easy to declare singletons:

```kotlin
object DataProviderManager {
    fun registerDataProvider(provider: DataProvider) {
        // ...
    }

    val allDataProviders: Collection<DataProvider>
        get() = // ...
}
```

This is called an _object declaration_, and it always has a name following the `object` keyword.
Just like a variable declaration, an object declaration is not an expression, and it cannot be used on the right-hand side
of an assignment statement.

The initialization of an object declaration is thread-safe and done on first access.

To refer to the object, use its name directly:

```kotlin
DataProviderManager.registerDataProvider(...)
```

Such objects can have supertypes:

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

> Object declarations can't be local (that is, they can't be nested directly inside a function), but they can be nested
> into other object declarations or non-inner classes.
>
{type="note"}

### Companion objects

An object declaration inside a class can be marked with the `companion` keyword:

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

Members of the companion object can be called simply by using the class name as the qualifier:

```kotlin
val instance = MyClass.create()
```

The name of the companion object can be omitted, in which case the name `Companion` will be used:

```kotlin
class MyClass {
    companion object { }
}

val x = MyClass.Companion
```

Class members can access the private fields of the corresponding companion object.

The name of a class used by itself (not as a qualifier to another name) acts as a reference to the companion
object of the class (whether named or not):

```kotlin
class MyClass1 {
    companion object Named { }
}

val x = MyClass1

class MyClass2 {
    companion object { }
}

val y = MyClass2
```

Note that even though the members of companion objects look like static members in other languages, at runtime those
are still instance members of real objects, and can, for example, implement interfaces:

```kotlin
interface Factory<T> {
    fun create(): T
}

class MyClass {
    companion object : Factory<MyClass> {
        override fun create(): MyClass = MyClass()
    }
}

val f: Factory<MyClass> = MyClass
```

However, on the JVM you can have members of companion objects generated as real static methods and fields if you use
the `@JvmStatic` annotation. See the [Java interoperability](java-to-kotlin-interop.md#static-fields) section
for more detail.

### Semantic difference between object expressions and declarations

There is one important semantic difference between object expressions and object declarations:

* Object expressions are executed (and initialized) _immediately_, where they are used.
* Object declarations are initialized _lazily_, when accessed for the first time.
* A companion object is initialized when the corresponding class is loaded (resolved) that matches the semantics of a Java
  static initializer.
