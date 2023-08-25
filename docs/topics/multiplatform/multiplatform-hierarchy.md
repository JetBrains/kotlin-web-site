[//]: # (title: Hierarchical project structure)

Multiplatform projects support hierarchical source set structures.
This means you can arrange a hierarchy of intermediate source sets for sharing the common code among some, but not all,
[supported targets](multiplatform-dsl-reference.md#targets). Using intermediate source sets allows you to:

* **Provide a specialized API for some targets**. For example, a library can put an additional Native-specific APIs in an 
intermediate source set for Kotlin/Native targets but not for Kotlin/JVM ones 

* **Consume a specialized API for some targets**. Symmetrically to the previous point, if you want to benefit from a 
richer API a Kotlin Multiplatform Library provides for some targets, you'll need to have a respective intermediate 
source set

* **Use platform-dependent libraries in your project**. For example, you can have access to iOS-specific dependencies,

The Kotlin toolchain ensures that each source set has access only to the API that is available for all targets to which
that source set compiles. This prevents cases like using a Windows-specific API and then compiling it to macOS,
resulting in linkage errors or undefined behavior at runtime.

The recommended way to set up the source set hierarchy is to use the [Default Hierarchy Template](#default-hierarchy-template).
It covers the most popular cases only, so if you have an advanced project, you might have to resort to 
[Manual Configuration](#manual-configuration) - it's a more low-level approach, so it is more flexible, but requires more effort and knowledge. 

## Default Hierarchy Template

Starting with Kotlin 1.9.20, Kotlin Gradle Plugin is shipped with the so-called "Default Source Sets Hierarchy Template"
(or just "Default Hierarchy Template").

It's a [template](#see-the-full-hierarchy-template) that contains pre-defined intermediate source sets for some popular 
cases. Kotlin Gradle Plugin will set up those source sets automatically based on the targets in your project

Let's look at the example: 

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
  android()
  iosArm64()
  iosSimulatorArm64()
}
```

<<<<<<< HEAD
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

When you declare targets `android`, `iosArm64`, and `iosSimulatorArm64` in your code, the Kotlin Gradle plugin finds
suitable shared source sets from the template and creates them for you. The resulting hierarchy looks like this:

![An example of using the default hierarchy template](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

Green source sets are actually created and present in the project, while gray ones from the default template are
ignored. The Kotlin Gradle plugin hasn't created the `watchos` source set, for example, because there
are no watchOS targets in the project.

If you add a watchOS target, like `watchosArm64`, the `watchos` source set is created, and the code
from the `apple`, `native`, and `common` source sets is compiled to `watchosArm64` as well.

Kotlin Gradle Plugin creates type-safe accessors for all the source sets from the default hierarchy template, so you can
reference them without typical `by getting`/`by creating` pattern described in [Manual Configuration](#manual-configuration)

```kotlin
kotlin {
  android()
  iosArm64()
  iosSimulatorArm64()

  sourceSets {
    iosMain.dependencies {
      implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    }
  }
}
```


> In this example, the `apple` and `native` source sets compile only to the `iosArm64` and `iosSimulatorArm64` targets.
> Despite their names, they have access to the full iOS API.
> This can be counter-intuitive for source sets like `native`, as you might expect that only APIs available on all
> native targets are accessible in this source set. This behavior may change in the future.
>
{type="note"}

### Using manual source sets management together with the Default Hierarchy Template

Using `dependsOn` calls from the [Manual Configuration](#manual-configuration) will cancel the default application of the
hierarchy template for you project and provoke the following warning:

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

The following few sections will discuss several popular cases where you might see this warning, and what you can do

#### Replacing your manual configuration with the Default Hierarchy Template

**Case.** All added dependsOn-edges are covered by the Default Hierarchy Template. This can happen, for example, if 
you're migrating previously existing project to 1.9.20 or if you have used some code snippets written before 1.9.20.

**Solution.** Remove all the manual dependsOn-edges (`dependsOn`-calls) and instantiation of the intermediate source sets
(`by creating`-calls). 


#### Creating additional source sets alongside Default Hierarchy Template

**Case.** You don't want to change the source sets created by the Default Hierarchy Template, but you do want to create
a few additional source sets. For example, the Default Hierarchy Template doesn't provide a shared source set between JS
and JVM, but you need that source set in your project.

**Solution.** In such case, you can reapply the Default Hierarchy Template explicitly via calling `applyDefaultHierarchyTemplate()` 
and configure any additional source sets as usual (refer to [Manual Configuration](#manual-configuration)).

Example:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
  jvm()
  js { browser() }
  iosArm64()
  iosSimulatorArm64()

  // Apply default hierarchy back: it will create, for example, iosMain source set
  applyDefaultHierarchyTemplate()

  sourceSets {
    // Create an additional jsAndJvmMain source set
    val jsAndJvmMain by creating {
      dependsOn(commonMain.get())
    }

    jsMain.get().dependsOn(jsAndJvmMain)
    jvmMain.get().dependsOn(jsAndJvmMain)
  }
}
```

<<<<<<< HEAD
</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    // Enable the default target hierarchy:
    targetHierarchy.default {
      
    }

    jvm()
    iosArm64()
    // The rest of the other targets, if needed.

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

#### Modifying the source sets created by the Default Hierarchy Template

**Case.** You want to have a source set exactly with the same name as the one created by the Default Target Hierarchy,
but shared for a different set of targets. For example, you want to have a `nativeMain` shared not for all native 
targets, but only for the desktop ones: `linuxX64`, `mingwX64`, `macosX64`.

**Answer.** Unfortunately, as of Kotlin 1.9.20, there's no way to modify `dependsOn`-edges of the source sets created 
by the Default Hierarchy Template. This is not only because of the technical limitations: it is beneficial for the 
ecosystem to have a unified understanding of what `nativeMain` means. So, we'd kindly recommend you to try finding a 
differently named source set for your purposes - either in the Default Hierarchy Template, or created manually.

In the case you'd still prever to have `nativeMain` with the different sharing compared to the one created by the Default 
Hierarchy Template, you can opt-out from the template entirely by adding `kotlin.mpp.applyDefaultHierarchyTemplate=false`.
Of course, you will have to configure all other source sets manually as well. 

> We're currently working on an API to create your own hierarchy templates. It will be useful for projects
> whose hierarchy configurations are significantly different from the default template.
>
> This API is not ready yet, but if you're eager to try it,
> look into the `applyHierarchyTemplate { ... }` block and the declaration of `KotlinHierarchyTemplate.default` as an example.
> Keep in mind that this API is still in development. It might not be tested, and can change in further releases.
> 
{type="tip"}

#### See the full hierarchy template {initial-collapse-state="collapsed"}

When you declare the targets to which your project compiles,
the plugin picks the shared source sets based on the specified targets from the template and creates them in your project.

![Default hierarchy template](full-template-hierarchy.svg)

> This example only shows the production part of the project, omitting the `Main` suffix
> (for example, using `common` instead of `commonMain`). However, everything is the same for `*Test` sources as well.
>
{type="tip"}

<<<<<<< HEAD
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
    ios() // iOS device and the iosX64 simulator target; iosMain and iosTest source sets
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    ios() // iOS device and the iosX64 simulator target; iosMain and iosTest source sets
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
