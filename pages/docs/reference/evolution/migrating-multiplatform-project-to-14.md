---
type: doc
layout: reference
title: "Migrating Multiplatform Project to Kotlin 1.4"
---

# Migrating Multiplatform Project to Kotlin 1.4

Kotlin 1.4.0 comes with lots of features and improvements for multiplatform programming. Some of them just work out of the box, and some require additional project configuration. This guide will help you to migrate to 1.4.0 and get the benefits of all its new features:

## For multiplatform project authors

### Update Gradle 

Starting with Kotlin 1.4, all multiplatform projects require Gradle 6.0 or later. Please make sure to upgrade Gradle for your projects that use the `kotlin-multiplatform` plugin. Follow the [official Gradle guide](https://docs.gradle.org/current/userguide/upgrading_version_5.html) for non-Kotlin-specific migration instructions.

### Simplify your build configuration

Gradle module metadata provides rich publishing and dependency resolution features that are used in Kotlin Multiplatform Projects. In Gradle 6.0 and above, module metadata is used during dependency resolution and is included in publications by default. So once you update to Gradle 6.0, you can remove `enableFeaturePreview("GRADLE_METADATA")` from the project’s `settings.gradle` file.

If the library was published with metadata you only have to specify a dependency on it once in the shared source set, instead of having to specify dependencies on different variants of the same library in the shared and platform-specific source sets where it is used.

Starting from 1.4, you also no longer need to declare a dependency on `stdlib` in each source set manually – it [will now be added by default](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-released/#stdlib-default). The version of the automatically added standard library will be the same as the version of the Kotlin Gradle plugin, since they have the same versioning.

With these features, you can make your Gradle build file much more concise and easy to read:

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
...
android()
ios()
js()

sourceSets {
    commonMain {
        dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:$coroutinesVersion")
        }
    }
}

...
```

</div>

Don’t use kotlinx library artifact names with suffixes `-common`  or `-native`, as they are no longer supported. Instead, use the library root artifact name, which in the example above is `kotlinx-coroutines-core`. 

### Try the hierarchical project structure

With [the new hierarchical project structure support](https://blog.jetbrains.com/kotlin/2020/06/kotlin-1-4-m2-released/#hierarchical-project-structure), you can share code among several targets in a multiplatform project. You can use platform-dependent libraries, such as `Foundation`, `UIKit`, and `posix` in source sets shared among several native targets. This can help you share more native code without being limited by platform-specific dependencies.  
By enabling the hierarchical structure along with its ability to use platform-dependent libraries in shared source sets, you can eliminate the need to use certain workarounds to get IDE support for sharing source sets among several native targets, for example `iosArm64` and `iosX64`:

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only> 

```kotlin
kotlin {
    // workaround 1: select iOS target platform depending on the Xcode environment variables
    val iOSTarget: (String, KotlinNativeTarget.() -> Unit) -> KotlinNativeTarget =
        if (System.getenv("SDK_NAME")?.startsWith("iphoneos") == true)
            ::iosArm64
        else
            ::iosX64

    iOSTarget("ios") 
}
```

</div>


<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
# workaround 2: make symbolic links to use one source set for two targets
ln -s iosMain iosArm64Main && ln -s iosMain iosX64Main
```

</div>

Instead of doing this, you can create a hierarchical structure with [target shortcuts](https://kotlinlang.org/docs/reference/building-mpp-with-gradle.html#target-shortcuts) available for typical multi-target scenarios, or you can manually declare and connect the source sets. For example, you can create two iOS targets and a shared source set with the `ios()` shortcut:

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
   ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```
</div>

To enable the hierarchical project structure along with the use of platform-dependent libraries in shared source sets, just add the following to your `gradle.properties`:

<div class="sample" markdown="1" theme="idea" mode='xml'>

```
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
```

</div>

This will be the default behavior starting with Kotlin-1.4.20. 

## For library authors

### Check uploading to Bintray

The Bintray plugin doesn’t support publishing Gradle module metadata at all, but there are a couple of ways to get around this issue:

* Migrate to maven-publish instead of bintray-publish [as we did for kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization/commit/c5f1af6ad78a77fe5861588d9fb00b7d3a9bc3e5#diff-439aadfed1f3c340acdcc871c00258aeL5) 
* Use [a workaround for the Bintray plugin](https://github.com/bintray/gradle-bintray-plugin/issues/229#issuecomment-473123891)

While uploading your library to Bintray, you will see multiple **versions** created for each **artifact** (like `my-library-jvm`, `my-library-metadata`, etc.). To fix this, add `systemProp.org.gradle.internal.publish.checksums.insecure=true`. See https://github.com/gradle/gradle/issues/11412 for details. This is a common Gradle 6.0 issue that is neither MPP nor Kotlin specific.

### Follow the default libraries’ layout 

The layout of Kotlinx has changed and now corresponds to the default layout, which we recommend using:
The '“root” or “umbrella” library module now has a name without a suffix (e.g. `kotlinx-coroutines-core` instead of `kotlinx-coroutines-core-native`). Publishing libraries with [maven-publish Gradle plugin](https://docs.gradle.org/current/userguide/publishing_maven.html) follows this layout by default.

### Migrate to the hierarchical project structure

A hierarchical project structure allows reusing code in similar targets, as well as publishing and consuming libraries with granular APIs targeting similar platforms. We recommend enabling the hierarchical project structure in your libraries when you migrating to Kotlin 1.4.0:

* Libraries published with the hierarchical project structure enabled are compatible with all kinds of projects, both with and without the hierarchical project structure enabled. However, libraries published without the hierarchical project structure can’t be used in a shared-native source set. So, for example, users with `ios()` shortcuts in their `gradle.build` files won’t be able to use your library in their iOS-shared code.
* Starting from Kotlin-1.4.20, the hierarchical project structure with the usage of platform-dependent libraries in shared source sets will be enabled by default in multiplatform projects. So the sooner you support it, the sooner users will be able to migrate. We’ll also be very thankful if you report any bugs you find to our [issue tracker.](http://kotl.in/issue) 

To enable hierarchical project structure support, add the following to your `gradle.properties`:

<div class="sample" markdown="1" theme="idea" mode='xml'>

```
kotlin.mpp.enableGranularSourceSetsMetadata=true
```

</div>

## For build authors

### Check task names

The introduction of the hierarchical project structure in multiplatform projects resulted in a couple of changes to the names of some Gradle tasks:

* The `metadataJar` task has been renamed to `allMetadataJar`
* There are new `compile<SourceSet>KotlinMetadata` tasks for all published intermediate source-sets

These changes are relevant only for projects with the hierarchical project structure enabled.

## For using the Kotlin/JS target

### Changes related to npm dependency management

When declaring dependencies on npm packages, you are now required to explicitly specify a version or version range based on [npm’s semver syntax](https://docs.npmjs.com/misc/semver#versions). Specifying multiple version ranges is also supported.

While we don’t recommend it, you can use a wildcard `*` in place of a version number if you do not want to specify a version or version range explicitly.


### Changes related to the Kotlin/JS IR compiler

Kotlin 1.4.0 introduces the Alpha IR compiler for Kotlin/JS. For more detailed information about the Kotlin/JS IR compiler’s backend and how to configure it, consult the [documentation](../js-ir-compiler.html).

To choose between the different Kotlin/JS compiler options, set the key `kotlin.js.compiler` in your `gradle.properties` to `legacy`, `ir`, or `both`. Alternatively, pass `LEGACY`, `IR`, or `BOTH` to the `js` function in your `build.gradle(.kts)`.

#### Changes in `both` mode
Choosing `both` as the compiler option (so that it will compile with both the legacy and the IR backend) means that some tasks are renamed to explicitly mark them as only affecting the legacy compilation. `compileKotlinJs` is renamed to `compileKotlinJsLegacy`, and `compileTestKotlinJs` is renamed to `compileTestKotlinJsLegacy`.

#### Explicitly toggling the creation of executable files

When using the IR compiler, the `binaries.executable()` instruction must be present in the `js` target configuration block of your `build.gradle(.kts)`. If this option is omitted, only Kotlin-internal library files are generated. These files can be used from other projects, but not run on their own.

For backwards compatibility, when using the legacy compiler for Kotlin/JS, including or omitting `binaries.executable()` will have no effect – executable files will be generated in either case. To make the legacy backend stop producing executable files without the presence of `binaries.executable()` (for example, to improve build times where runnable artifacts aren't required), set `kotlin.js.generate.executable.default=false` in your `gradle.properties`.


### Changes related to Dukat

The Dukat integration for Gradle has received minor naming and functionality changes with Kotlin 1.4.0.

* The `kotlin.js.experimental.generateKotlinExternals` flag has been renamed to `kotlin.js.generate.externals`. It controls the default behavior of Dukat for all specified npm dependencies.
* The `npm` dependency function now takes a third parameter after the package name and version: `generateExternals`. This allows you to individually control whether Dukat should generate declarations for a specific dependency, and it overrides the `generateKotlinExternals` setting.

A way to manually trigger the generation of Kotlin externals is also available. Please consult the [documentation](../js-external-declarations-with-dukat.html) for more information.


### Using artifacts built with Kotlin 1.4.x in a Kotlin 1.3.x project

The choice between the `IR` and `LEGACY` compilers was not yet available in Kotlin 1.3.xx. Because of this, you may encounter a Gradle error `Cannot choose between the following variants...` if one of your dependencies (or any transitive dependency) was built using Kotlin 1.4+ but your project uses Kotlin 1.3.xx. A workaround is provided [here](https://youtrack.jetbrains.com/issue/KT-40226).
