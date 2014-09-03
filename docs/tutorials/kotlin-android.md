---
type: tutorial
layout: tutorial
title: "Getting started with Android and Kotlin"
description: "This tutorials walks us through creating a simple Kotlin application for Android using IntelliJ IDEA."
authors: Philip Torchinsky
showAuthorInfo: false
related:
    - getting-started.md
---
### Creating a project
We are already familiar with Android development using Java, thus we know what the project structure looks like, and how to build an Android application in general. 

Let's start with **File | New Project | Android | Gradle: Android Module** to create a new project.

![New Project]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/kotlin-android-new.png)

The following dialogs walk us through the process of creation of a new project, and our task will be mostly to approve suggested parameters. We need to name the project and choose which Android SDK version we have installed. Most parameters have default values.

![Dialog 1]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/1.png)

Next dialog offers a selection of activity types (because we have enabled "Create activity" checkbox at the previous stage).

![Dialog 2]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/2.png)

After choosing the activity type, let's name the activity.

![Dialog 3]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/3.png)

Then we give a name to the project.

![Dialog 4]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/4.png)

IntelliJ IDEA initializes the new project, and we see Java project structure and the activity template. Now it's time to start with Kotlin. Easiest way is to convert Activity written in Java to Kotlin.

### Setting up the project

#### Converting Java code of the Activity to Kotlin

We choose MainActivity.java file in the project tree and press **<Shift+Ctrl+Alt+J>** 
( **\<⌥⇧⌘ J\>** on Mac OS). Kotlin plugin offers an automatic conversion from Java to Kotlin (.java -> .kt). We accept the offer with no backup (we don't need it indeed because the default activity was just generated for us).

![Convert]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/5.png)

#### Configuring Kotlin in the project

Press **\<Shift\>** twice and _Search Everywhere_ helper appears. Enter "Configure Kotlin" and choose an option "Configure Kotlin in Project". It enables Kotlin support for the project, including proper _build.gradle_ changes and project structure inspections.

![Config-Kotlin]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/configure_kotlin.png)

After we choose Configure Kotlin in Project we are offered a choice of Kotlin plugins installed (you may have many of them, we use the most recent among installed here).

![Config-Kotlin-Details]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/kotlin-config-details.png)

#### Placing Kotlin file under /src/main/kotlin

After configuration, we saw a warning about project sync from Gradle plugin. Click Sync now, if it is the case.

![GradleSync]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/gradlesync.png)

Kotlin classes are to be kept under */src/main/kotlin directory*, thus we create it. Navigate to */src/main/* in the project structure, press **<Alt+Insert>**, and choose Directory, then name new directory *kotlin*:

![AddDir]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/addkotlindir.png)

Upon switch to MainActivity.kt file we see a reminder from the IDE, saying that Kotlin file has to be under /src/main/kotlin directory, thus we agree to move it to there automatically (pressing Move file on the right).

![AddDir]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/move-file.png)

Kotlin plugin marks kotlin directory as sources automatically at the time of configuring the plugin in the project or later, as soon as the directory is created.
