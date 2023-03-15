[//]: # (title: Hierarchical project structure)

Starting with Kotlin 1.6.20, every new multiplatform project comes with a hierarchical project structure. This means that source
sets form a hierarchy for sharing the common code among several targets. It opens up a variety of opportunities,
including using platform-dependent libraries in common source sets and the ability to share code when creating multiplatform
libraries.

## For multiplatform project authors

With the new hierarchical project structure support, you can share code among some, but not
all, [targets](multiplatform-dsl-reference.md#targets) in a multiplatform project.

You can also use platform-dependent libraries, such as `UIKit` and `POSIX`, in source sets shared among several native
targets. One popular case is having access to iOS-specific dependencies like `Foundation` when sharing code across all
iOS targets. The new structure helps you share more native code without being limited by platform-specific dependencies.

You can create a hierarchical structure with [target shortcuts](multiplatform-share-on-platforms.md#use-target-shortcuts)
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

A hierarchical project structure allows reusing code in similar targets, as well as publishing and consuming libraries
with granular APIs targeting similar platforms.

The Kotlin toolchain will automatically figure out the API available in the consumer source set while checking for
unsafe usages, like using an API meant for the JVM in JS code.

* Libraries published with the new hierarchical project structure are only compatible with projects that already have a hierarchical
  project structure. To enable compatibility with non-hierarchical projects, add the following to
  the `gradle.properties` file in your library project:

  ```none
  kotlin.mpp.enableCompatibilityMetadataVariant=true
  ```
  
  > In this case, only source code from the `commonMain` source set is compiled with the legacy metadata compiler. If you
  > use platform-specific code in `commonMain`, its compilation to the legacy format will fail.
  >
  {type="warning"}

* Libraries published without the hierarchical project structure can't be used in a shared native source set. For
  example, users with `ios()` shortcuts in their `build.gradle(.kts)` files won't be able to use your library in their
  iOS-shared code.

See [Compatibility](#compatibility) for more details.

## Compatibility

Compatibility between multiplatform projects and libraries is determined as follows:

| Library has hierarchical project structure | Project has hierarchical project structure | Compatibility                                                                   |
|--------------------------------------------|--------------------------------------------|---------------------------------------------------------------------------------|
| Yes                                        | Yes                                        | ✅                                                                               |
| Yes                                        | No                                         | Need to enable with `enableCompatibilityMetadataVariant` in the library project |
| No                                         | Yes                                        | Library can't be used in a shared native source set                             |
| No                                         | No                                         | ✅                                                                               |