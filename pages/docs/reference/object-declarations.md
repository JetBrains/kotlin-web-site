---
type: doc
layout: reference
category: "Syntax"
title: "Object Expressions, Object Declarations and Companion Objects"
---

# Object Expressions and Declarations

Sometimes we need to create an object of a slight modification of some class, without explicitly declaring a new subclass for it.
Kotlin handles this case with *object expressions* and *object declarations*.

## Object expressions

To create an object of an anonymous class that inherits from some type (or types), we write:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```
</div>

If a supertype has a constructor, appropriate constructor parameters must be passed to it.
Many supertypes may be specified as a comma-separated list after the colon:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class A(x: Int) {
    public open val y: Int = x
}

interface B { /*...*/ }

val ab: A = object : A(1), B {
    override val y = 15
}
```
</div>

If, by any chance, we need "just an object", with no nontrivial supertypes, we can simply say:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun foo() {
    val adHoc = object {
        var x: Int = 0
        var y: Int = 0
    }
    print(adHoc.x + adHoc.y)
}
```
</div>

Note that anonymous objects can be used as types only in local and private declarations. If you use an anonymous object as a
return type of a public function or the type of a public property, the actual type of that function or property
will be the declared supertype of the anonymous object, or `Any` if you didn't declare any supertype. Members added
in the anonymous object will not be accessible.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class C {
    // Private function, so the return type is the anonymous object type
    private fun foo() = object {
        val x: String = "x"
    }

    // Public function, so the return type is Any
    fun publicFoo() = object {
        val x: String = "x"
    }

    fun bar() {
        val x1 = foo().x        // Works
        val x2 = publicFoo().x  // ERROR: Unresolved reference 'x'
    }
}
```
</div>

The code in object expressions can access variables from the enclosing scope.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>

## Object declarations

[Singleton](http://en.wikipedia.org/wiki/Singleton_pattern) may be useful in several cases,
and Kotlin (after Scala) makes it easy to declare singletons:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
object DataProviderManager {
    fun registerDataProvider(provider: DataProvider) {
        // ...
    }

    val allDataProviders: Collection<DataProvider>
        get() = // ...
}
```
</div>

This is called an *object declaration*, and it always has a name following the *object*{: .keyword } keyword.
Just like a variable declaration, an object declaration is not an expression, and cannot be used on the right hand side of an assignment statement.

Object declaration's initialization is thread-safe and done at first access.

To refer to the object, we use its name directly:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
DataProviderManager.registerDataProvider(...)
```
</div>

Such objects can have supertypes:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```
</div>

**NOTE**: object declarations can't be local (i.e. be nested directly inside a function), but they can be nested into other object declarations or non-inner classes.


### Companion Objects

An object declaration inside a class can be marked with the *companion*{: .keyword } keyword:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```
</div>

Members of the companion object can be called by using simply the class name as the qualifier:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val instance = MyClass.create()
```
</div>

The name of the companion object can be omitted, in which case the name `Companion` will be used:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class MyClass {
    companion object { }
}

val x = MyClass.Companion
```
</div>

The name of a class used by itself (not as a qualifier to another name) acts as a reference to the companion
object of the class (whether named or not):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>

Note that, even though the members of companion objects look like static members in other languages, at runtime those
are still instance members of real objects, and can, for example, implement interfaces:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>

However, on the JVM you can have members of companion objects generated as real static methods and fields, if you use
the `@JvmStatic` annotation. See the [Java interoperability](java-to-kotlin-interop.html#static-fields) section
for more details.


### Semantic difference between object expressions and declarations

There is one important semantic difference between object expressions and object declarations:

* object expressions are executed (and initialized) **immediately**, where they are used;
* object declarations are initialized **lazily**, when accessed for the first time;
* a companion object is initialized when the corresponding class is loaded (resolved), matching the semantics of a Java static initializer.
