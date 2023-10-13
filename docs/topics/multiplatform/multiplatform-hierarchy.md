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

The recommended way to set up the source set hierarchy is to use the [default hierarchy template](#default-hierarchy-template).
The template covers most popular cases. If you have a more advanced project, you can [configure it manually](#manual-configuration).
It's a more low-level approach: it's more flexible, but requires more effort and knowledge. 

## Default hierarchy template

The Kotlin Gradle plugin has a built-in default [hierarchy template](#see-the-full-hierarchy-template).
It contains pre-defined intermediate source sets for some popular use cases.
The plugin sets up those source sets automatically based on the targets specified in your project.

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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
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
reference them without `by getting` or `by creating` constructions compared to the [manual configuration](#manual-configuration)

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android()
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
    android()
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

### Adding source sets to the default hierarchy template

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

    // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
    applyDefaultHierarchyTemplate()

    sourceSets {
        // Create an additional jsAndJvmMain source set:
        val jsAndJvmMain by creating {
            dependsOn(commonMain.get())
        }

        jsMain.get().dependsOn(jsAndJvmMain)
        jvmMain.get().dependsOn(jsAndJvmMain)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm()
    js { browser() }
    iosArm64()
    iosSimulatorArm64()

    // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
    applyDefaultHierarchyTemplate()

    sourceSets {
        // Create an additional jsAndJvmMain source set:
        jsAndJvmMain {
            dependsOn(commonMain)
        }
        jsMain {
            dependsOn(jsAndJvmMain)
        }
        jvmMain {
            dependsOn(jsAndJvmMain)
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
