---
type: tutorial
layout: tutorial
title:  "Kotlin to JavaScript"
description: "A look at how Kotlin compiles to JavaScript and the use cases for that."
authors: Hadi Hariri 
showAuthorInfo: false
---

There are multiple ways to compile Kotlin to JavaScript.
The recommended approach is to use Gradle; if desired, you can also build JavaScript projects directly from
IntelliJ IDEA, use Maven, or compile the code manually from the command line.
To learn more about how to compile to JavaScript please see the corresponding tutorials:
 
* [Getting Started with Gradle](../getting-started-gradle/getting-started-with-gradle.html)
* [Getting Started with IntelliJ IDEA](../getting-started-idea/getting-started-with-intellij-idea.html)
* [Getting Started with Maven](../getting-started-maven/getting-started-with-maven.html)
* [Getting Started with the Command Line](../getting-started-command-line/command-line-library-js.html)


## Examining the compilation output

When compiling (we'll use this term interchangeably with [transpiling](https://en.wiktionary.org/wiki/transpile)) to JavaScript, Kotlin outputs two main files:

* `kotlin.js`. The runtime and standard library. This doesn't change between applications. It's tied to the version of Kotlin being used.
* `{module}.js`. The actual code from the application. All files are compiled into a single JavaScript file which has the same name as the module.

In addition, each of these also have a corresponding `{file}.meta.js` meta file which will be used for reflection and other functionality. 

Taking the above into account, given the following code (module name is `ConsoleOutput`)

<div class="sample" markdown="1" data-target-platform="js" theme="idea">

```kotlin
fun main(args: Array<String>) {
    println("Hello JavaScript!")
}
```
</div>

Kotlin compiler would generate the following output

   ![Compiler Output]({{ url_for('tutorial_img', filename='javascript/kotlin-to-javascript/compiler-output.png')}})
   
Note: the `lib` directory which contains `kotlin.js` and other library files is only created in IntelliJ IDEA-based projects and is controlled by the *Copy library runtime files* flag in the Kotlin [facet settings](https://www.jetbrains.com/help/idea/facets.html). In a Maven or Gradle build (including multiplatform projects), no library files are copied by default to the compilation output directory. See the corresponding tutorials for the instructions on how to achieve the same with those build systems.

The file we're mostly interested in is `ConsoleOutput.js`

<div class="sample" markdown="1" theme="idea" mode="js">

```javascript
if (typeof kotlin === 'undefined') {
  throw new Error("Error loading module 'ConsoleOutput'. Its dependency 'kotlin' was not found. /* ... */");
}
var ConsoleOutput = function (_, Kotlin) {
  'use strict';
  var println = Kotlin.kotlin.io.println_s8jyv4$;
  function main(args) {
    println('Hello JavaScript!');
  }
  _.main_kand9s$ = main;
  main([]);
  Kotlin.defineModule('ConsoleOutput', _);
  return _;
}(typeof ConsoleOutput === 'undefined' ? {} : ConsoleOutput, kotlin);
```
</div>

This is the JS code generated for the Kotlin code above (the `main` function). You can see that it declares a function and assigns it to a variable named `ConsoleOutput`, which is the module name. 

Next, it defines the variable `println` that refers to the `kotlin.io.println` function from the passed in parameter `Kotlin`. 

Then goes the `main` function. If you declared the code in a package, `main` would be followed by a package definition part. For example, this is generated if you put the `main` function in the `org.example.hellojs` package:
 
 <div class="sample" markdown="1" theme="idea" mode="js">
 
 ```javascript
  var package$org = _.org || (_.org = {});
  var package$example = package$org.example || (package$org.example = {});
  var package$hellojs = package$example.hellojs || (package$example.hellojs = {});
```
</div>

The compiler is suffixing `main` with a mangled word (`kand9s$`). This happens due to the possibility to have overloaded functions in `Kotlin` and there needs to be a way to
translate these to their corresponding JavaScript ones. To define a custom function name in the generated JS code, use the [`@JsName` annotation](/docs/reference/js-to-kotlin-interop.html#jsname-annotation). 

Finally, the code defines the module with the `defineModule` function. 

Given this is a self-executing-function, as soon as the code is loaded, it will execute, taking in as parameter the object `kotlin` which is defined in `kotlin.js` and provides access to all the functions used.


#### Running the code

The purpose of this code is to write out some text in the console. In order to use this from the browser, load it, preferably from inside an HTML page:

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Console Output</title>
    </head>
    <body>

    <script type="text/javascript" src="out/production/ConsoleOutput/lib/kotlin.js"></script>
    <script type="text/javascript" src="out/production/ConsoleOutput/ConsoleOutput.js"></script>
    </body>
</html>
```
</div>

(Use the relative paths to the `*.js` files from the directory that contains the HTML page)

Make sure that you load the `kotlin.js` runtime first and then your application.

The output of this is a blank page that prints `Hello JavaScript` to the console.

   ![Application Output]({{ url_for('tutorial_img', filename='javascript/kotlin-to-javascript/app-output.png')}})

## Summary

As you see, Kotlin aims to create very concise and readable JavaScript allowing us to interact with it as needed. One question of course is why go to 
all this trouble to as opposed to just use `console.log()`. Obviously this is a very simple example that shows the basics of how it works and we've focused on analysing the output. As application complexity grows, the benefits 
of using Kotlin and static typing start to become more apparent.

In subsequent tutorials we'll show how you can influence the files generated, for example, change location, prefix and suffixes, and how you can work with modules.
