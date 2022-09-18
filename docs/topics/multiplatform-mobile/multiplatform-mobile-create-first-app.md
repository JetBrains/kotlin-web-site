[//]: # (title: Create your first cross-platform app)

<microformat>
    <p>This is the second part of the <strong>Getting started with Kotlin Multiplatform Mobile</strong> tutorial. Before proceeding, make sure you've completed the previous step.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-mobile-setup.md">Set up an environment</a><br/><img src="icon-2.svg" width="20" alt="Second step"/> <strong>Create your first cross-platform app</strong><br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> Add dependencies<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Upgrade your app<br/><img src="icon-5-todo.svg" width="20" alt="Fifth step"/> Wrap up your project</p>
</microformat>

Here you will learn how to create and run your first Kotlin Multiplatform Mobile application using Android Studio.

## Create the project from a template

> You can also watch the [video version of this tutorial](https://www.youtube.com/watch?v=GcqFhoUuNNI) created by Ekaterina
> Petrova, Kotlin Product Marketing Manager.
>
{type="tip"}

1. In Android Studio, select **File | New | New Project**.
2. Select **Kotlin Multiplatform App** in the list of project templates, and click **Next**.  

    ![Mobile Multiplatform project template](multiplatform-mobile-project-wizard-1.png)
    
3. Specify a name for your first application, and click **Next**.  

    ![Mobile Multiplatform project - general settings](multiplatform-mobile-project-wizard-2.png)

4. In the **iOS framework distribution** list, select **Regular framework**.

   ![Mobile Multiplatform project - additional settings](multiplatform-mobile-project-wizard-3.png)

5. Keep the default names for the application and shared folders. Click **Finish**.

The project will be set up automatically. It may take some time to download and set up the required components when you
do this for the first time.

## Examine the project structure

To view the full structure of your mobile multiplatform project, switch the view from **Android** to **Project**.

![Select the Project view](select-project-view.png){width=200}  

Each Kotlin Multiplatform Mobile project includes three modules:

* _shared_ is a Kotlin module that contains the logic common for both Android and iOS applications – the code you share
  between platforms. It uses [Gradle](gradle.md) as the build system that helps you automate your build process. The _shared_
  module builds into an Android library and an iOS framework.
* _androidApp_ is a Kotlin module that builds into an Android application. It uses Gradle as the build system.
  The _androidApp_ module depends on and uses the shared module as a regular Android library.
* _iOSApp_ is an Xcode project that builds into an iOS application. It depends on and uses the shared module as an iOS
  framework. The shared module can be used as a regular framework or as a [CocoaPods dependency](native-cocoapods.md),
  based on what you've chosen in the previous step in **iOS framework distribution**. In this tutorial, it's a regular
  framework dependency.

![Basic Multiplatform Mobile project structure](basic-project-structure.png){width=500}

The shared module consists of three source sets: `androidMain`, `commonMain`, and `iosMain`. _Source set_ is a Gradle
concept for a number of files logically grouped together where each group has its own dependencies. In Kotlin Multiplatform,
different source sets in a shared module can target different platforms.

![Source sets and modules structure](basic-project-structure-2.png){width=200}

> This is an example structure of a Multiplatform Mobile project that you create with the project wizard in IntelliJ IDEA
> or Android Studio. Real-life projects can have more complex structures.
>
{type="note"}

## Run your application

You can run your multiplatform application on [Android](#run-your-application-on-android) or [iOS](#run-your-application-on-ios).

### Run your application on Android

1. Create an [Android virtual device](https://developer.android.com/studio/run/managing-avds#createavd).
2. In the list of run configurations, select **androidApp**.
3. Choose your Android virtual device and click **Run**.  
    
    ![Run multiplatform app on Android](run-android.png){width=400}
    
    ![First mobile multiplatform app on Android](first-multiplatform-project-on-android-1.png){width=300}

#### Run on a different Android simulated device {initial-collapse-state="collapsed"}

Learn how to [configure the Android Emulator and run your application on a different simulated device](https://developer.android.com/studio/run/emulator#runningapp).
    
#### Run on a real Android device {initial-collapse-state="collapsed"}

Learn how to [configure and connect a hardware device and run your application on it](https://developer.android.com/studio/run/device).

### Run your application on iOS

* In the list of run configurations, select **iosApp** and then click **Run**.  
    
    ![Run multiplatform app on iOS](run-ios.png){width=450}
    
    ![First mobile multiplatform app on Android](first-multiplatform-project-on-ios-1.png){width=300}

#### Run on a different iPhone simulated device {initial-collapse-state="collapsed"}

If you want to run your application on another simulated device, you can add a new run configuration.

1. In the list of run configurations, click **Edit Configurations**.

    ![Edit run configurations](ios-edit-configurations.png){width=450}

2. Click the **+** button above the list of configurations and select **iOS Application**.

    ![New run configuration for iOS application](ios-new-configuration.png)

3. Name your configuration.

4. Select a simulated device in the **Execution target** list, and then click **OK**.

    ![New run configuration with iOS simulator](ios-new-simulator.png)
    
5. Click **Run** to run your application on the new simulated device.
    
#### Run on a real iPhone device {initial-collapse-state="collapsed"}

1. [Connect a real iPhone device to Xcode](https://developer.apple.com/documentation/xcode/running_your_app_in_the_simulator_or_on_a_device).
2. [Create a run configuration](#run-on-a-different-iphone-simulated-device) by selecting iPhone in the **Execution target** list.
3. Click **Run** to run your application on the iPhone device.

> If your build fails, follow the workaround described in [this issue](https://youtrack.jetbrains.com/issue/KT-40907).
>
{type="note"}

## Update your application

1. Open the `Greeting.kt` file in `shared/src/commonMain/kotlin`. This directory stores the shared code for both Android
and iOS. If you make changes to the shared code, you will see them reflected in both applications.

   ![Common Kotlin file](common-kotlin-file.png)

2. Update the shared code by using `[reversed()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html)`,
the Kotlin standard library function for reversing text that works on all platforms:

    ```kotlin
    class Greeting {
        fun greeting(): String {
            return "Guess what it is! > ${Platform().platform.reversed()}!"
        }
    }
    ```

3. Run the updated application on Android.

    ![Updated mobile multiplatform app on Android](first-multiplatform-project-on-android-2.png){width=300}
    
4. Run the updated application on iOS.  

    ![Updated mobile multiplatform app on iOS](first-multiplatform-project-on-ios-2.png){width=300}

## Next step

[Learn about dependencies and add a third-party library to your project](multiplatform-mobile-dependencies.md)
to expand its functionality.

### See also

* See how to [create and run multiplatform tests](multiplatform-run-tests.md) to check that the code works correctly.
* Learn more about the [project structure](multiplatform-mobile-understand-project-structure.md), the shared module's
artifacts, and how the Android and iOS apps are produced.

## Get help

* **Kotlin Slack**. Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel.
* **Kotlin issue tracker**. [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT).
