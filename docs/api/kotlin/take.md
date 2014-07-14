---
layout: api
title: take
---
[stdlib](../index.html) / [kotlin](index.html) / [take](take.html)

# take
Returns a stream containing first *n* elements
```
public fun <T> Stream<T>.take(n: Int): Stream<T>
```
Returns a list containing first *n* elements
```
public fun <T> Iterable<T>.take(n: Int): List<T>
public fun BooleanArray.take(n: Int): List<Boolean>
public fun ShortArray.take(n: Int): List<Short>
public fun FloatArray.take(n: Int): List<Float>
public fun IntArray.take(n: Int): List<Int>
public fun <T> Collection<T>.take(n: Int): List<T>
public fun CharArray.take(n: Int): List<Char>
public fun DoubleArray.take(n: Int): List<Double>
public fun ByteArray.take(n: Int): List<Byte>
public fun LongArray.take(n: Int): List<Long>
public fun <T> Array<T>.take(n: Int): List<T>
public fun String.take(n: Int): String
```
Returns an iterator restricted to the first *n* elements
```
public fun <T> Iterator<T>.take(n: Int): Iterator<T>
```
