[//]: # (title: Publish KMM apps)
[//]: # (auxiliary-id: Publish_KMM_apps)

Once your mobile apps are ready for release, it’s time to deliver them to the users by publishing them in app stores.
Multiple stores are available for each platform. However, in this article we’ll focus on the official ones:
[Google Play Store](https://play.google.com/store) and [Apple App Store](https://www.apple.com/ios/app-store/).
You’ll learn how to prepare Kotlin Multiplatform Mobile (**KMM**) applications for publishing, and we’ll highlight
the parts of this process that deserve special attention.

## Android app

Since [Kotlin is the main language for Android development](https://developer.android.com/kotlin),
KMM has no obvious effect on compiling the project and building the Android app. Both the Android library produced from
the shared module and the Android app itself are typical Android Gradle modules; they are no different from other Android
libraries and apps. Thus, publishing the Android app from a KMM project is no different from the usual process described
in the [Android developer documentation](https://developer.android.com/studio/publish).

## iOS app

The iOS app from a KMM project is built from a typical Xcode project, so the main stages involved in publishing it are
the same as described in the [iOS developer documentation](https://developer.apple.com/ios/submit/).

What is specific to KMM projects is compiling the shared Kotlin module into a framework and linking it to the Xcode project.
Generally, all integration between the shared module and the Xcode project is done automatically by the [Kotlin Multiplatform Mobile plugin for Android Studio](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile).
However, if you don’t use the plugin, bear in mind the following when building and bundling the iOS project in Xcode:

* The shared Kotlin library compiles down to the native framework.
* You need to connect the framework compiled for the specific platform to the iOS app project.
* In the Xcode project settings, specify the path to the framework to search for the build system.
* After building the project, you should launch and test the app to make sure that there are no issues when working with the framework in runtime.

There are two ways you can connect the shared Kotlin module to the iOS project:
* Use the [Kotlin/Native Cocoapods plugin](native-cocoapods.md), which allows you to use a multiplatform project with native targets as a CocoaPods dependency in your iOS project.
* Manually configure your Multiplatform project to create an iOS framework and the XCode project to obtain its latest version. KMM Android Studio Plugin usually does this configuration. [Understand the project structure](kmm-understand-project-structure.md#ios-application) to implement it yourself.

### Symbolicating crash reports

To help developers make their apps better, iOS provides a means for analyzing app crashes. For detailed crash analysis,
it uses special debug symbol (`.dSYM`) files that match memory addresses in crash reports with locations in the source code,
such as functions or line numbers.

By default, the release versions of iOS frameworks produced from the shared Kotlin module have an accompanying `.dSYM`
file. This helps you analyze crashes that happen in the shared module’s code.

When an iOS app is rebuilt from bitcode, its `dSYM` file becomes invalid. For such cases, you can compile the shared module
to a static framework that stores the debug information inside itself. For instructions on setting up crash report
symbolication in binaries produced from Kotlin modules, see the [Kotlin/Native documentation](native-ios-symbolication.md).


