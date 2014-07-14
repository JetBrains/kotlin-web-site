---
layout: api
title: zip
---
[stdlib](../index.html) / [kotlin](index.html) / [zip](zip.html)

# zip
Returns a list of pairs built from elements of both collections with same indexes. List has length of shortest collection.
```
public fun <R> IntArray.zip(other: Iterable<R>): List<Pair<Int, R>>
public fun <T, R> Iterable<T>.zip(other: Iterable<R>): List<Pair<T, R>>
public fun <R> DoubleArray.zip(other: Iterable<R>): List<Pair<Double, R>>
public fun <T, R> Array<T>.zip(other: Iterable<R>): List<Pair<T, R>>
public fun <R> LongArray.zip(array: Array<R>): List<Pair<Long, R>>
public fun <R> ShortArray.zip(array: Array<R>): List<Pair<Short, R>>
public fun <R> ByteArray.zip(other: Iterable<R>): List<Pair<Byte, R>>
public fun <R> ByteArray.zip(array: Array<R>): List<Pair<Byte, R>>
public fun <R> FloatArray.zip(other: Iterable<R>): List<Pair<Float, R>>
public fun <R> ShortArray.zip(other: Iterable<R>): List<Pair<Short, R>>
public fun <R> IntArray.zip(array: Array<R>): List<Pair<Int, R>>
public fun <R> BooleanArray.zip(array: Array<R>): List<Pair<Boolean, R>>
public fun <R> String.zip(other: Iterable<R>): List<Pair<Char, R>>
public fun <R> DoubleArray.zip(array: Array<R>): List<Pair<Double, R>>
public fun <R> CharArray.zip(array: Array<R>): List<Pair<Char, R>>
public fun <T, R> Iterable<T>.zip(array: Array<R>): List<Pair<T, R>>
public fun <T, R> Array<T>.zip(array: Array<R>): List<Pair<T, R>>
public fun <R> BooleanArray.zip(other: Iterable<R>): List<Pair<Boolean, R>>
public fun <R> LongArray.zip(other: Iterable<R>): List<Pair<Long, R>>
public fun <R> String.zip(array: Array<R>): List<Pair<Char, R>>
public fun <R> FloatArray.zip(array: Array<R>): List<Pair<Float, R>>
public fun <R> CharArray.zip(other: Iterable<R>): List<Pair<Char, R>>
```
Returns an iterator whose values are pairs composed of values produced by given pair of iterators
```
public fun <T, S> Iterator<T>.zip(iterator: Iterator<S>): Iterator<Pair<T, S>>
```
Returns a list of pairs built from characters of both strings with same indexes. List has length of shortest collection.
```
public fun String.zip(other: String): List<Pair<Char, Char>>
```
Returns a stream of pairs built from elements of both collections with same indexes. Stream has length of shortest stream.
```
public fun <T, R> Stream<T>.zip(stream: Stream<R>): Stream<Pair<T, R>>
```
