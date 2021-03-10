[//]: # (title: Publish a multiplatform library)

You can publish a multiplatform library to a Maven repository with the [`maven-publish` Gradle plugin](https://docs.gradle.org/current/userguide/publishing_maven.html). 
Specify the group, version, and the [repositories](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories) 
where the library should be published. The plugin creates publications automatically.

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

Complete the [tutorial on creating and publishing a multiplatform library](multiplatform-library.md) to get hands-on experience.

## Structure of publications

When used with `maven-publish`, the Kotlin plugin automatically creates publications for each target that can be built on the current host, except for the Android target, 
which needs an [additional step to configure publishing](#publish-an-android-library).

Publications of a multiplatform library include an additional _root_ publication `kotlinMultiplatform` that stands for the 
whole library and is automatically resolved to the appropriate platform-specific artifacts when added as a dependency to the common source set. 
Learn more about [adding dependencies](mpp-add-dependencies.md).

This `kotlinMultiplatform` publication includes metadata artifacts and references the other publications as its variants.

> Some repositories, such as Maven Central, require that the root module contains a JAR artifact without a classifier, for example `kotlinMultiplatform-1.0.jar`.  
> The Kotlin Multiplatform plugin automatically produces the required artifact with the embedded metadata artifacts.  
> This means you don't have to customize your build by adding an empty artifact to the root module of your library to meet the repository’s requirements.
>
{type="note"}
 
The `kotlinMultiplatform` publication may also need the sources and documentation artifacts if that is required by the repository. In that case, 
add those artifacts by using [`artifact(...)`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-) 
in the publication's scope.

## Avoid duplicate publications

To avoid duplicate publications of modules that can be built on several platforms (like JVM and JS), 
configure the publishing tasks for these modules to run conditionally.

You can detect the platform in the script, introduce a flag such as `isMainHost` and set it to `true` for the main target 
platform. Alternatively, you can pass the flag from an external source, for example, from CI configuration. 

This simplified example ensures that publications are only uploaded when `isMainHost=true` is passed. This means that 
a publication that can be published from multiple platforms will be published only once – from the main host.

<tabs>

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

</tabs>

By default, each publication includes a sources JAR that contains the sources used by the main compilation of the target. 

## Publish an Android library

To publish an Android library, you need to provide additional configuration.

By default, no artifacts of an Android library are published. To publish artifacts produced by a set of [Android variants](https://developer.android.com/studio/build/build-variants), 
specify the variant names in the Android target block:

```kotlin
kotlin {
    android {
        publishLibraryVariants("release", "debug")
    }
}

```

The example works for Android libraries without [product flavors](https://developer.android.com/studio/build/build-variants#product-flavors). 
For a library with product flavors, the variant names also contain the flavors, like `fooBarDebug` or `fooBazRelease`.

> If a library consumer defines variants that are missing in the library, they need to provide matching fallbacks. 
> For example, if a library does not have or does not publish a staging build type, the library consumer must provide a fallback for the 
> consumers who have such a build type, specifying at least one of the build types that the library publishes:
>
><tabs>
>
> ```groovy
> android {
>     buildTypes {
>         staging {
>             // ...
>             matchingFallbacks = ['release', 'debug']
>         }
>     }
> }
> ```
> 
> ```kotlin
> android {
>     buildTypes {
>         val staging by creating {
>             // ...
>             matchingFallbacks = listOf("release", "debug")
>         }
>     }
> }
> ```
>
></tabs>
>
{type="note"}

Similarly, a library consumer needs to provide matching fallbacks for custom product flavors if some are missing in the 
library publications.

You can also publish variants grouped by the product flavor, so that the outputs of the different build types are placed 
in a single module, with the build type becoming a classifier for the artifacts (the release build type is still published 
with no classifier). This mode is disabled by default and can be enabled as follows:

```kotlin
kotlin {
    android {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

> It is not recommended that you publish variants grouped by the product flavor in case they have different dependencies, 
> as those will be merged into one dependencies list.
>
{type="note"}