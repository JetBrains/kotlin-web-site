[//]: # (title: Get started with Kotlin/Native in IntelliJ IDEA)

This tutorial demonstrates how to use IntelliJ IDEA for creating a Kotlin/Native application.

To get started, install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html). The tutorial is applicable to both IntelliJ IDEA Community Edition and the Ultimate Edition.

## Create a new Kotlin/Native project in IntelliJ IDEA

1. In IntelliJ IDEA, select **File** | **New** | **Project**.
2. In the panel on the left, select **Kotlin**.
3. Enter a project name, select **Native Application** as the project template, and click **Next**.

   ![Create a native application](native-new-project-intellij-1.png)

   By default, your project will use Gradle with Kotlin DSL as the build system.
   > Kotlin/Native doesn't support Maven and IntelliJ IDEA native builder.
   >
   {type="note"}

4. Accept the default configuration on the next screen and click **Finish**. Your project will open.

   ![Configure a native application](native-new-project-intellij-2.png)

   By default, the wizard creates the necessary `main.kt` file with code that prints "Hello, Kotlin/Native!" to the standard output.

5. Open the `build.gradle.kts` file, the build script that contains the project settings. To create Kotlin/Native applications,
   you need the Kotlin Multiplatform Gradle plugin installed. Ensure that you use the latest version of the plugin:

   ```kotlin
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }
   ```
   
> * Read more about these settings in the [Multiplatform Gradle DSL reference](multiplatform-dsl-reference.md).
> * Read more about the Gradle build system in the [documentation](gradle.md). 
>
{type="tip"}

## Build and run the application

1. Click **Build Project** next to the run configuration at the top of the screen:

   ![Build the application](native-run-app.png){width=600}

2. On the **Terminal** tab, run the following command:

   ```bash
   build/bin/native/debugExecutable/<your_app_name>.kexe
   ```

   IntelliJ IDEA prints "Hello, Kotlin/Native!".

You can [configure IntelliJ IDEA](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build) to build
your project automatically:

1. Go to **Settings/Preferences | Build, Execution, Deployment | Compiler**.
2. On the **Compiler** page, select **Build project automatically**.
3. Apply the changes.

Now when you make changes in the class files or save the file (**Ctrl + S**/**Cmd + S**), IntelliJ IDEA automatically
performs the incremental build of the project.

## Update the application

### Count the letters in your name

1. Open the file `main.kt` in `src/nativeMain/kotlin`.

   The `src` directory contains the Kotlin source files and resources. The file `main.kt` includes sample code that prints "Hello, Kotlin/Native!" using the [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/stdlib/kotlin.io/println.html) function.

2. Add code to read the input. Use the [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) function to read the input value and assign it to the `name` variable:

   > The readln() function is available since [Kotlin 1.6.0](whatsnew16.md#new-readline-functions).  
   > Ensure that you have installed the latest version of the [Kotlin plugin](releases.md).
   >
   {type="note"}

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
   }
   ```

3. Eliminate the whitespaces and count the letters:
   * Use the [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) function to remove the empty spaces in the name.
   * Use the scope function [`let`](scope-functions.md#let) to run the function within the object context. 
   * Use a [string template](basic-types.md#string-templates) to insert your name length into the string by adding a dollar sign `$` and enclosing it in curly braces – `${it.length}`.
     `it` is the default name of a [lambda parameter](coding-conventions.md#lambda-parameters).

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
       // Count the letters in the name.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4. Save the changes and run the build command:

   ```bash
   build/bin/native/debugExecutable/<your_app_name>.kexe
   ```

5. Enter your name and enjoy the result:

   ![Application output](native-output-2.png)

### Count the unique letters in your name

1. Open the file `main.kt` in `src/nativeMain/kotlin`.

2. Declare the new [extension function](extensions.md#extension-functions) `countDistinctCharacters()` for `String`:

   * Convert the name to lowercase using the [`lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) function.
   * Convert the input string to a list of characters using the [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) function.
   * Select only the distinct characters in your name using the [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) function.
   * Count the distinct characters using the [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) function.

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

3. Use the `countDistinctCharacters()` function to count the unique letters in your name:

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
       // Count the letters in the name.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
           // Print the number of unique letters.
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       }
   }
   ```

4. Save the changes and run the build command:

   ```bash
   build/bin/native/debugExecutable/<your_app_name>.kexe
   ```

5. Enter your name and enjoy the result:

   ![Application output](native-output-3.png)

## What's next?

Once you have created your first application, you can go to Kotlin hands-on labs and complete long-form tutorials on Kotlin/Native. 

For Kotlin/Native, the following hands-on labs are currently available:

* [Learn about the concurrency model in Kotlin/Native](https://play.kotlinlang.org/hands-on/Kotlin%20Native%20Concurrency/00_Introduction) shows you how to build a command-line application and work with states in a multi-threaded environment.
* [Create an app using C Interop and libcurl](native-app-with-c-and-libcurl.md) explains how to create a native HTTP client and interoperate with C libraries.