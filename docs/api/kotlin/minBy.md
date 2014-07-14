---
layout: api
title: minBy
---
[stdlib](../index.html) / [kotlin](index.html) / [minBy](minBy.html)

# minBy
Returns the first element yielding the smallest value of the given function or null if there are no elements
```
public fun <R : R> String.minBy(f: (Char)->R): Char
public fun <R : R> DoubleArray.minBy(f: (Double)->R): Double
public fun <R : R, T : T> Array<T>.minBy(f: (T)->R): T
public fun <R : R> LongArray.minBy(f: (Long)->R): Long
public fun <R : R> BooleanArray.minBy(f: (Boolean)->R): Boolean
public fun <R : R, T : T> Stream<T>.minBy(f: (T)->R): T
public fun <R : R> FloatArray.minBy(f: (Float)->R): Float
public fun <R : R> IntArray.minBy(f: (Int)->R): Int
public fun <R : R> ShortArray.minBy(f: (Short)->R): Short
public fun <K, V, R : R> Map<K, V>.minBy(f: (Entry<K, V>)->R): Entry<K, V>
public fun <R : R, T : T> Iterable<T>.minBy(f: (T)->R): T
public fun <R : R> CharArray.minBy(f: (Char)->R): Char
public fun <R : R> ByteArray.minBy(f: (Byte)->R): Byte
public fun <R : R, T : T> Iterator<T>.minBy(f: (T)->R): T
```
