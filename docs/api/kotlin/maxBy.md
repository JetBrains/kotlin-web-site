---
layout: api
title: maxBy
---
[stdlib](../index.html) / [kotlin](index.html) / [maxBy](maxBy.html)

# maxBy
Returns the first element yielding the largest value of the given function or null if there are no elements
```
public fun <R : R> LongArray.maxBy(f: (Long)->R): Long
public fun <R : R, T : T> Iterator<T>.maxBy(f: (T)->R): T
public fun <R : R, T : T> Array<T>.maxBy(f: (T)->R): T
public fun <R : R> DoubleArray.maxBy(f: (Double)->R): Double
public fun <R : R> ByteArray.maxBy(f: (Byte)->R): Byte
public fun <R : R, T : T> Iterable<T>.maxBy(f: (T)->R): T
public fun <R : R> ShortArray.maxBy(f: (Short)->R): Short
public fun <R : R, T : T> Stream<T>.maxBy(f: (T)->R): T
public fun <K, V, R : R> Map<K, V>.maxBy(f: (Entry<K, V>)->R): Entry<K, V>
public fun <R : R> String.maxBy(f: (Char)->R): Char
public fun <R : R> BooleanArray.maxBy(f: (Boolean)->R): Boolean
public fun <R : R> CharArray.maxBy(f: (Char)->R): Char
public fun <R : R> IntArray.maxBy(f: (Int)->R): Int
public fun <R : R> FloatArray.maxBy(f: (Float)->R): Float
```
