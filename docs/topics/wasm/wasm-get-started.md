[//]: # (title: Get started with Kotlin/Wasm in IntelliJ IDEA)

> Kotlin/Wasm is an [Alpha](components-stability.md) feature. It may be dropped or changed at any time. It is available only starting with [Kotlin 1.8.20](releases.md).
>
{type="note"}

This tutorial demonstrates how to work with a Kotlin/Wasm application in IntelliJ IDEA.

## Before you start

1. Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. Clone the [Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples/tree/main) repository 
  by selecting **File** | **New** | **Project from Version Control** in IntelliJ IDEA.

   You can also clone it from the command line:

   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-examples.git
   ```

## Run the application

1. Open the **Gradle** tool window by selecting **View** | **Tool Windows** | **Gradle**.
2. In the **kotlin-wasm-browser-example** | **Tasks** | **kotlin browser**, select and run the **wasmJsBrowserRun** task.

   ![Run the Gradle task](wasm-gradle-task-window.png){width=650}

    Alternatively, you can run the following command in the terminal from the project directory:

   ```bash
   ./gradlew wasmJsBrowserRun -t
   ```

3. Once the application starts, open the following URL in your browser:

   ```bash
   http://localhost:8080/
   ```

   You should see "Hello, World!" text:

   ![Run the Kotlin/Wasm application](wasm-app-run.png){width=650}

## Update your application

1. Open `Simple.kt` and update the code:

   ```kotlin
   import kotlinx.browser.document
   import kotlinx.browser.window
   import kotlinx.dom.appendElement
   import kotlinx.dom.appendText
   
   fun main() {
       document.body?.appendText("Hello, ${greet()}!")
   
       document.body?.appendElement("button") {
           this.textContent = "Click me, I'm a button!"
           addEventListener("click") {
               window.setTimeout({
                   window.alert("👋")
                   null
               }, 1000)
           }
       }
   }
   
   fun greet() = "world"
   ```

   This code adds a button to the document and an action.

2. Run the application again. Once the application starts, open the following URL in your browser:

   ```text
   http://localhost:8080
   ```

   You should see the "Hello, World" text within the button:

   ![Run Kotlin/Wasm application in browser](wasm-updated-app-run.png){width=650}

3. Click the button to see the alert message:

   ![Alert action](wasm-button-click.png){width=650}

Now you can work with Kotlin/Wasm code that runs in the browser!

## What's next?

Try out other Kotlin/Wasm examples from the `kotlin-wasm-examples` repository:

* [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
* [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
* [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
* [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)