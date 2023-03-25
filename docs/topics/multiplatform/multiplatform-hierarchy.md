[//]: # (title: Hierarchical project structure)

Multiplatform projects support hierarchical structures.
This means you can form a hierarchy of intermediate source sets for sharing the common code among some, but not all,
[supported targets](multiplatform-dsl-reference.md#targets). Introducing intermediate source sets has some important advantages:

* If you're a library author, you might want to provide a specialized API for some, but not all targets. For example,
  an intermediate source set for Kotlin/Native targets, but not for Kotlin/JVM may come in handy.
* You might want to use platform-dependent libraries in your project. Introducing an intermediate source set allows
  you to utilize that specialized API among several native targets. For example,
  having access to iOS-specific dependencies like Foundation when sharing code across all iOS targets.
* Some libraries aren't available for some platforms. Specifically, native libraries are only available for source sets
  that compile to Kotlin/Native. Intermediate source set will solve this issue.
* The Kotlin toolchain ensures that each source set has access only to the API that is available for all targets to which
  this source set compiles. This prevents cases like using Windows-specific API and then compiling it to macOS,
  getting linkage errors or even undefined behavior at runtime.

There are 3 ways to create a target hierarchy:

* [Specify all targets and enable default hierarchy](multiplatform-hierarchy.md#default-hierarchy)
* [Use target shortcuts available for typical cases](multiplatform-hierarchy.md#target-shortcuts)
* [Manually declare and connect the source sets](multiplatform-hierarchy.md#manual-configuration)

## Default hierarchy

> The default target hierarchy is [Experimental](components-stability.md#stability-levels-explained). It may
> be changed in future Kotlin releases without prior notice.
> For the Kotlin Gradle build scripts, opt-in is required with `@OptIn(ExperimentalKotlinGradlePluginApi::class)`.
>
{type="warning"}

Starting with Kotlin 1.8.20, you can set up source set hierarchy in your multiplatform projects with default target hierarchy.
It's a [template](#see-the-full-hierarchy-template) for all possible targets and their shared source sets hardcoded in the Kotlin Gradle plugin.

### Set up your project

To set up a hierarchy, call `targetHierarchy.default()` in the `kotlin` block of your `build.gradle(.kts)` and list all the targets you need.
For example:

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

When you declare final targets `android`, `iosArm64`, and `iosSimulatorArm64` in your code, the Kotlin Gradle plugin finds
suitable shared source sets from the template and creates them for you. The resulting hierarchy looks like this:

![An example of using the default target hierarchy](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

Green source sets are actually created and present in the project, while gray ones from the default template are
ignored. As you can see, The Kotlin Gradle plugin hasn't created the `watchos` source set, for example, because there
are no watchOS targets in the project.

If you add a watchOS target, like `watchosArm64`, the `watchos` source set is created, and the code
from `apple`, `native`, and `common` source sets is compiled to `watchosArm64` as well.

> In this example, `apple` and `native` source sets compile only to `iosArm64` and `iosSimulatorArm64` targets.
> Therefore, despite their names, they have access to the full iOS API.
> This might be counter-intuitive for source sets like `native`, as you may expect that only APIs available on all
> native targets are accessible in this source set. This behavior may change in the future.
>
{type="note"}

### Adjust resulting hierarchy

If necessary, you can further configure the resulting hierarchy manually [using the dependsOn relation](#manual-configuration).
To do that, apply the `by getting` construction for the source sets created with `targetHierarchy.default()`.

Consider this example of a project with a source set shared between the `jvm` and `native` targets only:

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

> We're currently working on API for creating your own target hierarchies. It should be useful for projects
> which hierarchy configurations differ a lot from the default template.
>
> At the moment, this API is not ready yet. But if you're eager to try it,
> look into the `targetHierarchy.custom { ... }` block and the declaration of `targetHierarchy.default()` as an example.
> Keep in mind that this API is still in development. It might be under-tested, and can change dramatically in further releases.
> 
{type="tip"}

#### See the full hierarchy template {initial-collapse-state="collapsed"}

When you declare the targets to which your project compiles,
the plugin picks shared source sets based on the specified targets from the template and creates them in your project.

![Default target hierarchy](full-template-hierarchy.svg)

> Here and below we focus only on the production part of the project, omitting the suffix `Main` (for example, using `common` instead of `commonMain`).
> However, everything is the same for `*Test` sources as well.
>
{type="tip"}

## Target shortcuts

The Kotlin Multiplatform plugin provides some pre-defined target shortcuts for creating structures of common target
combinations:

| Target shortcut | Targets                                      |
|-----------------|----------------------------------------------|
| `ios`           | `iosArm64`, `iosX64`                         |
| `watchos`       | `watchosArm32`, `watchosArm64`, `watchosX64` |
| `tvos`          | `tvosArm64`, `tvosX64`                       |

All shortcuts create similar hierarchical structures in the code. For example, you can create a multiplatform project
with two iOS-related targets, `iosArm64` and `iosX64` and a shared source set with the `ios()` shortcut:

```kotlin
kotlin {
    ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```

In this case, the hierarchical structure includes intermediate source sets `iosMain` and `iosTest`,
which are used by the platform-specific source sets:

![Code shared for iOS targets](iosmain-hierarchy.png)

The resulting hierarchical structure will look like this:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    ios()
    
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
    ios()
    
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

The target shortcuts `ios`, `watchos`, and `tvos` don't include the simulator targets for ARM64 (Apple Silicon)
platforms: `iosSimulatorArm64`, `watchosSimulatorArm64`, and `tvosSimulatorArm64`. If you use the target shortcuts
and want to build the project for an Apple Silicon simulator, adjust the build script the following way:

1. Add the `*SimulatorArm64` simulator target you need.
2. Connect the simulator target with the shortcut using the source set dependencies (`dependsOn`).

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

For example, if you want to share code among native Linux, Windows, and macOS targets – `linuxX64`, `mingwX64`, and
`macosX64`:

![Manually configured hierarchical structure](manual-hierarchical-structure.png)

1. Add the intermediate source set `desktopMain` that holds the shared logic for these targets.
2. Specify the hierarchy of source sets using the `dependsOn` relation.

The resulting hierarchical structure will look like this:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64Main()
    mingwX64Main()
    macosX64Main()
  
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
    linuxX64Main()
    mingwX64Main()
    macosX64Main()
  
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