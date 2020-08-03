---
type: doc
layout: reference
category: "Syntax"
title: "Serialization"
---

# Serialization

_Serialization_ is a process of converting data used by an application to a format that can be transferred over a network
or stored in a database or a file. In turn, _deserialization_ is an opposite process - reading data from an external source
and converting it into a runtime object. Combined together, they are an essential part of most applications that exchange
data with third parties. 

There are commonly used data serialization formats such as [JSON](https://www.json.org/json-en.html) or 
[protocol buffers](https://developers.google.com/protocol-buffers). Being language-neutral and platform-neutral, they
enable data exchange between systems written in any modern language.

In Kotlin, data serialization tools are available in a separate component [*kotlinx.serialization*](https://github.com/Kotlin/kotlinx.serialization).
It consists of two main parts: Gradle plugin `org.jetbrains.kotlin.plugin.serialization` and the runtime libraries. 

## Libraries

`kotlinx.serialization` provides a set of libraries for all supported platforms: JVM, JavaScript, Native, and for various
serialization formats: JSON, CBOR, protocol buffers, and others. Find the complete list of supported serialization formats [below](#formats).

All Kotlin serialization libraries belong to the `org.jetbrains.kotlinx:` group. Their names start from `kotlinx-serialization-`
and have suffixes that reflect the serialization format and the target platform: `-js`, `-native`. For the JVM and common
code of multiplatform projects, there is no suffix. Examples:
* `org.jetbrains.kotlinx:kotlinx-serialization-core` provides the JSON serialization on the JVM.
* `org.jetbrains.kotlinx:kotlinx-cbor-js provides the CBOR` serialization on the JavaScript platform.

Note that `kotlinx.serialization` libraries use their own versioning that don’t match the Kotlin versions. To find out the
latest version, check the releases on [GitHub](https://github.com/Kotlin/kotlinx.serialization/releases).

## Formats

`kotlinx.serialization` includes libraries for various serialization formats:

* [JSON](https://www.json.org/): `kotlinx-serialization-core`
* [protocol buffers](https://developers.google.com/protocol-buffers): `kotlinx-serialization-protobuf`
* [CBOR](https://cbor.io/): `kotlinx-serialization-cbor` 
* [properties](https://en.wikipedia.org/wiki/.properties): `kotlinx-serialization-properties`
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON.md): `kotlinx-serialization-hocon` (only on JVM)

Note that all libraries except JSON serialization (`kotlinx-serialization-core`) are in the experimental state: their
API can be change without notice.

There are also community-maintained libraries that support more serialization formats, such as [YAML](https://yaml.org/)
or [Apache Avro](https://avro.apache.org/). For detailed information about available serialization formats, see the 
[`kotlinx.serialization` documentation](https://github.com/Kotlin/kotlinx.serialization/formats.md).

## Example: JSON serialization
   
Let’s have a look at how to serialize objects of a Kotlin class into JSON.

To use the Kotlin serialization tools in your project, configure your build script:

1. Apply the Kotlin serialization Gradle plugin `org.jetbrains.kotlin.plugin.serialization` (or `kotlin(“plugin.serialization”)`
in the Kotlin Gradle DSL).

    <div class="multi-language-sample" data-lang="groovy">
    <div class="sample" markdown="1" theme="idea" mode='groovy'>
    
    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.jvm' version '{{ site.data.releases.latest.version }}'
        id 'org.jetbrains.kotlin.plugin.serialization' '{{ site.data.releases.latest.serialization.version }}'  
    }
    ```
    
    </div>
    </div>
    
    <div class="multi-language-sample" data-lang="kotlin">
    <div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>
    
    ```kotlin
    plugins {
        kotlin("jvm") version "{{ site.data.releases.latest.version }}"
        kotlin("plugin.serialization") version "{{ site.data.releases.latest.serialization.version }}"
    }
    ```
    
    </div>
    </div>

2. Add the dependency on the JSON serialization library `org.jetbrains.kotlinx:kotlinx-serialization-core:{{ site.data.releases.latest.serialization.version }}`

    <div class="multi-language-sample" data-lang="groovy">
    <div class="sample" markdown="1" theme="idea" mode='groovy'>
    
    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-serialization-core:{{ site.data.releases.latest.serialization.version }}'
    } 
    ```
    
    </div>
    </div>
    
    <div class="multi-language-sample" data-lang="kotlin">
    <div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>
    
    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:{{ site.data.releases.latest.serialization.version }}")
    } 
    ```
    
    </div>
    </div>

Now you're ready to use the serialization API in your code.

First, make a class serializable by annotating in with `@Serializable`.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Serializable
data class Data(val a: Int, val str: String = "42")
```
</div>

Now you can serialize an instance of this class by calling `Json.encodeToString()`.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
Json.encodeToString(Data(42))
```
</div>

As a result, you get a string containing the state of this object in the JSON format: `{"a": 42, "b": "42"}`

You can also serialize object collections, such as lists, in a single call.
 
<div class="sample" markdown="1" theme="idea" data-highlight-only>
 
 ```kotlin
val dataList = listOf(Data(42), Data(12, "test"))
val jsonList = Json.encodeToString(dataList)
 ```
</div>
  
To deserialize an object from JSON, use the `decodeFromString()` function:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
 
 ```kotlin
val obj = Json.decodeFromString<Data>("""{"a":42}""")
 ```
 </div>
 
For more information about serialization in Kotlin, see the [Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/docs/serialization-guide.md).