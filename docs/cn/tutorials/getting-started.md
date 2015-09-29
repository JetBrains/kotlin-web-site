---
type: tutorial
layout: tutorial
title:  "Getting Started with IntelliJ IDEA"
description: "This tutorials walks us through creating a simple Hello World application using IntelliJ IDEA."
authors: Hadi Hariri
date: 2015-01-28
showAuthorInfo: true
---
### Setting up the environment
In this tutorial we're going to use IntelliJ IDEA. You can download the free [Open Source Community Edition][intellijdownload] from [JetBrains][jetbrains].
For instructions on how to compile and execute Kotlin applications using the command line compiler, see [Working with the Command Line Compiler][getting_started_command_line].

If you are new to the JVM and Java, check out the [JVM Minimal Survival Guide](http://hadihariri.com/2013/12/29/jvm-minimal-survival-guide-for-the-dotnet-developer/). If you are new to IntelliJ IDEA, check out the [The IntelliJ IDEA Minimal Surivial Guide](http://hadihariri.com/2014/01/06/intellij-idea-minimal-survival-guide/).

1. [Download IntelliJ IDEA][intellijdownload] 14.1 (Android Studio 1.2 also works) as well as JDK 1.6+, and install the latest Kotlin Plugin

   Under Preferences (OSX) or Settings (Windows/Linux), type Plugins to get the list of currently installed Plugins.

   ![Kotlin Plugin]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started/install_kotlin_plugin.png)

   Follow the instructions to restart the IDE.

   If you're using an EAP for which a compatible plugin is not released yet on the JetBrains Repository, please add the nightly builds as a new repository and download from there. For IntelliJ 15 nightly builds, the link is:
   
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
[getting_started_command_line]: command-line.html
