[//]: # (title: Calling Java from Kotlin)

Kotlin is designed with Java Interoperability in mind. Existing Java code can be called from Kotlin in a natural way,
and Kotlin code can be used from Java rather smoothly as well.
In this section, we describe some details about calling Java code from Kotlin.

Pretty much all Java code can be used without any issues:

```kotlin
import java.util.*

fun demo(source: List<Int>) {
    val list = ArrayList<Int>()
    // 'for'-loops work for Java collections:
    for (item in source) {
        list.add(item)
    }
    // Operator conventions work as well:
    for (i in 0..source.size - 1) {
        list[i] = source[i] // get and set are called
    }
}
```

## Getters and setters

Methods that follow the Java conventions for getters and setters (no-argument methods with names starting with `get`
and single-argument methods with names starting with `set`) are represented as properties in Kotlin.
`Boolean` accessor methods (where the name of the getter starts with `is` and the name of the setter starts with `set`)
are represented as properties which have the same name as the getter method.

```kotlin
import java.util.Calendar

fun calendarDemo() {
    val calendar = Calendar.getInstance()
    if (calendar.firstDayOfWeek == Calendar.SUNDAY) {  // call getFirstDayOfWeek()
        calendar.firstDayOfWeek = Calendar.MONDAY // call setFirstDayOfWeek()
    }
    if (!calendar.isLenient) { // call isLenient()
        calendar.isLenient = true // call setLenient()
    }
}
```

Note that, if the Java class only has a setter, it isn't visible as a property in Kotlin because Kotlin doesn't support
set-only properties.

## Methods returning void

If a Java method returns `void`, it will return `Unit` when called from Kotlin.
If by any chance someone uses that return value, it will be assigned at the call site by the Kotlin compiler
since the value itself is known in advance (being `Unit`).

## Escaping for Java identifiers that are keywords in Kotlin

Some of the Kotlin keywords are valid identifiers in Java: `in`, `object`, `is`, and other.
If a Java library uses a Kotlin keyword for a method, you can still call the method
escaping it with the backtick (`) character:

```kotlin
foo.`is`(bar)
```

## Null-safety and platform types

Any reference in Java may be `null`, which makes Kotlin's requirements of strict null-safety impractical for objects coming from Java.
Types of Java declarations are treated in Kotlin in a specific manner and called *platform types*. Null-checks are relaxed
for such types, so that safety guarantees for them are the same as in Java (see more [below](#mapped-types)).

Consider the following examples:

```kotlin
val list = ArrayList<String>() // non-null (constructor result)
list.add("Item")
val size = list.size // non-null (primitive int)
val item = list[0] // platform type inferred (ordinary Java object)
```

When you call methods on variables of platform types, Kotlin does not issue nullability errors at compile time,
but the call may fail at runtime, because of a null-pointer exception or an assertion that Kotlin generates to
prevent nulls from propagating:

```kotlin
item.substring(1) // allowed, may throw an exception if item == null
```

Platform types are *non-denotable*, meaning that you can't write them down explicitly in the language.
When a platform value is assigned to a Kotlin variable, you can rely on the type inference (the variable will have an inferred
platform type then, as `item` has in the example above), or you can choose the type you expect (both nullable and non-null types are allowed):

```kotlin
val nullable: String? = item // allowed, always works
val notNull: String = item // allowed, may fail at runtime
```

If you choose a non-null type, the compiler will emit an assertion upon assignment. This prevents Kotlin's non-null variables from holding
nulls. Assertions are also emitted when you pass platform values to Kotlin functions expecting non-null values and in other cases.
Overall, the compiler does its best to prevent nulls from propagating far through the program although sometimes this is
impossible to eliminate entirely, because of generics.

### Notation for platform types

As mentioned above, platform types can't be mentioned explicitly in the program, so there's no syntax for them in the language.
Nevertheless, the compiler and IDE need to display them sometimes (for example, in error messages or parameter info), 
so there is a mnemonic notation for them:

* `T!` means "`T` or `T?`",
* `(Mutable)Collection<T>!` means "Java collection of `T` may be mutable or not, may be nullable or not",
* `Array<(out) T>!` means "Java array of `T` (or a subtype of `T`), nullable or not"

### Nullability annotations

Java types that have nullability annotations are represented not as platform types, but as actual nullable or non-null
Kotlin types. The compiler supports several flavors of nullability annotations, including:

  * [JetBrains](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html)
(`@Nullable` and `@NotNull` from the `org.jetbrains.annotations` package)
  * Android (`com.android.annotations` and `android.support.annotations`)
  * JSR-305 (`javax.annotation`, more details below)
  * FindBugs (`edu.umd.cs.findbugs.annotations`)
  * Eclipse (`org.eclipse.jdt.annotation`)
  * Lombok (`lombok.NonNull`)

You can find the full list in the [Kotlin compiler source code](https://github.com/JetBrains/kotlin/blob/master/core/compiler.common.jvm/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt).

### Annotating type parameters

You can annotate type arguments of generic types to provide nullability information for them as well.
For example, consider these annotations on a Java declaration:

```java
@NotNull
Set<@NotNull String> toSet(@NotNull Collection<@NotNull String> elements) { ... }
```

It leads to the following signature seen in Kotlin:

```kotlin
fun toSet(elements: (Mutable)Collection<String>) : (Mutable)Set<String> { ... }
```

Note the `@NotNull` annotations on `String` type arguments. Without them, you get platform types in the type arguments:

```kotlin
fun toSet(elements: (Mutable)Collection<String!>) : (Mutable)Set<String!> { ... }
```

Annotating type arguments works with Java 8 target or higher and requires the nullability annotations to support the
`TYPE_USE` target (`org.jetbrains.annotations` supports this in version 15 and above).

>Due to the current technical limitations, the IDE does not correctly recognize these annotations on
>type arguments in compiled Java libraries that are used as dependencies.
>
{type="note"}

### JSR-305 support

The [`@Nonnull`](https://aalmiray.github.io/jsr-305/apidocs/javax/annotation/Nonnull.html) annotation defined
in [JSR-305](https://jcp.org/en/jsr/detail?id=305) is supported for denoting nullability of Java types.

If the `@Nonnull(when = ...)` value is `When.ALWAYS`, the annotated type is treated as non-null; `When.MAYBE` and
`When.NEVER` denote a nullable type; and `When.UNKNOWN` forces the type to be [platform one](#null-safety-and-platform-types).

A library can be compiled against the JSR-305 annotations, but there's no need to make the annotations artifact (e.g. `jsr305.jar`)
a compile dependency for the library consumers. The Kotlin compiler can read the JSR-305 annotations from a library
without the annotations present on the classpath.

[Custom nullability qualifiers (KEEP-79)](https://github.com/Kotlin/KEEP/blob/41091f1cc7045142181d8c89645059f4a15cc91a/proposals/jsr-305-custom-nullability-qualifiers.md)
are also supported (see below).

#### Type qualifier nicknames

If an annotation type is annotated with both
[`@TypeQualifierNickname`](https://aalmiray.github.io/jsr-305/apidocs/javax/annotation/meta/TypeQualifierNickname.html)
and JSR-305 `@Nonnull` (or its another nickname, such as `@CheckForNull`), then the annotation type is itself used for
retrieving precise nullability and has the same meaning as that nullability annotation:

```java
@TypeQualifierNickname
@Nonnull(when = When.ALWAYS)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNonnull {
}

@TypeQualifierNickname
@CheckForNull // a nickname to another type qualifier nickname
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNullable {
}

interface A {
    @MyNullable String foo(@MyNonnull String x);
    // in Kotlin (strict mode): `fun foo(x: String): String?`

    String bar(List<@MyNonnull String> x);
    // in Kotlin (strict mode): `fun bar(x: List<String>!): String!`
}
```

#### Type qualifier defaults

[`@TypeQualifierDefault`](https://aalmiray.github.io/jsr-305/apidocs/javax/annotation/meta/TypeQualifierDefault.html)
allows introducing annotations that, when being applied, define the default nullability within the scope of the annotated
element.

Such annotation type should itself be annotated with both `@Nonnull` (or its nickname) and `@TypeQualifierDefault(...)`
with one or more `ElementType` values:

* `ElementType.METHOD` for return types of methods
* `ElementType.PARAMETER` for value parameters
* `ElementType.FIELD` for fields
* `ElementType.TYPE_USE` for any type including type arguments, upper bounds of type parameters and wildcard types

The default nullability is used when a type itself is not annotated by a nullability annotation, and the default is
determined by the innermost enclosing element annotated with a type qualifier default annotation with the
`ElementType` matching the type usage.

```java
@Nonnull
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
public @interface NonNullApi {
}

@Nonnull(when = When.MAYBE)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER, ElementType.TYPE_USE})
public @interface NullableApi {
}

