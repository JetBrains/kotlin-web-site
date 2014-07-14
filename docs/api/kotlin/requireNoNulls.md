---
layout: api
title: requireNoNulls
---
[stdlib](../index.html) / [kotlin](index.html) / [requireNoNulls](requireNoNulls.html)

# requireNoNulls
Returns a original Iterable containing all the non-*null* elements, throwing an [[IllegalArgumentException]] if there are any null elements
```
public fun <T : T> Iterator<T>.requireNoNulls(): Iterator<T>
```
Returns an original collection containing all the non-*null* elements, throwing an [[IllegalArgumentException]] if there are any null elements
```
public fun <T : T> List<T>.requireNoNulls(): List<T>
public fun <T : T> Array<T>.requireNoNulls(): Array<T>
public fun <T : T> Iterable<T>.requireNoNulls(): Iterable<T>
public fun <T : T> Stream<T>.requireNoNulls(): Stream<T>
```
