[//]: # (title: Get started with Kotlin/Wasm in IntelliJ IDEA)

> Kotlin/Wasm is an [Experimental](components-stability.md) feature. It may be dropped or changed at any time. It is available only starting with [Kotlin 1.8.20](releases.md).
>
{type="warning"}

This tutorial demonstrates how to use IntelliJ IDEA for creating a Kotlin/Wasm application.

To get started, install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html). The tutorial is applicable to both IntelliJ IDEA Community Edition and the Ultimate Edition.

## Enable an experimental Kotlin/Wasm Wizard in IntelliJ IDEA

1. Press double **Shift** to open a search, enter **Registry**.

   ![Open registry in IntelliJ IDEA](wasm-enable-in-idea.png){width=700}

2. Select **Registry** from the list. Registry window opens.
3. Find the `kotlin.wasm.wizard` registry key in the list, and enable it.

   ![Enable Kotlin/Wasm Wizard](wasm-enable-wizard.png){width=700}

4. Restart IntelliJ IDEA.

## Create a new Kotlin/Wasm project

1. In IntelliJ IDEA, select **File** | **New** | **Project**.
2. In the panel on the left, select **Kotlin Multiplatform**.
3. Enter a project name, select **Browser Application with Kotlin/Wasm** as the project template, and click **Next**.

   ![Create a Kotlin/Wasm application](wasm-new-project-intellij.png){width=700}

   By default, your project will use Gradle with Kotlin DSL as the build system.

4. Accept the default configuration on the next screen and click **Finish**. Your project will open.

   By default, the wizard creates the necessary `Simple.kt` file.

5. Open the `build.gradle.kts` file and ensure that the Kotlin Multiplatform plugin version is set to `1.8.20`: 

   ```kotlin
   plugins {
       kotlin("multiplatform") version "1.8.20"
   }
   ```

## Build and run the application

1. Click **Build Project** next to the run configuration at the top of the screen:

   ![Build the application](wasm-build-app.png){width=600}

2. Run the application by clicking **Run** next to the run configuration at the top of the screen.

3. Once the application starts, open the following URL in your browser:

   ```text
   http://localhost:8080
   ```

   You should see the "JS Client" tab in your browser:

   ![Empty Kotlin/Wasm application in browser](wasm-browser-app.png){width=500}

   If you open a page source, you'll find the name of the JavaScript bundle:

   ![Source of Kotlin/Wasm application in browser](wasm-browser-source-app.png){width=500}

### Troubleshooting

Despite the fact that most of the browsers support WebAssembly, you need to update the settings in your browser.

To run a Kotlin/Wasm project, you need to update the settings of the target environment:

<tabs>
<tab title="Chrome">

* For version 109:

  Run the application with the `--js-flags=--experimental-wasm-gc` command line argument.

* For version 110 or later:

   1. Go to `chrome://flags/#enable-webassembly-garbage-collection` in your browser.
   2. Enable **WebAssembly Garbage Collection**.
   3. Relaunch your browser.

</tab>
<tab title="Firefox">

For version 109 or later:

1. Go to `about:config` in your browser.
2. Enable `javascript.options.wasm_function_references` and `javascript.options.wasm_gc` options.
3. Relaunch your browser.

</tab>
<tab title="Edge">

For version 109 or later:

Run the application with the `--js-flags=--experimental-wasm-gc` command line argument.

</tab>
</tabs>


## Update your application

1. Open `Simple.kt` and update the code:

   ```kotlin
   import kotlinx.browser.document
   import kotlinx.dom.appendText
   
   fun main() {
       println("Hello, ${greet()}")
       document.body!!.appendText("Hello, you're using Kotlin/Wasm!")
   }
   
   fun greet() = "world"
   ```

2. Run the application by clicking **Run** next to the run configuration at the top of the screen.

3. Once the application starts, open the following URL in your browser:

```text
http://localhost:8080
```

You'll see the text "Hello, you're using Kotlin/Wasm!":

![Kotlin/Wasm application in browser](wasm-browser-updated-app.png){width=500}

## What's next?

[Explore the Kotlin/Wasm interoperability with JavaScript](wasm-js-interop.md)