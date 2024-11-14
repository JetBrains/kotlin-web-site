[//]: # (title: Introduction to Kotlin Multiplatform)

Support for multiplatform programming is one of Kotlin's key benefits. It reduces time spent writing and maintaining the
same code for [different platforms](multiplatform-dsl-reference.md#targets) while retaining the flexibility and benefits of native programming.

![Kotlin Multiplatform](kotlin-multiplatform.svg){width=700}

## Learn key concepts

Kotlin Multiplatform allows you to share code across different platforms, whether it's mobile, web, or desktop.
The platforms to which the code is compiled are defined by the list of _targets_.

Each target has a corresponding *source set* which represents a set of source files with its own dependencies and
compiler options. Platform-specific source sets, for example `jvmMain` for the JVM, can make use of platform-specific
libraries and APIs.

To share code among a subset of targets, intermediate source sets are used. For example, the `appleMain` source set
represents the code shared among all Apple platforms. The code shared among all platforms and compiled to all declared
targets has its own source set, `commonMain`. It cannot use platform-specific APIs, but can take advantage of
multiplatform libraries.

When compiling for a specific target, Kotlin combines the common source set, the relevant intermediate source sets,
and the target-specific source set.

For more details on this topic, see:

* [The basics of Kotlin Multiplatform project structure](multiplatform-discover-project.md)
* [Advanced concepts of the multiplatform project structure](multiplatform-advanced-project-structure.md)

## Use code sharing mechanisms

It's sometimes more convenient to share code among a subset of similar targets. Kotlin Multiplatform provides a way to
simplify their creation with a *default hierarchy template*. It includes a pre-defined list of intermediate source sets
that are created based on the targets you specified in your project.

To access platform-specific APIs from shared code, you can use another Kotlin mechanism, *expected and actual declarations*.
This way, you can declare that you `expect` a platform-specific API in common code but provide a separate `actual`
implementation for each target platform. You can use this mechanism with different Kotlin concepts, including functions,
classes, and interfaces. For example, you can define a function in common code, but provide its implementation using a
platform-specific library in a corresponding source set.

For more details on this topic, see:

* [Share code on platforms](multiplatform-share-on-platforms.md)
* [Expected and actual declarations](multiplatform-expect-actual.md)
* [Hierarchical project structure](multiplatform-hierarchy.md)

## Add dependencies

A Kotlin Multiplatform project can depend on external libraries and other multiplatform projects. For common code,
you can add dependencies on multiplatform libraries in the common source set. Kotlin automatically resolves and adds the
appropriate platform-specific parts to other source sets. If only a platform-specific API is required, add the dependency
to the corresponding source sets.

Adding Android-specific dependencies to a Kotlin Multiplatform project is similar to adding them in a pure Android
project. When working with iOS-specific dependencies, you can seamlessly integrate Apple SDK frameworks without extra
configuration. For external libraries and frameworks, Kotlin offers interoperability with Objective-C and Swift.

For more details on this topic, see:

* [Add dependencies on multiplatform libraries](multiplatform-add-dependencies.md)
* [Add dependencies on Android libraries](multiplatform-android-dependencies.md)
* [Add dependencies on iOS libraries](multiplatform-ios-dependencies.md)

## Configure compilations

Every target can have multiple compilations for different purposes, typically for production or testing, but you can also
define custom compilations.

With Kotlin Multiplatform, you can configure all compilations in the project, set up specific compilations within a
target, and even create individual compilations. When configuring compilations, you can modify compiler options, manage
dependencies, or configure interoperability with native languages.

For more details on this topic, see [Configure compilations](multiplatform-configure-compilations.md).

## Build final binaries

By default, a target is compiled to a `.klib` artifact, which can be consumed by Kotlin/Native itself as a dependency
but cannot be executed or used as a native library. However, Kotlin Multiplatform provides additional mechanisms
for building final native binaries.

You can create executable binaries, shared and static libraries, or Objective-C frameworks, each configurable for different
build types. Kotlin also provides a way to build universal (fat) frameworks and XCFrameworks for iOS integration.

For more details on this topic, see [Build native binaries](multiplatform-build-native-binaries.md).

## Create multiplatform libraries

You can create a multiplatform library with common code and its platform-specific implementations for JVM, web, and
native platforms.

Publishing a Kotlin Multiplatform library involves specific configurations in your Gradle build script. You can use a
Maven repository and the `maven-publish` plugin for publication. Once published, a multiplatform library can be used
as a dependency in other cross-platform projects.

For more details on this topic, see [Publish a multiplatform library](multiplatform-publish-lib.md).

## Reference

* [DSL reference for the Kotlin Multiplatform Gradle plugin](multiplatform-dsl-reference.md)
* [Compatibility guide for Kotlin Multiplatform](multiplatform-compatibility-guide.md)