[//]: # (title: What's new in Kotlin 1.8.0-RC2)

_[Release date: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all the features of the Early Access Preview (EAP) release, but highlights the new ones and some major improvements.
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0-RC2).
>
{type="note"}

The Kotlin 1.8.0-RC2 release is out! Here are some highlights from this release:

* [We removed the old backend for Kotlin/JVM](#kotlin-jvm)
* [We now support Xcode 14.1](#kotlin-native)
* [We ensured compatibility with Gradle 7.3](#gradle)
* [We introduced new experimental functions for JVM: recursively copy or delete directory content](#standard-library)

## IDE support

Kotlin plugins that support 1.8.0-RC2 are available for:

| IDE | Supported versions |
|--|--|
| IntelliJ IDEA | 2021.3.x, 2022.1.x, 2022.2.x |
| Android Studio | Dolphin (213), Electric Eel (221), Flamingo (222) |

> You can update your projects to 1.8.0-RC2 in IntelliJ IDEA 2022.3 without updating the IDE plugin.
> 
> To migrate existing projects to Kotlin 1.8.0-RC2 in IntelliJ IDEA 2022.3, change the Kotlin version to `1.8.0-RC2` and reimport your Gradle or Maven project.
> 
{type="note"}

## Kotlin/JVM

* Removed the old backend. (The `-Xuse-old-backend` compiler option is no longer supported).
* Added support for Java 19 bytecode.

## Kotlin/Native

* Added support for Xcode 14.1 and `watchosDeviceArm64` target.
* Added support for new annotations to improve Objective-C and Swift interoperability:
    * `@ObjCName`
    * `@HiddenFromObjC`
    * `@ShouldRefineInSwift`
* Added improvements to the CocoaPods Gradle plugin so that registered Kotlin frameworks are now dynamically linked by default.

## Kotlin/JS

* Stabilized the IR compiler and set incremental compilation to be used by default.
* Deprecated the old backend.
* Added additional reporting options for when `yarn.lock` is updated during the CI process.
* Updated the Gradle plugin so that `kotlin.js.browser.karma.browsers` property can be used to set browser test targets.

## Kotlin Multiplatform

* Added new Android source set layout that can be enabled in Gradle plugin with `kotlin.mpp.androidSourceSetLayoutVersion=2`.
* Added new naming schema for `KotlinSourceSet` entities.
* Changed the naming scheme of compilation configurations created by the Kotlin Multiplatform Gradle plugin.

## Gradle

* Ensured compatibility with Gradle 7.3.
* Added the option to disable daemon fallback by using `kotlin.daemon.useFallbackStrategy`.
* Exposed available Kotlin compiler options as Gradle lazy properties.
* Updated minimum supported Gradle version to 6.8.3.
* Updated minimum supported Android Gradle plugin version to 4.1.3.

## Compiler

Updated the Lombok compiler plugin so that it now supports the `@Builder` annotation.

## Standard library

* Updated the JVM target of the libraries in Kotlin distribution to version 1.8:
   * The contents of the artifacts `kotlin-stdlib-jdk7` and `kotlin-stdlib-jdk8` have been moved into `kotlin-stdlib`.
* Stabilized extension functions for `java.util.Optional`.
* Stabilized functions:
    * `cbrt()`
    * `toTimeUnit()`
    * `toDurationUnit()`
* Added new [experimental](components-stability.md#stability-levels-explained) extension functions for `java.nio.file.path` that can recursively copy or delete directory content. Opt-in is required (see details below), and you should use them only for evaluation purposes.
* Added new [experimental](components-stability.md#stability-levels-explained) functionality to `TimeMarks`, allowing `elapsedNow` to be read from multiple `TimeMarks` simultaneously. Opt-in is required (see details below), and you should use them only for evaluation purposes.

> To opt in to the experimental API for:
> * `java.nio.file.path`, use `@OptIn(kotlin.io.path.ExperimentalPathApi::class)` or `@kotlin.io.path.ExperimentalPathApi`.
> * `TimeMarks`, use `@OptIn(ExperimentalTime::class)` or `@ExperimentalTime`.
>
{type="note"}

## How to update to Kotlin 1.8.0-RC2

You can install Kotlin 1.8.0-RC2 in the following ways:

* If you use the _Early Access Preview_ update channel, the IDE will suggest automatically updating to 1.8.0-RC2 as soon as it becomes available.
* If you use the _Stable_ update channel, you can change the channel to _Early Access Preview_ at any time by selecting **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** in your IDE. You'll then be able to install the latest preview release. Check out [these instructions](install-eap-plugin.md) for details.

Once you've installed 1.8.0-RC2, don't forget to [change the Kotlin version](configure-build-for-eap.md) to 1.8.0-RC2 in your build scripts.

## Learn more

For more detail about the contents of this release, see our [changelog](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0-RC2).
