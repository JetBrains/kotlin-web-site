[//]: # (title: Get started with Kotlin/Native using the command-line compiler)

## Obtain the compiler

The Kotlin/Native compiler is available for macOS, Linux, and Windows. It is available as a command line tool and ships 
as part of the standard Kotlin distribution and can be downloaded from [GitHub Releases](%kotlinLatestUrl%). It supports
different targets including iOS (arm32, arm64, simulator x86_64), Windows (mingw32 and x86_64),
Linux (x86_64, arm64, MIPS), macOS (x86_64), Raspberry PI, SMT32, WASM. See the full list of targets [here](native-overview.md). 
While cross-platform compilation is possible, which means using one platform to compile for a different one, 
in this %product% case we'll be targeting the same platform we're compiling on.  

While the output of the compiler does not have any dependencies or virtual machine requirements,
the compiler itself requires [Java 1.8 or higher runtime](https://jdk.java.net/11/).

## Write "Hello Kotlin/Native" program

The application will print "Hello Kotlin/Native" on the standard output. In a working directory of choice, create a file named
`hello.kt` and enter the following contents:

```kotlin
fun main() {
  println("Hello Kotlin/Native!")
}
```

## Compile the code from the console 

To compile the application use the [downloaded](https://github.com/JetBrains/kotlin/releases)
compiler to execute the following command:

```bash
kotlinc-native hello.kt -o hello
```

The value of `-o` option specifies the name of the output file, so this call should generate a `hello.kexe` (Linux and macOS)
or `hello.exe` (Windows) binary file.
For the full list of available compiler options, see the [compiler options reference](compiler-reference.md).

While compilation from the console seems to be easy and clear, it
does not scale well for larger projects with hundreds of files and libraries. For real-world projects, it is recommended
to use a [build system](native-gradle.md) and [IDE](native-get-started.md).
