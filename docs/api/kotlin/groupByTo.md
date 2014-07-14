---
layout: api
title: groupByTo
---
[stdlib](../index.html) / [kotlin](index.html) / [groupByTo](groupByTo.html)

# groupByTo
Appends elements from original collection grouped by the result of given *toKey* function to the given *map*
```
public fun <V, K> Map<K, V>.groupByTo(map: MutableMap<K, MutableList<Entry<K, V>>>, toKey: (Entry<K, V>)->K): Map<K, MutableList<Entry<K, V>>>
public fun <K> FloatArray.groupByTo(map: MutableMap<K, MutableList<Float>>, toKey: (Float)->K): Map<K, MutableList<Float>>
public fun <K> BooleanArray.groupByTo(map: MutableMap<K, MutableList<Boolean>>, toKey: (Boolean)->K): Map<K, MutableList<Boolean>>
public fun <K> ByteArray.groupByTo(map: MutableMap<K, MutableList<Byte>>, toKey: (Byte)->K): Map<K, MutableList<Byte>>
public fun <K> String.groupByTo(map: MutableMap<K, MutableList<Char>>, toKey: (Char)->K): Map<K, MutableList<Char>>
public fun <T, K> Array<T>.groupByTo(map: MutableMap<K, MutableList<T>>, toKey: (T)->K): Map<K, MutableList<T>>
public fun <K> LongArray.groupByTo(map: MutableMap<K, MutableList<Long>>, toKey: (Long)->K): Map<K, MutableList<Long>>
public fun <T, K> Iterable<T>.groupByTo(map: MutableMap<K, MutableList<T>>, toKey: (T)->K): Map<K, MutableList<T>>
public fun <K> DoubleArray.groupByTo(map: MutableMap<K, MutableList<Double>>, toKey: (Double)->K): Map<K, MutableList<Double>>
public fun <K> IntArray.groupByTo(map: MutableMap<K, MutableList<Int>>, toKey: (Int)->K): Map<K, MutableList<Int>>
public fun <K> ShortArray.groupByTo(map: MutableMap<K, MutableList<Short>>, toKey: (Short)->K): Map<K, MutableList<Short>>
public fun <K> CharArray.groupByTo(map: MutableMap<K, MutableList<Char>>, toKey: (Char)->K): Map<K, MutableList<Char>>
public fun <T, K> Stream<T>.groupByTo(map: MutableMap<K, MutableList<T>>, toKey: (T)->K): Map<K, MutableList<T>>
```

```
public fun <T, K> Iterator<T>.groupByTo(result: MutableMap<K, MutableList<T>>, toKey: (T)->K): Map<K, MutableList<T>>
```
