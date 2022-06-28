[//]: # (title: Eclipse)

[Eclipse](https://www.eclipse.org/downloads/) is a widely known IDE that offers various packages for development in
different languages and for different platforms. You can use it for writing Kotlin code. On this page, you will learn
how to get started with Kotlin in Eclipse.

> Kotlin Plugin for Eclipse has limited support.  
> Use [other IDEs for Kotlin development](ide-overview.md) to get full support of new Kotlin features.
>
{type="warning"}

## Set up the environment

1. Install the Eclipse.  
   You can download its latest version from [download page](https://www.eclipse.org/downloads/).
   The **Eclipse IDE for Java Developers** bundle is recommended.

2. To add the Kotlin support to your Eclipse, install the **Kotlin Plugin for Eclipse**.
   It's recommended to install the Kotlin plugin from [Eclipse Marketplace](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse).   
   Open the **Help \| Eclipse Marketplace...** menu and search for **Kotlin Plugin for Eclipse**: 

   ![Eclipse Marketplace](eclipse-marketplace.png){width="500"}

3. Once the plugin is installed, restart Eclipse. Make sure the plugin is installed correctly:
   in the menu **Window** | **Perspective** | **Open Perspective** | **Other...**, open the **Kotlin perspective**.

   ![Kotlin Perspective](eclipse-open-perspective.png){width="500"}

## Create a new project

Now you are ready to create a new Kotlin project:

1. Select **File** | **New** | **Kotlin Project**.
2. Name the new project and change its location if necessary.

   ![New Kotlin project](eclipse-project-name.png){width="500"}

   An empty Kotlin/JVM project will be created.

   For Eclipse, the project is also a Java project but configured with Kotlin nature, meaning it has the Kotlin
   Builder and reference to the Kotlin Runtime Library. Great thing about this solution is that you can add both Kotlin and
   Java code to the same project.

   The project structure looks like this:

   ![Empty Kotlin project](eclipse-empty-project.png){width="700"}

3. Create a new Kotlin file in the source directory.

   ![New file from context menu](eclipse-new-file.png){width="700"}

   > You can enter the name without the `.kt` extension. Eclipse will add it automatically.
   >
   {type="note"}

   ![New Kotlin file wizard](eclipse-file-name.png){width="500"}

4. Once you have a source file, add the `main()` function – the entry point to a Kotlin application. 
   You can simply type `main` and invoke code completion by hitting `Ctrl + Space`.

   ![Kotlin function example](eclipse-main.png){width="700"}

5. Add a simple line of Kotlin code to print a message:

   ```kotlin
   fun main() {
       println("Hello, world!")
   }
   ```

   ![Hello World example](eclipse-hello-world.png){width="700"}

## Run the application

To run the application, right-click somewhere in the main file and select **Run As | Kotlin Application**.

![Run Kotlin application](eclipse-run-as.png){width="700"}

If everything went well, you'll see the result in the **Console** window:

![Program output view](eclipse-output.png){width="500"}

Congratulations! You now have your Kotlin application running in Eclipse.

## What's next

Once you’ve created this application, you can start to dive deeper into Kotlin syntax:

* Look through other [IDEs for Kotlin development](ide-overview.md)
* Add sample code from [Kotlin examples](https://play.kotlinlang.org/byExample/overview)
* Look through [Kotlin idioms](idioms.md) to write Kotlin idiomatic code