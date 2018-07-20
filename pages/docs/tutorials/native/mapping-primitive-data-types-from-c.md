---
type: tutorial
layout: tutorial
title:  "Mapping Primitive Data Types from C"
description: "Primitive Data types from C and how they look in Kotlin/Native"
authors: Eugene Petrenko 
date: 2018-07-20
showAuthorInfo: false
issue: EVAN-5343
---

In this tutorial we learn how C data types are visible in Kotlin/Native and vice versa. You will: 
- See what [Data Types are in C Language](#types-in-c-language)
- Create a [tiny C Library](#example-c-library) that uses those types in exports
- [Inspect Generated Kotlin/Native APIs from a C library](#inspecting-generated-kotlinnative-apis-for-a-c-library)
- Find how [Primitive Types in Kotlin/Native](#primitive-types-in-kotlinnative) are mapped to C

## Types in C Language

What types do we have in C language? Let's first list all of them. I use the
[C data types](https://en.wikipedia.org/wiki/C_data_types) article from Wikipedia.
There are following types in C programming language:
- basic types `char, int, float, double` with modifiers `signed, unsigned, short, long` 
- structures, unions, arrays
- pointers
- function pointers

There are also more specific types:
- boolean type (from [C99](https://en.wikipedia.org/wiki/C99))
- `size_t` and `ptrdiff_t` (also `ssize_t`)
- fixed width integer types, e.g. `int32_t` or `uint64_t` (from [C99](https://en.wikipedia.org/wiki/C99))

one also has the following type qualifiers in C language: `const`, `volatile`, `restruct`, `atomic`.

The best way to see how C data types are visible in Kotlin/Native is to try it. We create a 
C library using all those types and see how Kotlin/Native uses it. You may check 
[Interop with C Libraries](interop-with-c.html) tutorial for more details on how 
Kotlin/Native interop works. In this tutorial we focus more on how types are mapped.  


## Example C Library

We create a `lib.h` file to demonstrate function signatures:
```c
#ifndef LIB2_H_INCLUDED
#define LIB2_H_INCLUDED

void ints(char c, short d, int e, long f);
void doubles(float a, double b);

#endif
```

The file is missing the `extern "C"` block, which is not needed for our example, by may be 
necessary if you use C++ and overloaded functions. For more details, you may check the 
[C++ compatibility](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)
thread.

It is only necessary to have an `.h` file to run the `cinterop` tool. And we do not need to create a 
`lib.c` file, unless we want to compile and run the example.

We still need to create a `.def` file to the `cinterop`. For more details
you may check [Interop with C Libraries](interop-with-c.html). It is enough for
the tutorial to create the `lib.def` file with the following content:

```c
headers = lib.h
```

We may have avoided `.h` file from being created and placed declarations
directly to `.def` file. For example, we done that in the [next tutorial](mapping-struct-union-types-from-c.html).

## Inspecting Generated Kotlin/Native APIs for a C library

We need to have a Kotlin/Native compiler on our machines. 
You may have a look at the
[A Basic Kotlin/Native Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial for more information on performing this step.
Let's assume we have a console, where `kotlinc`, `cinterop` and `klib` commands are available. 

Now we are ready to compile the library and to import it into Kotlin/Native. Let's 
call the following commands:

```bash
cinterop -def lib.def -compilerOpts "-I." -o lib.klib
klib contents lib.klib
```

The `cinterop` command generates the `lib.klib`, the Kotlin/Native library to call C code. The `klib`
command prints the API of the library to the console.

## Primitive Types in Kotlin/Native

From `cinterop` and `klib` calls we see the following API:

```kotlin
fun doubles(a: Float, b: Double)
fun ints(c: Byte, d: Short, e: Int, f: Long)
```

C types mapped in the expected way, note that `char` type is mapped to `kotlin.Byte` 
as it is usually an 8-bit unsigned value.

| C | Kotlin |
|---|--------|
| char  |  kotlin.Byte |
| short |  kotlin.Short |
| int   |  kotlin.Int |
| long  |  kotlin.Long |
| float |  kotlin.Float |
| double | kotlin.Double |
{:.zebra}

## Next Steps

We continue exploring more complicated C language types and their representation in Kotlin/Native
in next tutorials:
- [Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html)
- [Mapping Function Pointers from C](mapping-function-pointers-from-c.html)

You may also take a look at the [C Interop documentation](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md)
for more advanced scenarios.