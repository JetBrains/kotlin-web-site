---
type: tutorial
layout: tutorial
title:  "Getting Started with Eclipse Luna"
description: "This tutorial guides through installing Kotlin plugin for Eclipse and creating Hello World application."
authors: Nikolay Krasko
date: 2015-03-28
showAuthorInfo: true
---
### Setting up the environment
We will show how to install Kotlin plugin in Eclipse Luna SR2 (4.4.2) and create a simple Hello World application.

1. Start from getting and installing [Eclipse Luna](https://www.eclipse.org/downloads/). "Eclipse IDE for Java Developers" 
   bundle is recommended.

2. Kotlin plugin can be installed using update site. You will need to open ``Help -> Install New Software...`` in
   main menu. Enter the following URL in *"Work with:"* field:
   ```https://teamcity.jetbrains.com/guestAuth/repository/download/Kotlin_EclipsePlugin/release.tcbuildtag/```
   
    ![Plugin Installation]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started-eclipse/install-kotlin-update-site.png)
    
   Proceed clicking Next in the wizard until Eclipse will suggest you to restart.
   
3. After Eclipse has been restarted you can check that Kotlin plugin was correctly installed by opening Kotlin perspective
    in main menu ``Window -> Open Perspective -> Other...``
    
   ![Kotlin Perspective]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started-eclipse/open-perspective.png)

4. Now you are ready to create a new Kotlin project. Select ``File -> New -> Kotlin Project`` to proceed.

   ![New Kotlin Project]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started-eclipse/new-project.png)

   An empty project will be created which is ready for writing Kotlin programs for JVM target (JavaScript is not supported yet). 
   In fact from the Eclipse point of view, created project is also a Java project but with configured Kotlin nature, Kotlin
   Builder and reference to Kotlin Runtime Library. Great thing about this solution is that you can continue adding Java 
   classes to this project freely.
   
5. A fresh Kotlin project should look something similar in Package Explorer: 

   ![Empty Kotlin Project]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started-eclipse/empty-project.png)

6. Let's create a new Kotlin file under the source folder.

   ![New File From Context Menu]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started-eclipse/eclipse-new-file-menu.png)
   
   You can omit the *".kt"* extension in file name, Eclipse will add it automatically
   
   ![New Kotlin File Wizard]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started-eclipse/eclipse-new-file-wizard.png)

7. Once we have the file created, we need to type the main routine, which is the entry point to a Kotlin application. 
   Just type *main*, invoke completion and hit 'Enter'

   ![Main Template]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started-eclipse/main.png)

8. Let's now add the line of code to print out 'Hello, World!'

   ![Hello World Example]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started-eclipse/hello-world.png)

9. The easiest way to run the program is to do a right-click somewhere in file and select ``Run As -> Kotlin Application``

   ![Run Kotlin Application]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started-eclipse/run-as.png)
   
10. If everything went well, console window with output should be automatically opened

   ![Program Output View]({{ site.baseurl }}/{{ site.img_tutorial_root }}//getting-started-eclipse/output.png)

Congratulations. We now have our first Kotlin application running in Eclipse.

[jetbrains]: http://www.jetbrains.com
[webdemo]: http://kotlin-demo.jetbrains.com
[getting_started_command_line]: getting_started_command_line.html
