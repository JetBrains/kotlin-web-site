---
type: tutorial
layout: tutorial
title:  "Multiplatform Kotlin library"
description: "Sharing Kotlin library between JVM, JS and Native worlds"
authors: Vsevolod Tolstopyatov
date: 2018-10-04
showAuthorInfo: false
issue: EVAN-6031
---

During this tutorial, we will build a small library available from JVM, JS and Native worlds. 
You will learn how to step-by-step create a multiplatform library which can be used from any other common code (e.g. one shared with Android and iOS), 
write tests which will be executed on all platforms and use efficient implementation provided by the concrete platform.

# What are we building?

Our goal is to build a small multiplatform library to demonstrate the ability of sharing the code between the platforms and its benefits.
In order to have a small implementation to focus on the multiplatform machinery, we will write a library which
converts raw data (strings and byte arrays) to the [Base64](https://en.wikipedia.org/wiki/Base64) format and can be used on JVM, JS and any available K/N platform.
On JVM implementation will be using [`java.util.Base64`](https://docs.oracle.com/javase/8/docs/api/java/util/Base64.html) which is known to be extremely efficient 
because JVM is aware of this particular class and compiles it in a special way.
On JS we will be using native [Buffer](https://nodejs.org/docs/latest/api/buffer.html) API and on Kotlin/Native we will write our own implementation.
We will cover this functionality by common tests and then publish resulting library to Maven.


# Setting up the local environment

We will be using IntelliJ Community Edition for this tutorial, though using Ultimate edition is possible as well. Kotlin plugin 1.3.x or higher should be installed in the IDE. 
This can be verified via *Language & Frameworks | Kotlin Updates* section in the *Settings* (or *Preferences*) of the IDE.
Native part of this project is written using Mac OS X, but don't worry if you are using another platform, the platform affects only directory names in this particular tutorial.

# Creating a project

(TODO links on Sergei article)
We will be using IntelliJ Community Edition for the example. You need to make sure you have the latest version of Kotlin plugin installed, 1.3.x or newer.
We select *File | New | Project*, select *Kotlin | Kotlin (Multiplatform Library)* and configure the project in the way you want. 
The only limitation is to use Gradle 4.10 for Kotlin/Native plugin. Let's patch the `gradle/wrapper/gradle-wrapper.properties` and specify gradle version 4.10. 
TODO Mikhail should fix bugs with wrapper and this part can be removed


![Wizard]({{ url_for('tutorial_img', filename='multiplatform/wizard.png') }})

Multiplatform sample library is now created and imported into IDEA. Let's go to any `.kt` file and rename the package with IDEA action *Refactor | Rename* action to `org.jetbrains.base64`
Let's do a checkpoint here, a project structure should be:

```
└── src
├── commonMain
│   └── kotlin
├── commonTest
│   └── kotlin
├── jsMain
│   └── kotlin
├── jsTest
│   └── kotlin
├── jvmMain
│   └── kotlin
├── jvmTest
│   └── kotlin
├── macosMain
│   └── kotlin
└── macosTest
└── kotlin
```

And `kotlin` folder should contain `org.jetbrains.base64` subfolder.

# Common part

Now we should define the classes and interfaces we want to implement. Create file `Base64.kt` in `commonMain/kotlin/jetbrains/base64` folder.
Core primitive will be `Base64Encoder` interface which knows how to convert bytes to bytes in `Base64` format:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
interface Base64Encoder {
    fun encode(src: ByteArray): ByteArray
}
```
</div>

But common code should somehow get an instance of this interface, for that purpose we define factory object `Base64Factory`:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
expect object Base64Factory {
    fun createEncoder(): Base64Encoder
}
```
</div>

Our factory is marked with `expect` keyword. `expect` is a mechanism to define a requirement, which every platform should provide in order to common part to work properly.
So on each platform we should provide `actual` `Base64Factory` which knows how to create platform-specific encoder.
You can read more about platform specific declarations [here](/docs/reference/multiplatform.html#platform-specific-declarations)


# Platform-specific implementations

Now it is a time to provide  an `actual` implementation of `Base64Factory` for every platform.


## JVM
We are starting with an implementation for the JVM. Let's create a file `Base64.kt` in `jvmMain/kotlin/jetbrains/base64` folder and provide a simple implementation, which delegates to `java.util.Base64`:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
actual object Base64Factory {
    actual fun createEncoder(): Base64Encoder = JvmBase64Encoder
}

object JvmBase64Encoder : Base64Encoder {
    override fun encode(src: ByteArray): ByteArray = Base64.getEncoder().encode(src)
}

```
</div>

Pretty simple, isn't it? We provided a platform-specific implementation, but used straightforward delegation to the implementation someone else has written!


## JS

Our JS implementation will be very similar to the JVM one. We create a file `Base64.kt` in `jsMain/kotlin/jetbrains/base64` and provide an implementation 
which delegates to NodeJS `Buffer` API:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
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
</div>

## Native

On generic Native platform we don't have luxury to use someone's implementation, so we will write one by ourselves. I won't explain implementation details here,
but it's pretty straightforward and follows Base64 format description without any optimizations:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
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
</div>

Now we have implementations on all platforms and it is time to move to testing of our library.

# Testing

To make library complete we should write some tests, but we have three independent implementations and it will be a waste to write duplicates tests for each one.
Good thing about common code is that it can be covered with common tests, which later are compiled and executed on *every* platform.
 All the bits for testing are already generated by the project Wizard. TODO link to Sergei article to avoid explanation of `test` source sets and dependencies.

Let's create class `Base64Test` in `commonTest/kotlin/jetbrains/base64` folder and write a basic tests for Base64.

But as you remember, our API converts byte arrays to byte arrays and it's not quite handy to test byte arrays.
So before we start writing a test, let's add a method `encodeToString` with a default implementation to our `Base64Encoder` interface:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

Notice that implementation on *every* platform can encode byte arrays to string. If we want we can provide more efficient implementation for this method, 
for example, let's specialize it on the JVM:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
object JvmBase64Encoder : Base64Encoder {
    override fun encode(src: ByteArray): ByteArray = Base64.getEncoder().encode(src)
    override fun encodeToString(src: ByteArray): String = Base64.getEncoder().encodeToString(src)
}
```
</div>

Default implementations with optional more specialized overrides is another goodie of multiplatform library. Now, when we have a string-based API, let's cover it with basic tests:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
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
</div>

Execute `./gradlew check` and you will see that tests are ran three times, on JVM, on JS and on Native!

If we want, we can add tests to specific platform, then it will be executed only as part of this platform tests.
For example, we can add UTF-16 tests on JVM. Just follow the same steps, but create file in `jvmTest/kotlin/jetbrains/base64`:
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
class Base64JvmTest {
    @Test
    fun testNonAsciiString() {
        val utf8String = "Gödel"
        val actual = Base64Factory.createEncoder().encodeToString(utf8String.toByteArray())
        assertEquals("R8O2ZGVs", actual)
    }
}
```
</div>
This test will be automatically executed on JVM target additionally to the common part.

## Publishing library to Maven

Our first multiplatform library is almost ready. The last step is to publish it, so other projects can depend on our library.
To make publishing mechanism work, you should enable the experimental Gradle feature in `settings.gradle`:

<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
enableFeaturePreview('GRADLE_METADATA')
```
</div>


Now classic `maven-publish` Gradle [plugin](https://docs.gradle.org/current/userguide/publishing_maven.html) can be used.
Don't forget to specify group and version of your library along with plugin in `build.gradle`:
<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only="1" auto-indent="false">

```groovy
apply plugin: 'maven-publish'
group 'org.jetbrains.base64'
version '1.0.0'
```
</div>

Now check it with command `./gradlew publishToMavenLocal` and you should see a successful build. 
That's it, our library is successfully published and any Kotlin project can depend on it, whether it is an another common library, JVM, JS or Naive application.


# Summary

In this tutorial we
- created a multiplatform library with platform-specific implementations
- provided default implementation for common part and specialized it on JVM
- have written common tests which are executed on every platform
- published the final library to Maven repository

We may find the whole sources from that tutorial on [GitHub] TODO where should sources be?
