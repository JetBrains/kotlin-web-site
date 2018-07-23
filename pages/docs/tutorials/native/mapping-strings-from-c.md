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

That is the next post in the series. You might want to check the first tutorial called
[Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html) first or the 
second one called [Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html).

In that tutorial we see how *** from C are visible to Kotlin. 
You will learn how to:
- [work with C strings](#working-with-c-strings)
- use `size_t`, and other defined types
- access static variables from C

We need to have a Kotlin compiler on our machines. 
You may have a look at the
[A Basic Kotlin Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial for more information on performing this step.
Let's assume we have a console, where `kotlinc`, `cinterop` and `klib` commands are available. 


# Working with C strings

There in no dedicated type in C language for strings. Developer knows from a method 
signature or documentation, what a given `char *` means in the context. Strings in C are null-terminated, 
one adds a trailing zero character `\0` at the end of a bytes sequence to mark string termination.
Usually, one use [UTF-8 encoded strings](https://en.wikipedia.org/wiki/UTF-8). The encoding uses
variable width characters and it is backward compatible with [ASCII](https://en.wikipedia.org/wiki/ASCII).

The best way to understand the mapping between C and Kotlin languages is to try it. We create
a small example library for that. First, we need to create `lib.h` file with the following
declaration a function that accepts a C string:

```c
void pass_string(char* str);
char* return_string();
int copy_string(char* str, int size);
```  

The example demonstrates the most of ways we pass or receive a string from C. One should
take the return of `return_string` with care. In general, it is the best to make sure we
use the right function to free the returned `char*` with the right `free(..)` function call.

Kotlin/Native comes with the `cinterop` tool, the tool to generate bindings between 
C language and Kotlin. It uses a `.def` file to specify a library headers to import. For more details
you may check [Interop with C Libraries](interop-with-c.html) tutorial.
We create a `lib.def` file:

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
parameters and to `CPointer<ByteVar>?` in return types.

In the generated Kotlin declarations we see that `str` is represented as `CValuesRef<ByteVar/>?`. The type
is nullable, and we can simply pass Kotlin `null` as the parameter. 


### Passing Kotlin string to C

Let's try to use the API from Kotlin. Let's call `pass_string(..)` first:
```kotlin
fun passStringToC() {
  val str = "this is a Kotlin String"
  pass_string(str.cstr)
}
```

Passing a Kotlin string to C is easy, thank we have `String.cstr` 
[extension property](../reference/extensions.html#extension-properties)
on type `kotlin.String`. There is also `String.wcstr` for the case you
need wide characters.


### Reading C string in Kotlin

This time we turn a returned `char *` from `return_string(..)` function into
a Kotlin string. For that we do the following in Kotlin:

```kotlin
fun passStringToC() {
  val stringFromC = return_string()?.toKString()
  
  println("Returned from C: $stringFromC")
}
``` 

For that example we use `toKString()` extension function. Please do not miss that one with
`toString()` function. The `toKString()` have two overloaded extension functions in Kotlin:

```kotlin
fun CPointer<ByteVar>.toKString(): String
fun CPointer<ShortVar>.toKString(): String
```

The first one takes a `char*` as UTF-8 string and turns it into String.
The second function does the same for wide, `UTF-16` strings.


### Receiving C string bytes from Kotlin

This time we ask a C function to write us a C string to a given buffer. The function
is called `copy_string`. It takes a pointer to the location to write characters and 
the allowed buffer size. The function returns something to indicate it succeeded of failed.
Let's assume `0` means it succeeded and the supplied buffer was enough:

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

First of all, to pass a pointer to a C function we need to allocate memory for it. We use `memScoped{..}`
to temporary allocate and automatically release memory. It is `allocArray<ByteVar>(maxSize){..}` function, 
that we use to get the pointer. Next we call `copy_string` with the allocated pointer and check exit code of it.
`toKString()` extension function is used to turn a memory into Kotlin string, which we can use either inside
or outside of thr `memScoped{..}` block


```


```kotlin

fun pass_pointer(arg0: CValuesRef<*>?, size: size_t /* = Long */)
fun pass_string(str: CValuesRef<ByteVar /* = ByteVarOf<Byte> */>?)

var global_string: CPointer<ByteVar /* = ByteVarOf<Byte> */>?

```

Let's take a look how different types are processed.

## void* and size_t type 

The first function we created is `pass_pointer`. That is how one may pass a block of memory from 
Kotlin to C world. The interpretation if that 


`size_t` is the type one use for sized. You pass a `size_t` value to `malloc(..)` in C, we receive
`size_t` from `sizeof(..)` call too. The type is documented in POSIX.  Kotlin is smart enough 
to use that fact and to refer to `platform.posix.size_t`. The `platform.posix.size_t` is implemented
as a typealias to `kotlin.Long` type. Let's pass a numeric constant as an example.









## Next Steps

You may continue exploring more C language types and their representation in Kotlin/Native
in previous tutorials:
- [Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html)
- [Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html)
- [Mapping Function Pointers from C](mapping-function-pointers-from-c.html)

You may also have a look at the [C Interop documentation](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md)
for more advanced scenarios.
