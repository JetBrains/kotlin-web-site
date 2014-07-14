---
layout: api
title: flatMapTo
---
[stdlib](../index.md) / [kotlin](index.md) / [flatMapTo](flatMapTo.md)

# flatMapTo
Appends all elements yielded from results of *transform* function being invoked on each element of original collection, to the given *destination*
```
public fun <R, C : C> IntArray.flatMapTo(destination: C, transform: (Int)->Iterable<R>): C
public fun <R, C : C> ByteArray.flatMapTo(destination: C, transform: (Byte)->Iterable<R>): C
public fun <R, C : C> BooleanArray.flatMapTo(destination: C, transform: (Boolean)->Iterable<R>): C
public fun <K, V, R, C : C> Map<K, V>.flatMapTo(destination: C, transform: (Entry<K, V>)->Iterable<R>): C
public fun <R, C : C> String.flatMapTo(destination: C, transform: (Char)->Iterable<R>): C
public fun <R, C : C> LongArray.flatMapTo(destination: C, transform: (Long)->Iterable<R>): C
public fun <R, C : C> FloatArray.flatMapTo(destination: C, transform: (Float)->Iterable<R>): C
public fun <R, C : C> ShortArray.flatMapTo(destination: C, transform: (Short)->Iterable<R>): C
public fun <T, R, C : C> Iterable<T>.flatMapTo(destination: C, transform: (T)->Iterable<R>): C
public fun <T, R, C : C> Array<T>.flatMapTo(destination: C, transform: (T)->Iterable<R>): C
public fun <R, C : C> DoubleArray.flatMapTo(destination: C, transform: (Double)->Iterable<R>): C
public fun <R, C : C> CharArray.flatMapTo(destination: C, transform: (Char)->Iterable<R>): C
```
Returns the result of transforming each element to one or more values which are concatenated together into a single collection
```
public fun <T, R, C : C> Iterator<T>.flatMapTo(result: C, transform: (T)->Iterable<R>): C
```
Appends all elements yielded from results of *transform* function being invoked on each element of original stream, to the given *destination*
```
public fun <T, R, C : C> Stream<T>.flatMapTo(destination: C, transform: (T)->Stream<R>): C
```
