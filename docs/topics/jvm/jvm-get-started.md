[//]: # (title: Get started with Kotlin/JVM)

This tutorial demonstrates how to use IntelliJ IDEA for creating a console application.

To get started, first download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

## Create a project

1. In IntelliJ IDEA, select **File** | **New** | **Project**.
2. In the panel on the left, select **New Project**.
3. Name the new project and change its location if necessary.

   > Select the **Create Git repository** checkbox to place the new project under version control. You will be able to do
   > it later at any time.
   >
   {style="tip"}

4. From the **Language** list, select **Kotlin**.
   
   ![Create a console application](jvm-new-project.png){width=700}

5. Select the **IntelliJ** build system. It's a native builder that doesn't require downloading additional artifacts.

   If you want to create a more complex project that needs further configuration, select Maven or Gradle. For Gradle,
   choose a language for the build script: Kotlin or Groovy.
6. From the **JDK list**, select the [JDK](https://www.oracle.com/java/technologies/downloads/) that you want to use in
   your project.
   * If the JDK is installed on your computer, but not defined in the IDE, select **Add JDK** and specify the path to the
   JDK home directory. 
   * If you don't have the necessary JDK on your computer, select **Download JDK**.

7. Enable the **Add sample code** option to create a file with a sample `"Hello World!"` application.

    > You can also enable the **Generate code with onboarding tips** option to add some additional useful comments to your
    > sample code.
    >
    {style="tip"}

8. Click **Create**.

  > If you chose the Gradle build system, you have in your project a build script file: `build.gradle(.kts)`. It includes 
  > the `kotlin("jvm")` plugin and dependencies required for your console application. Make sure that you use the latest 
  > version of the plugin:
  > 
  > ```kotlin
  > plugins {
  >     kotlin("jvm") version "%kotlinVersion%"
  >     application
  > }
  > ```
  >{style="note"}

## Create an application

1. Open the `Main.kt` file in `src/main/kotlin`.  
   The `src` directory contains Kotlin source files and resources. The `Main.kt` file contains sample code that will print 
   `Hello World!`.

   ![Main.kt with main fun](jvm-main-kt-initial.png){width=700}

2. Modify the code so that it requests your name and says `Hello` to you alone, and not to the whole world:
   
   * Introduce a local variable `name` with the keyword `val`. It will get its value from an input where you will enter your name – [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html).
   * Use a string template by adding a dollar sign `$` before this variable name directly in the text output like this – `$name`.
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   }
   ```

   ![Updated main fun](jvm-main-kt-updated.png){width=350}

## Run the application

Now the application is ready to run. The easiest way to do this is to click the green **Run** icon in the gutter and select **Run 'MainKt'**.

![Running a console app](jvm-run-app.png){width=350}

You can see the result in the **Run** tool window.

![Kotlin run output](jvm-output-1.png){width=600}
   
Enter your name and accept the greetings from your application! 

![Kotlin run output](jvm-output-2.png){width=600}

Congratulations! You have just run your first Kotlin application.

## What's next?

Once you've created this application, you can start to dive deeper into Kotlin syntax:

* Add sample code from [Kotlin examples](https://play.kotlinlang.org/byExample/overview) 
* Install the [JetBrains Academy plugin](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy) for IDEA and complete 
  exercises from the [Kotlin Koans course](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans)