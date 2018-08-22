---
type: tutorial
layout: tutorial
title:  "Mapping Struct and Union Types from C"
description: "Struct and Union types from C and how they look in Kotlin/Native side"
authors: Eugene Petrenko 
date: 2018-07-12
showAuthorInfo: false
issue: EVAN-5343
---

That is the second post in the series. You may want to check 
[Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html) first. 

In this tutorial we see how `struct` and `union` types from C are visible to Kotlin/Native. 
You will learn:
- How wrappers are generated
- How to create and fill struct or union in Kotlin/Native


## Struct and Union C types

The best way to understand the mapping between Kotlin/Native and C is to try a tiny 
example. We create a `lib.h` file with the following declarations:
```c
#ifndef LIB2_H_INCLUDED
#define LIB2_H_INCLUDED

typedef struct {
  int a;
  double b;
} MyStruct;

typedef union {
  int a;
  MyStruct b;
  float c;
} MyUnion;

void structs(MyStruct s);
void unions(MyUnion u);

#endif

``` 

We still need to create a `.def` file to the `cinterop`. For more details
you may check [Interop with C Libraries](interop-with-c.html). It is enough for
the tutorial to create the `lib.def` file with the following content:
```c
headers = lib.h
```

Now we call the  
```bash
cinterop -def lib.def -compilerOpts "-I." -o lib.klib
klib contents lib.klib
```

and it prints the following Kotlin API for our C library:

```kotlin
fun structs(s: CValue<MyStruct>)
fun unions(u: CValue<MyUnion>)

class MyStruct constructor(rawPtr: NativePtr /* = NativePtr */) : CStructVar {
    var a: Int
    var b: Double
    companion object : CStructVar.Type
}

class MyUnion constructor(rawPtr: NativePtr /* = NativePtr */) : CStructVar {
    var a: Int
    val b: MyStruct
    var c: Float
    companion object : CStructVar.Type
}
```

We see that `cinterop` generated wrapper types for our `sturct` and `union` types. It uses `CStructVar` as a base type
for a structure and `CValue` as a wrapper class to pass the structure to a method.

**TODO: nice to include a link to the documentation for those wrapper types**


## Using Struct and Union Types from Kotlin/Native







- Deal with [struct and union C types](#struct-and-union-c-types)
TODO:
- C types maps to Kotlin types
- C function pointers and their mapping in Kotlin/Native
- And something more (TODO)
- Strings? (TODO)
