[//]: # (title: Eclipse IDE)

[Eclipse IDE](https://www.eclipse.org/downloads/) is a widely known IDE that offers various packages for development in
different languages and for different platforms. You can use is for writing Kotlin code. On this page, you will learn
how to get started with Kotlin in Eclipse IDE. 

## Set up the environment

First of all, you need the Eclipse IDE installed on your system.
You can download its latest version from [download page](https://www.eclipse.org/downloads/).
The **Eclipse IDE for Java Developers** bundle is recommended.

To add the Kotlin support to your Eclipse IDE, install the **Kotlin Plugin for Eclipse**.
We recommend installing the Kotlin plugin from [Eclipse Marketplace](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse). 
Open the __Help \| Eclipse Marketplace...__ menu and search for __Kotlin Plugin for Eclipse__: 

![Eclipse Marketplace](eclipse-marketplace.png){width="500"}

Once the plugin is installed and Eclipse is restarted, make sure the plugin is installed correctly: open the __Kotlin perspective__
in the menu __Window \| Perspective | Open Perspective \| Other...__
    
![Kotlin Perspective](eclipse-open-perspective.png){width="500"}

## Create a new project

Now you are ready to create a new Kotlin project.

First, select __File | New | Kotlin Project__.

![New Kotlin project](eclipse-project-name.png){width="500"}

An empty Kotlin/JVM project will be created.

For Eclipse IDE, the project is also a Java project but configured with Kotlin nature, meaning it has the Kotlin
Builder and reference to the Kotlin Runtime Library. Great thing about this solution is that you can add both Kotlin and
Java code to the same project.
   
The project structure looks like this:

![Empty Kotlin project](eclipse-empty-project.png){width="700"}

Now, create a new Kotlin file in the source directory.

![New file from context menu](eclipse-new-file.png){width="700"}
   
You can enter the name without the `.kt` extension. Eclipse will add it automatically.

![New Kotlin file wizard](eclipse-file-name.png){width="500"}

Once you have a source file, add the `main` function - the entry point to a Kotlin application. You
can simply type `main` and invoke code completion by hitting `Ctrl + Space`.

![Kotlin function example](eclipse-main.png){width="700"}

Finally, add a simple line of Kotlin code to print a message:

![Hello World example](eclipse-hello-world.png){width="700"}

## Run the application

To run the application, right-click somewhere in the main file and select __Run As | Kotlin Application__.

![Run Kotlin application](eclipse-run-as.png){width="700"}
   
If everything went well, you'll see the result in the **Console** window.

![Program output view](eclipse-output.png){width="500"}

Congratulations! You now have your Kotlin application running in Eclipse IDE.