[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release, but it highlights the latest
> ones and some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{type="note"}

The Kotlin %kotlinEapVersion% release is out!

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are available for:

| IDE            | Supported versions                                     |
|----------------|--------------------------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x                                     |
| Android Studio | Hedgehog (2023.1.1 Beta 3), Iguana (2023.2.1 Canary 2) |

## Kotlin K2 compiler updates

### Preview kapt compiler plugin with K2

> Support for K2 in the kapt compiler plugin is [Experimental](components-stability.md).
> Opt-in is required (see details below), and you should use it only for evaluation purposes.
>
{type="warning"}

In 1.9.20-RC, you can try using the [kapt compiler plugin](kapt.md) with the K2 compiler.
To use the K2 compiler in your project, add the following options to your `gradle.properties` file:

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

Alternatively, you can enable K2 for kapt by completing the following steps:
1. In your `build.gradle.kts` file, [set the language version](gradle-compiler-options.md#example-of-setting-a-languageversion) to `2.0`.
2. In your `gradle.properties` file, add `kapt.use.k2=true`.

If you encounter any issues when using kapt with the K2 compiler, please report them to our
[issue tracker](http://kotl.in/issue).

### How to enable the Kotlin K2 compiler

To enable and test the Kotlin K2 compiler, use the new language version with the following compiler option:

```bash
-language-version 2.0
```

You can specify it in your `build.gradle.kts` file:

```kotlin
kotlin {
   sourceSets.all {
       languageSettings {
           languageVersion = "2.0"
       }
   }
}
```

### Leave your feedback on the new K2 compiler

We would appreciate any feedback you may have!

* Provide your feedback directly to K2 developers on Kotlin
  Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  and join the [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) channel.
* Report any problems you faced with the new K2 compiler
  on [our issue tracker](https://kotl.in/issue).
* [Enable the **Send usage statistics** option](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) to
  allow JetBrains to collect anonymous data about K2 usage.

## How to update to Kotlin %kotlinEapVersion%

Install Kotlin %kotlinEapVersion% in any of the following ways:

* If you use the _Early Access Preview_ update channel, the IDE will suggest automatically updating to %kotlinEapVersion% as
  soon as it becomes available.
* If you use the _Stable_ update channel, you can change the channel to _Early Access Preview_ at any time by selecting
  **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** in your IDE. You'll then be able to install the latest
  preview release. Check out [these instructions](install-eap-plugin.md) for details.

Once you've installed %kotlinEapVersion% don't forget to [change the Kotlin version](configure-build-for-eap.md)
to %kotlinEapVersion% in your build scripts.