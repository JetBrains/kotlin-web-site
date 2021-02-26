[//]: # (title: Create and publish a multiplatform library – tutorial)

In this tutorial, you will learn how to create a multiplatform library for JVM, JS, and Native platforms, write common tests for all platforms, and publish the library to a local Maven repository.

This library converts raw data – strings and byte arrays – to the [Base64](https://en.wikipedia.org/wiki/Base64) format. It can be used on Kotlin/JVM, Kotlin/JS, and any available Kotlin/Native platform.

You will use different ways to implement the conversion to the Base64 format on different platforms:

* For JVM – the [`java.util.Base64` class](https://docs.oracle.com/javase/8/docs/api/java/util/Base64.html).
* For JS – the [Buffer API](https://nodejs.org/docs/latest/api/buffer.html).
* For Kotlin/Native – your own implementation.

You will also test your code using common tests, and then publish the library to your local Maven repository.

## Set up the environment

You can complete this tutorial on any operating system.
Download and install the [latest version of IntelliJ IDEA](http://www.jetbrains.com/idea/download/index.html) with the [latest Kotlin plugin](releases.md).

## Create a project

1. In IntelliJ IDEA, select **File | New | Project**.
2. In the left-hand panel, select **Kotlin**.
3. Enter a project name, then in the **Multiplatform** section select **Library** as the project template.

   ![Select a project template](mpp-project-1.png)

4. Select the Gradle DSL – Kotlin or Groovy.
5. Specify the [JDK](https://www.jetbrains.com/help/idea/sdk.html#jdk), which is required for developing Kotlin projects.
5. Click **Next**, and then click **Finish**.

The wizard will create a sample multiplatform library with the following structure:

![Multiplatform library structure](mpp-lib-structure.png){width=250}

## Write cross-platform code

Define the classes and interfaces you are going to implement in the common code.

1. In the `commonMain/kotlin` directory, create the `org.jetbrains.base64` package.
2. Create the `Base64.kt` file in the new package.
3. Define the `Base64Encoder` interface that converts bytes to the `Base64` format:

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

## Provide platform-specific implementations

Now you will create the `actual` implementations of the `Base64Factory` object for each platform:

* [JVM](#jvm)
* [JS](#js)
* [Native](#native)

### JVM

1. In the `jvmMain/kotlin` directory, create the `org.jetbrains.base64` package.
2. Create the `Base64.kt` file in the new package.
3. Provide a simple implementation of the `Base64Factory` object that delegates to the `java.util.Base64` class:

   > IDEA inspections help create `actual` implementations for an `expect` declaration.
   >
   {type="note"}

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

Pretty simple, right? You've provided a platform-specific implementation by using a straightforward delegation to a third-party implementation.

### JS

The JS implementation will be very similar to the JVM one.

1. In the `jsMain/kotlin` directory, create the `org.jetbrains.base64` package.
2. Create the `Base64.kt` file in the new package.
3. Provide a simple implementation of the `Base64Factory` object that delegates to the NodeJS `Buffer` API:

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

Unfortunately, there is no third-party implementation available for all Kotlin/Native targets, so you need to write it yourself.

1. In the `nativeMain/kotlin` directory, create the `org.jetbrains.base64` package.
2. Create the `Base64.kt` file in the new package.
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

To save time on testing, you can write common tests that will be executed on all platforms instead of testing each platform separately.

### Prerequisites

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

You can also provide a more efficient implementation of this method for a specific platform, for example, for JVM in `jvmMain/kotlin/org/jetbrains/base64/Base64.kt`:

```kotlin
object JvmBase64Encoder : Base64Encoder {
    override fun encode(src: ByteArray): ByteArray = Base64.getEncoder().encode(src)
    override fun encodeToString(src: ByteArray): String = Base64.getEncoder().encodeToString(src)
}
```

One of the benefits of a multiplatform library is having a default implementation with optional platform-specific overrides.

### Write common tests

Now you have a string-based API that you can cover with basic tests.

1. In the `commonTest/kotlin` directory, create the `org.jetbrains.base64` package.
2. Create the `Base64Test.kt` file in the new package.
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

4. In the Terminal, execute the `check` Gradle task:

    ```text
    ./gradlew check 
    ```

   > You can also run the `check` Gradle task by double-clicking it in the list of Gradle tasks.
   >
   {type="note"}

The tests will run on all platforms (JVM, JS, and Native).

### Add platform-specific tests

You can also add tests that will be run only for a specific platform.
For example, you can add UTF-16 tests on JVM. Just follow the same steps as for common tests, but create the `Base64Test` file in `jvmTest/kotlin/org/jetbrains/base64`:

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

This test will automatically run on the JVM platform in addition to the common tests.

## Publish your library to the local Maven repository

Your multiplatform library is ready for publishing so that you can use it in other projects.

To publish your library, use the [`maven-publish` Gradle plugin](https://docs.gradle.org/current/userguide/publishing_maven.html).

1. In the `build.gradle(.kts)` file, apply the `maven-publish` plugin and specify the group and version of your library:

<tabs>

```groovy
plugins {
   id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
   id 'maven-publish'
}

group = 'org.jetbrains.base64'
version = '1.0.0'
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

2. In the Terminal, run the `publishToMavenLocal` Gradle task to publish your library to your local Maven repository:

    ```text
    ./gradlew publishToMavenLocal
    ```

   > You can also run the `publishToMavenLocal` Gradle task by double-clicking it in the list of Gradle tasks.
   >
   {type="note"}


Your library will be published to the local Maven repository.

## Add a dependency on the published library

Now you can add your library to other multiplatform projects as a dependency.

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

In this tutorial, you:
* Created a multiplatform library with platform-specific implementations.
* Wrote common tests that are executed on all platforms.
* Published your library to the local Maven repository.

## What’s next?

* Learn more about [publishing multiplatform libraries](mpp-publish-lib.md).
* Learn more about [Kotlin Multiplatform](mpp-intro.md).
* [Create your first KMM application for Android and iOS – tutorial](https://kotlinlang.org/docs/mobile/create-first-app.html).
* [Create a full-stack web app with Kotlin Multiplatform – hands-on tutorial](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction).
