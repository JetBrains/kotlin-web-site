---
layout: api
title: dropWhile
---
[stdlib](../index.md) / [kotlin](index.md) / [dropWhile](dropWhile.md)

# dropWhile
Returns a list containing all elements except first elements that satisfy the given *predicate*
```
public fun <T> Iterable<T>.dropWhile(predicate: (T)->Boolean): List<T>
public fun IntArray.dropWhile(predicate: (Int)->Boolean): List<Int>
public fun ByteArray.dropWhile(predicate: (Byte)->Boolean): List<Byte>
public fun String.dropWhile(predicate: (Char)->Boolean): String
public fun LongArray.dropWhile(predicate: (Long)->Boolean): List<Long>
public fun ShortArray.dropWhile(predicate: (Short)->Boolean): List<Short>
public fun <T> Array<T>.dropWhile(predicate: (T)->Boolean): List<T>
public fun BooleanArray.dropWhile(predicate: (Boolean)->Boolean): List<Boolean>
public fun FloatArray.dropWhile(predicate: (Float)->Boolean): List<Float>
public fun CharArray.dropWhile(predicate: (Char)->Boolean): List<Char>
public fun DoubleArray.dropWhile(predicate: (Double)->Boolean): List<Double>
```
Returns a list containing the everything but the first elements that satisfy the given *predicate*
```
public fun <T> Iterator<T>.dropWhile(predicate: (T)->Boolean): List<T>
```
Returns a stream containing all elements except first elements that satisfy the given *predicate*
```
public fun <T> Stream<T>.dropWhile(predicate: (T)->Boolean): Stream<T>
```
