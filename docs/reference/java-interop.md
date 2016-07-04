---
type: doc
layout: reference
category: "Interop"
title: "Calling Java from Kotlin"
---

# Calling Java code from Kotlin

Kotlin is designed with Java Interoperability in mind. Existing Java code can be called from Kotlin in a natural way, and Kotlin code can be used from
Java rather smoothly as well. In this section we describe some details about calling Java code from Kotlin.

Pretty much all Java code can be used without any issues

``` kotlin
import java.util.*

fun demo(source: List<Int>) {
  val list = ArrayList<Int>()
  // 'for'-loops work for Java collections:
  for (item in source)
    list.add(item)
  // Operator conventions work as well:
  for (i in 0..source.size() - 1)
    list[i] = source[i] // get and set are called
}
```

## Getters and Setters

Methods that follow the Java conventions for getters and setters (no-argument methods with names starting with `get`
and single-argument methods with names starting with `set`) are represented as properties in Kotlin. For example:

``` kotlin
import java.util.Calendar

fun calendarDemo() {
    val calendar = Calendar.getInstance()
    if (calendar.firstDayOfWeek == Calendar.SUNDAY) {  // call getFirstDayOfWeek()
        calendar.firstDayOfWeek = Calendar.MONDAY       // call setFirstDayOfWeek()
    }
}
```

Note that, if the Java class only has a setter, it will not be visible as a property in Kotlin, because Kotlin does not support set-only properties at this time.

## Methods returning void

If a Java method returns void, it will return `Unit` when called from Kotlin.
If, by any chance, someone uses that return value, it will be assigned at the call site by the Kotlin compiler,
since the value itself is known in advance (being `Unit`).

## Escaping for Java identifiers that are keywords in Kotlin

