---
type: tutorial
layout: tutorial
title: "Working with the Command Line Compiler"
description: "This tutorial walks us through creating a Hello World application using the command line compiler."
authors: Hadi Hariri
showAuthorInfo: false
related:
    - getting-started.md
---
### Downloading the compiler

Every release ships with a standalone version of the compiler. We can download it from [GitHub Releases]({{ site.data.releases.latest.url }}). Latest release is {{ site.data.releases.latest.version }}

1. Unzip the standalone compiler into a directory and optionally add the bin folder to the system path. The `bin` folder contains the following scripts:

    * `kotlinc-jvm`: The Kotlin compiler and shell for targeting the JVM.
    * `kotlinc-js`: The Kotlin compiler and shell for targeting JavaScript.
    * `kotlinc`: An alias for `kotlinc-jvm`.

There's a Bash version of each script for OS X and Linux users, and a batch file for Windows users.

### Creating and running a first application

1. Create a simple application in Kotlin that displays Hello, World!. Using our favorite editor, we create a new file called *app.kt* with the following

   ``` kotlin
   fun main(args: Array<String>) {
       println("Hello, World!")
   }
   ```

2. Compile the application using the JVM compiler

   ``` sh
   kotlinc-jvm app.kt -d app.jar
   ```

   The *-d* option indicates what we want the output of the compiler to be called and may be either a directory name for class files or a *.jar* file name.
   If you want to see all available options run

   ``` sh
   kotlinc-jvm -help
   ```

3. Run the application.

   ``` sh
   java -classpath app.jar:%path_to_runtime%/kotlin-runtime.jar _DefaultPackage
   ```

   The classpath should contain the output from step 2 as well as the path to the *kotlin-runtime.jar* file. The _DefaultPackage is the name of the main class that
   the Kotlin compiler generates by default.

   ![Command Line Output]({{ site.baseurl }}/{{ site.img_tutorial_root }}/command-line/output.png)


### Running the REPL

We can run the compiler without parameters to have an interactive shell. We can type any valid Kotlin code and see the results.

![Shell]({{ site.baseurl }}/{{ site.img_tutorial_root }}/command-line/kotlin_shell.png)

### Using the command line to run scripts

Kotlin can also be used as a scripting language. A script is a Kotlin source file (.kts) with top level executable code.

   ``` kotlin
   import java.io.File

   val folders = File(args[0]).listFiles { file -> file.isDirectory() }
   folders?.forEach { folder -> println(folder) }
   ```

To run a script, we just pass the *-script* option to the compiler with the corresponding script file.

   ``` sh
   kotlinc-jvm -script list_folders.kts
   ```


