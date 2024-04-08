[//]: # (title: Get started with Kotlin/Native in IntelliJ IDEA)

This tutorial demonstrates how to use IntelliJ IDEA for creating a Kotlin/Native application.

To get started, install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html). The tutorial is applicable to both IntelliJ IDEA Community Edition and the Ultimate Edition.

## Before you start

1. Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/) with the latest [Kotlin plugin](releases.md).
2. Clone the [project template](https://github.com/Kotlin/kmp-native-wizard)
   by selecting **File** | **New** | **Project from Version Control** in IntelliJ IDEA.
3. Open the `build.gradle.kts` file, the build script that contains the project settings. To create Kotlin/Native applications,
   you need the Kotlin Multiplatform Gradle plugin installed. Ensure that you use the latest version of the plugin:

   ```kotlin
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }
   ```
4. Follow the suggestion to reload Gradle files:

   ![Load Gradle changes button](load-gradle-changes.png){width=295}

> * Read more about these settings in the [Multiplatform Gradle DSL reference](multiplatform-dsl-reference.md).
> * Read more about the Gradle build system in the [documentation](gradle.md).
>
{type="tip"}

## Build and run the application

Open the `Main.kt` file in the `src/nativeMain/kotlin/` directory, then press the green icon in the gutter to run the code:

![Run the application](native-run-gutter.png){width=478}

IntelliJ IDEA runs the code using the Gradle task. You will see the result in the **Run** tab:
![Application output](native-output-gutter-1.png){width=331}

After the first run, you will see the corresponding run configuration on the top bar in the IDE:
![Gradle run configuration](native-run-config.png){width=503}

> IntelliJ IDEA Ultimate users can install the [Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support)
> plugin that allows to debug compiled native executables, and also automatically creates run configurations for
> imported Kotlin/Native projects.

You can [configure IntelliJ IDEA](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build) to build
your project automatically:

1. Go to **Settings/Preferences | Build, Execution, Deployment | Compiler**.
2. On the **Compiler** page, select **Build project automatically**.
3. Apply the changes.

Now when you make changes in the class files or save the file (**Ctrl + S**/**Cmd + S**), IntelliJ IDEA automatically
performs an incremental build of the project.

## Update the application

### Count the letters in your name

1. Open the file `Main.kt` in `src/nativeMain/kotlin`.

   The `src` directory contains Kotlin source files. The `Main.kt` file includes code that prints "Hello, Kotlin/Native!"
   using the [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) function.

2. Add code to read the input. Use the [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) function to read the input value and assign it to the `name` variable:

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
   }
   ```

3. To run this app using Gradle, specify `System.in` as the input to use in the `build.gradle.kts` file
   and load the Gradle changes:

   ```kotlin
   kotlin {
       //...
       nativeTarget.apply {
           binaries {
               executable {
                   entryPoint = "main"
                   runTask?.standardInput = System.`in`
               }
           }
       }
       //...
   }
   ```
   {initial-collapse-state="collapsed" collapsed-title="runTask?.standardInput = System.`in`"}

4. Eliminate the whitespaces and count the letters:
   * Use the [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) function to remove the empty spaces in the name.
   * Use the scope function [`let`](scope-functions.md#let) to run the function within the object context.
   * Use a [string template](strings.md#string-templates) to insert your name length into the string by adding a dollar sign `$` and enclosing it in curly braces – `${it.length}`.
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

5. Run the application.
6. Enter your name and enjoy the result:

   ![Application output](native-output-gutter-2.png){width=422}

### Count the unique letters in your name

1. Open the file `Main.kt` in `src/nativeMain/kotlin`.
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

4. Run the application.
5. Enter your name and enjoy the result:

   ![Application output](native-output-gutter-3.png){width=422}

## What's next?

Once you have created your first application, you can complete our long-form tutorial on Kotlin/Native,
[Create an app using C Interop and libcurl](native-app-with-c-and-libcurl.md) that explains how to create a native HTTP
client and interoperate with C libraries.
