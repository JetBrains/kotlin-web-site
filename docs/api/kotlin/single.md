---
layout: api
title: single
---
[stdlib](../index.html) / [kotlin](index.html) / [single](single.html)

# single
Returns single element matching the given *predicate*, or throws exception if there is no or more than one element
```
public fun DoubleArray.single(predicate: (Double)->Boolean): Double
public fun String.single(predicate: (Char)->Boolean): Char
public fun <T> Stream<T>.single(predicate: (T)->Boolean): T
public fun CharArray.single(predicate: (Char)->Boolean): Char
public fun <T> Array<T>.single(predicate: (T)->Boolean): T
public fun LongArray.single(predicate: (Long)->Boolean): Long
public fun <T> Iterable<T>.single(predicate: (T)->Boolean): T
public fun IntArray.single(predicate: (Int)->Boolean): Int
public fun FloatArray.single(predicate: (Float)->Boolean): Float
public fun ByteArray.single(predicate: (Byte)->Boolean): Byte
public fun ShortArray.single(predicate: (Short)->Boolean): Short
public fun BooleanArray.single(predicate: (Boolean)->Boolean): Boolean
```
Returns single element, or throws exception if there is no or more than one element
```
public fun BooleanArray.single(): Boolean
public fun <T> Stream<T>.single(): T
public fun <T> List<T>.single(): T
public fun String.single(): Char
public fun ShortArray.single(): Short
public fun CharArray.single(): Char
public fun IntArray.single(): Int
public fun <T> Iterable<T>.single(): T
public fun FloatArray.single(): Float
public fun DoubleArray.single(): Double
public fun <T> Array<T>.single(): T
public fun LongArray.single(): Long
public fun ByteArray.single(): Byte
```
