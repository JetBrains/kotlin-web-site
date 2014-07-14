---
layout: api
title: sort
---
[stdlib](../index.md) / [kotlin](index.md) / [sort](sort.md)

# sort
Sorts array or range in array inplace
```
public fun DoubleArray.sort(fromIndex: Int, toIndex: Int): Unit
public fun FloatArray.sort(fromIndex: Int, toIndex: Int): Unit
public fun IntArray.sort(fromIndex: Int, toIndex: Int): Unit
public fun ShortArray.sort(fromIndex: Int, toIndex: Int): Unit
public fun LongArray.sort(fromIndex: Int, toIndex: Int): Unit
public fun CharArray.sort(fromIndex: Int, toIndex: Int): Unit
public fun ByteArray.sort(fromIndex: Int, toIndex: Int): Unit
public fun <T> Array<T>.sort(fromIndex: Int, toIndex: Int): Unit
```

```
public fun <T> Iterable<T>.sort(comparator: Comparator<T>): List<T>
```
Returns a sorted list of all elements
```
public fun <T : T> Iterable<T>.sort(): List<T>
```
