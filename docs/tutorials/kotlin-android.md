---
type: tutorial
layout: tutorial
title: "Getting started with Android and Kotlin"
description: "This tutorials walks us through creating a simple Kotlin application for Android using IntelliJ IDEA."
authors: Philip Torchinsky
showAuthorInfo: true
date: 2014-09-04
related:
    - getting-started.md
---
### Creating a project
This tutorials assumes we're already somewhat familiar with Android development in Java, and understand basic project structures, etc.
{{site.text_using_gradle}}

Let's start with **File \| New Project \| Android \| Gradle: Android Module** to create a new project.

![New Project]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/kotlin-android-new.png)

The following dialogs walk us through the process of creation of a new project. We need to name the project and choose which Android SDK version we have installed.
Most options can be left with their default values.

![Dialog 1]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/1.png)

Next dialog offers a selection of activity types (because we selected the "Create activity" checkbox in the previous step).

![Dialog 2]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/2.png)

After choosing the activity type, let's name the activity.

![Dialog 3]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/3.png)

We give a name to the project.

![Dialog 4]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/4.png)

IntelliJ IDEA initializes the new project, and we can see the Java project structure and the activity template.
Now it's time to start with Kotlin. Since the wizard created an activity for us, the easiest way is to have IntelliJ IDEA convert this code to
Kotlin automatically.

#### Converting Java code to Kotlin

We choose MainActivity.java file in the project tree and press **<Shift+Ctrl+Alt+J>**. This option can also be accessed via the _Code \| Convert Java File to Kotlin File_  menu entry.

( **\<⌥⇧⌘ J\>** on Mac OS). The Kotlin plugin offers to do an automatic conversion from Java to Kotlin (.java -> .kt).

![Convert]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/5.png)

#### Configuring Kotlin in the project

When adding a new Kotlin file, IntelliJ IDEA automatically prompts us as to whether we'd like to configure the Kotlin runtime for the project. However, currently, converting existing Java
files does not prompt this action. Therefore we have to invoke it manually:

Press **\<Shift\>** twice and _Search Everywhere_ helper appears. Enter "Configure Kotlin" and choose the option "Configure Kotlin in Project". It enables Kotlin support for the project, including proper _build.gradle_ changes and project structure inspections.

![Config-Kotlin]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/configure_kotlin.png)

We are then prompted for the version of Kotlin. Choose the latest available from the list of installed versions.

![Config-Kotlin-Details]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/kotlin-config-details.png)

#### Placing Kotlin files under _/src/main/kotlin_

For Gradle projects, Kotlin files should be located under the _src/main/kotlin folder_ structure. We need to make sure that this folder structure is created:

![AddDir]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/addkotlindir.png)

Upon switching to MainActivity.kt file, IntelliJ IDEA will prompt a reminder that the files need to be placed under this folder and offers the option
to move the file.

![MoveFile]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/move-file.png)

#### Correcting code conversion if needed
Automatic conversion is not 100% full-proof, and some things often need manual tweaking.

![MoveFile]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/override.png)

In the example above the _onCreateOptionsMenu_ method signature does not reflect actual expectations, because all variables in Kotlin are non-nullable by default, and the method can be called with null argument.
We therefore need to make the appropriate changes manually, as shown in the screenshot below (question mark in Kotlin after a type or an object means the instance is nullable).

![Question Marks]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/question-marks.png)

Now we have the code ready to build and run, which can be done pressing **\<Shift-F10\>**.

### Making user interface changes
Now that the project has been set up, we can work with the layout using IntelliJ IDEA's visual designer.
There is nothing different in terms of layout when working with Kotlin, thus this is similar to regular Android Java development.
While using layout designer in IntelliJ IDEA, note there are two tabs in the designer: **Text** and **Design**. The latter shows how the layout looks, while the former allows fine tuning with XML editing.

![Layout Editor]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/layout-editor.png)

#### Java libraries in Kotlin projects

Kotlin is 100% compatible with Java, thus we can use Java and Kotlin code in the same project together, as well as having Kotlin call Java libraries and vice versa.

For example, imagine an application needing to save some data in SQLite database. This data may have special characters and non-Latin letters.
It's safe to convert them to uniformed Unicode with _StringEscapeUtils.escapeJava_ and _StringEscapeUtils.unescapeJava_ functions from StringEscapeUtils library, which is written in Java.

Libraries need to be imported via import statement and we need to ensure the library is listed in the project dependencies (**\<Alt+Ctrl+Shift+S\>** in IntelliJ IDEA):

```
import org.apache.commons.lang3.StringEscapeUtils
```

![Library]({{ site.baseurl }}/{{ site.img_tutorial_root }}//kotlin-android/javalang.png)

#### Mixed projects: Kotlin and Java

When we need to combine Java and Kotlin sources, _src/main/java_ remains in the project tree, along with _src/main/kotlin_ directory. Kotlin sources will reside in _kotlin_ directory, and Java sources - in _java_ directory. It's necessary to make sure _kotlin_ directory is **marked as sources**. We should mark it manually, if it is not. 

### Building and publishing the Kotlin application for Android
Kotlin has a small runtime file size: the library has approximately {{ site.data.releases.latest.runtime_size }} (as of {{ site.data.releases.latest.version }}). It means Kotlin adds just a little to .apk file size.

We are now ready to build the application in debug mode (**\<Shift+F9\>**), run it on an emulator or device (**\<Shift+F10\>**), or build signed release of the application to upload it to Google Play or another application store.

We can make a release of the application and sign it similarly to what we do for an Android application written in Java. 

Kotlin compiler produces byte-code, thus there really is no difference in terms of look and feel of Kotlin applications versus those written in Java.