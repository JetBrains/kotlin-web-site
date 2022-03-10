[//]: # (title: Build final native binaries)

By default, a Kotlin/Native target is compiled down to a `*.klib` library artifact, which can be consumed by Kotlin/Native 
itself as a dependency but cannot be executed or used as a native library.
 
To declare final native binaries such as executables or shared libraries, use the `binaries` property of a native target. 
This property represents a collection of native binaries built for this target in addition to the default `*.klib` artifact 
and provides a set of methods for declaring and configuring them.
 
> The `kotlin-multiplatform` plugin doesn't create any production binaries by default. The only binary available by default 
> is a debug test executable that lets you run unit tests from the `test` compilation.
>
{type="note"}

## Declare binaries

Use the following factory methods to declare elements of the `binaries` collection. 

| Factory method | Binary kind | Available for |
|----------------|-------------|---------------|
| `executable` | Product executable | All native targets |
| `test` | Test executable | All native targets |
| `sharedLib` | Shared native library | All native targets, except for `WebAssembly` |
| `staticLib` | Static native library | All native targets, except for `WebAssembly` |
| `framework` | Objective-C framework | macOS, iOS, watchOS, and tvOS targets only |

The simplest version doesn't require any additional parameters and creates one binary for each build type. Currently, 
two build types are available: 

* `DEBUG`  – produces a non-optimized binary with debug information 
* `RELEASE`  – produces an optimized binary without debug information

The following snippet creates two executable binaries: debug and release.

```kotlin
kotlin {
    linuxX64 { // Use your target instead.
        binaries {
            executable {
                // Binary configuration.
            }
        }
    }
}
```

You can drop the lambda if there is no need for [additional configuration](multiplatform-dsl-reference.md#native-targets):

```kotlin
binaries {
    executable()
}
```

You can specify for which build types to create binaries. In the following example, only the `debug` executable is created.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // Binary configuration.
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable([DEBUG]) {
        // Binary configuration.
    }
}
```

</tab>
</tabs>

You can also declare binaries with custom names.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // Binary configuration.
    }

    // It's possible to drop the list of build types (in which case, all the available build types will be used).
    executable("bar") {
        // Binary configuration.
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // Binary configuration.
    }

    // It's possible to drop the list of build types (in which case, all the available build types will be used).
    executable('bar') {
        // Binary configuration.
    }
}
```

</tab>
</tabs>

The first argument sets a name prefix, which is the default name for the binary file. For example, for Windows the code 
produces the files `foo.exe` and `bar.exe`. You can also use the name prefix to [access the binary in the build script](#access-binaries).
 
## Access binaries

You can access binaries to [configure them](multiplatform-dsl-reference.md#native-targets) or get their properties (for example, the path to an output file). 

You can get a binary by its unique name. This name is based on the name prefix (if it is specified), build type, and 
binary kind following the pattern: `<optional-name-prefix><build-type><binary-kind>`, for example, `releaseFramework` or 
`testDebugExecutable`.

> Static and shared libraries have the suffixes static and shared respectively, for example, `fooDebugStatic` or `barReleaseShared`. 
>
{type="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// Fails if there is no such binary.
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// Returns null if there is no such binary.
binaries.findByName("fooDebugExecutable")
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// Fails if there is no such binary.
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// Returns null if there is no such binary.
binaries.findByName('fooDebugExecutable')
```

</tab>
</tabs>

Alternatively, you can access a binary by its name prefix and build type using typed getters.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// Fails if there is no such binary.
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // Skip the first argument if the name prefix isn't set.
binaries.getExecutable("bar", "DEBUG") // You also can use a string for build type.

// Similar getters are available for other binary kinds:
// getFramework, getStaticLib and getSharedLib.

// Returns null if there is no such binary.
binaries.findExecutable("foo", DEBUG)

// Similar getters are available for other binary kinds:
// findFramework, findStaticLib and findSharedLib.
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// Fails if there is no such binary.
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // Skip the first argument if the name prefix isn't set.
binaries.getExecutable('bar', 'DEBUG') // You also can use a string for build type.

// Similar getters are available for other binary kinds:
// getFramework, getStaticLib and getSharedLib.

// Returns null if there is no such binary.
binaries.findExecutable('foo', DEBUG)

// Similar getters are available for other binary kinds:
// findFramework, findStaticLib and findSharedLib.
```

</tab>
</tabs>

## Export dependencies to binaries

When building an Objective-C framework or a native library (shared or static), you may need to pack not just the classes 
of the current project, but also the classes of its dependencies. Specify which dependencies to export to a binary using 
the `export` method.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        macosMain.dependencies {
            // Will be exported.
            api(project(":dependency"))
            api("org.example:exported-library:1.0")
            // Will not be exported.
            api("org.example:not-exported-library:1.0")
        }
    }
    macosX64("macos").binaries {
        framework {
            export(project(":dependency"))
            export("org.example:exported-library:1.0")
        }
        sharedLib {
            // It's possible to export different sets of dependencies to different binaries.
            export(project(':dependency'))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        macosMain.dependencies {
            // Will be exported.
            api project(':dependency')
            api 'org.example:exported-library:1.0'
            // Will not be exported.
            api 'org.example:not-exported-library:1.0'
        }
    }
    macosX64("macos").binaries {
        framework {
            export project(':dependency')
            export 'org.example:exported-library:1.0'
        }
        sharedLib {
            // It's possible to export different sets of dependencies to different binaries.
            export project(':dependency')
        }
    }
}
```

</tab>
</tabs>

> You can export only [`api` dependencies](gradle.md#dependency-types) of the corresponding source set.  
> You can export maven dependencies, but due to current limitations of Gradle metadata, such a dependency should be 
> either a platform dependency (for example,  `kotlinx-coroutines-core-native_debug_macos_x64` instead of 
> `kotlinx-coroutines-core-native`) or be exported transitively.
>
{type="note"}

By default, export works non-transitively. This means that if you export the library `foo` depending on the library `bar`, 
only methods of `foo` are added to the output framework.

You can change this behavior using the `transitiveExport` option. If set to `true`, the declarations of the library `bar` 
are exported as well. 

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // Export transitively.
        transitiveExport = true
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
   framework {
       export project(':dependency')
       // Export transitively.
       transitiveExport = true
   }
}
```

</tab>
</tabs>

For example, assume that you write several modules in Kotlin and then want to access them from Swift. Since usage of 
several Kotlin/Native frameworks in one Swift application is limited, you can create a single umbrella framework and 
export all these modules to it.

## Build universal frameworks

By default, an Objective-C framework produced by Kotlin/Native supports only one platform. However, you can merge such 
frameworks into a single universal (fat) binary using the [`lipo` tool](https://llvm.org/docs/CommandGuide/llvm-lipo.html). 
This operation especially makes sense for 32-bit and 64-bit iOS frameworks. In this case, you can use the resulting universal 
framework on both 32-bit and 64-bit devices.
 
> The fat framework must have the same base name as the initial frameworks.
>
{type="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // Create and configure the targets.
    val ios32 = iosArm32("ios32")
    val ios64 = iosArm64("ios64")
    configure(listOf(ios32, ios64)) {
        binaries.framework {
            baseName = "my_framework"
        }
    }
    // Create a task to build a fat framework.
    tasks.register<FatFrameworkTask>("debugFatFramework") {
        // The fat framework must have the same base name as the initial frameworks.
        baseName = "my_framework"
        // The default destination directory is "<build directory>/fat-framework".
        destinationDir = buildDir.resolve("fat-framework/debug")
        // Specify the frameworks to be merged.
        from(
                ios32.binaries.getFramework("DEBUG"),
                ios64.binaries.getFramework("DEBUG")
        )
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // Create and configure the targets.
    targets {
        iosArm32("ios32")
        iosArm64("ios64")
        configure([ios32, ios64]) {
            binaries.framework {
                baseName = "my_framework"
            }
        }
    }
    // Create a task building a fat framework.
    tasks.register("debugFatFramework", FatFrameworkTask) {
        // The fat framework must have the same base name as the initial frameworks.
        baseName = "my_framework"
        // The default destination directory is "<build directory>/fat-framework".
        destinationDir = file("$buildDir/fat-framework/debug")
        // Specify the frameworks to be merged.
        from(
                targets.ios32.binaries.getFramework("DEBUG"),
                targets.ios64.binaries.getFramework("DEBUG")
        )
    }
}
```

</tab>
</tabs>

## Build XCFrameworks

All Kotlin Multiplatform projects can use XCFrameworks as an output to gather logic for all the target platforms and architectures in a single bundle.
Unlike [universal (fat) frameworks](#build-universal-frameworks), you don't need to remove all unnecessary architectures before publishing the application to the App Store.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform")
}

kotlin {
    val xcf = XCFramework()
  
    ios {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
    watchos {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
    tvos {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform'
}

kotlin {
    def xcf = new XCFrameworkConfig(project)

    ios {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
    watchos {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
    tvos {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
}
```

</tab>
</tabs>

When you declare XCFrameworks, Kotlin Gradle plugin will register three Gradle tasks:
* `assembleXCFramework`
* `assembleDebugXCFramework` (additionally debug artifact that contains [dSYMs](native-ios-symbolication.md))
* `assembleReleaseXCFramework`

If you're using [CocoaPods integration](native-cocoapods.md) in your projects, you can build XCFrameworks with the Kotlin
CocoaPods Gradle plugin. It has the following tasks that build XCFrameworks with all registered targets and generate the podspec file:
* `podPublishReleaseXCFramework` – generates a release XCFramework along with a podspec file
* `podPublishDebugXCFramework` – generates a debug XCFramework along with a podspec file
* `podPublishXCFramework` – generates both debug and release XCFrameworks along with a podspec file

This can help you distribute shared parts separately from mobile apps through CocoaPods. You can further use XCFrameworks
for publishing to private or public podspec repositories.

> Publishing Kotlin frameworks to public repositories is not recommended if the frameworks are built for different versions
> of Kotlin. It might lead to conflicts in the end-users projects.
>
{type="warning"}