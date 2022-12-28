[//]: # (title: Hierarchical project structure)

With Kotlin 1.6.20, every new multiplatform project comes with a hierarchical project structure. This means that source
sets form a hierarchy for sharing the common code among several targets. It opens up a variety of opportunities,
including using platform-dependent libraries in common source sets and the ability to share code when creating multiplatform
libraries.

To get a default hierarchical project structure in your
projects, [update to the latest release](releases.md#update-to-a-new-release). If you need to keep using an earlier version
than 1.6.20, you can still enable this feature manually. For this, add the following to your `gradle.properties`:

```properties
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
```

## For multiplatform project authors

With the new hierarchical project structure support, you can share code among some, but not
all, [targets](multiplatform-dsl-reference.md#targets) in a multiplatform project.

You can also use platform-dependent libraries, such as `UIKit` and `POSIX`, in source sets shared among several native
targets. One popular case is having access to iOS-specific dependencies like `Foundation` when sharing code across all
iOS targets. The new structure helps you share more native code without being limited by platform-specific dependencies.

By using the hierarchical structure along with platform-dependent libraries in shared source sets, you can eliminate the
need to use workarounds to get IDE support for sharing source sets among several native targets, for
example `iosArm64` and `iosX64`:

```kotlin
// workaround 1: select iOS target platform depending on the Xcode environment variables
kotlin {
    val iOSTarget: (String, KotlinNativeTarget.() -> Unit) -> KotlinNativeTarget =
        if (System.getenv("SDK_NAME")?.startsWith("iphoneos") == true)
            ::iosArm64
        else
            ::iosX64

    iOSTarget("ios")
}
```
{initial-collapse-state="collapsed"}

```bash
# workaround 2: make symbolic links to use one source set for two targets
ln -s iosMain iosArm64Main && ln -s iosMain iosX64Main
```
{initial-collapse-state="collapsed"}

Instead of doing this, you can create a hierarchical structure
with [target shortcuts](multiplatform-share-on-platforms.md#use-target-shortcuts)
available for typical multi-target scenarios, or you can manually declare and connect the source sets. For example, you
can create two iOS targets and a shared source set with the `ios()` shortcut:

```kotlin
kotlin {
    ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```

The Kotlin toolchain will provide the correct default dependencies and locate the API surface area available in the shared
code. This prevents cases like the use of a macOS-specific function in code shared for Windows.

## For library authors

A hierarchical project structure allows for reusing code in similar targets, as well as publishing and consuming libraries
with granular APIs targeting similar platforms.

The Kotlin toolchain will automatically figure out the API available in the consumer source set while checking for
unsafe usages, like using an API meant for the JVM in JS code.

* Libraries published with the new hierarchical project structure are only compatible with projects that already have a hierarchical
  project structure. To enable compatibility with non-hierarchical projects, add the following to
  the `gradle.properties` file in your library project:

  ```properties
  kotlin.mpp.enableCompatibilityMetadataVariant=true
  ```

 > In this case, only source code from the `commonMain` source set is compiled with the legacy metadata compiler. If you
 > use platform-specific code in `commonMain`, its compilation to the legacy format will fail.
 >
 {type="warning"}

* Libraries published without the hierarchical project structure can't be used in a shared native source set. For
  example, users with `ios()` shortcuts in their `build.gradle.(kts)` files won't be able to use your library in their
  iOS-shared code.

See [Compatibility](#compatibility) for more details.

## Compatibility

Compatibility between multiplatform projects and libraries is determined as follows:

| Library with hierarchical project structure | Project with hierarchical project structure | Compatibility                                                                   |
|---------------------------------------------|---------------------------------------------|---------------------------------------------------------------------------------|
| Yes                                         | Yes                                         | ✅                                                                               |
| Yes                                         | No                                          | Need to enable with `enableCompatibilityMetadataVariant` in the library project |
| No                                          | Yes                                         | Library can't be used in a shared native source set                             |
| No                                          | No                                          | ✅                                                                               |

## How to opt-out

To disable hierarchical structure support, set the following option to `false` in your `gradle.properties`:

```properties
kotlin.mpp.hierarchicalStructureSupport=false
```

As for the `kotlin.mpp.enableCompatibilityMetadataVariant` option that enables compatibility of libraries published with
the hierarchical project structure and non-hierarchical projects – it's disabled by default. No additional steps are required.