[//]: # (title: Kotlin command-line compiler)

Every Kotlin release ships with a standalone version of the compiler. You can download the latest version manually or via a package manager.

> Installing the command-line compiler is not an essential step to use Kotlin.
> The common approach is to write Kotlin applications using IDEs or code editors with official Kotlin support,
> such as [IntelliJ IDEA](https://www.jetbrains.com/idea/), [JetBrains Fleet](https://www.jetbrains.com/fleet/),
> or [Android Studio](https://developer.android.com/studio).
> These provide full Kotlin support right out of the box, no extra components needed.
> 
> Learn how to [get started with Kotlin in an IDE](getting-started.md).
> 
{type="note"}

## Install the compiler

### Manual install

To install the Kotlin compiler manually:

1. Download the latest version (`kotlin-compiler-%kotlinVersion%.zip`) from [GitHub Releases](%kotlinLatestUrl%).
2. Unzip the standalone compiler into a directory and optionally add the `bin` directory to the system path.
The `bin` directory contains the scripts needed to compile and run Kotlin on Windows, macOS, and Linux.

> If you want to use the Kotlin command-line compiler on Windows, we recommend using the manual installation method.
> 
{type="note"}

### SDKMAN!

An easier way to install Kotlin on UNIX-based systems, such as macOS, Linux, Cygwin, FreeBSD, and Solaris, is
[SDKMAN!](https://sdkman.io). It also works in Bash and ZSH shells. [Learn how to install SDKMAN!](https://sdkman.io/install).

To install the Kotlin compiler via SDKMAN!, run the following command in the terminal:

```bash
sdk install kotlin
```

### Homebrew

Alternatively, on macOS you can install the compiler via [Homebrew](https://brew.sh/):

```bash
brew update
brew install kotlin
```

### Snap package

If you use [Snap](https://snapcraft.io/) on Ubuntu 16.04 or later, you can install the compiler from the command line:

```bash
sudo snap install --classic kotlin
```

## Create and run an application

1. Create a simple console JVM application in Kotlin that displays `"Hello, World!"`. 
   In a code editor, create a new file called `hello.kt` with the following code:

   ```kotlin
   fun main() {
       println("Hello, World!")
   }
   ```

2. Compile the application using the Kotlin compiler:

   ```bash
   kotlinc hello.kt -include-runtime -d hello.jar
   ```

   * The `-d` option indicates the output path for generated class files, which may be either a directory or a **.jar** file.
   * The `-include-runtime` option makes the resulting **.jar** file self-contained and runnable by including the Kotlin runtime
library in it.

   To see all available options, run:

   ```bash
   kotlinc -help
   ```

3. Run the application:

   ```bash
   java -jar hello.jar
   ```

## Compile a library

If you're developing a library to be used by other Kotlin applications, you can build the **.jar** file without including
the Kotlin runtime:

```bash
kotlinc hello.kt -d hello.jar
```

Since binaries compiled this way depend on the Kotlin runtime, 
you should ensure that it is present in the classpath whenever your compiled library is used

You can also use the `kotlin` script to run binaries produced by the Kotlin compiler:

```bash
kotlin -classpath hello.jar HelloKt
```

`HelloKt` is the main class name that the Kotlin compiler generates for the file named `hello.kt`.

## Run the REPL

You can run the compiler without parameters to have an interactive shell. In this shell, you can type any valid Kotlin code
and see the results.

<img src="kotlin-shell.png" alt="Shell" width="500"/>

## Run scripts

You can use Kotlin as a scripting language.
A Kotlin script is a Kotlin source file (`.kts`) with top-level executable code.

```kotlin
import java.io.File

// Get the passed in path, i.e. "-d some/path" or use the current path.
val path = if (args.contains("-d")) args[1 + args.indexOf("-d")]
           else "."

val folders = File(path).listFiles { file -> file.isDirectory() }
folders?.forEach { folder -> println(folder) }
```

To run a script, pass the `-script` option to the compiler with the corresponding script file:

```bash
kotlinc -script list_folders.kts -- -d <path_to_folder_to_inspect>
```

Kotlin provides experimental support for script customization, such as adding external properties,
providing static or dynamic dependencies, and so on.
Customizations are defined by so-called _Script definitions_ – annotated kotlin classes with the appropriate support code.
The script filename extension is used to select the appropriate definition.
Learn more about [Kotlin custom scripting](custom-script-deps-tutorial.md).

Properly prepared script definitions are detected and applied automatically when the appropriate jars are included
in the compilation classpath. Alternatively, you can specify definitions manually by passing the `-script-templates` option
to the compiler:

```bash
kotlinc -script-templates org.example.CustomScriptDefinition -script custom.script1.kts
```

For additional details, see the [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md).