---
layout: api
title: toSortedSet
---
[stdlib](../index.md) / [kotlin](index.md) / [toSortedSet](toSortedSet.md)

# toSortedSet
Returns a SortedSet of all elements
```
public fun CharArray.toSortedSet(): SortedSet<Char>
public fun LongArray.toSortedSet(): SortedSet<Long>
public fun ByteArray.toSortedSet(): SortedSet<Byte>
public fun String.toSortedSet(): SortedSet<Char>
public fun <T> Stream<T>.toSortedSet(): SortedSet<T>
public fun <T> Array<T>.toSortedSet(): SortedSet<T>
public fun FloatArray.toSortedSet(): SortedSet<Float>
public fun <T> Iterable<T>.toSortedSet(): SortedSet<T>
public fun BooleanArray.toSortedSet(): SortedSet<Boolean>
public fun IntArray.toSortedSet(): SortedSet<Int>
public fun ShortArray.toSortedSet(): SortedSet<Short>
public fun DoubleArray.toSortedSet(): SortedSet<Double>
```
Copies all elements into a [[SortedSet]]
```
public fun <T> Iterator<T>.toSortedSet(): SortedSet<T>
```
