---
type: tutorial
layout: tutorial
title:  "Mapping Function Pointers from C"
description: "Function pointers from C and how they look in Kotlin/Native"
authors: Eugene Petrenko 
date: 2019-04-15
showAuthorInfo: false
issue: EVAN-5343
---

This is the third post in the series. The very first tutorial is
[Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html). There are also
[Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html) and 
[Mapping Strings from C](mapping-strings-from-c.html) tutorials.

In this tutorial We will learn how to:
- [Pass Kotlin function as C function pointer](#passing-kotlin-function-as-c-function-pointer)
- [Use C function pointer from Kotlin](#using-the-c-function-pointer-from-kotlin)


## Mapping Function Pointer Types from C

The best way to understand the mapping between Kotlin and C is to try a tiny 
example. We declare a function that accepts a function pointer as a parameter and 
another function that returns a function pointer. 

Kotlin/Native comes with the `cinterop` tool; the tool generates bindings between the C language and Kotlin.
It uses a `.def` file to specify a C library to import. More details on this are
in the [Interop with C Libraries](/docs/reference/native/c_interop.html) tutorial.
 
The quickest way to try out C API mapping is to have all C declarations in the
`interop.def` file, without creating any `.h` of `.c` files at all. Then place the C declarations 
in a `.def` file after the special `---` separator line:

<div class="sample" markdown="1" mode="c" theme="idea" data-highlight-only="1" auto-indent="false">

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
  
  accept_fun(/*fix me */)
  val useMe = supply_fun()
}
```
</div>

Now we are ready to
[open the project in IntelliJ IDEA](using-intellij-idea.html)
and to see how to fix the example project. While doing that,
we'll examine how C functions are mapped into Kotlin/Native declarations.

## C Function Pointers in Kotlin

With the help of IntelliJ IDEA's _Goto Declaration_ or
compiler errors we see the following declarations for our C functions:

<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun accept_fun(f: MyFun? /* = CPointer<CFunction<(Int) -> Int>>? */)
fun supply_fun(): MyFun? /* = CPointer<CFunction<(Int) -> Int>>? */

fun myFun(i: kotlin.Int): kotlin.Int

typealias MyFun = kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>

typealias MyFunVar = kotlinx.cinterop.CPointerVarOf<lib.MyFun>
```
</div>

We see that our function typedef from C has been turned into Kotlin `typealias`. It uses `CPointer<..>` type
to represent the pointer parameters, and `CFunction<(Int)->Int>` to represent the function signature. 
There is an `invoke` operator extension function available for all `CPointer<CFunction<..>` types, so that 
it is possible to call it as we would call any other function in Kotlin. 

## Passing Kotlin Function as C Function Pointer

It is the time to try using C Functions from our Kotlin program. Let's call the `accept_fun`
function and pass the C function pointer to a Kotlin lambda:
<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun myFun() {
  accept_fun(staticCFunction<Int, Int> { it + 1 })
}

```
</div>

We use the `staticCFunction{..}` helper function from Kotlin/Native to wrap a Kotlin lambda function into a C function pointer.
It only allows having unbound and non-capturing lambda functions. For example, it is not able
to use a local variable from the function. We may only use globally visible declarations. Throwing exceptions
from a `staticCFunction{..}` will end up in non-deterministic side-effects. It is vital to make sure that we are not 
throwing any sudden exceptions from it.

## Using the C Function Pointer from Kotlin

The next step is to call a C function pointer from a C pointer that we have from the `supply_fun()` call:

<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun myFun2() {
  val functionFromC = supply_fun() ?: error("No function is returned")
  
  functionFromC(42)
}

```
</div>

Kotlin turns the function pointer return type into a nullable `CPointer<CFunction<..>` object. There is the need
to explicitly check for `null` first. We use [elvis operator](../../reference/null-safety.html) for that.
The `cinterop` tool helps us to turn a C function pointer into an easy to call object in Kotlin. This is
what we did on the last line.


## Fixing the Code

We've seen all definitions and it is time to fix and run the code.
Let's run the `runDebugExecutableNative` Gradle task [in the IDE](using-intellij-idea.html)
or use the following command to run the code:
[[include pages-includes/docs/tutorials/native/runDebugExecutableNative.md]]

The code in the `hello.kt` file may look like this:
<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>


## Next Steps

We will continue exploring more C language types and their representation in Kotlin/Native
in next tutorials:
- [Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html)
- [Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html)
- [Mapping Strings from C](mapping-strings-from-c.html)

The [C Interop documentation](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md)
documentation covers more advanced scenarios of the interop.
