[//]: # (title: What's new in Kotlin 1.8.0)

_[Released: 28 December 2022](releases.md#release-details)_

The Kotlin 1.8.0 release is out and here are some of its biggest highlights:

* [New experimental functions for JVM: recursively copy or delete directory content](#recursive-copying-or-deletion-of-directories)
* [Improved kotlin-reflect performance](#improved-kotlin-reflect-performance)
* [New -Xdebug compiler option for better debugging experience](#a-new-compiler-option-for-disabling-optimizations)
* [`kotlin-stdlib-jdk7` and `kotlin-stdlib-jdk8` merged into `kotlin-stdlib`](#updated-jvm-compilation-target)
* [Improved Objective-C/Swift interoperability](#improved-objective-c-swift-interoperability)
* [Compatibility with Gradle 7.3](#gradle)

## IDE support

The Kotlin plugin that supports 1.8.0 is available for:

| IDE            | Supported versions                 |
|----------------|------------------------------------|
| IntelliJ IDEA  | 2021.3, 2022.1, 2022.2             |
| Android Studio | Electric Eel (221), Flamingo (222) |

> You can update your projects to Kotlin 1.8.0 in IntelliJ IDEA 2022.3 without updating the IDE plugin.
>
> To migrate existing projects to Kotlin 1.8.0 in IntelliJ IDEA 2022.3, change the Kotlin version to `1.8.0` and reimport
> your Gradle or Maven project.
>
{type="note"}

## Kotlin/JVM

Starting with version 1.8.0, the compiler can generate classes with a bytecode version corresponding to JVM 19.
The new language version also includes:

* [A compiler option for switching off the generation of JVM annotation targets](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
* [A new `-Xdebug` compiler option for disabling optimizations](#a-new-compiler-option-for-disabling-optimizations)
* [The removal of the old backend](#removal-of-the-old-backend)
* [Support for Lombok's @Builder annotation](#support-for-lombok-s-builder-annotation)

### Ability to not generate TYPE_USE and TYPE_PARAMETER annotation targets

If a Kotlin annotation has `TYPE` among its Kotlin targets, the annotation maps to `java.lang.annotation.ElementType.TYPE_USE`
in its list of Java annotation targets. This is just like how the `TYPE_PARAMETER` Kotlin target maps to
the `java.lang.annotation.ElementType.TYPE_PARAMETER` Java target. This is an issue for Android clients with API levels
less than 26, which don't have these targets in the API.

Starting with Kotlin 1.8.0, you can use the new compiler option `-Xno-new-java-annotation-targets` to avoid generating
the `TYPE_USE` and `TYPE_PARAMETER` annotation targets.

### A new compiler option for disabling optimizations

Kotlin 1.8.0 adds a new `-Xdebug` compiler option, which disables optimizations for a better debugging experience.
For now, the option disables the "was optimized out" feature for coroutines. In the future, after we add more optimizations,
this option will disable them, too.

The "was optimized out" feature optimizes variables when you use suspend functions. However, it is difficult to debug code
with optimized variables because you don't see their values.

> **Never use this option in production**: Disabling this feature via `-Xdebug` can
> [cause memory leaks](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0).
>
{type="warning"}

### Removal of the old backend

In Kotlin 1.5.0, we [announced](whatsnew15.md#stable-jvm-ir-backend) that the IR-based backend became [Stable](components-stability.md).
That meant that the old backend from Kotlin 1.4.* was deprecated. In Kotlin 1.8.0, we've removed the old backend completely.
By extension, we've removed the compiler option `-Xuse-old-backend` and the Gradle `useOldBackend` option.

### Support for Lombok's @Builder annotation

The community has added so many votes for the [Kotlin Lombok: Support generated builders (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959)
YouTrack issue that we just had to support the [@Builder annotation](https://projectlombok.org/features/Builder).

We don't yet have plans to support the `@SuperBuilder` or `@Tolerate` annotations, but we'll reconsider if enough people
vote for the [@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) and
[@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) issues.

[Learn how to configure the Lombok compiler plugin](lombok.md#gradle).

## Kotlin/Native

Kotlin 1.8.0 includes changes to Objective-C and Swift interoperability, support for Xcode 14.1, and improvements to
the CocoaPods Gradle plugin:

* [Support for Xcode 14.1](#support-for-xcode-14-1)
* [Improved Objective-C/Swift interoperability](#improved-objective-c-swift-interoperability)
* [Dynamic frameworks by default in the CocoaPods Gradle plugin](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### Support for Xcode 14.1

The Kotlin/Native compiler now supports the latest stable Xcode version, 14.1. The compatibility improvements include
the following changes:

* There's a new `watchosDeviceArm64` preset for the watchOS target that supports Apple watchOS on ARM64 platforms.
* The Kotlin CocoaPods Gradle plugin no longer has bitcode embedding for Apple frameworks by default.
* Platform libraries were updated to reflect the changes to Objective-C frameworks for Apple targets.

### Improved Objective-C/Swift interoperability

To make Kotlin more interoperable with Objective-C and Swift, three new annotations were added:

* [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/) allows you to specify a more
  idiomatic name in Swift or Objective-C, instead of renaming the Kotlin declaration.

  The annotation instructs the Kotlin compiler to use a custom Objective-C and Swift name for this class, property, parameter, or function:

   ```kotlin
   @ObjCName(swiftName = "MySwiftArray")
   class MyKotlinArray {
       @ObjCName("index")
       fun indexOf(@ObjCName("of") element: String): Int = TODO()
   }

   // Usage with the ObjCName annotations
   let array = MySwiftArray()
   let index = array.index(of: "element")
   ```

* [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/) allows you to hide
  a Kotlin declaration from Objective-C.

  The annotation instructs the Kotlin compiler not to export a function or property to Objective-C and, consequently, Swift.
  This can make your Kotlin code more Objective-C/Swift-friendly.

* [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/) is useful for
  replacing a Kotlin declaration with a wrapper written in Swift.

  The annotation instructs the Kotlin compiler to mark a function or property as `swift_private` in the generated
  Objective-C API. Such declarations get the `__` prefix, which makes them invisible to Swift code.

  You can still use these declarations in your Swift code to create a Swift-friendly API, but they won't be suggested
  by Xcode's autocompletion, for example.

  For more information on refining Objective-C declarations in Swift, see the
  [official Apple documentation](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift).

> The new annotations require [opt-in](opt-in-requirements.md).
>
{type="note"}

The Kotlin team is very grateful to [Rick Clephas](https://github.com/rickclephas) for implementing these annotations.

### Dynamic frameworks by default in the CocoaPods Gradle plugin

Starting with Kotlin 1.8.0, Kotlin frameworks registered by the CocoaPods Gradle plugin are linked dynamically by default.
The previous static implementation was inconsistent with the behavior of the Kotlin Gradle plugin.

```kotlin
kotlin {
    cocoapods {
        framework {
            baseName = "MyFramework"
            isStatic = false // Now dynamic by default
        }
    }
}
```

If you have an existing project with a static linking type and you upgrade to Kotlin 1.8.0 (or change the linking type
explicitly), you may encounter an error with the project's execution. To fix it, close your Xcode project and
run `pod install` in the Podfile directory.

For more information, see the [CocoaPods Gradle plugin DSL reference](native-cocoapods-dsl-reference.md).

## Kotlin Multiplatform: A new Android source set layout

Kotlin 1.8.0 introduces a new Android source set layout that replaces the previous naming schema for directories, which
is confusing in multiple ways.

Consider an example of two `androidTest` directories created in the current layout. One is for `KotlinSourceSets` and
the other is for `AndroidSourceSets`:

* They have different semantics: Kotlin's `androidTest` belongs to the `unitTest` type, whereas Android's belongs to
  the `integrationTest` type.
* They create a confusing `SourceDirectories` layout, as
  `src/androidTest/kotlin` has a `UnitTest` and `src/androidTest/java` has an `InstrumentedTest`.
* Both `KotlinSourceSets` and `AndroidSourceSets` use a similar naming schema for Gradle configurations, so the resulting
  configurations of `androidTest` for both Kotlin's and Android's source sets are the same: `androidTestImplementation`,
  `androidTestApi`, `androidTestRuntimeOnly`, and `androidTestCompileOnly`.

To address these and other existing issues, we've introduced a new Android source set layout.
Here are some of the key differences between the two layouts:

#### KotlinSourceSet naming schema

| Current source set layout              | New source set layout               |
|----------------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` maps to `{KotlinSourceSet.name}` as follows:

|             | Current source set layout | New source set layout          |
|-------------|---------------------------|--------------------------------|
| main        | androidMain               | androidMain                    |
| test        | androidTest               | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test | android<b>Instrumented</b>Test |

#### SourceDirectories

| Current source set layout                               | New source set layout                                                     |
|---------------------------------------------------------|---------------------------------------------------------------------------|
| The layout adds additional `/kotlin` SourceDirectories  | `src/{AndroidSourceSet.name}/kotlin`, `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` maps to `{SourceDirectories included}` as follows:

|             | Current source set layout                                  | New source set layout                                                                          |
|-------------|------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                         |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android<b>Unit</b>Test/kotlin, src/test/kotlin, src/test/java                              |
| androidTest | src/android<b>Android</b>Test/kotlin, src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin, src/androidTest/java, <b>src/androidTest/kotlin</b> |

#### The location of the `AndroidManifest.xml` file

| Current source set layout                              | New source set layout                                 |
|--------------------------------------------------------|-------------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` maps to`{AndroidManifest.xml location}` as follows:

|       | Current source set layout     | New source set layout                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

#### The relation between Android and common tests

The new Android source set layout changes the relation between Android-instrumented tests (renamed to `androidInstrumentedTest` in the new layout)
and common tests.

Previously, there was a default `dependsOn` relation between `androidAndroidTest` and `commonTest`. In practice, it meant the following:

* The code in `commonTest` was available in `androidAndroidTest`.
* `expect` declarations in `commonTest` had to have corresponding `actual` implementations in `androidAndroidTest`.
* Tests declared in `commonTest` were also running as Android instrumented tests.

In the new Android source set layout, the `dependsOn` relation is not added by default. If you prefer the previous behavior,
manually declare this relation in your `build.gradle.kts` file:

```kotlin
kotlin {
// ...
    sourceSets {
        val commonTest by getting
        val androidInstrumentedTest by getting {
            dependsOn(commonTest)
        }
    }
}
```

#### Support for Android flavors

Previously, the Kotlin Gradle plugin eagerly created source sets that correspond to Android source sets with `debug` and
`release` build types or custom flavors like `demo` and `full`.
It made them accessible by constructions like `val androidDebug by getting { ... }`.

In the new Android source set layout, those source sets are created in the `afterEvaluate` phase. It makes such expressions invalid,
leading to errors like `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found`.

To work around that, use the new `invokeWhenCreated()` API in your `build.gradle.kts` file:

```kotlin
kotlin {
// ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### Configuration and setup

The new layout will become the default in future releases. You can enable it now with the following Gradle option:

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

> The new layout requires Android Gradle plugin 7.0 or later and is supported in Android Studio 2022.3 and later.
>
{type="note"}

The usage of the previous Android-style directories is now discouraged. Kotlin 1.8.0 marks the start of the deprecation
cycle, introducing a warning for the current layout. You can suppress the warning with the following Gradle property:

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0 stabilizes the JS IR compiler backend and brings new features to JavaScript-related Gradle build scripts:
* [Stable JS IR compiler backend](#stable-js-ir-compiler-backend)
* [New settings for reporting that yarn.lock has been updated](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
* [Add test targets for browsers via Gradle properties](#add-test-targets-for-browsers-via-gradle-properties)
* [New approach to adding CSS support to your project](#new-approach-to-adding-css-support-to-your-project)

### Stable JS IR compiler backend

Starting with this release, the [Kotlin/JS intermediate representation (IR-based) compiler](js-ir-compiler.md) backend is
Stable. It took a while to unify infrastructure for all three backends, but they now work with the same IR for Kotlin code.

As a consequence of the stable JS IR compiler backend, the old one is deprecated from now on.

Incremental compilation is enabled by default along with the stable JS IR compiler.

If you still use the old compiler, switch your project to the new backend with the help of our [migration guide](js-ir-migration.md).

### New settings for reporting that yarn.lock has been updated

If you use the `yarn` package manager, there are three new special Gradle settings that could notify you if the `yarn.lock`
file has been updated. You can use these settings when you want to be notified if `yarn.lock` has been changed silently
during the CI build process.

These three new Gradle properties are:

* `YarnLockMismatchReport`, which specifies how changes to the `yarn.lock` file are reported. You can use one of the
  following values:
    * `FAIL` fails the corresponding Gradle task. This is the default.
    * `WARNING` writes the information about changes in the warning log.
    * `NONE` disables reporting.
* `reportNewYarnLock`, which reports about the recently created `yarn.lock` file explicitly. By default, this option is
  disabled: it's a common practice to generate a new `yarn.lock` file at the first start. You can use this option to
  ensure that the file has been committed to your repository.
* `yarnLockAutoReplace`, which replaces `yarn.lock` automatically every time the Gradle task is run.

To use these options, update your build script file `build.gradle.kts` as follows:

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) {
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
}
```

### Add test targets for browsers via Gradle properties

Starting with Kotlin 1.8.0, you can set test targets for different browsers right in the Gradle properties file. Doing so
shrinks the size of the build script file as you no longer need to write all targets in `build.gradle.kts`.

You can use this property to define a list of browsers for all modules, and then add specific browsers in the build
scripts of particular modules.

For example, the following line in your Gradle property file will run the test in Firefox and Safari for all modules:

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

See the full list of [available values for the property on GitHub](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106).

The Kotlin team is very grateful to [Martynas Petuška](https://github.com/mpetuska) for implementing this feature.

### New approach to adding CSS support to your project

This release provides a new approach to adding CSS support to your project. We assume that this will affect a lot of projects,
so don't forget to update your Gradle build script files as described below.

Before Kotlin 1.8.0, the `cssSupport.enabled` property was used to add CSS support:

```kotlin
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
}
```

Now you should use the `enabled.set()` method in the `cssSupport {}` block:

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

## Gradle

Kotlin 1.8.0 **fully** supports Gradle versions 7.2 and 7.3. You can also use Gradle versions up to the latest Gradle release,
but if you do, keep in mind that you might encounter deprecation warnings or some new Gradle features might not work.

This version brings lots of changes:
* [Exposing Kotlin compiler options as Gradle lazy properties](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
* [Bumping the minimum supported versions](#bumping-the-minimum-supported-versions)
* [Ability to disable the Kotlin daemon fallback strategy](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
* [Usage of the latest kotlin-stdlib version in transitive dependencies](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
* [Obligatory check for JVM target compatibility equality of related Kotlin and Java compile tasks](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
* [Resolution of Kotlin Gradle plugins' transitive dependencies](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
* [Deprecations and removals](#deprecations-and-removals)

### Exposing Kotlin compiler options as Gradle lazy properties

To expose available Kotlin compiler options as [Gradle lazy properties](https://docs.gradle.org/current/userguide/lazy_configuration.html)
and to integrate them better into the Kotlin tasks, we made lots of changes:

* Compile tasks have the new `compilerOptions` input, which is similar to the existing `kotlinOptions` but uses
  [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html) from the Gradle Properties
  API as the return type:

  ```kotlin
  tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
      compilerOptions {
          useK2.set(true)
      }
  }
  ```

* The Kotlin tools tasks `KotlinJsDce` and `KotlinNativeLink` have the new `toolOptions` input, which is similar to the
  existing `kotlinOptions` input.
* New inputs have the [`@Nested` Gradle annotation](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html).
  Every property inside the inputs has a related Gradle annotation, such as
  [`@Input` or `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks).
* The Kotlin Gradle plugin API artifact has two new interfaces:
    * `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`, which has the `compilerOptions` input and the `compileOptions()`
      method. All Kotlin compilation tasks implement this interface.
    * `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`, which has the `toolOptions` input and the `toolOptions()` method.
      All Kotlin tool tasks – `KotlinJsDce`, `KotlinNativeLink`, and `KotlinNativeLinkArtifactTask` – implement this interface.
* Some `compilerOptions` use the new types instead of the `String` type:
    * [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    * [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)
      (for the `apiVersion` and the `languageVersion` inputs)
    * [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    * [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    * [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

  For example, you can use `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` instead of `kotlinOptions.jvmTarget = "11"`.

  The `kotlinOptions` types didn't change, and they are internally converted to `compilerOptions` types.
* The Kotlin Gradle plugin API is binary-compatible with previous releases. There are, however, some source and ABI-breaking changes in the `kotlin-gradle-plugin` artifact. Most of these changes involve additional generic parameters to some internal types. One important change is that the `KotlinNativeLink` task no longer inherits the `AbstractKotlinNativeCompile` task.
* `KotlinJsCompilerOptions.outputFile` and the related `KotlinJsOptions.outputFile` options are deprecated. Use the `Kotlin2JsCompile.outputFileProperty` task input instead.

> The Kotlin Gradle plugin still adds the `KotlinJvmOptions` DSL to the Android extension:
>
> ```kotlin
> android { 
>     kotlinOptions {
>         jvmTarget = "11"
>     }
> }
> ```
>
> This will be changed in the scope of [this issue](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options),
> when the `compilerOptions` DSL will be added to a module level.
>
{type="note"}

#### Limitations

> The `kotlinOptions` task input and the `kotlinOptions{...}` task DSL are in support mode and will be deprecated in
> upcoming releases. Improvements will be made only to `compilerOptions` and `toolOptions`.
>
{type="warning"}

Calling any setter or getter on `kotlinOptions` delegates to the related property in the `compilerOptions`.
This introduces the following limitations:
* `compilerOptions` and `kotlinOptions` cannot be changed in the task execution phase (see one exception in the paragraph
  below).
* `freeCompilerArgs` returns an immutable `List<String>`, which means that, for example,
  `kotlinOptions.freeCompilerArgs.remove("something")` will fail.

Several plugins, including `kotlin-dsl` and the Android Gradle plugin (AGP) with
[Jetpack Compose](https://developer.android.com/jetpack/compose) enabled, try to modify the `freeCompilerArgs` attribute
in the task execution phase. We've added a workaround for them in Kotlin 1.8.0. This workaround allows any build script
or plugin to modify `kotlinOptions.freeCompilerArgs` in the execution phase but produces a warning in the build log.
To disable this warning, use the new Gradle property `kotlin.options.suppressFreeCompilerArgsModificationWarning=true`.
Gradle is going to add fixes for the [`kotlin-dsl` plugin](https://github.com/gradle/gradle/issues/22091) and
[AGP with Jetpack Compose enabled](https://issuetracker.google.com/u/1/issues/247544167).

### Bumping the minimum supported versions

Starting with Kotlin 1.8.0, the minimum supported Gradle version is 6.8.3 and the minimum supported Android Gradle plugin
version is 4.1.3.

See the [Kotlin Gradle plugin compatibility with available Gradle versions in our documentation](gradle-configure-project.md#apply-the-plugin)

### Ability to disable the Kotlin daemon fallback strategy

There is a new Gradle property `kotlin.daemon.useFallbackStrategy`, whose default value is `true`. When the value is `false`,
builds fail on problems with the daemon's startup or communication. There is also a new `useDaemonFallbackStrategy` property
in Kotlin compile tasks, which takes priority over the Gradle property if you use both. If there is insufficient memory
to run the compilation, you can see a message about it in the logs.

The Kotlin compiler's fallback strategy is to run a compilation outside the Kotlin daemon if the daemon somehow fails.
If the Gradle daemon is on, the compiler uses the "In process" strategy. If the Gradle daemon is off, the compiler uses
the "Out of process" strategy. Learn more about these
[execution strategies in the documentation](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy).
Note that silent fallback to another strategy can consume a lot of system resources or lead to non-deterministic builds;
see this [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)
for more details.

### Usage of the latest kotlin-stdlib version in transitive dependencies

If you explicitly write Kotlin version 1.8.0 or higher in your dependencies, for example:
`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`, then the Kotlin Gradle Plugin will use that Kotlin version
for transitive `kotlin-stdlib-jdk7` and `kotlin-stdlib-jdk8` dependencies. This is done to avoid class duplication from
different stdlib versions (learn more about
[merging `kotlin-stdlib-jdk7` and `kotlin-stdlib-jdk8` into `kotlin-stdlib`](#updated-jvm-compilation-target)).
You can disable this behavior with the `kotlin.stdlib.jdk.variants.version.alignment` Gradle property:

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

If you run into issues with version alignment, align all versions via the Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import)
by declaring a platform dependency on `kotlin-bom` in your build script:

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

Learn about other cases and our suggested solutions in [the documentation](gradle-configure-project.md#other-ways-to-align-versions).

### Obligatory check for JVM targets of related Kotlin and Java compile tasks

> This section applies to your JVM project even if your source files are only in Kotlin and you don't use Java.
>
{type="note"}

[Starting from this release](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8),
the default value for the [`kotlin.jvm.target.validation.mode` property](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)
is `error` for projects on Gradle 8.0+ (this version of Gradle has not been released yet), and the plugin will fail
the build in the event of JVM target incompatibility.

The shift of the default value from `warning` to `error` is a preparation step for a smooth migration to Gradle 8.0.
**We encourage you to set this property to `error`** and [configure a toolchain](gradle-configure-project.md#gradle-java-toolchains-support)
or align JVM versions manually.

Learn more about [what can go wrong if you don't check the targets' compatibility](gradle-configure-project.md#what-can-go-wrong-if-targets-are-incompatible).

### Resolution of Kotlin Gradle plugins' transitive dependencies

In Kotlin 1.7.0, we introduced [support for Gradle plugin variants](whatsnew17.md#support-for-gradle-plugin-variants).
Because of these plugin variants, a build classpath can have different versions of the [Kotlin Gradle plugins](https://plugins.gradle.org/u/kotlin)
that depend on different versions of some dependency, usually `kotlin-gradle-plugin-api`. This can lead to
a resolution problem, and we would like to propose the following workaround, using the `kotlin-dsl` plugin as an example.

The `kotlin-dsl` plugin in Gradle 7.6 depends on the `org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10` plugin,
which depends on `kotlin-gradle-plugin-api:1.7.10`. If you add the `org.jetbrains.kotlin.gradle.jvm:1.8.0` plugin,
this `kotlin-gradle-plugin-api:1.7.10` transitive dependency may lead to a dependency resolution error because of
a mismatch between the versions (`1.8.0` and `1.7.10`) and the variant attributes' [`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html)
values. As a workaround, add this [constraint](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps)
to align the versions. This workaround may be needed until we implement the [Kotlin Gradle Plugin libraries alignment platform](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform),
which is in the plans:

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

This constraint forces the `org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0` version to be used in the build classpath
for transitive dependencies. Learn more about one similar [case in the Gradle issue tracker](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298).

### Deprecations and removals

In Kotlin 1.8.0, the deprecation cycle continues for the following properties and methods:

* [In the notes for Kotlin 1.7.0](whatsnew17.md#changes-in-compile-tasks) that the `KotlinCompile` task still had
  the deprecated Kotlin property `classpath`, which would be removed in future releases. Now, we've changed
  the deprecation level to `error` for the `KotlinCompile` task's `classpath` property. All compile tasks use
  the `libraries` input for a list of libraries required for compilation.
* We removed the `kapt.use.worker.api` property that allowed running [kapt](kapt.md) via the Gradle Workers API.
  By default, [kapt has been using Gradle workers](kapt.md#run-kapt-tasks-in-parallel) since Kotlin 1.3.70,
  and we recommend sticking to this method.
* In Kotlin 1.7.0, we [announced the start of a deprecation cycle for the `kotlin.compiler.execution.strategy` property](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property).
  In this release, we removed this property. Learn how to [define a Kotlin compiler execution strategy](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)
  in other ways.

## Standard library

Kotlin 1.8.0:
* Updates [JVM compilation target](#updated-jvm-compilation-target).
* Stabilizes a number of functions – [TimeUnit conversion between Java and Kotlin](#timeunit-conversion-between-java-and-kotlin),
  [`cbrt()`](#cbrt), [Java `Optionals` extension functions](#java-optionals-extension-functions).
* Provides a [preview for comparable and subtractable `TimeMarks`](#comparable-and-subtractable-timemarks).
* Includes [experimental extension functions for `java.nio.file.path`](#recursive-copying-or-deletion-of-directories).
* Presents [improved kotlin-reflect performance](#improved-kotlin-reflect-performance).

### Updated JVM compilation target

In Kotlin 1.8.0, the standard libraries (`kotlin-stdlib`, `kotlin-reflect`, and `kotlin-script-*`) are compiled with
JVM target 1.8. Previously, the standard libraries were compiled with JVM target 1.6.

Kotlin 1.8.0 no longer supports JVM targets 1.6 and 1.7. As a result, you no longer need to declare `kotlin-stdlib-jdk7`
and `kotlin-stdlib-jdk8` separately in build scripts because the contents of these artifacts have been merged into `kotlin-stdlib`.

> If you have explicitly declared `kotlin-stdlib-jdk7` and `kotlin-stdlib-jdk8` as dependencies in your build scripts,
> then you should replace them with `kotlin-stdlib`.
>
{type="note"}

Note that mixing different versions of stdlib artifacts could lead to class duplication or to missing classes.
To avoid that, the Kotlin Gradle plugin can help you [align stdlib versions](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies).

### cbrt()

The `cbrt()` function, which allows you to compute the real cube root of a `double` or `float`, is now Stable.

```kotlin
import kotlin.math.*

fun main() {
    val num = 27
    val negNum = -num

    println("The cube root of ${num.toDouble()} is: " +
            cbrt(num.toDouble()))
    println("The cube root of ${negNum.toDouble()} is: " +
            cbrt(negNum.toDouble()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

### TimeUnit conversion between Java and Kotlin

The `toTimeUnit()` and `toDurationUnit()` functions in `kotlin.time` are now Stable. Introduced as Experimental in Kotlin
1.6.0, these functions improve interoperability between Kotlin and Java. You can now easily convert between Java
`java.util.concurrent.TimeUnit` and Kotlin `kotlin.time.DurationUnit`. These functions are supported on the JVM only.

```kotlin
import kotlin.time.*

// For use from Java
fun wait(timeout: Long, unit: TimeUnit) {
    val duration: Duration = timeout.toDuration(unit.toDurationUnit())
    ...
}
```

### Comparable and subtractable TimeMarks

> The new functionality of `TimeMarks` is [Experimental](components-stability.md#stability-levels-explained), and to use it
> you need to opt in by using `@OptIn(ExperimentalTime::class)` or `@ExperimentalTime`.
>
{type="warning"}

Before Kotlin 1.8.0, if you wanted to calculate the time difference between multiple `TimeMarks` and **now**, you could
only call `elapsedNow()` on one `TimeMark` at a time. This made it difficult to compare the results because the
two `elapsedNow()` function calls couldn't be executed at exactly the same time.

To solve this, in Kotlin 1.8.0 you can subtract and compare `TimeMarks` from the same time source. Now you can create
a new `TimeMark` instance to represent **now** and subtract other `TimeMarks` from it. This way, the results that
you collect from these calculations are guaranteed to be relative to each other.

```kotlin
import kotlin.time.*
fun main() {
//sampleStart
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // Sleep 0.5 seconds
    val mark2 = timeSource.markNow()

    // Before 1.8.0
    repeat(4) { n ->
        val elapsed1 = mark1.elapsedNow()
        val elapsed2 = mark2.elapsedNow()

        // Difference between elapsed1 and elapsed2 can vary depending 
        // on how much time passes between the two elapsedNow() calls
        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    println()

    // Since 1.8.0
    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        // Now the elapsed times are calculated relative to mark3, 
        // which is a fixed value
        println("Measurement 2.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // It's also possible to compare time marks with each other
    // This is true, as mark2 was captured later than mark1
    println(mark2 > mark1)
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

This new functionality is particularly useful in animation calculations where you want to calculate the difference between,
or compare, multiple `TimeMarks` representing different frames.

### Recursive copying or deletion of directories

> These new functions for `java.nio.file.path` are [Experimental](components-stability.md#stability-levels-explained).
> To use them, you need to opt in with `@OptIn(kotlin.io.path.ExperimentalPathApi::class)` or `@kotlin.io.path.ExperimentalPathApi`.
> Alternatively, you can use the compiler option `-opt-in=kotlin.io.path.ExperimentalPathApi`.
>
{type="warning"}

We have introduced two new extension functions for `java.nio.file.Path`, `copyToRecursively()` and `deleteRecursively()`,
which allow you to recursively:

* Copy a directory and its contents to another destination.
* Delete a directory and its contents.

These functions can be very useful as part of a backup process.

#### Error handling

Using `copyToRecursively()`, you can define what should happen if an exception occurs while copying, by overloading
the `onError` lambda function:

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false,
    onError = { source, target, exception ->
        logger.logError(exception, "Failed to copy $source to $target")
        OnErrorResult.TERMINATE
    })
```
{validate="false"}

When you use `deleteRecursively()`, if an exception occurs while deleting a file or folder, then the file or folder
is skipped. Once the deletion has completed, `deleteRecursively()` throws an `IOException` containing all the exceptions
that occurred as suppressed exceptions.

#### File overwrite

If `copyToRecursively()` finds that a file already exists in the destination directory, then an exception occurs.
If you want to overwrite the file instead, use the overload that has `overwrite` as an argument and set it to `true`:

```kotlin
fun setUpEnvironment(projectDirectory: Path, fixtureName: String) {
    fixturesRoot.resolve(COMMON_FIXTURE_NAME)
        .copyToRecursively(projectDirectory, followLinks = false)
    fixturesRoot.resolve(fixtureName)
        .copyToRecursively(projectDirectory, followLinks = false,
            overwrite = true) // patches the common fixture
}
```
{validate="false"}

#### Custom copying action

To define your own custom logic for copying, use the overload that has `copyAction` as an additional argument.
By using `copyAction` you can provide a lambda function, for example, with your preferred actions:

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false) { source, target ->
    if (source.name.startsWith(".")) {
        CopyActionResult.SKIP_SUBTREE
    } else {
        source.copyToIgnoringExistingDirectory(target, followLinks = false)
        CopyActionResult.CONTINUE
    }
}
```
{validate="false"}

For more information on these extension functions, see [our API reference](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/copy-to-recursively.html).

### Java Optionals extension functions

The extension functions that were introduced in [Kotlin 1.7.0](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)
are now Stable. These functions simplify working with Optional classes in Java. They can be used to unwrap and convert
`Optional` objects on the JVM, and to make working with Java APIs more concise. For more information,
see [What's new in Kotlin 1.7.0](whatsnew17.md#new-experimental-extension-functions-for-java-optionals).

### Improved kotlin-reflect performance

Taking advantage of the fact that `kotlin-reflect` is now compiled with JVM target 1.8, we migrated our internal
cache mechanism to Java's `ClassValue`. Previously we only cached `KClass`, but we now also cache `KType` and
`KDeclarationContainer`. These changes have led to significant performance improvements when invoking `typeOf()`.

## Documentation updates

The Kotlin documentation has received some notable changes:

### Revamped and new pages

* [Gradle overview](gradle.md) – learn how to configure and build a Kotlin project with the Gradle build system,
  available compiler options, compilation, and caches in the Kotlin Gradle plugin.
* [Nullability in Java and Kotlin](java-to-kotlin-nullability-guide.md) – see the differences between Java's and Kotlin's
  approaches to handling possibly nullable variables.
* [Lincheck guide](lincheck-guide.md) – learn how to set up and use the Lincheck framework for testing concurrent algorithms
  on the JVM.

### New and updated tutorials

* [Get started with Gradle and Kotlin/JVM](get-started-with-jvm-gradle-project.md) – create a console application using
  IntelliJ IDEA and Gradle.
* [Create a multiplatform app using Ktor and SQLDelight](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) – create a mobile
  application for iOS and Android using Kotlin Multiplatform Mobile.
* [Get started with Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html) – learn about cross-platform
  mobile development with Kotlin and create an app that works on both Android and iOS.

## Install Kotlin 1.8.0

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3, 2022.1, and 2022.2 automatically suggest updating
the Kotlin plugin to version 1.8.0. IntelliJ IDEA 2022.3 will have the 1.8.0 version of the Kotlin plugin bundled in
an upcoming minor update.

> To migrate existing projects to Kotlin 1.8.0 in IntelliJ IDEA 2022.3, change the Kotlin version to `1.8.0` and reimport
> your Gradle or Maven project.
>
{type="note"}

For Android Studio Electric Eel (221) and Flamingo (222), version 1.8.0 of the Kotlin plugin will be delivered with
the upcoming Android Studios updates. The new command-line compiler is available for download on the [GitHub release page](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0).

## Compatibility guide for Kotlin 1.8.0

Kotlin 1.8.0 is a [feature release](kotlin-evolution.md#feature-releases-and-incremental-releases) and can, therefore,
bring changes that are incompatible with your code written for earlier versions of the language. Find the detailed list
of these changes in the [Compatibility guide for Kotlin 1.8.0](compatibility-guide-18.md).
