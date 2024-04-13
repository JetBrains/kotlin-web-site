[//]: # (title: Swift package export setup)

You can set up the Kotlin/Native output for an Apple target to be consumed as a Swift package manager (SPM) dependency.

Consider a Kotlin Multiplatform project that has an iOS target. You may want to make this iOS binary available
as a dependency to iOS developers working on native Swift projects. Using Kotlin Multiplatform tooling, you can provide
an artifact that would seamlessly integrate with their Xcode projects.

This guide shows how to do this by building [XCFrameworks](multiplatform-build-native-binaries.md#build-xcframeworks)
with the Kotlin Gradle plugin.

## Prepare file locations

To make your framework consumable, you need to upload two files:
* A ZIP archive of the XCFramework. Upload it to a convenient file storage with direct access (for example,
creating a GitHub release with the archive attached, using Amazon S3 or Maven).
  Choose the option that is easiest to integrate into your workflow.
* The `Package.swift` file describing the package. Prepare a Git repository and push it there.
  To decide how to organize your repositories, see the pros and cons of several options below.

### Swift package distribution

Consider the following options for organizing your Git repositories:

* Store the `Package.swift` file in an independent repository. This allows versioning it separately from the
Kotlin Multiplatform project the file describes. This is the recommended approach: it allows scaling and generally easier
to maintain.
* Put the `Package.swift` file next to your Kotlin Multiplatform code. This is a more straightforward approach, but
  keep in mind in this case the Swift package and the code will use the same versioning. SPM uses
  Git tags for versioning packages, and this can conflict with tags used for the project. 
* Store the `Package.swift` within the consumer project's repository. This helps to avoid the versioning and maintenance issues.
  However, this approach can cause problems with multi-repository SPM setups of the consumer project and further automation:

  * In a multi-package project, only one consumer package can depend on the external module (to avoid dependency conflicts
  within the project). So, all the logic that depends on your Kotlin Multiplatform module should be encapsulated in a particular consumer package.
  * If you publish the Kotlin Multiplatform project using an automated CI process, this process would need to include publishing the
  updated `Package.swift` file to the consumer repository. Such a phase in CI can be difficult to maintain as it may lead
  to conflicting updates of the consumer repository.

## Create the XCFramework and the Swift package manifest

> The following example assumes that the shared code of your Kotlin Multiplatform project is stored in the `shared` module.
> If your project is structured differently, substitute "shared" in code and path examples with your module's name.  
>
{type="tip"}

To provide a Swift package:
1. Set up the publishing of an [XCFramework](multiplatform-build-native-binaries.md#build-xcframeworks). Add the `XCFramework`
call to your iOS targets description in the `shared/build.gradle.kts` file:
   ```kotlin
   import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework
   
   kotlin {
       // Other Kotlin Multiplatform targets
       // ...
       // Name of the module to be imported in the consumer project
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
  
   The resulting framework will be created as the `shared/build/XCFrameworks/release/Shared.xcframework` folder in your project directory.

3. Put the `Shared.xcframework` folder in a ZIP archive and calculate the checksum for the resulting archive, for example:
   
   `swift package compute-checksum Shared.xcframework.zip`

4. <anchor name="upload"></anchor> Upload the ZIP file to the file storage of your choice.
5. Create a `Package.swift` file with the following code:

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
   
6. Validate the manifest.
   One way to do this is to run the following shell command in the directory with the `Package.swift` file:

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```
    
    The output will describe any found errors, or show the successful download and parsing result if the manifest is correct.

7. Push the `Package.swift` file to the repository you settled on earlier. Make sure to create and push a git tag with the
semantic version of the package.

Now that both files are accessible, you can test the import in Xcode:

1. Choose **File | Add Package Dependencies...**
2. Provide the Git URL for the repository with the `Package.swift` file.
3. Depending on the type of your project, the dialog will vary:
   * If you're making a Swift package, press the **Copy package** button. This will put a `.package` line in your clipboard.
     Paste this line into the [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency)
     block of your own `Package.swift` file, and add the necessary product to the appropriate `Target.Dependency` block.
   * For other Xcode projects, press the **Add package** button, then select products and corresponding targets for the package.

## Exporting multiple modules as an XCFramework

To make code from several Kotlin Multiplatform modules available as an iOS binary, combine these modules in a single
umbrella module. Then, build and export the XCFramework of this umbrella module.

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
    
        // Dependencies set as "api" (as opposed to "implementation") to export underlying modules
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

3. Create an empty Kotlin file inside the `together` folder, for example, `together/src/commonMain/kotlin/Together.kt`.
   This is a workaround, as the Gradle script currently cannot assemble a framework if the exported module does not
   contain any source code.

4. Run the Gradle task that assembles the framework:

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5. Follow steps 4–7 from [the previous section](#upload) for `together.xcframework`: archive, calculate the checksum, upload
the archived XCFramework, create and push a `Package.swift` file.

Now you can import the dependency into an Xcode project. After adding the `import together` directive,
you should have classes from both the `network` and `database` modules available for import in Swift code.
