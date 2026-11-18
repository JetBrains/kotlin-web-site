[//]: # (title: Interoperability with Swift using Swift export)

<primary-label ref="beta"/>

Kotlin's interoperability with Swift through Swift export is currently in Beta. Swift export allows you to export Kotlin sources
directly and call Kotlin code from Swift idiomatically, eliminating the need for Objective-C headers.

Swift export makes multiplatform development for Apple targets more streamlined. For example, if you have a Kotlin module
with top-level functions, Swift export enables clean, module-specific imports, removing the confusing Objective-C
underscores and mangled names.

Current Swift export features are:

* **Multi-module support**. Each Kotlin module is exported as a separate Swift module, simplifying function calls.
* **Package support**. Kotlin packages are explicitly preserved during export, avoiding naming conflicts in the
  generated Swift code.
* **Type aliases**. Kotlin type aliases are exported and preserved in Swift, improving readability.
* **Enhanced nullability for primitives**. Unlike Objective-C interop, which required boxing types like `Int?` into
  wrapper classes like `KotlinInt` to preserve nullability, Swift export converts nullability information directly.
* **Overloads**. You can call Kotlin's overloaded functions in Swift without ambiguity.
* **Collapse rule**. You can remove a common package prefix from the generated Swift code with the `rootPackage`
  property.
* **Module name customization**. You can customize the resulting Swift module names in the Gradle configuration of your
  Kotlin project.
* **Concurrency support**. You can seamlessly call suspending Kotlin code from Swift and export `kotlinx.coroutines`
  flows as Swift's `AsyncSequence` out of the box.
* **[Cross-language inheritance](native-swift-export-mappings.md#cross-language-inheritance)**. You can implement Kotlin
  interfaces and subclass Kotlin classes from Swift, which enables the [reverse import](native-lib-import-stability.md#swift-library-import) pattern.

For details on how Kotlin concepts are mapped to Swift, see [Mappings between Kotlin and Swift](native-swift-export-mappings.md).
You might also find the [`swift-export-sample`](https://github.com/Kotlin/swift-export-sample) project useful: a runnable
Kotlin Multiplatform sample with Swift code for each mapping.

## Enable Swift export

Swift export is currently in [Beta](components-stability.md#stability-levels-explained), so changes are still possible.
To try it out, [configure the build file](#configure-kotlin-project) in your Kotlin project and [set up Xcode](#configure-xcode-project)
to integrate Swift export.

> You can also clone our [public sample](https://github.com/Kotlin/swift-export-sample) with Swift export already set up.
>
{style="tip"}

### Configure Kotlin project

You configure Swift export in the `export { swift {} }` block of your build file. It describes how the module is exported
to Swift, for example a Swift module name and a collapse rule.

The module that your Xcode project connects to with [direct integration](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html),
usually the `shared` module, must also call `xcodeIntegration()`. This call enables Xcode as a consumer of Swift export
and sets up the integration:

* Registers the [`embedSwiftExportForXcode` task](#configure-xcode-project) that Xcode runs in the **Run Script** build phase.
* Adds the Gradle configurations and tasks that resolve the export graph, generate the Swift code for the module and
  its dependencies, and compile it for Xcode.

The declared dependencies of an exported module are exported automatically:

* Direct `api` dependencies are exported fully, meaning that their entire API surface is available in Swift.
* Direct `implementation` dependencies and transitive dependencies are exported transitively, meaning that only the API
  that leaks into the public API of the exported module is available in Swift.

You can use the following build files in your project as a starting point for setting up Swift export:

```kotlin
// subproject/build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    // This configuration is used when exporting ":subproject"
    // as a dependency of ":shared"
    export {
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
kotlin {

    iosArm64()
    iosSimulatorArm64()

    export {
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

The Kotlin compiler automatically generates all the necessary files (including `swiftmodule` files,
static `.a` library, a header file, and a `modulemap` file) and copies them into the app's build directory, which you can
access from Xcode.

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
{style="note"}

### Configure Xcode project

To configure Xcode to integrate Swift export into your project:

1. In Xcode, open the project settings.
2. On the **Build Phases** tab, locate the **Run Script** phase with the `embedAndSignAppleFrameworkForXcode` task.
3. Replace the script with the `embedSwiftExportForXcode` task in the run script phase:

   ```bash
   ./gradlew :<Shared module name>:embedSwiftExportForXcode
   ```

   ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

4. Build the project. The build generates Swift modules in the output directory.

## Current limitations

Swift export currently works only in projects that use
[direct integration](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html) to
connect the iOS framework to the Xcode project.
This is a standard configuration for Kotlin Multiplatform projects created with the Kotlin Multiplatform plugin in IntelliJ
IDEA or through the [web wizard](https://kmp.jetbrains.com/).

Other known issues:

* No IDE migration tips or automation are available.
* When using declarations that require opt-in, you must add an explicit `optIn` compiler option at the _module
  level_ to your Gradle build file. For example, for the `kotlinx.datetime` library:

  ```kotlin
  export {
      swift {
          moduleName = "Shared"

          xcodeIntegration {
              configure("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%") {
                  moduleName = "KotlinDateTime"
                  rootPackage = "kotlinx.datetime"
              }
          }
      }
  }

  // Add a separate opt-in block at the module level
  compilerOptions {
      optIn.add("kotlin.time.ExperimentalTime")
  }
  ```

## Evolution of Swift export

We're planning to expand and stabilize Swift export in future Kotlin releases, improving interoperability
between Kotlin and Swift. You can leave your feedback:

* In Kotlin Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  and join the [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) channel.
* Report issues in [YouTrack](https://kotl.in/issue).

## What's next

For a complete reference of how Kotlin declarations, types, packages, and concurrency features map to Swift, see
[Mappings between Kotlin and Swift](native-swift-export-mappings.md).
