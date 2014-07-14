---
layout: api
title: singleOrNull
---
[stdlib](../index.html) / [kotlin](index.html) / [singleOrNull](singleOrNull.html)

# singleOrNull
Returns single element, or null if collection is empty, or throws exception if there is more than one element
```
public fun ByteArray.singleOrNull(): Byte
public fun String.singleOrNull(): Char
public fun <T> List<T>.singleOrNull(): T
public fun ShortArray.singleOrNull(): Short
public fun LongArray.singleOrNull(): Long
public fun <T> Stream<T>.singleOrNull(): T
public fun CharArray.singleOrNull(): Char
public fun <T> Iterable<T>.singleOrNull(): T
public fun FloatArray.singleOrNull(): Float
public fun <T> Array<T>.singleOrNull(): T
public fun DoubleArray.singleOrNull(): Double
public fun IntArray.singleOrNull(): Int
public fun BooleanArray.singleOrNull(): Boolean
```
Returns single element matching the given *predicate*, or null if element was not found or more than one elements were found
```
public fun FloatArray.singleOrNull(predicate: (Float)->Boolean): Float
public fun String.singleOrNull(predicate: (Char)->Boolean): Char
public fun LongArray.singleOrNull(predicate: (Long)->Boolean): Long
public fun ShortArray.singleOrNull(predicate: (Short)->Boolean): Short
public fun DoubleArray.singleOrNull(predicate: (Double)->Boolean): Double
public fun <T> Array<T>.singleOrNull(predicate: (T)->Boolean): T
public fun <T> Iterable<T>.singleOrNull(predicate: (T)->Boolean): T
public fun ByteArray.singleOrNull(predicate: (Byte)->Boolean): Byte
public fun CharArray.singleOrNull(predicate: (Char)->Boolean): Char
public fun BooleanArray.singleOrNull(predicate: (Boolean)->Boolean): Boolean
public fun IntArray.singleOrNull(predicate: (Int)->Boolean): Int
public fun <T> Stream<T>.singleOrNull(predicate: (T)->Boolean): T
```
