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

```bash
$ curl -s https://get.sdkman.io | bash
```

Next open a new terminal and install Kotlin with:

```bash
$ sdk install kotlin
```

#### Homebrew
Alternatively, on OS X you can install the compiler via [Homebrew](http://brew.sh/).

```bash
$ brew update
$ brew install kotlin
```

#### MacPorts
If you're a [MacPorts](https://www.macports.org/) user, you can install the compiler with:

```bash
$ sudo port install kotlin
```

#### [Snap](https://snapcraft.io/) package
If you’re on Ubuntu 16.04 or later, you can install the compiler from the command line:

```bash
$ sudo snap install --classic kotlin
```

### Creating and running a first application

1. Create a simple application in Kotlin that displays Hello, World!. Using our favorite editor, we create a new file called *hello.kt* with the following:

   <div class="sample" markdown="1" theme="idea">
   ``` kotlin
   fun main(args: Array<String>) {
       println("Hello, World!")
   }
   ```
   </div>

2. Compile the application using the Kotlin compiler

   ```bash
   $ kotlinc hello.kt -include-runtime -d hello.jar
   ```

   The `-d` option indicates what we want the output of the compiler to be called and may be either a directory name for class files or a *.jar* file name. The `-include-runtime` option makes the resulting *.jar* file self-contained and runnable by including the Kotlin runtime library in it.
   If you want to see all available options run

   ```bash
   $ kotlinc -help
   ```

3. Run the application.

   ```bash
   $ java -jar hello.jar
   ```


### Compiling a library

   If you're developing a library to be used by other Kotlin applications, you can produce the .jar file without including the Kotlin runtime into it.

```bash
$ kotlinc hello.kt -d hello.jar
```

   Since binaries compiled this way depend on the Kotlin runtime you should make sure the latter is present in the classpath whenever your compiled library is used.
   
   You can also use the `kotlin` script to run binaries produced by the Kotlin compiler:

```bash
$ kotlin -classpath hello.jar HelloKt
```

   `HelloKt` is the main class name that the Kotlin compiler generates for the file named `hello.kt`.

### Running the REPL

We can run the compiler without parameters to have an interactive shell. We can type any valid Kotlin code and see the results.

![Shell]({{ url_for('tutorial_img', filename='command-line/kotlin_shell.png')}})

### Using the command line to run scripts

Kotlin can also be used as a scripting language. A script is a Kotlin source file (.kts) with top level executable code.

<div class="sample" markdown="1" theme="idea">
``` kotlin
   import java.io.File

   val folders = File(args[0]).listFiles { file -> file.isDirectory() }
   folders?.forEach { folder -> println(folder) }
```
</div>

To run a script, we just pass the `-script` option to the compiler with the corresponding script file.

```bash
$ kotlinc -script list_folders.kts <path_to_folder_to_inspect>
```

Since 1.3.0 Kotlin has an experimental support for scripts customization, such as adding external properties, 
providing static or dynamic dependencies, and so on. Customizations are defined by so-called *Script definitions* - 
annotated kotlin classes with appropriate support code. The script filename extension is used to select appropriate
definition.

Properly prepared script definitions are detected and applied automatically when the appropriate jars are included
in the compilation classpath. Alternatively, you can specify
definitions manually using `-script-templates` option to the compiler:
 
```bash
$ kotlinc -script-templates org.example.CustomScriptDefinition -script custom.script1.kts
```

For additional details, please consult the [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md). 
                                                                                          
