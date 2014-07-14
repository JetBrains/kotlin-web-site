---
layout: api
title: withIndices
---
[stdlib](../index.html) / [kotlin](index.html) / [withIndices](withIndices.html)

# withIndices
Returns a list containing pairs of each element of the original collection and their index
```
public fun BooleanArray.withIndices(): List<Pair<Int, Boolean>>
public fun LongArray.withIndices(): List<Pair<Int, Long>>
public fun String.withIndices(): List<Pair<Int, Char>>
public fun ShortArray.withIndices(): List<Pair<Int, Short>>
public fun <T> Iterable<T>.withIndices(): List<Pair<Int, T>>
public fun DoubleArray.withIndices(): List<Pair<Int, Double>>
public fun CharArray.withIndices(): List<Pair<Int, Char>>
public fun FloatArray.withIndices(): List<Pair<Int, Float>>
public fun ByteArray.withIndices(): List<Pair<Int, Byte>>
public fun <T> Array<T>.withIndices(): List<Pair<Int, T>>
public fun IntArray.withIndices(): List<Pair<Int, Int>>
```
Returns an iterator of Pairs(index, data)
```
public fun <T> Iterator<T>.withIndices(): Iterator<Pair<Int, T>>
```
Returns a stream containing pairs of each element of the original collection and their index
```
public fun <T> Stream<T>.withIndices(): Stream<Pair<Int, T>>
```
