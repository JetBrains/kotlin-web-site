---
layout: api
title: first
---
[stdlib](../index.html) / [kotlin](index.html) / [first](first.html)

# first
Returns first element matching the given *predicate*
```
public fun ShortArray.first(predicate: (Short)->Boolean): Short
public fun <T> Stream<T>.first(predicate: (T)->Boolean): T
public fun FloatArray.first(predicate: (Float)->Boolean): Float
public fun String.first(predicate: (Char)->Boolean): Char
public fun IntArray.first(predicate: (Int)->Boolean): Int
public fun <T> Array<T>.first(predicate: (T)->Boolean): T
public fun BooleanArray.first(predicate: (Boolean)->Boolean): Boolean
public fun DoubleArray.first(predicate: (Double)->Boolean): Double
public fun ByteArray.first(predicate: (Byte)->Boolean): Byte
public fun LongArray.first(predicate: (Long)->Boolean): Long
public fun CharArray.first(predicate: (Char)->Boolean): Char
public fun <T> Iterable<T>.first(predicate: (T)->Boolean): T
```
Returns first element
```
public fun <T> Stream<T>.first(): T
public fun LongArray.first(): Long
public fun ShortArray.first(): Short
public fun <T> Iterable<T>.first(): T
public fun String.first(): Char
public fun IntArray.first(): Int
public fun <T> List<T>.first(): T
public fun CharArray.first(): Char
public fun FloatArray.first(): Float
public fun DoubleArray.first(): Double
public fun <T> Array<T>.first(): T
public fun ByteArray.first(): Byte
public fun BooleanArray.first(): Boolean
```
