[//]: # (title: Create your first multiplatform application – tutorial)

Here you will learn how to create and run your first KMM application.

1. [Set up your environment for KMM development](kmm-setup.md) by installing the necessary tools on a suitable operating system.  

    >You will need a Mac with macOS to complete certain steps in this tutorial, which include writing iOS-specific code and running an iOS application.  
    >These steps cannot be performed on other operating systems, such as Microsoft Windows. This is due to an Apple requirement.
    >
    {type="note"}

You can also watch a video of this tutorial created by Ekaterina Petrova, Kotlin Developer Advocate.

<video href="GcqFhoUuNNI" title="Kotlin Multiplatform Multiverse, Episode 2: Your First Kotlin Multiplatform Mobile App Tutorial"/>

2. In Android Studio, select **File** | **New** | **New Project**.
3. Select **KMM Application** in the list of project templates, and click **Next**.  

    ![Mobile Multiplatform project template](kmm-project-wizard-1.png)
    
4. Specify a name for your first application, and click **Next**.  

    ![Mobile Multiplatform project - general settings](kmm-project-wizard-2.png)

5. In the window that opens, do the following:
   * Keep the default names for the application and shared folders.
   * Select the checkbox to generate sample tests for your project. 
   * Select **Xcode build phases (packForXcode task)** in the list of iOS framework distribution options. 
     
   Click **Finish** to create a new project.

    ![Mobile Multiplatform project - additional settings](kmm-project-wizard-3.png)  
    
Now wait while your project is set up. It may take some time to download and set up the required components when you 
do this for the first time.
    
To view the complete structure of your mobile multiplatform project, switch the view from **Android** to **Project**. 
You can [understand the KMM project structure](kmm-understand-project-structure.md) and how you can use this. 
    
![Select the Project view](select-project-view.png){width=200}  
    
## Run your application 

You can run your multiplatform application on [Android](#run-your-application-on-android) or [iOS](#run-your-application-on-ios).

### Run your application on Android

* In the list of run configurations, select **androidApp** and then click **Run**.  
    
    ![Run multiplatform app on Android](run-android.png){width=400}
    
    ![First mobile multiplatform app on Android](first-kmm-on-android-1.png){width=300}

#### Run on a different Android simulated device

Learn how to [configure the Android Emulator and run your application on a different simulated device](https://developer.android.com/studio/run/emulator#runningapp).
    
#### Run on a real Android device

Learn how to [configure and connect a hardware device and run your application on it](https://developer.android.com/studio/run/device).

### Run your application on iOS

* In the list of run configurations, select **iosApp** and then click **Run**.  
    
    ![Run multiplatform app on iOS](run-ios.png){width=450}
    
    ![First mobile multiplatform app on Android](first-kmm-on-ios-1.png){width=300}

#### Run on a different iPhone simulated device

If you want to run your application on another simulated device, you can add a new run configuration.

1. In the list of run configurations, click **Edit Configurations**.

    ![Edit run configurations](ios-edit-configurations.png){width=450}

2. Click the **+** button above the list of configurations and select **iOS Application**.

    ![New run configuration for iOS application](ios-new-configuration.png)

4. Name your configuration.

5. Select a simulated device in the **Execution target** list, and then click **OK**.

    ![New run configuration with iOS simulator](ios-new-simulator.png)
    
6. Click **Run** to run your application on the new simulated device.
    
#### Run on a real iPhone device

1. [Connect a real iPhone device to Xcode](https://developer.apple.com/documentation/xcode/running_your_app_in_the_simulator_or_on_a_device).
2. [Create a run configuration](#run-on-a-different-iphone-simulated-device) by selecting iPhone in the **Execution target** list.
3. Click **Run** to run your application on the iPhone device.

> If your build fails, follow the workaround described in [this issue](https://youtrack.jetbrains.com/issue/KT-40907).
>
{type="note"}

## Run tests

You can run tests to check that the shared code works correctly on both platforms. Of course, you can also write and run tests to check the 
platform-specific code.

### Run tests on iOS
    
1. Open the file `iosTest.kt` in `shared/src/iosTest/kotlin/com.example.kmmapplication.shared`.  
    Directories with `Test` in their name contain tests.  
    This file includes a sample test for iOS.  
    
    ![iOS test Kotlin file](ios-test-kt.png)
   
2. Click the **Run** icon in the gutter next to the test.  

Tests run on a simulator without UI. Congratulations! The test has passed – see test results in the console.

![iOS test result](ios-test-result.png){width=300}

### Run tests on Android

For Android, follow a procedure that is very similar to the one for running tests on iOS.

1. Open the file `androidTest.kt` in `shared/src/androidTest/kotlin/com.example.kmmapplication.shared`.

2. Click the **Run** gutter icon next to the test. 

## Update your application

1. Open the file `Greeting.kt` in `shared/src/commonMain/kotlin/com.example.kmmapplication.shared`.  
    This directory stores the shared code for both platforms – Android and iOS. If you make changes to the shared code, you will see
    changes in both applications.

    ![Common Kotlin file](common-kotlin-file.png)
    
2. Update the shared code – use the Kotlin standard library function that works on all platforms and reverts text: `reversed()`.

    ```kotlin
    class Greeting {
        fun greeting(): String {
            return "Guess what it is! > ${Platform().platform.reversed()}!"
        }
    }
    ```

3. Run the updated application on Android.

    ![Updated mobile multiplatform app on Android](first-kmm-on-android-2.png){width=300}
    
4. Run the updated application on iOS.  

    ![Updated mobile multiplatform app on iOS](first-kmm-on-ios-2.png){width=300}
    
5. Run tests on Android and iOS.  
    As you see, the tests fail. Update the tests to pass. You know how to do this, right? ;)
    
    ![iOS test failed](ios-test-failed.png)
    
## Next steps

Once you've played with your first KMM application, you can:

* [Understand the KMM project structure](kmm-understand-project-structure.md)
* [Complete a tutorial on making your Android application work on iOS](kmm-integrate-in-existing-app.md)
