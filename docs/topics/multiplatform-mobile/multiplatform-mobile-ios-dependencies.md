[//]: # (title: Adding iOS dependencies)

Apple SDK dependencies (such as Foundation or Core Bluetooth) are available as a set of prebuilt libraries in Kotlin
Multiplatform Mobile projects. They do not require any additional configuration.

You can also reuse other libraries and frameworks from the iOS ecosystem in your iOS source sets. Kotlin supports
interoperability with Objective-C dependencies and Swift dependencies if their APIs are exported to Objective-C with
the `@objc` attribute. Pure Swift dependencies are not yet supported.

Integration with the CocoaPods dependency manager is also supported with the same limitation – you cannot use pure Swift
pods.

We recommend [using CocoaPods](#with-cocoapods) to handle iOS dependencies in Kotlin Multiplatform Mobile projects.
[Manage dependencies manually](#without-cocoapods) only if you want to tune the interop process specifically or if you
have some other strong reason to do so.

> When using third-party iOS libraries in multiplatform projects with [hierarchical structure support](multiplatform-share-on-platforms.md#share-code-on-similar-platforms), for example with the `ios()` [target shortcut](multiplatform-share-on-platforms.md#use-target-shortcuts),
> you won't be able to use IDE features, such as code completion and highlighting, for the shared iOS source set.
>
> This is a [known issue](https://youtrack.jetbrains.com/issue/KT-40975), and we are working on resolving it. In the meantime, you can use [this workaround](#workaround-to-enable-ide-support-for-the-shared-ios-source-set).
>
> This issue doesn't apply to [platform libraries](native-platform-libs.md) supported out of the box.
>
{type="note"}

### With CocoaPods

1. Perform [initial CocoaPods integration setup](native-cocoapods.md#set-up-the-environment-to-work-with-cocoapods).
2. Add a dependency on a Pod library from the CocoaPods repository that you want to use by including the `pod()`
   function call in `build.gradle.kts` (`build.gradle`) of your project.

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

   You can add the following dependencies on a Pod library:
    * [From the CocoaPods repository](native-cocoapods-libraries.md#from-the-cocoapods-repository)
    * [On a locally stored library](native-cocoapods-libraries.md#on-a-locally-stored-library)
    * [From a custom Git repository](native-cocoapods-libraries.md#from-a-custom-git-repository)
    * [From an archive](native-cocoapods-libraries.md#from-a-zip-tar-or-jar-archive)
    * [From a custom Podspec repository](native-cocoapods-libraries.md#from-a-custom-podspec-repository)
    * [With custom cinterop options](native-cocoapods-libraries.md#with-custom-cinterop-options)
    * [On a static Pod library](native-cocoapods-libraries.md#on-a-static-pod-library)

3. Re-import the project.

To use the dependency in your Kotlin code, import the package `cocoapods.<library-name>`. For the example above, it's:

```kotlin
import cocoapods.AFNetworking.*
```

### Without CocoaPods

If you don't want to use CocoaPods, you can use the cinterop tool to create Kotlin bindings for Objective-C or Swift
declarations. This will allow you to call them from the Kotlin code.

The steps differ a bit for [libraries](#add-a-library-without-cocoapods)
and [frameworks](#add-a-framework-without-cocoapods), but the idea remains the same.

1. Download your dependency.
2. Build it to get its binaries.
3. Create a special `.def` file that describes this dependency to cinterop.
4. Adjust your build script to generate bindings during the build.

#### Add a library without CocoaPods

1. Download the library source code and place it somewhere where you can reference it from your project.

2. Build a library (library authors usually provide a guide on how to do this) and get a path to the binaries.

3. In your project, create a `.def` file, for example `DateTools.def`.

4. Add a first string to this file: `language = Objective-C`. If you want to use a pure C dependency, omit the language
   property.

5. Provide values for two mandatory properties:
    * `headers` describes which headers will be processed by cinterop.
    * `package` sets the name of the package these declarations should be put into.

   For example:
    ```properties
    headers = DateTools.h
    package = DateTools
    ```

6. Add information about interoperability with this library to the build script:
    * Pass the path to the `.def` file. This path can be omitted if your `.def` file has the same name as cinterop and
      is placed in the `src/nativeInterop/cinterop/` directory.
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

Now you can use this dependency in your Kotlin code. To do that, import the package you've set up in the `package`
property in the `.def` file. For the example above, this will be:

```kotlin
import DateTools.*
```

#### Add a framework without CocoaPods

1. Download the framework source code and place it somewhere that you can reference it from your project.

2. Build the framework (framework authors usually provide a guide on how to do this) and get a path to the binaries.

3. In your project, create a `.def` file, for example `MyFramework.def`.

4. Add the first string to this file: `language = Objective-C`. If you want to use a pure C dependency, omit the
   language property.

5. Provide values for these two mandatory properties:
    * `modules` – the name of the framework that should be processed by the cinterop.
    * `package` – the name of the package these declarations should be put into. For example:
    ```properties
    modules = MyFramework
    package = MyFramework
    ```

6. Add information about interoperability with the framework to the build script:
    * Pass the path to the .def file. This path can be omitted if your `.def` file has the same name as the cinterop and
      is placed in the `src/nativeInterop/cinterop/` directory.
    * Pass the framework name to the compiler and linker using the `-framework` option. Pass the path to the framework
      sources and binaries to the compiler and linker using the `-F` option.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosX64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // Path to .def file
                    defFile("src/nativeInterop/cinterop/DateTools.def")

                   compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
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

Now you can use this dependency in your Kotlin code. To do this, import the package you've set up in the package
property in the `.def` file. For the example above, this will be:

```kotlin
import MyFramework.*
```

Learn more about [Objective-C and Swift interop](native-objc-interop.md) and
[configuring cinterop from Gradle](multiplatform-dsl-reference.md#cinterops).

### Workaround to enable IDE support for the shared iOS source set {initial-collapse-state="collapsed"}

Due to a [known issue](https://youtrack.jetbrains.com/issue/KT-40975), you won't be able to use IDE features, such as
code completion and highlighting, for the shared iOS source set in a multiplatform project
with [hierarchical structure support](multiplatform-share-on-platforms.md#share-code-on-similar-platforms) if your
project depends on:

* Multiplatform libraries that don't support the hierarchical structure.
* Third-party iOS libraries, with the exception of [platform libraries](native-platform-libs.md) supported out of the
  box.
  This issue applies only to the shared iOS source set. The IDE will correctly support the rest of the code.

> All projects created with the Kotlin Multiplatform Mobile Project Wizard support the hierarchical structure, which means this issue affects them.
>
{type="note"}

To enable IDE support in these cases, you can work around the issue by adding the following code to `build.gradle.(kts)`
in the `shared` directory of your project:

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

In this code sample, the configuration of iOS targets depends on the environment variable `SDK_NAME`, which is managed
by Xcode. For each build, you'll have only one iOS target, named `ios`, that uses the `iosMain` source set. There will
be no hierarchy of the `iosMain`, `iosArm64`, and `iosX64` source sets.

Alternatively, you can enable the support of platform-dependent interop libraries in shared source sets. In addition to
[platform libraries](native-platform-libs.md) shipped with Kotlin/Native, this approach can also
handle custom [`cinterop` libraries](native-c-interop.md) making them available in shared source sets.
To enable this feature, add the `kotlin.mpp.enableCInteropCommonization=true` property in your `gradle.properties`:

```properties
kotlin.mpp.enableCInteropCommonization=true
```

> This is a temporary workaround. If you are a library author, we recommend that you [enable the hierarchical structure](multiplatform-hierarchy.md).
>
> With this workaround, Kotlin Multiplatform tooling analyzes your code against only the one native target that is active during the current build.
> This might lead to various errors during the complete build with all targets, and errors are more likely if your project contains other native targets in addition to the iOS ones.
>
{type="note"}

## What's next?

Check out other resources on adding dependencies in multiplatform projects and learn more about:

* [Adding dependencies on multiplatform libraries or other multiplatform projects](multiplatform-add-dependencies.md)
* [Adding Android dependencies](multiplatform-mobile-android-dependencies.md)