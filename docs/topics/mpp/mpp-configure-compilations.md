[//]: # (title: Configure compilations)

Kotlin multiplatform projects use compilations for producing artifacts. Each target can have one or more compilations, 
for example, for production and test purposes.

For each target, default compilations include:

* `main` and `test` compilations for JVM, JS, and Native targets.
* A [compilation](#compilation-for-android) per [Android build variant](https://developer.android.com/studio/build/build-variants), for Android targets.

![Compilations](compilations.png)

If you need to compile something other than production code and unit tests, for example, integration or performance tests, 
you can [create a custom compilation](#create-a-custom-compilation).

You can configure how artifacts are produced in:

* [All compilations](#configure-all-compilations) in your project at once.
* [Compilations for one target](#configure-compilations-for-one-target) since one target can have multiple compilations.
* [A specific compilation](#configure-one-compilation).

See the [list of compilation parameters](mpp-dsl-reference.md#compilation-parameters) and [compiler options](gradle.md#compiler-options) 
available for all or specific targets.

## Configure all compilations

```kotlin
kotlin {
    targets.all {
        compilations.all {
            kotlinOptions {
                allWarningsAsErrors = true
            }
        }
    }
}
```

## Configure compilations for one target

<tabs>

```groovy
kotlin {
    jvm().compilations.all {
        kotlinOptions {
            sourceMap = true
            metaInfo = true
        }
    }
}
```

```kotlin
kotlin {
    targets.jvm.compilations.all {
        kotlinOptions {
            sourceMap = true
            metaInfo = true
        }
    }
}
```

</tabs>

## Configure one compilation

<tabs>

```groovy
kotlin {
    jvm().compilations.main {
        kotlinOptions {
            jvmTarget = "1.8"
        }
    }
}
```

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            kotlinOptions {
                jvmTarget = "1.8"
            }
        }
    }
}
```

</tabs>

## Create a custom compilation

If you need to compile something other than production code and unit tests, for example, integration or performance tests, 
create a custom compilation.
 
For example, to create a custom compilation for integration tests of the `jvm()` target, add a new item to the `compilations` 
collection. 
 
> For custom compilations, you need to set up all dependencies manually. The default source set of a custom compilation 
> does not depend on the `commonMain` and the `commonTest` source sets.
>
{type="note"}

<tabs>

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

</tabs>

You also need to create a custom compilation in other cases, for example, if you want to combine compilations for different 
JVM versions in your final artifact, or you have already set up source sets in Gradle and want to migrate to a multiplatform project.

## Include Java sources in JVM compilations

By default, the JVM target ignores Java sources and compiles only Kotlin source files.

To include Java sources in the compilations of the JVM target, explicitly enable the Java language support for the target:

* When [creating a project with the Project Wizard](mpp-create-lib.md). 
  
  ![Enable Java language support](enable-java-support.png)
  
* In the build script of an existing project.

  ```kotlin
  kotlin {
      jvm {
          withJava()
      }
  }
  ```
  
   This applies the Gradle `java` plugin and configures the target to cooperate with it.

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

| Native language | Supported platforms | Comments |
|-----------------|---------------------|----------|
| C | All platforms, except for WebAssembly | |
| Objective-C | Apple platforms (macOS, iOS, watchOS, tvOS) | |
| Swift via Objective-C | Apple platforms (macOS, iOS, watchOS, tvOS) | Kotlin can use only Swift declarations marked with the `@objc` attribute. |

A compilation can interact with several native libraries. Configure interoperability in the `cinterops` block of the 
compilation with [available parameters](mpp-dsl-reference.md#cinterops).

<tabs>

```groovy
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.main {
            cinterops {
                myInterop {
                    // Def-file describing the native API.
                    // The default path is src/nativeInterop/cinterop/<interop-name>.def
                    defFile project.file("def-file.def")
                    
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

```kotlin
kotlin {
    linuxX64 {  // Replace with a target you need.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // Def-file describing the native API.
                // The default path is src/nativeInterop/cinterop/<interop-name>.def
                defFile(project.file("def-file.def"))
                
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

</tabs>

## Compilation for Android 
 
The compilations created for an Android target by default are tied to [Android build variants](https://developer.android.com/studio/build/build-variants): 
for each build variant, a Kotlin compilation is created under the same name.

Then, for each [Android source set](https://developer.android.com/studio/build/build-variants#sourcesets) compiled for 
each of the variants, a Kotlin source set is created under that source set name prepended by the target name, like the 
Kotlin source set `androidDebug` for an Android source set `debug` and the Kotlin target named `android`. These Kotlin 
source sets are added to the variants’ compilations accordingly.

The default source set `commonMain` is added to each production (application or library) variant's compilation. 
The `commonTest` source set is similarly added to the compilations of unit test and instrumented test variants.

Annotation processing with [`kapt`](kapt.md) is also supported, but due to current limitations it requires that the Android target 
is created before the `kapt` dependencies are configured, which needs to be done in a top-level `dependencies` block rather 
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

Kotlin can build a [source set hierarchy](mpp-share-on-platforms.md#share-code-on-similar-platforms) with the `dependsOn` relation.

![Source set hierarchy](jvm-js-main.png){width=400}

If the source set `jvmMain` depends on a source set `commonMain` then:

* Whenever `jvmMain` is compiled for a certain target, `commonMain` takes part in that compilation as well and is also 
compiled into the same target binary form, such as JVM class files.
* Sources of `jvmMain` 'see' the declarations of `commonMain`, including internal declarations, and also see the 
[dependencies](mpp-add-dependencies.md) of `commonMain`, even those specified as `implementation` dependencies.
* `jvmMain` can contain platform-specific implementations for the [expected declarations](mpp-connect-to-apis.md) 
of `commonMain`.
* The resources of `commonMain` are always processed and copied along with the resources of `jvmMain`.
* The [language settings](mpp-dsl-reference.md#language-settings) of `jvmMain` and `commonMain` should be consistent.

Language settings are checked for consistency in the following ways:
* `jvmMain` should set a `languageVersion` that is greater than or equal to that of `commonMain`.
* `jvmMain` should enable all unstable language features that `commonMain` enables (there's no such requirement for 
bugfix features).
* `jvmMain` should use all experimental annotations that `commonMain` uses.
* `apiVersion`, bugfix language features, and `progressiveMode` can be set arbitrarily.