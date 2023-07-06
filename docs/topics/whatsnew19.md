[//]: # (title: What's new in Kotlin 1.9.0)

_[Release date: %kotlinReleaseDate%](releases.md#release-details)_

The Kotlin 1.9.0 release is out and the K2 compiler for the JVM is now in **Beta**. Additionally, here are some of the main highlights:

* [New Kotlin K2 compiler updates](#new-kotlin-k2-compiler-updates)
* [Stable replacement of the enum class values function](#stable-replacement-of-the-enum-class-values-function)
* [Stable ..< operator for open-ended ranges](#stable-operator-for-open-ended-ranges)
* [New common function to get regex capture group by name](#new-common-function-to-get-regex-capture-group-by-name)
* [New path utility to create parent directories](#new-path-utility-to-create-parent-directories)
* [Preview of Gradle configuration cache in Kotlin Multiplatform](#preview-of-gradle-configuration-cache-in-kotlin-multiplatform)
* [Changes to Android target support in Kotlin Multiplatform](#changes-to-android-target-support-in-kotlin-multiplatform)
* [Preview of custom memory allocator in Kotlin/Native](#preview-of-custom-memory-allocator)
* [Library linkage in Kotlin/Native](#library-linkage-in-kotlinnative)
* [Size-related optimizations in Kotlin/Wasm](#size-related-optimizations)

You can also find a short overview of the updates in this video:

<video href="fvwTZc-dxsM" title="What's new in Kotlin 1.9.0"/>

## IDE support

The Kotlin plugins that support 1.9.0 are available for:

| IDE | Supported versions |
|--|--|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*The Kotlin 1.9.0 plugin will be integrated with Android Studio Giraffe (223) and Hedgehog (231) in their upcoming releases.

The Kotlin 1.9.0 plugin will be integrated with IntelliJ IDEA 2023.2 in the upcoming releases.

> To download Kotlin artifacts and dependencies, [configure Gradle settings](#configure-gradle-settings) to use the Maven Central Repository.
>
{type="warning"}

## New Kotlin K2 compiler updates

The Kotlin team at JetBrains continues to stabilize the K2 compiler and the 1.9.0 release introduces further advancements.
The K2 compiler for the JVM is now in **Beta**.

There's now also basic support for Kotlin/Native and multiplatform projects.

### Compatibility of the kapt compiler plugin with the K2 compiler

You can use the [kapt plugin](kapt.md) in your project along with the K2 compiler, but with some restrictions. 
Despite setting `languageVersion` to `2.0`, the kapt compiler plugin still utilizes the old compiler.

If you execute the kapt compiler plugin within a project where `languageVersion` is set to `2.0`, kapt will automatically
switch to `1.9` and disable specific version compatibility checks. This behavior is equivalent to including the following command arguments:
* `-Xskip-metadata-version-check`
* `-Xskip-prerelease-check`
* `-Xallow-unstable-dependencies`

These checks are exclusively disabled for kapt tasks. All other compilation tasks will continue to utilize the new K2 compiler.

If you encounter any issues when using kapt with the K2 compiler, please report them to our
[issue tracker](http://kotl.in/issue).

### Try the K2 compiler in your project

Starting with 1.9.0 until the release of Kotlin 2.0, you can easily test the K2 compiler with the `kotlin.experimental.tryK2=true`
Gradle property. You can also run the following command:

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

This Gradle property automatically sets the language version to 2.0 and updates the build report with the number of Kotlin
tasks compiled using the K2 compiler compared to the current compiler:

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradle build reports

[Gradle build reports](gradle-compilation-and-caches.md#build-reports) now show whether the current or the K2 compiler 
was used to compile the code. In Kotlin 1.9.0, you can see this information in your [Gradle build scans](https://scans.gradle.com/):

![Gradle build scan - K1](gradle-build-scan-k1.png){width=700}

![Gradle build scan - K2](gradle-build-scan-k2.png){width=700}

You can also find the Kotlin version used in the project right in the build report:

```none
Task info:
  Kotlin language version: 1.9
```

> If you use Gradle 8.0, you might come across some problems with build reports, especially when Gradle configuration 
> caching is enabled. This is a known issue, fixed in Gradle 8.1 and later.
>
{type="note"}

### Current K2 compiler limitations

Enabling K2 in your Gradle project comes with certain limitations that can affect projects using Gradle versions below 8.3 in the following cases:

* Compilation of source code from `buildSrc`.
* Compilation of Gradle plugins in included builds.
* Compilation of other Gradle plugins if they are used in projects with Gradle versions below 8.3.
* Building Gradle plugin dependencies.

If you encounter any of the problems mentioned above, you can take the following steps to address them:

* Set the language version for `buildSrc`, any Gradle plugins, and their dependencies:

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

* Update the Gradle version in your project to 8.3 when it becomes available.

### Leave your feedback on the new K2 compiler

We'd appreciate any feedback you may have!

* Provide your feedback directly to K2 developers Kotlin's Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
  and join the [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) channel.
* Report any problems you've faced with the new K2 compiler on [our issue tracker](https://kotl.in/issue).
* [Enable the **Send usage statistics** option](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) to
  allow JetBrains to collect anonymous data about K2 usage.

## Language

In Kotlin 1.9.0, we’re stabilizing some new language features that were introduced earlier:
* [Replacement of the enum class values function](#stable-replacement-of-the-enum-class-values-function)
* [Data object symmetry with data classes](#stable-data-objects-for-symmetry-with-data-classes)
* [Support for secondary constructors with bodies in inline value classes](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### Stable replacement of the enum class values function

In 1.8.20, the `entries` property for enum classes was introduced as an Experimental feature. The `entries` property is 
a modern and performant replacement for the synthetic `values()` function. In 1.9.0, the `entries` property is Stable.

> The `values()` function is still supported, but we recommend that you use the `entries`
> property instead.
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

For more information about the `entries` property for enum classes, see [What’s new in Kotlin 1.8.20](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function).

### Stable data objects for symmetry with data classes

Data object declarations that were introduced in [Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)
are now Stable. This includes the functions added for symmetry with data classes: `toString()`, `equals()`, and `hashCode()`.

This feature is particularly useful with `sealed` hierarchies (like a `sealed class` or `sealed interface` hierarchy), 
because `data object` declarations can be used conveniently alongside `data class` declarations. In this example, declaring
`EndOfFile` as a `data object` instead of a plain `object` means that it automatically has a `toString()` function without 
the need to override it manually. This maintains symmetry with the accompanying data class definitions.

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```
{validate="false"}

For more information, see [What’s new in Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes).

### Support for secondary constructors with bodies in inline value classes

Starting with Kotlin 1.9.0, the use of secondary constructors with bodies in [inline value classes](inline-classes.md) is
available by default:

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Allowed since Kotlin 1.4.30:
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // Allowed by default since Kotlin 1.9.0:
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```
{validate="false"}

Previously, Kotlin allowed using only public primary constructors in inline classes. As a result, it was impossible to 
encapsulate underlying values or create an inline class that would represent some constrained values.

As Kotlin developed, these issues were fixed. Kotlin 1.4.30 lifted restrictions on `init` blocks and then Kotlin 1.8.20 
came with a preview of secondary constructors with bodies. They are now available by default. Learn more about the 
development of Kotlin inline classes in [this KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md).

## Kotlin/JVM

Starting with version 1.9.0, the compiler can generate classes with a bytecode version corresponding to JVM 20. In addition,
the deprecation of the `JvmDefault` annotation and legacy `-Xjvm-default` modes continues.

### Deprecation of `JvmDefault` annotation and legacy `-Xjvm-default` modes

Starting from Kotlin 1.5, the usage of the `JvmDefault` annotation has been deprecated in favor of the newer `-Xjvm-default`
modes: `all` and `all-compatibility`. With the introduction of `JvmDefaultWithoutCompatibility` in Kotlin 1.4 and 
`JvmDefaultWithCompatibility` in Kotlin 1.6, these modes offer comprehensive control over the generation of `DefaultImpls`
classes, ensuring seamless compatibility with older Kotlin code.

Consequently in Kotlin 1.9.0, the `JvmDefault` annotation no longer holds any significance and has been marked as 
deprecated, resulting in an error. It will eventually be removed from Kotlin.

## Kotlin/Native

Among other improvements, this release brings further advancements to the [Kotlin/Native memory manager](native-memory-manager.md)
that should enhance its robustness and performance:

* [Preview of custom memory allocator](#preview-of-custom-memory-allocator)
* [Objective-C or Swift object deallocation hook on the main thread](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
* [No object initialization when accessing constant values in Kotlin/Native](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
* [Ability to configure standalone mode for iOS simulator tests](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
* [Library linkage in Kotlin/Native](#library-linkage-in-kotlin-native)

### Preview of custom memory allocator

Kotlin 1.9.0 introduces the preview of a custom memory allocator. Its allocation system improves the runtime performance
of the [Kotlin/Native memory manager](native-memory-manager.md).

The current object allocation system in Kotlin/Native uses a general-purpose allocator that doesn't have the functionality
for efficient garbage collection. To compensate, it maintains thread-local linked lists of all allocated objects before 
the garbage collector (GC) merges them into a single list, which can be iterated during sweeping. This approach comes 
with several performance downsides:

* The sweeping order lacks memory locality and often results in scattered memory access patterns, leading to potential performance issues.
* Linked lists require additional memory for each object, increasing memory usage, particularly when dealing with many small objects.
* The single list of allocated objects makes it challenging to parallelize sweeping, which can cause memory usage problems when mutator threads allocate objects faster than the GC thread can collect them.

To address these issues, Kotlin 1.9.0 introduces a preview of the custom allocator. It divides system memory into pages,
allowing independent sweeping in consecutive order. Each allocation becomes a memory block within a page, and the page 
keeps track of block sizes. Different page types are optimized for various allocation sizes. The consecutive arrangement
of memory blocks ensures efficient iteration through all allocated blocks.

When a thread allocates memory, it searches for a suitable page based on the allocation size. Threads maintain a set of 
pages for different size categories. Typically, the current page for a given size can accommodate the allocation. If not,
the thread requests a different page from the shared allocation space. This page may already be available, require 
sweeping, or should be created first.

The new allocator allows having multiple independent allocation spaces simultaneously, which will allow the Kotlin team 
to experiment with different page layouts to improve performance even further.

For more information on the design of the new allocator, see this [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/custom_alloc/README.md).

#### How to enable

Add the `-Xallocator=custom` compiler option:

```kotlin
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                freeCompilerArgs.add("-Xallocator=custom")
            }
        }
    }
}
```
{validate="false"}

#### Leave feedback

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native)
to improve the custom allocator.

### Objective-C or Swift object deallocation hook on the main thread

Starting with Kotlin 1.9.0, the Objective-C or Swift object deallocation hook is called on the main thread if the object
is passed to Kotlin on the main thread. The way the [Kotlin/Native memory manager](native-memory-manager.md) previously 
handled references to Objective-C objects could lead to memory leaks. We believe the new behavior should improve the 
robustness of the memory manager.

Consider an Objective-C object that is referenced in Kotlin code, for example, when passed as an argument, returned by 
a function, or retrieved from a collection. In this case, Kotlin creates its own object that holds the reference to the
Objective-C object. When the Kotlin object gets deallocated, the Kotlin/Native runtime calls the `objc_release` function 
that releases that Objective-C reference.

Previously, the Kotlin/Native memory manager ran `objc_release ` on a special GC thread. If it’s the last object reference,
the object gets deallocated. Issues could come up when Objective-C objects have custom deallocation hooks like the `dealloc`
method in Objective-C or the `deinit` block in Swift, and these hooks expect to be called on a specific thread.

Since hooks for objects on the main thread usually expect to be called there, Kotlin/Native runtime now 
calls `objc_release` on the main thread as well. It should cover the cases when the Objective-C object was passed to 
Kotlin on the main thread, creating a Kotlin peer object there. This only works if the main dispatch queue 
is processed, which is the case for regular UI applications. When it's not the main queue or the object was passed to 
Kotlin on a thread other than main, the `objc_release` is called on a special GC thread as before.

#### How to opt out

In case you face issues, you can disable this behavior in your `gradle.properties` file with the following option:

```none
kotlin.native.binary.objcDisposeOnMain=false
```

Don’t hesitate to report such cases to [our issue tracker](https://kotl.in/issue).

### No object initialization when accessing constant values in Kotlin/Native

Starting with Kotlin 1.9.0, the Kotlin/Native backend doesn’t initialize objects when accessing `const val` fields:

```kotlin
object MyObject {
    init {
        println("side effect!")
    }

    const val y = 1
}

fun main() {
    println(MyObject.y) // No initialization at first
    val x = MyObject    // Initialization occurs
    println(x.y)
}
```
{validate="false"}

The behavior is now unified with Kotlin/JVM, where the implementation is consistent with Java and objects are never 
initialized in this case. You can also expect some performance improvements in your Kotlin/Native projects thanks to 
this change.

### Ability to configure standalone mode for iOS simulator tests in Kotlin/Native

By default, when running iOS simulator tests for Kotlin/Native, the `--standalone` flag is used to avoid manual simulator
booting and shutdown. In 1.9.0, you can now configure whether this flag is used in a Gradle task via the `standalone` 
property. By default, the `--standalone` flag is used so standalone mode is enabled.

Here is an example of how to disable standalone mode in your `build.gradle.kts` file:

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```
{validate="false"}

> If you disable standalone mode, you must boot the simulator manually. To boot your simulator
> from CLI, you can use the following command:
>
> ```shell
> /usr/bin/xcrun simctl boot <DeviceId>
>```
> 
{type = "warning"}

### Library linkage in Kotlin/Native

Starting with Kotlin 1.9.0, the Kotlin/Native compiler treats linkage issues in Kotlin libraries the same way as Kotlin/JVM.
You might face such issues if the author of one third-party Kotlin library makes an incompatible change in experimental 
APIs that another third-party Kotlin library consumes.

Now builds don't fail during compilation in case of linkage issues between third-party Kotlin libraries. Instead, you'll
only encounter these errors in run time, exactly as on the JVM.

The Kotlin/Native compiler reports warnings every time it detects issues with library linkage. You can find such warnings
in your compilation logs, for example:

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

You can further configure or even disable this behavior in your projects:

* If you don’t want to see these warnings in your compilation logs, suppress them with the `-Xpartial-linkage-loglevel=INFO` compiler option.
* It’s also possible to raise the severity of reported warnings to compilation errors with `-Xpartial-linkage-loglevel=ERROR`. In this case, the compilation fails and you'll see all the errors in the compilation log. Use this option to examine the linkage issues more closely.
* If you face unexpected problems with this feature, you can always opt out with the
  `-Xpartial-linkage=disable` compiler option. Don’t hesitate to report such cases to [our issue
  tracker](https://kotl.in/issue).

```kotlin
// An example of passing compiler options via Gradle build file.
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {

                // To suppress linkage warnings:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // To raise linkage warnings to errors:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")

                // To disable the feature completely:
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```
{validate="false"}

### Compiler option for C interop implicit integer conversions

As we continue to work towards the stabilization of Kotlin/Native, we have introduced a compiler option for C interop 
that allows you to use implicit integer conversions. Previously it wasn’t necessary to configure a compiler option to 
use implicit integer conversions. After careful consideration, we’ve introduced this compiler option to prevent 
unintentional use as this feature still has room for improvement and our aim is to have an API of the highest quality.

In this code sample an implicit integer conversion allows `options = 0` even though [`options`](https://developer.apple.com/documentation/foundation/nscalendar/options)
has unsigned type `UInt` and `0` is signed.

```kotlin
val today = NSDate()
val tomorrow = NSCalendar.currentCalendar.dateByAddingUnit(
    unit = NSCalendarUnitDay,
    value = 1,
    toDate = today,
    options = 0
)
```
{validate="false"}

To use implicit conversions with native interop libraries, use the `-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion`
compiler option.

You can configure this in your Gradle `build.gradle.kts` file:
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```
{validate="false"}

## Kotlin Multiplatform

Kotlin Multiplatform has received some notable updates in 1.9.0 designed to improve your developer experience:

* [Changes to Android target support](#changes-to-android-target-support)
* [New Android source set layout enabled by default](#new-android-source-set-layout-enabled-by-default)
* [Preview of Gradle configuration cache in multiplatform projects](#preview-of-gradle-configuration-cache)

### Changes to Android target support

We continue our efforts to stabilize Kotlin Multiplatform. An essential step is to provide first-class 
support for the Android target. We’re excited to announce that in the future, the Android team from Google will provide 
its own Gradle plugin to support Android in Kotlin Multiplatform.

To open the way for this new solution from Google, we’re renaming the `android` block in the current Kotlin DSL in 1.9.0.
Please change all the occurrences of the `android` block to `androidTarget` in your build scripts. This is a temporary 
change that is necessary to free the `android` name for the upcoming DSL from Google.

The Google plugin will be the preferred way of working with Android in multiplatform projects. When it’s ready, we’ll 
provide the necessary migration instructions so that you’ll be able to use the short `android` name as before.

### New Android source set layout enabled by default

Starting with Kotlin 1.9.0, the new Android source set layout is the default. It replaced the previous naming schema for 
directories, which was confusing in multiple ways. The new layout has a number of advantages:

* Simplified type semantics. The new Android source layout provides clear and consistent naming conventions that help to distinguish between different types of source sets.
* Improved source directory layout. With the new layout, the `SourceDirectories` arrangement becomes more coherent, making it easier to organize code and locate source files.
* Clear naming schema for Gradle configurations. The schema is now more consistent and predictable in both `KotlinSourceSets` and `AndroidSourceSets`.

The new layout requires the Android Gradle plugin version 7.0 or later and is supported in Android Studio 2022.3 and later. See our
[migration guide](multiplatform-android-migration-guide.md) to make the necessary changes in your `build.gradle(.kts)` file.

### Preview of Gradle configuration cache

Kotlin 1.9.0 comes with support for the [Gradle configuration cache](https://docs.gradle.org/current/userguide/configuration_cache.html)
in multiplatform libraries. If you’re a library author, you can already benefit from the improved build performance.

Gradle configuration cache speeds up the build process by reusing the results of the configuration phase for subsequent
builds. The feature has become Stable since Gradle 8.1. To enable it, follow the instructions in the [Gradle documentation](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage).

> The Kotlin Multiplatform plugin still doesn’t support Gradle configuration cache with Xcode integration tasks or the
> [Kotlin CocoaPods Gradle plugin](native-cocoapods-dsl-reference.md). We expect to add this feature in future Kotlin releases.
>
{type="note"}

## Kotlin/Wasm

The Kotlin team continues to experiment with the new Kotlin/Wasm target. This release introduces several performance and
[size-related optimizations](#size-related-optimizations), along with [updates in JavaScript interop](#updates-in-javascript-interop).

### Size-related optimizations

Kotlin 1.9.0 introduces significant size improvements for WebAssembly (Wasm) projects. Comparing two "Hello World" projects, 
the code footprint for Wasm in Kotlin 1.9.0 is now over 10 times smaller than in Kotlin 1.8.20.

These size optimizations result in more efficient resource utilization and improved performance when targeting Wasm 
platforms with Kotlin code.

### Updates in JavaScript interop

This Kotlin update introduces changes to the interoperability between Kotlin and JavaScript for Kotlin/Wasm. As Kotlin/Wasm
is an [Experimental](components-stability.md#stability-levels-explained) feature, certain limitations apply to its 
interoperability.

#### Restriction of Dynamic types

Starting with version 1.9.0, Kotlin no longer supports the use of `Dynamic` types in Kotlin/Wasm. This is now deprecated
in favor of the new universal `JsAny` type, which facilitates JavaScript interoperability.

For more details, see the [Kotlin/Wasm interoperability with JavaScript](wasm-js-interop.md) documentation.

#### Restriction of non-external types

Kotlin/Wasm supports conversions for specific Kotlin static types when passing values to and from JavaScript. These supported
types include:

* Primitives, such as signed numbers, `Boolean`, `Char`.
* `String`.
* Function types.

Other types were passed without conversion as opaque references, leading to inconsistencies between JavaScript and Kotlin
subtyping.

To address this, Kotlin restricts JavaScript interop to a well-supported set of types. Starting from Kotlin 1.9.0, only external,
primitive, string, and function types are supported in Kotlin/Wasm JavaScript interop. Furthermore, a separate explicit type called
`JsReference` has been introduced to represent handles to Kotlin/Wasm objects that can be used in JavaScript interop.

For more details, refer to the [Kotlin/Wasm interoperability with JavaScript](wasm-js-interop.md) documentation.

### Kotlin/Wasm in Kotlin Playground

Kotlin Playground supports the Kotlin/Wasm target.
You can write, run, and share your Kotlin code that targets the Kotlin/Wasm. [Check it out!](https://pl.kotl.in/HDFAvimga)

> Using Kotlin/Wasm requires enabling experimental features in your browser.
>
> [Learn more about how to enable these features](wasm-get-started.md#troubleshooting).
>
{type="note"}

```kotlin
import kotlin.time.*
import kotlin.time.measureTime

fun main() {
    println("Hello from Kotlin/Wasm!")
    computeAck(3, 10)
}

tailrec fun ack(m: Int, n: Int): Int = when {
    m == 0 -> n + 1
    n == 0 -> ack(m - 1, 1)
    else -> ack(m - 1, ack(m, n - 1))
}

fun computeAck(m: Int, n: Int) {
    var res = 0
    val t = measureTime {
        res = ack(m, n)
    }
    println()
    println("ack($m, $n) = ${res}")
    println("duration: ${t.inWholeNanoseconds / 1e6} ms")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-1-9-0-kotlin-wasm-playground"}

## Kotlin/JS

This release introduces updates for Kotlin/JS, including the deprecation of the Kotlin/JS Gradle plugin and Experimental
support for ES6:

* [Deprecation of the Kotlin/JS Gradle plugin](#deprecation-of-the-kotlin-js-gradle-plugin)
* [Deprecation of external enum](#deprecation-of-external-enum)
* [Experimental support for ES6 classes and modules](#experimental-support-for-es6-classes-and-modules)
* [Changed default destination of JS production distribution](#changed-default-destination-of-js-production-distribution)
* [Extract org.w3c declarations from stdlib-js](#extract-org-w3c-declarations-from-stdlib-js)

> Starting from version 1.9.0, [partial library linkage](#library-linkage-in-kotlin-native) is also enabled for Kotlin/JS.
>
{type="note"}


### Deprecation of the Kotlin/JS Gradle plugin

Starting with Kotlin 1.9.0, the `kotlin-js` Gradle plugin is
deprecated. We encourage you to use the `kotlin-multiplatform` Gradle plugin with the `js()` target instead.

The functionality of the Kotlin/JS Gradle plugin essentially duplicated the `kotlin-multiplatform` plugin and shared the
same implementation under the hood. This overlap created confusion and increased maintenance load on the Kotlin team.

Refer to our [Compatibility guide for Kotlin Multiplatform](multiplatform-migration-guide.md#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin) 
for migration instructions. If you find any issues that aren't covered in the guide, please report them to our [issue tracker](http://kotl.in/issue).

### Deprecation of external enum

In Kotlin 1.9.0, the use of external enums will be deprecated due to issues with static enum members like `entries`, that
can’t exist outside Kotlin. We recommend using an external sealed class with object subclasses instead:

```kotlin
// Before
external enum class ExternalEnum { A, B }

// After
external sealed class ExternalEnum {
    object A: ExternalEnum
    object B: ExternalEnum
}
```
{validate="false"}

By switching to an external sealed class with object subclasses, you can achieve similar functionality to external enums
while avoiding the problems associated with default methods.

Starting from Kotlin 1.9.0, the use of external enums will be marked as deprecated. We encourage you to update your code
to utilize the suggested external sealed class implementation for compatibility and future maintenance.

### Experimental support for ES6 classes and modules

This release introduces [Experimental](components-stability.md#stability-levels-explained) support for ES6 modules and generation of ES6 classes:
* Modules offer a way to simplify your codebase and improve maintainability.
* Classes allow you to incorporate object-oriented programming (OOP) principles, resulting in cleaner and more intuitive code.

To enable these features, update your `build.gradle.kts` file accordingly:

```kotlin
// build.gradle.kts
kotlin { 
    js(IR) { 
        useEsModules() // Enables ES6 modules
        browser()
        }
    }

// Enables ES6 classes generation
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        useEsClasses = true
    }
}
```
{validate="false"}

[Learn more about ECMAScript 2015 (ES6) in the official documentation](https://262.ecma-international.org/6.0/).

### Changed default destination of JS production distribution

Prior to Kotlin 1.9.0, the distribution target directory was `build/distributions`. However, this is a common directory 
for Gradle archives. To resolve this issue, we’ve changed the default distribution target directory in Kotlin 1.9.0 to: 
`build/dist/<targetName>/<binaryName>`.

For example, `productionExecutable` was in `build/distributions`. In Kotlin 1.9.0, it's in `build/dist/js/productionExecutable`.

> If you have a pipeline in place that uses the results of these builds, make sure to update the directory.
>
{type="warning"}

### Extract org.w3c declarations from stdlib-js

Since Kotlin 1.9.0, the `stdlib-js` no longer includes `org.w3c` declarations. Instead, these declarations have been 
moved to a separate Gradle dependency. When you add the Kotlin Multiplatform Gradle plugin to your `build.gradle.kts` file,
these declarations will be automatically included in your project, similar to the standard library.

There is no need for any manual action or migration. The necessary adjustments will be handled automatically.

## Gradle

Kotlin 1.9.0 comes with new Gradle compiler options and a lot more:

* [Removed classpath property](#removed-classpath-property)
* [New Gradle compiler options](#new-compiler-options)
* [Project-level compiler options for Kotlin/JVM](#project-level-compiler-options-for-kotlin-jvm)
* [Compiler option for Kotlin/Native module name](#compiler-option-for-kotlin-native-module-name)
* [Separate compiler plugins for offical Kotlin libraries](#separate-compiler-plugins-for-offical-kotlin-libraries)
* [Incremented the minimum supported version](#incremented-minimum-supported-version)
* [kapt doesn’t cause eager task creation](#kapt-doesn-t-cause-eager-task-creation-in-gradle)
* [Programmatic configuration of the JVM target validation mode](#programmatic-configuration-of-the-jvm-target-validation-mode)

### Removed classpath property

In Kotlin 1.7.0, we announced the start of a deprecation cycle for the `KotlinCompile` task’s property: `classpath`. The
deprecation level was raised to `ERROR` in Kotlin 1.8.0. In this release, we finally remove the `classpath` property. 
All compile tasks should now use the `libraries` input for a list of libraries required for compilation.

### New compiler options

The Kotlin Gradle plugin now provides new properties for opt-ins and the compiler’s progressive mode.

* To opt in to new APIs, you can now use the `optIn` property and pass a list of strings like: `optIn.set(listOf(a, b, c))`.
* To enable the progressive mode, use `progressiveMode.set(true)`.

### Project-level compiler options for Kotlin/JVM

Starting with Kotlin 1.9.0, there is a new `compilerOptions` block  available inside the `kotlin` configuration block:

```kotlin
kotlin {
    compilerOptions {
        jvmTarget.set(JVM.Target_11)
    }
}
```
{validate="false"}

It makes configuring compiler options much easier. However, note some important details:

* This configuration only works on the project level.
* For the Android plugin, this block configures the same object as:

```kotlin
android {
    kotlinOptions {}
}
```
{validate="false"}

* The `android.kotlinOptions` and `kotlin.compilerOptions` configuration blocks override each other. The last (lowest) block in the build file always takes effect.
* If `moduleName` is configured on the project level, its value could be changed when passed to the compiler. It’s not the case for the `main` compilation, but for other types, for example, test sources, the Kotlin Gradle plugin will add the  `_test` suffix.
* The configuration inside the `tasks.withType<KotlinJvmCompile>().configureEach {}` (or `tasks.named<KotlinJvmCompile>("compileKotlin") { }`) overrides both `kotlin.compilerOptions` and `android.kotlinOptions`.

### Compiler option for Kotlin/Native module name

The Kotlin/Native [`module-name`](compiler-reference.md#module-name-name-native) compiler option is now easily available
in the Kotlin Gradle plugin.

This option specifies a name for the compilation module and can also be used for adding a name prefix for the declarations
exported to Objective-C.

You can now set the module name directly in the `compilerOptions` block of your Gradle build files:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>("compileKotlinLinuxX64") {
    compilerOptions {
        moduleName.set("my-module-name")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlinLinuxX64", org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile.class) {
    compilerOptions {
        moduleName = "my-module-name"
    }
}
```

</tab>
</tabs>


### Separate compiler plugins for official Kotlin libraries

Kotlin 1.9.0 introduces separate compiler plugins for its official libraries. Previously, compiler plugins were embedded
into their corresponding Gradle plugins. This could cause compatibility issues in case the compiler plugin was compiled 
against a Kotlin version higher than the Gradle build's Kotlin runtime version.

Now compiler plugins are added as separate dependencies, so you won’t face compatibility issues with older Gradle versions
anymore. Another major advantage of the new approach is that new compiler plugins can be used with other build systems 
like [Bazel](https://bazel.build/).

Here’s the list of new compiler plugins we’re now publishing to Maven Central:

* kotlin-atomicfu-compiler-plugin
* kotlin-allopen-compiler-plugin
* kotlin-lombok-compiler-plugin
* kotlin-noarg-compiler-plugin
* kotlin-sam-with-receiver-compiler-plugin
* kotlinx-serialization-compiler-plugin

Every plugin has its `-embeddable` counterpart, for example, `kotlin-allopen-compiler-plugin-embeddable` is designed for 
working with the `kotlin-compiler-embeddable` artifact, the default option for scripting artifacts.

Gradle adds these plugins as compiler arguments. You don’t need to make any changes to your existing projects.

### Incremented minimum supported version

Starting with Kotlin 1.9.0, the minimum supported Android Gradle plugin version is 4.2.2.

See the [Kotlin Gradle plugin compatibility with available Gradle versions in our documentation](gradle-configure-project.md#apply-the-plugin).

### kapt doesn’t cause eager task creation in Gradle

Prior to 1.9.0, the [kapt compiler plugin](kapt.md) caused eager task creation by requesting the configured instance of 
the Kotlin compilation task. This behavior has been fixed in Kotlin 1.9.0. If you use the default configuration for your 
`build.gradle.kts` file then your setup is not affected by this change.

> If you use a custom configuration, your setup will be adversely affected.
> For example, if you have modified the `KotlinJvmCompile` task using Gradle’s tasks API, you must similarly modify the `KaptGenerateStubs`
> task in your build script.
>
> For example, if your script has the following configuration for `KotlinJvmCompile` task:
> ```kotlin
> tasks.named<KotlinJvmCompile>("compileKotlin") { // Your custom configuration }
> ```
> {validate="false"}
>
> Then you need to make sure that the same modification is included as part of the `KaptGenerateStubs` task:
> ```kotlin
> tasks.named<KaptGenerateStubs>("kaptGenerateStubs") { // Your custom configuration }
>```
> {validate="false"}
> 
{type="warning"}

For more information, see our [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-54468/KAPT-Gradle-plugin-causes-eager-task-creation).

### Programmatic configuration of the JVM target validation mode

Before Kotlin 1.9.0, there was only one way to adjust the detection of JVM target incompatibility between Kotlin and Java.
You had to set `kotlin.jvm.target.validation.mode=ERROR` in your `gradle.properties` for the whole project.

You can now also configure it on the task level in your `build.gradle.kts` file:

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>("compileKotlin") {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```
{validate="false"}

## Standard library

Kotlin 1.9.0 has some great improvements for the standard library:
* The [`..<` operator](#stable-operator-for-open-ended-ranges) and [time API](#stable-time-api) are Stable.
* [The Kotlin/Native standard library has been thoroughly reviewed and updated](#the-kotlin-native-standard-librarys-journey-towards-stabilization)
* [The `@Volatile` annotation can be used on more platforms](#stable-volatile-annotation)
* [There’s a **common** function to get a regex capture group by name](#new-common-function-to-get-regex-capture-group-by-name)
* [The `HexFormat` class is introduced to format and parse hexadecimals](#new-hexformat-class-to-format-and-parse-hexadecimals)

### Stable ..< operator for open-ended ranges

The new `..<` operator for open-ended ranges that was introduced in [Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)
and became Stable in 1.8.0. In 1.9.0, the standard library API for working with open-ended ranges is also Stable.

Our research shows that the new `..<` operator makes it easier to understand when an open-ended range is declared. If you
use the [`until`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/until.html) infix function, it’s easy to make
the mistake of assuming that the upper bound is included.

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

> From IntelliJ IDEA version 2023.1.1, there is a new code inspection that highlights when you
> can use the `..<` operator.
>
{type="note"}

For more information about what you can do with this operator, see [What’s new in Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges).

### Stable time API

Since 1.3.50, we have previewed a new time measurement API. The duration part of the API became Stable in 1.6.0. In 1.9.0,
the remaining time measurement API is Stable.

The old time API provided `measureTimeMillis` and `measureNanoTime` functions that aren’t intuitive to use. Although it 
is clear that they both measure time in different units, it isn’t clear that `measureTimeMillis`uses a [wall clock](https://en.wikipedia.org/wiki/Elapsed_real_time)
to measure time, whereas `measureNanoTime` uses a monotonic time source. The new time API resolves this and other issues
to make the API more user friendly.

With the new time API, you can easily:
* Measure the time taken to execute some code using a monotonic time source with your desired time unit.
* Mark a moment in time.
* Compare and subtract two moments in time.
* Check how much time has passed since a specific moment in time.
* Check whether the current time has passed a specific moment in time.

#### Measure code execution time

To measure the time taken to execute a block of code, use the [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)
inline function.

To measure the time taken to execute a block of code **and** return the result of the block of code, use the 
[`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) inline function.

By default, both functions use a monotonic time source. However, if you want to use an elapsed real-time source, you can.
For example, on Android the default time source `System.nanoTime()`
only counts time while the device is active. It loses track of time when the device enters deep sleep. To keep track of
time while the device is in deep sleep, you can create a time source that uses [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos())
instead:

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```
{validate="false"}

#### Mark and measure differences in time

To mark a specific moment in time, use the [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/)
interface and the [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) function
to create a [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/). To measure differences between
`TimeMarks` from the same time source, use the subtraction operator (`-`):

```kotlin
fun main() {
//sampleStart
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // Sleep 0.5 seconds.
    val mark2 = timeSource.markNow()

    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // It’s also possible to compare time marks with each other.
    println(mark2 > mark1) // This is true, as mark2 was captured later than mark1.
//sampleEnd
}
```
{validate="false"}

To check if a deadline has passed or a timeout has been reached, use the [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html)
and [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html) 
extension functions:

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
//sampleStart
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    val fiveSeconds: Duration = 5.seconds
    val mark2 = mark1 + fiveSeconds

    // It hasn't been 5 seconds yet
    println(mark2.hasPassedNow())
    // false

    // Wait six seconds
    Thread.sleep(6000)
    println(mark2.hasPassedNow())
    // true

//sampleEnd
}
```
{validate="false"}

### The Kotlin/Native standard library’s journey towards stabilization

As our standard library for Kotlin/Native continues to grow, we decided that it was time for a complete review to ensure
that it meets our high standards. As part of this, we carefully reviewed **every** existing public signature. For each 
signature, we considered whether it:

* Has a unique purpose.
* Is consistent with other Kotlin APIs.
* Has similar behavior to its counterpart for the JVM.
* Is future-proof.

Based on these considerations, we made one of the following decisions:
* Made it Stable.
* Made it Experimental.
* Marked it as `private`.
* Modified the behavior.
* Moved it to a different location.
* Deprecated it.
* Marked it as obsolete.

> If an existing signature has been:
> * Moved to another package, the signature still exists in the original package but it's now deprecated with deprecation level: `WARNING`. IntelliJ IDEA will automatically suggest replacements upon code inspection.
> * Deprecated, it’s been deprecated with deprecation level: `WARNING`.
> * Marked as obsolete, you can keep using it, but it will be replaced in future.
>
{type="note"}

We won’t list all of the results of the review here, but some highlights include:
* We stabilized the Atomics API.
* We made [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) Experimental and now require different opt-ins for the package to be used. For more information, see [Explicit C-interoperability stability guarantees](#explicit-c-interoperability-stability-guarantees).
* We marked the [`Worker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker/) class and its related APIs as obsolete.
* We marked the [`BitSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-bit-set/) class as obsolete.
* We marked all `public` API in the `kotlin.native.internal` package as `private` or moved it to other packages.

#### Explicit C-interoperability stability guarantees

To maintain the high quality of our API, we decided to make [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/)
Experimental. Although `kotlinx.cinterop` has been thoroughly tried and tested, there is still room for improvement before
we are satisfied enough to make it Stable. We recommend that you use this API for interoperability but that you try to 
confine its use to specific areas in your projects. This will make your migration easier once we begin evolving this API
to make it Stable.

If you want to use C-like foreign APIs such as pointers, you must opt in with `@OptIn(ExperimentalForeignApi)`, otherwise
your code won’t compile.

To use the remainder of `kotlinx.cinterop`, which covers Objective-C/Swift interoperability, you must opt in with 
`@OptIn(BetaInteropApi)`. If you try to use this API without the opt-in, your code will compile but the compiler will 
raise warnings that provide a clear explanation of what behavior you can expect.

For more information about these annotations, see our source code for [`Annotations.kt`](https://github.com/JetBrains/kotlin/blob/56b729f1812733cb6a79673684c2fa5c4c6b3475/kotlin-native/Interop/Runtime/src/main/kotlin/kotlinx/cinterop/Annotations.kt).

For more information on **all** of the changes as part of this review, see our [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-55765).

We'd appreciate any feedback you might have! Provide your feedback directly by commenting on the [ticket](https://youtrack.jetbrains.com/issue/KT-57728).

### Stable @Volatile annotation

If you annotate a `var` property with `@Volatile`, then the backing field is marked so that any reads or writes to this 
field are atomic, and writes are always made visible to other threads.

Prior to 1.8.20, the [`kotlin.jvm.Volatile` annotation](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)
was available in the common standard library. However, this annotation was only effective on the JVM. If you used it on 
other platforms, it was ignored, which leads to errors.

In 1.8.20, we introduced an experimental common annotation, `kotlin.concurrent.Volatile`, which you could preview in both
the JVM and Kotlin/Native.

In 1.9.0, `kotlin.concurrent.Volatile` is Stable. If you use `kotlin.jvm.Volatile` in your multiplatform projects, we 
recommend that you migrate to `kotlin.concurrent.Volatile`.

### New common function to get regex capture group by name

Prior to 1.9.0, every platform had its own extension to get a regular expression capture group by its name from a regular
expression match. However there was no common function. It wasn't possible to have a common function prior to Kotlin 1.8.0,
because the standard library still supported JVM targets 1.6 and 1.7.

As of Kotlin 1.8.0, the standard library is compiled with JVM target 1.8. So in 1.9.0, there is now a **common** function
[`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html) that you can use to 
retrieve a group’s contents by its name for a regular expression match. This is useful when you want to access the results
of regular expression matches belonging to a particular capture group.

Here is an example with a regular expression containing three capture groups: `city`, `state`, and `areaCode`. You
can use these group names to access the matched values:

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

### New path utility to create parent directories

In 1.9.0 there is a new extension function `createParentDirectories()` that you can use to create a new file with all 
the necessary parent directories. When you provide a file path to `createParentDirectories()` it checks if the parent 
directories already exist. If they do, it does nothing. However, if they do not, it creates them for you.

`createParentDirectories()` is particularly useful when you are copying files. For example, you can use it in combination
with the `copyToRecursively()` function:

 ```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(), 
    followLinks = false
 )
 ```
{validate="false"}

### New HexFormat class to format and parse hexadecimals

> The new `HexFormat` class and its related extension functions are [Experimental](components-stability.md#stability-levels-explained),
> and to use them, you can opt in with `@OptIn(ExperimentalStdlibApi::class)` or the compiler argument
> `-opt-in=kotlin.ExperimentalStdlibApi`.
>
{type="warning"}

In 1.9.0, the [`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hexformat/) class and its related 
extension functions are provided as an Experimental feature that allows you to convert between numerical values and 
hexadecimal strings. Specifically, you can use the extension functions to convert between hexadecimal strings and 
`ByteArrays` or other numeric types (`Int`, `Short`, `Long`).

For example:

```kotlin
println(93.toHexString()) // "0000005d"
```
{validate="false"}

The `HexFormat` class includes formatting options that you can configure with the `HexFormat{}` builder.

If you are working with `ByteArrays` you have the following options configurable by properties:

| Option | Description |
|--|--|
| `upperCase` | Whether hexadecimal digits are upper or lower case. By default, lower case is assumed. `upperCase = false`. |
| `bytes.bytesPerLine` | The maximum number of bytes per line. |
| `bytes.bytesPerGroup` | The maximum number of bytes per group. |
| `bytes.bytesSeparator` | The separator between bytes. Nothing by default. |
| `bytes.bytesPrefix` | The string that immediately precedes two-digit hexadecimal representation of each byte. Nothing by default. |
| `bytes.bytesSuffix` | The string that immediately succeeds two-digit hexadecimal representation of each byte. Nothing by default. |

For example:

```kotlin
val macAddress = "001b638445e6".hexToByteArray()

// Use HexFormat{} builder to separate the hexadecimal string by colons
println(macAddress.toHexString(HexFormat { bytes.byteSeparator = ":" }))
// "00:1b:63:84:45:e6"

// Use HexFormat{} builder to:
// * Make the hexadecimal string uppercase
// * Group the bytes in pairs
// * Separate by periods
val threeGroupFormat = HexFormat { upperCase = true; bytes.bytesPerGroup = 2; bytes.groupSeparator = "." }

println(macAddress.toHexString(threeGroupFormat))
// "001B.6384.45E6"
```
{validate="false"}

If you are working with numeric types, you have the following options configurable by properties:

| Option | Description |
|--|--|
| `number.prefix` | The prefix of a hexadecimal string. Nothing by default. |
| `number.suffix` | The suffix of a hexadecimal string. Nothing by default. |
| `number.removeLeadingZeros` | Whether to remove leading zeros in a hexadecimal string. By default, no leading zeros are removed. `number.removeLeadingZeros = false` |

For example:

```kotlin
// Use HexFormat{} builder to parse a hexadecimal that has prefix: "0x".
println("0x3a".hexToInt(HexFormat { number.prefix = "0x" })) // "58"
```
{validate="false"}

## Documentation updates

The Kotlin documentation has received some notable changes:
* The [tour of Kotlin](kotlin-tour-welcome.md) – learn the fundamentals of the Kotlin programming language with chapters including both theory and practice.
* [Android source set layout](multiplatform-android-layout.md) – learn about the new Android source set layout.
* [Compatibility guide for Kotlin Multiplatform](multiplatform-compatibility-guide.md) – learn about the incompatible changes you might encounter while developing projects with Kotlin Multiplatform.
* [Kotlin Wasm](wasm-overview.md) – learn about Kotlin/Wasm and how you can use it in your Kotlin Multiplatform projects.
* [Add dependencies on Kotlin libraries to Kotlin/Wasm project](wasm-libraries.md) – learn about the supported Kotlin libraries for Kotlin/Wasm.

## Install Kotlin 1.9.0

### Check the IDE version

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.3.3 and 2023.1.1 automatically suggest updating the Kotlin
plugin to version 1.9.0. IntelliJ IDEA 2023.2 will include the built-in Kotlin 1.9.0 plugin.

Android Studio Giraffe (223) and Hedgehog (231) will support Kotlin 1.9.0 in their upcoming releases.

The new command-line compiler is available for download on the [GitHub release page](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0).

### Configure Gradle settings

To download Kotlin artifacts and dependencies, update your `settings.gradle(.kts)` file to use the Maven Central repository:

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

If the repository is not specified, Gradle uses the sunset JCenter repository, which could lead to issues with Kotlin artifacts.

## Compatibility guide for Kotlin 1.9.0

Kotlin 1.9.0 is a [feature release](kotlin-evolution.md#feature-releases-and-incremental-releases) and can, therefore, 
bring changes that are incompatible with your code written for earlier versions of the language. Find the detailed list 
of these changes in the [Compatibility guide for Kotlin 1.9.0](compatibility-guide-19.md).