---
type: tutorial
layout: tutorial
title:  "Mapping Primitive Data Types from C"
description: "Primitive Data types from C and how they look in Kotlin/Native"
authors: Eugene Petrenko 
date: 2018-07-23
showAuthorInfo: false
issue: EVAN-5343
---

In this tutorial, we learn what C data types are visible in Kotlin/Native and vice versa. You will: 
- See what [Data Types are in C Language](#types-in-c-language)
- Create a [tiny C Library](#an-example-c-library) that uses those types in exports
- [Inspect Generated Kotlin APIs from a C library](#inspecting-generated-kotlin-apis-for-a-c-library)
- Find how [Primitive Types in Kotlin](#primitive-types-in-kotlin) are mapped to C

## Types in C Language

What types do we have in the C language? Let's first list all of them. I have used the
[C data types](https://en.wikipedia.org/wiki/C_data_types) article from Wikipedia as a basis.
There are following types in the C programming language:
- basic types `char, int, float, double` with modifiers `signed, unsigned, short, long` 
- structures, unions, arrays
- pointers
- function pointers

There are also more specific types:
- boolean type (from [C99](https://en.wikipedia.org/wiki/C99))
- `size_t` and `ptrdiff_t` (also `ssize_t`)
- fixed width integer types, e.g., `int32_t` or `uint64_t` (from [C99](https://en.wikipedia.org/wiki/C99))

There are also the following type qualifiers in the C language: `const`, `volatile`, `restruct`, `atomic`.

The best way to see what C data types are visible in Kotlin is to try it

## An Example C Library

We create a `lib.h` file to see how C functions are mapped into Kotlin:
<div class="sample" markdown="1" mode="c" theme="idea" data-highlight-only="1" auto-indent="false">

```c
#ifndef LIB2_H_INCLUDED
#define LIB2_H_INCLUDED

void ints(char c, short d, int e, long f);
void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
void doubles(float a, double b);

#endif
```
</div>

The file is missing the `extern "C"` block, which is not needed for our example, but may be 
necessary if you use C++ and overloaded functions. For more details on this, you may want to check out the 
[C++ compatibility](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)
thread.

It is only necessary to have a `.h` file to run the `cinterop` tool. And we do not need to create a 
`lib.c` file, unless we want to compile and run the example.

We still need to create a `.def` file to the `cinterop`. For more details on this,
you may want to check out [Interop with C Libraries](interop-with-c.html). It is enough for
the tutorial to create the `lib.def` file with the following content:
<div class="sample" markdown="1" mode="c" theme="idea" data-highlight-only="1" auto-indent="false">

```c
headers = lib.h
```
</div>

We could have avoided creating the `.h` file and placed declarations
directly to the `.def` file. This is what we do in the [next tutorial](mapping-struct-union-types-from-c.html).

## Inspecting Generated Kotlin APIs for a C library

We need to have a Kotlin compiler on our machines. 
You may want to have a look at the
[A Basic Kotlin Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial for more information on performing this step.
Let's assume we have a console, where the `kotlinc-native`, `cinterop`, and `klib` commands are available. 

Now we are ready to compile the library and to import it into Kotlin. Let's 
call the following commands:

```bash
cinterop -def lib.def -compilerOpts "-I." -o lib.klib
klib contents lib.klib
```

The `cinterop` command generates the `lib.klib`, the Kotlin library, which is the bridge to call C code. The `klib`
command prints the API of the library to the console.

## Primitive Types in Kotlin

From `cinterop` and `klib` calls we see the following API:

<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun doubles(a: Float, b: Double)
fun uints(c: UByte, d: UShort, e: UInt, f: ULong)
fun ints(c: Byte, d: Short, e: Int, f: Long)
```
</div>

C types are mapped in the way you would expect, note that `char` type is mapped to `kotlin.Byte` 
as it is usually an 8-bit unsigned value.

| C | Kotlin |
|---|--------|
| char  |  kotlin.Byte |
| unsigned char  |  kotlin.UByte |
| short |  kotlin.Short |
| unsigned short |  kotlin.UShort |
| int   |  kotlin.Int |
| unsigned int   |  kotlin.UInt |
| long long  |  kotlin.Long |
| unsigned long long |  kotlin.ULong |
| float |  kotlin.Float |
| double | kotlin.Double |
{:.zebra}

## Next Steps

We will continue to explore more complicated C language types and their representation in Kotlin/Native
in the next tutorials:
- [Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html)
- [Mapping Function Pointers from C](mapping-function-pointers-from-c.html)
- [Mapping Strings from C](mapping-strings-from-c.html)

You may also like to take a look at the [C Interop documentation](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md)
for more advanced scenarios.
