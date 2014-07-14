---
layout: api
title: filterIsInstance
---
[stdlib](../index.html) / [kotlin](index.html) / [filterIsInstance](filterIsInstance.html)

# filterIsInstance
Returns a list containing all elements that are instances of specified class
```
public fun <T, R : R> Iterable<T>.filterIsInstance(klass: Class<R>): List<R>
public fun <T, R : R> Array<T>.filterIsInstance(klass: Class<R>): List<R>
```
Returns a stream containing all elements that are instances of specified class
```
public fun <T, R : R> Stream<T>.filterIsInstance(klass: Class<R>): Stream<R>
```
Returns an iterator over elements that are instances of a given type *R* which is a subclass of *T*
```
public fun <T, R : R> Iterator<T>.filterIsInstance(klass: Class<R>): Iterator<R>
```
