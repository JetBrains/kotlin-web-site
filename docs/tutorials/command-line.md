---
type: tutorial
layout: tutorial
title: "Working with the Command Line Compiler"
description: "This tutorial walks us through creating a Hello World application using the command line compiler."
authors: Hadi Hariri
showAuthorInfo: true
related:
    - getting-started.md
---
### Downloading the compiler

Every release ships with a standalone version of the compiler. We can download it from [GitHub Releases]({{ site.data.releases.latest.url }}). Latest release is {{ site.data.releases.latest.version }}

* Unzip the standalone compiler into a directory and optionally add the bin folder to the system path. The `bin` folder contains the following scripts:

    * `kotlinc-jvm`: The Kotlin compiler and shell for targeting the JVM.
    * `kotlinc-js`: The Kotlin compiler and shell for targeting JavaScript.
    * `kotlinc`: An alias for `kotlinc-jvm`.

There's a Bash version of each script for OS X and Linux users, and a batch file for Windows users.

### Creating and running a first application

1. Create a simple application in Kotlin that displays Hello, World!. Using our favorite editor, we create a new file called *hello.kt* with the following

   ``` kotlin
   fun main(args: Array<String>) {
       println("Hello, World!")
   }
   ```

2. Compile the application using the JVM compiler

   ```
   $ kotlinc-jvm hello.kt -include-runtime -d hello.jar
   ```

   The `-d` option indicates what we want the output of the compiler to be called and may be either a directory name for class files or a *.jar* file name. The `-include-runtime` option makes the resulting *.jar* file self-contained and runnable.
   If you want to see all available options run

   ```
   $ kotlinc-jvm -help
   ```

3. Run the application.

   ```
   $ java -jar hello.jar
   ```


### Compiling a library

   If you're developing a library to be used by other Kotlin applications, you can produce the .jar file without including the Kotlin runtime into it.
   
```
   $ kotlinc-jvm hello.kt -d hello.jar
```
   
   Since binaries compiled this way depend on the Kotlin runtime you should make sure the latter is present in the classpath whenever your compiled library is used. For instance, an alternative way to execute the Hello World app would be
   
```
   $ java -classpath hello.jar:%path_to_runtime%/kotlin-runtime.jar _DefaultPackage
```

   The `_DefaultPackage` is the main class name that the Kotlin compiler generates by default for the root package. For a non-root package `org.acme.test` it would be `org.acme.test.TestPackage`.

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
   
To run a script, we just pass the `-script` option to the compiler with the corresponding script file.

```
   $ kotlinc-jvm -script list_folders.kts <path_to_folder_to_inspect>
```


