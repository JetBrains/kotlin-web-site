[//]: # (title: What's new in Kotlin 1.7.20)

<microformat>
   <p>The IDE support for Kotlin 1.7.20 is available for IntelliJ IDEA <strong>2022.2.1</strong> and later.</p>
</microformat>

_[Release date: %kotlinReleaseDate%](eap.md#build-details)_

Here are highlights from Kotlin 1.7.20:

* [The new Kotlin K2 compiler supports `all-open`, SAM with receiver, Lombok, Parcelize, and other compiler plugins](#support-for-kotlin-k2-compiler-plugins)
* [We introduced the preview of the `..<` operator for creating open-ended ranges](#preview-of-the-operator-for-creating-open-ended-ranges)
* [The new Kotlin/Native memory manager enabled by default](#the-new-kotlin-native-memory-manager-is-enabled-by-default)
* [We introduced a new experimental feature for JVM: inline classes with a generic underlying type](#generic-inline-classes)
* [Kotlin Gradle plugin updates for Gradle 7.1 support](#support-for-gradle-7-1)

## Support for Kotlin K2 compiler plugins

The Kotlin team continues to stabilize the K2 compiler.
K2 is still in Alpha (as [announced in the Kotlin 1.7.0 release](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)), but now it supports several compiler plugins.
You can follow [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-52604) to get updates from the Kotlin team on the new compiler.

Starting with this Kotlin version, the K2 compiler supports the following plugins:

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

## Language

### Preview of the ..< operator for creating open-ended ranges

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

#### Standard library API changes

The following new types and operations will be introduced in the `kotlin.ranges` packages in the common Kotlin standard library:

##### New OpenEndRange<T> interface

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

##### Implementing OpenEndRange in the existing iterable ranges

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

##### rangeUntil operators for the standard types

`rangeUntil` operators will be provided for the same types and their combinations that currently have `rangeTo` operator defined.
For the purposes of prototype, we provide them as extension functions, but for consistency we plan to make them members later, before stabilizing the open-ended ranges API.

#### How to enable the `..<` operator

In order to use the `..<` operator or to implement that operator convention for your own types, you should enable the `-XXLanguage:+RangeUntilOperator`compiler option.

The new API elements introduced to support the open-ended ranges of the standard types require an opt-in, as usual for an experimental stdlib API: `@OptIn(ExperimentalStdlibApi::class)`.
Alternatively, you could use a compiler option: `-opt-in=kotlin.ExperimentalStdlibApi`.

[Read more about the new operator in this KEEP document](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md).

### Improved string representations for singletons and sealed class hierarchies with data objects

> Data objects are [Experimental](components-stability.md#stability-levels-explained), and have limited support in the IDE at the moment.
>
{type="note"}

This release introduces a new type of `object` declaration for you to use: `data object`. Data objects behave conceptually identical to regular `object` declarations, but come with a clean `toString` representation out of the box:

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

This makes `data object` declarations a particularly good fit for sealed class hierarchies, where you may be using them alongside `data class` declarations.
In this snippet, declaring `EndOfFile` as a `data object` instead of a plain `object` means that it will get a pretty `toString` without the need to override it manually, maintaining symmetry with the accompanying `data class` definitions:

```kotlin
sealed class ReadResult {
    data class Number(val value: Int): ReadResult()
    data class Text(val value: String): ReadResult()
    data object EndOfFile: ReadResult()
}

fun main() {
    println(ReadResult.Number(1)) // Number(value=1)
    println(ReadResult.Text("Foo")) // Text(value=Foo)
    println(ReadResult.EndOfFile) // EndOfFile
}
```

How to enable data objects
To use data object declarations in your code, enable the `-language-version 1.8` compiler option.
In a Gradle project, you can do so by adding the following to your `build.gradle.(kts)`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    // . . .
    kotlinOptions.languageVersion = "1.9"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    // . . .
    kotlinOptions.languageVersion = '1.9'
}
```

Read more about data objects, and share your feedback on their implementation in the [respective KEEP document](https://github.com/Kotlin/KEEP/pull/316).

### Builder type inference restrictions

Kotlin 1.7.20 has some major restrictions on [usage of builder type inference](using-builders-with-builder-inference.md) that could affect your code.
These restrictions apply to the code that contains builder lambda functions where it’s not possible to derive the parameter without analyzing the lambda itself: the parameter is used as an argument.
Now, the compiler will always show an error for such code and ask you to specify the type explicitly.

Consider the following cases:

* Builder inference with extension that hides members.
  If your code contain extension function that will be during the builder inference, the compiler will show your an error:

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList {
            this.add(Data())
            this.get(0).doSmth() // Resolves to 2 and leads to error
        }
    }
    ```
    {validate="false"} 
  
  To fix the code, you should specify the type explicitly:

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList<Data> { // Type argument!
            this.add(Data())
            this.get(0).doSmth() // resolves to 1
        }
    }
    ```

* Builder inference with multiple lambdas and the type arguments are not specified explicitly.
  If there are two or more lambda blocks in builder inference, and they affect the type. To prevent an error, the compiler requires to specify the type:

    ```kotlin
    fun <T: Any> buildList(
        first: MutableList<T>.() -> Unit, 
        second: MutableList<T>.() -> Unit
    ): List<T> {
        val list = mutableListOf<T>()
        list.first()
        list.second()
        return list 
    }
    
    fun main() {
        buildList(
            first = { // this: MutableList<String>
                add("")
            },
            second = { // this: MutableList<Int> 
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```
    {validate="false"}

  To fix the error, you should specify the type explicitly and fix the type mismatch:

    ```kotlin
    fun main() {
        buildList<Int>(
            first = { // this: MutableList<Int>
                add(0)
            },
            second = { // this: MutableList<Int>
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```

Our research shows that these cases are very rare and shouldn't affect your code. If they do, [file an issue](https://kotl.in/issue) and explain your case.

[Read this YouTrack issue for more information about this builder inference update](https://youtrack.jetbrains.com/issue/KT-53797).

## Kotlin/JVM

### Generic inline classes

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

## Kotlin/Native

### The new Kotlin/Native memory manager is enabled by default

Kotlin 1.7.20 comes with the new Kotlin/Native memory manager enabled by default.
This release brings further stability and performance improvements, allowing us to promote the new memory manager to [Beta](components-stability.md#stability-levels-explained).

The previous memory manager made writing concurrent and asynchronous code complicated, including issues with implementing the `kotlinx.coroutines` library.
This blocked the adoption of Kotlin Multiplatform Mobile because concurrency limitations created problems with sharing Kotlin code between iOS and Android platforms.
The new memory manager finally paves the way to [promote Kotlin Multiplatform Mobile to Beta](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/).

The new memory manager also supports the compiler cache that makes compilation times comparable to previous releases.
For more on the benefits of the new memory manager, see our original [blog post](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/) for the preview version.
You can find more technical details in the [migration instructions on GitHub](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md).

#### Configuration and setup

Starting with Kotlin 1.7.20, the new memory manager is the default. Not much additional setup is required.

If you've already turned it on manually, you can remove the `kotlin.native.binary.memoryModel=experimental` option from your `gradle.properties` or `binaryOptions["memoryModel"] = "experimental"` from the `build.gradle(.kts)` file.

If it's necessary, you can switch back to the legacy memory manager with the `kotlin.native.binary.memoryModel=strict` option in your `gradle.properties`.
However, compiler cache support is not available for the legacy memory manager anymore, so compilation times might become worse.

##### Freezing

In the new memory manager, freezing is deprecated. Don't use it unless you need your code to work with the legacy manager (where freezing is still required).
This may be helpful for library authors that need to maintain support for the legacy memory manager or developers who want to have a fallback if they encounter issues with the new memory manager.

In such cases, you can temporarily support code for both new and legacy memory managers. To ignore deprecation warnings, do one of the following:

* Annotate usages of the deprecated API with `@OptIn(FreezingIsDeprecated::class)`.
* Apply `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")` to all the Kotlin source sets in Gradle.
* Pass the compiler flag `-opt-in=kotlin.native.FreezingIsDeprecated`.

##### Calling Kotlin suspending functions from Swift/Objective-C

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

#### Leave your feedback

This is a significant change to our ecosystem. We would appreciate your feedback to help make it even better.

Try the new memory manager on your projects and [share feedback in our issue tracker, YouTrack](https://youtrack.jetbrains.com/issue/KT-48525).

## Gradle

Kotlin Gradle plugin updates are focused on providing compatibility with the new Gradle features and latest Gradle versions.
This release contains changes to support Gradle 7.1 therefore deprecating some old conventions:

### Support for Gradle 7.1

Kotlin 1.7.20 fixes usages of methods and properties deprecated in Gradle 7.1, which reduces the number of deprecation warnings produced by the Kotlin Gradle plugin and unblocks the future support of Gradle 8.0.

Note potentially breaking changes that might need your attention:

#### Target configuration

* `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` now has a generic parameter, `SingleTargetExtension<T : KotlinTarget>`.

* The `kotlin.targets.fromPreset()` convention is deprecated. Instead, you can still use the `kotlin.targets { fromPreset() }` approach, but we recommend using more [specialized ways to create targets](multiplatform-set-up-targets.md).

* Target accessors auto-generated by Gradle are no longer available inside the `kotlin.targets { }` block. Please use the `findByName("targetName")` method instead.
Note that such accessors are still available in the `kotlin.targets` case, for example, `kotlin.targets.linuxX64`.

#### Source directories configuration

The Kotlin Gradle plugin now adds Kotlin `SourceDirectorySet` as a `kotlin` extension to Java’s `SourceSet` group.
That makes it possible to configure source directories in the `build.gradle.kts` file similarly to Java:

```kotlin
sourceSets {
    main {
        kotlin {
            java.setSrcDirs(listOf("src/java"))
            kotlin.setSrcDirs(listOf("src/kotlin"))
        }
    }
}
```

So we deprecate the old Gradle convention that required to specify the source directories for Kotlin.

Remember that you can also use the `kotlin` extension to access `KotlinSourceSet`:

```kotlin
kotlin {
    sourceSets {
        main {
        // …
        }
    }
}
```

#### New method for JVM toolchain configuration

This release provides a new method `jvmToolchain()` to enable the [JVM toolchain feature](gradle.md#gradle-java-toolchains-support).
If you don’t need some additional [configuration fields](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html), such as `implementation` or `vendor`, you can use this method from Kotlin extension:

```kotlin
kotlin {
    jvmToolchain(17)
}
```

It simplifies the Kotlin project setup without any additional configuration.
Previously you need to specify the JDK version in the `jvmToolchain` block:

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## Standard library

## Documentation updates

Since the previous release, the Kotlin documentation has received some notable changes:

### Revamped and improved pages

* [Basic types overview](https://kotlinlang.org/docs/basic-types.html)
* [IDEs for Kotlin development](https://kotlinlang.org/docs/kotlin-ide.html)

### New articles in the Kotlin Multiplatform journal

* [Native and cross-platform app development: how to choose?](https://kotlinlang.org/docs/native-and-cross-platform.html)
* [The Six Best Cross-Platform App Development Frameworks](https://kotlinlang.org/docs/cross-platform-frameworks.html)

### New and updated tutorials

* [Get started with Kotlin Multiplatform Mobile](https://kotlinlang.org/docs/multiplatform-mobile-getting-started.html)
* [Build a full-stack web app with Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform-full-stack-app.html)
* [Build a web application with React and Kotlin/JS](https://kotlinlang.org/docs/js-react.html)

### Changes in release documentation

We no longer provide a list of recommended kotlinx libraries for each release. 
This list included only the versions recommended and tested with Kotlin itself, and it did not take into account that some libraries depend on each other and require a special kotlinx version, that may differ from the recommended for Kotlin.

We are working on a solution to provide information how libraries interrelate and depend on each other, so it will be clear what kotlinx library version you should use when you upgrade the Kotlin version in your project.

## How to update to the Kotlin 1.7.20-RC

IntelliJ IDEA 2022.2.1 automatically suggests updating the Kotlin plugin to 1.7.20.

> For Android Studio Dolphin (213) or Android Studio Electric Eel (221), the Kotlin plugin 1.7.20 will be delivered with upcoming Android Studios updates.
>
{type="note"}

The new command-line compiler is available for download on the [GitHub release page](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20).