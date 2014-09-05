---
type: doc
layout: reference
category: "Interop"
title: "Java Interop"
---

# Java Interop

Kotlin is designed with Java Interoperability in mind. Existing Java code can be called from Kotlin in a natural way, and Kotlin code can be used from
Java rather smoothly as well. In this section we describe some details about calling Java code from Kotlin.

## Calling Java code from Kotlin

Pretty much all Java code can be used without any issues

``` kotlin
import java.util.*

fun demo(source : List<Int>) {
  val list = ArrayList<Int>()
  // 'for'-loops work for Java collections:
  for (item in source)
    list.add(item)
  // Operator conventions work as well:
  for (i in 0..source.size() - 1)
    list[i] = source[i] // get and set are called
}
```

### Methods returning void

If a Java method returns void, it will return Unit when called from Kotlin. 
If, by any chance, someone uses that return value, it will be assigned at the call site by the Kotlin compiler, since the value itself is known in advance (being `Unit`).

### Escaping for Java identifiers that are keywords in Kotlin

Some of the Kotlin keywords are valid identifiers in Java: in, object, is, etc. If a Java library uses a Kotlin keyword for a method, you can still call the method
escaping it with the backtick (`) character

``` kotlin
foo.`is`(bar)
```

### Null-Safety

Any reference in Java may be null. As such, all the Java methods called from Kotlin return nullable references (except for those annotated with `@NotNull`).
This allows Kotlin to keep the guarantee of having no `NullPointerExceptions` unless they are explicitly thrown by Kotlin code or caused by something
inside Java code called from Kotlin.

Consider the following examples:

``` kotlin
val list = ArrayList<Int>() // non-null (constructor result)
val size = list.size() // non-null (primitive int)
val iterator = list.iterator() // nullable (ordinary method)
```

### Checked Exceptions

In Kotlin, all exceptions are unchecked, meaning that the compiler does not force you to catch any of them. 
So, when you call a Java method that declares a checked exception, Kotlin does not force you to do anything:

``` kotlin
fun render(list : List<out Any?>, to : Appendable) {
  for (item in list)
    to.append(item.toString()) // Java would require us to catch IOException here
}
```

### Java generics in Kotlin

Kotlin's generics are a little different from Java's (see [Generics](generics.html)). When importing Java types to Kotlin we perform some conversions:

* Java's wildcards are converted into type projections
  * `Foo<? extends Bar>` becomes `Foo<out Bar>`
  * `Foo<? super Bar>` becomes `Foo<in Bar>`

* Java's raw types are converted into star projections
  * List becomes `List<*>`, i.e. `List<out Any?>`

Like Java's, Kotlin's generics are not retained at runtime, i.e. objects do not carry information about actual type arguments passed to their constructors, 
i.e. `ArrayList<Integer>()` is indistinguishable from `ArrayList<Character>()`. This makes it impossible to perform `is`-checks that take generics into account. 
Kotlin only allows `is`-checks for star-projected generic types:

``` kotlin
if (a is List<Int>) // Error: cannot check if it is really a List of Ints
// but
if (a is List<*>) // OK: no guarantees about the contents of the list
```

### Invariant Arrays

Arrays in Kotlin are invariant, unlike Java. This means that Kotlin does not let us assign an `Array<String>` to an `Array<Any>`, 
which prevents a possible runtime failure. Neither does it allow us to pass an array of a subclass as an array of superclass to a Java method. 
In most cases, this should not be a major obstacle, but if one really needs to pass an array in a covariant way, they may cast explicitly.

Arrays are used with primitive datatypes on the Java platform to avoid the cost of boxing/unboxing operations. 
As Kotlin hides those implementation details, a workaround is required to interface with Java code. 
There are specialized classes for every type of primitive array (`IntArray`, `DoubleArray`, `CharArray`, and so on) to handle this case. 
They are not related to the `Array` class and are compiled down to Java's primitive arrays for maximum performance.

Suppose there is a Java method that accepts an int array of indices:

``` java
public class JavaArrayExample {

    public void removeIndices(int[] indices) {
        // code here...
    }
}
```

To pass an array of primitive values you can do the following in Kotlin:

``` kotlin
val javaObj = JavaArrayExample()
val array = intArray(0, 1, 2, 3)
javaObj.removeIndices(array)  // passes int[] to method
```

Java classes sometimes use a method declaration for the indices with a variable number of arguments (varargs). 

``` java
public class JavaArrayExample {

    public void removeIndices(int... indices) {
        // code here...
    }
}
```

In that case you need to use the spread operator `*` to pass the `IntArray`:

``` kotlin
val javaObj = JavaArray()
val array = intArray(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

It's currently not possible to pass null to a method that is declared as varargs.

### Mapped types

Kotlin treats some Java types specially. Such types are not loaded from Java "as is", but are _mapped_ to corresponding Kotlin types.
The mapping only matters at compile time, the runtime representation remains unchanged.
 Java's primitive types are mapped to corresponding Kotlin classes:

| **Java type** | **Kotlin type**  |
|---------------|------------------|
| `byte`        | `kotlin.Byte`    |
| `short`       | `kotlin.Short`   |
| `int`         | `kotlin.Int`     |
| `long`        | `kotlin.Long`    |
| `char`        | `kotlin.Char`    |
| `float`       | `kotlin.Float`   |
| `double`      | `kotlin.Double`  |
| `boolean`     | `kotlin.Boolean` |
{:.zebra}

Some non-primitive built-in classes are also mapped:

| **Java type** | **Kotlin type**  |
|---------------|------------------|
| `java.lang.Object`       | `kotlin.Any`    |
| `java.lang.Cloneable`    | `kotlin.Cloneable`    |
| `java.lang.Comparable`   | `kotlin.Comparable`    |
| `java.lang.Enum`         | `kotlin.Enum`    |
| `java.lang.Annotation`   | `kotlin.Annotation`    |
| `java.lang.Deprecated`   | `kotlin.deprecated`    |
| `java.lang.Void`         | `kotlin.Nothing?`    |
| `java.lang.CharSequence` | `kotlin.CharSequence`   |
| `java.lang.String`       | `kotlin.String`   |
| `java.lang.Number`       | `kotlin.Number`     |
| `java.lang.Throwable`    | `kotlin.Throwable`    |
{:.zebra}

Java's arrays are mapped as mentioned [above](java-interop.html#invariant-arrays):

| **Java type** | **Kotlin type**  |
|---------------|------------------|
| `int[]`       | `kotlin.IntArray` |
| `String[]`    | `kotlin.Array<String>` |
{:.zebra}

Collection types may be read-only or mutable in Kotlin, so Java's collection are mapped as follows:

| **Java type** | **Kotlin read-only type**  | **Kotlin mutable type** |
|---------------|------------------|----|
| `java.util.Iterator`       | `kotlin.Iterator`    | `kotlin.MutableIterator` |
| `java.lang.Iterable`    | `kotlin.Iterable`    | `kotlin.MutableIterable` |
| `java.util.Collection`    | `kotlin.Collection`    | `kotlin.MutableCollection` |
| `java.util.Set`    | `kotlin.Set`    | `kotlin.MutableSet` |
| `java.util.List`    | `kotlin.List`    | `kotlin.MutableList` |
| `java.util.ListIterator`    | `kotlin.ListIterator`    | `kotlin.MutableListIterator` |
| `java.util.Map`    | `kotlin.Map`    | `kotlin.MutableMap` |
| `java.util.Map.Entry`    | `kotlin.Map.Entry`    | `kotlin.MutableMap.MutableEntry` |
{:.zebra}

### Object Methods

When Java types are imported into Kotlin, all the references of the type `java.lang.Object` are turned into `Any`.
Since `Any` is not platform-specific, it only declares `toString()`, `hashCode()` and `equals()` as its members,
so to make other members of `java.lang.Object` available, Kotlin uses [extension functions](extensions.html).

#### wait()/notify()

[Effective Java Item 69](http://www.oracle.com/technetwork/java/effectivejava-136174.html) kindly suggests to prefer concurrency utilities to `wait()` and `notify()`.
Thus, these methods are not available on references of type `Any`.
If you really need to call them, you can cast to `java.lang.Object`:

```kotlin
(foo as java.lang.Object).wait()
```

#### getClass()

To retrieve the type information from an object, we use the javaClass extension property.

``` kotlin
val fooClass = foo.javaClass
```

Instead of Java's Foo.class use javaClass<Foo>().


``` kotlin
val fooClass = javaClass<Foo>()
```

#### clone()

To override `clone()`, your class needs to extend `kotlin.Cloneable`:

```kotlin

class Example: Cloneable {
  override fun clone(): Any { ... }
}
```

 Do not forget about [Effective Java Item 11](http://www.oracle.com/technetwork/java/effectivejava-136174.html): Override clone judiciously.

#### finalize()

To override `finalize()`, all you need to do is simply declare it, without using the *override*{:.keyword} keyword:

```kotlin
class C {
  protected fun finalize() {
    // finalization logic
  }
}
```

According to Java's rules, `finalize()` must not be `private`.

### Inheritance from Java classes
At most one Java-class (and as many Java interfaces as you like) can be a supertype for a class in Kotlin. This class must go first in the supertype list.

### Accessing static members

Static members of Java classes form "class objects" for these classes. We cannot pass such a "class object" around as a value, but can access the members explicitly, for example

``` kotlin
if (Character.isLetter(a)) {
  // ...
}
```

## Calling Kotlin code from Java

Kotlin code can be called from Java easily.

### Package-level functions

All the functions and properties declared inside a package `org.foo.bar` are put into a Java class named `org.foo.bar.BarPackage`.

``` kotlin
package demo
  class Foo() {
  }

  fun bar() {
  }

```

``` java
// Java
new Foo();
demo.DemoPackage.bar();
```

For the root package (the one that's called a "default package" in Java), a class named _DefaultPackage is created.

### Checked Exceptions

As we mentioned above, Kotlin does not have checked exceptions. So, normally, the Java signatures of Kotlin functions do not declare exceptions thrown. Thus if we have a function in Kotlin like this:

``` kotlin
package demo

fun foo() {
  throw IOException();
}
```

And we want to call it from Java and catch the exception:

``` kotlin
// Java
try {
  demo.DemoPackage.foo();
}
catch (IOException e) { // error: foo() does not declare IOException in the throws list
  // ...
}
```

we get an error message from the Java compiler, because foo() does not declare IOException. To work around this problem, use the [throws] annotation in Kotlin:

``` kotlin
[throws(javaClass<IOException>())] fun foo() {
    throw IOException();
}
```

### Null-safety

When calling Kotlin functions from Java, nobody prevents us from passing a null as a non-null parameter. That's why Kotlin generates runtime checks for all public functions that expect non-nulls. This way we get a NullPointerException in the Java code immediately.

### Properties

Property getters are turned into *get*-methods, and setters – into *set*-methods.

