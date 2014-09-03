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

1. Create a simple application in Kotlin that displays Hello, World!. Using our favorite editor, we create a new file called *app.kt* with the following

   ``` kotlin
   fun main(args: Array<String>) {
      println("Hello, World!")
   }
   ```

2. Compile the application using the JVM compiler

   ``` sh
   kotlinc-jvm app.kt -jar app.jar
   ```

   The *-jar* option indicates what we want the output of the compiler to be called.
   If you want to see all available options run:

   ``` sh
   kotlinc-jvm -help
   ```

3. Run the application.

   ``` sh
   java -classpath app.jar:%path_to_runtime%/kotlin-runtime.jar _DefaultPackage
   ```

   The classpath should contain the output from step 2 as well as the path to the *kotlin_runtime.jar* file. The _DefaultPackage is the name of the main class that
   the Kotlin compiler generates by default.

   ![Command Line Output]({{ site.baseurl }}/{{ site.img_tutorial_root }}/command-line/output.png)


### Running the shell

We can run any of the compilers without parameters to have an interactive shell. We can type any valid Kotlin code and see the results

![Shell]({{ site.baseurl }}/{{ site.img_tutorial_root }}/command-line/kotlin_shell.png)

### Using the command line to run scripts

Kotlin can also be used as a scripting language. To run a script, we just pass the *-script* option to the compiler with the corresponding script file (.ktscript)

   ``` sh
   kotlinc-jvm -script list_folders.ktscript
   ```


