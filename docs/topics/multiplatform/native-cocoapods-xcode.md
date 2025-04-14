[//]: # (title: Use a Kotlin project as a CocoaPods dependency)

<tldr>

* Before adding Pod dependencies, [complete the initial configuration](native-cocoapods.md#set-up-an-environment-to-work-with-cocoapods).
* You can find a sample project in our [GitHub repository](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample).

</tldr>

You can use a whole Kotlin project as a Pod dependency. To do that, you'll need to include such
a dependency in the Podfile of your project, specifying its name and path to the project directory with the
generated Podspec.

This dependency will be automatically built (and rebuilt) along with this project. Such an approach
simplifies importing to Xcode by removing a need to write the corresponding Gradle tasks and Xcode build steps manually.

You can add dependencies between a Kotlin project and an Xcode project with one or several targets. It's also
possible to add dependencies between a Kotlin project and multiple Xcode projects. However, in this case,
you need to call `pod install` manually for each Xcode project. In other cases, it's done automatically.

> * To correctly import the dependencies into the Kotlin/Native module, the Podfile must contain either
>   [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang) or
>   [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang) directives.
> * If you don't specify the minimum deployment target version and a dependency Pod requires a higher deployment target,
>   you'll get an error.
>
{style="note"}

## Xcode project with one target

To use a Kotlin project as a Pod dependency in the Xcode project with one target:

1. Create an Xcode project if you don't have one.
2. In Xcode, ensure to disable **User Script Sandboxing** under **Build Options** in the application target:

   ![Disable sandboxing CocoaPods](disable-sandboxing-cocoapods.png)

3. In the iOS part of your Kotlin project, create a Podfile. 
4. In the shared module's `build.gradle(.kts)` file, add the path to the Podfile with `podfile = project.file()`.
   
   This step helps synchronize your Xcode project with Kotlin project dependencies by calling `pod install` for your Podfile.
5. Specify the minimum deployment target version for the Pod library:

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"
   
            pod("SDWebImage") {
                version = "5.20.0"
            }
            podfile = project.file("../ios-app/Podfile")
        }
    }
    ```

6. In the Podfile, add the name and path of the Kotlin project you want to include to the Xcode project:

    ```ruby
    target 'ios-app' do
        use_frameworks!
        platform :ios, '16.0'
    
        # Pods for iosApp
        pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7. Run `pod install` in your project directory.

   When you run `pod install` for the first time, it creates the `.xcworkspace` file. This file
   includes your original `.xcodeproj` and the CocoaPods project.
8. Close your `.xcodeproj` and open the new `.xcworkspace` file instead. This way you avoid issues with project dependencies.
9. Run **Reload All Gradle Projects** in IntelliJ IDEA (or **Sync Project with Gradle Files** in Android Studio)
   to re-import the project.

## Xcode project with several targets

To use a Kotlin project as a Pod dependency in the Xcode project with several targets:

1. Create an Xcode project if you don't have one.
2. In the iOS part of your Kotlin project, create a Podfile.
3. In the shared module's `build.gradle(.kts)` file, add the path to your project's Podfile with `podfile = project.file()`.
   
   This step helps synchronize your Xcode project with Kotlin project dependencies by calling `pod install` for your Podfile.
4. Add dependencies to the Pod libraries you want to use in your project with `pod()`.
5. For each target, specify the minimum deployment target version for the Pod library:

    ```kotlin
    kotlin {
        iosArm64()
        tvosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"
            tvos.deploymentTarget = "16.0"

            pod("SDWebImage") {
                version = "5.20.0"
            }
            // Specify the path to the Podfile
            podfile = project.file("../severalTargetsXcodeProject/Podfile")
        }
    }
    ```

6. In the Podfile, add the name and path of the Kotlin project you want to include to the Xcode project:

    ```ruby
    target 'iosApp' do
      use_frameworks!
      platform :ios, '16.0'
   
      # Pods for iosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end

    target 'TVosApp' do
      use_frameworks!
      platform :tvos, '16.0'

      # Pods for TVosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7. Run `pod install` in your project directory.

   When you run `pod install` for the first time, it creates the `.xcworkspace` file. This file
   includes your original `.xcodeproj` and the CocoaPods project.
8. Close your `.xcodeproj` and open the new `.xcworkspace` file instead. This way you avoid issues with project dependencies.
9. Run **Reload All Gradle Projects** in IntelliJ IDEA (or **Sync Project with Gradle Files** in Android Studio)
   to re-import the project.

## What's next

* [Add dependencies on a Pod library in your Kotlin project](native-cocoapods-libraries.md)
* [See how to connect the framework to your iOS project](multiplatform-direct-integration.md)
* [See the full CocoaPods Gradle plugin DSL reference](native-cocoapods-dsl-reference.md)