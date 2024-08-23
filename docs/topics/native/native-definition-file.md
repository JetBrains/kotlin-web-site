[//]: # (title: Definition file)

Kotlin/Native helps consume standard C and Objective-C libraries, allowing you to use their functionality in Kotlin.
A special cinterop tool takes a C or an Objective-C library and generates the corresponding Kotlin bindings,
so that the library methods can be in your Kotlin code as usual.

To generate these bindings, each library should have its definition file, usually with the same name as the library.
This is a property file that describes how exactly the library should be consumed. See the full [list of available properties](#properties).

Here's a general workflow:

1. Create a `.def` file describing what to include into bindings. For Objective-C, add the following property to the top:
   
   ```none
   language = Objective-С
   ```

2. Use the `cinterop` tool to produce Kotlin bindings.
3. Run the Kotlin/Native compiler on an application to produce the final executable.

## Create and use a definition file

Let's create a definition file and generate bindings for a C library:

1. In your IDE, select the `src` folder and create a new directory with **File | New | Directory**.
2. Name new directory **nativeInterop/cinterop**.
   
   This is the default convention for header file locations, though it can
   be overridden in the `build.gradle.kts` file if you use a different location.
3. Select this new subfolder and create a `png.def` file with **File | New | File**.
4. Add the necessary properties:

   ```none
   headers = png.h
   headerFilter = png.h
   package = png
   
   compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
   linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/png/lib -lcurl
   linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lpng
   ```

   * `headers` is the list of header files to generate Kotlin stubs. You can add multiple files to this entry,
     separating each with a `\` on a new line. In this case, it's only `png.h`. The referenced files need to be available
     on the system path (in this case, it's `/usr/include/png`).
   * `headerFilter` shows what exactly is included. In C, all the headers are also included when one file references
     another one with the `#include` directive. Sometimes it's not necessary, and you can add this parameter
     [using glob patterns](https://en.wikipedia.org/wiki/Glob_(programming)) to fine-tune things.

     `headerFilter` is an optional argument and is mostly used when the library is installed as a system library. You don't
     want to fetch external dependencies (such as system `stdint.h` header) into the interop library. It may be important to
     optimize the library size and fix potential conflicts between the system and the provided Kotlin/Native compilation
     environment.

   * If the behavior for a certain platform needs to be modified, you can use a format like `compilerOpts.osx` or
     `compilerOpts.linux` to provide platform-specific values to the options. In this case, they are macOS
     (the `.osx` suffix) and Linux (the `.linux` suffix). Parameters without a suffix are also possible
     (for example, `linkerOpts=`) and applied to all platforms.

5. Run the `cinterop` tool. You can specify properties as options to the `cinterop` call as well, for example:

   ```bash
   cinterop -def png.def -compiler-option -I/usr/local/include -o png
   ```

   * For host libraries that are not included in the sysroot search paths, headers may be needed.
   * For a typical Unix library with a configuration script, the `compilerOpts` will likely contain the output of a
     configuration script with the `--cflags` option (maybe without exact paths).
   * The output of a configuration script with `--libs` will be passed as a `-linkedArgs` `kotlinc` option value (quoted)
     when compiling.

This command will produce a `png.klib` compiled library and the `png-build/kotlin` directory containing Kotlin source
code for the library.

Note that the generated bindings are generally platform-specific, so if you are developing for
multiple targets, the bindings need to be regenerated.

After the generation of bindings, they can be used by the IDE as a proxy view of the
native library.

## Properties

You can specify properties in the definition file or pass these options in the `cinterop` call. For example,
the `foreignExceptionMode = objc-wrap` property in the `png.def` file is the same as the following command:

```bash
cinterop -def png.def -Xforeign-exception-mode objc-wrap
```

Here's the full list of properties you can use in your definition file to adjust the content of the generated binaries.
For more information, see corresponding sections below.

| **Property**                                                                        | **Description**                                                                                                                    |
|-------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [`headers`](#headers)                                                               | The list of headers to be included for the cinterop tool arguments.                                                                |
| `modules`                                                                           |                                                                                                                                    |
| `language`                                                                          | Use to indicate the `Objective-C` language                                                                                         |
| [`compilerOpts`](#compiler-and-linker-options)                                      | Compiler options that the cinterop tool passes to the compiler.                                                                    |
| `excludeSystemLibs`                                                                 |                                                                                                                                    |
| [`excludeDependentModules`](#filter-headers-by-module-maps)                         | Exclude headers from `module.modulemap` or `module.map` files. When used with `headerFilter`, they are applied as an intersection. |
| `entryPoints`                                                                       |                                                                                                                                    |
| [`linkerOpts`](#compiler-and-linker-options)                                        | Linker options that the cinterop tool passes to the linker.                                                                        |
| `linker`                                                                            |                                                                                                                                    |
| [`excludedFunctions`](#ignore-specific-functions)                                   | A space-separated list of function names that should be ignored.                                                                   |                                                               
| `excludedMacros`                                                                    |                                                                                                                                    |
| [`staticLibraries`](#include-a-static-library)                                      | Includes a static library into `.klib`.                                                                                            |
| [`libraryPaths`](#include-a-static-library)                                         | A space-separated list of directories where the cinterop tool searches for the library to be included in `.klib`.                  |
| `packageName`                                                                       | Package prefix for the generated Kotlin API.                                                                                       |
| [`headerFilter`](#filter-headers-by-globs)                                          | Filter headers by globs and include only them when importing a library.                                                            |
| [`excludeFilter`](#exclude-headers)                                                 | Exclude specific headers when importing a library. Has priority over `headerFilter`.                                               |
| [`strictEnums`](#configure-enums-generation)                                        | A space-separated list of enums that should be generated as a [Kotlin enum](enum-classes.md).                                      |
| [`nonStrictEnums`](#configure-enums-generation)                                     | A space-separated list of enums that should be generated as integral values.                                                       |
| [`noStringConversion`](#set-up-string-conversion)                                   | A space-separated lists of functions whose `const char*` parameters should not be auto-converted to Kotlin `String`s.              |
| `depends`                                                                           |                                                                                                                                    |
| `exportForwardDeclarations`                                                         |                                                                                                                                    |
| `allowedOverloadsForCFunctions`                                                     |                                                                                                                                    |
| [`disableDesignatedInitializerChecks`](#allow-calling-a-non-designated-initializer) | Disable the compiler check that doesn't allow calling a non-designated initializer as a `super()` constructor.                     |
| [`foreignExceptionMode`](#wrap-exceptions)                                          | Wraps exceptions from Objective-C code into Kotlin exceptions with the `ForeignException` type.                                    |
| `pluginName`                                                                        |                                                                                                                                    |
| `objcClassesIncludingCategories`                                                    |                                                                                                                                    |
| [`userSetupHint`](#linker-errors)                                                   | Adds a custom message, for example, to help users resolve linker errors.                                                           |

In addition to the list of properties, you can include [custom declarations](#add-custom-declarations) in your definition
file.

### Headers

When the library is imported, all of the headers are also included in the program. So all header dependencies are included
in generated stubs as well.

This behavior can be very inconvenient for some libraries. Use the `headers` property to specify separate headers that
should be imported:

```none
headers = curl/curl.h
```

### Filter headers by globs

You can filter headers by globs using filter properties from the `.def` file. To include declarations from headers,
use the `headerFilter` property. If a header matches any of the globs, its declarations are included in the bindings.

The globs are applied to the header paths relative to the appropriate include path elements,
for example, `time.h` or `curl/curl.h`. So if the library is usually included with `#include <SomeLibrary/Header.h>`,
it would probably be correct to filter headers with the following filter:

```none
headerFilter = SomeLibrary/**
```

If `headerFilter` is not provided, all the headers are included. However, we encourage you to use `headerFilter`
and specify the glob as precisely as possible. In this case, the generated library contains only the necessary
declarations. It can help avoid various issues when upgrading Kotlin or tools in your development environment.

### Exclude headers

To exclude specific headers, use the `excludeFilter` property. It can be helpful to remove redundant or problematic
headers and optimize compilation, as declarations from the specified headers are not included into the bindings:

```none
excludeFilter = SomeLibrary/time.h
```

> If the same header is both included with `headerFilter`, and excluded with `excludeFilter`, the specified header will
> not be included into the bindings.
>
{type="note"}

### Filter headers by module maps

Some libraries, like macOS and iOS system libraries and frameworks, have proper `module.modulemap` or `module.map` files
in their headers. The [module map file](https://clang.llvm.org/docs/Modules.html#module-map-language) describes the
correspondence between header files and modules. When the module maps are available, you can filter out headers from the
modules that are not included directly with the experimental `excludeDependentModules` option in the `.def` file:

```c
headers = OpenGL/gl.h OpenGL/glu.h GLUT/glut.h
compilerOpts = -framework OpenGL -framework GLUT
excludeDependentModules = true
```

When both `excludeDependentModules` and `headerFilter` are used, they are applied as an intersection.

### Compiler and linker options

Use `compilerOpts` and `linkerOpts` properties to pass the corresponding options to the compiler (used to analyze headers,
such as preprocessor definitions) and to the linker (used to link final executables) respectively. For example:

```c
compilerOpts = -DFOO=bar
linkerOpts = -lpng
```

Target-specific options only applicable to the certain target can be specified as well:

```c
compilerOpts = -DBAR=bar
compilerOpts.linux_x64 = -DFOO=foo1
compilerOpts.macos_x64 = -DFOO=foo2
```

With such a configuration, headers will be analyzed with `-DBAR=bar -DFOO=foo1` on Linux and with `-DBAR=bar -DFOO=foo2`
on macOS. Note that any definition file option can have both common and platform-specific parts.

### Ignore specific functions

Use the `excludedFunctions` property to specify a list of the function names that should be ignored. This may be
helpful in case a function declared in the header is not generally guaranteed to be really callable, and
it's often hard or impossible to figure this out automatically. You can also use this property to work around a bug
in the interop itself.

### Include a static library

Sometimes it's more convenient to ship a static library with your product, rather than assume it is available within
the user's environment. To include a static library into `.klib`, use `staticLibrary` and `libraryPaths` properties:

```c
headers = foo.h
staticLibraries = libfoo.a
libraryPaths = /opt/local/lib /usr/local/opt/curl/lib
```

When given the above snippet the `cinterop` tool will search `libfoo.a` in `/opt/local/lib` and `/usr/local/opt/curl/lib`,
and if it is found include the library binary into `klib`.

When using such `klib` in your program, the library is linked automatically.

### Configure enums generation

Use the `strictEnums` property to generate enums as Kotlin enums or `nonStrictEnums` to generate them as integral
values . If the enum is not included into any of these lists, then it is generated according to the heuristics.

### Set up string conversion

Use the `noStringConversion` property to disable automatic conversion of the `const char*` function parameters as
Kotlin `String`s.

### Allow calling a non-designated initializer

By default, the Kotlin/Native compiler doesn't allow calling a non-designated initializer as a `super()`
constructor. This behaviour can be inconvenient if the designated initializers aren't marked properly in the
library. To disable these compiler checks, use the `disableDesignatedInitializerChecks` property.

### Wrap exceptions

To enable wrapping of Objective-C exceptions into Kotlin exceptions, use the `foreignExceptionMode = objc-wrap` property.
Kotlin exceptions get the `ForeignException` type.

#### Linker errors

Linker errors might occur when a Kotlin library depends on C or Objective-C libraries, for example, using the
[CocoaPods integration](native-cocoapods.md). If dependent libraries aren't installed locally on the machine or configured
explicitly in the project build script, the "Framework not found" error occurs.

If you're a library author, you can help your users resolve linker errors with custom messages.
To do that, add a `userSetupHint=message` property to your `.def` file or pass the `-Xuser-setup-hint` compiler option
to `cinterop`.

### Add custom declarations

Sometimes it is required to add custom C declarations to the library before generating bindings (for example, for [macros](native-c-interop.md#macros)).
Instead of creating an additional header file with these declarations, you can include them directly
to the end of the `.def` file, after a separating line, containing only the separator sequence `---`:

```c
headers = errno.h
---

static inline int getErrno() {
   return errno;
}
```

Note that this part of the `.def` file is treated as part of the header file, so functions with the body should be
declared as `static`. The declarations are parsed after including the files from the `headers` list.

## What's next

* [Bindings for C-interoperability](native-c-interop.md#bindings)
* [Interoperability with Swift/Objective-C](native-objc-interop.md)