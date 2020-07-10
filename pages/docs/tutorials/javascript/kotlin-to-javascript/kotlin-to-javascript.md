---
type: tutorial
layout: tutorial
title:  "Kotlin to JavaScript"
description: "A look at how Kotlin compiles to JavaScript and the use cases for that."
authors: Hadi Hariri 
showAuthorInfo: false
---

This tutorial explains how Kotlin code compiles to Javascript.
To learn more about how to create a Kotlin/JS project, see [Setting up a Kotlin/JS project](../setting-up.html).

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

This is the JS code generated for the Kotlin code above (the `main` function). Let's have a closer look at it.
* `if (typeof kotlin === 'undefined') { ... }` checks the existence of the `kotlin` object defined in `kotlin.js`. This object provides access to declarations from the Kotlin runtime and standard library.
* `var ConsoleOutput = function (_, Kotlin) { ... }`: this is the variable named after your Kotlin module. Its value is the result of an anonymous function call. The rest of the code is the function body.
* `var println = Kotlin.kotlin.io.println_s8jyv4$;`: a variable that refers to the `kotlin.io.println` function from the passed in parameter `Kotlin`. This is a way to import the standard `println` function defined in `kotlin.js`.
* `function main(args) { ... }`: your `main` function.
* `_.main_kand9s$ = main;` exports the declared `main` function. The name on the left-hand side will be used to access to the function from outside the module. The name contains a mangled word (`kand9s$`). 
This happens because you can have overloaded functions in Kotlin and need a way to translate them to their corresponding JavaScript ones.
To change the generated function name with a custom name, use the [`@JsName` annotation](/docs/reference/js-to-kotlin-interop.html#jsname-annotation).
* `main([]);`: a call of the `main` function.
* `(typeof ConsoleOutput === 'undefined' ? {} : ConsoleOutput, kotlin);` checks the existence of `ConsoleOutput`. If such a variable already exists in the scope, the new declarations will be added to it. 

Since the entire anonymous function is self-executing, it will execute as soon as the code is loaded. Its argument will be the object `kotlin` from `kotlin.js`.

If you declare your Kotlin code in a package, `main` would be followed by a package definition part. For example, this goes after the `main` declaration if you put your `main` function in the `org.example.hellojs` package:
 
<div class="sample" markdown="1" theme="idea" mode="js">
 
```javascript
  var package$org = _.org || (_.org = {});
  var package$example = package$org.example || (package$org.example = {});
  var package$hellojs = package$example.hellojs || (package$example.hellojs = {});
  package$hellojs.main_kand9s$ = main;
```
</div>

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

(Use the relative paths to the `*.js` files from the directory that contains the HTML page.)

Make sure that you load the `kotlin.js` runtime first, and then your application.

The output of this is a blank page that prints `Hello JavaScript!` to the console.

   ![Application Output]({{ url_for('tutorial_img', filename='javascript/kotlin-to-javascript/app-output.png')}})

## Summary

As you see, Kotlin aims to create very concise and readable JavaScript allowing us to interact with it as needed. One question of course is why go to 
all this trouble to as opposed to just use `console.log()`. Obviously this is a very simple example that shows the basics of how it works and we've focused on analysing the output. As application complexity grows, the benefits 
of using Kotlin and static typing start to become more apparent.

In subsequent tutorials we'll show how you can influence the files generated, for example, change location, prefix and suffixes, and how you can work with modules.