@NullableApi
interface A {
    String foo(String x); // fun foo(x: String?): String?

    @NotNullApi // overriding default from the interface
    String bar(String x, @Nullable String y); // fun bar(x: String, y: String?): String

    // The List<String> type argument is seen as nullable because of `@NullableApi`
    // having the `TYPE_USE` element type:
    String baz(List<String> x); // fun baz(List<String?>?): String?

    // The type of `x` parameter remains platform because there's an explicit
    // UNKNOWN-marked nullability annotation:
    String qux(@Nonnull(when = When.UNKNOWN) String x); // fun baz(x: String!): String?
}
```

> The types in this example only take place with the strict mode enabled; otherwise, the platform types remain.
>See the [`@UnderMigration` annotation](#undermigration-annotation) and [Compiler configuration](#compiler-configuration) sections.
>
{type="note"}

Package-level default nullability is also supported:

```java
// FILE: test/package-info.java
@NonNullApi // declaring all types in package 'test' as non-nullable by default
package test;
```

#### @UnderMigration annotation

The `@UnderMigration` annotation (provided in a separate artifact `kotlin-annotations-jvm`) can be used by library
maintainers to define the migration status for the nullability type qualifiers.

The status value in `@UnderMigration(status = ...)` specifies how the compiler treats inappropriate usages of the
annotated types in Kotlin (e.g. using a `@MyNullable`-annotated type value as non-null):

* `MigrationStatus.STRICT` makes annotation work as any plain nullability annotation, i.e. report errors for
the inappropriate usages and affect the types in the annotated declarations as they are seen in Kotlin
* `MigrationStatus.WARN`: the inappropriate usages are reported as compilation warnings instead of errors,
but the types in the annotated declarations remain platform
* `MigrationStatus.IGNORE` makes the compiler ignore the nullability annotation completely

A library maintainer can add `@UnderMigration` status to both type qualifier nicknames and type qualifier defaults:

```java
@Nonnull(when = When.ALWAYS)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
@UnderMigration(status = MigrationStatus.WARN)
public @interface NonNullApi {
}

