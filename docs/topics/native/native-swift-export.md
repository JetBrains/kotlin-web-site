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
* **SwiftPM support**. Swift Export allows generating Swift packages to be consumed by iOS projects.
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

## Current limitations

Known issues general to Swift export:

* The Swift export DSL has no API for passing compiler arguments, including arguments for link tasks. Set the options
  you need at the _module level_ in the `compilerOptions {}` block instead. If your project
  requires passing compiler arguments through the Swift export DSL, describe your use case in [YouTrack](https://kotl.in/issue).
* When using declarations that require opt-in, add an explicit `optIn` compiler option to the Gradle build file in the exporting module.
  For example, for the `kotlinx.datetime` library:

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
