[//]: # (title: Configure compilations)

Kotlin multiplatform projects use compilations for producing artifacts. Each target can have one or more compilations, 
for example, for production and test purposes.

For each target, default compilations include:

* `main` and `test` compilations for JVM, JS, and Native targets.
* A [compilation](#compilation-for-android) per [Android build variant](https://developer.android.com/build/build-variants), for Android targets.

![Compilations](compilations.svg)

If you need to compile something other than production code and unit tests, for example, integration or performance tests, 
you can [create a custom compilation](#create-a-custom-compilation).

You can configure how artifacts are produced in:

* [All compilations](#configure-all-compilations) in your project at once.
* [Compilations for one target](#configure-compilations-for-one-target) since one target can have multiple compilations.
* [A specific compilation](#configure-one-compilation).

See the [list of compilation parameters](multiplatform-dsl-reference.md#compilation-parameters) and [compiler options](gradle-compiler-options.md) 
available for all or specific targets.

## Configure all compilations

This example configures a compiler option that is common across all targets:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

## Configure compilations for one target

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_1_8)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilerOptions {
            jvmTarget = JvmTarget.JVM_1_8
        }
    }
}
```

</tab>
</tabs>

## Configure one compilation

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                compilerOptions {
                    jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }
    }
}
```

</tab>
</tabs>

## Create a custom compilation

If you need to compile something other than production code and unit tests, for example, integration or performance tests, 
create a custom compilation.

For custom compilations, you need to set up all dependencies manually. The default source set of a custom compilation
does not depend on the `commonMain` and the `commonTest` source sets.
 
For example, to create a custom compilation for integration tests of the `jvm` target, set up an [`associateWith`](gradle-configure-project.md#associate-compiler-tasks)
relation between the `integrationTest` and `main` compilations:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // Import main and its classpath as dependencies and establish internal visibility
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }
                
                // Create a test task to run the tests produced by this compilation:
                testRuns.create("integration") {
                    // Configure the test task
                    setExecutionSourceFrom(integrationTest)
                }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.create('integrationTest') {
            def main = compilations.main
            // Import main and its classpath as dependencies and establish internal visibility
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // Create a test task to run the tests produced by this compilation
            testRuns.create('integration') {
                // Configure the test task
                setExecutionSourceFrom(compilations.integrationTest)
            }
        }
    }
}
```

</tab>
</tabs>

By associating compilations, you add the main compilation output as a dependency and establish the `internal` visibility
between compilations.

Custom compilations are also necessary in other cases. For example, if you want to combine compilations for different 
JVM versions in your final artifact, or you have already set up source sets in Gradle and want to migrate to a
multiplatform project.

> To create custom compilations for the [`androidTarget`](#compilation-for-android), set up build variants
> through the [Android Gradle plugin](https://developer.android.com/build/build-variants).
> 
{style="tip"}

## Compilation for JVM

When you declare the `jvm` target in your multiplatform project, the Kotlin Multiplatform plugin automatically
creates Java sources sets and includes them in the compilations of the JVM target.

The common source sets can't include Java resources, so you should place them in the corresponding child directories
of your multiplatform project. For example:

![Java source files](java-source-paths.png){width=200}

Currently, the Kotlin Multiplatform plugin replaces some tasks configured by the Java plugin:

* JAR task: instead of a standard `jar`, it uses a target-specific task based on the artifact's name, for example,
  `jvmJar` for the `jvm()` target declaration and `desktopJar` for `jvm("desktop")`.
* Test task: instead of a standard `test`, it uses a target-specific task based on the artifact's name, for example, `jvmTest`.
* Resource processing: instead of `*ProcessResources` tasks, resources are handled by the corresponding compilation tasks.

These tasks are created automatically when the target is declared. However, you can manually define the JAR task
and configure it if necessary:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// Shared module's `build.gradle.kts` file
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

kotlin {
    // Specify the JVM target
    jvm {
        // Add the task for JAR generation
        tasks.named<Jar>(artifactsTaskName).configure {
            // Configure the task
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // Add JVM-specific dependencies
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// Shared module's `build.gradle` file
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

kotlin {
    // Specify the JVM target
    jvm {
        // Add the task for JAR generation
        tasks.named<Jar>(artifactsTaskName).configure {
            // Configure the task
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // Add JVM-specific dependencies
            }
        }
    }
}
```

</tab>
</tabs>

This target is published by the Kotlin Multiplatform plugin and doesn't require steps that are specific
to the Java plugin.

## Configure interop with native languages

Kotlin provides [interoperability with native languages](native-c-interop.md) and DSL to configure this for a specific 
compilation.

| Native language       | Supported platforms                         | Comments                                                                  |
|-----------------------|---------------------------------------------|---------------------------------------------------------------------------|
| C                     | All platforms, except for WebAssembly       |                                                                           |
| Objective-C           | Apple platforms (macOS, iOS, watchOS, tvOS) |                                                                           |
| Swift via Objective-C | Apple platforms (macOS, iOS, watchOS, tvOS) | Kotlin can use only Swift declarations marked with the `@objc` attribute. |

A compilation can interact with several native libraries. Configure interoperability with available properties in the
[definition file](native-definition-file.md) or in the [`cinterops` block](multiplatform-dsl-reference.md#cinterops) of
your build file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // Def-file describing the native API.
                // The default path is src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))
                
                // Package to place the Kotlin API generated.
                packageName("org.sample")
                
                // Options to be passed to compiler by cinterop tool.
                compilerOpts("-Ipath/to/headers")
              
                // Directories to look for headers.
                includeDirs.apply {
                    // Directories for header search (an equivalent of the -I<path> compiler option).
                    allHeaders("path1", "path2")
                    
                    // Additional directories to search headers listed in the 'headerFilter' def-file option.
                    // -headerFilterAdditionalSearchPrefix command line option equivalent.
                    headerFilterOnly("path1", "path2")
                }
                // A shortcut for includeDirs.allHeaders.
                includeDirs("include/directory", "another/directory")
            }
            
            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.main {
            cinterops {
                myInterop {
                    // Def-file describing the native API.
                    // The default path is src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")
                    
                    // Package to place the Kotlin API generated.
                    packageName 'org.sample'
                    
                    // Options to be passed to compiler by cinterop tool.
                    compilerOpts '-Ipath/to/headers'
                    
                    // Directories for header search (an equivalent of the -I<path> compiler option).
                    includeDirs.allHeaders("path1", "path2")
                    
                    // Additional directories to search headers listed in the 'headerFilter' def-file option.
                    // -headerFilterAdditionalSearchPrefix command line option equivalent.
                    includeDirs.headerFilterOnly("path1", "path2")
                    
                    // A shortcut for includeDirs.allHeaders.
                    includeDirs("include/directory", "another/directory")
                }
                
                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</tab>
</tabs>

## Compilation for Android 
 
The compilations created for an Android target by default are tied to [Android build variants](https://developer.android.com/build/build-variants): 
for each build variant, a Kotlin compilation is created under the same name.

Then, for each [Android source set](https://developer.android.com/build/build-variants#sourcesets) compiled for 
each of the variants, a Kotlin source set is created under that source set name prepended by the target name, like the 
Kotlin source set `androidDebug` for an Android source set `debug` and the Kotlin target named `androidTarget`.
These Kotlin source sets are added to the variants' compilations accordingly.

The default source set `commonMain` is added to each production (application or library) variant's compilation. 
The `commonTest` source set is similarly added to the compilations of unit test and instrumented test variants.

Annotation processing with [`kapt`](kapt.md) is also supported, but due to current limitations it requires that the Android target 
is created before the `kapt` dependencies are configured, which needs to be done in a top-level `dependencies {}` block rather 
than within Kotlin source set dependencies.

```kotlin
kotlin {
    androidTarget { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## Compilation of the source set hierarchy 

Kotlin can build a [source set hierarchy](multiplatform-share-on-platforms.md#share-code-on-similar-platforms) with the `dependsOn` relation.

![Source set hierarchy](jvm-js-main.svg)

If the source set `jvmMain` depends on a source set `commonMain` then:

* Whenever `jvmMain` is compiled for a certain target, `commonMain` takes part in that compilation as well and is also 
compiled into the same target binary form, such as JVM class files.
* Sources of `jvmMain` 'see' the declarations of `commonMain`, including internal declarations, and also see the 
[dependencies](multiplatform-add-dependencies.md) of `commonMain`, even those specified as `implementation` dependencies.
* `jvmMain` can contain platform-specific implementations for the [expected declarations](multiplatform-expect-actual.md) 
of `commonMain`.
* The resources of `commonMain` are always processed and copied along with the resources of `jvmMain`.
* The [language settings](multiplatform-dsl-reference.md#language-settings) of `jvmMain` and `commonMain` should be consistent.

Language settings are checked for consistency in the following ways:
* `jvmMain` should set a `languageVersion` that is greater than or equal to that of `commonMain`.
* `jvmMain` should enable all unstable language features that `commonMain` enables (there's no such requirement for 
bugfix features).
* `jvmMain` should use all experimental annotations that `commonMain` uses.
* `apiVersion`, bugfix language features, and `progressiveMode` can be set arbitrarily.

## Configure Isolated Projects feature in Gradle

> This feature is [Experimental](components-stability.md#stability-levels-explained) and is currently in a pre-alpha state with Gradle. 
> Use it only with Gradle versions 8.10 or higher, and solely for evaluation purposes. The feature may be dropped or changed at any time.
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform). 
> Opt-in is required (see details below).
> 
{style="warning"}

Gradle provides the [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html) feature,
which improves build performance by "isolating" individual projects from each other. The feature separates the build scripts
and plugins between projects, allowing them to run safely in parallel.

To enable this feature, follow Gradle's instructions to [set the system property](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it).

For more information about the Isolated Projects feature, see [Gradle's documentation](https://docs.gradle.org/current/userguide/isolated_projects.html).