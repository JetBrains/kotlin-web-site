---
layout: api
title: toList
---
[stdlib](../index.md) / [kotlin](index.md) / [toList](toList.md)

# toList
Returns a List containing all elements
```
public fun CharArray.toList(): List<Char>
public fun LongArray.toList(): List<Long>
public fun ShortArray.toList(): List<Short>
public fun <T> Iterable<T>.toList(): List<T>
public fun BooleanArray.toList(): List<Boolean>
public fun <T> Array<T>.toList(): List<T>
public fun String.toList(): List<Char>
public fun ByteArray.toList(): List<Byte>
public fun IntArray.toList(): List<Int>
public fun <T> Stream<T>.toList(): List<T>
public fun DoubleArray.toList(): List<Double>
public fun FloatArray.toList(): List<Float>
```
Returns a list containing the elements returned by the
```
fun <T> Enumeration<T>.toList(): List<T>
```
Returns a List containing all key-value pairs
```
public fun <K, V> Map<K, V>.toList(): List<Entry<K, V>>
```
Copies all elements into a [[List]]
```
public fun <T> Iterator<T>.toList(): List<T>
```
## Description
```
fun <T> Enumeration<T>.toList(): List<T>
```
specified enumeration in the order they are returned by the
enumeration.

