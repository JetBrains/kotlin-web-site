---
layout: api
title: filterNotNull
---
[stdlib](../index.md) / [kotlin](index.md) / [filterNotNull](filterNotNull.md)

# filterNotNull
Returns a list containing all elements that are not null
```
public fun <T : T> Iterable<T>.filterNotNull(): List<T>
public fun <T : T> Array<T>.filterNotNull(): List<T>
```
Returns a stream containing all elements that are not null
```
public fun <T : T> Stream<T>.filterNotNull(): Stream<T>
```
Returns an iterator over non-*null* elements
```
public fun <T : T> Iterator<T>.filterNotNull(): Iterator<T>
```
