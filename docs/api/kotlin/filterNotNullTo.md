---
layout: api
title: filterNotNullTo
---
[stdlib](../index.md) / [kotlin](index.md) / [filterNotNullTo](filterNotNullTo.md)

# filterNotNullTo
Filters all non-*null* elements into the given list
```
public fun <T : T, C : C> Iterator<T>.filterNotNullTo(result: C): C
```
Appends all elements that are not null to the given *destination*
```
public fun <C : C, T : T> Array<T>.filterNotNullTo(destination: C): C
public fun <C : C, T : T> Iterable<T>.filterNotNullTo(destination: C): C
public fun <C : C, T : T> Stream<T>.filterNotNullTo(destination: C): C
```
