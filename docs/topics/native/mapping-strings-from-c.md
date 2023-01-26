[//]: # (title: Mapping Strings from C – tutorial)

This is the last tutorial in the series. The first tutorial of the series is
[Mapping primitive data types from C](mapping-primitive-data-types-from-c.md).
There are also [Mapping struct and union types from C](mapping-struct-union-types-from-c.md) and 
[Mapping function pointers from C](mapping-function-pointers-from-c.md) tutorials.
 
In this tutorial, you'll see how to deal with C strings in Kotlin/Native.
You will learn how to:
- [Pass a Kotlin string to C](#pass-kotlin-string-to-c)
- [Read a C string in Kotlin](#read-c-strings-in-kotlin)
- [Receive C string bytes into a Kotlin string](#receive-c-string-bytes-from-kotlin)

## Working with C strings

There is no dedicated type in C language for strings. A developer knows from a method 
signature or the documentation, whether a given `char *` means a C string in the context. 
Strings in the C language are null-terminated, a trailing zero character `\0` is added at the 
end of a bytes sequence to mark a string termination.
Usually, [UTF-8 encoded strings](https://en.wikipedia.org/wiki/UTF-8) are used. The UTF-8 encoding uses
variable width characters, and it is backward compatible with [ASCII](https://en.wikipedia.org/wiki/ASCII).
Kotlin/Native uses UTF-8 character encoding by default.

The best way to understand the mapping between C and Kotlin languages is to try it out on a small example. Create
a small library headers for that. First, create a `lib.h` file with the following
declaration of functions that deal with the C strings:

```c
#ifndef LIB2_H_INCLUDED
#define LIB2_H_INCLUDED

void pass_string(char* str);
char* return_string();
int copy_string(char* str, int size);

#endif
```  

In the example, you see the most popular ways to pass or receive a string in the C language. 
Take the return of `return_string` with care. In general, it is best to make sure you
use the right function to dispose the returned `char*` with the right `free(..)` function call.

Kotlin/Native comes with the `cinterop` tool; the tool generates bindings between the C language and Kotlin.
It uses a `.def` file to specify a C library to import. More details on this are
in the [Interop with C Libraries](native-c-interop.md) tutorial.
The quickest way to try out C API mapping is to have all C declarations in the
`interop.def` file, without creating any `.h` of `.c` files at all. Then place the C declarations 
in a `interop.def` file after the special `---` separator line:

```c 
headers = lib.h
---

void pass_string(char* str) {
}

char* return_string() {
  return "C string";
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

The `interop.def` file is enough to compile and run the application or open it in an IDE.
Now it is time to create project files, open the project in
[IntelliJ IDEA](https://jetbrains.com/idea) and run it. 

## Inspect generated Kotlin APIs for a C library

While it is possible to use the command line, either directly or
by combining it with a script file (such as `.sh` or `.bat` file), this approach doesn't
scale well for big projects that have hundreds of files and libraries.
It is then better to use the Kotlin/Native compiler with a build system, as it
helps to download and cache the Kotlin/Native compiler binaries and libraries with
transitive dependencies and run the compiler and tests.
Kotlin/Native can use the [Gradle](https://gradle.org) build system through the [kotlin-multiplatform](multiplatform-discover-project.md#multiplatform-plugin) plugin.

We covered the basics of setting up an IDE compatible project with Gradle in the
[A Basic Kotlin/Native Application](native-gradle.md)
tutorial. Please check it out if you are looking for detailed first steps
and instructions on how to start a new Kotlin/Native project and open it in IntelliJ IDEA.
In this tutorial, we'll look at the advanced C interop related usages of Kotlin/Native 
and [multiplatform](multiplatform-discover-project.md#multiplatform-plugin) builds with Gradle.

First, create a project folder. All the paths in this tutorial will be relative to this folder. Sometimes
the missing directories will have to be created before any new files can be added.

Use the following `build.gradle(.kts)` Gradle build file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

repositories {
    mavenCentral()
}

kotlin {
  linuxX64("native") { // on Linux
  // macosX64("native") { // on x86_64 macOS
  // macosArm64("native") { // on Apple Silicon macOS
  // mingwX64("native") { // on Windows
    val main by compilations.getting
    val interop by main.cinterops.creating
    
    binaries {
      executable()
    }
  }
}

tasks.wrapper {
  gradleVersion = "%gradleVersion%"
  distributionType = Wrapper.DistributionType.BIN
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

repositories {
    mavenCentral()
}

kotlin {
  linuxX64('native') { // on Linux
  // macosX64("native") { // on x86_64 macOS
  // macosArm64("native") { // on Apple Silicon macOS
  // mingwX64('native') { // on Windows
    compilations.main.cinterops {
      interop 
    }
    
    binaries {
      executable()
    }
  }
}

wrapper {
  gradleVersion = '%gradleVersion%'
  distributionType = 'BIN'
}
```

</tab>
</tabs>

The project file configures the C interop as an additional step of the build.
Let's move the `interop.def` file to the `src/nativeInterop/cinterop` directory.
Gradle recommends using conventions instead of configurations,
for example, the source files are expected to be in the `src/nativeMain/kotlin` folder.
By default, all the symbols from C are imported to the `interop` package,
you may want to import the whole package in our `.kt` files.
Check out the [kotlin-multiplatform](multiplatform-discover-project.md#multiplatform-plugin)
plugin documentation to learn about all the different ways you could configure it.

Let's create a `src/nativeMain/kotlin/hello.kt` stub file with the following content
to see how C string declarations are visible from Kotlin:

```kotlin
import interop.*

fun main() {
  println("Hello Kotlin/Native!")
  
  pass_string(/*fix me*/)
  val useMe = return_string()
  val useMe2 = copy_string(/*fix me*/)
}
```

Now you are ready to
[open the project in IntelliJ IDEA](native-get-started.md)
and to see how to fix the example project. While doing that,
see how C strings are mapped into Kotlin/Native.

## Strings in Kotlin

With the help of IntelliJ IDEA's __Go to | Declaration__ or
compiler errors, you see the following generated API for the C functions:

```kotlin
fun pass_string(str: CValuesRef<ByteVar /* = ByteVarOf<Byte> */>?)
fun return_string(): CPointer<ByteVar /* = ByteVarOf<Byte> */>?
fun copy_string(str: CValuesRef<ByteVar /* = ByteVarOf<Byte> */>?, size: Int): Int
```

These declarations look clear. All `char *` pointers are turned into `str: CValuesRef<ByteVar>?` for
parameters and to `CPointer<ByteVar>?` in return types. Kotlin turns `char` type into `kotlin.Byte` type,
as it is usually an 8-bit signed value.

In the generated Kotlin declarations, you see that `str` is represented as `CValuesRef<ByteVar/>?`. The type
is nullable, and you can simply pass Kotlin `null` as the parameter value. 

## Pass Kotlin string to C

Let's try to use the API from Kotlin. Call `pass_string` first:

```kotlin
fun passStringToC() {
  val str = "this is a Kotlin String"
  pass_string(str.cstr)
}
```

Passing a Kotlin string to C is easy, thanks to the fact that there is `String.cstr` 
[extension property](extensions.md#extension-properties)
in Kotlin for it. There is also `String.wcstr` for cases when you
need UTF-16 wide characters.

## Read C Strings in Kotlin

This time you'll take a returned `char *` from the `return_string` function and turn it into
a Kotlin string. For that, do the following in Kotlin:

```kotlin
fun passStringToC() {
  val stringFromC = return_string()?.toKString()
  
  println("Returned from C: $stringFromC")
}
``` 

This code uses the `toKString()` extension function above. Please do not miss out the
`toString()` function. The `toKString()` has two overloaded extension functions in Kotlin:

```kotlin
fun CPointer<ByteVar>.toKString(): String
fun CPointer<ShortVar>.toKString(): String
```

The first extension takes a `char *` as a UTF-8 string and turns it into a String.
The second function does the same but for wide UTF-16 strings.

## Receive C string bytes from Kotlin

This time we will ask a C function to write us a C string to a given buffer. The function
is called `copy_string`. It takes a pointer to the location writing characters and
the allowed buffer size. The function returns something to indicate if it has succeeded or failed.
Let's assume `0` means it succeeded, and the supplied buffer was big enough:

```kotlin
fun sendString() {
  val buf = ByteArray(255)
  buf.usePinned { pinned ->
    if (copy_string(pinned.addressOf(0), buf.size - 1) != 0) {
      throw Error("Failed to read string from C")
    }
  }

  val copiedStringFromC = buf.decodeToString()
  println("Message from C: $copiedStringFromC")
}

``` 

First of all, you need to have a native pointer to pass
to the C function. Use the `usePinned` extension function
to temporarily pin the native memory address of the
byte array. The C function fills in the
byte array with data. Use another extension 
function `ByteArray.decodeToString()` to turn the byte 
array into a Kotlin `String`, assuming UTF-8 encoding. 

## Fix the Code

You've now seen all the definitions and it is time to fix the code. 
Run the `runDebugExecutableNative` Gradle task [in the IDE](native-get-started.md)
or use the following command to run the code:

```bash
./gradlew runDebugExecutableNative
```

The code in the final `hello.kt` file may look like this:
 
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
    pinned.get().decodeToString()
  }

  println(copyFromC)
}
```

## Next steps

Continue to explore more C language types and their representation in Kotlin/Native
in our other tutorials:
- [Mapping primitive data types from C](mapping-primitive-data-types-from-c.md)
- [Mapping struct and union types from C](mapping-struct-union-types-from-c.md)
- [Mapping function pointers from C](mapping-function-pointers-from-c.md)

The [C Interop documentation](native-c-interop.md)
documentation covers more advanced scenarios of the interop.
