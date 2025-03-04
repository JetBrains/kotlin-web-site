[//]: # (title: Compatibility guide for Kotlin Multiplatform)

<show-structure depth="1"/>

This guide summarizes [incompatible changes](kotlin-evolution-principles.md#incompatible-changes) you might encounter while
developing projects with Kotlin Multiplatform.

The current Stable version of Kotlin is %kotlinVersion%. Mind the deprecation cycle of a specific change in relation to
the Kotlin version you have in your projects, for example:

* When upgrading from Kotlin 1.7.0 to Kotlin 1.9.0, check incompatible changes that came into effect both in
  [Kotlin 1.9.0](#kotlin-1-9-0-1-9-25) and in [Kotlin 1.7.0−1.8.22](#kotlin-1-7-0-1-8-22).
* When upgrading from Kotlin 1.9.0 to Kotlin 2.0.0, check incompatible changes that came into effect both in
  [Kotlin 2.0.0](#kotlin-2-0-0-and-later) and in [Kotlin 1.9.0−1.9.25](#kotlin-1-9-0-1-9-25). 

## Version compatibility

When configuring your project, check the compatibility of a particular version of the Kotlin Multiplatform Gradle plugin
(same as the Kotlin version in your project) with Gradle, Xcode, and Android Gradle plugin versions:

| Kotlin Multiplatform plugin version | Gradle                                 | Android Gradle plugin           | Xcode   |
|-------------------------------------|----------------------------------------|---------------------------------|---------|
| 2.1.0                               | %minGradleVersion%–%maxGradleVersion%* | 7.4.2–%maxAndroidGradleVersion% | %xcode% |
| 2.0.21                              | 7.5-8.8*                               | 7.4.2–8.5                       | 16.0    |
| 2.0.20                              | 7.5-8.8*                               | 7.4.2–8.5                       | 15.3    |
| 2.0.0                               | 7.5-8.5                                | 7.4.2–8.3                       | 15.3    |
| 1.9.20                              | 7.5-8.1.1                              | 7.4.2–8.2                       | 15.0    |

> *Kotlin 2.0.20–2.0.21 and Kotlin 2.1.0 are fully compatible with Gradle up to 8.6.
> Gradle 8.7 and 8.8 are also supported, but you may see deprecation warnings in your multiplatform projects
> calling the [`withJava()` function in the JVM target](multiplatform-dsl-reference.md#jvm-targets). 
> For more information, see the issue in [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning).
> 
{style="warning"}

## Kotlin 2.0.0 and later

This section covers incompatible changes that end their deprecation cycle and come into effect in Kotlin 2.0.0−%kotlinVersion%.

<anchor name="java-source-set-created-by-default"/>
### Java source sets created by default
<primary-label ref="eap"/>

**What's changed?**

To align Kotlin Multiplatform with upcoming changes in Gradle, we are phasing out the `withJava()` function. The `withJava()`
function enabled integration with Gradle's Java plugins by creating the necessary Java source sets. From Kotlin %kotlinEapVersion%,
these Java source sets are created by default.

**What's the best practice now?**

Previously, you had to explicitly use the `withJava()` function to create `src/jvmMain/java` and `src/jvmTest/java` source sets:

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
``` 

From Kotlin %kotlinEapVersion%, you can remove the `withJava()` function from your build script.

In addition, Gradle now only runs Java compile tasks if Java sources are present, triggering a JVM validation 
diagnostic that previously didn't run before. This diagnostic fails if you explicitly configure an incompatible JVM target
for `KotlinJvmCompile` tasks or inside `compilerOptions`. For guidance on ensuring JVM target compatibility, see 
[Check for JVM target compatibility of related compile tasks](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks).

If your project uses Gradle versions higher than 8.7 and doesn't rely on Gradle Java plugins, like [Java](https://docs.gradle.org/current/userguide/java_plugin.html),
[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html), or [Application](https://docs.gradle.org/current/userguide/application_plugin.html),
or a third party Gradle plugin that has a dependency on a Gradle Java plugin, you can remove the `withJava()` function.

If your project uses the [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle Java plugin,
we recommend migrating to the [new Experimental DSL](whatsnew-eap.md#new-dsl-to-replace-gradle-s-application-plugin).
Starting with Gradle 8.7, the Application plugin will no longer work with the Kotlin Multiplatform Gradle plugin.

If you want to use both the Kotlin Multiplatform Gradle plugin and other Gradle plugins for
Java in your multiplatform project, see [Deprecated compatibility with Kotlin Multiplatform Gradle plugin and Java plugins](multiplatform-compatibility-guide.md#deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins).

If you run into any issues, report them in our [issue tracker](https://kotl.in/issue) or ask for help in our [public Slack channel](https://kotlinlang.slack.com/archives/C19FD9681).

**When do the changes take effect?**

Here's the planned deprecation cycle:

* Gradle >8.6: introduce a deprecation warning for any previous version of Kotlin in multiplatform projects using the `withJava()` function.
* Gradle 9.0: raise this warning to an error.
* %kotlinEapVersion%: introduce a deprecation warning when using the `withJava()` function with any version of Gradle.

<anchor name="android-target-rename"/>
### Rename of `android` target to `androidTarget`

**What's changed?**

We continue our efforts to make Kotlin Multiplatform more stable. An essential step in this direction is to provide first-class
support for the Android target. In the future, this support will be provided via a separate plugin, developed by the
Android team from Google.

To open the way for the new solution, we're renaming the `android` block to `androidTarget` in the current
Kotlin DSL. This is a temporary change that is necessary to free the short `android` name for the upcoming DSL
from Google.

**What's the best practice now?**

Rename all the occurrences of the `android` block to `androidTarget`. When the new plugin for the Android target support
is available, migrate to the DSL from Google. It will be the preferred option to work with Android in Kotlin Multiplatform
projects.

**When do the changes take effect?**

Here's the planned deprecation cycle:

* 1.9.0: introduce a deprecation warning when the `android` name is used in Kotlin Multiplatform projects
* 2.1.0: raise this warning to an error
* 2.2.0: remove the `android` target DSL from the Kotlin Multiplatform Gradle plugin

<anchor name="declaring-multiple-targets"/>
### Declaring several similar targets

**What's changed?**

We discourage declaring several similar targets in a single Gradle project. For example:

```kotlin
kotlin {
    jvm("jvmKtor")
    jvm("jvmOkHttp") // Not recommended and produces a deprecation warning
}
```

One popular case is having two related pieces of code together. For example, you might want to use
`jvm("jvmKtor")` and `jvm("jvmOkHttp")` in your `:shared` Gradle project to implement networking using the Ktor
or OkHttp libraries:

```kotlin
// shared/build.gradle.kts:
kotlin {
    jvm("jvmKtor") {
        attributes.attribute(/* ... */)
    }
    jvm("jvmOkHttp") {
        attributes.attribute(/* ... */)
    }

    sourceSets {
        val commonMain by getting
        val commonJvmMain by sourceSets.creating {
            dependsOn(commonMain)
            dependencies {
                // Shared dependencies
            }
        }
        val jvmKtorMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // Ktor dependencies
            }
        }
        val jvmOkHttpMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // OkHttp dependencies
            }
        }
    }
}
```

The implementation comes with non-trivial configuration complexity:

* You have to set up Gradle attributes on the `:shared` side and each consumer's side. Otherwise, Gradle can't
  resolve dependencies in such projects because without additional information it's not clear whether the consumer
  should receive the Ktor-based or the OkHttp-based implementation.
* You have to set up the `commonJvmMain` source set manually.
* The configuration involves a handful of low-level Gradle and Kotlin Gradle plugin abstractions and APIs.

**What's the best practice now?**

The configuration is complex because Ktor-based and OkHttp-based implementations are
_in the same Gradle project_. In many cases, it's possible to extract those parts into separate Gradle projects.
Here's a general outline of such as a refactoring:

1. Replace two duplicated targets from the original project with a single target. If you had a shared source set between
   these targets, move its sources and configuration to the default source set of the newly created target:

    ```kotlin
    // shared/build.gradle.kts:
    kotlin {
        jvm()
        
        sourceSets {
            jvmMain {
                // Copy the configuration of jvmCommonMain here
            }
        }
    }
    ```

2. Add two new Gradle projects, usually by calling `include` in your `settings.gradle.kts` file. For example:

    ```kotlin
    include(":okhttp-impl")
    include(":ktor-impl")
    ```

3. Configure each new Gradle project:

    * Most likely, you don't need to apply the `kotlin("multiplatform")` plugin, as these projects compile only to one
      target. In this example, you can apply `kotlin("jvm")`.
    * Move the content of original target-specific source sets to their respective projects, for example,
      from `jvmKtorMain` to `ktor-impl/src`.
    * Copy the configuration of source sets: dependencies, compiler options, and so on.
    * Add a dependency from the new Gradle project to the original project.

    ```kotlin
    // ktor-impl/build.gradle.kts:
    plugins {
        kotlin("jvm")
    }
    
    dependencies {
        project(":shared") // Add dependency on the original project
        // Copy dependencies of jvmKtorMain here
    }
    
    kotlin {
        compilerOptions {
            // Copy compiler options of jvmKtorMain here
        }
    }
    ```

While this approach requires more work on the initial setup, it doesn't use any low-level entities of Gradle and
the Kotlin Gradle plugin, making it easier to use and maintain the resulting build.

> Unfortunately, we can't provide detailed migration steps for each case. If the instructions above don't work
> for you, describe your use case in this [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-59316).
>
{style="tip"}

**When do the changes take effect?**

Here's the planned deprecation cycle:

* 1.9.20: introduce a deprecation warning when multiple similar targets are used in Kotlin Multiplatform projects
* 2.1.0: report an error in such cases, except for Kotlin/JS targets; to learn more about this exception, see the issue in [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode)

<anchor name="deprecate-pre-hmpp-dependencies"/>
### Deprecated support of multiplatform libraries published in the legacy mode

**What's changed?**

Previously, we [have deprecated
the legacy mode](#deprecated-gradle-properties-for-hierarchical-structure-support) in Kotlin Multiplatform projects
preventing the publication of "legacy" binaries and encouraged you to migrate your projects to the [hierarchical structure](multiplatform-hierarchy.md).

To continue phasing out "legacy" binaries from the ecosystem, starting with Kotlin 1.9.0, the use of legacy libraries
is also discouraged. If your project uses dependencies on legacy libraries, you'll see the following warning:

```none
The dependency group:artifact:1.0 was published in the legacy mode. Support for such dependencies will be removed in the future
```

**What's the best practice now?**

_If you use multiplatform libraries_, most of them have already migrated to the "hierarchical structure" mode,
so you only need to update the library version. See the documentation of the respective libraries for details.

If the library doesn't support non-legacy binaries yet, you can contact the maintainers and tell them about this
compatibility issue.

_If you're a library author_, update the Kotlin Gradle plugin to the latest version and ensure you've fixed the [deprecated Gradle properties](#deprecated-gradle-properties-for-hierarchical-structure-support).

The Kotlin team is eager to help the ecosystem migrate, so if you face any issues, don't hesitate to create an [issue in YouTrack](https://kotl.in/issue).

**When do the changes take effect?**

Here's the planned deprecation cycle:

* 1.9: introduce a deprecation warning for dependencies on legacy libraries
* 2.0: raise the warning for dependencies on legacy libraries to an error
* &gt;2.0: remove support for dependencies on legacy libraries; using such dependencies can cause build failures

<anchor name="deprecate-hmpp-properties"/>
### Deprecated Gradle properties for hierarchical structure support

**What's changed?**

Throughout its evolution, Kotlin was gradually introducing the support for [hierarchical structure](multiplatform-hierarchy.md),
in multiplatform projects, an ability to have intermediate source sets between the common source set `commonMain` and
any platform-specific one, for example, `jvmMain`.

For the transition period, while the toolchain wasn't stable enough, a couple of Gradle properties were introduced,
allowing granular opt-ins and opt-outs.

Since Kotlin 1.6.20, the hierarchical project structure support has been enabled by default. However, these properties
were kept for opting out in case of blocking issues. After processing all the feedback, we're now starting to phase out
those properties completely.

The following properties are now deprecated:

* `kotlin.internal.mpp.hierarchicalStructureByDefault`
* `kotlin.mpp.enableCompatibilityMetadataVariant`
* `kotlin.mpp.hierarchicalStructureSupport`
* `kotlin.mpp.enableGranularSourceSetsMetadata`
* `kotlin.native.enableDependencyPropagation`

**What's the best practice now?**

* Remove these properties from your `gradle.properties` and `local.properties` files.
* Avoid setting them programmatically in the Gradle build scripts or your Gradle plugins.
* In case deprecated properties are set by some third-party Gradle plugin used in your build, ask the plugin maintainers
  not to set these properties.

As the default behavior of the Kotlin toolchain doesn't include such properties since 1.6.20, we don't expect
any serious impact from removing them. Most possible consequences will be visible immediately after the project rebuild.

If you're a library author and want to be extra safe, check that consumers can work with your library.

**When do the changes take effect?**

Here's the planned deprecation cycle:

* 1.8.20: report a warning when these properties are used
* 1.9.20: raise this warning to an error
* 2.0: remove these properties; the Kotlin Gradle plugin ignores their usages

In the unlikely case you face some problems after removing these properties, create an [issue in YouTrack](https://kotl.in/issue).

<anchor name="target-presets-deprecation"/>
### Deprecated target presets API

**What's changed?**

In the very early development stages, Kotlin Multiplatform introduced an API for working with so-called _target presets_.
Each target preset essentially represented a factory for Kotlin Multiplatform targets. This API turned out to be largely
redundant, as DSL functions like `jvm()` or `iosSimulatorArm64()` cover the same use cases while being much more
straightforward and concise.

To reduce the confusion and provide clearer guidelines, all presets-related APIs are now deprecated and will be
removed from the public API of the Kotlin Gradle plugin in future releases. This includes:

* The `presets` property in `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension`
* The `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` interface and all its inheritors
* The `fromPreset` overloads

**What's the best practice now?**

Use respective [Kotlin targets](multiplatform-dsl-reference.md#targets) instead, for example:

<table>
    <tr>
        <td>Before</td>
        <td>Now</td>
    </tr>
    <tr>
<td>

```kotlin
kotlin {
    targets {
        fromPreset(presets.iosArm64, 'ios')
    }
}
```

</td>
<td>

```kotlin
kotlin {
    iosArm64()
}
```

</td>
</tr>
</table>

**When do the changes take effect?**

Here's the planned deprecation cycle:

* 1.9.20: report a warning on any usages of the presets-related API
* 2.0: raise this warning to an error
* &gt;2.0: remove the presets-related API from the public API of the Kotlin Gradle plugin; sources that still use it fail
  with "unresolved reference" errors, and binaries (for example, Gradle plugins) might fail with linkage errors
  unless recompiled against the latest versions of the Kotlin Gradle plugin

<anchor name="target-shortcuts-deprecation"/>
### Deprecated Apple target shortcuts

**What's changed?**

We're deprecating `ios()`, `watchos()`, and `tvos()` target shortcuts in Kotlin Multiplatform DSL. They were designed to
partially create a source set hierarchy for Apple targets. However, they proved to be difficult to expand and sometimes confusing.

For example, the `ios()` shortcut created both the `iosArm64` and `iosX64` targets but didn't include the `iosSimulatorArm64`
target, which is necessary when working on hosts with Apple M chips. However, changing this shortcut was hard to implement
and could cause issues in existing user projects.

**What's the best practice now?**

The Kotlin Gradle plugin now provides a built-in hierarchy template. Since Kotlin 1.9.20, it's enabled by default
and contains predefined intermediate source sets for popular use cases.

Instead of shortcuts, you should specify the list of targets, and then the plugin automatically sets up intermediate
source sets based on this list.

For example, if you have `iosArm64` and `iosSimulatorArm64` targets in your project, the plugin automatically creates
the `iosMain` and `iosTest` intermediate source sets. If you have `iosArm64` and `macosArm64` targets, the `appleMain` and
`appleTest` source sets are created.

For more information, see [Hierarchical project structure](multiplatform-hierarchy.md)

**When do the changes take effect?**

Here's the planned deprecation cycle:

* 1.9.20: report a warning when `ios()`, `watchos()`, and `tvos()` target shortcuts are used;
  the default hierarchy template is enabled by default instead
* 2.1.0: report an error when target shortcuts are used
* 2.2.0: remove target shortcut DSL from the Kotlin Multiplatform Gradle plugin

### Incorrect version of iOS framework after Kotlin upgrade

**What's the issue?**

Changes in Kotlin code might not be reflected in the iOS app in Xcode when direct integration
is used. The direct integration is set up with the `embedAndSignAppleFrameworkForXcode` task, which connects the iOS
framework from your multiplatform project to the iOS app in Xcode.

This can happen when you upgrade the Kotlin version from 1.9.2x to 2.0.0 in your multiplatform project (or downgrade it
from 2.0.0 to 1.9.2x), then make changes in Kotlin files and try building the app, Xcode may incorrectly use the previous
version of the iOS framework. So, the changes won't be visible in the iOS app in Xcode.

**What's the workaround?**

1. In Xcode, clean build directories using **Product** | **Clean Build Folder**.
2. In the terminal, run the following command:

   ```none
   ./gradlew clean
   ```

3. Build the app again to ensure that the new version of the iOS framework is used.

**When will the issue be fixed?**

We're planning to fix this issue in Kotlin 2.0.10. You can check if any preview versions of
Kotlin 2.0.10 are already available in the [Participate in the Kotlin Early Access Preview](eap.md) section.

For more information, see the [corresponding issue in YouTrack](https://youtrack.jetbrains.com/issue/KT-68257).

## Kotlin 1.9.0−1.9.25

This section covers incompatible changes that end their deprecation cycle and come into effect in Kotlin 1.9.0−1.9.25.

<anchor name="compilation-source-deprecation"/>
### Deprecated API for adding Kotlin source sets directly to the Kotlin compilation {initial-collapse-state="collapsed" collapsible="true"}

**What's changed?**

The access to `KotlinCompilation.source` has been deprecated. A code like this produces a deprecation warning:

```kotlin
kotlin {
    jvm()
    js()
    iosArm64()
    iosSimulatorArm64()
    
    sourceSets {
        val commonMain by getting
        val myCustomIntermediateSourceSet by creating {
            dependsOn(commonMain)
        }
        
        targets["jvm"].compilations["main"].source(myCustomIntermediateSourceSet)
    }
}
```

**What's the best practice now?**

To replace `KotlinCompilation.source(someSourceSet)`, add the  `dependsOn` relation from the
default source set of the `KotlinCompilation` to `someSourceSet`. We recommend referring to the source directly using `by getting`,
which is shorter and more readable. However, you can also use `KotlinCompilation.defaultSourceSet.dependsOn(someSourceSet)`,
which is applicable in all cases.

You can change the code above in one of the following ways:

```kotlin
kotlin {
    jvm()
    js()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting
        val myCustomIntermediateSourceSet by creating {
            dependsOn(commonMain)
        }
        
        // Option #1. Shorter and more readable, use it when possible. 
        // Usually, the name of the default source set 
        // is a simple concatenation of the target name and the compilation name:
        val jvmMain by getting {
            dependsOn(myCustomIntermediateSourceSet)
        }
        
        // Option #2. Generic solution, use it if your build script requires a more advanced approach:
        targets["jvm"].compilations["main"].defaultSourceSet.dependsOn(myCustomIntermediateSourceSet)
    }
}
```

**When do the changes take effect?**

Here's the planned deprecation cycle:

* 1.9.0: introduce a deprecation warning when `KotlinComplation.source` is used
* 1.9.20: raise this warning to an error
* &gt;1.9.20: remove `KotlinComplation.source` from the Kotlin Gradle plugin, attempts to use it lead to "unresolved
  reference" errors during the buildscript compilation

<anchor name="kotlin-js-plugin-deprecation"/>
### Migration from `kotlin-js` Gradle plugin to `kotlin-multiplatform` Gradle plugin {initial-collapse-state="collapsed" collapsible="true"}

**What's changed?**

Starting with Kotlin 1.9.0, the `kotlin-js` Gradle plugin is
deprecated. Basically, it duplicated the functionality of the `kotlin-multiplatform` plugin with the `js()` target
and shared the same implementation under the hood. Such overlap created confusion and increased maintenance
load on the Kotlin team. We encourage you to migrate to the `kotlin-multiplatform` Gradle plugin with the `js()` target instead.

**What's the best practice now?**

1. Remove the `kotlin-js` Gradle plugin from your project and apply `kotlin-multiplatform` in the `settings.gradle.kts` file
   if you're using the `pluginManagement {}` block:

   <tabs>
   <tab title="kotlin-js">

   ```kotlin
   // settings.gradle.kts:
   pluginManagement {
       plugins {
           // Remove the following line:
           kotlin("js") version "1.9.0"
       }
       
       repositories {
           // ...
       }
   }
   ```

   </tab>
   <tab title="kotlin-multiplatform">

   ```kotlin
   // settings.gradle.kts:
   pluginManagement {
       plugins {
           // Add the following line instead:
           kotlin("multiplatform") version "1.9.0"
       }
       
       repositories {
           // ...
       }
   }
   ```

   </tab>
   </tabs>

   In case you're using a different way of applying plugins,
   see [the Gradle documentation](https://docs.gradle.org/current/userguide/plugins.html) for migration instructions.

2. Move your source files from the `main` and `test` folders to the `jsMain` and `jsTest` folders in the same directory.
3. Adjust dependency declarations:

   * We recommend using the `sourceSets {}` block and configuring dependencies of respective source sets,
     `jsMain {}` for production dependencies and `jsTest {}` for test dependencies.
     See [Adding dependencies](multiplatform-add-dependencies.md) for more details.
   * However, if you want to declare your dependencies in a top-level block,
     change declarations from `api("group:artifact:1.0")` to `add("jsMainApi", "group:artifact:1.0")` and so on.

     > In this case, make sure that the top-level `dependencies {}` block comes **after** the `kotlin {}` block. Otherwise, you'll get an error "Configuration not found".
     >
     {style="note"}

   You can change the code in your `build.gradle.kts` file in one of the following ways:

   <tabs>
   <tab title="kotlin-js">

   ```kotlin
   // build.gradle.kts:
   plugins {
       kotlin("js") version "1.9.0"
   }
   
   dependencies {
       testImplementation(kotlin("test"))
       implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
   }
   
   kotlin {
       js {
           // ...
       }
   }
   ```

   </tab>
   <tab title="kotlin-multiplatform">

   ```kotlin
   // build.gradle.kts:
   plugins {
       kotlin("multiplatform") version "1.9.0"
   }
   
   kotlin {
       js {
           // ...
       }
       
       // Option #1. Declare dependencies in the sourceSets {} block:
       sourceSets {
           val jsMain by getting {
               dependencies {
                   // No need for the js prefix here, you can just copy and paste it from the top-level block
                   implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
               }
          }
       }
   }
   
   dependencies {
       // Option #2. Add the js prefix to the dependency declaration:
       add("jsTestImplementation", kotlin("test"))
   }
   ```

   </tab>
   </tabs>

4. The DSL provided by the Kotlin Gradle plugin inside the `kotlin {}` block remains unchanged in most cases. However,
   if you were referring to low-level Gradle entities, like tasks and configurations, by names, you now need to adjust them,
   usually by adding the `js` prefix. For example, you can find the `browserTest` task under the name `jsBrowserTest`.

**When do the changes take effect?**

In 1.9.0, the use of the `kotlin-js` Gradle plugin produces a deprecation warning.

<anchor name="jvmWithJava-preset-deprecation"/>
### Deprecated `jvmWithJava` preset {initial-collapse-state="collapsed" collapsible="true"}

**What's changed?**

`targetPresets.jvmWithJava` is deprecated, and its usage is discouraged.

**What's the best practice now?**

Use `jvm { withJava() }` target instead. Note that after switching to `jvm { withJava() }`, you'll need to adjust
the paths to source directories with `.java` sources.

For example, if you use a `jvm` target with the default name "jvm":

| Before          | Now                |
|-----------------|--------------------|
| `src/main/java` | `src/jvmMain/java` |
| `src/test/java` | `src/jvmTest/java` |

**When do the changes take effect?**

Here's the planned deprecation cycle:

* 1.3.40: introduce a warning when `targetPresets.jvmWithJava` is used
* 1.9.20: raise this warning to an error
* >1.9.20: remove `targetPresets.jvmWithJava` API; attempts to use it lead to the buildscript compilation failure

> Even though the whole `targetPresets` API is deprecated, the `jvmWithJava` preset has a different deprecation timeline.
>
{style="note"}

<anchor name="android-sourceset-layout-v1-deprecation"/>
### Deprecated legacy Android source set layout {initial-collapse-state="collapsed" collapsible="true"}

**What's changed?**

The [new Android source set layout](multiplatform-android-layout.md) is used by default since Kotlin 1.9.0.
Support for the legacy layout is deprecated, and the use of the `kotlin.mpp.androidSourceSetLayoutVersion` Gradle property
now triggers a deprecation diagnostic.

**When do the changes take effect?**

Here's the planned deprecation cycle:

* <=1.9.0: report a warning when `kotlin.mpp.androidSourceSetLayoutVersion=1` is used; the warning can be suppressed with
  `kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true` Gradle property
* 1.9.20: raise this warning to an error; the error **cannot** be suppressed
* &gt;1.9.20: remove support for `kotlin.mpp.androidSourceSetLayoutVersion=1`; the Kotlin Gradle plugin ignores the property

<anchor name="common-sourceset-with-dependson-deprecation"/>
### Deprecated `commonMain` and `commonTest` with custom `dependsOn` {initial-collapse-state="collapsed" collapsible="true"}

**What's changed?**

The `commonMain` and `commonTest` source sets usually represent the roots of the `main` and `test` source set hierarchies,
respectively. However, it was possible to override that by manually configuring `dependsOn` relations of these source sets.

Maintaining such configuration requires extra effort and knowledge about multiplatform build internals. Additionally,
it decreases code readability and reusability of the code because you need to read the particular buildscript
to be sure whether `commonMain` is the root of the `main` source set hierarchy.

Therefore, accessing `dependsOn` on `commonMain` and `commonTest` is now deprecated.

**What's the best practice now?**

Suppose you need to migrate to 1.9.20 the `customCommonMain` source set that uses `commonMain.dependsOn(customCommonMain)`.
In most cases, `customCommonMain` participates in the same compilations as `commonMain`, so you can merge
`customCommonMain` into `commonMain`:

1. Copy sources of `customCommonMain` into `commonMain`.
2. Add all dependencies of `customCommonMain` to `commonMain`.
3. Add all compiler option settings of `customCommonMain` to `commonMain`.

In rare cases, `customCommonMain` might be participating in more compilations than `commonMain`.
Such a configuration requires additional low-level configuration of the build script. If you're not sure if that's your
use case, it most likely isn't.

If it is your use case, "swap" these two source sets by moving the sources and settings of `customCommonMain`
to `commonMain` and vice versa.

**When do the changes take effect?**

Here's the planned deprecation cycle:

* 1.9.0: report a warning when `dependsOn` is used in `commonMain`
* &gt;=1.9.20: report an error when `dependsOn` is used in `commonMain` or `commonTest`

### New approach to forward declarations {initial-collapse-state="collapsed" collapsible="true"}

**What's changed?**

The JetBrains team has revamped the approach to forward declarations in Kotlin to make their behavior more predictable:

* You can only import forward declarations using the `cnames` or ` objcnames` packages.
* You need to explicitly make a cast to and from the corresponding C and Objective-C forward declaration.

**What's the best practice now?**

* Consider a C library with a `library.package` that declares a `cstructName` forward declaration.
  Previously, it was possible to import it directly from the library with `import library.package.cstructName`.
  Now, you can only use a special forward declaration package for that: `import cnames.structs.cstructName`.
  The same is true for `objcnames`.

* Consider two objcinterop libraries: one that uses `objcnames.protocols.ForwardDeclaredProtocolProtocol` and another
  that has an actual definition:

  ```ObjC
  // First objcinterop library
  #import <Foundation/Foundation.h>
  
  @protocol ForwardDeclaredProtocol;
  
  NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
      return [NSString stringWithUTF8String:"Protocol"];
  }
  ```

  ```ObjC
  // Second objcinterop library
  // Header:
  #import <Foundation/Foundation.h>
  @protocol ForwardDeclaredProtocol
  @end
  // Implementation:
  @interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
  @end

  id<ForwardDeclaredProtocol> produceProtocol() {
      return [ForwardDeclaredProtocolImpl new];
  }
  ```

  Previously, it was possible to transfer objects between them seamlessly. Now, an explicit `as` cast is required
  for the forward declaration:

  ```kotlin
  // Kotlin code:
  fun test() {
      consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
  }
  ```

  > You can only cast to `objcnames.protocols.ForwardDeclaredProtocolProtocol` from the corresponding real class.
  > Otherwise, you'll get an error.
  >
  {style="note"}

**When do the changes take effect?**

Starting with Kotlin 1.9.20, you need to explicitly make a cast to and from the corresponding C and Objective-C forward
declarations. Also, it's now only possible to import forward declarations by using special packages.

## Kotlin 1.7.0−1.8.22

This section covers incompatible changes that end their deprecation cycle and come into effect in Kotlin 1.7.0−1.8.22.

<anchor name="deprecated-compatibility-with-kmp-gradle-plugin-and-gradle-java-plugins"/>
### Deprecated compatibility with Kotlin Multiplatform Gradle plugin and Gradle Java plugins {initial-collapse-state="collapsed" collapsible="true"}

**What's changed?**

Due to compatibility issues between the Kotlin Multiplatform Gradle plugin and the Gradle plugins
[Java](https://docs.gradle.org/current/userguide/java_plugin.html),
[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html),
and [Application](https://docs.gradle.org/current/userguide/application_plugin.html),
there is now a deprecation warning when you apply these plugins to the same project. The warning also appears when another
Gradle plugin in your multiplatform project applies a Gradle Java plugin. For example, the [Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html)
automatically applies the Application plugin.
In future Kotlin releases, the warning will be increased to an error.

We've added this deprecation warning due to fundamental compatibility issues between Kotlin Multiplatform's project model
and Gradle's Java ecosystem plugins. Gradle's Java ecosystem plugins currently don't take into account that other plugins may:

* Also publish or compile for the JVM target in a different way than the Java ecosystem plugins.
* Have two different JVM targets in the same project, such as JVM and Android.
* Have a complex multiplatform project structure with potentially multiple non-JVM targets.

Unfortunately, Gradle doesn't currently provide any API to address these issues.

We previously used some workarounds in Kotlin Multiplatform to help with the integration of Java ecosystem plugins.
However, these workarounds never truly solved the compatibility issues, and since the release of Gradle 8.8, these workarounds
are no longer possible. For more information, see our [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning).

While we don't yet know exactly how to resolve this compatibility problem, we are committed to continuing support for
some form of Java source compilation in your Kotlin Multiplatform projects. At a minimum, we will support the compilation
of Java sources and using Gradle's [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) plugin within your multiplatform projects.

**What's the best practice now?**

If you see this deprecation warning in your multiplatform project, we recommend that you:
1. Determine whether you actually need the Gradle Java plugin in your project. If not, consider removing it.
2. Check if the Gradle Java plugin is only used for a single task. If so, you might be able to remove the plugin without
   much effort. For example, if the task uses a Gradle Java plugin to create a Javadoc JAR file, you can define the Javadoc
   task manually instead.

Otherwise, if you want to use both the Kotlin Multiplatform Gradle plugin and these Gradle plugins for Java in your multiplatform
project, we recommend that you:

1. Create a separate subproject in your Gradle project.
2. In the separate subproject, apply the Gradle plugin for Java.
3. In the separate subproject, add a dependency on your parent multiplatform project.

> The separate subproject must **not** be a multiplatform project, and you must only use it to set up a dependency on your multiplatform project.
>
{style="warning"}

For example, you have a multiplatform project called `my-main-project` and you want
to use the [Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) Gradle plugin.

Once you've created a subproject, let's call it `subproject-A`, your parent project structure should look like this:

```text
.
├── build.gradle
├── settings.gradle.kts
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

