---
type: tutorial
layout: tutorial
title:  "Getting Started with Kotlin and JavaScript with IntelliJ IDEA"
description: "A look at how to use IntelliJ IDEA to target JavaScript."
authors: Hadi Hariri 
date: 2016-09-30
showAuthorInfo: false
---

>__Warning__: this tutorial is outdated for Kotlin {{ site.data.releases.latest.version }}.
>We strongly recommend using Gradle for Kotlin/JS projects. For instructions on creating 
>Kotlin/JS projects with Gradle, see [Setting up a Kotlin/JS project](../setting-up.html)
{:.note}
>
In this tutorial we'll see how to

* [Create an application targeting JavaScript](#create-an-application-targeting-javascript)
* [Debug the application](#debugging-the-application)
* [Configure compiler options](#configuring-compiler-options)


## Create an application targeting JavaScript

When creating a new application or module that targets JavaScript, we need to select `Kotlin - JavaScript` as the target

 
 ![First Step of Wizard]({{ url_for('tutorial_img', filename='javascript/getting-started-idea/first-step-wizard.png')}})
 
The next step is going to prompt us on the Kotlin runtime library. By default the plugin selects the one that is associated to the currently installed
version. Unless we want to create a different one, we can click Finish at this point after
entering the project name and location.
 
![Selecting Runtime]({{ url_for('tutorial_img', filename='javascript/getting-started-idea/second-step-wizard.png')}})
 
Once the IDE has finished creating the new project, we should be left with the following layout
 
![Project Structure]({{ url_for('tutorial_img', filename='javascript/getting-started-idea/project-structure.png')}})

At this point we can start writing Kotlin code. For this sample, we're going to write some code that will print a string
out to the console window.

<div class="sample" markdown="1" theme="idea" data-target-platform="js">

```kotlin
fun main(args: Array<String>) {
    val message = "Hello JavaScript!"
    println(message)
}
```
</div>

We now need an HTML page to load the code, so we'll create a file called `index.html`. If you want more information on how Kotlin compiles to JavaScript and the output generated, check out the
[Kotlin to JavaScript](../kotlin-to-javascript/kotlin-to-javascript.html) tutorial. 

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```html 
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Console Output</title>
    </head>
    <body>

    <script type="text/javascript" src="out/production/sampleapp/lib/kotlin.js"></script>
    <script type="text/javascript" src="out/production/sampleapp/sampleapp.js"></script>
    </body>
</html>
```
</div>

A couple of important points:

* The `kotlin.js` file should be referenced first as it is used by our application
* The path refers to the default output location that IntelliJ IDEA uses when we compile the application. Below we'll see how to change this.

The only thing left to do is compile our application (Build|Build Project), and once the JavaScript files have been generated, we can open the `index.html` file in the browser and see the result
in the console debug window.

## Debugging the application

`This feature is only supported in the Ultimate edition.`

In order to debug the application using IntelliJ IDEA, we need to perform two steps:

1. Install the [JetBrains Chrome Extension](https://chrome.google.com/webstore/detail/jetbrains-ide-support/hmhgeddbohgjknpmjagkdomcpobmllji?hl=en) which allows debugging inside IntelliJ IDEA via Chrome. This is useful for any type
of web application developed with IntelliJ IDEA, not just Kotlin.

2. Configure the Kotlin Compiler to generate source maps, accessible via `Preferences|Kotlin Compiler`

![SourceMaps]({{ url_for('tutorial_img', filename='javascript/getting-started-idea/compiler-options-sourcemaps.png')}})

Once that's done, we simply right-click on our `index.html` file and select the Debug option. This launches Chrome and then stops at the breakpoint defined in our code inside IntelliJ IDEA, from where
we can evaluate expressions, step through code, etc.

![Debugger]({{ url_for('tutorial_img', filename='javascript/getting-started-idea/debugger.png')}})

It is also possible to debug Kotlin applications using the standard Chrome debugger. Just make sure that you do generate source maps.

## Configuring Compiler Options

Kotlin provides a series of compiler options that are accessible in IntelliJ IDEA also. In addition to the one we've just seen for
generating source maps, we also have the ability to set

* **Output file prefix**. We can prefix the output the compiler generates with additional JavaScript. In order to do so, we indicate the name of the file that contains the JavaScript we want in this box.
* **Output file postfix**. Same as above, but in this case the compiler will append the contents of the selected file to the output.
* **Copy runtime library files**. Indicates in what subfolder we want the `kotlin.js` library to be output to. By default it is `lib` which is why in the HTML we are referencing this path. 
* **Module Kind**. Indicates what module standard to follow. This is covered in the [Working with Modules](../working-with-modules/working-with-modules.html) tutorial in more depth.

## Summary

In this tutorial we've seen how to create a Kotlin application that targets JavaScript, debug it as well as set compiler options. In other tutorials we'll cover more in-depth topics such as interacting with the DOM, etc.






