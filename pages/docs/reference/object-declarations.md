---
type: doc
layout: reference
category: "Syntax"
title: "Object Expressions and Declarations"
---

# Object Expressions and Declarations

Sometimes we need to create an object of a slight modification of some class, without explicitly declaring a new subclass for it.
Java handles this case with *anonymous inner classes*.
Kotlin slightly generalizes this concept with *object expressions* and *object declarations*.

## Object expressions

To create an object of an anonymous class that inherits from some type (or types), we write:

``` kotlin
window.addMouseListener(object : MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }

  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
})
```

If a supertype has a constructor, appropriate constructor parameters must be passed to it.
Many supertypes may be specified as a comma-separated list after the colon:


``` kotlin
open class A(x: Int) {
  public open val y: Int = x
}

interface B {...}

val ab: A = object : A(1), B {
  override val y = 15
}
```

If, by any chance, we need "just an object", with no nontrivial supertypes, we can simply say:

``` kotlin
val adHoc = object {
  var x: Int = 0
  var y: Int = 0
}
print(adHoc.x + adHoc.y)
```

Just like Java's anonymous inner classes, code in object expressions can access variables from the enclosing scope.
(Unlike Java, this is not restricted to final variables.)

``` kotlin
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

[Singleton](http://en.wikipedia.org/wiki/Singleton_pattern) is a very useful pattern, and Kotlin (after Scala) makes it easy to declare singletons:

``` kotlin
object DataProviderManager {
  fun registerDataProvider(provider: DataProvider) {
    // ...
  }

  val allDataProviders: Collection<DataProvider>
    get() = // ...
}
```
-
This is called an *object declaration*, and it always has a name following the *object*{: .keyword } keyword.
Just like a variable declaration, an object declaration is not an expression, and cannot be used on the right hand side of an assignment statement.

To refer to the object, we use its name directly:

``` kotlin
DataProviderManager.registerDataProvider(...)
```

Such objects can have supertypes:

``` kotlin
object DefaultListener : MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }

  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
}
```

**NOTE**: object declarations can't be local (i.e. be nested directly inside a function), but they can be nested into other object declarations or non-inner classes.


### Companion Objects

An object declaration inside a class can be marked with the *companion*{: .keyword } keyword:

``` kotlin
class MyClass {
  companion object Factory {
    fun create(): MyClass = MyClass()
  }
}
```

Members of the companion object can be called by using simply the class name as the qualifier:

``` kotlin
val instance = MyClass.create()
```

The name of the companion object can be omitted, in which case the name `Companion` will be used:

``` kotlin
class MyClass {
  companion object {
  }
}

val x = MyClass.Companion
```

Note that, even though the members of companion objects look like static members in other languages, at runtime those
are still instance members of real objects, and can, for example, implement interfaces:

``` kotlin
interface Factory<T> {
  fun create(): T
}


class MyClass {
  companion object : Factory<MyClass> {
    override fun create(): MyClass = MyClass()
  }
}
```

However, on the JVM you can have members of companion objects generated as real static methods and fields, if you use
the `@JvmStatic` annotation. See the [Java interoperability](java-to-kotlin-interop.html#static-fields) section
for more details.


### Semantic difference between object expressions and declarations

There is one important semantic difference between object expressions and object declarations:

* object expressions are executed (and initialized) **immediately**, where they are used
* object declarations are initialized **lazily**, when accessed for the first time
* a companion object is initialized when the corresponding class is loaded (resolved), matching the semantics of a Java static initializer