// The types in the class are non-null, but only warnings are reported
// because `@NonNullApi` is annotated `@UnderMigration(status = MigrationStatus.WARN)`
@NonNullApi
public class Test {}
```

>The migration status of a nullability annotation is not inherited by its type qualifier nicknames but is applied
>to its usages in default type qualifiers.
>
{type="note"}

If a default type qualifier uses a type qualifier nickname and they are both `@UnderMigration`, the status
from the default type qualifier is used.

#### Compiler configuration

The JSR-305 checks can be configured by adding the `-Xjsr305` compiler flag with the following options (and their combination):

* `-Xjsr305={strict|warn|ignore}` to set up the behavior for non-`@UnderMigration` annotations.
Custom nullability qualifiers, especially
`@TypeQualifierDefault`, are already spread among many well-known libraries, and users may need to migrate smoothly when
updating to the Kotlin version containing JSR-305 support. Since Kotlin 1.1.60, this flag only affects non-`@UnderMigration` annotations.

* `-Xjsr305=under-migration:{strict|warn|ignore}` to override the behavior for the `@UnderMigration` annotations.
Users may have different view on the migration status for the libraries:
they may want to have errors while the official migration status is `WARN`, or vice versa,
they may wish to postpone errors reporting for some until they complete their migration.

* `-Xjsr305=@<fq.name>:{strict|warn|ignore}` to override the behavior for a single annotation, where `<fq.name>`
is the fully qualified class name of the annotation. May appear several times for different annotations. This is useful
for managing the migration state for a particular library.

The `strict`, `warn` and `ignore` values have the same meaning as those of `MigrationStatus`,
and only the `strict` mode affects the types in the annotated declarations as they are seen in Kotlin.

> Note: the built-in JSR-305 annotations [`@Nonnull`](https://aalmiray.github.io/jsr-305/apidocs/javax/annotation/Nonnull.html),
>[`@Nullable`](https://aalmiray.github.io/jsr-305/apidocs/javax/annotation/Nullable.html) and
>[`@CheckForNull`](https://aalmiray.github.io/jsr-305/apidocs/javax/annotation/CheckForNull.html) are always enabled and
>affect the types of the annotated declarations in Kotlin, regardless of compiler configuration with the `-Xjsr305` flag.
>
{type="note"}

For example, adding `-Xjsr305=ignore -Xjsr305=under-migration:ignore -Xjsr305=@org.library.MyNullable:warn` to the
compiler arguments makes the compiler generate warnings for inappropriate usages of types annotated by
`@org.library.MyNullable` and ignore all other JSR-305 annotations.

The default behavior is the same to `-Xjsr305=warn`. The
`strict` value should be considered experimental (more checks may be added to it in the future).

## Mapped types

Kotlin treats some Java types specifically. Such types are not loaded from Java "as is", but are _mapped_ to corresponding Kotlin types.
The mapping only matters at compile time, the runtime representation remains unchanged.
 Java's primitive types are mapped to corresponding Kotlin types (keeping [platform types](#null-safety-and-platform-types) in mind):

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

Some non-primitive built-in classes are also mapped:

| **Java type** | **Kotlin type**  |
|---------------|------------------|
| `java.lang.Object`       | `kotlin.Any!`    |
| `java.lang.Cloneable`    | `kotlin.Cloneable!`    |
| `java.lang.Comparable`   | `kotlin.Comparable!`    |
| `java.lang.Enum`         | `kotlin.Enum!`    |
| `java.lang.Annotation`   | `kotlin.Annotation!`    |
| `java.lang.CharSequence` | `kotlin.CharSequence!`   |
| `java.lang.String`       | `kotlin.String!`   |
| `java.lang.Number`       | `kotlin.Number!`     |
| `java.lang.Throwable`    | `kotlin.Throwable!`    |

Java's boxed primitive types are mapped to nullable Kotlin types:

| **Java type**           | **Kotlin type**  |
|-------------------------|------------------|
| `java.lang.Byte`        | `kotlin.Byte?`   |
| `java.lang.Short`       | `kotlin.Short?`  |
| `java.lang.Integer`     | `kotlin.Int?`    |
| `java.lang.Long`        | `kotlin.Long?`   |
| `java.lang.Character`   | `kotlin.Char?`   |
| `java.lang.Float`       | `kotlin.Float?`  |
| `java.lang.Double`      | `kotlin.Double?`  |
| `java.lang.Boolean`     | `kotlin.Boolean?` |

Note that a boxed primitive type used as a type parameter is mapped to a platform type:
for example, `List<java.lang.Integer>` becomes a `List<Int!>` in Kotlin.

Collection types may be read-only or mutable in Kotlin, so Java's collections are mapped as follows
(all Kotlin types in this table reside in the package `kotlin.collections`):

| **Java type** | **Kotlin read-only type**  | **Kotlin mutable type** | **Loaded platform type** |
|---------------|----------------------------|-------------------------|--------------------------|
| `Iterator<T>`        | `Iterator<T>`        | `MutableIterator<T>`            | `(Mutable)Iterator<T>!`            |
| `Iterable<T>`        | `Iterable<T>`        | `MutableIterable<T>`            | `(Mutable)Iterable<T>!`            |
| `Collection<T>`      | `Collection<T>`      | `MutableCollection<T>`          | `(Mutable)Collection<T>!`          |
| `Set<T>`             | `Set<T>`             | `MutableSet<T>`                 | `(Mutable)Set<T>!`                 |
| `List<T>`            | `List<T>`            | `MutableList<T>`                | `(Mutable)List<T>!`                |
| `ListIterator<T>`    | `ListIterator<T>`    | `MutableListIterator<T>`        | `(Mutable)ListIterator<T>!`        |
| `Map<K, V>`          | `Map<K, V>`          | `MutableMap<K, V>`              | `(Mutable)Map<K, V>!`              |
| `Map.Entry<K, V>`    | `Map.Entry<K, V>`    | `MutableMap.MutableEntry<K,V>` | `(Mutable)Map.(Mutable)Entry<K, V>!` |

Java's arrays are mapped as mentioned [below](java-interop.md#java-arrays):

| **Java type** | **Kotlin type**  |
|---------------|------------------|
| `int[]`       | `kotlin.IntArray!` |
| `String[]`    | `kotlin.Array<(out) String>!` |

>The static members of these Java types are not directly accessible on the [companion objects](object-declarations.md#companion-objects)
>of the Kotlin types. To call them, use the full qualified names of the Java types, e.g. `java.lang.Integer.toHexString(foo)`.
>
{type="note"}

## Java generics in Kotlin

Kotlin's generics are a little different from Java's (see [Generics](generics.md)).
When importing Java types to Kotlin, the following conversions are done:

* Java's wildcards are converted into type projections:
  * `Foo<? extends Bar>` becomes `Foo<out Bar!>!`
  * `Foo<? super Bar>` becomes `Foo<in Bar!>!`

* Java's raw types are converted into star projections:
  * `List` becomes `List<*>!` that is `List<out Any?>!`

Like Java's, Kotlin's generics are not retained at runtime: objects do not carry information about actual type arguments
passed to their constructors. For example, `ArrayList<Integer>()` is indistinguishable from `ArrayList<Character>()`.
This makes it impossible to perform `is`-checks that take generics into account.
Kotlin only allows `is`-checks for star-projected generic types:

```kotlin
if (a is List<Int>) // Error: cannot check if it is really a List of Ints
// but
if (a is List<*>) // OK: no guarantees about the contents of the list
```

## Java arrays

Arrays in Kotlin are invariant, unlike Java. This means that Kotlin won't let you assign an `Array<String>` to an `Array<Any>`,
which prevents a possible runtime failure. Passing an array of a subclass as an array of superclass to a Kotlin method is also prohibited,
but for Java methods this is allowed through [platform types](#null-safety-and-platform-types) of the form `Array<(out) String>!`.

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

To pass an array of primitive values, you can do the following in Kotlin:

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // passes int[] to method
```

