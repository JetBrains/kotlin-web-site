---
layout: api
title: last
---
[stdlib](../index.md) / [kotlin](index.md) / [last](last.md)

# last
Returns last element
```
public fun BooleanArray.last(): Boolean
public fun <T> List<T>.last(): T
public fun <T> Stream<T>.last(): T
public fun DoubleArray.last(): Double
public fun ShortArray.last(): Short
public fun <T> Iterable<T>.last(): T
public fun IntArray.last(): Int
public fun CharArray.last(): Char
public fun ByteArray.last(): Byte
public fun String.last(): Char
public fun LongArray.last(): Long
public fun FloatArray.last(): Float
public fun <T> Array<T>.last(): T
```
Returns last element matching the given *predicate*
```
public fun <T> Iterable<T>.last(predicate: (T)->Boolean): T
public fun FloatArray.last(predicate: (Float)->Boolean): Float
public fun ByteArray.last(predicate: (Byte)->Boolean): Byte
public fun LongArray.last(predicate: (Long)->Boolean): Long
public fun <T> Stream<T>.last(predicate: (T)->Boolean): T
public fun CharArray.last(predicate: (Char)->Boolean): Char
public fun DoubleArray.last(predicate: (Double)->Boolean): Double
public fun String.last(predicate: (Char)->Boolean): Char
public fun IntArray.last(predicate: (Int)->Boolean): Int
public fun <T> Array<T>.last(predicate: (T)->Boolean): T
public fun ShortArray.last(predicate: (Short)->Boolean): Short
public fun BooleanArray.last(predicate: (Boolean)->Boolean): Boolean
```
