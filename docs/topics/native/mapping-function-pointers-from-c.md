[//]: # (title: Mapping function pointers from C – tutorial)

This is the third post in the series. The very first tutorial is
[Mapping primitive data types from C](mapping-primitive-data-types-from-c.md). There are also
[Mapping struct and union types from C](mapping-struct-union-types-from-c.md) and 
[Mapping strings from C](mapping-strings-from-c.md) tutorials.

In this tutorial We will learn how to:
- [Pass Kotlin function as C function pointer](#pass-kotlin-function-as-c-function-pointer)
- [Use C function pointer from Kotlin](#use-the-c-function-pointer-from-kotlin)

## Mapping function pointer types from C

The best way to understand the mapping between Kotlin and C is to try a tiny 
example. Declare a function that accepts a function pointer as a parameter and 
another function that returns a function pointer. 

Kotlin/Native comes with the `cinterop` tool; the tool generates bindings between the C language and Kotlin.
It uses a `.def` file to specify a C library to import. More details on this are
in [Interop with C Libraries](native-c-interop.md).
 
The quickest way to try out C API mapping is to have all C declarations in the
`interop.def` file, without creating any `.h` of `.c` files at all. Then place the C declarations 
in a `.def` file after the special `---` separator line:

```c 

---

int myFun(int i) {
  return i+1;
}

typedef int  (*MyFun)(int);

void accept_fun(MyFun f) {
  f(42);
}

MyFun supply_fun() {
  return myFun;
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
Kotlin/Native can use the [Gradle](https://gradle.org) build system through the [kotlin-multiplatform](mpp-discover-project.md#multiplatform-plugin) plugin.

We covered the basics of setting up an IDE compatible project with Gradle in the
[A Basic Kotlin/Native Application](native-gradle.md)
tutorial. Please check it out if you are looking for detailed first steps
and instructions on how to start a new Kotlin/Native project and open it in IntelliJ IDEA.
In this tutorial, we'll look at the advanced C interop related usages of Kotlin/Native 
and [multiplatform](mpp-discover-project.md#multiplatform-plugin)
builds with Gradle.

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

The project file configures the C interop as an additional step of the build.
Let's move the `interop.def` file to the `src/nativeInterop/cinterop` directory.
Gradle recommends using conventions instead of configurations,
for example, the source files are expected to be in the `src/nativeMain/kotlin` folder.
By default, all the symbols from C are imported to the `interop` package,
you may want to import the whole package in our `.kt` files.
Check out the [kotlin-multiplatform](mpp-discover-project.md#multiplatform-plugin)
plugin documentation to learn about all the different ways you could configure it.

Let's create a `src/nativeMain/kotlin/hello.kt` stub file with the following content
to see how C primitive type declarations are visible from Kotlin:

```kotlin
import interop.*

fun main() {
  println("Hello Kotlin/Native!")
  
  accept_fun(https://kotlinlang.org/*fix me */)
  val useMe = supply_fun()
}
```

Now you are ready to
[open the project in IntelliJ IDEA](native-get-started.md)
and to see how to fix the example project. While doing that,
see how C functions are mapped into Kotlin/Native declarations.

## C function pointers in Kotlin

With the help of IntelliJ IDEA's __Go to | Declaration__ or
compiler errors, see the following declarations for the C functions:

```kotlin
fun accept_fun(f: MyFun? /* = CPointer<CFunction<(Int) -> Int>>? */)
fun supply_fun(): MyFun? /* = CPointer<CFunction<(Int) -> Int>>? */

fun myFun(i: kotlin.Int): kotlin.Int

typealias MyFun = kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>

typealias MyFunVar = kotlinx.cinterop.CPointerVarOf<lib.MyFun>
```

You see that the function's `typedef` from C has been turned into Kotlin `typealias`. It uses `CPointer<..>` type
to represent the pointer parameters, and `CFunction<(Int)->Int>` to represent the function signature. 
There is an `invoke` operator extension function available for all `CPointer<CFunction<..>` types, so that 
it is possible to call it as you would call any other function in Kotlin. 

## Pass Kotlin function as C function pointer

It is the time to try using C functions from the Kotlin program. Call the `accept_fun`
function and pass the C function pointer to a Kotlin lambda:

```kotlin
fun myFun() {
  accept_fun(staticCFunction<Int, Int> { it + 1 })
}

```

This call uses the `staticCFunction{..}` helper function from Kotlin/Native to wrap a Kotlin lambda function into a C function pointer.
It only allows having unbound and non-capturing lambda functions. For example, it is not able
to use a local variable from the function. You may only use globally visible declarations. Throwing exceptions
from a `staticCFunction{..}` will end up in non-deterministic side-effects. It is vital to make sure that you code is not 
throwing any sudden exceptions from it.

## Use the C function pointer from Kotlin

The next step is to call a C function pointer from a C pointer that you have from the `supply_fun()` call:

```kotlin
fun myFun2() {
  val functionFromC = supply_fun() ?: error("No function is returned")
  
  functionFromC(42)
}

```

Kotlin turns the function pointer return type into a nullable `CPointer<CFunction<..>` object. There is the need
to explicitly check for `null` first. The [elvis operator](null-safety.md) for that in the code above.
The `cinterop` tool helps us to turn a C function pointer into an easy to call object in Kotlin. This is
what we did on the last line.

## Fix the code

You've seen all definitions and it is time to fix and run the code.
Run the `runDebugExecutableNative` Gradle task [in the IDE](native-get-started.md)
or use the following command to run the code:

```bash
./gradlew runDebugExecutableNative
```

The code in the `hello.kt` file may look like this:

```kotlin
import interop.*
import kotlinx.cinterop.*

fun main() {
  println("Hello Kotlin/Native!")
 
  val cFunctionPointer = staticCFunction<Int, Int> { it + 1 }
  accept_fun(cFunctionPointer)

  val funFromC = supply_fun() ?: error("No function is returned")
  funFromC(42)
}
```

## Next Steps

Continue exploring more C language types and their representation in Kotlin/Native
in next tutorials:
- [Mapping primitive data types from C](mapping-primitive-data-types-from-c.md)
- [Mapping struct and union types from C](mapping-struct-union-types-from-c.md)
- [Mapping strings from C](mapping-strings-from-c.md)

The [C Interop documentation](native-c-interop.md)
 covers more advanced scenarios of the interop.
