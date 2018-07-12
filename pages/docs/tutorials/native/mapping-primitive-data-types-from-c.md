---
type: tutorial
layout: tutorial
title:  "Mapping Primitive Data Types from C"
description: "Primitive Data types from C and how they look in Kotlin/Native side"
authors: Eugene Petrenko 
date: 2018-07-11
showAuthorInfo: false
issue: EVAN-5343
---

In this tutorial we learn how C data types are visible in Kotlin/Native and vice versa. You will: 
- See what [Data Types are in C Language](#types-in-c-language)
- Create a [tiny C Library](#example-c-library) that uses those types in exports
- [Inspect Generated Kotlin/Native APIs from a C library](#inspecting-generated-kotlinnative-apis-for-a-c-library)
- Find how [Primitive Types in Kotlin/Native](#primitive-types-in-kotlinnative) are mapped to C

## Types in C Language

What types do we have in C language? Let's first all of them. I use the
[C data types](https://en.wikipedia.org/wiki/C_data_types) article from Wikipedia.
It shows the following types groups:
- basic types: `char, int, float, double`
- structures, unions, arrays
- pointers
- function pointers

There are also more specific types, that we are not going to cover:
- boolean type (from [C99](https://en.wikipedia.org/wiki/C99))
- `size_t` and `ptrdiff_t` (also `ssize_t`)
- fixed width integer types, e.g. `int32_t` or `uint64_t` (from [C99](https://en.wikipedia.org/wiki/C99))

In C language one have several modifiers like `signed, unsigned, short, long`. And type qualifiers like 
`const`, `volatile`, `restruct`, `atomic`. We will not be discussing it here too.

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
```
headers = lib.h
```

## Inspecting Generated Kotlin/Native APIs for a C library

We assume, you have Kotlin/Native compiler on your machine.
[A Basic Kotlin/Native Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial has good instructions to install Kotlin/Native.
We assume `kotlinc` and `cinterop` commands are available in PATH. 

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

C types mapped in the expected way, but `char` is `Byte`:

| C | Kotlin |
|---|--------|
| char  | Byte |
| short | Short |
| int   | Int |
| long  | Long |
| float | Float |
| double | Double |
{:.zebra}


We continue exploring more complicated C language types and their representation in Kotlin/Native
in next tutorials:
- [Mapping Struct and Union Types with C](mapping-primitive-data-types-from-c.html)

