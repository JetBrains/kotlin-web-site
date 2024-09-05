[//]: # (title: Direct integration)

If you already have a Kotlin Multiplatform and an iOS project and want to develop them simultaneously to share code, you
can set up direct integration through a special `embedAndSignAppleFrameworkForXcode` script.

This script automates the process of connecting the Kotlin framework to iOS projects in Xcode. It's designed
specifically for the Xcode environment.

![Direct integration diagram](direct-integration-scheme.svg){width="700"}

The idea of direct integration is to make the Kotlin build a part of the iOS build.
The script is added to the run script phase of the iOS app build so that the Kotlin artifact is built and included in
the derived data before running the iOS app build.

In general, the script:

* Copies the compiled Kotlin framework into the correct directory within the iOS project structure.
* Handles the code signing process of the embedded framework.
* Ensures that code changes in the Kotlin framework are reflected in the iOS app in Xcode.

## How to set up

If you're currently using the CocoaPods plugin to connect your Kotlin framework, migrate first.

### Migrate from CocoaPods plugin to direct integration {initial-collapse-state="collapsed"}

To migrate from the CocoaPods plugin:

1. In Xcode, clean build directories using **Product** | **Clean Build Folder** or with the
   <shortcut>Cmd + Shift + K</shortcut> shortcut.
2. In the directory with `Podfile`, run the following command:

    ```none
   pod deintegrate
   ```

3. Remove the `cocoapods {}` block from your `build.gradle(.kts)` files.
4. Delete the `.podspec` and `Podfile` files.

### Connect the framework to your project

To connect the Kotlin framework generated from the multiplatform project to your Xcode project:

1. The `embedAndSignAppleFrameworkForXcode` task only registers if the `binaries.framework` configuration option is
   declared. In your Kotlin Multiplatform project, check the iOS target declaration in the `build.gradle.kts` file.
2. In Xcode, open the iOS project settings by double-clicking the project name.
3. On the **Build Phases** tab of the project settings, click the **+** and add **New Run Script Phase**.

   ![Add run script phase](xcode-run-script-phase-1.png){width=700}

4. Adjust the following script and add it in the run script phase:

   ```bash
   cd "<Path to the root of the multiplatform project>"
   ./gradlew :<Shared module name>:embedAndSignAppleFrameworkForXcode 
   ```

   * In the `cd` command, specify the path to the root of your Kotlin Multiplatform project, for example, `$SRCROOT/..`.
   * In the `./gradlew` command, specify the name of the shared module, for example, `:shared` or `:composeApp`.

   ![Add the script](xcode-run-script-phase-2.png){width=700}

5. Move the **Run Script** phase before the **Compile Sources** phase.

   ![Move the Run Script phase](xcode-run-script-phase-3.png){width=700}

6. On the **Build Settings** tab, disable the **User Script Sandboxing** under **Build Options**:

   ![User Script Sandboxing](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > This may require restarting your Gradle daemon, if you built the iOS project without disabling sandboxing first.
   > Stop the Gradle daemon process that might have been sandboxed:
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > {type="tip"}

7. Build the project in Xcode. If everything is set up correctly, the project will successfully build.

> If you have a custom build configuration different from the default `Debug` or `Release`, on the **Build Settings**
> tab, add the `KOTLIN_FRAMEWORK_BUILD_TYPE` setting under **User-Defined** and set it to `Debug` or `Release`.
>
{type="note"}

## What's next?

You can also take advantage of local integration when working with the Swift package manager. [Learn how to add a
dependency on a Kotlin framework in a local package](multiplatform-spm-local-integration.md).