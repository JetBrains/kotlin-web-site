[//]: # (title: Create an app using C Interop and libcurl – tutorial)

This tutorial demonstrates how to use IntelliJ IDEA for creating a command-line application. You'll learn how to create
a simple HTTP client that can run natively on specified platforms using Kotlin/Native and the `libcurl` library.

The output will be an executable command-line app that you can run on macOS and Linux and make simple HTTP GET requests.

> While it is possible to use the command line, either directly or by combining it with a script file (such as a `.sh` or
> a `.bat` file), this approach doesn't scale well for big projects with hundreds of files and libraries. It is then
> better to use the Kotlin/Native compiler with a build system, as it helps to download and cache the Kotlin/Native
> compiler binaries and libraries with transitive dependencies and run the compiler and tests. Kotlin/Native can use the
> [Gradle](gradle.md) build system through the [kotlin-multiplatform](mpp-discover-project.md#multiplatform-plugin)
> Plugin.
>

To get started, install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).
The tutorial is applicable to both IntelliJ IDEA Community Edition and the Ultimate Edition.

## Create a Kotlin/Native project

1. In IntelliJ IDEA, select **File | New | Project**.
2. In the panel on the left, select **Kotlin | Native Application**.
3. Specify the name and select the folder where you'll save your application.
   ![New project. Native application in IntelliJ IDEA](native-file-new.png){width="700"}
3. Click **Next** and then **Finish**.

IDEA will create a new project with some files and folders to get you started. It's important to understand that
an application written in Kotlin/Native can target different platforms if the code does not have platform-specific
requirements. Your code is placed in a folder named `NativeMain` with its corresponding `NativeTest`. For this tutorial,
keep the folder structure as is.

![Native application project structure](native-project-structure.png){width="700"}

Along with your new project, a `build.gradle(.kts)` file is generated. Pay special attention to the following
in the build file:

<tabs>

```kotlin
kotlin {
    val hostOs = System.getProperty("os.name")
    val isMingwX64 = hostOs.startsWith("Windows")
    val nativeTarget = when {
        hostOs == "Mac OS X" -> macosX64("native")
        hostOs == "Linux" -> linuxX64("native")
        isMingwX64 -> mingwX64("native")
        else -> throw GradleException("Host OS is not supported in Kotlin/Native.")
    }

    nativeTarget.apply {
        binaries {
            executable {
                entryPoint = "main"
            }
        }
    }
}
```

```groovy
kotlin {
    def hostOs = System.getProperty("os.name")
    def isMingwX64 = hostOs.startsWith("Windows")
    def nativeTarget
        if (hostOs == "Mac OS X") nativeTarget = macosX64('native')
        else if (hostOs == "Linux") nativeTarget = linuxX64("native")
        else if (isMingwX64) nativeTarget = mingwX64("native")
        else throw new FileNotFoundException("Host OS is not supported in Kotlin/Native.")

    nativeTarget.with {
        binaries {
            executable {
                entryPoint = 'main'
            }
        }
    }
}
```

</tabs>

* Targets are defined using `macOSX64`, `linuxX64`, and `mingwX64` for macOS, Linux, and Windows. For a complete
  list of supported platforms, see the [Kotlin Native overview](native-overview.md#target-platforms).
* The entry itself defines a series of properties to indicate how the binary is generated and the entry
  point of the applications. These can be left as default values.
* The C interoperability is configured as an additional step of the build. By default, all the symbols from C are
  imported to the `interop` package; you may want to import the whole package in `.kt` files. Learn more about ways on
  [how to configure](mpp-discover-project.md#multiplatform-plugin) it.

## Create a definition file

When writing native applications, you often need access to certain functionality that is not included in the [Kotlin
standard library](https://kotlinlang.org/api/latest/jvm/stdlib/), such as making HTTP requests, reading and writing from
disk, and so on.

Kotlin/Native helps consume standard C libraries, opening up an entire ecosystem of functionality that exists
for pretty much anything you may need. Kotlin/Native is already shipped with a set of prebuilt [platform libraries](native-platform-libs.md),
which provide some additional common functionality to the standard library.

An ideal scenario for interop is to call C functions as if you are calling Kotlin functions, following the same
signature and conventions. This is when the `cinterop` tool comes in handy. It takes a C library and generates the
corresponding Kotlin bindings, so that the library can be used as if it were a Kotlin code.

To generate these bindings, let's create a library definition `.def` file that contains some information about
the necessary headers. In our app, you'll need the `libcurl` library to make some HTTP calls. To create a
definition file:

1. Select the `src` folder and create a new directory with **File | New | Directory**.
2. Name new directory **nativeInterop/cinterop**. This is the default convention for header file locations, though it can
   be overridden in the `build.gradle` file if you use a different location.
3. Select this new subfolder and create a new `libcurl.def` file with **File | New | File**.
4. Update your file with the following code:

```c
headers = curl/curl.h
headerFilter = curl/*

compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
```

* The first entry is `headers`, the list of header files to generate Kotlin stubs for. You can add multiple files to
this entry, separating each with a `\` on a new line. In our case, it's only `curl.h`. The referenced files need to be
relative to the folder where the definition file is or be available on the system path (in our case, it's `/usr/include/curl`).
* The second line is the `headerFilter`. It shows what exactly is included. In C, all the headers are also included when
one file references another one with the `#include` directive. Sometimes it's not necessary, and you can add this
parameter [using glob patterns](https://en.wikipedia.org/wiki/Glob_(programming)) to fine-tune things.

> `headerFilter` is an optional argument and is mostly used when the library is installed as a system library. You don't
> want to fetch external dependencies (such as system `stdint.h` header) into the interop library. It may be important to
> optimize the library size and fix potential conflicts between the system and the provided Kotlin/Native compilation
> environment.
>
{type="note"}

* The next lines are about providing linker and compiler options, which can vary depending on different target platforms.
In our case, they are macOS (the `.osx` suffix) and Linux (the `.linux` suffix). Parameters without a suffix are also
possible (for example, `linkerOpts=`) and applied to all platforms.

The convention is that each library gets its definition file, usually with the same name as the library. For more
information on all the options available to `cinterop`, see [the Interop section](native-c-interop.md).

> You need to have the `curl` library binaries on your system to make the sample work. On macOS and Linux, it is usually
> included. On Windows, you can build it from [sources](https://curl.haxx.se/download.html) (you'll need Visual Studio or
> Windows SDK Commandline tools). For more details, see the [related blog post](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/).
> Alternatively, you may also want to consider a [MinGW/MSYS2](https://www.msys2.org/) `curl` binary.
>
{type="note"}

## Add interoperability to the build process

To use header files, let's make sure they are generated as a part of the build process. For this, add the following
entry to the `build.gradle(.kts)` file:

<tabs>

```kotlin
nativeTarget.apply {
    compilations.main { // NL
        cinterops {     // NL
            libcurl     // NL
        }               // NL
    }                   // NL
    binaries {
        executable { 
            entryPoint = "main"
        }
    }
}
    
```      

```groovy
nativeTarget.with {
    compilations.main { // NL
        cinterops {     // NL
            libcurl     // NL
        }               // NL
    }                   // NL
    binaries {
        executable {
            entryPoint = 'main'
        }
    }
}
```

</tabs>

The new lines are marked with `// NL`. First, `cinterops` is added, and then an entry for each `def` file. By default,
the name of the file is used. You can override this with additional parameters:

```groovy
libcurl {
    defFile project.file("libcurl.def")
    packageName 'com.jetbrains.handson.http'
    compilerOpts '-I/path'
    includeDirs.allHeaders("path")
}
```

See the [Interoperability with C](native-c-interop.md) section for more details on the available options.

## Write the application code

Now you have the library and the corresponding Kotlin stubs and can consume them from your application. For this tutorial,
let's convert the [simple.c](https://curl.haxx.se/libcurl/c/simple.html) example to Kotlin.

In the `src/nativeMain/kotlin/` folder, update your `Main.kt` file with the following code:

```kotlin
import kotlinx.cinterop.*
import libcurl.*

fun main(args: Array<String>) {
    val curl = curl_easy_init()
    if (curl != null) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://example.com")
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L)
        val res = curl_easy_perform(curl)
        if (res != CURLE_OK) {
            println("curl_easy_perform() failed ${curl_easy_strerror(res)?.toKString()}")
        }
        curl_easy_cleanup(curl)
    }
}
```

As you can see, explicit variable declarations are eliminated in the Kotlin version, but everything else is pretty much
the same as the C version. All the calls you'd expect in the `libcurl` library are available in the Kotlin equivalent.

> This is a line-by-line literal translation. You could also write this in a more Kotlin idiomatic way.
>

## Compile and run the application

1. Compile the application. To do that, run the following command in the terminal:

```bash
./gradlew runDebugExecutableNative
```
In this case, the `cinterop` generated part is implicitly included in the build.

2. If there are no errors during compilation, run the build by creating a [Run Configuration](https://www.jetbrains.com/help/idea/run-debug-configuration.html#create-permanent).
IntelliJ IDEA opens the **Run** tab and shows the output — the contents of `https://example.com`:

![Application output with HTML-code](native-output.png){width="700"}

You can see the actual output because the call `curl_easy_perform` prints the result to the standard output. You could
hide this using `curl_easy_setopt`.

> You can find the resulting code in our [GitHub](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native) repository.
>

## What’s next?

For a complete example of using the `libcurl`, see the [libcurl sample of the Kotlin/Native project](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/samples/libcurl)
that shows how to abstract the code into Kotlin classes as well as display headers. It also demonstrates how to make
the steps easier by combining them into a shell script or a Gradle build.
