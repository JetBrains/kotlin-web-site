[//]: # (title: Hierarchical project structure)

Multiplatform projects support hierarchical structures.
This means you can arrange a hierarchy of intermediate source sets for sharing the common code among some, but not all,
[supported targets](multiplatform-dsl-reference.md#targets). Using intermediate source sets has some important advantages:

* If you're a library author and you want to provide a specialized API, you can use an intermediate source set for some,
  but not all, targets – for example, an intermediate source set for Kotlin/Native targets but not for Kotlin/JVM ones.
* If you want to use platform-dependent libraries in your project, you can use an intermediate source set
  to use that specific API in several native targets. For example, you can have access to iOS-specific dependencies,
  such as Foundation, when sharing code across all iOS targets.
* Some libraries aren't available for particular platforms. Specifically, native libraries are only available for source
  sets that compile to Kotlin/Native. Using an intermediate source set will solve this issue.

The Kotlin toolchain ensures that each source set has access only to the API that is available for all targets to which
that source set compiles. This prevents cases like using a Windows-specific API and then compiling it to macOS,
resulting in linkage errors or undefined behavior at runtime.

There are 3 ways to create a target hierarchy:

* [Specify all targets and enable the default hierarchy](multiplatform-hierarchy.md#default-hierarchy)
* [Use target shortcuts available for typical cases](multiplatform-hierarchy.md#target-shortcuts)
* [Manually declare and connect the source sets](multiplatform-hierarchy.md#manual-configuration)

## Default hierarchy

> The default target hierarchy is [Experimental](components-stability.md#stability-levels-explained). It may
> be changed in future Kotlin releases without prior notice.
> For Kotlin Gradle build scripts, opting in is required with `@OptIn(ExperimentalKotlinGradlePluginApi::class)`.
>
{type="warning"}

Starting with Kotlin 1.8.20, you can set up a source set hierarchy in your multiplatform projects with the default target hierarchy.
It's a [template](#see-the-full-hierarchy-template) for all possible targets and their shared source sets hardcoded in the Kotlin Gradle plugin.

### Set up your project

To set up a hierarchy, call `targetHierarchy.default()` in the `kotlin` block of your `build.gradle(.kts)` file and list
all of the targets you need. For example:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // Enable the default target hierarchy:
    targetHierarchy.default()

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
  // Enable the default target hierarchy:
    targetHierarchy.default {
      
    }

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

</tab>
</tabs>

When you declare the final targets `android`, `iosArm64`, and `iosSimulatorArm64` in your code, the Kotlin Gradle plugin finds
suitable shared source sets from the template and creates them for you. The resulting hierarchy looks like this:

![An example of using the default target hierarchy](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

Green source sets are actually created and present in the project, while gray ones from the default template are
ignored. The Kotlin Gradle plugin hasn't created the `watchos` source set, for example, because there
are no watchOS targets in the project.

If you add a watchOS target, like `watchosArm64`, the `watchos` source set is created, and the code
from the `apple`, `native`, and `common` source sets is compiled to `watchosArm64` as well.

> In this example, the `apple` and `native` source sets compile only to the `iosArm64` and `iosSimulatorArm64` targets.
> Despite their names, they have access to the full iOS API.
> This can be counter-intuitive for source sets like `native`, as you might expect that only APIs available on all
> native targets are accessible in this source set. This behavior may change in the future.
>
{type="note"}

### Adjust the resulting hierarchy

You can further configure the resulting hierarchy manually [using the `dependsOn` relation](#manual-configuration).
To do so, apply the `by getting` construction for the source sets created with `targetHierarchy.default()`.

Consider this example of a project with a source set shared between the `jvm` and `native` targets only:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // Enable the default target hierarchy:
    targetHierarchy.default()

    jvm()
    iosArm64()
    // the rest of the necessary targets...

    sourceSets {
        val commonMain by getting

        val jvmAndNativeMain by creating {
            dependsOn(commonMain)
        }

        val nativeMain by getting {
            dependsOn(jvmAndNativeMain)
        }

        val jvmMain by getting {
            dependsOn(jvmAndNativeMain)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    // Enable the default target hierarchy:
    targetHierarchy.default {
      
    }

    jvm()
    iosArm64()
    // the rest of the necessary targets...

    sourceSets {
        commonMain {
          
        }

        jvmAndNativeMain {
            dependsOn(commonMain)
        }

        nativeMain {
            dependsOn(jvmAndNativeMain)
        }

        jvmMain {
            dependsOn(jvmAndNativeMain)
        }
    }
}
```

</tab>
</tabs>

It can be cumbersome to remove `dependsOn` relations that are automatically created by the `targetHierarchy.default()` call.
In that case, use an entirely [manual configuration](#manual-configuration) instead of calling the default hierarchy.

> We're currently working on an API to create your own target hierarchies. It will be useful for projects
> whose hierarchy configurations are significantly different from the default template.
>
> This API is not ready yet, but if you're eager to try it,
> look into the `targetHierarchy.custom { ... }` block and the declaration of `targetHierarchy.default()` as an example.
> Keep in mind that this API is still in development. It might not be tested, and can change in further releases.
> 
{type="tip"}

#### See the full hierarchy template {initial-collapse-state="collapsed"}

When you declare the targets to which your project compiles,
the plugin picks the shared source sets based on the specified targets from the template and creates them in your project.

![Default target hierarchy](full-template-hierarchy.svg)

> This example only shows the production part of the project, omitting the `Main` suffix
> (for example, using `common` instead of `commonMain`). However, everything is the same for `*Test` sources as well.
>
{type="tip"}

## Target shortcuts

The Kotlin Multiplatform plugin provides some predefined target shortcuts for creating structures for common target
combinations:

| Target shortcut | Targets                                      |
|-----------------|----------------------------------------------|
| `ios`           | `iosArm64`, `iosX64`                         |
| `watchos`       | `watchosArm32`, `watchosArm64`, `watchosX64` |
| `tvos`          | `tvosArm64`, `tvosX64`                       |

All shortcuts create similar hierarchical structures in the code. For example, you can use the`ios()` shortcut to create
a multiplatform project with 2 iOS-related targets, `iosArm64` and `iosX64`, and a shared source set:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```

</tab>
</tabs>

In this case, the hierarchical structure includes the intermediate source sets `iosMain` and `iosTest`,
which are used by the platform-specific source sets:

![Code shared for iOS targets](iosmain-hierarchy.png)

The resulting hierarchical structure will be equivalent to the code below:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    iosX64()
    iosArm64()
    
    sourceSets {
        val commonMain by getting
        val iosX64Main by getting
        val iosArm64Main by getting
        val iosMain by creating {
            dependsOn(commonMain)
            iosX64Main.dependsOn(this)
            iosArm64Main.dependsOn(this)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    iosX64()
    iosArm64()
    
    sourceSets {
        iosMain {
            dependsOn(commonMain)
            iosX64Main.dependsOn(it)
            iosArm64Main.dependsOn(it)
        }
    }
}
```

</tab>
</tabs>

#### Target shortcuts and ARM64 (Apple Silicon) simulators

The `ios`, `watchos`, and `tvos` target shortcuts don't include the simulator targets for ARM64 (Apple Silicon)
platforms: `iosSimulatorArm64`, `watchosSimulatorArm64`, and `tvosSimulatorArm64`. If you use the target shortcuts
and want to build the project for an Apple Silicon simulator, make the following adjustment to the build script:

1. Add the `*SimulatorArm64` simulator target you need.
2. Connect the simulator target with the shortcut using the `dependsOn` relation between source sets.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    ios()
    // Add the ARM64 simulator target
    iosSimulatorArm64()

    val iosMain by sourceSets.getting
    val iosTest by sourceSets.getting
    val iosSimulatorArm64Main by sourceSets.getting
    val iosSimulatorArm64Test by sourceSets.getting

    // Set up dependencies between the source sets
    iosSimulatorArm64Main.dependsOn(iosMain)
    iosSimulatorArm64Test.dependsOn(iosTest)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    ios()
    // Add the ARM64 simulator target
    iosSimulatorArm64()

    // Set up dependencies between the source sets
    sourceSets {
        // ...
        iosSimulatorArm64Main {
            dependsOn(iosMain)
        }
        iosSimulatorArm64Test {
            dependsOn(iosTest)
        }
    }
}
```

</tab>
</tabs>

## Manual configuration

You can manually introduce an intermediate source in the source set structure.
It will hold the shared code for several targets.

For example, here’s what to do if you want to share code among native Linux,
Windows, and macOS targets (`linuxX64`, `mingwX64`, and `macosX64`):

![Manually configured hierarchical structure](manual-hierarchical-structure.png)

1. Add the intermediate source set `desktopMain`, which holds the shared logic for these targets.
2. Specify the source set hierarchy using the `dependsOn` relation.

The resulting hierarchical structure will look like this:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64()
    mingwX64()
    macosX64()
  
    sourceSets {
        val desktopMain by creating {
            dependsOn(commonMain.get())
        }
        val linuxX64Main by getting {
            dependsOn(desktopMain)
        }
        val mingwX64Main by getting {
            dependsOn(desktopMain)
        }
        val macosX64Main by getting {
            dependsOn(desktopMain)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64()
    mingwX64()
    macosX64()
  
    sourceSets {
        desktopMain {
            dependsOn(commonMain.get())
        }
        linuxX64Main {
            dependsOn(desktopMain)
        }
        mingwX64Main {
            dependsOn(desktopMain)
        }
        macosX64Main {
            dependsOn(desktopMain)
        }
    }
}
```

</tab>
</tabs>

You can have a shared source set for the following combinations of targets:

* JVM or Android + JS + Native
* JVM or Android + Native
* JS + Native
* JVM or Android + JS
* Native

Kotlin doesn't currently support sharing a source set for these combinations:

* Several JVM targets
* JVM + Android targets
* Several JS targets

If you need to access platform-specific APIs from a shared native source set, IntelliJ IDEA will help you detect common
declarations that you can use in the shared native code.
For other cases, use the Kotlin mechanism of [expected and actual declarations](multiplatform-connect-to-apis.md).