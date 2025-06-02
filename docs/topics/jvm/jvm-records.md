[//]: # (title: Using Java records in Kotlin)

_Records_ are [classes](https://openjdk.java.net/jeps/395) in Java for storing immutable data. Records carry a fixed set of values – the _records components_.
They have a concise syntax in Java and save you from having to write boilerplate code:

```java
// Java
public record Person (String name, int age) {}
```

The compiler automatically generates a final class inherited from [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html) with the following members:
* a private final field for each record component
* a public constructor with parameters for all fields
* a set of methods to implement structural equality: `equals()`, `hashCode()`, `toString()`
* a public method for reading each record component

Records are very similar to Kotlin [data classes](data-classes.md).

## Using Java records from Kotlin code

You can use record classes with components that are declared in Java the same way you would use classes with properties in Kotlin.
To access the record component, just use its name like you do for [Kotlin properties](properties.md):

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## Declare records in Kotlin

Kotlin supports record declaration only for data classes, and the data class must meet the [requirements](#requirements).

To declare a record class in Kotlin, use the `@JvmRecord` annotation:

> Applying `@JvmRecord` to an existing class is not a binary compatible change. It alters the naming convention of the class property accessors.
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

This JVM-specific annotation enables generating:

* the record components corresponding to the class properties in the class file
* the property accessor methods named according to the Java record naming convention

The data class provides `equals()`, `hashCode()`, and `toString()` method implementations.

### Requirements

To declare a data class with the `@JvmRecord` annotation, it must meet the following requirements:

* The class must be in a module that targets JVM 16 bytecode (or 15 if the `-Xjvm-enable-preview` compiler option is enabled).
* The class cannot explicitly inherit any other class (including `Any`) because all JVM records implicitly inherit `java.lang.Record`. However, the class can implement interfaces.
* The class cannot declare any properties with backing fields – except those initialized from the corresponding primary constructor parameters.
* The class cannot declare any mutable properties with backing fields.
* The class cannot be local.
* The primary constructor of the class must be as visible as the class itself.

### Enable JVM records

JVM records require the `16` target version or higher of the generated JVM bytecode.

To specify it explicitly, use the `jvmTarget` compiler option in [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm) or [Maven](maven.md#attributes-specific-to-jvm).

## Annotate record components in Kotlin

<primary-label ref="experimental-general"/>

In Java, [annotations](annotations.md) on a record component are automatically propagated to the backing field, getter, setter, and constructor parameter.
You can replicate this behavior in Kotlin by using the [`all`](annotations.md#all-meta-target) use-site target.

> To use the `all` use-site target, you must opt in. Either use the `-Xannotation-target-all` compiler option or add
> the following to your `build.gradle.kts` file:
>
> ```kotlin
> kotlin {
>     compilerOptions {
>         freeCompilerArgs.add("-Xannotation-target-all")
>     }
> }
> ```
>
{style="warning"}

For example:

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

When you use `@JvmRecord` with `@all:`, Kotlin:

* Propagates the annotation to the property, backing field, constructor parameter, getter and setter.
* Applies the annotation to the record component as well, if the annotation supports Java's `RECORD_COMPONENT`.

## Make annotations work with record components

To make an [annotation](annotations.md) available for both Kotlin properties **and** Java record components, add the
following meta-annotations to your annotation declaration:

* For Kotlin: [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)
* For Java record components: [`@java.lang.annotation.Target`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Target.html)

For example:

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

You can now apply `@ExampleClass` to Kotlin classes and properties, as well as Java classes and record components.

## Further discussion

See this [language proposal for JVM records](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md) for further technical details and discussion.
