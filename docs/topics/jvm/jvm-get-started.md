[//]: # (title: Get started with Kotlin/JVM)

This tutorial demonstrates how to use IntelliJ IDEA for creating a console application.

To get started, first download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

## Create an application 

Once you've installed IntelliJ IDEA, it's time to create your first Kotlin application.

1. In IntelliJ IDEA, select **File** \| **New** \| **Project**.
2. In the panel on the left, select **Kotlin**.
3. Enter a project name, select **Console Application** as the project template, and click **Next**.
   
   ![Create a console application](jvm-new-project-1.png)
   
   By default, your project will use the Gradle build system with Kotlin DSL.

4. Go through and accept the default configuration, then click **Finish**.
  
   ![Configure a console application](jvm-new-project-2.png) 

   Your project will open. By default, you see the file `build.gradle.kts`, which is the build script created by the Project 
   Wizard based on your configuration. It includes the `kotlin("jvm")` plugin and dependencies required for your console application.

5. Open the `main.kt` file in `src/main/kotlin`.  
   The `src` directory contains Kotlin source files and resources. The `main.kt` file contains sample code that will print 
   `Hello World!`.

   ![main.kt with main fun](jvm-main-kt-initial.png){width=600}

6. Modify the code so that it requests your name and says `Hello` to you specifically, and not to the whole world.  
   
   * Introduce a local variable `name` with the keyword `val`. It will get its value from an input where you will enter your name – `readln()`.
   * Use a string template by adding a dollar sign `$` before this variable name directly in the text output like this – `$name`.
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   }
   ```

   ![Updated main fun](jvm-main-kt-updated.png){width=400}

## Run the application

Now the application is ready to run. The easiest way to do this is to click the green __Run__ icon in the gutter and select __Run 'MainKt'__.

![Running a console app](jvm-run-app.png){width=400}

You can see the result in the **Run** tool window.

![Kotlin run output](jvm-output-1.png){width=600}
   
Enter your name and accept the greetings from your application! 

![Kotlin run output](jvm-output-2.png){width=600}

Congratulations! You have just run your first Kotlin application.

## What's next?

Once you’ve created this application, you can start to dive deeper into Kotlin syntax:

*   Add sample code from [Kotlin examples](https://play.kotlinlang.org/byExample/overview) 
*   Install the [EduTools plugin](https://plugins.jetbrains.com/plugin/10081-edutools) for IDEA and complete exercises 
from the [Kotlin Koans course](https://www.jetbrains.com/help/education/learner-start-guide.html?section=Kotlin%20Koans)