---
layout: api
title: merge
---
[stdlib](../index.md) / [kotlin](index.md) / [merge](merge.md)

# merge
Returns a list of values built from elements of both collections with same indexes using provided *transform*. List has length of shortest collection.
```
public fun <R, V> ByteArray.merge(array: Array<R>, transform: (Byte, R)->V): List<V>
public fun <R, V> String.merge(array: Array<R>, transform: (Char, R)->V): List<V>
public fun <R, V> FloatArray.merge(array: Array<R>, transform: (Float, R)->V): List<V>
public fun <R, V> DoubleArray.merge(other: Iterable<R>, transform: (Double, R)->V): List<V>
public fun <R, V> LongArray.merge(other: Iterable<R>, transform: (Long, R)->V): List<V>
public fun <R, V> CharArray.merge(other: Iterable<R>, transform: (Char, R)->V): List<V>
public fun <R, V> String.merge(other: Iterable<R>, transform: (Char, R)->V): List<V>
public fun <T, R, V> Iterable<T>.merge(array: Array<R>, transform: (T, R)->V): List<V>
public fun <R, V> ShortArray.merge(array: Array<R>, transform: (Short, R)->V): List<V>
public fun <R, V> DoubleArray.merge(array: Array<R>, transform: (Double, R)->V): List<V>
public fun <R, V> ShortArray.merge(other: Iterable<R>, transform: (Short, R)->V): List<V>
public fun <R, V> FloatArray.merge(other: Iterable<R>, transform: (Float, R)->V): List<V>
public fun <R, V> BooleanArray.merge(array: Array<R>, transform: (Boolean, R)->V): List<V>
public fun <R, V> IntArray.merge(other: Iterable<R>, transform: (Int, R)->V): List<V>
public fun <T, R, V> Iterable<T>.merge(other: Iterable<R>, transform: (T, R)->V): List<V>
public fun <R, V> IntArray.merge(array: Array<R>, transform: (Int, R)->V): List<V>
public fun <R, V> BooleanArray.merge(other: Iterable<R>, transform: (Boolean, R)->V): List<V>
public fun <R, V> LongArray.merge(array: Array<R>, transform: (Long, R)->V): List<V>
public fun <T, R, V> Array<T>.merge(array: Array<R>, transform: (T, R)->V): List<V>
public fun <T, R, V> Array<T>.merge(other: Iterable<R>, transform: (T, R)->V): List<V>
public fun <R, V> ByteArray.merge(other: Iterable<R>, transform: (Byte, R)->V): List<V>
public fun <R, V> CharArray.merge(array: Array<R>, transform: (Char, R)->V): List<V>
```
Returns a stream of values built from elements of both collections with same indexes using provided *transform*. Stream has length of shortest stream.
```
public fun <T, R, V> Stream<T>.merge(stream: Stream<R>, transform: (T, R)->V): Stream<V>
```