In your subproject's `build.gradle.kts` file, apply the Java Library plugin in the `plugins {}` block:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("java-library")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id('java-library')
}
```

</tab>
</tabs>

In your subproject's `build.gradle.kts` file, add a dependency on your parent multiplatform project:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // The name of your parent multiplatform project
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // The name of your parent multiplatform project
}
```

</tab>
</tabs>


Your parent project is now set up to work with both plugins.

### New approach to auto-generated targets {initial-collapse-state="collapsed" collapsible="true"}

**What's changed?**

Target accessors auto-generated by Gradle are no longer available inside the `kotlin.targets {}` block. Use
the `findByName("targetName")` method instead.

Note that such accessors are still available in the `kotlin.targets {}` case, for example, `kotlin.targets.linuxX64`.

**What's the best practice now?**

<table>
    <tr>
        <td>Before</td>
        <td>Now</td>
    </tr>
    <tr>
<td>

```kotlin
kotlin {
    targets {
        configure(['windows',
            'linux']) {
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    targets {
        configure([findByName('windows'),
            findByName('linux')]) {
        }
    }
}
```

</td>
    </tr>
</table>

**When do the changes take effect?**

In Kotlin 1.7.20, an error is introduced when using target accessors in the `kotlin.targets {}` block.

For more information, see the [corresponding issue in YouTrack](https://youtrack.jetbrains.com/issue/KT-47047).

### Changes in Gradle input and output compile tasks {initial-collapse-state="collapsed" collapsible="true"}

**What's changed?**

Kotlin compile tasks no longer inherit the Gradle `AbstractCompile` task that has the `sourceCompatibility` and
`targetCompatibility` inputs, making them unavailable in Kotlin users' scripts.

Other breaking changes in compile tasks:

**What's the best practice now?**

| Before                                                              | Now                                                                                                            |
|---------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| The `SourceTask.stableSources` input is no longer available.        | Use the `sources` input instead. Also, the `setSource()` methods are still available.                          |
| The `sourceFilesExtensions` input was removed.                      | Compile tasks still implement the `PatternFilterable` interface. Use its methods for filtering Kotlin sources. |
| The `Gradle destinationDir: File` output was deprecated.            | Use the `destinationDirectory: DirectoryProperty` output instead.                                              |
| The `classpath` property of the `KotlinCompile` task is deprecated. | All compile tasks now use the `libraries` input for a list of libraries required for compilation.              |

**When do the changes take effect?**

In Kotlin 1.7.20, inputs are not available, the output is replaced, and the `classpath` property is deprecated.

For more information, see the [corresponding issue in YouTrack](https://youtrack.jetbrains.com/issue/KT-32805).

### New configuration names for dependencies on the compilation {initial-collapse-state="collapsed" collapsible="true"}

**What's changed?**

Compilation configurations created by the Kotlin Multiplatform Gradle Plugin received new names.

A target in the Kotlin Multiplatform project has two default compilations, `main` and `test`. Each of these compilations
has its own default source set, for example, `jvmMain` and `jvmTest`. Previously the configuration names for the test
compilation and its default source set were the same, which might lead to a name clash resulting in issues when a
configuration marked with platform-specific attributes is included in another configuration.

Now compilation configurations have an extra `Compilation` postfix, while projects and plugins that use old hard-coded
configuration names no longer compile.

Configuration names for dependencies on the corresponding source set stay the same.

**What's the best practice now?**

<table>
    <tr>
        <td></td>
        <td>Before</td>
        <td>Now</td>
    </tr>
    <tr>
        <td rowspan="2">Dependencies of the <code>jvmMain</code> compilation</td>
<td>

```kotlin
jvm<Scope>
```

</td>
<td>

```kotlin
jvmCompilation<Scope>
```

</td>
    </tr>
    <tr>
<td>

```kotlin
dependencies {
    add("jvmImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
<td>

```kotlin
dependencies {
    add("jvmCompilationImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
    </tr>
    <tr>
        <td>Dependencies of the <code>jvmMain</code> source set</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```

</td>
    </tr>
    <tr>
        <td>Dependencies of the <code>jvmTest</code> compilation</td>
<td>

```kotlin
jvmTest<Scope>
```

</td>
<td>

```kotlin
jvmTestCompilation<Scope>
```

</td>
    </tr>
    <tr>
        <td>Dependencies of the <code>jvmTest</code> source set</td>
<td colspan="2">

```kotlin
jvmTest<Scope>
```

</td>
    </tr>
</table>

The available scopes are `Api`, `Implementation`, `CompileOnly`, and `RuntimeOnly`.

**When do the changes take effect?**

In Kotlin 1.8.0, an error is introduced when using old configuration names in hard-coded strings.

For more information, see the [corresponding issue in YouTrack](https://youtrack.jetbrains.com/issue/KT-35916/).
