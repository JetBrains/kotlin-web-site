---
layout: api
title: lastOrNull
---
[stdlib](../index.html) / [kotlin](index.html) / [lastOrNull](lastOrNull.html)

# lastOrNull
Returns last element, or null if collection is empty
```
public fun FloatArray.lastOrNull(): Float
public fun BooleanArray.lastOrNull(): Boolean
public fun <T> List<T>.lastOrNull(): T
public fun <T> Stream<T>.lastOrNull(): T
public fun ShortArray.lastOrNull(): Short
public fun <T> Iterable<T>.lastOrNull(): T
public fun String.lastOrNull(): Char
public fun ByteArray.lastOrNull(): Byte
public fun LongArray.lastOrNull(): Long
public fun CharArray.lastOrNull(): Char
public fun DoubleArray.lastOrNull(): Double
public fun <T> Array<T>.lastOrNull(): T
public fun IntArray.lastOrNull(): Int
```
Returns last element matching the given *predicate*, or null if element was not found
```
public fun String.lastOrNull(predicate: (Char)->Boolean): Char
public fun BooleanArray.lastOrNull(predicate: (Boolean)->Boolean): Boolean
public fun IntArray.lastOrNull(predicate: (Int)->Boolean): Int
public fun CharArray.lastOrNull(predicate: (Char)->Boolean): Char
public fun <T> Iterable<T>.lastOrNull(predicate: (T)->Boolean): T
public fun ByteArray.lastOrNull(predicate: (Byte)->Boolean): Byte
public fun LongArray.lastOrNull(predicate: (Long)->Boolean): Long
public fun <T> Array<T>.lastOrNull(predicate: (T)->Boolean): T
public fun DoubleArray.lastOrNull(predicate: (Double)->Boolean): Double
public fun ShortArray.lastOrNull(predicate: (Short)->Boolean): Short
public fun FloatArray.lastOrNull(predicate: (Float)->Boolean): Float
public fun <T> Stream<T>.lastOrNull(predicate: (T)->Boolean): T
```
