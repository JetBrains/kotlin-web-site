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
But if some of your dependencies don't do this, your App Store submission will be flagged.

> As of April 22, the App Store does not check API usage in dynamically linked libraries, so only static dependencies affect the check;
> however, this may change in the future.
>
{type="note"}

## How to resolve

To ensure that your Kotlin Multiplatform app meets the App Store requirements, you can list all of the required reason
APIs in the app's privacy manifest.

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

## Tool for searching usages of required reason API in dependencies

In some cases, it may be hard for you to find out from which dependency the required reason API usage comes from. To assist you, we've built a simple tool.

To use it, run the following command in the directory of your project where Kotlin framework declaration (TODO not sure if it's comprehensible) is located
```python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"```
You also may download the script separately, inspect it, and run it via `python3`.

### Known usages

#### Compose Multiplatform

Compose Multiplatform rendering engine, Skia, is using `stat` and `fstat` symbols at the moment. Please follow [the issue](https://github.com/JetBrains/compose-multiplatform/issues/4738) for updates.

Currently, we recommend specifying TODO reason in the privacy manifest for this usage.


#### Kotlin/Native runtime in versions 1.9.10 or lower

There is a usage of `mach_absolute_time` in `mimalloc` allocator in K/N runtime. This allocator was enabled by default in version 1.9.10 and lower.

We recommend upgrading your Kotlin version or changing the [allocator setting](TODO proper link) if the upgrade is not possible.
