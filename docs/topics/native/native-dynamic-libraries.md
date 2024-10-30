[//]: # (title: Kotlin/Native as a dynamic library – tutorial)

Dynamic libraries are the main way to use Kotlin code from existing programs. You can use them to share your code with
many platforms or languages, including JVM, Python, iOS, Android, and others.

You can use the Kotlin/Native code from existing native applications or libraries. For this, you need to
compile the Kotlin code into a dynamic library with the `.so`, `.dylib`, or `.dll` format.

In this tutorial, you will:

* [Compile Kotlin code to a dynamic library](#create-a-kotlin-library)
* [Examine generated C headers](#generated-header-file)
* [Use the Kotlin dynamic library from C](#use-generated-headers-from-c)
* [Compile and run the project](#compile-and-run-the-project)

While it's possible to use the command line, either directly or by combining it with a script file
(such as `.sh` or `.bat` file), this approach doesn't scale well for big projects that have hundreds of files and libraries.
Therefore, it's better to use a build system for compilation, as it helps to download and cache the Kotlin/Native
compiler binaries and libraries with transitive dependencies and run the compiler and tests.
Kotlin/Native can use the [Gradle](https://gradle.org) build system through the [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms).

Let's examine the advanced C interop-related usages of Kotlin/Native and [Kotlin Multiplatform](gradle-configure-project.md#targeting-multiple-platforms) builds with Gradle.

## Create a Kotlin library

Kotlin/Native compiler can produce a dynamic library from the Kotlin code. A dynamic library often comes with a `.h`
header file, which you use to call the compiled code from C.

Let's create a Kotlin library and use it from a C program.

> See the [Get started with Kotlin/Native using Gradle](native-gradle.md) tutorial for detailed first steps
> and instructions on how to create a new Kotlin/Native project and open it in IntelliJ IDEA.
>
{style="tip"}

1. Navigate to the `src/nativeMain/kotlin` directory and create the `lib.kt` file with the following library contents:

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

2. Update your `build.gradle(.kts)` Gradle build file with the following:

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
        macosArm64("native") {  // Apple Silicon macOS
        // linuxX64("native") { // Linux 
        // macosX64("native") { // x86_64 macOS
        // mingwX64("native") { // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS and Linux 
                    // baseName = "libnative" // Windows
                }
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
        macosArm64("native") {  // Apple Silicon macOS
        // macosX64("native") { // x86_64 macOS
        // linuxX64("native") { // Linux
        // mingwX64("native") { // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS and Linux 
                    // baseName = "libnative" // Windows
                }
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

    * The `binaries {}` block configures the project to generate a dynamic or shared library.
    * The `libnative` is used as the library name, the prefix for the generated header file name. It also prefixes all
      declarations in the header file.

3. Run the `linkDebuSharedNative` Gradle task to build the library in the IDE or call the following console command:

   ```bash
   ./gradlew linkDebuSharedNative
   ```

The build generates the library into the `build/bin/native/debugShared` directory with the following files:

* macOS `libnative_api.h` and `libnative.dylib`
* Linux: `libnative_api.h` and `libnative.so`
* Windows: `libnative_api.h`, `libnative_symbols.def`, and `libnative.dll`

> You can also use the `linkNative` Gradle task to generate both `debug` and `release` variants of the library. 
> 
{style="tip"}

The Kotlin/Native compiler uses the same rules to generate the `.h` file for all platforms. Let's check out the C API of
the Kotlin library.

## Generated header file

Let's examine how C functions are mapped into Kotlin/Native declarations.

In the `build/bin/native/debugShared` directory, open the `libnative_api.h` header file.
The very first part contains the standard C/C++ header and footer:

```c
#ifndef KONAN_LIBNATIVE_H
#define KONAN_LIBNATIVE_H
#ifdef __cplusplus
extern "C" {
#endif

/// THE REST OF THE GENERATED CODE GOES HERE

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_LIBNATIVE_H */
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
typedef float __attribute__ ((__vector_size__ (16))) libnative_KVector128;
typedef void*              libnative_KNativePtr;
``` 

Kotlin uses the `libnative_` prefix for all declarations in the created `libnative_api.h` file. Here's the complete list
of type mappings:

| Kotlin definition      | C type                                        |
|------------------------|-----------------------------------------------|
| `libnative_KBoolean`   | `bool` or `_Bool`                             |
| `libnative_KChar`      | `unsigned short`                              |
| `libnative_KByte`      | `signed char`                                 |
| `libnative_KShort`     | `short`                                       |
| `libnative_KInt`       | `int`                                         |
| `libnative_KLong`      | `long long`                                   |
| `libnative_KUByte`     | `unsigned char`                               |
| `libnative_KUShort`    | `unsigned short`                              |
| `libnative_KUInt`      | `unsigned int`                                |
| `libnative_KULong`     | `unsigned long long`                          |
| `libnative_KFloat`     | `float`                                       |
| `libnative_KDouble`    | `double`                                      |
| `libnative_KVector128` | `float __attribute__ ((__vector_size__ (16))` |
| `libnative_KNativePtr` | `void*`                                       |

The definitions part shows how Kotlin primitive types map into C primitive types.
The reverse mapping is described in the [Mapping primitive data types from C](mapping-primitive-data-types-from-c.md) tutorial.

The next part of the `libnative_api.h` file contains definitions of the types that are used in the library:

```c
struct libnative_KType;
typedef struct libnative_KType libnative_KType;

typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_kotlin_Byte;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_kotlin_Short;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_kotlin_Int;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_kotlin_Long;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_kotlin_Float;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_kotlin_Double;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_kotlin_Char;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_kotlin_Boolean;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_kotlin_Unit;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_kotlin_UByte;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_kotlin_UShort;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_kotlin_UInt;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_kotlin_ULong;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Object;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Clazz;
```

The `typedef struct { ... } TYPE_NAME` syntax is used in C language to declare a structure.

> See [this StackOverflow thread](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions) for
> more explanations of that pattern.
>
{style="tip"}

As you can see from these definitions, Kotlin types are mapped using the same pattern: `Object` is mapped into
`libnative_kref_example_Object`, `Clazz` is mapped into `libnative_kref_example_Clazz`, and so on. All structs contain
nothing but the `pinned` field with a pointer. The field type `libnative_KNativePtr` is defined as `void*` above.

C doesn't support namespaces, so the Kotlin/Native compiler generates long names to avoid any possible clashes
with other symbols in the existing native project.

The next part of the `libnative_api.h` file consists of structure declarations of runtime and user library functions:

```c
typedef struct {
  /* Service functions. */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
  libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
  libnative_kref_kotlin_Byte (*createNullableByte)(libnative_KByte);
  libnative_KByte (*getNonNullValueOfByte)(libnative_kref_kotlin_Byte);
  libnative_kref_kotlin_Short (*createNullableShort)(libnative_KShort);
  libnative_KShort (*getNonNullValueOfShort)(libnative_kref_kotlin_Short);
  libnative_kref_kotlin_Int (*createNullableInt)(libnative_KInt);
  libnative_KInt (*getNonNullValueOfInt)(libnative_kref_kotlin_Int);
  libnative_kref_kotlin_Long (*createNullableLong)(libnative_KLong);
  libnative_KLong (*getNonNullValueOfLong)(libnative_kref_kotlin_Long);
  libnative_kref_kotlin_Float (*createNullableFloat)(libnative_KFloat);
  libnative_KFloat (*getNonNullValueOfFloat)(libnative_kref_kotlin_Float);
  libnative_kref_kotlin_Double (*createNullableDouble)(libnative_KDouble);
  libnative_KDouble (*getNonNullValueOfDouble)(libnative_kref_kotlin_Double);
  libnative_kref_kotlin_Char (*createNullableChar)(libnative_KChar);
  libnative_KChar (*getNonNullValueOfChar)(libnative_kref_kotlin_Char);
  libnative_kref_kotlin_Boolean (*createNullableBoolean)(libnative_KBoolean);
  libnative_KBoolean (*getNonNullValueOfBoolean)(libnative_kref_kotlin_Boolean);
  libnative_kref_kotlin_Unit (*createNullableUnit)(void);
  libnative_kref_kotlin_UByte (*createNullableUByte)(libnative_KUByte);
  libnative_KUByte (*getNonNullValueOfUByte)(libnative_kref_kotlin_UByte);
  libnative_kref_kotlin_UShort (*createNullableUShort)(libnative_KUShort);
  libnative_KUShort (*getNonNullValueOfUShort)(libnative_kref_kotlin_UShort);
  libnative_kref_kotlin_UInt (*createNullableUInt)(libnative_KUInt);
  libnative_KUInt (*getNonNullValueOfUInt)(libnative_kref_kotlin_UInt);
  libnative_kref_kotlin_ULong (*createNullableULong)(libnative_KULong);
  libnative_KULong (*getNonNullValueOfULong)(libnative_kref_kotlin_ULong);

  /* User functions. */
  struct {
    struct {
      struct {
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
        const char* (*get_globalString)();
        void (*forFloats)(libnative_KFloat f, libnative_KDouble d);
        void (*forIntegers)(libnative_KByte b, libnative_KShort s, libnative_KUInt i, libnative_KLong l);
        const char* (*strings)(const char* str);
      } example;
    } root;
  } kotlin;
} libnative_ExportedSymbols;
```

The code uses anonymous structure declarations. Here, `struct { ... } foo` declares a field in the outer struct of that
anonymous structure type, the type with no name.

C doesn't support objects either, so function pointers are used to mimic object semantics. A function pointer is declared
as `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`.

### Runtime functions

The code reads as follows. You have the `libnative_ExportedSymbols` structure, which defines all the functions that
Kotlin/Native and your library provide. It uses nested anonymous structures heavily to mimic packages. The `libnative_`
prefix comes from the library name.

The `libnative_ExportedSymbols` structure has several helper functions in the header file:

```c
void (*DisposeStablePointer)(libnative_KNativePtr ptr);
void (*DisposeString)(const char* string);
libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
```

These functions deal with Kotlin/Native objects. `DisposeStablePointer` is called to release a Kotlin object, and
`DisposeString` is called to release a Kotlin String, which has the `char*` type in C. It's possible to use the
`IsInstance` function to check if a Kotlin type or a `libnative_KNativePtr` is an instance of another type. The actual
set of operations generated depends on actual usages.

Kotlin/Native has garbage collector, but it doesn't help deal with Kotlin objects from the C language. However,
Kotlin/Native provides [interoperability with Swift/Objective-C](native-objc-interop.md), and the garbage collector is [integrated with Objective-C/Swift ARC](native-arc-integration.md).

### Your library functions

Let's take a look at the `libnative_kref_example` field. It mimics the package structure of your Kotlin code with a
`libnative_kref.` prefix.

There is a `libnative_kref_example_Clazz` field that represents the `Clazz` from Kotlin. The `libnative_KULong` is
accessible with the `memberFunction` field. The only difference is that the `memberFunction` accepts a `thiz` reference as
the first parameter. The C language doesn't support objects, which is why `thiz` pointer should be passed explicitly.

There is a constructor in the `Clazz` field (aka `libnative_kref_example_Clazz_Clazz`), which is the constructor function
to create an instance of the `Clazz`.

Kotlin `object Object` is accessible as `libnative_kref_example_Object`. There's the `_instance` function to get the only
instance of the object.

Properties are translated into functions. The `get_` and `set_` prefixes name the getter and the setter functions,
respectively. For example, the read-only property `globalString` from Kotlin is turned into a `get_globalString`
function in C.

Global functions `forFloats`, `forIntegers`, and `strings` are turned into functions pointers in the `libnative_kref_example`
anonymous struct.

### Entry point

You can see how the API is created. To start with, you need to initialize the `libnative_ExportedSymbols` structure.
Let's take a look at the final part of the `libnative_api.h` for this:

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

The function `libnative_symbols` allows you to open the way from the native code to the Kotlin/Native library. This is
the entry point you'll use. The library name is used as a prefix for the function name.

> Kotlin/Native object references don't support multithreaded access. Hosting the returned `libnative_ExportedSymbols*`
> pointer per thread might be necessary.
>
{style="note"}

## Use generated headers from C

The usage from C is straightforward. In the library directory, create the `main.c` file with the following code:

```c
#include "libnative_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
  // Obtain reference for calling Kotlin/Native functions
  libnative_ExportedSymbols* lib = libnative_symbols();

  lib->kotlin.root.example.forIntegers(1, 2, 3, 4);
  lib->kotlin.root.example.forFloats(1.0f, 2.0);

  // Use C and Kotlin/Native strings
  const char* str = "Hello from Native!";
  const char* response = lib->kotlin.root.example.strings(str);
  printf("in: %s\nout:%s\n", str, response);
  lib->DisposeString(response);

  // Create Kotlin object instance
  libnative_kref_example_Clazz newInstance = lib->kotlin.root.example.Clazz.Clazz();
  long x = lib->kotlin.root.example.Clazz.memberFunction(newInstance, 42);
  lib->DisposeStablePointer(newInstance.pinned);

  printf("DemoClazz returned %ld\n", x);

  return 0;
}
```

## Compile and run the project

### On macOS

To compile the C code and link it with the dynamic library, navigate to the library directory and run the following command:

```bash
clang main.c libnative.dylib
```

The compiler generates an executable called `a.out`. Run it to see the Kotlin code executed from the C library.

### On Linux

To compile the C code and link it with the dynamic library, navigate to the library directory and run the following command:

```bash
gcc main.c libnative.so
```

The compiler generates an executable called `a.out`. Run it to see the Kotlin code executed from the C library. On
Linux, you need to include `.` into the `LD_LIBRARY_PATH` to let the application know to load the `libnative.so`
library from the current folder.

### On Windows

First, you'll need to install a Microsoft Visual C++ compiler that supports the x64_64 target. The easiest way to
do this is to install a version of Microsoft Visual Studio on a Windows machine.

In this example, you'll use the `x64 Native Tools Command Prompt <VERSION>` console. You'll see the shortcut to
open the console in the start menu. It comes with a Microsoft Visual Studio package.

On Windows, dynamic libraries are included either via a generated static library wrapper or with manual code,
which deals with the [LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya)
or similar Win32API functions.

Follow the first option and generate the static wrapper library for the `libnative.dll`:

1. Call `lib.exe` from the toolchain to generate the static library wrapper `libnative.lib` that automates the DLL usage
   from the code:

   ```bash
   lib /def:libnative_symbols.def /out:libnative.lib
   ```

2. Compile your `main.c` into an executable. Include the generated `libnative.lib` into the build command and start:

   ```bash
   cl.exe main.c libnative.lib
   ```

   The command produces the `main.exe` file, which you can run.

## What's next

* [Learn more about interoperability with Swift/Objective-C](native-objc-interop.md)
* [Check out the Kotlin/Native as an Apple framework tutorial](apple-framework.md)