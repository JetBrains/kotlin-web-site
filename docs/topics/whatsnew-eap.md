[//]: # (title: What's new in Kotlin 1.9.0-RC)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release, but it highlights the latest
> ones and some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0-RC).
>
{type="note"}

The Kotlin 1.9.0-RC release is out! Here are some highlights from this preview version of Kotlin:

* [New Kotlin K2 compiler updates](#new-kotlin-k2-compiler-updates)
* [Stable replacement of the enum class values function](#stable-replacement-of-the-enum-class-values-function)
* [Stable ..< operator for open-ended ranges](#stable-operator-for-open-ended-ranges)
* [New common function to get regex capture group by name](#new-common-function-to-get-regex-capture-group-by-name)
* [New path utility to create parent directories](#new-path-utility-to-create-parent-directories)
* [Preview of Gradle configuration cache in Kotlin Multiplatform](#preview-of-gradle-configuration-cache-in-kotlin-multiplatform)
* [Changes for Android target support in Kotlin Multiplatform](#changes-for-android-target-support-in-kotlin-multiplatform)
* [No object initialization when accessing constant values in Kotlin/Native](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
* [Ability to configure standalone mode for iOS simulator tests in Kotlin/Native](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)

## IDE support

The Kotlin plugins that support 1.9.0-RC are available for:

| IDE            | Supported versions            |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.3.x, 2023.1.x            |
| Android Studio | Giraffe (223), Hedgehog (231) |

## New Kotlin K2 compiler updates

The Kotlin team continues to stabilize the K2 compiler. The 1.9.0-RC release introduces further advancements, including
basic support for Kotlin/Native and improved Kotlin/JS stability in the K2 compiler. It's an important step towards full
support of multiplatform projects. We would appreciate [your feedback](#share-your-feedback-on-the-new-k2-compiler) to
help us with it.

Also, starting with 1.9.0-RC and until the release of Kotlin 2.0, you can easily test the K2 compiler in your projects.
Add `kotlin.experimental.tryK2=true` to your `gradle.properties` file or run the following command:

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

This Gradle property automatically sets the language version to 2.0 and updates the build report with the number of
Kotlin tasks compiled using the K2 compiler compared to the current compiler:

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Share your feedback on the new K2 compiler

We'd appreciate any feedback you might have!

* Provide your feedback directly to K2 developers in the Kotlin Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  and join the [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) channel.
* Report any problems you've faced with the new K2 compiler via [our issue tracker](https://kotl.in/issue).
* [Enable the **Send usage statistics** option](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) to
  allow JetBrains to collect anonymous data about K2 usage.

## Stable replacement of the enum class values function

In 1.8.20, the `entries` property for enum classes was introduced as an Experimental feature. The `entries` property is intended to be a modern and performant replacement for the synthetic `values()` function. In 1.9.0-RC, the `entries` property is [Stable](components-stability.md#stability-levels-explained).

> The `values()` function is still supported, but we recommend that you use the `entries` property instead.
>
{type="tip"}

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```
{validate="false"}

For more information about the `entries` property for enum classes, see [What's new in Kotlin 1.8.20](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function).

## Stable ..< operator for open-ended ranges

The new `..<` operator for open-ended ranges that was introduced in [Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)
is Stable in 1.9.0-RC. The standard library API for working with open-ended ranges is also Stable in this release.

Our research shows that the new `..<` operator makes it easier to understand when an open-ended range is declared. If 
you use the [`until`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/until.html) infix function, it's easy 
to make the mistake of assuming that the upper bound is included.

Here is an example using the `until` function:

```kotlin
fun main() {
    for (number in 2 until 10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 2 4 6 8
}
```
{validate="false"}

And here is an example using the new `..<` operator:

```kotlin
fun main() {
    for (number in 2..<10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 2 4 6 8
}
```
{validate="false"}

> Starting with version 2023.1.1, IntelliJ IDEA has a new code inspection that highlights when you can use the `..<` operator.
>
{type="note"}

For more information about what you can do with this operator, see [What's new in Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges).

## New common function to get regex capture group by name

Prior to 1.9.0-RC, every platform had its own extension to get a regular expression capture group by its name from a regular expression match.
However, there was no common function. It wasn't possible to implement prior to Kotlin 1.8.0,
because the standard library still supported JVM targets 1.6 and 1.7.

As of Kotlin 1.8.0, the standard library is compiled with JVM target 1.8. So in 1.9.0-RC,
there is now a **common** function [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html)
that retrieves group's contents by its name for a regular expression match.
This is useful when you want to access the results of regular expression matches belonging to a particular capture group.

Here is an example with a regular expression containing three capture groups: `city`, `state`, and `areaCode`.
You can use these group names to access the matched values:

```kotlin
fun main() {
    val regex = """\b(?<city>[A-Za-z\s]+),\s(?<state>[A-Z]{2}):\s(?<areaCode>[0-9]{3})\b""".toRegex()
    val input = "Coordinates: Austin, TX: 123"


    val match = regex.find(input)!!
    println(match.groups["city"]?.value) 
    // Austin
    println(match.groups["state"]?.value)
    // TX
    println(match.groups["areaCode"]?.value)
    // 123
}
```
{validate="false"}

## New path utility to create parent directories

In 1.9.0-RC there is a new extension function `createParentDirectories()` that you can use to create a new file with 
all the necessary parent directories. When you provide a file path to `createParentDirectories()`, it checks whether the parent
directories already exist. If they do, it does nothing. However, if they do not, it creates them for you.

`createParentDirectories()` is particularly useful when you are copying files. For example, you can use it in combination
with the [`copyToRecursively()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/copy-to-recursively.html) function:

```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(),
    followLinks = false
)
```
{validate="false"}

## Preview of Gradle configuration cache in Kotlin Multiplatform

Kotlin 1.9.0-RC comes with support for [Gradle configuration cache](https://docs.gradle.org/current/userguide/configuration_cache.html)
in multiplatform libraries. If you're a library author, you can already benefit from the improved build performance.

Gradle configuration cache speeds up the build process by reusing the results of the configuration phase for subsequent 
builds. The feature has become Stable since Gradle 8.1. To enable it, follow the instructions in the [Gradle documentation](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage).

> The Kotlin Multiplatform plugin still doesn't support Gradle configuration cache with Xcode integration tasks or the 
> [Kotlin CocoaPods Gradle plugin](native-cocoapods-dsl-reference.md). We expect to add this feature in a future Kotlin release.
>
{type="note"}

## Changes for Android target support in Kotlin Multiplatform

We continue our efforts to stabilize Kotlin Multiplatform. An essential step in this direction is to provide first-class support
for the Android target. We're excited to announce that in the future, the Android team from Google will provide its own 
Gradle plugin to support Android in Kotlin Multiplatform.

To open the way for the new solution from Google, we're renaming the `android` block to `androidTarget` in the current 
Kotlin DSL in 1.9.0-RC. This is a temporary change that is necessary to free the `android` name for the upcoming DSL 
from Google.

The Google plugin will be the preferred way of working with Android in multiplatform projects. When it's ready, we'll 
provide the necessary migration instructions so that you'll be able to use the short `android` name as before.

## No object initialization when accessing constant values in Kotlin/Native

Starting with Kotlin 1.9.0-RC, the Kotlin/Native backend doesn't initialize objects when accessing `const val` fields:

```kotlin
object MyObject {
    init {
        println("side effect!")
    }
    
    const val y = 1
}


fun main() {
    println(MyObject.y)	// no initialization at first
    val x = MyObject	// initialization occurs
    println(x.y)
}
```

Now the behavior is unified with Kotlin/JVM, where the implementation is consistent with Java and objects are never 
initialized in this case. You can also expect some performance improvements in your Kotlin/Native projects thanks to this
change.

## Ability to configure standalone mode for iOS simulator tests in Kotlin/Native

By default, when running iOS simulator tests for Kotlin/Native, the `--standalone` flag is used to avoid manual simulator
booting and shutdown. In 1.9.0-RC, you can now configure whether this flag is used in a Gradle task via the `standalone`
property. By default, the `--standalone` flag is used so standalone mode is enabled.

Here is an example of how to disable standalone mode in your `build.gradle.kts` file:
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```
{validate="false"}

> If you disable standalone mode, you must boot the simulator manually. To boot your simulator from CLI, you can use the
> following command:
>
> ```shell
> /usr/bin/xcrun simctl boot <DeviceId>
> ```
> 
{type = "warning"}

## How to update to Kotlin 1.9.0-RC

Install Kotlin 1.9.0-RC in any of the following ways:

* If you use the _Early Access Preview_ update channel, the IDE will suggest automatically updating to 1.9.0-RC as
  soon as it becomes available.
* If you use the _Stable_ update channel, you can change the channel to _Early Access Preview_ at any time by selecting
  **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** in your IDE. You'll then be able to install the latest
  preview release. Check out [these instructions](install-eap-plugin.md) for details.

Once you've installed 1.9.0-RC don't forget to [change the Kotlin version](configure-build-for-eap.md)
to 1.9.0-RC in your build scripts.
