---
type: tutorial
layout: tutorial
title: "Getting started with Android and Kotlin"
description: "This tutorial walks us through creating a simple Kotlin application for Android using Android Studio."
authors: Philip Torchinsky, Svetlana Isakova
showAuthorInfo: true
date: 2015-07-25
related:
    - getting-started.md
---
### Creating a project
It’s extremely easy to start using Kotlin for Android development! In this tutorial we’ll follow the warming up process with Android Studio.
If using Intellij IDEA with Android, the process is almost the same.

First let's create a new project. We choose **Start a new Android Studio project** or **File | New project**.
The following dialogs walk us through the process of new project creation. 
We need to name the project and choose which Android SDK version we have installed. Most options can be left with their default values, so we can press 'Enter' several
times.

Name the project:
![Dialog 1]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-android/0-create-new-project.png)

Choose the Android version:

![Dialog 2]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-android/1-create-new-project.png)

Choose creating an activity that will be generated for you:

![Dialog 3]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-android/2-create-new-project.png)

Name the activity:

![Dialog 4]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-android/3-create-new-project.png)

We've created a new project with one Java activity that was generated for us.

But now we'd like to add some code in Kotlin. The easiest way to start using Kotlin is to convert automatically Java activity into Kotlin one.
Please note that anytime instead of looking through documentation for a new way to express an old pattern, 
you can write it in Java, then copy-paste Java code into Kotlin file, and Intellij (or Android Studio) will suggest to convert it. 


#### Converting Java code to Kotlin

Open MainActivity.java file. Then invoke action **Convert Java File to Kotlin File**. You can do it by several ways.
The easiest one is to invoke [Find Action](https://www.jetbrains.com/idea/help/navigating-to-action.html) and start typing an action name (like in a screencast below). 
Alternatively we can call this option via the _Code \| Convert Java File to Kotlin File_  menu entry or by using the corresponding shortcut (we can find it at the menu entry).
 
![Convert]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-android/convert-java-to-kotlin.png)

After the conversion we should have an activity written in Kotlin.

![Koltin-Activity]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-android/converted-code.png)

#### Configuring Kotlin in the project

When adding a new Kotlin file, IntelliJ IDEA (and Android Studio) automatically prompts us as to whether we'd like to configure the Kotlin runtime for the project. However, currently, converting existing Java
file does not prompt this action. Therefore we have to invoke it manually (via [Find Action](https://www.jetbrains.com/idea/help/navigating-to-action.html)):

![Config-Kotlin]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-android/configure-kotlin-in-project.png)

We are then prompted for the version of Kotlin. Choose the latest available from the list of installed versions.

![Config-Kotlin-Details]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-android/configure-kotlin-in-project-details.png)

After we configure Kotlin, build.gradle file for the application should be updated. 
Now we can see that _apply plugin: 'kotlin-android'_ and the dependencies were added. 

*(For more details how to set up gradle for your project, please check [Using Gradle](/docs/reference/using-gradle.html))*


The last thing to do is to sync the project. We can press 'Sync Now' in a prompt or invoke an action **Sync Project with Gradle Files**.
 
![Sync-Project-With-Gradle]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-android/sync-project-with-gradle.png)

### Making user interface changes

Now that the project has been set up, we can work with the layout using IntelliJ IDEA's visual designer.
There is nothing different in terms of layout when working with Kotlin, thus this is similar to regular Android Java development.
While using layout designer in IntelliJ IDEA, note there are two tabs in the designer: **Text** and **Design**. The latter shows how the layout looks, while the former allows fine tuning with XML editing.

![Layout Editor]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-android/layout-editor.png)

### Building and publishing the Kotlin application for Android

Kotlin has a rather small runtime file size: the library is approximately {{ site.data.releases.latest.runtime_size }} (as of {{ site.data.releases.latest.version }}). This means Kotlin adds just a little to .apk file size.

We are now ready to build the application in debug mode (**\<Shift+F9\>**), run it on an emulator or device (**\<Shift+F10\>**), or build signed release of the application to upload it to Google Play or another application store.

We can make a release of the application and sign it similarly to what we do for an Android application written in Java. 

Kotlin compiler produces byte-code, thus there really is no difference in terms of look and feel of Kotlin applications versus those written in Java.

### What's next?

Read about [Kotlin Android Extensions plugin](android-plugin.html). If you want to learn different Kotlin features, try [Kotlin Koans](koans.html).
