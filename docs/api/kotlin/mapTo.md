---
layout: api
title: mapTo
---
[stdlib](../index.html) / [kotlin](index.html) / [mapTo](mapTo.html)

# mapTo
Appends transformed elements of original collection using the given *transform* function
```
public fun <R, C : C> ShortArray.mapTo(destination: C, transform: (Short)->R): C
public fun <R, C : C> FloatArray.mapTo(destination: C, transform: (Float)->R): C
public fun <R, C : C> ByteArray.mapTo(destination: C, transform: (Byte)->R): C
public fun <T, R, C : C> Stream<T>.mapTo(destination: C, transform: (T)->R): C
public fun <R, C : C> BooleanArray.mapTo(destination: C, transform: (Boolean)->R): C
public fun <R, C : C> LongArray.mapTo(destination: C, transform: (Long)->R): C
public fun <R, C : C> IntArray.mapTo(destination: C, transform: (Int)->R): C
public fun <T, R, C : C> Array<T>.mapTo(destination: C, transform: (T)->R): C
public fun <R, C : C> CharArray.mapTo(destination: C, transform: (Char)->R): C
public fun <K, V, R, C : C> Map<K, V>.mapTo(destination: C, transform: (Entry<K, V>)->R): C
public fun <T, R, C : C> Iterable<T>.mapTo(destination: C, transform: (T)->R): C
public fun <R, C : C> String.mapTo(destination: C, transform: (Char)->R): C
public fun <R, C : C> DoubleArray.mapTo(destination: C, transform: (Double)->R): C
```
Transforms each element of this collection with the given *transform* function and
```
public fun <T, R, C : C> Iterator<T>.mapTo(result: C, transform: (T)->R): C
```
## Description
```
public fun <R, C : C> ShortArray.mapTo(destination: C, transform: (Short)->R): C
```
to the given *destination*

```
public fun <R, C : C> FloatArray.mapTo(destination: C, transform: (Float)->R): C
```
to the given *destination*

```
public fun <R, C : C> ByteArray.mapTo(destination: C, transform: (Byte)->R): C
```
to the given *destination*

```
public fun <T, R, C : C> Stream<T>.mapTo(destination: C, transform: (T)->R): C
```
to the given *destination*

```
public fun <R, C : C> BooleanArray.mapTo(destination: C, transform: (Boolean)->R): C
```
to the given *destination*

```
public fun <R, C : C> LongArray.mapTo(destination: C, transform: (Long)->R): C
```
to the given *destination*

```
public fun <R, C : C> IntArray.mapTo(destination: C, transform: (Int)->R): C
```
to the given *destination*

```
public fun <T, R, C : C> Array<T>.mapTo(destination: C, transform: (T)->R): C
```
to the given *destination*

```
public fun <R, C : C> CharArray.mapTo(destination: C, transform: (Char)->R): C
```
to the given *destination*

```
public fun <K, V, R, C : C> Map<K, V>.mapTo(destination: C, transform: (Entry<K, V>)->R): C
```
to the given *destination*

```
public fun <T, R, C : C> Iterable<T>.mapTo(destination: C, transform: (T)->R): C
```
to the given *destination*

```
public fun <R, C : C> String.mapTo(destination: C, transform: (Char)->R): C
```
to the given *destination*

```
public fun <T, R, C : C> Iterator<T>.mapTo(result: C, transform: (T)->R): C
```
adds each return value to the given *results* collection

```
public fun <R, C : C> DoubleArray.mapTo(destination: C, transform: (Double)->R): C
```
to the given *destination*

