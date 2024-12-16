[//]: # (title: Kotlin/Native as a dynamic library – tutorial)

You can create dynamic libraries to use Kotlin code from existing programs. This enables code sharing across
many platforms or languages, including JVM, Python, Android, and others.

> For iOS and other Apple targets, we recommend generating a framework. See the [Kotlin/Native as an Apple framework](apple-framework.md) tutorial.
> 
{style="tip"}

You can use the Kotlin/Native code from existing native applications or libraries. For this, you need to
compile the Kotlin code into a dynamic library in the `.so`, `.dylib`, or `.dll` format.

In this tutorial, you will:

* [Compile Kotlin code to a dynamic library](#create-a-kotlin-library)
* [Examine generated C headers](#generated-header-file)
* [Use the Kotlin dynamic library from C](#use-generated-headers-from-c)
* [Compile and run the project](#compile-and-run-the-project)

You can use the command line to generate a Kotlin library, either directly or with a script file (such as `.sh` or `.bat` file).
However, this approach doesn't scale well for big projects that have hundreds of files and libraries.
Using a build system simplifies the process by downloading and caching the Kotlin/Native
compiler binaries and libraries with transitive dependencies, and by running the compiler and tests.
Kotlin/Native can use the [Gradle](https://gradle.org) build system through the [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms).

Let's examine the advanced C interop-related usages of Kotlin/Native and [Kotlin Multiplatform](gradle-configure-project.md#targeting-multiple-platforms) builds with Gradle.

> If you use a Mac and want to create and run applications for macOS or other Apple targets, you also need to install
> the [Xcode Command Line Tools](https://developer.apple.com/download/), launch it, and accept the license terms first.
>
{style="note"}

## Create a Kotlin library

The Kotlin/Native compiler can produce a dynamic library from the Kotlin code. A dynamic library often comes with a `.h`
header file, which you use to call the compiled code from C.

Let's create a Kotlin library and use it from a C program.

> See the [Get started with Kotlin/Native](native-get-started.md#using-gradle) tutorial for detailed first steps
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
        macosArm64("native") {    // macOS on Apple Silicon
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // Windows
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
        macosArm64("native") {    // Apple Silicon macOS
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // Windows
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
    * `libnative` is used as the library name, the prefix for the generated header file name. It also prefixes all
      declarations in the header file.

3. Run the `linkDebugSharedNative` Gradle task in the IDE or use the following console command in your terminal to build
   the library:

   ```bash
   ./gradlew linkDebugSharedNative
   ```

The build generates the library into the `build/bin/native/debugShared` directory with the following files:

* macOS `libnative_api.h` and `libnative.dylib`
* Linux: `libnative_api.h` and `libnative.so`
* Windows: `libnative_api.h`, `libnative.def`, and `libnative.dll`

> You can also use the `linkNative` Gradle task to generate both `debug` and `release` variants of the library. 
> 
{style="tip"}

The Kotlin/Native compiler uses the same rules to generate the `.h` file for all platforms. Let's check out the C API of
the Kotlin library.

## Generated header file

Let's examine how Kotlin/Native declarations are mapped to C functions.

In the `build/bin/native/debugShared` directory, open the `libnative_api.h` header file.
The very first part contains the standard C/C++ header and footer:

```c
#ifndef KONAN_LIBNATIVE_H
#define KONAN_LIBNATIVE_H
#ifdef __cplusplus
extern "C" {
#endif

/// The rest of the generated code

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_LIBNATIVE_H */
```

Following this, the `libnative_api.h` includes a block with the common type definitions:

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

The definition section of the `libnative_api.h` file shows how Kotlin primitive types are mapped to C primitive types.
The Kotlin/Native compiler generates these entries automatically for every library. 
The reverse mapping is described in the [Mapping primitive data types from C](mapping-primitive-data-types-from-c.md) tutorial.

After the automatically generated type definitions, you'll find the separate type definitions used in your library:

```c
struct libnative_KType;
typedef struct libnative_KType libnative_KType;

/// Automatically generated type definitions

typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Object;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Clazz;
```

In C, the `typedef struct { ... } TYPE_NAME` syntax declares the structure.

> See [this StackOverflow thread](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions) for
> more explanations of this pattern.
>
{style="tip"}

As you can see from these definitions, Kotlin types are mapped using the same pattern: `Object` is mapped to
`libnative_kref_example_Object`, and `Clazz` is mapped to `libnative_kref_example_Clazz`. All structs contain nothing
but the `pinned` field with a pointer. The field type `libnative_KNativePtr` is defined as `void*` earlier in the file.

Since C doesn't support namespaces, the Kotlin/Native compiler generates long names to avoid any possible clashes
with other symbols in the existing native project.

### Service runtime functions

The `libnative_ExportedSymbols` structure defines all the functions provided by Kotlin/Native and your library.
It uses nested anonymous structures heavily to mimic packages. The `libnative_` prefix comes from the library name.

`libnative_ExportedSymbols` includes several helper functions in the header file:

```c
typedef struct {
  /* Service functions. */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

These functions deal with Kotlin/Native objects. `DisposeStablePointer` is called to release a reference to a Kotlin object,
and `DisposeString` is called to release a Kotlin string, which has the `char*` type in C.

The next part of the `libnative_api.h` file consists of structure declarations of runtime functions:

```c
libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
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
```

You can use the `IsInstance` function to check if a Kotlin object (referenced with its `.pinned` pointer)
is an instance of a type. The actual set of operations generated depends on actual usages.

> Kotlin/Native has its own garbage collector, but it doesn't manage Kotlin objects accessed from C. However,
> Kotlin/Native provides [interoperability with Swift/Objective-C](native-objc-interop.md),
> and the garbage collector is [integrated with Swift/Objective-C ARC](native-arc-integration.md).
>
{style="tip"}

### Your library functions

Let's take a look at the separate structure declarations used in your library. The `libnative_kref_example` field mimics
the package structure of your Kotlin code with a `libnative_kref.` prefix:

```c
typedef struct {
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

The code uses anonymous structure declarations. Here, `struct { ... } foo` declares a field in the outer struct of the
anonymous structure type, which has no name.

Since C doesn't support objects either, function pointers are used to mimic object semantics. A function pointer is declared
as `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`.

The `libnative_kref_example_Clazz` field represents the `Clazz` from Kotlin. The `libnative_KULong` is
accessible with the `memberFunction` field. The only difference is that the `memberFunction` accepts a `thiz` reference
as the first parameter. Since C doesn't support objects, the `thiz` pointer is passed explicitly.

There is a constructor in the `Clazz` field (aka `libnative_kref_example_Clazz_Clazz`), which acts as the constructor
function to create an instance of the `Clazz`.

The Kotlin `object Object` is accessible as `libnative_kref_example_Object`. The `_instance` function retrieves the only
instance of the object.

Properties are translated into functions. The `get_` and `set_` prefixes name the getter and the setter functions,
respectively. For example, the read-only property `globalString` from Kotlin is turned into a `get_globalString`
function in C.

Global functions `forFloats`, `forIntegers`, and `strings` are turned into functions pointers in the `libnative_kref_example`
anonymous struct.

### Entry point

Now you know how the API is created, the initialization of the `libnative_ExportedSymbols` structure is the starting point.
Let's then take a look at the final part of the `libnative_api.h`:

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

The `libnative_symbols` function allows you to open the gateway from the native code to the Kotlin/Native library.
This is the entry point for accessing the library. The library name is used as a prefix for the function name.

> It might be necessary to host the returned `libnative_ExportedSymbols*` pointer per thread.
>
{style="note"}

## Use generated headers from C

Using the generated headers from C is straightforward. In the library directory, create the `main.c` file with the following code:

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

The compiler generates an executable called `a.out`. Run it to execute the Kotlin code from the C library.

### On Linux

To compile the C code and link it with the dynamic library, navigate to the library directory and run the following command:

```bash
gcc main.c libnative.so
```

The compiler generates an executable called `a.out`. Run it to execute the Kotlin code from the C library. On Linux,
you need to include `.` into the `LD_LIBRARY_PATH` to let the application know to load the `libnative.so`
library from the current folder.

### On Windows

First, you'll need to install a Microsoft Visual C++ compiler that supports the x64_64 target.

The easiest way to do this is to install Microsoft Visual Studio on a Windows machine. During installation,
select the necessary components to work with C++, for example, **Desktop development with C++**.

On Windows, you can include dynamic libraries either by generating a static library wrapper or manually
with the [LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya)
or similar Win32API functions.

Let's use the first option and generate the static wrapper library for the `libnative.dll`:

1. Call `lib.exe` from the toolchain to generate the static library wrapper `libnative.lib` that automates the DLL usage
   from the code:

   ```bash
   lib /def:libnative.def /out:libnative.lib
   ```

2. Compile your `main.c` into an executable. Include the generated `libnative.lib` into the build command and start:

   ```bash
   cl.exe main.c libnative.lib
   ```

   The command produces the `main.exe` file, which you can run.

## What's next

* [Learn more about interoperability with Swift/Objective-C](native-objc-interop.md)
* [Check out the Kotlin/Native as an Apple framework tutorial](apple-framework.md)