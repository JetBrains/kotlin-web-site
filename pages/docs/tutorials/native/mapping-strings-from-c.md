---
type: tutorial
layout: tutorial
title:  "Mapping Strings from C"
description: "Strings from C and how they look in Kotlin/Native"
authors: Eugene Petrenko 
date: 2018-07-23
showAuthorInfo: false
issue: EVAN-5343
---

That is the last post in the series. You might want to begin with the first tutorial called
[Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html).
There are also [Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html) and 
[Mapping Function Pointers from C](mapping-function-pointers-from-c.html) tutorials.
 
In that tutorial we see how to deal with C strings in Kotlin/Native.
You will learn how to:
- [pass Kotlin string to C](#passing-kotlin-string-to-c)
- [read C string in Kotlin](#reading-c-string-in-kotlin)
- [receive C string bytes into Kotlin string](#receiving-c-string-bytes-from-kotlin)

We need to have a Kotlin compiler on our machines. 
You may have a look at the
[A Basic Kotlin Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial for more information on performing this step.
Let's assume we have a console, where `kotlinc`, `cinterop` and `klib` commands are available. 

## Working with C strings

There is no dedicated type in C language for strings. A developer knows from a method 
signature or documentation, if a given `char *` means a C string in the context. 
Strings in C language are null-terminated, one adds a trailing zero character `\0` at the 
end of a bytes sequence to mark a string termination.
Usually, one uses [UTF-8 encoded strings](https://en.wikipedia.org/wiki/UTF-8). The UTF-8 encoding uses
variable width characters and it is backward compatible with [ASCII](https://en.wikipedia.org/wiki/ASCII).
Kotlin/Native uses UTF-8 character encoding my default.

The best way to understand the mapping between C and Kotlin languages is to try it on a small example. We create
a small library headers for that. First, we need to create `lib.h` file with the following
declaration of functions that deals with C strings:

```c
#ifndef LIB2_H_INCLUDED
#define LIB2_H_INCLUDED

void pass_string(char* str);
char* return_string();
int copy_string(char* str, int size);

#endif
```  

In the example we have the most popular ways one passes or receives a string in C language. We should
take the return of `return_string` with care. In general, it is the best to make sure we
use the right function to dispose the returned `char*` with the right `free(..)` function call.

Kotlin/Native comes with the `cinterop` tool, the tool to generate bindings between 
C and Kotlin languages. It uses a `.def` file to specify a library headers to import. For more details
you may check [Interop with C Libraries](interop-with-c.html) tutorial.
We create the following `lib.def` file:

```c 
headers = lib.h
``` 

Now we call:  
```bash
cinterop -def lib.def -compilerOpts "-I." -o lib.klib
klib contents lib.klib
```
and it prints the following Kotlin API for our C library declarations:

```kotlin
fun pass_string(str: CValuesRef<ByteVar /* = ByteVarOf<Byte> */>?)
fun return_string(): CPointer<ByteVar /* = ByteVarOf<Byte> */>?

fun copy_string(str: CValuesRef<ByteVar /* = ByteVarOf<Byte> */>?, size: Int): Int
```

Those declarations look clear. All `char *` pointers are turned into `str: CValuesRef<ByteVar>?` for
parameters and to `CPointer<ByteVar>?` in return types. Kotlin turns `char` type into `kotlin.Byte` type,
as it is usually an 8-bit unsigned value.

In the generated Kotlin declarations, we see that `str` is represented as `CValuesRef<ByteVar/>?`. The type
is nullable, and we can simply pass Kotlin `null` as the parameter value. 

## Passing Kotlin string to C

Let's try to use the API from Kotlin. Let's call `pass_string` first:
```kotlin
fun passStringToC() {
  val str = "this is a Kotlin String"
  pass_string(str.cstr)
}
```

Passing a Kotlin string to C is easy, thanks we have `String.cstr` 
[extension property](../reference/extensions.html#extension-properties)
in Kotlin for it. There is also `String.wcstr` for the case you
need UTF-16 wide characters.

## Reading C string in Kotlin

This time we turn a returned `char *` from `return_string` function into
a Kotlin string. For that we do the following in Kotlin:

```kotlin
fun passStringToC() {
  val stringFromC = return_string()?.toKString()
  
  println("Returned from C: $stringFromC")
}
``` 

we use `toKString()` extension function above. Please do not miss that one with
`toString()` function. The `toKString()` have two overloaded extension functions in Kotlin:

```kotlin
fun CPointer<ByteVar>.toKString(): String
fun CPointer<ShortVar>.toKString(): String
```

The first one takes a `char *` as UTF-8 string and turns it into String.
The second function does the same for wide, UTF-16 strings.


## Receiving C string bytes from Kotlin

This time we ask a C function to write us a C string to a given buffer. The function
is called `copy_string`. It takes a pointer to the location to write characters and 
the allowed buffer size. The function returns something to indicate it succeeded of failed.
Let's assume `0` means it succeeded and the supplied buffer was big enough:

```kotlin
fun sendString() {
  val copiedStringFromC = memScoped {
    val maxSize = 222
    val buff = allocArray<ByteVar>(maxSize) { zeroValue<ByteVar>() }
    if (copy_string(buff, maxSize) != 0) {
      throw Error("Failed to read string from C")
    }

    buff.toKString()
  }
  
  println("Message from C: $copiedStringFromC")
}

``` 

First of all, to pass a pointer to a C function we need to allocate a memory for it. We use `memScoped`
to temporarily allocate and automatically release the memory. It is the `allocArray<ByteVar>(..)` function, 
that we use to get the pointer to an allocated memory block. We call `copy_string` with the
allocated pointer and check the exit code of it.
`toKString()` extension function is used to turn a memory into Kotlin string, which we can 
use either inside or outside of the `memScoped` block.

## Next Steps

You may continue exploring more C language types and their representation in Kotlin/Native
in previous tutorials:
- [Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html)
- [Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html)
- [Mapping Function Pointers from C](mapping-function-pointers-from-c.html)

You may also have a look at the [C Interop documentation](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md)
for more advanced scenarios.
