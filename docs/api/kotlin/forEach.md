---
layout: api
title: forEach
---
[stdlib](../index.html) / [kotlin](index.html) / [forEach](forEach.html)

# forEach
Performs the given *operation* on each element
```
public fun LongArray.forEach(operation: (Long)->Unit): Unit
public fun FloatArray.forEach(operation: (Float)->Unit): Unit
public fun <T> Array<T>.forEach(operation: (T)->Unit): Unit
public fun ShortArray.forEach(operation: (Short)->Unit): Unit
public fun <T> Iterable<T>.forEach(operation: (T)->Unit): Unit
public fun <T> Iterator<T>.forEach(operation: (T)->Unit): Unit
public fun <K, V> Map<K, V>.forEach(operation: (Entry<K, V>)->Unit): Unit
public fun <T> Stream<T>.forEach(operation: (T)->Unit): Unit
public fun BooleanArray.forEach(operation: (Boolean)->Unit): Unit
public fun CharArray.forEach(operation: (Char)->Unit): Unit
public fun IntArray.forEach(operation: (Int)->Unit): Unit
public fun ByteArray.forEach(operation: (Byte)->Unit): Unit
public fun DoubleArray.forEach(operation: (Double)->Unit): Unit
public fun String.forEach(operation: (Char)->Unit): Unit
```
