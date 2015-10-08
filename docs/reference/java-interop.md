---
type: doc
layout: reference
category: "Interop"
title: "Java Interop"
---

# Java交互

Kotlin 在设计时就是以与 java 交互为中心的。现存的 Java 代码可以在 kotlin 中使用，并且 Kotlin 代码也可以在 Java 中流畅运行。这节我们会讨论在 kotlin 中调用 Java 代码的细节。

## 在Kotlin中调用Java代码

基本所有的 Java 代码都可以运行

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

### 返回void的方法

如果一个Java方法返回void，那么在Kotlin中，它会返回`Unit`。
万一有人使用它的返回值，Kotlin的编译器会在调用的地方赋值，因为这个值本身已经提前可以预知了(这个值就是`Unit`)。

### 将Java代码中与Kotlin关键字冲突的标识符进行转义

一些Kotlin的关键字在Java中是合法的标识符: *in*{: .keyword }, *object*{: .keyword }, *is*{: .keyword }, 等等.
如果一个Java库在方法中使用了Kotlin关键字,你仍然可以使用这个方法
使用反引号(`)转义来避免冲突。

``` kotlin
foo.`is`(bar)
```

### Null安全性和平台类型

Java中的所有引用都可能是*null*{: .keyword }值，这使得Kotlin严格的null控制对来自Java的对象来说变得不切实际。在Kotlin中Java声明类型被特别对待叫做*platform types*.这种类型的Null检查是不严格的，所以他们还维持着同Java中一样的安全性。

考虑如下例子:

``` kotlin
val list = ArrayList<String>() // non-null (constructor result)
list.add("Item")
val size = list.size() // non-null (primitive int)
val item = list.get(0) // platform type inferred (ordinary Java object)
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

#### Notation for Platform Types

As mentioned above, platform types cannot be mentioned explicitly in the program, so there's no syntax for them in the language.
Nevertheless, the compiler and IDE need to display them sometimes (in error messages, parameter info etc), so we have a
mnemonic notation for them:

* `T!` means "`T` or `T?`",
* `(Mutable)Collection<T>!` means "Java collection of `T` may be mutable or not, may be nullable or not",
* `Array<(out) T>!` means "Java array of `T` (or a subtype of `T`), nullable or not"

### Mapped types

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
| `java.lang.Deprecated`   | `kotlin.deprecated!`    |
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

### Java generics in Kotlin

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

### Java Arrays

Arrays in Kotlin are invariant, unlike Java. This means that Kotlin does not let us assign an `Array<String>` to an `Array<Any>`,
which prevents a possible runtime failure. Passing an array of a subclass as an array of superclass to a Kotlin method is also prohibited,
but for Java methods this is allowed (though [platform types](#platform-types) of the form `Array<(out) String>!`).

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

It's currently not possible to pass *null*{: .keyword } to a method that is declared as varargs.

When compiling to JVM byte codes, the compiler optimizes access to arrays so that there's no overhead introduced:

``` kotlin
val array = array(1, 2, 3, 4)
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

### Checked Exceptions

In Kotlin, all exceptions are unchecked, meaning that the compiler does not force you to catch any of them.
So, when you call a Java method that declares a checked exception, Kotlin does not force you to do anything:

``` kotlin
fun render(list: List<*>, to: Appendable) {
  for (item in list)
    to.append(item.toString()) // Java would require us to catch IOException here
}
```

### Object Methods

When Java types are imported into Kotlin, all the references of the type `java.lang.Object` are turned into `Any`.
Since `Any` is not platform-specific, it only declares `toString()`, `hashCode()` and `equals()` as its members,
so to make other members of `java.lang.Object` available, Kotlin uses [extension functions](extensions.html).

#### wait()/notify()

[Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html) Item 69 kindly suggests to prefer concurrency utilities to `wait()` and `notify()`.
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

Instead of Java's `Foo.class` use javaClass<Foo>().


``` kotlin
val fooClass = javaClass<Foo>()
```

#### clone()

To override `clone()`, your class needs to extend `kotlin.Cloneable`:

```kotlin

class Example : Cloneable {
  override fun clone(): Any { ... }
}
```

 Do not forget about [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html), Item 11: *Override clone judiciously*.

#### finalize()

To override `finalize()`, all you need to do is simply declare it, without using the *override*{:.keyword} keyword:

```kotlin
class C {
  protected fun finalize() {
    // finalization logic
  }
}
```

According to Java's rules, `finalize()` must not be *private*{: .keyword }.

### Inheritance from Java classes
At most one Java-class (and as many Java interfaces as you like) can be a supertype for a class in Kotlin. This class must go first in the supertype list.

### Accessing static members

Static members of Java classes form "companion objects" for these classes. We cannot pass such a "companion object" around as a value,
but can access the members explicitly, for example

``` kotlin
if (Character.isLetter(a)) {
  // ...
}
```

### Java Reflection

Java reflection works on Kotlin classes and vice versa. As mentioned above, you can use `instance.javaClass` or 
`javaClass<ClassName>()` to enter Java reflection through `java.lang.Class`. You can then "convert" to Kotlin reflection
by calling `.kotlin`:
 
``` kotlin 
val kClass = x.javaClass.kotlin  
```
 
In much the same way you can convert from Kotlin reflection to Java: `ClassName::class.java` is the same as `javaClass<ClassName>()`.
Other supported cases include acquiring a Java getter/setter method or a backing field for a Kotlin property, 
getting a containing `KPackage` instance for a Java class, and getting a `KProperty` for a Java field.

### SAM Conversions

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

Note that SAM conversions only work for interfaces, not for abstract classes, even if those also have just a single
abstract method.

Also note that this feature works only for Java interop; since Kotlin has proper function types, automatic conversion
of functions into implementations of Kotlin interfaces is unnecessary and therefore unsupported.

## Calling Kotlin code from Java

Kotlin code can be called from Java easily.

### Package-Level Functions

All the functions and properties declared inside a package `org.foo.bar` are put into a Java class named `org.foo.bar.BarPackage`.

``` kotlin
package demo

class Foo

fun bar() {
}

```

``` java
// Java
new demo.Foo();
demo.DemoPackage.bar();
```

For the root package (the one that's called a "default package" in Java), a class named `_DefaultPackage` is created.

### Static Methods and Fields

As mentioned above, Kotlin generates static methods for package-level functions. On top of that, it also generates static methods
for functions defined in named objects or companion objects of classes and annotated as `@platformStatic`. For example:

``` kotlin
class C {
  companion object {
    platformStatic fun foo() {}
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
    platformStatic fun foo() {}
    fun bar() {}
}
```

In Java:

``` java
Obj.foo(); // works fine
Obj.bar(); // error
Obj.INSTANCE$.bar(); // works, a call through the singleton instance
Obj.INSTANCE$.foo(); // works too
```

Also, public properties defined in objects and companion objects are turned into static fields in Java:

``` kotlin
object Obj {
  val CONST = 1
}
```

In Java:

``` java
int c = Obj.CONST;
```

### Handling signature clashes with @platformName

Sometimes we have a named function in Kotlin, for which we need a different JVM name the byte code.
The most prominent example happens due to *type erasure*:

``` kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

These two functions can not be defined side-by-side, because their JVM signatures are the same: `filterValid(Ljava/util/List;)Ljava/util/List;`.
If we really want them to have the same name in Kotlin, we can annotate one (or both) of them with `@platformName` and specify a different name as an argument:

``` kotlin
fun List<String>.filterValid(): List<String>
@platformName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

From Kotlin they will be accessible by the same name `filterValid`, but from Java it will be `filterValid` and `filterValidInt`.

The same trick applies when we need to have a property `x` alongside with a function `getX()`:

``` kotlin
val x: Int
  @platformName("getX_prop")
  get() = 15

fun getX() = 10
```


### Overloads Generation

Normally, if you write a Kotlin method with default parameter values, it will be visible in Java only as a full
signature, with all parameters present. If you wish to expose multiple overloads to Java callers, you can use the
@jvmOverloads annotation.

``` kotlin
jvmOverloads fun f(a: String, b: Int = 0, c: String = "abc") {
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
if the @jvmOverloads annotation is not specified.


### Checked Exceptions

As we mentioned above, Kotlin does not have checked exceptions.
So, normally, the Java signatures of Kotlin functions do not declare exceptions thrown.
Thus if we have a function in Kotlin like this:

``` kotlin
package demo

fun foo() {
  throw IOException()
}
```

And we want to call it from Java and catch the exception:

``` java
// Java
try {
  demo.DemoPackage.foo();
}
catch (IOException e) { // error: foo() does not declare IOException in the throws list
  // ...
}
```

we get an error message from the Java compiler, because `foo()` does not declare `IOException`.
To work around this problem, use the `@throws` annotation in Kotlin:

``` kotlin
@throws(IOException::class) fun foo() {
    throw IOException()
}
```

### Null-safety

When calling Kotlin functions from Java, nobody prevents us from passing *null*{: .keyword } as a non-null parameter.
That's why Kotlin generates runtime checks for all public functions that expect non-nulls.
This way we get a `NullPointerException` in the Java code immediately.

### Properties

Property getters are turned into *get*-methods, and setters – into *set*-methods.
