---
type: tutorial
layout: tutorial
title:  "Getting Started with IntelliJ IDEA"
description: "This tutorial walks you through creating a simple Hello World application using IntelliJ IDEA."
authors: Hadi Hariri, Roman Belov
date: 2015-11-02
showAuthorInfo: false
---
### Setting up the environment
In this tutorial we're going to use IntelliJ IDEA. You can download the free [Open Source Community Edition][intellijdownload] from [JetBrains][jetbrains].
For instructions on how to compile and execute Kotlin applications using the command line compiler, see [Working with the Command Line Compiler][getting_started_command_line].

If you are new to the JVM and Java, check out the [JVM Minimal Survival Guide](http://hadihariri.com/2013/12/29/jvm-minimal-survival-guide-for-the-dotnet-developer/). If you are new to IntelliJ IDEA, check out the [The IntelliJ IDEA Minimal Surivial Guide](http://hadihariri.com/2014/01/06/intellij-idea-minimal-survival-guide/).

1. **Kotlin is shipped with IntelliJ IDEA 15** ([download][intellijdownload]).

   To use Kotlin with the [previous versions][oldintellijdownload] or Android Studio, we need to manually install the latest Kotlin Plugin.
   Under **Preferences (OSX) or Settings (Windows/Linux) > Plugins > Browse Repositories** type **Kotlin** to find the Kotlin plugin. Click **Install** and follow the instructions.

   ![Kotlin Plugin]({{ site.baseurl }}/{{ site.img_tutorial_root }}/getting-started/install_kotlin_plugin.png)



2. Create a New Project. We select Java Module and select the SDK. Kotlin works with JDK 1.6+. Also, select the *Kotlin (Java)* checkbox.

   ![Kotlin New Project]({{ site.baseurl }}/{{ site.img_tutorial_root }}/getting-started/new_project_step1.png)

3. Then we click the *Create* button to specify the Kotlin runtime. We can either copy it to our project folder or use the bundle from the plugin.

   ![Kotlin Select Technologies]({{ site.baseurl }}/{{ site.img_tutorial_root }}/getting-started/kotlin_java.png)

4. Give our project a name on the next step.

   ![Kotlin Project Name]({{ site.baseurl }}/{{ site.img_tutorial_root }}/getting-started/project_name.png)

4. We should now have the new project created with the following folder structure:

   ![Kotlin Folder Structure]({{ site.baseurl }}/{{ site.img_tutorial_root }}/getting-started/folders.png)

5. Let's create a new Kotlin file under the source folder. It can be named anything. In our case, we will call it *app*.

   ![Kotlin New File]({{ site.baseurl }}/{{ site.img_tutorial_root }}/getting-started/new_file.png)

6. Once we have the file created, we need to type the main routine, which is the entry point to a Kotlin application. IntelliJ IDEA offers us a template to do this quickly. Just type *main* and press tab.

   ![Kotlin Main Fun]({{ site.baseurl }}/{{ site.img_tutorial_root }}/getting-started/main.png)

7. Let's now add a line of code to print out 'Hello, World!'.

   ![Kotlin New File]({{ site.baseurl }}/{{ site.img_tutorial_root }}/getting-started/hello_world.png)

8. Now we can run the application. The easiest way is to click on the Kotlin icon in the gutter and select *Run 'AppKt'*.

   ![Kotlin Folder Structure]({{ site.baseurl }}/{{ site.img_tutorial_root }}/getting-started/run_default.png)

9. If everything went well, we should now see the result in the **Run** tool window.

   ![Kotlin Folder Structure]({{ site.baseurl }}/{{ site.img_tutorial_root }}/getting-started/run_window.png)

Congratulations! We now have our first application running.

[intellijdownload]: http://www.jetbrains.com/idea/download/index.html
[oldintellijdownload]: https://confluence.jetbrains.com/display/IntelliJIDEA/Previous+IntelliJ+IDEA+Releases
[jetbrains]: http://www.jetbrains.com
[getting_started_command_line]: command-line.html
