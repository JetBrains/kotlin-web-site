---
type: tutorial
layout: tutorial
title: "Getting started with Android and Kotlin"
description: "This tutorial walks us through creating a simple Kotlin application for Android."
authors: 
showAuthorInfo: false
---

It’s extremely easy to start using Kotlin for Android development.
In this tutorial we’ll follow the warming up process with Android Studio. If you're using Intellij IDEA with Android, the process is almost the same.

### Creating a project

First, create a new Kotlin Android Project for your application:

1. Open Android Studio and click **Start a new Android Studio project** on the welcome screen or **File \| New \| New project**.

2. Select an [activity](https://developer.android.com/guide/components/activities/intro-activities) that defines the behavior of your application. For your first "Hello world" application, select __Empty Activity__ that just shows a screen, and click __Next__.

   ![Choosing empty activity]({{ url_for('tutorial_img', filename='kotlin-android/0-create-new-project.png') }}) 

3. In the next dialog, provide the project details:
   * name and package
   * location
   * language: select __Kotlin__

   Leave other options with their default values and click __Finish__.

   ![Project configuration]({{ url_for('tutorial_img', filename='kotlin-android/1-create-new-project.png') }})

Once you complete the steps, Android Studio creates a project. The project already contains all the code and resources for building an application that can run on your Android device or an emulator.

### Building and running the application

The process of building and running the Kotlin application in Android Studio is exactly the same as with Java.

To build and run your application on an emulator:
1. Run the predefined __app__ configuration by clicking __Run__ on the toolbar or __Run \| Run 'app'__.
2. Select __Create New Virtual Device__.

   ![Select target]({{ url_for('tutorial_img', filename='kotlin-android/select-target.png') }})

3. Select a device you like and click __Next__.

   ![Select device]({{ url_for('tutorial_img', filename='kotlin-android/select-device.png') }})

4. Select a system version and download its image.

   ![System image]({{ url_for('tutorial_img', filename='kotlin-android/system-image.png') }})

5. Verify the emulator configuration and click __Finish__.

6. Click __OK__ and here it is - your first Kotlin application for Android!


<div style="display: flex; align-items: center; margin-bottom: 10px;">
    <img
    src="{{ url_for('asset', path='images/tutorials/kotlin-android/hello-app.png') }}"
    data-gif-src="{{ url_for('asset', path='images/tutorials/kotlin-android/hello-app.gif') }}"
    class="gif-image">
</div>

Kotlin has a rather small runtime file size: the library is approximately {{ site.data.releases.latest.runtime_size }} (as of {{ site.data.releases.latest.version }}). This means Kotlin adds just a little to .apk file size.

Kotlin compiler produces byte-code, thus there really is no difference in terms of look and feel of Kotlin applications versus those written in Java.

If you want to customize your builds or run configuration, refer to the Android Studio [documentation](https://developer.android.com/studio/run).

### What's next?

* Read about [Kotlin Android Extensions plugin](android-plugin.html) and [Android Frameworks Using Annotation Processing](android-frameworks.html).
* If you want to learn different Kotlin features, try [Kotlin Koans](koans.html).
* Check out Google's [sample projects written in Kotlin](https://developer.android.com/samples/index.html?language=kotlin)
