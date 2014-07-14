---
layout: api
title: none
---
[stdlib](../index.md) / [kotlin](index.md) / [none](none.md)

# none
Returns *true* if collection has no elements
```
public fun ShortArray.none(): Boolean
public fun <T> Stream<T>.none(): Boolean
public fun DoubleArray.none(): Boolean
public fun ByteArray.none(): Boolean
public fun FloatArray.none(): Boolean
public fun String.none(): Boolean
public fun BooleanArray.none(): Boolean
public fun IntArray.none(): Boolean
public fun <K, V> Map<K, V>.none(): Boolean
public fun <T> Array<T>.none(): Boolean
public fun LongArray.none(): Boolean
public fun CharArray.none(): Boolean
public fun <T> Iterable<T>.none(): Boolean
```
Returns *true* if no elements match the given *predicate*
```
public fun LongArray.none(predicate: (Long)->Boolean): Boolean
public fun DoubleArray.none(predicate: (Double)->Boolean): Boolean
public fun <T> Iterable<T>.none(predicate: (T)->Boolean): Boolean
public fun <K, V> Map<K, V>.none(predicate: (Entry<K, V>)->Boolean): Boolean
public fun String.none(predicate: (Char)->Boolean): Boolean
public fun <T> Stream<T>.none(predicate: (T)->Boolean): Boolean
public fun CharArray.none(predicate: (Char)->Boolean): Boolean
public fun BooleanArray.none(predicate: (Boolean)->Boolean): Boolean
public fun FloatArray.none(predicate: (Float)->Boolean): Boolean
public fun ByteArray.none(predicate: (Byte)->Boolean): Boolean
public fun ShortArray.none(predicate: (Short)->Boolean): Boolean
public fun IntArray.none(predicate: (Int)->Boolean): Boolean
public fun <T> Array<T>.none(predicate: (T)->Boolean): Boolean
```
