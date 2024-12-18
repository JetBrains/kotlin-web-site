[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release,
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{style="note"}

The Kotlin %kotlinEapVersion% release is out!
Here are some details of this EAP release:

* [](#kotlin-k2-compiler-new-default-kapt-plugin)
* [](#gradle-support-for-version-8-11)

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest IntelliJ IDEA and Android Studio.
You don't need to update the Kotlin plugin in your IDE.
All you need to do is to [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.

## Kotlin K2 compiler: new default kapt plugin

<primary-label ref="beta"/>

Starting with Kotlin %kotlinEapVersion%, the K2 implementation of the kapt compiler plugin is enabled by default
for all the projects.

The JetBrains team has launched the new implementation of the kapt plugin with the K2 compiler back in Kotlin 1.9.20. 
Since then, we have further developed K2 kapt's internal implementation and made its behavior similar to that of K1 kapt,
while significantly improving its performance.

If you encounter any issues when using kapt with the K2 compiler,
you can temporarily revert to the previous kapt plugin implementation.

To do this, add the following option to the `gradle.properties` file of your project:

```kotlin
kapt.use.k2=false
```

Please report such issues to our [issue tracker](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback).

## Gradle: support for version 8.11

Kotlin %kotlinEapVersion% is now compatible with the latest stable Gradle version, 8.11, and supports its features.

## How to update to Kotlin %kotlinEapVersion%

Starting from IntelliJ IDEA 2023.3 and Android Studio Iguana (2023.2.1) Canary 15, the Kotlin plugin is distributed as a
bundled plugin included in your IDE. This means that you can't install the plugin from JetBrains Marketplace anymore.
The bundled plugin supports upcoming Kotlin EAP releases.

To update to the new Kotlin EAP version, [change the Kotlin version](configure-build-for-eap.md#adjust-the-kotlin-version)
to %kotlinEapVersion% in your build scripts.