---
layout: api
title: stream
---
[stdlib](../index.html) / [kotlin](index.html) / [stream](stream.html)

# stream
Returns a stream from the given collection
```
public fun CharArray.stream(): Stream<Char>
public fun DoubleArray.stream(): Stream<Double>
public fun LongArray.stream(): Stream<Long>
public fun FloatArray.stream(): Stream<Float>
public fun ByteArray.stream(): Stream<Byte>
public fun <T> Iterable<T>.stream(): Stream<T>
public fun BooleanArray.stream(): Stream<Boolean>
public fun String.stream(): Stream<Char>
public fun IntArray.stream(): Stream<Int>
public fun ShortArray.stream(): Stream<Short>
public fun <T> Stream<T>.stream(): Stream<T>
public fun <T> Array<T>.stream(): Stream<T>
```
Returns a stream which invokes the function to calculate the next value based on the previous one on each iteration
```
public fun <T : T> stream(initialValue: T, nextFunction: (T)->T): Stream<T>
```
Returns a stream which invokes the function to calculate the next value on each iteration until the function returns *null*
```
public fun <T : T> stream(nextFunction: ()->T): Stream<T>
```
## Description
```
public fun <T : T> stream(initialValue: T, nextFunction: (T)->T): Stream<T>
```
until the function returns *null*

