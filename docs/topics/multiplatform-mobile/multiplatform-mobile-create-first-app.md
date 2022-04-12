[//]: # (title: Create your first cross-platform app)

<microformat>
    <p>This is a part of the <strong>Getting started with Kotlin Multiplatform Mobile</strong> tutorial. Before proceeding, make sure you've completed the previous step:</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-mobile-setup.md">Set up environment</a><br/><img src="icon-2.svg" width="20" alt="Second step"/> <strong>Create your first cross-platform app</strong><br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> Add dependencies<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Update your app<br/><img src="icon-5-todo.svg" width="20" alt="Fifth step"/> Wrap up your project</p>
    
    
</microformat>

Here you will learn how to create and run your first Kotlin Multiplatform Mobile application using Android Studio.

## Create the project from template

> You can also watch a [video of this tutorial](https://www.youtube.com/watch?v=GcqFhoUuNNI) created by Ekaterina Petrova, Kotlin Product Marketing Manager.
>
{type="tip"}

1. In Android Studio, select **File** | **New** | **New Project**.
2. Select **Kotlin Multiplatform App** in the list of project templates, and click **Next**.  

    ![Mobile Multiplatform project template](multiplatform-mobile-project-wizard-1.png)
    
3. Specify a name for your first application, and click **Next**.  

    ![Mobile Multiplatform project - general settings](multiplatform-mobile-project-wizard-2.png)

4. In the list of iOS framework distribution options, select **Regular framework**.
5. Keep the default names for the application and shared folders. Click **Finish**.

    ![Mobile Multiplatform project - additional settings](multiplatform-mobile-project-wizard-3.png)
    
Wait for the project to set up. It may take some time to download and set up the required components when you 
do this for the first time.

## Check the project structure

To view the complete structure of your mobile multiplatform project, switch the view from **Android** to **Project**.

![Select the Project view](select-project-view.png){width=200}  

Your Kotlin Mobile Multiplatform project consists of three components:

* _Shared module_ – a Kotlin module that contains common logic for both Android and iOS applications.
  Builds into an Android library and an iOS framework. Uses Gradle as a build system.
* _Android application_ – a Kotlin module that builds into the Android application. Uses Gradle as a build system.
* _iOS application_ – an Xcode project that builds into the iOS application.

![Basic Multiplatform Mobile project structure](basic-project-structure.png){width=500}

This is the structure of a Multiplatform Mobile project that you create with a Project Wizard in IntelliJ IDEA or Android Studio.
Real-life projects can have more complex structure.
    
## Run your application 

You can run your multiplatform application on [Android](#run-your-application-on-android) or [iOS](#run-your-application-on-ios).

### Run your application on Android

1. Create an [Android virtual device](https://developer.android.com/studio/run/managing-avds#createavd).
2. In the list of run configurations, select **androidApp**.
3. Choose your Android virtual device and click **Run**.  
    
    ![Run multiplatform app on Android](run-android.png){width=400}
    
    ![First mobile multiplatform app on Android](first-multiplatform-project-on-android-1.png){width=300}

#### Run on a different Android simulated device  {initial-collapse-state="collapsed"}

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

4. Name your configuration.

5. Select a simulated device in the **Execution target** list, and then click **OK**.

    ![New run configuration with iOS simulator](ios-new-simulator.png)
    
6. Click **Run** to run your application on the new simulated device.
    
#### Run on a real iPhone device {initial-collapse-state="collapsed"}

1. [Connect a real iPhone device to Xcode](https://developer.apple.com/documentation/xcode/running_your_app_in_the_simulator_or_on_a_device).
2. [Create a run configuration](#run-on-a-different-iphone-simulated-device) by selecting iPhone in the **Execution target** list.
3. Click **Run** to run your application on the iPhone device.

> If your build fails, follow the workaround described in [this issue](https://youtrack.jetbrains.com/issue/KT-40907).
>
{type="note"}

## Update your application

1. Open the file `Greeting.kt` in `shared/src/commonMain/kotlin/com.example.kmmapplication.shared`.  
    This directory stores the shared code for both platforms – Android and iOS. If you make changes to the shared code, you will see
    changes in both applications.

    ![Common Kotlin file](common-kotlin-file.png)
    
2. Update the shared code – use the Kotlin standard library function that works on all platforms and reverts text: `[reversed()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html)`.

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

Go on and [add dependencies to your project](multiplatform-mobile-setup.md).

### Advanced steps

* See how to [create and run multiplatform tests](multiplatform-run-tests.md) to check that the code works correctly.
* Learn more about the [project structure](multiplatform-mobile-understand-project-structure.md), the shared module's
artifacts and how the Android and iOS apps are produced.