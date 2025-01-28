[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release,
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{style="note"}

The Kotlin %kotlinEapVersion% release is out!
Here are some details of this EAP release:

* [](#kotlin-k2-compiler-new-default-kapt-plugin)
* [](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* [](#changes-in-uuid-parsing-and-formatting-functions)
* [](#common-atomic-types-in-the-kotlin-standard-library)

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest IntelliJ IDEA and Android Studio.
You don't need to update the Kotlin plugin in your IDE.
All you need to do is to [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.

## Kotlin K2 compiler: new default kapt plugin

<primary-label ref="beta"/>

Starting with Kotlin %kotlinEapVersion%, the K2 implementation of the kapt compiler plugin is enabled by default
for all the projects.

The JetBrains team has launched the new implementation of the kapt plugin with the K2 compiler back in Kotlin 1.9.20. 
Since then, we have further developed K2 kapt's internal implementation and made its behavior similar to that of K1 kapt,
while significantly improving its performance.

If you encounter any issues when using kapt with the K2 compiler,
you can temporarily revert to the previous kapt plugin implementation.

To do this, add the following option to the `gradle.properties` file of your project:

```kotlin
kapt.use.k2=false
```

Please report such issues to our [issue tracker](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback).

## Kotlin Multiplatform: New DSL to replace Gradle's Application plugin

<primary-label ref="experimental-opt-in"/>

Starting with Gradle 8.7, the [Application](https://docs.gradle.org/current/userguide/application_plugin.html) plugin is
no longer compatible with the Kotlin Multiplatform Gradle plugin. Kotlin %kotlinEapVersion% introduces an Experimental
DSL to achieve similar functionality. The new `executable {}` block configures execution tasks and Gradle
[distributions](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) for JVM targets.

Before using the DSL, add the following to your build script:

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

Then, add the new `executable {}` block. For example:

```kotlin
kotlin {
    jvm {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        binaries {
            // Configures a JavaExec task named "runJvm" and a Gradle distribution for the "main" compilation in this target
            executable {
                mainClass.set("foo.MainKt")
            }

            // Configures a JavaExec task named "runJvmAnother" and a Gradle distribution for the "main" compilation
            executable(KotlinCompilation.MAIN_COMPILATION_NAME, "another") {
                // Set a different class
                mainClass.set("foo.MainAnotherKt")
            }

            // Configures a JavaExec task named "runJvmTest" and a Gradle distribution for the "test" compilation
            executable(KotlinCompilation.TEST_COMPILATION_NAME) {
                mainClass.set("foo.MainTestKt")
            }

            // Configures a JavaExec task named "runJvmTestAnother" and a Gradle distribution for the "test" compilation
            executable(KotlinCompilation.TEST_COMPILATION_NAME, "another") {
                mainClass.set("foo.MainAnotherTestKt")
            }
        }
    }
}
```

In this example, Gradle's [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)
plugin is applied on the first `executable {}` block.

If you run into any issues, report them in our [issue tracker](https://kotl.in/issue) or let us know in our
[public Slack channel](https://kotlinlang.slack.com/archives/C19FD9681).

## Gradle: support for version 8.11

Kotlin %kotlinEapVersion% is now compatible with the latest stable Gradle version, 8.11, and supports its features.
Gradle versions 8.7 to 8.11 are supported, with one exception. If you use the Kotlin Multiplatform Gradle plugin,
you may see deprecation warnings in your multiplatform projects when calling the [`withJava()` function in the JVM target](multiplatform-dsl-reference.md#jvm-targets).
We plan to fix this issue as soon as possible.

For more information, see the related issue in [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542).

## Common atomic types in the Kotlin standard library
<primary-label ref="experimental-opt-in"/>

In Kotlin %kotlinEapVersion%, we are introducing common atomic types in the standard library's `kotlin.concurrent.atomics`
package, enabling shared, platform-independent code for thread-safe operations. This simplifies development for Kotlin
Multiplatform projects by removing the need to duplicate atomic-dependent logic across source sets.

The `kotlin.concurrent.atomics` package and its properties are [Experimental](components-stability.md#stability-levels-explained).
To opt in, use the `@OptIn(ExperimentalAtomicApi::class)` annotation or the compiler option `-opt-in=kotlin.ExperimentalAtomicApi`.

Here's an example that shows how you can use `AtomicInt` to safely count processed items across multiple threads:

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // Initializes the atomic counter for processed items
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // Splits the items into chunks for processing by multiple coroutines
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("Processing $item in thread ${Thread.currentThread()}")
                    processedItems += 1 // Increment counter atomically
                }
            }
         }
    }
//sampleEnd
    // Prints the total number of processed items
    println("Total processed items: ${processedItems.load()}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

To enable seamless interoperability between Kotlin's atomic types and Java's [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html)
atomic types, the API provides the `.asJavaAtomic()` and `.asKotlinAtomic()` extension functions. On the JVM, Kotlin
atomics and Java atomics are the same types in runtime, so you can transform Java atomics to Kotlin atomics and the other
way around without any overhead.

Let's look at an example that shows how Kotlin and Java atomic types can work together:

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // Converts Kotlin AtomicInt to Java's AtomicInteger
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java atomic value: ${javaAtomic.get()}")
    // Java atomic value: 42

    // Converts Java's AtomicInteger back to Kotlin's AtomicInt
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin atomic value: ${kotlinAgain.load()}")
    // Kotlin atomic value: 42
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

## Changes in UUID parsing and formatting functions
<primary-label ref="experimental-opt-in"/>

The JetBrains team continues to improve the support for UUIDs [introduced to the standard library in 2.0.20](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library).

Previously, the `parse()` function only accepted UUIDs in the hex-and-dash format. With Kotlin %kotlinEapVersion%,
you can use `parse()` for *both* the hex-and-dash and the plain hexadecimal format (without dashes).

We also introduce functions specific to the operations with the hex-and-dash format in this release:

* `parseHexDash()` the parses UUIDs from the hex-and-dash format.
* `toHexDashString()` that converts a UUID into a string in the hex-and-dash format (mirroring the `toString()` functionality).

These functions work similarly to [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html)
and [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) that were
introduced earlier for the hexadecimal format. Explicit naming for the parsing and formatting functionality should improve
code clarity and your overall experience with UUID handling.

Remember that the UUID support in the standard library is still [Experimental](components-stability.md#stability-levels-explained).
To opt in, use the `@ExperimentalUuidApi` annotation or the compiler option `-opt-in=kotlin.uuid.ExperimentalUuidApi`:

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

//sampleStart
@OptIn(ExperimentalUuidApi::class)
fun main() {
    // Use parse() to accept a UUID in a plain hexadecimal format
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // Convert it to the hex-and-dash format
    val hexDashFormat = uuid.toHexDashString()
    println(hexDashFormat)
    // Output: 550e8400-e29b-41d4-a716-446655440000
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

## How to update to Kotlin %kotlinEapVersion%

Starting from IntelliJ IDEA 2023.3 and Android Studio Iguana (2023.2.1) Canary 15, the Kotlin plugin is distributed as a
bundled plugin included in your IDE. This means that you can't install the plugin from JetBrains Marketplace anymore.
The bundled plugin supports upcoming Kotlin EAP releases.

To update to the new Kotlin EAP version, [change the Kotlin version](configure-build-for-eap.md#adjust-the-kotlin-version)
to %kotlinEapVersion% in your build scripts.