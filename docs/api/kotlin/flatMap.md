---
layout: api
title: flatMap
---
[stdlib](../index.html) / [kotlin](index.html) / [flatMap](flatMap.html)

# flatMap
Returns a single stream of all elements streamed from results of *transform* function being invoked on each element of original stream
```
public fun <T, R> Stream<T>.flatMap(transform: (T)->Stream<R>): Stream<R>
```
Returns a single list of all elements yielded from results of *transform* function being invoked on each element of original collection
```
public fun <R> IntArray.flatMap(transform: (Int)->Iterable<R>): List<R>
public fun <T, R> Iterable<T>.flatMap(transform: (T)->Iterable<R>): List<R>
public fun <R> ShortArray.flatMap(transform: (Short)->Iterable<R>): List<R>
public fun <K, V, R> Map<K, V>.flatMap(transform: (Entry<K, V>)->Iterable<R>): List<R>
public fun <T, R> Array<T>.flatMap(transform: (T)->Iterable<R>): List<R>
public fun <R> String.flatMap(transform: (Char)->Iterable<R>): List<R>
public fun <R> FloatArray.flatMap(transform: (Float)->Iterable<R>): List<R>
public fun <R> LongArray.flatMap(transform: (Long)->Iterable<R>): List<R>
public fun <R> DoubleArray.flatMap(transform: (Double)->Iterable<R>): List<R>
public fun <R> ByteArray.flatMap(transform: (Byte)->Iterable<R>): List<R>
public fun <R> BooleanArray.flatMap(transform: (Boolean)->Iterable<R>): List<R>
public fun <R> CharArray.flatMap(transform: (Char)->Iterable<R>): List<R>
```
Returns an iterator over the concatenated results of transforming each element to one or more values
```
public fun <T, R> Iterator<T>.flatMap(transform: (T)->Iterator<R>): Iterator<R>
```
