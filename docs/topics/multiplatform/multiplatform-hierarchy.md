[//]: # (title: Hierarchical project structure)

Multiplatform projects support hierarchical source set structures.
This means you can arrange a hierarchy of intermediate source sets for sharing the common code among some, but not all,
[supported targets](multiplatform-dsl-reference.md#targets). Using intermediate source sets helps you to:

* Provide a specific API for some targets. For example, a library can add native-specific APIs in an
  intermediate source set for Kotlin/Native targets but not for Kotlin/JVM ones.
* Consume a specific API for some targets. For example, to benefit from a rich API that the Kotlin Multiplatform
  library provides for some targets that form an intermediate source set.
* Use platform-dependent libraries in your project. For example, you can access to iOS-specific dependencies from
  the intermediate iOS source set.

The Kotlin toolchain ensures that each source set has access only to the API that is available for all targets to which
that source set compiles. This prevents cases like using a Windows-specific API and then compiling it to macOS,
resulting in linkage errors or undefined behavior at runtime.

The recommended way to set up the source set hierarchy is to use the [default hierarchy template](#default-hierarchy-template).
The template covers most popular cases. If you have a more advanced project, you can [configure it manually](#manual-configuration).
It's a more low-level approach: it's more flexible but requires more effort and knowledge.

## Default hierarchy template

Starting with Kotlin 1.9.20, the Kotlin Gradle plugin has a built-in default [hierarchy template](#see-the-full-hierarchy-template).
It contains pre-defined intermediate source sets for some popular use cases.
The plugin sets up those source sets automatically based on the targets specified in your project.

Let's look at the example:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget()
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
reference them without `by getting` or `by creating` constructions compared to the [manual configuration](#manual-configuration)

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%"'
            }
        }
    }
}
```

</tab>
</tabs>

> In this example, the `apple` and `native` source sets compile only to the `iosArm64` and `iosSimulatorArm64` targets.
> Despite their names, they have access to the full iOS API.
> This can be counter-intuitive for source sets like `native`, as you might expect that only APIs available on all
> native targets are accessible in this source set. This behavior may change in the future.
>
{type="note"}

### Additional configuration

You might need to make adjustments to the default hierarchy template. If you had previously introduced intermediate sources
[manually](#manual-configuration) with `dependsOn` calls, it cancels the application of the default
hierarchy template, and you get the following warning:

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

To solve this issue, configure your project by doing one of the following:

* [Replace your manual configuration with the default hierarchy template](#replacing-manual-configuration)
* [Create additional source sets in the default hierarchy template](#creating-additional-source-sets)
* [Modify the source sets created by the default hierarchy template](#modifying-source-sets)

#### Replacing manual configuration

**Case**. All your intermediate source sets are currently covered by the default hierarchy template.

**Solution**. Remove all manual `dependsOn()` calls and source sets with `by creating` constructions.
To check the list of all default source sets, see the [full hierarchy template](#see-the-full-hierarchy-template).

#### Creating additional source sets

**Case**. You want to add source sets that the default hierarchy template doesn't provide yet,
for example, between a macOS and a JVM target.

**Solution**:

1. Reapply the template by explicitly calling `applyDefaultHierarchyTemplate()`.
2. Configure additional source sets [manually](#manual-configuration) using `dependsOn()`:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }
    
            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
            jvmAndMacos {
                dependsOn(commonMain.get())
            }
            jvmAndMacos  {
                dependsOn(macosArm64Main.get())
            }
            jvmAndMacos  {
                dependsOn(jvmMain.get())
            }
        } 
    }
    ```

    </tab>
    </tabs>

#### Modifying source sets

**Case**. You already have the source sets with the exact same names as those generated by the template but shared among
different sets of targets in your project. For example, a `nativeMain` source set shared among not all the native
targets but only the desktop ones: `linuxX64`, `mingwX64`, and `macosX64`.

**Solution**. There's currently no way to modify the default `dependsOn` relations among the template's source sets.
It's also important that the implementation and the meaning of source sets, for example,
`nativeMain`, are the same in all projects.

However, you still can do one of the following:

* Find different source sets for your purposes, either in the default hierarchy template or ones that have been manually created.
* Opt out of the template completely by adding `kotlin.mpp.applyDefaultHierarchyTemplate=false`
  to your `gradle.properties` file and configure all source sets manually.

> We're currently working on an API to create your own hierarchy templates. It will be useful for projects
> whose hierarchy configurations are significantly different from the default template.
>
> This API is not ready yet, but if you're eager to try it,
> look into the `applyHierarchyTemplate {}` block and the declaration of `KotlinHierarchyTemplate.default` as an example.
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