---
type: tutorial
layout: tutorial
title:  "Running Kotlin/JS"
description: "How to run a Kotlin/JS program that was created using the Gradle plugin."
authors: Sebastian Aigner
date: 2020-02-23
showAuthorInfo: false

---

Since Kotlin/JS projects are managed with the Kotlin/JS Gradle plugin, we will see how to run our project using the appropriate tasks. If we're starting with a blank project, let's ensure that we have some sample code to execute. We create the file `src/main/kotlin/App.kt` and fill it with a small "Hello, World"-type code snippet:

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

Depending on the platform we are targeting, some platform-specific extra setup might be required to run our code for the first time.

## Running the Node.js target

When targeting Node.js with Kotlin/JS, we can simply execute the `run` Gradle task. This can be done for example via the command line, using the Gradle wrapper:

```./gradlew run```

If we are using IntelliJ IDEA as our development environment, we can find the `run` action in the Gradle tool window:

![Gradle Run task in IntelliJ IDEA]({{ url_for('tutorial_img', filename='javascript/running-kotlin-js/run-gradle-task.png')}})

On first start, the `kotlin.js` Gradle plugin will download all required dependencies to get us up and running. After the build is completed, the program is executed, and we can see any logging output in the terminal:

![Executing a Kotlin JS program in IntelliJ IDEA]({{ url_for('tutorial_img', filename='javascript/running-kotlin-js/cli-output.png')}})

## Running the browser target

When targeting the browser, our project is required to have an HTML page. This page will be served by the development server while we are working on our application, and should embed our compiled Kotlin/JS file. Create and fill an HTML file `/src/main/resources/index.html`:

<div class="sample" markdown="1" theme="idea" mode="xml">
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
</div>

By default, the name of our project's generated artifact (which is created through webpack) that needs to be referenced is our project name (in this case, `jsTutorial`). If you've named your project `followAlong`, make sure to embed `followAlong.js` instead of `jsTutorial.js`

After making these adjustments, we can start the integrated development server. We can do this from the command line via the Gradle wrapper:

```./gradlew run```

When working from IntelliJ IDEA, we can find the `run` action in the Gradle tool window.

After the project has been built, the embedded `webpack-dev-server` will start running, and will open a (seemingly empty) browser window pointing to the HTML file we specified previously. To validate that our program is running correctly, we can open the developer tools of our browser (for example by right-clicking and choosing the _Inspect_ action). Inside the developer tools, we can navigate to the console, where we can see the results of our executed JavaScript code:

![Console output in browser developer tools]({{ url_for('tutorial_img', filename='javascript/running-kotlin-js/browser-console-output.png')}})

With this setup, we can recompile our project after each code change to see our changes. Kotlin/JS also supports a more convenient way of automatically rebuilding our application while we are developing it. To find out how to set up this _continuous mode_, check out the [corresponding tutorial](/docs/tutorials/javascript/dev-server-continuous-compilation.html).