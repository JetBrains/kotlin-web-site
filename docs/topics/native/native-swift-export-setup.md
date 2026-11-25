[//]: # (title: Set up Swift export for your project)
<primary-label ref="beta"/>

To set up Swift export, use the `export { swift {} }` DSL of your build file. It describes how the module is exported
to Swift, for example a Swift module name and a collapse rule. Opt in to the DSL with `@OptIn(ExperimentalSwiftExportDsl::class)`.

You can connect the Swift export output to Xcode in two ways:

* With [direct Xcode integration](#direct-integration), Gradle runs as a build phase of the Xcode build and puts the generated
  Swift modules into the app's build directory.
* With [Swift package generation](#swift-package-generation), Gradle produces a self-contained Swift package that you add
  to an Xcode project or another Swift package as a dependency, without a separate build phase in Xcode.

> You can also clone our [public sample](https://github.com/Kotlin/swift-export-sample) with Swift export already set up.
> It features configuration examples, a working package consumer, and known limitations.
>
{style="tip"}

## Direct integration

The [direct integration approach](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html) that
connects the iOS framework to the Xcode project is a standard configuration for Kotlin Multiplatform projects created
with the Kotlin Multiplatform plugin in IntelliJ IDEA or through the [web wizard](https://kmp.jetbrains.com/).

### Configure Kotlin project

For direct integration with Xcode, configure your shared module's `build.gradle.kts` file. It must have
the `xcodeIntegration()` call to enable Xcode as a consumer of Swift export and set up the integration by:

* Registering the [`embedSwiftExportForXcode` task](#configure-xcode-project) that Xcode runs in the **Run Script** build phase.
* Adding Gradle configurations and tasks that resolve the export graph, generate the Swift code for the module and
  its dependencies, and compile it for Xcode.

The declared dependencies of an exported module are exported automatically:

* Direct `api` dependencies are exported fully, meaning that their entire API surface is available in Swift.
* Direct `implementation` dependencies and transitive dependencies are exported transitively, meaning that only the API
  that leaks into the public API of the exported module is available in Swift.

You can use the following build files in your project as a starting point for setting up Swift export:

```kotlin
// subproject/build.gradle.kts
import org.jetbrains.kotlin.gradle.swiftexport.ExperimentalSwiftExportDsl

kotlin {

    iosArm64()
    iosSimulatorArm64()

    // This configuration is used when exporting ":subproject"
    // as a dependency of ":shared"
    export {
        @OptIn(ExperimentalSwiftExportDsl::class)
        swift {
            // Sets the root module name
            moduleName = "Subproject"

            // Sets the collapse rule
            // Removes package prefix from generated Swift code
            rootPackage = "com.subproject.library"
        }
    }
}
```

```kotlin
// shared/build.gradle.kts
import org.jetbrains.kotlin.gradle.swiftexport.ExperimentalSwiftExportDsl

kotlin {

    iosArm64()
    iosSimulatorArm64()

    export {
        @OptIn(ExperimentalSwiftExportDsl::class)
        swift {
            // Sets the root module name
            moduleName = "Shared"

            // Sets the collapse rule
            // Removes package prefix from generated Swift code
            rootPackage = "com.example.sandbox"

            // Enables Xcode integration for this module
            xcodeIntegration {
                // Configures external module export
                configure(libs.utils) {
                    // Optional: overrides the exported module name
                    moduleName = "Utils"
                    // Optional: overrides the collapse rule of the exported dependency
                    rootPackage = "com.example.utils"
                }
            }
        }
    }

    sourceSets {
        commonMain {
            dependencies {
                // These dependencies are automatically
                // included in Swift export
                api(project(":subproject"))
                api(libs.utils)
            }
        }
    }
}
```

The direct integration automatically generates all the necessary files, including `swiftmodule` files,
static `.a` library, a header file, and a `modulemap` file, and copies them into the Xcode's build directory.

You can override the default `moduleName` and `rootPackage` values of an exported dependency in two ways:

* In the `export { swift {} }` block of the dependency's own build file.
* In the build file of the module that consumes the dependency, with the `configure()` function inside the
  `xcodeIntegration {}` block. The function accepts project dependencies, external dependencies, and version catalog
  accessors.

If several values are present, Swift export applies the first available value in this order:

1. The value set by the consuming module in the `xcodeIntegration {}` block.
2. The value declared by the dependency in its own build file.
3. The default value derived from the dependency's coordinates.

The configuration declared by a dependency is publishable: if a library author supplies option overrides for the library,
Gradle automatically consumes and applies them during Swift export. The overrides declared in the `xcodeIntegration {}`
block apply to the local build only and are never published.

> The build fails if you call `configure()` for a dependency that isn't part of the export graph or if two exported
> dependencies have the same Swift module name.
>
{style="warning"}

### Configure Xcode project

To configure Xcode to integrate Swift export into your project:

1. In Xcode, open the project settings.
2. On the **Build Phases** tab, locate the **Run Script** phase with the `embedAndSignAppleFrameworkForXcode` task.
3. Replace the script with the `embedSwiftExportForXcode` task in the run script phase.
   Using the [example above](#configure-kotlin-project):

   ```bash
   ./gradlew :shared:embedSwiftExportForXcode
   ```

   ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

4. Build the project.

The build generates Swift modules in the output directory.

## Swift package generation

As an alternative to direct integration, Swift Export can generate a Swift package containing Swift API sources,
bridge and runtime headers, and an XCFramework with compiled Kotlin libraries.

In this case, you can simply consume the Swift package in the Xcode project.
Xcode compiles the Swift sources and no Gradle build phase is needed.
Generate the package on macOS with Xcode installed, and set your iOS app's deployment target to **iOS 18.0** or later.

In your shared module, enable `swiftPackageIntegration` instead of `xcodeIntegration` used for [direct integration](#configure-kotlin-project).
If switching from direct integration, also remove the `embedSwiftExportForXcode` run script from Xcode:

```kotlin
// shared/build.gradle.kts
import org.jetbrains.kotlin.gradle.swiftexport.ExperimentalSwiftExportDsl

kotlin {
    iosArm64()
    iosSimulatorArm64()

    export {
        @OptIn(ExperimentalSwiftExportDsl::class)
        swift {
            moduleName = "Shared"
            rootPackage = "com.example.sandbox"

            swiftPackageIntegration {
                outputDirectory.set(
                    layout.projectDirectory.dir("SwiftPackage")
                )
            }
        }
    }
}
```

`outputDirectory` is optional and defaults to `SwiftPackage` beside the module's build script.
The package includes the configured Apple targets, in this example, iOS devices and simulators.
To customize dependency exports, place `configure()` calls inside `swiftPackageIntegration`, as in the direct-integration example.

An example sequence:

1. Declare a function in `shared/src/commonMain/kotlin/Greeting.kt`:

    ```kotlin
    package com.example.sandbox
    
    fun greeting(): String = "Hello from Kotlin"
    ```

2. Run the export task for the Kotlin binary configuration you need:

    ```bash
    # Generates shared/SwiftPackage/Debug
    ./gradlew :shared:exportDebugSwiftPackage
    
    # Generates shared/SwiftPackage/Release
    ./gradlew :shared:exportReleaseSwiftPackage
    ```

3. In Xcode, choose **File | Add Package Dependencies | Add Local** and select `shared/SwiftPackage/Debug` or
   `shared/SwiftPackage/Release` (not their parent directory).

4. Add the **SharedLibrary** product to your app target. Its name is the configured `moduleName` followed by `Library`.
   The Swift `import` uses `Shared` alone.

5. Import the module and call the exported function from Swift.
   The package is specified in `rootPackage`, so you can call `greeting()` directly:

    ```swift
    import Shared
    
    print(greeting())
    ```

When changing Kotlin code or export configuration, rerun the export task, then rebuild your app.
Switching Xcode's build configuration does not switch the package directory: a dependency on `Debug` still uses the Debug
Kotlin binary. Select the `Release` package when you want the release binary.

Known issues with Swift package generation:

* Dependencies imported through `swiftPMDependencies` are not supported currently.
* If SwiftUI previews crash with the generated package, try **Editor | Canvas | Use Legacy Previews Execution**
  or make the package product dynamic (see [KT-91412](https://youtrack.jetbrains.com/issue/KT-91412)).

## What's next

Learn more about [iOS integration methods](https://kotlinlang.org/docs/multiplatform/multiplatform-ios-integration-overview.html).