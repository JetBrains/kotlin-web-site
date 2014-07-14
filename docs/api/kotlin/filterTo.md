---
layout: api
title: filterTo
---
[stdlib](../index.md) / [kotlin](index.md) / [filterTo](filterTo.md)

# filterTo
Appends all elements matching the given *predicate* into the given *destination*
```
public fun <C : C> DoubleArray.filterTo(destination: C, predicate: (Double)->Boolean): C
public fun <C : C> ShortArray.filterTo(destination: C, predicate: (Short)->Boolean): C
public fun <T, C : C> Array<T>.filterTo(destination: C, predicate: (T)->Boolean): C
public fun <K, V, C : C> Map<K, V>.filterTo(destination: C, predicate: (Entry<K, V>)->Boolean): C
public fun <T, C : C> Stream<T>.filterTo(destination: C, predicate: (T)->Boolean): C
public fun <C : C> IntArray.filterTo(destination: C, predicate: (Int)->Boolean): C
public fun <C : C> ByteArray.filterTo(destination: C, predicate: (Byte)->Boolean): C
public fun <C : C> CharArray.filterTo(destination: C, predicate: (Char)->Boolean): C
public fun <C : C> LongArray.filterTo(destination: C, predicate: (Long)->Boolean): C
public fun <T, C : C> Iterable<T>.filterTo(destination: C, predicate: (T)->Boolean): C
public fun <C : C> FloatArray.filterTo(destination: C, predicate: (Float)->Boolean): C
public fun <C : C> BooleanArray.filterTo(destination: C, predicate: (Boolean)->Boolean): C
```
Appends all characters matching the given *predicate* to the given *destination*
```
public fun <C : C> String.filterTo(destination: C, predicate: (Char)->Boolean): C
```
Filters all elements which match the given predicate into the given list
```
public fun <T, C : C> Iterator<T>.filterTo(result: C, predicate: (T)->Boolean): C
```
