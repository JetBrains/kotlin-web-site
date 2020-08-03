---
type: tutorial
layout: tutorial
title:  "Get started with Kotlin/JS for React"
description: "This tutorial demonstrates how to use IntelliJ IDEA for creating a frontend application with Kotlin/JS for React."
authors: Sebastian Aigner, Kate Volodko
date: 2020-07-07
showAuthorInfo: false
---

To get started, install the latest version of [IntelliJ IDEA](http://www.jetbrains.com/idea/download/index.html).

## Create an application 

Once you've installed IntelliJ IDEA, it's time to create your first frontend application based on Kotlin/JS with React.

1. In IntelliJ IDEA, select **File** \| **New** \| **Project**.
2. In the panel on the left, select **Kotlin**.
3. Enter a project name, select **Frontend Application** as the project template, and click **Next**.
   
    ![Create a frontend application]({{ url_for('tutorial_img', filename='javascript/setting-up/js-new-project-1.png') }})
    
    By default, your project will use Gradle with Kotlin DSL as the build system.

3. Accept the default configuration on the next screen and click **Finish**.
  
    ![Configure a frontend application]({{ url_for('tutorial_img', filename='javascript/setting-up/js-new-project-2.png') }}) 
    
Your project opens. By default, you see the file `build.gradle.kts`, which is the build script created by the Project 
Wizard based on your configuration. It includes the [`kotlin("js")` plugin and dependencies](https://kotlinlang.org/docs/reference/js-project-setup.html) 
required for your frontend application.

## Run the application

Start the application by clicking **Run** next to the run configuration at the top of the screen.

<img class="img-responsive" src="{{ url_for('tutorial_img', filename='javascript/setting-up/js-run-app.png') }}" alt="Running a frontend app" width="500"/>

Your default web browser opens the URL [http://localhost:8080/](http://localhost:8080/) with your frontend application.

<img class="img-responsive" src="{{ url_for('tutorial_img', filename='javascript/setting-up/js-output-1.png') }}" alt="Web browser with JS application"/>

Enter your name in the text box and accept the greetings from your application!

## Update the application

### Show your name backwards

1. Open the file `welcome.kt` in `src/main/kotlin`.  
    The `src` directory contains Kotlin source files and resources. The file `welcome.kt` includes sample code that renders 
    the web page you've just seen.
    
    ![Source code for frontend application]({{ url_for('tutorial_img', filename='javascript/setting-up/js-welcome-kt.png') }})

2. Change the code of `styledDiv` to show your name backwards.  
   
   * Use the standard library function `reversed()` to reverse your name.
   * Use a [string template](https://kotlinlang.org/docs/reference/basic-types.html#string-templates) for your reversed 
   name by adding a dollar sign `$` and enclosing it in curly braces – `${state.name.reversed()}`.
   
   <div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>
   
   ```kotlin
   styledDiv {
       css {
           +WelcomeStyles.textContainer
       }
       +"Hello ${state.name}!"
       +" Your name backwards is ${state.name.reversed()}!"
   }
   ```
   
   </div>

3. Save your changes to the file.

4. Go to the browser and enjoy the result.  
    You will see the changes only if your previous application is still running. If you've stopped your application, [run it again](#run-the-application).
   
<img class="img-responsive" src="{{ url_for('tutorial_img', filename='javascript/setting-up/js-output-2.png') }}" alt="Web browser with a reversed name" />

### Add an image

1. Open the file `welcome.kt` in `src/main/kotlin`.  

2. Add a `div` container with a child image element `img` after the `styledInput` block.  
   
   > Make sure that you import the `react.dom.*` and `styled.*` packages.
   {:.note}       
   
   <div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>
   
   ```kotlin
   div {
       img(src = "https://placekitten.com/408/287") {}
   }
   ```
   
   </div>

3. Save your changes to the file.

4. Go to the browser and enjoy the result.  
    You will only see the changes if your previous application is still running. If you've stopped your application, [run it again](#run-the-application).
   
<img class="img-responsive" src="{{ url_for('tutorial_img', filename='javascript/setting-up/js-output-3.png') }}" alt="Web page with with an image" width="500"/>

### Add a button that changes text

1. Open the file `welcome.kt` in `src/main/kotlin`.  

2. Add a `button` element with an `onClickFunction` event handler.  
   
   > Make sure that you import the package `kotlinx.html.js.*`.
   {:.note}       
   
   <div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>
   
   ```kotlin
   button {
       attrs.onClickFunction = {
           setState(
               WelcomeState(name = "Some name")
           )
       }
       +"Change name"
   }   
   ```
   
   </div>
   
3. Save your changes to the file.

4. Go to the browser and enjoy the result.  
    You will only see the changes if your previous application is still running. If you've stopped your application, [run it again](#run-the-application).
   
<img class="img-responsive" src="{{ url_for('tutorial_img', filename='javascript/setting-up/js-output-4.png') }}" alt="Web page with a button" width="500"/>

## What's next?

Once you have created your first application, you can go to Kotlin hands-on labs and complete long-form tutorials on Kotlin/JS.
They include sample projects, which can serve as nice jumping-off points for your own projects, and contain useful snippets and patterns.

For Kotlin/JS, the following hands-on labs are currently available:

* [Building Web Applications with React and Kotlin/JS](https://play.kotlinlang.org/hands-on/Building%20Web%20Applications%20with%20React%20and%20Kotlin%20JS/01_Introduction) 
guides you through the process of building a simple web application using the React framework, shows how a type-safe Kotlin 
DSL for HTML makes it easy to build reactive DOM elements, and illustrates how to use third-party React components, 
and how to obtain information from APIs, while writing the whole application logic in pure Kotlin/JS.

* [Building a Full Stack Web App with Kotlin Multiplatform](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction) 
teaches the concepts behind building an application that targets Kotlin/JVM and Kotlin/JS by building a client-server 
application that makes use of shared code, serialization, and other multiplatform paradigms. It also provides a brief
introduction to working with Ktor both as a server- and client-side framework.