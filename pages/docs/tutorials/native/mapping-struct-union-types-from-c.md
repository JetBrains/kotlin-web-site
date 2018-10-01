---
type: tutorial
layout: tutorial
title:  "Mapping Struct and Union Types from C"
description: "Struct and Union types from C and how they look in Kotlin/Native"
authors: Eugene Petrenko 
date: 2018-07-23
showAuthorInfo: false
issue: EVAN-5343
---

This is the second post in the series. If you haven't done so already, you may want to begin with the very first tutorial 
of the series called [Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html).
There are also the [Mapping Struct and Union Types from C](mapping-struct-union-types-from-c.html) and 
[Mapping Strings from C](mapping-strings-from-c.html) tutorials.

In the tutorial you will learn:
- [How Struct and Union types are mapped](#mapping-struct-and-union-c-types)
- [How to use Struct and Union type from Kotlin](#using-struct-and-union-types-from-kotlin)

We need to have a Kotlin compiler on our machines.
You may want to take a look at the
[A Basic Kotlin Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial for more information on performing this step.
Let's assume, we have a console, where the `kotlinc-native`, `cinterop`, and `klib` commands are available. 

## Mapping Struct and Union C types

The best way to understand the mapping between Kotlin and C is to try a tiny 
example. We will declare a struct and an union in the C language to see how they are mapped into Kotlin.

Kotlin/Native comes with the `cinterop` tool, the tool generates bindings between the C language and Kotlin.
It uses a `.def` file to specify a C library to import. For more details
you may want to check out the [Interop with C Libraries](interop-with-c.html) tutorial.
 
In [the previous tutorial](mapping-primitive-data-types-from-c.html) we created a `lib.h` file. This time, 
we are going to include those declarations directly into the `lib.def` file, after the `---` separator line:

<div class="sample" markdown="1" mode="c" theme="idea" data-highlight-only="1" auto-indent="false">

```c

---

typedef struct {
  int a;
  double b;
} MyStruct;

void struct_by_value(MyStruct s);
void struct_by_pointer(MyStruct* s);

typedef union {
  int a;
  MyStruct b;
  float c;
} MyUnion;

void union_by_value(MyUnion u);
void union_by_pointer(MyUnion* u);

``` 
</div>

Now we call:  
```bash
cinterop -def lib.def -o lib.klib
klib contents lib.klib
```
and it prints the following Kotlin API for our C library with `struct` and `union` inside:

<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

We see that `cinterop` generated wrapper types for our `struct` and `union` types. 
For `MyStruct` and `MyUnion` type declarations in C, we have the Kotlin
classes `MyStruct` and `MyUnion` generated respectively.
The wrappers inherit from the `CStructVar` base class and declare all fields as Kotlin properties.
It uses `CValue<T>` to represent a by-value structure parameter and `CValuesRef<T>?`
to represent passing a pointer to a structure or a union.

Technically, there is no difference between `struct` and `union` types on the 
Kotlin side. We should note, that `a`, `b`, and `c` properties of `MyUnion` class in Kotlin use
the same memory location to read/write their value just like `union` does in C language. 

You may want to take a look at the 
[C Interop documentation](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md#passing-and-receiving-structs-by-value)
for more details.

## Using Struct and Union Types from Kotlin

It is easy to use the generated wrapper classes for C `struct` and `union` types from Kotlin. Thanks to the generated
properties, it feels natural to use them in Kotlin code. The only question, so far, is how do we create a new instance on those
classes. As we see from the declarations of `MyStruct` and `MyUnion`, their constructors require a `NativePtr`.
Of course, we are not willing to deal with pointers manually. Instead, we can use Kotlin API to have those 
objects instantiated for us. 

Let's take a look at the generated functions that take our `MyStruct` and `MyUnion` as parameters. We see that 
by-value parameters are represented as `kotlinx.cinterop.CValue<T>`. And for typed pointer parameters we 
see `kotlinx.cinterop.CValuesRef<T>`.
Kotlin provides us with an API to deal with both types easily, let's try it and see.

### Creating a `CValue<T>`

`CValue<T>` type is used to pass by-value parameters to a C function call.
We use `cValue` function to create `CValue<T>` object instance. The function requires a
[lambda function with a receiver](../../reference/lambdas.html#function-literals-with-receiver) 
to initialize the underlying C type in-place. The function is declared as follows:
<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```
</div>

Now it is time to see how to use `cValue` and pass by-value parameters:
<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

### Creating Struct and Union as `CValuesRef<T>`

`CValuesRef<T>` type is used in Kotlin to pass a typed pointer parameter of a C 
function. First, we need an instance of 
`MyStruct` and `MyUnion` classes. This time we create them directly in the native memory. 
Let's use the    
<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T   
```
</div>

extension function on `kotlinx.cinterop.NativePlacement`
type for that.

`NativePlacement` represents native memory with functions similar to `malloc` and `free`. 
There are several implementations of `NativePlacement`. The global one is called `kotlinx.cinterop.nativeHeap`
and don't forget to call `nativeHeap.free(..)` function to free the memory after use.
 
Another option is to use the
<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R    
```
</div>

function. It creates a short-living memory allocation scope,
and all allocations will be cleaned up automatically at the end of the `block`.

Our code to call functions with pointers will look like this:
<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

The `MyStruct` and `MyUnion` classes have the pointer to the native memory underneath. The memory will be released
when a `memScoped` function ends, which is equal to the end of its `block`. Be careful to make sure that a
pointer outside is not needed for the `memScoped` call. We may use `Arena()` or `nativeHeap` for pointers that 
should be available for longer, or are cached inside the C library.  

### Conversion between `CValue<T>` and `CValuesRef<T>`

Of course, there are use cases, where we need to pass a struct as a value to one call, and then, to 
pass the same struct as a reference to another call. This is possible in Kotlin/Native too. A 
`NativePlacement` will be needed here. 

Let's see now `CValue<T>` is turned to a pointer first:
<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

Here we use the extension property `ptr` which comes from `memScoped` lambda receiver type 
to turn `MyStruct` and `MyUnion` instances into native pointers. Those pointers are only valid
inside the `memScoped` block.

For the opposite conversion, to turn a pointer into a by-value variable, 
we call the `readValue()` extension function:

<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

## Next Steps

Join us to continue exploring the C language types and their representation in Kotlin/Native in the related tutorials:
- [Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html)
- [Mapping Function Pointers from C](mapping-function-pointers-from-c.html)
- [Mapping Strings from C](mapping-strings-from-c.html)

You may also want to take a look at the [C Interop documentation](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md)
for more advanced scenarios.

