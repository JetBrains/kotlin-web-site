---
layout: api
title: toSortedListBy
---
[stdlib](../index.html) / [kotlin](index.html) / [toSortedListBy](toSortedListBy.html)

# toSortedListBy
Returns a sorted list of all elements, ordered by results of specified *order* function.
```
public fun <T, V : V> Stream<T>.toSortedListBy(order: (T)->V): List<T>
public fun <V : V> ByteArray.toSortedListBy(order: (Byte)->V): List<Byte>
public fun <V : V> IntArray.toSortedListBy(order: (Int)->V): List<Int>
public fun <V : V> FloatArray.toSortedListBy(order: (Float)->V): List<Float>
public fun <T, V : V> Iterable<T>.toSortedListBy(order: (T)->V): List<T>
public fun <T, V : V> Array<T>.toSortedListBy(order: (T)->V): List<T>
public fun <V : V> CharArray.toSortedListBy(order: (Char)->V): List<Char>
public fun <V : V> LongArray.toSortedListBy(order: (Long)->V): List<Long>
public fun <V : V> DoubleArray.toSortedListBy(order: (Double)->V): List<Double>
public fun <V : V> ShortArray.toSortedListBy(order: (Short)->V): List<Short>
public fun <V : V> BooleanArray.toSortedListBy(order: (Boolean)->V): List<Boolean>
```
