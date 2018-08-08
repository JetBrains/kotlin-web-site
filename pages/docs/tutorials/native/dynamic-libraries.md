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

In the tutorial, we see how to use a Kotlin/Native code from
an existing native applications or libraries. For that we 
compile our Kotlin code into a dynamic library, `.so`, `.dylib` and `.dll`.

Targeting Apple platform? You may want to see the 
[Kotlin/Native as an Apple Framework](apple-framework.html)
tutorial.

In this tutorial, we will:
 - [Compile a Kotlin code to a dynamic library](#creating-a-kotlin-library)
 - [Examine generated C headers](#generated-headers-file)
 - [Use the Kotlin dynamic library from C](#using-generated-headers-from-c)
 - Compile and run the example [on Linux and Mac](#compiling-and-running-the-example-on-linux-and-macos)
   and [on Windows](#compiling-and-running-the-example-on-windows)
  
## Creating a Kotlin Library

Kotlin/Native compiler is able to produce a dynamic
library out of the Kotlin code we have.
A produced dynamic library often comes with a header file, an `.h` file,
which we use to call compiled code from C

The best way to understand the techniques is to try those techniques. 
Let's create a tiny Kotlin library first and use it from C program 
than. 

Let's create a library file in Kotlin and save it as `lib.kt`:
```kotlin
package demo

class DemoClass {
  fun foo() : Long = 42
}

fun ints(b: Byte, s: Short, i: Int, l:Long) { }
fun floats(f: Float, d: Double) { }

fun strings(str: String) : String {
  return "That is '$str' from C"
}

val globalString = "A global String"
```

We need to have a Kotlin/Native compiler on our machines. 
You may have a look at the
[A Basic Kotlin/Native Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial for more information on performing this step.
Let's assume we have a console, where `kotlinc` command is available. 

Now we call the following command to compile the code into a dynamic library:
```bash
kotlinc lib.kt -produce dynamic -output demo
```

The `kotlinc` generates the following files, depending on the OS, 
where you run the compiler:
- macOS: `demo_api.h` and `libdemo.dylib`
- Linux: `demo_api.h` and `libdemo.so`
- Windows: `demo_api.h` and `demo.dll`

Let's check the C API for our Kotlin code in the `demo_api.h` 

## Generated Headers File

In the `demo_api.h` (with Kotlin/Native v0.8.1) you'll find the following code. 
We discuss the code in parts to understand it easier. 

The very first part contains standard C/C++ header and footer:
```c
#ifndef KONAN_DEMO_H
#define KONAN_DEMO_H
#ifdef __cplusplus
extern "C" {
#endif

/// HERE GOES THE REST OF THE GENERATED CODE

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_DEMO_H */
```

After the rituals in the `demo_api.h` we have the block with common type definitions:
```c
#ifdef __cplusplus
typedef bool            demo_KBoolean;
#else
typedef _Bool           demo_KBoolean;
#endif
typedef char            demo_KByte;
typedef unsigned short  demo_KChar;
typedef short           demo_KShort;
typedef int             demo_KInt;
typedef long long       demo_KLong;
typedef float           demo_KFloat;
typedef double          demo_KDouble;
typedef void*           demo_KNativePtr;
struct demo_KType;
``` 

Kotlin uses `demo_` prefix from the library name to make sure
the symbols will not clash with other symbols in your C codebase.

The definitions part shows how Kotlin primitive types map into C primitive types. 
We discussed the opposite mapping the tutorial [INSERT THE LINK TO THE TUTORIAL FROM ANOTHER PULL REQUEST], 
which you may want to check out. 

The next part of the `demo_api.h` file contains definition of types
that are used in the library:

```c
struct demo_KType;
typedef struct demo_KType demo_KType;

typedef struct {
  demo_KNativePtr pinned;
} demo_kref_demo_DemoClazz;

```

The `typedef struct { .. } TYPE_NAME` syntax is used in C language to declare a structure. 
You may want to check [the thread](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)
for an explanation of that pattern.

We see from that definitions that Kotlin object `DemoObject` is mapped into
`demo_kref_demo_DemoObject` and `DemoClazz` is mapped into `demo_kref_demo_DemoClazz`.
Both structs contains nothing but the `pinned` field with a pointer, the field type 
`demo_KNativePtr` is defined as `void*` above. 

There is no namespaces support in C, so that Kotlin/Native compiler generates 
long names to avoid a possible clash with other symbols of your native project.

The most significant part of definitions goes further in the `demo_api.h` file.
It includes the definition of our Kotlin/Native library world:

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
        void (*ints)(demo_KByte b, demo_KShort s, demo_KInt i, demo_KLong l);
        void (*floats)(demo_KFloat f, demo_KDouble d);
        const char* (*strings)(const char* str);
        const char* (*get_globalString)();
        struct {
          demo_KType* (*_type)(void);
          demo_kref_demo_DemoClazz (*DemoClazz)();
          demo_KLong (*foo)(demo_kref_demo_DemoClazz thiz, demo_KInt p);
        } DemoClazz;
      } demo;
    } root;
  } kotlin;
} demo_ExportedSymbols;
```

The code uses anonymous structure declarations. The code `struct { .. } foo`
declares a field in the outer struct of that 
anonymous structure type, the type with no name. 

C does not support objects too. People use function pointers to mimic 
object semantics. A function pointer is declared as follows `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`.
It reads tricky, but we should be able to see function pointer fields in the structures above. 

### Runtime Functions

The code reads as follows. We have the `demo_ExportedSymbols` structure which defines
all functions that Kotlin/Native and our library provides to us. It heavily uses 
nested anonymous structures to mimic packages.

The `demo_ExportedSymbols` structure contains several helper functions:
```c
void (*DisposeStablePointer)(demo_KNativePtr ptr);
void (*DisposeString)(const char* string);
demo_KBoolean (*IsInstance)(demo_KNativePtr ref, const demo_KType* type);
```

Those functions deals with Kotlin/Native objects. One calls 
`DisposeStablePointer` to release a Kotlin object and `DisposeString` to release Kotlin String, 
which has the `char*` type in C. One may use the `IsInstance` function to check, if a
Kotlin type, a `demo_KNativePtr` is an instance of another type. 
 
Kotlin/Native has garbage collection, but it does not help to deal
with Kotlin objects from C language. Kotlin/Native has an interop with Objective-C and 
Swift, and integrates with their reference counters. You may want to find more details
in the [documentation](https://github.com/JetBrains/kotlin-native/blob/master/OBJC_INTEROP.md)
or to check the related [TUTORIAL_KOTLIN_macOS_FRAMEWORK_LINK].

### Our Library Functions

Let's take a look on the nests structure with path `kotlin.root.demo`. The path 
mimics the package structure of our Kotlin code with `kotlin.root.` prefix.

There is `kotlin.root.demo.DemoClazz` field, that 
represents the `DemoClazz` from Kotlin. The `DemoClazz#foo` is
represented with the `foo` field. The only difference is that 
the `foo` accepts `this` reference as the first parameter. 
C language does not support objects and that is the reason to pass
`this` pointer explicitly.

There is constructor the `DemoClazz` field (aka `kotlin.root.demo.DemoClazz.DemoClazz`),
which is the constructor function to create an instance of the `DemoClazz`.

Properties are translated into functions too. The `get_` and `set_` prefix
is used to name the getter and the setter functions respectively. For example, 
the readonly property `globalString` from Kotlin is turned 
into the `get_globalString` function in C. 

Global functions `ints`, `floats` or `strings` are turned into functions pointers in
the `kotlin.root.demo` anonymous struct.
 
### The Entry Point

We see how API is created. To start with, we need to initialize the 
`demo_ExportedSymbols` structure. Let's take a look at the latest part 
of the `demo_api.h` for that:

```c
extern demo_ExportedSymbols* demo_symbols(void);
```

The function `demo_symbols` allows us to open the door from a native 
code to Kotlin/Native library. That is the entry point we use. The 
library name is used as the prefix for the function name. 


Kotlin/Native object references does not support multi-threaded access. It
might be necessary to host the returned `demo_ExportedSymbols*` pointer
per thread.

## Using Generated Headers from C

The usage from C not complicated and strait forward. We create a `main.c` file with the following 
code: 
```c
#include "demo_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
  //initialize Kotlin/Native library
  demo_ExportedSymbols* lib = demo_symbols();

  //call functions
  lib->kotlin.root.demo.ints(1, 2, 3, 4);
  lib->kotlin.root.demo.floats(1.0f, 2.0);

  //use C and Kotlin/Native strings
  const char* str = "Hello from Native!";
  const char* response = lib->kotlin.root.demo.strings(str);
  printf("in: %s\nout:%s\n", str, response);
  lib->DisposeString(response);

  //create Kotlin object instance
  demo_kref_demo_DemoClazz newInstance 
          = lib->kotlin.root.demo.DemoClazz.DemoClazz();
  long result = lib->kotlin.root.demo.DemoClazz.foo(newInstance, 42);
  printf("DemoClazz returned %ld\n", result);
  lib->DisposeStablePointer(newInstance.pinned);

  return 0;
}
```

## Compiling and Running the Example on Linux and macOS

On macOS 10.13 with Xcode, we compile the C code and link it with the dynamic library
with the following command:
```bash
gcc main.c libdemo.dylib
```

On Linux we call the similar command: 
```bash
gcc main.c libdemo.so
```

The compiler generates the executable called `a.out`. We run it to see Kotlin code
being executed from C library in action. On Linux we'll need to include `.` into the `LD_LIBRARY_PATH`
to let the application to load the `libdemo.so` library from the current folder.

## Compiling and Running the Example on Windows

To start with, you'll need Microsoft Visual C++ compiler installed and support AMD x64 
target. The easiest way is to have a version of Microsoft Visual Studio installed on 
your Windows machine. 

We will be using `x64 Native Tools Command Prompt <VERSION>` console. You'll see the 
shortcut to open the console in the start menu. It comes with a Microsoft Visual Studio
package.  

On Windows Dynamic libraries are included either via a special static library wrappers,
or via a manual code with the [LoadLibrary](https://msdn.microsoft.com/en-us/library/windows/desktop/ms684175.aspx)
function call. We will follow the first option and generate the static wrapper library
by our owns.
 
We need to create a `demo.def` file with the following content:
```c
EXPORTS
demo_symbols
```

The `demo_symbols` here is the name of the library [entry point function](#the-entry-point)
function from the `demo_api.h` file. The symbol name depends on the dynamic library name.

We call `lib.exe` to generate the static library `demo.lib`:
```bash
lib /def:demo.def /out:demo.lib
```

Now we are ready compile our `main.c` into an executable. We include the generated `demo.lib` into
the build command and start:
```bash
cl.exe main.c demo.lib
```

The command produces the `main.exe` file, which we may run.
 

## Next Steps

Dynamic libraries are the main ways to use Kotlin code from existing programs. 
You may use them share your code with many platforms or languages, including JVM,
[Python](https://github.com/JetBrains/kotlin-native/blob/master/samples/python_extension/src/main/c/kotlin_bridge.c),
iOS, Android and others. There is the dedicated support for Objective-C, Swift interop[TUTORIAL_FOR_FRAMEWORKS_LINK]

Kotlin/Native also have tight integration with Objective-C and Swift. You 
You may want to see the [Kotlin/Native as an Apple Framework](apple-framework.html)
tutorial.
