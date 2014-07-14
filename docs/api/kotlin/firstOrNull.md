---
layout: api
title: firstOrNull
---
[stdlib](../index.md) / [kotlin](index.md) / [firstOrNull](firstOrNull.md)

# firstOrNull
Returns first element matching the given *predicate*, or *null* if element was not found
```
public fun FloatArray.firstOrNull(predicate: (Float)->Boolean): Float
public fun ShortArray.firstOrNull(predicate: (Short)->Boolean): Short
public fun <T> Stream<T>.firstOrNull(predicate: (T)->Boolean): T
public fun DoubleArray.firstOrNull(predicate: (Double)->Boolean): Double
public fun BooleanArray.firstOrNull(predicate: (Boolean)->Boolean): Boolean
public fun IntArray.firstOrNull(predicate: (Int)->Boolean): Int
public fun <T> Array<T>.firstOrNull(predicate: (T)->Boolean): T
public fun String.firstOrNull(predicate: (Char)->Boolean): Char
public fun ByteArray.firstOrNull(predicate: (Byte)->Boolean): Byte
public fun LongArray.firstOrNull(predicate: (Long)->Boolean): Long
public fun <T> Iterable<T>.firstOrNull(predicate: (T)->Boolean): T
public fun CharArray.firstOrNull(predicate: (Char)->Boolean): Char
```
Returns first element, or null if collection is empty
```
public fun String.firstOrNull(): Char
public fun <T> Stream<T>.firstOrNull(): T
public fun LongArray.firstOrNull(): Long
public fun ShortArray.firstOrNull(): Short
public fun <T> Iterable<T>.firstOrNull(): T
public fun <T> List<T>.firstOrNull(): T
public fun DoubleArray.firstOrNull(): Double
public fun <T> Array<T>.firstOrNull(): T
public fun FloatArray.firstOrNull(): Float
public fun ByteArray.firstOrNull(): Byte
public fun BooleanArray.firstOrNull(): Boolean
public fun CharArray.firstOrNull(): Char
public fun IntArray.firstOrNull(): Int
```
