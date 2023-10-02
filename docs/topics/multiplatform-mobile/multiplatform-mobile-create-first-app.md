[//]: # (title: Create your first cross-platform app)

<microformat>
    <p>This is the second part of the <strong>Getting started with Kotlin Multiplatform for mobile</strong> tutorial. Before proceeding, make sure you've completed the previous step.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-mobile-setup.md">Set up an environment</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>Create your first cross-platform app</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> Update the user interface<br/>       
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Add dependencies<br/>
       <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> Share more logic<br/>
       <img src="icon-6-todo.svg" width="20" alt="Sixth step"/> Wrap up your project</p>
</microformat>

Here you will learn how to create and run your first Kotlin Multiplatform application using Android Studio.

## Create the project from a template

1. In Android Studio, select **File | New | New Project**.
2. Select **Kotlin Multiplatform App** in the list of project templates, and click **Next**.

   ![Mobile Multiplatform project template](multiplatform-mobile-project-wizard-1.png){width=700}

3. Specify a name for your first application, and click **Next**.

   ![Mobile Multiplatform project - general settings](multiplatform-mobile-project-wizard-2.png){width=700}

4. In the **iOS framework distribution** list, select the **Regular framework** option.

   ![Mobile Multiplatform project - additional settings](multiplatform-mobile-project-wizard-3.png){width=700}

   > We recommend using the regular framework for your first project, as this option doesn't require third-party tools and
   > has fewer installation issues.
   >
   > For more complex projects, you might need the CocoaPods dependency manager that helps handle library dependencies.
   > To learn more about CocoaPods and how to set up an environment for them, see [CocoaPods overview and setup](native-cocoapods.md).
   >
   {type="tip"}

5. Keep the default names for the application and shared folders. Click **Finish**.

The project will be set up automatically. It may take some time to download and set up the required components when you
do this for the first time.

## Examine the project structure

To view the full structure of your mobile multiplatform project, switch the view from **Android** to **Project**.

![Select the Project view](select-project-view.png){width=200}

Each Kotlin Multiplatform project includes three modules:

* _shared_ is a Kotlin module that contains the logic common for both Android and iOS applications – the code you share
  between platforms. It uses [Gradle](gradle.md) as the build system that helps you automate your build process.
* _androidApp_ is a Kotlin module that builds into an Android application. It uses Gradle as the build system.
  The _androidApp_ module depends on and uses the shared module as a regular Android library.
* _iosApp_ is an Xcode project that builds into an iOS application. It depends on and uses the shared module as an iOS
  framework. The shared module can be used as a regular framework or as a [CocoaPods dependency](native-cocoapods.md),
  based on what you've chosen in the previous step in **iOS framework distribution**. In this tutorial, it's a regular
  framework dependency.

![Basic Multiplatform Mobile project structure](basic-project-structure.png){width=500}

The shared module consists of three source sets: `androidMain`, `commonMain`, and `iosMain`. _Source set_ is a Gradle
concept for a number of files logically grouped together where each group has its own dependencies.
In Kotlin Multiplatform, different source sets in a shared module can target different platforms.

![Source sets and modules structure](basic-project-structure-2.png){width=200}

The common source set uses the common Kotlin code, and platform source sets use Kotlin flavors:
Kotlin/JVM for `androidMain` and Kotlin/Native for `iosMain`.

When the shared module is built into an Android library, common Kotlin code gets treated as Kotlin/JVM.
When it is built into an iOS framework, common Kotlin gets treated as Kotlin/Native:

![Common Kotlin, Kotlin/JVM, and Kotlin/Native](modules-structure.png)

### Write common declarations

The common source set contains shared code that can be used across multiple target platforms.
It's designed to contain code that is platform-independent. If you try to use platform-specific APIs in the common source set,
IDE will show a warning:

1. Open the `Greeting.kt` file and try to access one of the Java classes, `java.util.Random().nextBoolean()`, inside the `greet()` function:

   ```kotlin
   import java.util.Random
   
   fun greet(): String {
       val firstWord = if (Random().nextBoolean()) "Hi!" else "Hello!"
   }
   ```

   Android Studio highlights that `Random` class is unresolved because you can't call specific Java functions from the common Kotlin code.
2. Follow IDE's suggestions and replace it with `kotlin.random.Random` from the Kotlin standard library.
   This is a multiplatform library that works on all platforms and is included automatically as a dependency.
   The code should now compile successfully.
3. Add a bit of unpredictability to the greeting. Update the shared code with the `reversed()` function
   from the Kotlin standard library for reversing the text:

    ```kotlin
    import kotlin.random.Random
    
    class Greeting {
        private val platform: Platform = getPlatform()

        fun greet(): String {
            val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"

            return "$firstWord\nGuess what it is! > ${platform.name.reversed()}!"
        }
    }
    ```

Writing the code only in common Kotlin has obvious limitations because it can't use any platform specifics.
Using interfaces and the [expect/actual](multiplatform-connect-to-apis.md) mechanism solves this.

### Add platform-specific implementations

The common source set can define an interface or an expected declaration. Then each platform source sets,
in this case `androidMain` and `iosMain`, has to provide actual platform-specific implementations for the expected
declarations from the common source set.

While generating the code for a specific platform, the Kotlin compiler merges expected and actual declarations
and generates a single declaration with actual implementations.

1. When creating a project in Android Studio, you get a template with the `Platform.kt` file in the `commonMain` module:

    ```kotlin
    interface Platform {
        val name: String
    }
    ```
   
   It's a common `Platform` interface with information about the platform.
2. Switch between the `androidMain` and the `iosMain` modules.
   You'll see that they have different implementations of the same functionality for the Android and the iOS source sets:
    
    ```kotlin
    // Platform.kt in androidMain module:
    import android.os.Build
    
    class AndroidPlatform: Platform {
        override val name: String =
            "Android ${Build.VERSION.SDK_INT}"
    }
    ```
   
    ```kotlin
    // Platform.kt in the iosMain module:
    import platform.UIKit.UIDevice
    
    class IOSPlatform: Platform {
        override val name: String =
            UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
    }
    ```

    * The `name` property implementation from `AndroidPlatform` uses the Android platform code, namely the `android.os.Build`
      dependency. This code is written in Kotlin/JVM. If you try to access `java.util.Random` here, this code will compile.
    * The `name` property implementation from `IOSPlatform` uses iOS platform code, namely the `platform.UIKit.UIDevice`
      dependency. It's written in Kotlin/Native, meaning you can write iOS code in Kotlin. This code becomes a part of the iOS
      framework, which you will later call from Swift in your iOS application.

3. Check the `getPlatform()` function in different source sets. Its expected declaration doesn't have a body,
   and actual implementations are provided in the platform code:

    ```kotlin
    // Platform.kt in commonMain module:
    expect fun getPlatform(): Platform
    ```
   
    ```kotlin
    // Platform.kt in androidMain module:
    actual fun getPlatform(): Platform = AndroidPlatform()
    ```
   
    ```kotlin
    // Platform.kt in iosMain module:
    actual fun getPlatform(): Platform = IOSPlatform()
    ```

Here, the common source set defines an expected `getPlatform()` function and has actual implementations,
`AndroidPlatform()` for the Android app and `IOSPlatform()` for the iOS app, in the platform source sets.

While generating the code for a specific platform, the Kotlin compiler merges expected and actual declarations
into a single `getPlatform()` function with its actual implementations.

That's why expected and actual declarations should be defined in the same package − they are merged into one declaration
in the resulting platform code. Any invocation of the expected `getPlatform()` function in the generated platform code
calls a correct actual implementation.

Now you can run the apps to ensure everything works.

#### Explore the expect/actual mechanism (optional) {initial-collapse-state="collapsed"}

The template project uses the expect/actual mechanism for functions but the same works for most Kotlin declarations,
such as properties and classes. Let's implement an expected property:

1. Open `Platform.kt` in the `commonMain` module and add the following at the end of the file:

    ```kotlin
    expect val num: Int
    ```

    The Kotlin compiler complains that this property has no corresponding actual declarations in the platform modules.

2. Try to provide the implementation right away with:

    ```kotlin
    expect val num: Int = 42
    ```
   
    You'll get an error saying that expected declarations must not have a body, in this case an initializer.
    The implementations must be provided in actual platform modules. Remove the initializer.
3. Select the `num` property. Press **Option + Enter** and choose "Create actual property for module
   ModuleName.shared.main (JVM)". IDE generates the actual property in `androidMain/Platform.kt`.
   You can then complete the implementation:

    ```kotlin
    actual val num: Int = 1
    ```

4. Now provide the implementation for the `iosMain` module. Add the following to `iosMain/Platform.kt`:

    ```kotlin
    actual val num: Int = 2
    ```

5. Add the `num` property to the `greet()` function to see the differences:

    ```kotlin
    fun greet(): String {
        val firstWord = if (Random.nextBoolean()) "Hi!" else "Hello!"
    
        return "$firstWord [$num]\nGuess what it is! > ${platform.name.reversed()}!"
    }
    ```

## Run your application

You can run your multiplatform application for both [Android](#run-your-application-on-android)
or [iOS](#run-your-application-on-ios) from Android Studio.

### Run your application on Android

1. Create an [Android virtual device](https://developer.android.com/studio/run/managing-avds#createavd).
2. In the list of run configurations, select **androidApp**.
3. Choose your Android virtual device and click **Run**.

   ![Run multiplatform app on Android](run-android.png){width=400}

   ![First mobile multiplatform app on Android](first-multiplatform-project-on-android-1.png){width=300}

#### Run on a different Android simulated device {initial-collapse-state="collapsed"}

Learn how
to [configure the Android Emulator and run your application on a different simulated device](https://developer.android.com/studio/run/emulator#runningapp).

#### Run on a real Android device {initial-collapse-state="collapsed"}

Learn how
to [configure and connect a hardware device and run your application on it](https://developer.android.com/studio/run/device).

### Run your application on iOS

1. Launch Xcode in a separate window. The first time you may also need to accept its license terms and allow it to
   perform
   some necessary initial tasks.
2. In Android Studio, select **iosApp** in the list of run configurations and click **Run**.

   If you don't have an available iOS configuration in the list, add
   a [new iOS simulated device](#run-on-a-new-ios-simulated-device).

   ![Run multiplatform app on iOS](run-ios.png){width=450}

   ![First mobile multiplatform app on iOS](first-multiplatform-project-on-ios-1.png){width=300}

#### Run on a new iOS simulated device {initial-collapse-state="collapsed"}

If you want to run your application on a simulated device, you can add a new run configuration.

1. In the list of run configurations, click **Edit Configurations**.

   ![Edit run configurations](ios-edit-configurations.png){width=450}

2. Click the **+** button above the list of configurations and select **iOS Application**.

   ![New run configuration for iOS application](ios-new-configuration.png)

3. Name your configuration.
4. Select the **Xcode project file**. For that, navigate to your project, for example **KotlinMultiplatformSandbox**,
   open the`iosApp` folder and select the `.xcodeproj` file.

5. In the **Execution target** list, select a simulated device and click **OK**.

   ![New run configuration with iOS simulator](ios-new-simulator.png)

6. Click **Run** to run your application on the new simulated device.

#### Run on a real iOS device {initial-collapse-state="collapsed"}

1. Connect a real iPhone device to Xcode.
2. Make sure to code sign your app. For more information, see the [official Apple documentation](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/).
3. [Create a run configuration](#run-on-a-new-ios-simulated-device) by selecting an iPhone in the **Execution target** list.
4. Click **Run** to run your application on the iPhone device.

> If your build fails, follow the workaround described in [this issue](https://youtrack.jetbrains.com/issue/KT-40907).
>
{type="note"}

## Next step

In the next part of the tutorial, you'll learn how to update the UI elements using platform-specific libaries.

**[Proceed to the next part](multiplatform-mobile-update-ui.md)**

### See also

* See how to [create and run multiplatform tests](multiplatform-run-tests.md) to check that the code works correctly.
* Learn more about the [project structure](multiplatform-mobile-understand-project-structure.md), the shared module's
  artifacts, and how the Android and iOS apps are produced.

## Get help

* **Kotlin Slack**. Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join
  the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel.
* **Kotlin issue tracker**. [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT).
