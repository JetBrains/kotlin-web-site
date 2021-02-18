[//]: # (title: Eclipse IDE)

[Eclipse IDE](https://www.eclipse.org/downloads/) is a widely known IDE that offers various packages for development in
different languages and for different platforms. You can use is for writing Kotlin code. On this page, you will learn
how to get started with Kotlin in Eclipse IDE. 

## Set up the environment

First of all, you need the Eclipse IDE installed on your system.
You can download its latest version from [download page](https://www.eclipse.org/downloads/).
The **Eclipse IDE for Java Developers** bundle is recommended.

To add the Kotlin support to your Eclipse IDE, install the **Kotlin Plugin for Eclipse**.
We recommend installing the Kotlin plugin from [Eclipse Marketplace](http://marketplace.eclipse.org/content/kotlin-plugin-eclipse). 
Open the __Help \| Eclipse Marketplace...__ menu and search for __Kotlin Plugin for Eclipse__: 

<img src="marketplace.png" alt="Eclipse Marketplace" width="500"/>

Once the plugin is installed and Eclipse is restarted, make sure the plugin is installed correctly: open the __Kotlin perspective__
in the menu __Window \| Open Perspective \| Other...__
    
<img src="open-perspective.png" alt="Kotlin Perspective" width="500"/>

## Create a new project

Now you are ready to create a new Kotlin project.

First, select __File | New | Kotlin Project__.

<img src="project-name.png" alt="New Kotlin project" width="700"/>

An empty Kotlin/JVM project will be created.

For Eclipse IDE, the project is also a Java project but configured with Kotlin nature, meaning it has the Kotlin
Builder and reference to the Kotlin Runtime Library. Great thing about this solution is that you can add both Kotlin and
Java code to the same project.
   
The project structure looks like this:

<img src="empty-project.png" alt="Empty Kotlin project" width="700"/>

Now, create a new Kotlin file in the the source directory.

<img src="new-file.png" alt="New file from context menu" width="700"/>
   
You can enter the name without the `.kt` extension. Eclipse will add it automatically.

<img src="file-name.png" alt="New Kotlin file wizard" width="700"/>

Once you have a source file, add the `main` function - the entry point to a Kotlin application. You
can simply type `main` and invoke code completion by hitting `Ctrl + Space`.

<img src="main.png" alt="main() template" width="500"/>

Finally, add a simple line of Kotlin code to print a message:

<img src="hello-world.png" alt="Hello World example" width="500"/>

## Run the application

To run the application, right-click somewhere in the main file and select __Run As | Kotlin Application__.

<img src="run-as.png" alt="Run Kotlin application" width="700"/>
   
If everything went well, you'll see the result in the **Console** window.

<img src="output.png" alt="Program output view" width="700"/>

Congratulations! You now have your Kotlin application running in Eclipse IDE.