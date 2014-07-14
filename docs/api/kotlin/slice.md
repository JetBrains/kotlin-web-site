---
layout: api
title: slice
---
[stdlib](../index.md) / [kotlin](index.md) / [slice](slice.md)

# slice
Returns a subsequence specified by given set of indices.
```
public fun CharSequence.slice(indices: Iterable<Int>): CharSequence
```
Returns a list containing elements at specified positions
```
public fun <T> Array<T>.slice(indices: Iterable<Int>): List<T>
public fun BooleanArray.slice(indices: Iterable<Int>): List<Boolean>
public fun ShortArray.slice(indices: Iterable<Int>): List<Short>
public fun CharArray.slice(indices: Iterable<Int>): List<Char>
public fun String.slice(indices: Iterable<Int>): String
public fun FloatArray.slice(indices: Iterable<Int>): List<Float>
public fun ByteArray.slice(indices: Iterable<Int>): List<Byte>
public fun <T> List<T>.slice(indices: Iterable<Int>): List<T>
public fun LongArray.slice(indices: Iterable<Int>): List<Long>
public fun DoubleArray.slice(indices: Iterable<Int>): List<Double>
public fun IntArray.slice(indices: Iterable<Int>): List<Int>
```
Returns a subsequence specified by given range.
```
public fun CharSequence.slice(range: IntRange): CharSequence
```
