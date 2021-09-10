[//]: # (title: Add dependencies to KMM modules)
[//]: # (auxiliary-id: Add_dependencies_to_KMM_modules)

Every application requires a set of libraries in order to operate successfully. 
A KMM application can depend on multiplatform libraries that work on both iOS and Android, and it can depend on platform-specific iOS and Android libraries. 

Here you can learn how to add:
* [Multiplatform dependencies](#multiplatform-libraries)
* [iOS dependencies](#ios-dependencies)
* [Android dependencies](#android-dependencies)

## Multiplatform libraries

You can add dependencies on libraries that have adopted Kotlin Multiplatform technology, such as 
[kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines) and [SQLDelight](https://github.com/cashapp/sqldelight). 
The authors of these libraries usually provide guides for adding their dependencies to your project.

> When using a multiplatform library that does not have [hierarchical structure support](mpp-share-on-platforms.md#share-code-on-similar-platforms) in a multiplatform project that does, 
> you won't be able to use IDE features, such as code completion and highlighting, for the shared iOS source set. 
> 
> This is a [known issue](https://youtrack.jetbrains.com/issue/KT-40975), and we are working on resolving it. In the meantime, you can use [this workaround](#workaround-to-enable-ide-support-for-the-shared-ios-source-set). 
>
{type="note"}

This page covers basic dependency use cases:

* [On the Kotlin standard library](#dependency-on-the-kotlin-standard-library)
* [On a library shared for all source sets](#dependency-on-a-library-shared-for-all-source-sets)
* [On a library used in specific source sets](#dependency-on-a-library-used-in-specific-source-sets)
* [On another multiplatform project](#dependency-on-another-multiplatform-project)

Learn more about [configuring dependencies](gradle.md#configuring-dependencies).

Check out this [community-maintained list of Kotlin Multiplatform libraries](https://libs.kmp.icerock.dev/).

### Dependency on the Kotlin standard library

The Kotlin standard library is added automatically to all multiplatform projects, you don’t have to do anything manually.

### Dependency on a library shared for all source sets

If you want to use a library from all source sets, you can add it only to the common source set. 
The Kotlin Multiplatform Mobile plugin will add the corresponding parts to any other source sets automatically.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets["commonMain"].dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
    sourceSets["androidMain"].dependencies {
        //dependency to platform part of kotlinx.coroutines will be added automatically
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        androidMain {
            dependencies {
                //dependency to platform part of kotlinx.coroutines will be added automatically
            }
        }
    }
}
```

</tab>
</tabs>

### Dependency on a library used in specific source sets

If you want to use a multiplatform library just for specific source sets, you can add it exclusively to them. 
The specified library declarations will then be available only in those source sets.  
   
> Don't use a platform-specific name in such cases, like SQLDelight `native-driver` in the example below. Find the exact name in the library’s documentation.
> 
{type="note"}   

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets["commonMain"].dependencies {
        //kotlinx.coroutines will be available in all source sets
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
    sourceSets["androidMain"].dependencies {
    }
    sourceSets["iosX64Main"].dependencies {
        //SQLDelight will be available only in the iOS source set, but not in Android or common
        implementation("com.squareup.sqldelight:native-driver:%sqlDelightVersion%)
    }
}
```
        
</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies { 
            // kotlinx.coroutines will be available in all source sets
            implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        androidMain {
            dependencies { }
        }
        iosMain {
            dependencies {
            // SQLDelight will be available only in the iOS source set, but not in Android or common
            implementation 'com.squareup.sqldelight:native-driver:%sqlDelightVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

### Dependency on another multiplatform project

You can connect one multiplatform project to another as a dependency. To do this, simply add a project dependency to the source set that needs it. 
If you want to use a dependency in all source sets, add it to the common one. In this case, other source sets will get their versions automatically.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets["commonMain"].dependencies {
        implementation(project(":some-other-multiplatform-module"))
    }
    sourceSets["androidMain"].dependencies {
        //platform part of :some-other-multiplatform-module will be added automatically
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation project(':some-other-multiplatform-module')
            }
        }
        androidMain {
            dependencies {
                //platform part of :some-other-multiplatform-module will be added automatically
            }
        }
    }
}
```

</tab>
</tabs>

## iOS dependencies

Apple SDK dependencies (such as Foundation or Core Bluetooth) are available as a set of prebuilt libraries in Kotlin Multiplatform Mobile projects. 
They do not require any additional configuration.

You can also reuse other libraries and frameworks from the iOS ecosystem in your iOS source sets. 
Kotlin supports interoperability with Objective-C dependencies and Swift dependencies if their APIs are exported to Objective-C with the `@objc` attribute. 
Pure Swift dependencies are not yet supported.

Integration with the CocoaPods dependency manager is also supported with the same limitation – you cannot use pure Swift pods. 

We recommend [using CocoaPods](#with-cocoapods) to handle iOS dependencies in Kotlin Multiplatform Mobile (KMM) projects. 
[Manage dependencies manually](#without-cocoapods) only if you want to tune the interop process specifically or if you have some other strong reason to do so.

> When using third-party iOS libraries in multiplatform projects with [hierarchical structure support](mpp-share-on-platforms.md#share-code-on-similar-platforms), for example with the `ios()` [target shortcut](mpp-share-on-platforms.md#use-target-shortcuts), 
> you won't be able to use IDE features, such as code completion and highlighting, for the shared iOS source set. 
> 
> This is a [known issue](https://youtrack.jetbrains.com/issue/KT-40975), and we are working on resolving it. In the meantime, you can use [this workaround](#workaround-to-enable-ide-support-for-the-shared-ios-source-set). 
>
> This issue doesn't apply to [platform libraries](native-platform-libs.md) supported out of the box.
>
{type="note"}

### With CocoaPods

1. Perform [initial CocoaPods integration setup](native-cocoapods.md#install-the-cocoapods-dependency-manager-and-plugin)

2. Add a dependency on a Pod library from the CocoaPods repository that you want to use by including `pod()` in the build script of your project.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        cocoapods {
            //..
            pod("AFNetworking") {
                version = "~> 4.0.1"
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
        kotlin {
       cocoapods {
          //..
          pod('AFNetworking') {
             version = '~> 4.0.1'
          }
       }
    }
    ```

    </tab>
    </tabs>

3. Re-import the project.

To use the dependency in your Kotlin code, import the package `cocoapods.<library-name>`. In the example above, that would be:
```kotlin
import cocoapods.AFNetworking.*
```

Learn more about [CocoaPods integration](native-cocoapods.md).

### Without CocoaPods

If you don’t want to use CocoaPods, you can use the cinterop tool to create Kotlin bindings for Objective-C or Swift declarations. This will allow you to call them from Kotlin code. To do this:
1. Download your dependency.
2. Build it to get its binaries.
3. Create a special `.def` file that describes this dependency to cinterop.
4. Adjust your build script to generate bindings during the build.

The steps differ a bit for [libraries](#add-a-library-without-cocoapods) and [frameworks](#add-a-framework-without-cocoapods), but the idea remains the same.

#### Add a library without CocoaPods 

1. Download the library source code and place it somewhere where you can reference it from your project. 

2. Build a library (library authors usually provide a guide on how to do this) and get a path to the binaries.

3. In your project, create a `.def` file, for example `DateTools.def`.

4. Add a first string to this file: `language = Objective-C`. If you want to use a pure C dependency, omit the language property.

5. Provide values for two mandatory properties:
    * `headers` describes which headers will be processed by cinterop.
    * `package` sets the name of the package these declarations should be put into.

    For example:
    ```properties
    headers = DateTools.h
    package = DateTools
    ```

6. Add information about interoperability with this library to the build script:
    * Pass the path to the `.def` file. This path can be omitted if your `.def` file has the same name as cinterop and is placed in the `src/nativeInterop/cinterop/` directory.
    * Tell cinterop where to look for header files using the `includeDirs` option.
    * Configure linking to library binaries.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosX64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // Path to .def file
                    defFile("src/nativeInterop/cinterop/DateTools.def")

                    // Directories for header search (an analogue of the -I<path> compiler option)
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // Linker options required to link to the library.
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosX64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // Path to .def file
                        defFile("src/nativeInterop/cinterop/DateTools.def")
                   
                        // Directories for header search (an analogue of the -I<path> compiler option)
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // Linker options required to link to the library.
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </tab>
    </tabs>

7. Build the project.

Now you can use this dependency in your Kotlin code. To do that, import the package you’ve set up in the `package` property in the `.def` file. For the example above, this will be:
```kotlin
import DateTools.*
```

#### Add a framework without CocoaPods

1. Download the framework source code and place it somewhere that you can reference it from your project.

2. Build the framework (framework authors usually provide a guide on how to do this) and get a path to the binaries.

3. In your project, create a `.def` file, for example `MyFramework.def`.

4. Add the first string to this file: `language = Objective-C`. If you want to use a pure C dependency, omit the language property.

5. Provide values for these two mandatory properties:
    * `modules` – the name of the framework that should be processed by the cinterop.
    * `package` – the name of the package these declarations should be put into.
    For example:
    ```properties
    modules = MyFramework
    package = MyFramework
    ```

6. Add information about interoperability with the framework to the build script:
    * Pass the path to the .def file. This path can be omitted if your `.def` file has the same name as the cinterop and is placed in the `src/nativeInterop/cinterop/` directory.
    * Pass the framework name to the compiler and linker using the `-framework` option.
    Pass the path to the framework sources and binaries to the compiler and linker using the `-F` option.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosX64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // Path to .def file
                    defFile("src/nativeInterop/cinterop/DateTools.def")

                   compilerOpts("-framework", "MyFramework", "-F/path/to/framework/"
               }
               val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // Tell the linker where the framework is located.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
       }
    }
    ```
   
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    kotlin {
        iosX64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // Path to .def file
                        defFile("src/nativeInterop/cinterop/MyFramework.def")
                   
                        compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // Tell the linker where the framework is located.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```

    </tab>
    </tabs>

7. Build the project.

Now you can use this dependency in your Kotlin code. To do this, import the package you’ve set up in the package property in the `.def` file. For the example above, this will be:

```kotlin
import MyFramework.*
```

Learn more about [Objective-C and Swift interop](native-objc-interop.md) and 
[configuring cinterop from Gradle](mpp-dsl-reference.md#cinterops).

### Workaround to enable IDE support for the shared iOS source set {initial-collapse-state="collapsed"}

Due to a [known issue](https://youtrack.jetbrains.com/issue/KT-40975), you won't be able to use IDE features, such as code completion and highlighting, for the shared iOS source set 
in a multiplatform project with [hierarchical structure support](mpp-share-on-platforms.md#share-code-on-similar-platforms) if your project depends on:

* Multiplatform libraries that don't support the hierarchical structure.
* Third-party iOS libraries, with the exception of [platform libraries](native-platform-libs.md) supported out of the box.

This issue applies only to the shared iOS source set. The IDE will correctly support the rest of the code.

> All projects created with the KMM Project Wizard support the hierarchical structure, which means this issue affects them.
>
{type="note"}

To enable IDE support in these cases, you can work around the issue by adding the following code to `build.gradle.(kts)` in the `shared` directory of your project:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val iosTarget: (String, KotlinNativeTarget.() -> Unit) -> KotlinNativeTarget =
    if (System.getenv("SDK_NAME")?.startsWith("iphoneos") == true)
        ::iosArm64
    else
        ::iosX64

iosTarget("ios")
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
def iosTarget
if (System.getenv("SDK_NAME")?.startsWith("iphoneos")) {
    iosTarget = kotlin.&iosArm64
} else {
    iosTarget = kotlin.&iosX64
}
```

</tab>
</tabs>

In this code sample, the configuration of iOS targets depends on the environment variable `SDK_NAME`, which is managed by Xcode. 
For each build, you'll have only one iOS target, named `ios`, that uses the `iosMain` source set. 
There will be no hierarchy of the `iosMain`, `iosArm64`, and `iosX64` source sets.

> This is a temporary workaround. If you are a library author, we recommend that you [migrate to the hierarchical structure](migrating-multiplatform-project-to-14.md#migrate-to-the-hierarchical-project-structure) as soon as possible. 
>
> With this workaround, Kotlin Multiplatform tooling analyzes your code against only the one native target that is active during the current build. 
> This might lead to various errors during the complete build with all targets, and errors are more likely if your project contains other native targets in addition to the iOS ones.
>
{type="note"}

## Android dependencies

The workflow for adding Android-specific dependencies to a KMM module is the same as it is for pure Android projects: add a line to your Gradle build script declaring the dependency you need and import the project. You’ll then be able to use this dependency in your Kotlin code.

We recommend adding Android dependencies to KMM projects by adding them to a specific Android source set:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
sourceSets["androidMain"].dependencies {
        implementation("com.example.android:app-magic:12.3")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
sourceSets {
    androidMain {
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
        }
    }
}
```

</tab>
</tabs>

Moving what was a top-level dependency in an Android project to a specific source set in a KMM project might be difficult if the top-level dependency had a non-trivial configuration name. For example, to move а `debugImplementation` dependency from the top level of an Android project, you’ll need to add an implementation dependency to the source set named `androidDebug`.
To minimize the effort you have to put in to deal with migration problems like this, you can add a `dependencies` block inside the `android` block:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
android {
    ...

    dependencies {   
        implementation("com.example.android:app-magic:12.3")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
android {
    ...

    dependencies {
        implementation 'com.example.android:app-magic:12.3'
    }
}
```

</tab>
</tabs>

Dependencies declared here will be treated exactly the same as dependencies from the top-level block, but declaring them this way will also separate Android dependencies visually in your build script and make it less confusing.

Putting dependencies into a standalone `dependencies` block at the end of the script, in a way that is idiomatic to Android projects, is also supported. However, we strongly recommend **against** doing this because configuring a build script with Android dependencies in the top-level block and other target dependencies in each source set is likely to cause confusion.

Learn more about [adding dependencies in Android documentation](https://developer.android.com/studio/build/dependencies).
