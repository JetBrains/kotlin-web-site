---
type: doc
layout: reference
category: "Java Interop"
title: "Calling Kotlin from Java"
---

# Calling Kotlin from Java

Kotlin code can be called from Java easily.

## Properties

Property getters are turned into *get*-methods, and setters – into *set*-methods.

## Package-Level Functions

All the functions and properties declared in a file `example.kt` inside a package `org.foo.bar` are put into a Java
class named `org.foo.bar.ExampleKt`.

``` kotlin
// example.kt
package demo

class Foo

fun bar() {
}

```

``` java
// Java
new demo.Foo();
demo.ExampleKt.bar();
```

The name of the generated Java class can be changed using the `@JvmName` annotation:

``` kotlin
@file:JvmName("DemoUtils")

package demo

class Foo

fun bar() {
}

```

``` java
// Java
new demo.Foo();
demo.DemoUtils.bar();
```

Having multiple files which have the same generated Java class name (the same package and the same name or the same
@JvmName annotation) is normally an error. However, the compiler has the ability to generate a single Java facade
class which has the specified name and contains all the declarations from all the files which have that name.
To enable the generation of such a facade, use the @JvmMultifileClass annotation in all of the files.

``` kotlin
// oldutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package demo

fun foo() {
}
```

``` kotlin
// newutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package demo

fun bar() {
}
```

``` java
// Java
demo.Utils.foo();
demo.Utils.bar();
```

## Instance Fields

If you need to expose a Kotlin property as a field in Java, you need to annotate it with the `@JvmField` annotation.
The field will have the same visibility as the underlying property. You can annotate a property with `@JvmField`
if it has a backing field, is not private, does not have `open`, `override` or `const` modifiers, and is not a delegated property.

``` kotlin
class C(id: String) {
    @JvmField val ID = id
}
```

``` java
// Java
class JavaClient {
    public String getID(C c) {
        return c.ID;
    }
}
```

