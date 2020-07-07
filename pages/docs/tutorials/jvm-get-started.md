---
type: tutorial
layout: tutorial
title:  "Getting Started with IntelliJ IDEA"
description: "This tutorial demonstrates how to use IntelliJ IDEA for creating a console application. "
authors: Kate Volodko
date: 2020-07-07
showAuthorInfo: false
---

To get started, install a recent version of IntelliJ IDEA. You can download the free [Community Edition][intellijdownload] 
(or full-fledged [Ultimate Edition][intellijdownload]) from the [JetBrains website][jetbrains].

## Create an application 

Once you've installed IntelliJ IDEA, it's time to create your first Kotlin application.

1. Create a new console application by clicking [this link](jetbrains://idea/kotlin-wizard/create-project?template=ConsoleApplication).  
Alternatively, you can select **File** \| **New** \| **Project**, and then select the **Kotlin** with the project template **Console Application**.

   ![Kotlin console application]({{ url_for('tutorial_img', filename='getting-started/new-console-app-1.png') }})

2. Specify a project name, for example, *Hello*, and click **Next**.  
   By default, your project will use the build system Gradle with Kotlin DSL.

3. Accept the default configuration on the next screen and click **Finish**.
  
   ![Kotlin console application configuration]({{ url_for('tutorial_img', filename='getting-started/new-console-app-2.png') }}) 

   Your project opens. By default, you see the file `build.gradle.kts`, which is the build script created by the Project 
   Wizard based on your configuration. It includes Kotlin plugins and dependencies required for your console application.

3. Open the file `main.kt` in **src** \| **main** \| **kotlin**.  
   The **src** directory contains Kotlin source files and resources. The file `main.kt` includes sample code that prints out 
   `Hello World!`.

   ![main.kt with main fun]({{ url_for('tutorial_img', filename='getting-started/main-kt-initial.png') }})

4. Change the code to request your name and say `Hello` to you specifically, not to the whole world.  
   
   * Introduce a local variable `name` with the keyword `val`. Its value will be an input for your name - `readLine()`.
   * Use this variable right in text output by adding `$` to the variable name - `$name`.
   
   <div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>
   
   ```kotlin
   fun main() {
       println("What's your name?")
       val name= readLine()
       println("Hello $name!")
   }
   ```
   
   </div>

   <img class="img-responsive" src="{{ url_for('tutorial_img', filename='getting-started/main-kt-updated.png') }}" alt="Updated main fun" width="400"/>

## Run the application

Now the application is ready to run. The easiest way is to click the green __Run__ icon in the gutter and select __Run 'MainKt'__.

<img class="img-responsive" src="{{ url_for('tutorial_img', filename='getting-started/run-app.png') }}" alt="Running a console app" width="400"/>

You see the result in the **Run** tool window.

![Kotlin run output]({{ url_for('tutorial_img', filename='getting-started/output-1.png') }})
   
Enter your name and accept greetings from your application! 

![Kotlin run output]({{ url_for('tutorial_img', filename='getting-started/output-2.png') }})

Congratulations! You now have your first Kotlin application running.

Once you’ve created the application, you can dive deeper into Kotlin syntax:

*   Add sample code from [Kotlin examples](https://play.kotlinlang.org/byExample/overview) 
*   Install the [EduTools plugin](https://plugins.jetbrains.com/plugin/10081-edutools) for IDEA and complete exercises 
from the [Kotlin Koans course](https://www.jetbrains.com/help/education/learner-start-guide.html?section=Kotlin%20Koans)

[intellijdownload]: http://www.jetbrains.com/idea/download/index.html
[jetbrains]: http://www.jetbrains.com
[getting_started_command_line]: command-line.html
