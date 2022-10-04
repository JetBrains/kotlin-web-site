[//]: # (title: What's new in Kotlin 1.7.20-RC)

_[Release date: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all the features of the Early Access Preview (EAP) release, but highlights the new ones and some major improvements.
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20-RC).
>
{type="note"}

The Kotlin 1.7.20-RC release is out! Here are some highlights from this preview version of Kotlin:

* [The new Kotlin K2 compiler supports `all-open`, SAM with receiver, Lombok, Parcelize, and other compiler plugins](#support-for-kotlin-k2-compiler-plugins)
* [We introduced the preview of the `..<` operator for creating open-ended ranges](#preview-of-the-operator-for-creating-open-ended-ranges)
* [The new Kotlin/Native memory manager enabled by default](#the-new-kotlin-native-memory-manager-is-enabled-by-default)
* [We introduced a new experimental feature for JVM: inline classes with a generic underlying type](#generic-inline-classes)
* [Kotlin Gradle plugin updates for Gradle 7.1 support](#support-for-gradle-7-1)

## Support for Kotlin K2 compiler plugins

The Kotlin team continues to stabilize the K2 compiler.
K2 is still in Alpha (as [announced in the Kotlin 1.7.0 release](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)), but now it supports several compiler plugins.
You can follow [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-52604) to get updates from the Kotlin team on the new compiler.

Starting with this preview version, the Kotlin K2 compiler supports the following plugins:

* [`all-open`](all-open-plugin.md)
* [`no-arg`](no-arg-plugin.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Lombok](lombok.md)
* Parcelize
* AtomicFU
* `jvm-abi-gen`

> The Alpha version of the new K2 compiler only works with JVM projects.
> It doesn't support Kotlin/JS, Kotlin/Native, or other multi-platform projects.
> 
{type="warning"}

Learn more about the new compiler and its benefits in the following videos:
* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)


### How to enable the Kotlin K2 compiler

To enable the Kotlin K2 compiler and test it, use the following compiler option:

```bash
-Xuse-k2
```

You can check out the performance boost on your JVM projects and compare it with the results of the old compiler.

### Leave your feedback on the new K2 compiler

We really appreciate your feedback in any form:
* Provide your feedback directly to K2 developers in Kotlin Slack: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) and join the [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) channel
* Report any problems you faced with the new K2 compiler to [our issue tracker](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Performance%20Problem&c=Subsystems%20Frontend.%20IR)
* [Enable the **Send usage statistics** option](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) to allow JetBrains collecting anonymous data about K2 usage

## Preview of the ..< operator for creating open-ended ranges

> The new operator is [Experimental](components-stability.md#stability-levels-explained), and it has limited support in the IDE.
>
{type="warning"}

This release introduces the new `..<` operator. Kotlin has the `..` operator to express a range of values.
The new `..<` operator acts like the `until` function, and helps you define the open-ended range.  

Our research shows that this new operator does a better job at expressing open-ended ranges and making it clear that the upper bound is not included.

Here is an example of using the `..<` operator in a `when` expression:

```kotlin
when (value) {
    in 0.0..<0.25 -> // first quarter
    in 0.25..<0.5 -> // second quarter
    in 0.5..<0.75 -> // third quarter
    in 0.75..1.0 ->  // last quarter  <- note closed range here
}
```
{validate="false"}

### Standard library API changes

The following new types and operations will be introduced in the `kotlin.ranges` packages in the common Kotlin standard library:

#### New OpenEndRange<T> interface

The new interface to represent open-ended ranges is very similar to the existing `ClosedRange<T>` interface:

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // lower bound
    val start: T
    // upper bound, not included in the range
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```
{validate="false"}

#### Implementing OpenEndRange in the existing iterable ranges

Currently, in a situation when a developer needs to get a range with excluded upper bound, they use `until` function producing a closed iterable range effectively with the same values.
In order to make these ranges acceptable in the new API that takes `OpenEndRange<T>`, we want to implement that interface in the existing iterable ranges: `IntRange`, `LongRange`, `CharRange`, `UIntRange`, `ULongRange`.
So they will be implementing both `ClosedRange<T>` and `OpenEndRange<T>` interfaces simultaneously.

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```
{validate="false"}

#### rangeUntil operators for the standard types

`rangeUntil` operators will be provided for the same types and their combinations that currently have `rangeTo` operator defined.
For the purposes of prototype, we provide them as extension functions, but for consistency we plan to make them members later, before stabilizing the open-ended ranges API.

### How to enable the `..<` operator

In order to use the `..<` operator or to implement that operator convention for your own types, you should enable the `-XXLanguage:+RangeUntilOperator`compiler option.

The new API elements introduced to support the open-ended ranges of the standard types require an opt-in, as usual for an experimental stdlib API: `@OptIn(ExperimentalStdlibApi::class)`.
Alternatively, you could use a compiler option: `-opt-in=kotlin.ExperimentalStdlibApi`.

[Read more about the new operator in this KEEP document](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md).

## The new Kotlin/Native memory manager is enabled by default

Kotlin 1.7.20 comes with the new Kotlin/Native memory manager enabled by default.
This release brings further stability and performance improvements, allowing us to promote the new memory manager to [Beta](components-stability.md#stability-levels-explained).

The previous memory manager made writing concurrent and asynchronous code complicated, including issues with implementing the `kotlinx.coroutines` library.
This blocked the adoption of Kotlin Multiplatform Mobile because concurrency limitations created problems with sharing Kotlin code between iOS and Android platforms.
The new memory manager finally paves the way to [promote Kotlin Multiplatform Mobile to Beta](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/).

The new memory manager also supports the compiler cache that makes compilation times comparable to previous releases.
For more on the benefits of the new memory manager, see our original [blog post](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/) for the preview version.
You can find more technical details in the [migration instructions on GitHub](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md).

### Configuration and setup

Starting with Kotlin 1.7.20, the new memory manager is the default. Not much additional setup is required.

If you've already turned it on manually, you can remove the `kotlin.native.binary.memoryModel=experimental` option from your `gradle.properties` or `binaryOptions["memoryModel"] = "experimental"` from the `build.gradle(.kts)` file.

If it's necessary, you can switch back to the legacy memory manager with the `kotlin.native.binary.memoryModel=strict` option in your `gradle.properties`.
However, compiler cache support is not available for the legacy memory manager anymore, so compilation times might become worse.

#### Freezing

In the new memory manager, freezing is deprecated. Don't use it unless you need your code to work with the legacy manager (where freezing is still required).
This may be helpful for library authors that need to maintain support for the legacy memory manager or developers who want to have a fallback if they encounter issues with the new memory manager.

In such cases, you can temporarily support code for both new and legacy memory managers. To ignore deprecation warnings, do one of the following:

* Annotate usages of the deprecated API with `@OptIn(FreezingIsDeprecated::class)`.
* Apply `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")` to all the Kotlin source sets in Gradle.
* Pass the compiler flag `-opt-in=kotlin.native.FreezingIsDeprecated`.

#### Calling Kotlin suspending functions from Swift/Objective-C

The new memory manager still has a restriction on calling Kotlin `suspend` functions from Swift and Objective-C from threads other than the main one, but you can lift it with a new Gradle option.

This restriction was originally introduced in the legacy memory manager due to cases where the code dispatched a continuation to be resumed on the original thread. If this thread didn't have a supported event loop, the task would never run, and the coroutine would never be resumed.

In certain cases, this restriction is no longer required, but a check of all the necessary conditions can't be easily implemented.
Because of this, we decided to keep it in the new memory manager, while introducing an option for you to disable it.
For this, add the following option to your `gradle.properties`:

```properties
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

> Do not add this option if you use the `native-mt` version of `kotlinx.coroutines` or other libraries that have the same "dispatch to the original thread" approach.
>
{type="warning"}

The Kotlin team is very grateful to [Ahmed El-Helw](https://github.com/ahmedre) for implementing this option.

### Leave your feedback

This is a significant change to our ecosystem. We would appreciate your feedback to help make it even better.

Try the new memory manager on your projects and [share feedback in our issue tracker, YouTrack](https://youtrack.jetbrains.com/issue/KT-48525).

## Generic inline classes

> Generic inline classes is an [Experimental](components-stability.md#stability-levels-explained) feature.
> It may be dropped or changed at any time. Opt-in is required (see details below), and you should use it only for evaluation purposes.
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994).
>
{type="warning"}

Kotlin 1.7.20-RC allows the underlying type of JVM inline classes to be a type parameter.
The compiler maps it to `Any?` or, generally, to the upper bound of the type parameter.

Consider the following example:

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // compiler generates fun compute-<hashcode>(s: Any?)
```

The function accepts the inline class as a parameter. The parameter is mapped to the upper bound and not to the type argument.

To enable this feature, use the `-language-version 1.8` compiler option.

## Support for Gradle 7.1

Kotlin 1.7.20-RC fixes usages of deprecated in Gradle 7.1 methods and properties, which removes deprecation warnings introduced in this Gradle release.

Note a potential breaking change − `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` now has a generic parameter, `SingleTargetExtension<T : KotlinTarget>`.

If you have multiplatform projects, mind the following changes:

* The `kotlin.targets.fromPreset()` convention is deprecated. Instead, you can still use `kotlin.targets { fromPreset() }` approach, but we recommend using more [specialized ways to create targets](multiplatform-set-up-targets.md).
* Target accessors auto-generated by Gradle are no longer available inside the `kotlin.targets { }` block. Please use the `findByName("targetName")` method instead.
Note that such accessors are still available in the `kotlin.targets` case, for example `kotlin.targets.linuxX64`.

## How to update to the Kotlin 1.7.20-RC

The IDE support for Kotlin 1.7.20-RC is available for IntelliJ IDEA 2022.2.1, Android Studio Dolphin (2021.3.1),
and Android Studio Electric Eel (2022.1.1).

You can install Kotlin 1.7.20-RC in any of the following ways:

* If you use the _Early Access Preview_ update channel, the IDE will suggest automatically updating to 1.7.20-RC as soon as it becomes available.
* If you use the _Stable_ update channel, you can change the channel to _Early Access Preview_ at any time by selecting **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** in your IDE. You'll then be able to install the latest preview release. Check out [these instructions](install-eap-plugin.md) for details.

Once you've installed 1.7.20-RC, don't forget to [change the Kotlin version](configure-build-for-eap.md) to 1.7.20-RC in your build scripts.
