---
layout: api
title: map
---
[stdlib](../index.md) / [kotlin](index.md) / [map](map.md)

# map
Returns a list containing the results of applying the given *transform* function to each element of the original collection
```
public fun <R> CharArray.map(transform: (Char)->R): List<R>
public fun <K, V, R> Map<K, V>.map(transform: (Entry<K, V>)->R): List<R>
public fun <R> ShortArray.map(transform: (Short)->R): List<R>
public fun <R> ByteArray.map(transform: (Byte)->R): List<R>
public fun <R> IntArray.map(transform: (Int)->R): List<R>
public fun <T, R> Array<T>.map(transform: (T)->R): List<R>
public fun <R> LongArray.map(transform: (Long)->R): List<R>
public fun <R> FloatArray.map(transform: (Float)->R): List<R>
public fun <T, R> Iterable<T>.map(transform: (T)->R): List<R>
public fun <R> String.map(transform: (Char)->R): List<R>
public fun <R> DoubleArray.map(transform: (Double)->R): List<R>
public fun <R> BooleanArray.map(transform: (Boolean)->R): List<R>
```
Returns a stream containing the results of applying the given *transform* function to each element of the original stream
```
public fun <T, R> Stream<T>.map(transform: (T)->R): Stream<R>
```
Returns an iterator obtained by applying *transform*, a function transforming an object of type *T* into an object of type *R*
```
public fun <T, R> Iterator<T>.map(transform: (T)->R): Iterator<R>
```
