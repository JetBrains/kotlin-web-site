---
layout: api
title: first
---
[stdlib](../index.md) / [kotlin](index.md) / [first](first.md)

# first
Returns first element matching the given *predicate*
```
public fun IntArray.first(predicate: (Int)->Boolean): Int
public fun <T> Array<T>.first(predicate: (T)->Boolean): T
public fun BooleanArray.first(predicate: (Boolean)->Boolean): Boolean
public fun <T> Stream<T>.first(predicate: (T)->Boolean): T
public fun CharArray.first(predicate: (Char)->Boolean): Char
public fun DoubleArray.first(predicate: (Double)->Boolean): Double
public fun ShortArray.first(predicate: (Short)->Boolean): Short
public fun LongArray.first(predicate: (Long)->Boolean): Long
public fun ByteArray.first(predicate: (Byte)->Boolean): Byte
public fun String.first(predicate: (Char)->Boolean): Char
public fun FloatArray.first(predicate: (Float)->Boolean): Float
public fun <T> Iterable<T>.first(predicate: (T)->Boolean): T
```
Returns first element
```
public fun ByteArray.first(): Byte
public fun <T> List<T>.first(): T
public fun DoubleArray.first(): Double
public fun String.first(): Char
public fun <T> Array<T>.first(): T
public fun CharArray.first(): Char
public fun FloatArray.first(): Float
public fun <T> Stream<T>.first(): T
public fun BooleanArray.first(): Boolean
public fun <T> Iterable<T>.first(): T
public fun LongArray.first(): Long
public fun IntArray.first(): Int
public fun ShortArray.first(): Short
```
