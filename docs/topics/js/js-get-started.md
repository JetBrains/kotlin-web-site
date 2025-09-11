[//]: # (title: Get started with Kotlin/JS)

This tutorial demonstrates how to create a Kotlin/JS application targeting a browser.
Choose the tool that works best for you and create your app using:

* **[The IDE](#in-ide)**. Here, you can clone the project template from a version control system and use it in IntelliJ IDEA.
* **[The Gradle build system](#using-gradle)**. To better understand how things work under the hood,
  create build files for your project manually.

With Kotlin/JS, you can compile for [different environments](js-project-setup.md#execution-environments).

## In IDE

In this section, you'll learn how to use IntelliJ IDEA to create a Kotlin/JS application. You can use both
the Community Edition and the Ultimate Edition.

### Create the project

1. Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. [Set up your environment for Kotlin Multiplatform development](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html#set-up-the-environment).
3. Clone the [project template](https://github.com/Kotlin/kmp-js-wizard)
   by selecting **File** | **New** | **Project from Version Control** in IntelliJ IDEA and using this URL:

   ```none
   https://github.com/Kotlin/kmp-js-wizard
   ```   

4. Open the `gradle/libs.versions.toml` file, which is the version catalog for project dependencies. To create Kotlin/JS
   applications, you need the Kotlin Multiplatform Gradle plugin, which has the same version as Kotlin. Ensure that you
   use the latest Kotlin version:

   ```none
   [versions]
   kotlin = "%kotlinVersion%"
   ```

5. Follow the suggestion to reload Gradle files:

   ![Load Gradle changes button](load-gradle-changes.png){width=295}

For more information about these settings, see the [Multiplatform Gradle DSL reference](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html).

### Build and run the application

Open the `Main.kt` file in the `src/jsMain/kotlin/` directory:

* The `src` directory contains Kotlin source files.
* The `Main.kt` file includes code that renders "Hello, Kotlin/JS!" to the browser page using the [kotlinx.browser](https://github.com/Kotlin/kotlinx-browser) API.

Press the green icon in the gutter to run the code:

![Run the application](js-run-gutter.png){width=478}

IntelliJ IDEA runs the code using the Gradle task and that open application in the browser:

![Application output](js-output-gutter-1.png){width=331}

After the first run, the IDE creates the corresponding run configuration at the top:

![Gradle run configuration](js-run-config.png){width=503}

> IntelliJ IDEA Ultimate users can use the [JS Debugger](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)
> that allows debugging the compiled code directly from IDE

You can Gradle to re-build your project automatically on changes:

1. Edit **Gradle run configuration created**.

    ![Gradle edit run configuration](js-edit-run-config.png){width=503}

2. In the **Run** field, add `--continuous` flag, so the **Run** field value looks like this:

    ![Continuous run configuration](js-continuous-run-config.png){width=503}

4. Apply the changes.

Now, when you run the application and make any changes in the class files or save the file (<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>),
Gradle automatically performs an incremental build of the project and hot-reloads the browser page with the updated code.

### Update the application

Let's add a feature to your application so it can count the number of letters in your name:

1. In the `Main.kt` file, add code to read the input. To do this, let's create an [HTML input element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input)
   by declaring the new [extension function](extensions.md#extension-functions):

   ```kotlin
   fun Element.appendInput() {
       val input = document.createElement("input")
       appendChild(input)
   }
   ```
   
2. Now, we can use this function to add the input to the page 
   ```kotlin
   fun main() {
       document.body?.appendInput()
   }
   ```

    And our application looks like this:

   ![Application with input element](js-added-input-element.png){width=503}

3. Then we need to read the input value and assign it to the `name` variable, so let's listen to changes in the input. 
   To do so, we need to add a listener to the `input` element, inside the `appendInput()` function:
   ```kotlin
    fun Element.appendInput(onChange: (String) -> Unit = {}) {
        val input = document.createElement("input").apply {
            addEventListener("change") { event ->
                onChange(event.target.unsafeCast<HTMLInputElement>().value)
            }
        }
        appendChild(input)
    }
    ```

    ```kotlin
    fun main() {
        // Read the input value.
        document.body?.appendInput(onChange = { println(it) })
    }
   ```

4. Let's add also a text element to show our output. To do this, let's create one more [extension function](extensions.md#extension-functions)
   to create a paragraph element:

   ```kotlin
    fun Element.appendTextContainer(): Element {
        return document.createElement("p").also(::appendChild)
    }
   ```
   
   And call it inside the `main` function:
   ```kotlin
    fun main() {
        // Create a text container for our output.
        val output = document.body?.appendTextContainer()
   
        // Read the input value.
        document.body?.appendInput(onChange = { /* ... */ })
    }

   ```
   
5. Eliminate the whitespaces and count the letters:

    * Use the [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) function to remove the
      empty spaces in the name.
    * Use the scope function [`let`](scope-functions.md#let) to run the function within the object context.
    * Use a [string template](strings.md#string-templates) to insert your name length into the string by adding a dollar
      sign `$` and enclosing it in curly braces – `${it.length}`. `it` is the default name of a [lambda parameter](coding-conventions.md#lambda-parameters).

   ```kotlin
   fun main() {
        // Create a text container for our output.
        val output = document.body?.appendTextContainer()
   
        // Read the input value.
        document.body?.appendInput(onChange = { name ->
            name.replace(" ", "").let {
                output?.textContent = "Your name contains ${it.length} letters"
            }
        })
   }
   ```

6. Run the application.
7. Put your name, press <shortcut>Enter</shortcut> and enjoy the result:

   ![Application output](js-output-gutter-2.png){width=422}

As an extra exercise, let's count only the unique letters in your name:

1. In the `Main.kt` file, declare one more [extension function](extensions.md#extension-functions)
   `.countDistinctCharacters()` for `String`:

    * Convert the name to lowercase using the [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) function.
    * Convert the input string to a list of characters using the [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) function.
    * Select only the distinct characters in your name using the [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) function.
    * Count the distinct characters using the [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) function.

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

2. Use the `.countDistinctCharacters()` function to count the unique letters in your name:

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
        // Create a text container for our output.
        val output = document.body?.appendTextContainer()
   
        // Read the input value.
        document.body?.appendInput(onChange = { name ->
            name.replace(" ", "").let {
                // Print the number of unique letters.
                output?.textContent = "Your name contains ${it.countDistinctCharacters()} unique letters"
            }
        })
   }
   ```

3. Run the application.
4. Put your name, press <shortcut>Enter</shortcut> and see the result:

   ![Application output](js-output-gutter-3.png){width=422}

## Using Gradle

In this section, you'll learn how to manually create a Kotlin/JS application using [Gradle](https://gradle.org).
It's the default build system for Kotlin/JS and Kotlin Multiplatform projects, which is also commonly used in Java,
Android, and other ecosystems.

### Create project files

1. To get started, install a compatible version of [Gradle](https://gradle.org/install/). See the [compatibility table](gradle-configure-project.md#apply-the-plugin)
   to check the Kotlin Gradle plugin (KGP) compatibility with available Gradle versions.
2. Create an empty project directory. Inside it, create a `build.gradle(.kts)` file with the following content:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       js {
           browser() // for running in a browser
           // nodejs() // for running in Node.js
           binaries.executable()
       }
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   // build.gradle
   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       js {
           browser() // for running in a browser
           // nodejs() // for running in Node.js
           binaries.executable()
       }
   }
   ```

   </tab>
   </tabs>

   You can use different [execution environments](js-project-setup.md#execution-environments), such as `browser` or `nodejs`
   to define the environment for which you are compiling your code.
   The environment name is used to generate task names in the project.

3. Create an empty `settings.gradle(.kts)` file in the project directory.
4. Create a `src/jsMain/kotlin` directory and place a `hello.kt` file inside with the following content:

   ```kotlin
   fun main() {
       println("Hello, Kotlin/JS!")
   }
   ```
   
5. For the `browser` environment (for `nodjes` this step should be skipped), create also a `src/jsMain/resources/index.html` file with the following content,
   and replace the `<NAME_OF_YOUR_PROJECT_DIRECTORY>` placeholder with the name of your project directory:

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Application title</title>
   </head>
   <body>
       <script src="$NAME_OF_YOUR_PROJECT_DIRECTORY.js"></script>
   </body>
   </html>
    ```

By convention, all sources are located in the `src/<target name>[Main|Test]/kotlin` directories, where `Main` is for the
source code and `Test` is for tests. `<target name>` corresponds to the target platform (in this case, `js`),
as specified in the build file.

### Build and run the project

To run the project, execute the following command from the root project directory, run the build command:

```bash
gradle jsBrowserDevelopmentRun   # for browser
# gradle jsNodeDevelopmentRun # for Node.js
```

For `browser` environment, the browser opens the `index.html` file and prints "Hello, Kotlin/JS!" to the browser console (<shortcut>Ctrl + Shift + J</shortcut>/<shortcut>Cmd + Option + J</shortcut>).

![Application output](js-output-gutter-4.png){width=422}

If you are using `nodejs` environment, the terminal prints "Hello, Kotlin/JS!"

![Application output](js-output-gutter-5.png){width=422}

### Open the project in IDE

Now, you can open your project in any IDE that supports Gradle. If you use IntelliJ IDEA:

1. Select **File** | **Open**.
2. Select the project directory and click **Open**.
   IntelliJ IDEA automatically detects if it's a Kotlin/JS project.

If you encounter a problem with the project, IntelliJ IDEA displays the error message in the **Build** tab.

## What's next?

<!-- * Complete the [Create a multiplatform app targeting Web](native-app-with-c-and-libcurl.md) tutorial that explains how
  to share your Kotlin code with a JavaScript/TypeScript application.]: -->

* Learn how to [debug Kotlin/JS applications](js-debugging.md).
* Learn how to [write and run tests with Kotlin/JS](js-running-tests.md).
* Learn how to [write Gradle build scripts for real-life Kotlin/JS projects](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html).
* Read more about the Gradle build system in the [documentation](gradle.md).