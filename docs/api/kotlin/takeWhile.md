---
layout: api
title: takeWhile
---
[stdlib](../index.md) / [kotlin](index.md) / [takeWhile](takeWhile.md)

# takeWhile
Returns a list containing first elements satisfying the given *predicate*
```
public fun IntArray.takeWhile(predicate: (Int)->Boolean): List<Int>
public fun CharArray.takeWhile(predicate: (Char)->Boolean): List<Char>
public fun LongArray.takeWhile(predicate: (Long)->Boolean): List<Long>
public fun DoubleArray.takeWhile(predicate: (Double)->Boolean): List<Double>
public fun ShortArray.takeWhile(predicate: (Short)->Boolean): List<Short>
public fun <T> Array<T>.takeWhile(predicate: (T)->Boolean): List<T>
public fun <T> Iterable<T>.takeWhile(predicate: (T)->Boolean): List<T>
public fun ByteArray.takeWhile(predicate: (Byte)->Boolean): List<Byte>
public fun String.takeWhile(predicate: (Char)->Boolean): String
public fun FloatArray.takeWhile(predicate: (Float)->Boolean): List<Float>
public fun BooleanArray.takeWhile(predicate: (Boolean)->Boolean): List<Boolean>
```
Returns a stream containing first elements satisfying the given *predicate*
```
public fun <T> Stream<T>.takeWhile(predicate: (T)->Boolean): Stream<T>
```
Returns an iterator restricted to the first elements that match the given *predicate*
```
public fun <T> Iterator<T>.takeWhile(predicate: (T)->Boolean): Iterator<T>
```
