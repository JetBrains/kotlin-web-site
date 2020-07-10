---
type: tutorial
layout: tutorial
title:  "Kotlin/Native as a Dynamic Library"
description: "Compiling Kotlin/Native code to a dynamic library"
authors: Eugene Petrenko
date: 2019-04-15
showAuthorInfo: false
issue: EVAN-5371
---

In this tutorial, we look at how we can use the Kotlin/Native code from
existing native applications or libraries. For this, we need to
compile our Kotlin code into a dynamic library, `.so`, `.dylib`, and `.dll`.

Kotlin/Native also has tight integration with Apple technologies.
The [Kotlin/Native as an Apple Framework](apple-framework.html)
tutorial explains how to compile Kotlin code into a framework for Swift and Objective-C.

In this tutorial, we will:
 - [Compile a Kotlin code to a dynamic library](#creating-a-kotlin-library)
 - [Examine generated C headers](#generated-headers-file)
 - [Use the Kotlin dynamic library from C](#using-generated-headers-from-c)
 - Compile and run the example on [Linux and Mac](#compiling-and-running-the-example-on-linux-and-macos)
   and [Windows](#compiling-and-running-the-example-on-windows)
  
## Creating a Kotlin Library

Kotlin/Native compiler can produce a dynamic
library out of the Kotlin code we have.
A dynamic library often comes with a header file, a `.h` file,
which we will use to call compiled code from C.

The best way to understand these techniques is to try them out. 
Let's create a first tiny Kotlin library and use it from a C program. 

We can start by creating a library file in Kotlin and save it as `hello.kt`:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

[[include pages-includes/docs/tutorials/native/lets-create-gradle-build.md]]
[[include pages-includes/docs/tutorials/native/dynamic-library-code.md]]

The prepared project sources can be directly downloaded from 
[[include pages-includes/docs/tutorials/native/dynamic-library-link.md]]

Let's move the sources file into the `src/nativeMain/kotlin` folder under
the project. This is the default path, for where sources are located, when
the [kotlin-multiplatform](/docs/reference/building-mpp-with-gradle.html)
plugin is used. We use the following block to instruct and configure the project
to generate a dynamic or shared library for us: 

<div class="multi-language-sample" data-os="macos">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
binaries {
  sharedLib {
    baseName = "native"
  }  
}
```
</div>
</div>
<div class="multi-language-sample" data-os="linux">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
binaries {
  sharedLib {
    baseName = "native"
  }  
}
```
</div>
</div>
<div class="multi-language-sample" data-os="windows">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
binaries {
  sharedLib {
    baseName = "libnative"
  }  
}
```
</div>
</div>

The `libnative` is used as the library name, the generated
header file name prefix. It is also prefixes all declarations in the
header file.

Now we are ready to
[open the project in IntelliJ IDEA](/docs/tutorials/native/using-intellij-idea.html)
and to see how to fix the example project. While doing this,
we'll examine how C functions are mapped into Kotlin/Native declarations.

Let's run the `linkNative` Gradle task to build the library 
in the IDE
or by calling the following console command:
[[include pages-includes/docs/tutorials/native/linkNative.md]]

The build generates the following files under the `build/bin/native/debugShared`
folder, depending on the host OS:
- macOS: `libnative_api.h` and `libnative.dylib`
- Linux: `libnative_api.h` and `libnative.so`
- Windows: `libnative_api.h`, `libnative_symbols.def` and `libnative.dll`

The same rules are used by the Kotlin/Native compiler
to generate the `.h` file for all platforms.  
Let's check out the C API of our Kotlin library.` 

## Generated Headers File

In the `libnative_api.h`, we'll find the following code. 
We will discuss the code in parts to make it easier to understand.

Note, the way Kotlin/Native exports symbols is subject to change without notice.

The very first part contains the standard C/C++ header and footer:

<div class="sample" markdown="1" mode="C" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

After the rituals in the `libnative_api.h`, we have a block with the common type definitions:

<div class="sample" markdown="1" mode="C" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

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
{:.zebra}

The definitions part shows how Kotlin primitive types map into C primitive types. 
We discussed reverse mapping in the [Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html) tutorial.

The next part of the `libnative_api.h` file contains definitions of the types
that are used in the library:

<div class="sample" markdown="1" mode="C" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

The `typedef struct { .. } TYPE_NAME` syntax is used in C language to declare a structure. 
[The thread](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)
provides more explanations of that pattern.

We see from these definitions that the Kotlin object `Object` is mapped into
`libnative_kref_example_Object`, and `Clazz` is mapped into `libnative_kref_example_Clazz`.
Both structs contain nothing but the `pinned` field with a pointer, the field type 
`libnative_KNativePtr` is defined as `void*` above. 

There is no namespaces support in C, so the Kotlin/Native compiler generates 
long names to avoid any possible clashes with other symbols in the existing native project.

A significant part of the definitions goes in the `libnative_api.h` file.
It includes the definition of our Kotlin/Native library world:


<div class="sample" markdown="1" mode="C" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

The code uses anonymous structure declarations. The code `struct { .. } foo`
declares a field in the outer struct of that 
anonymous structure type, the type with no name. 

C does not support objects either. People use function pointers to mimic 
object semantics. A function pointer is declared as follows `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`.
It is tricky to read, but we should be able to see function pointer fields in the structures above. 

### Runtime Functions

The code reads as follows. We have the `libnative_ExportedSymbols` structure, which defines
all the functions that Kotlin/Native and our library provides us. It uses 
nested anonymous structures heavily to mimic packages. The `libnative_` prefix comes from the
library name.

The `libnative_ExportedSymbols` structure contains several helper functions:

<div class="sample" markdown="1" mode="C" theme="idea" data-highlight-only="1" auto-indent="false">

```c
void (*DisposeStablePointer)(libnative_KNativePtr ptr);
void (*DisposeString)(const char* string);
libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
```
</div>

These functions deal with Kotlin/Native objects. Call the 
`DisposeStablePointer` to release a Kotlin object and `DisposeString` to release a Kotlin String, 
which has the `char*` type in C. It is possible to use the `IsInstance` function to check if a
Kotlin type or a `libnative_KNativePtr` is an instance of another type. The actual set of
operations generated depends on the actual usages.
 
Kotlin/Native has garbage collection, but it does not help us deal
with Kotlin objects from the C language. Kotlin/Native has interop with Objective-C and 
Swift and integrates with their reference counters. 
The [Objective-C Interop](/docs/reference/native/objc_interop.html)
documentation article contains more details on it. Also,
there is the tutorial [Kotlin/Native as an Apple Framework](apple-framework.html).

### Our Library Functions

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
 
### The Entry Point

We can see how the API is created. To start with, we need to initialize the 
`libnative_ExportedSymbols` structure. Let's take a look at the latest part 
of the `libnative_api.h` for this:

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

The function `libnative_symbols` allows us to open the way from the native 
code to the Kotlin/Native library. This is the entry point we use. The 
library name is used as a prefix for the function name. 


Note, Kotlin/Native object references do not support multi-threaded access. 
Hosting the returned `libnative_ExportedSymbols*` pointer
per thread might be necessary.

## Using Generated Headers from C

The usage from C is straightforward and uncomplicated. We create a `main.c` file with the following 
code: 

<div class="sample" markdown="1" mode="C" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

## Compiling and Running the Example on Linux and macOS

On macOS 10.13 with Xcode, we compile the C code and link it with the dynamic library
with the following command:
```bash
clang main.c libnative.dylib
```

On Linux we call a similar command: 
```bash
gcc main.c libnative.so
```

The compiler generates an executable called `a.out`. We need to run it to see in action the Kotlin code
being executed from C library. On Linux, we'll need to include `.` into the `LD_LIBRARY_PATH`
to let the application know to load the `libnative.so` library from the current folder.

## Compiling and Running the Example on Windows

To start with, we'll need a Microsoft Visual C++ compiler installed that supports a x64_64 
target. The easiest way to do this is to have a version of Microsoft Visual Studio installed on 
a Windows machine. 

We will be using the `x64 Native Tools Command Prompt <VERSION>` console. We'll see the 
shortcut to open the console in the start menu. It comes with a Microsoft Visual Studio
package.  

On Windows, Dynamic libraries are included either via a generated static library wrapper
or with manual code, which deals with the [LoadLibrary](https://docs.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya)
or similar Win32API functions. We will follow the first option and generate the static wrapper library
for the `libnative.dll` on our own.
 
We call `lib.exe` from the toolchain to generate the static library 
wrapper `libnative.lib` that automates the DLL usage from the code:
```bash
lib /def:libnative_symbols.def /out:libnative.lib
```

Now we are ready to compile our `main.c` into an executable. We include the generated `libnative.lib` into
the build command and start:
```bash
cl.exe main.c libnative.lib
```

The command produces the `main.exe` file, which we can run.
 

## Next Steps

Dynamic libraries are the main way to use Kotlin code from existing programs. 
We can use them to share our code with many platforms or languages, including JVM,
[Python](https://github.com/JetBrains/kotlin-native/blob/master/samples/python_extension/src/main/c/kotlin_bridge.c),
iOS, Android, and others.

Kotlin/Native also has tight integration with Objective-C and Swift.
It is covered in the [Kotlin/Native as an Apple Framework](apple-framework.html)
tutorial.
