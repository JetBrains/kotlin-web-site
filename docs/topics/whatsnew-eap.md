[//]: # (title: What's new in Kotlin 1.8.20-Beta)

_[Release date: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release, but highlights the new ones
> and some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20-Beta).
>
{type="note"}

The Kotlin 1.8.20-Beta release is out! Here are some highlights from this preview version of Kotlin:

* [New Kotlin K2 compiler updates](#new-kotlin-k2-compiler-updates)
* [New Kotlin/Wasm compiler backend](#new-kotlin-wasm-target)
* [New JVM incremental compilation by default in Gradle](#new-jvm-incremental-compilation-by-default-in-gradle)
* [Update regarding Kotlin/Native targets](#update-regarding-kotlin-native-targets)
* [Preview of Gradle composite builds in Kotlin Multiplatform](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [Improved output for Gradle errors in Xcode](#improved-output-for-gradle-errors-in-xcode)
* [Experimental support for AutoCloseable interface in standard library](#experimental-support-for-autocloseable-interface-in-standard-library)
* [Experimental support for Base64 encoding in standard library](#experimental-support-for-base64-encoding-in-standard-library)

## IDE support

The Kotlin plugins that support 1.8.20-Beta are available for:

| IDE            | Supported versions |
|----------------|--------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x |
| Android Studio | Flamingo (222)     |

## New Kotlin K2 compiler updates

The Kotlin team continues to stabilize the K2 compiler. It's still in **Alpha** (as announced in
the [Kotlin 1.7.0](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)), and this release introduces further
improvements on the road to [K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604).

Starting with this 1.8.20-Beta release, the Kotlin K2 compiler:

* has a preview version of the serialization plugin
* provides Alpha support for the [JS IR compiler](js-ir-compiler.md)
* introduces the future release of the new language version, Kotlin 2.0

Learn more about the new compiler and its benefits in the following videos:

* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

### How to enable the Kotlin K2 compiler

To enable the Kotlin K2 compiler and test it, use the new language version with the following compiler option:

```bash
-language-version 2.0
```

You can specify it in your `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "2.0"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '2.0'
        }
    }
}
```

</tab>
</tabs>

The previous `-Xuse-k2` compiler option is deprecated.

> The Alpha version of the new K2 compiler only works with JVM and JS IR projects.
> It doesn't support Kotlin/Native or other multiplatform projects yet.
>
{type="warning"}

### Leave your feedback on the new K2 compiler

We'd appreciate your feedback in any form:

* Provide your feedback directly to K2 developers in Kotlin Slack: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  and join the [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) channel.
* Report any problems you faced with the new K2 compiler to [our issue tracker](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Performance%20Problem&c=Subsystems%20Frontend.%20IR).
* [Enable the **Send usage statistics** option](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) to
  allow JetBrains to collect anonymous data about K2 usage.

## New Kotlin/Wasm target

> The new backend is available in EAP of IntelliJ IDEA 2022.3 only.
>
{type="note"}

Kotlin/Wasm goes [Alpha](components-stability.md) in this preview release.

[Learn more about Kotlin/Wasm in the YouTube video](https://www.youtube.com/watch?v=-pqz9sKXatw).

## New JVM incremental compilation by default in Gradle

The new approach to incremental compilation,
which [exists from Kotlin 1.7.0](whatsnew17.md#a-new-approach-to-incremental-compilation),
now works by default. You don't need to specify `kotlin.incremental.useClasspathSnapshot=true` in your
`gradle.properties` to enable it.

We'd appreciate your feedback, you can [file an issue](https://kotl.in/issue) in YouTrack.

## Update regarding Kotlin/Native targets

The Kotlin team decided to revisit the list of targets supported by Kotlin/Native, split them into tiers, and deprecate
some of them since Kotlin 1.8.20-Beta. See the [Kotlin/Native target support](native-target-support.md) section for
the full list of supported and deprecated targets.

Now there are three tiers of support depending on how well a target is supported and tested in the Kotlin/Native
compiler. A target can move to a different tier. For example, we'll do our best to provide full support for `iosArm64`
in the future, as it is important for [Kotlin Multiplatform Mobile](multiplatform-mobile-getting-started.md).

The following targets are deprecated starting with Kotlin 1.8.20-Beta and will be removed in 1.9.20:

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxArm32Hfp`
* `linuxMips32`
* `linuxMipsel32`

If you're a library author, follow these target tiers to decide which targets should be tested on CI and which ones can
be skipped. The Kotlin team will use the same approach when developing official Kotlin libraries, for
example, [kotlinx.coroutines](coroutines-guide.md).

Check out our [blog post](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/) to learn
more about the reasons behind these changes.

## Preview of Gradle composite builds support in Kotlin Multiplatform

> The feature is available in EAP of IntelliJ IDEA 2022.3 only.
>
{type="note"}

Starting with 1.8.20-Beta, Kotlin Multiplatform supports [Gradle composite builds](https://docs.gradle.org/current/userguide/composite_builds.html).
Composite builds allow you to include builds of separate projects or parts of the same project into a single build.

Until now, using Gradle composite builds with Kotlin Multiplatform was only partially supported due to some technical
challenges. Kotlin 1.8.20-Beta contains a preview of the better support that should work with a larger variety of
projects. To try it out, add the following option to your `gradle.properties`:

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

This option enables a preview of the new import mode. Besides the support for composite builds, it provides a smoother
import experience in multiplatform projects, as we included major bug fixes and improvements to make the import more
stable.

Please keep in mind that it's still a preview version that needs further stabilization, and you might encounter some
issues with import along the way. We encourage you to try it out and submit all reports
in [YouTrack](https://kotl.in/issue) to help us make it default in Kotlin 1.9.0.

## Improved output for Gradle errors in Xcode

If you had issues building your multiplatform projects in Xcode, you might encounter the following error: "Command
PhaseScriptExecution failed with a nonzero exit code". This message signals that the Gradle invocation has failed, but
it's not very helpful when you want to detect the problem.

Starting with Kotlin 1.8.20-Beta, Xcode can parse the output from the Kotlin/Native compiler. Besides, in case the
Gradle build fails, you'll see an additional error message from the root cause exception in Xcode. In most cases, it'll
help to find out the root problem.

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

The `AutoCloseable` interface is added to the common standard library so that you can use one common interface for all
libraries to close resources. In Kotlin/JVM, the `AutoCloseable` interface is an alias of [`java.lang.AutoClosable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html).

In addition, the extension function `use()` is now included, which executes a given block function on the selected
resource and then closes it down correctly whether an exception is thrown or not.

There is no public class in the common standard library that implements the `AutoCloseable` interface. So in the below
example, we define the `XMLWriter` interface and assume that there is a resource that implements it. For example, this
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

We've added support for Base64 encoding and decoding. We provide three class instances, each using different encoding
schemes and having different behaviors. Use the `Base64.Default` instance for the standard [Base64 encoding scheme](https://www.rfc-editor.org/rfc/rfc4648#section-4). 

Use the `Base64.UrlSafe` instance for the ["URL and Filename safe"](https://www.rfc-editor.org/rfc/rfc4648#section-5) encoding scheme.

Alternatively, use the `Base64.Mime` instance for the [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) encoding
scheme. Note that when you use the `Base64.Mime` instance, all encoding functions insert a line separator every 76
characters. In the case of decoding, any illegal characters are skipped and don't throw an exception.

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


You can use additional functions to encode/decode bytes into an existing buffer, as well as to append the encoding result
to a provided `Appendable` type object.

In Kotlin/JVM, we've also added extension functions `encodingWith()` and `decodingWith()`  to enable you to perform
Base64 encoding and decoding with input and output streams.

## How to update to the Kotlin 1.8.20-Beta

Install Kotlin 1.8.20-Beta in any of the following ways:

* If you use the _Early Access Preview_ update channel, the IDE will suggest automatically updating to 1.8.20-Beta as
  soon as it becomes available.
* If you use the _Stable_ update channel, you can change the channel to _Early Access Preview_ at any time by selecting
  **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** in your IDE. You'll then be able to install the latest preview release. Check out [these instructions](https://kotlinlang.org/docs/install-eap-plugin.html) for details.

Once you've installed 1.8.20-Beta, don't forget to [change the Kotlin version](https://kotlinlang.org/docs/configure-build-for-eap.html)
to 1.8.20-Beta in your build scripts.
