---
type: tutorial
layout: tutorial
title: "Getting started with Android and Kotlin"
description: "This tutorial walks us through creating a simple Kotlin application for Android using Android Studio."
authors: 
showAuthorInfo: false
---

### Installing the Kotlin plugin

The Kotlin plugin is bundled with Android Studio starting from [version 3.0](https://developer.android.com/studio/preview/index.html). If you use an earlier version, you'll need to install the Kotlin plugin.
Go to _File \| Settings \| Plugins \| Install JetBrains plugin..._ and then search for and install *Kotlin*.
If you are looking at the "Welcome to Android Studio" screen, choose _Configure \| Plugins \| Install JetBrains plugin..._
You'll need to restart the IDE after this completes.

### Creating a project

It’s extremely easy to start using Kotlin for Android development. 
In this tutorial we’ll follow the warming up process with Android Studio.
If using Intellij IDEA with Android, the process is almost the same.

First let's create a new project. Choose **Start a new Android Studio project** or **File | New project**.
The following dialogs walk you through the process of new project creation. 
You need to name the project and choose which Android SDK version you have installed. Most options can be left with their default values, so you can press 'Enter' several times.

Name the project:
![Dialog 1]({{ url_for('tutorial_img', filename='kotlin-android/0-create-new-project.png') }})

Android Studio 3.0 offers an option to enable Kotlin support on this screen. You can check this option and skip the
"Configuring Kotlin in the project" step below.

Choose the Android version:

![Dialog 2]({{ url_for('tutorial_img', filename='kotlin-android/1-create-new-project.png') }})

Choose creating an activity that will be generated for you:

![Dialog 3]({{ url_for('tutorial_img', filename='kotlin-android/2-create-new-project.png') }})

Name the activity:

![Dialog 4]({{ url_for('tutorial_img', filename='kotlin-android/3-create-new-project.png') }})

In Android Studio 3.0, you can choose to create the activity in Kotlin right away, so you can skip the "Converting
Java code to Kotlin" step. Earlier versions will create an activity in Java, and you can use the automated converter tool
to convert it.

In general, the easiest way to start using Kotlin is to convert automatically Java activity into Kotlin one.
Please note that anytime instead of looking through documentation for a new way to express an old pattern, 
you can write it in Java, then copy-paste Java code into Kotlin file, and IntelliJ IDEA (or Android Studio) will suggest to convert it. 


#### Converting Java code to Kotlin

Open `MainActivity.java` file. Then invoke action **Convert Java File to Kotlin File**. You can do it by several ways.
The easiest one is to invoke [Find Action](https://www.jetbrains.com/idea/help/navigating-to-action.html) and start typing an action name (like in a screencast below). 
Alternatively you can call this option via the _Code \| Convert Java File to Kotlin File_  menu entry or by using the corresponding shortcut (you can find it at the menu entry).
 
![Convert]({{ url_for('tutorial_img', filename='kotlin-android/convert-java-to-kotlin.png') }})

After the conversion you should have an activity written in Kotlin.

![Koltin-Activity]({{ url_for('tutorial_img', filename='kotlin-android/converted-code.png') }})

#### Configuring Kotlin in the project

If you start editing this file, Android Studio shows you a prompt that Kotlin is not configured, so you can configure it.
Alternatively, you can invoke the configuration by selecting Tools | Kotlin | Configure Kotlin in Project from the main menu. 

![Config-Kotlin]({{ url_for('tutorial_img', filename='kotlin-android/kotlin-not-configured.png') }})

You are then prompted for the version of Kotlin. Choose the latest available from the list of installed versions.

![Config-Kotlin-Details]({{ url_for('tutorial_img', filename='kotlin-android/configure-kotlin-in-project-details.png') }})

After you configure Kotlin, build.gradle file for the application should be updated. 
Now you can see that _apply plugin: 'kotlin-android'_ and the `kotlin-stdlib` dependency were added.

*(For more details how to set up gradle for your project, please check [Using Gradle](/docs/reference/using-gradle.html#targeting-android))*
 
![Sync-Project-With-Gradle]({{ url_for('tutorial_img', filename='kotlin-android/sync-project-with-gradle.png') }})

The last thing to do is to sync the project. You can press 'Sync Now' in a prompt or invoke an action **Sync Project with Gradle Files**.

![Sync-Project-With-Gradle-2]({{ url_for('tutorial_img', filename='kotlin-android/sync-project-with-gradle-2.png') }})

### Building and publishing the Kotlin application for Android

You are now ready to build the application and run it on an emulator or device.
This works in exactly the same way as in Java.
You can make a release of the application and sign it similarly to what you do for an Android application written in Java. 

Kotlin has a rather small runtime file size: the library is approximately {{ site.data.releases.latest.runtime_size }} (as of {{ site.data.releases.latest.version }}). This means Kotlin adds just a little to .apk file size.

Kotlin compiler produces byte-code, thus there really is no difference in terms of look and feel of Kotlin applications versus those written in Java.

### What's next?

 * Read about [Kotlin Android Extensions plugin](android-plugin.html) and [Android Frameworks Using Annotation Processing](android-frameworks.html). 
 * If you want to learn different Kotlin features, try [Kotlin Koans](koans.html).
 * Check out Google's [sample projects written in Kotlin](https://developer.android.com/samples/index.html?language=kotlin)
