---
layout: api
title: last
---
[stdlib](../index.html) / [kotlin](index.html) / [last](last.html)

# last
Returns last element
```
public fun ByteArray.last(): Byte
public fun <T> Array<T>.last(): T
public fun <T> Stream<T>.last(): T
public fun <T> List<T>.last(): T
public fun DoubleArray.last(): Double
public fun <T> Iterable<T>.last(): T
public fun String.last(): Char
public fun ShortArray.last(): Short
public fun LongArray.last(): Long
public fun FloatArray.last(): Float
public fun BooleanArray.last(): Boolean
public fun IntArray.last(): Int
public fun CharArray.last(): Char
```
Returns last element matching the given *predicate*
```
public fun LongArray.last(predicate: (Long)->Boolean): Long
public fun ShortArray.last(predicate: (Short)->Boolean): Short
public fun FloatArray.last(predicate: (Float)->Boolean): Float
public fun IntArray.last(predicate: (Int)->Boolean): Int
public fun CharArray.last(predicate: (Char)->Boolean): Char
public fun <T> Array<T>.last(predicate: (T)->Boolean): T
public fun <T> Stream<T>.last(predicate: (T)->Boolean): T
public fun DoubleArray.last(predicate: (Double)->Boolean): Double
public fun BooleanArray.last(predicate: (Boolean)->Boolean): Boolean
public fun <T> Iterable<T>.last(predicate: (T)->Boolean): T
public fun ByteArray.last(predicate: (Byte)->Boolean): Byte
public fun String.last(predicate: (Char)->Boolean): Char
```
