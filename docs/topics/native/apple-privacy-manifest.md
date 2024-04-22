[//]: # (title: Privacy manifest for apps dependent on KMP)

If your app intended for the Apple App Store uses [required reasons APIs](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api),
App Store Connect may issue a warning if the app doesn't have the correct privacy manifest.
This can affect any kind of Apple ecosystem app, native or multiplatform.

![Required reasons warning](app-store-required-reasons-warning.png){width="700"}

Your app may be using a required reason API through a third-party library or SDK, which may not be obvious.
If you are reading this, Kotlin Multiplatform is probably one of the frameworks that uses APIs you're not aware of.

On this page, we describe the problem in detail and recommend an approach to deal with it.

> This page reflects the Kotlin team's current understanding of the issue.
> As more data and knowledge about the accepted approach and workarounds are accumulated, the page will be updated to reflect them.
>
{type="tip"}

## The issue

[As announced](https://developer.apple.com/news/?id=r1henawx),
Apple requirements for App Store submissions are changing in the spring of 2024. You can already encounter warnings
if you submit an app that doesn't specify a reason for using a required reason API in its privacy manifest.
Starting May 1, 2024, such apps will not be accepted by App Store Connect at all.

This is an automatic check, not manual moderation: the code of your app is analyzed, and you receive the list of issues
in a corresponding email.
The emails will reference the `ITMS-91053: Missing API declaration` issue, listing all API categories that
are used in the app and fall under the [required reasons](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)
category.

Ideally, all SDKs that your app uses provide their own privacy manifest, and you don't need to worry about that.
But if some of your dependencies don't do this, your App Store submission will be flagged.

> As of April 22, App Store does not check API usage in dynamically linked libraries (only static dependencies affect the check),
> but this may change in the future.
>
{type="note"}

## Currently working approach

To make sure that your Kotlin Multiplatform app meets the App Store requirements, you can list all of the required reason APIs
in the privacy manifest of the app itself.

After you have tried to submit your app and received a detailed issue list from App Store, you can build your manifest
following the Apple documentation:

* [Privacy manifest files overview](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
* [Describing data use in privacy manifests](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_data_use_in_privacy_manifests)
* [Describing use of required reason API](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)

The resulting file is a collection of dictionaries. For each accessed API type, select one or more reasons for using it
from the provided list. Xcode helps with editing .xcprivacy files by providing a visual layout and dropdown lists with
valid values for each field.

If a privacy manifest doesn't help satisfy App Store requirements, or you cannot figure out how to go through the steps,
contact us in this YouTrack issue and share your case: [KT-67603](https://youtrack.jetbrains.com/issue/KT-67603)
