---
type: tutorial
layout: tutorial
title:  "Getting Started with Eclipse IDE"
description: "This tutorials walks us through creating a simple Hello World application using Eclipse IDE"
authors: Nikolay Krasko
date: 2019-04-24
showAuthorInfo: false
---

## Setting up the environment
First of all, you need the Eclipse IDE installed on your system.
You can download its latest version from [download page](https://www.eclipse.org/downloads/). The "Eclipse IDE for Java Developers" bundle is recommended.

To add the Kotlin support to your Eclipse IDE, install the _Kotlin Plugin for Eclipse_.
We recommend installing the Kotlin plugin from [Eclipse Marketplace](http://marketplace.eclipse.org/content/kotlin-plugin-eclipse). 
One option is to drag this button into a running Eclipse window:

<a href="http://marketplace.eclipse.org/marketplace-client-intro?mpc_install=2257536" class="drag" title="Drag to your running Eclipse workspace."><img class="img-responsive" src="http://marketplace.eclipse.org/sites/all/themes/solstice/public/images/marketplace/btn-install.png" alt="Drag to your running Eclipse workspace." /></a>

Alternatively, open the __Help \| Eclipse Marketplace...__ menu and search for __Kotlin Plugin for Eclipse__: 

   ![Eclipse Marketplace]({{ url_for('tutorial_img', filename='getting-started-eclipse/marketplace.png') }})

A more old-fashioned way is using an *update site* directly:

```
https://dl.bintray.com/jetbrains/kotlin/eclipse-plugin/last/
```

Once the plugin is installed and Eclipse is restarted, make sure the plugin is installed correctly: open the __Kotlin perspective__
in the menu __Window \| Open Perspective \| Other...__
    
   ![Kotlin Perspective]({{ url_for('tutorial_img', filename='getting-started-eclipse/open-perspective.png') }})

## Creating a new project
Now you are ready to create a new Kotlin project.

1. Select __File \| New \| Kotlin Project__.

   ![New Kotlin Project]({{ url_for('tutorial_img', filename='getting-started-eclipse/project-name.png') }})

   An empty Kotlin/JVM project will be created.
   For Eclipse IDE, the project is also a Java project but configured with Kotlin nature, meaning it has the Kotlin
Builder and reference to the Kotlin Runtime Library. Great thing about this solution is that you can add both Kotlin and Java
code to the same project.
   
   The project structure looks like this:

   ![Empty Kotlin Project]({{ url_for('tutorial_img', filename='getting-started-eclipse/empty-project.png') }})

2. Create a new Kotlin file in the the source directory.

   ![New File From Context Menu]({{ url_for('tutorial_img', filename='getting-started-eclipse/new-file.png') }})
   
   You can enter the name without the __.kt__ extension. Eclipse will add it automatically.
   
   ![New Kotlin File Wizard]({{ url_for('tutorial_img', filename='getting-started-eclipse/file-name.png') }})

3. Once you have a source file, add the `main` function - the entry point to a Kotlin application. You
can simply type `main` and invoke code completion by hitting `Ctrl + Space`.

   ![Main Template]({{ url_for('tutorial_img', filename='getting-started-eclipse/main.png') }})

4. Add a simple line of Kotlin code to print a message:

   ![Hello World Example]({{ url_for('tutorial_img', filename='getting-started-eclipse/hello-world.png') }})

## Running the application
To run the application, right-click somewhere in the main file and select __Run As \| Kotlin Application__.

   ![Run Kotlin Application]({{ url_for('tutorial_img', filename='getting-started-eclipse/run-as.png') }})
   
If everything went well, you'll see the result in the **Console** window.

   ![Program Output View]({{ url_for('tutorial_img', filename='getting-started-eclipse/output.png') }})

Congratulations! You now have your Kotlin application running in Eclipse IDE.

