[//]: # (title: Create and publish a multiplatform library – tutorial)

In this tutorial, you will learn how to create a multiplatform library for JVM, JS, and Native platforms, write common
tests for all platforms, and publish the library to a local Maven repository.

This library converts raw data – strings and byte arrays – to the [Base64](https://en.wikipedia.org/wiki/Base64) format.
It can be used on Kotlin/JVM, Kotlin/JS, and any available Kotlin/Native platform.

You will use different ways to implement the conversion to the Base64 format on different platforms:

* For JVM – the [`java.util.Base64` class](https://docs.oracle.com/javase/8/docs/api/java/util/Base64.html).
* For JS – the [`base-64` npm package](https://www.npmjs.com/package/base-64).
* For Kotlin/Native – your own implementation.

You will also test your code using common tests, and then publish the library to your local Maven repository.

> You can find a similar project in this [GitHub repository](https://github.com/KaterinaPetrova/mpp-sample-lib).
>
{type="note"}

## Set up the environment

You can complete this tutorial on any operating system.
Download and install the [latest version of IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) with the [latest Kotlin plugin](releases.md).

## Create a project

1. In IntelliJ IDEA, select **File | New | Project**.
2. In the left-hand panel, select **Kotlin Multiplatform**.
3. Enter a project name, then in the **Multiplatform** section select **Library** as the project template.

   ![Select a project template](multiplatform-project-1.png)

   By default, your project will use Gradle with Kotlin DSL as the build system.
4. Specify the [JDK](https://www.jetbrains.com/help/idea/sdk.html#jdk), which is required for developing Kotlin projects.
5. Click **Next** and then **Finish**.

The wizard will create a sample multiplatform library with the following structure:

![Multiplatform library structure](multiplatform-lib-structure.png){width=250}

## Write cross-platform code

Define the classes and interfaces you are going to implement in the common code.

1. In `commonMain/kotlin`, create a new `org.jetbrains.base64` directory.
2. Create the `Base64.kt` file in the new directory.
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
Learn more about [platform-specific implementations](multiplatform-connect-to-apis.md).

## Provide platform-specific implementations

Now you will create the `actual` implementations of the `Base64Factory` object for each platform:

* [JVM](#jvm)
* [JS](#js)
* [Native](#native)

### JVM

1. In `jvmMain/kotlin`, create a new `org.jetbrains.base64` package.
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

For the JS part of your project, you'll make use of the `base-64` npm package. It can be added as dependency to implement
JS-specific functionality:

1. Update your `build.gradle.kts` file by adding a dependency to the `jsMain` source set:

   ```kotlin
   kotlin {
       // ...
       
       sourceSets {
           val jsMain by getting {
               dependencies {
                   implementation(npm("base-64", "1.0.0"))
               }
           }
       }
   }
   ```

2. In `jsMain/kotlin`, create a new `org.jetbrains.base64` directory.
3. Create the `Base64.kt` file in the new directory.
4. Provide a simple implementation of the `Base64Factory` object that delegates to the `Base64` object:

    ```kotlin
    package org.jetbrains.base64

    actual object Base64Factory {
        actual fun createEncoder(): Base64Encoder = JsBase64Encoder
    }

    object JsBase64Encoder : Base64Encoder {
        override fun encode(src: ByteArray): ByteArray {
            val binString = src.decodeToString()
            return Base64.encode(binString).encodeToByteArray()
        }
    }
    ```
   
5. Create a separate file `Base64Npm.kt` in the same directory.
6. Implement the `Base64` object using the `base-64` npm package:

   ```kotlin
   package org.jetbrains.base64

   @JsModule("base-64")
   @JsNonModule
   external object Base64 {
       fun encode(s: String): String
   }
   ```
   
   If `@JsModule` and `@JsNonModule` are invalid, please check your build.gradle.kts file compiler settings. The project might have been created with the default setting `js(BOTH)`, so please change it to `js(IR)`
   
   ```kotlin
   kotlin {
       // ...
       js(IR) {
           browser {
            //...
         }
      }
   }
   ```

### Native

Unfortunately, there is no third-party implementation available for all Kotlin/Native targets, so you need to write it yourself:

1. In `nativeMain/kotlin`, create a new `org.jetbrains.base64` directory.
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
                    result.add(char.toBase64().code.toByte())
                }
                // Fill the pad with '='
                repeat(padSize) { result.add(BASE64_PAD.code.toByte()) }
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
            encoded.forEach { append(it.toInt().toChar()) }
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

1. In `commonTest/kotlin`, create a new `org.jetbrains.base64` directory.
2. Create the `Base64Test.kt` file in the new directory.
3. Add tests to this file:

    ```kotlin
    package org.jetbrains.base64

    import kotlin.test.Test
    import kotlin.test.assertEquals
   
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
            get(it).code.toByte()
        }
    }
    ```

4. In the Terminal, execute the `check` Gradle task:

    ```bash
    ./gradlew check
    ```

   > You can also run the `check` Gradle task by double-clicking it in the list of Gradle tasks.
   >
   {type="note"}

The tests will run on all platforms (JVM, JS, and Native).

### Add platform-specific tests

You can also add tests that will be run only for a specific platform. For example, you can add UTF-16 tests on JVM:

1. In `jvmTest/kotlin`, create the `org.jetbrains.base64` package.
2. Create the `Base64Test.kt` file in the new package.
3. Add tests to this file:

   ```kotlin
   package org.jetbrains.base64
   
   import kotlin.test.Test
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

1. In the `build.gradle.kts` file, apply the `maven-publish` plugin and specify the group and version of your library:

   ```kotlin
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
       id("maven-publish")
   }
   
   group = "org.jetbrains.base64"
   version = "1.0.0"
   ```

2. In the Terminal, run the `publishToMavenLocal` Gradle task to publish your library to your local Maven repository:

    ```bash
    ./gradlew publishToMavenLocal
    ```

   > You can also run the `publishToMavenLocal` Gradle task by double-clicking it in the list of Gradle tasks.
   >
   {type="note"}

Your library will be published to the local Maven repository.

## Publish your library to the external Maven Central repository

You can go public and release your multiplatform library to [Maven Central](https://search.maven.org/), a remote repository
where maven artifacts are stored and managed. This way, other developers will be able to find it and add as a dependency
to their projects.

### Register a Sonatype account and generate GPG keys

If this is your first library, or you used the sunset Bintray to do this before, you need first to register a
Sonatype account.

You can use the GetStream article to create and set up your account. The [Registering a Sonatype account](https://getstream.io/blog/publishing-libraries-to-mavencentral-2021/#registering-a-sonatype-account)
section describes how to:

1. Register a [Sonatype Jira account](https://issues.sonatype.org/secure/Signup!default.jspa).
2. Create a new issue. You can use [our issue](https://issues.sonatype.org/browse/OSSRH-65092) as an example.
3. Verify your domain ownership corresponding to the group ID you want to use to publish your artifacts.

Then, since artifacts published on Maven Central have to be signed, follow the [Generating a GPG key pair](https://getstream.io/blog/publishing-libraries-to-mavencentral-2021/#generating-a-gpg-key-pair)
section to:

1. Generate a GPG key pair for signing your artifacts.
2. Publish your public key.
3. Export your private key.

When the Maven repository and signing keys for your library are ready, you can move on and set up your build to upload
the library artifacts to a staging repository and then release them.

### Set up publication

Now you need to instruct Gradle how to publish the library. Most of the work is already done by the `maven-publish` and Kotlin
Gradle plugins, all the required publications are created automatically. You already know the result when the library is
published to a local Maven repository. To publish it to Maven Central, you need to take additional steps:

1. Configure the public Maven repository URL and credentials.
2. Provide a description and `javadocs` for all library components.
3. Sign publications.

You can handle all these tasks with Gradle scripts. Let's extract all the publication-related logic from the library
module `build.script`, so you can easily reuse it for other modules in the future.

The most idiomatic and flexible way to do that is to use Gradle's [precompiled script plugins](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins).
All the build logic will be provided as a precompiled script plugin and could be applied by plugin ID to every module of our library.

To implement this, move the publication logic to a separate Gradle project:

1. Add a new Gradle project inside your library root project. For that, create a new folder named `convention-plugins` and create a new file  `build.gradle.kts` inside of it.
2. Place the following code into the new `build.gradle.kts` file:

   ```kotlin
   plugins {
       `kotlin-dsl` // Is needed to turn our build logic written in Kotlin into the Gradle Plugin
   }
   
   repositories {
       gradlePluginPortal() // To use 'maven-publish' and 'signing' plugins in our own plugin
   }
   ```

3. In the `convention-plugins` directory, create a `src/main/kotlin/convention.publication.gradle.kts` file
   to store all the publication logic.
4. Add all the required logic in the new file. Be sure to make changes to match your project configuration and where explicitly noted by angle brackets (i.e. `<replace-me>`):

   ```kotlin
   import org.gradle.api.publish.maven.MavenPublication
   import org.gradle.api.tasks.bundling.Jar
   import org.gradle.kotlin.dsl.`maven-publish`
   import org.gradle.kotlin.dsl.signing
   import java.util.*
   
   plugins {
       `maven-publish`
       signing
   }
   
   // Stub secrets to let the project sync and build without the publication values set up
   ext["signing.keyId"] = null
   ext["signing.password"] = null
   ext["signing.secretKeyRingFile"] = null
   ext["ossrhUsername"] = null
   ext["ossrhPassword"] = null
   
   // Grabbing secrets from local.properties file or from environment variables, which could be used on CI
   val secretPropsFile = project.rootProject.file("local.properties")
   if (secretPropsFile.exists()) {
       secretPropsFile.reader().use {
           Properties().apply {
               load(it)
           }
       }.onEach { (name, value) ->
           ext[name.toString()] = value
       }
   } else {
       ext["signing.keyId"] = System.getenv("SIGNING_KEY_ID")
       ext["signing.password"] = System.getenv("SIGNING_PASSWORD")
       ext["signing.secretKeyRingFile"] = System.getenv("SIGNING_SECRET_KEY_RING_FILE")
       ext["ossrhUsername"] = System.getenv("OSSRH_USERNAME")
       ext["ossrhPassword"] = System.getenv("OSSRH_PASSWORD")
   }
   
   val javadocJar by tasks.registering(Jar::class) {
       archiveClassifier.set("javadoc")
   }
   
   fun getExtraString(name: String) = ext[name]?.toString()
   
   publishing {
       // Configure maven central repository
       repositories {
           maven {
               name = "sonatype"
               setUrl("https://s01.oss.sonatype.org/service/local/staging/deploy/maven2/")
               credentials {
                   username = getExtraString("ossrhUsername")
                   password = getExtraString("ossrhPassword")
               }
           }
       }
   
       // Configure all publications
       publications.withType<MavenPublication> {
           // Stub javadoc.jar artifact
           artifact(javadocJar.get())
   
           // Provide artifacts information requited by Maven Central
           pom {
               name.set("MPP Sample library")
               description.set("Sample Kotlin Multiplatform library (jvm + ios + js) test")
               url.set("https://github.com/<your-github-repo>/mpp-sample-lib")
   
               licenses {
                   license {
                       name.set("MIT")
                       url.set("https://opensource.org/licenses/MIT")
                   }
               }
               developers {
                   developer {
                   id.set("<your-github-profile>")
                   name.set("<your-name>")
                   email.set("<your-email>") 
               }
           }
               scm {
                   url.set("https://github.com/<your-github-repo>/mpp-sample-lib")
               }
           }
       }
   }
   
   // Signing artifacts. Signing.* extra properties values will be used
   signing {
       sign(publishing.publications)
   }
   ```
   {initial-collapse-state="collapsed"}

   Applying just `maven-publish` is enough for publishing to the local Maven repository, but not to Maven Central.
   In the provided script, you get the credentials from `local.properties` or environment variables,
   do all the required configuration in the `publishing` section, and sign your publications with the signing plugin.

5. Go back to your library project. To ask Gradle to prebuild your plugins, update the root `settings.gradle.kts`
   with the following:

   ```kotlin
   rootProject.name = "multiplatform-lib" // your project name
   includeBuild("convention-plugins")
   ```

6. Now, you can apply this logic in the library's `build.script`. In the `plugins` section, replace `maven-publish` with
   `conventional.publication`:

   ```kotlin
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
       id("convention.publication")
   }
   ```

7. Create a `local.properties` file within your library's root directory with all the necessary credentials and make sure to add it to your `.gitignore`:

   ```none
   # The GPG key pair ID (last 8 digits of its fingerprint)
   signing.keyId=...
   # The passphrase of the key pair
   signing.password=...
   # Private key you exported earlier
   signing.secretKeyRingFile=...
   # Your credentials for the Jira account
   ossrhUsername=...
   ossrhPassword=...
   ```

8. Run `./gradlew clean` and sync the project.

New Gradle tasks related to the Sonatype repository should appear in the publishing group – that means that everything
is ready for you to publish your library.

### Publish your library to Maven Central

To upload your library to the Sonatype repository, run the following program:

```bash
./gradlew publishAllPublicationsToSonatypeRepository
```

The staging repository will be created, and all the artifacts for all publications will be uploaded to that
repository. All it's left to do is to check that all the artifacts you wanted to upload have made it there and to
press the release button.

These steps are described in the [Your first release](https://getstream.io/blog/publishing-libraries-to-mavencentral-2021/#your-first-release)
section. In short, you need to:

1. Go to [https://s01.oss.sonatype.org](https://s01.oss.sonatype.org) and log in using your credentials in Sonatype Jira.
2. Find your repository in the **Staging repositories** section.
3. Close it.
4. Release the library.
5. To activate the sync to Maven Central, go back to the Jira issue you created and leave a comment saying that you've
   released your first component.
   This step is only needed if it's your first release.

Soon your library will be available at [https://repo1.maven.org/maven2](https://repo1.maven.org/maven2), and other
developers will be able to add it as a dependency. In a couple of hours, other developers will be able to find it using
[Maven Central Repository Search](https://search.maven.org/).

## Add a dependency on the published library

You can add your library to other multiplatform projects as a dependency.

In the `build.gradle.kts` file, add `mavenLocal()` or `MavenCentral()` (if the library was published
to the external repository) and add a dependency on your library:

```kotlin
repositories {
    mavenCentral()
    mavenLocal()
}

kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.base64:multiplatform-lib:1.0.0")
            }
        }
    }
}
```

The `implementation` dependency consists of:

* The group ID and version — specified earlier in the `build.gradle.kts` file
* The artifact ID — by default, it's your project's name specified in the `settings.gradle.kts` file

For more details, see the [Gradle documentation](https://docs.gradle.org/current/userguide/publishing_maven.html) on the `maven-publish` plugin.

## What's next?

* Learn more about [publishing multiplatform libraries](multiplatform-publish-lib.md).
* Learn more about [Kotlin Multiplatform](multiplatform-get-started.md).
* [Create your first cross-platform mobile application – tutorial](multiplatform-mobile-create-first-app.md).
