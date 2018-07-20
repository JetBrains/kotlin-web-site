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

That is the third post in the series. You might want to check the first tutorial called
[Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html) first or the 
second one called [Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html).

In that tutorial we see how function pointers from C are visible to Kotlin. 
You will learn:
- [How function pointer types are mapped from C](#mapping-function-pointer-types-from-c)
- [Dealing with C function pointers](#dealing-with-c-function-pointers)

We need to have a Kotlin compiler on our machines. 
You may have a look at the
[A Basic Kotlin Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial for more information on performing this step.
Let's assume we have a console, where `kotlinc`, `cinterop` and `klib` commands are available. 


## Mapping Function Pointer Types from C

The best way to understand the mapping between Kotlin and C is to try a tiny 
example. We declare a function that accepts a function pointer as a parameter and 
another function that returns a function pointer. 

`cinterop`, the tool to generate bindings between C language and Kotlin, uses 
a `.def` file to specify a library to import. For more details
you may check [Interop with C Libraries](interop-with-c.html) tutorial.
 
In [the previous tutorial](mapping-primitive-data-types-from-c.html) we created an `lib.h` file. This time, 
we include those declarations directly into the `lib.def` file, after `---` line:

```c 

---

typedef int  (*MyFun)(int);

void  accept_fun(MyFun f);
MyFun supplies_fun();

``` 

Now we call:  
```bash
cinterop -def lib.def -o lib.klib
klib contents lib.klib
```
and it prints the following Kotlin API for our C library declarations:

```kotlin
fun accept_fun(f: MyFun? /* = CPointer<CFunction<(Int) -> Int>>? */)
fun supply_fun(): MyFun? /* = CPointer<CFunction<(Int) -> Int>>? */

typealias MyFun = kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>

typealias MyFunVar = kotlinx.cinterop.CPointerVarOf<lib.MyFun>
```

We see that our function typedef from C turned into Kotlin `typealias`. It uses `CPointer<..>` type
to represent the pointer parameters, and `CFunction<(Int)->Int>` to represent the function signature. 
There in an `invoke` operator extension function available for all `CPointer<CFunction<..>` types, so that 
one is allowed to call as any other function in Kotlin. 

Let's see how one deals with C function pointers

## Dealing with C Function Pointers

It is the time to try using C Functions from our Kotlin program. The first one - we call `accept_fun`
function and pass C function pointer to a Kotlin function:
```kotlin
fun myFun() {
  accept_fun(staticCFunction<Int, Int> { it + 1 })
}

```

Here we use `staticCFunction{..}` helper function from Kotlin to wrap a lambda into a C Function pointer.
The function only allows to have an unbound and non-capturing lambda function. For example, it is not allowed
to use a local variable from the function. We may only use globally visible declarations.

The second step, we call a C function pointer from a C pointer we have from `supply_fun()` call:
```kotlin
fun myFun2() {
  val functionFromC = supply_fun() ?: error("No function is returned")
  
  functionFromC(42)
}

```

Kotlin turns the function pointer return type into nullable `CPointer<CFunction<..>` object. One need
to explicitly check for `null` first. We use [elvis operator](../reference/null-safety.html) for that.
The `cinterop` tool helps us to turn a C function pointer into an easy to call object in Kotlin.

## Next Steps

You may continue exploring more C language types and their representation in Kotlin/Native
in next tutorials:
- [Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html)
- [Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html)

You may also have a look at the [C Interop documentation](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md)
for more advanced scenarios.

