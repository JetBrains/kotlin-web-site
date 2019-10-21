---
type: doc
layout: reference
title: "Command-line compiler"
---

# Kotlin Compiler Options Reference

Each release of Kotlin includes compilers for supported targets: 
JVM, JavaScript, and native binaries for [supported platforms](native-overview.html#target-platforms).

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
For details, see [Using Gradle](using-gradle.html#compiler-options).
- If you're using Maven, specify the options in the `<configuration>` element of the Maven plugin node. 
For details, see [Using Maven](using-maven.html#specifying-compiler-options).
- If you run a command-line compiler, add the options directly to the utility call 
or write them into an [argfile](#argfile).

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
* Display information about advanced options and exit. These options are currently unstable: 
their names and behaviour may be changed without notice.

### `-kotlin-home <path>`
* Specify a custom path to Kotlin compiler used for the discovery of runtime libraries.
  
### `-P plugin:<pluginId>:<optionName>=<value>`
* Pass an option to a Kotlin compiler plugin.
Available plugins and their options are listed in [Compiler plugins](compiler-plugins.html).
  
### `-language-version <version>`
* Provide source compatibility with the specified version of Kotlin.

### `-api-version <version>`
* Allow using declarations only from the specified version of Kotlin bundled libraries.

### `-progressive`
* Enable the [progressive mode](whatsnew13.html#progressive-mode) for the compiler.
    
    In the progressive mode, deprecations and bug fixes for unstable code take effect immediately,
    instead of going through a graceful migration cycle.
    Code written in the progressive mode is backward compatible; however, code written in
    non-progressive mode may cause compilation errors in the progressive mode.
    
{:#argfile}

### `@<argfile>`
* Read the compiler options from the given file. A file passed in this option can contain compiler options with values 
and paths to source files. For example:

    <div class="sample" markdown="1" mode="shell" theme="idea">
    
    ```
    -d hello.jar -include-runtime
    hello.kt
    ```
    
    </div>

    You can also separate compiler options from source file names and pass multiple argument files.

    <div class="sample" markdown="1" mode="shell" theme="idea">
    
    ```bash
    $ kotlinc @compiler.options @classes
    ```
    
    </div>
    
    If the files reside in locations different from the current directory, use relative paths. 
    
    <div class="sample" markdown="1" mode="shell" theme="idea">
    
    ```bash
    $ kotlinc @options\compiler.options hello.kt
    ```
    
    </div>

    
## JVM compiler options

Kotlin compiler for JVM compiles Kotlin source files into Java class files. 
The command-line tools for Kotlin to JVM compilation are `kotlinc` and `kotlinc-jvm`.
You can also use them for executing Kotlin script files.

In addition to [common options](#common-options), Kotlin/JVM compiler has the options listed below.

### `-classpath <path>` (`-cp <path>`)
* Search for class files in the specified paths. Separate elements of the classpath with semicolons (**;**).
The classpath can contain file and directory paths, ZIP, or JAR files.

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
  
### `-script-templates <classnames[,]>`
* Script definition template classes. Use fully qualified class names and separate them with commas (**,**).


## Kotlin/JS compiler options

Kotlin compiler for JS compiles Kotlin source files into JavaScript code. 
The command-line tool for Kotlin to JS compilation is `kotlinc-js`.

In addition to [common options](#common-options), Kotlin/JS compiler has the options listed below.

### `-libraries <path>`

- Paths to Kotlin libraries with `.meta.js` and `.kjsm` files, separated by the system path separator.

### `-main {call,noCall}`

- Define whether the `main` function should be called upon execution.

### `-meta-info`

- Generate `.meta.js` and `.kjsm` files with metadata. Use this option when creating a JS library.

### `-module-kind { plain, amd, commonjs, umd }`

- Kind of the JS module generated by the compiler:
    - `plain` - a plain JS module;
    - `commonjs` - a [CommonJS](http://www.commonjs.org/) module;
    - `amd` - an [Asynchronous Module Definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition) module;
    - `umd` - a [Universal Module Definition](https://github.com/umdjs/umd) module.
    
    To learn more about the module kinds and dictinctions between them,
    read [this](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/) article.
    
### `-no-stdlib`

- Don't use the bundled Kotlin standard library.

### `-output <path>`

- Place the output file into the specified location.

### `-output-postfix <filepath>`

- Add the content of the specified file to the end of output file.

### `-output-prefix <filepath>`

- Add the content of the specified file to the beginning of output file.

### `-source-map`

- Generate the source map.

### `-source-map-base-dirs <path>`

- Use the specified paths as base directories. Base directories are used for calculating relative paths in the source map.

### `-source-map-embed-sources { always, never, inlining }`

- Embed source files into the source map.

### `-source-map-prefix`

- Add the specified prefix to paths in the source map.

## Kotlin/Native compiler options

Kotlin/Native compiler compiles Kotlin source files into native binaries for [supported platforms](native-overview.html#target-platforms). 
The command-line tool for Kotlin/Native compilation is `kotlinc-native`.

In addition to [common options](#common-options), Kotlin/Native compiler has the options listed below.


### `-enable-assertions`

- Enable runtime assertions in the generated code.
    
### `-g`

- Enable emitting debug information.
    
### `-generate-test-runner` (`-tr`)

- Produce a runner for unit tests.
    
### `-generate-worker-test-runner` (`-trw`)

- Produce a worker runner for unit tests.
    
### `-generate-no-exit-test-runner` (`-trn`)

- Produce a runner for unit tests not forcing exit.
    
### `-include-binary <path>` (`-ib <path>`)

- Pack external binary within the generated klib file.
    
### `-library <path>` (`-l <path>`)

- Link with the library.

### `-library-version <version>` (`-lv`)

- Set library version.
    
### `-list-targets`

- List available hardware targets.

### `-manifest <path>`

- Provide a manifest addend file.
    
### `-memory-model {strict, relaxed}`

- Memory model to use. Two memory models are supported:
    - _strict_
    - _relaxed_

### `-module-name <name>`

- Specify a name for the compilation module.

### `-native-library <path>`(`-nl <path>`)

- Include the native bitcode library.

### `-no-default-libs`

- Don't link the libraries from dist/klib automatically.

### `-no-endorsed-libs`

- Don't link the endorsed libraries from dist automatically.
    
### `-nomain`

- Assume `main` entry point to be provided by external libraries.

### `-nopack`

- Don't pack the library into a klib file.

### `-linker-option`

- Pass an argument to the linker. To learn more, see 
[C compiler and linker options](native/c_interop.html#c-compiler-and-linker-options).

### `-linker-options <args>

- Pass arguments to the linker. To learn more, see 
[C compiler and linker options](native/c_interop.html#c-compiler-and-linker-options).
 Separate different arguments with whitespaces.

### `-nostdlib`

- Don't link with stdlib.

### `-opt`

- Enable compilation optimizations.

### `-output <name>` (`-o <name>`)

- Set the name for the output file.

### `-entry <name>` (`-e <name>`)

- Specify the qualified entry point name.

### `-produce {program|static|dynamic|framework|library|bitcode}` (`-p {program|static|dynamic|framework|library|bitcode}`)

- Specify output file kind:
    - `program`
    - `static`
    - `dynamic`
    - `framework`
    - `library`
    - `bitcode`

### `-repo <path>` (`-r <path>`)

- Library search path.

### `-target <target>`

- Set hardware target. To see the list of available targets, use the [`list-targets`](#-list-targets) option.

  
