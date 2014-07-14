---
layout: api
title: filter
---
[stdlib](../index.md) / [kotlin](index.md) / [filter](filter.md)

# filter
Returns a list containing all elements matching the given *predicate*
```
public fun ShortArray.filter(predicate: (Short)->Boolean): List<Short>
public fun String.filter(predicate: (Char)->Boolean): String
public fun <K, V> Map<K, V>.filter(predicate: (Entry<K, V>)->Boolean): List<Entry<K, V>>
public fun <T> Array<T>.filter(predicate: (T)->Boolean): List<T>
public fun LongArray.filter(predicate: (Long)->Boolean): List<Long>
public fun DoubleArray.filter(predicate: (Double)->Boolean): List<Double>
public fun FloatArray.filter(predicate: (Float)->Boolean): List<Float>
public fun ByteArray.filter(predicate: (Byte)->Boolean): List<Byte>
public fun IntArray.filter(predicate: (Int)->Boolean): List<Int>
public fun BooleanArray.filter(predicate: (Boolean)->Boolean): List<Boolean>
public fun <T> Iterable<T>.filter(predicate: (T)->Boolean): List<T>
public fun CharArray.filter(predicate: (Char)->Boolean): List<Char>
```
Returns a stream containing all elements matching the given *predicate*
```
public fun <T> Stream<T>.filter(predicate: (T)->Boolean): Stream<T>
```
Returns an iterator over elements which match the given *predicate*
```
public fun <T> Iterator<T>.filter(predicate: (T)->Boolean): Iterator<T>
```