Some of the Kotlin keywords are valid identifiers in Java: *in*{: .keyword }, *object*{: .keyword }, *is*{: .keyword }, etc.
If a Java library uses a Kotlin keyword for a method, you can still call the method
escaping it with the backtick (`) character

``` kotlin
foo.`is`(bar)
```

## Null-Safety and Platform Types

Any reference in Java may be *null*{: .keyword }, which makes Kotlin's requirements of strict null-safety impractical for objects coming from Java.
Types of Java declarations are treated specially in Kotlin and called *platform types*. Null-checks are relaxed for such types,
so that safety guarantees for them are the same as in Java (see more [below](#mapped-types)).

Consider the following examples:

``` kotlin
val list = ArrayList<String>() // non-null (constructor result)
list.add("Item")
val size = list.size() // non-null (primitive int)
val item = list[0] // platform type inferred (ordinary Java object)
```

When we call methods on variables of platform types, Kotlin does not issue nullability errors at compile time,
but the call may fail at runtime, because of a null-pointer exception or an assertion that Kotlin generates to
prevent nulls from propagating:

``` kotlin
item.substring(1) // allowed, may throw an exception if item == null
```

Platform types are *non-denotable*, meaning that one can not write them down explicitly in the language.
When a platform value is assigned to a Kotlin variable, we can rely on type inference (the variable will have an inferred platform type then,
 as `item` has in the example above), or we can choose the type that we expect (both nullable and non-null types are allowed):

``` kotlin
val nullable: String? = item // allowed, always works
val notNull: String = item // allowed, may fail at runtime
```

If we choose a non-null type, the compiler will emit an assertion upon assignment. This prevents Kotlin's non-null variables from holding
nulls. Assertions are also emitted when we pass platform values to Kotlin functions expecting non-null values etc.
Overall, the compiler does its best to prevent nulls from propagating far through the program (although sometimes this is
impossible to eliminate entirely, because of generics).

### Notation for Platform Types

As mentioned above, platform types cannot be mentioned explicitly in the program, so there's no syntax for them in the language.
Nevertheless, the compiler and IDE need to display them sometimes (in error messages, parameter info etc), so we have a
mnemonic notation for them:

* `T!` means "`T` or `T?`",
* `(Mutable)Collection<T>!` means "Java collection of `T` may be mutable or not, may be nullable or not",
* `Array<(out) T>!` means "Java array of `T` (or a subtype of `T`), nullable or not"

### Nullability annotations

Java types which have nullability annotations are represented not as platform types, but as actual nullable or non-null
Kotlin types. The compiler supports several flavors of nullability annotations, including:

  * [JetBrains](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html)
(`@Nullable` and `@NotNull` from the `org.jetbrains.annotations` package)
  * Android (`com.android.annotations` and `android.support.annotations`)
  * JSR-305 (`javax.annotation`)
  * FindBugs (`edu.umd.cs.findbugs.annotations`)
  * Eclipse (`org.eclipse.jdt.annotation`)
  * Lombok (`lombok.NonNull`).

You can find the full list in the [Kotlin compiler source code](https://github.com/JetBrains/kotlin/blob/master/core/descriptor.loader.java/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt).

## Mapped types

Kotlin treats some Java types specially. Such types are not loaded from Java "as is", but are _mapped_ to corresponding Kotlin types.
The mapping only matters at compile time, the runtime representation remains unchanged.
 Java's primitive types are mapped to corresponding Kotlin types (keeping [platform types](#platform-types) in mind):

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
| `java.lang.Object`       | `kotlin.Any!`    |
| `java.lang.Cloneable`    | `kotlin.Cloneable!`    |
| `java.lang.Comparable`   | `kotlin.Comparable!`    |
| `java.lang.Enum`         | `kotlin.Enum!`    |
| `java.lang.Annotation`   | `kotlin.Annotation!`    |
| `java.lang.Deprecated`   | `kotlin.Deprecated!`    |
| `java.lang.Void`         | `kotlin.Nothing!`    |
| `java.lang.CharSequence` | `kotlin.CharSequence!`   |
| `java.lang.String`       | `kotlin.String!`   |
| `java.lang.Number`       | `kotlin.Number!`     |
| `java.lang.Throwable`    | `kotlin.Throwable!`    |
{:.zebra}

Collection types may be read-only or mutable in Kotlin, so Java's collections are mapped as follows
(all Kotlin types in this table reside in the package `kotlin`):

| **Java type** | **Kotlin read-only type**  | **Kotlin mutable type** | **Loaded platform type** |
|---------------|------------------|----|----|
| `Iterator<T>`        | `Iterator<T>`        | `MutableIterator<T>`            | `(Mutable)Iterator<T>!`            |
| `Iterable<T>`        | `Iterable<T>`        | `MutableIterable<T>`            | `(Mutable)Iterable<T>!`            |
| `Collection<T>`      | `Collection<T>`      | `MutableCollection<T>`          | `(Mutable)Collection<T>!`          |
| `Set<T>`             | `Set<T>`             | `MutableSet<T>`                 | `(Mutable)Set<T>!`                 |
| `List<T>`            | `List<T>`            | `MutableList<T>`                | `(Mutable)List<T>!`                |
| `ListIterator<T>`    | `ListIterator<T>`    | `MutableListIterator<T>`        | `(Mutable)ListIterator<T>!`        |
| `Map<K, V>`          | `Map<K, V>`          | `MutableMap<K, V>`              | `(Mutable)Map<K, V>!`              |
| `Map.Entry<K, V>`    | `Map.Entry<K, V>`    | `MutableMap.MutableEntry<K,V>` | `(Mutable)Map.(Mutable)Entry<K, V>!` |
{:.zebra}

Java's arrays are mapped as mentioned [below](java-interop.html#java-arrays):

| **Java type** | **Kotlin type**  |
|---------------|------------------|
| `int[]`       | `kotlin.IntArray!` |
| `String[]`    | `kotlin.Array<(out) String>!` |
{:.zebra}

## Java generics in Kotlin

Kotlin's generics are a little different from Java's (see [Generics](generics.html)). When importing Java types to Kotlin we perform some conversions:

* Java's wildcards are converted into type projections
  * `Foo<? extends Bar>` becomes `Foo<out Bar!>!`
  * `Foo<? super Bar>` becomes `Foo<in Bar!>!`

* Java's raw types are converted into star projections
  * `List` becomes `List<*>!`, i.e. `List<out Any?>!`

Like Java's, Kotlin's generics are not retained at runtime, i.e. objects do not carry information about actual type arguments passed to their constructors,
i.e. `ArrayList<Integer>()` is indistinguishable from `ArrayList<Character>()`.
This makes it impossible to perform *is*{: .keyword }-checks that take generics into account.
Kotlin only allows *is*{: .keyword }-checks for star-projected generic types:

``` kotlin
if (a is List<Int>) // Error: cannot check if it is really a List of Ints
// but
if (a is List<*>) // OK: no guarantees about the contents of the list
```

## Java Arrays

Arrays in Kotlin are invariant, unlike Java. This means that Kotlin does not let us assign an `Array<String>` to an `Array<Any>`,
which prevents a possible runtime failure. Passing an array of a subclass as an array of superclass to a Kotlin method is also prohibited,
but for Java methods this is allowed (through [platform types](#platform-types) of the form `Array<(out) String>!`).

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
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // passes int[] to method
```

When compiling to JVM byte codes, the compiler optimizes access to arrays so that there's no overhead introduced:

``` kotlin
val array = arrayOf(1, 2, 3, 4)
array[x] = array[x] * 2 // no actual calls to get() and set() generated
for (x in array) // no iterator created
  print(x)
```

Even when we navigate with an index, it does not introduce any overhead

``` kotlin
for (i in array.indices) // no iterator created
  array[i] += 2
```

Finally, *in*{: .keyword }-checks have no overhead either

``` kotlin
if (i in array.indices) { // same as (i >= 0 && i < array.size)
  print(array[i])
}
```

## Java Varargs

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
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

It's currently not possible to pass *null*{: .keyword } to a method that is declared as varargs.

## Operators

Since Java has no way of marking methods for which it makes sense to use the operator syntax, Kotlin allows using any
Java methods with the right name and signature as operator overloads and other conventions (`invoke()` etc.)
Calling Java methods using the infix call syntax is not allowed.


## Checked Exceptions

In Kotlin, all exceptions are unchecked, meaning that the compiler does not force you to catch any of them.
So, when you call a Java method that declares a checked exception, Kotlin does not force you to do anything:

``` kotlin
fun render(list: List<*>, to: Appendable) {
  for (item in list)
    to.append(item.toString()) // Java would require us to catch IOException here
}
```

## Object Methods

When Java types are imported into Kotlin, all the references of the type `java.lang.Object` are turned into `Any`.
Since `Any` is not platform-specific, it only declares `toString()`, `hashCode()` and `equals()` as its members,
so to make other members of `java.lang.Object` available, Kotlin uses [extension functions](extensions.html).

### wait()/notify()

[Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html) Item 69 kindly suggests to prefer concurrency utilities to `wait()` and `notify()`.
Thus, these methods are not available on references of type `Any`.
If you really need to call them, you can cast to `java.lang.Object`:

```kotlin
(foo as java.lang.Object).wait()
```

### getClass()

To retrieve the type information from an object, we use the javaClass extension property.

``` kotlin
val fooClass = foo.javaClass
```

Instead of Java's `Foo.class` use Foo::class.java.


``` kotlin
val fooClass = Foo::class.java
```

### clone()

To override `clone()`, your class needs to extend `kotlin.Cloneable`:

```kotlin

class Example : Cloneable {
  override fun clone(): Any { ... }
}
```

 Do not forget about [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html), Item 11: *Override clone judiciously*.

### finalize()

To override `finalize()`, all you need to do is simply declare it, without using the *override*{:.keyword} keyword:

```kotlin
class C {
  protected fun finalize() {
    // finalization logic
  }
}
```

According to Java's rules, `finalize()` must not be *private*{: .keyword }.

## Inheritance from Java classes

At most one Java class (and as many Java interfaces as you like) can be a supertype for a class in Kotlin.

## Accessing static members

Static members of Java classes form "companion objects" for these classes. We cannot pass such a "companion object" around as a value,
but can access the members explicitly, for example

``` kotlin
if (Character.isLetter(a)) {
  // ...
}
```

## Java Reflection

Java reflection works on Kotlin classes and vice versa. As mentioned above, you can use `instance.javaClass` or 
`ClassName::class.java` to enter Java reflection through `java.lang.Class`.
 
Other supported cases include acquiring a Java getter/setter method or a backing field for a Kotlin property, a `KProperty` for a Java field, a Java method or constructor for a `KFunction` and vice versa.

## SAM Conversions

Just like Java 8, Kotlin supports SAM conversions. This means that Kotlin function literals can be automatically converted
into implementations of Java interfaces with a single non-default method, as long as the parameter types of the interface
method match the parameter types of the Kotlin function.

You can use this for creating instances of SAM interfaces:

``` kotlin
val runnable = Runnable { println("This runs in a runnable") }
```

...and in method calls:

``` kotlin
val executor = ThreadPoolExecutor()
// Java signature: void execute(Runnable command)
executor.execute { println("This runs in a thread pool") }
```

If the Java class has multiple methods taking functional interfaces, you can choose the one you need to call by
using an adapter function that converts a lambda to a specific SAM type. Those adapter functions are also generated
by the compiler when needed.

``` kotlin
executor.execute(Runnable { println("This runs in a thread pool") })
```

Note that SAM conversions only work for interfaces, not for abstract classes, even if those also have just a single
abstract method.

Also note that this feature works only for Java interop; since Kotlin has proper function types, automatic conversion
of functions into implementations of Kotlin interfaces is unnecessary and therefore unsupported.

## Using JNI with Kotlin

To declare a function that is implemented in native (C or C++) code, you need to mark it with the `external` modifier:

``` kotlin
external fun foo(x: Int): Double
```

The rest of the procedure works in exactly the same way as in Java.
