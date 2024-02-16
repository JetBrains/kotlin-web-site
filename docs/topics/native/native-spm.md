[//]: # (title: Swift Package export setup)

Kotlin/Native output for an Apple target can be consumed as an SPM dependency.
For example, if your Kotlin Multiplatform project has an iOS target, you may want to make the binary available
as a dependency to iOS developers working on native Swift projects in Xcode. Using KMP tooling, you can provide
an artifact that would seamlessly integrate with Xcode experience.

This guide shows how to do this using the [XCFramework building](multiplatform-build-native-binaries.md#build-xcframeworks)
capability of Kotlin Gradle.

## Prepare locations for the files to be uploaded

To make your framework available to be consumed, you will need to upload two files:
* A ZIP archive of the XCFramework itself should be uploaded to a convenient file storage with direct access (for example,
S3, GitHub Releases, or a Maven repository). Choose the option that is easiest to integrate into your workflow.
* The `Package.swift` file describing the package needs to be placed in a Git repository. You need to decide which
repository to use. Pros and cons for several options are discussed below.

### Options for Package.swift distribution
The `Package.swift` that describes the Swift Package needs to be placed in a Git repository:
* Store the `Package.swift` file in an independent repository to make its versioning separate from the
KMP project the file describes. This is the recommended approach, allowing scalability and generally easier
maintenance.
* Put the `Package.swift` file next to your KMP code for a more straightforward approach. Keep in mind that versioning
a Swift Package in the same repository as the code can become challenging as SPM uses Git tags for versioning packages
and this can conflict with using tags for the project itself. 
* Store the `Package.swift` within the consumer project's repo to avoid the versioning and maintenance issues.

  However, this approach can cause problems for multi-repository SPM setups of the consumer project and further automation:
  1. Only one consumer package in a multi-package project can depend on the external module, to avoid dependency conflicts
  within the project. So all the logic depending on your KMP module should be encapsulated in a particular consumer package.
  2. If you publish the KMP project using an automated CI process, this process would need to include publishing the
  updated `Package.swift` file to the consumer repo. Such a phase in CI can be difficult to maintain as it may lead
  to conflicting updates of the consumer repo.

Now that you understand the options, create or adjust a Git repository as needed.

## Create the XCFramework and the `Package.swift` file

> The following example assumes that the shared code of your KPM project is stored in the `shared` module.
> If your project is structured differently, substitute "shared" in code and path examples with the name of your module.  
>
{type="tip"}

To provide a Swift package, you can follow these steps:
1. Set up publishing of an [XCFramework](multiplatform-build-native-binaries.md#build-xcframeworks). Add an `XCFramework`
call to your iOS targets description in the `shared/build.gradle.kts` file:
   ```kotlin
   import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework
   
   kotlin {
      // other KMP targets
      // ...
      val xcf = XCFramework()
      // Name of the module that will be imported in the consumer project
      val xcframeworkName = "ExampleDependency"
   
      listOf(
         iosX64(),
         iosArm64(),
         iosSimulatorArm64(),
      ).forEach {
           it.binaries.framework {
              baseName = xcframeworkName
              xcf.add(this)
           }
        }
      //...
   }
   ```
2. Sync the updated Gradle configuration.
3. Run the Gradle task to create the framework:
   
   `./gradlew :shared:assembleSharedReleaseXCFramework`
4. The resulting framework will be created as the `shared/build/XCFrameworks/release/shared.xcframework` folder in your project directory.
5. Put the `shared.xcframework` folder in a ZIP archive and calculate the checksum for the resulting archive, for example:
   
   `swift package compute-checksum shared.xcframework.zip`
6. Upload the ZIP file to the file storage of your choice.
7. Create a `Package.swift` file with the following code:
   ```Swift
   // swift-tools-version:5.3
   import PackageDescription
    
   let package = Package(
      name: "shared",
      platforms: [
        .iOS(.v14),
      ],
      products: [
         .library(name: "shared", targets: ["shared"])
      ],
      targets: [
         .binaryTarget(
            name: "shared",
            url: "<link to the uploaded XCFramework ZIP file>"),
            checksum:"<checksum calculated for the ZIP file>"
      ]
   )
   ```
8. You can check if the package manifest is valid by running the following command next to the `Package.swift` file:

    ```shell
    swift package describe
    ```
    
    The output will describe any found errors, or show the parsed tree of the manifest if it is grammatically correct. 
9. Push the `Package.swift` file to the repository you settled on earlier. Make sure to create a git tag with the
Semantic Version of the package.

Now that both files are accessible, you can try and set up the dependency in Xcode:
* In an Xcode project, choose **File | Add Package Dependencies...** and provide the Git URL for the repo with
the `Package.swift` file.
* In an SPM project, create a dependency following the Apple documentation on [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency).

## Exporting different modules as a single XCFramework

If your project contains unrelated KMP modules which you would like to export as a single iOS binary, you can create
an umbrella module and combine other modules in it.

For example, you have a `network` and a `database` module, which you combine in an `umbrella` module.

1. In the `umbrella/build.gradle.kts` file, specify dependencies and the framework configuration:

    ```kotlin
    kotlin {
        val frameworkName = "umbrella"
        val xcf = XCFramework()
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget ->
            // Same as in the example above, with added export calls for dependencies
            iosTarget.binaries.framework {
                export(projects.shared)
                export(projects.sharedUi)
    
                baseName = frameworkName
                xcf.add(this)
            }
        }
    
        // Dependencies set as api to export underlying modules
        sourceSets {
            commonMain.dependencies {
                api(projects.shared)
                api(projects.sharedUi)
            }
        }
    }
    ```

2. Each of the included modules should have its iOS targets configured, for example:

    ```kotlin
    kotlin {
        // ...
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget ->
            iosTarget.binaries.framework {
                baseName = "network"
                isStatic = true
            }
        }
        //...
    }
    ```

3. Currently, a framework cannot be assembled if the module being built does not contain any source code. To work around
this:
   1. Create a source file inside the `umbrella` folder, for example, `umbrella/src/commonMain/kotlin/Umbrella.kt`.
   2. Create an empty `main()` function inside this file:
       ```kotlin
      fun main() {

      }
       ```

4. Run the Gradle task that assembles the framework:

    ```shell
    ./gradlew :umbrella:assembleUmbrellaReleaseXCFramework
    ```

5. Follow steps 5–9 from [the previous section](#create-the-xcframework-and-the-package-swift-file) for `umbrella.xcframework`: archive, calculate the checksum, upload
the archived XCFramework, create and push a `Package.swift` file.

Now you can try and import the dependency into an Xcode project: you should have both `network` and `database` modules
available for import in Swift code.