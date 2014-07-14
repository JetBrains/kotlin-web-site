---
layout: api
title: all
---
[stdlib](../index.html) / [kotlin](index.html) / [all](all.html)

# all
Returns *true* if all elements match the given *predicate*
```
public fun DoubleArray.all(predicate: (Double)->Boolean): Boolean
public fun <T> Stream<T>.all(predicate: (T)->Boolean): Boolean
public fun CharArray.all(predicate: (Char)->Boolean): Boolean
public fun <T> Iterable<T>.all(predicate: (T)->Boolean): Boolean
public fun BooleanArray.all(predicate: (Boolean)->Boolean): Boolean
public fun <T> Iterator<T>.all(predicate: (T)->Boolean): Boolean
public fun LongArray.all(predicate: (Long)->Boolean): Boolean
public fun <T> Array<T>.all(predicate: (T)->Boolean): Boolean
public fun ShortArray.all(predicate: (Short)->Boolean): Boolean
public fun ByteArray.all(predicate: (Byte)->Boolean): Boolean
public fun FloatArray.all(predicate: (Float)->Boolean): Boolean
public fun <K, V> Map<K, V>.all(predicate: (Entry<K, V>)->Boolean): Boolean
public fun IntArray.all(predicate: (Int)->Boolean): Boolean
public fun String.all(predicate: (Char)->Boolean): Boolean
```
