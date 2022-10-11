[//]: # (title: Build Kotlin/Native artifacts)

> The new DSL described below is [Experimental](components-stability.md). It may be changed at any time.
> We encourage you to use it for evaluation purposes.
> 
{type="warning"}

Kotlin/Native [targets](multiplatform-dsl-reference.md#native-targets) are compiled to the `*.klib` library artifacts,
which can be consumed by Kotlin/Native itself as a dependency but cannot be executed or used as a native library.
 
To declare final native binaries such as executables or shared libraries, use the new binaries format with the `kotlinArtifacts`
DSL. It represents a collection of native binaries built for this target in addition to the default `*.klib` artifact 
and provides a set of methods for declaring and configuring them.
 
> The `kotlin-multiplatform` plugin doesn't create any production binaries by default. The only binary available by default 
> is a debug test executable that lets you run unit tests from the `test` compilation.
>
{type="note"}

## Declare binaries

Use the following kinds of binaries to declare elements of the `kotlinArtifacts` DSL: 

| Factory method | Binary kind             | Available for                                |
|----------------|-------------------------|----------------------------------------------|
| `sharedLib`    | Shared native library   | All native targets, except for `WebAssembly` |
| `staticLib`    | Static native library   | All native targets, except for `WebAssembly` |
| `framework`    | Objective-C framework   | macOS, iOS, watchOS, and tvOS targets only   |
| `fatFramework` | Universal fat framework | macOS, iOS, watchOS, and tvOS targets only   |
| `XCFramework`  | XCFramework framework   | macOS, iOS, watchOS, and tvOS targets only   |

The simplest version doesn't require any additional parameters and creates one binary for each build type. Currently, 
two build types are available: 

* `DEBUG` – produces a non-optimized binary with debug information 
* `RELEASE` – produces an optimized binary without debug information

You can specify for which build types to create binaries. In the following example, both `debug` and `release`
executable binaries are created:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    kotlinArtifacts {
        Native.Library {
            target = iosX64 // Define your target instead
            modes(DEBUG, RELEASE)
            // Binary configuration
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    kotlinArtifacts {
        Native.Library {
            target = iosX64 // Define your target instead
            modes(DEBUG, RELEASE)
            // Binary configuration
        }
    }
}
```

</tab>
</tabs>

You can also declare binaries with custom names:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlinArtifacts {
    Native.Library("mylib") {
        // Binary configuration
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlinArtifacts {
    Native.Library("mylib") {
        // Binary configuration
    }
}
```

</tab>
</tabs>

The argument sets a name prefix, which is the default name for the binary file. For example, for Windows the code 
produces the files `mylib.exe`.

## Build binaries for several modules

If your project has multiple Kotlin modules, and you need to access them from your iOS app, you'll encounter an issue
− the usage of several Kotlin/Native modules in Swift is limited.

With Kotlin artifact DSL, you can export the project along with all its dependencies into a single Gradle module
and connect it to Swift.

The `kotlinArtifacts` element is the top-level block for artifact configuration in the Gradle build script. Inside it,
you can write the following blocks:

* [Native.Library](#library)
* [Native.Framework](#framework)
* [Native.FatFramework](#fat-frameworks)
* [Native.XCFramework](#xcframeworks)

For the binary configuration, the following parameters are available:

| **Name**        | **Description**                                                                                                                 |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------|
| `isStatic`      | Optional linking type that defines the library type. By default, it's `false` and the library is dynamic.                       |
| `modes`         | Optional build types, `DEBUG` and `RELEASE`.                                                                                    |
| `kotlinOptions` | Optional compiler options applied to the compilation. See the list of available [compiler options](gradle.md#compiler-options). |
| `addModule`     | In addition to the current module, you can add other modules to the resulting artifact.                                         |
| `setModules`    | You can override the list of all modules that will be added to the resulting artifact.                                          |

### Libraries and frameworks

When building an Objective-C framework or a native library (shared or static), you may need to pack not just the classes
of the current project, but also the classes of its dependencies into a single entity and export all these modules to it.

#### Library

For the library configuration, the additional `target` parameter is available:

| **Name**        | **Description**                                                                                                                                        |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `target`        | Declares a particular target of a project. The names of available targets are listed in the [Targets](multiplatform-dsl-reference.md#targets) section. |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlinArtifacts {
    Native.Library("mylib") {
        target = linuxX64
        kotlinOptions {
            freeCompilerArgs += "-Xmen=pool"
        }
    }
    Native.Library("myslib") {
        target = linuxX64
        isStatic = false
        modes(DEBUG)
        addModule(project(":lib"))
        kotlinOptions {
            verbose = false
            freeCompilerArgs = emptyList()
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlinArtifacts {
    Native.Library("mylib") {
        // Binary configuration
    }
}
```

</tab>
</tabs>

The registered Gradle task is `assembleMyslibSharedLibrary` that assembles all types of registered "myslib" into a dynamic library.

#### Framework

For the framework configuration, the following additional parameters are available:

| **Name**       | **Description**                                                                                                                                        |
|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `target`       | Declares a particular target of a project. The names of available targets are listed in the [Targets](multiplatform-dsl-reference.md#targets) section. |
| `embedBitcode` | Declares the mode of bitcode embedding. Use `MARKER` to embed the bitcode marker (for debug builds) or `DISABLE` to turn off embedding.                |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlinArtifacts {
    Native.Framework("myframe") {
        modes(DEBUG, RELEASE)
        target = iosArm64
        isStatic = false
        embedBitcode = EmbedBitcodeMode.MARKER
        kotlinOptions {
            verbose = false
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlinArtifacts {
    Native.Library("mylib") {
        // Binary configuration
    }
}
```

</tab>
</tabs>

The registered Gradle task is `assembleMyframeFramework` that assembles all types of registered "myframe" framework.

> If for some reason the new DSL doesn't work for you, try [this workaround](multiplatform-build-native-binaries.md#export-dependencies-to-binaries)
> to export dependencies to binaries.
>
{type="tip"}

### Fat frameworks

By default, an Objective-C framework produced by Kotlin/Native supports only one platform. However, you can merge such
frameworks into a single universal (fat) binary. This especially makes sense for 32-bit and 64-bit iOS frameworks.
In this case, you can use the resulting universal framework on both 32-bit and 64-bit devices.

For the fat framework configuration, the following additional parameters are available:

| **Name**        | **Description**                                                                                                                         |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `targets`       | All targets of the project.                                                                                                             |
| `embedBitcode`  | Declares the mode of bitcode embedding. Use `MARKER` to embed the bitcode marker (for debug builds) or `DISABLE` to turn off embedding. |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlinArtifacts {
    Native.FatFramework("myfatframe") {
        targets(iosX32, ios64)
        embedBitcode = EmbedBitcodeMode.DISABLE
        kotlinOptions {
            suppressWarnings = false
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlinArtifacts {
    Native.Library("mylib") {
        // Binary configuration
    }
}
```

</tab>
</tabs>

The registered Gradle task is `assembleMyfatframeFatFramework` that assembles all types of registered "myfatframe" FatFramework.

> If for some reason the new DSL doesn't work for you, try [this workaround](multiplatform-build-native-binaries.md#build-universal-frameworks)
> to build fat frameworks.
>
{type="tip"}

### XCFrameworks

All Kotlin Multiplatform projects can use XCFrameworks as an output to gather logic for all the target platforms and
architectures in a single bundle. Unlike [universal (fat) frameworks](#fat-frameworks), you don't need to
remove all unnecessary architectures before publishing the application to the App Store.

For the XCFrameworks configuration, the following additional parameters are available:

| **Name**       | **Description**                                                                                                                         |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `targets`      | All targets of the project.                                                                                                             |
| `embedBitcode` | Declares the mode of bitcode embedding. Use `MARKER` to embed the bitcode marker (for debug builds) or `DISABLE` to turn off embedding. |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
Native.XCFramework("sdk") {
    targets(iosX64, iosArm64, iosSimulatorArm64)
    setModules(
        project(":shared"),
        project(":lib")
    )
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlinArtifacts {
    Native.Library("mylib") {
        // Binary configuration
    }
}
```

</tab>
</tabs>

The registered Gradle task is `assembleSdkXCFramework` that assembles all types of registered "sdk" FatFramework.

> If for some reason the new DSL doesn't work for you, try [this workaround](multiplatform-build-native-binaries.md#build-xcframeworks)
> to build XCFrameworks.
>
{type="tip"}

If you're using [CocoaPods integration](native-cocoapods.md) in your projects, you can build XCFrameworks with the Kotlin
CocoaPods Gradle plugin. It includes the following tasks that build XCFrameworks with all the registered targets and
generate podspec files:
* `podPublishReleaseXCFramework`, which generates a release XCFramework along with a podspec file.
* `podPublishDebugXCFramework`, which generates a debug XCFramework along with a podspec file.
* `podPublishXCFramework`, which generates both debug and release XCFrameworks along with a podspec file.

This can help you distribute shared parts of your project separately from mobile apps through CocoaPods. You can also use XCFrameworks
for publishing to private or public podspec repositories.

> Publishing Kotlin frameworks to public repositories is not recommended if those frameworks are built for different versions
> of Kotlin. Doing so might lead to conflicts in the end-users' projects.
>
{type="warning"}