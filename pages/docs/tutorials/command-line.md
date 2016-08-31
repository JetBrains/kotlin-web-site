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

Every release ships with a standalone version of the compiler. We can download it from [GitHub Releases]({{ site.data.releases.latest.url }}). The latest release is {{ site.data.releases.latest.version }}.

#### Manual Install
Unzip the standalone compiler into a directory and optionally add the `bin` directory to the system path. The `bin` directory contains the scripts needed to compile and run Kotlin on Windows, OS X and Linux.

#### SDKMAN!
An easier way to install Kotlin on UNIX based systems such as OS X, Linux, Cygwin, FreeBSD and Solaris is by using [SDKMAN!](http://sdkman.io).
Simply run the following in a terminal and follow any instructions:

```
   $ curl -s https://get.sdkman.io | bash
```

Next open a new terminal and install Kotlin with:

```
   $ sdk install kotlin
```

#### Homebrew
Alternatively, on OS X you can install the compiler via [Homebrew](http://brew.sh/).

```
   $ brew update
   $ brew install kotlin
```

### Creating and running a first application

1. Create a simple application in Kotlin that displays Hello, World!. Using our favorite editor, we create a new file called *hello.kt* with the following:

   ``` kotlin
   fun main(args: Array<String>) {
       println("Hello, World!")
   }
   ```

2. Compile the application using the Kotlin compiler

   ```
   $ kotlinc hello.kt -include-runtime -d hello.jar
   ```

   The `-d` option indicates what we want the output of the compiler to be called and may be either a directory name for class files or a *.jar* file name. The `-include-runtime` option makes the resulting *.jar* file self-contained and runnable by including the Kotlin runtime library in it.
   If you want to see all available options run

   ```
   $ kotlinc -help
   ```

3. Run the application.

   ```
   $ java -jar hello.jar
   ```


### Compiling a library

   If you're developing a library to be used by other Kotlin applications, you can produce the .jar file without including the Kotlin runtime into it.

```
   $ kotlinc hello.kt -d hello.jar
```

   Since binaries compiled this way depend on the Kotlin runtime you should make sure the latter is present in the classpath whenever your compiled library is used.
   
   You can also use the `kotlin` script to run binaries produced by the Kotlin compiler:

```
   $ kotlin -classpath hello.jar HelloKt
```

   `HelloKt` is the main class name that the Kotlin compiler generates for the file named `hello.kt`.

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
   $ kotlinc -script list_folders.kts <path_to_folder_to_inspect>
```

