[//]: # (title: UUIDs)
[//]: # (description: Learn how to use UUIDs in Kotlin, including creating, parsing, formatting, serializing, and working with UUID values across multiplatform and JVM code.)

The [`Uuid`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/)
class represents universally unique identifiers (UUIDs),
also known as Globally Unique Identifiers (GUIDs).

A `Uuid` is a 128-bit value used to uniquely identify an entity without
relying on a central system that assigns IDs. This makes UUIDs useful
in distributed applications, databases, client-generated records,
or [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) applications.

Use the `Uuid` class to work with UUID values. Unlike plain strings, a dedicated UUID
type makes your code more explicit and prevents accidental use of invalid values.

The Kotlin standard library provides the `Uuid` class in the `kotlin.uuid` package:

```kotlin
import kotlin.uuid.Uuid
```
## Generate UUIDs

To create a new random UUID, use the [`Uuid.random()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/random.html) function.
It generates a version 4 UUID from random values.

Use the `Uuid.random()` function for regular identifiers, such as user or database IDs.

```kotlin
import kotlin.uuid.Uuid
fun main() {
//sampleStart    
    val id = Uuid.random()
    println(id)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If your application require a specific version of UUIDs,
you can use the following functions:

* The [`Uuid.generateV4()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v4.html) function creates the same type of UUID as the `Uuid.random()` function
  but explicitly states that the value is a version 4 UUID.

  Use it when version 4 UUIDs are specifically required.

  ```kotlin
  import kotlin.uuid.Uuid
  fun main() {
  //sampleStart    
      val id = Uuid.generateV4()
      println(id)
  //sampleEnd    
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

* The [`Uuid.generateV7()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v7.html) function creates a version 7 UUID that contains
  a time-based component and random data.

  Use it when you need to sort UUIDs by creation time:

  ```kotlin
  import kotlin.uuid.Uuid
  fun main() {
  //sampleStart    
      val id = Uuid.generateV7()
      println(id)
  //sampleEnd    
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

  You can also generate a version 7 UUID for a specific moment in time,
  using the [`Uuid.generateV7NonMonotonicAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v7-non-monotonic-at.html) function.

> Learn more about the generation algorithm in the [API Reference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/).
>
{style="tip"}

## Parse UUIDs

Some UUIDs can be first represented as strings.
For example, when you receive a UUID from a URL parameter or database record.

To convert a `String` value to a `Uuid` value,
use the [`Uuid.parse()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse.htm) function:

```kotlin
val id = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
```

The `Uuid.parse()` function accepts both the standard hex-and-dash
format and hexadecimal format without dashes.

If the input is invalid, the `Uuid.parse()` function throws an `IllegalArgumentException`:

```kotlin
import kotlin.uuid.Uuid
fun main() { 
//sampleStart    
    val id = Uuid.parse("10")
    println(id)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

If your application accepts only one representation, use:

* The [`Uuid.parseHexDash()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-dash.html) function to parse from the hex-and dash string representation.
* The [`Uuid.parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) function to parse from the hexadecimal string representation without dashes.

For example:

```kotlin
val standard = Uuid.parseHexDash("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
val compact = Uuid.parseHex("de2bc56cea734f3c8a375a46fdb2d79a")
```

If you have UUIDs from external input, use the
[`Uuid.parseOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-or-null.html), [`Uuid.parseHexDashOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-dash-or-null.html),
or [`Uuid.parseHexOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-or-null.html)
functions to handle invalid values safely:

```kotlin
fun parseId (input: String): Uuid? {
    return Uuid.parseOrNull(input)
}
```

> Use the `Uuid.parseOrNull()`, `Uuid.parseHexDashOrNull()`, and `Uuid.parseHexOrNull()` functions
> when invalid input is part of your normal application workflow.
>
{style="tip"}

## Convert UUIDs

You can convert a `Uuid` value to a `String` value using the following functions:

* [`.toString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-string.html) for the standard string representation
* [`.toHexDashString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-dash-string.html) for the hex-and-dash format
* [`.toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) for the hexadecimal format without dashes

For example:

```kotlin
import kotlin.uuid.Uuid
fun main() {
//sampleStart    
    val id = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    
    println(id.toString()) // de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a
    println(id.toHexDashString()) // de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a
    println(id.toHexString()) // de2bc56cea734f3c8a375a46fdb2d79a 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Compare UUIDs

You can perform equality checks on the `Uuid` values using the `==` operator.

Kotlin evaluates values according to the UUID value, not to the textual representation.
For example, two values in the different forms are equal if they represent the same 128-bit value:

```kotlin
import kotlin.uuid.Uuid
fun main() {
//sampleStart    
    val first = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    val second = Uuid.parse("de2bc56cea734f3c8a375a46fdb2d79a")

    println(first == second) // true 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

This functionality makes the `Uuid` comparison safer than comparing UUIDs as strings.
String comparison fails if you write the same value in different formats.
`Uuid` comparison checks the actual identifier value.

You can also sort UUIDs using the `Comparable<Uuid>` interface. In that case,
Kotlin compares values lexicographically (from the most to the least significant bit):

```kotlin
import kotlin.uuid.Uuid
fun main() {
//sampleStart    
    val first = Uuid.generateV7()
    val second = Uuid.generateV7()

    val sorted = listOf(first, second).sorted()
    println(sorted) 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Work with bytes

Kotlin provides functionality to work with the 128-bit value of a UUID.
Use it when you need binary storage, custom serialization, or interoperability with other systems.

To convert a UUID to and from 16-byte representation, use the [`.toByteArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-byte-array.html)
and [`Uuid.fromByteArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/from-byte-array.html) functions:

```kotlin
import kotlin.uuid.Uuid
fun main() {
//sampleStart 
    val id = Uuid.random()

    val bytes = id.toByteArray()
    val original = Uuid.fromByteArray(bytes)
  
    println(id)
    
    println(bytes)
    println(original)

    println(id == original) // true
//sampleEnd  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can also create a UUID from two 64-bit values. Since Kotlin does not provide a built-in 128-bit integer type,
the API represents a UUID as two `Long` values using:
* The `mostSignificantBits` parameter for the first 64 bits of a UUID.
* The `leastSignificantBits` parameter for the last 64 bits of a UUID.

If another system gives you a UUID in the two-part format,
use the [`Uuid.fromLongs()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/from-longs.html) function to create a single `Uuid` value:

```kotlin
import kotlin.uuid.Uuid
fun main() {
//sampleStart 
    val id = Uuid.fromLongs(
        mostSignificantBits = -4653685776373167443,
        leastSignificantBits = -6288180676521310383.toLong()
    )
    println(id) // bf6ac971-52fd-4aad-a8bb-e4fdac78c751
//sampleEnd  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

To extract two parts from an existing `Uuid` value, use the [`Uuid.toLongs()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-longs.html) function:

```kotlin
import kotlin.uuid.Uuid
fun main() {
//sampleStart 
    val id = Uuid.random().toLongs { mostSignificantBits, leastSignificantBits ->
    println(mostSignificantBits)
    println(leastSignificantBits)
    }
//sampleEnd  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Serialize UUIDs

Kotlin supports serialization for the `Uuid` values.
Use it to store or transfer a UUID value outside Kotlin code, for example, in JSON APIs or configuration files.

To serialize a `Uuid` value, represent it as a `String` value unless otherwise required by your system.
The [`kotlinx.serialization`](https://kotlinlang.org/docs/serialization.html) functionality uses the standard hex-and-dash format:

```kotlin
//sampleStart 
import kotlin.uuid.Uuid
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

@Serializable
data class User(
    val id: Uuid,
    val name: String
)

fun main() {
    val user = User(
        id = Uuid.parse("de2bc56cea734f3c8a375a46fdb2d79a"),
        name = "Kotlin"
    )

    println(Json.encodeToString(user))
    // {"id":"de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a","name":"Kotlin"}
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Use UUIDs on the JVM

When you work on the JVM, you can interoperate your Kotlin code with Java libraries
that use the `java.util.UUID` class.

The `java.util.UUID` and `kotlin.unit.UUID` classes represent the same kind of values,
but they are two distinct types. You need to convert values explicitly to pass UUIDs between Kotlin and Java:

* Convert a Java UUID to Kotlin using the [`.toKotlinUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/to-kotlin-uuid.html) function:

  ```kotlin
  import kotlin.uuid.toKotlinUuid
  val kotlinId: Uuid = javaId.toKotlinUuid()
  ```

* Convert a Kotlin UUID to Java using the [`.toJavaUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/to-java-uuid.html) function:

  ```kotlin
  import kotlin.uuid.toJavaUuid
  val javaId: java.util.UUID = kotlinId.toJavaUuid()
  ```

These functions allow you to represent your UUID values using `Uuid` at JVM interoperability boundaries.

> The `java.util.UUID` and `kotlin.unit.UUID` classes are comparable, but the ordering may differ.
> Make sure to check your code that depends on UUID ordering before migrating from Java API to Kotlin API.
>
{style="note"}

Kotlin also provides support for working with Java buffers.
Use JVM-specific functions to work with UUIDs from a `ByteBuffer`:

* Use the [`.getUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/get-uuid.html) function to read a UUID from a buffer.
* Use the [`.putUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/put-uuid.html) function to write a UUID to a buffer.