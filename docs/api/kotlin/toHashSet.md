---
layout: api
title: toHashSet
---
[stdlib](../index.html) / [kotlin](index.html) / [toHashSet](toHashSet.html)

# toHashSet
Returns a HashSet of all elements
```
public fun <T> Iterable<T>.toHashSet(): HashSet<T>
public fun BooleanArray.toHashSet(): HashSet<Boolean>
public fun <T> Stream<T>.toHashSet(): HashSet<T>
public fun LongArray.toHashSet(): HashSet<Long>
public fun DoubleArray.toHashSet(): HashSet<Double>
public fun ShortArray.toHashSet(): HashSet<Short>
public fun CharArray.toHashSet(): HashSet<Char>
public fun <T> Array<T>.toHashSet(): HashSet<T>
public fun IntArray.toHashSet(): HashSet<Int>
public fun FloatArray.toHashSet(): HashSet<Float>
public fun String.toHashSet(): HashSet<Char>
public fun ByteArray.toHashSet(): HashSet<Byte>
```
Copies all elements into a [[HashSet]]
```
public fun <T> Iterator<T>.toHashSet(): HashSet<T>
```
