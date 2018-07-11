---
type: tutorial
layout: tutorial
title:  "Mapping Data Types with C"
description: "Data types how they look from C and Kotlin/Native sides"
authors: Eugene Petrenko 
date: 2018-07-11
showAuthorInfo: false
issue: EVAN-5343
---


In this tutorial we learn how C types are visible in Kotlin/Native and vice versa. You will learn how to: 
- [Data Types in C Language](#types-in-c-language)
- Create a tiny C Library
- C types maps to Kotlin types
- C function pointers and their mapping in Kotlin/Native
- And something more (TODO)

## Types in C Language

What data types do we have in C language? Let's first all of them. I use the
[C data types](https://en.wikipedia.org/wiki/C_data_types) article from Wikipedia.
It shows the following types groups:
- basic types: `char, int, float, double` with modifiers `signed, unsigned, short, long`
- boolean type (from [C99](https://en.wikipedia.org/wiki/C99))
- `size_t` and `ptrdiff_t` (also `ssize_t`)
- fixed width integer types, e.g. `int32_t` or `uint64_t` (from [C99](https://en.wikipedia.org/wiki/C99))
- structures
- unions
- arrays
- pointers
- function pointers

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
necessary if you use C++ compiler. For more details, please refer to
[C++ compatibility](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)
thread.

Next, we create a trivial `lib.c` file with the implementations of those functions:
```c
#include "lib.h"

void ints(char c, short d, int e, long f) { }
void doubles(float a, double b) { }

```

We need to create a `.def` file to the `cinterop` too. Please refer to 
[Interop with C Libraries](interop-with-c.html) for more details. It is enough for
the tutorial to create the `lib.def` file with the following content:
```
headers = lib.h
```

We assume, you have Kotlin/Native compiler and C toolchain on your machine.
[A Basic Kotlin/Native Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial has good instructions to install Kotlin/Native.
We assume `kotlinc` and `cinterop` commands are available in PATH. 

Now we are ready to compile the library and to import it into Kotlin/Native. Let's 
call the following commands (in Linux or macOS):
```bash
gcc -c "-I$(pwd)" lib.c -o lib.o
ar rcs lib.a lib.o

cinterop -def lib.def -compilerOpts "-I$(pwd)" -o lib.klib
```
