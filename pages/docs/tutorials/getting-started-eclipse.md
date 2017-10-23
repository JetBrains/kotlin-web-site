---
type: tutorial
layout: tutorial
title:  "Getting Started with Eclipse Neon"
description: "This tutorials walks us through creating a simple Hello World application using Eclipse Neon"
authors: Nikolay Krasko
date: 2016-11-10
showAuthorInfo: true
---

### Setting up the environment
We're assuming Eclipse is installed. If not, it can be
download from the [download page](https://www.eclipse.org/downloads/). The "Eclipse IDE for Java Developers" bundle is recommended. For correct functioning, Eclipse Neon (4.6) or later is required.

We recommend installing Kotlin plugin from [Eclipse Marketplace](http://marketplace.eclipse.org/content/kotlin-plugin-eclipse).
One option is to drag-and-drop this button into a running Eclipse window:

<a href="http://marketplace.eclipse.org/marketplace-client-intro?mpc_install=2257536" class="drag" title="Drag to your running Eclipse workspace."><img class="img-responsive" src="http://marketplace.eclipse.org/sites/all/themes/solstice/public/images/marketplace/btn-install.png" alt="Drag to your running Eclipse workspace." /></a>

Alternatively, use the *Help -> Eclipse Marketplace...* menu and search for Kotlin plugin:

   ![Eclipse Marketplace]({{ url_for('tutorial_img', filename='getting-started-eclipse/marketplace.png') }})

A more old-fashioned way is using an *update site* directly:

```
https://dl.bintray.com/jetbrains/kotlin/eclipse-plugin/last/
```

Once Eclipse has been restarted, we can check to make sure the Kotlin plugin is installed correctly, by opening the Kotlin perspective
in main menu ``Window -> Open Perspective -> Other...``

   ![Kotlin Perspective]({{ url_for('tutorial_img', filename='getting-started-eclipse/open-perspective.png') }})

### Creating a new project
Now we are ready to create a new Kotlin project.

Select *File -> New -> Kotlin Project* to proceed.

   ![New Kotlin Project]({{ url_for('tutorial_img', filename='getting-started-eclipse/new-project.png') }})

An empty project will be created which is ready for writing Kotlin code that targets the JVM (JavaScript is not supported yet).
The project created, from the Eclipse point of view, is also a Java project but configured with Kotlin nature, meaning it has the Kotlin
Builder and reference to the Kotlin Runtime Library. Great thing about this solution is that we can continue adding Java
classes to the project, mixing and matching Kotlin and Java code if required.

A fresh Kotlin project Package Explorer should look something similar to the following:

   ![Empty Kotlin Project]({{ url_for('tutorial_img', filename='getting-started-eclipse/empty-project.png') }})

We can now create a new Kotlin file under the source folder.

   ![New File From Context Menu]({{ url_for('tutorial_img', filename='getting-started-eclipse/eclipse-new-file-menu.png') }})

IF omitting the *".kt"* extension in file name, Eclipse will add it automatically

   ![New Kotlin File Wizard]({{ url_for('tutorial_img', filename='getting-started-eclipse/eclipse-new-file-wizard.png') }})


Once we have the file created, we need to type the main routine, which is the entry point to a Kotlin application. We
can simply type *main*, invoke completion and hit 'Enter'

   ![Main Template]({{ url_for('tutorial_img', filename='getting-started-eclipse/main.png') }})

Finally we add a simple line of Kotlin code to print the message:

   ![Hello World Example]({{ url_for('tutorial_img', filename='getting-started-eclipse/hello-world.png') }})

### Running the application
The easiest way to run the application is to do a right-click somewhere in the main file and select *Run As -> Kotlin Application*

   ![Run Kotlin Application]({{ url_for('tutorial_img', filename='getting-started-eclipse/run-as.png') }})

If everything has gone well, the console window output should automatically open, showing the results.

   ![Program Output View]({{ url_for('tutorial_img', filename='getting-started-eclipse/output.png') }})

We now have our first Kotlin application running in Eclipse.

