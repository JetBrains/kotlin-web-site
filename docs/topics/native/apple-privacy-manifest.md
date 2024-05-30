[//]: # (title: Privacy manifest for iOS apps)

If your app is intended for the Apple App Store and uses [required reasons APIs](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api),
App Store Connect may issue a warning that the app doesn't have the correct privacy manifest:

![Required reasons warning](app-store-required-reasons-warning.png){width="700"}

It can affect any Apple ecosystem app, native or multiplatform. Your app may be using a required reason API through a
third-party library or SDK, which may not be obvious. Kotlin Multiplatform could be one of the frameworks that uses APIs
you're unaware of.

On this page, you'll find a detailed description of the problem and a recommendation for dealing with it.

> This page reflects the Kotlin team's current understanding of the issue.
> As we have more data and knowledge about the accepted approach and workarounds, we'll update the page to reflect them.
>
{type="tip"}

## What's the issue

Apple requirements for App Store submissions are [changing in the spring of 2024](https://developer.apple.com/news/?id=r1henawx).
You can already encounter warnings if you submit an app that doesn't specify a reason for using a required reason API in
its privacy manifest. Starting May 1, 2024, [App Store Connect](https://appstoreconnect.apple.com) will not accept such apps at all.

This is an automatic check, not a manual moderation: your app's code is analyzed, and you receive a list of issues in an
email. The email will reference the "ITMS-91053: Missing API declaration" issue, listing all API categories used in the
app that fall under the [required reasons](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)
category.

Ideally, all SDKs that your app uses provide their own privacy manifest, and you don't need to worry about that.
But if some of your dependencies don't do this, your App Store submission may be flagged.

## How to resolve

After you have tried to submit your app and received a detailed issue list from the App Store, you can build your manifest
following the Apple documentation:

* [Privacy manifest files overview](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
* [Describing data use in privacy manifests](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_data_use_in_privacy_manifests)
* [Describing use of required reason API](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)

The resulting file is a collection of dictionaries. For each accessed API type, select one or more reasons for using it
from the provided list. Xcode helps edit `.xcprivacy` files by providing a visual layout and dropdown lists with
valid values for each field.

If a new privacy manifest doesn't help satisfy App Store requirements or you cannot figure out how to go through the steps,
contact us and share your case in [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-67603).

## Finding required reason APIs in the dependencies of your Kotlin framework

Kotlin code in your app may access required reason APIs from libraries such as `platform.posix`. For example, if your Kotlin code or one the dependencies accesses API such as `fstat`:
```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
  fstat(...)
}
```

In some cases, it may be hard for you to find out from which dependency the required reason API usage comes from. To assist you, we've built a simple tool.

To use it, run the following command in the directory of your project where the Kotlin framework is declared:
```
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```
You may also download the script separately, inspect it, and run it via `python3`.

## Placing PrivacyInfo.xcprivacy in your Kotlin artifacts

If you need to bundle `PrivacyInfo.xcprivacy` file with your Kotlin artifacts, use `apple-privacy-manifests` plugin:
```
plugins {
  kotlin("multiplatform")
  kotlin("apple-privacy-manifests") version "1.0.0"
}

kotlin {
  privacyManifests {
    embed(
      privacyManifest = layout.projectDirectory.file("PrivacyInfo.xcprivacy").asFile,
    )
  }
}
```

The plugin will copy the privacy manifest file to the [corresponding](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/adding_a_privacy_manifest_to_your_app_or_third-party_sdk?language=objc) output location.

### Known usages

#### Compose Multiplatform

Using Compose Multiplatform may result in `fstat`, `stat` and `mach_absolute_time` usages in your binary. In Compose Multiplatform these function are not used for tracking or fingerprinting and are not sent off the device. 

If you must specify a reason for `stat` and `fstat` usages, use `0A2A.1`. For `mach_absolute_time`, use `35F9.1`.

For further updates on Compose required reasons APIs please follow [this issue](https://github.com/JetBrains/compose-multiplatform/issues/4738).

#### Kotlin/Native runtime in versions 1.9.10 or lower

There is a usage of `mach_absolute_time` in `mimalloc` allocator in K/N runtime. This allocator was enabled by default in version 1.9.10 and lower.

We recommend upgrading your Kotlin version to 1.9.20 or higher, or changing the [allocator setting](https://kotlinlang.org/docs/native-memory-manager.html#adjust-memory-consumption) if the upgrade is not possible.
