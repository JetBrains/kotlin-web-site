[//]: # (title: iOS integration methods)

You can integrate a Kotlin Multiplatform shared module into your iOS app. For that, an [iOS framework](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)
is generated from the shared module. Then, you should add it as a dependency to the iOS project:

![iOS integration scheme](ios-integration-scheme.svg)

It's possible to consume this framework as a local or remote dependency. Choose local integration if you want to have
full control over the entire codebase and get instant updates to final applications when the common code changes.

If you want to explicitly separate the code base of your final application from the common code base, set up remote
integration. In this case, the shared code will be integrated into final applications like a regular third-party
dependency.

## Local integration

In a local setup, there are two main integration options. You can use direct integration through a special script or, if
you have Pod dependencies in your Kotlin Multiplatform project, take the CocoaPods integration approach.

### Direct integration

You can connect the iOS framework directly from the Kotlin Multiplatform project by adding a special script to the build
settings of your Xcode project.

This integration method works for you if:

* You do **not** import CocoaPods dependencies in your Kotlin Multiplatform project

If you create a project in Android Studio, choose the **Regular framework** option to have this setup generated
automatically. If you use the Kotlin Multiplatform [web wizard](https://kmp.jetbrains.com/), direct integration
is applied by default.

You can integrate the `embedAndSignAppleFrameworkForXcode` script into the build phase or, in case you have local SPM
packages, as a pre-action in your project's build settings.

For more information, see [Direct integration](multiplatform-direct-integration.md).

### CocoaPods integration with a local podspec

You can connect the iOS framework from the Kotlin Multiplatform project through [CocoaPods](https://cocoapods.org/),
a popular dependency manager for Swift and Objective-C projects.

This integration method works for you if:

* You have a mono repository setup with an iOS project that uses CocoaPods
* You import CocoaPods dependencies in your Kotlin Multiplatform project

To set up a workflow with a local CocoaPods dependency, you can either edit the scripts manually or generate the project
with a wizard in Android Studio.

For more information, see [CocoaPods overview and setup](native-cocoapods.md).

## Remote integration

For remote integration, your project might use the Swift Package Manager (SPM) or the CocoaPods dependency manager to
connect the iOS framework from a Kotlin Multiplatform project.

### SPM with XCFrameworks

You can set up a Swift package manager (SPM) dependency using XCFrameworks to connect the iOS framework from the Kotlin
Multiplatform project.

For more information, see [Swift package export setup](native-spm.md).

### CocoaPods integration with XCFrameworks

You can build XCFrameworks with the Kotlin CocoaPods Gradle plugin and then distribute shared parts of your project
separately from mobile apps through CocoaPods.

For more information, see [Build final native binaries](multiplatform-build-native-binaries.md#build-frameworks).