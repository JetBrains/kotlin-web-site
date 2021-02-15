[//]: # (title: Records)

> JVM records feature is [Experimental](components-stability.md). It may be dropped or changed at any time. Use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430).
>
{type="warning"}

_Records_ are Java specific classes for storing immutable data. Records carry a fixed set of values – the _records components_.
As compared to regular Java classes, they have a concise syntax in Java and save you from writing boilerplate code:

```java
public record Person (String name, int age) {}
```

The compiler automatically generates a final class inherited from [java.lang.Record](https://download.java.net/java/early_access/jdk16/docs/api/java.base/java/lang/Record.html) with the following members:
* a private final field for each record component
* a public constructor
* a set of methods to implement structural equality: `equals()`, `hashCode()`, `toString()`
* a public method for reading the component

Records are very similar to Kotlin [data clases](data-classes.md).

## Using Java records from Kotlin code

You can use record classes with components that are declared in Java just like classes with properties in Kotlin.
To access the record component, use its name like for [Kotlin properties](https://kotlinlang.org/docs/properties.html):

```kotlin
val firstName = Person.name
```

## Declare records in Kotlin

Kotlin supports records declaration only for data classes. The data class should meet the [requirements](#requirements).

To declare a record class in Kotlin, use the `@JvmRecord` annotation:

>Applying `@JvmRecord` to an existing class is not a binary compatible change. It alters the naming convention of the class property accessors.
>
{type="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

This JVM-specific annotation enables generating:

* the record components corresponding to the class properties in the class file
* the property accessor methods named according to the Java record naming convention

The data class provides `equals()`, `hashCode()`, `toString()` method implementations.

### Requirements

To declare a data class with the `@JvmRecord` annotation, it should meet the following requirements:

* The class shall be in a module that targets JVM 16 bytecode (or 15 if  the`-Xjvm-enable-preview` compiler option is enabled).
* The class cannot explicitly inherit any other class (including `Any`) because all JVM records implicitly inherit `java.lang.Record`.
* The class cannot declare any additional state – properties with backing fields – except those initialized from the corresponding primary constructor parameters.
* The class cannot declare any mutable state – mutable properties with backing fields.
* The class cannot be local.
* The primary constructor of the class must be as visible as the class itself.

## Enabling JVM records

To start using JVM records, add the compiler options `-Xjvm-enable-preview` and `-language-version 1.5`.

See [compiler options in Gradle](gradle.md#compiler-options) for details.

## Further discussion

See this [language proposal for JVM records](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md) for other technical details and discussion.


