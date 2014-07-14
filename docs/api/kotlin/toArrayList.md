---
layout: api
title: toArrayList
---
[stdlib](../index.md) / [kotlin](index.md) / [toArrayList](toArrayList.md)

# toArrayList
Returns an ArrayList of all elements
```
public fun <T> Stream<T>.toArrayList(): ArrayList<T>
public fun ByteArray.toArrayList(): ArrayList<Byte>
public fun IntArray.toArrayList(): ArrayList<Int>
public fun <T> Iterable<T>.toArrayList(): ArrayList<T>
public fun BooleanArray.toArrayList(): ArrayList<Boolean>
public fun <T> Array<T>.toArrayList(): ArrayList<T>
public fun LongArray.toArrayList(): ArrayList<Long>
public fun CharArray.toArrayList(): ArrayList<Char>
public fun String.toArrayList(): ArrayList<Char>
public fun ShortArray.toArrayList(): ArrayList<Short>
public fun DoubleArray.toArrayList(): ArrayList<Double>
public fun FloatArray.toArrayList(): ArrayList<Float>
```
Copies all elements into a [[ArrayList]]
```
public fun <T> Iterator<T>.toArrayList(): ArrayList<T>
```
