[//]: # (title: Use a Kotlin Gradle project as a CocoaPods dependency)

To use a Kotlin Multiplatform project with native targets as a CocoaPods dependency, [complete the initial configuration](native-cocoapods.md#set-up-an-environment-to-work-with-cocoapods).
You can include such a dependency in the Podfile of the Xcode project by its name and path to the project directory
containing the generated Podspec.

This dependency will be automatically built (and rebuilt) along with this project. Such an approach
simplifies importing to Xcode by removing a need to write the corresponding Gradle tasks and Xcode build steps manually.

You can add dependencies between a Kotlin Gradle project and an Xcode project with one or several targets. It's also possible to add
dependencies between a Gradle project and multiple Xcode projects. However, in this case, you need to add a
dependency by calling `pod install` manually for each Xcode project. In other cases, it's done automatically.

> * To correctly import the dependencies into the Kotlin/Native module, the `Podfile` must contain either
>   [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang) or
>   [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang) directive.
> * If you don't specify the minimum deployment target version and a dependency Pod requires a higher deployment target,
>   you will get an error.
>
{type="note"}

## Xcode project with one target

1. Create an Xcode project with a `Podfile` if you haven't done so yet.
2. Make sure to disable the **User Script Sandboxing** under **Build Options** in the application target:

   ![Disable sandboxing CocoaPods](disable-sandboxing-cocoapods.png)

3. Add the path to your Xcode project `Podfile` with `podfile = project.file(..)` to `build.gradle(.kts)`
   of your Kotlin project.
   This step helps synchronize your Xcode project with Gradle project dependencies by calling `pod install` for your `Podfile`.
4. Specify the minimum deployment target version for the Pod library.

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "13.5"
            pod("FirebaseAuth") {
                version = "10.16.0"
            }
            podfile = project.file("../ios-app/Podfile")
        }
    }
    ```

5. Add the name and path of the Gradle project you want to include in the Xcode project to `Podfile`.

    ```ruby
    use_frameworks!

    platform :ios, '13.5'

    target 'ios-app' do
            pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

6. Re-import the project.

## Xcode project with several targets

1. Create an Xcode project with a `Podfile` if you haven't done so yet.
2. Add the path to your Xcode project `Podfile` with `podfile = project.file(..)` to `build.gradle(.kts)`
   of your Kotlin project.
   This step helps synchronize your Xcode project with Gradle project dependencies by calling `pod install` for your `Podfile`.
3. Add dependencies to the Pod libraries you want to use in your project with `pod()`.
4. For each target, specify the minimum deployment target version for the Pod library.

    ```kotlin
    kotlin {
        ios()
        tvos()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "13.5"
            tvos.deploymentTarget = "13.4"

            pod("FirebaseAuth") {
                version = "10.16.0"
            }
            podfile = project.file("../severalTargetsXcodeProject/Podfile") // specify the path to the Podfile
        }
    }
    ```

5. Add the name and path of the Gradle project you want to include in the Xcode project to the `Podfile`.

    ```ruby
    target 'iosApp' do
      use_frameworks!
      platform :ios, '13.5'
      # Pods for iosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end

    target 'TVosApp' do
      use_frameworks!
      platform :tvos, '13.4'

      # Pods for TVosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

6. Re-import the project.

You can find a sample project [here](https://github.com/Kotlin/kmm-with-cocoapods-multitarget-xcode-sample).