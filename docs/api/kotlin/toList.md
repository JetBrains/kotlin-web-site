---
layout: api
title: toList
---
[stdlib](../index.html) / [kotlin](index.html) / [toList](toList.html)

# toList
Returns a List containing all elements
```
public fun <T> Iterable<T>.toList(): List<T>
public fun String.toList(): List<Char>
public fun ByteArray.toList(): List<Byte>
public fun LongArray.toList(): List<Long>
public fun ShortArray.toList(): List<Short>
public fun CharArray.toList(): List<Char>
public fun FloatArray.toList(): List<Float>
public fun IntArray.toList(): List<Int>
public fun <T> Stream<T>.toList(): List<T>
public fun BooleanArray.toList(): List<Boolean>
public fun <T> Array<T>.toList(): List<T>
public fun DoubleArray.toList(): List<Double>
```
Returns a List containing all key-value pairs
```
public fun <K, V> Map<K, V>.toList(): List<Entry<K, V>>
```
Copies all elements into a [[List]]
```
public fun <T> Iterator<T>.toList(): List<T>
```
Returns a list containing the elements returned by the
```
fun <T> Enumeration<T>.toList(): List<T>
```
## Description
```
fun <T> Enumeration<T>.toList(): List<T>
```
specified enumeration in the order they are returned by the
enumeration.

