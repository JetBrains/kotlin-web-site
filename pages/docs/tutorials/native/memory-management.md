---
type: tutorial
layout: tutorial
title:  "Memory Management in Kotlin/Native"
description: "A look at how to work with memory in Kotlin/Native"
authors: Hadi Hariri 
date: 2018-02-19
showAuthorInfo: false
---



In this tutorial we'll learn about

*[Memory Management Models](#memory-management-models)
*[Memory Management in Kotlin/Native](#memory-management-in-kotlin/native)


## Heap versus Stack

When talking about memory usage in applications, there are two places where storage occurs

* Stack
* Heap

The Stack is usually a fixed pre-allocated amount of memory and is used to store local variables in functions, parameters passed in these and other general bookkeeping information in function calls, such as return address.
In a multithreaded environment, each thread gets allocated its own stack, and this cannot be shared across threads. When a stack reaches its maximum capacity, it usually results in a Stack Overflow exception if lucky, or some random crash. How the application behaves largely depends on the language and its memory management model.

A heap on the other is dynamic and can grow and shrink based on the amount of objects stored. Usually when creating an instance of class for example, this is allocated on the heap, with the exception of of certain unboxed values of types such as Int, Short, etc.

Storing and recuperating information on the stack is usually much faster than on the heap.

## Memory Management Models

When it comes to memory management and releasing of objects that have been created, with a stack this is bound to the lifetime of the current function execution. With a heap on the other hand, it is not. Depending on the language and technology, different forms of memory management are possible.

### Manual Memory Management

This is the simplest form of memory management whereby as a developer we need to free any memory that is allocated. For instance, the following code snippet in C shows us allocating some
memory, using it and then freeing it


```
#include <stdio.h>

int main()
{
   int *ptr_mem;
  
   ptr_mem = (int *)malloc(sizeof(int));
  
   ptr_mem = 100;
  
   printf("%d\n", *ptr_mem);
  
   free(ptr_mem);
  
   return 0;
```

Another example of a language that requires manual memory management is Delphi.

### Automatic Memory Management

With automatic memory management, as developers we no longer have to be concerned about freeing up memory we allocate on the heap. We allow the runtime or compiler to handle this for us. However, it is important to note that this
only handles memory allocated on the heap. Resources such as file handles, sockets, etc. still need to be released appropriately.

In terms of memory management techniques, there are multiple ways in which this can be handled:

### Garbage Collection

[Garbage Collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) is a form of memory management whereby a collector tries to free memory that is no longer being used. Many implementations using the concept of
*Generations* whereby objects are placed in different buckets depending on the lifetime, i.e. most objects have a short-lived life and stay on what's called *Generation 0*. Others that may last longer
are moved to *Generation 1* or *Generation 2*.

### Automatic Reference Counting

With [Automatic Reference Counting or ARC](https://en.wikipedia.org/wiki/Automatic_Reference_Counting), the compiler takes care of handling memory management for us. It does so by keeping count of the number of references there are to a specific object. When the count reaches zero, the object can be deallocated..
Example of languages using ARC are Objective C and Swift amongst others.

### Strong and Weak References

Let's assume we have a class `Parent` that has a property which holds an instance of a type `Child`


```kotlin
class Parent {
   val child = Child()
}
```

With ARC, the compiler will make sure that the instance `child` points to is only disposed of when there are no more references to it. This is what's known as a *strong* reference. In most cases, references to other objects are strong and thing work out well. However, there are scenarios where
this can be counter productive. One of these is that of cyclic references, i.e when two objects have references between themselves:

```kotlin
class Parent {
   val child = Child()
}

class Child {
   val parent = Parent()
}
```

This causes what's known as a retain cycle. When this happens ARC cannot really act since the two objects are keeping each other alive. To prevent such cases, often the concept of a *weak* reference is used. Weak references do not participate in reference counting. Many programming languages have the
concept of weak reference, whether they implement ARC (Swift) or Garbage Collection (C#).


## Memory Management in Kotlin/Native

In languages that use ARC, such as Swift, one way to solve the issue of cyclic references is to use weak references. This works but puts an additional burden on us as developers, in that we have to
proactively think about whether a specific reference should be weak. This isn't to say that weak references are exclusively used for cyclic references. They can be used in other scenarios and are often useful. 

In addition to ARC, Kotlin implements Cycle Collection based on [David F. Bacon's algorithm](https://researcher.watson.ibm.com/researcher/files/us-bacon/Bacon03Pure.pdf) which
has the ability to detect cyclic garbage in a reference counted system.

Consequently, when writing pure Kotlin code targeting native platforms, we do not have to be concerned with manual memory management or weak references. 

### Interop with C and Native Memory

Kotlin/Native provides a series of constructs to interop with C, such as mapping of types, working with pointers as well as native memory management. Kotlin/Native offers an interface named
`NativeFreeablePlacement`, of which there is currently a single implementation which is the `nativeHeap` object. This interface offers us some primitives to work with memory:


```kotlin
   val memory  = nativeHeap.allocArray<ByteVar>(10) // Allocate Memory

   // use the pointer

   nativeHeap.free(memory) // Free memory
```

To provide better insight into the scope that the allocated memory is used for, and at the same time make sure that it is cleaned up correctly, we can use the `memScoped` function

```kotlin

   memScoped {
       val memory = allocArray<ByteVar>(10) // Allocate Memory
   
       // use the pointer
   
   } // No need to call free, as this will be called automatically.

```
