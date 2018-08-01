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

In the tutorial we see to use a Kotlin/Native code from an existing
application or library. We see how to compile Kotlin/Native code
into a dynamic library, `.so`, `.dylib` and `.dll` depending on the 
platform you use. 

In this tutorial we'll
 - [Compile a Kotlin code to a dynamic library](#creating-a-kotlin-library)
 - [Examine Generated C headers](#generated-headers-file)
 - [Use Kotlin dynamic library from C code](#using-generated-headers-from-c)
 - Compile adn run example [on Linux and Mac](#running-example-app-in-linux-and-macos) and [on Windows](#running-example-app-on-windows)
 
## Targeting Dynamic Library

There is an option for the Kotlin/Native compiler that
instructs it to turn our Kotlin code into a dynamic library.
A dynamic library often comes with a header files, `.h` files,
which one uses from other languages to deal with the library.
Kotlin/Native is not an exception here. 

The best way to understand the techniques is to try those techniques. 
Let's create a tiny Kotlin library first and use it from C program 
than. 
 
## Creating a Kotlin Library

Let's create the following Kotlin file, `lib.kt`:
```kotlin
package demo

object DemoObject {
  val field = "A"
}

class DemoClass {
  fun memberFunction() : Long = 42
}

fun forIntegers(b: Byte, s: Short, i: Int, l:Long) { }
fun forFloats(f: Float, d: Double) { }

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

Let's call the following command to compile the code into a dynamic library:
```bash
kotlinc lib.kt -produce dynamic -output demo
```

The compilation generates the following files, depending on the OS, 
where you run the compiler:
- macOS: `demo_api.h` and `libdemo.dylib`
- Linux: `demo_api.h` and `libdemo.so`
- Windows: `demo_api.h` and `demo.dll`

Let's check the API in the `demo_api.h` 

## Generated Headers File

In the `demo_api.h` (with Kotlin/Native v0.8.1) you'll find the following code. 
We present the code in parts to understand it easier. 

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

After the rituals block we see the common types definitions:
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

In the part we see how Kotlin type are mapped back into C types. 
We discussed the opposite mapping the the tutorial [TUTORIAL FROM PULL REQUEST], 
which you may want to check. Let's turn back to the generated header file
for our library. 

The next block in the generated `demo_api.h` file is the definition of types
that are used in the library:

```c
struct demo_KType;
typedef struct demo_KType demo_KType;

typedef struct {
  demo_KNativePtr pinned;
} demo_kref_demo_DemoObject;
typedef struct {
  demo_KNativePtr pinned;
} demo_kref_demo_DemoClazz;

```

People use `typedef struct { .. } TYPE_NAME` to declare a structure in C language. 
You may want to check [the thread](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)
for an explanation of that pattern.

We see from that definitions that Kotlin object `DemoObject` is mapped into
`demo_kref_demo_DemoObject` and `DemoClazz` is mapped into `demo_kref_demo_DemoClazz`.

There is no namespaces support in C, so that Kotlin/Native compiler generates 
long names to avoid a possible clash with other symbols of your native project.

The most significant part of definitions goes further in the `demo_api.h` file.
It includes the definition of the global state of our Kotlin/Native world:

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
        void (*forIntegers)(demo_KByte b, demo_KShort s, demo_KInt i, demo_KLong l);
        void (*forFloats)(demo_KFloat f, demo_KDouble d);
        const char* (*strings)(const char* str);
        const char* (*get_globalString)();
        struct {
          demo_KType* (*_type)(void);
          const char* (*get_field)(demo_kref_demo_DemoObject thiz);
        } DemoObject;
        struct {
          demo_KType* (*_type)(void);
          demo_kref_demo_DemoClazz (*DemoClazz)();
          demo_KLong (*memberFunction)(demo_kref_demo_DemoClazz thiz, demo_KInt p);
        } DemoClazz;
      } demo;
    } root;
  } kotlin;
} demo_ExportedSymbols;
```

The code uses anonymous structure declarations. The code `struct { .. } foo`
declares a field in the outer struct (or a global variable) of that 
anonymous structure type. 

One does not have objects in C, so people use function pointers to mimic 
object semantics. A function pointer is declared as follows `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`.
It reads tricky, and we need some time to get used to it. 

The code above reads as we have the global field `demo_ExportedSymbols` with
the only field `kotlin`, with the field `root`, and with the field `demo`. 
The path mimic the package structure of your Kotlin code with `kotlin.root` prefix.

The `kotlin` structure contains several helper functions:
```c
void (*DisposeStablePointer)(demo_KNativePtr ptr);
void (*DisposeString)(const char* string);
demo_KBoolean (*IsInstance)(demo_KNativePtr ref, const demo_KType* type);
```

Those functions help to deal with Kotlin/Native objects. One calls 
`DisposeStablePointer` to release a Kotlin object that is no longer need.
The `DisposeString` is used to release Kotlin strings from C. 
We have garbage collection in Kotlin/Native, but in the C worlds one
has to manage memory manually. Kotlin/Native objects integrates with
Objective-C and Swift reference counters. You may find more details
in the [documentation](https://github.com/JetBrains/kotlin-native/blob/master/OBJC_INTEROP.md).

We may use the `IsInstance` function to check if one type, a `demo_KNativePtr`,
which is `void*`, is an instance of a given type. 

All declarations from our Kotlin library are also included into the `kotlin.root.demo` structure.
For example, there is `kotlin.root.demo.DemoClazz` field, that 
represents the `DemoClazz`. We see the member function `memberFunction` with 
the same name as we have in Kotlin code. Member function accepts this pointer 
as the first parameter, that is how `kotlinc` emulates objects in C.

There is constructor function pointer in the `DemoClazz` field.
We may see that a readonly property `globalString` from Kotlin is turned 
into `get_globalString` function in C. 
 
One may question so far. How would I get the pointer to the `demo_ExportedSymbols`
structure. The answer is in the latest code block from the `demo_api.h`:

```c
extern demo_ExportedSymbols* demo_symbols(void);
```

The function `demo_symbols` allows one to open the door from a native 
code to Kotlin/Native code. That is the entry point we use. 
You shall note, that Kotlin/Native API is not thread safe. You 
should probably have a pointer to `demo_ExportedSymbols` in each thread.

Let's see how we use the generated dynamic library from C

## Using Generated Headers from C

The usage from C not complicated. We create a `main.c` file with the following 
code: 
```c
#include "demo_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
  demo_ExportedSymbols* lib = demo_symbols();

  lib->kotlin.root.demo.forIntegers(1, 2, 3, 4);
  lib->kotlin.root.demo.forFloats(1.0f, 2.0);

  const char* str = "Hello from Native!";
  const char* response = lib->kotlin.root.demo.strings(str);
  printf("in: %s\nout:%s\n", str, response);
  lib->DisposeString(response);

  demo_kref_demo_DemoClazz newInstance = lib->kotlin.root.demo.DemoClazz.DemoClazz();
  long x = lib->kotlin.root.demo.DemoClazz.memberFunction(newInstance, 42);
  lib->DisposeStablePointer(newInstance.pinned);

  printf("DemoClazz returned %ld\n", x);

  return 0;
}
```

## Running Example App in Linux and macOS

On macOS 10.13 with Xcode we compile the C code and link it with the dynamic library
with the following command:
```bash
gcc main.c libdemo.dylib
```

On Linux we call similar command: 
```bash
gcc main.c libdemo.so
```

The compiler generates the executable called `a.out`. We run it to see Kotlin code
being executed from C library in action. 
Note, that in Linux we'll need to include `.` to the `LD_LIBRARY_PATH` to let
the application detect the `libdemo.so` library under the same path.

## Running Example App on Windows

Microsoft Visual Studio stack differs. To start with, you need to have Microsoft Visual C++
compiler installed. The easiest way is to have a version of Visual Studio installed on 
your Windows machine. 

We will be using `x64 Native Tools Command Prompt` console. The link to open the console
is included with Visual Studio. 

On Windows on need to generate a static library wrapper that calls functions from a DLL. 
For that we need to create a `demo.def` file with the following content:
```c
EXPORTS
demo_symbols
```

The `demo_symbols` here is the name of the function we saw in the generated `demo_api.h`.
Note, it depends on the dynamic library name.

We call `lib.exe` tool to generate the `demo.lib` static library:
```bash
lib /def:demo.def /out:demo.lib
```

Now we are ready compile our `main.c` file. Let's call
```bash
cl.exe main.c demo.lib
```

The command produces the `main.exe` file, which we may run.
 

## Next Steps

Dynamic libraries are the main ways to use Kotlin code from existing programs. You may
use them share your code with many platforms, including JVM, Python, iOS, Android. 
That is the way to call your Kotlin code from C/C++, Objective-C, Swift, Java and other 
languages. 

Kotlin/Native has the dedicated integration with Apple technologies. You may compile
your code into Apple Framework and use it with Objective-C and Swift. 

