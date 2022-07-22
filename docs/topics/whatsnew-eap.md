[//]: # (title: What's new in Kotlin 1.7.20-Beta)

_[Release date: 25 July 2022](eap.md#build-details)_

> This is an Early Access Preview (EAP) release. It doesn't cover all the features of the EAP release, but highlight the new ones and some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20-Beta).
>
{type="note"}

The Kotlin 1.7.20-Beta release is out! Here are some highlights from this preview version of Kotlin:

* [New Kotlin K2 compiler supports Lombok, `all-open`, Parcelize, and other compiler plugins](#support-for-kotlin-k2-compiler-plugins)
* [Preview of the `..<` operator for creating open-ended ranges](#preview-operator-for-creating-open-ended-ranges)
* [New Kotlin/Native memory manager enabled by default](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [New experimental feature for JVM: inline classes with generic underlying type](#generic-inline-classes)

## Support for Kotlin K2 compiler plugins

Kotlin team continues its journey to stabilize the K2 compiler.
K2 is still in Alpha (as announced in [Kotlin 1.7.0 release](https://kotlinlang.org/docs/whatsnew17.html#new-kotlin-k2-compiler-for-the-jvm-in-alpha)), but now it supports several compiler plugins.

Starting with this preview version, Kotlin K2 compiler supports the following plugins:

* [All-open](all-open-plugin.md)
* [No-Arg](no-arg-plugin.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Lombok](lombok.md)
* Parcelize
* atomicfu
* jvm-abi-gen

The Alpha version of the new K2 compiler only works with JVM projects. It doesn't support Kotlin/JS, Kotlin/Native, or other multi-platform projects.

To enable the Kotlin K2 compiler and test it, use the following compiler option:

```bash
-Xuse-k2
```

We really appreciate your feedback in any form:
* Provide your feedback directly to K2 developers in Kotlin Slack: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) and join the [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) channel
* Report any problems you faced with the new K2 compiler to [our issue tracker](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Performance%20Problem&c=Subsystems%20Frontend.%20IR).

Learn more about the new compiler and its benefits in the following videos:
* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

## Preview `..<` operator for creating open-ended ranges

> The new operator is [Experimental](components-stability.md#stability-levels-explained), and it has limited support in the IDE.
>
{type="note"}

This preview release introduces the new `..<` operator. Kotlin has the `..` operator to express the range of value. The new `..<` operator acts like the `until` function, and helps you to define the open-ended range.
Our researches show that it should better express the open-ended ranges, and make it clear that upper bound is not included.

In order to use the new `..<` operator in code and be able to overload it for user types, we provide the following operator convention:

```kotlin
operator fun FromType.rangeUntil(to: ToType): RangeType
```

Similar to `rangeTo` operator, this operator convention can be satisfied either with a member or an extension function taking `FromType`, the type of the first operand, as the receiver, and `ToType`, the type of the second operand, as the parameter. Usually `FromType` and `ToType` refer to the same type.

### How to enable the `..<` operator

In order to use `..<` operator or to implement that operator convention for own types, you should enable the `-XXLanguage:+RangeUntilOperator`compiler option.
The new API elements introduced to support the open-ended ranges of the standard types require an opt-in as usual experimental stdlib API: `@OptIn(ExperimentalStdlibApi::class)`.
Alternatively, you could use a compiler option `-opt-in=kotlin.ExperimentalStdlibApi`.

[Read more about the new operator in this KEEP document](https://github.com/ilya-g/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md).

## The new Kotlin/Native memory manager enabled by default

Kotlin 1.7.20 comes with the new Kotlin/Native memory manager enabled by default. This release brings further stability and performance improvements, allowing us to promote the new memory manager to [Beta](components-stability.md).

The previous memory manager made writing concurrent and even asynchronous code complicated, including the implementation issues of the `kotlinx.coroutines` library.
This blocked the adoption of Kotlin Multiplatform Mobile because concurrency limitations created problems with sharing Kotlin code between iOS and Android platforms. The new memory manager finally paves the road for promoting Kotlin Multiplatform Mobile to Beta.

Also, the new memory manager supports the compiler cache that makes your compilation time comparable to what you had in previous releases.
For more on the benefits of the new memory manager, see our original [blog post](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/) for its preview version. 
You can find more technical details in the [migration instructions](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md) on GitHub.

### Configuration and setup

Starting with Kotlin 1.7.20, the new memory manager is the default. Not much of an additional setup is required.

If you've already turned it on manually, you can remove the `kotlin.native.binary.memoryModel=experimental` option from your `gradle.properties` or `binaryOptions["memoryModel"] = "experimental"` from the `build.gradle(.kts)` file.

If it’s necessary, you can switch back to the legacy memory manager with the `kotlin.native.binary.memoryModel=strict` option in your `gradle.properties`. However, the compiler cache support is not available for the legacy memory manager anymore, so your compilation time might become worse.

#### Freezing

In the new memory manager, freezing is deprecated. Don't use it unless you need your code to work with the legacy manager (where freezing is still required).

In this case, you can temporarily support code for both new and legacy memory managers. To ignore deprecation warnings, do one of the following:
* Annotate usages of the deprecated API with `@OptIn(FreezingIsDeprecated::class)`
* Apply `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")` to all the Kotlin source sets in Gradle
* Pass the compiler flag `-opt-in=kotlin.native.FreezingIsDeprecated`

#### Calling Kotlin suspending functions from Swift/Objective-C

The new memory manager still has a restriction on calling Kotlin `suspend` functions from Swift and Objective-C from threads other than the main one, but you can lift it with a new Gradle option.

This restriction was originally introduced in the legacy memory manager due to cases when the code dispatched a continuation to be resumed on the original thread. If this thread didn’t have a supported event loop, the task would never run, and the coroutine would never be resumed.

In certain cases, this restriction is not required anymore, but checking all the necessary conditions can't be easily implemented. So we decided to keep it in the new memory manager, while introducing an option for you to disable it. For this, add the following option to your `gradle.properties`:

```properties
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

> Do not add this option if you use the `native-mt` version of `kotlinx.coroutines` or other libraries that have the same "dispatch to the original thread" approach.
>
{type="warning"}

The Kotlin team is very grateful to [Ahmed El-Helw](https://github.com/ahmedre) for implementing this option.

#### Leave your feedback

This is a significant change to our ecosystem. We would appreciate your feedback to help make it even better.
Try the new memory manager on your projects and [share feedback in our issue tracker, YouTrack](https://youtrack.jetbrains.com/issue/KT-48525).

## Generic inline classes

> Generic inline classes is an [Experimental](components-stability.md) feature.
> It may be dropped or changed at any time. Opt-in is required (see details below), and you should use it only for evaluation purposes.
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994).
>
{type="warning"}

Kotlin 1.7.20-Beta allows underlying type of JVM inline classes to be a type parameter. The compiler maps it to `Any?` or, generally, to the upper bound of the type parameter.

Consider the following example:

```kotlin
@JvmInline
value class IC<T>(val a: T)

fun foo(s: IC<String>) {} // compiler generates fun foo-<hash>(s: Any?)
```

The function accepts the inline class as a parameter. The parameter is mapped to the upper bound and not to the type argument.

To enable this feature, use the `-language-version 1.8` compiler option.

## How to update to the Kotlin 1.7.20-Beta

Install Kotlin 1.7.0-Beta in any of the following ways:

* If you use the _Early Access Preview_ update channel, the IDE will suggest automatically updating to 1.7.20-Beta as soon as it becomes available.
* If you use the _Stable_ update channel, you can change the channel to _Early Access Preview_ at any time by selecting **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** in your IDE. You’ll then be able to install the latest preview release. Check out [these instructions](install-eap-plugin.md) for details.

Once you’ve installed 1.7.20-Beta, don’t forget to [change the Kotlin version](configure-build-for-eap.md) to 1.7.20-Beta in your build scripts.
