---
layout: api
title: count
---
[stdlib](../index.md) / [kotlin](index.md) / [count](count.md)

# count
Returns the number of elements matching the given *predicate*
```
public fun IntArray.count(predicate: (Int)->Boolean): Int
public fun <K, V> Map<K, V>.count(predicate: (Entry<K, V>)->Boolean): Int
public fun <T> Stream<T>.count(predicate: (T)->Boolean): Int
public fun ByteArray.count(predicate: (Byte)->Boolean): Int
public fun CharArray.count(predicate: (Char)->Boolean): Int
public fun LongArray.count(predicate: (Long)->Boolean): Int
public fun FloatArray.count(predicate: (Float)->Boolean): Int
public fun ShortArray.count(predicate: (Short)->Boolean): Int
public fun DoubleArray.count(predicate: (Double)->Boolean): Int
public fun String.count(predicate: (Char)->Boolean): Int
public fun <T> Iterable<T>.count(predicate: (T)->Boolean): Int
public fun <T> Array<T>.count(predicate: (T)->Boolean): Int
public fun BooleanArray.count(predicate: (Boolean)->Boolean): Int
```
Returns the number of elements
```
public fun <K, V> Map<K, V>.count(): Int
public fun String.count(): Int
public fun <T> Iterable<T>.count(): Int
public fun CharArray.count(): Int
public fun BooleanArray.count(): Int
public fun ShortArray.count(): Int
public fun FloatArray.count(): Int
public fun ByteArray.count(): Int
public fun LongArray.count(): Int
public fun <T> Collection<T>.count(): Int
public fun <T> Array<T>.count(): Int
public fun <T> Stream<T>.count(): Int
public fun DoubleArray.count(): Int
public fun IntArray.count(): Int
```
Returns the number of elements which match the given *predicate*
```
public fun <T> Iterator<T>.count(predicate: (T)->Boolean): Int
```
