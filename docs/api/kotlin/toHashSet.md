---
layout: api
title: toHashSet
---
[stdlib](../index.md) / [kotlin](index.md) / [toHashSet](toHashSet.md)

# toHashSet
Returns a HashSet of all elements
```
public fun ByteArray.toHashSet(): HashSet<Byte>
public fun LongArray.toHashSet(): HashSet<Long>
public fun FloatArray.toHashSet(): HashSet<Float>
public fun IntArray.toHashSet(): HashSet<Int>
public fun BooleanArray.toHashSet(): HashSet<Boolean>
public fun ShortArray.toHashSet(): HashSet<Short>
public fun CharArray.toHashSet(): HashSet<Char>
public fun DoubleArray.toHashSet(): HashSet<Double>
public fun String.toHashSet(): HashSet<Char>
public fun <T> Array<T>.toHashSet(): HashSet<T>
public fun <T> Iterable<T>.toHashSet(): HashSet<T>
public fun <T> Stream<T>.toHashSet(): HashSet<T>
```
Copies all elements into a [[HashSet]]
```
public fun <T> Iterator<T>.toHashSet(): HashSet<T>
```
