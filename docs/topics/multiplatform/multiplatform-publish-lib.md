[//]: # (title: Publishing multiplatform libraries)

You can publish a multiplatform library to a local Maven repository with the [`maven-publish` Gradle plugin](https://docs.gradle.org/current/userguide/publishing_maven.html). 
In the `shared/build.gradle.kts` file, specify the group, version, and the [repositories](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories) where the library
should be published. The plugin creates publications automatically.

```kotlin
plugins {
    //...
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

> You can also publish a multiplatform library to a GitHub repository. For more information, see GitHub's documentation on [GitHub packages](https://docs.github.com/en/packages).
>
{style="tip"}

## Structure of publications

When used with `maven-publish`, the Kotlin plugin automatically creates publications for each target that can be built on the current host, except for the Android target, 
which needs an [additional step to configure publishing](#publish-an-android-library).

Publications of a multiplatform library include an additional _root_ publication `kotlinMultiplatform` that stands for the 
whole library and is automatically resolved to the appropriate platform-specific artifacts when added as a dependency to the common source set. 
Learn more about [adding dependencies](multiplatform-add-dependencies.md).

This `kotlinMultiplatform` publication includes metadata artifacts and references the other publications as its variants.

> Some repositories, such as Maven Central, require that the root module contains a JAR artifact without a classifier, for example `kotlinMultiplatform-1.0.jar`.  
> The Kotlin Multiplatform plugin automatically produces the required artifact with the embedded metadata artifacts.  
> This means you don't have to customize your build by adding an empty artifact to the root module of your library to meet the repository's requirements.
>
{style="note"}

The `kotlinMultiplatform` publication may also need the sources and documentation artifacts if that is required by the repository. In that case, 
add those artifacts by using [`artifact(...)`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-) 
in the publication's scope.

## Host requirements

Kotlin/Native supports cross-compilation, allowing any host to produce necessary `.klib` artifacts.

To produce artifacts for projects with Apple targets, you'd normally need an Apple machine.
However, if you want to use other hosts, you can set this [Experimental](components-stability.md#stability-levels-explained)
option in your `gradle.properties` file:

```none
kotlin.native.enableKlibsCrossCompilation=true
```

> To build [final binaries](multiplatform-build-native-binaries.md) for Apple targets, you still need to use a Mac machine.
>
{style="note"}

To avoid any issues during publication, publish all artifacts from a single host to avoid duplicating publications in the
repository. Maven Central, for example, explicitly forbids duplicate publications and fails the process.
<!-- TBD: add the actual error -->
  
### If you use Kotlin 1.7.0 or earlier {initial-collapse-state="collapsed" collapsible="true"}

Before 1.7.20, the Kotlin/Native compiler didn't support all cross-compilation options. If you use earlier versions, you may need
to publish multiplatform projects from multiple hosts: a Windows host to compile a Windows target, a Linux host to compile a Linux target, and so on.
This can result in duplicate publications of modules that are cross-compiled. The most straightforward way to avoid this is to upgrade to a later
version of Kotlin and publish from a single host as described above.

If upgrading is not an option, assign a main host for each target and check for it in the `shared/build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm()
    js()
    mingwX64()
    linuxX64()
  
    val publicationsFromMainHost =
        listOf(jvm(), js()).map { it.name } + "kotlinMultiplatform"
  
    publishing {
        publications {
            matching { it.name in publicationsFromMainHost }.all {
                val targetPublication = this@all
                tasks.withType<AbstractPublishToMaven>()
                    .matching { it.publication == targetPublication }
                    .configureEach { onlyIf { findProperty("isMainHost") == "true" } }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm()
    js()
    mingwX64()
    linuxX64()
  
    def publicationsFromMainHost =
        [jvm(), js()].collect { it.name } + "kotlinMultiplatform"
  
    publishing {
        publications {
            matching { it.name in publicationsFromMainHost }.all { targetPublication ->
                tasks.withType(AbstractPublishToMaven)
                    .matching { it.publication == targetPublication }
                    .configureEach { onlyIf { findProperty("isMainHost") == "true" } }
            }
        }
    }
}
```

</tab>
</tabs>

## Publish an Android library

To publish an Android library, you need to provide additional configuration.

By default, no artifacts of an Android library are published. To publish artifacts produced by a set of [Android variants](https://developer.android.com/studio/build/build-variants), 
specify the variant names in the Android target block in the `shared/build.gradle.kts` file:

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}

```

The example works for Android libraries without [product flavors](https://developer.android.com/studio/build/build-variants#product-flavors). 
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

## What's next

See the [Library authors' guidelines](api-guidelines-build-for-multiplatform.md) for best practices and tips
on designing a library for Kotlin Multiplatform.