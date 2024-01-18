[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release, 
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{type="note"}

The Kotlin %kotlinEapVersion% release is out! It mostly covers the stabilization of the [new Kotlin K2 compiler](#kotlin-k2-compiler), 
which reached its Beta status for all targets since 1.9.20. In addition, there are also improvements for the Gradle build tool.

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest IntelliJ IDEA and Android Studio. 
You don't need to update the Kotlin plugin in your IDE. 
All you need to do is to [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

## Kotlin K2 compiler

The JetBrains team is still working on the stabilization of the new Kotlin K2 compiler.
The new Kotlin K2 compiler will bring major performance improvements, speed up new language feature development,
unify all platforms that Kotlin supports, and provide a better architecture for multiplatform projects.

The K2 compiler is in [Beta](components-stability.md) for all target platforms: JVM, Native, Wasm, and JS.
The JetBrains team has ensured the quality of the new compiler by successfully compiling dozens of user and internal projects.
A large number of users are also involved in the stabilization process, trying the new K2 compiler in their projects and reporting any problems they find.

## Current K2 compiler limitations

Enabling K2 in your Gradle project comes with certain limitations that can affect projects using Gradle versions below 8.3 in the following cases:

* Compilation of source code from `buildSrc`.
* Compilation of Gradle plugins in included builds.
* Compilation of other Gradle plugins if they are used in projects with Gradle versions below 8.3.
* Building Gradle plugin dependencies.

If you encounter any of the problems mentioned above, you can take the following steps to address them:

* Set the language version for `buildSrc`, any Gradle plugins, and their dependencies:

  ```kotlin
  kotlin {
      compilerOptions {
          languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
          apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
      }
  }
  ```
  > If you configure language and API versions for specific tasks, these values will override the values set by the `compilerOptions` extension.
  > In this case, language and API versions should not be higher than 1.9.
  >
  {type="note"}

* Update the Gradle version in your project to 8.3 when it becomes available.

## Compiler plugins support

Currently, the Kotlin K2 compiler supports the following plugins:

* [kapt](whatsnew1920.md#preview-kapt-compiler-plugin-with-k2)
* [serialization](serialization.md)
* [`all-open`](all-open-plugin.md)
* [`no-arg`](no-arg-plugin.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Lombok](lombok.md)
* [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
* [Jetpack Compose compiler plugin](https://developer.android.com/jetpack/compose)
* [Kotlin Symbol Processing (KSP) plugin](ksp-overview.md)
* [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
* [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)

> If you use any additional compiler plugins, check their documentation to see if they are compatible with K2.
>
{type="tip"}

## How to enable the Kotlin K2 compiler

Starting with Kotlin 2.0.0-Beta1, the Kotlin K2 compiler is enabled by default.
No additional actions are required.

## Try the Kotlin K2 compiler in Kotlin Playground

Kotlin Playground supports the 2.0.0-Beta3 release. [Check it out!](https://pl.kotl.in/czuoQprce)

## Leave your feedback on the new K2 compiler

We would appreciate any feedback you may have!

* Provide your feedback directly to K2 developers on Kotlin
  Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  and join the [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) channel.
* Report any problems you face with the new K2 compiler
  in [our issue tracker](https://kotl.in/issue).
* [Enable the **Send usage statistics** option](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) to
  allow JetBrains to collect anonymous data about K2 usage.

## Improved Gradle dependency handling for CInteropProcess in Kotlin/Native

In this release, we enhanced the handling of the `defFile` property to ensure better Gradle task dependency management in 
Kotlin/Native projects. 

Before this update, Gradle builds could fail if the `defFile` property was designated as an output 
of another task that hadn't been executed yet. The workaround for this issue was to add a dependency on this task:

```kotlin
kotlin {
    macosArm64("native") {
        compilations.getByName("main") {
            cinterops {
                val cinterop by creating {
                    defFileProperty.set(createDefFileTask.flatMap { it.defFile.asFile })
                    project.tasks.named(interopProcessingTaskName).configure {
                        dependsOn(createDefFileTask)
                    }
                }
            }
        }
    }
}
```

To fix this, there is a new `RegularFileProperty` called `definitionFile`. Now, Gradle lazily verifies the presence of 
the `definitionFile` property after the connected task has run later in the build process. This new approach eliminates 
the need for additional dependencies.

The `CInteropProcess` task and the `CInteropSettings` class use the `definitionFile` property instead of `defFile` and 
`defFileProperty`:

<tabs group ="build-script">

<tab id="kotlin" title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    macosArm64("native") {
        compilations.getByName("main") {
            cinterops {
                val cinterop by creating {
                    definitionFile.set(project.file("def-file.def"))
                }
            }
        }
    }
}
```

</tab>

<tab id="groovy" title="Groovy" group-key="groovy">

```groovy
kotlin {
    macosArm64("native") {
        compilations.main {
            cinterops {
                cinterop {
                    definitionFile.set(project.file("def-file.def"))
                }
            }
        }
    }
}
```

</tab>

</tabs>

> `defFile` and `defFileProperty` parameters are now deprecated.
>
{type="warning"}

## Visibility changes in Gradle

> This change impacts only Kotlin DSL users.
> 
{type="note"}

In Kotlin %kotlinEapVersion%, we've modified the Kotlin Gradle Plugin for better control and safety in your build scripts.
Previously, certain Kotlin DSL functions and properties intended for a specific DSL context would inadvertently leak to 
other DSL contexts. This leakage could lead to the use of incorrect compiler options, settings being applied multiple times,
and other misconfigurations:

```kotlin
kotlin {
    // Target DSL couldn't access methods and properties defined in the
    // kotlin{} extension DSL
    jvm {
        // Compilation DSL couldn't access methods and properties defined
        // in the kotlin{} extension DSL and Kotlin jvm{} target DSL
        compilations.configureEach {
            // Compilation task DSLs couldn't access methods and 
            // properties defined in the kotlin{} extension, Kotlin jvm{}
            // target or Kotlin compilation DSL
            compileTaskProvider.configure {
                // For example:
                explicitApi()
                // ERROR as it is defined in the kotlin{} extension DSL
                mavenPublication {}
                // ERROR as it is defined in the Kotlin jvm{} target DSL
                defaultSourceSet {}
                // ERROR as it is defined in the Kotlin compilation DSL
            }
        }
    }
}
```

To fix this issue, we've added the `@KotlinGradlePluginDsl` annotation,
preventing the exposure of the Kotlin Gradle plugin DSL functions and properties to the levels where they are not intended
to be available. The following levels are separated from each other:

* Kotlin extension
* Kotlin target
* Kotlin compilation
* Kotlin compilation task

If your build script is configured incorrectly, you should see compiler warnings with suggestions on how to fix it. For example:

```kotlin
kotlin {
    jvm {
        sourceSets.getByName("jvmMain").dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.7.3")
        }
    }
}
```

In this case, the warning message for `sourceSets` is:

```kotlin
[DEPRECATION] 'sourceSets: NamedDomainObjectContainer<KotlinSourceSet>' is deprecated.Accessing 'sourceSets' container on the Kotlin target level DSL is deprecated . Consider configuring 'sourceSets' on the Kotlin extension level .
```

We would appreciate your feedback on this change! Share your comments directly to Kotlin developers in our [#eap Slack channel](https://kotlinlang.slack.com/archives/C0KLZSCHF).
[Get a Slack invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

## New directory for Kotlin data in Gradle projects

> With this change, you may need to add the `.kotlin` directory to your project's `.gitignore` file.
>
{type="warning"}

In Kotlin 1.8.20, the Kotlin Gradle plugin started to store its data in the Gradle project cache directory: `<project-root-directory>/.gradle/kotlin`.
However, the `.gradle` directory is reserved for Gradle only, and as a result it's not future-proof. To solve this, in 
Kotlin 2.0.0-Beta2 we store Kotlin data in your `<project-root-directory>/.kotlin` by default. We will continue to store
some data in `.gradle/kotlin` directory for backward compatibility.

There are new Gradle properties so that you can configure a directory of your choice and more:

| Gradle property                                     | Description                                                                                                      |
|-----------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | Configures the location where your project-level data is stored. Default: `<project-root-directory>/.kotlin`     |
| `kotlin.project.persistent.dir.gradle.disableWrite` | A boolean value that controls whether writing Kotlin data to the `.gradle` directory is disabled. Default: false |

Add these properties to the `gradle.properties` file in your projects for them to take effect.

## What to expect from upcoming Kotlin EAP releases

The upcoming 2.0.0-Beta4 release will increase the stability of the K2 compiler.
If you are currently using K2 in your project, 
we encourage you to stay updated on Kotlin releases and experiment with the updated K2 compiler. 
[Share your feedback on using Kotlin K2](#leave-your-feedback-on-the-new-k2-compiler).

> Despite the fact that the Kotlin K2 compiler is in Beta for all targets, it is not recommended to use it in production.
> This is due to K2 binaries poisoning: we need to ensure that code compiled with different versions of Kotlin maintains binary compatibility with K2 binaries.
> 
> You can start using the K2 compiler in production starting from **Kotlin 2.0.0-RC1**.
>
{type="warning"}

## How to update to Kotlin %kotlinEapVersion%

Starting from IntelliJ IDEA 2023.3 and Android Studio Iguana (2023.2.1) Canary 15, the Kotlin plugin is distributed as a 
bundled plugin included in your IDE. This means that you can’t install the plugin from JetBrains Marketplace anymore. 
The bundled plugin supports upcoming Kotlin EAP releases.

To update to the new Kotlin EAP version, [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.