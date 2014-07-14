---
layout: api
title: iterate
---
[stdlib](../index.md) / [kotlin](index.md) / [iterate](iterate.md)

# iterate
Returns an iterator which invokes the function to calculate the next value on each iteration until the function returns *null*
```
public fun <T : T> iterate(nextFunction: ()->T): Iterator<T>
```
Returns an iterator which invokes the function to calculate the next value based on the previous one on each iteration
```
public fun <T : T> iterate(initialValue: T, nextFunction: (T)->T): Iterator<T>
```
## Description
```
public fun <T : T> iterate(initialValue: T, nextFunction: (T)->T): Iterator<T>
```
until the function returns *null*

