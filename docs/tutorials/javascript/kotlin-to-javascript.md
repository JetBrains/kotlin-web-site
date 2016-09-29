---
type: tutorial
layout: tutorial
title:  "Kotlin to JavaScript"
description: "A look at how Kotlin compiles to JavaScript and use cases"
authors: Hadi Hariri 
date: 29/09/2016
showAuthorInfo: false
---

## What it does

Kotlin provides the ability to target JavaScript. It does so by transpiling Kotlin to JavaScript. The current implementation targets ECMAScript 5.1 but there are plans to eventually
 target ECMAScript 6 also. 
 
Any Kotlin code that is part of the project as well as the standard library that ships with Kotlin is transpiled to JavaScript. 
However, this excludes any JVM or Java framework or library used.

The Kotlin compiler tries to comply with the following goals or principles:

* Provide output that is optimal in size
* Provide output that is readable JavaScript
* Provide interoperability with existing module systems
* Provide the same functionality in the standard library whether targeting JavaScript or the JVM[1]

## How can it be used

The following scenarios can be used when target JavaScript

* Creating Kotlin code that targets client-side JavaScript
    
    * **Interacting with DOM elements**. Kotlin provides a series of statically typed interfaces to interact with the Document Object Model, allowing creation and update of DOM elements. 
    
    * **Interacting with Graphics such as WebGL**. You can use Kotlin to create graphical elements on a web page using WebGL.

* Creating Kotlin code that targets server-side JavaScript

    * **Working with node.js or other server-side technology**. Kotlin is compatible with CommonJS, AMD and UMD, allowing for easy interaction with node.js.
    
* Using Kotlin as a wrapper for third-party libraries or frameworks

    * **Statically typed wrapper around common libraries such as jQuery or ReactJS**. We ship a series of statically-typed wrappers common libraries such as jQuery, but there are also
     third-party projects that do the same with frameworks such as AngularJS or ReactJS. Kotlin can use the [Definitely Typed TypeScript](http://definitelytyped.org/) type definitions repository.

## Kotlin to JavaScript in Action

When compiling (we'll use compiling interchangeably with transpiling) to JavaScript, Kotlin outputs two main files:

* kotlin.js. The runtime and standard library
* {application}.js. The actual code from the application. All files are compiled into a single JavaScript file which has the same name as the application.

In addition, each of these also have a corresponding {file}.meta.js meta file which will be used for reflection and other functionality. 


   
 
 




[1]: Within the possible bounds. In some cases certain functionality might not be available or semantically possible. 

   ![Kotlin New Project]({{ site.baseurl }}/{{ site.img_tutorial_root }}/create-library-js/created_artifact.png)

   
   [intellijdownload]: http://www.jetbrains.com/idea/download/index.html
[jetbrains]: http://www.jetbrains.com
[getting_started_command_line]: command-line.html
