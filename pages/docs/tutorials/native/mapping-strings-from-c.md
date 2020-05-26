---
type: tutorial
layout: tutorial
title:  "Mapping Strings from C"
description: "Strings from C and how they look in Kotlin/Native"
authors: Eugene Petrenko 
date: 2019-04-15
showAuthorInfo: false
issue: EVAN-5343
---

This is the last tutorial in the series. The first tutorial of the series is
[Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html).
There are also [Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html) and 
[Mapping Function Pointers from C](mapping-function-pointers-from-c.html) tutorials.
 
In this tutorial we see how to deal with C strings in Kotlin/Native.
We will learn how to:
- [Pass a Kotlin string to C](#passing-kotlin-string-to-c)
- [Read a C string in Kotlin](#reading-c-strings-in-kotlin)
- [Receive C string bytes into a Kotlin string](#receiving-c-string-bytes-from-kotlin)

## Working with C strings

There is no dedicated type in C language for strings. A developer knows from a method 
signature or the documentation, whether a given `char *` means a C string in the context. 
Strings in the C language are null-terminated, a trailing zero character `\0` is added at the 
end of a bytes sequence to mark a string termination.
Usually, [UTF-8 encoded strings](https://en.wikipedia.org/wiki/UTF-8) are used. The UTF-8 encoding uses
variable width characters, and it is backward compatible with [ASCII](https://en.wikipedia.org/wiki/ASCII).
Kotlin/Native uses UTF-8 character encoding by default.

The best way to understand the mapping between C and Kotlin languages is to try it out on a small example. We will create
a small library headers for that. First, we need to create a `lib.h` file with the following
declaration of functions that deal with the C strings:

<div class="sample" markdown="1" mode="c" theme="idea" data-highlight-only="1" auto-indent="false">

```c
#ifndef LIB2_H_INCLUDED
#define LIB2_H_INCLUDED

void pass_string(char* str);
char* return_string();
int copy_string(char* str, int size);

#endif
```  
</div>

In the example we have the most popular ways to pass or receive a string in the C language. We should
take the return of `return_string` with care. In general, it is best to make sure we
use the right function to dispose the returned `char*` with the right `free(..)` function call.

Kotlin/Native comes with the `cinterop` tool; the tool generates bindings between the C language and Kotlin.
It uses a `.def` file to specify a C library to import. More details on this are
in the [Interop with C Libraries](/docs/reference/native/c_interop.html) tutorial.
The quickest way to try out C API mapping is to have all C declarations in the
`interop.def` file, without creating any `.h` of `.c` files at all. Then place the C declarations 
in a `interop.def` file after the special `---` separator line:

<div class="sample" markdown="1" mode="c" theme="idea" data-highlight-only="1" auto-indent="false">

```c 
headers = lib.h
---

void pass_string(char* str) {
}

char* return_string() {
  return "C stirng";
}

int copy_string(char* str, int size) {
  *str++ = 'C';
  *str++ = ' ';
  *str++ = 'K';
  *str++ = '/';
  *str++ = 'N';
  *str++ = 0;
  return 0;
}

``` 
</div>

The `interop.def` file is enough to compile and run the application or open it in an IDE.
Now it is time to create project files, open the project in
[IntelliJ IDEA](https://jetbrains.com/idea) and run it. 

## Inspecting Generated Kotlin APIs for a C library

[[include pages-includes/docs/tutorials/native/mapping-primitive-data-types-gradle.md]]

Let's create a `src/nativeMain/kotlin/hello.kt` stub file with the following content
to see how C primitive type declarations are visible from Kotlin:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import interop.*

fun main() {
  println("Hello Kotlin/Native!")
  
  pass_string(/*fix me*/)
  val useMe = return_string()
  val useMe2 = copy_string(/*fix me*/)
}
```
</div>

Now we are ready to
[open the project in IntelliJ IDEA](using-intellij-idea.html)
and to see how to fix the example project. While doing that,
we'll examine how C primitive types are mapped into Kotlin/Native.

## Primitive Types in Kotlin

With the help of IntelliJ IDEA's _Goto Declaration_ or
compiler errors we see the following generated API for our C functions:

<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun pass_string(str: CValuesRef<ByteVar /* = ByteVarOf<Byte> */>?)
fun return_string(): CPointer<ByteVar /* = ByteVarOf<Byte> */>?
fun copy_string(str: CValuesRef<ByteVar /* = ByteVarOf<Byte> */>?, size: Int): Int
```
</div>

These declarations look clear. All `char *` pointers are turned into `str: CValuesRef<ByteVar>?` for
parameters and to `CPointer<ByteVar>?` in return types. Kotlin turns `char` type into `kotlin.Byte` type,
as it is usually an 8-bit signed value.

In the generated Kotlin declarations, we see that `str` is represented as `CValuesRef<ByteVar/>?`. The type
is nullable, and we can simply pass Kotlin `null` as the parameter value. 

## Passing Kotlin string to C

Let's try to use the API from Kotlin. Let's call `pass_string` first:

<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun passStringToC() {
  val str = "this is a Kotlin String"
  pass_string(str.cstr)
}
```
</div>

Passing a Kotlin string to C is easy, thanks to the fact that we have `String.cstr` 
[extension property](../../reference/extensions.html#extension-properties)
in Kotlin for it. There is also `String.wcstr` for cases where we
need UTF-16 wide characters.

## Reading C Strings in Kotlin

This time we take a returned `char *` from the `return_string` function and turn it into
a Kotlin string. For that we do the following in Kotlin:

<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun passStringToC() {
  val stringFromC = return_string()?.toKString()
  
  println("Returned from C: $stringFromC")
}
``` 
</div>

we use the `toKString()` extension function above. Please do not miss out the
`toString()` function. The `toKString()` has two overloaded extension functions in Kotlin:

<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun CPointer<ByteVar>.toKString(): String
fun CPointer<ShortVar>.toKString(): String
```
</div>

The first extension takes a `char *` as a UTF-8 string and turns it into a String.
The second function does the same but for wide UTF-16 strings.


## Receiving C string bytes from Kotlin

This time we will ask a C function to write us a C string to a given buffer. The function
is called `copy_string`. It takes a pointer to the location writing characters and
the allowed buffer size. The function returns something to indicate if it has succeeded or failed.
Let's assume `0` means it succeeded, and the supplied buffer was big enough:

<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun sendString() {
  val buf = ByteArray(255)
  buf.usePinned { pinned ->
    if (copy_string(pinned.addressOf(0), buf.size - 1) != 0) {
      throw Error("Failed to read string from C")
    }
  }

  val copiedStringFromC = buf.toKString()
  println("Message from C: $copiedStringFromC")
}

``` 
</div>

First of all, we need to have a native pointer to pass
to the C function. We use the `usePinned` extension function
to temporarily pin the native memory address of the
byte array. The C function fills in the
byte array with data. We use another extension 
function `ByteArray.toKString()` to turn the byte 
array into a Kotlin `String`, assuming UTF-8 encoding. 

## Fixing the Code

We've now seen all the definitions and it is time to fix the code. 
Let's run the `runDebugExecutableNative` Gradle task [in the IDE](using-intellij-idea.html)
or use the following command to run the code:
[[include pages-includes/docs/tutorials/native/runDebugExecutableNative.md]]

The code in the final `hello.kt` file may look like this:
 
<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import interop.*
import kotlinx.cinterop.*

fun main() {
  println("Hello Kotlin/Native!")

  val str = "this is a Kotlin String"
  pass_string(str.cstr)

  val useMe = return_string()?.toKString() ?: error("null pointer returned")
  println(useMe)

  val copyFromC = ByteArray(255).usePinned { pinned ->

    val useMe2 = copy_string(pinned.addressOf(0), pinned.get().size - 1)
    if (useMe2 != 0) throw Error("Failed to read string from C")
    pinned.get().stringFromUtf8()
  }

  println(copyFromC)
}
```
</div>
## Next Steps

We continue to explore more C language types and their representation in Kotlin/Native
in our other tutorials:
- [Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html)
- [Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html)
- [Mapping Function Pointers from C](mapping-function-pointers-from-c.html)

The [C Interop documentation](/docs/reference/native/c_interop.html)
documentation covers more advanced scenarios of the interop.
