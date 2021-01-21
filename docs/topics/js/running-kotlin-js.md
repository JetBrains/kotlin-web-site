[//]: # (title: Run Kotlin/JS)

Since Kotlin/JS projects are managed with the Kotlin/JS Gradle plugin, you can run your project using the
appropriate tasks. If you're starting with a blank project, ensure that you have some sample code to execute.
Create the file `src/main/kotlin/App.kt` and fill it with a small "Hello, World"-type code snippet:

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

Depending on the target platform, some platform-specific extra setup might be required to run your code for the first time.

## Run the Node.js target

When targeting Node.js with Kotlin/JS, you can simply execute the `run` Gradle task. This can be done for example via the
command line, using the Gradle wrapper:

```bash
./gradlew run
```

If you're using IntelliJ IDEA, you can find the `run` action in the Gradle tool window:

![Gradle Run task in IntelliJ IDEA](run-gradle-task.png)

On first start, the `kotlin.js` Gradle plugin will download all required dependencies to get you up and running.
After the build is completed, the program is executed, and you can see the logging output in the terminal:

![Executing a Kotlin JS program in IntelliJ IDEA](cli-output.png)

## Run the browser target

When targeting the browser, your project is required to have an HTML page. This page will be served by the development
server while you are working on your application, and should embed your compiled Kotlin/JS file.
Create and fill an HTML file `/src/main/resources/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello, Kotlin/JS!</title>
</head>
<body>

</body>
<script src="jsTutorial.js"></script>
</html>
```

By default, the name of your project's generated artifact (which is created through webpack) that needs to be referenced
is your project name (in this case, `jsTutorial`). If you've named your project `followAlong`, make sure to embed
`followAlong.js` instead of `jsTutorial.js`

After making these adjustments, start the integrated development server. You can do this from the command line via the
Gradle wrapper:

```bash
./gradlew run
```

When working from IntelliJ IDEA, you can find the `run` action in the Gradle tool window.

After the project has been built, the embedded `webpack-dev-server` will start running, and will open a (seemingly empty)
browser window pointing to the HTML file you specified previously. To validate that your program is running correctly,
open the developer tools of your browser (for example by right-clicking and choosing the _Inspect_ action).
Inside the developer tools, navigate to the console, where you can see the results of the executed JavaScript code:

![Console output in browser developer tools](browser-console-output.png)

With this setup, you can recompile your project after each code change to see your changes. Kotlin/JS also supports
a more convenient way of automatically rebuilding the application while you are developing it.
To find out how to set up this _continuous mode_, check out the [corresponding tutorial](dev-server-continuous-compilation.md).