---
type: tutorial
layout: tutorial
title:  "Interop with C Libraries"
description: "A look at how to interop with C libraries"
authors: Hadi Hariri 
date: 2018-11-20
showAuthorInfo: false
---


When writing native applications, oftentimes we need to access certain functionality that is not included in the Kotlin standard library, 
such as making HTTP requests, reading and writing from disk, etc. 

Kotlin/Native provides us with the ability to consume standard C libraries, opening up an entire ecosystem of functionality that exists 
for pretty much anything we could need. In fact, Kotlin/Native already ships with a set of prebuilt [platform libraries](https://github.com/JetBrains/kotlin-native/blob/master/PLATFORM_LIBS.md) which 
provide some additional common functionality to that of the standard library. 

In this tutorial however, we'll see how to use some specific libraries, such as `libcurl`. We'll learn to  

* [Create Kotlin Bindings](#generating-bindings)
* [Consume a generated Kotlin API](#consuming-the-kotlin-api)
* [Link the library into the application](#compiling-and-linking-the-library)


## Generating Bindings

An ideal scenario for interop is to call C functions as if we were calling Kotlin functions, that is, following the same signature and conventions. And that is precisely what the 
`cinterop` tool provides us with. It takes a C library and generates the corresponding Kotlin bindings for it, which then allow us
to use the library as if it were Kotlin code. 

In order to generate these bindings, we need to create a library definition `.def` file that contains some information about the headers we need to generate. In our case we want to use the famous `libcurl` library
to make some HTTP calls, so we'll create a file named `libcurl.def` with the following contents

<div class="sample" markdown="1" mode="c" theme="idea" data-highlight-only="1" auto-indent="false">

```c
headers = curl/curl.h
headerFilter = curl/*

compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
```
</div>

A few things are going on in that file so let's see them one by one. The first entry is `headers` which is the list of header files that we want to generate 
Kotlin stubs for. We can add multiple files to this entry, separating each one with `\` on a new line. In our case we only want `curl.h`. The files we reference
need to be relative to the folder where the definition file is, or be available on the system path (in our case it would be `/usr/include/curl`).

The second line is the `headerFilter`. This is used to denote what exactly we want included. In C, when one file references another file with the `#include` directive, 
all the headers are also included. Sometimes this may not be needed, and we can use this parameter, [using glob patterns](https://en.wikipedia.org/wiki/Glob_(programming)), to fine tune things. 
Note, that `headerFilter` is an optional argument and mostly only used when the library we're using is being installed as a system library and we do not want to fetch external dependencies 
(such as system `stdint.h` header) into our interop library. It may be important for both optimising library size and fixing potential conflicts between system and the Kotlin/Native provided compilation environment.

The next lines are about providing linker and compiler options, which can vary based on different target platforms. In our cause, we are defining it for macOS (the `.osx` suffix) and Linux (the `.linux` suffix).
Parameters without suffix is also possible (e.g. `linkerOpts=`) and will be applied to all platforms. 

The convention that is followed is that each library gets its own definition file, usually named the same as the library. For more information on all
the options available to `cinterop`, see [the Interop documentation](/docs/reference/native/c_interop.html)

Once we have the definition file ready, we can invoke `cinterop` and have it generate the bindings for us 

    cinterop -def libcurl.def -o build/c_interop/libcurl
    
The output should be a Kotlin compiled library (extension `.klib`). We're also instructing `cinterop`
to output the contents to the folder `build/c_interop/libcurl` which we'll later use as input by `kotlinc-native`. It's important this folder is created
beforehand as `cinterop` needs an existing folder. The `c_interop` is a convention that is followed for libraries that are for interop.

### curl on Windows

You should have the `curl` library binaries on Windows to make the sample work.
You may build `curl` from [sources](https://curl.haxx.se/download.html) on Windows (you'll need Visual Studio or Windows SDK Commandline tools), for more
details, see the [related blog post](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/).
Alternatively, you may also consider a [MinGW/MSYS2](https://www.msys2.org/) `curl` binary.

You will need to provide the `curl` sources path to the `cinterop` tool call: `-compilerOpts -I<curl include directory>` and a linker option
to the `kotlinc-native` call:  `-linker-options "<curl binary directory>\libcurl.lib"`.
Note. On Windows, you always link with a `.lib` file, no matter if use *static* or *dynamic* library. For the *dynamic* linking,
the `.lib` file is normally generated by the toolchain, and it uses the `.dll` inside


## Consuming the Kotlin API

Now that we have our library and Kotlin stubs, we can consume them from our application. To keep things simple, in this tutorial we're going to convert one of the simplest 
`libcurl` examples over to Kotlin. 

The code in question is from the [simple](https://curl.haxx.se/libcurl/c/simple.html) example (comments removed for brevity)

<div class="sample" markdown="1" theme="idea" mode="c">

```c
#include <stdio.h>
#include <curl/curl.h>
 
int main(void)
{
  CURL *curl;
  CURLcode res;
 
  curl = curl_easy_init();
  if(curl) {
    curl_easy_setopt(curl, CURLOPT_URL, "http://example.com");
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
</div>

The first thing we'll need is a Kotlin file called `Main.kt` with the `main` function defined in it and then proceed to translate each line

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import libcurl.*
import kotlinx.cinterop.*

fun main(args: Array<String>) {
    val curl = curl_easy_init()
    if (curl != null) {
        curl_easy_setopt(curl, CURLOPT_URL, "http://example.com")
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L)
        val res = curl_easy_perform(curl)
        if (res != CURLE_OK) {
            println("curl_easy_perform() failed ${curl_easy_strerror(res)?.toKString()}")
        }
        curl_easy_cleanup(curl)
    }
}
```
</div>

As we can see, we've eliminated the explicit variable declarations in the Kotlin version, but everything else is pretty much verbatim to the C version. All the calls we'd
expect in the `libcurl` library are available in their Kotlin version.

Note that for the purpose of this tutorial, we've done a line by line literal translation. Obviously we could write this in a more Kotlin idiomatic way.

## Compiling and Linking the library

The next step is to compile our application. We already covered the basics of compiling a Kotlin/Native application from the command line in the [A Basic Kotlin/Native application](basic-kotlin-native-app.html) tutorial.
The only difference in this case is that we have to include the library that `cinterop` generated for us. 

```bash
kotlinc-native Main.kt -library build/c_interop/libcurl
```

We can see that we're passing in as `library` parameter the output path of `cinterop`. 

If there are no errors during compilation, we should see the output as a file named `program.kexe`, which on execution should output 
the contents of the site `http://example.com`

![Output]({{ url_for('tutorial_img', filename='native/cinterop/output.png')}})

The reason we're seeing the actual output is because the call `curl_easy_perform` prints the result to the standard output. We could hide this using 
`curl_easy_setopt`. 

For a more complete example of using `libcurl`, the [libcurl sample of the Kotlin/Native project](https://github.com/JetBrains/kotlin-native/tree/master/samples/libcurl) shows how to abstract the code into Kotlin
classes as well as display headers. It also demonstrates how to make the steps a little easier by combining them into a shell script or Gradle build. We'll cover these topics though in more detail in subsequent tutorials.

