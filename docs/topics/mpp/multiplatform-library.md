[//]: # (title: Create and publish a multiplatform library – tutorial)

In this tutorial, you will learn how to create a multiplatform library for Kotlin/JVM, Kotlin/JS, and Kotlin/Native, write tests that will be executed on all platforms, and publish the library to a local Maven repository.

The library that you will create converts raw data (strings and byte arrays) to the [Base64](https://en.wikipedia.org/wiki/Base64) format, which can be used on Kotlin/JVM, Kotlin/JS, and any available Kotlin/Native platform.
* For JVM implementation, you will use the [`java.util.Base64` class](https://docs.oracle.com/javase/8/docs/api/java/util/Base64.html), which is efficient because JVM compiles it in a special way.
* For JS, you will use the [Buffer API](https://nodejs.org/docs/latest/api/buffer.html).
* For Kotlin/Native, you will write your own implementation.

You will also test your code with common tests, and then publish the resulting library to local Maven.

## Set up the environment

You can use any operating system for completing this tutorial.
Download and install the [latest version of IntelliJ IDEA](http://www.jetbrains.com/idea/download/index.html) with the [latest Kotlin plugin](releases.md).

## Create a project

1. In IntelliJ IDEA, select **File | New | Project**.
2. In the panel on the left, select **Kotlin**.
3. Enter a project name and select **Library** under **Multiplatform** as the project template.

   ![Select a project template](mpp-project-1.png)


4. Select the Kotlin Gradle DSL.
5. Specify the [JDK](https://www.jetbrains.com/help/idea/sdk.html#jdk), which is required for developing Kotlin projects.
5. Click **Next**, and then click **Finish**.

The wizard will create a sample multiplatform library with the following structure:

![Multiplatform library structure](mpp-lib-structure.png){width=250}

## Cross-platform code

Define the classes and interfaces you are going to implement.

1. In the `commonMain/kotlin` directory, create the structure `org/jetbrains/base64`.
2. Create the `Base64.kt` file in the new directory.
3. Define the `Base64Encoder` interface that converts bytes to bytes in the `Base64` format:

    ```kotlin
    package org.jetbrains.base64
    
    interface Base64Encoder {
        fun encode(src: ByteArray): ByteArray
    }
    ```

4. Define the `Base64Factory` object to provide an instance of the `Base64Encoder` interface to the common code:

    ```kotlin
    expect object Base64Factory {
        fun createEncoder(): Base64Encoder
    }
    ```

The factory object is marked with the `expect` keyword in the cross-platform code. 
For each platform, you should provide an `actual` implementation of the `Base64Factory` object with the platform-specific encoder.
Learn more about [platform-specific implementations](mpp-connect-to-apis.md).

## Platform-specific implementations

Now it is time to provide `actual` implementations of the `Base64Factory` object for each platform:

* [JVM](#jvm)
* [JS](#js)
* [Native](#native)

### JVM

1. In the `jvmMain/kotlin` directory, create the structure `org/jetbrains/base64`.
2. Create the `Base64.kt` file in the new directory.
3. Provide a simple implementation of the `Base64Factory` object that delegates to the `java.util.Base64` class:

    > IDEA inspections help create `actual` implementations for an `expect` declaration.
    > 
    > {type="note"}

    ```kotlin
    package org.jetbrains.base64
    import java.util.*
    
    actual object Base64Factory {
        actual fun createEncoder(): Base64Encoder = JvmBase64Encoder
    }
    
    object JvmBase64Encoder : Base64Encoder {
        override fun encode(src: ByteArray): ByteArray = Base64.getEncoder().encode(src)
    }
    ```

Pretty simple, isn't it?! You've provided a platform-specific implementation by using a straightforward delegation to an implementation of someone else.

### JS

The JS implementation will be very similar to the JVM one. 

1. In the `jsMain/kotlin` directory, create the structure `org/jetbrains/base64`.
2. Create the `Base64.kt` file in the new directory.
3. Provide a simple implementation of the `Base64Factory` object that delegates to  the NodeJS `Buffer` API:

    ```kotlin
    package org.jetbrains.base64
   
    actual object Base64Factory {
        actual fun createEncoder(): Base64Encoder = JsBase64Encoder
    }
    
    object JsBase64Encoder : Base64Encoder {
        override fun encode(src: ByteArray): ByteArray {
            val buffer = js("Buffer").from(src)
            val string = buffer.toString("base64") as String
            return ByteArray(string.length) { string[it].toByte() }
        }
    }
    ```

### Native

Unfortunately, for Kotlin/Native there is no way to reuse implementation of someone else, and you need to write it yourself.

1. In the `nativeMain/kotlin` directory, create the structure `org/jetbrains/base64`.
2. Create the `Base64.kt` file in the new directory.
3. Provide your own implementation for the `Base64Factory` object:

    ```kotlin
    package org.jetbrains.base64
    
    private val BASE64_ALPHABET: String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    private val BASE64_MASK: Byte = 0x3f
    private val BASE64_PAD: Char = '='
    private val BASE64_INVERSE_ALPHABET = IntArray(256) {
        BASE64_ALPHABET.indexOf(it.toChar())
    }
    
    private fun Int.toBase64(): Char = BASE64_ALPHABET[this]
    
    actual object Base64Factory {
        actual fun createEncoder(): Base64Encoder = NativeBase64Encoder
    }
    
    object NativeBase64Encoder : Base64Encoder {
        override fun encode(src: ByteArray): ByteArray {
            fun ByteArray.getOrZero(index: Int): Int = if (index >= size) 0 else get(index).toInt()
            // 4n / 3 is expected Base64 payload
            val result = ArrayList<Byte>(4 * src.size / 3)
            var index = 0
            while (index < src.size) {
                val symbolsLeft = src.size - index
                val padSize = if (symbolsLeft >= 3) 0 else (3 - symbolsLeft) * 8 / 6
                val chunk = (src.getOrZero(index) shl 16) or (src.getOrZero(index + 1) shl 8) or src.getOrZero(index + 2)
                index += 3
    
                for (i in 3 downTo padSize) {
                    val char = (chunk shr (6 * i)) and BASE64_MASK.toInt()
                    result.add(char.toBase64().toByte())
                }
                // Fill the pad with '='
                repeat(padSize) { result.add(BASE64_PAD.toByte()) }
            }
    
            return result.toByteArray()
        }
    }
    ```

## Test your library

Now when you have `actual` implementations of the `Base64Factory` object for all platforms, it's time to test your multiplatform library.

To save time on testing, don't test each platform separately – write common tests that will be executed on each platform.

Before writing tests, add the `encodeToString` method with the default implementation to the `Base64Encoder` interface, which is defined in `commonMain/kotlin/org/jetbrains/base64/Base64.kt`.
This implementation converts byte arrays to strings, which are much easier to test. 

```kotlin
interface Base64Encoder {
    fun encode(src: ByteArray): ByteArray

    fun encodeToString(src: ByteArray): String {
        val encoded = encode(src)
        return buildString(encoded.size) {
            encoded.forEach { append(it.toChar()) }
        }
    }
}
```

You can also provide a more efficient implementation of this method for a specific platform, for example, for JVM:

```kotlin
object JvmBase64Encoder : Base64Encoder {
    override fun encode(src: ByteArray): ByteArray = Base64.getEncoder().encode(src)
    override fun encodeToString(src: ByteArray): String = Base64.getEncoder().encodeToString(src)
}
```

Default implementations with optional platform-specific overrides are one the multiplatform library benefits. 

Now you have a string-based API and can cover it with basic tests.

1. In the `commonTest/kotlin` directory, create the structure `org/jetbrains/base64`.
2. Create the `Base64Test.kt` file in the new directory.
3. Add tests to this file:

    ```kotlin
    package org.jetbrains.base64
   
    import kotlin.test.Test
   
    class Base64Test {
        @Test
        fun testEncodeToString() {
            checkEncodeToString("Kotlin is awesome", "S290bGluIGlzIGF3ZXNvbWU=")
        }
    
        @Test
        fun testPaddedStrings() {
            checkEncodeToString("", "")
            checkEncodeToString("1", "MQ==")
            checkEncodeToString("22", "MjI=")
            checkEncodeToString("333", "MzMz")
            checkEncodeToString("4444", "NDQ0NA==")
        }
    
        private fun checkEncodeToString(input: String, expectedOutput: String) {
            assertEquals(expectedOutput, Base64Factory.createEncoder().encodeToString(input.asciiToByteArray()))
        }
    
        private fun String.asciiToByteArray() = ByteArray(length) {
            get(it).toByte()
        }
    }
    ```

4. In **Terminal**, execute the Gradle `check` task:

    ```text
    ./gradlew check 
    ```

The tests run on each platform – JVM, JS, and Native.

You can also add tests for a specific platform that will run only as part of the platform tests.
For example, you can add UTF-16 tests on JVM. Just follow the same steps as before, but create the `Base64Test` file in `jvmTest/kotlin/org/jetbrains/base64`:

```kotlin
package org.jetbrains.base64

import org.junit.Test
import kotlin.test.assertEquals

class Base64JvmTest {
    @Test
    fun testNonAsciiString() {
        val utf8String = "Gödel"
        val actual = Base64Factory.createEncoder().encodeToString(utf8String.toByteArray())
        assertEquals("R8O2ZGVs", actual)
    }
}
```

This test will automatically run on the JVM platform in addition to common tests.

## Publishing library to Maven

Your multiplatform library is ready for publishing so that you could use in other projects.

To publish your library, use the [`maven-publish` Gradle plugin](https://docs.gradle.org/current/userguide/publishing_maven.html).

1. In the `build.gradle(.kts)` file, apply the `maven-publish` plugin and specify the group and version of your library :

<tabs>

```groovy
apply plugin: 'maven-publish'
group 'org.jetbrains.base64'
version '1.0.0'
```

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
    id("maven-publish")
}

group = "org.jetbrains.base64"
version = "1.0.0"
```

</tabs>

2. In **Terminal**, run the `publishToMavenLocal` Gradle task to publish your library to your local Maven repository:

```text
./gradlew publishToMavenLocal
```   

Your library will be published to the local Maven repository. Now you can add a dependency on it to other multiplatform projects.
Add the `mavenLocal()` repository and add a dependency on your library to the `build.gradle(.kts)` file.

<tabs>

```groovy
repositories {
   mavenCentral()
   mavenLocal()
}

kotlin {
   sourceSets {
      commonMain {
         dependencies {
            implementation 'org.jetbrains.base64:Base64:1.0.0'
         }
      }
   }
}
```

```kotlin
repositories {
   mavenCentral()
   mavenLocal()
}

kotlin {
   sourceSets {
      val commonMain by getting {
         dependencies {
            implementation("org.jetbrains.base64:Base64:1.0.0")
         }
      }
   }
}
```

</tabs>

## Summary

In this tutorial, you've:
* Created a multiplatform library with platform-specific implementations.
* Written common tests that are executed on each platform.
* Published the final library to the local Maven repository.

## What’s next

* Learn more about [publishing multiplatform libraries](mpp-publish-lib.md)
