[//]: # (title: Migrate to the new Swift export DSL)

<primary-label ref="alpha"/>

Kotlin 2.5.0 ships with a more ergonomic Gradle DSL for configuring Swift export, which aims to reduce duplication and
increase configuration reuse. This guide will help you migrate your project to the new DSL.

We'll start with the following build file and migrate it to the new DSL step by step:

```kotlin
// shared/build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    swiftExport {
        // Set the root module name
        moduleName = "Shared"

        // Set the collapse rule
        // Removes package prefix from generated Swift code
        flattenPackage = "com.example.sandbox"

        // Configure subproject export
        export(project(":subproject")) {
            // Set the name for the exported module 
            moduleName = "Subproject"
            // Set the collapse rule for the exported dependency 
            flattenPackage = "com.subproject.library"
        }
        
        // Configure external module export
        export(libs.utils) {
            // Set the name for the exported module 
            moduleName = "Utils"
            // Set the collapse rule for the exported dependency 
            flattenPackage = "com.example.utils"
        }

        // Provide compiler arguments to link tasks
        configure {
            freeCompilerArgs.add("-Xexpect-actual-classes")
        }
    }
    
    sourceSets {
        commonMain {
            dependencies {
                api(project(":subproject"))
                implementation(libs.utils)
            }
        }
    }
}
```

### Replace `swiftExport` entry point with `export.swift`

```kotlin
// shared/build.gradle.kts
kotlin {
    // ...

    export {
        swift {
          // ...
        }
    }

  // ...
}
```

### Replace `flattenPackage` property use sites with `rootPackage`

```kotlin
// shared/build.gradle.kts
kotlin {
    // ...

    export {
        swift {
            // ...

            // Set the collapse rule
            // Removes package prefix from generated Swift code
            rootPackage = "com.example.sandbox"

            // Configure subproject export
            export(project(":subproject")) {
                // ...
                
                // Set the collapse rule for the exported dependency 
                rootPackage = "com.subproject.library"
            }

            // Configure external module export
            export(libs.utils) {
                // ...
                
                // Set the collapse rule for the exported dependency 
                rootPackage = "com.example.utils"
            }

            // ...
        }
    }

    // ...
}
```

### Remove explicit `export` invocations

In the new Swift export DSL, an exported module's declared dependencies are exported automatically: direct `api` 
dependencies are exported fully (meaning their entire API surface is exported), and direct `implementation` and 
transitive dependencies are exported transitively (only the API that leaks into the public API of the exported module 
is exported). 

In cases when it's necessary to override the default values of `moduleName` and `rootPackage` for exported dependencies,
a couple of options are available:

- For project dependencies, the overrides can be declared in the `export.swift` DSL of the project's `build.gradle.kts` 
  file.
- For external dependencies, the new `configure` API is available.

First, let's move the export options overrides for the `:subproject` dependency to its own `build.gradle.kts`: 

```kotlin
// subproject/build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    export {
        swift {
            // Set the root module name
            moduleName = "Subproject"

            // Set the collapse rule
            // Removes package prefix from generated Swift code
            rootPackage = "com.subproject.library"
        }
    }
}

// shared/build.gradle.kts
kotlin {
    // ...

    export {
        swift {
            // Set the root module name
            moduleName = "Shared"

            // Set the collapse rule
            // Removes package prefix from generated Swift code
            rootPackage = "com.example.sandbox"

            // Configure external module export
            export(libs.utils) {
                // Set the name for the exported module 
                moduleName = "Utils"
                // Set the collapse rule for the exported dependency 
                rootPackage = "com.example.utils"
            }

            // ...
        }
    }

    // ...
}
```

Then, we'll migrate the overrides for `libs.utils`'s options to the new `configure` API and update its dependency scope
to `api`.

Note that `configure` is optional: if no overrides are necessary, it can be omitted - `libs.utils` will still be 
included in Swift export since it's part of the exported module's dependency graph. It's also important to mention that 
Swift export configuration is now publishable, so if the author of `libs.utils` supplied options overrides for the 
library, they'll be automatically consumed by Gradle and applied during Swift export.

```kotlin
// shared/build.gradle.kts
kotlin {
    // ...

    export {
        swift {
            // ...

            // Configure external module export
            configure(libs.utils) {
                // Set the name for the exported module 
                moduleName = "Utils"
                // Set the collapse rule for the exported dependency 
                rootPackage = "com.example.utils"
            }

            // ...
        }
    }

    sourceSets {
        commonMain {
            dependencies {
                // ...
                api(libs.utils)
            }
        }
    }
}
```

### Remove `freeCompilerArgs` API

This API has not been included in the new DSL. If your project requires it - please consider filing an issue in
[YouTrack](https://kotl.in/issue) and describing your use case.

```kotlin
// shared/build.gradle.kts
kotlin {
    // ...

    export {
        swift {
            // Set the root module name
            moduleName = "Shared"

            // Set the collapse rule
            // Removes package prefix from generated Swift code
            rootPackage = "com.example.sandbox"

            // Configure external module export
            configure(libs.utils) {
                // Set the name for the exported module 
                moduleName = "Utils"
                // Set the collapse rule for the exported dependency 
                rootPackage = "com.example.utils"
            }
        }
    }

    // ...
}
```

## Final version

Here's our complete build configuration after the migration:

```kotlin
// subproject/build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    export {
        swift {
            // Set the root module name
            moduleName = "Subproject"

            // Set the collapse rule
            // Removes package prefix from generated Swift code
            rootPackage = "com.subproject.library"
        }
    }
}

// shared/build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    export {
        swift {
            // Set the root module name
            moduleName = "Shared"

            // Set the collapse rule
            // Removes package prefix from generated Swift code
            rootPackage = "com.example.sandbox"

            // Configure external module export
            configure(libs.utils) {
                // Set the name for the exported module 
                moduleName = "Utils"
                // Set the collapse rule for the exported dependency 
                rootPackage = "com.example.utils"
            }
        }
    }

    sourceSets {
        commonMain {
            dependencies {
                api(project(":subproject"))
                api(libs.utils)
            }
        }
    }
}
```

## Feedback

The new Swift export DSL is experimental in Kotlin 2.5.0. If you'd like to provide feedback, you can do so:

* In Kotlin Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  and join the [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) channel.
* By reporting issues in [YouTrack](https://kotl.in/issue).
