[//]: # (title: Using Kotlin from local Swift packages)

<tldr>
   This is a local integration method. It can work for you if:<br/>

   * You have an iOS app with local SPM modules.
   * You've already set up a Kotlin Multiplatform project targeting iOS on your local machine.
   * Your existing iOS project has a static linking type.<br/>

   [Choose the integration method that suits you best](multiplatform-ios-integration-overview.md)
</tldr>

In this tutorial, you'll learn how to integrate a Kotlin framework from a Kotlin Multiplatform project into a local
package using the Swift package manager (SPM).

![Direct integration diagram](direct-integration-scheme.svg){width=700}

To set up the integration, you'll add a special script that uses the `embedAndSignAppleFrameworkForXcode` Gradle task
as a pre-action in your project's build settings. To see the changes made in common code reflected in your Xcode project,
you'll only need to rebuild the Kotlin Multiplatform project.

This way, you can easily use Kotlin code in local Swift packages, compared to a regular direct integration method,
that adds the script to the build phase and requires rebuilding both the Kotlin Multiplatform and the iOS project to get
the changes from the common code.

> If you aren't familiar with Kotlin Multiplatform, learn how to [set up the environment](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-setup.html)
> and [create a cross-platform application from scratch](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) first.
>
{style="tip"}

## Set up the project

The feature is available starting with Kotlin 2.0.0.

> To check the Kotlin version, navigate to the `build.gradle(.kts)` file in the root of your Kotlin Multiplatform project.
> You'll see the current version in the `plugins {}` block at the top of the file.
> 
> Alternatively, check the version catalog in the `gradle/libs.versions.toml` file.
> 
{style="tip"}

The tutorial assumes that your project is using [direct integration](multiplatform-direct-integration.md)
approach with the `embedAndSignAppleFrameworkForXcode` task in the project's build phase. If you're connecting a Kotlin
framework through CocoaPods plugin or through Swift package with `binaryTarget`, migrate first.

### Migrate from SPM binaryTarget integration to local direct integration {initial-collapse-state="collapsed" collapsible="true"}

To migrate from the SPM integration with `binaryTarget`:

1. In Xcode, clean build directories using **Product** | **Clean Build Folder** or with the
   <shortcut>Cmd + Shift + K</shortcut> shortcut.
2. In every `Package.swift` file, remove both dependencies to the package with a Kotlin framework inside and target
   dependencies to the products.

### Migrate from CocoaPods plugin to direct integration {initial-collapse-state="collapsed" collapsible="true"}

> If you have dependencies on other Pods in the `cocoapods {}` block, you have to resort to the CocoaPods integration approach.
> Currently, it's impossible to both have dependencies on Pods and on the Kotlin framework in a multimodal SPM project. 
>
{style="warning"}

To migrate from the CocoaPods plugin:

1. In Xcode, clean build directories using **Product** | **Clean Build Folder** or with the
   <shortcut>Cmd + Shift + K</shortcut> shortcut.
2. In the directory with `Podfile`, run the following command:

    ```none
   pod deintegrate
   ```

3. Remove the `cocoapods {}` block from your `build.gradle(.kts)` files.
4. Delete the `.podspec` and `Podfile` files.

## Connect the framework to your project

> The integration into `swift build` is currently not supported.
>
{style="note"}

To be able to use Kotlin code in a local Swift package, connect the Kotlin framework generated from the multiplatform
project to your Xcode project:

1. In Xcode, go to **Product** | **Scheme** | **Edit scheme** or click the schemes icon in the top bar and select **Edit scheme**:

   ![Edit scheme](xcode-edit-schemes.png){width=700}

2. Select the **Build** | **Pre-actions** item, then click **+** | **New Run Script Action**:

   ![New run script action](xcode-new-run-script-action.png){width=700}

3. Adjust the following script and add it as an action:

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * In the `cd` command, specify the path to the root of your Kotlin Multiplatform project, for example, `$SRCROOT/..`.
   * In the `./gradlew` command, specify the name of the shared module, for example, `:shared` or `:composeApp`.
  
4. Choose your app's target in the **Provide build settings from** section:

   ![Filled run script action](xcode-filled-run-script-action.png){width=700}

5. You can now import the shared module into your local Swift package and use Kotlin code. For example, define the following function:

   ```Swift
   import Shared
   
   public func greetingsFromSpmLocalPackage() -> String {
       return Greeting.greet()
   }
   ```

   ![SPM usage](xcode-spm-usage.png){width=700}

6. In the `ContentView.swift` file of your iOS project, you can now use this function by importing the local package:

   ```Swift
   import SwiftUI
   import SpmLocalPackage
   
   struct ContentView: View {
       var body: some View {
           Vstack {
               Image(systemName: "globe")
                   .imageScale(.large)
                   .foregroundStyle(.tint)
               Text(greetingsFromSpmLocalPackage())
           }
           .padding()
       }
   }
   
   #Preview {
       ContentView()
   }
   ```
   
7. Build the project in Xcode. If everything is set up correctly, the project build will be successful.
   
There are a couple more factors worth considering: 

* If you have a custom build configuration that is different from the default `Debug` or `Release`, on the **Build Settings**
  tab, add the `KOTLIN_FRAMEWORK_BUILD_TYPE` setting under **User-Defined** and set it to `Debug` or `Release`.
* If you encounter an error with script sandboxing, open the iOS project settings by double-clicking the project name,
  then on the **Build Settings** tab, disable the **User Script Sandboxing** under **Build Options**.

## What's next

* [Choose your integration method](multiplatform-ios-integration-overview.md)
* [Learn how to set up Swift package export](native-spm.md)
