---
layout: api
title: single
---
[stdlib](../index.md) / [kotlin](index.md) / [single](single.md)

# single
Returns single element matching the given *predicate*, or throws exception if there is no or more than one element
```
public fun String.single(predicate: (Char)->Boolean): Char
public fun <T> Array<T>.single(predicate: (T)->Boolean): T
public fun BooleanArray.single(predicate: (Boolean)->Boolean): Boolean
public fun ByteArray.single(predicate: (Byte)->Boolean): Byte
public fun ShortArray.single(predicate: (Short)->Boolean): Short
public fun FloatArray.single(predicate: (Float)->Boolean): Float
public fun <T> Stream<T>.single(predicate: (T)->Boolean): T
public fun <T> Iterable<T>.single(predicate: (T)->Boolean): T
public fun DoubleArray.single(predicate: (Double)->Boolean): Double
public fun IntArray.single(predicate: (Int)->Boolean): Int
public fun LongArray.single(predicate: (Long)->Boolean): Long
public fun CharArray.single(predicate: (Char)->Boolean): Char
```
Returns single element, or throws exception if there is no or more than one element
```
public fun <T> List<T>.single(): T
public fun CharArray.single(): Char
public fun <T> Stream<T>.single(): T
public fun FloatArray.single(): Float
public fun <T> Iterable<T>.single(): T
public fun <T> Array<T>.single(): T
public fun IntArray.single(): Int
public fun ShortArray.single(): Short
public fun DoubleArray.single(): Double
public fun ByteArray.single(): Byte
public fun LongArray.single(): Long
public fun BooleanArray.single(): Boolean
public fun String.single(): Char
```
