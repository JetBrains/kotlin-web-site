---
type: tutorial
layout: tutorial
title:  "Getting Started"
description: "This tutorials walks you through creating a simple Hello World application using IntelliJ IDEA"
---

# Getting Started

## Setting up the environment

In this tutorial we're going to use IntelliJ IDEA. You can download the free [Open Source Community Edition][intellijdownload] from [JetBrains][jetbrains].
For instructions on how to compile and execute Kotlin applications using the command line compiler, see [Working with the Command Line Compiler][command_line]

1. [Download IntelliJ IDEA][intellijdownload] 13 or 14 EAP and install the latest Kotlin Plugin
   1. Under Preferences (OSX) or Settings (Windows/Linux), type Plugins to get the list of currently installed Plugins.

   ![Kotlin Plugin]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started/install_kotlin_plugin.png)

   Follow the instructions to restart the IDE.

   If you're using an EAP for which a compatible plugin is not released yet on the JetBrains Repository, please add the nightly builds as a new repository and download from there. For IntelliJ 14 EAP, the link is:
   
   [http://teamcity.jetbrains.com/guestAuth/repository/download/bt345/.lastSuccessful/updatePlugins.xml](http://teamcity.jetbrains.com/guestAuth/repository/download/bt345/.lastSuccessful/updatePlugins.xml)
   
2. Once Kotlin is correctly installed, we can create a New Project. We select Java Module, give it a name and select the SDK. Kotlin works with JDK 1.6+

   ![Kotlin New Project]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started/new_project_step1.png)

3. Since we are going to target the JVM in the Next step of the Wizard we select Kotlin (Java)

   ![Kotlin Select Technologies]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started/kotlin_java.png)

   We click the *Create* button to specify the Kotlin runtime. We can either Copy it to our project folder or use the bundle from the plugin. It is recommended to copy
   to project folder.

4. We should now have the new project created and the following folder structure

   ![Kotlin Folder Structure]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started/folders.png)

5. Let's create a new Kotlin file under the source folder. It can be named anything. In our case we will call it *app*

6. Once we have the file created, we need to type the main routine, which is the entry point to a Kotlin application. IntelliJ IDEA offers us a template to do this quickly. Just type *main* and hit tab.

   ![Kotlin Folder Structure]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started/main.png)

7. Let's now add the line of code to print out 'Hello, World!'

   ![Kotlin Folder Structure]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started/hello_world.png)

8. Now we can run the application. Easiest way is to right-click and select *Run _DefaultPackage*

   ![Kotlin Folder Structure]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started/run_default.png)

9. If everything went well, we should now see the result in the Run window

   ![Kotlin Folder Structure]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started/run_window.png)

Congratulations. We now have our first application running.

[intellijdownload]: http://www.jetbrains.com/idea/download/index.html
[jetbrains]: http://www.jetbrains.com
[webdemo]: http://kotlin-demo.jetbrains.com
[getting_started_command_line]: getting_started_command_line.html
