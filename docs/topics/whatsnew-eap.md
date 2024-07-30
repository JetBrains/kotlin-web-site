[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release, 
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{type="note"}

The Kotlin %kotlinEapVersion% release is out!
Here are some details of this EAP release:

* [Language: Data class copy function to have the same visibility as constructor](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
* [Kotlin Multiplatform: Static accessors for source sets from the default target hierarchy](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
* [Kotlin Multiplatform: Deprecated compatibility with Gradle Java plugins](#deprecated-compatibility-with-gradle-java-plugins)
* [Kotlin/Native: Concurrent marking in garbage collector](#concurrent-marking-in-garbage-collector)
* [Kotlin/Native: Support for bitcode embedding removed](#support-for-bitcode-embedding-removed)
* [Kotlin/Wasm: Error in default export usage](#error-in-default-export-usage)
* [Kotlin/Wasm: New location of ExperimentalWasmDsl annotation](#new-location-of-experimentalwasmdsl-annotation)
* [Gradle improvements: Support for versions 8.6–8.8](#gradle-support-for-versions-8-6-8-8)
* [Gradle improvements: Deprecated incremental compilation based on JVM history files](#deprecated-incremental-compilation-based-on-jvm-history-files)
* [Gradle improvements: Added task dependency for a rare case when compile task is missing one on an artifact](#added-task-dependency-for-a-rare-case-when-compile-task-is-missing-one-on-an-artifact)

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest IntelliJ IDEA and Android Studio. 
You don't need to update the Kotlin plugin in your IDE. 
All you need to do is to [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-release) for details.

## Language

### Data class copy function to have the same visibility as constructor

Currently, if you create a data class using a `private` constructor, 
the automatically generated `.copy()` function doesn't have the same visibility. 
This can cause problems later in your code. 
In future Kotlin releases, we will introduce the behavior that the default visibility of the `.copy()` function is the same as the constructor.
This change will be introduced gradually to help you migrate your code as smoothly as possible.

Our migration plan starts with Kotlin %kotlinEapVersion%, 
where we issue warnings in your code where the visibility will change in the future. 
For example:

```kotlin
// Triggers a warning in %kotlinEapVersion%
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // Triggers a warning in %kotlinEapVersion%
    val negativeNumber = positiveNumber.copy(number = -1)
    // warning: non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // The generated 'copy()' will change its visibility in future releases.
}
```

For the latest information about our migration plan,
see the corresponding issue in [YouTrack](https://youtrack.jetbrains.com/issue/KT-11914).

To give you more control over this behavior, in Kotlin %kotlinEapVersion% we’ve introduced two annotations:

* `@ConsistentCopyVisibility` to opt in to the behavior now before we make it the default in a later release.
* `@ExposedCopyVisibility` to opt out of the behavior and suppress warnings at the declaration site. 
Note that even with this annotation, the compiler still reports warnings when the `.copy()` function is called.

If you want to opt in to the new behavior already in %kotlinEapVersion% for a whole module rather than in individual classes,
you can use the `-Xconsistent-data-class-copy-visibility` compiler option.
This option has the same effect as adding the `@ConsistentCopyVisibility` annotation to all data classes in a module.

### Phased removal of context receivers feature

In Kotlin 1.6.20, we introduced [context receivers](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm) 
as an [Experimental](components-stability.html#stability-levels-explained) feature.
After listening to community feedback, we've decided not to continue with it.
Instead, we plan to introduce a replacement in future Kotlin releases: context parameters.
You can find the proposal for context parameters in the [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md).

Although context receivers have always been an Experimental feature, 
we know they are already used by a large number of developers. So we will remove support for context receivers gradually.

Our migration plan starts with Kotlin %kotlinEapVersion%, 
where we issue warnings in your code where context receivers are used when you use the `-Xcontext-receivers` compiler option. 
For example:

```kotlin
class MyContext

context(MyContext)
// warning: experimental context receivers are deprecated and will be superseded by context parameters. 
// Please don't use context receivers. You can either pass parameters explicitly or use members with extensions.
fun someFunction() {
}
```

This warning will become an error in future Kotlin releases.

If you use context receivers in your code, we recommend that you migrate your code to use either:

* Explicit parameters.

   <table header-style="top">
      <tr>
          <td>Before</td>
          <td>After</td>
      </tr>
      <tr>
   <td>

   ```kotlin
   context(ContextReceiverType)
   fun someFunction() {
       contextReceiverMember()
   }
   ```
   
   </td>
   <td>
   
   ```kotlin
   fun someFunction(explicitContext: ContextReceiverType) {
       explicitContext.contextReceiverMember()
   }
   ```
   
   </td>
   </tr>
   </table>

* Extension member functions, if possible.

   <table header-style="top">
      <tr>
          <td>Before</td>
          <td>After</td>
      </tr>
      <tr>
   <td>
   
   ```kotlin
   context(ContextReceiverType)
   fun contextReceiverMember() = TODO()
   
   context(ContextReceiverType)
   fun someFunction() {
       contextReceiverMember()
   }
   ```
   
   </td>
   <td>
   
   ```kotlin
   class ContextReceiverType {
       fun contextReceiverMember() = TODO()
   }
   
   fun ContextReceiverType.someFunction() {
       contextReceiverMember()
   }
   ```
   
   </td>
   </tr>
   </table>

## Kotlin Multiplatform

### Static accessors for source sets from the default target hierarchy

Since Kotlin 1.9.20, the [default hierarchy template](multiplatform-hierarchy.md#default-hierarchy-template) 
is automatically applied to all Kotlin Multiplatform projects. 
And for all of the source sets from the default hierarchy template, the Kotlin Gradle plugin provided type-safe accessors.
That way you could finally access source sets for all the specified targets without having to use `by getting` or `by creating` constructions.

Kotlin 2.0.20 aims to improve your IDE experience even further. It now provides static assessors in 
the `sourceSets {}` block for all the source sets from the default hierarchy template. 
We believe this change will make accessing source sets by name easier and more predictable.

Each such source set now has a detailed KDoc comment with a sample and a diagnostic message with a warning 
in case you try to access the source set without declaring the corresponding target first:

```kotlin
kotlin {
    jvm()
    linuxX64()
    linuxArm64()
    mingwX64()
  
    sourceSets {
        commonMain.languageSettings {
            progressiveMode = true
        }


        jvmMain { }
        linuxX64Main { }
        linuxArm64Main { }
        iosX64Main { } // Warning: accessing source set
                       // without registering the target
    }
}
```

![Accessing the source sets by name](accessing-sourse-sets.png){width=700}

Learn more about the [hierarchical project structure in Kotlin Multiplatform](multiplatform-hierarchy.md).

### Deprecated compatibility with Gradle Java plugins

Due to compatibility issues between the Kotlin Multiplatform Gradle plugin and the Gradle plugins 
[Java](https://docs.gradle.org/current/userguide/java_plugin.html), 
[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html), 
and [Application](https://docs.gradle.org/current/userguide/application_plugin.html), 
Kotlin %kotlinEapVersion% introduces a deprecation warning when you apply these plugins in the same project.
In future Kotlin releases, the warning will be increased to an error.

If you want to use both the Kotlin Multiplatform Gradle plugin in combination with these Gradle plugins for Java in your multiplatform project, 
we recommend that you:

1. Create a separate subproject in your multiplatform project.
2. In your subproject, apply the Gradle plugin for Java.
3. In your subproject, add a dependency on your parent multiplatform project.

> Your subproject must **not** be a multiplatform project, and you must only use it to set up a dependency on your multiplatform project.
>
{type="warning"}

For example, you have a multiplatform project called `my-main-project` and you want 
to use the [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle plugin to run a JVM application.

Once you've created a subproject, let's call it `subproject-A`, your parent project structure should look like this:

```text
.
├── build.gradle
├── settings.gradle
├── subproject-A
    └── build.gradle
    └── src
        └── Main.java
```

In your subproject's `build.gradle.kts` file, apply the Application plugin in the `plugins {}` block:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("application")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id('application')
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

## Kotlin/Native

### Concurrent marking in garbage collector

In Kotlin %kotlinEapVersion%, the JetBrains team takes another step toward improving Kotlin/Native runtime performance.
We add experimental support for concurrent marking in the garbage collector (GC).

By default, application threads must be paused when GC is marking objects in the heap. 
This greatly affects the duration of the GC pause time,
which is important for the performance of latency-critical applications,
such as UI applications built with Compose Multiplatform.

Now, the marking phase of the garbage collection can be run simultaneously with application threads.
This should significantly shorten the GC pause time and help improve app responsiveness.

#### How to enable

The feature is currently [Experimental](components-stability.md#stability-levels-explained). 
To enable it, set the following option in your `gradle.properties` file:

```none
kotlin.native.binary.gc=cms
```

Please report any problems to our issue tracker [YouTrack](https://kotl.in/issue).

### Support for bitcode embedding removed

Starting with Kotlin %kotlinEapVersion%, the Kotlin/Native compiler no longer supports bitcode embedding.
Bitcode embedding was deprecated in Xcode 14 and removed in Xcode 15 for all Apple targets.

Now, the `embedBitcode` parameter for the framework configuration, 
as well as the `-Xembed-bitcode` and `-Xembed-bitcode-marker` command line arguments are deprecated.

If you still use earlier versions of Xcode but want to upgrade to %kotlinEapVersion%, 
disable bitcode embedding in your Xcode projects.

### Changes to monitoring GC performance with signposts

Kotlin %kotlinEapVersion% made it possible to monitor the performance of Kotlin/Native garbage collector 
(GC) through Xcode Instruments. Instruments include the signposts tool, which can show GC pauses as events. 
This comes in handy when checking GC-related freezes in your iOS apps.

The feature was enabled by default, but unfortunately, 
it sometimes led to crashes when the application was run simultaneously with Xcode Instruments. 
Starting with %kotlinEapVersion%, it requires an explicit opt-in with the following compilation option:

```none
-Xbinary=enableSafepointSignposts=true
```

## Kotlin/Wasm

### Error in default export usage

As part of the migration towards named exports, 
a warning message was previously printed to the console when using a default import for Kotlin/Wasm exports in JavaScript.

To fully support named exports, this warning has now upgraded to an error. 
If you use a default import, you encounter the following error message:

```text
Do not use default import. Use the corresponding named import instead.
```

This change is part of a deprecation cycle to migrate towards named exports. Here's what you can expect during each phase:

* **In version 2.0.0**: a warning message is printed to the console, explaining that exporting entities via default exports is deprecated.
* **In version 2.0.20**: an error occurs, requesting the use of the corresponding named import.
* **In version 2.1.0**: the use of default imports is completely removed.

### New location of ExperimentalWasmDsl annotation

Previously, the `@ExperimentalWasmDsl` annotation for WebAssembly (Wasm) 
features was placed in this location within the Kotlin Gradle plugin:

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

In %kotlinEapVersion%, the `@ExperimentalWasmDsl` annotation has been relocated to:

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

The previous location is now deprecated and might lead to build failures with unresolved references.

To reflect the new location of the `@ExperimentalWasmDsl` annotation, 
update the import statement in your Gradle build scripts. 
Use an explicit import for the new `@ExperimentalWasmDsl` location:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

Alternatively, remove this star import statement from the old package:

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Gradle improvements

### Gradle support for versions 8.6–8.8

Kotlin %kotlinEapVersion% is fully compatible with Gradle 6.8.3 through 8.6. 
Gradle 8.7 and 8.8 are also supported, with only one exception: if you use the Kotlin Multiplatform Gradle plugin, 
you may see deprecation warnings in your multiplatform projects
if you use the [`withJava()` function in the JVM target](multiplatform-dsl-reference.md#jvm-targets). 
We plan to fix this issue as soon as possible. 

For more information, see the issue in [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning).

### Deprecated incremental compilation based on JVM history files

In Kotlin %kotlinEapVersion%, the incremental compilation approach based on JVM history files is deprecated in favor of 
the [new incremental compilation approach](gradle-compilation-and-caches.md#a-new-approach-to-incremental-compilation) 
that has been enabled by default since Kotlin 1.8.20.

The incremental compilation approach based on JVM history files suffered from limitations, 
such as not working with [Gradle's build cache](https://docs.gradle.org/current/userguide/build_cache.html) 
and not supporting compilation avoidance. 
In contrast, the new incremental compilation approach overcomes these limitations and has performed well since its introduction.

Given that the new incremental compilation approach has been used by default for the last two major Kotlin releases, 
the `kotlin.incremental.useClasspathSnapshot` Gradle property is deprecated in Kotlin %kotlinEapVersion%.
Therefore, if you use it to opt out, you will see a deprecation warning.

### Added task dependency for a rare case when compile task is missing one on an artifact

Prior to %kotlinEapVersion%, 
we found that there were scenarios where a compile task was missing a task dependency for one of its artifact inputs.
This meant that the result of the dependent compile task was unstable, as sometimes the artifact had been generated in time,
but sometimes it hadn't.

To fix this issue, the Kotlin Gradle plugin now automatically adds the required task dependency in these scenarios.

In very rare cases, we've found that this new behavior can cause a circular dependency error.
For example, if you have multiple compilations where one compilation can see all internal declarations of the other,
and the generated artifact relies on the output of both compilation tasks, you could see an error like:

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

To fix this circular dependency error, we've added a Gradle property: `archivesTaskOutputAsFriendModule`.

By default, this property is set to `true` to track the task dependency. 
To disable the use of the artifact in the compilation task, so that no task dependency is required, 
add the following in your `gradle.properties` file:

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

For more information, see the issue in [YouTrack](https://youtrack.jetbrains.com/issue/KT-69330).

### Option to share JVM artifacts between projects as class files
> This feature is Experimental. It may be dropped or changed at any time. Use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack]()https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts. Opt-in is required (see details below).
>
{type="warning"}

In Kotlin %kotlinEapVersion%, we introduce a new approach that changes the way the outputs of Kotlin/JVM compilations, such as JAR files, are shared between projects. With this approach, Gradle’s `apiElements` configuration now has a secondary variant that provides access to the directory containing compiled `.class` files. When configured, your project uses this directory instead of requesting the compressed JAR artifact during compilation. This reduces the number of times JAR files are compressed and decompressed, especially for incremental builds.

Our testing shows that this new approach can provide build performance improvements for Linux and macOS hosts. However, on Windows hosts, we have seen a degradation in performance due to how Windows handles I/O operations when working with files.

To try this new approach, add the following Gradle property to your `gradle.properties` file:

```none
kotlin.jvm.addClassesVariant=true
```

By default, this property is set to false and the `apiElements` variant in Gradle requests the compressed JAR artifact.

> Gradle has a related property that you can use in your Java-only projects to only expose the  
> compressed JAR artifact during compilation **instead** of the directories containing compiled
> `.class` files:
>
> ```none
> org.gradle.java.compile-classpath-packaging=true
> ```
>
> For more information on this property and its purpose, see Gradle’s documentation on [Significant build performance drop on Windows for huge multi-projects](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance).
>
{type="note"}

We would appreciate your feedback on this new approach. Do you also see performance improvements? Let us know by adding a comment in [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts).

### Compose compiler plugin updates ✅

In %kotlinEapVersion%, the Compose compiler Gradle plugin gets a few improvements.

#### New way to configure compiler options

We have introduced a new option configuration mechanism to avoid churn of top-level parameters: 
it’s harder for the Compose compiler team to test things out 
by creating or removing top-level entries for the `composeCompiler {}` block. 
So options such as strong skipping mode and non-skipping group optimizations are now enabled through the `featureFlags` property.

This property will be used to test new Compose compiler options that will eventually become default.

This change has also been applied to the Compose compiler Gradle plugin. To configure feature flags going forward, use the following syntax (this code will flip all of the default values):

```kotlin
composeCompiler {
         featureFlags = setOf(
               ComposeFeatureFlag.IntrinsicRemember.disabled(),
               ComposeFeatureFlag.OptimizeNonSkippingGroups,
               ComposeFeatureFlag.StrongSkipping.disabled()
         )
}
```

Or, if you are configuring the Compose compiler directly, use the following syntax:

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

The `enableIntrinsicRemember`, `enableNonSkippingGroupOptimization`, and `enableStrongSkippingMode` properties have been therefore deprecated.

We would appreciate any feedback 
you have on this new approach in [YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags).

#### strongSkipping mode enabled by default

Strong skipping mode for the Compose compiler is now enabled by default.

Strong skipping mode is a Compose compiler configuration option that changes the rules for what composables can be skipped. 
With strong skipping mode enabled, composables with unstable parameters can now also be skipped. 
Strong skipping mode also automatically remembers lambdas used in composable functions, 
so you should no longer need to wrap your lambdas with `remember` to avoid recomposition.

For more details, see the [strong skipping mode documentation](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping).

#### Non-skipping group optimizations

This release includes a new compiler option: when enabled, 
non-skippable and non-restartable composable functions will no longer generate a group around the body of the composable. 
This leads to less allocations and thus to improved performance.
This option is experimental and disabled by default but can be enabled with the feature flag `OptimizeNonSkippingGroups` 
as shown [above](#new-way-to-configure-compiler-options).

This feature flag is now ready for wider testing. 
Any issues found when enabling the feature can be filed on the [Google issue tracker](https://goo.gle/compose-feedback).

#### open and abstract Composable functions support default parameters

You can now add default parameters to open and abstract Composable functions.

Previously, the Compose compiler would report an error when attempting to do this even though it is valid Kotlin. 
We have now added support for this in the Compose compiler, and the restriction has been removed.
This is especially useful for including default `Modifier` values:

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

## Compose compiler

### Fixed the unnecessary recompositions issue introduced in 2.0.0

Compose compiler 2.0.0 has an issue with unnecessary (or even endless) recomposition issues on non-JVM targets.
It is strongly recommended to update your Compose apps made for Kotlin 2.0.0 to the 2.0.10 version or newer.

If your app is built with Compose compiler 2.0.10 or newer but uses dependencies built with Compose compiler 2.0.0,
these older dependencies may still cause recomposition issues.
To prevent this, update your dependencies to versions built with the same Compose compiler as your app.

## How to update to Kotlin %kotlinEapVersion%

Starting from IntelliJ IDEA 2023.3 and Android Studio Iguana (2023.2.1) Canary 15, the Kotlin plugin is distributed as a 
bundled plugin included in your IDE. This means that you can't install the plugin from JetBrains Marketplace anymore. 
The bundled plugin supports upcoming Kotlin EAP releases.

To update to the new Kotlin EAP version, [change the Kotlin version](configure-build-for-eap.md#adjust-the-kotlin-version) 
to %kotlinEapVersion% in your build scripts.