[//]: # (title: Serialization)

_Serialization_ is the process of converting data used by an application to a format that can be transferred over a network
or stored in a database or a file. In turn, _deserialization_ is the opposite process of reading data from an external source
and converting it into a runtime object. Together they are an essential part of most applications that exchange
data with third parties. 

Some data serialization formats, such as [JSON](https://www.json.org/json-en.html) and 
[protocol buffers](https://developers.google.com/protocol-buffers) are particularly common. Being language-neutral and
platform-neutral, they enable data exchange between systems written in any modern language.

In Kotlin, data serialization tools are available in a separate component, [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization).
It consists of two main parts: the Gradle plugin –`org.jetbrains.kotlin.plugin.serialization` and the runtime libraries. 

## Libraries

`kotlinx.serialization` provides sets of libraries for all supported platforms – JVM, JavaScript, Native – and for various
serialization formats – JSON, CBOR, protocol buffers, and others. You can find the complete list of supported serialization
formats [below](#formats).

All Kotlin serialization libraries belong to the `org.jetbrains.kotlinx:` group. Their names start with `kotlinx-serialization-`
and have suffixes that reflect the serialization format. Examples:
* `org.jetbrains.kotlinx:kotlinx-serialization-json` provides JSON serialization for Kotlin projects.
* `org.jetbrains.kotlinx:kotlinx-serialization-cbor` provides CBOR serialization.

Platform-specific artifacts are handled automatically; you don't need to add them manually. Use the same dependencies in
JVM, JS, Native, and multiplatform projects.

Note that the `kotlinx.serialization` libraries use their own versioning structure, which doesn't match Kotlin's versioning. Check out the
releases on [GitHub](https://github.com/Kotlin/kotlinx.serialization/releases) to find the latest versions.
## Formats

`kotlinx.serialization` includes libraries for various serialization formats:

* [JSON](https://www.json.org/): [`kotlinx-serialization-json`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#json)
* [Protocol buffers](https://developers.google.com/protocol-buffers): [`kotlinx-serialization-protobuf`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#protobuf)
* [CBOR](https://cbor.io/): [`kotlinx-serialization-cbor`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#cbor)
* [Properties](https://en.wikipedia.org/wiki/.properties): [`kotlinx-serialization-properties`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#properties)
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON.md): [`kotlinx-serialization-hocon`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#hocon) (only on JVM)

Note that all libraries except JSON serialization (`kotlinx-serialization-core`) are [Experimental](components-stability.md),
which means their API can be changed without notice.

There are also community-maintained libraries that support more serialization formats, such as [YAML](https://yaml.org/)
or [Apache Avro](https://avro.apache.org/). For detailed information about available serialization formats, see the 
[`kotlinx.serialization` documentation](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md).

## Example: JSON serialization

Let’s take a look at how to serialize Kotlin objects into JSON.

Before starting, you’ll need to configure your build script so that you can use Kotlin serialization tools in your project:

1. Apply the Kotlin serialization Gradle plugin `org.jetbrains.kotlin.plugin.serialization` (or `kotlin(“plugin.serialization”)`
in the Kotlin Gradle DSL).

    <tabs>

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
        id 'org.jetbrains.kotlin.plugin.serialization' version '%kotlinVersion%'  
    }
    ```

    ```kotlin
    plugins {
        kotlin("jvm") version "%kotlinVersion%"
        kotlin("plugin.serialization") version "%kotlinVersion%"
    }
    ```

    </tabs>

2. Add the JSON serialization library dependency:`org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%`

    <tabs>

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%'
    } 
    ```

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%")
    } 
    ```

    </tabs>

Now you're ready to use the serialization API in your code.

First, make a class serializable by annotating it with `@Serializable`.

```kotlin
@Serializable
data class Data(val a: Int, val b: String)
```

You can now serialize an instance of this class by calling `Json.encodeToString()`.

```kotlin
Json.encodeToString(Data(42, "str"))
```

As a result, you get a string containing the state of this object in the JSON format: `{"a": 42, "b": "str"}`

You can also serialize object collections, such as lists, in a single call.

```kotlin
val dataList = listOf(Data(42, "str"), Data(12, "test"))
val jsonList = Json.encodeToString(dataList)
```

To deserialize an object from JSON, use the `decodeFromString()` function:

```kotlin
val obj = Json.decodeFromString<Data>("""{"a":42, "b": "str"}""")
```
 
For more information about serialization in Kotlin, see the [Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md).