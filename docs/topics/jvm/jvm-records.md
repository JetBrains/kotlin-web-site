[//]: # (title: Records)

_Records_ are [classes](https://openjdk.java.net/jeps/395) in Java for storing immutable data. Records carry a fixed set of values – the _records components_.
They have a concise syntax in Java and save you from having to write boilerplate code:

```java
// Java
public record Person (String name, int age) {}
```

The compiler automatically generates a final class inherited from [`java.lang.Record`](https://download.java.net/java/early_access/jdk16/docs/api/java.base/java/lang/Record.html) with the following members:
* a private final field for each record component
* a public constructor with parameters for all fields
* a set of methods to implement structural equality: `equals()`, `hashCode()`, `toString()`
* a public method for reading each record component

Records are very similar to Kotlin [data classes](data-classes.md).

## Using Java records from Kotlin code

You can use record classes with components that are declared in Java the same way you would use classes with properties in Kotlin.
To access the record component, just use its name like you do for [Kotlin properties](properties.md):

```kotlin
val firstName = Person.name
```

## Declare records in Kotlin

Kotlin supports record declaration only for data classes, and the data class must meet the [requirements](#requirements).

To declare a record class in Kotlin, use the `@JvmRecord` annotation:

> Applying `@JvmRecord` to an existing class is not a binary compatible change. It alters the naming convention of the class property accessors.
>
{type="note"}

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

## Further discussion

See this [language proposal for JVM records](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md) for further technical details and discussion.
