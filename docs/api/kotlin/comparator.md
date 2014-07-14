---
layout: api
title: comparator
---
[stdlib](../index.html) / [kotlin](index.html) / [comparator](comparator.html)

# comparator
Creates a comparator using the sequence of functions used to calculate a value to compare on
```
public fun <T> comparator(functions: Array<T.()->Comparable<Any>>): Comparator<T>
public fun <T> comparator(fn: (T, T)->Int): Comparator<T>
```
