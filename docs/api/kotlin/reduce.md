---
layout: api
title: reduce
---
[stdlib](../index.md) / [kotlin](index.md) / [reduce](reduce.md)

# reduce
Accumulates value starting with the first element and applying *operation* from left to right to current accumulator value and each element
```
public fun ByteArray.reduce(operation: (Byte, Byte)->Byte): Byte
public fun <T> Stream<T>.reduce(operation: (T, T)->T): T
public fun LongArray.reduce(operation: (Long, Long)->Long): Long
public fun DoubleArray.reduce(operation: (Double, Double)->Double): Double
public fun String.reduce(operation: (Char, Char)->Char): Char
public fun <T> Array<T>.reduce(operation: (T, T)->T): T
public fun ShortArray.reduce(operation: (Short, Short)->Short): Short
public fun FloatArray.reduce(operation: (Float, Float)->Float): Float
public fun <T> Iterable<T>.reduce(operation: (T, T)->T): T
public fun BooleanArray.reduce(operation: (Boolean, Boolean)->Boolean): Boolean
public fun IntArray.reduce(operation: (Int, Int)->Int): Int
public fun CharArray.reduce(operation: (Char, Char)->Char): Char
```
Applies binary operation to all elements of iterable, going from left to right.
```
public fun <T> Iterator<T>.reduce(operation: (T, T)->T): T
```
## Description
```
public fun <T> Iterator<T>.reduce(operation: (T, T)->T): T
```
Similar to fold function, but uses the first element as initial value

