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
* [Kotlin Multiplatform: new DSL to replace Gradle's Application plugin and compatibility with Gradle's Isolated Projects](#kotlin-multiplatform)
* [](#kotlin-native-new-inlining-optimization)
* [Kotlin/Wasm: migration to Provider API and default custom formatters](#kotlin-wasm)
* [Gradle: support for Gradle 8.11 and custom publication variants](#support-for-adding-custom-gradle-publication-variants)
* [Standard library: common atomic types, improved UUID support, and new time tracking functionality](#standard-library)
* [](#compose-compiler-source-information-included-by-default)

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest IntelliJ IDEA and Android Studio.
You don't need to update the Kotlin plugin in your IDE.
All you need to do is to [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.

## Kotlin K2 compiler: new default kapt plugin

<primary-label ref="beta"/>

Starting with Kotlin %kotlinEapVersion%, the K2 implementation of the kapt compiler plugin is enabled by default
for all the projects.

The JetBrains team launched the new implementation of the kapt plugin with the K2 compiler back in Kotlin 1.9.20.
Since then, we have further developed the internal implementation of K2 kapt and made its behavior similar to that of
the K1 version, while significantly improving its performance as well.

If you encounter any issues when using kapt with the K2 compiler,
you can temporarily revert to the previous plugin implementation.

To do this, add the following option to the `gradle.properties` file of your project:

```kotlin
kapt.use.k2=false
```

Please report any issues to our [issue tracker](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback).

## Kotlin Multiplatform

### New DSL to replace Gradle's Application plugin
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

### Kotlin Gradle Multiplatform plugin compatible with Gradle's Isolated Projects

> This feature is [Experimental](components-stability.md#stability-levels-explained) and is currently in a pre-Alpha
> state in Gradle. Use it only with Gradle version 8.10 or higher and solely for evaluation purposes.
> The feature may be dropped or changed at any time.
>
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform).
> Opt-in is required (see details below).
>
{style="warning"}

Since Kotlin 2.1.0, you've been able to [preview Gradle's Isolated Projects feature](whatsnew21.md#preview-gradle-s-isolated-projects-in-kotlin-multiplatform) in your multiplatform projects.

Previously, you had to configure the Kotlin Gradle plugin to make your project compatible with the Isolated Projects
feature before you could try it out. In Kotlin %kotlinEapVersion%, this additional step is no longer necessary.

Now, to enable the Isolated Projects feature, you only need to [set the system property](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it).

If you notice problems with your Gradle build after upgrading, you can opt out of the new Kotlin Gradle plugin behavior
by setting:

```none
kotlin.kmp.isolated-projects.support=disable
```

However, if you use this Gradle property in your project, you can't use the Isolated Projects feature.

## Kotlin/Native: new inlining optimization
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% introduces a new inlining optimization pass, which comes before the actual code generation
phase.

The new inlining pass in the Kotlin/Native compiler should perform better than the standard LLVM inliner and improve the
runtime performance of the generated code.

The new inlining pass is currently [Experimental](components-stability.md#stability-levels-explained). To try it out,
use the following compiler option:

```none
-Xbinary=preCodegenInlineThreshold=40
```

Our experiments show that 40 is a good compromise threshold for the optimization. According to our benchmarks, this
gives an overall performance improvement of 9.5%. Of course, you can try out other values, too.

If you experience increased binary size or compilation time, please report such issues
in [YouTrack](https://kotl.in/issue).

## Kotlin/Wasm

### Migration to Provider API for Kotlin/Wasm and Kotlin/JS properties

Previously, properties in Kotlin/Wasm and Kotlin/JS extensions were mutable (`var`) and assigned directly in build
scripts:

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

Now, properties are exposed through the [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html),
and you must use the `.set()` function to assign values:

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

The Provider API ensures that values are lazily computed and properly integrated with task dependencies, improving build
performance.

With this change, direct property assignments are deprecated in favor of `*EnvSpec` classes,
such as `NodeJsEnvSpec` and `YarnRootEnvSpec`.

Additionally, several alias tasks have been removed to avoid confusion:

| Deprecated task        | Replacement                                                     |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` or `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` or `jsBrowserDistribution`         |

If you only use Kotlin/JS or Kotlin/Wasm in build scripts, no action is required as Gradle automatically handles
assignments.

However, if you maintain a plugin based on the Kotlin Gradle Plugin, and your plugin does not apply `kotlin-dsl`, you
must update property assignments to use the `.set()` function.

### Custom formatters enabled by default

Before, you had to [manually configure](whatsnew21.md#improved-debugging-experience-for-kotlin-wasm) custom formatters
to improve debugging in web browsers when working with Kotlin/Wasm code.

In this release, custom formatters are enabled by default in development builds, so no additional Gradle configuration
is needed.

To use this feature, you only need to ensure that custom formatters are enabled in your browser's developer tools:

* In Chrome DevTools, it's available via **Settings | Preferences | Console**:

  ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=400}

* In Firefox DevTools, it's available via **Settings | Advanced settings**:

  ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=400}

This change primarily affects development builds. If you have specific requirements for production builds,
you need to adjust your Gradle configuration accordingly. Add the following compiler option to the `wasmJs {}` block:

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        // ...

        compilerOptions {
            freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
        }
    }
}
```

## Gradle

### Support for version 8.11
Kotlin %kotlinEapVersion% is now compatible with the latest stable Gradle version, 8.11, and supports its features.

### Support for adding custom Gradle publication variants
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% introduces support for adding custom [Gradle publication variants](https://docs.gradle.org/current/userguide/variant_attributes.html).
This feature is available for multiplatform projects and projects targeting the JVM.

> You cannot modify existing Gradle variants with this feature.
>
{style="note"}

This feature is [Experimental](components-stability.md#stability-levels-explained). To opt in,
use the `@OptIn(ExperimentalKotlinGradlePluginApi::class)` annotation or the compiler option
`-opt-in=kotlin.ExperimentalKotlinGradlePluginApi`.

To add a custom Gradle publication variant, invoke the `adhocSoftwareComponent()` function, which returns an instance
of [`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html)
that you can configure in the Kotlin DSL:

```kotlin
plugins {
    // Only JVM and Multiplatform are supported
    kotlin("jvm")
    // or
    kotlin("multiplatform")
}

kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    publishing {
        // Returns an instance of AdhocSoftwareComponent
        adhocSoftwareComponent()
        // Alternatively, you can configure AdhocSoftwareComponent in the DSL block as follows
        adhocSoftwareComponent {
            // Add your custom variants here using the AdhocSoftwareComponent API
        }
    }
}
```

> For more information on variants, see Gradle's [Customizing publishing guide](https://docs.gradle.org/current/userguide/publishing_customization.html).
>
{style="tip"}

## Standard library

### Common atomic types
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
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

To enable seamless interoperability between Kotlin's atomic types and Java's [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html)
atomic types, the API provides the `.asJavaAtomic()` and `.asKotlinAtomic()` extension functions. On the JVM, Kotlin
atomics and Java atomics are the same types in runtime, so you can transform Java atomics into Kotlin atomics and vice
versa without any overhead.

Here's an example that shows how Kotlin and Java atomic types can work together:

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
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### Changes in UUID parsing, formatting, and comparability
<primary-label ref="experimental-opt-in"/>

The JetBrains team continues to improve the support for UUIDs [introduced to the standard library in 2.0.20](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library).

Previously, the `parse()` function only accepted UUIDs in the hex-and-dash format. With Kotlin %kotlinEapVersion%,
you can use `parse()` for _both_ the hex-and-dash and the plain hexadecimal (without dashes) formats.

We've also introduced functions specific to operations with the hex-and-dash format in this release:

* `parseHexDash()` parses UUIDs from the hex-and-dash format.
* `toHexDashString()` converts a `Uuid` into a `String` in the hex-and-dash format (mirroring the functionality of `toString()`).

These functions work similarly to [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html)
and [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html), which were
introduced earlier for the hexadecimal format. Explicit naming for parsing and formatting functionality should improve
code clarity and your overall experience with UUIDs.

UUIDs in Kotlin are now `Comparable`. Starting with Kotlin %kotlinEapVersion%, you can directly compare and sort values
of the `Uuid` type. This enables the use of the `<` and `>` operators, standard library extensions available exclusively
for `Comparable` types or their collections (such as `sorted()`), and allows passing UUIDs to any functions or APIs that
require the `Comparable` interface.

Remember that the UUID support in the standard library is still [Experimental](components-stability.md#stability-levels-explained).
To opt in, use the `@ExperimentalUuidApi` annotation or the compiler option `-opt-in=kotlin.uuid.ExperimentalUuidApi`:

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

//sampleStart
@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse() accepts a UUID in a plain hexadecimal format
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // Converts it to the hex-and-dash format
    val hexDashFormat = uuid.toHexDashString()

    // Outputs the UUID in the hex-and-dash format
    println(hexDashFormat)

    // Outputs UUIDs in ascending order
    println(
        listOf(
            uuid,
            Uuid.parse("780e8400e29b41d4a716446655440005"),
            Uuid.parse("5ab88400e29b41d4a716446655440076")
        ).sorted()
    )
}
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### New time tracking functionality
<primary-label ref="experimental-opt-in"/>

Starting with Kotlin %kotlinEapVersion%, the standard library provides the ability to represent a moment in time.
This functionality was previously only available in [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/),
an official Kotlin library.

The [kotlinx.datetime.Clock](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/)
interface is introduced to the standard library as `kotlin.time.Clock` and the [`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/)
class as `kotlin.time.Instant`. These concepts naturally align with the `time` package in the standard library because
they’re only concerned with moments in time compared to a more complex calendar and timezone functionality that remains
in `kotlinx-datetime`.

`Instant` and `Clock` are useful when you need precise time tracking without considering time zones or dates.
For example, you can use them to log events with timestamps, measure durations between two points in time,
and obtain the current moment for system processes.

To provide interoperability with other languages, additional converter functions are available:

* `.toKotlinInstant()` converts a time value to a `kotlin.time.Instant` instance.
* `.toJavaInstant()` converts the `kotlin.time.Instant` value to a `java.time.Instant` value.
* `Instant.toJSDate()` converts the `kotlin.time.Instant` value to an instance of the JS `Date` class. This conversion
  is not precise, JS uses millisecond precision to represent dates, while Kotlin allows for nanosecond resolution.

The new time features of the standard library are still [Experimental](components-stability.md#stability-levels-explained).
To opt in, use the `@ExperimentalTime` annotation:

```kotlin
import kotlin.time.*
        
@ExperimentalTime
fun main() {

    // Get the current moment in time
    val currentInstant = Clock.System.now()
    println("Current time: $currentInstant")

    // Find the difference between two moments in time
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("Time elapsed since 2023-01-01: $duration")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

<!--
For more information on the implementation, see this [KEEP proposal](https://github.com/dkhalanskyjb/KEEP/blob/dkhalanskyjb-instant/proposals/stdlib/instant.md#instant-and-clock).
-->

## Compose compiler: source information included by default

The Compose compiler Gradle plugin enables [including source information](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html)
by default on all platforms. The `includeSourceInformation` option was already enabled for Android, this change aligns
the plugin behavior across platforms and allows support for new runtime features.

Remember to check if you set this option using `freeCompilerArgs`: when used along with the plugin, it can fail the
build due to an option being set twice.

## Breaking changes and deprecations

To align Kotlin Multiplatform with upcoming changes in Gradle, we are phasing out the `withJava()` function.
[Java source sets are now created by default](multiplatform-compatibility-guide.md#java-source-sets-created-by-default).

## How to update to Kotlin %kotlinEapVersion%

Starting from IntelliJ IDEA 2023.3 and Android Studio Iguana (2023.2.1) Canary 15, the Kotlin plugin is distributed as a
bundled plugin included in your IDE. This means that you can't install the plugin from JetBrains Marketplace anymore.
The bundled plugin supports upcoming Kotlin EAP releases.

To update to the new Kotlin EAP version, [change the Kotlin version](configure-build-for-eap.md#adjust-the-kotlin-version)
to %kotlinEapVersion% in your build scripts.