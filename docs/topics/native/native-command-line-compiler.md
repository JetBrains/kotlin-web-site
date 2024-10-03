[//]: # (title: Get started with Kotlin/Native using the command-line compiler)

## Download and install the compiler

The Kotlin/Native compiler works on macOS, Linux, and Windows. It's available as a command line tool and ships 
as part of the standard Kotlin distribution. You can download it from our [GitHub Releases](%kotlinLatestUrl%) page.

The compiler supports different targets including Linux, macOS, iOS, and others. [See the full list of supported targets](native-target-support.md).
While cross-platform compilation is possible, which means using one platform to compile for a different one, 
in this case, you'll be targeting the same platform you're compiling on.  

> Although the output of the compiler doesn't have any dependencies or virtual machine requirements, the compiler itself
> requires Java 1.8 or higher runtime. It's supported by [JDK 8 (JAVA SE 8) or later versions](https://www.oracle.com/java/technologies/downloads/).
> 
{style="note"}

To install the compiler, unpack its archive to a directory of your choice and add the path to its `/bin` directory
to the `PATH` environment variable.

## Write "Hello, Kotlin/Native" program

The application will print "Hello, Kotlin/Native" on the standard output.
Choose a working directory and create a file there named `hello.kt`. Update it with the following code:

```kotlin
fun main() {
  println("Hello, Kotlin/Native!")
}
```

## Compile the code from the console 

To compile the application, execute the following command with the [downloaded](https://github.com/JetBrains/kotlin/releases)
compiler:

```bash
kotlinc-native hello.kt -o hello
```

The value of `-o` option specifies the name of the output file, so this call should generate a `hello.kexe` (Linux and macOS)
or `hello.exe` (Windows) binary file. For the full list of available options, see [Kotlin compiler options](compiler-reference.md).

While compilation from the console seems to be easy and clear, it
doesn't scale well for larger projects with hundreds of files and libraries. For real-world projects, it is recommended
to use a [build system](native-gradle.md) and an [IDE](native-get-started.md).

## Run the program

To run the program, in your command line tool, navigate to the directory containing the `hello.kexe` (or `hello.exe`) file
and run the `./hello.kexe` (or `./hello.exe`) command. The application should print "Hello, Kotlin/Native" on the standard output.
