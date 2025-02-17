[//]: # (title: Share code on platforms)

With Kotlin Multiplatform, you can share the code using the mechanisms Kotlin provides: 
 
* [Share code among all platforms used in your project](#share-code-on-all-platforms). Use it for sharing the common 
business logic that applies to all platforms.     
* [Share code among some platforms](#share-code-on-similar-platforms) included in your project but not all. You can 
reuse code in similar platforms with a help of the hierarchical structure.

If you need to access platform-specific APIs from the shared code, use the Kotlin mechanism of [expected and actual 
declarations](multiplatform-expect-actual.md).

## Share code on all platforms

If you have business logic that is common for all platforms, you don't need to write the same code for each platform – 
just share it in the common source set.

![Code shared for all platforms](flat-structure.svg)

Some dependencies for source sets are set by default. You don't need to specify any `dependsOn` relations manually:
* For all platform-specific source sets that depend on the common source set, such as `jvmMain`, `macosX64Main`, and others. 
* Between the `main` and `test` source sets of a particular target, such as `androidMain` and `androidUnitTest`.

If you need to access platform-specific APIs from the shared code, use the Kotlin mechanism of [expected and actual 
declarations](multiplatform-expect-actual.md).

## Share code on similar platforms

You often need to create several native targets that could potentially reuse a lot of the common logic and third-party APIs.

For example, in a typical multiplatform project targeting iOS, there are two iOS-related targets: one is for iOS ARM64 
devices, the other is for the x64 simulator. They have separate platform-specific source sets, but in practice there is 
rarely a need for different code for the device and simulator, and their dependencies are much the same. So iOS-specific 
code could be shared between them.

Evidently, in this setup it would be desirable to have a shared source set for two iOS targets, with Kotlin/Native code 
that could still directly call any of the APIs that are common to both the iOS device and the simulator.

In this case, you can share code across native targets in your project using the [hierarchical structure](multiplatform-hierarchy.md)
using one of the following ways:

* [Using default hierarchy template](multiplatform-hierarchy.md#default-hierarchy-template)
* [Configuring the hierarchical structure manually](multiplatform-hierarchy.md#manual-configuration)

Learn more about [sharing code in libraries](#share-code-in-libraries) and [connecting platform-specific libraries](#connect-platform-specific-libraries).

## Share code in libraries

Thanks to the hierarchical project structure, libraries can also provide common APIs for a subset of targets. When a 
[library is published](multiplatform-publish-lib.md), the API of its intermediate source sets is embedded into the library artifacts 
along with information about the project structure. When you use this library, the intermediate source sets of your project access only those APIs of 
the library which are available to the targets of each source set.

For example, check out the following source set hierarchy from the `kotlinx.coroutines` repository:

![Library hierarchical structure](lib-hierarchical-structure.svg)

The `concurrent` source set declares the function runBlocking and is compiled for the JVM and the native targets. 
Once the `kotlinx.coroutines` library is updated and published with the hierarchical project structure, you can depend on 
it and call `runBlocking` from a source set that is shared between the JVM and native targets since it matches the 
"targets signature" of the library's `concurrent` source set.

## Connect platform-specific libraries

To share more native code without being limited by platform-specific dependencies, use [platform libraries](native-platform-libs.md),
like Foundation, UIKit, and POSIX. These libraries are shipped with Kotlin/Native and available in shared source sets by default.

In addition, if you use the [Kotlin CocoaPods Gradle](native-cocoapods.md) plugin in your projects,
you can work with third-party native libraries consumed with the [`cinterop` mechanism](native-c-interop.md).

## What's next?

* Check out examples of code sharing using the Kotlin mechanism of [expect and actual declarations](multiplatform-expect-actual.md)
* Learn more about [hierarchical project structure](multiplatform-hierarchy.md)
* See our recommendations on [naming source files in multiplatform projects](coding-conventions.md#source-file-names)
