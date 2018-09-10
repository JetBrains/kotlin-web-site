---
type: tutorial
layout: tutorial
title:  "Mapping Function Pointers from C"
description: "Function pointers from C and how they look in Kotlin/Native"
authors: Eugene Petrenko 
date: 2018-07-20
showAuthorInfo: false
issue: EVAN-5343
---

This is the third post in the series. You might want to begin with the very first tutorial called
[Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html). There are also
[Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html) and 
[Mapping Strings from C](mapping-strings-from-c.html) tutorials.

In this tutorial you will learn how to:
- [Pass Kotlin function as C function pointer](#passing-kotlin-function-as-c-function-pointer)
- [Use C function pointer from Kotlin](#using-the-c-function-pointer-from-kotlin)

We need to have a Kotlin compiler on our machines. 
You may want to have a look at the
[A Basic Kotlin Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial for more information on performing this step.
Let's assume that we have a console, where the `kotlinc-native`, `cinterop`, and `klib` commands are available. 


## Mapping Function Pointer Types from C

The best way to understand the mapping between Kotlin and C is to try a tiny 
example. We declare a function that accepts a function pointer as a parameter and 
another function that returns a function pointer. 

Kotlin/Native comes with the `cinterop` tool; the tool generates bindings between the C language and Kotlin.
It uses a `.def` file to specify a C library to import. For more details on this
you may want to check out the [Interop with C Libraries](interop-with-c.html) tutorial.
 
The quickest way to try out C API mapping is to have all C declarations in the
`lib.def` file, without creating any `.h` of `.c` files at all. Then place the C declarations 
in a `.def` file after the special `---` separator line:

<div class="sample" markdown="1" mode="c" theme="idea" data-highlight-only="1" auto-indent="false">

```c 

---

typedef int  (*MyFun)(int);

void  accept_fun(MyFun f);
MyFun supplies_fun();

``` 
</div>

Now we call:  
```bash
cinterop -def lib.def -o lib.klib
klib contents lib.klib
```
and it prints the following Kotlin API for our C library declarations:

<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun accept_fun(f: MyFun? /* = CPointer<CFunction<(Int) -> Int>>? */)
fun supply_fun(): MyFun? /* = CPointer<CFunction<(Int) -> Int>>? */

typealias MyFun = kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>

typealias MyFunVar = kotlinx.cinterop.CPointerVarOf<lib.MyFun>
```
</div>

We see that our function typedef from C has been turned into Kotlin `typealias`. It uses `CPointer<..>` type
to represent the pointer parameters, and `CFunction<(Int)->Int>` to represent the function signature. 
There is an `invoke` operator extension function available for all `CPointer<CFunction<..>` types, so that 
it is possible to call it as you would call any other function in Kotlin. 

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

Here we use `staticCFunction{..}` helper function from Kotlin/Native to wrap a Kotlin lambda function into a C Function pointer.
It only allows having unbound and non-capturing lambda functions. For example, it is not able
to use a local variable from the function. We may only use globally visible declarations. Throwing exceptions
from a `staticCFunction{..}` will end up in non-deterministic side-effects. It is vital to make sure that we are not 
throwing any sudden exceptions from it

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
The `cinterop` tool helps us to turn a C function pointer into an easy to call object in Kotlin. That is
what we did with the last line

## Next Steps

You may continue exploring more C language types and their representation in Kotlin/Native
in next tutorials:
- [Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html)
- [Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html)
- [Mapping Strings from C](mapping-strings-from-c.html)

You may also have a look at the [C Interop documentation](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md)
for more advanced scenarios.

