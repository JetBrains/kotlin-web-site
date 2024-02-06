[//]: # (title: Advanced concepts of the multiplatform project structure)

This article explains advanced concepts of the Kotlin Multiplatform project structure and how they map to the Gradle
implementation.

This information will be useful if you:

* Have a code shared among a specific set of targets, and Kotlin doesn't create such a source set by default.
  In this case, you need a lower-level API that exposes a few new abstractions.
* Need to work with low-level abstractions of the Gradle build, such as configurations, tasks, publications, and others.
* Create a Gradle plugin for Kotlin Multiplatform builds.

> Before diving into advanced concepts, learn [the basics of multiplatform project structure](multiplatform-discover-project.md).
>
{type="tip"}

## Dependencies and dependsOn

This section describes two kinds of dependencies:

* [`dependsOn`](#dependson-and-source-set-hierarchies), a specific Kotlin Multiplatform relation between two Kotlin source sets.
* [Regular dependencies](#dependencies-on-other-libraries-or-projects), dependencies on a published library,
  such as `kotlinx-coroutines`, or on another Gradle project in your build.

Usually, you'll be working with _dependencies_ and not with the _`dependsOn`_ relation. However, examining `dependsOn`
is crucial to understanding how Kotlin Multiplatform projects work under the hood.

### dependsOn and source set hierarchies

_`dependsOn_` is a Kotlin-specific relation between two Kotlin source sets. This could be a connection between common
and platform-specific source sets. For example, when the `jvmMain` source set depends on `commonMain`, `iosArm64Main`
on `iosMain`, and others.

Consider a general example with `A` and `B` Kotlin source sets. The expression `A.dependsOn(B)` instructs Kotlin that:

1. `A` observes the API from `B`, including internal declarations.
2. `A` can provide actual implementations for expected declarations from `B`. This is a necessary and sufficient condition,
   `A` can provide `actuals` for `B` if and only if `A.dependsOn(B)` either directly or indirectly.
3. `B` should compile to all the targets that `A` compiles to in addition to its own targets.
4. `B` inherits all the regular dependencies of `A`.

The `dependsOn` relation creates a tree-like structure known as a source set hierarchy. Here's an example of a
typical project for mobile development with `androidTarget`, `iosArm64`  (iPhone device), and `iosSimulatorArm64`
(iPhone simulator for Apple Silicon Mac):

![DependsOn tree structure](dependson-tree-diagram.svg){width=700}

Arrows represent `dependsOn` relations.
These relations are preserved during the compilation of platform binaries. This is how Kotlin understands that `iosMain`
is supposed to see API from `commonMain`, but not from `iosArm64Main`:

![DependsOn relations during compilation](dependson-relations-diagram.svg){width=700}

`dependsOn` relations are configured with the `KotlinSourceSet.dependsOn(KotlinSourceSet)` call, for example:

```kotlin
kotlin {
   // Targets declaration
   sourceSets {
      // Example of configuring the dependsOn relation 
      iosArm64Main.dependsOn(commonMain)
   }
}
```

* This example shows how `dependsOn` relations can be defined in the build script. However, the Kotlin Gradle plugin creates
  source sets and sets up these relations by default, so you don't need to do it manually.
* `dependsOn` relations are declared separately from the `dependencies {}` block in build scripts.
  This is because `dependsOn` is not a regular dependency but a specific relation among Kotlin source sets necessary
  for sharing code across different targets.

You cannot use `dependsOn` to express regular dependencies on a published library or other Gradle project.
For example, you can't set up `commonMain` to depend on `commonMain` of the `kotlinx-coroutines-core` library
or call `commonTest.dependsOn(commonMain)`.

### Dependencies on other libraries or projects

You can set up regular dependencies in multiplatform projects, on a published library, or on another Gradle project.

Kotlin Multiplatform generally declares dependencies in a typical Gradle way. Similarly to Gradle, you:

* Use the `dependencies {}` block in your build script.
* Choose the proper scope for dependencies, for example, `implementation` or `api`.
* Reference the dependency either by specifying its coordinates if it's published in a repo.
  For example, `"com.google.guava:guava:32.1.2-jre"` or its path if it's a Gradle project in the same build,
  like `project(":utils:concurrency")`.

Dependency configuration in multiplatform projects has some special features. Each Kotlin source set has its own
`dependencies {}` block. This allows you to declare platform-specific dependencies in platform-specific source sets:

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        jvmMain.dependencies {
            // This is jvmMain's dependencies, so it's OK to add a JVM-specific dependency
            implementation("com.google.guava:guava:32.1.2-jre")
        }
    }
}
```

Common dependencies are more tricky. Consider a multiplatform project that declares a dependency on a multiplatform library,
for example, `kotlinx.coroutines`:

```kotlin
kotlin {
    androidTarget()     // Android
    iosArm64()          // iPhone devices 
    iosSimulatorArm64() // iPhone simulator on Apple Silicon Mac

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
        }
    }
}
```

There are three important concepts in dependency resolution:

1. Multiplatform dependencies are propagated downwards the `dependsOn` structure. When you add a dependency to `commonMain`,
   it will be automatically added to all source sets that declare `dependsOn` relations directly or indirectly on `commonMain`.

   In this case, it's true for all `*Main` source sets: `iosMain`, `jvmMain`, `iosSimulatorArm64Main`, and `iosX64Main`.
   All these source sets inherit the `kotlin-coroutines-core` dependency from the `commonMain` source set, so you don't
   have to copy and paste it to all of them manually:

   ![Propagation of multiplatform dependencies](dependency-propagation-diagram.svg){width=700}

   > The propagation mechanism allows you to choose a scope that will receive the declared dependency by selecting a specific source set.
   > For example, if you want to use `kotlinx.coroutines` on iOS, but not on Android, you can add this dependency to `iosMain` only.
   >
   {type="tip"}

2. The _source set → multiplatform library_ dependencies, like `commonMain` to `org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3` above,
   represents the intermediate state of dependency resolution. The final state of resolution is always represented
   by _source set → source set_ dependencies.

   > The final source set → source set dependencies are not `dependsOn` relations.
   >
   {type="note"}

   To infer granular _source set-to-source set_ dependencies, Kotlin reads the source set structure of multiplatform libraries
   that is published alongside the library. After this step, each library will be represented internally not as a whole,
   but as a collection of its source sets. See an example for `kotlinx-coroutines-core`:

   ![Serialization of the source set structure](structure-serialization-diagram.svg){width=700}

3. Kotlin takes each dependency relation and resolves it to a collection of source sets from a dependency.
   Each dependency source set in that collection must have _compatible targets_. Intuitively, a dependency source set
   has compatible targets if it compiles to _at least the same targets_ as the consumer source set.

   Consider an example when `commonMain` in the sample project compiles to `androidTarget`, `iosX64`, and `iosSimulatorArm64`:

   * Firstly, it resolves a dependency on `kotlinx-coroutines-core.commonMain`. It happens because `kotlinx-coroutines-core`
     compiles to all possible Kotlin targets. Therefore, its `commonMain` compiles to all possible targets,
     including the required `androidTarget`, `iosX64`, and `iosSimulatorArm64`

   * Secondly, `commonMain` depends on `kotlinx-coroutines-core.concurrentMain`.
     Since `concurrentMain` in `kotlinx-coroutines-core` compiles to all the targets except for JS,
     it matches targets of the consumer project's `commonMain`.

   However, source sets like `iosX64Main` from coroutines are incompatible with consumer's `commonMain`.
   Even though `iosX64Main` compiles to one of the targets of `commonMain`, namely, `iosX64`,
   it doesn't compile neither to `androidTarget`, nor to `iosSimulatorArm64`.

   The results of the dependency resolution directly affect which code of `kotlinx-coroutines-core` is visible:

   ![Error on JVM-specific API in common code](dependency-resolution-error.png){width=700}

## Declaring custom source sets

In some cases, you might need to have a custom intermediate source set in your project.
Consider a project that compiles to JVM, JS, and Linux, and you want to share some sources only between JVM and JS.
In this case, you should find a specific source set for this pair of targets,
as described in [basics of multiplatform project structure](multiplatform-discover-project.md).

Kotlin doesn't create such a source set automatically. So, you should create it manually with the `by creating` construction:

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        // Create a source set named "jvmAndJs"
        val jvmAndJsMain by creating {
            // …
        }
    }
}
```

