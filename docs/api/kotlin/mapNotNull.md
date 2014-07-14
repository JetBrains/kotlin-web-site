---
layout: api
title: mapNotNull
---
[stdlib](../index.md) / [kotlin](index.md) / [mapNotNull](mapNotNull.md)

# mapNotNull
Returns a stream containing the results of applying the given *transform* function to each non-null element of the original stream
```
public fun <T : T, R> Stream<T>.mapNotNull(transform: (T)->R): Stream<R>
```
Returns a list containing the results of applying the given *transform* function to each non-null element of the original collection
```
public fun <T : T, R> Array<T>.mapNotNull(transform: (T)->R): List<R>
public fun <T : T, R> Iterable<T>.mapNotNull(transform: (T)->R): List<R>
```
