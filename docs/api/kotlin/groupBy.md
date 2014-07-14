---
layout: api
title: groupBy
---
[stdlib](../index.html) / [kotlin](index.html) / [groupBy](groupBy.html)

# groupBy
Groups the elements in the collection into a new [[Map]] using the supplied *toKey* function to calculate the key to group the elements by
```
public fun <T, K> Iterator<T>.groupBy(toKey: (T)->K): Map<K, List<T>>
```
Returns a map of the elements in original collection grouped by the result of given *toKey* function
```
public fun <K> CharArray.groupBy(toKey: (Char)->K): Map<K, List<Char>>
public fun <K> FloatArray.groupBy(toKey: (Float)->K): Map<K, List<Float>>
public fun <T, K> Array<T>.groupBy(toKey: (T)->K): Map<K, List<T>>
public fun <K> BooleanArray.groupBy(toKey: (Boolean)->K): Map<K, List<Boolean>>
public fun <K> DoubleArray.groupBy(toKey: (Double)->K): Map<K, List<Double>>
public fun <K> String.groupBy(toKey: (Char)->K): Map<K, List<Char>>
public fun <T, K> Stream<T>.groupBy(toKey: (T)->K): Map<K, List<T>>
public fun <K> ShortArray.groupBy(toKey: (Short)->K): Map<K, List<Short>>
public fun <T, K> Iterable<T>.groupBy(toKey: (T)->K): Map<K, List<T>>
public fun <V, K> Map<K, V>.groupBy(toKey: (Entry<K, V>)->K): Map<K, List<Entry<K, V>>>
public fun <K> IntArray.groupBy(toKey: (Int)->K): Map<K, List<Int>>
public fun <K> LongArray.groupBy(toKey: (Long)->K): Map<K, List<Long>>
public fun <K> ByteArray.groupBy(toKey: (Byte)->K): Map<K, List<Byte>>
```
