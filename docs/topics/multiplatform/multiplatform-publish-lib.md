[//]: # (title: Setting up multiplatform library publication)

You can set up the publication of your multiplatform library to different locations:

* [To a local Maven repository](#publishing-to-a-local-maven-repository)
* To the Maven Central repository. Learn how to set up account credentials, customize library metadata, and configure
  the publication plugin in [our tutorial](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html).
* To a GitHub repository. For more information, see GitHub's documentation on [GitHub packages](https://docs.github.com/en/packages).

## Publishing to a local Maven repository

You can publish a multiplatform library to a local Maven repository with the `maven-publish` Gradle plugin:

1. In the `shared/build.gradle.kts` file, add the [`maven-publish` Gradle plugin](https://docs.gradle.org/current/userguide/publishing_maven.html).
2. Specify the group and version for the library, as well as the [repositories](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories)
   where it should be published:

   ```kotlin
   plugins {
       // ...
       id("maven-publish")
   }

   group = "com.example"
   version = "1.0"

   publishing {
       repositories {
           maven {
               //...
           }
       }
   }
   ```

When used with `maven-publish`, the Kotlin plugin automatically creates publications for each target that can be built
on the current host, except for the Android target, which needs an [additional step to configure publishing](#publish-an-android-library).

## Structure of publications

Publications of a Kotlin Multiplatform library include multiple Maven publications, each corresponding to a specific target.
Additionally, an umbrella _root_ publication, `kotlinMultiplatform`, that represents the entire library is published.

When added as a [dependency](multiplatform-add-dependencies.md) to the common source set, the root publication automatically resolves to the appropriate
platform-specific artifacts.

### Target-specific and root publications

The Kotlin Multiplatform Gradle plugin configures separate publications for each target.
Consider the following project configuration:

```kotlin
// projectName = "lib"
group = "test"
version = "1.0"

kotlin {
    jvm()
    iosX64()
    iosArm64()
}
```

This setup generates the following Maven publications:

**Target-specific publications**

* For the `jvm` target:`test:lib-jvm:1.0`
* For the `iosX64` target: `test:lib-iosx64:1.0`
* For the `iosArm64` target:`test:lib-iosarm64:1.0`

Each target-specific publication is independent. For example, running `publishJvmPublicationTo<MavenRepositoryName>`
publishes only the JVM module, leaving other modules unpublished.

**Root publication**

The `kotlinMultiplatform` root publication: `test:lib:1.0`.

The root publication serves as an entry point that references all target-specific publications.
It includes metadata artifacts and ensures proper dependency resolution by including references to other publications:
expected URLs and coordinates for individual platform artifacts.

* Some repositories, such as Maven Central, require the root module to contain a JAR artifact without a classifier,
  for example `kotlinMultiplatform-1.0.jar`.
  The Kotlin Multiplatform plugin automatically produces the required artifact with the embedded metadata artifacts.
  This means you don't have to add an empty artifact to the root module of your library to
  meet the repository's requirements.

  > Learn more about JAR artifact generation with [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm)
  > and [Maven](maven.md#create-jar-file) build systems.
  >
  {style="tip"}

* The `kotlinMultiplatform` publication may also need sources and documentation artifacts if that is required by the
  repository. In that case, use [`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)
  in the publication's scope.

### Publishing a complete library

To publish all necessary artifacts in one step, use the `publishAllPublicationsTo<MavenRepositoryName>` umbrella task.
For example:

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

When publishing to Maven Local, you can use a special task:

```bash
./gradlew publishToMavenLocal
```

These tasks ensure that all target-specific and root publications are published together, making the library fully
available for dependency resolution.

Alternatively, you can use separate publication tasks. Run the root publication first:

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
````

This task publishes a `*.module` file with information about the target-specific publications, but the targets themselves
remain unpublished. To complete the process, publish each target-specific publication separately:

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

This guarantees that all artifacts are available and correctly referenced.

## Host requirements

Kotlin/Native supports cross-compilation, allowing any host to produce necessary `.klib` artifacts.
However, there are still some specifics you should keep in mind.

### Compilation for Apple targets
<primary-label ref="experimental-opt-in"/>

To produce artifacts for projects with Apple targets, you'd normally need an Apple machine.
However, if you want to use other hosts, set this option in your `gradle.properties` file:

```none
kotlin.native.enableKlibsCrossCompilation=true
```

Cross-compilation is currently Experimental and has some limitations. You still need to use a Mac machine if:

* Your library has a [cinterop dependency](native-c-interop.md).
* You have [CocoaPods integration](native-cocoapods.md) set up in your project.
* You need to build or test [final binaries](multiplatform-build-native-binaries.md) for Apple targets.

### Duplicating publications

To avoid any issues during publication, publish all artifacts from a single host to avoid duplicating publications in the
repository. Maven Central, for example, explicitly forbids duplicate publications and fails the process.
<!-- TBD: add the actual error -->

## Publish an Android library

To publish an Android library, you need to provide additional configuration.

By default, no artifacts of an Android library are published. To publish artifacts produced by a set of Android [build variants](https://developer.android.com/build/build-variants),
specify the variant names in the Android target block in the `shared/build.gradle.kts` file:

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

The example works for Android libraries without [product flavors](https://developer.android.com/build/build-variants#product-flavors).
For a library with product flavors, the variant names also contain the flavors, like `fooBarDebug` or `fooBarRelease`.

The default publishing setup is as follows:
* If the published variants have the same build type (for example, all of them are `release` or`debug`),
  they will be compatible with any consumer build type.
* If the published variants have different build types, then only the release variants will be compatible
  with consumer build types that are not among the published variants. All other variants (such as `debug`)
  will only match the same build type on the consumer side, unless the consumer project specifies the
  [matching fallbacks](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType).

If you want to make every published Android variant compatible with only the same build type used by the library consumer,
set this Gradle property: `kotlin.android.buildTypeAttribute.keep=true`.

You can also publish variants grouped by the product flavor, so that the outputs of the different build types are placed
in a single module, with the build type becoming a classifier for the artifacts (the release build type is still published
with no classifier). This mode is disabled by default and can be enabled as follows in the `shared/build.gradle.kts` file:

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

> It is not recommended that you publish variants grouped by the product flavor in case they have different dependencies,
> as those will be merged into one dependency list.
>
{style="note"}

## Disable sources publication

By default, the Kotlin Multiplatform Gradle plugin publishes sources for all the specified targets. However,
you can configure and disable sources publication with the `withSourcesJar()` API in the `shared/build.gradle.kts` file:

* To disable sources publication for all the targets:

  ```kotlin
  kotlin {
      withSourcesJar(publish = false)
  
      jvm()
      linuxX64()
  }
  ```

* To disable sources publication only for the specified target:

  ```kotlin
  kotlin {
       // Disable sources publication only for JVM:
      jvm {
          withSourcesJar(publish = false)
      }
      linuxX64()
  }
  ```

* To disable sources publication for all targets except for the specified target:

  ```kotlin
  kotlin {
      // Disable sources publication for all targets except for JVM:
      withSourcesJar(publish = false)
  
      jvm {
          withSourcesJar(publish = true)
      }
      linuxX64()
  }
  ```

## Disable JVM environment attribute publication

Starting with Kotlin 2.0.0, the Gradle attribute [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes)
is automatically published with all Kotlin variants to help distinguish between JVM and Android variants of Kotlin Multiplatform
libraries. The attribute indicates which library variant is suited for which JVM environment, and Gradle uses this information to help with
dependency resolution in your projects. The target environment can be "android", "standard-jvm", or "no-jvm".

You can disable the publication of this attribute by adding the following Gradle property to your `gradle.properties` file:

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## Promote your library

Your library can be featured on the [JetBrains' search platform](https://klibs.io/).
It's designed to make it easy to look for Kotlin Multiplatform libraries based on their target platforms.

Libraries that meet the criteria are added automatically. For more information on how to add your library, see [FAQ](https://klibs.io/faq).

## What's next

* [Learn how to publish your Kotlin Multiplatform library to the Maven Central repository](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)
* [See the Library authors' guidelines for best practices and tips on designing a library for Kotlin Multiplatform](api-guidelines-build-for-multiplatform.md)