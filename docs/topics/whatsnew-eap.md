[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release, 
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{type="note"}

The Kotlin %kotlinEapVersion% release is out!
This document contains some details about this EAP release.

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest IntelliJ IDEA and Android Studio. 
You don't need to update the Kotlin plugin in your IDE. 
All you need to do is to [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.

## Support for requiring opt-in to extend APIs

Kotlin %kotlinEapVersion% introduces the [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) annotation. 
This annotation allows library authors 
to require explicit opt-in before users can implement experimental interfaces or extend experimental classes.

This feature can be useful when a library API is stable enough to use but might evolve with new abstract functions, 
making it unstable for inheritance.

To add the opt-in requirement to an API element,
use the `@SubclassOptInRequired` annotation with a reference to the annotation class:

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

In this example, the `CoreLibraryApi` interface requires users to opt in before they can implement it.
A user can opt in like this:

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation : CoreLibraryApi
```

> When you use the `@SubclassOptInRequired` annotation to require opt-in, 
> the requirement is not propagated to any [inner or nested classes](nested-classes.md).
>
{type="note"}

For a real-world example of how to use the `@SubclassOptInRequired` annotation in your API, 
check out the [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 
interface in the `kotlinx.coroutines` library.

## Preview of the new language features

After the Kotlin 2.0.0 release with the K2 compiler, 
the Kotlin team at JetBrains is focusing on improving the language with new features. 
In this release, we are excited to announce several new language design features.

These features are available in preview, and we encourage you to try them and share your feedback:
* Guard conditions in `when` with a subject. [Read the YouTrack issue for details](https://youtrack.jetbrains.com/issue/KT-13626)
* Non-local `break` and `continue`. [Read the YouTrack issue for details](https://youtrack.jetbrains.com/issue/KT-1436)
* Multidollar interpolation: improved handling of `$` in string literals. 
  [Read the YouTrack issue for details](https://youtrack.jetbrains.com/issue/KT-2425)

> All the features have the IDE support in the latest EAP version of IntelliJ IDEA with the K2 mode enabled.
> 
> Learn more in the [IntelliJ IDEA 2024.3 EAP blog post](https://blog.jetbrains.com/idea/2024/09/intellij-idea-2024-3-eap/#k2-mode-enabled-by-default).
> 
{type="tip"}

[See the full list of Kotlin language design features and proposals](kotlin-language-features-and-proposals.md).

## Improved K2 kapt implementation

> The kapt plugin for the K2 compiler (K2 kapt) is in [Alpha](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained).
> It may be changed at any time. We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback).
>
{type="warning"}

Currently, projects using the [kapt](https://kotlinlang.org/docs/kapt.html) plugin work with the K1 compiler by default, 
supporting Kotlin versions up to 1.9.

In Kotlin 1.9.20, we launched an experimental implementation of the kapt plugin with the K2 compiler (K2 kapt). 
Now, we improve K2 kapt's internal implementation to mitigate technical and performance issues.

While the new K2 kapt implementation doesn't introduce new features,
its performance has significantly improved compared to the previous K2 kapt implementation.
Additionally, the K2 kapt plugin's behavior is now much closer to K1 kapt.

To use the new K2 kapt plugin implementation, enable it the same way as the previous K2 kapt plugin. 
Add the following flag to the `gradle.properties` file of your project:

```text
kapt.use.k2=true
```

In upcoming releases, the K2 kapt implementation will be enabled by default instead of K1 kapt, 
so you won't longer need to enable it manually.

When using the K2 kapt plugin, you might encounter a compilation error during the `kaptGenerateStubs*` tasks,
even though the actual error details are missing from the Gradle log.
This is a [known issue](https://youtrack.jetbrains.com/issue/KT-71431) that occurs when kapt is enabled in a module, 
but no annotation processors are present. The workaround is to disable the kapt plugin in the module.

We highly appreciate your [feedback](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)
before the new implementation is stabilized.

## Update LLVM version to 16.0.0 for Kotlin/Native

In Kotlin %kotlinEapVersion%, we updated LLVM from version 11.1.0 to 16.0.0. 
In certain cases, the new version offers compiler optimizations, faster compilation. 
It includes LLVM bug fixes and security updates as well.  
This update shouldn’t affect your code, but if you run into any issues, 
please create [an issue in our tracker](https://kotl.in/issue).

## Gradle improvements

Kotlin %kotlinEapVersion% is fully compatible with Gradle 7.6.3 through 8.9. 
For more details, see [Gradle 8.9 release notes](https://docs.gradle.org/8.9/release-notes.html).

You can also use Gradle versions up to the latest Gradle release, 
but if you do, keep in mind that you might encounter deprecation warnings or some new Gradle features might not work.

### Bumped the minimum supported AGP version to 7.3.1

Starting with Kotlin %kotlinEapVersion%, the minimum supported Android Gradle plugin version is 7.3.1.

### Bumped the minimum supported Gradle version to 7.6.3

Starting with Kotlin %kotlinEapVersion%, the minimum supported Gradle version is 7.6.3.

## Compose compiler updates

### Support for multiple stability configuration files

Compose compiler is able to interpret multiple stability configuration files,
but the `stabilityConfigurationFile` option of the Compose Compiler Gradle plugin only allowed for a single file to be specified.

In Kotlin %kotlinEapVersion% this functionality was reworked to allow you to use several stability configuration files 
for a single module:

* The `stabilityConfigurationFile` option is deprecated.
* There is a new option, `stabilityConfigurationFiles` with the type `ListProperty<RegularFile>`.

Here's how you can pass several files to the Compose compiler using the new option:

```kotlin
composeCompiler {
    stabilityConfigurationFiles.addAll(
        project.layout.projectDirectory.file("configuration-file1.conf"),
        project.layout.projectDirectory.file("configuration-file2.conf"),
    )
}
```

## How to update to Kotlin %kotlinEapVersion%

Starting from IntelliJ IDEA 2023.3 and Android Studio Iguana (2023.2.1) Canary 15, the Kotlin plugin is distributed as a 
bundled plugin included in your IDE. This means that you can't install the plugin from JetBrains Marketplace anymore. 
The bundled plugin supports upcoming Kotlin EAP releases.

To update to the new Kotlin EAP version, [change the Kotlin version](configure-build-for-eap.md#adjust-the-kotlin-version) 
to %kotlinEapVersion% in your build scripts.