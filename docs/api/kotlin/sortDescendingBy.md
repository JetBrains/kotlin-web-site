---
layout: api
title: sortDescendingBy
---
[stdlib](../index.html) / [kotlin](index.html) / [sortDescendingBy](sortDescendingBy.html)

# sortDescendingBy
Returns a sorted list of all elements, in descending order by results of specified *order* function.
```
public fun <T, R : R> Array<T>.sortDescendingBy(order: (T)->R): List<T>
public fun <T, R : R> Iterable<T>.sortDescendingBy(order: (T)->R): List<T>
```
