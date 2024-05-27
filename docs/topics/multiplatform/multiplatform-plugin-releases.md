[//]: # (title: Kotlin Multiplatform Mobile plugin releases)

We are working on stabilizing the [Kotlin Multiplatform Mobile plugin for Android Studio](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile) 
and will be regularly releasing new versions that include new features, improvements, and bug fixes. 

Ensure that you have the latest version of the Kotlin Multiplatform Mobile plugin!

## Update to the new release

Android Studio will suggest updating to a new Kotlin Multiplatform Mobile plugin release as soon as it is available. If you accept the suggestion, it will automatically update the plugin to the latest version. 
You'll need to restart Android Studio to complete the plugin installation.

You can check the plugin version and update it manually in **Settings/Preferences** | **Plugins**.

You need a compatible version of Kotlin for the plugin to work correctly. You can find compatible versions in the [release details](#release-details).
You can check your Kotlin version and update it in **Settings/Preferences** | **Plugins** or in **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates**.

>If you do not have a compatible version of Kotlin installed, the Kotlin Multiplatform Mobile plugin will be disabled. You will need to update your Kotlin 
>version, and then enable the plugin in **Settings/Preferences** | **Plugins**.
>
{type="note"}

## Release details

The following table lists the details of the latest Kotlin Multiplatform Mobile plugin releases: 

<table> 
<tr>
<th>
Release info
</th>
<th>
Release highlights
</th>
<th>
Compatible Kotlin version
</th>
</tr>
<tr>
<td>

**0.8.2**

Released: 16 May, 2024

</td>
<td>

* Support for Android Studio Jellyfish as well as for the new Canary version, Koala.
* Added declarations of `sourceCompatibility` and `targetCompatibility` in the shared module.

</td>
<td>

* [Any of Kotlin plugin versions](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.8.1**

Released: 9 November, 2023

</td>
<td>

* Updated Kotlin to 1.9.20.
* Updated Jetpack Compose to 1.5.4.
* Enabled Gradle build and configuration caches by default.
* Refactored build configurations for the new Kotlin version.
* iOS framework is now static by default.
* Fixed an issue running on iOS devices with Xcode 15.

</td>
<td>

* [Any of Kotlin plugin versions](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.8.0**

Released: 5 October, 2023

</td>
<td>

* [KT-60169](https://youtrack.jetbrains.com/issue/KT-60169) Migrated on the Gradle version catalog.
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) Renamed `android` to `androidTarget`.
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) Updated Kotlin and dependency versions.
* [KTIJ-26773](https://youtrack.jetbrains.com/issue/KTIJ-26773) Refactored to use `-destination` argument instead of `-sdk` and `-arch`.
* [KTIJ-25839](https://youtrack.jetbrains.com/issue/KTIJ-25839) Refactored generated file names.
* [KTIJ-27058](https://youtrack.jetbrains.com/issue/KTIJ-27058) Added the JVM target config.
* [KTIJ-27160](https://youtrack.jetbrains.com/issue/KTIJ-27160) Supported Xcode 15.0.
* [KTIJ-27158](https://youtrack.jetbrains.com/issue/KTIJ-27158) Moved the new module wizard to the experimental state.

</td>
<td>

* [Any of Kotlin plugin versions](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.6.0**

Released: 24 May, 2023

</td>
<td>

* Support of the new Canary Android Studio Hedgehog.
* Updated versions of Kotlin, Gradle, and libraries in the Multiplatform project.
* Applied new [`targetHierarchy.default()`](whatsnew1820.md#new-approach-to-source-set-hierarchy) in the Multiplatform project.
* Applied source set name suffixes to platform-specific files in the Multiplatform project.

</td>
<td>

* [Any of Kotlin plugin versions](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.5.3**

Released: 12 April, 2023

</td>
<td>

* Updated Kotlin and Compose versions.
* Fixed an Xcode project scheme parsing.
* Added a scheme product type check.
* `iosApp` scheme is now selected by default if presented.

</td>
<td>

* [Any of Kotlin plugin versions](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.5.2**

Released: 30 January, 2023

</td>
<td>

* [Fixed a problem with Kotlin/Native debugger (slow Spotlight indexing)](https://youtrack.jetbrains.com/issue/KT-55988).
* [Fixed Kotlin/Native debugger in multimodule projects](https://youtrack.jetbrains.com/issue/KT-24450).
* [New build for Android Studio Giraffe 2022.3.1 Canary](https://youtrack.jetbrains.com/issue/KT-55274).
* [Added provisioning flags for an iOS app build](https://youtrack.jetbrains.com/issue/KT-55204).
* [Added inherited paths to the **Framework Search Paths** option in a generated iOS project](https://youtrack.jetbrains.com/issue/KT-55402).

</td>
<td>

* [Any of Kotlin plugin versions](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.5.1**

Released: 30 November, 2022

</td>
<td>

* [Fixed new project generation: delete an excess "app" directory](https://youtrack.jetbrains.com/issue/KTIJ-23790).

</td>
<td>

* [Kotlin 1.7.0—*](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.5.0**

Released: 22 November, 2022

</td>
<td>

* [Changed the default option for iOS framework distribution: now it is **Regular framework**](https://youtrack.jetbrains.com/issue/KT-54086).
* [Moved `MyApplicationTheme` to a separate file in a generated Android project](https://youtrack.jetbrains.com/issue/KT-53991).
* [Updated generated Android project](https://youtrack.jetbrains.com/issue/KT-54658).
* [Fixed an issue with unexpected erasing of new project directory](https://youtrack.jetbrains.com/issue/KTIJ-23707).

</td>
<td>

* [Kotlin 1.7.0—*](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.3.4**

Released: 12 September, 2022

</td>
<td>

* [Migrated Android app to Jetpack Compose](https://youtrack.jetbrains.com/issue/KT-53162).
* [Removed outdated HMPP flags](https://youtrack.jetbrains.com/issue/KT-52248).
* [Removed package name from Android manifest](https://youtrack.jetbrains.com/issue/KTIJ-22633).
* [Updated `.gitignore` for Xcode projects](https://youtrack.jetbrains.com/issue/KT-53703).
* [Updated wizard project for better illustration expect/actual](https://youtrack.jetbrains.com/issue/KT-53928).
* [Updated compatibility with Canary build of Android Studio](https://youtrack.jetbrains.com/issue/KTIJ-22063).
* [Updated minimum Android SDK to 21 for Android app](https://youtrack.jetbrains.com/issue/KTIJ-22505).
* [Fixed an issue with the first launch after installation Xcode](https://youtrack.jetbrains.com/issue/KTIJ-22645).
* [Fixed an issues with Apple run configuration on M1](https://youtrack.jetbrains.com/issue/KTIJ-21781).
* [Fixed an issue with `local.properties` on Windows OS](https://youtrack.jetbrains.com/issue/KTIJ-22037).
* [Fixed an issue with Kotlin/Native debugger on Canary build of Android Studio](https://youtrack.jetbrains.com/issue/KT-53976).

</td>
<td>

* [Kotlin 1.7.0—1.7.*](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.3.3**

Released: 9 June, 2022

</td>
<td>

* Updated dependency on Kotlin IDE plugin 1.7.0.

</td>
<td>

* [Kotlin 1.7.0—1.7.*](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.3.2**

Released: 4 April, 2022

</td>
<td>

* Fixed the performance problem with the iOS application debug on Android Studio 2021.2 and 2021.3.

</td>
<td>

* [Kotlin 1.5.0—1.6.*](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.3.1**

Released: 15 February, 2022

</td>
<td>

* [Enabled M1 iOS simulator in Kotlin Multiplatform Mobile wizards](https://youtrack.jetbrains.com/issue/KT-51105).
* Improved performance for indexing XcProjects: [KT-49777](https://youtrack.jetbrains.com/issue/KT-49777), [KT-50779](https://youtrack.jetbrains.com/issue/KT-50779).
* Build scripts clean up: use `kotlin("test")` instead of `kotlin("test-common")` and `kotlin("test-annotations-common")`.
* Increase compatibility range with [Kotlin plugin version](https://youtrack.jetbrains.com/issue/KTIJ-20167).
* [Fixed the problem with JVM debug on Windows host](https://youtrack.jetbrains.com/issue/KT-50699).
* [Fixed the problem with the invalid version after disabling the plugin](https://youtrack.jetbrains.com/issue/KT-50966).

</td>
<td>

* [Kotlin 1.5.0—1.6.*](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.3.0**

Released: 16 November, 2021

</td>
<td>

* [New Kotlin Multiplatform Library wizard](https://youtrack.jetbrains.com/issue/KTIJ-19367).
* Support for the new type of Kotlin Multiplatform library distribution: [XCFramework](multiplatform-build-native-binaries.md#build-xcframeworks).
* Enabled [hierarchical project structure](multiplatform-hierarchy.md#manual-configuration) for new cross-platform mobile projects.
* Support for [explicit iOS targets declaration](https://youtrack.jetbrains.com/issue/KT-46861).
* [Enabled Kotlin Multiplatform Mobile plugin wizards on non-Mac machines](https://youtrack.jetbrains.com/issue/KT-48614).
* [Support for subfolders in the Kotlin Multiplatform module wizard](https://youtrack.jetbrains.com/issue/KT-47923).
* [Support for Xcode `Assets.xcassets` file](https://youtrack.jetbrains.com/issue/KT-49571).
* [Fixed the plugin classloader exception](https://youtrack.jetbrains.com/issue/KT-48103).
* Updated the CocoaPods Gradle Plugin template.
* Kotlin/Native debugger type evaluation improvements.
* Fixed iOS device launching with Xcode 13.

</td>
<td>

* [Kotlin 1.6.0](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.7**

Released: August 2, 2021

</td>
<td>

* [Added Xcode configuration option for AppleRunConfiguration](https://youtrack.jetbrains.com/issue/KTIJ-19054).
* [Added support Apple M1 simulators](https://youtrack.jetbrains.com/issue/KT-47618).
* [Added information about Xcode integration options in Project Wizard](https://youtrack.jetbrains.com/issue/KT-47466).
* [Added error notification after a project with CocoaPods was generated, but the CocoaPods gem has not been installed](https://youtrack.jetbrains.com/issue/KT-47329).
* [Added support Apple M1 simulator target in generated shared module with Kotlin 1.5.30](https://youtrack.jetbrains.com/issue/KT-47631).
* [Cleared generated Xcode project with Kotlin 1.5.20](https://youtrack.jetbrains.com/issue/KT-47465).
* Fixed launching Xcode Release configuration on a real iOS device.
* Fixed simulator launching with Xcode 12.5.

</td>
<td>

* [Kotlin 1.5.10](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.6**

Released: June 10, 2021

</td>
<td>

* Compatibility with Android Studio Bumblebee Canary 1.
* Support for [Kotlin 1.5.20](whatsnew1520.md): using the new framework-packing task for Kotlin/Native in the Project Wizard.

</td>
<td>

* [Kotlin 1.5.10](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.5**

Released: May 25, 2021

</td>
<td>

* [Fixed compatibility with Android Studio Arctic Fox 2020.3.1 Beta 1 and higher](https://youtrack.jetbrains.com/issue/KT-46834).

</td>
<td>

* [Kotlin 1.5.10](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.4**

Released: May 5, 2021

</td>
<td>

Use this version of the plugin with Android Studio 4.2 or Android Studio 2020.3.1 Canary 8 or higher.
* Compatibility with [Kotlin 1.5.0](whatsnew15.md).
* [Ability to use the CocoaPods dependency manager in the Kotlin Multiplatform module for iOS integration](https://youtrack.jetbrains.com/issue/KT-45946).

</td>
<td>

* [Kotlin 1.5.0](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.3**

Released: April 5, 2021

</td>
<td>

* [The Project Wizard: improvements in naming modules](https://youtrack.jetbrains.com/issues?q=issue%20id:%20KT-43449,%20KT-44060,%20KT-41520,%20KT-45282).
* [Ability to use the CocoaPods dependency manager in the Project Wizard for iOS integration](https://youtrack.jetbrains.com/issue/KT-45478).
* [Better readability of gradle.properties in new projects](https://youtrack.jetbrains.com/issue/KT-42908).
* [Sample tests are no longer generated if "Add sample tests for Shared Module" is unchecked](https://youtrack.jetbrains.com/issue/KT-43441).
* [Fixes and other improvements](https://youtrack.jetbrains.com/issues?q=Subsystems:%20%7BKMM%20Plugin%7D%20Type:%20Feature,%20Bug%20State:%20-Obsolete,%20-%7BAs%20designed%7D,%20-Answered,%20-Incomplete%20resolved%20date:%202021-03-10%20..%202021-03-25).

</td>
<td>

* [Kotlin 1.4.30](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.2**

Released: March 3, 2021

</td>
<td>

* [Ability to open Xcode-related files in Xcode](https://youtrack.jetbrains.com/issue/KT-44970).
* [Ability to set up a location for the Xcode project file in the iOS run configuration](https://youtrack.jetbrains.com/issue/KT-44968).
* [Support for Android Studio 2020.3.1 Canary 8](https://youtrack.jetbrains.com/issue/KT-45162).
* [Fixes and other improvements](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.2%20).

</td>
<td>

* [Kotlin 1.4.30](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.1**

Released: February 15, 2021

</td>
<td>

Use this version of the plugin with Android Studio 4.2.
* Infrastructure improvements.
* [Fixes and other improvements](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.1%20).

</td>
<td>

* [Kotlin 1.4.30](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.0**

Released: November 23, 2020

</td>
<td>

* [Support for iPad devices](https://youtrack.jetbrains.com/issue/KT-41932).
* [Support for custom scheme names that are configured in Xcode](https://youtrack.jetbrains.com/issue/KT-41677).
* [Ability to add custom build steps for the iOS run configuration](https://youtrack.jetbrains.com/issue/KT-41678).
* [Ability to debug a custom Kotlin/Native binary](https://youtrack.jetbrains.com/issue/KT-40954).
* [Simplified the code generated by Kotlin Multiplatform Mobile Wizards](https://youtrack.jetbrains.com/issue/KT-41712).
* [Removed support for the Kotlin Android Extensions plugin](https://youtrack.jetbrains.com/issue/KT-42121), which is deprecated in Kotlin 1.4.20.
* [Fixed saving physical device configuration after disconnecting from the host](https://youtrack.jetbrains.com/issue/KT-42390).
* Other fixes and improvements.

</td>
<td>

* [Kotlin 1.4.20](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.1.3**

Released: October 2, 2020

</td>
<td>

* Added compatibility with iOS 14 and Xcode 12.
* Fixed naming in platform tests created by the Kotlin Multiplatform Mobile Wizard.

</td>
<td>

* [Kotlin 1.4.10](releases.md#release-details)
* [Kotlin 1.4.20](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.1.2**

Released: September 29, 2020

</td>
<td>

 * Fixed compatibility with [Kotlin 1.4.20-M1](eap.md#build-details).
 * Enabled error reporting to JetBrains by default.

</td>
<td>

* [Kotlin 1.4.10](releases.md#release-details)
* [Kotlin 1.4.20](releases.md#release-details)

</td>
</tr>

<tr>
<td>

**0.1.1**

Released: September 10, 2020

</td>
<td>

* Fixed compatibility with Android Studio Canary 8 and higher.

</td>
<td>

* [Kotlin 1.4.10](releases.md#release-details)
* [Kotlin 1.4.20](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.1.0**

Released: August 31, 2020

</td>
<td>

* The first version of the Kotlin Multiplatform Mobile plugin. Learn more in the [blog post](https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/).

</td>
<td>

* [Kotlin 1.4.0](releases.md#release-details)
* [Kotlin 1.4.10](releases.md#release-details)

</td>
</tr>

</table>
