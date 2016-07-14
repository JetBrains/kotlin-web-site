---
type: doc
layout: reference
category: "Syntax"
title: "Annotations"
---

# Annotations

## Annotation Declaration
Annotations are means of attaching metadata to code. To declare an annotation, put the *annotation*{: .keyword } modifier in front of a class:

``` kotlin
annotation class Fancy
```

Additional attributes of the annotation can be specified by annotating the annotation class with meta-annotations:

  * [`@Target`](/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html) specifies the possible kinds of
    elements which can be annotated with the annotation (classes, functions, properties, expressions etc.);
  * [`@Retention`](/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html) specifies whether the
    annotation is stored in the compiled class files and whether it's visible through reflection at runtime
    (by default, both are true);
  * [`@Repeatable`](/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html) allows using the same annotation
    on a single element multiple times;
  * [`@MustBeDocumented`](/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html) specifies that the
    annotation is part of the public API and should be included in the class or method signature shown in the
    generated API documentation.

``` kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION,
        AnnotationTarget.VALUE_PARAMETER, AnnotationTarget.EXPRESSION)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
public annotation class Fancy
```

### Usage

``` kotlin
@Fancy class Foo {
  @Fancy fun baz(@Fancy foo: Int): Int {
    return (@Fancy 1)
  }
}
```

If you need to annotate the primary constructor of a class, you need to add the *constructor*{: .keyword} keyword
to the constructor declaration, and add the annotations before it:


``` kotlin
class Foo @Inject constructor(dependency: MyDependency) {
  // ...
}
```

You can also annotate property accessors:

``` kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

### Constructors

Annotations may have constructors that take parameters.

``` kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

Allowed parameter types are:

 * types that correspond to Java primitive types (Int, Long etc.);
 * strings;
 * classes (`Foo::class`);
 * enums;
 * other annotations;
 * arrays of the types listed above.

If an annotation is used as a parameter of another annotation, its name is not prefixed with the @ character:

``` kotlin
public annotation class ReplaceWith(val expression: String)

public annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

If you need to specify a class as an argument of an annotation, use a Kotlin class
([KClass](/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html)). The Kotlin compiler will
automatically convert it to a Java class, so that the Java code will be able to see the annotations and arguments
normally.

``` kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any?>)

@Ann(String::class, Int::class) class MyClass
```

### Lambdas

Annotations can also be used on lambdas. They will be applied to the `invoke()` method into which the body
of the lambda is generated. This is useful for frameworks like [Quasar](http://www.paralleluniverse.co/quasar/),
which uses annotations for concurrency control.

``` kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## Annotation Use-site Targets

When you're annotating a property or a primary constructor parameter, there are multiple Java elements which are
generated from the corresponding Kotlin element, and therefore multiple possible locations for the annotation in
the generated Java bytecode. To specify how exactly the annotation should be generated, use the following syntax:

``` kotlin
class Example(@field:Ann val foo,    // annotate Java field
              @get:Ann val bar,      // annotate Java getter
              @param:Ann val quux)   // annotate Java constructor parameter
```

The same syntax can be used to annotate the entire file. To do this, put an annotation with the target `file` at
the top level of a file, before the package directive or before all imports if the file is in the default package:

``` kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

If you have multiple annotations with the same target, you can avoid repeating the target by adding brackets after the
target and putting all the annotations inside the brackets:

``` kotlin
class Example {
     @set:[Inject VisibleForTesting]
     public var collaborator: Collaborator
}
```

The full list of supported use-site targets is:

  * `file`
  * `property` (annotations with this target are not visible to Java)
  * `field`
  * `get` (property getter)
  * `set` (property setter)
  * `receiver` (receiver parameter of an extension function or property)
  * `param` (constructor parameter)
  * `setparam` (property setter parameter)
  * `delegate` (the field storing the delegate instance for a delegated property)

To annotate the receiver parameter of an extension function, use the following syntax:

``` kotlin
fun @receiver:Fancy String.myExtension() { }
```

If you don't specify a use-site target, the target is chosen according to the `@Target` annotation of the annotation
being used. If there are multiple applicable targets, the first applicable target from the following list is used:

  * `param`
  * `property`
  * `field`


## Java Annotations

Java annotations are 100% compatible with Kotlin:

``` kotlin
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
call syntax for passing the arguments. Instead, you need to use the named argument syntax.

``` java
// Java
public @interface Ann {
    int intValue();
    String stringValue();
}
```

``` kotlin
// Kotlin
@Ann(intValue = 1, stringValue = "abc") class C
```

Just like in Java, a special case is the `value` parameter; its value can be specified without an explicit name.

``` java
// Java
public @interface AnnWithValue {
    String value();
}
```

``` kotlin
// Kotlin
@AnnWithValue("abc") class C
```

If the `value` argument in Java has an array type, it becomes a `vararg` parameter in Kotlin:

``` java
// Java
public @interface AnnWithArrayValue {
    String[] value();
}
```

``` kotlin
// Kotlin
@AnnWithArrayValue("abc", "foo", "bar") class C
```

For other arguments that have an array type, you need to use `arrayOf` explicitly:

``` java
// Java
public @interface AnnWithArrayMethod {
    String[] names();
}
```

``` kotlin
// Kotlin
@AnnWithArrayMethod(names = arrayOf("abc", "foo", "bar")) class C
```

Values of an annotation instance are exposed as properties to Kotlin code.

``` java
// Java
public @interface Ann {
    int value();
}
```

``` kotlin
// Kotlin
fun foo(ann: Ann) {
    val i = ann.value
}
```
