[//]: # (title: Swift Package Manager overview and setup)

Kotlin/Native output can be consumed as an SPM dependency. For example, if your Kotlin Multiplatform project has
an iOS target, and you want to make the binary available to iOS developers in the environment they are used to.

> The following example shows how to provide an SPM package for a Kotlin Multiplatform project with native UI
> implementations. For projects using Compose Multiplatform, substitute `shared` in code examples for `composeApp`.
>
{type="tip"}

## Prepare locations for the files to be uploaded

To make your framework available to be consumed, you will need to upload two files:
* A ZIP archive of the XCFramework itself. This archive needs to be uploaded to a file storage with direct access (for example,
  S3, GitHub Releases, or a Maven repository). Choose the option that is easiest to integrate into your CI flow.
* The `Package.swift` file that describes the Swift Package. You have the following options:
  * Store it in the same code repository as your Kotlin Multiplatform project.
  * Store it in a separate repository.
  * Store it in the repository that holds the consumer project.

Choose the options that suit your needs best and set them up. Then move on to the next step, where you'll create the files. 

## Create the XCFramework and the package description files

To be able to provide a Swift package, you need to do the following:
1. Set up publishing of an [XCFramework](multiplatform-build-native-binaries.md##build-xcframeworks). Add an `XCFramework`
call to your iOS targets description in the `shared/build.gradle.kts` file:
   ```kotlin
   import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework
   
   kotlin {
      // other KMP targets
      // ...
      val xcf = XCFramework()
   
      listOf(
         iosX64(),
         iosArm64(),
         iosSimulatorArm64(),
      ).forEach {
           it.binaries.framework {
              baseName = "Shared"
              xcf.add(this)
           }
        }
      //...
   }
   ```
2. Sync the updated Gradle configuration.
3. Run the Gradle task to create the framework: `./gradlew :shared:assembleSharedReleaseXCFramework`
4. The resulting framework will be created as the `shared/build/XCFrameworks/release/shared.xcframework` file in your project directory.
5. Put the `shared.xcframework` file in a ZIP archive and upload it to a file storage with direct access.
6. Create a `Package.swift` file with the following code:
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
         .binaryTarget(name: "shared", url: "<link to uploaded xcframework zip>")
      ],
   )
   ```
7. Upload the file to the repository you settled on earlier.

Now that both files are accessible, you can try and set up the dependency:
* In an Xcode project, choose **File | Add Package Dependencies...** and provide the Git URL for the `Package.swift` file.
* In an SPM project, create a dependency following the Apple documentation on [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency).