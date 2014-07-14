---
layout: api
title: any
---
[stdlib](../index.html) / [kotlin](index.html) / [any](any.html)

# any
Returns *true* if any element matches the given *predicate*
```
public fun IntArray.any(predicate: (Int)->Boolean): Boolean
public fun <T> Stream<T>.any(predicate: (T)->Boolean): Boolean
public fun ByteArray.any(predicate: (Byte)->Boolean): Boolean
public fun <K, V> Map<K, V>.any(predicate: (Entry<K, V>)->Boolean): Boolean
public fun DoubleArray.any(predicate: (Double)->Boolean): Boolean
public fun BooleanArray.any(predicate: (Boolean)->Boolean): Boolean
public fun <T> Iterable<T>.any(predicate: (T)->Boolean): Boolean
public fun <T> Array<T>.any(predicate: (T)->Boolean): Boolean
public fun String.any(predicate: (Char)->Boolean): Boolean
public fun FloatArray.any(predicate: (Float)->Boolean): Boolean
public fun LongArray.any(predicate: (Long)->Boolean): Boolean
public fun ShortArray.any(predicate: (Short)->Boolean): Boolean
public fun CharArray.any(predicate: (Char)->Boolean): Boolean
```
Returns *true* if collection has at least one element
```
public fun String.any(): Boolean
public fun <T> Stream<T>.any(): Boolean
public fun <T> Iterable<T>.any(): Boolean
public fun ByteArray.any(): Boolean
public fun ShortArray.any(): Boolean
public fun DoubleArray.any(): Boolean
public fun <K, V> Map<K, V>.any(): Boolean
public fun BooleanArray.any(): Boolean
public fun <T> Array<T>.any(): Boolean
public fun FloatArray.any(): Boolean
public fun IntArray.any(): Boolean
public fun CharArray.any(): Boolean
public fun LongArray.any(): Boolean
```
Returns *true* if any elements match the given *predicate*
```
public fun <T> Iterator<T>.any(predicate: (T)->Boolean): Boolean
```
