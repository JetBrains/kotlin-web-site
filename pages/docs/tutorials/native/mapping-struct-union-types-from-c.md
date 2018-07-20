---
type: tutorial
layout: tutorial
title:  "Mapping Struct and Union Types from C"
description: "Struct and Union types from C and how they look in Kotlin/Native side"
authors: Eugene Petrenko 
date: 2018-07-20
showAuthorInfo: false
issue: EVAN-5343
---

That is the second post in the series. You might want to check the first tutorial called
[Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html) first. 

In that tutorial we see how `struct` and `union` types from C are visible to Kotlin. 
You will learn:
- [How Struct and Union types are mapped](#mapping-struct-and-union-c-types)
- [How to use Struct and Union type from Kotlin](#using-struct-and-union-types-from-kotlinnative)

We need to have a Kotlin compiler on our machines. 
You may have a look at the
[A Basic Kotlin Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial for more information on performing this step.
Let's assume we have a console, where `kotlinc`, `cinterop` and `klib` commands are available. 

## Mapping Struct and Union C types

The best way to understand the mapping between Kotlin and C is to try a tiny 
example. We declare a struct and an union in C language to see how they are mapped into Kotlin.

`cinterop`, the tool to generate bindings between C langauge and Kotlin, uses 
a `.def` file to specify a library to import. For more details
you may check [Interop with C Libraries](interop-with-c.html) tutorial.
 
In [the previous tutorial](mapping-primitive-data-types-from-c.html) we created an `lib.h` file. This time, 
we include those declarations directly into the `lib.def` file, after `---` line:

```c

---

typedef struct {
  int a;
  const double b;
} MyStruct;

void struct_by_value(MyStruct s);
void struct_by_pointer(MyStruct* s);

typedef union {
  const int a;
  MyStruct b;
  float c;
} MyUnion;

void union_by_value(MyUnion u);
void union_by_pointer(MyUnion* u);

``` 

Now we call:  
```bash
cinterop -def lib.def -o lib.klib
klib contents lib.klib
```
and it prints the following Kotlin API for our C library with `struct` and `union` inside:

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

We see that `cinterop` generated wrapper types for our `sturct` and `union` types. 
For `MyStruct` and `MyUnion` type declarations in C we have a Kotlin wrappers generated and 
classes `MyStruct` and `MyUnion` respectively.
The wrappers inherit from `CStructVar` base class and declare all fields as Kotlin properties.

It uses `CValue<T>` to represent a by-value structure parameter and `CValuesRef<T>?`
to represent passing a pointer to a structure or an union.

We see that there is technically no difference between `struct` and `union` types on the 
Kotlin side. We should note, that `a`, `b`, and `c` properties of `MyUnion` class in Kotlin use
the same memory location to read/write their value just like `union` does in C language. 

We may take a look at the 
[C Interop documentation](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md#passing-and-receiving-structs-by-value)
for more details.

## Using Struct and Union Types from Kotlin

One may easily use the generated wrapper classes for C `struct` and `union` types from Kotlin. Thanks to the generated
properties, it feels natural to use in Kotlin. The only question, so far, is how we create a new instance on those
classes. As we see from the declarations of `MyStruct` and `MyUnion`, their constructors require a `NativePtr`.
Of course, we are not willing to deal with pointers manually. Instead, we use Kotlin API to have those 
objects instantiated for us. 

Let's take a look at the generated functions that takes our `MyStruct` and `MyUnion` as parameters. We see that 
by-value parameters are represented as `kotlinx.cinterop.CValue<T>`. And for typed pointer parameters we 
see `kotlinx.cinterop.CValuesRef<T>`.
Kotlin provides us with API to deal with both types easily, let's try and see how it goes.

### Creating a CValue<T>

`CValue<T>` type is used to pass by-value parameters to C function calls.
We use `cValue` function to create `CValue<T>` object instance. The function requires a
[lambda function with a receiver](../../reference/lambdas.html#function-literals-with-receiver) 
to initialize the underlying C type in-place. The function declared as follows:
```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

Now it is time to see how one uses `cValue` and passes by-value parameters:

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

### Creating Struct and Union as CValuesRef<T>

`CValuesRef<T>` type is used in Kotlin to a typed pointer parameter of a C functions. First we need an instance of 
`MyStruct` and `MyUnion` classes. This time we create them directly in the native memory. Let's use 
the    
```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T   
```
extension function on `kotlinx.cinterop.NativePlacement`
type for that.

`NativePlacement` represents native memory with functions similar to `malloc` and `free`. 
There are several implementations of `NativePlacement`. The global one is called `kotlinx.cinterop.nativeHeap`
and you shall not forget to call `nativeHeap.free(..)` function to free the memory after use. 
Another option is to use the
```kotlin
fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R    
```
function. It helps to create a short-leaving
pointers scope and to have them cleaned up automatically at the end.

Our code to call functions with pointers will look like that:
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

Note, here we use the extension property `ptr` which comes from `memScoped` lambda receiver type 
to turn `MyStruct` and `MyUnion` instances into native pointers.

The `MyStruct` and `MyUnion` classes has the pointer to the native memory underneath. The memory will be released
when `memScoped` function exits, which is equal to the end of its block. One should make sure, they do not need the
pointer outside for the `memScoped` call. One uses `Arena()` or `nativeHeap` for pointers, that 
should be available longer, and for pointers that are cached inside C library.   

### Conversion between CValue<T> and CValuesRef<T>

Of course, there are use cases, where we need to pass a struct as a value to one call, and than, to 
pass the same struct as a reference to the other call. It is possible in Kotlin native too. And 
`NativePlacement` is needed here too. 

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

Note, here we use the extension property `ptr` which comes from `memScoped` lambda receiver type 
to turn `MyStruct` and `MyUnion` instances into native pointers.


We use `readValue()` function to turn our pointer into a by-value parameter:

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

## Next Steps

Join us to continue exploring C language types and their representation in Kotlin in the related tutorials:
- [Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html). 

You may also take a look at the [C Interop documentation](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md)
for more advanced scenarios.



## TODO:
- Deal with [struct and union C types](#struct-and-union-c-types)
TODO:
- C types maps to Kotlin types
- C function pointers and their mapping in Kotlin
- And something more (TODO)
- Strings? (TODO)
