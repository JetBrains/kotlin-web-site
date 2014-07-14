---
layout: api
title: filterNot
---
[stdlib](../index.md) / [kotlin](index.md) / [filterNot](filterNot.md)

# filterNot
Returns a list containing all elements not matching the given *predicate*
```
public fun BooleanArray.filterNot(predicate: (Boolean)->Boolean): List<Boolean>
public fun CharArray.filterNot(predicate: (Char)->Boolean): List<Char>
public fun String.filterNot(predicate: (Char)->Boolean): String
public fun ByteArray.filterNot(predicate: (Byte)->Boolean): List<Byte>
public fun <T> Array<T>.filterNot(predicate: (T)->Boolean): List<T>
public fun IntArray.filterNot(predicate: (Int)->Boolean): List<Int>
public fun ShortArray.filterNot(predicate: (Short)->Boolean): List<Short>
public fun <K, V> Map<K, V>.filterNot(predicate: (Entry<K, V>)->Boolean): List<Entry<K, V>>
public fun LongArray.filterNot(predicate: (Long)->Boolean): List<Long>
public fun FloatArray.filterNot(predicate: (Float)->Boolean): List<Float>
public fun DoubleArray.filterNot(predicate: (Double)->Boolean): List<Double>
public fun <T> Iterable<T>.filterNot(predicate: (T)->Boolean): List<T>
```
Returns an iterator over elements which don't match the given *predicate*
```
public fun <T> Iterator<T>.filterNot(predicate: (T)->Boolean): Iterator<T>
```
Returns a stream containing all elements not matching the given *predicate*
```
public fun <T> Stream<T>.filterNot(predicate: (T)->Boolean): Stream<T>
```
