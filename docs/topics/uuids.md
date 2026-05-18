[//]: # (title: UUIDs)
[//]: # (description: Learn how to use UUIDs in Kotlin, including creating, parsing, formatting, serializing, and working with UUID values across multiplatform and JVM code.)

The [`Uuid`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/)
class represents Universally Unique Identifiers (UUIDs),
also known as Globally Unique Identifiers (GUIDs).

A `Uuid` is a 128-bit value used to uniquely identify an entity without
relying on a central system that assigns IDs. This makes UUIDs useful
in distributed applications, databases, client-generated records,
or [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) applications.

Use the `Uuid` class to work with UUID values. Unlike plain strings, a dedicated UUID
type makes your code more explicit and prevents accidental use of invalid values.

To use UUIDs in your project, import the `Uuid` class from the `kotlin.uuid` package:

```kotlin
import kotlin.uuid.Uuid
```

## Generate UUIDs

To generate a random version 4 UUID for regular identifiers, such as user or database IDs, 
use the [`Uuid.random()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/random.html) function:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart    
    val id = Uuid.random()
    println(id)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

You can also generate a specific version of UUIDs:

* Use the [`Uuid.generateV4()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v4.html) function to generate a version 4 UUID: 

  ```kotlin
  import kotlin.uuid.Uuid
  
  fun main() { 
  //sampleStart    
      val id = Uuid.generateV4()
      println(id)
  //sampleEnd    
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

  This function makes the UUID version explicit, but otherwise works
  the same as the `Uuid.random()` function.

* Use the [`Uuid.generateV7()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v7.html) function to generate a version 7 UUID that contains
  a time-based component and random data:

  ```kotlin
  import kotlin.uuid.Uuid
  
  fun main() {
  //sampleStart    
      val id = Uuid.generateV7()
      println(id)
  //sampleEnd    
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

  Use the `Uuid.generateV7()` function when you need to sort UUIDs by creation time.

  You can also generate a version 7 UUID for a specific moment in time
  with the [`Uuid.generateV7NonMonotonicAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v7-non-monotonic-at.html) function.

## Parse UUIDs

UUID values are often represented as strings,
such as in URL parameters or database records.

To convert a `String` value to a `Uuid` value,
use the [`Uuid.parse()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse.htm) function:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart
    val id = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    println(id)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="true"}

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
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

If your application accepts only one representation, use
the format specific-functions:

* [`Uuid.parseHexDash()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-dash.html) for the hex-and-dash string representation.
* [`Uuid.parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) for the hexadecimal string representation without dashes.

For example:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart  
    val standard = Uuid.parseHexDash("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    val compact = Uuid.parseHex("de2bc56cea734f3c8a375a46fdb2d79a")
    
    println(standard)
    println(compact)
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3" validate="true"}

If you have UUIDs from external sources and must handle invalid input safely,
use [`Uuid.parseOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-or-null.html), [`Uuid.parseHexDashOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-dash-or-null.html),
or [`Uuid.parseHexOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex-or-null.html). 
These functions return `null` if the input is invalid:

```kotlin
fun parseId (input: String): Uuid? { 
    return Uuid.parseOrNull(input) 
}
```

## Convert UUIDs to strings

You can convert a `Uuid` value to a `String` value with the following functions:

* [`toString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-string.html) for the standard string representation
* [`toHexDashString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-dash-string.html) for the hex-and-dash format
* [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) for the hexadecimal format without dashes

For example:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart    
    val id = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    
    println(id.toString())
    // de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a
    println(id.toHexDashString())
    // de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a
    println(id.toHexString())
    // de2bc56cea734f3c8a375a46fdb2d79a 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3" validate="true"}

## Compare UUIDs

You can check whether `Uuid` values are equal using the `==` operator.

Kotlin compares values according to the UUID value, not to the textual representation.
For example, two values in different forms are equal if they represent the same 128-bit value:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart    
    val first = Uuid.parse("de2bc56c-ea73-4f3c-8a37-5a46fdb2d79a")
    val second = Uuid.parse("de2bc56cea734f3c8a375a46fdb2d79a")

    println(first == second) 
    // true 
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.3" validate="true"}

This makes the `Uuid` comparison more reliable than string comparing,
which treats the same value in different formats as different values.
`Uuid` comparison checks the actual identifier value.

`Uuid` implements the `Comparable<Uuid>` interface, so UUID values can be sorted with standard collection
functions such as `sorted()`. In that case,
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
{kotlin-runnable="true" kotlin-min-compiler-version="2.3"}

## Work with binary representations

Some APIs, storage formats, and binary protocols do not represent UUIDs as strings. 
Instead, they store the 128-bit UUID value as either:

* A 16-byte array 
* Two 64-bit values

Use these representations when you need to exchange UUIDs with systems that expect binary UUID data.

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

    println(id == original) 
    // true
//sampleEnd  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0"}

You can also represent the same 128-bit UUID value as two `Long` values. 
This is useful because Kotlin does not provide a built-in 128-bit integer type. 
The two `Long` values store the UUID in two parts:
* The `mostSignificantBits` parameter for the first 64 bits of a UUID.
* The `leastSignificantBits` parameter for the last 64 bits of a UUID.

To create a `Uuid` value from two `Long` values,
use the [`Uuid.fromLongs()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/from-longs.html) function:

```kotlin
import kotlin.uuid.Uuid

fun main() {
//sampleStart 
    val id = Uuid.fromLongs(
        mostSignificantBits = -4653685776373167443,
        leastSignificantBits = -6288180676521310383.toLong()
    )
    println(id) 
    // bf6ac971-52fd-4aad-a8bb-e4fdac78c751
//sampleEnd  
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="true"}

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
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="true"}

## Serialize UUIDs

Kotlin supports serialization for `Uuid` values.
Use it to store or transfer a UUID value outside Kotlin code, for example, in JSON APIs or configuration files.

To serialize a `Uuid` value, represent it as a string unless your application requires another format.
The [`kotlinx.serialization`](https://kotlinlang.org/docs/serialization.html) library uses the hex-and-dash format:

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
{kotlin-runnable="true" kotlin-min-compiler-version="2.3" validate="true"}

## Use UUIDs with Java APIs

When you work on the JVM, you can interoperate your Kotlin code with Java libraries
that use the `java.util.UUID` class.

The `java.util.UUID` and `kotlin.unit.UUID` classes represent the same kind of values,
but they are two distinct types. You need to convert values explicitly to pass UUIDs between Kotlin and Java:

* Convert a Java UUID to Kotlin with the [`.toKotlinUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/to-kotlin-uuid.html) extension function:

  ```kotlin
  import kotlin.uuid.toKotlinUuid
  
  val kotlinId: Uuid = javaId.toKotlinUuid()
  ```

* Convert a Kotlin UUID to Java with the [`.toJavaUuid()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/to-java-uuid.html) extension function:

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