However, Kotlin still doesn't know how to treat or compile this source set. If you drew a diagram,
this source set would hang by itself and wouldn't have any target labels:

![Missing dependsOn relation](missing-dependson-diagram.svg){width=700}

To fix that, include `jvmAndJsMain` into the hierarchy by adding several `dependsOn` relations:

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        val jvmAndJsMain by creating {
            // Don't forget to add dependsOn to commonMain
            dependsOn(commonMain.get())
        }

        jvmMain {
            dependsOn(jvmAndJsMain)
        }

        jsMain {
            dependsOn(jsMain)
        }
    }
}
```

Here, `jvmMain.dependsOn(jvmAndJsMain)` adds the JVM target to `jvmAndJsMain`, and `jsMain.dependsOn(jvmAndJsMain)`
adds the JS target to `jvmAndJsMain`.

The final project structure will look like this:

![Final project structure](final-structure-diagram.svg){width=700}

> Manual configuration of `dependsOn` relations disables automatic application of the default hierarchy template.
> See [Additional configuration](multiplatform-hierarchy.md#additional-configuration) to learn more about such cases
> and how to solve them.
>
{type="note"}

## Compilations

Contrary to single-platform projects, Kotlin Multiplatform projects require multiple compiler launches to build all the artifacts.
Each compiler launch is a _Kotlin compilation_.

For example, here's a Kotlin compilation that generates binaries for iPhone devices mentioned earlier:

![Kotlin compilation for iOS](ios-compilation-diagram.svg){width=700}

Kotlin compilations are grouped under targets. By default, Kotlin creates two compilations for each target,
the `main` compilation for production sources and the `test` compilation for test sources.

The way of accessing compilations in build scripts follows that quite closely. First, you select a Kotlin target,
then access the `compilations` container inside, and finally choose the necessary compilation by its name:

```kotlin
kotlin {
    // Declare and configure the JVM target
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}
```