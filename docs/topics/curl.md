[//]: # (title: Using C Interop and libcurl for an app – tutorial)

When writing native applications, oftentimes you need to access certain functionality that is not included in the Kotlin standard library, 
such as making HTTP requests, reading and writing from disk, etc. 

Kotlin/Native provides you with the ability to consume standard C libraries, opening up an entire ecosystem of functionality that exists 
for pretty much anything you could need. In fact, Kotlin/Native already ships with a set of prebuilt [platform libraries](native-platform-libs.md) which 
provide some additional common functionality to that of the standard library. 

In this tutorial, you'll see how to use some specific libraries, such as `libcurl`. You'll learn to:  

* [Create Kotlin bindings](#generate-bindings)
* [Consume a generated Kotlin API](#consume-the-kotlin-api)
* [Link the library into the application](#compile-and-link-the-library)

## Generate bindings

An ideal scenario for interop is to call C functions as if you were calling Kotlin functions, that is, following the same signature and conventions. This is precisely what the 
`cinterop` tool provides. It takes a C library and generates the corresponding Kotlin bindings for it, which then allows you
to use the library as if it were Kotlin code. 

In order to generate these bindings, you need to create a library definition `.def` file that contains some information about the headers you need to generate. In this case, you'll use the famous `libcurl` library
to make some HTTP calls, so create a file named `libcurl.def` with the following contents:

```c
headers = curl/curl.h
headerFilter = curl/*

compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
```

A few things are going on in this file, let's go through them one by one. The first entry is `headers` which is the list of header files that you want to generate 
Kotlin stubs for. You can add multiple files to this entry, separating each one with a `\` on a new line. For this tutorial, you'll only need `curl.h`. The files we are referencing
need to be relative to the folder where the definition file is, or be available on the system path (`/usr/include/curl`).

The second line is the `headerFilter`. This is used to denote what exactly we want included. In C, when one file references another file with the `#include` directive, 
all the headers are also included. Sometimes this may not be needed, and you can use this parameter, [using glob patterns](https://en.wikipedia.org/wiki/Glob_(programming)), to fine tune things. 
Note, that `headerFilter` is an optional argument and mostly only used when the library you're using is being installed as a system library, and you do not want to fetch external dependencies 
(such as system `stdint.h` header) into your interop library. It may be important for both optimizing the library size and fixing potential conflicts between the system and the Kotlin/Native provided compilation environment.

The next lines are about providing linker and compiler options, which can vary depending on different target platforms. In this tutorial, we are defining it for macOS (the `.osx` suffix) and Linux (the `.linux` suffix).
Parameters without a suffix is also possible (e.g. `linkerOpts=`) and will be applied to all platforms. 

The convention that is followed is that each library gets its own definition file, usually named the same as the library. For more information on all
the options available to `cinterop`, see [the Interop documentation](native-c-interop.md)

Once you have the definition file ready, 
create project files and open the project in an IDE.

While it is possible to use the command line, either directly or
by combining it with a script file (such as `.sh` or `.bat` file), this approach doesn't
scale well for big projects that have hundreds of files and libraries.
It is then better to use the Kotlin/Native compiler with a build system, as it
helps to download and cache the Kotlin/Native compiler binaries and libraries with
transitive dependencies and run the compiler and tests.
Kotlin/Native can use the [Gradle](https://gradle.org) build system through the [kotlin-multiplatform](mpp-discover-project.md#multiplatform-plugin) plugin.

We covered the basics of setting up an IDE compatible project with Gradle in the
[A Basic Kotlin/Native Application](native-gradle.md)
tutorial. Please check it out if you are looking for detailed first steps
and instructions on how to start a new Kotlin/Native project and open it in IntelliJ IDEA.
In this tutorial, we'll look at the advanced C interop related usages of Kotlin/Native and [multiplatform](mpp-discover-project.md#multiplatform-plugin)builds with Gradle.

First, create a project folder. All the paths in this tutorial will be relative to this folder. Sometimes
the missing directories will have to be created before any new files can be added.

Use the following `build.gradle(.kts)` Gradle build file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

repositories {
    mavenCentral()
}

kotlin {
  linuxX64("native") { // on Linux
  // macosX64("native") { // on x86_64 macOS
  // macosArm64("native") { // on Apple Silicon macOS
  // mingwX64("native") { // on Windows
    val main by compilations.getting
    val interop by main.cinterops.creating
    
    binaries {
      executable()
    }
  }
}

tasks.wrapper {
  gradleVersion = "%gradleVersion%"
  distributionType = Wrapper.DistributionType.ALL
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

repositories {
    mavenCentral()
}

kotlin {
  linuxX64("native") { // on Linux
  // macosX64("native") { // on x86_64 macOS
  // macosArm64("native") { // on Apple Silicon macOS
  // mingwX64("native") { // on Windows
    compilations.main.cinterops {
      interop 
    }
    
    binaries {
      executable()
    }
  }
}

wrapper {
  gradleVersion = "%gradleVersion%"
  distributionType = "ALL"
}
```

</tab>
</tabs>

The project file configures the C interop as an additional step of the build.
Let's move the `interop.def` file to the `src/nativeInterop/cinterop` directory.
Gradle recommends using conventions instead of configurations,
for example, the source files are expected to be in the `src/nativeMain/kotlin` folder.
By default, all the symbols from C are imported to the `interop` package,
you may want to import the whole package in our `.kt` files. Check out the [kotlin-multiplatform](mpp-discover-project.md#multiplatform-plugin)
plugin documentation to learn about all the different ways you could configure it.

### curl on Windows

You should have the `curl` library binaries on Windows to make the sample work.
You may build `curl` from [sources](https://curl.haxx.se/download.html) on Windows (you'll need Visual Studio or Windows SDK Commandline tools), for more
details, see the [related blog post](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/).
Alternatively, you may also want to consider a [MinGW/MSYS2](https://www.msys2.org/) `curl` binary.

## Consume the Kotlin API

Now you have the library and Kotlin stubs and can consume them from our application. To keep things simple, in this tutorial you're going to convert one of the simplest 
`libcurl` examples over to Kotlin. 

The code in question is from the [simple](https://curl.haxx.se/libcurl/c/simple.html) example (comments removed for brevity):

```c
#include <stdio.h>
#include <curl/curl.h>
 
int main(void)
{
  CURL *curl;
  CURLcode res;
 
  curl = curl_easy_init();
  if(curl) {
    curl_easy_setopt(curl, CURLOPT_URL, "https://example.com");
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
 
    res = curl_easy_perform(curl);
    if(res != CURLE_OK)
      fprintf(stderr, "curl_easy_perform() failed: %s\n",
              curl_easy_strerror(res));
    curl_easy_cleanup(curl);
  }
  return 0;
}
```

The first thing you'll need is a Kotlin file called `src/nativeMain/kotlin/hello.kt` with the `main` function defined in it and then proceed to translate each line.

```kotlin
import interop.*
import kotlinx.cinterop.*

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

As you can see, you've eliminated the explicit variable declarations in the Kotlin version, but everything else is pretty much verbatim to the C version. All the calls you'd
expect in the `libcurl` library are available in their Kotlin equivalent.

Note that for the purpose of this tutorial, we've done a line by line literal translation. Obviously you could write this in a more Kotlin idiomatic way.

## Compile and link the library

The next step is to compile the application. We already covered the basics of compiling a Kotlin/Native application from the command line in the [A Basic Kotlin/Native application](native-command-line-compiler.md) tutorial.
The only difference in this case is that the `cinterop` generated part is implicitly included into the build:
Call the following command:

```bash
./gradlew runDebugExecutableNative
```
 
If there are no errors during compilation, you should see the result of the execution
of the program, which on execution should output 
the contents of the site `https://example.com`

![Output](curl-output.png){width=700}

The reason you're seeing the actual output is because the call `curl_easy_perform` prints the result to the standard output. You could hide this using 
`curl_easy_setopt`. 

For a more complete example of using `libcurl`, the [libcurl sample of the Kotlin/Native project](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/samples/libcurl) shows how to abstract the code into Kotlin
classes as well as display headers. It also demonstrates how to make the steps a little easier by combining them into a shell script or Gradle build.