When compiling to the JVM byte code, the compiler optimizes access to arrays so that there's no overhead introduced:

```kotlin
val array = arrayOf(1, 2, 3, 4)
array[1] = array[1] * 2 // no actual calls to get() and set() generated
for (x in array) { // no iterator created
    print(x)
}
```

Even when you navigate with an index, it does not introduce any overhead:

```kotlin
for (i in array.indices) { // no iterator created
    array[i] += 2
}
```

Finally, `in`-checks have no overhead either:

```kotlin
if (i in array.indices) { // same as (i >= 0 && i < array.size)
    print(array[i])
}
```

## Java varargs

Java classes sometimes use a method declaration for the indices with a variable number of arguments (varargs):

``` java
public class JavaArrayExample {

    public void removeIndicesVarArg(int... indices) {
        // code here...
    }
}
```

In that case you need to use the spread operator `*` to pass the `IntArray`:

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

It's currently not possible to pass `null` to a method that is declared as varargs.

## Operators

Since Java has no way of marking methods for which it makes sense to use the operator syntax, Kotlin allows using any
Java methods with the right name and signature as operator overloads and other conventions (`invoke()` etc.)
Calling Java methods using the infix call syntax is not allowed.

## Checked exceptions

In Kotlin, all [exceptions are unchecked](exceptions.md), meaning that the compiler does not force you to catch any of them.
So, when you call a Java method that declares a checked exception, Kotlin does not force you to do anything:

