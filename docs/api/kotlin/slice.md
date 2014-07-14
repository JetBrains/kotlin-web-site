---
layout: api
title: slice
---
[stdlib](../index.html) / [kotlin](index.html) / [slice](slice.html)

# slice
Returns a list containing elements at specified positions
```
public fun ShortArray.slice(indices: Iterable<Int>): List<Short>
public fun DoubleArray.slice(indices: Iterable<Int>): List<Double>
public fun BooleanArray.slice(indices: Iterable<Int>): List<Boolean>
public fun IntArray.slice(indices: Iterable<Int>): List<Int>
public fun String.slice(indices: Iterable<Int>): String
public fun <T> List<T>.slice(indices: Iterable<Int>): List<T>
public fun ByteArray.slice(indices: Iterable<Int>): List<Byte>
public fun FloatArray.slice(indices: Iterable<Int>): List<Float>
public fun LongArray.slice(indices: Iterable<Int>): List<Long>
public fun <T> Array<T>.slice(indices: Iterable<Int>): List<T>
public fun CharArray.slice(indices: Iterable<Int>): List<Char>
```
Returns a subsequence specified by given set of indices.
```
public fun CharSequence.slice(indices: Iterable<Int>): CharSequence
```
Returns a subsequence specified by given range.
```
public fun CharSequence.slice(range: IntRange): CharSequence
```
