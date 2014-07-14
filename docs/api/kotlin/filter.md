---
layout: api
title: filter
---
[stdlib](../index.html) / [kotlin](index.html) / [filter](filter.html)

# filter
Returns a list containing all elements matching the given *predicate*
```
public fun <K, V> Map<K, V>.filter(predicate: (Entry<K, V>)->Boolean): List<Entry<K, V>>
public fun IntArray.filter(predicate: (Int)->Boolean): List<Int>
public fun <T> Iterable<T>.filter(predicate: (T)->Boolean): List<T>
public fun ByteArray.filter(predicate: (Byte)->Boolean): List<Byte>
public fun FloatArray.filter(predicate: (Float)->Boolean): List<Float>
public fun ShortArray.filter(predicate: (Short)->Boolean): List<Short>
public fun CharArray.filter(predicate: (Char)->Boolean): List<Char>
public fun <T> Array<T>.filter(predicate: (T)->Boolean): List<T>
public fun LongArray.filter(predicate: (Long)->Boolean): List<Long>
public fun BooleanArray.filter(predicate: (Boolean)->Boolean): List<Boolean>
public fun String.filter(predicate: (Char)->Boolean): String
public fun DoubleArray.filter(predicate: (Double)->Boolean): List<Double>
```
Returns an iterator over elements which match the given *predicate*
```
public fun <T> Iterator<T>.filter(predicate: (T)->Boolean): Iterator<T>
```
Returns a stream containing all elements matching the given *predicate*
```
public fun <T> Stream<T>.filter(predicate: (T)->Boolean): Stream<T>
```