```kotlin
fun render(list: List<*>, to: Appendable) {
    for (item in list) {
        to.append(item.toString()) // Java would require us to catch IOException here
    }
}
```

## Object methods

When Java types are imported into Kotlin, all the references of the type `java.lang.Object` are turned into `Any`.
Since `Any` is not platform-specific, it only declares `toString()`, `hashCode()` and `equals()` as its members,
so to make other members of `java.lang.Object` available, Kotlin uses [extension functions](extensions.md).

### wait()/notify()

Methods `wait()` and `notify()` are not available on references of type `Any`. Their usage is generally discouraged in
favor of `java.util.concurrent`. If you really need to call these methods, you can cast to `java.lang.Object`:

```kotlin
(foo as java.lang.Object).wait()
```

### getClass()

To retrieve the Java class of an object, use the `java` extension property on a [class reference](reflection.md#class-references):

```kotlin
val fooClass = foo::class.java
```

The code above uses a [bound class reference](reflection.md#bound-class-references). You can also use the `javaClass` extension property:

```kotlin
val fooClass = foo.javaClass
```

### clone()

To override `clone()`, your class needs to extend `kotlin.Cloneable`:

```kotlin
class Example : Cloneable {
    override fun clone(): Any { ... }
}
```

Don't forget about [Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html),
Item 13: *Override clone judiciously*.

### finalize()

To override `finalize()`, all you need to do is simply declare it, without using the `override` keyword:

```kotlin
class C {
    protected fun finalize() {
        // finalization logic
    }
}
```

According to Java's rules, `finalize()` must not be `private`.

## Inheritance from Java classes

At most one Java class (and as many Java interfaces as you like) can be a supertype for a class in Kotlin.

## Accessing static members

Static members of Java classes form "companion objects" for these classes. You can't pass such a "companion object"
around as a value but can access the members explicitly, for example:

```kotlin
if (Character.isLetter(a)) { ... }
```

To access static members of a Java type that is [mapped](#mapped-types) to a Kotlin type, use the full qualified name of
the Java type: `java.lang.Integer.bitCount(foo)`.

## Java reflection

Java reflection works on Kotlin classes and vice versa. As mentioned above, you can use `instance::class.java`,
`ClassName::class.java` or `instance.javaClass` to enter Java reflection through `java.lang.Class`.
Do not use `ClassName.javaClass` for this purpose because it refers to `ClassName`'s companion object class,
which is the same as `ClassName.Companion::class.java` and not `ClassName::class.java`.

For each primitive type, there are two different Java classes, and Kotlin provides ways to get both. For
example, `Int::class.java` will return the class instance representing the primitive type itself,
corresponding to `Integer.TYPE` in Java. To get the class of the corresponding wrapper type, use
`Int::class.javaObjectType`, which is equivalent of Java's `Integer.class`.

Other supported cases include acquiring a Java getter/setter method or a backing field for a Kotlin property, a `KProperty` for a Java field, a Java method or constructor for a `KFunction` and vice versa.


## SAM conversions

Kotlin supports SAM conversions for both Java and [Kotlin interfaces](fun-interfaces.md). 
This support for Java means that Kotlin function literals can be automatically converted
into implementations of Java interfaces with a single non-default method, as long as the parameter types of the interface
method match the parameter types of the Kotlin function.

You can use this for creating instances of SAM interfaces:

```kotlin
val runnable = Runnable { println("This runs in a runnable") }
```

...and in method calls:

```kotlin
val executor = ThreadPoolExecutor()
// Java signature: void execute(Runnable command)
executor.execute { println("This runs in a thread pool") }
```

If the Java class has multiple methods taking functional interfaces, you can choose the one you need to call by
using an adapter function that converts a lambda to a specific SAM type. Those adapter functions are also generated
by the compiler when needed:

```kotlin
executor.execute(Runnable { println("This runs in a thread pool") })
```

> SAM conversions only work for interfaces, not for abstract classes, even if those also have just a single
abstract method.
>
{type="note"}

## Using JNI with Kotlin

To declare a function that is implemented in native (C or C++) code, you need to mark it with the `external` modifier:

```kotlin
external fun foo(x: Int): Double
```

The rest of the procedure works in exactly the same way as in Java.

You can also mark property getters and setters as `external`:

```kotlin
var myProperty: String
    external get
    external set
```

Behind the scenes, this will create two functions `getMyProperty` and `setMyProperty`, both marked as `external`.