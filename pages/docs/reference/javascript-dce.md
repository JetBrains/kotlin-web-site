---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript DCE"
---

# JavaScript DCE

Since version 1.1.4, Kotlin/JS includes a dead code elimination (DCE) tool.
This tool allows to strip out unused properties, functions and classes from the generated JS.
There are several ways you get unused declarations:

* Functions can be inlined and never get called directly (which happens always except for few situations).
* You are using a shared library which provides much more functions than you actually need.
  For example, standard library (`kotlin.js`) contains functions for manipulating lists, arrays, char sequences,
  adapters for DOM, etc, which together gives about 1.3 mb file. A simple "Hello, world" application only requires
  console routines, which is only few kilobytes for the entire file.

Dead code elimination is often also called 'tree shaking'.


## How to use

DCE tool is currently available from Gradle.

To activate DCE tool, add the following line to `build.gradle`:

``` groovy
apply plugin: 'kotlin-dce-js'
```

Note that if you are using multi-project build, you should apply plugin to the main project that is an entry point to your application.

By default, the resulting set of JavaScript files (your application together with all dependencies) 
can be found at path `$BUILD_DIR/min/`, where `$BUILD_DIR` is the path to generated JavaScript
(usually, `build/classes/main`).


### Configuring

To configure DCE on the main source set, you can use the `runDceKotlinJs` task 
(and corresponding `runDce<sourceSetName>KotlinJs` for other source sets).

Sometimes you are going to use a Kotlin declaration directly from JavaScript, and it's being stripped out by DCE. 
You may want to keep this declaration. To do so, you can use the following syntax in `build.gradle`:

``` groovy
runDceKotlinJs.keep "declarationToKeep"[, "declarationToKeep", ...]
```

Where `declarationToKeep` has the following syntax:

```
moduleName.dot.separated.package.name.declarationName
```

For example, consider a module is named `kotlin-js-example` and it contains a function named `toKeep` 
in package `org.jetbrains.kotlin.examples`. Use the following line:

``` groovy
runDceKotlinJs.keep "kotlin-js-example_main.org.jetbrains.kotlin.examples.toKeep"
```

Note that if your function has parameters, its name will be mangled, so the mangled name should be used in the keep directive.

### Development mode

Running DCE takes a bit of extra time each build, and the output size does not matter during development. You can improve development builds time by making the DCE tool skip actual dead code elimination with the `dceOptions.devMode` flag of the DCE tasks.

For example, to disable DCE based on a custom condition for the `main` source set and always for the `test` code, add the following lines to the build script:

```groovy
runDceKotlinJs.dceOptions.devMode = isDevMode
runDceTestKotlinJs.dceOptions.devMode = true 
```
# Example

A full example that shows how to integrate Kotlin with DCE and webpack to get a small bundle,
can be found [here](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/js-dce).


## Notes

* As for 1.1.x versions, DCE tool is an *experimental* feature.
 This does not mean we are going to remove it, or that it's unusable for production.
  This means that we can change names of configuration parameters, default settings, etc.
* Currently you should not use DCE tool if your project is a shared library.
  It's only applicable when you are developing an application (which may use shared libraries).
   The reason is: DCE does not know which parts of the library are going to be used by the user's application.
* DCE does not perform minification (uglification) of your code by removing unnecessary whitespaces and shortening identifiers.
  You should use existing tools, like UglifyJS (https://github.com/mishoo/UglifyJS2) 
  or Google Closure Compiler (https://developers.google.com/closure/compiler/) for this purpose.
