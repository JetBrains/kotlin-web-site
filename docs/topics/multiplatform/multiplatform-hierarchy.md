[//]: # (title: Hierarchical project structure)

Starting with Kotlin 1.6.20, every new multiplatform project comes with a hierarchical project structure. This means
that source
sets form a hierarchy for sharing the common code among several targets. It opens up a variety of opportunities,
including using platform-dependent libraries in common source sets and the ability to share code when creating
multiplatform
libraries.

With the new hierarchical project structure support, you can share code among some, but not all,
[targets](multiplatform-dsl-reference.md#targets) in a multiplatform project.

You can also use platform-dependent libraries, such as `UIKit` and `POSIX`, in source sets shared among several native
targets. One popular case is having access to iOS-specific dependencies like `Foundation` when sharing code across all
iOS targets. The new structure helps you share more native code without being limited by platform-specific dependencies.

A hierarchical project structure allows reusing code in similar targets, as well as publishing and consuming libraries
with granular APIs targeting similar platforms.

The Kotlin toolchain will automatically figure out the API available in the consumer source set while checking for
unsafe usages, like using an API meant for the JVM in JS code.

You can create a hierarchical structure with target shortcuts
available for typical multi-target scenarios, or you can manually declare and connect the source sets.

The Kotlin toolchain will provide the correct default dependencies and locate the API surface area available in the
shared
code. This prevents cases like the use of a macOS-specific function in code shared for Windows.

## Default hierarchy

> The new approach to source set hierarchy is [Experimental](components-stability.md#stability-levels-explained). It may
> be changed in future Kotlin releases without prior notice.
> For the Kotlin Gradle build scripts, ppt-in is required with `@OptIn(ExperimentalKotlinGradlePluginApi::class)`.
>
{type="warning"}

Starting with Kotlin 1.8.20, you can try a new way of setting up source set hierarchy in your multiplatform projects
− default target hierarchy.

The Kotlin Gradle plugin has a default target hierarchy hardcoded in its sources. You can think of it as a template
for all possible targets and their shared source sets. When you explicitly declare all the targets to which your project
compiles, the plugin automatically creates shared source sets based on the specified targets.

#### See the full hierarchy template {initial-collapse-state="collapsed"}

![Default target hierarchy](full-template-hierarchy.png)

> Here and below we focus only on the production part of the project, omitting the suffix `Main` (for example, using `common` instead of `commonMain`).
> however, everything is the same for `*Test` sources as well.
> 
{type="tip"}

### Set up your project

Consider this example of a simple multiplatform mobile app:

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)

kotlin {
    // Enable the default target hierarchy:
    targetHierarchi.default()

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

When you declare final targets `android`, `iosArm64`, and `iosSimulatorArm64` in your code, the Kotlin Gradle plugin finds
suitable shared source sets from the template and creates them for you. The resulting hierarchy looks like this:

![An example of using the default target hierarchy](default-hierarchy-example.png)

Green source sets are actually created and present in the project, while gray ones from the default template are
ignored. As you can see, The Kotlin Gradle plugin hasn’t created the `watchos` source set, for example, because there
are no WatchOS targets in the project.

If you add a WatchOS target, like `watchosArm64`, the `watchos` source set is created, and the code
from `apple`, `native`, and `common` source sets is compiled to `watchosArm64` as well.

> In this example, `apple` and `native` source sets compile only to `iosArm64` and `iosSimulatorArm64` targets.
> Therefore, despite their names, they have access to the full iOS API.
> This might be counter-intuitive for source sets like `native`, as you may expect that only APIs available on all
> native targets are accessible in this source set. This behavior may change in the future.
>
{type="note"}

### Customization

If necessary, you can further [configure the resulting hierarchy manually](#configure-the-hierarchical-structure-manually).
To do that, apply the `by getting` construction for the source sets created with `targetHierarchy.default()`.

Consider this example of a project with a source set shared between the `jvm` and `native` targets only:

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)

kotlin {
    // Enable the default target hierarchy:
    targetHierarchi.default()

    jvm()
    iosArm64()
    // the rest of the necessary targets...

    sourceSets {
        val commonMain by getting

        val jvmAndNaitveMain by creating {
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

> We're currently working on API for creating your own target hierarchies. This should be useful for projects
> which hierarchy configurations differ a lot from the template from `targetHierarchy.default()`.
>
> At the moment, we're still iterating over this API and not ready to show it yet. If you're eager to try it,
> look into the `targetHierarchy.custom { ... }` block and the declaration of `targetHierarchy.default()` as an example.
> Keep in mind that this API is still in development. It might be under-tested, and can change dramatically in further releases.
> 
{type="tip"}

### Use target shortcuts

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
    sourceSets {
        val commonMain by sourceSets.getting
        val iosX64Main by sourceSets.getting
        val iosArm64Main by sourceSets.getting
        val iosMain by sourceSets.creating {
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
platforms:
`iosSimulatorArm64`, `watchosSimulatorArm64`, and `tvosSimulatorArm64`. If you use the target shortcuts and want to
build
the project for an Apple Silicon simulator, adjust the build script the following way:

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

### Configure the hierarchical structure manually

To create the hierarchical structure manually, introduce an intermediate source set that holds the shared code for
several
targets and create a structure of the source sets including the intermediate one.

For example, if you want to share code among native Linux, Windows, and macOS targets – `linuxX64M`, `mingwX64`, and
`macosX64`:

![Manually configured hierarchical structure](manual-hierarchical-structure.png)

1. Add the intermediate source set `desktopMain` that holds the shared logic for these targets.
2. Specify the hierarchy of source sets using the `dependsOn` relation.

The resulting hierarchical structure will look like this:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val desktopMain by creating {
            dependsOn(commonMain)
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
    sourceSets {
        desktopMain {
            dependsOn(commonMain)
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