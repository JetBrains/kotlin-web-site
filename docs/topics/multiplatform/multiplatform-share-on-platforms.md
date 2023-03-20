[//]: # (title: Share code on platforms)

With Kotlin Multiplatform, you can share the code using the mechanisms Kotlin provides: 
 
* [Share code among all platforms used in your project](#share-code-on-all-platforms). Use it for sharing the common 
business logic that applies to all platforms.     
* [Share code among some platforms](#share-code-on-similar-platforms) included in your project but not all. You can 
reuse much of the code in similar platforms using a hierarchical structure. You can use [target shortcuts](multiplatform-hierarchy.md#use-target-shortcuts) 
for common combinations of targets or [create the hierarchical structure manually](multiplatform-hierarchy.md#configure-the-hierarchical-structure-manually).
 
If you need to access platform-specific APIs from the shared code, use the Kotlin mechanism of [expected and actual 
declarations](multiplatform-connect-to-apis.md).

## Share code on all platforms

If you have business logic that is common for all platforms, you don't need to write the same code for each platform – 
just share it in the common source set.

![Code shared for all platforms](flat-structure.png)

Some dependencies for source sets are set by default. You don't need to specify any `dependsOn` relations manually:
* For all platform-specific source sets that depend on the common source set, such as `jvmMain`, `macosX64Main`, and others. 
* Between the `main` and `test` source sets of a particular target, such as `androidMain` and `androidTest`.

If you need to access platform-specific APIs from the shared code, use the Kotlin mechanism of [expected and actual 
declarations](multiplatform-connect-to-apis.md).

## Share code on similar platforms

You often need to create several native targets that could potentially reuse a lot of the common logic and third-party APIs.

For example, in a typical multiplatform project targeting iOS, there are two iOS-related targets: one is for iOS ARM64 
devices, the other is for the x64 simulator. They have separate platform-specific source sets, but in practice there is 
rarely a need for different code for the device and simulator, and their dependencies are much the same. So iOS-specific 
code could be shared between them.

Evidently, in this setup it would be desirable to have a shared source set for two iOS targets, with Kotlin/Native code 
that could still directly call any of the APIs that are common to both the iOS device and the simulator.

In this case, you can share code across native targets in your project using the [hierarchical structure](multiplatform-hierarchy.md).
Since Kotlin 1.6.20, it's enabled by default.

There are several ways to create a hierarchical structure:

* [Enabling default target hierarchy](multiplatform-hierarchy.md#default-hierarchy)
* [Using target shortcuts](multiplatform-hierarchy.md#use-target-shortcuts)
* [Configuring the hierarchical structure manually](multiplatform-hierarchy.md#configure-the-hierarchical-structure-manually).

Learn more about [sharing code in libraries](#share-code-in-libraries) and [using Native libraries in the hierarchical structure](#use-native-libraries-in-the-hierarchical-structure).

## Share code in libraries

Thanks to the hierarchical project structure, libraries can also provide common APIs for a subset of targets. When a 
[library is published](multiplatform-publish-lib.md), the API of its intermediate source sets is embedded into the library artifacts 
along with information about the project structure. When you use this library, the intermediate source sets of your project access only those APIs of 
the library which are available to the targets of each source set.

For example, check out the following source set hierarchy from the `kotlinx.coroutines` repository:

![Library hierarchical structure](lib-hierarchical-structure.png)

The `concurrent` source set declares the function runBlocking and is compiled for the JVM and the native targets. 
Once the `kotlinx.coroutines` library is updated and published with the hierarchical project structure, you can depend on 
it and call `runBlocking` from a source set that is shared between the JVM and native targets since it matches the 
"targets signature" of the library's `concurrent` source set.

### Use native libraries in the hierarchical structure

You can use platform-dependent libraries like `Foundation`, `UIKit`, and `POSIX` in source sets shared among several native 
targets. This helps you share more native code without being limited by platform-specific dependencies. 

Starting with Kotlin 1.6.20, the usage of platform-dependent libraries is available in shared source sets by default. No additional
steps are required – IntelliJ IDEA will help you detect common declarations that you can use in the shared code.
See [Hierarchical project structure](multiplatform-hierarchy.md) for more details.

In addition to [platform libraries](native-platform-libs.md) shipped with Kotlin/Native, this approach can also 
handle custom [`cinterop` libraries](native-c-interop.md) making them available in shared source sets. 
To enable this feature, add the following property to your `gradle.properties`:

```none
kotlin.mpp.enableCInteropCommonization=true
```

## What's next?

* Check out examples of code sharing using the Kotlin mechanism of [expect and actual declarations](multiplatform-connect-to-apis.md)
* Learn more about [hierarchical project structure](multiplatform-hierarchy.md)