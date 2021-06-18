[//]: # (title: Mapping struct and union types from C – tutorial)

This is the second post in the series. The very first tutorial 
of the series is [Mapping primitive data types from C](mapping-primitive-data-types-from-c.md).
There are also the [Mapping function pointers from C](mapping-function-pointers-from-c.md) and 
[Mapping Strings from C](mapping-strings-from-c.md) tutorials.

In the tutorial, you will learn:
- [How struct and union types are mapped](#mapping-struct-and-union-c-types)
- [How to use struct and union type from Kotlin](#use-struct-and-union-types-from-kotlin)

## Mapping struct and union C types

The best way to understand the mapping between Kotlin and C is to try a tiny 
example. We will declare a struct and a union in the C language, to see how they are mapped into Kotlin.

Kotlin/Native comes with the `cinterop` tool, the tool generates bindings between the C language and Kotlin.
It uses a `.def` file to specify a C library to import. More details are discussed in the
[Interop with C Libraries](native-c-interop.md) tutorial.
 
In [the previous tutorial](mapping-primitive-data-types-from-c.md), you've created a `lib.h` file. This time, 
include those declarations directly into the `interop.def` file, after the `---` separator line:

```c

---

typedef struct {
  int a;
  double b;
} MyStruct;

void struct_by_value(MyStruct s) {}
void struct_by_pointer(MyStruct* s) {}

typedef union {
  int a;
  MyStruct b;
  float c;
} MyUnion;

void union_by_value(MyUnion u) {}
void union_by_pointer(MyUnion* u) {}

``` 

The `interop.def` file is enough to compile and run the application or open it in an IDE.
Now it is time to create project files, open the project in
[IntelliJ IDEA](https://jetbrains.com/idea) and run it. 

## Inspect Generated Kotlin APIs for a C library

While it is possible to use the command line, either directly or
by combining it with a script file (such as `.sh` or `.bat` file), this approach doesn't
scale well for big projects that have hundreds of files and libraries.
It is then better to use the Kotlin/Native compiler with a build system, as it
helps to download and cache the Kotlin/Native compiler binaries and libraries with
transitive dependencies and run the compiler and tests.
Kotlin/Native can use the [Gradle](https://gradle.org) build system through the [kotlin-multiplatform](mpp-discover-project.md#multiplatform-plugin) plugin.

We covered the basics of setting up an IDE compatible project with Gradle in the
[A Basic Kotlin/Native Application](native-gradle.md)
tutorial. Please check it out if you are looking for detailed first steps
and instructions on how to start a new Kotlin/Native project and open it in IntelliJ IDEA.
In this tutorial, we'll look at the advanced C interop related usages of Kotlin/Native and [multiplatform](mpp-discover-project.md#multiplatform-plugin) builds with Gradle.

First, create a project folder. All the paths in this tutorial will be relative to this folder. Sometimes
the missing directories will have to be created before any new files can be added.

Use the following `build.gradle(.kts)` Gradle build file:

<tabs>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

repositories {
    mavenCentral()
}

kotlin {
  linuxX64('native') {  // on Linux
  // macosX64('native') { // on macOS
  // mingwX64('native') { //on Windows
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

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

repositories {
    mavenCentral()
}

kotlin {
  linuxX64("native") { // on Linux
  // macosX64("native") { // on macOS
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

</tabs>

The prepared project sources can be directly downloaded from GitHub:

* for macOS: [Groovy](https://github.com/kotlin/web-site-samples/archive/mpp-kn-app-groovy-macos-c.zip), [Kotlin](https://github.com/kotlin/web-site-samples/archive/mpp-kn-app-kotlin-macos-c.zip)
* for Linux: [Groovy](https://github.com/kotlin/web-site-samples/archive/mpp-kn-app-groovy-linux-c.zip), [Kotlin](https://github.com/kotlin/web-site-samples/archive/mpp-kn-app-kotlin-linux-c.zip)
* for Windows: [Groovy](https://github.com/kotlin/web-site-samples/archive/mpp-kn-app-groovy-windows-c.zip), [Kotlin](https://github.com/kotlin/web-site-samples/archive/mpp-kn-app-kotlin-windows-c.zip)

The project file configures the C interop as an additional step of the build.
Let's move the `interop.def` file to the `src/nativeInterop/cinterop` directory.
Gradle recommends using conventions instead of configurations,
for example, the source files are expected to be in the `src/nativeMain/kotlin` folder.
By default, all the symbols from C are imported to the `interop` package,
you may want to import the whole package in our `.kt` files.
Check out the [kotlin-multiplatform](mpp-discover-project.md#multiplatform-plugin)
plugin documentation to learn about all the different ways you could configure it.

Create a `src/nativeMain/kotlin/hello.kt` stub file with the following content
to see how C declarations are visible from Kotlin:

```kotlin
import interop.*

fun main() {
  println("Hello Kotlin/Native!")
  
  struct_by_value(/* fix me*/)
  struct_by_pointer(/* fix me*/)
  union_by_value(/* fix me*/)
  union_by_pointer(/* fix me*/)
}
```

Now you are ready to
[open the project in IntelliJ IDEA](native-get-started.md)
and to see how to fix the example project. While doing that,
see how C primitive types are mapped into Kotlin/Native.

## Primitive types in Kotlin

With the help of IntelliJ IDEA's __Go to | Declaration__ or
compiler errors, you see the following generated API for the C functions, `struct`, and `union`:

```kotlin
fun struct_by_value(s: CValue<MyStruct>)
fun struct_by_pointer(s: CValuesRef<MyStruct>?)

fun union_by_value(u: CValue<MyUnion>)
fun union_by_pointer(u: CValuesRef<MyUnion>?)

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

You see that `cinterop` generated wrapper types for our `struct` and `union` types. 
For `MyStruct` and `MyUnion` type declarations in C, there are the Kotlin
classes `MyStruct` and `MyUnion` generated respectively.
The wrappers inherit from the `CStructVar` base class and declare all fields as Kotlin properties.
It uses `CValue<T>` to represent a by-value structure parameter and `CValuesRef<T>?`
to represent passing a pointer to a structure or a union.

Technically, there is no difference between `struct` and `union` types on the 
Kotlin side. Note that `a`, `b`, and `c` properties of `MyUnion` class in Kotlin use
the same memory location to read/write their value just like `union` does in C language. 

More details and advanced use-cases are presented in the  
[C Interop documentation](native-c-interop.md)

## Use struct and union types from Kotlin

It is easy to use the generated wrapper classes for C `struct` and `union` types from Kotlin. Thanks to the generated
properties, it feels natural to use them in Kotlin code. The only question, so far, is how to create a new instance on those
classes. As you see from the declarations of `MyStruct` and `MyUnion`, their constructors require a `NativePtr`.
Of course, you are not willing to deal with pointers manually. Instead, you can use Kotlin API to have those 
objects instantiated for us. 

Let's take a look at the generated functions that take our `MyStruct` and `MyUnion` as parameters. You see that 
by-value parameters are represented as `kotlinx.cinterop.CValue<T>`. And for typed pointer parameters you 
see `kotlinx.cinterop.CValuesRef<T>`.
Kotlin provides us with an API to deal with both types easily, let's try it and see.

### Create a `CValue<T>`

`CValue<T>` type is used to pass by-value parameters to a C function call.
Use `cValue` function to create `CValue<T>` object instance. The function requires a
[lambda function with a receiver](lambdas.md#function-literals-with-receiver) 
to initialize the underlying C type in-place. The function is declared as follows:

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

Now it is time to see how to use `cValue` and pass by-value parameters:

```kotlin
fun callValue() {

  val cStruct = cValue<MyStruct> {
    a = 42
    b = 3.14
  }
  struct_by_value(cStruct)

  val cUnion = cValue<MyUnion> {
    b.a = 5
    b.b = 2.7182
  }

  union_by_value(cUnion)
}
```

### Create struct and union as `CValuesRef<T>`

`CValuesRef<T>` type is used in Kotlin to pass a typed pointer parameter of a C 
function. First, you need an instance of 
`MyStruct` and `MyUnion` classes. Create them directly in the native memory. 
Use the    

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T   
```

extension function on `kotlinx.cinterop.NativePlacement`
type for this.

`NativePlacement` represents native memory with functions similar to `malloc` and `free`. 
There are several implementations of `NativePlacement`. The global one is called with `kotlinx.cinterop.nativeHeap`
and don't forget to call the `nativeHeap.free(..)` function to free the memory after use.
 
Another option is to use the

```kotlin
fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R    
```

function. It creates a short-lived memory allocation scope,
and all allocations will be cleaned up automatically at the end of the `block`.

Your code to call functions with pointers will look like this:

```kotlin
fun callRef() {
  memScoped {
    val cStruct = alloc<MyStruct>()
    cStruct.a = 42
    cStruct.b = 3.14

    struct_by_pointer(cStruct.ptr)

val cUnion = alloc<MyUnion>()
    cUnion.b.a = 5
    cUnion.b.b = 2.7182

    union_by_pointer(cUnion.ptr)
  }
}

```

Note that this code uses the extension property `ptr` which comes from a `memScoped` lambda receiver type, 
to turn `MyStruct` and `MyUnion` instances into native pointers.

The `MyStruct` and `MyUnion` classes have the pointer to the native memory underneath. The memory will be released
when a `memScoped` function ends, which is equal to the end of its `block`. Make sure that a
pointer is not used outside of the `memScoped` call. You may use `Arena()` or `nativeHeap` for pointers that 
should be available longer, or are cached inside a C library.  

### Conversion between `CValue<T>` and `CValuesRef<T>`

Of course, there are use cases when you need to pass a struct as a value to one call, and then, to 
pass the same struct as a reference to another call. This is possible in Kotlin/Native too. A 
`NativePlacement` will be needed here. 

Let's see now `CValue<T>` is turned to a pointer first:

```kotlin
fun callMix_ref() {
  val cStruct = cValue<MyStruct> {
    a = 42
    b = 3.14
  }
  
  memScoped { 
    struct_by_pointer(cStruct.ptr)
  }
}
```  

This code uses the extension property `ptr` which comes from `memScoped` lambda receiver type 
to turn `MyStruct` and `MyUnion` instances into native pointers. Those pointers are only valid
inside the `memScoped` block.

For the opposite conversion, to turn a pointer into a by-value variable, 
we call the `readValue()` extension function:

```kotlin
fun callMix_value() {
  memScoped {
    val cStruct = alloc<MyStruct>()
    cStruct.a = 42
    cStruct.b = 3.14

    struct_by_value(cStruct.readValue())
  }
}
```

## Run the code

Now when you have learned how to use C declarations in your code, you are ready to try
it out on a real example. Let's fix the code and see how it runs by calling the 
`runDebugExecutableNative` Gradle task [in the IDE](native-get-started.md)
or by using the following console command:

```bash
./gradlew runDebugExecutableNative
```

The final code in the `hello.kt` file may look like this:
 
```kotlin
import interop.*
import kotlinx.cinterop.alloc
import kotlinx.cinterop.cValue
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.ptr
import kotlinx.cinterop.readValue

fun main() {
  println("Hello Kotlin/Native!")

  val cUnion = cValue<MyUnion> {
    b.a = 5
    b.b = 2.7182
  }

  memScoped {
    union_by_value(cUnion)
    union_by_pointer(cUnion.ptr)
  }

  memScoped {
    val cStruct = alloc<MyStruct> {
      a = 42
      b = 3.14
    }

    struct_by_value(cStruct.readValue())
    struct_by_pointer(cStruct.ptr)
  }
}
```

## Next steps

Continue exploring the C language types and their representation in Kotlin/Native in the related tutorials:
- [Mapping primitive data types from C](mapping-primitive-data-types-from-c.md)
- [Mapping function pointers from C](mapping-function-pointers-from-c.md)
- [Mapping strings from C](mapping-strings-from-c.md)

The [C Interop documentation](native-c-interop.md) covers more advanced scenarios of the interop.

