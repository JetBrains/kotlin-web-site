---
layout: api
title: comparator
---
[stdlib](../index.md) / [kotlin](index.md) / [comparator](comparator.md)

# comparator
Creates a comparator using the sequence of functions used to calculate a value to compare on
```
public fun <T> comparator(functions: Array<T.()->Comparable<Any>>): Comparator<T>
public fun <T> comparator(fn: (T, T)->Int): Comparator<T>
```
