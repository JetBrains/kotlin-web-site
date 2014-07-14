---
layout: api
title: mapNotNullTo
---
[stdlib](../index.md) / [kotlin](index.md) / [mapNotNullTo](mapNotNullTo.md)

# mapNotNullTo
Appends transformed non-null elements of original collection using the given *transform* function
```
public fun <T : T, R, C : C> Array<T>.mapNotNullTo(destination: C, transform: (T)->R): C
public fun <T : T, R, C : C> Stream<T>.mapNotNullTo(destination: C, transform: (T)->R): C
public fun <T : T, R, C : C> Iterable<T>.mapNotNullTo(destination: C, transform: (T)->R): C
```
## Description
```
public fun <T : T, R, C : C> Array<T>.mapNotNullTo(destination: C, transform: (T)->R): C
```
to the given *destination*

```
public fun <T : T, R, C : C> Stream<T>.mapNotNullTo(destination: C, transform: (T)->R): C
```
to the given *destination*

```
public fun <T : T, R, C : C> Iterable<T>.mapNotNullTo(destination: C, transform: (T)->R): C
```
to the given *destination*

