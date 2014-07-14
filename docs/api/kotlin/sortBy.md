---
layout: api
title: sortBy
---
[stdlib](../index.html) / [kotlin](index.html) / [sortBy](sortBy.html)

# sortBy
Copies all elements into a [[List]] and sorts it by value of compare_function(element)
```
public fun <T, R : R> Iterator<T>.sortBy(f: (T)->R): List<T>
```
Returns a list of all elements, sorted by the specified *comparator*
```
public fun <T> Iterable<T>.sortBy(comparator: Comparator<T>): List<T>
public fun <T> Array<T>.sortBy(comparator: Comparator<T>): List<T>
```
Returns a sorted list of all elements, ordered by results of specified *order* function.
```
public fun <T, R : R> Iterable<T>.sortBy(order: (T)->R): List<T>
public fun <T, R : R> Array<T>.sortBy(order: (T)->R): List<T>
```
## Description
```
public fun <T, R : R> Iterator<T>.sortBy(f: (T)->R): List<T>
```
E.g. arrayList("two" to 2, "one" to 1).sortBy({it.second}) returns list sorted by second element of pair

