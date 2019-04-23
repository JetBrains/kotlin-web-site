---
type: tutorial
layout: tutorial
title:  "Getting Started with IntelliJ IDEA"
description: "This tutorial walks you through creating a simple Hello World application using IntelliJ IDEA."
authors: Hadi Hariri, Roman Belov
date: 2019-04-23
showAuthorInfo: false
---
### Setting up the environment
In this tutorial we're going to use IntelliJ IDEA.
For instructions on how to compile and execute Kotlin applications using the command line compiler, see [Working with the Command Line Compiler][getting_started_command_line].

If you are new to the JVM and Java, check out the [JVM Minimal Survival Guide](http://hadihariri.com/2013/12/29/jvm-minimal-survival-guide-for-the-dotnet-developer/). If you are new to IntelliJ IDEA, check out the [The IntelliJ IDEA Minimal Survival Guide](http://hadihariri.com/2014/01/06/intellij-idea-minimal-survival-guide/).

1. Install a recent version of IntelliJ IDEA. Kotlin is bundled with IntelliJ IDEA
   starting from version 15. You can download the free [Community Edition][intellijdownload] from [JetBrains][jetbrains].

2. Create a new __Project__ from __File \| New__. Select the __Kotlin \| JVM \| IDEA__ project type.

   ![Kotlin New Project]({{ url_for('tutorial_img', filename='getting-started/new_project_step1.png') }})

3. Give your project a name and select an SDK version for it.

   ![Kotlin Project Name]({{ url_for('tutorial_img', filename='getting-started/project_name.png') }})

4. Now you have the new project created with the following folder structure:

   ![Kotlin Folder Structure]({{ url_for('tutorial_img', filename='getting-started/folders.png') }})

5. Create a new Kotlin file under the source folder. It can be named anything. Let's call it *app*.

   ![Kotlin New File]({{ url_for('tutorial_img', filename='getting-started/new_file.png') }})

6. Once the file is created, add the `main` function which is the entry point to a Kotlin application. IntelliJ IDEA offers a template to do this quickly. Just type *main* and press tab.

   ![Kotlin Main Fun]({{ url_for('tutorial_img', filename='getting-started/main.png') }})

7. Now add a line of code to print out 'Hello, World!'.

   ![Kotlin Hello World]({{ url_for('tutorial_img', filename='getting-started/hello_world.png') }})

8. Now the application is ready to run. The easiest way is to click on the Kotlin icon in the gutter and select __Run 'AppKt'__.

   ![Kotlin Run App]({{ url_for('tutorial_img', filename='getting-started/run_default.png') }})

9. If everything went well, we should now see the result in the **Run** tool window.

   ![Kotlin Run Output]({{ url_for('tutorial_img', filename='getting-started/run_window.png') }})

Congratulations! You now have your first Kotlin application running.

[intellijdownload]: http://www.jetbrains.com/idea/download/index.html
[jetbrains]: http://www.jetbrains.com
[getting_started_command_line]: command-line.html
