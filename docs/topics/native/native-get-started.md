[//]: # (title: Get started with Kotlin/Native in IntelliJ IDEA)

This tutorial demonstrates how to use IntelliJ IDEA for creating a Kotlin/Native application.

To get started, install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html). The tutorial is applicable to both IntelliJ IDEA Community Edition and the Ultimate Edition.

## Create a new Kotlin/Native project in IntelliJ IDEA

1. In IntelliJ IDEA, select **File** \| **New** \| **Project**.
2. In the panel on the left, select **Kotlin**.
3. Enter a project name, select **Native Application** as the project template, and click **Next**.

   ![Create a native application](native-new-project-intellij-1.png)

   By default, your project will use Gradle with Kotlin DSL as the build system.
   > Kotlin/Native doesn't support Maven and IntelliJ IDEA native builder.
   >
   {type="note"}

4. Accept the default configuration on the next screen and click **Finish**.

   ![Configure a native application](native-new-project-intellij-2.png)

Your project will open. By default, the wizard creates the necessary `main.kt` file with code that prints "Hello, Kotlin/Native!" to the standard output.

The `build.gradle.kts` file contains the project settings. Read more about these settings in the [Kotlin Multiplatform Gradle DSL reference](mpp-dsl-reference.md).

## Run the application

Start the application by clicking **Run** next to the run configuration at the top of the screen.

![Run the application](native-run-app.png){width=600}

IntelliJ IDEA opens the **Run** tab and shows the output:
![Application output](native-output-1.png){width=600}

## Update the application

### Count the letters in your name

1. Open the file `main.kt` in `src/<your_app_name>Main/kotlin`.

   The `src` directory contains the Kotlin source files and resources. The file `main.kt` includes sample code that prints "Hello, Kotlin/Native!" using the [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/stdlib/kotlin.io/println.html) function.

2. Add code to read the input. Use the [`readLine()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) function to read the input value and assign it to the `name` variable.

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readLine()
   }
   ```

3. Eliminate the whitespaces and count the letters:
   * Check that the provided name is not `null` with the [safe call operator `?.`](null-safety.md#safe-calls).
   * Use the [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) function to remove the empty spaces in the name.
   * Use the scope function [`let`](scope-functions.md#let) to run the function within the object context. 
   * Use a [string template](strings.md#string-templates) to insert your name length into the string by adding a dollar sign `$` and enclosing it in curly braces – `${it.length}`.
     `it` is the default name of a [lambda parameter](coding-conventions.md#lambda-parameters).

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readLine()
       // Count the letters in the name.
       name?.replace(" ", "")?.let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4. Report a null value using the [`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html) function after the [Elvis operator `?:`](null-safety.md#elvis-operator).

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readLine()
       // Count the letters in the name.
       name?.replace(" ", "")?.let {
           println("Your name contains ${it.length} letters")
       } ?: error("Error while reading input from the terminal: the value can't be null.")
   }
   ```

5. Save the changes and run the application.

   IntelliJ IDEA opens the **Run** tab and shows the output.

6. Enter your name and enjoy the result:

   ![Application output](native-output-2.png)

### Count the unique letters in your name

1. Open the file `main.kt` in `src/<your_app_name>Main/kotlin`.

2. Declare the new [extension function](extensions.md#extension-functions) `countDistinctCharacters()` for `String`:

   * Convert the name to lowercase using the [`lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) function.
   * Convert the input string to a list of characters using the [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) function.
   * Select only the distinct characters in your name using the [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) function.
   * Count the distinct characters using the [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) function.

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

3. Use the `countDistinctCharacters()` function to count the unique letters in your name.

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readLine()
       // Count the letters in the name.
       name?.replace(" ", "")?.let {
           println("Your name contains ${it.length} letters")
           // Print the number of unique letters.
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       } ?: error("Error while reading input from the terminal: the value can't be null.")
   }
   ```

3. Save the changes and run the application.

   IntelliJ IDEA opens the **Run** tab and shows the output.

4. Enter your name and enjoy the result:

   ![Application output](native-output-3.png)

## What's next?

Once you have created your first application, you can go to Kotlin hands-on labs and complete long-form tutorials on Kotlin/Native. 

For Kotlin/Native, the following hands-on labs are currently available:

* [Learn about the concurrency model in Kotlin/Native](https://play.kotlinlang.org/hands-on/Kotlin%20Native%20Concurrency/00_Introduction) shows you how to build a command-line application and work with states in a multi-threaded environment.
* [Creating an HTTP Client in Kotlin/Native](https://play.kotlinlang.org/hands-on/Introduction%20to%20Kotlin%20Native/01_Introduction) explains how to create a native HTTP client and interoperate with C libraries.