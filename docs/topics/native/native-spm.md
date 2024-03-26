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

## Create the XCFramework and the Package.swift file

> The following example assumes that the shared code of your KMP project is stored in the `shared` module.
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
      // Name of the module that will be imported in the consumer project
      val xcframeworkName = "Shared"
      val xcf = XCFramework(xcframeworkName)
   
      listOf(
         iosX64(),
         iosArm64(),
         iosSimulatorArm64(),
      ).forEach {
          it.binaries.framework {
              baseName = xcframeworkName
              // Specify CFBundleIdentifier to uniquely identify the framework
              binaryOption("bundleId", "org.example.${xcframeworkName}")
              xcf.add(this)
              isStatic = true
           }
        }
      //...
   }
   ```
2. Run the Gradle task to create the framework:
   
   `./gradlew :shared:assembleSharedReleaseXCFramework`
3. The resulting framework will be created as the `shared/build/XCFrameworks/release/Shared.xcframework` folder in your project directory.
4. Put the `Shared.xcframework` folder in a ZIP archive and calculate the checksum for the resulting archive, for example:
   
   `swift package compute-checksum Shared.xcframework.zip`
5. Upload the ZIP file to the file storage of your choice.
6. Create a `Package.swift` file with the following code:
   ```Swift
   // swift-tools-version:5.3
   import PackageDescription
    
   let package = Package(
      name: "Shared",
      platforms: [
        .iOS(.v14),
      ],
      products: [
         .library(name: "Shared", targets: ["shared"])
      ],
      targets: [
         .binaryTarget(
            name: "Shared",
            url: "<link to the uploaded XCFramework ZIP file>",
            checksum:"<checksum calculated for the ZIP file>")
      ]
   )
   ```
7. You can check if the package manifest is valid by running the following command next to the `Package.swift` file:

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```
    
    The output will describe any found errors, or show the successful download and parsing result if the manifest is correct.

8. Push the `Package.swift` file to the repository you settled on earlier. Make sure to create and push a git tag with the
Semantic Version of the package.

Now that both files are accessible, you can try and set up the dependency in Xcode:
* In an Xcode project, choose **File | Add Package Dependencies...** and provide the Git URL for the repo with
the `Package.swift` file.
* In an SPM project, create a dependency following the Apple documentation on [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency).

## Exporting multiple modules as a single XCFramework

To make several KMP modules available as iOS binaries, create an umbrella module and combine other modules in it,
then build an XCFramework of this umbrella module.

<!--TODO remove this note when https://youtrack.jetbrains.com/issue/KT-66565 is fixed-->

> The name `umbrella` is reserved in Apple development. Don't use it for the module you are exporting.
> 
{type="note"}

For example, you have a `network` and a `database` module, which you combine in an `together` module:

1. In the `together/build.gradle.kts` file, specify dependencies and the framework configuration:

    ```kotlin
    kotlin {
        val frameworkName = "together"
        val xcf = XCFramework(frameworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget ->
            // Same as in the example above,
            // with added export calls for dependencies
            iosTarget.binaries.framework {
                export(projects.network)
                export(projects.database)
    
                baseName = frameworkName
                xcf.add(this)
            }
        }
    
        // Dependencies set as api to export underlying modules
        sourceSets {
            commonMain.dependencies {
                api(projects.network)
                api(projects.database)
            }
        }
    }
    ```

2. Each of the included modules should have its iOS targets configured, for example:

    ```kotlin
    kotlin {
        androidTarget {
            //...
        }
        
        iosX64()
        iosArm64()
        iosSimulatorArm64()
        
        //...
    }
    ```

3. Currently, the Gradle script cannot assemble a framework if the module being exported does not contain any source code.
   To work around this, create an empty Kotlin file inside the `together` folder, for example, `together/src/commonMain/kotlin/Together.kt`.

4. Run the Gradle task that assembles the framework:

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5. Follow steps 5–9 from [the previous section](#create-the-xcframework-and-the-package-swift-file) for `together.xcframework`: archive, calculate the checksum, upload
the archived XCFramework, create and push a `Package.swift` file.

Now you can try and import the dependency into an Xcode project: after adding the `import together` directive,
you should have classes from both the `network` and `database` modules available for import in Swift code.
