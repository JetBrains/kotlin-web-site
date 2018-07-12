---
type: tutorial
layout: tutorial
title:  "Mapping Struct and Union Types with C"
description: "Struct and Union types from C and how they look in Kotlin/Native side"
authors: Eugene Petrenko 
date: 2018-07-12
showAuthorInfo: false
issue: EVAN-5343
---

- Deal with [struct and union C types](#struct-and-union-c-types)
TODO:
- C types maps to Kotlin types
- C function pointers and their mapping in Kotlin/Native
- And something more (TODO)
- Strings? (TODO)


## Struct and Union C types

Let's update the `lib.h` to demonstrate more complicated C types:
```c
#ifndef LIB2_H_INCLUDED
#define LIB2_H_INCLUDED

typedef struct {
  int a;
  double b;
} MyStruct;

void structs(MyStruct s);



typedef union {
  int a;
  MyStruct b;
  float c;
} MyUnion;

void unions(MyUnion u);


#endif

``` 

Now we call the  

```bash
cinterop -def lib.def -compilerOpts "-I$(pwd)" -o lib.klib
```

and see the generated API:

```kotlin

fun structs(s: CValue<MyStruct>)

fun unions(u: CValue<MyUnion>)

class MyStruct(rawPtr: NativePtr) : CStructVar(rawPtr) {
    var a: Int
    var b: Double
}

class MyUnion(rawPtr: NativePtr) : CStructVar(rawPtr) {
    var a: Int
    val b: MyStruct
    var c: Float
}

```

We see that `cinterop` generated wrapper types for our `sturct` and `union` types. It uses `CStructVar` as a base type
for a structure and `CValue` as a wrapper class to pass the structure to a method.

**TODO: nice to include a link to the documentation for those wrapper types**

