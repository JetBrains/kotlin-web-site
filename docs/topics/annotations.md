[//]: # (title: Annotations)

Annotations are a means of attaching metadata to code. To declare an annotation, put the `annotation` modifier in front of a class:

```kotlin
annotation class Fancy
```

Additional attributes of the annotation can be specified by annotating the annotation class with meta-annotations:

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html) specifies the possible kinds of
    elements which can be annotated with the annotation (such as classes, functions, properties, and expressions);
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html) specifies whether the
    annotation is stored in the compiled class files and whether it's visible through reflection at runtime
    (by default, both are true);
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html) allows using the same annotation
    on a single element multiple times;
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html) specifies that the
    annotation is part of the public API and should be included in the class or method signature shown in the
    generated API documentation.

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION,
        AnnotationTarget.TYPE_PARAMETER, AnnotationTarget.VALUE_PARAMETER, 
        AnnotationTarget.EXPRESSION)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
annotation class Fancy
```

## Usage

```kotlin
@Fancy class Foo {
    @Fancy fun baz(@Fancy foo: Int): Int {
        return (@Fancy 1)
    }
}
```

If you need to annotate the primary constructor of a class, you need to add the `constructor` keyword
to the constructor declaration, and add the annotations before it:

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

You can also annotate property accessors:

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

## Constructors

Annotations can have constructors that take parameters.

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

Allowed parameter types are:

 * Types that correspond to Java primitive types (Int, Long etc.)
 * Strings
 * Classes (`Foo::class`)
 * Enums
 * Other annotations
 * Arrays of the types listed above

Annotation parameters cannot have nullable types, because the JVM does not support storing `null` as a value
of an annotation attribute.

If an annotation is used as a parameter of another annotation, its name is not prefixed with the `@` character:

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

If you need to specify a class as an argument of an annotation, use a Kotlin class
([KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html)). The Kotlin compiler will
automatically convert it to a Java class, so that the Java code can access the annotations and arguments
normally.

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## Instantiation

In Java, an annotation type is a form of an interface, so you can implement it and use an instance.
As an alternative to this mechanism, Kotlin lets you call a constructor of an annotation class in arbitrary code 
and similarly use the resulting instance.

```kotlin
annotation class InfoMarker(val info: String)

fun processInfo(marker: InfoMarker): Unit = TODO()

fun main(args: Array<String>) {
    if (args.isNotEmpty())
        processInfo(getAnnotationReflective(args))
    else
        processInfo(InfoMarker("default"))
}
```

Learn more about instantiation of annotation classes in [this KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md).

## Lambdas

Annotations can also be used on lambdas. They will be applied to the `invoke()` method into which the body
of the lambda is generated. This is useful for frameworks like [Quasar](https://docs.paralleluniverse.co/quasar/),
which uses annotations for concurrency control.

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## Annotation use-site targets

When you're annotating a property or a primary constructor parameter, there are multiple Java elements that are
generated from the corresponding Kotlin element, and therefore multiple possible locations for the annotation in
the generated Java bytecode. To specify how exactly the annotation should be generated, use the following syntax:

```kotlin
class Example(@field:Ann val foo,    // annotate only the Java field
              @get:Ann val bar,      // annotate only the Java getter
              @param:Ann val quux)   // annotate only the Java constructor parameter
```

The same syntax can be used to annotate the entire file. To do this, put an annotation with the target `file` at
the top level of a file, before the package directive or before all imports if the file is in the default package:

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

If you have multiple annotations with the same target, you can avoid repeating the target by adding brackets after the
target and putting all the annotations inside the brackets (except for the `all` meta-target):

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

The full list of supported use-site targets is:

  * `file`
  * `property` (annotations with this target are not visible to Java)
  * `field`
  * `get` (property getter)
  * `set` (property setter)
  * `all` (an experimental meta-target for properties, see [below](#all-meta-target) for its purpose and usage)
  * `receiver` (receiver parameter of an extension function or property)

    To annotate the receiver parameter of an extension function, use the following syntax:

    ```kotlin
    fun @receiver:Fancy String.myExtension() { ... }
    ```
    
  * `param` (constructor parameter)
  * `setparam` (property setter parameter)
  * `delegate` (the field storing the delegate instance for a delegated property)

### `all` meta-target

<primary-label ref="experimental-opt-in"/>

The `all` target makes it more convenient to cover all important cases when the same annotation needs to apply
not only to the parameter and the property or field but also to the corresponding getter and setter.

Specifically, the annotation marked with `all` is propagated, if applicable:

* To the constructor parameter (`param`) if the property is defined in the primary constructor.
* To the property itself (`property`).
* To the backing field (`field`) if the property has one.
* To the getter (`get`).
* To the setter parameter (`setparam`) if the property is defined as `var`.
* To the Java-only target `RECORD_COMPONENT` if the class has the `@JvmRecord` annotation.

In the example below, the `@Email` annotation is applied to all relevant targets of each property:
```kotlin
data class User(
    val username: String,
    // Applies `@Email` to `param`, `property`, `field` and `get`
    @all:Email val email: String,
    // Applies `@Email` to `param`, `property`, `field`, `get`, and `set_param`
    @all:Email var name: String,
) {
    // Applies `@Email` to `property`, `field`, and `getter` (no `param` since it's not in the constructor)
    @all:Email val secondaryEmail: String? = null
}

