[//]: # (title: Configure compilations)

Kotlin multiplatform projects use compilations for producing artifacts. Each target can have one or more compilations, 
for example, for production and test purposes.

For each target, default compilations include:

* `main` and `test` compilations for JVM, JS, and Native targets.
* A [compilation](#compilation-for-android) per [Android build variant](https://developer.android.com/studio/build/build-variants), for Android targets.

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
            compilerOptions.configure {
                jvmTarget.set(JvmTarget.JVM_1_8)
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
            compilerOptions.configure {
                jvmTarget = JvmTarget.JVM_1_8
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
 
For example, to create a custom compilation for integration tests of the `jvm()` target, add a new item to the `compilations` 
collection. 
 
> For custom compilations, you need to set up all dependencies manually. The default source set of a custom compilation 
> does not depend on the `commonMain` and the `commonTest` source sets.
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm() {
        compilations {
            val main by getting
            
            val integrationTest by compilations.creating {
                defaultSourceSet {
                    dependencies {
                        // Compile against the main compilation's compile classpath and outputs:
                        implementation(main.compileDependencyFiles + main.output.classesDirs)
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }
                
                // Create a test task to run the tests produced by this compilation:
                tasks.register<Test>("integrationTest") {
                    // Run the tests with the classpath containing the compile dependencies (including 'main'),
                    // runtime dependencies, and the outputs of this compilation:
                    classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs
                    
                    // Run only the tests from this compilation's outputs:
                    testClassesDirs = output.classesDirs
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
    jvm() {
        compilations.create('integrationTest') {
            defaultSourceSet {
                dependencies {
                    def main = compilations.main
                    // Compile against the main compilation's compile classpath and outputs:
                    implementation(main.compileDependencyFiles + main.output.classesDirs)
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }
           
            // Create a test task to run the tests produced by this compilation:
            tasks.register('jvmIntegrationTest', Test) {
                // Run the tests with the classpath containing the compile dependencies (including 'main'),
                // runtime dependencies, and the outputs of this compilation:
                classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs
                
                // Run only the tests from this compilation's outputs:
                testClassesDirs = output.classesDirs
            }
        }
    }
}
```

</tab>
</tabs>

You also need to create a custom compilation in other cases, for example, if you want to combine compilations for different 
JVM versions in your final artifact, or you have already set up source sets in Gradle and want to migrate to a multiplatform project.

## Use Java sources in JVM compilations

When creating a project with the [project wizard](https://kmp.jetbrains.com/), Java sources are included in the compilations of
the JVM target.

In the build script, the following section applies the Gradle `java` plugin and configures the target to cooperate with it:

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
```

The Java source files are placed in the child directories of the Kotlin source roots. For example, the paths are:

![Java source files](java-source-paths.png){width=200}

The common source sets cannot include Java sources.

Due to current limitations, the Kotlin plugin replaces some tasks configured by the Java plugin:

* The target's JAR task instead of `jar` (for example, `jvmJar`).
* The target's test task instead of `test` (for example, `jvmTest`).
* The resources are processed by the equivalent tasks of the compilations instead of `*ProcessResources` tasks.

The publication of this target is handled by the Kotlin plugin and doesn't require steps that are specific for the Java plugin.

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
                    
                    // Directories for header search (an eqivalent of the -I<path> compiler option).
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
 
The compilations created for an Android target by default are tied to [Android build variants](https://developer.android.com/studio/build/build-variants): 
for each build variant, a Kotlin compilation is created under the same name.

Then, for each [Android source set](https://developer.android.com/studio/build/build-variants#sourcesets) compiled for 
each of the variants, a Kotlin source set is created under that source set name prepended by the target name, like the 
Kotlin source set `androidDebug` for an Android source set `debug` and the Kotlin target named `android`. These Kotlin 
source sets are added to the variants' compilations accordingly.

The default source set `commonMain` is added to each production (application or library) variant's compilation. 
The `commonTest` source set is similarly added to the compilations of unit test and instrumented test variants.

Annotation processing with [`kapt`](kapt.md) is also supported, but due to current limitations it requires that the Android target 
is created before the `kapt` dependencies are configured, which needs to be done in a top-level `dependencies {}` block rather 
than within Kotlin source set dependencies.

```kotlin
kotlin {
    android { /* ... */ }
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

If you want to check compatibility before enabling Isolated Projects in Gradle, you can test your projects with the new 
Kotlin Gradle plugin model. Add the following Gradle property to your `gradle.properties` file:

```none
kotlin.kmp.isolated-projects.support=enable
```

If you decide to enable the Isolated Projects feature later, remember to remove this Gradle property. The Kotlin Gradle plugin
applies and manages this Gradle property directly.

For more information about the Isolated Projects feature, see [Gradle's documentation](https://docs.gradle.org/current/userguide/isolated_projects.html).