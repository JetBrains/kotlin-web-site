---
layout: api
title: drop
---
[stdlib](../index.html) / [kotlin](index.html) / [drop](drop.html)

# drop
Returns a list containing all elements except first *n* elements
```
public fun ShortArray.drop(n: Int): List<Short>
public fun DoubleArray.drop(n: Int): List<Double>
public fun <T> Array<T>.drop(n: Int): List<T>
public fun String.drop(n: Int): String
public fun <T> Iterable<T>.drop(n: Int): List<T>
public fun LongArray.drop(n: Int): List<Long>
public fun FloatArray.drop(n: Int): List<Float>
public fun <T> Collection<T>.drop(n: Int): List<T>
public fun BooleanArray.drop(n: Int): List<Boolean>
public fun ByteArray.drop(n: Int): List<Byte>
public fun IntArray.drop(n: Int): List<Int>
public fun CharArray.drop(n: Int): List<Char>
```
Returns a list containing everything but the first *n* elements
```
public fun <T> Iterator<T>.drop(n: Int): List<T>
```
Returns a stream containing all elements except first *n* elements
```
public fun <T> Stream<T>.drop(n: Int): Stream<T>
```