```suggestion

You can use the `@all` meta-target with any property, both inside and outside the primary constructor.

The `all` target comes with some limitations:

* It does not propagate an annotation to types, potential extension receivers, or context receivers or parameters.
* It cannot be used with multiple annotations:
    ```kotlin
    @all:[A B] // forbidden, use `@all:A @all:B`
    val x: Int = 5
    ```
* It cannot be used with [delegated properties](delegated-properties.md).

To enable the `@all` meta-target in your project, use the following compiler option in the command line:

```Bash
-Xannotation-target-all
```

Or add it to the `compilerOptions {}` block of your Gradle build file:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

### Defaults when no use-site targets are specified

If you don't specify a use-site target, the target is chosen according to the `@Target` annotation of the annotation
being used.
If there are multiple applicable targets, the first applicable target from the following list is used:

* `param`
* `property`
* `field`

For example:

```kotlin
data class User(val username: String,
                // @Email here is equivalent to @param:Email
                @Email val email: String) {
    // @Email here is equivalent to @field:Email
    @Email val secondaryEmail: String? = null
}
```

Kotlin %kotlinEapVersion% introduced an experimental defaulting rule which should
make propagating annotations to parameters, fields, and properties more predictable.

With the new rule, if there are multiple applicable targets, one or more is chosen as follows:

* If the constructor parameter target (`param`) is applicable, it is used.
* If the property target (`property`) is applicable, it is used.
* If the field target (`field`) is applicable while `property` isn't, `field` is used.

Using the same example:

```kotlin
data class User(val username: String,
                // @Email here is now equivalent to @param:Email @field:Email
                @Email val email: String) {
    // @Email here is still equivalent to @field:Email
    @Email val secondaryEmail: String? = null
}
```

If there are multiple targets, and none of `param`, `property`, or `field` are applicable, the annotation is invalid.

To enable the new defaulting rule, use the following line in your Gradle configuration:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

Whenever you'd like to use the old behavior, you can:

* In a specific case, specify the necessary target explicitly, for example, using `@param:Annotation` instead of `@Annotation`.
* For a whole project, use this flag in your Gradle build file:

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```


## Java annotations

Java annotations are 100% compatible with Kotlin:

```kotlin
import org.junit.Test
import org.junit.Assert.*
import org.junit.Rule
import org.junit.rules.*

class Tests {
    // apply @Rule annotation to property getter
    @get:Rule val tempFolder = TemporaryFolder()

    @Test fun simple() {
        val f = tempFolder.newFile()
        assertEquals(42, getTheAnswer())
    }
}
```

Since the order of parameters for an annotation written in Java is not defined, you can't use a regular function
call syntax for passing the arguments. Instead, you need to use the named argument syntax:

``` java
// Java
public @interface Ann {
    int intValue();
    String stringValue();
}
```

```kotlin
// Kotlin
@Ann(intValue = 1, stringValue = "abc") class C
```

Just like in Java, a special case is the `value` parameter; its value can be specified without an explicit name:

``` java
// Java
public @interface AnnWithValue {
    String value();
}
```

```kotlin
// Kotlin
@AnnWithValue("abc") class C
```

### Arrays as annotation parameters

If the `value` argument in Java has an array type, it becomes a `vararg` parameter in Kotlin:

``` java
// Java
public @interface AnnWithArrayValue {
    String[] value();
}
```

```kotlin
// Kotlin
@AnnWithArrayValue("abc", "foo", "bar") class C
```

For other arguments that have an array type, you need to use the array literal syntax or 
`arrayOf(...)`:

``` java
// Java
public @interface AnnWithArrayMethod {
    String[] names();
}
```

```kotlin
@AnnWithArrayMethod(names = ["abc", "foo", "bar"]) 
class C
```

### Accessing properties of an annotation instance

Values of an annotation instance are exposed as properties to Kotlin code:

``` java
// Java
public @interface Ann {
    int value();
}
```

```kotlin
// Kotlin
fun foo(ann: Ann) {
    val i = ann.value
}
```

### Ability to not generate JVM 1.8+ annotation targets

If a Kotlin annotation has `TYPE` among its Kotlin targets, the annotation maps to `java.lang.annotation.ElementType.TYPE_USE`
in its list of Java annotation targets. This is just like how the `TYPE_PARAMETER` Kotlin target maps to
the `java.lang.annotation.ElementType.TYPE_PARAMETER` Java target. This is an issue for Android clients with API levels
less than 26, which don't have these targets in the API.

To avoid generating the `TYPE_USE` and `TYPE_PARAMETER` annotation targets, use the new compiler argument `-Xno-new-java-annotation-targets`.

## Repeatable annotations

Just like [in Java](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html), Kotlin has repeatable annotations,
which can be applied to a single code element multiple times. To make your annotation repeatable, mark its declaration
with the [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/)
meta-annotation. This will make it repeatable both in Kotlin and Java. Java repeatable annotations are also supported
from the Kotlin side.

The main difference with the scheme used in Java is the absence of a _containing annotation_, which the Kotlin compiler
generates automatically with a predefined name. For an annotation in the example below, it will generate the containing
annotation `@Tag.Container`:

```kotlin
@Repeatable
annotation class Tag(val name: String)

// The compiler generates the @Tag.Container containing annotation
```

You can set a custom name for a containing annotation by applying the
[`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) meta-annotation
and passing an explicitly declared containing annotation class as an argument:

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

To extract Kotlin or Java repeatable annotations via reflection, use the [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html)
function.

Learn more about Kotlin repeatable annotations in [this KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md).