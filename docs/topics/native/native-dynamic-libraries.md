[//]: # (title: Kotlin/Native as a dynamic library – tutorial)

Learn how you can use the Kotlin/Native code from
existing native applications or libraries. For this, you need to
compile the Kotlin code into a dynamic library, `.so`, `.dylib`, and `.dll`.

Kotlin/Native also has tight integration with Apple technologies.
The [Kotlin/Native as an Apple Framework](apple-framework.md)
tutorial explains how to compile Kotlin code into a framework for Swift and Objective-C.

In this tutorial, you will:
 - [Compile a Kotlin code to a dynamic library](#create-a-kotlin-library)
 - [Examine generated C headers](#generated-headers-file)
 - [Use the Kotlin dynamic library from C](#use-generated-headers-from-c)
 - Compile and run the example on [Linux and Mac](#compile-and-run-the-example-on-linux-and-macos)
   and [Windows](#compile-and-run-the-example-on-windows)
  
## Create a Kotlin library

Kotlin/Native compiler can produce a dynamic library out of the Kotlin code.
A dynamic library often comes with a header file, a `.h` file, which you will use
to call the compiled code from C.

The best way to understand these techniques is to try them out. 
First, create a first tiny Kotlin library and use it from a C program. 

Start by creating a library file in Kotlin and save it as `hello.kt`:

```kotlin
package example

object Object {
  val field = "A"
}

class Clazz {
  fun memberFunction(p: Int): ULong = 42UL
}

fun forIntegers(b: Byte, s: Short, i: UInt, l: Long) { }
fun forFloats(f: Float, d: Double) { }

fun strings(str: String) : String? {
  return "That is '$str' from C"
}

val globalString = "A global String"
```

While it is possible to use the command line, either directly or
by combining it with a script file (such as `.sh` or `.bat` file), this approach doesn't
scale well for big projects that have hundreds of files and libraries.
It is then better to use the Kotlin/Native compiler with a build system, as it
helps to download and cache the Kotlin/Native compiler binaries and libraries with
transitive dependencies and run the compiler and tests.
Kotlin/Native can use the [Gradle](https://gradle.org) build system through the
[kotlin-multiplatform](mpp-discover-project.md#multiplatform-plugin) plugin.

We covered the basics of setting up an IDE compatible project with Gradle in the
[A Basic Kotlin/Native Application](native-gradle.md)
tutorial. Please check it out if you are looking for detailed first steps
and instructions on how to start a new Kotlin/Native project and open it in IntelliJ IDEA.
In this tutorial, we'll look at the advanced C interop related usages of Kotlin/Native and [multiplatform](mpp-discover-project.md#multiplatform-plugin) builds with Gradle.

First, create a project folder. All the paths in this tutorial will be relative to this folder. Sometimes
the missing directories will have to be created before any new files can be added.

Use the following `build.gradle(.kts)` Gradle build file:

<tabs>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

repositories {
    mavenCentral()
}

kotlin {
  linuxX64("native") {  // on Linux
  // macosX64("native") { // on macOS
  // mingwX64("native") { //on Windows
    binaries {
      sharedLib {
        baseName = "native" // on Linux and macOS
        // baseName = "libnative" //on Windows
      }
    }
  }
}

wrapper {
  gradleVersion = "%gradleVersion%"
  distributionType = "ALL"
}
```

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

repositories {
    mavenCentral()
}

kotlin {
  linuxX64("native") { // on Linux
  // macosX64("native") { // on macOS
  // mingwX64("native") { // on Windows
    binaries {
      sharedLib {
        baseName = "native" // on Linux and macOS
        // baseName = "libnative" // on Windows
      }
    }
  }
}

tasks.wrapper {
  gradleVersion = "%gradleVersion%"
  distributionType = Wrapper.DistributionType.ALL
}
```

</tabs>

The prepared project sources can be directly downloaded from Github:

* for macOS: [Groovy](https://github.com/kotlin/web-site-samples/archive/mpp-kn-shared-lib-groovy-macos.zip), [Kotlin](https://github.com/kotlin/web-site-samples/archive/mpp-kn-shared-lib-kotlin-macos.zip)
* for Linux: [Groovy](https://github.com/kotlin/web-site-samples/archive/mpp-kn-shared-lib-groovy-linux.zip), [Kotlin](https://github.com/kotlin/web-site-samples/archive/mpp-kn-shared-lib-kotlin-linux.zip)
* for Windows: [Groovy](https://github.com/kotlin/web-site-samples/archive/mpp-kn-shared-lib-groovy-windows.zip), [Kotlin](https://github.com/kotlin/web-site-samples/archive/mpp-kn-shared-lib-kotlin-windows.zip)

Move the sources file into the `src/nativeMain/kotlin` folder under
the project. This is the default path, for where sources are located, when
the [kotlin-multiplatform](mpp-discover-project.md#multiplatform-plugin)
plugin is used. Use the following block to instruct and configure the project
to generate a dynamic or shared library: 

```kotlin
binaries {
  sharedLib {
    baseName = "native" // on Linux and macOS
    // baseName = "libnative" // on Windows
  }  
}
```

The `libnative` is used as the library name, the generated
header file name prefix. It is also prefixes all declarations in the
header file.

Now you can
[open the project in IntelliJ IDEA](native-get-started.md)
and to see how to fix the example project. While doing this,
we'll examine how C functions are mapped into Kotlin/Native declarations.

Run the `linkNative` Gradle task to build the library in the IDE
or by calling the following console command:

```bash
./gradlew linkNative
```

The build generates the following files under the `build/bin/native/debugShared`
folder, depending on the host OS:
- macOS: `libnative_api.h` and `libnative.dylib`
- Linux: `libnative_api.h` and `libnative.so`
- Windows: `libnative_api.h`, `libnative_symbols.def` and `libnative.dll`

The same rules are used by the Kotlin/Native compiler
to generate the `.h` file for all platforms.  
Let's check out the C API of our Kotlin library.` 

## Generated headers file

In the `libnative_api.h`, you'll find the following code. 
Let's discuss the code in parts to make it easier to understand.

>The way Kotlin/Native exports symbols is subject to change without notice.

{type="note"}

The very first part contains the standard C/C++ header and footer:

```c
#ifndef KONAN_DEMO_H
#define KONAN_DEMO_H
#ifdef __cplusplus
extern "C" {
#endif

/// THE REST OF THE GENERATED CODE GOES HERE

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_DEMO_H */
```

After the rituals in the `libnative_api.h`, there is a block with the common type definitions:

```c
#ifdef __cplusplus
typedef bool            libnative_KBoolean;
#else
typedef _Bool           libnative_KBoolean;
#endif
typedef unsigned short     libnative_KChar;
typedef signed char        libnative_KByte;
typedef short              libnative_KShort;
typedef int                libnative_KInt;
typedef long long          libnative_KLong;
typedef unsigned char      libnative_KUByte;
typedef unsigned short     libnative_KUShort;
typedef unsigned int       libnative_KUInt;
typedef unsigned long long libnative_KULong;
typedef float              libnative_KFloat;
typedef double             libnative_KDouble;
typedef void*              libnative_KNativePtr;
``` 

Kotlin uses the `libnative_` prefix for all declarations
in the created `libnative_api.h` file. Let's present
the mapping of the types in a more readable way:

|Kotlin Define          | C Type               |
|-----------------------|----------------------|
|`libnative_KBoolean`   | `bool` or `_Bool`    |
|`libnative_KChar`      |  `unsigned short`    |
|`libnative_KByte`      |  `signed char`       |
|`libnative_KShort`     |  `short`             |
|`libnative_KInt`       |  `int`               |
|`libnative_KLong`      |  `long long`         |
|`libnative_KUByte`     |  `unsigned char`     |
|`libnative_KUShort`    |  `unsigned short`    |
|`libnative_KUInt`      |  `unsigned int`      |
|`libnative_KULong`     |  `unsigned long long`|
|`libnative_KFloat`     |  `float`             |
|`libnative_KDouble`    |  `double`            |
|`libnative_KNativePtr` |  `void*`             |

The definitions part shows how Kotlin primitive types map into C primitive types. 
The reverse mapping is described in the [Mapping primitive data types from C](mapping-primitive-data-types-from-c.md) tutorial.

The next part of the `libnative_api.h` file contains definitions of the types
that are used in the library:

```c
struct libnative_KType;
typedef struct libnative_KType libnative_KType;

typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Object;

typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Clazz;
```

The `typedef struct { .. } TYPE_NAME` syntax is used in C language to declare a structure. 
[This thread](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions) on Stackoverflow
provides more explanations of that pattern.

As you can see from these definitions, the Kotlin object `Object` is mapped into
`libnative_kref_example_Object`, and `Clazz` is mapped into `libnative_kref_example_Clazz`.
Both structs contain nothing but the `pinned` field with a pointer, the field type 
`libnative_KNativePtr` is defined as `void*` above. 

There is no namespaces support in C, so the Kotlin/Native compiler generates 
long names to avoid any possible clashes with other symbols in the existing native project.

A significant part of the definitions goes in the `libnative_api.h` file.
It includes the definition of our Kotlin/Native library world:

```c
typedef struct {
  /* Service functions. */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
  libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);

  /* User functions. */
  struct {
    struct {
      struct {
        void (*forIntegers)(libnative_KByte b, libnative_KShort s, libnative_KUInt i, libnative_KLong l);
        void (*forFloats)(libnative_KFloat f, libnative_KDouble d);
        const char* (*strings)(const char* str);
        const char* (*get_globalString)();
        struct {
          libnative_KType* (*_type)(void);
          libnative_kref_example_Object (*_instance)();
          const char* (*get_field)(libnative_kref_example_Object thiz);
        } Object;
        struct {
          libnative_KType* (*_type)(void);
          libnative_kref_example_Clazz (*Clazz)();
          libnative_KULong (*memberFunction)(libnative_kref_example_Clazz thiz, libnative_KInt p);
        } Clazz;
      } example;
    } root;
  } kotlin;
} libnative_ExportedSymbols;
```

The code uses anonymous structure declarations. The code `struct { .. } foo`
declares a field in the outer struct of that 
anonymous structure type, the type with no name. 

C does not support objects either. People use function pointers to mimic 
object semantics. A function pointer is declared as follows `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`.
It is tricky to read, but we should be able to see function pointer fields in the structures above. 

### Runtime functions

The code reads as follows. You have the `libnative_ExportedSymbols` structure, which defines
all the functions that Kotlin/Native and our library provides us. It uses 
nested anonymous structures heavily to mimic packages. The `libnative_` prefix comes from the
library name.

The `libnative_ExportedSymbols` structure contains several helper functions:

```c
void (*DisposeStablePointer)(libnative_KNativePtr ptr);
void (*DisposeString)(const char* string);
libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
```

These functions deal with Kotlin/Native objects. Call the 
`DisposeStablePointer` to release a Kotlin object and `DisposeString` to release a Kotlin String, 
which has the `char*` type in C. It is possible to use the `IsInstance` function to check if a
Kotlin type or a `libnative_KNativePtr` is an instance of another type. The actual set of
operations generated depends on the actual usages.
 
Kotlin/Native has garbage collection, but it does not help us deal
with Kotlin objects from the C language. Kotlin/Native has interop with Objective-C and 
Swift and integrates with their reference counters. 
The [Objective-C Interop](native-objc-interop.md)
documentation article contains more details on it. Also,
there is the tutorial [Kotlin/Native as an Apple Framework](apple-framework.md).

### Your library functions

Let's take a look at the `kotlin.root.example` field, it
mimics the package structure of our Kotlin code with a `kotlin.root.` prefix.

There is a `kotlin.root.example.Clazz` field that 
represents the `Clazz` from Kotlin. The `Clazz#memberFunction` is
accessible with the `memberFunction` field. The only difference is that 
the `memberFunction` accepts a `this` reference as the first parameter. 
The C language does not support objects, and this is the reason to pass a
`this` pointer explicitly.

There is a constructor in the `Clazz` field (aka `kotlin.root.example.Clazz.Clazz`),
which is the constructor function to create an instance of the `Clazz`.

Kotlin `object Object` is accessible as `kotlin.root.example.Object`. There is 
the `_instance` function to get the only instance of the object.

Properties are translated into functions. The `get_` and `set_` prefix
is used to name the getter and the setter functions respectively. For example, 
the read-only property `globalString` from Kotlin is turned 
into a `get_globalString` function in C. 

Global functions `forInts`, `forFloats`, or `strings` are turned into the functions pointers in
the `kotlin.root.example` anonymous struct.
 
### Entry point

You can see how the API is created. To start with, you need to initialize the 
`libnative_ExportedSymbols` structure. Let's take a look at the latest part 
of the `libnative_api.h` for this:

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

The function `libnative_symbols` allows you to open the way from the native 
code to the Kotlin/Native library. This is the entry point you'll use. The 
library name is used as a prefix for the function name. 

>Kotlin/Native object references do not support multi-threaded access. 
Hosting the returned `libnative_ExportedSymbols*` pointer
per thread might be necessary.

{type="note"}

## Use generated headers from C

The usage from C is straightforward and uncomplicated. Create a `main.c` file with the following 
code: 

```c
#include "libnative_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
  //obtain reference for calling Kotlin/Native functions
  libnative_ExportedSymbols* lib = libnative_symbols();

  lib->kotlin.root.example.forIntegers(1, 2, 3, 4);
  lib->kotlin.root.example.forFloats(1.0f, 2.0);

  //use C and Kotlin/Native strings
  const char* str = "Hello from Native!";
  const char* response = lib->kotlin.root.example.strings(str);
  printf("in: %s\nout:%s\n", str, response);
  lib->DisposeString(response);

  //create Kotlin object instance
  libnative_kref_example_Clazz newInstance = lib->kotlin.root.example.Clazz.Clazz();
  long x = lib->kotlin.root.example.Clazz.memberFunction(newInstance, 42);
  lib->DisposeStablePointer(newInstance.pinned);

  printf("DemoClazz returned %ld\n", x);

  return 0;
}
```

## Compile and run the example on Linux and macOS

On macOS 10.13 with Xcode, compile the C code and link it with the dynamic library
with the following command:

```bash
clang main.c libnative.dylib
```

On Linux call a similar command: 
```bash
gcc main.c libnative.so
```

The compiler generates an executable called `a.out`. Run it to see in action the Kotlin code
being executed from C library. On Linux, you'll need to include `.` into the `LD_LIBRARY_PATH`
to let the application know to load the `libnative.so` library from the current folder.

## Compile and run the example on Windows

To start with, you'll need a Microsoft Visual C++ compiler installed that supports a x64_64 
target. The easiest way to do this is to have a version of Microsoft Visual Studio installed on 
a Windows machine. 

In this example, you'll be using the `x64 Native Tools Command Prompt <VERSION>` console. You'll see the 
shortcut to open the console in the start menu. It comes with a Microsoft Visual Studio
package.  

On Windows, Dynamic libraries are included either via a generated static library wrapper
or with manual code, which deals with the [LoadLibrary](https://docs.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya)
or similar Win32API functions. Follow the first option and generate the static wrapper library
for the `libnative.dll` as described below.
 
Call `lib.exe` from the toolchain to generate the static library 
wrapper `libnative.lib` that automates the DLL usage from the code:
```bash
lib /def:libnative_symbols.def /out:libnative.lib
```

Now you are ready to compile our `main.c` into an executable. Include the generated `libnative.lib` into
the build command and start:
```bash
cl.exe main.c libnative.lib
```

The command produces the `main.exe` file, which you can run.

## Next steps

Dynamic libraries are the main way to use Kotlin code from existing programs. 
You can use them to share your code with many platforms or languages, including JVM,
[Python](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/samples/python_extension/src/main/c/kotlin_bridge.c),
iOS, Android, and others.

Kotlin/Native also has tight integration with Objective-C and Swift.
It is covered in the [Kotlin/Native as an Apple Framework](apple-framework.md)
tutorial.
