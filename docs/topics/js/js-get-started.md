[//]: # (title: Get started with Kotlin/JS)

This tutorial shows how to create a web application for the browser using Kotlin/JavaScript (Kotlin/JS).
To create your app, choose the tool that best fits your workflow:

* **[IntelliJ IDEA](#create-your-application-in-intellij-idea)**: clone the project template from version control and work on it in IntelliJ IDEA.
* **[Gradle build system](#create-your-application-using-gradle)**: create build files for your project manually to better understand how the setup works under the hood.

Besides targeting the browser, with Kotlin/JS you can compile for other environments.
For more information, see [Execution environments](js-project-setup.md#execution-environments).

## Create your application in IntelliJ IDEA 

To create your Kotlin/JS web application, you can use either the
Community or Ultimate edition of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/?section=mac).

### Set up the environment

1. Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. [Set up your environment for Kotlin Multiplatform development](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html#set-up-the-environment).

### Create your project

1. In IntelliJ IDEA, select **File** | **New** | **Project from Version Control**.
2. Enter the URL of the [Kotlin/JS template project](https://github.com/Kotlin/kmp-js-wizard):

   ```text
   https://github.com/Kotlin/kmp-js-wizard
   ```   
   
3. Click **Clone**.

### Configure your project

1. Open the `kmp-js-wizard/gradle/libs.versions.toml` file. It contains the version catalog for project dependencies. 
2. Make sure the Kotlin version matches the Kotlin Multiplatform Gradle plugin 
   version, which is required to create a web application targeting Kotlin/JS.

   ```text
   [versions]
   kotlin = "%kotlinVersion%"
   
   [plugins]
   kotlin-multiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
   ```

3. Synchronize the Gradle files if you updated the `libs.versions.toml` file. Click the **Load Gradle Changes** icon that appears in your build file.

   ![Load the Gradle changes button](load-gradle-changes.png){width=300}

   Alternatively, click the refresh button in the Gradle tool window.

For more information about the Gradle configuration for multiplatform projects,
see the [Multiplatform Gradle DSL reference](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html).

### Build and run the application

1. Open the `src/jsMain/kotlin/Main.kt` file.

   * The `src/jsMain/kotlin/` directory contains the main Kotlin source files for the JavaScript target of your project.
   * The `Main.kt` file includes code that uses the [`kotlinx.browser`](https://github.com/Kotlin/kotlinx-browser) API to render "Hello, Kotlin/JS!" on the browser page.

2. Press the green icon in the `main()` function to run the code:

   ![Run the application](js-run-gutter.png){width=500}

The web application opens automatically in your browser.
Alternatively, you can open the following URL in your browser when the run is finished:

```text
   http://localhost:8080/
```

![Application output](js-output-gutter-1.png){width=600}

After you run the application for the first time, IntelliJ IDEA creates its corresponding run configuration 
(**jsMain [js]**) at the top bar:

![Gradle run configuration](js-run-config.png){width=500}

> In IntelliJ IDEA Ultimate,
> you can use the [JS Debugger](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)
> to debug code directly from the IDE.
> 
> {style="tip"}

### Enable continuous build

Gradle can automatically rebuild your project whenever you make changes:

1. Select **jsMain [js]** in the list of run configurations and click **More Actions** | **Edit**.

    ![Gradle edit run configuration](js-edit-run-config.png){width=500}

2. In the **Run/Debug Configurations**
   dialog, enter `jsBrowserDevelopmentRun --continuous` within the **Run** field.

    ![Continuous run configuration](js-continuous-run-config.png){width=500}

3. Click **OK**.

Now, when you run the application and make any changes,
Gradle automatically performs incremental builds for the project 
and hot-reloads the 
browser whenever you save (<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>) or change a class file. 

### Modify the application

Modify the application to add a feature that counts the number of letters in a word.

#### Add an input element

1. In the `src/jsMain/kotlin/Main.kt` file,
   add an [HTML input element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input)
   with an [extension function](extensions.md#extension-functions) to read user input:

   ```kotlin
   // Replace the Element.appendMessage() function
   fun Element.appendInput() {
       val input = document.createElement("input")
       appendChild(input)
   }
   ```

2. Call the `appendInput()` function in `main()`. It displays an input element on the page:

   ```kotlin
   fun main() {
       // Replace document.body!!.appendMessage(message)
       document.body?.appendInput()
   }
   ```

3. [Run the application again](#build-and-run-the-application).

    Your application looks like this:

   ![Application with an input element](js-added-input-element.png){width=600}

#### Add an input event handling

1. Add a listener inside the `appendInput()` function to read the input value and react to changes:

    ```kotlin
   // Replace the current appendInput() function
    fun Element.appendInput(onChange: (String) -> Unit = {}) {
        val input = document.createElement("input").apply {
            addEventListener("change") { event ->
                onChange(event.target.unsafeCast<HTMLInputElement>().value)
            }
        }
        appendChild(input)
    }
    ```

2. Follow the IDE's suggestions to import the `HTMLInputElement` dependency.

   ![Import dependencies](js-import-dependency.png){width=600}

3. Call the `onChange` callback in `main()`. It reads and handles the input value.

    ```kotlin
    fun main() {
        // Replace document.body?.appendInput()
        document.body?.appendInput(onChange = { println(it) })
    }
   ```

#### Add an output element

1. Add a text element to display the output by defining an [extension function](extensions.md#extension-functions)
   that creates a paragraph:

   ```kotlin
    fun Element.appendTextContainer(): Element {
        return document.createElement("p").also(::appendChild)
    }
   ```
   
2. Call the `appendTextContainer()` function in `main()`. It creates the output element:

   ```kotlin
    fun main() {
        // Creates a text container for our output
        // Replace val message = Message(topic = "Kotlin/JS", content = "Hello!")
        val output = document.body?.appendTextContainer()
   
        // Reads the input value
        document.body?.appendInput(onChange = { println(it) })
    }
   ```
   
#### Process the input to count the letters

Process the input by removing whitespace and displaying the output with the number of letters.

Add the following code to the `appendInput()` function within the `main()` function:

```kotlin
fun main() {
    // Creates a text container for our output
    val output = document.body?.appendTextContainer()

    // Reads the input value
    // Replace the current appendInput() function
    document.body?.appendInput(onChange = { name ->
        name.replace(" ", "").let {
            output?.textContent = "Your name contains ${it.length} letters"
        }
    })
}
```

From the code above:

* The [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) function removes the empty spaces in the name.
* The [`let{}`](scope-functions.md#let) scope function runs the function within the object context.
* The [string template](strings.md#string-templates) (`${it.length}`)
  inserts the word's length into the string by prefixing it with 
  a dollar sign (`$`) and enclosing it in curly braces (`{}`).
  Whereas `it` is the default name of a [lambda parameter](coding-conventions.md#lambda-parameters).

#### Run the application

1. [Run the application](#build-and-run-the-application).
2. Enter your name.
3. Press <shortcut>Enter</shortcut>. 

You can see the result:

![Application output](js-output-gutter-2.png){width=600}

#### Process the input to count unique letters

As an additional exercise, let's process the input to calculate and display the number of unique letters in the word:

1. In the `src/jsMain/kotlin/Main.kt` file, add the `.countDistinctCharacters()` [extension function](extensions.md#extension-functions)
   for `String`:

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

   From the code above:

   * The [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) function converts the name to lowercase.
   * The [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) function converts the input string to a list of characters.
   * The [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) function selects only the distinct characters from the word.
   * The [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) function counts the distinct characters.

2. Call the `.countDistinctCharacters()` function in `main()`. It counts the unique letters in your name:

   ```kotlin
    fun main() {
        // Creates a text container for our output
        val output = document.body?.appendTextContainer()
   
        // Reads the input value
        document.body?.appendInput(onChange = { name ->
            name.replace(" ", "").let {
                // Prints the number of unique letters
                // Replace output?.textContent = "Your name contains ${it.length} letters"
                output?.textContent = "Your name contains ${it.countDistinctCharacters()} unique letters"
            }
        })
   }
   ```

3. Follow the steps to [run the application and enter your name](#run-the-application).

You can see the result:

![Application output](js-output-gutter-3.png){width=600}

## Create your application using Gradle

In this section, you can learn how to manually create a Kotlin/JS application using [Gradle](https://gradle.org).

Gradle is the default build system for Kotlin/JS and Kotlin Multiplatform projects.
It is also commonly used in Java,
Android, and other ecosystems.

### Create project files

1. Make sure you use a Gradle version that is compatible with the Kotlin Gradle plugin (KGP). 
   See the [compatibility table](gradle-configure-project.md#apply-the-plugin) for more details.
2. Create an empty directory for your project using your file explorer, the command line, or any tool you prefer. 
3. Inside the project directory, create a `build.gradle.kts` file with the following content:

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
           // Use browser() for running in a browser or nodejs() for running in Node.js
           browser() 
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
           // Use browser() for running in a browser or nodejs() for running in Node.js
           browser() 
           binaries.executable()
       }
   }
   ```

   </tab>
   </tabs>

   > You can use different [execution environments](js-project-setup.md#execution-environments),
   > such as `browser()` or `nodejs()`. 
   > Each environment defines where your code runs and determines how Gradle generates task names in the project.
   >
   > {style="note"}

4. Within the project directory, create an empty `settings.gradle.kts` file.
5. Within the project directory, create a `src/jsMain/kotlin` directory.
6. Inside the `src/jsMain/kotlin` directory, add a `hello.kt` file with the following content:

   ```kotlin
   fun main() {
       println("Hello, Kotlin/JS!")
   }
   ```

   By convention, all sources are located in the `src/<target name>[Main|Test]/kotlin` directory: 
   * `Main` is the location for the source code.
   * `Test` is the location for tests. 
   * `<target name>` corresponds to the target platform (`js` in this case).

**For the `browser` environment**

> Follow the next steps if you are working with the `browser` environment. 
> If you are working with the `nodejs` environment,
> go to the [Build and run the project](#build-and-run-the-project) section.
> 
> {style="note"}

1. Within the project directory, create a `src/jsMain/resources` directory.
2. Inside the `src/jsMain/resources` directory, create an `index.html` file with the following content:

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

3. Replace the `<$NAME_OF_YOUR_PROJECT_DIRECTORY>` placeholder with the name of your project directory.

### Build and run the project

To build the project, run the following command from the root project directory:

```bash
# For browser
gradle jsBrowserDevelopmentRun

# OR

# For Node.js
gradle jsNodeDevelopmentRun 
```

If you are using the `browser` environment, 
you can see that the browser opens the `index.html` file and prints `"Hello, Kotlin/JS!"` to the browser console.
You can open the console using the <shortcut>Ctrl + Shift + J</shortcut>/<shortcut>Cmd + Option + J</shortcut> commands.

![Application output](js-output-gutter-4.png){width=600}

If you are using the `nodejs` environment, you can see that the terminal prints `"Hello, Kotlin/JS!"`.

![Application output](js-output-gutter-5.png){width=500}

### Open the project in an IDE

You can open your project in any IDE that supports Gradle. 

If you use IntelliJ IDEA:

1. Select **File** | **Open**.
2. Find the project directory.
3. Click **Open**.

IntelliJ IDEA automatically detects if it's a Kotlin/JS project.
If you encounter a problem with the project, 
IntelliJ IDEA displays the error message in the **Build** pane.

## What's next?

<!-- * Complete the [Create a multiplatform app targeting Web](native-app-with-c-and-libcurl.md) tutorial that explains how
  to share your Kotlin code with a JavaScript/TypeScript application.]: -->

* [Set up your Kotlin/JS project](js-project-setup.md).
* Learn how to [debug Kotlin/JS applications](js-debugging.md).
* Learn how to [write and run tests with Kotlin/JS](js-running-tests.md).
* Learn how to [write Gradle build scripts for real-life Kotlin/JS projects](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html).
* Read more about the [Gradle build system](gradle.md).