[Late-Initialized](properties.html#late-initialized-properties) properties are also exposed as fields. 
The visibility of the field will be the same as the visibility of `lateinit` property setter.

## Static Fields

Kotlin properties declared in a named object or a companion object will have static backing fields
either in that named object or in the class containing the companion object.

Usually these fields are private but they can be exposed in one of the following ways:

 - `@JvmField` annotation;
 - `lateinit` modifier;
 - `const` modifier.
 
Annotating such a property with `@JvmField` makes it a static field with the same visibility as the property itself.

``` kotlin
class Key(val value: Int) {
    companion object {
        @JvmField
        val COMPARATOR: Comparator<Key> = compareBy<Key> { it.value }
    }
}
```

``` java
// Java
Key.COMPARATOR.compare(key1, key2);
// public static final field in Key class
```

A [late-initialized](properties.html#late-initialized-properties) property in an object or a companion object
has a static backing field with the same visibility as the property setter.

``` kotlin
object Singleton {
    lateinit var provider: Provider
}
```

``` java
// Java
Singleton.provider = new Provider();
// public static non-final field in Singleton class
```

Properties annotated with `const` (in classes as well as at the top level) are turned into static fields in Java:

``` kotlin
// file example.kt

object Obj {
  const val CONST = 1
}

class C {
    companion object {
        const val VERSION = 9
    }
}

const val MAX = 239
```

In Java:

``` java
int c = Obj.CONST;
int d = ExampleKt.MAX;
int v = C.VERSION;
```

## Static Methods

As mentioned above, Kotlin generates static methods for package-level functions.
Kotlin can also generate static methods for functions defined in named objects or companion objects if you annotate those functions as `@JvmStatic`.
For example:

``` kotlin
class C {
  companion object {
    @JvmStatic fun foo() {}
    fun bar() {}
  }
}
```

Now, `foo()` is static in Java, while `bar()` is not:

``` java
C.foo(); // works fine
C.bar(); // error: not a static method
```

Same for named objects:

``` kotlin
object Obj {
    @JvmStatic fun foo() {}
    fun bar() {}
}
```

In Java:

``` java
Obj.foo(); // works fine
Obj.bar(); // error
Obj.INSTANCE.bar(); // works, a call through the singleton instance
Obj.INSTANCE.foo(); // works too
```

`@JvmStatic` annotation can also be applied on a property of an object or a companion object
making its getter and setter methods be static members in that object or the class containing the companion object.


## KClass

Sometimes you need to call a Kotlin method with a parameter of type `KClass`.
There is no automatic conversion from `Class` to `KClass`, so you have to do it manually by invoking the equivalent of
the `Class<T>.kotlin` extension property:

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```


## Handling signature clashes with @JvmName

Sometimes we have a named function in Kotlin, for which we need a different JVM name the byte code.
The most prominent example happens due to *type erasure*:

``` kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

These two functions can not be defined side-by-side, because their JVM signatures are the same: `filterValid(Ljava/util/List;)Ljava/util/List;`.
If we really want them to have the same name in Kotlin, we can annotate one (or both) of them with `@JvmName` and specify a different name as an argument:

``` kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

From Kotlin they will be accessible by the same name `filterValid`, but from Java it will be `filterValid` and `filterValidInt`.

The same trick applies when we need to have a property `x` alongside with a function `getX()`:

``` kotlin
val x: Int
  @JvmName("getX_prop")
  get() = 15

fun getX() = 10
```


## Overloads Generation

Normally, if you write a Kotlin method with default parameter values, it will be visible in Java only as a full
signature, with all parameters present. If you wish to expose multiple overloads to Java callers, you can use the
@JvmOverloads annotation.

``` kotlin
@JvmOverloads fun f(a: String, b: Int = 0, c: String = "abc") {
    ...
}
```

For every parameter with a default value, this will generate one additional overload, which has this parameter and
all parameters to the right of it in the parameter list removed. In this example, the following methods will be
generated:

``` java
// Java
void f(String a, int b, String c) { }
void f(String a, int b) { }
void f(String a) { }
```

The annotation also works for constructors, static methods etc. It can't be used on abstract methods, including methods
defined in interfaces.

Note that, as described in [Secondary Constructors](classes.html#secondary-constructors), if a class has default
values for all constructor parameters, a public no-argument constructor will be generated for it. This works even
if the @JvmOverloads annotation is not specified.


## Checked Exceptions

As we mentioned above, Kotlin does not have checked exceptions.
So, normally, the Java signatures of Kotlin functions do not declare exceptions thrown.
Thus if we have a function in Kotlin like this:

``` kotlin
// example.kt
package demo

fun foo() {
  throw IOException()
}
```

And we want to call it from Java and catch the exception:

``` java
// Java
try {
  demo.Example.foo();
}
catch (IOException e) { // error: foo() does not declare IOException in the throws list
  // ...
}
```

we get an error message from the Java compiler, because `foo()` does not declare `IOException`.
To work around this problem, use the `@Throws` annotation in Kotlin:

``` kotlin
@Throws(IOException::class)
fun foo() {
    throw IOException()
}
```

## Null-safety

When calling Kotlin functions from Java, nobody prevents us from passing *null*{: .keyword } as a non-null parameter.
That's why Kotlin generates runtime checks for all public functions that expect non-nulls.
This way we get a `NullPointerException` in the Java code immediately.

## Variant generics

When Kotlin classes make use of [declaration-site variance](generics.html#declaration-site-variance), there are two 
options of how their usages are seen from the Java code. Let's say we have the following class and two functions that use it:

``` kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

A naive way of translating these functions into Java would be this:
 
``` java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
``` 

The problem is that in Kotlin we can say `unboxBase(boxDerived("s"))`, but in Java that would be impossible, because in Java 
  the class `Box` is *invariant* in its parameter `T`, and thus `Box<Derived>` is not a subtype of `Box<Base>`. 
  To make it work in Java we'd have to define `unboxBase` as follows:
  
``` java
Base unboxBase(Box<? extends Base> box) { ... }  
```  

Here we make use of Java's *wildcards types* (`? extends Base`) to emulate declaration-site variance through use-site 
variance, because it is all Java has.

To make Kotlin APIs work in Java we generate `Box<Super>` as `Box<? extends Super>` for covariantly defined `Box` 
(or `Foo<? super Bar>` for contravariantly defined `Foo`) when it appears *as a parameter*. When it's a return value,
we don't generate wildcards, because otherwise Java clients will have to deal with them (and it's against the common 
Java coding style). Therefore, the functions from our example are actually translated as follows:
  
``` java
// return type - no wildcards
Box<Derived> boxDerived(Derived value) { ... }
 
// parameter - wildcards 
Base unboxBase(Box<? extends Base> box) { ... }
```

NOTE: when the argument type is final, there's usually no point in generating the wildcard, so `Box<String>` is always
  `Box<String>`, no matter what position it takes.

If we need wildcards where they are not generated by default, we can use the `@JvmWildcard` annotation:

``` kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// is translated to 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

On the other hand, if we don't need wildcards where they are generated, we can use `@JvmSuppressWildcards`:

``` kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// is translated to 
// Base unboxBase(Box<Base> box) { ... }
```

NOTE: `@JvmSuppressWildcards` can be used not only on individual type arguments, but on entire declarations, such as 
functions or classes, causing all wildcards inside them to be suppressed.

### Translation of type Nothing
 
The type `Nothing` is special, because it has no natural counterpart in Java. Indeed, every Java reference type, including
`java.lang.Void`, accepts `null` as a value, and `Nothing` doesn't accept even that. So, this type cannot be accurately
represented in the Java world. This is why Kotlin generates a raw type where an argument of type `Nothing` is used:

``` kotlin
fun emptyList(): List<Nothing> = listOf()
// is translated to
// List emptyList() { ... }
```