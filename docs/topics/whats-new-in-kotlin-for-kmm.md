[//]: # (title: What's new in Kotlin for KMM)
[//]: # (auxiliary-id: Whats_new_in_Kotlin_for_KMM)

KMM is part of the larger Kotlin ecosystem and leverages Kotlin features and improvements for a better mobile developer experience. 
[Every Kotlin release](releases.md#release-details) brings features and improvements that are helpful for mobile developers like you. 

Android Studio will recommend an automatic update to a new Kotlin release. You can also [update manually](releases.md#update-to-a-new-release).

Here you can find a short summary of the features Kotlin provides for developing multiplatform mobile applications.

## Kotlin 1.5.30 for KMM

[Kotlin 1.5.30](whatsnew1530.md) introduces a number of improvements and features that are helpful for KMM:

* **Apple silicon support.**
  Kotlin 1.5.30 introduces native support for [Apple silicon](https://support.apple.com/en-us/HT211814).
  Now the Kotlin/Native compiler and tooling can run on Apple silicon hardware without [Rosetta translation environment](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)

  Learn more about [Apple silicon support](whatsnew1530.md#apple-silicon-support).

* **Improved Kotlin DSL for CocoaPods Gradle plugin.** Kotlin 1.5.30 introduces the improved CocoaPods Gradle plugin DSL.
  In addition to the name of the framework, you can now specify other parameters in the pod configuration: 
  * Dynamic or static version of the framework
  * Dependencies explicit export
  * Bitcode embedding
  * Custom names for Xcode configuration

  [Learn more about CocoaPods Gradle plugin improvements](whatsnew1530.md#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin).

* **Experimental interoperability with Swift 5.5 async/await.**
  The Kotlin/Native compiler now emits the `_Nullable_result` attribute in the generated Objective-C headers for suspending functions with nullable return types. This makes it possible to call them from Swift as `async` functions with the proper nullability.

  [Learn more about experimental interoperability with Swift 5.5 async/await](whatsnew1530.md#experimental-interoperability-with-swift-5-5-async-await).

* **Improved Swift/Objective-C mapping for objects and companion objects.**
  Getting objects and companion objects can now be done in a way that is more intuitive for native iOS developers.

  [Learn more about mapping for objects and companion objects](whatsnew1530.md#improved-swift-objective-c-mapping-for-objects-and-companion-objects).

* **Sharing custom `cinterop` libraries between platforms.**
  Starting from Kotlin 1.5.30, you can use custom cinterop libraries in shared native code.

  [Learn more about sharing custom `cinterop` libraries between platforms](whatsnew1530.md#ability-to-use-custom-cinterop-libraries-in-shared-native-code).

* **Support for XCFrameworks.**
  Now all Kotlin Multiplatform projects can use XCFrameworks.

  [Learn more about support for XCFrameworks](mpp-build-native-binaries.md#build-xcframeworks).

* **New default publishing setup for Android artifacts.**
  Kotlin 1.5.30 brings new default publishing setup for Android artefacts. You can [publish your multiplatform library for the Android target](mpp-publish-lib.md#publish-an-android-library) by specifying [Android variant](https://developer.android.com/studio/build/build-variants) names in the build script.
  The Kotlin Gradle plugin will generate publications automatically.

  [Learn more about new default publishing setup for Android artifacts](whatsnew1530.md#new-default-publishing-setup-for-android-artifacts).

## Kotlin 1.5.20 for KMM

[Kotlin 1.5.20](https://kotlinlang.org/docs/whatsnew1520.html) introduces a number of improvements and features that are helpful for KMM:

* **Export of KDoc comments to generated Objective-C headers.**
  You can now set the Kotlin/Native compiler to export the [documentation comments (KDoc)](kotlin-doc.md) from Kotlin code
  to the Objective-C frameworks generated from it, making them visible to the frameworks’ consumers.

  This feature is experimental. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600).

  Learn more about [exporting KDoc comments to generated Objective-C headers and how to opt in to this feature](whatsnew1520.md#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers).

* **New framework-packing task for Kotlin/Native**.
  The [Kotlin Multiplatform Gradle plugin](mpp-dsl-reference.md) now includes the `embedAndSignAppleFrameworkForXcode` task, which can be used from Xcode to connect KMM modules to the iOS part of your project.

  Check out this [blog post](https://blog.jetbrains.com/kotlin/2021/07/multiplatform-gradle-plugin-improved-for-connecting-kmm-modules/) to learn about the new framework-packing task and how to remove from the `packForXcode` task from your build script.

Learn more about [what's new in Kotlin 1.5.20](whatsnew1520.md).

## Kotlin 1.5.0 for KMM

[Kotlin 1.5.0](whatsnew15.md) introduces a number of improvements and features that are helpful for KMM:

* **Simplified test dependency selection for each platform.**
  Now you can use the `kotlin-test` dependency to add dependencies for testing in the `commonTest` source set. The
  Gradle plugin will infer the corresponding platform dependencies for each test source set:
  * `kotlin-test-junit` for JVM source sets.
  * `kotlin-test-common` and `kotlin-test-annotations-common` for common source sets.

  iOS source sets use Kotlin/Native, which has everything built in, so they do not require any additional artifacts.

  You can also use the `kotlin-test` dependency in any shared or platform-specific source set.
  Learn more about [setting dependencies on test libraries](gradle.md#set-dependencies-on-test-libraries).

* **New API for getting a char’s Unicode category.** A variety of new character-related functions are available on all platforms and in the common code. They include several functions for checking whether a char is a letter or a digit, like `Char.isLetterOrDigit()`, as well as
  functions for checking the case of a char, like  `Char.isUpperCase()`. The property `Char.category` and the enum class `CharCategory` are available, as well.  
  Learn more about this [new API](whatsnew15.md#new-api-for-getting-a-char-category-now-available-in-multiplatform-code).

* **Improved Kotlin/Native performance and stability**. Kotlin/Native is receiving a set of performance improvements that speed up
  both compilation and execution.  
  Learn more about the [Kotlin/Native improvements](whatsnew15.md#kotlin-native).

Learn more about [what's new in Kotlin 1.5.0](whatsnew15.md).

## Kotlin 1.4.30 for KMM

[Kotlin 1.4.30](whatsnew1430.md) introduces a number of improvements that are helpful for KMM:

* **Improved compilation time for an iOS simulator**. Recompiling binaries for the iOS simulator after making changes in the code now requires much less time.
  You can see the most significant improvements when re-running unit tests or applications on the iOS simulator.
  For example, the time required to rebuild the framework in the [KMM Networking and data storage sample](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) has decreased from 9.5 seconds (in 1.4.10) to 4.5 seconds (in 1.4.30).  
  These optimizations affect other scenarios as well.

* Support for **libraries delivered in Xcode 12.2**.

* Support for the new **watchosX64** target in Kotlin/Native. This target makes it possible to run the simulator on 64-bit architecture.

Learn more about [what's new in Kotlin 1.4.30](whatsnew1430.md).

## Kotlin 1.4.20 for KMM

[Kotlin 1.4.20](whatsnew1420.md) introduces a number of features, improvements, and bug fixes that are helpful for KMM:

* **CocoaPods plugin improvements**:
    * Rebuilding dependencies only when necessary.
    * Ability to add dependencies on libraries from a custom spec repository, Git repository, or archive, as well as on libraries with custom cinterop options.  
      Learn more about [adding CocoaPods dependencies](kmm-add-dependencies.md#with-cocoapods) and [these improvements](whatsnew1420.md#cocoapods-plugin-improvements).
     
* Support for **libraries delivered in Xcode 12**.

* **Escape analysis for Kotlin/Native**. A prototype of a new mechanism that gives a 10% iOS runtime performance improvement by allocating certain objects on the stack instead of the heap. 

* **Opt-in wrapping of Objective-C exceptions** in runtime to avoid crashes. Learn [how to opt in](whatsnew1420.md#opt-in-wrapping-of-objective-c-exceptions).

* **Updated structure of multiplatform library publications**. The library _root_ publication, which stands for the whole library, 
now includes metadata artifacts. These were published separately in earlier Kotlin versions.  
For compatibility, both multiplatform library authors and users must update to Kotlin 1.4.20. Learn more about [publishing a multiplatform library](mpp-publish-lib.md).

* **Deprecation of the Kotlin Android Extensions plugin**. The `Parcelable` implementation generator has been moved to a separate [`kotlin-parcelize` plugin](whatsnew1420.md#new-plugin-for-parcelable-implementation-generator).

Learn more about [what's new in Kotlin 1.4.20](https://kotlinlang.org/docs/whatsnew1420.html).
