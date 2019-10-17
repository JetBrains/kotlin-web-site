---
type: doc
layout: reference
title: "Command-line compiler"
---

# Kotlin Compiler Options Reference

Each release of Kotlin includes compilers for supported targets: 
JVM, JavaScript, and native binaries for [supported platforms](/docs/reference/native-overview.html#target-platforms).

These compilers are used by IDE when you push the __Compile__ or __Run__ button for your Kotlin project.  

You can also run Kotlin compilers manually from command line as described 
in the [Working with command-line compiler](/docs/tutorials/command-line.html) tutorial. For example: 

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
$ kotlinc hello.kt -include-runtime -d hello.jar
```

</div>
 
## Compiler options

Kotlin compilers have a number of options for tailoring the compilation process.
Compiler options for different targets are listed on this page together with their descriptions.

There are several ways to set the compiler options:
- In IntelliJ IDEA, write the options in the __Additional command-line parameters__ text box in 
__Settings | Build, Execution, Deployment | Compilers | Kotlin Compiler__
- If you're using Gradle, specify the options in the `kotlinOptions` property of the Kotlin compilation task.
For details, see [Using Gradle](/docs/reference/using-gradle.html#compiler-options).
- If you're using Maven, specify the options in the `<configuration>` element of the Maven plugin node. 
For details, see [Using Maven](/docs/reference/using-maven.html#specifying-compiler-options).
- If you run a command-line compiler, add the options directly to the call of the utility. 

## Common options

The following options are common for all Kotlin compilers.

### `-version` 
* Display the compiler version.

### `-nowarn`
* Suppress the compiler from displaying warnings during compilation.

### `-Werror`
* Turn any warnings into a compilation error. 

### `-verbose`
* Enable verbose logging output which includes details of the compilation process.

### `-help` (`-h`)
* Display usage information and exit. Only standard options are shown.
To show advanced options, use `-X`.

### `-X`
* Display information about advanced options and exit. Advanced options let you manage experimental 
features of Kotlin or tune specific aspects of . The names and behaviour of advanced options may be changed without notice.
The names of advanced options 

### `-kotlin-home <path>`
* Specify a custom path to Kotlin compiler used for the discovery of runtime libraries.
  
### `-P plugin:<pluginId>:<optionName>=<value>`
* Pass an option to a Kotlin compiler plugin.
Available plugins and their options are listed in [Compiler plugins](/docs/reference/compiler-plugins.html).
  
### `-language-version <version>`
* Provide source compatibility with the specified version of Kotlin.

### `-api-version <version>`
* Allow using declarations only from the specified version of bundled libraries.

### `-progressive`
* Enable the [progressive mode](/docs/reference/whatsnew13.html#progressive-mode) for the compiler.
    
    In the progressive mode, deprecations and bug fixes for unstable code take effect immediately,
    instead of going through a graceful migration cycle.
    Code written in the progressive mode is backward compatible; however, code written in
    non-progressive mode may cause compilation errors in the progressive mode.
    
## JVM Compiler
Kotlin compiler for JVM compiles the given Kotlin source files into Java class files. 
`kotlinc`
It also can be used for executing Kotlin script files.

## Examples

Compile a Kotlin source file with a given classpath:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
$ kotlin -classpath hello.jar HelloKt
```

</div>

Create a runnable JAR from Kotlin sources:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
$ kotlinc hello.kt -include-runtime -d hello.jar
```

</div>

Open script evaluation mode:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
$ kotlinc
```

</div>

Compile a Kotlin file with options listed in a file:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
$ kotlinc hello.kt @<filename>
```

</div>

## JVM-specific options

### `-classpath <path>` (`-cp <path>`)
* Search for class files in the specified paths. Separate elements of the classpath with semicolons (**;**).

### `-d <directory|jar>`
* Place the generated class files into the specified location. The location can be a directory, a ZIP, or a JAR file. 

### `-include-runtime`
* Include the Kotlin runtime into the resulting JAR file. Makes the resulting archive runnable on any Java-enabled 
environment.

### `-jdk-home <path>`
* Use a custom JDK home directory to include into classpath if it differs from the default `JAVA_HOME`.

### `-jvm-target <version>`
* Specify the target version of the generated JVM bytecode. Possible values are `1.6`, `1.8`, `9`, `10`, `11`, and `12`.
 The default value is `1.6`.

### `-java-parameters`
* Generate metadata for Java 1.8 reflection on method parameters.

### `-module-name <name>`
* Set the custom name for the generated `.kotlin_module` file.
  
### `-no-jdk`
* Exclude the Java runtime from the classpath.

### `-no-reflect`
* Exclude `kotlin-reflect.jar` from the classpath.
  
### `-no-stdlib`
* Exclude both `kotlin-stdlib.jar` and `kotlin-reflect.jar` from the classpath. 
  
### `-script <file>`
* Evaluate a Kotlin script (`*.kts`) file.
  
### `-script-templates <fully qualified class name[,]>`
* Script definition template classes.

### `-kotlin-home <path>`
* Specify a custom path to Kotlin compiler used for the discovery of runtime libraries.
  
### `-P plugin:<pluginId>:<optionName>=<value>`
* Pass an option to a plugin.
  
### `-language-version <version>`
* Provide source compatibility with the specified language version.

### `-api-version <version>`
* Allow using declarations only from the specified version of bundled libraries.

### `-progressive`
* Enable the [progressive mode](/docs/reference/whatsnew13.html#progressive-mode) for the compiler.
    
    In the progressive mode, deprecations and bug fixes for unstable code take effect immediately,
    instead of going through a graceful migration cycle.
    Code written in the progressive mode is backward compatible; however, code written in
    non-progressive mode may cause compilation errors in the progressive mode.
  
### `-nowarn`
* Suppress the compiler from displaying warnings during compilation.

### `-Werror`
* Report an error if there are any warnings.

### `-verbose`
* Enable verbose logging output.

### `-version` 
* Display the compiler version.

### `-help` (`-h`)
* Display usage information and exit. Only standard options are shown.
To show advanced options, use `-X`.

### `-X`
* Display information about advanced options and exit.

### `@<argfile>`
* Read the compiler options the given file.

## Kotlin/JS compiler options

## Kotlin/Native compiler options