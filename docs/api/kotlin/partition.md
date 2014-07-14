---
layout: api
title: partition
---
[stdlib](../index.md) / [kotlin](index.md) / [partition](partition.md)

# partition
Splits original collection into pair of collections,
```
public fun String.partition(predicate: (Char)->Boolean): Pair<String, String>
public fun CharArray.partition(predicate: (Char)->Boolean): Pair<List<Char>, List<Char>>
public fun <T> Stream<T>.partition(predicate: (T)->Boolean): Pair<List<T>, List<T>>
public fun ByteArray.partition(predicate: (Byte)->Boolean): Pair<List<Byte>, List<Byte>>
public fun <T> Array<T>.partition(predicate: (T)->Boolean): Pair<List<T>, List<T>>
public fun <T> Iterable<T>.partition(predicate: (T)->Boolean): Pair<List<T>, List<T>>
public fun FloatArray.partition(predicate: (Float)->Boolean): Pair<List<Float>, List<Float>>
public fun IntArray.partition(predicate: (Int)->Boolean): Pair<List<Int>, List<Int>>
public fun ShortArray.partition(predicate: (Short)->Boolean): Pair<List<Short>, List<Short>>
public fun BooleanArray.partition(predicate: (Boolean)->Boolean): Pair<List<Boolean>, List<Boolean>>
public fun LongArray.partition(predicate: (Long)->Boolean): Pair<List<Long>, List<Long>>
public fun DoubleArray.partition(predicate: (Double)->Boolean): Pair<List<Double>, List<Double>>
```
Partitions this collection into a pair of collections
```
public fun <T> Iterator<T>.partition(predicate: (T)->Boolean): Pair<List<T>, List<T>>
```
## Description
```
public fun String.partition(predicate: (Char)->Boolean): Pair<String, String>
```
where *first* collection contains elements for which predicate yielded *true*,
while *second* collection contains elements for which predicate yielded *false*

```
public fun CharArray.partition(predicate: (Char)->Boolean): Pair<List<Char>, List<Char>>
```
where *first* collection contains elements for which predicate yielded *true*,
while *second* collection contains elements for which predicate yielded *false*

```
public fun <T> Stream<T>.partition(predicate: (T)->Boolean): Pair<List<T>, List<T>>
```
where *first* collection contains elements for which predicate yielded *true*,
while *second* collection contains elements for which predicate yielded *false*

```
public fun ByteArray.partition(predicate: (Byte)->Boolean): Pair<List<Byte>, List<Byte>>
```
where *first* collection contains elements for which predicate yielded *true*,
while *second* collection contains elements for which predicate yielded *false*

```
public fun <T> Array<T>.partition(predicate: (T)->Boolean): Pair<List<T>, List<T>>
```
where *first* collection contains elements for which predicate yielded *true*,
while *second* collection contains elements for which predicate yielded *false*

```
public fun <T> Iterable<T>.partition(predicate: (T)->Boolean): Pair<List<T>, List<T>>
```
where *first* collection contains elements for which predicate yielded *true*,
while *second* collection contains elements for which predicate yielded *false*

```
public fun FloatArray.partition(predicate: (Float)->Boolean): Pair<List<Float>, List<Float>>
```
where *first* collection contains elements for which predicate yielded *true*,
while *second* collection contains elements for which predicate yielded *false*

```
public fun IntArray.partition(predicate: (Int)->Boolean): Pair<List<Int>, List<Int>>
```
where *first* collection contains elements for which predicate yielded *true*,
while *second* collection contains elements for which predicate yielded *false*

```
public fun ShortArray.partition(predicate: (Short)->Boolean): Pair<List<Short>, List<Short>>
```
where *first* collection contains elements for which predicate yielded *true*,
while *second* collection contains elements for which predicate yielded *false*

```
public fun BooleanArray.partition(predicate: (Boolean)->Boolean): Pair<List<Boolean>, List<Boolean>>
```
where *first* collection contains elements for which predicate yielded *true*,
while *second* collection contains elements for which predicate yielded *false*

```
public fun LongArray.partition(predicate: (Long)->Boolean): Pair<List<Long>, List<Long>>
```
where *first* collection contains elements for which predicate yielded *true*,
while *second* collection contains elements for which predicate yielded *false*

```
public fun DoubleArray.partition(predicate: (Double)->Boolean): Pair<List<Double>, List<Double>>
```
where *first* collection contains elements for which predicate yielded *true*,
while *second* collection contains elements for which predicate yielded *false*

