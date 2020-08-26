---
type: tutorial
layout: tutorial
title:  "Get started with Kotlin/Native using IntelliJ IDEA"
description: "This tutorial demonstrates how to use IntelliJ IDEA for creating a Kotlin/Native application."
authors: Hadi Hariri, Andrey Polyakov
date: 2020-08-20
showAuthorInfo: false
---

<!--- To become a How-To. Need to change type to new "HowTo" --->

To get started, install the latest version of [IntelliJ IDEA](http://www.jetbrains.com/idea/download/index.html). The tutorial is applicable to both IntelliJ IDEA Community Edition and the Ultimate Edition.

## Create a new Kotlin/Native project in IntelliJ IDEA

1. In IntelliJ IDEA, select **File** \| **New** \| **Project**.
2. In the panel on the left, select **Kotlin**.
3. Enter a project name, select **Native Application** as the project template, and click **Next**.

   ![Create a native application]({{ url_for('tutorial_img', filename='native/using-intellij-idea/native-new-project-intellij-1.png') }})

   By default, your project will use Gradle with Kotlin DSL as the build system.
   > Kotlin/Native doesn't support Maven and IntelliJ build systems.
   {:.note}

4. Accept the default configuration on the next screen and click **Finish**.

   ![Configure a native application]({{ url_for('tutorial_img', filename='native/using-intellij-idea/native-new-project-intellij-2.png') }})

Your project opens. By default, the wizard creates the necessary `main.kt` file with the code that prints "Hello, Kotlin/Native!" to the standard output.

The `build.gradle.kts` file contains the project settings. You can change the settings using [Kotlin Multiplatform Gradle DSL reference](../../reference/mpp-dsl-reference.html).

## Run the application

Start the application by clicking **Run** next to the run configuration at the top of the screen.

![Run the application]({{ url_for('tutorial_img', filename='native/using-intellij-idea/native-new-project-intellij-3.png') }})

IntelliJ IDEA opens the **Run** tab and shows the output:
![Application output]({{ url_for('tutorial_img', filename='native/using-intellij-idea/native-new-project-intellij-4.png') }})

## Update the application

### Count letters in your name

1. Open the file `main.kt` in `src/<your_app_name>Main/kotlin`.

   The `src` directory contains Kotlin source files and resources. The file `main.kt` includes sample code that prints "Hello, Kotlin/Native!" using the [`prinln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) function.

2. Change the code of `main()`:

   * Use the [`readLine()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html) function to read the input value to the `name` variable.
   * Perform the null check of the input value with the [safe call operator `?.`](https://kotlinlang.org/docs/reference/null-safety.html#safe-calls).
   * Use the [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) function to eliminate the whitespaces in the name.
   * Use the scope function [`let`](https://kotlinlang.org/docs/reference/scope-functions.html#let) to execute function within the object context. 
   * Use a [string template](https://kotlinlang.org/docs/reference/basic-types.html#string-templates) to insert your name into the string by adding a dollar sign `$` and enclosing it in curly braces – `${it?.length}`.
   * Report about the null value using the [`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html) function after the [Elvis operator `?:`](https://kotlinlang.org/docs/reference/null-safety.html#elvis-operator). 

   <div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

   ```kotlin
   fun main() {
       println("Hello, enter your name:")
       val name = readLine()
       name?.replace(" ", "")?.let {
           println("Your name contains ${it.length} letters")
       } ?: error("Error while reading input from the terminal: the value can't be null.")
   }
   ```

   </div>

3. Save the changes and run the application.

   IntelliJ IDEA opens the **Run** tab and shows the output.

4. Enter your name and enjoy the result:

   ![Application output]({{ url_for('tutorial_img', filename='native/using-intellij-idea/native-new-project-intellij-5.png') }})


### Count unique letters in your name

1. Open the file `main.kt` in `src/<your_app_name>Main/kotlin`.

2. Count the distinct letters in your name:

   * Convert the name to lower case using the [`toLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-lower-case.html) function.
   * Convert the input string to a collection of characters using the [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) function.
   * Select only distinct characters in your name using the [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) function.
   * Count distinct characters using the [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) function.

   <div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

   ```kotlin
   fun main() {
       println("Hello, enter your name:")
       val name = readLine()
       name?.replace(" ", "")?.let {
           println("Your name contains ${it.length} letters")
           println("Your name contains ${it.toLowerCase().toList().distinct().count()} unique letters")
       } ?: error("Error while reading input from the terminal: the value can't be null.")
   }
   ```

   </div>
   
3. Save the changes and run the application.

   IntelliJ IDEA opens the **Run** tab and shows the output.

4. Enter your name and enjoy the result:

   ![Application output]({{ url_for('tutorial_img', filename='native/using-intellij-idea/native-new-project-intellij-6.png') }})


## What's next?

The sample project can serve as the basis for any new project for Kotlin/Native. For further information, check out:

* [Kotlin/Native Gradle plugin](https://kotlinlang.org/docs/reference/native/gradle_plugin.html)
* [Multiplatform Projects](https://kotlinlang.org/docs/reference/mpp-discover-project.html)


