[//]: # (title: What's new in Kotlin 1.8.20-RC)

_[Release date: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release, but highlights the new
> features and major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20-RC).
>
{type="note"}

The Kotlin 1.8.20-RC release is out! Here are some highlights from this preview version of Kotlin:

* [New Kotlin K2 compiler updates](#new-kotlin-k2-compiler-updates)
* [New experimental Kotlin/Wasm target](#new-kotlin-wasm-target)
* [New JVM incremental compilation by default in Gradle](#new-jvm-incremental-compilation-by-default-in-gradle)
* [Update regarding Kotlin/Native targets](#update-regarding-kotlin-native-targets)
* [Preview of Gradle composite builds in Kotlin Multiplatform](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [Improved output for Gradle errors in Xcode](#improved-output-for-gradle-errors-in-xcode)
* [Experimental support for AutoCloseable interface in standard library](#experimental-support-for-autocloseable-interface-in-standard-library)
* [Experimental support for Base64 encoding in standard library](#experimental-support-for-base64-encoding-in-standard-library)

## IDE support

The Kotlin plugins that support 1.8.20-RC are available for:

| IDE            | Supported versions |
|----------------|--------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x |
| Android Studio | Flamingo (222)     |

## New Kotlin K2 compiler updates

The Kotlin team continues to stabilize the K2 compiler. As mentioned in the [Kotlin 1.7.0 announcement](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha),
it's still in **Alpha**. This release introduces further improvements on the road to [K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604).

Starting with this 1.8.20-RC release, the Kotlin K2 compiler:

* Has a preview version of the serialization plugin.
* Provides Alpha support for the [JS IR compiler](js-ir-compiler.md).
* Introduces the future release of the [new language version, Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/).

Learn more about the new compiler and its benefits in the following videos:

* [What Everyone Must Know About The NEW Kotlin K2 Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [The New Kotlin K2 Compiler: Expert Review](https://www.youtube.com/watch?v=db19VFLZqJM)

### How to enable the Kotlin K2 compiler

To enable and test the Kotlin K2 compiler, use the new language version with the following compiler option:

```bash
-language-version 2.0
```

You can specify it in your `build.gradle(.kts)` file:

```kotlin
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = "2.0"
        }
    }
}
```

The previous `-Xuse-k2` compiler option has been deprecated.

> The Alpha version of the new K2 compiler only works with JVM and JS IR projects.
> It doesn't support Kotlin/Native or other multiplatform projects yet.
>
{type="warning"}

### Leave your feedback on the new K2 compiler

We'd appreciate any feedback you may have!

* Provide your feedback directly to K2 developers on Kotlin Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  and join the [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) channel.
* Report any problems you faced with the new K2 compiler on [our issue tracker](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Performance%20Problem&c=Subsystems%20Frontend.%20IR).
* [Enable the **Send usage statistics** option](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) to
  allow JetBrains to collect anonymous data about K2 usage.

## New Kotlin/Wasm target

Kotlin/Wasm (Kotlin WebAssembly) goes [Experimental](components-stability.md#stability-levels-explained) in this preview
release. The Kotlin team finds [WebAssembly](https://webassembly.org/) to be a promising technology and wants to find
better ways for you to use it and get all of the benefits of Kotlin.

WebAssembly binary format is independent of the platform because it runs using its own virtual machine. Almost all modern
browsers already support WebAssembly 1.0. To set up the environment to run WebAssembly, you only need to enable an
experimental garbage collection mode that Kotlin/Wasm targets. You can find detailed instructions
here: [How to enable Kotlin/Wasm](#how-to-enable-kotlin-wasm).

We want to highlight the following advantages of the new Kotlin/Wasm target:

* Faster compilation speed compared to the `wasm32` Kotlin/Native target, since Kotlin/Wasm doesn't have to use LLVM.
* Easier interoperability with JS and integration with browsers compared to the `wasm32` target, thanks to the [Wasm garbage collection](https://github.com/WebAssembly/gc).
* Potentially faster application startup compared to Kotlin/JS and JavaScript because Wasm has a compact and
  easy-to-parse bytecode.
* Improved application runtime performance compared to Kotlin/JS and JavaScript because Wasm is a statically typed language.

Starting with the 1.8.20-RC preview release, you can use Kotlin/Wasm in your experimental projects.
We provide the Kotlin standard library (`stdlib`) and test library (`kotlin.test`) for Kotlin/Wasm out of the box.
IDE support will be added in future releases.

[Learn more about Kotlin/Wasm in this YouTube video](https://www.youtube.com/watch?v=-pqz9sKXatw).

### How to enable Kotlin/Wasm

To enable and test Kotlin/Wasm, update your `build.gradle.kts` file:

```kotlin
plugins {
    kotlin("multiplatform") version "1.8.20-RC"
}

kotlin {
    wasm {
        binaries.executable()
        browser {
        }
    }
    sourceSets {
        val commonMain by getting
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
        val wasmMain by getting
        val wasmTest by getting
    }
}
```

> Check out the [GitHub repository with Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples).
>
{type="tip"}

To run a Kotlin/Wasm project, you need to update the settings of the target environment:

<tabs>
<tab title="Chrome">

* For version 109:

  Run the application with the `--js-flags=--experimental-wasm-gc` command line argument.

* For version 110 or later:

  1. Go to `chrome://flags/#enable-webassembly-garbage-collection` in your browser.
  2. Enable **WebAssembly Garbage Collection**.
  3. Relaunch your browser.

</tab>
<tab title="Firefox">

For version 109 or later:

1. Go to `about:config` in your browser.
2. Enable `javascript.options.wasm_function_references` and `javascript.options.wasm_gc` options.
3. Relaunch your browser.

</tab>
<tab title="Edge">

For version 109 or later:

Run the application with the `--js-flags=--experimental-wasm-gc` command line argument.

</tab>
</tabs>

### Leave your feedback on Kotlin/Wasm

We'd appreciate any feedback you may have!

* Provide your feedback directly to developers in Kotlin Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  and join the [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) channel.
* Report any problems you faced with Kotlin/Wasm on [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-56492).

## New JVM incremental compilation by default in Gradle

The new approach to incremental compilation, which [has been available since Kotlin 1.7.0](whatsnew17.md#a-new-approach-to-incremental-compilation),
now works by default. You no longer need to specify `kotlin.incremental.useClasspathSnapshot=true` in your `gradle.properties`
to enable it.

We'd appreciate your feedback on this. You can [file an issue](https://kotl.in/issue) in YouTrack.

## Update regarding Kotlin/Native targets

The Kotlin team decided to revisit the list of targets supported by Kotlin/Native, split them into tiers, and deprecate
some of them starting with Kotlin 1.8.20-RC. See the [Kotlin/Native target support](native-target-support.md) section for
the full list of supported and deprecated targets.

There are now 3 tiers of support depending on how well a target is supported and tested in the Kotlin/Native compiler.
A target can be moved to a different tier. For example, we'll do our best to provide full support for `iosArm64` in the
future, as it is important for [Kotlin Multiplatform Mobile](multiplatform-mobile-getting-started.md).

The following targets have been deprecated with Kotlin 1.8.20-RC and will be removed in 1.9.20:

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxArm32Hfp`
* `linuxMips32`
* `linuxMipsel32`

If you're a library author, follow these target tiers to decide which targets should be tested on CI tools and which
ones can be skipped. The Kotlin team will use the same approach when developing official Kotlin libraries,
like [kotlinx.coroutines](coroutines-guide.md).

Check out our [blog post](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/) to learn
more about the reasons for these changes.

## Preview of Gradle composite builds support in Kotlin Multiplatform

> This feature has been available since IntelliJ IDEA 2023.1 EAP 3.
>
{type="note"}

Starting with 1.8.20-RC, Kotlin Multiplatform supports [Gradle composite builds](https://docs.gradle.org/current/userguide/composite_builds.html).
Composite builds allow you to include builds of separate projects or parts of the same project into a single build.

Due to some technical challenges, using Gradle composite builds with Kotlin Multiplatform was only partially supported.
Kotlin 1.8.20-RC contains a preview of the improved support that should work with a larger variety of projects.
To try it out, add the following option to your `gradle.properties`:

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

This option enables a preview of the new import mode. Besides the support for composite builds, it provides a smoother
import experience in multiplatform projects, as we've included major bug fixes and improvements to make the import more
stable.

### Known issues

It's still a preview version that needs further stabilization, and you might encounter some issues with import along the
way. Here are some known issues we're planning to fix before the final release of Kotlin 1.8.20:

* There's no Kotlin 1.8.20 plugin available for IntelliJ IDEA 2023.1 EAP yet. Despite that, you can still set the Kotlin
  Gradle plugin version to 1.8.20-RC and try out composite builds in this IDE.
* If your projects include builds with a specified `rootProject.name`, composite builds may fail to resolve the Kotlin metadata.
  For the workaround and details, see this [Youtrack issue](https://youtrack.jetbrains.com/issue/KT-56536).

We encourage you to try it out and submit all reports on [YouTrack](https://kotl.in/issue) to help us make it the
default in Kotlin 1.9.0.

## Improved output for Gradle errors in Xcode

If you had issues building your multiplatform projects in Xcode, you might have encountered a "Command
PhaseScriptExecution failed with a nonzero exit code" error.
This message signals that the Gradle invocation has failed, but it's not very helpful when trying to detect the problem.

Starting with Kotlin 1.8.20-RC, Xcode can parse the output from the Kotlin/Native compiler. Furthermore, in case the
Gradle build fails, you'll see an additional error message from the root cause exception in Xcode. In most cases,
it'll help to identify the root problem.

![Improved output for Gradle errors in Xcode](xcode-gradle-output.png){width=700}

The new behavior is enabled by default for the standard Gradle tasks for Xcode integration,
like `embedAndSignAppleFrameworkForXcode` that can connect the iOS framework from your multiplatform project to the iOS
application in Xcode. It can also be enabled (or disabled) with the `kotlin.native.useXcodeMessageStyle` Gradle
property.

## Experimental support for AutoCloseable interface in standard library

> The new `AutoCloseable` interface is [Experimental](components-stability.md#stability-levels-explained), and to use it
> you need to opt in with `@OptIn(ExperimentalStdlibApi::class)` or the compiler argument `-opt-in=kotlin.ExperimentalStdlibApi`.
>

{type="warning"}

The `AutoCloseable` interface has been added to the common standard library so that you can use one common interface for
all libraries to close resources. In Kotlin/JVM, the `AutoCloseable` interface is an alias
for [`java.lang.AutoClosable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html).

In addition, the extension function `use()` is now included, which executes a given block function on the selected
resource and then closes it down correctly, whether an exception is thrown or not.

There is no public class in the common standard library that implements the `AutoCloseable` interface. In the example
below, we define the `XMLWriter` interface and assume that there is a resource that implements it. For example, this
resource could be a class that opens a file, writes XML content, and then closes it.

```kotlin
interface XMLWriter : AutoCloseable {
    fun document(encoding: String, version: String, content: XMLWriter.() -> Unit)
    fun element(name: String, content: XMLWriter.() -> Unit)
    fun attribute(name: String, value: String)
    fun text(value: String)
}

fun writeBooksTo(writer: XMLWriter) {
    writer.use { xml ->
        xml.document(encoding = "UTF-8", version = "1.0") {
            element("bookstore") {
                element("book") {
                    attribute("category", "fiction")
                    element("title") { text("Harry Potter and the Prisoner of Azkaban") }
                    element("author") { text("J. K. Rowling") }
                    element("year") { text("1999") }
                    element("price") { text("29.99") }
                }
                element("book") {
                    attribute("category", "programming")
                    element("title") { text("Kotlin in Action") }
                    element("author") { text("Dmitry Jemerov") }
                    element("author") { text("Svetlana Isakova") }
                    element("year") { text("2017") }
                    element("price") { text("25.19") }
                }
            }
        }
    }
}
```
{validate="false"}

## Experimental support for Base64 encoding in standard library

> The new encoding and decoding functionality is [Experimental](components-stability.md#stability-levels-explained),
> and to use it, you need to opt in with `@OptIn(ExperimentalEncodingApi::class)` or the
> compiler argument `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`.
>
{type="warning"}

We've added support for Base64 encoding and decoding. We provide 3 class instances, each using different encoding
schemes and displaying different behaviors. Use the `Base64.Default` instance for the standard [Base64 encoding scheme](https://www.rfc-editor.org/rfc/rfc4648#section-4).

Use the `Base64.UrlSafe` instance for the [“URL and Filename safe”](https://www.rfc-editor.org/rfc/rfc4648#section-5)
encoding scheme.

Use the `Base64.Mime` instance for the [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) encoding scheme. When
you use the `Base64.Mime` instance, all encoding functions insert a line separator every 76 characters. In the case of
decoding, any illegal characters are skipped and don't throw an exception.

> The `Base64.Default` instance is the companion object of the `Base64` class. As a result, you can call its functions
> via `Base64.encode()` and  `Base64.decode()` instead of `Base64.Default.encode()` and `Base64.Default.decode()`.
>
{type="tip"}

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// Alternatively:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// Alternatively:
// Base64.decode(foBytes)

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```
{validate="false"}

You can use additional functions to encode or decode bytes into an existing buffer, as well as to append the encoding
result to a provided `Appendable` type object.

In Kotlin/JVM, we've also added the extension functions `encodingWith()` and `decodingWith()` to enable you to perform
Base64 encoding and decoding with input and output streams.

## How to update to the Kotlin 1.8.20-RC

Install Kotlin 1.8.20-RC in any of the following ways:

* If you use the _Early Access Preview_ update channel, the IDE will suggest automatically updating to 1.8.20-RC as
  soon as it becomes available.
* If you use the _Stable_ update channel, you can change the channel to _Early Access Preview_ at any time by selecting
  **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** in your IDE. You'll then be able to install the latest
  preview release. Check out [these instructions](https://kotlinlang.org/docs/install-eap-plugin.html) for details.

Once you've installed 1.8.20-RC, don't forget to [change the Kotlin version](https://kotlinlang.org/docs/configure-build-for-eap.html)
to 1.8.20-RC in your build scripts.
