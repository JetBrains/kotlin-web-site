---
type: tutorial
layout: tutorial
title:  "Mapping Struct and Union Types from C"
description: "Struct and Union types from C and how they look in Kotlin/Native"
authors: Eugene Petrenko 
date: 2019-04-15
showAuthorInfo: false
issue: EVAN-5343
---

This is the second post in the series. The very first tutorial 
of the series is [Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html).
There are also the [Mapping Function Pointers from C](mapping-function-pointers-from-c.html) and 
[Mapping Strings from C](mapping-strings-from-c.html) tutorials.

In the tutorial we will learn:
- [How Struct and Union types are mapped](#mapping-struct-and-union-c-types)
- [How to use Struct and Union type from Kotlin](#using-struct-and-union-types-from-kotlin)

## Mapping Struct and Union C types

The best way to understand the mapping between Kotlin and C is to try a tiny 
example. We will declare a struct and a union in the C language, to see how they are mapped into Kotlin.

Kotlin/Native comes with the `cinterop` tool, the tool generates bindings between the C language and Kotlin.
It uses a `.def` file to specify a C library to import. More details are discussed in the
[Interop with C Libraries](/docs/reference/native/c_interop.html) tutorial.
 
In [the previous tutorial](mapping-primitive-data-types-from-c.html) we created a `lib.h` file. This time, 
we are going to include those declarations directly into the `interop.def` file, after the `---` separator line:

<div class="sample" markdown="1" mode="c" theme="idea" data-highlight-only="1" auto-indent="false">

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
</div>

The `interop.def` file is enough to compile and run the application or open it in an IDE.
Now it is time to create project files, open the project in
[IntelliJ IDEA](https://jetbrains.com/idea) and run it. 

## Inspecting Generated Kotlin APIs for a C library

[[include pages-includes/docs/tutorials/native/mapping-primitive-data-types-gradle.md]]

Let's create a `src/nativeMain/kotlin/hello.kt` stub file with the following content
to see how our C declarations are visible from Kotlin:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>

Now we are ready to
[open the project in IntelliJ IDEA](using-intellij-idea.html)
and to see how to fix the example project. While doing that,
we'll examine how C primitive types are mapped into Kotlin/Native.

## Primitive Types in Kotlin

With the help of IntelliJ IDEA's _Goto Declaration_ or
compiler errors we see the following generated API for our C functions, `struct`, and `union`:

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

More details and advanced use-cases are presented in the  
[C Interop documentation](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md#passing-and-receiving-structs-by-value)

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
type for this.

`NativePlacement` represents native memory with functions similar to `malloc` and `free`. 
There are several implementations of `NativePlacement`. The global one is called with `kotlinx.cinterop.nativeHeap`
and don't forget to call the `nativeHeap.free(..)` function to free the memory after use.
 
Another option is to use the
<div class="sample" markdown="1" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R    
```
</div>

function. It creates a short-lived memory allocation scope,
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

Note, we use the extension property `ptr` which comes from a `memScoped` lambda receiver type, 
to turn `MyStruct` and `MyUnion` instances into native pointers.

The `MyStruct` and `MyUnion` classes have the pointer to the native memory underneath. The memory will be released
when a `memScoped` function ends, which is equal to the end of its `block`. Be careful to make sure that a
pointer is not used outside of the `memScoped` call. We may use `Arena()` or `nativeHeap` for pointers that 
should be available longer, or are cached inside a C library.  

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

We use the extension property `ptr` which comes from `memScoped` lambda receiver type 
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

## Running the Code

Now we have learned how to use C declarations in our code, we are ready to try
it out on a real example. Let's fix our code and see how it runs by calling the 
`runDebugExecutableNative` Gradle task [in the IDE](using-intellij-idea.html)
or by using the following console command:
[[include pages-includes/docs/tutorials/native/runDebugExecutableNative.md]]


The final code in the `hello.kt` file may look like this:
 
<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>


## Next Steps

Join us to continue exploring the C language types and their representation in Kotlin/Native in the related tutorials:
- [Mapping Primitive Data Types from C](mapping-primitive-data-types-from-c.html)
- [Mapping Function Pointers from C](mapping-function-pointers-from-c.html)
- [Mapping Strings from C](mapping-strings-from-c.html)

The [C Interop documentation](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md)
documentation covers more advanced scenarios of the interop

