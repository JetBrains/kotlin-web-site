---
type: tutorial
layout: tutorial
title:  "Kotlin/Native as a Dynamic Library"
description: "Compiling Kotlin/Native code to a dynamic library"
authors: Eugene Petrenko
date: 2018-08-05
showAuthorInfo: false
issue: EVAN-5371
---

In this tutorial, we look at how we can use a Kotlin/Native code from
existing native applications or libraries. For this, we need to
compile our Kotlin code into a dynamic library, `.so`, `.dylib` and `.dll`.

Do you target an Apple platform? You may want to check out the 
[Kotlin/Native as an Apple Framework](apple-framework.html)
tutorial.

In this tutorial, we will:
 - [Compile a Kotlin code to a dynamic library](#creating-a-kotlin-library)
 - [Examine generated C headers](#generated-headers-file)
 - [Use the Kotlin dynamic library from C](#using-generated-headers-from-c)
 - Compile and run the example on [Linux and Mac](#compiling-and-running-the-example-on-linux-and-macos)
   and [Windows](#compiling-and-running-the-example-on-windows)
  
## Creating a Kotlin Library

Kotlin/Native compiler can produce a dynamic
library out of the Kotlin code we have.
A dynamic library often comes with a header file, an `.h` file,
which we will use to call compiled code from C

The best way to understand these techniques is to try them out. 
Let's create a tiny Kotlin library first and use it from a C program 
then. 

We can start by creating a library file in Kotlin and save it as `lib.kt`:

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

We need to have a Kotlin/Native compiler on our machines. 
You may want to have a look at the
[A Basic Kotlin/Native Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial for more information on performing this step.
Let's assume that we have a console, where the `kotlinc-native` command is available. 

Now we can call the following command to compile the code into a dynamic library:
```bash
kotlinc-native lib.kt -produce dynamic -output demo
```

The `kotlinc-native` (with v0.9.2) generates the following files, depending on the OS, 
where you run the compiler:
- macOS: `demo_api.h` and `libdemo.dylib`
- Linux: `demo_api.h` and `libdemo.so`
- Windows: `demo_api.h`, `demo_symbols.def` and `demo.dll`

Let's check the C API for our Kotlin code in the `demo_api.h` 

## Generated Headers File

In the `demo_api.h` (with Kotlin/Native v0.9.2) you'll find the following code. 
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

After the rituals in the `demo_api.h` we have a block with the common type definitions:

<div class="sample" markdown="1" mode="C" theme="idea" data-highlight-only="1" auto-indent="false">

```c
#ifdef __cplusplus
typedef bool            demo_KBoolean;
#else
typedef _Bool           demo_KBoolean;
#endif
typedef unsigned short     demo_KChar;
typedef signed char        demo_KByte;
typedef short              demo_KShort;
typedef int                demo_KInt;
typedef long long          demo_KLong;
typedef unsigned char      demo_KUByte;
typedef unsigned short     demo_KUShort;
typedef unsigned int       demo_KUInt;
typedef unsigned long long demo_KULong;
typedef float              demo_KFloat;
typedef double             demo_KDouble;
typedef void*              demo_KNativePtr;
``` 
</div>

Kotlin uses the `demo_` prefix from the library name to make sure
the symbols will not clash with other symbols in your C codebase.

The definitions part shows how Kotlin primitive types map into C primitive types. 
We discussed reverse mapping in the [Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html) tutorial, 
which you may want to check out. 

The next part of the `demo_api.h` file contains definitions of types
that are used in the library:

<div class="sample" markdown="1" mode="C" theme="idea" data-highlight-only="1" auto-indent="false">

```c
struct demo_KType;
typedef struct demo_KType demo_KType;

typedef struct {
  demo_KNativePtr pinned;
} demo_kref_example_DemoObject;

typedef struct {
  demo_KNativePtr pinned;
} demo_kref_example_DemoClazz;
```
</div>

The `typedef struct { .. } TYPE_NAME` syntax is used in C language to declare a structure. 
You may want to take a look at [the thread](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)
for an explanation of that pattern.

We see from these definitions that the Kotlin object `DemoObject` is mapped into
`demo_kref_example_DemoObject` and `DemoClazz` is mapped into `demo_kref_example_DemoClazz`.
Both structs contain nothing but the `pinned` field with a pointer, the field type 
`demo_KNativePtr` is defined as `void*` above. 

There is no namespaces support in C so that Kotlin/Native compiler generates 
long names to avoid a possible clashes with other symbols from your native project.

The most significant part of definitions goes further in the `demo_api.h` file.
It includes the definition of our Kotlin/Native library world:


<div class="sample" markdown="1" mode="C" theme="idea" data-highlight-only="1" auto-indent="false">

```c
typedef struct {
  /* Service functions. */
  void (*DisposeStablePointer)(demo_KNativePtr ptr);
  void (*DisposeString)(const char* string);
  demo_KBoolean (*IsInstance)(demo_KNativePtr ref, const demo_KType* type);

  /* User functions. */
  struct {
    struct {
      struct {
        void (*forIntegers)(demo_KByte b, demo_KShort s, demo_KUInt i, demo_KLong l);
        void (*forFloats)(demo_KFloat f, demo_KDouble d);
        const char* (*strings)(const char* str);
        const char* (*get_globalString)();
        struct {
          demo_KType* (*_type)(void);
          demo_kref_example_Object (*_instance)();
          const char* (*get_field)(demo_kref_example_Object thiz);
        } Object;
        struct {
          demo_KType* (*_type)(void);
          demo_kref_example_Clazz (*Clazz)();
          demo_KULong (*memberFunction)(demo_kref_example_Clazz thiz, demo_KInt p);
        } Clazz;
      } example;
    } root;
  } kotlin;
} demo_ExportedSymbols;
```
</div>

The code uses anonymous structure declarations. The code `struct { .. } foo`
declares a field in the outer struct of that 
anonymous structure type, the type with no name. 

C does not support objects too. People use function pointers to mimic 
object semantics. A function pointer is declared as follows `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`.
It is tricky to read, but we should be able to see function pointer fields in the structures above. 

### Runtime Functions

The code reads as follows. We have the `demo_ExportedSymbols` structure which defines
all the functions that Kotlin/Native and our library provides to us. It uses 
nested anonymous structures heavily to mimic packages. The `demo_` prefix comes from the
library name.

The `demo_ExportedSymbols` structure contains several helper functions:

<div class="sample" markdown="1" mode="C" theme="idea" data-highlight-only="1" auto-indent="false">

```c
void (*DisposeStablePointer)(demo_KNativePtr ptr);
void (*DisposeString)(const char* string);
demo_KBoolean (*IsInstance)(demo_KNativePtr ref, const demo_KType* type);
```
</div>

These functions deal with Kotlin/Native objects. Call the 
`DisposeStablePointer` to release a Kotlin object and `DisposeString` to release Kotlin String, 
which has the `char*` type in C. It is possible to use the `IsInstance` function to check if a
Kotlin type or a `demo_KNativePtr` is an instance of another type. The actual set of
operations generated depend on the actual usage of your code.
 
Kotlin/Native has garbage collection, but it does not help deal
with Kotlin objects from the C language. Kotlin/Native has interop with Objective-C and 
Swift and integrates with their reference counters. You may want to find more details
in the [Objective-C Interop](https://github.com/JetBrains/kotlin-native/blob/master/OBJC_INTEROP.md)
documentation or to check the related tutorial named [Kotlin/Native as an Apple Framework](apple-framework.html).

### Our Library Functions

Let's take a look an the `kotlin.root.example` field, it
mimics the package structure of our Kotlin code with a `kotlin.root.` prefix.

There is a `kotlin.root.example.Clazz` field that 
represents the `Clazz` from Kotlin. The `Clazz#memberFunction` is
accessible with the `memberFunction` field. The only difference is that 
the `memberFunction` accepts `this` reference as the first parameter. 
C language does not support objects, and that is the reason to pass a
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
`demo_ExportedSymbols` structure. Let's take a look at the latest part 
of the `demo_api.h` for that:

```c
extern demo_ExportedSymbols* demo_symbols(void);
```

The function `demo_symbols` allows us to open the door from the native 
code to the Kotlin/Native library. That is the entry point we use. The 
library name is used as a prefix for the function name. 


Note, Kotlin/Native object references do not support multi-threaded access. 
Hosting the returned `demo_ExportedSymbols*` pointer
per thread might be necessary.

## Using Generated Headers from C

The usage from C is straightforward and uncomplicated. We create a `main.c` file with the following 
code: 

<div class="sample" markdown="1" mode="C" theme="idea" data-highlight-only="1" auto-indent="false">

```c
#include "demo_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
  //obtain reference for calling Kotlin/Native functions
  demo_ExportedSymbols* lib = demo_symbols();

  lib->kotlin.root.example.forIntegers(1, 2, 3, 4);
  lib->kotlin.root.example.forFloats(1.0f, 2.0);

  //use C and Kotlin/Native strings
  const char* str = "Hello from Native!";
  const char* response = lib->kotlin.root.example.strings(str);
  printf("in: %s\nout:%s\n", str, response);
  lib->DisposeString(response);

  //create Kotlin object instance
  demo_kref_example_Clazz newInstance = lib->kotlin.root.example.Clazz.Clazz();
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
clang main.c libdemo.dylib
```

On Linux we call a similar command: 
```bash
gcc main.c libdemo.so
```

The compiler generates an executable called `a.out`. We need to run it to see Kotlin code
being executed from C library in action. On Linux, we'll need to include `.` into the `LD_LIBRARY_PATH`
to let the application know to load the `libdemo.so` library from the current folder.

## Compiling and Running the Example on Windows

To start with, you'll need a Microsoft Visual C++ compiler installed that supports a x64_64 
target. The easiest way to do this is to have a version of Microsoft Visual Studio installed on 
your Windows machine. 

We will be using the `x64 Native Tools Command Prompt <VERSION>` console. You'll see the 
shortcut to open the console in the start menu. It comes with a Microsoft Visual Studio
package.  

On Windows, Dynamic libraries are included either via a generated static library wrapper
or with manual code which deals with the [LoadLibrary](https://msdn.microsoft.com/en-us/library/windows/desktop/ms684175.aspx)
or similar Win32API functions. We will follow the first option and generate the static wrapper library
for the `demo.dll` on our own.
 
We call `lib.exe` from the toolchain to generate the static library 
wrapper `demo.lib` that automates the DLL usage from the code:
```bash
lib /def:demo_symbols.def /out:demo.lib
```

Now we are ready to compile our `main.c` into an executable. We include the generated `demo.lib` into
the build command and start:
```bash
cl.exe main.c demo.lib
```

The command produces the `main.exe` file, which we can run.
 

## Next Steps

Dynamic libraries are the main ways to use Kotlin code from existing programs. 
You may use them to share your code with many platforms or languages, including JVM,
[Python](https://github.com/JetBrains/kotlin-native/blob/master/samples/python_extension/src/main/c/kotlin_bridge.c),
iOS, Android, and others.

Kotlin/Native also has tight integration with Objective-C and Swift. 
You may want to check out the [Kotlin/Native as an Apple Framework](apple-framework.html)
tutorial.
