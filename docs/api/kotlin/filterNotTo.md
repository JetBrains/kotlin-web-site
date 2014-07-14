---
layout: api
title: filterNotTo
---
[stdlib](../index.html) / [kotlin](index.html) / [filterNotTo](filterNotTo.html)

# filterNotTo
Appends all elements not matching the given *predicate* to the given *destination*
```
public fun <T, C : C> Stream<T>.filterNotTo(destination: C, predicate: (T)->Boolean): C
public fun <C : C> FloatArray.filterNotTo(destination: C, predicate: (Float)->Boolean): C
public fun <T, C : C> Iterable<T>.filterNotTo(destination: C, predicate: (T)->Boolean): C
public fun <C : C> BooleanArray.filterNotTo(destination: C, predicate: (Boolean)->Boolean): C
public fun <K, V, C : C> Map<K, V>.filterNotTo(destination: C, predicate: (Entry<K, V>)->Boolean): C
public fun <C : C> LongArray.filterNotTo(destination: C, predicate: (Long)->Boolean): C
public fun <C : C> ShortArray.filterNotTo(destination: C, predicate: (Short)->Boolean): C
public fun <T, C : C> Array<T>.filterNotTo(destination: C, predicate: (T)->Boolean): C
public fun <C : C> ByteArray.filterNotTo(destination: C, predicate: (Byte)->Boolean): C
public fun <C : C> CharArray.filterNotTo(destination: C, predicate: (Char)->Boolean): C
public fun <C : C> DoubleArray.filterNotTo(destination: C, predicate: (Double)->Boolean): C
public fun <C : C> IntArray.filterNotTo(destination: C, predicate: (Int)->Boolean): C
```
Appends all characters not matching the given *predicate* to the given *destination*
```
public fun <C : C> String.filterNotTo(destination: C, predicate: (Char)->Boolean): C
```
Returns a list containing all elements which do not match the given *predicate*
```
public fun <T, C : C> Iterator<T>.filterNotTo(result: C, predicate: (T)->Boolean): C
```
